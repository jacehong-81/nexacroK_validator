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

if (nexacro._Browser != "Runtime" && !nexacro.Element)
{
    "use strict";
    var _process = true;

    //=============================================================================
    // Handle API : DOM Control
    //=============================================================================
    // basic div ????
    // handle._element_type
    // 0: normal type, 1: control, 2: container, 3: scrollable container
    // 4: text, 5: image, 6: AlignImage, 7: input, 8: plugin, 9:canvas, 10:step
    //=============================================================================

    nexacro.__createCanvasElementHandle = function (element, _doc, left, top, width, height)
    {
        var handle = _doc.createElement("canvas");
        var handle_style = handle.style;

        nexacro.__setDOMStyle_Pos(handle_style, left, top);
        nexacro.__setDOMStyle_Size(handle, width, height);

        handle._linked_element = element;
        handle._draw_ctx = handle.getContext("2d");
        return handle;
    };
    nexacro.__destroyCanvasElementHandle = function (_parent_handle, handle)
    {
        if (_parent_handle)
            _parent_handle.removeChild(handle);
        handle._draw_ctx = null;
        handle._linked_element = null;
    };

    //=============================================================================
    // Basic DOM Node Controll APIs : HTML only
    //=============================================================================
    nexacro.__setLastFocusedElement = function (elem)
    {
        // Save a last focused element to nexacro.Window
        if (elem)
        {
            var win = elem.linkedcontrol ? elem.linkedcontrol._getWindow() :
                (elem.parent_elem ? elem.parent_elem.linkedcontrol._getWindow() : null);
            if (win)
            {
                win._last_focused_elem = elem;
            }
        }
    };



    //======================================================================
    // START Element
    //======================================================================
    //======================================================================
    // XP14 Element
    // nexacro.Element - this is Simple Element has No Border && No background && No Container
    //======================================================================
    // This Element has No Event Handlers -- Container only
    // This Element has no border
    nexacro.Element = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "elem");
    };

    var _pElement = nexacro._createPrototype(nexacro.Object, nexacro.Element);
    nexacro.Element.prototype = _pElement;

    // overide nexacro.Object
    _pElement._type_name = "Element";

    //==== defaule values =========//
    _pElement._p_parent = null;
    _pElement.parent_elem = null;

    _pElement.id = "";
    _pElement.status = "";
    _pElement.userstatus = "";

    _pElement.left = 0;
    _pElement.top = 0;
    _pElement.width = 0;
    _pElement.height = 0;
    _pElement.visible = true;
    _pElement.rtl = undefined;

    //==== for Fluid Layout =========//
    _pElement.layouttype = "default";
    _pElement.layouthorizontalgap = undefined;
    _pElement.layoutverticalgap = undefined;
    _pElement.flexmainaxisalign = "";
    _pElement.flexcrossaxisalign = "";
    _pElement.flexcrossaxiswrapalign = "";
    _pElement.flexwrap = "";
    _pElement.tablecellalign = "";
    _pElement.tablecellincompalign = "";
    _pElement._tablecellhalign = "";
    _pElement._tablecellvalign = "";
    _pElement._tablecellincomphalign = "";
    _pElement._tablecellincompvalign = "";
    _pElement.tabletemplate = "";
    _pElement.tabletemplatearea = "";
    _pElement.tabledirection = "";
    _pElement.layoutspacing = "";
    _pElement._layoutspacing = null;

    _pElement._property_map_layoutalign = [
        ["start", "start"],
        ["center", "center"],
        ["end", "end"],
        ["spacebetween", "space-between"],
        ["spacearound", "space-around"],
        ["spaceevenly", "space-evenly"]
    ]
    //==== for common style =========//
    _pElement.color = null;
    _pElement.font = null;
    _pElement.textDecoration = null;
    _pElement.wordSpacing = null;
    _pElement.letterSpacing = null;
    _pElement.pointerEvent = "";
    _pElement.overflow = null;
    _pElement.clippath = null;
    //_pElement.wordWrap = null;

    //_pElement._wordwrap_info = "none";

    //==== internal handles =========//
    _pElement.handle = null;		// HTML DOM Element Handle
    _pElement.dest_handle = null;	// HTML DOM Element Handle -  for append/remove child handle
    _pElement.owner_elem = null;

    //==== default flags =========//
    _pElement._is_nc_element = false;
    _pElement._is_input_element = false;

    //==== css selector =========//
    _pElement.typeselector = "";
    _pElement.classselector = "";
    //_pElement._wordwrapselector = "";

    //==== end of initial =========//

    _pElement.clearContents = nexacro._emptyFn;

    // this _pElement.create function always overloded by inherited Element
    _pElement.create = function (win)
    {
        // parent is always control element
        var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle && !this.handle)
        {
            this.owner_elem = owner_elem;
            var _doc = win._doc || owner_elem._getRootWindowHandle();

            var handle = _doc.createElement("div");
            nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
            this.handle = handle;

            handle.id = this.name;
            handle._linked_element = this;
            //handle._element_type = 0;

            /////////////////////////////////
            var handle_style = handle.style;

            this._refreshCommonStyleProps(handle_style);

            /*
                       if (this.padding)
                           nexacro.__setDOMStyle_PaddingObject(handle_style, this.padding);

                       if (this.textDecoration)
                           nexacro.__setDOMStyle_TextDecorationObject(handle_style, this.textDecoration);
           */
            // append TO Parent Element
            nexacro.__appendDOMNode(this._is_nc_element ? owner_elem.handle : owner_elem.dest_handle, handle);
        }
    };

    _pElement.createCommand = function ()
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this.handle)
        {
            this.owner_elem = owner_elem;

            /////////////////////////////////
            var handle_style = this._getCommonStyleStr();

            // update Special Style
            /*
            if (this.padding)
                handle_style += nexacro.__getHTMLStyle_PaddingObject(this.padding);

            if (this.textDecoration)
                handle_style += nexacro.__getHTMLStyle_TextDecorationObject(this.textDecoration);
            */
            var str = "<div id='" + this.name + "' class='" + this._getElementClassName() + "'";
            str += (handle_style) ? (" style='" + handle_style + "'>") : ">";
            str += "</div>";
            return str;
        }
        return "";
    };

    _pElement.attachHandle = function (win)
    {
        if (this.name && !this.handle)
        {
            this.handle = win._doc.getElementById(this.name);
        }
    };


    _pElement._removeElementHandle = function ()
    {
        var handle = this.handle;
        var linked_control = this.linkedcontrol;
        if (linked_control && linked_control._is_main) // mainframe
            handle = this.dest_handle;
        if (handle)
        {
            var dest_handle;
            handle._linked_element = null;
            if (this._is_nc_element)
                dest_handle = (this.owner_elem ? this.owner_elem.handle : null);
            else
                dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
            nexacro.__removeDOMNode(dest_handle, handle);
        }
    };

    _pElement._destroyElementHandle = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            this._removeElementHandle();
            this.handle = null;
        }
    };

    _pElement.destroy = function ()
    {
        this._destroyElementHandle();
        this.owner_elem = null;
        this._p_parent = null;
        this.parent_elem = null;
    };

    _pElement.isInputElement = function ()
    {
        return this._is_input_element;
    };

    _pElement.stopSysEvent = function ()
    {
        this._event_stop = true;
    };

    /////////////////////////////////
    _pElement._appendToContainer = function (owner_elem)
    {
        var handle = this.handle;
        if (this.owner_elem == null)
        {
            this.owner_elem = owner_elem;
            if (handle && owner_elem.handle)
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
        }
    };

    _pElement._insertToContainer = function (owner_elem, before_elem)
    {
        var handle = this.handle;
        if (this.owner_elem == null)
        {
            this.owner_elem = owner_elem;
            if (handle && owner_elem.handle)
                nexacro.__insertDOMNode(owner_elem.dest_handle, handle, before_elem.handle);
        }
    };

    _pElement._removeFromContainer = function ()
    {
        var owner_elem = this.owner_elem;
        if (owner_elem)
        {
            this.owner_elem = null;
            var handle = this.handle;
            var linkedcontrol = this.linkedcontrol;
            if (linkedcontrol._findOwnerElementHandle)
            {
                var owner_elem_info = linkedcontrol._findOwnerElementHandle();
                if (owner_elem_info.is_append)
                {
                    if (owner_elem_info.ref_handle)
                        nexacro.__removeDOMNode(owner_elem_info.ref_handle, handle);
                    else
                        nexacro.__removeDOMNode(owner_elem_info.owner_handle, handle);
                }
            }
            else if (handle && owner_elem.handle)
            {
                if (this._is_nc_element)
                    nexacro.__unlinkDOMNode(owner_elem.handle, handle);
                else if (owner_elem.dest_handle != handle)
                    nexacro.__unlinkDOMNode(owner_elem.dest_handle, handle);
            }
        }
    };

    _pElement.getContainerElement = function ()
    {
        return this;
    };

    _pElement._getRootWindowHandle = function ()
    {
        if (this.owner_elem)
        {
            return this.owner_elem._getRootWindowHandle();
        }
        return null;
    };

    _pElement._isRtl = function (bPosition)
    {
        var elem = bPosition ? (this.parent_elem ? this.parent_elem : this.parent.getElement()) : this;
        //var rtl = this.rtl;
        while (elem)
        {
            if (elem.rtl !== undefined)
            {
                return elem.rtl;
            }
            if (elem.parent_elem)
                elem = elem.parent_elem;
            else
            {
                //elem = elem.parent_elem;
                elem = elem.parent;
            }
        }

        return nexacro.getEnvironment()?._rtl;
    };

    _pElement._isParentRtl = function ()
    {
        var elem = this.parent_elem ? this.parent_elem : (this.parent ? this.parent.getElement() : null);
        //var rtl = this.rtl;
        while (elem)
        {
            if (elem.rtl !== undefined)
            {
                return elem.rtl;
            }
            if (elem.parent_elem)
                elem = elem.parent_elem;
            else
            {
                //elem = elem.parent_elem;
                elem = elem.parent;
            }
        }
        return nexacro.getEnvironment()?._rtl;
    };

    _pElement._checkUpdateElementByRTL = function (handle, prop)
    {
        var ret = false;
        var bPositionRtl = this._isParentRtl();
        //var bRtl = this._isRtl();
        if (handle)
        {
            var handle_style = handle.style;
            if (typeof prop == "number")
            {
                if (!((handle_style.left == prop + "px") ^ bPositionRtl))
                {
                    ret = true;
                }
            }
            else
            {
                //var type_name = prop._type_name;
                //switch (type_name)
                //{
                //    case "BorderRadiusObject":
                //        break;
                //    case "BorderObject":
                //        {
                //            if (handle_style.left && !((handle_style.borderLeft == prop.left.value) ^ bRtl))
                //            {
                //                ret = true;
                //            }
                //        }
                //        break;
                //    case "BKGradientObject":
                //        break;
                //    case "MarginObject":
                //        break;
                //    case "PaddingObject":
                //        break;
                //    case "AlignObject":
                //        break;
                //    case "ShadowObject":
                //        break;
                //    case "UrlObject":
                //        break;
                //    default:
                //        break;
                //}
            }
        }
        return ret;
    };

    //-----------------------------------------------------------------------------
    // Fluid Layout
    //-----------------------------------------------------------------------------
    _pElement.setElementLayoutType = function (layouttype)
    {
        if (this.layouttype != layouttype)
        {
            this.layouttype = layouttype;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementLayoutType(layouttype);
            }
        }
    };

    _pElement.setElementLayoutFluidPos = function (visible)
    {
        var handle = this.handle;
        if (handle)
        {
            if (visible)
            {
                nexacro.__setDOMStyle_LayoutFluidPos(handle.style);
            }
            else
            {
                nexacro.__clearDOMStyle_LayoutFluidPos(handle.style);
            }
        }
    };

    _pElement.setElementLayoutHorizontalGap = function (layouthorizontalgap)
    {
        if (this.layouthorizontalgap != layouthorizontalgap)
        {
            this.layouthorizontalgap = layouthorizontalgap;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementLayoutHorizontalGap(layouthorizontalgap);
            }
        }
    };

    _pElement.setElementLayoutVerticalGap = function (layoutverticalgap)
    {
        if (this.layoutverticalgap != layoutverticalgap)
        {
            this.layoutverticalgap = layoutverticalgap;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementLayoutVerticalGap(layoutverticalgap);
            }
        }
    };

    _pElement.setElementFlexMainAxisAlign = function (flexmainaxisalign)
    {
        if (this.flexmainaxisalign != flexmainaxisalign)
        {
            this.flexmainaxisalign = flexmainaxisalign;
            flexmainaxisalign = this._getPropertyFlexAlign(flexmainaxisalign);

            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementFlexMainAxisAlign(flexmainaxisalign);
            }
        }
    };

    _pElement.setElementFlexCrossAxisAlign = function (flexcrossaxisalign)
    {
        if (this.flexcrossaxisalign != flexcrossaxisalign)
        {
            this.flexcrossaxisalign = flexcrossaxisalign;
            flexcrossaxisalign = this._getPropertyFlexAlign(flexcrossaxisalign);

            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementFlexCrossAxisAlign(flexcrossaxisalign);
            }
        }
    };

    _pElement.setElementFlexCrossAxisWrapAlign = function (flexcrossaxiswrapalign)
    {
        if (this.flexcrossaxiswrapalign != flexcrossaxiswrapalign)
        {
            this.flexcrossaxiswrapalign = flexcrossaxiswrapalign;
            flexcrossaxiswrapalign = this._getPropertyFlexAlign(flexcrossaxiswrapalign);

            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementFlexCrossAxisWrapAlign(flexcrossaxiswrapalign);
            }
        }
    };

    _pElement.setElementTableCellAlign = function (tablecellalign)
    {
        if (this.tablecellalign != tablecellalign)
        {
            this.tablecellalign = tablecellalign;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementTableCellAlign(tablecellalign);
            }
        }
    };

    _pElement.setElementTableCellinCompAlign = function (tablecellincompalign)
    {
        if (this.tablecellincompalign != tablecellincompalign)
        {
            this.tablecellincompalign = tablecellincompalign;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementTableCellinCompAlign(tablecellincompalign);
            }
        }
    };

    _pElement._getPropertyFlexAlign = function (name)
    {
        var arr = this._property_map_layoutalign;
        var len = arr.length;
        for (var i = 0; i < len; i++)
        {
            if (arr[i][0] == name)
            {
                return arr[i][1];
            }
        }

        return "start";
    };

    _pElement._parseLayoutCellAlign = function (tablealign)
    {
        if (tablealign && (typeof (tablealign) == "string"))
        {
            var val = tablealign.trim();
            if (val)
            {
                var valarr = val.split(/\s+/);
                var retarr = [];
                retarr[0] = this._getPropertyFlexAlign(valarr[0]);
                retarr[1] = this._getPropertyFlexAlign(valarr[1]);

                return retarr;
            }
        }
    };

    _pElement.setElementFlexWrap = function (flexwrap)
    {
        if (this.flexwrap != flexwrap)
        {
            this.flexwrap = flexwrap;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementFlexWrap(flexwrap);
            }
        }
    };

    _pElement.setElementFlexGrow = function (flexgrow)
    {
        if (this.flexgrow != flexgrow)
        {
            this.flexgrow = flexgrow;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexGrow(handle.style, flexgrow);
            }
        }
    };

    _pElement.setElementFlexShrink = function (flexshrink)
    {
        if (this.flexshrink != flexshrink)
        {
            this.flexshrink = flexshrink;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexShrink(handle.style, flexshrink);
            }
        }
    };

    _pElement.setElementTableTemplate = function (tabletemplate)
    {
        if (this.tabletemplate != tabletemplate)
        {

            this.tabletemplate = tabletemplate ? tabletemplate.split("*").join("fr") : "";
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementTableTemplate(this.tabletemplate);
            }
        }
    };

    _pElement.setElementTableTemplateArea = function (tabletemplatearea)
    {
        if (this.tabletemplatearea != tabletemplatearea)
        {
            this.tabletemplatearea = tabletemplatearea;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementTableTemplateArea(tabletemplatearea);
            }
        }
    };

    _pElement.setElementTableDirection = function (tabledirection)
    {
        if (this.tabledirection != tabledirection)
        {
            this.tabledirection = tabledirection;
            var client_elem = this._client_elem;

            if (client_elem)
            {
                client_elem._setElementTableDirection(tabledirection);
            }
        }
    };

    _pElement.setElementLayoutSpacing = function (layoutspacing)
    {
        this.layoutspacing = layoutspacing;
        if (layoutspacing)
        {
            if (this._layoutspacing == null || this._layoutspacing.value != layoutspacing)
            {
                var padding = nexacro.PaddingObject(layoutspacing);
                this._layoutspacing = this.layoutspacing = padding;
            }
        }
        else
        {
            if (this._layoutspacing)
            {
                this._layoutspacing = null;
            }
        }

        var client_elem = this._client_elem;

        if (client_elem)
        {
            client_elem._setElementLayoutSpacing(this._layoutspacing);
        }
    };

    //_pElement._style_left;
    //_pElement._style_top;
    _pElement.setElementPosition = function (left, top, bforce)
    {
        var handle = this.handle;

        //var bUpdate = false;//this._checkUpdateElementByRTL(handle, left);

        if (this.left != left || this.top != top || /*bUpdate ||*/ bforce)
        {
            this.left = left;
            this.top = top;

            if (handle)
            {
                var bPositionRtl = this._isParentRtl();
                if (this._use_translate_move)
                {
                    if (this._style_left == undefined || this._style_top == undefined)
                    {
                        this._style_left = (handle.style.left) ? parseInt(handle.style.left) : 0;
                        this._style_top = (handle.style.top) ? parseInt(handle.style.top) : 0;
                    }

                    var translate_left = left;
                    var translate_top = top;
                    var style_left = this._style_left;
                    var style_top = this._style_top;

                    if (nexacro._Browser_Transform3d > 0)
                    {
                        translate_left -= style_left;
                        translate_top -= style_top;
                    }

                    if (translate_left || translate_top)
                        nexacro.__setDOMStyle_Translate(handle.style, translate_left, translate_top, bPositionRtl);
                    else
                        nexacro.__clearDOMStyle_Translate(handle.style);
                }
                else
                {
                    var control = this.linkedcontrol;
                    if (control)
                    {
                        if (control._isFluidContainer(true))
                        {
                            if (control._isFluidContainerCalculation() || control._is_trackpopup)
                            {
                                nexacro.__setDOMStyle_Pos(handle.style, left, top, bPositionRtl);
                            }
                        }
                        else
                        {
                            nexacro.__setDOMStyle_Pos(handle.style, left, top, bPositionRtl);
                        }
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Pos(handle.style, left, top, bPositionRtl);
                    }
                }
            }
        }
    };

    _pElement._forceApplyPosTop = function (top)
    {
        if (this.top != top)
        {
            var handle = this.handle;
            if (handle)
                nexacro.__setDOMStyle_Pos(handle.style, null, top, this._isParentRtl());
        }
    };

    _pElement._forceApplyPosLeft = function ()
    {
        if (this.left)
        {
            var handle = this.handle;
            if (handle)
                nexacro.__setDOMStyle_Pos(handle.style, this.left, null, this._isParentRtl());
        }
    };
    _pElement.setElementPopOver = function ()
    {
        const handle = this.handle;
        if (/*nexacro.ismodule &&*/ (this._is_popup || this._is_modaloverlay))
        {
            if (handle)
                nexacro.__setDomNode_PopOver(handle);
        }

    };
    _pElement._togglePopOver = function ()
    {
        const handle = this.handle;
        if (/*nexacro.ismodule &&*/ (this._is_popup || this._is_modaloverlay))
        {
            if (handle)
                nexacro.__actionDomNode_TogglePopOver(handle);
        }
    };
    _pElement._showPopOver = function ()
    {
        const handle = this.handle;
        if (/*nexacro.ismodule &&*/ (this._is_popup || this._is_modaloverlay))
        {
            if (handle)
                nexacro.__actionDomNode_ShowPopOver(handle);
        }
    };
    _pElement._hidePopOver = function ()
    {
        const handle = this.handle;
        if (/*nexacro.ismodule &&*/ (this._is_popup || this._is_modaloverlay))
        {
            if (handle)
                nexacro.__actionDomNode_HidePopOver(handle);
        }
    };
    _pElement.setElementSize = function (width, height)
    {
        if (this.width != width || this.height != height)
        {
            this.width = width;
            this.height = height;

            if (width < 0) width = 0;
            if (height < 0) height = 0;

            var handle = this.handle;
            if (handle)
            {
                if (width && height)
                    nexacro.__setDOMStyle_Size(handle.style, width, height);
                else
                    nexacro.__clearDOMStyle_Size(handle.style);
            }
        }
    };

    if (nexacro._OS == "Android")    //RP 40313
    {
        _pElement.setElementVisible = function (visible)
        {
            if (this.visible != visible)
            {
                this.visible = visible;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setDOMStyle_Visible(handle.style, visible);

                    if (this.visible)
                    {
                        var v = this.zindex;
                        if (!v || v < 0)
                            v = "";
                        nexacro.__setDOMStyle_Zindex(handle.style, v);
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Zindex(handle.style, nexacro._zindex_hide);
                    }
                }
            }
        };
    }
    else
    {
        _pElement.setElementVisible = function (visible)
        {
            if (this.visible != visible)
            {
                this.visible = visible;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setDOMStyle_Visible(handle.style, visible);
                }
            }
        };
    }

    _pElement.setElementRtl = function (rtl)
    {
        if (this.rtl != rtl)
        {
            this.rtl = rtl;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_Direction(handle.style, rtl);
            }
        }
    };

    _pElement.setElementTypeCSSSelector = function (typename)
    {
        if (this.typeselector != typename)
        {
            this.typeselector = typename;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
            }
        }
    };

    _pElement.setElementClassCSSSelector = function (classname)
    {
        if (this.classselector != classname)
        {
            this.classselector = classname;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
            }
        }
    };

    //controlelement에서는 적용안됨
    //inputelement, textelement, icontext, 
    _pElement.setElementTextAlignByClassCSSSelector = function (textalign)
    {
        var classselector = "nexacenteralign";
        /*if (this._isRtl())
        {
            if (textalign == "left")
                classselector = "nexarightalign";
            else if (textalign == "right")
                classselector = "nexaleftalign";
        }
        else*/
        {
            if (textalign == "left")
                classselector = "nexaleftalign";
            else if (textalign == "right")
                classselector = "nexarightalign";
        }

        this.setElementClassCSSSelector(classselector);
    };

    //Button Button_cssclass btn1
    _pElement._getElementClassName = function (tagname)
    {
        let classname = "";
        classname += this._getElementNativeClassName(tagname);
        classname += this.typeselector;

        if (this.rtl)
        {
            classname += " nexartl";
        }

        if (this.classselector)
        {
            classname += " " + this.classselector;
        }
        return classname;
    };

    _pElement._getElementNexaClassName = function (type, id, tagname)
    {
        let classname = "";
        classname += this._getElementNativeClassName(tagname);
        classname += type;
        if (this._isRtl(true)) classname += " nexartl";
        if (id)
        {
            classname += " " + id;
            //       if (this._isRtl(true)) classname += "nexartl";
        }

        return classname;
    };

    _pElement._getElementNativeClassName = function (tagname)
    {
        const controltags = ["div", "header", "nav", "section", "article", "aside", "footer"];
        let classname = "";

        if (tagname == undefined) // default native tag
            tagname = this.handle? this.handle.tagName.toLowerCase() : "div";
        
        if (controltags.includes(tagname))
            classname += "htmlcontrol ";
        else
            classname += "html" + tagname + " ";

        return classname;
    };

    _pElement.setElementStatus = function (status)
    {
        if (this.status != status)
        {
            //trace("name:"+ this.name + " status:" + status + " this.status :" + this.status);
            this.status = status;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNode_Status(handle, status);
            }
        }
    };

    _pElement.setElementUserStatus = function (userstatus)
    {
        if (this.userstatus != userstatus)
        {
            this.userstatus = userstatus;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNode_UserStatus(handle, userstatus);
            }
        }
    };

    _pElement._getWindow = function ()
    {
        return this.linkedcontrol._getWindow();
    };

    // style property - Common
    // font like -- inhereted to Child / from Parent
    _pElement.setElementColor = function (color)
    {
        if (this.color != color)
        {
            this.color = color;
            if (this.handle)
            {
                nexacro.__setDOMStyle_ColorObject(this.handle.style, color);
            }
        }
    };

    _pElement.setElementFont = function (font)
    {
        if (this.font != font)
        {
            this.font = font;
            if (this.handle)
            {
                nexacro.__setDOMStyle_FontObject(this.handle.style, font);
            }
        }
    };

    _pElement.setElementTextDecoration = function (decoration)
    {
        if (this.textDecoration != decoration)
        {
            this.textDecoration = decoration;
            if (this.handle)
            {
                nexacro.__setDOMStyle_TextDecorationObject(this.handle.style, decoration);
            }
        }
    };

    _pElement.setElementWordSpacing = function (wordspacing)
    {
        if (this.wordSpacing != wordspacing)
        {
            this.wordSpacing = wordspacing;
            if (this.handle)
            {
                nexacro.__setDOMStyle_WordSpacingObject(this.handle.style, wordspacing);
            }
        }
    };

    _pElement.setElementLetterSpacing = function (letterspacing)
    {
        if (this.letterSpacing != letterspacing)
        {
            this.letterSpacing = letterspacing;
            if (this.handle)
            {
                nexacro.__setDOMStyle_LetterSpacingObject(this.handle.style, letterspacing);
            }
        }
    };

    _pElement.setElementClipPath = function (clippath)
    {
        if (this.clippath != clippath)
        {
            this.clippath = clippath;
            if (this.handle)
            {
                nexacro.__setDOMStyle_Clippath(this.handle.style, clippath);
            }
        }
    };

    _pElement.setElementOverflow = function (overflow)
    {
        if (this.overflow != overflow)
        {
            this.overflow = overflow;
            if (this.handle)
            {
                nexacro.__setDOMStyle_Overflow(this.handle.style, overflow);
            }
        }
    };
    /*
    _pElement.setElementWordWrap = function (wordwrap)
    {
        // this prop is css set --> use class selector
        if (this.wordWrap != wordwrap)
        {
            this.wordWrap = wordwrap;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNodeStyle_WordWrap(handle.style, wordwrap);
            }
        }
    };
    */

    _pElement.setElementPointerEvents = function (pointerevent)
    {
        if (this.pointerEvent != pointerevent)
        {
            this.pointerEvent = pointerevent;
            var handle = this.handle;
            if (handle)
                nexacro.__setDOMNodeStylePointerEvents(handle.style, pointerevent);
        }
    };

    _pElement._refreshCommonStyleProps = function (handle_style, no_size)
    {
        var bPositionRtl = this._isParentRtl();

        if (!this.visible)
            nexacro.__setDOMStyle_Visible(handle_style, false);

        if (this.display == "none")
            nexacro.__setDOMStyle_Display(handle_style, "none");

        var control = this.linkedcontrol;
        if (this._use_translate_move)
        {
            nexacro.__setDOMStyle_Pos(handle_style, 0, 0, bPositionRtl);
            nexacro.__setDOMStyle_Translate(handle_style, this.left, this.top, this.rtl);
        }
        else
        {
            if (control && !control._is_form && !control._is_frame)
            {
                if (control._isFluidContainer(true))
                {
                    if (control._isFluidContainer() && control._isFluidContainerCalculation())
                    {
                        nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                    }
                }
                else
                {
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                }
            }
            else
            {
                nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
            }
        }

        if (!no_size && !(control && control._is_frame && (control._isMainFrameBody() && !nexacro._allow_default_pinchzoom)))   //if it is not mainframe
        {
            if (this.width && this.height)
                nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);
        }

        // system font synchronize with mainframe or popupframe
        if (control && (control._isMainFrame() || control._is_popup_frame))
        {
            var root_font = this.font ? this.font : control._getReferenceAbsoluteFont();
            if (root_font && this.handle.parentElement)
            {
                var system_style = this.handle.parentElement.style;
                if (system_style)
                {
                    nexacro.__setDOMStyle_FontObject(system_style, root_font);
                }
            }
        }

        // update Element's properties to DOM
        if (this.color)
            nexacro.__setDOMStyle_ColorObject(handle_style, this.color);
        if (this.font)
            nexacro.__setDOMStyle_FontObject(handle_style, this.font);
        if (this.wordSpacing)
            nexacro.__setDOMStyle_WordSpacingObject(handle_style, this.wordSpacing);
        if (this.letterSpacing)
            nexacro.__setDOMStyle_LetterSpacingObject(handle_style, this.letterSpacing);
        if (this.textDecoration)
            nexacro.__setDOMStyle_TextDecorationObject(handle_style, this.textDecoration);
        if (this.overflow)
            nexacro.__setDOMStyle_Overflow(handle_style, this.overflow);
        if (this.clippath)
            nexacro.__setDOMStyle_Clippath(handle_style, this.clippath);

        if (this.rtl !== undefined)
            nexacro.__setDOMStyle_Direction(handle_style, this.rtl);
        if (this.wordWrap)
            nexacro.__setDOMStyle_WordWrap(handle_style, this.wordWrap);

        if (this.pointerEvent)
            nexacro.__setDOMNodeStylePointerEvents(handle_style, this.pointerEvent);
    };

    _pElement._getCommonStyleStr = function (no_size)
    {
        var str = "";

        var bPositionRtl = this._isParentRtl();

        if (!this.visible)
            str += nexacro.__getHTMLStyle_Visible(false);
        if (this.display == "none")
            str += nexacro.__getHTMLStyle_Display("none");
        var control = this.linkedcontrol;
        var manager = nexacro._getLayoutManager();
        var layouttype = "";
        var isFluid;
        var isFluidContainerCalculation;
        var exclude_fluid = control ? control._excluded_flex : false;
        var fittype = 0;
        var is_flexgrow = true;
        if (manager && control)
        {
            if (!control._is_subcontrol)
                layouttype = manager.getLayoutProperty(control._getForm(), "type");
            else if (this.parent_elem._is_flexible)
                layouttype = this.parent_elem._layouttype;

            isFluid = control._isFluidContainer(true);
            fittype = control.fittocontents;
            if (layouttype == "horizontal" && (fittype == "width" || fittype == "both"))
                is_flexgrow = false;
            else if (layouttype == "vertical" && (fittype == "height" || fittype == "both"))
                is_flexgrow = false;
            isFluidContainerCalculation = control._isFluidContainerCalculation();
        }
        else if (this.parent_elem._is_flexible)
        {
            layouttype = this.parent_elem._layouttype;
            isFluid = true;
            isFluidContainerCalculation = false;
        }

        if (isFluid)
        {
            if (isFluidContainerCalculation || this.parent_elem._is_flexible)
            {
                if (this.left >= 0 || this.top >= 0)
                    str += nexacro.__getHTMLStyle_Pos(this.left, this.top, bPositionRtl);
            }
        }
        else
        {
            //if (this.left >= 0 || this.top >= 0)
            str += nexacro.__getHTMLStyle_Pos(this.left, this.top, bPositionRtl);
        }

        if (this._layoutbasis)
        {
            str += nexacro.__getHTMLStyle_FluidSize(this._layoutbasis);
        }
        else if (!no_size)
        {
            if (this.width >= 0 && this.height >= 0)
                str += nexacro.__getHTMLStyle_Size(this.width, this.height);
        }

        if (this.color)
            str += nexacro.__getHTMLStyle_ColorObject(this.color);
        if (this.font)
            str += nexacro.__getHTMLStyle_FontObject(this.font);
        if (this.wordSpacing)
            str += nexacro.__getHTMLStyle_WordSpacingObject(this.wordSpacing);
        if (this.letterSpacing)
            str += nexacro.__getHTMLStyle_LetterSpacingObject(this.letterSpacing);
        if (this.textDecoration)
            str += nexacro.__getHTMLStyle_TextDecorationObject(this.textDecoration);
        if (this.overflow)
            str += nexacro.__getHTMLStyle_Overflow(this.overflow);
        if (this.clippath)
            str += nexacro.__getHTMLStyle_Clippath(this.clippath);
        if (this.rtl !== undefined)
            str += nexacro.__getHTMLStyle_Direction(this.rtl);
        if (this.wordWrap)
            str += nexacro.__getHTMLStyle_WordWrap(this.wordWrap);
        if (this.pointerEvent)
            str += nexacro.__getHTMLStyle_PointerEvents(this.pointerEvent);

        if ((layouttype == "horizontal" || layouttype == "vertical" || layouttype == "table") && !isFluidContainerCalculation)
        {
            if (this.visible)
            {
                if (exclude_fluid)
                    str += nexacro.__getHTMLStyleAbsolute();
                else
                    str += nexacro.__getHTMLStyle_FluidLayoutDefaultPosition();
            }

            // Fluid Layout Component Command Str

            if (this._layoutbasis && (this._layoutbasis.type == "horizontal" || this._layoutbasis.type == "vertical"))
                str += nexacro.__getHTMLStyle_LayoutBasis(this._layoutbasis);

            if (is_flexgrow)
            {
                if (this.flexgrow > -1)
                    str += nexacro.__getHTMLStyle_FlexGrow(this.flexgrow);
            }
            if (this.flexshrink > -1)
                str += nexacro.__getHTMLStyle_FlexShrink(this.flexshrink);


            if (this.layoutorder > -1)
                str += nexacro.__getHTMLStyle_LayoutOrder(this.layoutorder);

            if (this._tablecellarea || this._tablecellarea === "")
                str += nexacro.__getHTMLStyle_TableCellArea(this._tablecellarea);
        }

        str += this._getAccessibilityStyleStr();
        return str;
    };

    _pElement._getOverflowScrollSize = function ()
    {
        return 0;
    };

    _pElement._contains = function (oDescendant)
    {
        while (oDescendant)
        {
            if (oDescendant == this) return true;
            oDescendant = oDescendant.parent_elem;
        }
        return false;
    };

    _pElement._getComputedStyle = nexacro._emptyFn;
    _pElement._getComputedStyleBackgroundColor = nexacro._emptyFn;
    _pElement.setElementAccessibilityRole = nexacro._emptyFn;
    _pElement.setElementAccessibilityLabel = nexacro._emptyFn;
    _pElement.setElementAccessibilityDescription = nexacro._emptyFn;
    _pElement.setElementAccessibilityAction = nexacro._emptyFn;
    _pElement.setElementAccessibilityFlagReadOnly = nexacro._emptyFn;
    _pElement.setElementAccessibilityStatHidden = nexacro._emptyFn;
    _pElement.getElementCaretPos = nexacro._emptyFn;
    // coordinate info
    _pElement._getPositionInWindow = function ()
    {
        return nexacro._getElementXYInWindow(this.handle);
    };
    // accessibility element function    
    _pElement._on_createAccessibilityCommand = function (acc_command) 
    {
        return acc_command; //command
    };
    // accessibility element style command
    _pElement._getAccessibilityStyleStr = function ()
    {
        return "";
    };
    _pElement._on_createAccessibilityHandle = nexacro._emptyFn; //handle

    //======================================================================
    // nexacro._EdgeImageElement
    //======================================================================

    nexacro._EdgeImageElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
    };
    var __pEdgeImageElement = nexacro._createPrototype(nexacro.Element, nexacro._EdgeImageElement);
    nexacro._EdgeImageElement.prototype = __pEdgeImageElement;
    // overide nexacro.Object

    __pEdgeImageElement._type_name = "_EdgeImageElement";

    //==== defaule values =========//
    __pEdgeImageElement.edgeImage = null;
    //==== internal handles =========//
    //==== default flags =========//
    __pEdgeImageElement._is_nc_element = true;
    //==== end of initial =========//

    __pEdgeImageElement.create = function (_doc)
    {
        var edgeProp = this.edgeImage;
        var edgeCss = this._edge_info;
        var bEdgeProp = (edgeProp && edgeProp.value != "none");
        var bEdgeCss = (edgeCss && edgeCss.value != "none");

        var owner_elem = this.parent_elem;
        if (owner_elem.handle && !this.handle && (bEdgeProp || bEdgeCss))
        {
            this.owner_elem = owner_elem;
            _doc = _doc || owner_elem._getRootWindowHandle();

            var handle = _doc.createElement("div");
            this.handle = handle;
            nexacro.__setDOMNode_ClassName(handle, this._getElementNexaClassName("nexaedge"));
            nexacro.__setDOMStyle_EdgeObject(handle.style, edgeProp ? edgeProp : edgeCss);

            // append TO Parent Element
            var _parent_handle = owner_elem.handle;
            nexacro.__insertDOMNode(_parent_handle, handle, _parent_handle.firstChild);
        }
    };

    __pEdgeImageElement.setElementSize = function (width, height)
    {
        this.width = width;
        this.height = height;
    };

    __pEdgeImageElement.setElementInfo = function (edgeImage, edge_info)
    {
        if (this.edgeImage != edgeImage || this._edge_info != edge_info)
        {
            this.edgeImage = edgeImage;
            this._edge_info = edge_info;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_EdgeObject(handle.style, edgeImage);
            }
        }
    };

    __pEdgeImageElement.createCommand = function ()
    {
        if (this.edgeImage)
        {
            if (this.edgeImage.value != "none")
                return "<div class='" + this._getElementNexaClassName("nexaedge") + "' style='" + nexacro.__getHTMLStyle_EdgeObject(this.edgeImage) + "'></div>";
        }
        else if (this._edge_info)
        {
            if (this._edge_info.value != "none")
                return "<div class='" + this._getElementNexaClassName("nexaedge") + "'></div>";
        }

        return "";
    };

    __pEdgeImageElement.attachHandle = function (win)
    {
        if (this.name && !this.handle)
        {
            var handle = win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
            }
        }
    };
    __pEdgeImageElement.attach_handle_fromparent = function (_parent)
    {
        if (_parent && !this.handle)
        {
            var handle = _parent.firstChild;
            if (handle)
            {
                this.handle = handle;
            }
        }
    };

    __pEdgeImageElement.destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            var dest_handle = (this.owner_elem ? this.owner_elem.handle : null);
            nexacro.__removeDOMNode(dest_handle, handle);

            this.owner_elem = null;
            this.handle = null;
        }
        this._p_parent = null;
        this.parent_elem = null;
    };

    //==============================================================================
    // nexacro.TextBoxElement : nexacro Element's basic flags & Utility Functions
    // TextBoxElement's DOM size control is always fitToParent
    // move text by padding & align
    //==============================================================================
    nexacro.TextBoxElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "text");
    };

    var _pTextBoxElement = nexacro._createPrototype(nexacro.Element, nexacro.TextBoxElement);
    nexacro.TextBoxElement.prototype = _pTextBoxElement;

    _pTextBoxElement._type_name = "TextBoxElement";
    _pTextBoxElement.typeselector = "nexacontentsbox";

    _pTextBoxElement._box_node = null;

    _pTextBoxElement.text = "";
    _pTextBoxElement.padding = null;
    _pTextBoxElement.textAlign = null;
    _pTextBoxElement.verticalAlign = null;
    _pTextBoxElement.wordWrap = null;
    _pTextBoxElement.pointerEvent = "";

    _pTextBoxElement._use_decoration = false;
    _pTextBoxElement._wordwrap_info = null;
    _pTextBoxElement._firstchild = false;

    _pTextBoxElement._created = false;
    _pTextBoxElement._use_style_padding = false;

    _pTextBoxElement._createTextElementHandle = function (_doc)
    {
        var handle = _doc.createElement("div");
        this._box_node = handle;
        nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
        return handle;
    };

    _pTextBoxElement._getComputedStyle = function (prop, noflush)
    {
        var style;
        var handle = this._box_node;
        if (prop)
        {
            if (!this.text)
            {
                var text = this.text;
                this.setElementText(" ");
                handle = this._box_node;

                var val;

                if (handle)
                {
                    style = window.getComputedStyle(handle, null);
                    val = style.getPropertyValue(prop);
                }
                this.setElementText(text);
                return val;
            }
            else if (handle)
            {
                style = window.getComputedStyle(handle, null);
                return style.getPropertyValue(prop);
            }
        }
    };

    _pTextBoxElement._is_accept_touch = function (win)
    {
        if (nexacro._OS === 'iOS' && win) 
        {
            var lastfocus_elem = win._last_focused_elem;
            if (lastfocus_elem && lastfocus_elem.isInputElement()) 
            {
                if (this !== lastfocus_elem && lastfocus_elem.isComposing())
                {
                    return false;
                }
            }
        }
        return true;
    };

    _pTextBoxElement._refreshCommonStyleProps = function (handle_style)
    {
        nexacro.Element.prototype._refreshCommonStyleProps.call(this, handle_style);

        var width = this.width;
        var height = this.height;

        if (width < 0) width = 0;
        if (height < 0) height = 0;

        if (width == 0 || height == 0)    // 0 허용
            nexacro.__setDOMStyle_Size(handle_style, width, height);
    };

    _pTextBoxElement.setElementSize = function (width, height)
    {
        if (this.width != width || this.height != height)
        {
            this.width = width;
            this.height = height;

            if (width < 0) width = 0;
            if (height < 0) height = 0;

            var handle = this.handle;
            if (handle)
            {
                if (width >= 0 && height >= 0)  // 0허용
                    nexacro.__setDOMStyle_Size(handle.style, width, height);
                else
                    nexacro.__clearDOMStyle_Size(handle.style);
            }
        }
    };

    _pTextBoxElement.setElementMove = function (left, top, width, height, bforce)
    {
        this.setElementPosition(left, top, bforce);
        this.setElementSize(width, height);
    };

    _pTextBoxElement._getComputedStyleAlign = function (noflush)
    {
        var align = { textAlign: "", verticalAlign: "" };
        align.textAlign = this._getComputedStyle("text-align");
        align.verticalAlign = this._getComputedStyle("vertical-align");
        return align;
    };

    _pTextBoxElement._createElementHandleAfter = nexacro._emptyFn;

    _pTextBoxElement._createElementHandle = function (owner_elem, _doc)
    {
        if (this.text)
        {
            _doc = _doc || owner_elem._getRootWindowHandle();
            var handle = this._createTextElementHandle(_doc);

            handle.id = this.name;
            handle._linked_element = this;

            this.handle = handle;

            var handle_style = handle.style;
            var box_node = this._box_node;
            var box_style = box_node.style;

            // update Common Style
            this._refreshCommonStyleProps(handle_style);

            // update Special Style
            if (this.textAlign)
                nexacro.__setDOMStyle_textAlign(box_style, this.textAlign, this.rtl);
            if (this.verticalAlign)
                nexacro.__setDOMStyle_verticalAlign(box_style, this.verticalAlign);

            if (this._use_decoration)
                nexacro.__setDOMNode_DecorateText(box_node, this.text);
            else
                nexacro.__setDOMNode_Text(box_node, this.text, this.wordWrap || this._wordwrap_info);

            if (this._use_style_padding)
                nexacro.__setDOMStyle_PaddingObject(box_style, this.padding, this.rtl);

            this._on_createAccessibilityHandle(handle);
            this._createElementHandleAfter(handle);

            if (this._firstchild)
                nexacro.__insertDOMNode(owner_elem.dest_handle, handle, owner_elem.dest_handle.firstChild);
            else
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
        }
    };

    _pTextBoxElement.create = function (win)
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;

            this.rtl = this._isParentRtl();

            this._createElementHandle(owner_elem, win._doc);
            this._created = true;
        }
    };

    _pTextBoxElement.createCommandAfter = function (str, handle_style, box_style)
    {
        str += (handle_style || box_style) ? (" style='" + handle_style + box_style + "'>") : ">";
        return str;
    };

    _pTextBoxElement.createCommand = function ()
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            if (this.text)
            {
                var handle_style = this._getCommonStyleStr();
                var box_style = "";

                // update Special Style
                if (this.textAlign)
                    box_style += nexacro.__getHTMLStyle_textAlign(this.textAlign, this.rtl);
                if (this.verticalAlign)
                    box_style += nexacro.__getHTMLStyle_verticalAlign(this.verticalAlign);
                if (this.pointerEvent)
                    box_style += nexacro.__getHTMLStyle_PointerEvents(this.pointerEvent);
                if (this._use_style_padding)
                    box_style += nexacro.__getHTMLStyle_PaddingObject(this.padding, this.rtl);

                var classname = this._getElementClassName();
                var str = "<div id='" + this.name + "' class='" + classname + "'";

                str = this._on_createAccessibilityCommand(str);
                str = this.createCommandAfter(str, handle_style, box_style);

                if (this._use_decoration)
                    str += nexacro.__getHTMLAttr_DecorateText(this.text);
                else
                    str += nexacro.__getHTMLAttr_Text(this.text, this.wordWrap || this._wordwrap_info);

                str += "</div>";
                return str;
            }
        }
        return "";
    };

    _pTextBoxElement.attachHandle = function (win)
    {
        if (this.name && !this._created)
        {
            var handle = win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
                this._box_node = handle;
                handle._linked_element = this;
            }
            this._created = true;
        }
    };

    _pTextBoxElement.destroy = function ()
    {
        this._destroyElementHandle();
        this.owner_elem = null;
        this._box_node = null;
        this._p_parent = null;
        this.parent_elem = null;
        this._created = false;
    };

    _pTextBoxElement.setElementPadding = function (padding)
    {
        if (!this._use_style_padding)
            return;

        if (this.padding != padding)
        {
            this.padding = padding;
            var box_node = this._box_node;

            if (box_node)
            {
                nexacro.__setDOMStyle_PaddingObject(box_node.style, padding, this.rtl);
            }
        }
    };

    _pTextBoxElement.setElementTextAlign = function (textalign)
    {
        if (this.textAlign != textalign)
        {
            this.textAlign = textalign;
            var box_node = this._box_node;

            if (box_node)
            {
                nexacro.__setDOMStyle_textAlign(box_node.style, textalign, this.rtl);
            }
        }
    };

    _pTextBoxElement.setElementVerticalAlign = function (verticalalign)
    {
        if (this.verticalAlign != verticalalign)
        {
            this.verticalAlign = verticalalign;
            var box_node = this._box_node;

            if (box_node)
            {
                nexacro.__setDOMStyle_verticalAlign(box_node.style, verticalalign);
            }
        }
    };

    _pTextBoxElement.setElementText = function (text)
    {
        if (this.text != text || this._use_decoration == true)
        {
            this.text = text;
            this._use_decoration = false;
            if (this._created)
            {
                if (text)
                {
                    if (this.handle)
                        nexacro.__setDOMNode_Text(this._box_node, text, this.wordWrap || this._wordwrap_info);
                    else
                    {
                        if (this.owner_elem)
                            this._createElementHandle(this.owner_elem);
                    }
                }
                else
                {
                    if (this.handle)
                        this._destroyElementHandle();
                }
            }
        }
    };

    _pTextBoxElement._flexAlignCenterMiddle = function ()
    {
        var box_node = this._box_node;

        if (box_node)
        {
            var box_style = box_node.style;
            nexacro.__setDOMStyle_LayoutFluidPos(box_style);
            nexacro.__setDOMStyle_FlexMainAxisAlign(box_style, "center");
            nexacro.__setDOMStyle_FlexCrossAxisAlign(box_style, "center");
        }
    };

    _pTextBoxElement.setElementDecorateText = function (text)
    {
        if (this.text != text || this._use_decoration == false)
        {
            this.text = text;
            this._use_decoration = true;
            if (this._created)
            {
                if (text)
                {
                    if (this.handle)
                        nexacro.__setDOMNode_DecorateText(this._box_node, text);
                    else
                        this._createElementHandle(this.owner_elem);
                }
                else
                {
                    if (this.handle)
                        this._destroyElementHandle();
                }
            }
        }
    };

    _pTextBoxElement.setElementWordWrap = function (wordwrap)
    {
        // this prop is css set --> use class selector  -> css inline property (use map & css)
        if (this.wordWrap != wordwrap)
        {
            var oldwordwrap = this.wordWrap || this._wordwrap_info;
            this.wordWrap = wordwrap;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNodeStyle_WordWrap(handle.style, wordwrap);
                if (this._created && this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                {
                    nexacro.__setDOMNode_Text(this._box_node, this.text, wordwrap);
                }
            }
        }
    };

    _pTextBoxElement.setElementPointerEvents = nexacro._emptyFn;

    _pTextBoxElement.setElementCSSMapInfo = function (wordwrap)
    {
        if (this._wordwrap_info != wordwrap)
        {
            var oldwordwrap = this.wordWrap || this._wordwrap_info;
            this._wordwrap_info = wordwrap;
            var handle = this.handle;
            if (handle)
            {
                if (!this.wordWrap && this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                {
                    nexacro.__setDOMNode_Text(this._box_node, this.text, wordwrap);
                }
            }
        }
    };

    _pTextBoxElement._change_to_keypad_type = nexacro._emptyFn;

    //==============================================================================
    // nexacro.TextBoxFlexElement : nexacro Element's basic flags & Utility Functions
    // TextBoxFlexElement's DOM size control is always fitToParent
    // move text by padding & align
    //==============================================================================
    nexacro.TextBoxFlexElement = function (parent_elem, id)
    {
        nexacro.TextBoxElement.call(this, parent_elem, id);
    };

    var _pTextBoxFlexElement = nexacro._createPrototype(nexacro.TextBoxElement, nexacro.TextBoxFlexElement);
    nexacro.TextBoxFlexElement.prototype = _pTextBoxFlexElement;

    _pTextBoxFlexElement._type_name = "TextBoxFlexElement";
    _pTextBoxFlexElement.typeselector = "nexacontentsboxflex";

    _pTextBoxFlexElement.padd_left = 0;
    _pTextBoxFlexElement.padd_top = 0;
    _pTextBoxFlexElement.padd_right = 0;
    _pTextBoxFlexElement.padd_bottom = 0;

    _pTextBoxFlexElement._createElementHandle = function (owner_elem, _doc)
    {
        if (this.text)
        {
            _doc = _doc || owner_elem._getRootWindowHandle();
            var handle = this._createTextElementHandle(_doc);

            handle.id = this.name;
            handle._linked_element = this;

            this.handle = handle;

            var handle_style = handle.style;
            var box_node = this._box_node;
            var box_style = box_node.style;

            // update Special Style
            this._setChangeFlexAlign(this.textAlign, this.verticalAlign);

            // update Common Style
            this._refreshCommonStyleProps(handle_style);

            if (this._use_decoration)
                nexacro.__setDOMNode_DecorateText(box_node, this.text);
            else
                nexacro.__setDOMNode_Text(box_node, this.text, this.wordWrap || this._wordwrap_info);

            this._createElementHandleAfter(handle);

            // append TO Parent Element
            nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
        }
    };

    _pTextBoxFlexElement.createCommand = function ()
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            if (this.text)
            {
                var handle_style = this._getCommonStyleStr();
                var box_style = "";

                // update Special Style
                box_style += this._getChangeFlexAlignStr(this.textAlign, this.verticalAlign);

                if (this.pointerEvent)
                    box_style += nexacro.__getHTMLStyle_PointerEvents(this.pointerEvent);

                var classname = this._getElementClassName();
                var str = "<div id='" + this.name + "' class='" + classname + "'";

                str = this._on_createAccessibilityCommand(str);
                str = this.createCommandAfter(str, handle_style, box_style);

                if (this._use_decoration)
                    str += nexacro.__getHTMLAttr_DecorateText(this.text);
                else
                    str += nexacro.__getHTMLAttr_Text(this.text, this.wordWrap || this._wordwrap_info);

                str += "</div>";
                return str;
            }
        }
        return "";
    };

    _pTextBoxFlexElement.attachHandle = function (win)
    {
        nexacro.TextBoxElement.prototype.attachHandle.call(this, win);
        this._applyPadding();
    };

    _pTextBoxFlexElement._refreshCommonStyleProps = function (handle_style)
    {
        nexacro.TextBoxElement.prototype._refreshCommonStyleProps.call(this, handle_style);
        this._applyPadding();
    };

    _pTextBoxFlexElement._getComputedStyleAlign = function (noflush)
    {
        var align = { textAlign: "", verticalAlign: "" };
        align.textAlign = this._getComputedStyle("justify-content");
        align.verticalAlign = this._getComputedStyle("align-items");

        if (align.textAlign == "flex-start")
            align.textAlign = "left";
        else if (align.textAlign == "flex-end")
            align.textAlign = "right";

        if (align.verticalAlign == "flex-start")
            align.verticalAlign = "top";
        else if (align.verticalAlign == "flex-end")
            align.verticalAlign = "bottom";
        else if (align.verticalAlign == "center")
            align.verticalAlign = "middle";

        return align;
    };

    _pTextBoxFlexElement._setChangeFlexAlign = function (textAlign, verticalAlign)
    {
        var box_node = this._box_node;

        if (!box_node)
            return;

        var box_style = box_node.style;

        if (textAlign)
        {
            var halign;
            switch (textAlign)
            {
                // rtl은 style.direction에 따라 자동 변경됨.
                case "left":
                    halign = "flex-start";
                    break;
                case "right":
                    halign = "flex-end";
                    break;
                case "center":
                    halign = "center";
                    break;
            }
            nexacro.__setDOMStyle_FlexMainAxisAlign(box_style, halign);
        }

        if (verticalAlign)
        {
            var valign;
            switch (verticalAlign)
            {
                case "top":
                    valign = "flex-start";
                    break;
                case "bottom":
                    valign = "flex-end";
                    break;
                case "middle":
                    valign = "center";
                    break;
            }

            nexacro.__setDOMStyle_FlexCrossAxisAlign(box_style, valign);
        }
    };

    _pTextBoxFlexElement._getChangeFlexAlignStr = function (textAlign, verticalAlign)
    {
        var str = "";

        if (textAlign)
        {
            var halign;
            switch (textAlign)
            {   // rtl은 style.direction에 따라 자동 변경됨.
                case "left":
                    halign = "flex-start";
                    break;
                case "right":
                    halign = "flex-end";
                    break;
                case "center":
                    halign = "center";
                    break;
            }
            str += nexacro.__getHTMLStyle_FlexMainAxisAlign(halign);
        }

        if (verticalAlign)
        {
            var valign;
            switch (verticalAlign)
            {
                case "top":
                    valign = "flex-start";
                    break;
                case "bottom":
                    valign = "flex-end";
                    break;
                case "middle":
                    valign = "center";
                    break;
            }

            str += nexacro.__getHTMLStyle_FlexCrossAxisAlign(valign);
        }
        return str;
    };

    _pTextBoxFlexElement.setElementTextAlign = function (textalign)
    {
        if (this.textAlign != textalign)
        {
            this.textAlign = textalign;
            var box_node = this._box_node;

            if (box_node)
            {
                this._setChangeFlexAlign(textalign, null);
                this._applyPadding();
            }
        }
    };

    _pTextBoxFlexElement.setElementVerticalAlign = function (verticalalign)
    {
        if (this.verticalAlign != verticalalign)
        {
            this.verticalAlign = verticalalign;
            var box_node = this._box_node;

            if (box_node)
            {
                this._setChangeFlexAlign(null, verticalalign);
                this._applyPadding();
            }
        }
    };

    _pTextBoxFlexElement._applyPadding = function ()
    {
        var handle = this.handle;
        if (!handle)
            return;

        var is_rtl = this._isParentRtl();
        var top = this.padd_top;
        var right = (!is_rtl) ? this.padd_right : this.padd_left;
        var bottom = this.padd_bottom;
        var left = (!is_rtl) ? this.padd_left : this.padd_right;

        var v_align = this._getComputedStyle("align-items");

        // padding을 조절하여 text영역을 확보함. (성능개선)
        if (v_align == "flex-start")
        {
            handle.style.padding = top + "px " + right + "px " + 0 + "px " + left + "px";
        }
        else if (v_align == "flex-end")
        {
            handle.style.padding = 0 + "px " + right + "px " + bottom + "px " + left + "px";
        }
        else
        {
            var val = top - bottom;

            if (val >= 0)
            {
                top = val;
                bottom = 0;
            }
            else
            {
                top = 0;
                bottom = -val;
            }

            handle.style.padding = top + "px " + right + "px " + bottom + "px " + left + "px";
        }
    };

    _pTextBoxFlexElement.setElementPadding = function (left, top, right, bottom, bforce)
    {
        if (this.padd_left != left || this.padd_top != top || this.padd_right != right || this.padd_bottom != bottom || bforce)
        {
            this.padd_left = left;
            this.padd_top = top;
            this.padd_right = right;
            this.padd_bottom = bottom;
            this._applyPadding();
        }
    };

    //==============================================================================
    // nexacro.TextBoxVirtualFlexElement : nexacro Element's basic flags & Utility Functions
    // TextBoxVirtualFlexElement's DOM size control is always fitToParent
    // move text by padding & align
    //==============================================================================
    nexacro.TextBoxVirtualFlexElement = function (parent_elem, id)
    {
        nexacro.TextBoxFlexElement.call(this, parent_elem, id);
    };

    var _pTextBoxVirtualFlexElement = nexacro._createPrototype(nexacro.TextBoxFlexElement, nexacro.TextBoxVirtualFlexElement);
    nexacro.TextBoxVirtualFlexElement.prototype = _pTextBoxVirtualFlexElement;

    _pTextBoxVirtualFlexElement._type_name = "TextBoxVirtualFlexElement";

    _pTextBoxVirtualFlexElement._createTextElementHandle = function (_doc)
    {
        var handle = this._box_node = this.parent_elem.handle;  // parent node 사용
        this.parent_elem._addselector = this.typeselector + " " + this.classselector;
        nexacro.__setDOMNode_ClassName(handle, this.parent_elem._getElementClassName());
        return handle;
    };

    _pTextBoxVirtualFlexElement._createElementHandle = function (owner_elem, _doc)
    {
        _doc = _doc || owner_elem._getRootWindowHandle();
        var handle = this._createTextElementHandle(_doc);

        this.handle = handle;

        var handle_style = handle.style;
        var box_node = this._box_node;
        var box_style = box_node.style;

        // update Common Style
        this._refreshCommonStyleProps(handle_style);

        // update Common Style
        this._setChangeFlexAlign(this.textAlign, this.verticalAlign);

        if (this.classselector)
            nexacro.__setDOMNode_ClassName(handle, this.parent_elem._getElementClassName());

        // update Special Style
        if (this.visible)
            this._setNodeText(this.text, this._use_decoration);

        this._createElementHandleAfter(handle);
    };

    _pTextBoxVirtualFlexElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();

            /* need ????
            var str = "";
            str = this._on_createAccessibilityCommand(str);
            return str;
            */
        }
        return "";
    };

    _pTextBoxVirtualFlexElement.attachHandle = function (win)
    {
        if (this.name && !this._created)
        {
            var handle = win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
                this._box_node = handle;
                handle._linked_element = this;
            }
            this._created = true;

            if (this._use_decoration)
            {
                var textDecoration = this.textDecoration;
                this.textDecoration = null;
                this.setElementTextDecoration(textDecoration);
            }
            else
            {
                var text = this.text;
                this.text = null;
                this.setElementText(text);
            }

            if (this._box_node)
            {
                this.handle = this._box_node;
                var box_style = this._box_node.style;

                this._refreshCommonStyleProps(this.handle.style);
                this._setChangeFlexAlign(this.textAlign, this.verticalAlign);
            }

            var classselector = this.classselector;
            this.classselector = null;
            this.setElementClassCSSSelector(classselector);
        }
    };

    _pTextBoxVirtualFlexElement.destroy = function ()
    {
        this._clearFlex();
        this.owner_elem = null;
        this._box_node = null;
        this._p_parent = null;
        this.parent_elem = null;
        this._created = false;
    };

    _pTextBoxVirtualFlexElement._refreshCommonStyleProps = function (handle_style)
    {
        if (!this.visible)
            this.setElementVisible(this.visible, true);

        this._applyPadding();

        // update Element's properties to DOM
        if (this.color)
            nexacro.__setDOMStyle_ColorObject(handle_style, this.color);
        if (this.font)
            nexacro.__setDOMStyle_FontObject(handle_style, this.font);
        if (this.wordSpacing)
            nexacro.__setDOMStyle_WordSpacingObject(handle_style, this.wordSpacing);
        if (this.letterSpacing)
            nexacro.__setDOMStyle_LetterSpacingObject(handle_style, this.letterSpacing);
        if (this.textDecoration)
            nexacro.__setDOMStyle_TextDecorationObject(handle_style, this.textDecoration);

        if (this.rtl !== undefined)
            nexacro.__setDOMStyle_Direction(handle_style, this.rtl);
        if (this.wordWrap)
            nexacro.__setDOMStyle_WordWrap(handle_style, this.wordWrap);

        if (this.pointerEvent)
            nexacro.__setDOMNodeStylePointerEvents(handle_style, this.pointerEvent);
    };

    _pTextBoxVirtualFlexElement._clearFlex = function ()
    {
        var handle = this.parent_elem.handle;
        if (handle)
        {
            var handle_style = handle.style;

            this.parent_elem._addselector = "";
            var org_classname = (this.parent_elem._getElementClassName());
            nexacro.__setDOMNode_ClassName(handle, org_classname);

            this._setNodeText("", this._use_decoration);
            handle_style.justifyContent = "";
            handle_style.alignItems = "";
            handle.style.padding = "0px 0px 0px 0px";
            nexacro.__setDOMStyle_WordSpacingObject(handle_style, "");
            nexacro.__setDOMStyle_LetterSpacingObject(handle_style, "");
            nexacro.__setDOMStyle_TextDecorationObject(handle_style, "");
            nexacro.__setDOMStyle_Direction(handle_style, "");
            nexacro.__setDOMStyle_WordWrap(handle_style, "");
        }
    };

    _pTextBoxVirtualFlexElement._setNodeText = function (text, use_decoration)
    {
        var box_node = this._box_node;
        if (box_node)
        {
            var textnode = null;
            var childnodes = [];

            if (this.id == "expandtext")
            {
                for (var i = 0; i < box_node.childNodes.length; i++)
                {
                    if (box_node.childNodes[i].nodeName == "#text")
                        textnode = box_node.childNodes[i];
                    else
                        childnodes.push(box_node.childNodes[i]);
                }
            }

            if (use_decoration)
            {
                nexacro.__setDOMNode_DecorateText(box_node, text);

                for (var i = 0; i < childnodes.length; i++)
                {
                    box_node.appendChild(childnodes[i]);
                }
            }
            else
            {
                if (textnode)
                {
                    textnode.nodeValue = text;
                }
                else
                {
                    nexacro.__setDOMNode_Text(box_node, text, this.wordWrap || this._wordwrap_info);
                    for (var i = 0; i < childnodes.length; i++)
                    {
                        box_node.appendChild(childnodes[i]);
                    }
                }
            }
        }
    };

    _pTextBoxVirtualFlexElement.setElementVisible = function (visible, b_force)
    {
        if (this.visible != visible || b_force)
        {
            this.visible = visible;
            if (visible)
            {
                if (this.handle)
                    this._setNodeText(this.text, this._use_decoration);
                else if (this.owner_elem)
                    this._createElementHandle(this.owner_elem);
            }
            else
            {
                if (this.handle)
                    this._setNodeText("", this._use_decoration);
            }
        }
    };

    _pTextBoxVirtualFlexElement.setElementClassCSSSelector = function (classname)
    {
        if (this.classselector != classname)
        {
            this.classselector = classname;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNode_ClassName(handle, this.parent_elem._getElementClassName());
            }
        }
    };

    _pTextBoxVirtualFlexElement.setElementText = function (text)
    {
        if (this.text != text || this._use_decoration == true)
        {
            this.text = text;
            this._use_decoration = false;
            if (this._created)
            {
                if (this.visible)
                {
                    if (text)
                    {
                        if (this.handle)
                            this._setNodeText(text, false);
                        else
                            this._createElementHandle(this.owner_elem);
                    }
                    else
                    {
                        if (this.handle)
                            this._setNodeText("", false);
                    }
                }
            }
        }
    };

    _pTextBoxVirtualFlexElement.setElementPosition = function (left, top, bforce)
    {
        //var bUpdate = false;//this._checkUpdateElementByRTL(handle, left);

        if (this.left != left || this.top != top || /*bUpdate ||*/ bforce)
        {
            this.left = left;
            this.top = top;

            var width = this.width;
            var height = this.height;

            if (width < 0) width = 0;
            if (height < 0) height = 0;

            var l = this.left;
            var t = this.top;
            var r = this.parent_elem.width - width - l;
            var b = this.parent_elem.height - height - t;

            this.setElementPadding(l, t, r, b, true); // 가상 영역을 상위 node의 padding으로 계산하여 잡음
        }
    };

    _pTextBoxVirtualFlexElement.setElementSize = function (width, height)
    {
        if (this.width != width || this.height != height)
        {
            this.width = width;
            this.height = height;

            if (width < 0) width = 0;
            if (height < 0) height = 0;

            var l = this.left;
            var t = this.top;
            var r = this.parent_elem.width - width - l;
            var b = this.parent_elem.height - height - t;

            this.setElementPadding(l, t, r, b, true); // 가상 영역을 상위 node의 padding으로 계산하여 잡음
        }
    };

    _pTextBoxVirtualFlexElement.setElementMove = function (left, top, width, height, bforce)
    {
        if (this.left != left || this.top != top || bforce || this.width != width || this.height != height)
        {
            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;

            if (width < 0) width = 0;
            if (height < 0) height = 0;

            var l = this.left;
            var t = this.top;
            var r = this.parent_elem.width - width - l;
            var b = this.parent_elem.height - height - t;

            this.setElementPadding(l, t, r, b, true);
        }
    };

    _pTextBoxVirtualFlexElement.setElementDecorateText = nexacro._emptyFn; // flex 사용시 decorate용 span tag가 flex에 맞게 align되어 사용 불가. (기존 TextBoxElement 사용 권고.)


    //======================================================================
    // nexacro.IconElement - this Element
    // this Image : No Stretch && Align from Size Box
    //======================================================================
    nexacro.IconElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "icon");
    };
    var _pIconElement = nexacro._createPrototype(nexacro.Element, nexacro.IconElement);
    nexacro.IconElement.prototype = _pIconElement;

    // overide nexacro.Control

    _pIconElement._type_name = "IconElement";
    _pIconElement.typeselector = "nexacontentsbox";

    //==== defaule values =========//
    _pIconElement.padding = null;
    _pIconElement.textAlign = null;
    _pIconElement.verticalAlign = null;
    _pIconElement.icon = "";
    //==== internal handles =========//
    _pIconElement._created = false;
    //==== default flags =========//
    //==== end of initial =========//

    _pIconElement._createElementHandle = function (owner_elem, _doc)
    {
        if (this.icon && (this.icon.value != "none"))
        {
            _doc = _doc || owner_elem._getRootWindowHandle();

            var handle = _doc.createElement("div");
            this.handle = handle;

            nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
            handle.id = this.name;
            handle._linked_element = this;

            /////////////////////////////////
            var handle_style = handle.style;

            // update Common Style
            this._refreshCommonStyleProps(handle_style);

            // update Special Style
            var textAlign = this.textAlign;
            if (textAlign)
                nexacro.__setDOMStyle_BKImageTextAlign(handle_style, textAlign);

            if (this.verticalAlign)
                nexacro.__setDOMStyle_BKImageVerticalAlign(handle_style, this.verticalAlign);

            // update URL
            nexacro.__setDOMStyle_BKImageUrl(handle_style, this.icon._sysurl);

            // append TO Parent Element
            nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
        }
    };

    //_pIconElement._destroyElementHandle = function ()
    //{
    //	var handle = this.handle;
    //	if (handle)
    //	{
    //		handle._linked_element = null;
    //		var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
    //		nexacro.__removeDOMNode(dest_handle, handle);

    //		this.handle = null;
    //	}
    //};

    _pIconElement.create = function (win)
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            this._createElementHandle(owner_elem, win._doc);
            this._created = true;
        }
    };

    _pIconElement.createCommand = function ()
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            if (this.icon && (this.icon.value != "none"))
            {
                /////////////////////////////////
                var handle_style = this._getCommonStyleStr();
                var str;
                // update Special Style
                //var textAlign = this.textAlign;
                //if (textAlign || this.verticalAlign)
                //    str = nexacro.__getHTMLStyle_BKImageAlign(textAlign, this.verticalAlign);

                handle_style += nexacro.__getHTMLStyle_BKImageUrl(this.icon._sysurl);

                var classname = this._getElementClassName();
                str = "<div id='" + this.name + "' class='" + classname + "'";
                str += (handle_style) ? (" style='" + handle_style + "'") : "";
                str = this._on_createAccessibilityCommand(str);
                str += "></div>";

                return str;
            }
        }
        return "";
    };

    _pIconElement.attachHandle = function (win)
    {
        if (this.name && !this._created)
        {
            var handle = win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
                handle._linked_element = this;
            }
            this._created = true;

        }
    };

    _pIconElement.destroy = function ()
    {
        this._destroyElementHandle();
        this.owner_elem = null;
        this._p_parent = null;
        this.parent_elem = null;
        this._created = false;
    };

    /* 필요시 다시 활용
    _pIconElement._getComputedStyle = function (prop)
    {

        var handle = this.handle;
        if (handle)
        {
            var style = window.getComputedStyle(handle, null);
            var align = style.getPropertyValue("background-position");

            var textalign = "center";
            var verticalalign = "middle";
            var valarr = align.split(/\s+/);
            for (var i = 0, n = valarr.length; i < n; i++)
            {
                var tok = valarr[i];
                switch (tok)
                {
                    case "left":
                    case "center":
                    case "right":
                        textalign = tok;
                        break;
                    case "top":
                    case "middle":
                    case "bottom":
                        verticalalign = tok;
                        break;
                }
            }
            return { textAlign: textalign, verticalAlign: verticalalign };
        }
        else
            return { textAlign: "center", verticalAlign: "middle" };
    };
    */

    /////////////////////////////////
    _pIconElement.setElementTextAlign = function (textalign)
    {
        if (this.textAlign != textalign)
        {
            this.textAlign = textalign;

            var handle = this.handle;
            if (handle)
            {
                if (textalign)
                    nexacro.__setDOMStyle_BKImageTextAlign(handle.style, textalign);
                //nexacro.__setDOMStyle_BKImageAlign(handle.style, textalign, this.verticalAlign || "middle");
                else
                    nexacro.__clearDOMStyle_BKImageTextAlign(handle.style);
            }
        }
    };
    _pIconElement.setElementVerticalAlign = function (verticalalign)
    {
        if (this.verticalAlign != verticalalign)
        {
            this.verticalAlign = verticalalign;

            var handle = this.handle;
            if (handle)
            {
                if (verticalalign)
                    nexacro.__setDOMStyle_BKImageVerticalAlign(handle.style, verticalalign);
                else
                    nexacro.__clearDOMStyle_BKImageVerticalAlign(handle.style);
            }
        }
    };

    _pIconElement.setElementIcon = function (icon)
    {
        if (this.icon != icon)
        {
            this.icon = icon;
            if (this._created)
            {
                if (icon && icon.value != "none")
                {
                    var handle = this.handle;
                    if (handle)
                    {

                        var url = icon._sysurl;
                        nexacro.__setDOMStyle_BKImageUrl(handle.style, url);
                    }
                    else
                        this._createElementHandle(this.owner_elem);
                }
                else
                {
                    if (this.handle)
                        this._destroyElementHandle();
                }
            }

        }
    };

    // end of IconElement

    //==============================================================================
    // nexacro.IconText : nexacro Element's basic flags & Utility Functions
    // IconTextElement's DOM size control is always fitToParent
    // move text by padding & align
    //==============================================================================

    //type = 1 text only
    //type = 2 IconUrl only
    //type = 3 IconUrl + text

    nexacro.IconTextElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "contents");
    };

    var _pIconTextElement = nexacro._createPrototype(nexacro.Element, nexacro.IconTextElement);
    nexacro.IconTextElement.prototype = _pIconTextElement;

    _pIconTextElement._type_name = "IconTextElement";
    _pIconTextElement.typeselector = "nexacontentsbox";

    //==== defaule values =========//
    // basic element attrubutes
    _pIconTextElement.text = "";
    _pIconTextElement.icon = null;
    _pIconTextElement.iconPos = "";
    _pIconTextElement.textAlign = null;
    _pIconTextElement.verticalAlign = null;
    _pIconTextElement.textwidth = 0;

    _pIconTextElement.wordWrap = null;
    _pIconTextElement._wordwrap_info = null;

    // internal use
    _pIconTextElement._contents_type = 0;
    _pIconTextElement._box_node = null;
    _pIconTextElement._icon_node = null;
    _pIconTextElement._text_node = null;
    _pIconTextElement._created = false;
    _pIconTextElement._use_decoration = false;

    //==== default flags =========//
    _pIconTextElement._use_newline = true;
    //==== end of initial =========//

    _pIconTextElement._createBoxElementHandle = function (_doc, _type)
    {
        var classname = this._getElementClassName();
        //  if (_type == 2)
        //     classname = "nexaiconitem";

        if (_type == 1 || _type == 2 || _type == 3)
        {
            var handle = _doc.createElement("div");
            this._box_node = handle;

            nexacro.__setDOMNode_ClassName(handle, classname);
            return handle;
        }
        return null;
    };

    _pIconTextElement._createElementHandle = function (owner_elem, __doc)
    {
        var _type = this._contents_type;
        if (_type)
        {
            var _doc = __doc || owner_elem._getRootWindowHandle();
            var handle = this.handle;
            var newhandle;

            if (!handle && _doc)
            {
                handle = this._createBoxElementHandle(_doc, _type);
                handle.id = this.name;
                handle._linked_element = this;
                newhandle = this.handle = handle;
            }

            var box_node = this._box_node;
            var text_node = null, icon_node = null;

            if (box_node.getElementsByTagName("img").length)    // box_node에 text를 설정되는 순간 하위 노드들이 사라져서 node로 체크.
            {
                text_node = this._text_node;
                icon_node = this._icon_node;
            }
            else
                this._text_node = this._icon_node = null;

            if (_type == 3)
            {
                if (this._use_decoration)
                    nexacro.__setDOMNode_DecorateText(box_node, "");
                else
                    nexacro.__setDOMNode_Text(box_node, "");

                //nexacro.__setDOMStyle_BKImageUrl(box_node.style, ""); chrome에서 ""값 설정시 페이지 로드가 발생됨.

                if (!this._icon_node)
                {
                    icon_node = _doc.createElement("img");
                    nexacro.__setDOMNode_ClassName(icon_node, this._getElementNexaClassName("nexaiconitem", undefined, "img"));

                    this._icon_node = icon_node;

                    text_node = _doc.createElement("div");
                    nexacro.__setDOMNode_ClassName(text_node, this._getElementNexaClassName("nexatextitem"));
                    if (this.iconPos == "left" || this.iconPos == "right")
                    {
                        nexacro.__setDOMStyle_Display(text_node.style, "inline-block");
                    }
                    this._text_node = text_node;

                    if (this.iconPos == "left" || this.iconPos == "top")
                    {
                        nexacro.__appendDOMNode(box_node, icon_node);
                        nexacro.__appendDOMNode(box_node, text_node);
                    }
                    else
                    {
                        nexacro.__appendDOMNode(box_node, text_node);
                        nexacro.__appendDOMNode(box_node, icon_node);
                    }
                }
                else
                {
                    nexacro.__setDOMStyle_Display(this._icon_node, "");
                    nexacro.__setDOMStyle_Display(this._text_node, "");
                }

                nexacro.__setDOMNode_Alt(this._icon_node, "");
            }
            else
            {
                if (this._icon_node)
                {
                    nexacro.__setDOMStyle_Display(this._icon_node, "none");
                    nexacro.__setDOMStyle_Display(this._text_node, "none");
                }
            }

            /////////////////////////////////
            var handle_style = handle.style;
            var box_style = box_node.style;

            // update Common Style
            this._refreshCommonStyleProps(handle_style);

            if (_type == 1 || _type == 3)
            {
                if (this.textAlign)
                    nexacro.__setDOMStyle_textAlign(box_style, this.textAlign, this.rtl);
                if (this.verticalAlign)
                    nexacro.__setDOMStyle_verticalAlign(box_style, this.verticalAlign);
            }
            else if (_type == 2)
            {
                var textAlign = this.textAlign;
                if (textAlign)
                    nexacro.__setDOMStyle_BKImageTextAlign(box_style, textAlign);
                if (this.verticalAlign)
                    nexacro.__setDOMStyle_BKImageVerticalAlign(box_style, this.verticalAlign);

            }

            //--------------------------------------------------------------------------------------
            // text setting 수정
            if (_type == 1)
            {
                if (this._use_decoration)
                    nexacro.__setDOMNode_DecorateText(box_node, this.text);
                else
                    nexacro.__setDOMNode_Text(box_node, this.text, this.wordWrap || this._wordwrap_info);
            }
            else if (_type == 2)
            {
                nexacro.__setDOMStyle_BKImageUrl(box_style, this.icon._sysurl);
            }
            else if (_type == 3)
            {
                if (text_node && this.textPadding)
                    nexacro.__setDOMStyle_PaddingObject(text_node.style, this.textPadding, this.rtl);

                if (this._use_decoration)
                    nexacro.__setDOMNode_DecorateText(text_node, this.text);
                else
                    nexacro.__setDOMNode_Text(text_node, this.text, this.wordWrap || this._wordwrap_info);

                nexacro.__setDOMNode_ImageUrl(icon_node, this.icon._sysurl);
            }
            //--------------------------------------------------------------------------------------

            this._on_createAccessibilityHandle(handle); // 동적 생성용 인터페이스 (수정 필요시 accessibiltiy_html5.js에서 재정의)

            // append TO Parent Element
            if (newhandle)
                nexacro.__appendDOMNode(owner_elem.dest_handle, newhandle);
        }
    };

    //_pIconTextElement._destroyElementHandle = function ()
    //{
    //	var handle = this.handle;
    //	if (handle)
    //	{
    //		handle._linked_element = null;

    //		var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
    //		nexacro.__removeDOMNode(dest_handle, handle);

    //		this.handle = null;
    //		// internal
    //		this._box_node = null;
    //		this._text_node = null;
    //		this._icon_node = null;
    //	}
    //};

    _pIconTextElement.create = function (win)
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            this._createElementHandle(owner_elem, win._doc);
            this._created = true;
        }
    };

    /*
    _pIconTextElement._getComputedStyle = function (prop)
    {
        var handle = this._box_node;
        if (handle)
        {
            var style = window.getComputedStyle(handle, null);
            return style.getPropertyValue(prop);
        }
    };
    */

    // for innerHTML
    _pIconTextElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();

            var _type = this._contents_type;
            if (_type)
            {
                var handle_style = this._getCommonStyleStr();
                var box_style = "";
                var text_style = "";
                var value_str = "";


                if (_type == 1 || _type == 3)
                {
                    if (this.textAlign)
                        box_style += nexacro.__getHTMLStyle_textAlign(this.textAlign, this.rtl);
                    if (this.verticalAlign)
                        box_style += nexacro.__getHTMLStyle_verticalAlign(this.verticalAlign);
                }
                else if (_type == 2)
                {
                    var textAlign = this.textAlign;
                    if (textAlign || this.verticalAlign)
                        box_style += nexacro.__getHTMLStyle_BKImageAlign(textAlign, this.verticalAlign);
                }

                if (_type == 1)
                {
                    if (this._use_decoration)
                        value_str = nexacro.__getHTMLAttr_DecorateText(this.text);
                    else
                        value_str = nexacro.__getHTMLAttr_Text(this.text, this.wordWrap || this._wordwrap_info);
                }
                else if (_type == 2)
                {
                    box_style += nexacro.__getHTMLStyle_BKImageUrl(this.icon._sysurl);
                }
                else if (_type == 3)
                {
                    if (this.textwidth)
                    {
                        text_style += nexacro.__getHTMLStyle_TextWidth(parseInt(this.textwidth));
                    }
                    if (this.textPadding)
                        text_style += nexacro.__getHTMLStyle_PaddingObject(this.textPadding, this.rtl);

                    if (this.iconPos == "left" || this.iconPos == "right")
                        text_style += nexacro.__getHTMLStyle_Display("inline-block");

                    if (this._use_decoration)
                        value_str = nexacro.__getHTMLAttr_DecorateText(this.text);
                    else
                        value_str = nexacro.__getHTMLAttr_Text(this.text, this.wordWrap || this._wordwrap_info);
                }

                var classname = this._getElementClassName(), str = "";
                if (_type == 1)
                {
                    str = "<div id='" + this.name + "' class='" + classname + "'";
                    str = this._on_createAccessibilityCommand(str);
                    str += (handle_style || box_style) ? (" style='" + handle_style + box_style + "'>") : ">";
                    str += value_str + "</div>";
                }
                else if (_type == 2)
                {
                    str = "<div id='" + this.name + "' class='" + classname + "'";
                    str = this._on_createAccessibilityCommand(str);
                    str += (handle_style || box_style) ? (" style='" + handle_style + box_style + "'>") : ">";
                    str += "</div>";
                }
                else if (_type == 3)
                {
                    str = "<div id='" + this.name + "' class='" + classname + "'";
                    str = this._on_createAccessibilityCommand(str);
                    str += (handle_style || box_style) ? (" style='" + handle_style + box_style + "'>") : ">";

                    if (this.iconPos == "left" || this.iconPos == "top")
                    {
                        str += "<img " + nexacro.__getDOMNode_Alt("");
                        str += " class='" + this._getElementNexaClassName("nexaiconitem", undefined, "img") + "' src='" + this.icon._sysurl + "'/>";
                        str += "<div class='" + this._getElementNexaClassName("nexatextitem") + "'";
                        str += (text_style) ? (" style='" + text_style + "'>") : ">";
                        str += value_str + "</div>";
                    }
                    else
                    {
                        str += "<div class='" + this._getElementNexaClassName("nexatextitem") + "'";
                        str += (text_style) ? (" style='" + text_style + "'>") : ">";
                        str += value_str + "</div>";
                        str += "<img " + nexacro.__getDOMNode_Alt("");
                        str += " class='" + this._getElementNexaClassName("nexaiconitem", undefined, "img") + "' src='" + this.icon._sysurl + "'/>";
                    }

                    str += "</div>";
                }
                return str;
            }
        }
        return "";
    };

    _pIconTextElement.attachHandle = function (win)
    {
        if (this.name && !this._created)
        {
            var handle = win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
                handle._linked_element = this;

                this._box_node = handle;
                if (this._contents_type == 3)
                {
                    var box_node = handle;
                    if (this.iconPos == "left" || this.iconPos == "top")
                    {
                        this._icon_node = box_node.firstChild;
                        this._text_node = box_node.lastChild;
                    }
                    else
                    {
                        this._text_node = box_node.firstChild;
                        this._icon_node = box_node.lastChild;
                    }
                }
            }
            this._created = true;
        }
    };

    _pIconTextElement.destroy = function ()
    {
        this._destroyElementHandle();

        this.owner_elem = null;
        this._box_node = null;
        this._text_node = null;
        this._icon_node = null;

        this._p_parent = null;
        this.parent_elem = null;
        this._created = false;
    };


    _pIconTextElement.setElementPadding = function (padding)
    {
        if (this.padding != padding)
        {
            this.padding = padding;
            var handle = this.handle;

            if (handle)
            {
                nexacro.__setDOMStyle_PaddingObject(handle.style, padding, this.rtl);
            }
        }
    };

    _pIconTextElement.setElementTextAlign = function (textalign)
    {
        if (this.textAlign != textalign)
        {
            this.textAlign = textalign;

            var box_node = this._box_node;

            if (box_node)
            {
                var _type = this._contents_type;
                if (_type == 1 || _type == 3)
                {
                    nexacro.__setDOMStyle_textAlign(box_node.style, textalign, this.rtl);
                }
                else
                {
                    if (textalign)
                        nexacro.__setDOMStyle_BKImageTextAlign(box_node.style, textalign);
                    //nexacro.__setDOMStyle_BKImageAlign(box_node.style, textalign, this.verticalAlign || "middle");
                    else
                        nexacro.__clearDOMStyle_BKImageTextAlign(box_node.style);

                }
            }
        }
    };
    _pIconTextElement.setElementVerticalAlign = function (verticalalign)
    {
        if (this.verticalAlign != verticalalign)
        {
            this.verticalAlign = verticalalign;

            var box_node = this._box_node;
            if (box_node)
            {
                var _type = this._contents_type;
                if (_type != 2)
                {
                    nexacro.__setDOMStyle_verticalAlign(box_node.style, verticalalign);
                }
                else
                {
                    if (verticalalign)
                        nexacro.__setDOMStyle_BKImageVerticalAlign(box_node.style, verticalalign);
                    else
                        nexacro.__clearDOMStyle_BKImageVerticalAlign(box_node.style);

                }
            }
        }
    };

    _pIconTextElement.setElementTextPadding = function (textPadding)
    {
        if (this.textPadding != textPadding)
        {
            this.textPadding = textPadding;
            var text_node = this._text_node;

            if (text_node)
            {
                nexacro.__setDOMStyle_PaddingObject(text_node.style, textPadding, this.rtl);
            }
        }
    };

    _pIconTextElement.setElementTextWidth = function (textwidth)
    {
        if (this.textwidth != textwidth)
        {
            this.textwidth = textwidth;

            var text_node = this._text_node;
            if (text_node)
            {
                var _type = this._contents_type;
                if (_type == 3)
                {
                    var _textwidth = parseInt(textwidth);
                    if (_textwidth > 0)
                        nexacro.__setDOMStyle_TextWidth(text_node.style, _textwidth);
                    else
                        nexacro.__clearDOMStyle_TextWidth(text_node.style);
                }
            }
        }
    };

    _pIconTextElement.setElementText = function (text)
    {
        if (this.text !== text || this._use_decoration == true)
        {
            this.text = text;
            this._use_decoration = false;

            var _type = 0;
            var icon_url = this.icon ? (this.icon.value == "none" ? undefined : this.icon._sysurl) : undefined;
            if (icon_url && text)
                _type = 3;
            else if (icon_url)
                _type = 2;
            else if (text)
                _type = 1;

            if (this._contents_type != _type)
            {
                this._contents_type = _type;
                if (this._created)
                {
                    this._destroyElementHandle();
                    this._createElementHandle(this.owner_elem);
                }
            }
            else
            {
                if (this._created)
                {
                    if (_type == 1)
                    {
                        var box_node = this._box_node;
                        if (box_node)
                        {
                            nexacro.__setDOMNode_Text(box_node, text, this.wordWrap || this._wordwrap_info);
                        }
                    }
                    else if (_type == 3)
                    {
                        var text_node = this._text_node;
                        if (text_node)
                        {
                            nexacro.__setDOMNode_Text(text_node, text, this.wordWrap || this._wordwrap_info);
                        }
                    }
                }
            }
        }
    };

    _pIconTextElement.setElementDecorateText = function (text)
    {
        if (this.text != text || this._use_decoration == false)
        {
            this.text = text;
            this._use_decoration = true;

            var _type = 0;
            var icon_url = this.icon ? (this.icon.value == "none" ? undefined : this.icon._sysurl) : undefined;
            if (icon_url && text)
                _type = 3;
            else if (icon_url)
                _type = 2;
            else if (text)
                _type = 1;

            if (this._contents_type != _type)
            {
                this._contents_type = _type;
                if (this._created)
                {
                    this._destroyElementHandle();
                    this._createElementHandle(this.owner_elem);
                }
            }
            else
            {
                if (this._created)
                {
                    if (_type == 1)
                    {
                        var box_node = this._box_node;
                        nexacro.__setDOMNode_DecorateText(box_node, text);
                    }
                    else if (_type == 3)
                    {
                        var text_node = this._text_node;
                        nexacro.__setDOMNode_DecorateText(text_node, text);
                    }
                }
            }
        }
    };

    _pIconTextElement.setElementWordWrap = function (wordwrap)
    {
        // this prop is css set --> use class selector  -> css inline property (map & css)
        if (this.wordWrap != wordwrap)
        {
            var oldwordwrap = this.wordWrap || this._wordwrap_info;
            this.wordWrap = wordwrap;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNodeStyle_WordWrap(handle.style, wordwrap);
                if (this._created && this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                {
                    var _type = this._contents_type;
                    if (_type == 1)
                    {
                        var box_node = this._box_node;
                        if (box_node)
                        {
                            nexacro.__setDOMNode_Text(box_node, this.text, wordwrap);
                        }
                    }
                    else if (_type == 3)
                    {
                        var text_node = this._text_node;
                        if (text_node)
                        {
                            nexacro.__setDOMNode_Text(text_node, this.text, wordwrap);
                        }
                    }
                }
            }
        }
    };

    _pIconTextElement.setElementCSSMapInfo = function (wordwrap)
    {
        if (this._wordwrap_info != wordwrap)
        {
            var oldwordwrap = this.wordWrap || this._wordwrap_info;
            this._wordwrap_info = wordwrap;
            var handle = this.handle;
            if (handle)
            {
                if (!this.wordWrap && this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                {
                    var _type = this._contents_type;
                    if (_type == 1)
                    {
                        var box_node = this._box_node;
                        if (box_node)
                        {
                            nexacro.__setDOMNode_Text(box_node, this.text, wordwrap);
                        }
                    }
                    else if (_type == 3)
                    {
                        var text_node = this._text_node;
                        if (text_node)
                        {
                            nexacro.__setDOMNode_Text(text_node, this.text, wordwrap);
                        }
                    }
                }
            }
        }
    };

    _pIconTextElement.setElementIcon = function (icon)
    {
        if (this.icon != icon)
        {
            this.icon = icon;

            var icon_url = icon ? (icon.value == "none" ? undefined : icon._sysurl) : undefined;

            var _type = 0;
            if (icon_url && this.text)
                _type = 3;
            else if (icon_url)
                _type = 2;
            else if (this.text)
                _type = 1;

            if (this._contents_type != _type)
            {
                this._contents_type = _type;
                if (this._created)
                {
                    if (this._contents_type == 0)
                        this._destroyElementHandle();   //destroy 없이 처리 (status 변경처리관련)
                    this._createElementHandle(this.owner_elem);
                }
            }
            else
            {
                if (this._created)
                {
                    if (_type == 2)
                    {
                        var box_node = this._box_node;
                        nexacro.__setDOMStyle_BKImageUrl(box_node.style, icon_url);
                    }
                    else if (_type == 3)
                    {
                        var icon_node = this._icon_node;
                        nexacro.__setDOMNode_ImageUrl(icon_node, icon_url);
                    }
                }
            }
        }
    };

    _pIconTextElement.setElementIconPos = function (icon_pos)
    {
        var pos = ["left", "right", "top", "bottom"];
        if (pos.indexOf(icon_pos) < 0)
            icon_pos = "left";

        if (this.iconPos != icon_pos)
        {
            var oldpos = this.iconPos;
            this.iconPos = icon_pos;

            if (this._created && this._contents_type == 3)
            {
                var text_node = this._text_node;
                var icon_node = this._icon_node;
                var box_node = this._box_node;

                if (oldpos)
                {
                    if (icon_pos == "left" || icon_pos == "right")
                    {
                        if (oldpos == "top" || oldpos == "bottom")
                            nexacro.__setDOMStyle_Display(text_node.style, "inline-block");
                    }
                    else
                    {
                        if (oldpos == "left" || oldpos == "right")
                            nexacro.__setDOMStyle_Display(text_node.style, "block");
                    }

                    if (icon_pos == "left" || icon_pos == "top")
                    {
                        if (oldpos == "right" || oldpos == "bottom")
                            nexacro.__appendDOMNode(box_node, text_node);
                    }
                    else
                    {
                        if (oldpos == "left" || oldpos == "top")
                            nexacro.__appendDOMNode(box_node, icon_node);
                    }
                }
                else
                {
                    switch (icon_pos)
                    {
                        case "left":
                            nexacro.__setDOMStyle_Display(text_node.style, "inline-block");
                            nexacro.__appendDOMNode(box_node, text_node);
                            break;
                        case "right":
                            nexacro.__setDOMStyle_Display(text_node.style, "inline-block");
                            break;
                        case "top":
                            nexacro.__appendDOMNode(box_node, text_node);
                            break;

                    }
                }
            }
        }
    };

    //======================================================================
    // nexacro.ImageElement - this Element
    //======================================================================
    nexacro.ImageElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "image");
    };
    var _pImageElement = nexacro._createPrototype(nexacro.Element, nexacro.ImageElement);
    nexacro.ImageElement.prototype = _pImageElement;
    // overide nexacro.Control

    _pImageElement._type_name = "ImageElement";
    _pImageElement.typeselector = "nexaimagebox";

    //==== defaule values =========//
    _pImageElement.image = null;

    _pImageElement.padding = null;
    //==== internal handles =========//
    _pImageElement._created = false;

    //==== end of initial =========//

    _pImageElement._createElementHandle = function (owner_elem, _doc)
    {
        if (this.image)
        {
            _doc = _doc || owner_elem._getRootWindowHandle();
            var handle = _doc.createElement("img");
            if (handle)
            {
                handle.id = this.name;
                handle._linked_element = this;

                this.handle = handle;

                nexacro.__setDOMNode_Alt(handle, "");

                /////////////////////////////////
                var handle_style = handle.style;

                // update Common Style
                this._refreshCommonStyleProps(handle_style);

                nexacro.__setDOMNode_ImageUrl(handle, this.image._sysurl);
                nexacro.__setDOMStyle_Pos(handle.style, this.left, this.top);
                nexacro.__setDOMNode_ClassName(handle, this._getElementNativeClassName("img"));

                // append TO Parent Element
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);

            }
        }
    };
    //_pImageElement._destroyElementHandle = function ()
    //{
    //	var handle = this.handle;
    //	if (handle)
    //	{
    //		handle._linked_element = null;
    //		var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
    //		nexacro.__removeDOMNode(dest_handle, handle);

    //		this.handle = null;
    //	}
    //};

    _pImageElement.create = function (win)
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle && !this.handle)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            this._createElementHandle(owner_elem, win._doc);
            this._created = true;
        }
    };

    _pImageElement.createCommand = function ()
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();

            if (this.image)
            {
                /////////////////////////////////
                var handle_style = this._getCommonStyleStr();
                var str = "<img " + nexacro.__getDOMNode_Alt("");
                str += " id='" + this.name + "' class='" + this._getElementNexaClassName("nexaimagebox", undefined, "img") + "'";
                str += " src='" + this.image._sysurl + "'";
                str = this._on_createAccessibilityCommand(str);
                str += (handle_style) ? (" style='" + handle_style + "'/>") : "/>";
                return str;
            }
        }
        return "";
    };
    _pImageElement.attachHandle = function (win)
    {
        if (this.name && !this._created)
        {
            var handle = win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
                handle._linked_element = this;
            }
            this._created = true;
        }
    };

    _pImageElement.destroy = function ()
    {
        this._destroyElementHandle();
        this.owner_elem = null;
        this._p_parent = null;
        this.parent_elem = null;
        this._created = false;
    };



    _pImageElement.setElementPadding = function (padding)
    {
        if (this.padding != padding)
        {
            this.padding = padding;
            var handle = this.handle;

            if (handle)
            {
                nexacro.__setDOMStyle_PaddingObject(handle.style, padding, this.rtl);
            }
        }
    };


    _pImageElement.setElementImage = function (image)
    {
        if (this.image != image)
        {
            this.image = image;

            if (image)
            {
                if (this.handle)
                    nexacro.__setDOMNode_ImageUrl(this.handle, image._sysurl);
                else if (this.owner_elem)
                    this._createElementHandle(this.owner_elem);
            }
            else
            {
                if (this.handle)
                    this._destroyElementHandle();
            }

        }
    };

    _pImageElement.getImageCount = nexacro._emptyFn;
    _pImageElement.setImageIndex = nexacro._emptyFn;

    //_pImageElement.setElementImageBase64 = _pImageElement.setElementImageUrl;

    // end of ImageElement

    //======================================================================
    // nexacro.InputElement - this Element
    //======================================================================
    nexacro.InputElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "input");

        this._composer = new nexacro._CompositionState();
        this._imelocale = new nexacro._ImeLocale();
    };

    var _pInputElement = nexacro._createPrototype(nexacro.Element, nexacro.InputElement);
    nexacro.InputElement.prototype = _pInputElement;

    _pInputElement._type_name = "InputElement";
    _pInputElement.typeselector = "nexainput";

    _pInputElement.textAlign = null;
    _pInputElement.padding = null;
    _pInputElement.caretcolor = null;
    _pInputElement.selectcolor = null;
    _pInputElement.selectbackground = null;
    _pInputElement.compositecolor = null;

    _pInputElement.enable = true;
    _pInputElement.useime = "global";
    _pInputElement.imemode = "auto";
    _pInputElement.readonly = false;
    _pInputElement.maxlength = 0;       // length unit 처리때문에 DOM Attribute 사용할 수 없음
    _pInputElement.autoskip = false;
    _pInputElement.autoselect = false;
    _pInputElement.value = null;
    _pInputElement.defaultvalue = "";
    _pInputElement.displaynulltext = "";
    _pInputElement.displayinvalidtext = undefined;
    _pInputElement.tabindentsize = 4;
    _pInputElement.usesoftkeyboard = true;
    _pInputElement.inputtype = "text"; // ['text', 'password', 'number']
    _pInputElement.tabindex = 0; //설정 안해도 HTML default 0

    _pInputElement._keypad_type = "text"; // ['text(default)', 'password', 'number', 'tel'] for HTML inputmode

    _pInputElement._is_focused = false;
    _pInputElement._is_sys_focused = false;

    _pInputElement._is_input_touchstart = false;
    _pInputElement._is_input_element = true;
    _pInputElement._is_invalid_value = false;

    _pInputElement._accept_focus_process = true;
    _pInputElement._accept_blur_process = true;

    _pInputElement._accept_keypadrestore_process = false;

    _pInputElement._zerolength_value = undefined;
    _pInputElement._input_text = "";
    _pInputElement._disabled_color = null;
    _pInputElement._imedisable = false;

    _pInputElement._checkmax_editing_only = true;        // 'set value' or 'set focus'
    _pInputElement._last_selection_range = null; // for blur

    _pInputElement._BeforeinputState = {};
    _pInputElement._BeforeinputState.PASS = 0;
    _pInputElement._BeforeinputState.CANCEL = 1;
    _pInputElement._BeforeinputState.CONVERT_UPPER = 2;
    _pInputElement._BeforeinputState.CONVERT_LOWER = 3;
    _pInputElement._BeforeinputState.REPLACE = 4;
    _pInputElement._BeforeinputState.MAXLENGTH = 5;
    _pInputElement._BeforeinputState.PREVENT_DEFAULT = 6;

    _pInputElement._beforeinput_result_data = null;
    _pInputElement._beforeinput_result_pos = null;
    _pInputElement._beforeinput_result_insert_data = null;
    _pInputElement._delay_pos = null;

    _pInputElement._forced_fire_event_list = [];
    _pInputElement._paste_caret_pos = null; // for paste

    _pInputElement._use_timer = false;

    // css pseudoclass 관리
    _pInputElement._status_csspseudoclass = {
        AUTOFILL: 0
    };

    _pInputElement.MOUSE_LBUTTON = 0;
    _pInputElement.MOUSE_MBUTTON = 1;
    _pInputElement.MOUSE_RBUTTON = 2;

    _pInputElement._use_html_maxlength = false;
    _pInputElement._skip_sys_keyinput = false;
    _pInputElement._skip_check_imelocale = false;
    _pInputElement._force_focus = false;

    // HTMLInputDomElement의 beforeinput Event의 사용 여부
    if ((nexacro._Browser == "Chrome" && nexacro._BrowserVersion >= 60) || nexacro._Browser == "Edge")
    {
        // 크롬 브라우저에서 keydown prevent가 ImeContext의 생성을 막지 않음.
        _pInputElement._use_event_beforeinput = true;
    }
    else
    {
        _pInputElement._use_event_beforeinput = false;
    }
    _pInputElement._evtorder_compositionend_is_last = false;

    // kindlion: 현재 한글 테스트 할때는 없어도 되는 코드
    // compositionend 에서 oninput이 자연적으로 발생하는지의 구분
    if (nexacro._OS == "iOS" ||
        (nexacro._OS == "Mac OS" && nexacro._Browser == "Safari" && (function (version_arr)
        {
            return (((version_arr[0] | 0) === 10 && (version_arr[1] | 0) >= 14) || (version_arr[0] | 0) > 10);
        })(nexacro._OSVersion.split('.')))
    )
    {
        // oncompositionend --> (forced fire)oninput
        // ex : japaness compositionend
        _pInputElement._evtfire_oninput_after_compositionend = false;
    }
    else
    {
        // oncompositionend --> oninput
        _pInputElement._evtfire_oninput_after_compositionend = true;
    }

    if ((nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari") ||
        (nexacro._OS == "Mac OS" && nexacro._Browser == "Safari"))        
    {
        _pInputElement._apple_default_browser = true;
    }
    else
    {
        _pInputElement._apple_default_browser = false;
    }

    // backspace key입력 시 onkeydown이벤트 발생 여부
    if (nexacro._OS == "Android" && nexacro._Browser == "Chrome" && nexacro._BrowserVersion <= 34)
    {
        _pInputElement._evtfire_oninput_only_when_backspacekey = true;
    }
    else
    {
        _pInputElement._evtfire_oninput_only_when_backspacekey = false;
    }

    // keypad type for number type
    if (nexacro._OS == "iOS" && (nexacro._SystemType == "iphone" || nexacro._SystemType == "ipad"))
    {
        _pInputElement._NUMERIC_KEYPAD_TYPE = "number";
    }
    else if (nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows Phone" || nexacro._AndroidDesktopMode == true)
    {
        _pInputElement._NUMERIC_KEYPAD_TYPE = "tel";
    }
    else
    {
        _pInputElement._NUMERIC_KEYPAD_TYPE = "text";
    }

    if (nexacro._OS == "Android")
    {
        _pInputElement._INDICATOR_WIDTH = 32;
    }
    else
    {
        _pInputElement._INDICATOR_WIDTH = 0;
    }

    _pInputElement._createElementHandle = function (owner_elem, _doc)
    {
        var handle = this.handle = _doc.createElement("input");
        var handle_style = handle.style;

        handle.id = this.name;
        nexacro.__setDOMNode_ClassName(handle, this._getElementClassName("input"));

        handle._linked_element = this;

        this._refreshCommonStyleProps(handle_style);
        this._setElementDefaultLineHeight();

        if (this.textAlign)
        {
            nexacro.__setDOMStyle_textAlign(handle_style, this.textAlign, this.rtl);
        }

        if (this.padding)
        {
            nexacro.__setDOMStyle_PaddingObject(handle_style, this.padding, this.rtl);
        }

        if (!this.enable)
        {
            nexacro.__setDOMNode_Enable(handle, false);
        }

        if (this.readonly)
        {
            nexacro.__setDOMNode_ReadOnly(handle, true);
        }

        if (!nexacro._isNull(this.value) || this.value === "")
        {
            if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
            {
                nexacro.__setDOMNode_Value(handle, this.displayinvalidtext);
                nexacro.__setDOMNode_Type(handle, "text");
            }
            else
            {
                nexacro.__setDOMNode_Value(handle, this.value);
                nexacro.__setDOMNode_Type(handle, this.inputtype);
            }

        }
        else if (this.displaynulltext)
        {
            nexacro.__setDOMNode_Value(handle, this.displaynulltext);
            nexacro.__setDOMNode_Type(handle, "text");
        }
        else if (this.inputtype)
            nexacro.__setDOMNode_Type(handle, this.inputtype);

        if (this.imemode)
        {
            nexacro.__setDOMNode_ImeMode(handle, this.imemode);
        }

        if (this.maxlength > 0 && this._use_html_maxlength)
        {
            nexacro.__setDOMNode_MaxLength(handle, this.maxlength);
        }

        this._on_createAccessibilityHandle(_doc, owner_elem, handle);

        nexacro.__setDOMNode_Autocomplete(handle, "new-password");

        if (this.handle)
        {
            nexacro.__appendDOMNode(owner_elem.dest_handle, this.handle);
        }
    };

    _pInputElement.create = function (win)
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();
            this._createElementHandle(owner_elem, win._doc);
            this._bindSysEvent();
            this._created = true;
        }
    };

    _pInputElement._destroyInputHandle = function ()
    {
        if (this.handle)
        {
            var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
            this.handle._linked_element = null;

            nexacro.__removeDOMNode(dest_handle, this.handle);

            this.handle = null;
        }
    };

    _pInputElement._destroyLabelHandle = function ()
    {
        if (this._label_handle)
        {
            var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
            nexacro.__removeDOMNode(dest_handle, this._label_handle);
            this._label_handle = null;
        }
    };

    _pInputElement.destroy = function ()
    {
        if (this._restore_scrollpos_timer > 0)
        {
            clearTimeout(this._restore_scrollpos_timer);
            this._restore_scrollpos_timer = 0;
        }

        //var cur_doc = this._getRootWindowHandle();
        //var cur_win = cur_doc.defaultView || cur_doc.parentWindow;
        //nexacro._stopSysObserving(cur_win, "scroll", "onscroll", this._on_sys_scroll);

        this._unbindSysEvent();

        this._destroyInputHandle();

        const env = nexacro.getEnvironment();
        if (env._p_enableaccessibility)
            this._destroyLabelHandle();

        return nexacro.Element.prototype.destroy.call(this);
    };

    _pInputElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();

            var handle_style = this._getCommonStyleStr();

            if (!this.enable)
            {
                handle_style += nexacro.__getHTMLStyle_Enable(this.enable, this._disabled_color);
            }

            if (this.textAlign)
            {
                handle_style += nexacro.__getHTMLStyle_textAlign(this.textAlign, this.rtl);
            }

            if (this.padding)
            {
                handle_style += nexacro.__getHTMLStyle_PaddingObject(this.padding, this.rtl);
            }

            if (this.imemode)
            {
                if (this._imedisable)
                {
                    handle_style += nexacro.__getHTMLStyle_ImeMode("disabled");
                }
                else
                {
                    handle_style += nexacro.__getHTMLStyle_ImeMode(this.imemode);
                }
            }

            handle_style += this._getElementDefaultLineHeight();

            var handle_attr =
                nexacro.__getHTMLAttr_Enable(this.enable) +
                nexacro.__getHTMLAttr_ReadOnly(this.readonly);
            if (this.maxlength > 0 && this._use_html_maxlength)
            {
                handle_attr += nexacro.__getHTMLAttr_MaxLength(this.maxlength);
            }

            var str = "";
            str += "<input id='" + this.name + "' class='" + this._getElementClassName("input") + "' ";
            str += (handle_style) ? (" style='" + handle_style + "' ") : "";
            if (!nexacro._isNull(this.value) || this.value === "")
            {
                if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                {
                    str += "value ='" + nexacro._encodeXml(this.displayinvalidtext) + "' ";
                    handle_attr += nexacro.__getHTMLAttr_InputType("text");
                }
                else
                {
                    str += "value ='" + nexacro._encodeXml(this.value) + "' ";
                    handle_attr += nexacro.__getHTMLAttr_InputType(this.inputtype);
                }
            }
            else if (this.displaynulltext)
            {
                str += "value ='" + nexacro._encodeXml(this.displaynulltext) + "' ";
                handle_attr += nexacro.__getHTMLAttr_InputType("text");
            }
            else
            {
                str += "value ='" + nexacro._encodeXml(this.defaultvalue) + "' ";
                handle_attr += nexacro.__getHTMLAttr_InputType(this.inputtype);
            }

            // Android는 usesoftkeyboard 지원
            if (nexacro._isTouchInteraction && nexacro._OS == "Android")
            {
                handle_attr += nexacro.__getHTMLAttr_InputMode(this.usesoftkeyboard ? this._keypad_type : "none");
            }
            else
            {
                handle_attr += nexacro.__getHTMLAttr_InputMode(this._keypad_type);
            }

            str += nexacro.__getHTMLAttr_Autocomplete("new-password");

            str += handle_attr ? (" " + handle_attr) : "";
            str = this._on_createAccessibilityCommand(str);
            str += ">";

            return str;
        }
        return "";
    };

    _pInputElement.attachHandle = function (win)
    {
        if (this.name && !this.handle)
        {
            var input_handle = win._doc.getElementById(this.name);
            this.handle = input_handle;
            this.handle._linked_element = this;

            this._bindSysEvent();

            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
                this._label_handle = win._doc.getElementById(this.name + ":label");
        }
    };

    if (nexacro._OS == "Android")
    {
        _pInputElement._getCommonStyleStr = function ()
        {
            var str = "";
            var bPositionRtl = this._isParentRtl();
            //var bPositionRtl = this._isRtl(true);

            if (!this.visible)
                str += nexacro.__getHTMLStyle_Visible(false);
            if (this.display == "none")
                str += nexacro.__getHTMLStyle_Display("none");

            var control = this.linkedcontrol;
            if (control)
            {
                if (control._isFluidContainer(true))
                {
                    if (control._isFluidContainerCalculation())
                    {
                        if (this.left >= 0 || this.top >= 0)
                            str += nexacro.__getHTMLStyle_Pos(this.left, this.top, bPositionRtl);
                    }
                }
                else
                {
                    if (this.left >= 0 || this.top >= 0)
                        str += nexacro.__getHTMLStyle_Pos(this.left, this.top, bPositionRtl);
                }
            }
            else
            {
                if (this.left >= 0 || this.top >= 0)
                    str += nexacro.__getHTMLStyle_Pos(this.left, this.top, bPositionRtl);
            }
            if (this.width >= 0 && this.height >= 0)
                str += nexacro.__getHTMLStyle_Size(this.inputtype == "date" ? this.width + this._INDICATOR_WIDTH : this.width, this.height);

            if (this.color)
                str += nexacro.__getHTMLStyle_ColorObject(this.color);
            if (this.font)
                str += nexacro.__getHTMLStyle_FontObject(this.font);
            if (this.wordSpacing)
                str += nexacro.__getHTMLStyle_WordSpacingObject(this.wordSpacing);
            if (this.letterSpacing)
                str += nexacro.__getHTMLStyle_LetterSpacingObject(this.letterSpacing);
            if (this.textDecoration)
                str += nexacro.__getHTMLStyle_TextDecorationObject(this.textDecoration);
            if (this.rtl != undefined)
                str += nexacro.__getHTMLStyle_Direction(this.rtl);
            if (this.wordWrap)
                str += nexacro.__getHTMLStyle_WordWrap(this.wordWrap);
            return str;
        };

        _pInputElement._refreshCommonStyleProps = function (handle_style)
        {
            //var bPositionRtl = this._isRtl(true);
            var bPositionRtl = this._isParentRtl();
            //var bRtl = this._isRtl();

            if (!this.visible)
                nexacro.__setDOMStyle_Visible(handle_style, false);

            if (this.display == "none")
                nexacro.__setDOMStyle_Display(handle_style, "none");

            //if (this.left || this.top)
            {
                if (this._use_translate_move)
                {
                    nexacro.__setDOMStyle_Pos(handle_style, 0, 0, bPositionRtl);
                    nexacro.__setDOMStyle_Translate(handle_style, this.left, this.top, this.rtl);
                }
                else
                {
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                }
            }

            var linked_control = this.linkedcontrol;
            if (!(linked_control && linked_control._is_frame && (linked_control._isMainFrameBody() && !nexacro._allow_default_pinchzoom)))   //if it is not mainframe
            {
                if (this.width && this.height)
                {
                    nexacro.__setDOMStyle_Size(handle_style, this.inputtype == "date" ? this.width + this._INDICATOR_WIDTH : this.width, this.height);
                }
            }

            // update Element's properties to DOM
            if (this.color)
                nexacro.__setDOMStyle_ColorObject(handle_style, this.color);
            if (this.font)
                nexacro.__setDOMStyle_FontObject(handle_style, this.font);
            if (this.wordSpacing)
                nexacro.__setDOMStyle_WordSpacingObject(handle_style, this.wordSpacing);
            if (this.letterSpacing)
                nexacro.__setDOMStyle_LetterSpacingObject(handle_style, this.letterSpacing);
            if (this.textDecoration)
                nexacro.__setDOMStyle_TextDecorationObject(handle_style, this.textDecoration);

            if (this.rtl !== undefined)
                nexacro.__setDOMStyle_Direction(handle_style, this.rtl);
            if (this.wordWrap)
                nexacro.__setDOMStyle_WordWrap(handle_style, this.wordWrap);
        };
    }

    if (nexacro._OS == "Android")
    {
        _pInputElement.setElementSize = function (width, height)
        {
            if (this.width != width || this.height != height)
            {
                this.width = width;
                this.height = height;

                if (width < 0) width = 0;
                if (height < 0) height = 0;

                if (this.inputtype == "date")
                    width += this._INDICATOR_WIDTH;

                var handle = this.handle;
                if (handle)
                {
                    if (width && height)
                    {
                        nexacro.__setDOMStyle_Size(handle.style, width, height);
                    }
                    else
                        nexacro.__clearDOMStyle_Size(handle.style);

                    this._setElementDefaultLineHeight();
                }
            }
        };
    }
    else
    {
        _pInputElement.setElementSize = function (width, height)
        {
            if (this.width != width || this.height != height)
            {
                this.width = width;
                this.height = height;

                if (width < 0) width = 0;
                if (height < 0) height = 0;

                var handle = this.handle;
                if (handle)
                {
                    if (width && height)
                    {
                        nexacro.__setDOMStyle_Size(handle.style, width, height);
                    }
                    else
                        nexacro.__clearDOMStyle_Size(handle.style);

                    this._setElementDefaultLineHeight();
                }
            }
        };
    }

    _pInputElement.setElementTextAlign = function (textalign)
    {
        if (this.textAlign != textalign)
        {
            this.textAlign = textalign;
            var handle = this.handle;

            if (handle)
            {
                nexacro.__setDOMStyle_textAlign(handle.style, textalign, this.rtl);
            }
        }
    };

    _pInputElement.setElementPadding = function (padding)
    {
        if (this.padding != padding)
        {
            this.padding = padding;
            var handle = this.handle;

            if (handle)
            {
                nexacro.__setDOMStyle_PaddingObject(handle.style, padding, this.rtl);
            }
        }
    };

    _pInputElement.setElementCaretColor = function (color)
    {
        if (this.caretcolor != color)
        {
            this.caretcolor = color;
        }
    };

    _pInputElement.setElementSelectColor = function (color)
    {
        this.selectcolor = color;
    };

    _pInputElement.setElementSelectBackgroundColor = function (color)
    {
        this.selectbackground = color;
    };

    _pInputElement.setElementCompositeColor = function (color)
    {
        this.compositecolor = color;
    };

    _pInputElement.setElementTabindentSize = function (indent)
    {
        this.tabindentsize = indent;
    };

    _pInputElement._setElementDefaultLineHeight = function ()
    {
        if (this.handle)
        {
            nexacro.__setDOMStyle_LineHeightObject(this.handle.style, nexacro.CSSValueObject("100%"));
        }
    };

    _pInputElement._getElementDefaultLineHeight = function ()
    {
        return nexacro.__getHTMLStyle_lineHeight("100%");
    };

    _pInputElement.setElementEnable = function (enable, color)
    {
        if (this.enable != enable)
        {
            this.enable = enable;
            this._disabled_color = (!enable) ? color : null;

            var input_handle = this.handle;
            if (input_handle)
            {
                nexacro.__setDOMNode_Enable(input_handle, enable);
            }
        }
    };

    _pInputElement.setElementReadonly = function (readonly)
    {
        if (this.readonly != readonly)
        {
            this.readonly = readonly;

            var input_handle = this.handle;
            if (input_handle)
            {
                nexacro.__setDOMNode_ReadOnly(input_handle, readonly);
            }
        }
    };

    _pInputElement.setElementAutoSkip = function (v)
    {
        if (this.autoskip != v)
        {
            this.autoskip = v;
        }
    };

    _pInputElement.setElementAutoSelect = function (v)
    {
        if (this.autoselect != v)
        {
            this.autoselect = v;
        }
    };

    _pInputElement.setElementMaxLength = function (length)
    {
        if (this.maxlength != length)
        {
            this.maxlength = length;

            // maxlength 처리
            var input_handle = this.handle;
            if (input_handle)
            {
                if (this._use_html_maxlength)
                {
                    nexacro.__setDOMNode_MaxLength(input_handle, (length > 0) ? length : 65535);
                }

                var text = this.getElementText();
                if (this._is_focused || !this._checkmax_editing_only)
                {
                    if (this.maxlength > 0 && text.length > this.maxlength)
                    {
                        text = text.substring(0, this.maxlength);
                        this._updateInputValue(text);
                    }
                }
            }
        }
    };

    // inputmode none 은 android 적용, tel decimal은 iOS, Android 둘다
    if (nexacro._isTouchInteraction && nexacro._OS == "Android")
    {
        _pInputElement.setElementInputMode = function (inputmode)
        {
            this._keypad_type = inputmode; // 노출 된 속성이 아니기 때문에 변경확인 없이 반영

            var input_handle = this.handle;
            if (input_handle)
            {
                // Android만 usesoftkeyboard 사용
                if (this.usesoftkeyboard == false)
                {
                    inputmode = "none";
                }
                nexacro.__setDOMNode_InputMode(input_handle, inputmode);
            }
        };
    }
    else
    {
        _pInputElement.setElementInputMode = function (inputmode)
        {
            this._keypad_type = inputmode; // 노출 된 속성이 아니기 때문에 변경확인 없이 반영

            var input_handle = this.handle;
            if (input_handle)
            {
                nexacro.__setDOMNode_InputMode(input_handle, inputmode);
            }
        };
    }

    _pInputElement.setElementUseSoftKeyboard = function (usesoftkeyboard)
    {
        if (this.usesoftkeyboard != usesoftkeyboard)
        {
            this.usesoftkeyboard = usesoftkeyboard;
            this.setElementInputMode(this._keypad_type);
        }
    };

    _pInputElement.setElementUseIme = function (useime)
    {
        if (this.useime != useime)
        {
            this.useime = useime;
        }
    };

    _pInputElement.setElementImeMode = function (imemode)
    {
        if (this.imemode != imemode)
        {
            this.imemode = imemode;
            var input_handle = this.handle;
            if (input_handle)
            {
                nexacro.__setDOMNode_ImeMode(input_handle, imemode);
            }
        }
    };

    _pInputElement.setElementDisplayNullText = function (nulltext, applytext)
    {
        var input_handle = this.handle;

        if (this.displaynulltext == nulltext)
            return;

        this.displaynulltext = nulltext;

        if (input_handle)
        {
            if (nexacro._isNull(this.value) && !this._is_focused)
            {
                if (applytext != "" && applytext != undefined)
                    this._updateInputValue(applytext);
                else
                    this._updateInputValue(this.displaynulltext);
            }
        }
    };

    _pInputElement.setElementDisplayInvalidText = function (v)
    {
        if (this.displayinvalidtext == v)
            return;

        this.displayinvalidtext = v;

        var input_handle = this.handle;
        if (input_handle)
        {
            if (this._is_invalid_value)
            {
                this._updateInputValue(this.displayinvalidtext);
            }
        }
    };

    _pInputElement.setElementDefaultValue = function (value)
    {
        if (value != this.defaultvalue)
        {
            this.defaultvalue = value;
        }
    };

    _pInputElement.setElementValue = function (value, bInvalidValue)
    {
        var text = (nexacro._isNull(value) ? this.defaultvalue : (value + ""));
        var inputtype = this.inputtype;
        this._is_invalid_value = (bInvalidValue === true) ? true : false;

        if (!bInvalidValue && (this.value == value) && (this._getInputValue() == text))
            return;

        this.value = value;
        this._input_text = text;

        var input_handle = this.handle;
        var comp = this.parent_elem.linkedcontrol;
        if (input_handle)
        {
            if (bInvalidValue)
            {
                if (!nexacro._isNull(this.displayinvalidtext) && !this._is_focused)
                {
                    inputtype = "text";
                    this._updateInputValue(this.displayinvalidtext);
                }
                else
                    this._updateInputValue(text);
            }
            else
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
                else if (!this._is_focused && this.displaynulltext != "")
                {
                    inputtype = "text";
                    this._updateInputValue(this.displaynulltext);
                }
                else
                {
                    this._updateInputValue(text);
                }
            }

            nexacro.__setDOMNode_Type(input_handle, inputtype);
        }
    };

    _pInputElement.replaceElementText = function (value, begin, end, bselect)
    {
        var input_value = this._getInputValue();
        if (begin < 0)
            return;

        if (end < 0) end = input_value.length;
        if (begin > end)
        {
            end = begin;
        }

        value = (value ? value : "");
        var caretpos = begin + value.length;

        var text = input_value.substring(0, begin) + value + input_value.substring(end);

        if (bselect)
        {
            this._updateInputValue(text, !this._processing_oninput, begin, caretpos);
        }
        else
        {
            this._updateInputValue(text, !this._processing_oninput, caretpos);
        }
    };

    _pInputElement.updateElementText = function (value, caretpos)
    {
        value = (value ? value : "");
        this._updateInputValue(value, !this._processing_oninput, caretpos);
    };

    _pInputElement._updateElementValue = function (value)
    {
        if (this.value == value)
            return;

        if (!value) value = this._zerolength_value;

        this.value = value;
    };

    _pInputElement._setElementUseMaxLength = function (v)
    {
        if (nexacro._Browser == "Gecko")
            this._use_html_maxlength = false;
        else
            this._use_html_maxlength = v;
    };

    _pInputElement._updateInputValue = function (value, fireevent, selectionStart, selectionEnd)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
            {
                if (this._composer && this._composer.isComposing())
                {
                    this._composer.setStatus(nexacro._CompositionState.END, selectionEnd);
                }
            }

            this._input_text = value;
            nexacro.__setDOMNode_Value(input_handle, value);

            if (selectionStart != null && selectionStart > -1)
            {
                if (selectionEnd == -1) selectionEnd = value.length;
                if (selectionEnd == null || selectionEnd < selectionStart)
                    selectionEnd = selectionStart;

                var _doc = this._getRootWindowHandle();
                if (_doc) nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, selectionStart, selectionEnd);
                this._setElementLastSelectionRange([selectionStart, selectionEnd]);
            }
            if (fireevent)
            {
                nexacro.__fireHTMLEvent(input_handle, "input", "oninput");
            }
        }
    };

    // ['text', 'password', 'number', 'tel']
    _pInputElement.setElementInputType = function (type, bImedisable)
    {
        var keypad_type = "text";

        if (type == "number" || type == "tel")
        {
            keypad_type = this._NUMERIC_KEYPAD_TYPE;
            type = "text";
        }
        else if (type == "date")
        {
            type = "date";
        }
        else if (type == "search")
        {
            type = "search";
        }
        else if (type != "password")
        {
            type = "text";
        }

        var input_handle = this.handle;
        if (this._imedisable != bImedisable)
        {
            this._imedisable = bImedisable ? bImedisable : false;
            if (input_handle)
            {
                nexacro.__setDOMNode_ImeMode(input_handle, this._imedisable ? "disabled" : this.imemode);
            }
        }

        if (this.inputtype != type)
        {
            this.inputtype = type;
            if (input_handle)
            {
                nexacro.__changeInputDOMNodeType(input_handle, type);
            }
        }

        this.setElementInputMode(keypad_type);

        /* focus 전후로 input의 type을 변경할 필요가 없음
        if (this.inputtype != type)
        {
            this._keypad_type = type;

            var inputtype = (type == "number" ? "text" : type);
            if (nexacro._OS == "Android" && (type == "number" || type == "tel"))
            {
                inputtype = type;
            }
            if (this.inputtype != inputtype)
            {
                this.inputtype = inputtype;

                if (input_handle)
                {
                    // if type is 'number', it apply on system click event or system focus event function.
                    new_handle = nexacro.__changeInputDOMNodeType(input_handle, inputtype);
                    if (new_handle != input_handle) 
                    {
                        this._unbindSysEvent();

                        new_handle._linked_element = this;
                        input_handle = this.handle = new_handle;

                        this._bindSysEvent();

                        if (this._is_focused)
                        {
                            nexacro.__setInputDOMNodeFocus(input_handle);
                        }
                    }
                }
            }
        }
        */
    };

    _pInputElement.setElementImeAction = nexacro._emptyFn;

    if (nexacro._OS == "iOS" && (nexacro._SystemType == "iphone" || nexacro._SystemType == "ipad"))
    {
        /* focus 시점 전후로 키패드 변경을 사용하지 않음 inputmode 지원 */
        _pInputElement._change_to_keypad_type = nexacro._emptyFn;
        _pInputElement._change_type_on_sys_focus = nexacro._emptyFn;
        _pInputElement._restore_keypad_type = nexacro._emptyFn;

        /* focus 시점 전후로 키패드 변경을 사용하지 않음
        _pInputElement._change_to_keypad_type = function ()
        {
            if (this.readonly || this.inputtype == this._keypad_type || nexacro.test)
                return;

            // set input(keypad) type for iOS - iphone, input type is number
            var input_handle = this.handle;            
            if (input_handle)
            {
                this._caretpos_on_inputtype = this.getElementCaretPos();

                var keypad_type = this._keypad_type;                
                nexacro.__changeInputDOMNodeType(input_handle, keypad_type);
                this._accept_keypadrestore_process = true;
            }
        };        

        _pInputElement._change_type_on_sys_focus = function (type)
        {
            var input_handle = this.handle;
            if (input_handle)
            {
                var text = this._inputtext_on_inputtype;
                var pos = this._caretpos_on_inputtype;

                nexacro.__changeInputDOMNodeType(input_handle, type);

                this._updateInputValue(text ? text : "");
                this.setElementSetSelect(pos.begin, pos.end);

                this._inputtext_on_inputtype = "";
                this._caretpos_on_inputtype = null;

                // input type is changed onfocus,
                // the scroll position will set value of state does hide a keypad on click
                this._restore_scrollpos_onclick = true;

                // bind window's scroll event : If input type is change, it will prevent scroll into view by the keypad. (iOS)
                var cur_doc = this._getRootWindowHandle();
                var cur_win = cur_doc.defaultView || cur_doc.parentWindow;

                nexacro._observeSysEvent(cur_win, "scroll", "onscroll", this._on_sys_scroll);
                var pThis = this;
                this._restore_scrollpos_timer = setTimeout(function ()
                {
                    clearTimeout(pThis._restore_scrollpos_timer);
                    pThis._restore_scrollpos_timer = 0;

                    nexacro._stopSysObserving(cur_win, "scroll", "onscroll", pThis._on_sys_scroll);
                    pThis._restore_scrollpos_onclick = false;
                }, 500);
            }
        };
        */

        _pInputElement._scrollintoview_on_sys_click = function (/*type*/)
        {
            if (this._restore_scrollpos_onclick)
            {
                if (this._restore_scrollpos_timer > 0)
                {
                    clearTimeout(this._restore_scrollpos_timer);
                    this._restore_scrollpos_timer = 0;
                }

                var cur_doc = this._getRootWindowHandle();
                var cur_win = cur_doc.defaultView || cur_doc.parentWindow;

                if (this._scoll_pos)
                {
                    cur_win.scrollTo(this._scoll_pos[0], this._scoll_pos[1]);
                }
                nexacro._stopSysObserving(cur_win, "scroll", "onscroll", this._on_sys_scroll);
                this._restore_scrollpos_onclick = false;
            }
        };

        /*
        _pInputElement._restore_keypad_type = function ()
        {
            var input_handle = this.handle;
            if (input_handle)
            {
                if (this._keypad_type == "number" && this._accept_keypadrestore_process)
                {
                    nexacro.__changeInputDOMNodeType(input_handle, "text");
                    var text = (nexacro._isNull(this.value) ? this.defaultvalue : (this.value + ""));
                    var value = this._getInputValue();
                    if (text != value)
                    {
                        this._updateInputValue(text);

                        var _doc = this._getRootWindowHandle();
                        if (_doc && this.autoselect)
                            nexacro.__setDOMNode_Select(_doc, input_handle);
                    }
                    this._accept_keypadrestore_process = false;
                } 
            }
        };
        */
    }
    else
    {
        _pInputElement._change_to_keypad_type = nexacro._emptyFn;
        _pInputElement._change_type_on_sys_focus = nexacro._emptyFn;
        _pInputElement._scrollintoview_on_sys_click = nexacro._emptyFn;
        _pInputElement._restore_keypad_type = nexacro._emptyFn;
    }

    _pInputElement._fireHTMLEvent = function (handle, name, onname)
    {
        nexacro.__fireHTMLEvent(handle, name, onname);
    };

    _pInputElement._applyElementFocus = function ()
    {
        nexacro.__setInputDOMNodeFocus(this.handle);
    };

    _pInputElement._applyMaxlength = function ()
    {
        var input_handle = this.handle;

        if (this._checkmax_editing_only)
        {
            var newValue = this.value;
            if (!nexacro._isNull(newValue))
            {
                if (this.maxlength > 0 && newValue.length > this.maxlength)
                    newValue = newValue.substring(0, this.maxlength);
            }
            else
            {
                newValue = this.defaultvalue;
            }

            var domValue = this._getInputValue();
            if (domValue !== newValue)
            {
                this._updateInputValue(newValue);
                if (nexacro._isNull(this.value))
                {
                    nexacro.__setDOMNode_Type(input_handle, this.inputtype);
                    nexacro.__setDOMStyle_ColorObject(input_handle.style, "");
                }
            }
        }
    };

    _pInputElement.setElementFocus = function (trigger_type, self_flag)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused)
            {
                this._is_focused = true;
                this._trigger_type = trigger_type;
                if (!this.readonly)
                    this._applyMaxlength();
                else if (this.displaynulltext)
                {
                    var newValue = this.value;
                    if (nexacro._isNull(newValue))
                    {
                        newValue = this.defaultvalue;
                    }

                    var domValue = this._getInputValue();
                    if (domValue !== newValue)
                    {
                        this._updateInputValue(newValue);
                    }
                }
                this._trigger_type = "";

            }

            if (!this._is_sys_focused)
            {
                if (!(nexacro._OS == "iOS" && this.inputtype == "date"))
                {
                    nexacro.__setInputDOMNodeFocus(input_handle, trigger_type);
                }

                //this._restore_keypad_type();
            }
            else
            {
                if (this.autoselect && nexacro._OS == "iOS")
                {
                    if (this._keypad_type == "number")
                    {
                        //this._change_to_keypad_type();
                        nexacro.__setInputDOMNodeFocus(input_handle);
                        //this._restore_keypad_type();
                    }
                }
            }
            nexacro.__setLastFocusedElement(this);
        }
    };

    _pInputElement.setElementBlur = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            var _doc = this._getRootWindowHandle();
            var pThis;

            if (_doc)
            {
                if (this.inputtype != "date")
                {
                    if (nexacro._Browser != "MobileSafari")  //On mobile safari browser, it has a scroll problem. This function is handled by touchstart event.
                    {
                        const env = nexacro.getEnvironment();
                        if (!(env._p_enableaccessibility && env._a11ytype == 5))
                        {
                            var caret_pos = nexacro.__getInputDOMNodeCaretPos(_doc, input_handle);
                            var end_pos = caret_pos ? caret_pos.end : 0;

                            nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, end_pos, end_pos, true);
                        }
                    }
                    //nexacro._removeInputDOMNodeCaret(input_handle);
                    //IE에서 readonly와 disabled 상태에서도 Caret이 생기는 문제로 삽입된 코드로 판단됨, 24에서는 IE 브라우저를 지원하지 않으므로 제거함 RP 100764
                }
            }

            if (this._checkmax_editing_only && this.maxlength > 0)
            {
                var text = (nexacro._isNull(this.value) ? this.defaultvalue : (this.value + ""));
                var value = this._getInputValue();
                if (text != value)
                {
                    this._updateInputValue(text);
                }
            }

            if (this._is_focused)
            {
                this._is_focused = false;

                if (nexacro._Browser != "Gecko")
                {
                    if (this._is_sys_focused)
                    {
                        nexacro.__setDOMNode_Blur(input_handle);
                    }
                }
            }

            if (this.value == null && this.displaynulltext != "")
            {
                if (nexacro._OS == "iOS" && nexacro._SystemType == "iphone")
                {
                    pThis = this;
                    setTimeout(function ()
                    {
                        nexacro.__setDOMNode_Type(input_handle, "text");
                        pThis._updateInputValue(pThis.displaynulltext, false);
                    }, 0);
                }
                else
                {
                    nexacro.__setDOMNode_Type(input_handle, "text");
                    this._updateInputValue(this.displaynulltext, false);
                }
            }
            else
            {
                if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                {
                    if (nexacro._OS == "iOS" && nexacro._SystemType == "iphone")
                    {
                        pThis = this;
                        setTimeout(function ()
                        {
                            nexacro.__setDOMNode_Type(input_handle, "text");
                            pThis._updateInputValue(pThis.displayinvalidtext, false);
                        }, 0);
                    }
                    else
                    {
                        nexacro.__setDOMNode_Type(input_handle, "text");
                        this._updateInputValue(this.displayinvalidtext, false);
                    }
                }

            }
        }
    };

    _pInputElement.setElementSetSelect = function (start, end)
    {
        if (this.inputtype == "date")
            return;

        if ((nexacro._OS == "iOS" || nexacro._OS == "Mac OS") && this.isComposing()) return;

        var input_handle = this.handle;
        if (input_handle)
        {
            var _doc = this._getRootWindowHandle();
            var val = this.getElementText();
            var len = val.length;

            end = (typeof end == 'number') ? (end == -1 ? len : end) : start;

            if (!this._is_focused)
            {
                // selection range is set, node will has focus;
                this._setElementLastSelectionRange([start, end]);
                return;
            }

            var range = end - start;
            if (_doc)
            {
                if (range == len)
                {
                    if (nexacro._isTouchInteraction && nexacro._OS == "iOS")
                    {
                        const env = nexacro.getEnvironment();
                        if (env._p_enableaccessibility)
                        {
                            setTimeout(function ()
                            {
                                nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, start, end);
                            }, 500);
                        }
                        else
                        {
                            nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, start, end);
                        }
                    }
                    else
                    {
                        if (this._use_timer)
                        {
                            setTimeout(function ()
                            {
                                input_handle.focus();
                                nexacro.__setDOMNode_Select(_doc, input_handle);
                            }, 1);
                        }
                        else
                        {
                            nexacro.__setDOMNode_Select(_doc, input_handle);
                        }
                    }
                }
                else
                {
                    nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, start, end);
                }
            }
        }
    };

    _pInputElement._setElementLastSelectionRange = function (range)
    {
        if (range)
        {
            this._last_selection_range = range;
        }
        else
        {
            this._last_selection_range = null;
        }
    };

    _pInputElement.getElementCaretPos = function ()
    {
        var input_handle = this.handle;
        if (input_handle && this.inputtype != "date")
        {
            if (!this._is_focused)
            {
                if (this._last_selection_range)
                {
                    var pos = this._last_selection_range;

                    return { begin: pos[0], end: pos[1] };
                }
                else if (!this._last_selection_range)
                {
                    return -1;
                }
            }
            else
            {
                var _doc = this._getRootWindowHandle();
                if (_doc)
                {
                    return nexacro.__getInputDOMNodeCaretPos(_doc, input_handle);
                }
            }
        }
        return -1;
    };

    _pInputElement.getElementSelectionRange = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused)
            {
                if (this._last_selection_range)
                {
                    return this._last_selection_range;
                }
            }
            else
            {
                var _doc = this._getRootWindowHandle();
                if (_doc)
                {
                    var sel = nexacro.__getInputDOMNodeSelectionRange(_doc, input_handle);
                    return sel.splice(0, 2); // remove direction
                }
            }
        }
        return [0, 0];
    };

    _pInputElement.getElementText = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            return this._getInputValue();
        }
        return this._input_text;
    };

    _pInputElement._getInputValue = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (this._is_focused)
            {
                return nexacro.__getDOMNodeValue(input_handle);
            }
            else
            {
                if (this.displaynulltext)
                {
                    if (this.getInputStatusPseudoClass("AUTOFILL"))
                    {
                        return nexacro.__getDOMNodeValue(input_handle);
                    }
                    else
                    {
                        // for Mobile system calendar                        
                        var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
                        if (bMobile)
                        {
                            return nexacro.__getDOMNodeValue(input_handle);
                        }
                        else
                        {
                            return this._input_text;
                        }
                    }
                }
                else
                {
                    if (this._is_invalid_value)
                    {
                        return this._input_text;
                    }
                    else
                    {
                        return nexacro.__getDOMNodeValue(input_handle);
                    }
                }
            }
        }
        return "";
    };

    _pInputElement.getElementValue = function ()
    {
        return this.value;
    };

    _pInputElement.getCompositionStatus = function ()
    {
        return (this._composer ? this._composer.status : nexacro._CompositionState.NONE);
    };

    _pInputElement.isComposing = function ()
    {
        return (this._composer ? this._composer.isComposing() : false);
    };

    _pInputElement.isCompositEnd = function ()
    {
        return (this._composer ? (this._composer.status == nexacro._CompositionState.END) : false);
    };

    _pInputElement.setCompositionComplete_process = function (end_pos, is_composing)    
    {
        var pos = this.getElementCaretPos();

        var value = this._getInputValue();
        var _is_composing = is_composing ? is_composing : this._composer.isComposing();
        if (_is_composing)
        {
            this._composer.setStatus(nexacro._CompositionState.END, pos.end);
            this._updateInputValue(value, !this._processing_oninput);
        }
    };

    _pInputElement.setCompositionComplete = function (end_pos, is_composing)    
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            this.setCompositionComplete_process.call(this, end_pos, is_composing);

            var pos = this.getElementCaretPos();
            this._composer.setStatus(nexacro._CompositionState.NONE, pos.end);
        }
    };

    _pInputElement.setCompositionCancel_process = function (end_pos, is_composing)
    {
        var _is_composing = is_composing ? is_composing : this._composer.isComposing();
        if (_is_composing)
        {
            var value = this._getInputValue();
            var offset = this._composer.getOffset();
            this._composer.setStatus(nexacro._CompositionState.END, offset.begin);
            this._updateInputValue(value.substring(0, offset.begin), !this._processing_oninput);
        }

    };

    _pInputElement.setCompositionCancel = function (end_pos, is_composing)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            this.setCompositionCancel_process.call(this, end_pos, is_composing);

            var pos = this.getElementCaretPos();
            this._composer.setStatus(nexacro._CompositionState.NONE, pos.end);
        }
    };

    _pInputElement.setInputProcess = function (v)
    {
        this._processing_oninput = v;
    };

    _pInputElement.getInputProcess = function ()
    {
        return this._processing_oninput;
    };

    _pInputElement.setInputStatusPseudoClass = function (pseudoclass, state)
    {
        this._status_csspseudoclass[pseudoclass] = state;
    };

    _pInputElement.getInputStatusPseudoClass = function (pseudoclass)
    {
        return this._status_csspseudoclass[pseudoclass];
    };

    _pInputElement.setElementAccessibilityStatAutoComplete = nexacro._emptyFn;
    _pInputElement.setElementAccessibilityStatExpanded = nexacro._emptyFn;
    _pInputElement.setElementAccessibilityFlagHasPopup = nexacro._emptyFn;
    _pInputElement.setElementAccessibilityInfoValueMax = nexacro._emptyFn;
    _pInputElement.setElementAccessibilityInfoValueMin = nexacro._emptyFn;
    _pInputElement.setElementAccessibilityInfoValueCur = nexacro._emptyFn;
    _pInputElement._setElementInputRole = nexacro._emptyFn;
    _pInputElement._wantAccessibilityAdditionalLabel = nexacro._emptyFn;
    _pInputElement._updateElementAccessibilityLabel = nexacro._emptyFn;

    _pInputElement._checkMaxLength = function (value, caretpos, fix_composition)
    {
        var maxlength = this.maxlength;
        if (maxlength <= 0 && caretpos <= 0)
        {
            return;
        }

        var vlength = value.length;
        var _is_composing = this._composer.isComposing();
        if (maxlength < vlength) // over length
        {
            if (this._use_html_maxlength && _is_composing)
                return;

            var _has_candidate_window;
            if (_is_composing && !fix_composition)
            {
                _has_candidate_window = this._composer.isHasCandiateWindow(value.charAt(caretpos - 1));
            }

            //var bcheck;
            //var status = this._composer.status;
            // nexacro._CompositionState.NONE - for keypress, paste -
            // nexacro._CompositionState.COMPOSING & has not candidate window - for korean
            // nexacro._CompositionState.END - for all CJK
            //if (!_is_composing || !_has_candidate_window)
            if (fix_composition || !_is_composing || !_has_candidate_window)
            {
                return { "ismax": true, "pos": (caretpos - (vlength - maxlength)) };
            }
            else //(_is_composing && _has_candidate_window) // japanese/chinese composing
            {
                // confirmed value length == maxlength
                var offset = this._composer.getOffset();
                if (maxlength == (vlength - (offset.end - offset.begin)))
                {
                    return { "ismax": true, "pos": (caretpos - (vlength - maxlength)) };
                }
            }
        }
        else
        {
            return { "ismax": (!_is_composing && maxlength == vlength), "pos": caretpos };
        }

        return;
    };

    _pInputElement._go_next_focus = function ()
    {
        var input_handle = this.handle;
        var comp = this.parent_elem.linkedcontrol;
        if (input_handle && comp)
        {
            var form = comp._getForm();
            var newfocus_comp = form._searchNextTabFocus(form._last_focused, undefined, undefined, 0);

            if (newfocus_comp && newfocus_comp[0])
            {
                if (newfocus_comp[0]._hasContainer() && newfocus_comp[0]._last_focused)
                {
                    var win = form._getWindow();
                    win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
                }

                if (newfocus_comp[0]._has_inputElement)
                {
                    newfocus_comp[0]._processing_autoskip = true;
                }


                newfocus_comp[0]._setFocus(true, 0, true);

                if (!newfocus_comp[0]._p_autoselect && newfocus_comp[0]._is_editable_control)
                    newfocus_comp[0]._setDefaultCaret();
            }
        }
    };

    _pInputElement._bindSysEvent = function ()
    {
        var input = this.handle;
        if (input)
        {
            nexacro._observeSysEvent(input, "keydown", "onkeydown", this._on_sys_keydown);
            nexacro._observeSysEvent(input, "keyup", "onkeyup", this._on_sys_keyup);
            nexacro._observeSysEvent(input, "keypress", "onkeypress", this._on_sys_keypress);

            if (this._use_event_beforeinput)
                nexacro._observeSysEvent(input, "beforeinput", "onbeforeinput", this._on_sys_beforeinput_forward);

            nexacro._observeSysEvent(input, "input", "oninput", this._on_sys_keyinput_forward);

            nexacro._observeSysEvent(input, "compositionstart", "oncompositionstart", this._on_sys_compositionstart);
            nexacro._observeSysEvent(input, "compositionupdate", "oncompositionupdate", this._on_sys_compositionupdate);
            nexacro._observeSysEvent(input, "compositionend", "oncompositionend", this._on_sys_compositionend);

            nexacro._observeSysEvent(input, "cut", "oncut", this._on_sys_cut);
            nexacro._observeSysEvent(input, "paste", "onpaste", this._on_sys_paste);

            nexacro._observeSysEvent(input, "mousedown", "onmousedown", this._on_sys_mousedown);
            nexacro._observeSysEvent(input, "mouseup", "onmouseup", this._on_sys_mouseup);

            nexacro._observeSysEvent(input, "focus", "onfocus", this._on_sys_focus);
            nexacro._observeSysEvent(input, "blur", "onblur", this._on_sys_blur);

            nexacro._observeSysEvent(input, "select", "onselect", this._on_sys_select);
            nexacro._observeSysEvent(input, "click", "onclick", this._on_sys_click);

            if (nexacro._SupportTouch)
            {
                nexacro._observeSysEvent(input, "touchstart", "ontouchstart", this._on_sys_touchstart);
                nexacro._observeSysEvent(input, "touchend", "ontouchend", this._on_sys_touchend);
            }
            nexacro._observeSysEvent(input, "animationstart", "onanimationstart", this._on_sys_animationstart);
        }
    };

    _pInputElement._unbindSysEvent = function ()
    {
        var input = this.handle;
        if (input)
        {
            nexacro._stopSysObserving(input, "keydown", "onkeydown", this._on_sys_keydown);
            nexacro._stopSysObserving(input, "keyup", "onkeyup", this._on_sys_keyup);
            nexacro._stopSysObserving(input, "keypress", "onkeypress", this._on_sys_keypress);

            if (this._use_event_beforeinput)
                nexacro._stopSysObserving(input, "beforeinput", "onbeforeinput", this._on_sys_beforeinput_forward);

            nexacro._stopSysObserving(input, "input", "oninput", this._on_sys_keyinput_forward);
            nexacro._stopSysObserving(input, "compositionstart", "oncompositionstart", this._on_sys_compositionstart);
            nexacro._stopSysObserving(input, "compositionupdate", "oncompositionupdate", this._on_sys_compositionupdate);
            nexacro._stopSysObserving(input, "compositionend", "oncompositionend", this._on_sys_compositionend);

            nexacro._stopSysObserving(input, "cut", "oncut", this._on_sys_cut);
            nexacro._stopSysObserving(input, "paste", "onpaste", this._on_sys_paste);

            nexacro._stopSysObserving(input, "mousedown", "onmousedown", this._on_sys_mousedown);
            nexacro._stopSysObserving(input, "mouseup", "onmouseup", this._on_sys_mouseup);

            nexacro._stopSysObserving(input, "focus", "onfocus", this._on_sys_focus);
            nexacro._stopSysObserving(input, "blur", "onblur", this._on_sys_blur);

            nexacro._stopSysObserving(input, "select", "onselect", this._on_sys_select);
            nexacro._stopSysObserving(input, "click", "onclick", this._on_sys_click);

            if (nexacro._SupportTouch)
            {
                nexacro._stopSysObserving(input, "touchstart", "ontouchstart", this._on_sys_touchstart);
                nexacro._stopSysObserving(input, "touchend", "ontouchend", this._on_sys_touchend);
            }
            nexacro._stopSysObserving(input, "animationstart", "onanimationstart", this._on_sys_animationstart);
        }
    };

    // 다른 function에서 사용할 properties 설정
    _pInputElement.on_sys_keydown_before_process = function (evt)
    {
        var input_handle = evt.target;
        var pThis = input_handle._linked_element;
        var keycode = nexacro._getSysEventKey(evt);
        var comp = pThis.parent_elem.linkedcontrol;
        var _win = comp._getWindow();

        if ((nexacro._isTouchInteraction && nexacro._SupportTouch) || nexacro._isMobile())
        {
            var _form = comp._p_parent, stepselector = null;
            while (_form)
            {
                if (_form._p_stepselector)
                {
                    stepselector = _form._p_stepselector;
                    break;
                }
                _form = _form._p_parent;
            }

            if (stepselector)
            {
                var steppos = comp._p_positionstep;

                var __form = comp._getForm();
                if (__form instanceof nexacro._InnerForm && (__form._p_parent instanceof nexacro.Div || __form._p_parent instanceof nexacro.PopupDiv ||
                    __form._p_parent instanceof nexacro.Tabpage))
                {
                    var p_positionstep = __form._p_parent._p_positionstep;
                    if (__form.parent instanceof nexacro.Tabpage)
                        p_positionstep = __form._p_parent._p_parent._p_positionstep;

                    if (stepselector._p_stepindex != p_positionstep)
                        stepselector.set_stepindex(steppos);
                }
                else
                {
                    if (stepselector._p_stepindex != steppos)
                        stepselector.set_stepindex(steppos);
                }

            }
        }

        //check capturelock
        var capture_comp;
        if (comp) capture_comp = _win._getCaptureComp(false, true, comp);

        if (capture_comp && capture_comp != comp)
        {
            if (evt.keyCode != 27)
                nexacro._stopSysEvent(evt);
            return false;
        }

        var pos = pThis.getElementCaretPos();
        pThis._composer.setDelayStatus(undefined);

        var is_composing = pThis._composer.isComposing();
        var composer_state = nexacro._CompositionState.NONE;
        var composer_pos = pos.begin;

        if (keycode == nexacro.KeyCode_ImeInput && nexacro._OS != "Android") // 229
        {
            if (is_composing)
            {
                composer_state = nexacro._CompositionState.COMPOSING;
                composer_pos = pos.end;
            }
            else
            {
                if (nexacro._OS == "Windows" && evt.code == "Backspace")
                {
                    var slice_value = input_handle.value;
                    slice_value = slice_value.slice(0, pos.begin - 1) + slice_value.slice(pos.end);

                    if (pos.begin > 0) pos.begin -= 1;
                    pThis.setElementValue(slice_value);
                    pThis.setElementSetSelect(pos.begin, pos.begin);
                    pThis._setElementLastSelectionRange([pos.begin, pos.begin]);
                }
                else
                {
                    composer_state = nexacro._CompositionState.START;
                    composer_pos = pos.begin;
                }
            }
            pThis._composer.setDelayStatus(composer_state, composer_pos);
        }
        else
        {
            if (is_composing)
            {
                composer_state = nexacro._CompositionState.END;
                composer_pos = pos.end;
                pThis._composer.setDelayStatus(composer_state, composer_pos);
            }
            else
            {
                pThis._composer.setStatus(composer_state, composer_pos);
            }
        }

        return true;
    };

    _pInputElement.on_sys_keydown_specialkey_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_keydown_process = function (evt)
    {
        return true;
    };

    _pInputElement._on_sys_keydown = function (evt)
    {
        var input_handle = evt.target;
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis.readonly)
            {
                if (!pThis.on_sys_keydown_before_process.call(pThis, evt)) return;
                pThis.on_sys_keydown_process.call(pThis, evt);
            }
        }
    };

    _pInputElement.on_sys_keyup_before_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_keyup_specialkey_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_keyup_process = function (evt)
    {
        var input_handle = evt.target;
        var pThis = input_handle._linked_element;
        pThis._composer.setDelayStatus(undefined);

        //var pos = pThis.getElementCaretPos();  //currently not in use
        var value = pThis._getInputValue();

        if (nexacro._OS == "Android" && nexacro._Browser == "Chrome" && nexacro._BrowserVersion > "34")
        {
            if (pThis._beforeinput_result_pos && !pThis._composer.isComposing())
            {
                var selectionStart = pThis._beforeinput_result_pos.begin;
                var selectionEnd = pThis._beforeinput_result_pos.end;
                if (selectionStart != null && selectionStart > -1)
                {

                    if (selectionEnd == -1) selectionEnd = value.length;
                    if (selectionEnd == null || selectionEnd < selectionStart)
                        selectionEnd = selectionStart;

                    var _doc = pThis._getRootWindowHandle();
                    if (_doc) nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, selectionStart, selectionEnd);
                }
            }
        }


        return true;
    };

    _pInputElement._on_sys_keyup = function (evt)
    {
        var input_handle = evt.target;
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis.readonly)
            {
                if (!pThis.on_sys_keyup_before_process.call(pThis, evt)) return;
                if (!pThis.on_sys_keyup_specialkey_process.call(pThis, evt)) return;

                pThis.on_sys_keyup_process.call(pThis, evt);

            }

            if (pThis._use_event_beforeinput)
            {
                while (pThis._beforeinput_result && pThis._beforeinput_result.length > 0)
                    pThis._beforeinput_result.pop();

                pThis._beforeinput_result_insert_data = null;
                pThis._beforeinput_result_data = null;
                pThis._beforeinput_result_pos = null;
            }
        }
    };

    _pInputElement.on_sys_keypress_before_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_keypress_process = function (evt)
    {
        var input_handle = evt.target;
        var pThis = input_handle._linked_element;
        var charcode = evt.charCode || evt.keyCode;

        var value = pThis._getInputValue();
        var _range = pThis.getElementSelectionRange();

        var comp = pThis.parent_elem.linkedcontrol;
        var _win = comp._getRootWindow();

        if (_win && _win._keydown_element && nexacro._Browser == "Gecko")
        {
            if (_win._keydown_element !== pThis)
            {
                if ((!comp._grid && comp._processing_autoskip) || (comp._grid && !comp._processing_autoskip && comp._grid._p_autoenter != "key"))
                {
                    comp._processing_autoskip = false;
                    nexacro._stopSysEvent(evt);
                    return false;
                }
            }
        }

        if (!evt.ctrlKey && !evt.altKey && charcode)
        {
            var inputChar = String.fromCharCode(charcode);
            if (inputChar.length > 0)
            {
                if (pThis.autoskip && pThis.maxlength > 0 && value.length >= pThis.maxlength && _range[0] == _range[1])                
                {
                    if (charcode != nexacro.Event.KEY_RETURN)
                        pThis._go_next_focus();
                }
            }
        }

        if (!pThis._use_html_maxlength)
        {
            if (pThis.maxlength > 0 && value.length >= pThis.maxlength && _range[0] == _range[1])
            {
                nexacro._stopSysEvent(evt);
                return false;
            }
        }
    };

    _pInputElement._on_sys_keypress = function (evt)
    {
        var input_handle = evt.target;
        if (input_handle)
        {
            var pThis = input_handle._linked_element;

            if (nexacro._OS == "iOS" || nexacro._OS == "Mac OS")
            {
                pThis._updateImeLocale(evt);

                return false;
            }

            if (!pThis.on_sys_keypress_before_process.call(pThis, evt)) return;

            return pThis.on_sys_keypress_process.call(pThis, evt);


        }
    };

    _pInputElement._is_accept_touch = function (win)
    {
        if (!win && nexacro._Browser == "MobileSafari" && this.isComposing())
        {
            return false;
        }
        else if (nexacro._OS === 'iOS' && win) 
        {
            var lastfocus_elem = win._last_focused_elem;
            if (lastfocus_elem && lastfocus_elem.isInputElement()) 
            {
                if (this !== lastfocus_elem && lastfocus_elem.isComposing())
                {
                    return false;
                }

            }
        }
        return true;
    }

    _pInputElement.on_complete_composition_value_process = function ()
    {
        return true;
    };

    _pInputElement.on_complete_composition_value = function ()    
    {
        return this.on_complete_composition_value_process.call(this);
    };

    _pInputElement.on_apply_imeSet = function (evt)
    {
        var i, len;
        var input_handle = evt ? evt.target : null;
        var pThis = input_handle ? input_handle._linked_element : this;

        var _locale = pThis._imelocale.getLocale();
        if (_locale && nexacro._cache_inputelement_set[_locale])
        {
            // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
            // clear함수 필요

            for (var prop in nexacro._cache_inputelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_inputelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_inputelement_set[_locale][nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]];
            }
        }
        else
        {
            // 기존ime 정보 clear함수 필요

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

        }

        // edit/textarea
        var comp = pThis.parent_elem.linkedcontrol;
        if (comp.on_apply_imeSet) comp.on_apply_imeSet();

        pThis.on_apply_ime_environment(evt);
    };

    _pInputElement.on_apply_ime_environment_process = function (evt)
    {
        var input_handle = evt ? evt.target : this.handle;
        this._setElementUseMaxLength(true);
        nexacro.__setDOMNode_MaxLength(input_handle, this.maxlength);
    };

    _pInputElement.on_apply_ime_environment = function (evt)
    {
        this.on_apply_ime_environment_process.call(this, evt);
    };

    _pInputElement.on_apply_force_imeSet = function (evt)
    {
        return true;
    };

    _pInputElement._updateLocale = function (evt)
    {
        var input_handle = evt.target;
        var pThis = input_handle._linked_element;
        var comp = pThis.parent_elem.linkedcontrol;
        if (comp instanceof nexacro.MaskEdit)
        {
            pThis._skip_check_imelocale = true;
            pThis._imelocale.setLocale("");
            pThis.on_apply_imeSet(evt);
            return;
        }

        var pos = pThis.getElementCaretPos();
        var value = pThis._getInputValue();
        var val = (evt.data || evt.key) || value.substr(pos.end - 1, 1);
        var alpha = /[a-zA-Z]/;
        if (nexacro._OS == "Android" && alpha.test(val))
        {
            return;
        }

        pThis._imelocale.updateLocale(val);
        if (pThis._imelocale.IsChangeLocale())
        {
            pThis.on_apply_imeSet(evt);
        }

        pThis.on_apply_force_imeSet.call(pThis, evt);
    };

    _pInputElement._updateImeLocale = function (evt)
    {
        var input_handle = evt.target;
        var pThis = input_handle._linked_element;

        var comp = pThis.parent_elem.linkedcontrol;
        var e_data;
        var composing_status = pThis._composer.status;
        //var beginOffset, endOffset;

        var value = pThis._getInputValue();
        var pos = pThis.getElementCaretPos();

        var prev_status = pThis._composer._prev_status;

        //var sel = pThis._last_selection_range;  //currently not in use      
        if (this._use_event_beforeinput)
        {
            var beforeinput_data = evt.data;

            if (composing_status != nexacro._CompositionState.END)
            {
                if (beforeinput_data === null)
                {
                    return true;
                }

                // 한자 처리 문제없나?
                if (!pThis.isComposing())
                {
                    // 기존 locale유지                    
                }
                else
                {
                    if (comp instanceof nexacro.MaskEdit)
                    {
                        return true;
                    }

                    // 일반 입력
                    // 일본어 입력, IME상태 한글로 변경, 한글 입력
                    if ((prev_status == nexacro._CompositionState.NONE && composing_status == nexacro._CompositionState.START) ||
                        (prev_status == nexacro._CompositionState.END && composing_status == nexacro._CompositionState.START))
                    {
                        pThis._updateLocale(evt);
                    }
                }
            }
            else
            {
                if (comp instanceof nexacro.MaskEdit)
                {
                    if (composing_status == nexacro._CompositionState.END)
                    {
                        input_handle.blur();
                        input_handle.focus();
                        this.setElementSetSelect(pos.begin, pos.end);
                        return true;
                    }
                }
            }
        }
        else
        {
            if (this._apple_default_browser)
            {
                if (pThis.isComposing() && (comp instanceof nexacro.MaskEdit))
                {
                    input_handle.blur();
                    input_handle.focus();
                    pThis._updateInputValue(comp._p_text, false, pos.begin);
                    return false;
                }

                // ios는 keypress가 먼저 들어온다. (현재는 keypress, keyinput두번 들어온다.)
                // 1/2가 첫 입력에 해당                
                e_data = evt.data || evt.key;
                if (e_data)
                {
                    if (evt.key ||
                        (pThis.isComposing() &&
                            (prev_status == nexacro._CompositionState.START && composing_status == nexacro._CompositionState.COMPOSING)))
                    {
                        var keycode = evt.charCode || evt.keyCode;
                        // 숫자/영문/특수문자 (현재 locale로 진행)
                        if (evt.key && (keycode >= 33 && keycode <= 126))
                            return true;

                        pThis._updateLocale(evt);
                    }
                }

                return true;
            }

            if (pos != -1 && composing_status != nexacro._CompositionState.END)
            {
                if (!pThis.isComposing())
                {
                    //trace("아스키입력");                    
                }
                else
                {
                    // PC safari 
                    // 한글
                    // 첫입력: 0/1 두번째 입력: 2/3, 3/1
                    // 일본어
                    // 첫입력: 0/1 두번째 입력: 2/2

                    if (prev_status == nexacro._CompositionState.NONE && nexacro._CompositionState.START ||     // Safari(PC)
                        prev_status == nexacro._CompositionState.END && nexacro._CompositionState.START ||      // Safari(PC)
                        prev_status == nexacro._CompositionState.START && nexacro._CompositionState.COMPOSING)                        
                    {
                        if (value)
                        {
                            pThis._updateLocale(evt);
                        }
                    }
                }
            }
        }
        return true;
    };

    _pInputElement.on_sys_beforeinput_forward_before_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            var comp = pThis.parent_elem.linkedcontrol;

            if (comp instanceof nexacro.MaskEdit)
            {
                var prev_status = pThis._composer._prev_status;
                var cur_status = pThis._composer.status;
                if (prev_status == nexacro._CompositionState.END && cur_status == nexacro._CompositionState.END)
                {
                    return false;
                }
            }
        }

        return true;
    };

    _pInputElement.on_sys_beforeinput_forward_process = function (evt)
    {
        var input_handle = evt.target;

        var pThis = input_handle._linked_element;
        var comp = pThis.parent_elem.linkedcontrol;

        var beforeinput_data = evt.data;
        var beforeinput_type = evt.inputType;

        var input_value = pThis._getInputValue();
        var input_pos = pThis.getElementCaretPos();
        var composing_status = pThis.getCompositionStatus();
        var beginOffset = input_pos.begin;
        var endOffset = input_pos.end;

        var _win = comp._getWindow();
        var capture_comp;
        if (comp) capture_comp = _win._getCaptureComp(false, true, comp);

        if (capture_comp && capture_comp != comp)
        {
            pThis._beforeinput_result = [pThis._BeforeinputState.CANCEL];
            pThis._beforeinput_result_data = input_value;
            pThis._beforeinput_result_pos = { begin: beginOffset, end: endOffset };
            return false;
        }

        // component beforeinput process
        // 각 컴포넌트에서 입력된 값에 대하여 status 정의.

        // PASS : 입력된 값에 대하여 어떠한 가공도 하지 않음. (Edit, TextArea 기본 입력이 해당)
        // CANCEL : 입력된 값을 취소.
        // CONVERT_(UPPER, LOWER) : 입력된 값을 대, 소문자로 강제 변경. IME입력은 이쪽을 타게해선 안됨.
        // REPLACE : 기존에 입력된 값을 입력된 값으로 변경. (MaskEdit 기본입력이 해당)
        // MAXLENGTH : 입력동작한 동작이 설정된 MAXLENGTH에 도달했거나, 넘어간 경우
        if (beforeinput_data == null && beforeinput_type == "insertLineBreak")
        {
            beforeinput_data = "↵";
        }
        else if (beforeinput_type == "insertCompositionText")
        {
            pThis._composing_start = beginOffset;
            pThis._composing_end = endOffset;
        }

        pThis._beforeinput_result = comp._on_beforekeyinput(pThis, beforeinput_data, composing_status, beginOffset, endOffset, beforeinput_type);

        if (pThis._beforeinput_result)
        {
            pThis._beforeinput_result.forEach(function (state)
            {
                var caret_after_convert, data;
                switch (state)
                {
                    case pThis._BeforeinputState.PASS:
                        //console.log("PASS");
                        break;
                    case pThis._BeforeinputState.CANCEL:
                        //console.log("CANCEL");
                        //Chrome ( 61버전 기준 ) 에서 input event 에서 composition value 강제조정후, caret 보정하면 caret 상태가 조합중같이 보이고있다.
                        pThis._beforeinput_result_data = input_value;
                        pThis._beforeinput_result_pos = { begin: beginOffset, end: endOffset };

                        break;
                    case pThis._BeforeinputState.CONVERT_UPPER:
                        //console.log("CONVERT_UPPER");
                        if (beforeinput_type == "insertFromPaste")
                        {
                            pThis._beforeinput_result_insert_data = pThis._beforeinput_result_insert_data ? pThis._beforeinput_result_insert_data.toUpperCase() : "";
                            data = pThis._beforeinput_result_data;
                            pThis._beforeinput_result_data = data.substring(0, pThis._beforeinput_result_pos.begin - pThis._beforeinput_result_insert_data.length);
                            pThis._beforeinput_result_data += pThis._beforeinput_result_insert_data;
                            pThis._beforeinput_result_data += data.substring(pThis._beforeinput_result_pos.begin);
                        }
                        else if (beforeinput_type != "insertLineBreak")
                        {
                            caret_after_convert = beginOffset + beforeinput_data.length;

                            pThis._beforeinput_result_data = input_value.substring(0, beginOffset) + beforeinput_data.toUpperCase() + input_value.substring(endOffset, input_value.length);
                            pThis._beforeinput_result_pos = { begin: caret_after_convert, end: caret_after_convert };
                        }
                        break;
                    case pThis._BeforeinputState.CONVERT_LOWER:
                        //console.log("CONVERT_LOWER");
                        if (beforeinput_type == "insertFromPaste")
                        {
                            pThis._beforeinput_result_insert_data = pThis._beforeinput_result_insert_data ? pThis._beforeinput_result_insert_data.toLowerCase() : "";
                            data = pThis._beforeinput_result_data;
                            pThis._beforeinput_result_data = data.substring(0, pThis._beforeinput_result_pos.begin - pThis._beforeinput_result_insert_data.length);
                            pThis._beforeinput_result_data += pThis._beforeinput_result_insert_data;
                            pThis._beforeinput_result_data += data.substring(pThis._beforeinput_result_pos.begin);
                        }
                        else if (beforeinput_type != "insertLineBreak")
                        {
                            caret_after_convert = beginOffset + beforeinput_data.length;
                            pThis._beforeinput_result_data = input_value.substring(0, beginOffset) + beforeinput_data.toLowerCase() + input_value.substring(endOffset);
                            pThis._beforeinput_result_pos = { begin: caret_after_convert, end: caret_after_convert };
                        }

                        break;
                    case pThis._BeforeinputState.MAXLENGTH:
                        //console.log("MAXLENGTH");
                        break;
                    case pThis._BeforeinputState.REPLACE:
                        //console.log("REPLACE")
                        //MaskEdit는 component 로직이 많이 필요하므로 component에서 처리.
                        break;
                    case pThis._BeforeinputState.PREVENT_DEFAULT:
                        evt.preventDefault();
                        break;
                    default:
                        break;
                }
            }, pThis);
        }
    };

    _pInputElement._on_sys_beforeinput_forward = function (evt)
    {
        var input_handle = evt.target;
        if (input_handle)
        {
            var pThis = input_handle._linked_element;

            if (!pThis.on_sys_beforeinput_forward_before_process.call(pThis, evt))
                return false;

            // IME종류 설정
            if (!pThis._updateImeLocale(evt))
                return false;

            pThis.on_sys_beforeinput_forward_process.call(pThis, evt);

        }
    };

    _pInputElement.on_sys_keyinput_forward_before_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_keyinput_forward_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);

        var ret;
        var pThis = input_handle._linked_element;

        if (pThis && !pThis._processing_oninput)
        {
            pThis._processing_oninput = true;
            ret = pThis._on_sys_keyinput.call(this, evt);
            pThis._processing_oninput = false;
        }

        return ret;
    };

    _pInputElement._on_sys_keyinput_forward = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);

        if (input_handle)
        {
            var pThis = input_handle._linked_element;

            if ((nexacro._Browser == "Chrome" || nexacro._Browser == "Edge") && !evt.inputype && pThis._skip_sys_keyinput)
            {
                pThis._skip_sys_keyinput = false;
            }

            if (!pThis.on_sys_keyinput_forward_before_process(evt))
                return false;

            return pThis.on_sys_keyinput_forward_process(evt);
        }
    };

    _pInputElement.on_sys_keyinput_before_process = function (evt)
    {
        return true;
    };

    if (_pInputElement._use_event_beforeinput)
    {
        _pInputElement.on_sys_keyinput_process = function (evt)
        {
            var input_handle = (evt.target || evt.srcElement);
            var pThis = input_handle._linked_element;
            if (pThis._skip_sys_keyinput)
            {
                pThis._skip_sys_keyinput = false;
                return;
            }

            var comp = pThis.parent_elem.linkedcontrol;
            var ismax = false;
            var value; // = pThis._getInputValue();  //unused
            var pos;// = pThis.getElementCaretPos();
            if (pThis._beforeinput_result)
            {
                var bcancle = false;
                pThis._beforeinput_result.forEach(function (state)
                {
                    switch (state)
                    {
                        case nexacro.InputElement.prototype._BeforeinputState.PASS:

                            break;
                        case nexacro.InputElement.prototype._BeforeinputState.CANCEL:
                            // [RP 84327] <- 수정전 코드로 원복 (원복하여도 이전 증상 발생 안함. 2023/5/30)
                            pThis._updateInputValue(pThis._beforeinput_result_data, false, pThis._beforeinput_result_pos.begin, pThis._beforeinput_result_pos.end);
                            bcancle = true;
                            break;
                        case nexacro.InputElement.prototype._BeforeinputState.CONVERT_UPPER:
                        case nexacro.InputElement.prototype._BeforeinputState.CONVERT_LOWER:
                        case nexacro.InputElement.prototype._BeforeinputState.REPLACE:
                            if (pThis._beforeinput_result_data != null)
                                pThis._updateInputValue(pThis._beforeinput_result_data, false, pThis._beforeinput_result_pos.begin, pThis._beforeinput_result_pos.end);
                            break;
                        case nexacro.InputElement.prototype._BeforeinputState.MAXLENGTH:
                            ismax = true;

                            break;
                    }
                }, pThis);

                if (bcancle && !ismax && !pThis.autoskip)
                {
                    return;
                }
            }

            value = pThis._getInputValue();
            pos = pThis.getElementCaretPos();

            if (comp._is_undo && this.maxlength > 0)
            {
                var check = pThis._checkMaxLength(value, pos.end);
                if (check && check.ismax)
                {
                    value = value.substring(0, check.pos);
                    pThis._updateInputValue(value, false, "", check.end);
                }
                comp._is_undo = false;
            }

            if (pThis._composer.isComposing())
                pThis._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);

            // fire oninput event
            var old_value = pThis.value;
            pThis._updateElementValue(value);

            if (comp._on_keyinput)
                comp._on_keyinput(pThis);

            if (pThis.getInputStatusPseudoClass("AUTOFILL"))
            {
                nexacro.__changeInputDOMNodeType(input_handle, pThis.inputtype);
            }

            if (pThis.autoskip && ismax)
            {
                if (pThis.value && value.length >= pThis.maxlength)
                    pThis._go_next_focus();
            }

            // detemine changed status & value
            var prev_status = pThis._composer._prev_status;
            var cur_status = pThis._composer.status;

            if (prev_status == cur_status && pThis.value == old_value)
            {
                // TODO : non composition, composition autoskip
                if (comp._on_input_autoskip)
                {
                    comp._on_input_autoskip();
                }
            }

            pThis._composer._prev_status = cur_status;

        };

        _pInputElement._on_sys_keyinput = function (evt)
        {
            var input_handle = (evt.target || evt.srcElement);
            if (input_handle)
            {
                var pThis = input_handle._linked_element;
                return pThis.on_sys_keyinput_process.call(pThis, evt);
            }
        };
    }
    else
    {
        _pInputElement.on_sys_keyinput_process = function (evt)
        {
            var input_handle = (evt.target || evt.srcElement);
            var pThis = input_handle._linked_element;
            var comp = pThis.parent_elem.linkedcontrol;
            var _win = comp._getRootWindow();

            if (_win && _win._keydown_element && _win._keydown_element != pThis && comp._processing_autoskip)
            {
                var old_value = pThis.value;
                var sel_range = (pThis._last_selection_range) ? pThis._last_selection_range : [0, 0]; // node에 갱신되기 전 caret 값 필요
                pThis._updateInputValue(old_value, false, sel_range[0], sel_range[1]);
                comp._processing_autoskip = false;
                return false;
            }

            //var prev_status = pThis._composer._prev_status;
            var composing_status = pThis._composer.status;
            var beginOffset, endOffset;

            var value = pThis._getInputValue();
            var pos = pThis.getElementCaretPos();

            if (composing_status == nexacro._CompositionState.NONE)
            {
                beginOffset = pThis._paste_caret_pos ? pThis._paste_caret_pos.begin : pThis._composer.startOffset;
                endOffset = pThis._paste_caret_pos ? pThis._paste_caret_pos.end : pos.end;

                if (beginOffset > endOffset)
                {
                    beginOffset = endOffset;
                }
            }
            else
            {
                var offsetCompose = pThis._composer.getOffset();
                beginOffset = offsetCompose.begin;
                endOffset = offsetCompose.end;

                if (beginOffset == endOffset && (composing_status == 3 || composing_status == 1))
                {
                    if (pThis._last_selection_range)
                        beginOffset = pThis._last_selection_range[0];
                    else
                        beginOffset -= 1;
                }

                if (pThis._composer.isComposing())
                {
                    endOffset = pos.end;
                }
            }

            var bBackspace = pThis._checkBackspaceKeyInKeyInput(pThis.value, value, beginOffset, endOffset);
            var bSelect = pThis._checkSelectionInKeyInput(pThis.value, value, beginOffset, endOffset);

            if (bBackspace)
            {
                // android tel type 키패드에서 backspace 입력에서 input이벤트외에는 아무것도 발생하지 않음.
                // 이후 입력처리에서 startOffset이 갱신되지 않아서 오류 발생.
                nexacro.__fireHTMLEvent(input_handle, "keydown", "onkeydown");
            }

            if (bSelect !== false)
            {
                beginOffset = bSelect;
            }

            if (comp._on_beforekeyinput)
            {
                comp._on_beforekeyinput(pThis, value, composing_status, beginOffset, endOffset);
                if (pThis._event_stop)
                {
                    nexacro._stopSysEvent(evt);
                    pThis._event_stop = false;
                    return false;
                }
            }

            // beforeinput 수행 결과값으로 갱신
            //value = pThis._getInputValue();
            var new_value = pThis._getInputValue();

            pos = pThis.getElementCaretPos();

            // android stock browser Caret보정.
            if (nexacro._OS == "Android" && nexacro._Browser == "Chrome" && nexacro._BrowserVersion > "34")
            {
                if (comp instanceof nexacro.MaskEdit)
                    pThis._beforeinput_result_pos = { begin: pos.begin, end: pos.end };
            }

            // check maxlength
            var ismax = false;
            if (pThis.maxlength > 0)
            {
                var caretpos = pThis._paste_caret_pos ? pThis._paste_caret_pos.end - (value.length - new_value.length) : pos.end;

                value = new_value;

                var check = pThis._checkMaxLength(value, caretpos);
                if (check)
                {
                    ismax = check.ismax;
                    var newpos = check.pos;

                    if (ismax)
                    {
                        if (caretpos != newpos)
                        {
                            value = value.substring(0, newpos) + value.substring(caretpos);
                            pThis._updateInputValue(value);
                            pThis.setElementSetSelect(newpos, newpos);

                            value = pThis._getInputValue();
                            pos = pThis.getElementCaretPos();
                        }

                        pThis.setCompositionComplete(newpos, false);
                    }
                }
            }
            else
            {
                value = new_value;
            }

            if (pThis._composer.isComposing())
            {
                pThis._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);
            }

            // fire oninput event
            var old_value = pThis.value;
            pThis._updateElementValue(value);

            // detemine changed status & value
            var prev_status = pThis._composer._prev_status;
            var cur_status = pThis._composer.status;

            if (prev_status == cur_status && pThis.value == old_value)
            {
                // TODO : non composition, composition autoskip
                if (comp._on_input_autoskip)
                {
                    comp._on_input_autoskip();
                    //return;
                }

            }

            pThis._composer._prev_status = cur_status;

            if (comp._on_keyinput)
            {
                comp._on_keyinput(pThis);
            }

            if (pThis.value == old_value)
            {
                if (ismax && pThis.autoskip)
                {
                    if (nexacro._Browser == "Safari")
                    {
                        setTimeout(function ()
                        {
                            pThis._go_next_focus();
                        }, 0);
                    }
                    else
                    {
                        pThis._go_next_focus();
                    }
                }

                return false;
            }

            if (pThis._event_stop)
            {
                nexacro._stopSysEvent(evt);
                pThis._event_stop = false;
                return false;
            }

            if (ismax && pThis.autoskip)
            {
                if (pThis.value && value.length > pThis.value.length)
                {
                    ismax = false;
                }

                if (ismax)
                {
                    if (nexacro._Browser == "Safari")
                    {
                        setTimeout(function ()
                        {
                            pThis._go_next_focus();
                        }, 0);
                    }
                    else
                    {
                        pThis._go_next_focus();
                    }
                }
            }
            return true;
        };
        // 일본어 조합 완료 하게 되면 compositionend -> keyinput
        // compositionend쪽에서 filter가 이루어 지지만, 다시 keyinput에서 같은 로직을 수행한다.
        // 다만 조건에 의해서 튕겨내고는 있음.
        // compositionend에서 처리 할필요가 있을까?        
        _pInputElement._on_sys_keyinput = function (evt)
        {
            var input_handle = (evt.target || evt.srcElement);
            if (input_handle)
            {
                var pThis = input_handle._linked_element;
                // 두번타게 되지만 composition 상태를 정확히 검사하기 위해 다시 호출
                //if(nexacro._OS != "iOS")
                {
                    if (!pThis._updateImeLocale(evt))
                        return false;
                }

                if (!pThis.on_sys_keyinput_process.call(pThis, evt))
                    return false;


            }
        };
    }

    _pInputElement.on_sys_cut_before_process = function (evt)
    {

        return true;
    };

    _pInputElement._on_sys_cut = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;

        if (!pThis.on_sys_cut_before_process.call(pThis, evt))
        {
            return false;
        }
    };

    _pInputElement.on_sys_paste_before_process = function (evt)
    {
        return true;
    };

    _pInputElement._on_sys_paste = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;

        if (!pThis.on_sys_paste_before_process.call(pThis, evt))
        {
            return false;
        }

        var data;
        if (evt.clipboardData && evt.clipboardData.getData)
        {
            data = evt.clipboardData.getData('text/plain');
        }
        else if (window.clipboardData && window.clipboardData.getData)
        {
            data = window.clipboardData.getData('text');
        }
        // paste data -> oninput(apply inputfilter/inputtype -> maxlength) 하면
        // caret 위치가 어긋난다. 때문에 Asyc로 input 호출함.

        if (input_handle && !input_handle._linked_element._use_event_beforeinput && data)
        {
            data = data.replace(/\r\n|\n/g, "");

            var value = pThis._getInputValue();

            var pos = pThis.getElementCaretPos();
            var begin = pos.begin;
            var end = pos.end;

            var newvalue = value.substring(0, begin) + data + value.substring(end);
            var newpos = begin + data.length;
            pos.end = newpos;
            nexacro._stopSysEvent(evt);
            setTimeout(function ()
            {
                pThis._paste_caret_pos = pos;
                pThis._updateInputValue(newvalue, true, newpos);
                pThis._paste_caret_pos = null;
            }, 0);

            nexacro._stopSysEvent(evt);
            return false;
        }
    };

    _pInputElement.on_sys_compositionstart_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;
        var pos = pThis.getElementCaretPos();
        pThis._composer.setStatus(nexacro._CompositionState.START, pos.begin);

        return true;
    };

    _pInputElement._on_sys_compositionstart = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            pThis.on_sys_compositionstart_process.call(pThis, evt);

        }
    };

    _pInputElement.on_sys_compositionupdate_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;
        var pos = pThis.getElementCaretPos();
        pThis._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);

        return true;
    };

    _pInputElement._on_sys_compositionupdate = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)        
        {
            var pThis = input_handle._linked_element;
            pThis.on_sys_compositionupdate_process.call(pThis, evt);
        }
    };

    _pInputElement.on_sys_compositionend_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;
        var pos = pThis.getElementCaretPos();
        pThis._composer.setStatus(nexacro._CompositionState.END, pos.end);

        return true;
    };

    _pInputElement._on_sys_compositionend = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            pThis.on_sys_compositionend_process.call(pThis, evt);
        }
    };

    _pInputElement._on_sys_mousedown = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle && evt.button == nexacro.InputElement.prototype.MOUSE_LBUTTON)
        {
            var pThis = input_handle._linked_element;
            if (pThis)
            {
                var sel = pThis.getElementSelectionRange();

                if (evt.ctrlKey && (sel[0] == sel[1]))
                {
                    pThis.setElementSetSelect(0, -1);
                    pThis.__prevent_sys_lbuttonup = true;
                }
                else
                {
                    pThis._setElementLastSelectionRange();
                    pThis.__prevent_sys_lbuttonup = false;
                }

                if (nexacro._Browser == "Gecko")
                {
                    if (!pThis._is_sys_focused && pThis.autoselect)
                    {
                        evt.preventDefault();
                    }
                }

                //// for Mobile system calendar
                if (nexacro._OS == "iOS")
                {
                    if (pThis.inputtype == "date")
                    {
                        evt.preventDefault();
                    }
                }
            }
        }
    };

    _pInputElement._on_sys_mouseup = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle && evt.button == nexacro.InputElement.prototype.MOUSE_LBUTTON)
        {
            var pThis = input_handle._linked_element;
            if (pThis)
            {
                if (pThis.__prevent_sys_lbuttonup)
                {
                    pThis.__prevent_sys_lbuttonup = false;
                    evt.preventDefault();
                    return false;
                }

                if (pThis.getElementCaretPos && pThis._composer)
                {
                    var pos = pThis.getElementCaretPos();
                    pThis._composer.setStatus(nexacro._CompositionState.NONE, pos.end);
                }
            }
        }
    };

    _pInputElement._on_sys_scroll = function (evt)
    {
        var target = (evt.target || evt.srcElement);
        if (target)
        {
            if (target.nodeName == "input" || target.nodeName == "textarea")
            {
                //
            }
            else if (target.nodeName == "#document")
            {
                var cur_win = target.defaultView || target.parentWindow;

                var scrollLeft = ('pageXOffset' in cur_win) ? cur_win.pageXOffset : target.documentElement.scrollLeft;
                var scrollTop = ('pageXOffset' in cur_win) ? cur_win.pageYOffset : target.documentElement.scrollTop;

                var focused = target.activeElement;
                if (focused && focused != target.body)
                {
                    var pThis = focused._linked_element;
                    if (!pThis) return;

                    if (pThis._restore_scrollpos_onclick)
                    {
                        if (pThis._restore_scrollpos_timer > 0)
                        {
                            clearTimeout(pThis._restore_scrollpos_timer);
                            pThis._restore_scrollpos_timer = 0;
                        }

                        pThis._scoll_pos = [scrollLeft, scrollTop];
                        nexacro._stopSysObserving(cur_win, "scroll", "onscroll", pThis._on_sys_scroll);
                    }
                }
            }
        }
    };

    _pInputElement.on_sys_focus_before_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_focus_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;

        if (pThis._accept_focus_process === false)
        {
            pThis._accept_focus_process = true;
            return;
        }

        var _parent = pThis.parent;
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
                if (_win && _win._is_active_window)
                {
                    var cur_focus_paths = _win.getCurrentFocusPaths();
                    var focuspath_index = cur_focus_paths ? nexacro._indexOf(cur_focus_paths, comp._getRootComponent(comp)) : -1;

                    if (focuspath_index == -1)
                    {
                        var old_focused_comp = cur_focus_paths ? cur_focus_paths[cur_focus_paths.length - 1] : null;
                        if (old_focused_comp)
                        {
                            if (pThis._use_event_beforeinput)
                                pThis._skip_sys_keyinput = true;

                            if (nexacro._Browser == "Chrome" || nexacro._Browser == "Opera" || nexacro._Browser == "Edge" || nexacro._OS == "iOS")
                            {
                                // Chrome, Opera, iOS인 경우 연속 실행취소 시 입력값 원복
                                if (comp.on_apply_value)
                                {
                                    comp.on_apply_value(comp._p_value, pThis._is_invalid_value);
                                }
                                else if (comp.parent.on_apply_value)
                                {
                                    comp.parent.on_apply_value(comp.parent._p_value, pThis._is_invalid_value);
                                }
                            }
                            old_focused_comp._apply_setfocus();
                            return;
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
                if (comp instanceof nexacro._CalendarEditControl && input_handle.type == "number")
                {
                    nexacro.__changeInputDOMNodeType(input_handle, "text");
                    this.setElementValue(pThis.value);
                }
                nexacro.__setDOMNode_Select(_doc, input_handle);
            }
            else
            {
                nexacro.__setDOMNode_Select(_doc, input_handle);
            }
        }
        else if (pThis._last_selection_range)
        {
            var sel = pThis._last_selection_range;
            nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, sel[0], sel[1]);
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

    _pInputElement._on_sys_focus = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis) return;

            if (!pThis.on_sys_focus_before_process(evt)) return;
            if (!pThis.on_sys_focus_process(evt)) return;
        }
    };

    _pInputElement.on_sys_blur_before_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_blur_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;

        if (pThis._accept_blur_process === false)
        {
            pThis._accept_blur_process = true;
            return;
        }

        pThis._is_sys_focused = false;
        pThis._restore_scrollpos_onclick = false;
        pThis._skip_sys_keyinput = false;

        if (pThis._restore_scrollpos_timer > 0)
        {
            clearTimeout(pThis._restore_scrollpos_timer);
            pThis._restore_scrollpos_timer = 0;
        }

        var cur_doc = pThis._getRootWindowHandle();
        if (cur_doc)
        {
            var cur_win = cur_doc.defaultView || cur_doc.parentWindow;
            nexacro._stopSysObserving(cur_win, "scroll", "onscroll", pThis._on_sys_scroll);
            nexacro._adjustBodyScrollPos(cur_doc);
        }

        return true;
    };

    _pInputElement._on_sys_blur = function (evt)
    {
        if (nexacro._OS == "iOS" && nexacro._isOpenSystemCalendar())
        {
            nexacro._destroySystemCalendarOverlay(); //SystemCalendar overlay element
        }
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis) return;

            if (!pThis.on_sys_blur_before_process(evt)) return;
            if (!pThis.on_sys_blur_process(evt)) return;
        }
    };

    _pInputElement.on_sys_select_before_process = function (evt)
    {
        return true;
    };

    _pInputElement.on_sys_select_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;
        if (pThis._is_focused)
        {
            var sel = pThis.getElementSelectionRange();
            if (sel && sel[0] != sel[1])
                pThis._setElementLastSelectionRange(sel);
        }
        return true;
    };

    _pInputElement._on_sys_select = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (pThis)
            {
                if (!pThis.on_sys_select_before_process(evt)) return;
                if (!pThis.on_sys_select_process(evt)) return;
            }
        }
    };

    _pInputElement._on_sys_click = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (pThis)
            {
                if (nexacro._OS == "Android" && pThis.inputtype == "date")
                {
                    if (pThis.parent.linkedcontrol._prevent_clickevent)
                    {
                        evt.preventDefault();
                    }
                }
                pThis._scrollintoview_on_sys_click();
            }
        }
    };

    _pInputElement.on_sys_touchstart_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;
        if (pThis)
        {
            if (pThis.inputtype == "date" && pThis.readonly)
            {
                nexacro._stopSysEvent(evt);
                return false;
            }
        }

        var touches = evt.touches;
        if (touches && touches.length > 1)
        {
            nexacro._stopSysEvent(evt);
        }

        return true;
    };

    _pInputElement._on_sys_touchstart = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            pThis.on_sys_touchstart_process.call(pThis, evt);

        }
    };

    _pInputElement.on_sys_touchend_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;
        if (pThis)
        {
            var pos = pThis.getElementCaretPos();
            pThis._composer.setStatus(nexacro._CompositionState.NONE, pos.end);
        }
        return true;
    };

    _pInputElement._on_sys_touchend = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            pThis.on_sys_touchend_process.call(pThis, evt);

        }
    };

    _pInputElement._on_sys_touchmove = nexacro._emptyFn;

    _pInputElement._on_sys_animationstart = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            var animation_name = evt.animationName;

            switch (animation_name)
            {
                case "nexainput_autofill":
                    {
                        pThis.setInputStatusPseudoClass("AUTOFILL", 1);

                        if (pThis.inputtype == "password")
                        {
                            nexacro.__changeInputDOMNodeType(input_handle, "password");
                        }
                        break;
                    }
                case "nexainput_notautofill":
                    {
                        pThis.setInputStatusPseudoClass("AUTOFILL", 0);

                        if (pThis.value == null && pThis.displaynulltext != "" && !pThis._is_focused)
                        {
                            nexacro.__changeInputDOMNodeType(input_handle, "text");
                        }
                        break;
                    }
            }
        }
    };

    // nexacro.InputElement - utility functions
    //android device
    //android는 keydown keypress를 발생시키지 않아 backspace를 인지하기 어려움.
    //아래 로직으로 해결이 가능할 것인지?
    if (_pInputElement._evtfire_oninput_only_when_backspacekey)
    {
        _pInputElement._checkBackspaceKeyInKeyInput = function (old_value, value, begin, end)
        {
            var ret = false;

            var old_pos = this._composer.getOffset();

            if (old_value)
            {
                if (old_value.length > value.length)
                {
                    //var range = this.getElementSelectionRange();
                    //var pos = this.getElementCaretPos();

                    if (end < old_pos.end)
                    {
                        var idx = old_value.substring(0, end).indexOf(value.substring(0, end));

                        if (idx == 0)
                        {
                            ret = true;
                        }
                    }
                }
            }
            return ret;
        };

        _pInputElement._checkSelectionInKeyInput = function (old_value, value, begin, end)
        {
            var ret = false;

            if (end - begin != 1)
            {
                if (old_value && old_value.length == begin)
                {
                    if (begin != end)
                    {
                        ret = true;
                        //findbegin position
                        for (var i = 0; i < old_value.length; i++)
                        {
                            if (old_value.charAt(i) != value.charAt(i))
                            {
                                ret = i;
                                break;
                            }

                            if (i == end)
                            {
                                ret = i;
                                break;
                            }
                        }
                    }
                }
            }
            return ret;
        };
    }
    else
    {
        _pInputElement._checkBackspaceKeyInKeyInput = function () { return false; };
        _pInputElement._checkSelectionInKeyInput = function () { return false; };
    }


    _pInputElement = null;

    //======================================================================
    // nexacro.TextAreaElement - this Element
    //======================================================================
    nexacro.TextAreaElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.id = id;
        this._p_name = this.parent_elem.name + ":" + (id || "input");

        this._need_reset_update_value = false;

        this._composer = new nexacro._CompositionState();
        this._imelocale = new nexacro._ImeLocale();
    };

    var _pTextAreaElement = new nexacro._createPrototype(nexacro.InputElement, nexacro.TextAreaElement);
    nexacro.TextAreaElement.prototype = _pTextAreaElement;

    _pTextAreaElement._type_name = "TextAreaElement";
    _pTextAreaElement.typeselector = "nexatextarea";

    _pTextAreaElement.usemultiline = true;
    _pTextAreaElement._use_html_maxlength = false;

    // TODO
    if (nexacro._Browser == "Edge" || nexacro._BrowserType == "Opera")
    {
        _pTextAreaElement._BROWSER_SCROLLBAR_SIZE = 0;
    }
    else if (nexacro._Browser == "Gecko")
    {
        _pTextAreaElement._BROWSER_SCROLLBAR_SIZE = 17;
    }
    else
    {
        _pTextAreaElement._BROWSER_SCROLLBAR_SIZE = undefined;
    }

    _pTextAreaElement._createElementHandle = function (owner_elem, _doc)
    {
        var handle = this.handle = _doc.createElement("textarea");
        var handle_style = handle.style;

        handle.id = this.name;
        nexacro.__setDOMNode_ClassName(handle, this._getElementClassName("textarea"));
        nexacro.__setTextAreaDOMStyle_AbsoluteTransparent(handle.style);
        handle._linked_element = this;

        this._refreshCommonStyleProps(handle_style);

        var wordWrap = this.wordWrap || this._wordwrap_info;


        if (wordWrap)
        {
            nexacro.__setTextAreaDOMNode_WordWrap(handle, wordWrap);
        }

        if (this.textAlign)
        {
            nexacro.__setDOMStyle_textAlign(handle_style, this.textAlign, this.rtl);
        }

        if (this.padding)
        {
            nexacro.__setDOMStyle_PaddingObject(handle_style, this.padding, this.rtl);
        }

        if (!this.enable)
        {
            nexacro.__setDOMNode_Enable(handle, false);
        }

        if (this.readonly)
        {
            nexacro.__setDOMNode_ReadOnly(handle, true);
        }

        if (this.value)
        {
            if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
            {
                nexacro.__setDOMNode_Value(handle, this.displayinvalidtext);
            }
            else
            {
                nexacro.__setDOMNode_Value(handle, this.value);
            }
        }
        else if (this.displaynulltext)
        {
            nexacro.__setDOMNode_Value(handle, this.displaynulltext);
        }

        if (this.imemode)
        {
            nexacro.__setDOMNode_ImeMode(handle, this.imemode);
        }

        if (this.maxlength > 0 && this._use_html_maxlength)
        {
            nexacro.__setDOMNode_MaxLength(handle, this.maxlength);
        }

        this._on_createAccessibilityHandle(_doc, owner_elem, handle);

        if (this.handle)
        {
            nexacro.__appendDOMNode(owner_elem.dest_handle, this.handle);
        }
    };

    _pTextAreaElement._destroyInputHandle = function ()
    {
        if (this.handle)
        {
            var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
            this.handle._linked_element = null;

            nexacro.__removeDOMNode(dest_handle, this.handle);

            this.handle = null;
        }
    };

    _pTextAreaElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();

            var handle_style = this._getCommonStyleStr();
            handle_style += nexacro.__getTextAreaHTMLStyle_AbsoluteTransparent();


            if (!this.enable)
            {
                handle_style += nexacro.__getHTMLStyle_Enable(this.enable, this._disabled_color);
            }
            if (this.padding)
            {
                handle_style += nexacro.__getHTMLStyle_PaddingObject(this.padding, this.rtl);
            }
            if (this.textAlign)
            {
                handle_style += nexacro.__getHTMLStyle_textAlign(this.textAlign, this.rtl);
            }
            if (this.imemode)
            {
                if (this._imedisable)
                {
                    handle_style += nexacro.__getHTMLStyle_ImeMode("disabled");
                }
                else
                {
                    handle_style += nexacro.__getHTMLStyle_ImeMode(this.imemode);
                }
            }

            var attr_str =
                nexacro.__getHTMLAttr_Enable(this.enable) +
                nexacro.__getHTMLAttr_ReadOnly(this.readonly);
            if (this.maxlength > 0 && this._use_html_maxlength)
            {
                attr_str += nexacro.__getHTMLAttr_MaxLength(this.maxlength);
            }

            if (nexacro._isTouchInteraction && nexacro._OS == "Android")
            {
                attr_str += nexacro.__getHTMLAttr_InputMode(this.usesoftkeyboard ? "" : "none");
            }

            var str = "";
            str += "<textarea id='" + this.name + "' class='" + this._getElementNexaClassName("nexatextarea", undefined, "textarea") + "' ";
            str += (handle_style) ? (" style='" + handle_style + "'") : "";
            str += attr_str ? (" " + attr_str) : "";
            str = this._on_createAccessibilityCommand(str);
            str += ">";

            if (this.value)
            {
                if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                {
                    str += nexacro._encodeXml(this.displayinvalidtext);
                }
                else
                {
                    str += nexacro._encodeXml(this.value);
                }
            }
            else if (this.displaynulltext)
            {
                str += nexacro._encodeXml(this.displaynulltext);
            }
            else
            {
                str += "";
            }

            str += "</textarea>";

            return str;
        }

        return "";
    };

    if (nexacro._OS == "iOS")
    {
        _pTextAreaElement.setElementSize = function (width, height)
        {
            if (this.width != width || this.height != height)
            {
                var parent_elem = this.parent_elem;
                var padding = parent_elem.padding ? parent_elem.padding : parent_elem._padding_info;
                if (padding)
                {
                    width -= padding.left + padding.right;
                    height -= padding.top + padding.bottom;
                }
                this.width = width + this._getOverflowScrollSize();
                this.height = height + this._getOverflowScrollSize();

                if (width < 0) width = 0;
                if (height < 0) height = 0;

                var input_handle = this.handle;
                if (input_handle)
                {
                    var pos_before = this.getElementCaretPos();

                    nexacro.__setDOMStyle_Size(input_handle.style, this.width, this.height);

                    var pos_after = this.getElementCaretPos();
                    if ((pos_before != -1 && pos_after != -1) && (pos_before.begin != pos_after.begin || pos_before.end != pos_after.end))
                    {
                        this.setElementSetSelect(0, 0);
                        this.setElementSetSelect(pos_before.begin, pos_before.end);
                    }
                }
            }
        };
    }
    else
    {
        _pTextAreaElement.setElementSize = function (width, height)
        {
            var scrollsize = this._getOverflowScrollSize();
            width += scrollsize;
            height += scrollsize;
            if (this.width != width || this.height != height)
            {
                this.width = width;// + this._getOverflowScrollSize();
                this.height = height;// + this._getOverflowScrollSize();

                if (width < 0) width = 0;
                if (height < 0) height = 0;

                var input_handle = this.handle;
                if (input_handle)
                {
                    var pos_before = this.getElementCaretPos();

                    nexacro.__setDOMStyle_Size(input_handle.style, this.width, this.height);

                    var pos_after = this.getElementCaretPos();
                    if ((pos_before != -1 && pos_after != -1) && (pos_before.begin != pos_after.begin || pos_before.end != pos_after.end))
                    {
                        this.setElementSetSelect(0, 0);
                        this.setElementSetSelect(pos_before.begin, pos_before.end);
                    }
                }
            }
        };
    }

    _pTextAreaElement._applyMaxlength = function ()
    {
        var input_handle = this.handle;
        if (this._checkmax_editing_only)
        {
            var newValue = this.value;
            if (!nexacro._isNull(newValue))
            {
                if (this.maxlength > 0 && newValue.length > this.maxlength)
                    newValue = newValue.substring(0, this.maxlength);
            }
            else
            {
                newValue = this.defaultvalue;
            }

            var domValue = this._getInputValue();
            if (domValue !== newValue)
            {
                this._updateInputValue(newValue);
                if (nexacro._isNull(this.value))
                {
                    nexacro.__setDOMNode_Type(input_handle, this.inputtype);
                    nexacro.__setDOMStyle_ColorObject(input_handle.style, "");
                }
            }
        }
    };

    _pTextAreaElement.setElementFocus = function (trigger_type, self_flag)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused)
            {
                this._is_focused = true;
                this._applyMaxlength();
            }

            if (!this._is_sys_focused)
            {
                if (!(nexacro._OS == "iOS" && this.inputtype == "date"))
                    nexacro.__setInputDOMNodeFocus(input_handle, trigger_type);

            }
            nexacro.__setLastFocusedElement(this);
        }
    };

    _pTextAreaElement.setElementBlur = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            var _doc = this._getRootWindowHandle();
            if (_doc)
            {
                if (this.inputtype != "date")
                {
                    if (nexacro._Browser != "MobileSafari")  //On mobile safari browser, it has a scroll problem. This function is handled by touchstart event.
                    {
                        const env = nexacro.getEnvironment();
                        if (!(env._p_enableaccessibility && env._a11ytype == 5))
                        {
                            var caret_pos = nexacro.__getTextAreaDOMNodeCaretPos(_doc, input_handle);
                            var end_pos = caret_pos ? caret_pos.end : 0;

                            nexacro.__setTextAreaDOMNodeSetSelect(_doc, input_handle, end_pos, end_pos, true);
                        }
                    }
                    nexacro._removeInputDOMNodeCaret(input_handle);
                }
            }

            if (this._checkmax_editing_only && this.maxlength > 0)
            {
                var text = (nexacro._isNull(this.value) ? this.defaultvalue : (this.value + ""));
                var value = this._getInputValue();
                if (text !== value)
                {
                    this._updateInputValue(text);
                }
            }

            if (this._is_focused)
            {
                this._is_focused = false;

                if (nexacro._Browser != "Gecko")
                {
                    if (this._is_sys_focused)
                    {
                        nexacro.__setDOMNode_Blur(input_handle);
                    }
                }
            }
        }
    };

    _pTextAreaElement.setElementEnable = function (enable, color)
    {
        if (this.enable != enable)
        {
            this.enable = enable;

            if (!enable)
            {
                this._disabled_color = color;
            }
            else
            {
                this._disabled_color = null;
            }

            var input_handle = this.handle;
            if (input_handle)
            {
                const env = nexacro.getEnvironment();
                if (env._p_enableaccessibility)
                {
                    nexacro.__setDOMAccessibility_StatHidden(input_handle, !enable);
                }
                nexacro.__setTextAreaDOMNode_Enable(input_handle, enable);
            }
        }
    };

    _pTextAreaElement.setElementCSSMapInfo = function (wordwrap)
    {
        if (this._wordwrap_info != wordwrap)
        {
            var oldwordwrap = this.wordWrap || this._wordwrap_info;
            this._wordwrap_info = wordwrap;
            var input_handle = this.handle;
            if (input_handle)
            {
                if (!this.wordWrap && oldwordwrap != wordwrap)
                {
                    nexacro.__setTextAreaDOMNode_Wrap(input_handle, wordwrap);
                }
            }
        }
    };

    _pTextAreaElement.setElementWordWrap = function (wordWrap)
    {
        if (this.wordWrap != wordWrap)
        {
            this.wordWrap = wordWrap;
            var input_handle = this.handle;

            if (input_handle)
            {
                nexacro.__setTextAreaDOMNode_WordWrap(input_handle, wordWrap);

                if (!this._is_focused && this.value == null && this.displaynulltext)
                {
                    this._updateInputValue(this.displaynulltext);
                }
                else
                {
                    if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                    {
                        this._updateInputValue(this.displayinvalidtext);
                    }
                    else
                    {
                        this._updateInputValue(this.getElementText());
                    }

                }
            }
        }
    };

    _pTextAreaElement.setElementValue = function (value)
    {
        if (value)
        {
            value = value.replace(/\r\n/g, "\n");
        }
        this._setElementValue(value);
    };

    _pTextAreaElement._setElementValue = function (value)
    {
        var comp = this.parent.linkedcontrol;
        var html_position_style = nexacro._getHTMLPositionStyle();
        if (html_position_style)
            nexacro._setHTMLPositionStyle("absolute");
        nexacro.InputElement.prototype.setElementValue.call(this, value);
        if (html_position_style)
        {
            nexacro._OnceCallbackTimer.callonce(comp, function ()
            {
                nexacro._setHTMLPositionStyle(html_position_style);
            });
        }
    };

    _pTextAreaElement.updateElementText = function (value, caretpos)
    {
        if (value)
        {
            value = value.replace(/\r\n/g, "\n");
        }

        nexacro.InputElement.prototype.updateElementText.call(this, value, caretpos);
    };

    _pTextAreaElement._updateElementValue = function (value)
    {
        if (value)
        {
            value = value.replace(/\r\n/g, "\n");
        }

        nexacro.InputElement.prototype._updateElementValue.call(this, value);
    };

    _pTextAreaElement._getInputValue = function ()
    {
        return nexacro.InputElement.prototype._getInputValue.call(this);
    };

    _pTextAreaElement.on_reset_update_value = function (resetpos)
    {
        return true;
    };

    /* inputelement와 동일한 동작하여 제거 
    _pTextAreaElement.setElementInputType = function (type, bImedisable)
    {
        var input_handle = this.handle;        

        if (this._imedisable != bImedisable)
        {
            this._imedisable = bImedisable ? bImedisable : false;
            if (input_handle)
            {
                nexacro.__setDOMNode_ImeMode(input_handle, this._imedisable ? "disabled" : this.imemode);
            }
        }
    };
    */

    _pTextAreaElement.setElementSetSelect = function (start, end)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Mac OS") && this.isComposing()) return;

            var value = this._getInputValue();
            end = (typeof end == 'number') ? (end == -1 ? value.length : end) : start;

            this._setElementLastSelectionRange([start, end]);

            // selection 동작이 원치않은 focus 이벤트를 발생할수 있으므로, 확실하게 focus가 있는 상황에서 사용
            if (this._is_focused)
            {
                nexacro.__setTextAreaDOMNodeSetSelect(this._getRootWindowHandle(), input_handle, start, end);
            }
        }
    };

    _pTextAreaElement.getElementCaretPos = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused)
            {
                if (this._last_selection_range)
                {
                    var pos = this._last_selection_range;

                    return { begin: pos[0], end: pos[1] };
                }
                else if (!this._last_selection_range)
                {
                    return -1;
                }
            }
            else
            {
                var _doc = this._getRootWindowHandle();
                if (_doc)
                {
                    return nexacro.__getTextAreaDOMNodeCaretPos(_doc, input_handle);
                }
            }
        }
        return -1;
    };

    _pTextAreaElement.getElementSelectionRange = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused)
            {
                if (this._last_selection_range)
                {
                    return this._last_selection_range;
                }
            }
            else
            {
                var _doc = this._getRootWindowHandle();
                if (_doc)
                {
                    var sel = nexacro.__getTextAreaDOMNodeSelectionRange(_doc, input_handle);
                    return sel.slice(0, 2); // remove direction
                }
            }
        }
        return [0, 0];
    };

    _pTextAreaElement.getElementCaretLine = function ()
    {
        var input_handle = this.handle;
        if (input_handle && this._is_focused)
        {
            var _doc = this._getRootWindowHandle();
            if (_doc)
            {
                return nexacro.__getTextAreaDOMNodeCaretLine(_doc, input_handle, this.wordWrap, this.font);
            }
        }
        return 0;
    };

    _pTextAreaElement.getElementTextLineCount = function (withwrap)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            var _doc = this._getRootWindowHandle();
            if (_doc)
            {
                var wordWrap = withwrap ? this.wordWrap : "none";
                return nexacro.__getTextAreaDOMNodeTextLineCount(_doc, input_handle, input_handle.value, wordWrap, this.font);
            }
        }
        return 0;
    };

    _pTextAreaElement.isFirstCaretLine = function ()
    {
        var input_handle = this.handle;
        if (input_handle && this._is_focused)
        {
            var _doc = this._getRootWindowHandle();
            if (_doc)
            {
                var sel = nexacro.__getTextAreaDOMNodeSelectionRange(_doc, input_handle);

                var start = sel[0], end = sel[1], direction = sel[2];
                var text = this._getInputValue();

                if (direction == "none" || direction == "backward")
                {
                    text = text.slice(0, start);
                }
                else // forward
                {
                    text = text.slice(0, end);
                }

                if (text == "") return true;

                if (/[\r\n]/g.test(text))
                    return false;

                var lines = nexacro.__getTextAreaDOMNodeTextLineCount(_doc, input_handle, text, this.wordWrap, this.font);
                if (lines <= 1) return true;
            }
        }
        return false;
    };

    _pTextAreaElement.isLastCaretLine = function ()
    {
        var input_handle = this.handle;
        if (input_handle && this._is_focused)
        {
            var _doc = this._getRootWindowHandle();
            if (_doc)
            {
                var sel = nexacro.__getTextAreaDOMNodeSelectionRange(_doc, input_handle);

                var end, direction = sel[2];
                var text = this._getInputValue();

                var remain_text;
                if (direction == "backward")
                {
                    end = sel[0];
                }
                else // none | forward
                {
                    end = sel[1];
                }

                remain_text = text.slice(end);
                if (remain_text == "") return true;

                if (/[\r\n]/g.test(remain_text))
                    return false;

                var newline = text.lastIndexOf('\n');
                if (newline < 0) newline = text.lastIndexOf('\r');
                if (newline >= 0)
                {
                    newline += 1;
                }
                else
                {
                    newline = 0;
                }

                var full_text = text.slice(newline);
                var full_lines = nexacro.__getTextAreaDOMNodeTextLineCount(_doc, input_handle, full_text, this.wordWrap, this.font);

                var prev_text = text.slice(newline, end);
                var prev_lines = nexacro.__getTextAreaDOMNodeTextLineCount(_doc, input_handle, prev_text, this.wordWrap, this.font);

                if (full_lines == prev_lines) return true;
            }
        }
        return false;
    };

    _pTextAreaElement.setElementScrollPos = function (hpos, vpos)
    {
        if (hpos < 0) hpos = 0;
        if (vpos < 0) vpos = 0;

        this.setElementHScrollPos(hpos);
        this.setElementVScrollPos(vpos);
    };

    _pTextAreaElement.getElementHScrollPos = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused && this.value == null && this.displaynulltext)
                return 0;
            //Todo, displayInvalidtext
            if (this.rtl)
                return (input_handle.scrollWidth - input_handle.clientWidth - input_handle.scrollLeft);
            else
                return input_handle.scrollLeft;
        }
        return 0;
    };

    _pTextAreaElement.setElementHScrollPos = function (v)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused && this.value == null && this.displaynulltext)
                return;
            //Todo, displayInvalidtext
            if (this.rtl)
                input_handle.scrollLeft = (input_handle.scrollWidth - input_handle.clientWidth - v);
            else
                input_handle.scrollLeft = v;
        }
    };

    _pTextAreaElement.getElementVScrollPos = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused && this.value == null && this.displaynulltext)
                return 0;

            return input_handle.scrollTop;
        }
        return 0;
    };

    _pTextAreaElement.setElementVScrollPos = function (v)
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!this._is_focused && this.value == null && this.displaynulltext)
                return;
            //Todo, displayInvalidtext
            input_handle.scrollTop = v;
        }
    };

    _pTextAreaElement.getElementScrollSize = function ()
    {
        return { width: this.getElementScrollWidth(), height: this.getElementScrollHeight() };
    };

    _pTextAreaElement.getElementScrollWidth = function ()
    {
        var input_handle = this.handle;
        var ret = 0;
        if (input_handle)
        {
            var scrollmax = input_handle.scrollWidth - input_handle.clientWidth;
            ret = this.parent_elem.client_width + scrollmax;
        }
        return ret;
    };

    _pTextAreaElement.getElementScrollHeight = function ()
    {
        var input_handle = this.handle;
        var ret = 0;
        if (input_handle)
        {
            var scrollmax = input_handle.scrollHeight - input_handle.clientHeight;
            ret = this.parent_elem.client_height + scrollmax;
        }
        return ret;
    };

    _pTextAreaElement._getOverflowScrollSize = function ()
    {
        if (this._BROWSER_SCROLLBAR_SIZE === undefined)
            nexacro.TextAreaElement.prototype._BROWSER_SCROLLBAR_SIZE = nexacro.__getOverflowScrollSize();

        var ret = this._BROWSER_SCROLLBAR_SIZE;
        if (nexacro._Browser == "Gecko")
        {
            // firefox 에서 ctrl+mousewheel로 배율변경하면 scrollbarsize가 변경됨.
            var ratio = window.devicePixelRatio;
            if (ratio)
            {
                if (ratio < 1)
                    ret = ret / ratio;
                else
                    ret = ret * ratio;
            }

        }

        return ret;
    };

    _pTextAreaElement._bindSysEvent = function ()
    {
        var input = this.handle;
        if (input)
        {
            nexacro.InputElement.prototype._bindSysEvent.call(this);
            nexacro._observeSysEvent(input, "scroll", "onscroll", this._on_sys_scroll);
        }
    };

    _pTextAreaElement._unbindSysEvent = function ()
    {
        var input = this.handle;
        if (input)
        {
            nexacro.InputElement.prototype._unbindSysEvent.call(this);
            nexacro._stopSysObserving(input, "scroll", "onscroll", this._on_sys_scroll);
        }
    };

    _pTextAreaElement._on_sys_scroll = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (pThis)
            {
                var parent_elem = pThis.parent_elem;
                var comp = parent_elem.linkedcontrol;
                var _win = comp._getWindow();

                var evtid = "";
                var scrolltype = parent_elem._scrolltype;

                var pos = pThis.getElementCaretPos();

                var bWheel = false;
                var bResetPos = false;
                var bScroll = false;
                if (_win && (_win._cur_ldown_elem || _win._cur_mdown_elem))
                {
                    if (_win._cur_mdown_elem)
                    {
                        bWheel = true;
                    }
                    bResetPos = true;
                }
                else if (nexacro._isTouchInteraction)
                {
                    if (_win && _win._cur_touch_elem || (pos && pos != -1 && pos.begin != pos.end))
                    {
                        bResetPos = true;
                    }
                }

                if (bResetPos)
                {
                    var hscroll_pos = parent_elem.scroll_left;
                    var vscroll_pos = parent_elem.scroll_top;

                    if (hscroll_pos != input_handle.scrollLeft)
                    {
                        if (scrolltype != "none" && scrolltype != "vertical" && !comp._is_tracking)
                        {
                            if (pThis.rtl)
                            {
                                var rtlhscroll_pos = (input_handle.scrollWidth - input_handle.clientWidth - input_handle.scrollLeft);
                                if (hscroll_pos != rtlhscroll_pos)
                                    bScroll = true;
                            }
                            else
                            {
                                hscroll_pos = input_handle.scrollLeft;
                                bScroll = true;
                            }
                        }
                        if (bWheel)
                        {
                            evtid = "mousewheel_h";
                        }
                    }

                    if (vscroll_pos != input_handle.scrollTop)
                    {
                        if (scrolltype != "none" && scrolltype != "horizontal" && !comp._is_tracking)
                        {
                            vscroll_pos = input_handle.scrollTop;
                            bScroll = true;
                        }
                        if (bWheel)
                        {
                            evtid = "mousewheel_v";
                        }
                    }

                    if (bScroll)
                    {
                        comp._scrollTo(hscroll_pos, vscroll_pos, true, true, undefined, evtid);
                    }
                }
            }
        }
    };

    _pTextAreaElement._on_sys_paste = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        var pThis = input_handle._linked_element;

        if (!pThis.on_sys_paste_before_process.call(pThis, evt))
        {
            return false;
        }

        var data;
        if (evt.clipboardData && evt.clipboardData.getData)
        {
            data = evt.clipboardData.getData('text/plain');
        }
        else if (window.clipboardData && window.clipboardData.getData)
        {
            data = window.clipboardData.getData('text');
        }

        // paste data -> oninput(apply inputfilter/inputtype -> maxlength) 하면
        // caret 위치가 어긋난다. 때문에 Asyc로 input 호출함.        
        if (input_handle && !input_handle._linked_element._use_event_beforeinput && data)
        {
            var value = pThis._getInputValue();

            var pos = pThis.getElementCaretPos();
            var begin = pos.begin;
            var end = pos.end;

            data = data.replace(/&quot;/g, "\"");

            if (data.indexOf("\r\n") != -1 || data.indexOf("\n\r") != -1)
            {
                data = data.replace(/\r\n|\n\r/g, "\n");
            }

            if (data.indexOf("\r") != -1)
            {
                data = data.replace(/\r/g, "");
            }

            var newvalue = value.substring(0, begin) + data + value.substring(end);
            var newpos = begin + data.length;
            pos.end = newpos;
            nexacro._stopSysEvent(evt);

            // kindlion : 해당 RP확인 필요
            /*
            setTimeout(function ()
            {
                pThis._paste_caret_pos = pos;
                pThis._updateInputValue(newvalue, true, newpos);
                pThis._paste_caret_pos = null;
            }, 0);

            nexacro._stopSysEvent(evt);
            */

            pThis._paste_caret_pos = pos;
            pThis._updateInputValue(newvalue, true, newpos);
            pThis._paste_caret_pos = null;

            pos = pThis.getElementCaretPos();

            /**
             * キャレット位置がこのメソッドの処理中は正しい位置にあるが後で強制的に末尾に設定されてしまうため、
             * タイマー経由で再度同じ位置に設定する（タイマーで遅延されないと末尾になる）
             */
            setTimeout(function ()
            {
                pThis.setElementSetSelect(pos.begin, pos.end);
            }, 0);

            return false;
        }
    };

    _pTextAreaElement.on_apply_imeSet = function (evt)
    {
        var i, len;
        var input_handle = evt ? (evt.target || evt.srcElement) : this.handle;
        var pThis = input_handle ? input_handle._linked_element : this;

        var _locale = pThis._imelocale.getLocale();
        if (_locale && nexacro._cache_inputelement_set[_locale] && nexacro._cache_textareaelement_set[_locale])
        {
            // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
            // clear함수 필요            
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

            for (var prop in nexacro._cache_textareaelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_textareaelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_inputelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    !nexacro._cache_textareaelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
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

    _pTextAreaElement = null;

    //======================================================================
    // nexacro.ControlElement - this ControlElement has container or element
    //======================================================================
    // this ControlElement has No Event Handlers -- Container only
    // this ControlElement has Border
    nexacro.ControlElement = function (parent_elem)
    {
        //nexacro.ControlElement.call(this, parent_elem);
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
    };

    var _pControlElement = nexacro._createPrototype(nexacro.Element, nexacro.ControlElement);
    nexacro.ControlElement.prototype = _pControlElement;
    // overide nexacro.Object
    _pControlElement._type_name = "ControlElement";

    //==== defaule values =========//
    _pControlElement.enable = true;
    _pControlElement.tabindex = -1; // div는 설정 안해도 HTML default -1
    _pControlElement.zindex = -1;

    _pControlElement.color = null;
    _pControlElement.font = null;
    _pControlElement.textDecoration = null;

    _pControlElement.borderRadius = null;
    _pControlElement.border = null;
    _pControlElement.background = null;
    _pControlElement.edge = null;

    //_pControlElement.margin = null;
    _pControlElement.padding = null;

    _pControlElement.cursor = null;
    _pControlElement.opacity = null;
    _pControlElement.boxShadow = null;

    _pControlElement.position_step = undefined;
    _pControlElement.linkedcontrol = null;

    _pControlElement.inner_width = 0;
    _pControlElement.inner_height = 0;
    _pControlElement.client_left = 0;
    _pControlElement.client_top = 0;
    _pControlElement.client_width = 0;
    _pControlElement.client_height = 0;

    //==== internal handles =========//
    _pControlElement._classname = "";

    _pControlElement._is_popup = false;
    _pControlElement.zoom = 100;

    _pControlElement._edge_elem = null;
    _pControlElement._apply_client_padding = true;
    //--------------------------------
    _pControlElement._border_info = null;
    _pControlElement._padding_info = null;
    _pControlElement._edge_info = null;

    _pControlElement._client_left = 0;  //internal if container exist, client_left != _client_left and if container donot exist, client_left == _client_left
    _pControlElement._client_top = 0;   //internal if container exist, client_left != _client_left and if container donot exist, client_left == _client_left
    _pControlElement._contents_maxheight = 0;
    _pControlElement._contents_maxwidth = 0;
    _pControlElement._has_contents_size = false;

    // Fluid Layout Comp
    _pControlElement.flexgrow = -1;
    _pControlElement.flexshrink = -1;
    _pControlElement._layoutbasis = null;
    _pControlElement.layoutorder = -1;
    _pControlElement.tablecellarea = "";
    _pControlElement._tablecellarea = "";

    //==== accessibility values =====//
    _pControlElement.accessibilityrole = "";
    _pControlElement.accessibilityenable = true;
    _pControlElement.accessibilitylabel = "";
    _pControlElement.accessibilitydesclevel = "";
    _pControlElement.accessibilitydescription = "";
    _pControlElement.accessibilityaction = "";
    _pControlElement.accessibility_value = undefined;
    _pControlElement.accessibility_stat_disabled = undefined;
    _pControlElement.accessibility_stat_hidden = undefined;
    _pControlElement.accessibility_stat_checked = undefined; // undefined : this element does not support being checked.
    _pControlElement.accessibility_stat_pressed = undefined;
    _pControlElement.accessibility_stat_selected = undefined;
    _pControlElement.accessibility_stat_expanded = undefined; // undefined : neither expandable nor collapsible.
    _pControlElement.accessibility_stat_autocomplete = undefined;
    _pControlElement.accessibility_flag_haspopup = undefined;
    _pControlElement.accessibility_flag_focusable = undefined;
    _pControlElement.accessibility_flag_readonly = undefined;
    _pControlElement.accessibility_flag_password = undefined;
    _pControlElement.accessibility_flag_multiselectable = undefined;
    _pControlElement.accessibility_flag_defaultbutton = undefined;
    _pControlElement.accessibility_prop_itemcount = undefined;
    _pControlElement.accessibility_prop_itemindex = undefined;
    _pControlElement.accessibility_prop_valuemax = undefined;
    _pControlElement.accessibility_prop_valuemin = undefined;

    // this is pure virtual
    _pControlElement.create = nexacro._emptyFn;
    _pControlElement.destroy = nexacro._emptyFn;
    _pControlElement.clearContents = nexacro._emptyFn;

    _pControlElement.setElementStepCount = nexacro._emptyFn;
    _pControlElement.setElementStepIndex = nexacro._emptyFn;
    _pControlElement._setElementContentsMaxSize = nexacro._emptyFn;

    _pControlElement.borderLeftNone = false;
    _pControlElement.borderTopNone = false;
    _pControlElement.borderRightNone = false;
    _pControlElement.borderBottomNone = false;

    _pControlElement.create = function (win)
    {
        var _doc, owner_elem, handle;
        var handle_style;

        if (!this._is_popup)
        {
            owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle)
            {
                if (!this.handle)
                {
                    var control = this.linkedcontrol;
                    this.owner_elem = owner_elem;
                    _doc = win._doc || owner_elem._getRootWindowHandle();

                    var tag = "div";

                    if (control && control._p_semantictag)
                        tag = control._p_semantictag;

                    if (control && control._is_temp)
                    {
                        this.name += "_temp";
                    }

                    handle = _doc.createElement(tag);
                    handle.id = this.name;
                    handle._linked_element = this;

                    var bPositionRtl = this._isParentRtl();
                    this.handle = this.dest_handle = handle;
                    nexacro.__setDOMNode_ClassName(handle, this._getElementClassName(tag));

                    if (!this._is_simple_control)
                    {
                        var inner_node = _doc.createElement("div");
                        this.dest_handle = inner_node;
                        nexacro.__setDOMNode_ClassName(inner_node, this._getElementNexaClassName("nexasimplecontainer"));

                        nexacro.__setDOMNode_Id(inner_node, "", this.name + ":container");

                        nexacro.__appendDOMNode(handle, inner_node);

                        var innernodestyle = inner_node.style;

                        nexacro.__setDOMStyle_Pos(innernodestyle, this.client_left, this.client_top, bPositionRtl);
                        if (this.client_width && this.client_height)
                            nexacro.__setDOMStyle_Size(innernodestyle, this.client_width, this.client_height);

                        if (this.overflow)
                            nexacro.__setDOMStyle_Overflow(innernodestyle, this.overflow);
                        if (this.clippath)
                            nexacro.__setDOMStyle_Clippath(innernodestyle, this.clippath);
                    }

                    handle_style = handle.style;

                    if (control)
                    {
                        if (control._isFluidContainer(true))
                        {
                            if (control._isFluidContainerCalculation())
                            {
                                nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                            }
                        }
                        else
                        {
                            nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                        }
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                    }

                    nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                    //tooltip inheritance사용.
                    //nexacro.__setDOMNode_ToolTip(handle, "");

                    this._on_createAccessibilityHandle(handle);

                    // render & create Background SubElements
                    this._refreshControl(handle, handle_style, _doc);

                    //iOS 
                    if (nexacro._OS == "iOS" && !nexacro._allow_default_pinchzoom)
                        nexacro.__setDOMStyle_TouchAction(handle_style, "none");

                    // append TO Parent Element
                    if (this._isMultiInnerProc())
                        nexacro.__appendDOMNode((this._is_nc_element) ? owner_elem.handle : owner_elem._getDestHandle(this.top), handle);
                    else
                    {
                        var owner_handle = (this._is_nc_element) ? owner_elem.handle : owner_elem.dest_handle;
                        if (control && control._firstchild)
                            nexacro.__insertDOMNode(owner_handle, handle, owner_handle.firstChild);
                        else
                            nexacro.__appendDOMNode(owner_handle, handle);
                    }
                }
            }
        }
        else  //for is_popup
        {
            _doc = this._doc = win._doc;
            owner_elem = win;

            handle = _doc.createElement("div");
            var linkedcontrol = this.linkedcontrol;

            handle._linked_element = this;
            handle.id = this.name;

            // append TO Parent Element
            this.handle = this.dest_handle = handle;
            nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

            handle_style = handle.style;
            nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
            nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);
            nexacro.__setDomNode_PopOver(handle);

            if (linkedcontrol._findOwnerElementHandle)
            {
                var owner_elem_info = linkedcontrol._findOwnerElementHandle();
                if (owner_elem_info.is_append)
                {
                    if (owner_elem_info.ref_handle)
                    {
                        nexacro.__appendDOMNode(owner_elem_info.ref_handle, handle);
                    }
                    else
                    {
                        nexacro.__appendDOMNode(owner_elem_info.owner_handle, handle);
                    }
                    this.owner_elem = owner_elem_info.owner_handle._linked_element;
                }
                else
                {
                    nexacro.__insertDOMNode(owner_elem_info.owner_handle, handle, owner_elem_info.ref_handle);
                    this.owner_elem = owner_elem.dest_handle._linked_element;
                }
            }
            else
            {
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
                this.owner_elem = owner_elem;
            }

            this._on_createAccessibilityHandle(handle);

            // render & create Background SubElements
            this._refreshControl(handle, handle_style, _doc);
        }
    };

    _pControlElement._iframe_eventhandler_oncontextmenu = function (evt)
    {
        return nexacro._stopSysEvent(evt);
    };

    _pControlElement._getControlStatusStr = function ()
    {
        var str = "";
        if (this.status)
            str += nexacro.__getHTMLAttr_Status(this.status);

        if (this.userstatus)
            str += nexacro.__getHTMLAttr_UserStatus(this.userstatus);
        return str;
    };

    _pControlElement._on_createCommandStart = function ()
    {
        return "";
    };

    _pControlElement.createCommandStart = function ()
    {
        if (!this._is_popup)
        {
            var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && !this.handle)
            {
                var str = "";
                var linkedcontrol = this.linkedcontrol;
                this.owner_elem = owner_elem;

                if (linkedcontrol._p_semantictag)
                    str = "<" + linkedcontrol._p_semantictag + " id='" + this.name + "' class='" + this._getElementClassName(linkedcontrol._p_semantictag) + "' tabindex ='" + this.tabindex + "' ";
                else
                    str = "<div id='" + this.name + "' class='" + this._getElementClassName() + "' tabindex ='" + this.tabindex + "' ";

                if (!nexacro._isNull(this.tooltiptext))
                {
                    str += " title = '" + this.tooltiptext + "' ";
                }

                var style_str = this._getControlStyleStr();
                var status_str = this._getControlStatusStr();
                if (nexacro._OS == "iOS" && !nexacro._allow_default_pinchzoom)
                    style_str += nexacro.__getHTMLStyle_TouchAction("none"); //disable the double-tap

                str += status_str ? (" " + status_str) : "";
                str += style_str ? (" style='" + style_str + "'") : "";

                str = this._on_createAccessibilityCommand(str);
                str += ">";

                if (this._edge_elem)
                {
                    str += this._edge_elem.createCommand();
                }

                if (this._client_elem && !this._is_popup)
                {
                    str += this._client_elem.createCommandStart();
                }
                else if (!this._is_simple_control)
                {
                    style_str = "";
                    if (this.client_left || this.client_top)
                        style_str += nexacro.__getHTMLStyle_Pos(this.client_left, this.client_top, this._isParentRtl());
                    if (this.client_width && this.client_height)
                        style_str += nexacro.__getHTMLStyle_Size(this.client_width, this.client_height);

                    str += "<div class='" + this._getElementNexaClassName("nexasimplecontainer") + "' id='" + this.name + ":container' ";
                    str += style_str ? (" style='" + style_str + "' >") : " >";

                }

                return str;
            }
        }
        return "";
    };

    _pControlElement._on_createCommandEnd = function ()
    {
        return "";
    };

    _pControlElement.createCommandEnd = function ()
    {
        if (!this._is_popup)
        {
            var str = "";
            if (this._client_elem && !this._is_popup)
                str = this._client_elem.createCommandEnd();
            else if (!this._is_simple_control)
                str += "</div>";

            str += this._on_createCommandEnd();
            var linkedcontrol = this.linkedcontrol;
            if (linkedcontrol && linkedcontrol._p_semantictag)
            {
                str += "</" + linkedcontrol._p_semantictag + ">";
            }
            else
            {
                str += "</div>";
            }
            return str;
        }
        return "";
    };

    _pControlElement._on_attachHandle = nexacro._emptyFn;
    _pControlElement.attachHandle = function (win)
    {
        if (this.name)
        {
            var handle = this.handle || win._doc.getElementById(this.name);
            if (handle)
            {
                handle._linked_element = this;

                if (this._is_simple_control)
                {
                    this.handle = this.dest_handle = handle;
                }
                else if (this._client_elem)
                {
                    this.handle = this.dest_handle = handle;
                    this._client_elem.attachHandle(win);
                }
                else
                {
                    this.handle = handle;
                    this.dest_handle = handle.lastChild;
                }

                // for edge
                var edge_elem = this._edge_elem;
                if (edge_elem)
                    edge_elem.attach_handle_fromparent(handle);

                this._setAccessibility_notify();

                this._on_attachHandle(win);
            }
        }
    };

    _pControlElement._on_destroy = nexacro._emptyFn;

    _pControlElement.destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            this._removeElementHandle();
            this.dest_handle = null;

            // destroy Background SubElements
            if (this._edge_elem)
            {
                this._edge_elem.destroy();
                this._edge_elem = null;
            }

            // destroy client element
            if (this._client_elem)
            {
                this._client_elem.destroy();
                this._client_elem = null;
            }

            this._on_destroy();
        }
        this.owner_elem = null;
        this.handle = null;
        this._p_parent = null;
        this.parent_elem = null;
        this.linkedcontrol = null;
    };

    _pControlElement.initElementInfo = function ()
    {
        var control = this.linkedcontrol;

        this.width = 0;
        this.height = 0;

        this.client_width = 0;
        this.client_height = 0;

        this.inner_width = 0;
        this.inner_height = 0;

        this._is_simple_control = control._is_simple_control;
        this._is_popup = control._is_popup_control;

        this._use_translate_move = (control._use_translate_move === false) ? control._use_translate_move : control._env._use_translate_scroll;
        this._use_container_move = control._use_container_move;

        this._apply_client_padding = control._apply_client_padding;
    };

    _pControlElement.clearElementPosition = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            this.left = 0;
            this.top = 0;
            var handle_style = handle.style;
            nexacro.__clearDOMStyle_Pos(handle_style);
            //nexacro.__clearDOMStyle_Size(handle_style);
        }
    };

    // control common functions
    _pControlElement.setLinkedControl = function (control)
    {
        if (!this.linkedcontrol && control)
        {
            this._p_parent = control;
            this.linkedcontrol = control;
            this.id = control.id;
            this._p_name = control._unique_id;
        }
    };

    _pControlElement.setParentElement = function (elem)
    {
        if (elem)
        {
            this.parent_elem = elem;
            this.owner_elem = elem;
        }
    };

    // Fluid Layout
    _pControlElement.setElementLayoutContainerProps = function ()
    {
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            var control = this.linkedcontrol;
            var prop_list = ["type", "spacing", "horizontalgap", "verticalgap", "flexwrap", "flexmainaxisalign", "flexcrossaxisalign", "flexcrossaxiswrapalign", "tabletemplate", "tabletemplatearea", "tabledirection", "tablecellalign", "tablecellincompalign"]
            var prop_val = manager.getLayoutProperties(control, prop_list);

            //var layouttype = manager.getLayoutProperty(control, "type");
            this.setElementLayoutType(prop_val["type"]);
            //var spacing = manager.getLayoutProperty(control, "spacing");
            this.setElementLayoutSpacing(prop_val["spacing"]);
            //var horizontalgap = manager.getLayoutProperty(control, "horizontalgap");
            this.setElementLayoutHorizontalGap(prop_val["horizontalgap"]);
            //var verticalgap = manager.getLayoutProperty(control, "verticalgap");
            this.setElementLayoutVerticalGap(prop_val["verticalgap"]);

            //var flexwrap = manager.getLayoutProperty(control, "flexwrap");
            this.setElementFlexWrap(prop_val["flexwrap"]);
            //var flexmainaxisalign = manager.getLayoutProperty(control, "flexmainaxisalign");
            this.setElementFlexMainAxisAlign(prop_val["flexmainaxisalign"]);
            //var flexcrossaxisalign = manager.getLayoutProperty(control, "flexcrossaxisalign");
            this.setElementFlexCrossAxisAlign(prop_val["flexcrossaxisalign"]);
            //var flexcrossaxiswrapalign = manager.getLayoutProperty(control, "flexcrossaxiswrapalign");
            this.setElementFlexCrossAxisWrapAlign(prop_val["flexcrossaxiswrapalign"]);

            //var tabletemplate = manager.getLayoutProperty(control, "tabletemplate");
            this.setElementTableTemplate(prop_val["tabletemplate"]);
            //var tabletemplatearea = manager.getLayoutProperty(control, "tabletemplatearea");
            this.setElementTableTemplateArea(prop_val["tabletemplatearea"]);
            //var tabledirection = manager.getLayoutProperty(control, "tabledirection");
            this.setElementTableDirection(prop_val["tabledirection"]);
            //var tablecellalign = manager.getLayoutProperty(control, "tablecellalign");
            this.setElementTableCellAlign(prop_val["tablecellalign"]);
            //var tablecellincompalign = manager.getLayoutProperty(control, "tablecellincompalign");
            this.setElementTableCellinCompAlign(prop_val["tablecellincompalign"]);
        }
    };
    _pControlElement.setElementLayoutContentsProps = function ()
    {
        if (this._layoutbasis)
            this._setElementLayoutBasis(this._layoutbasis);

        var control = this.linkedcontrol;
        if (control)
        {
            this.setElementFlexGrow(control.flexgrow);
            this.setElementFlexShrink(control.flexshrink);
            this.setElementLayoutOrder(control.layoutorder);
            this.setElementTableCellArea(control.tablecellarea);
        }
    };

    _pControlElement._setElementTransition = function (val)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMStyle_Transition(handle.style, val);
        }
    };

    _pControlElement.setElementOverflow = function (overflow)
    {
        if (this.overflow != overflow)
        {
            this.overflow = overflow;
            if (this.handle)
            {
                nexacro.__setDOMStyle_Overflow(this.handle.style, overflow);

                if (this.dest_handle)
                    nexacro.__setDOMStyle_Overflow(this.dest_handle.style, overflow);
            }
        }
    };

    _pControlElement.setElementPositionStep = function (position_step)
    {
        if (this.position_step != position_step || position_step == -1)
        {
            this.position_step = position_step;

            var handle = this.handle;
            if (handle && this.parent_elem)
            {
                var old_owner_elem = this.owner_elem;
                var owner_elem = this.parent_elem.getContainerElement(position_step);
                if (old_owner_elem && old_owner_elem.dest_handle && owner_elem && owner_elem.dest_handle)
                {
                    nexacro.__unlinkDOMNode(old_owner_elem.dest_handle, this.handle);
                    nexacro.__appendDOMNode(owner_elem.dest_handle, this.handle);
                    this.owner_elem = owner_elem;
                }
            }
        }
    };

    _pControlElement._setElementLayoutBasis = function (layoutbasis)
    {
        if (this._layoutbasis != layoutbasis)
        {
            this._layoutbasis = layoutbasis;
            /*
             var client_elem = this._client_elem;
             if (client_elem)
             {
                 //if (control._is_form) // need to check
                 client_elem._setElementLayoutBasis(this._layoutbasis);
             }
             */
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FluidSize(this.handle.style, this._layoutbasis);
                nexacro.__setDOMStyle_LayoutBasis(this.handle.style, this._layoutbasis);
            }
        }
    };

    _pControlElement._setElementLayoutPosition = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMStyle_LayoutFluidPos(handle.style);
            nexacro.__clearDOMStyle_Pos(handle.style);
        }
    };

    _pControlElement.setElementLayoutOrder = function (layoutorder)
    {
        if (this.layoutorder !== layoutorder)
        {
            this.layoutorder = layoutorder;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutOrder(handle.style, layoutorder);
            }
        }
    };

    _pControlElement.setElementTableCellArea = function (tablecellarea)
    {
        if (this.tablecellarea !== tablecellarea)
        {
            this.tablecellarea = this._tablecellarea = tablecellarea;
            this._parseLayoutPosition();

            var handle = this.handle;
            if (handle)
            {
                if (this._tablecellarea)
                    nexacro.__setDOMStyle_TableCellArea(handle.style, this._tablecellarea);
                else
                    nexacro.__clearDOMStyle_TableCellArea(handle.style);
            }
        }
    };

    _pControlElement._parseLayoutPosition = function ()
    {
        var strpos = this._tablecellarea;

        if (strpos)
        {
            var pos = strpos.indexOf('/');
            var Arrpos = [];
            var Arrrow = [];
            var Arrcol = [];
            var rowstart, rowend, colstart, colend;
            if (pos > -1)
            {
                // row, column line 정보로 변경
                Arrpos = strpos.split('/');

                Arrrow = Arrpos[0].trim().split(/\s+/);
                Arrcol = Arrpos[1].trim().split(/\s+/);
                var regExp = /^[0-9]+$/;
                var valid_pos = true;

                // 정수화
                Arrrow.forEach(function (row, idx, orgArr)
                {
                    row = row.trim();
                    orgArr[idx] = +row;
                }, this);
                Arrcol.forEach(function (col, idx, orgArr)
                {
                    col = col.trim();
                    orgArr[idx] = +col;
                }, this);

                // swap
                if (Arrrow.length == 2)
                {
                    if (Arrrow[0] > Arrrow[1])
                    {
                        Arrrow.push(Arrrow.shift());
                    }
                }
                if (Arrcol.length == 2)
                {
                    if (Arrcol[0] > Arrcol[1])
                    {
                        Arrcol.push(Arrcol.shift());
                    }
                }

                for (var i = 0; i < Arrrow.length; i++)
                {
                    if (regExp.test(Arrrow[i]))
                    {
                        if (!rowstart)
                        {
                            rowstart = parseInt(Arrrow[i]) + 1;
                            rowend = parseInt(Arrrow[i]) + 2;
                        }
                        else
                        {
                            rowend = parseInt(Arrrow[i]) + 2;
                            break;
                        }
                    }
                    else
                    {
                        valid_pos = false;
                        break;
                    }
                }

                for (i = 0; i < Arrcol.length; i++)
                {
                    if (regExp.test(Arrcol[i]))
                    {
                        if (!colstart)
                        {
                            colstart = parseInt(Arrcol[i]) + 1;
                            colend = parseInt(Arrcol[i]) + 2;
                        }
                        else
                        {
                            colend = parseInt(Arrcol[i]) + 2;
                            break;
                        }
                    }
                    else
                    {
                        valid_pos = false;
                        break;
                    }
                }

                if (valid_pos)
                    this._tablecellarea = rowstart + "/" + colstart + "/" + rowend + "/" + colend;

                return true;
            }
            else
            {
                var control = this.linkedcontrol;
                if (control && control._is_subcontrol)
                {
                    return false;
                }
                else
                {
                    var manager = nexacro._getLayoutManager();
                    if (manager)
                    {
                        // div 상황에 따라 getForm 말고 다른걸로 처리
                        var tabletemplatearea = manager.getLayoutProperty(control._getForm(), "tabletemplatearea");
                        if (tabletemplatearea && tabletemplatearea.indexOf(strpos) > -1)
                            return false;
                        else
                            this._tablecellarea = "";
                    }
                }
            }
        }
        else
        {
            this._tablecellarea = "";
        }
    };

    //////////////////////////////////////////////////////////////////////////
    //for scrollablecontrolelement
    _pControlElement._on_clearContents = nexacro._emptyFn;
    _pControlElement.clearContents = function ()
    {
        if (this.handle && this._client_elem)
        {
            // destroy handle of client element : keep parent relation
            this._client_elem.clearContents();
            this._on_clearContents();
        }
    };

    //supported for same window
    _pControlElement.appendChildElement = function (child_elem)
    {
        if (this.handle)
        {
            if (child_elem.parent_elem != this)
            {
                child_elem.parent_elem = this;
                /*
                                if (child_elem.handle)
                                {
                                    var old_doc = child_elem._getRootWindowHandle();
                                    var new_doc = this.getContainerElement(this.position_step)._getRootWindowHandle();
                                    //var new_doc = this._client_elem._getRootWindowHandle();
                                    if (old_doc != new_doc)
                                    {
                                        child_elem.parent_elem = this;
                                        // for recreate Child Element Handle
                                        child_elem._removeFromContainer();
                                    }
                                    else
                                    {
                                        child_elem.parent_elem = this;
                                    }
                                }
                                else
                                {
                                    child_elem.parent_elem = this;
                                }
                */
            }

            // if child element is not created ==> create child handle
            if (!child_elem.handle)
            {
                child_elem.create(this._getWindow());
            }
            else
            {
                child_elem._appendToContainer(this.getContainerElement(child_elem.position_step));
            }
        }
    };

    _pControlElement.insertChildElement = function (child_elem, before_elem)
    {
        if (this.handle)
        {
            if (child_elem.parent_elem != this)
            {
                child_elem.parent_elem = this;
            }

            // if child element is not created ==> create child handle
            if (!child_elem.handle)
            {
                child_elem.create(this._getWindow());
            }
            else
            {
                child_elem._insertToContainer(this.getContainerElement(child_elem.position_step), before_elem);
            }
        }
    };

    _pControlElement.removeChildElement = function (child_elem)
    {
        // this child element is client element
        if (child_elem.parent_elem == this)
        {
            child_elem._removeFromContainer();
        }
    };

    _pControlElement._getComputedStyle = function (prop, noflush)
    {
        var handle = this.handle;
        if (handle && prop)
        {
            var style = window.getComputedStyle(handle, null);
            return style.getPropertyValue(prop);
        }
    };

    _pControlElement._getComputedStyleBackgroundColor = function (noflush, gradient)
    {
        var handle = this.handle;
        if (handle)
        {
            var style = window.getComputedStyle(handle, null);
            if (gradient)
            {
                var ret = style.getPropertyValue("background");
                if (ret && ret.indexOf("linear-gradient") >= 0)
                    return ret;
            }
            return style.getPropertyValue("background-color");
        }
    };

    _pControlElement._flushCommand = nexacro._emptyFn;
    _pControlElement._getComputedStyleSubValue = nexacro._emptyFn;

    //////////////////////////////////////////////////////////////////////////
    // ControlElement == Container : next Method's == Conntainer's Method
    //////////////////////////////////////////////////////////////////////////
    _pControlElement._sendToBackElement = function (elem)
    {
        if (elem && elem.owner_elem == this && elem.handle)
        {
            nexacro.__sendDOMNodeToBack(elem.handle);
        }
    };
    _pControlElement._bringToFrontElement = function (elem)
    {
        if (elem && elem.owner_elem == this && elem.handle)
        {
            nexacro.__bringDOMNodeToFront(elem.handle);
        }
    };
    _pControlElement._moveToNextElement = function (elem, base_elem)
    {
        if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
        {
            nexacro.__moveDOMNodeToNext(elem.handle, base_elem.handle);
        }
    };
    _pControlElement._moveToPrevElement = function (elem, base_elem)
    {
        if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
        {
            nexacro.__moveDOMNodeToPrev(elem.handle, base_elem.handle);
        }
    };

    _pControlElement.sendToBackElement = function (elem)
    {
        var client_elem = this.getContainerElement(elem.position_step);
        client_elem._sendToBackElement(elem);
    };

    _pControlElement.bringToFrontElement = function (elem)
    {
        var client_elem = this.getContainerElement(elem.position_step);
        client_elem._bringToFrontElement(elem);
    };

    _pControlElement.moveToNextElement = function (elem, base_elem)
    {
        var client_elem = this.getContainerElement(elem.position_step);
        client_elem._moveToNextElement(elem, base_elem);
    };

    _pControlElement.moveToPrevElement = function (elem, base_elem)
    {
        var client_elem = this.getContainerElement(elem.position_step);
        client_elem._moveToPrevElement(elem, base_elem);
    };



    //////////////////////////////////////////////////////////////////////////
    _pControlElement.saveToImageFile = nexacro._emptyFn;
    _pControlElement.saveToImageObject = nexacro._emptyFn;

    //////////////////////////////////////////////////////////////////////////
    // ControlElement == Container : for Scroll ==> no NC AREA : scroll only

    _pControlElement._setElementHScrollPos = function (hpos)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMNode_HScrollPos(handle, hpos);
        }
    };

    _pControlElement._setElementVScrollPos = function (vpos)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMNode_VScrollPos(handle, vpos);
        }
    };
    _pControlElement._setElementScrollPos = function (hpos, vpos)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMNode_Offset(handle, hpos, vpos);
        }
    };

    _pControlElement.setElementTranslateStart = function ()
    {
        if (this._client_elem)
        {
            this._client_elem._setElementTranslateStart();
        }
    };
    _pControlElement.setElementTranslateEnd = function ()
    {
        if (this._client_elem)
        {
            this._client_elem._setElementTranslateEnd();
        }
    };

    _pControlElement.setElementHScrollPos = function (hpos)
    {
        if (hpos < 0) hpos = 0;
        if (hpos > this.hscroll_limit)
        {
            hpos = this.hscroll_limit;
        }

        if (this.scroll_left != hpos || this._reset_scrollpos)
        {
            this.scroll_left = hpos;
            if (this._use_container_move)
            {

                this._client_elem._setElementHScrollPos(hpos);
            }

            if (this.linkedcontrol)
            {
                this.linkedcontrol._setHscrollPos(hpos);
            }
        }
    };

    _pControlElement.setElementVScrollPos = function (vpos)
    {
        if (vpos < 0) vpos = 0;
        if (vpos > this.vscroll_limit)
        {
            vpos = this.vscroll_limit;
        }
        if (this.scroll_top != vpos || this._reset_scrollpos)
        {
            this.scroll_top = vpos;
            if (this._use_container_move)
            {
                this._client_elem._setElementVScrollPos(vpos);
            }

            if (this.linkedcontrol)
            {
                this.linkedcontrol._setVscrollPos(vpos);
            }
        }
    };

    _pControlElement.setElementScrollPos = function (hpos, vpos)
    {
        if (hpos < 0) hpos = 0;
        if (vpos < 0) vpos = 0;
        if (hpos > this.hscroll_limit)
        {
            hpos = this.hscroll_limit;
        }
        if (vpos > this.vscroll_limit)
        {
            vpos = this.vscroll_limit;
        }

        if (this.scroll_left != hpos || this.scroll_top != vpos)
        {
            this.scroll_left = hpos;
            this.scroll_top = vpos;
            if (this._use_container_move)
            {
                this._client_elem._setElementScrollPos(hpos, vpos);
            }

            if (this.linkedcontrol)
            {
                this.linkedcontrol._setHscrollPos(hpos);
                this.linkedcontrol._setVscrollPos(vpos);
            }
            /*
            if (this._hscroll_control)
            {
                this._hscroll_control._setScrollPos(hpos);
            }
            if (this._vscroll_control)
            {
                this._vscroll_control._setScrollPos(vpos);
            }
            */
        }
    };

    _pControlElement.getElementScrollLeft = function ()
    {
        return 0;
    };
    _pControlElement.getElementScrollTop = function ()
    {
        return 0;
    };

    _pControlElement.getElementScrollWidth = function ()
    {
        return this.inner_width;
    };
    _pControlElement.getElementScrollHeight = function ()
    {
        return this.inner_height;
    };

    _pControlElement.beginTransitionEffect = nexacro._emptyFn;
    _pControlElement.applyTransitionEffect = nexacro._emptyFn;
    _pControlElement.cancelTransitionEffect = nexacro._emptyFn;

    //////////////////////////////////////////////////////////////////////////
    _pControlElement._getElementClassName = function (tagname)
    {
        let classname = "";
        classname += this._getElementNativeClassName(tagname);
        classname += this.typeselector;

        const csscollisionpreventkey = nexacro.getEnvironment().csscollisionpreventkey;
        // %%%&&
        if (classname && csscollisionpreventkey)
            classname += `_${csscollisionpreventkey}`;

        if (this.rtl)
            classname += " nexartl";

        if (this.idselector)
        {
            classname += " " + this.idselector;
            //if (this._isRtl(true)) classname += " nexartl";
        }
        if (this.classselector)
            classname += " " + this.classselector;
        //if (this._wordwrapselector)
        //    classname += " " + this._wordwrapselector;

        if (this._use_translate_move)
        {
            classname += " nexatransform";
            //if (this._isRtl(true)) classname += "nexartl";
        }

        if (this._addselector)
            classname += (" " + this._addselector);

        return classname;
    };

    _pControlElement.setElementTypeCSSSelector = function (typename)
    {
        if (this.typeselector != typename)
        {
            this.typeselector = typename;
            var handle = this.handle;
            if (handle)
            {
                var classname = this._getElementClassName();
                if (this._classname != classname)
                {
                    this._classname = classname;
                    nexacro.__setDOMNode_ClassName(handle, classname);
                }
            }
        }
    };

    _pControlElement.setElementClassCSSSelector = function (classname)
    {
        if (this.classselector != classname)
        {
            this.classselector = classname;

            var handle = this.handle;
            if (handle)
            {
                classname = this._getElementClassName();
                if (this._classname != classname)
                {
                    this._classname = classname;
                    nexacro.__setDOMNode_ClassName(handle, classname);
                }
            }
        }
    };

    _pControlElement.setElementIDCSSSelector = function (id)
    {
        if (this.idselector != id)
        {
            this.idselector = id;

            var handle = this.handle;
            if (handle)
            {
                var classname = this._getElementClassName();
                if (this._classname != classname)
                {
                    this._classname = classname;
                    nexacro.__setDOMNode_ClassName(handle, classname);
                }
            }
        }
    };

    _pControlElement.setElementCSSMapInfo = function (border, padding, edge)
    {
        var change_border = false, change_padding = false;//, change_edge = false;
        if (this._border_info != border)
        {
            this._border_info = border;
            change_border = (this.border == null);
        }

        if (this._padding_info != padding)
        {
            this._padding_info = padding;
            change_padding = (this.padding == null);
        }

        if (this._edge_info != edge)
        {
            this._edge_info = edge;
        }

        var handle = this.handle;
        var change_inner = (change_border && this._updateInnerSize());

        var create_edge = false;
        var edge_elem = this._edge_elem;
        if (edge_elem)
        {
            if ((this.edge && this.edge.value != "none") ||
                (this._edge_info && this._edge_info.value != "none"))
            {
                if (change_inner)
                    edge_elem.setElementSize(this.inner_width, this.inner_height);
                if (this.edge == null)
                    edge_elem.setElementInfo(null, edge);
            }
            else
            {
                edge_elem.destroy();
                this._edge_elem = null;
            }
        }
        else
        {
            if (this.edge)
            {
                if (this.edge.value != "none")
                    create_edge = true;
            }
            else if (this._edge_info)
            {
                if (this._edge_info.value != "none")
                    create_edge = true;
            }

            if (create_edge)
            {
                edge_elem = this._edge_elem = new nexacro._EdgeImageElement(this);
                edge_elem.setElementSize(this.inner_width, this.inner_height);
                edge_elem.setElementInfo(this.edge, edge);

                if (handle)
                    edge_elem.create();
            }
        }

        if (change_inner || change_padding)
        {
            this._updateClientRect();
        }
    };

    _pControlElement.setElementZIndex = function (zindex)
    {
        if (this.zindex != zindex)
        {
            this.zindex = zindex;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_Zindex(handle.style, zindex);
            }
        }
    };

    _pControlElement.setElementToolTip = function (tooltiptext, tooltiptype)
    {
        if (this.tooltiptext != tooltiptext || this.tooltiptype != tooltiptype)
        {
            this.tooltiptext = tooltiptext;
            this.tooltiptype = tooltiptype;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMNode_ToolTip(handle, tooltiptext, tooltiptype);
            }
        }
    };

    _pControlElement.setElementFocus = function (selffocus)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMNode_Focus(handle, selffocus);
            nexacro.__setLastFocusedElement(this);
        }
    };

    // override functions
    _pControlElement.setElementSize = function (width, height)
    {
        if (width < 0) width = 0;
        if (height < 0) height = 0;

        if (this.handle)
        {
            /*
            if (this._layoutbasis)
            {
                nexacro.__setDOMStyle_FluidSize(this.handle.style, this._layoutbasis);
            }
            else
            {
                 nexacro.__setDOMStyle_Size(this.handle.style, width, height);
            }
            */
            nexacro.__setDOMStyle_Size(this.handle.style, width, height);
            if (width == 0 || height == 0)
            {
                var border = nexacro.BorderObject("0px none");
                nexacro.__setDOMStyle_BorderObject(this.handle.style, border, this.rtl);
            }
            else if (this.width == 0 || this.height == 0)
            {
                nexacro.__setDOMStyle_BorderObject(this.handle.style, this.border, this.rtl);
                if (this.borderLeftNone || this.borderTopNone || this.borderRightNone || this.borderBottomNone)
                    nexacro.__setDOMStyle_BorderNone(this.handle.style, this.borderLeftNone, this.borderTopNone, this.borderRightNone, this.borderBottomNone, this.border, this._get_rtl());
            }

        }

        this.width = width;
        this.height = height;

        if (this._updateInnerSize())
        {
            this._updateClientRect();

            if (this._edge_elem)
            {
                this._edge_elem.setElementSize(this.inner_width, this.inner_height);
            }
        }
    };

    _pControlElement._get_rtl = function ()
    {
        return this.rtl;
    };

    _pControlElement.setElementBorderRadius = function (borderRadius)
    {
        if (this.borderRadius != borderRadius)
        {
            this.borderRadius = borderRadius;
            if (this.handle)
            {
                nexacro.__setDOMStyle_BorderRadiusObject(this.handle.style, borderRadius, this.rtl);
            }
        }
    };

    _pControlElement.setElementBorder = function (border)
    {

        //var bUpdate = false;//this._checkUpdateElementByRTL(this.handle, border, true);

        // update Border
        if (this.border != border)// || bUpdate)
        {
            this.border = border;
            if (this.handle)
            {
                nexacro.__setDOMStyle_BorderObject(this.handle.style, border, this.rtl);
            }

            if (this._updateInnerSize())
            {
                this._updateClientRect();

                if (this._edge_elem)
                {
                    this._edge_elem.setElementSize(this.inner_width, this.inner_height);
                }
            }
        }
    };

    _pControlElement.setElementBorderLeftNone = function (borderleft)
    {
        // update Border
        if (this.borderLeftNone != borderleft)
        {
            this.borderLeftNone = borderleft;
            if (this.handle)
                nexacro.__setDOMStyle_BorderLeftNone(this.handle.style, borderleft);

            if (this._updateInnerSize())
            {
                this._updateClientRect();

                if (this._edge_elem)
                {
                    this._edge_elem.setElementSize(this.inner_width, this.inner_height);
                }
            }
        }
    };

    _pControlElement.setElementBorderTopNone = function (bordertop)
    {
        // update Border
        if (this.borderTopNone != bordertop)
        {
            this.borderTopNone = bordertop;
            if (this.handle)
                nexacro.__setDOMStyle_BorderTopNone(this.handle.style, bordertop);

            if (this._updateInnerSize())
            {
                this._updateClientRect();

                if (this._edge_elem)
                {
                    this._edge_elem.setElementSize(this.inner_width, this.inner_height);
                }
            }
        }
    };

    _pControlElement.setElementBorderRightNone = function (borderright)
    {
        // update Border
        if (this.borderRightNone != borderright)
        {
            this.borderRightNone = borderright;
            if (this.handle)
                nexacro.__setDOMStyle_BorderRightNone(this.handle.style, borderright);

            if (this._updateInnerSize())
            {
                this._updateClientRect();

                if (this._edge_elem)
                {
                    this._edge_elem.setElementSize(this.inner_width, this.inner_height);
                }
            }
        }
    };

    _pControlElement.setElementBorderBottomNone = function (borderbottom)
    {
        // update Border
        if (this.borderBottomNone != borderbottom)
        {
            this.borderBottomNone = borderbottom;
            if (this.handle)
                nexacro.__setDOMStyle_BorderBottomNone(this.handle.style, borderbottom);

            if (this._updateInnerSize())
            {
                this._updateClientRect();

                if (this._edge_elem)
                {
                    this._edge_elem.setElementSize(this.inner_width, this.inner_height);
                }
            }
        }
    };

    _pControlElement.setElementBorderNone = function (borderleft, bordertop, borderright, borderbottom)
    {
        // update Border

        if (borderleft != this.borderLeftNone || bordertop != this.borderTopNone || borderright != this.borderRightNone || borderbottom != this.borderBottomNone)
        {
            this.borderLeftNone = borderleft;
            this.borderTopNone = bordertop;
            this.borderRightNone = borderright;
            this.borderBottomNone = borderbottom;

            this._refreshBorderNone();
        }
    };

    _pControlElement._refreshBorderNone = function ()
    {
        if (this.handle)
            nexacro.__setDOMStyle_BorderNone(this.handle.style, this.borderLeftNone, this.borderTopNone, this.borderRightNone, this.borderBottomNone, this.border, this._get_rtl());

        if (this._updateInnerSize())
        {
            this._updateClientRect();

            if (this._edge_elem)
            {
                this._edge_elem.setElementSize(this.inner_width, this.inner_height);
            }
        }
    };

    _pControlElement.setElementBackground = function (background)
    {
        // update Background Color
        if (this.background != background)
        {
            this.background = background;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_BackgroundObject(handle.style, background, this.rtl);
            }
        }
    };

    _pControlElement.setElementEdge = function (edge)
    {
        // update Background Image Element
        if (this.edge != edge)
        {
            this.edge = edge;

            var create_edge = false;
            var edge_elem = this._edge_elem;
            if (edge_elem)
            {
                if (edge)
                {
                    if (edge.value == "none")
                    {
                        edge_elem.destroy();
                        this._edge_elem = null;
                    }
                    else
                    {
                        edge_elem.setElementInfo(edge, this._edge_info);
                    }
                }
                else if (this._edge_info)
                {
                    if (this._edge_info.value == "none")
                    {
                        edge_elem.destroy();
                        this._edge_elem = null;
                    }
                    else
                    {
                        edge_elem.setElementInfo(null, this._edge_info);
                    }
                }
                else
                {
                    edge_elem.destroy();
                    this._edge_elem = null;
                }
            }
            else
            {
                if (edge)
                {
                    if (edge.value != "none")
                        create_edge = true;
                }
                else if (this._edge_info)
                {
                    if (this._edge_info.value != "none")
                        create_edge = true;
                }

                if (create_edge)
                {
                    edge_elem = this._edge_elem = new nexacro._EdgeImageElement(this);
                    edge_elem.setElementSize(this.inner_width, this.inner_height);
                    edge_elem.setElementInfo(edge, this._edge_info);

                    if (this.handle)
                        edge_elem.create();
                }
            }
        }
    };

    // override functions
    //_pControlElement.setElementMargin = function (margin)
    //{
    //	this.margin = margin;
    //	if (this.handle)
    //	{
    //		nexacro.__setDOMStyle_MarginObject(this.handle.style, margin);
    //	}
    //};

    _pControlElement.setElementPadding = function (padding)
    {
        if (this.padding != padding)
        {
            this.padding = padding;

            if (this._apply_client_padding)
            {
                this._updateClientRect();
            }
        }
    };

    _pControlElement.setElementCursor = function (cursor)
    {
        if (this.cursor != cursor)
        {
            this.cursor = cursor;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_CursorObject(handle.style, cursor);
            }
        }
    };

    _pControlElement.setElementOpacity = function (opacity)
    {
        if (this.opacity != opacity)
        {
            this.opacity = opacity;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_OpacityObject(handle.style, opacity);
            }
        }
    };

    _pControlElement.setElementBoxShadow = function (boxshadow)
    {
        if (this.boxShadow != boxshadow)
        {
            this.boxShadow = boxshadow;
            var handle = this.handle;

            if (handle)
            {
                nexacro.__setDOMStyle_ShadowObject(handle.style, boxshadow, this.rtl);
            }
        }
    };
    /*
        _pControlElement.getZoom = function ()
        {
            return this.zoom;
        };
        */
    _pControlElement.setElementZoom = function (zoomfactor)
    {
        //if (this._is_popup && this.handle)   //check why is_popup ??
        var handle = this.handle;
        if (handle)
        {
            if (zoomfactor < 0) zoomfactor = 0;
            this.zoom = zoomfactor;
            nexacro.__setDOMStyle_TransformScale(handle.style, zoomfactor / 100);
            this._updateClientRect();
        }
    };

    _pControlElement.setElementDisplay = function (display)
    {
        if (this.display != display)
        {
            this.display = display;
            var handle = this.handle;
            if (handle)
                nexacro.__setDOMStyle_Display(handle.style, display);
        }
    };

    _pControlElement.setElementSimpleControl = function (simplecontrol)
    {
        if (this._is_simple_control != simplecontrol)
        {
            if (this.handle)
            {
                if (!this._is_simple_control)
                {
                    nexacro.__removeDOMNode(this.handle, this.dest_handle);
                    this.dest_handle = this.handle;
                }
                else  //simple
                {
                    var owner_elem = this.owner_elem;
                    var _doc = owner_elem._getRootWindowHandle();
                    var inner_node = _doc.createElement("div");
                    this.dest_handle = inner_node;
                    nexacro.__setDOMNode_ClassName(inner_node, this._getElementNexaClassName("nexasimplecontainer"));
                    nexacro.__setDOMNode_Id(inner_node, "", this.name + ":container");
                    nexacro.__appendDOMNode(this.handle, inner_node);

                    var innernodestyle = inner_node.style;
                    //	                if (this.client_left || this.client_top)
                    nexacro.__setDOMStyle_Pos(innernodestyle, this.client_left, this.client_top);
                    if (this.client_width && this.client_height)
                        nexacro.__setDOMStyle_Size(innernodestyle, this.client_width, this.client_height);
                }
            }

            this._is_simple_control = simplecontrol;
        }
    };

    _pControlElement.setElementHittestType = nexacro._emptyFn;

    _pControlElement.getClientLeft = function ()
    {
        if (this._apply_client_padding && !this._is_simple_control)
        {
            return 0;
        }
        return this.client_left;
    };

    _pControlElement.getClientTop = function ()
    {
        if (this._apply_client_padding && !this._is_simple_control)
        {
            return 0;
        }
        return this.client_top;
    };

    _pControlElement.getClientWidth = function ()
    {
        return this.client_width;
    };

    _pControlElement.getClientHeight = function ()
    {

        return this.client_height;
    };

    //======================================================================
    // _pControlElement's Platform Methods (HTML Element)
    //======================================================================
    _pControlElement._updateInnerSize = function ()
    {
        var inner_width = this.width;
        var inner_height = this.height;

        var border = this.border || this._border_info;

        if (border)
        {
            // adjust width/height
            var borderleft = border.left ? border.left._width : 0;
            var borderright = border.right ? border.right._width : 0;
            var bordertop = border.top ? border.top._width : 0;
            var borderbottom = border.bottom ? border.bottom._width : 0;

            if (this.borderLeftNone) borderleft = 0;
            if (this.borderRightNone) borderright = 0;
            if (this.borderTopNone) bordertop = 0;
            if (this.borderBottomNone) borderbottom = 0;

            inner_width -= (borderleft + borderright);
            inner_height -= (bordertop + borderbottom);

            if (inner_width < 0) inner_width = 0;
            if (inner_height < 0) inner_height = 0;
        }

        if (this.inner_width != inner_width || this.inner_height != inner_height)
        {
            this.inner_width = inner_width;
            this.inner_height = inner_height;
            return true;
        }
        return false;
    };

    _pControlElement._updateInnerElement = function (width, height)
    {
        if (width < 0) width = 0;
        if (height < 0) height = 0;

        if (this.handle)
        {
            if (width == 0 || height == 0)
            {
                var border = nexacro.BorderObject("0px none");
                nexacro.__setDOMStyle_BorderObject(this.handle.style, border, this.rtl);
            }
            else if (this.width == 0 || this.height == 0)
            {
                nexacro.__setDOMStyle_BorderObject(this.handle.style, this.border, this.rtl);
                if (this.borderLeftNone || this.borderTopNone || this.borderRightNone || this.borderBottomNone)
                    nexacro.__setDOMStyle_BorderNone(this.handle.style, this.borderLeftNone, this.borderTopNone, this.borderRightNone, this.borderBottomNone, this.border, this._get_rtl());
            }
        }
        this.width = width;
        this.height = height;

        if (this._updateInnerSize())
        {
            this._updateClientRect();

            if (this._edge_elem)
            {
                this._edge_elem.setElementSize(this.inner_width, this.inner_height);
            }
        }
    };

    _pControlElement._on_updateClientRect = function ()
    {
        var ret = 0;
        if (this._apply_client_padding)
        {
            var client_left = 0;
            var client_top = 0;
            var client_width = this.inner_width;
            var client_height = this.inner_height;

            var padding = (this.padding || this._padding_info);
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }

            if (this.client_left != client_left || this.client_top != client_top)
            {
                this.client_left = client_left;
                this.client_top = client_top;
                ret = 1;
            }
            if (this.client_width != client_width || this.client_height != client_height)
            {
                this.client_width = client_width;
                this.client_height = client_height;
                ret += 2;
            }
        }
        else
        {
            if (this.client_width != this.inner_width || this.client_height != this.inner_height)
            {
                this.client_width = this.inner_width;
                this.client_height = this.inner_height;
                ret += 2;
            }
        }

        return ret;
    };

    _pControlElement._updateClientRect = function ()
    {
        var ret = this._on_updateClientRect();
        if (ret & 1)
            this._on_change_clientPos(this.client_left, this.client_top);
        if (ret & 2)
            this._on_change_clientSize(this.client_width, this.client_height);
    };

    _pControlElement._on_change_clientPos = function (left, top)
    {
        var notify = false;

        var client_elem = this._client_elem;
        if (client_elem)
        {
            client_elem.setElementPosition(left, top);
        }
        else if (this._apply_client_padding)
        {
            if (this.handle && this.handle != this.dest_handle)
            {
                var dest_handle = this.dest_handle;
                nexacro.__setDOMStyle_Pos(dest_handle.style, left, top);
            }
            else
                notify = true;
        }

        var control = this.linkedcontrol;
        if (control && notify)
        {
            control.on_change_containerPos(left, top);
        }
    };

    _pControlElement._on_change_clientSize = function (width, height)
    {
        var client_elem = this._client_elem;
        if (client_elem)
        {
            client_elem.setElementSize(width, height);
        }
        else if (this._apply_client_padding || !this._is_simple_control)
        {
            if (this.handle && this.handle != this.dest_handle)
            {
                var dest_handle = this.dest_handle;
                nexacro.__setDOMStyle_Size(dest_handle.style, width, height);
            }
        }

        var control = this.linkedcontrol;
        if (control)
        {
            control.on_change_containerRect(width, height);
        }
    };

    //======================================================================
    // _pControlElement's Platform Methods (HTML Element)
    //======================================================================

    _pControlElement._refreshControl = function (handle, handle_style)
    {
        this._refreshControlTabIndex(handle);

        if (!nexacro._isNull(this.tooltiptext))
        {
            nexacro.__setDOMNode_ToolTip(handle, this.tooltiptext, this.tooltiptype);
        }

        if (this.zindex >= 0)
        {
            nexacro.__setDOMStyle_Zindex(handle_style, this.zindex);
        }

        // style - for common
        this._refreshCommonStyleProps(handle_style);

        if (this.width == 0 || this.height == 0)
        {
            var border = nexacro.BorderObject("0px none");
            nexacro.__setDOMStyle_BorderObject(handle_style, border);
        }
        else
        {
            nexacro.__setDOMStyle_BorderObject(handle_style, this.border, this.rtl);
            if (this.borderLeftNone || this.borderTopNone || this.borderRightNone || this.borderBottomNone)
                nexacro.__setDOMStyle_BorderNone(this.handle.style, this.borderLeftNone, this.borderTopNone, this.borderRightNone, this.borderBottomNone, this.border, this._get_rtl());
        }

        if (this.borderRadius)
        {
            nexacro.__setDOMStyle_BorderRadiusObject(handle_style, this.borderRadius, this.rtl);
        }

        if (this.background)
        {
            nexacro.__setDOMStyle_BackgroundObject(handle_style, this.background, this.rtl);
        }

        if (this.cursor)
        {
            nexacro.__setDOMStyle_CursorObject(handle_style, this.cursor);
        }
        if (this.opacity)
        {
            nexacro.__setDOMStyle_OpacityObject(handle_style, this.opacity);
        }
        if (this.boxShadow)
        {
            nexacro.__setDOMStyle_ShadowObject(handle_style, this.boxShadow, this.rtl);
        }

        if (this.status)
        {
            nexacro.__setDOMNode_Status(handle, this.status);
        }

        if (this.userstatus)
        {
            nexacro.__setDOMNode_UserStatus(handle, this.userstatus);
        }

        const env = nexacro.getEnvironment();
        if (env._p_enableaccessibility)
        {
            this._refreshAccessibilityInfo(handle, handle_style);
        }

        var control = this.linkedcontrol;
        if (control && !control._isFluidContainerCalculation())
        {
            if (this._layoutbasis)
                nexacro.__setDOMStyle_FluidSize(this.handle.style, this._layoutbasis);

            if (this.flexgrow > -1)
                nexacro.__setDOMStyle_FlexGrow(handle_style, this.flexgrow);

            if (this.flexshrink > -1)
                nexacro.__setDOMStyle_FlexShrink(handle_style, this.flexshrink);

            if (this.layoutorder > -1)
                nexacro.__setDOMStyle_LayoutOrder(handle_style, this.layoutorder);

            if (this._tablecellarea || this._tablecellarea === "")
                nexacro.__setDOMStyle_TableCellArea(handle_style, this._tablecellarea);
        }

        if (this._edge_elem)
        {
            this._edge_elem.create();
        }
    };

    _pControlElement._refreshControlTabIndex = function (handle, tabindex)
    {
        if (tabindex === undefined)
        {
            if (this.tabindex >= -1)
            {
                nexacro.__setDOMNode_TabIndex(handle, this.tabindex);
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
    };

    _pControlElement._refreshLayoutInfo = function ()
    {
        var handle = this.handle;
        if (!handle)
            return;
        var handle_style = handle.style;
        this._refreshControlTabIndex(handle);

        var control = this.linkedcontrol;
        if (control && !control._isFluidContainerCalculation())
        {
            if (this._layoutbasis)
                nexacro.__setDOMStyle_FluidSize(handle_style, this._layoutbasis);

            if (this.flexgrow > -1)
                nexacro.__setDOMStyle_FlexGrow(handle_style, this.flexgrow);

            if (this.flexshrink > -1)
                nexacro.__setDOMStyle_FlexShrink(handle_style, this.flexshrink);

            if (this.layoutorder > -1)
                nexacro.__setDOMStyle_LayoutOrder(handle_style, this.layoutorder);

            if (this._tablecellarea || this._tablecellarea === "")
                nexacro.__setDOMStyle_TableCellArea(handle_style, this._tablecellarea);
        }
    };

    _pControlElement._getControlStyleStr = function ()
    {
        //var bRtl = this._isRtl();
        //var bRtl = this.rtl;

        // cursor, tooltip

        // style - for common
        var str = this._getCommonStyleStr();

        // style - border/background
        if (this.borderRadius)
        {
            str += nexacro.__getHTMLStyle_BorderRadiusObject(this.borderRadius, this.rtl);
        }

        if (this.width == 0 || this.height == 0)
        {
            str += "border: 0px none;";
        }
        else if (this.border)
        {
            str += nexacro.__getHTMLStyle_BorderObject(this.border, this.rtl);
        }

        if (this._get_rtl())
        {
            if (this.borderLeftNone)
                str += nexacro.__getHTMLStyle_BorderRightNone();
            if (this.borderTopNone)
                str += nexacro.__getHTMLStyle_BorderTopNone();
            if (this.borderRightNone)
                str += nexacro.__getHTMLStyle_BorderLeftNone();
            if (this.borderBottomNone)
                str += nexacro.__getHTMLStyle_BorderBottomNone();
        }
        else
        {
            if (this.borderLeftNone)
                str += nexacro.__getHTMLStyle_BorderLeftNone();
            if (this.borderTopNone)
                str += nexacro.__getHTMLStyle_BorderTopNone();
            if (this.borderRightNone)
                str += nexacro.__getHTMLStyle_BorderRightNone();
            if (this.borderBottomNone)
                str += nexacro.__getHTMLStyle_BorderBottomNone();
        }

        if (this.background)
        {
            str += nexacro.__getHTMLStyle_BackgroundObject(this.background, this.rtl);
        }

        // TODO
        //if (this.margin)
        //{
        //	str += nexacro.__getHTMLStyle_MarginObject(this.margin);
        //}

        if (this.cursor)
            str += nexacro.__getHTMLStyle_CursorObject(this.cursor);

        if (this.opacity)
            str += nexacro.__getHTMLStyle_OpacityObject(this.opacity);

        if (this.boxShadow)
            str += nexacro.__getHTMLStyle_ShadowObject(this.boxShadow, this.rtl);

        return str;
    };

    _pControlElement._isMultiInnerProc = function ()
    {
        // this가 innercontainer 를 옮겨다녀야 할 대상인지 체크하는 로직.

        var parent_elem = this.parent_elem;
        if (parent_elem && parent_elem._use_container_move && parent_elem._use_multiinner)
        {
            if (this.owner_elem && (this.owner_elem instanceof nexacro._MultiInnerContainerElement))
                return true;
        }
        return false;
    };

    _pControlElement.setElementPosition = function (left, top, bForce)
    {
        if (this._isMultiInnerProc())
        {
            var owner_elem = this.owner_elem;
            if (this.left != left || this.top != top || bForce)
            {
                var adjust_top = top;

                if (!this._is_nc_element && owner_elem && (this.top != top || bForce))
                    adjust_top = owner_elem._changeInnerElement(top, this.handle);

                nexacro.Element.prototype.setElementPosition.call(this, left, adjust_top, bForce);
                this.top = top;
            }
        }
        else
        {
            nexacro.Element.prototype.setElementPosition.call(this, left, top, bForce);
        }
    };

    //Fluid Panel
    _pControlElement._setElementLayoutType = function (layouttype)
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

    _pControlElement._setElementLayoutHorizontalGap = function (layouthorizontalgap)
    {
        if (this._layouthorizontalgap != layouthorizontalgap)
        {
            this._layouthorizontalgap = layouthorizontalgap;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutGap(handle.style, layouthorizontalgap, this._layoutverticalgap);
            }
        }
    };

    _pControlElement._setElementLayoutVerticalGap = function (layoutverticalgap)
    {
        if (this._layoutverticalgap != layoutverticalgap)
        {
            this._layoutverticalgap = layoutverticalgap;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutGap(handle.style, this._layouthorizontalgap, layoutverticalgap);
            }
        }
    };

    _pControlElement._setElementFlexMainAxisAlign = function (flexmainaxisalign)
    {
        if (this._flexmainaxisalign != flexmainaxisalign)
        {
            this._flexmainaxisalign = flexmainaxisalign = this._getPropertyFlexAlign(flexmainaxisalign);

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexMainAxisAlign(handle.style, flexmainaxisalign);
            }
        }
    };

    _pControlElement._setElementFlexCrossAxisAlign = function (flexcrossaxisalign)
    {
        if (this._flexcrossaxisalign != flexcrossaxisalign)
        {
            this._flexcrossaxisalign = flexcrossaxisalign = this._getPropertyFlexAlign(flexcrossaxisalign);

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexCrossAxisAlign(handle.style, flexcrossaxisalign);
            }
        }
    };

    _pControlElement._setElementFlexCrossAxisWrapAlign = function (flexcrossaxiswrapalign)
    {
        if (this._flexcrossaxiswrapalign != flexcrossaxiswrapalign)
        {
            this._flexcrossaxiswrapalign = flexcrossaxiswrapalign = this._getPropertyFlexAlign(flexcrossaxiswrapalign);

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexCrossAxisWrapAlign(handle.style, flexcrossaxiswrapalign);
            }
        }
    };

    _pControlElement._setElementFlexWrap = function (flexwrap)
    {
        if (this._flexwrap != flexwrap)
        {
            this._flexwrap = flexwrap;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexWrap(handle.style, flexwrap);
            }
        }
    };

    _pControlElement._setElementLayoutSpacing = function (layoutspacing)
    {
        if (this._layoutspacing != layoutspacing)
        {
            this._layoutspacing = layoutspacing;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutSpacing(handle.style, layoutspacing, this.rtl);
            }
        }
    };

    _pControlElement._setElementTableCellAlign = function (tablecellalign)
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

            var handle = this.dest_handle;
            if (handle)
            {
                if (this._tablecellhalign)
                    nexacro.__setDOMStyle_TableCellHAlign(handle.style, this._tablecellhalign);
                if (this._tablecellvalign)
                    nexacro.__setDOMStyle_TableCellVAlign(handle.style, this._tablecellvalign);
            }
        }
    };

    _pControlElement._setElementTableCellinCompAlign = function (tablecellincompalign)
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

            var handle = this.dest_handle;
            if (handle)
            {
                if (this._tablecellincomphalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincomphalign);
                if (this._tablecellincompvalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincompvalign);
            }
        }
    };

    _pControlElement._setElementTableDirection = function (tabledirection)
    {
        if (this._tabledirection != tabledirection)
        {
            this._tabledirection = tabledirection;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_TableDirection(handle.style, tabledirection);
            }
        }
    };

    _pControlElement._setElementTableTemplate = function (tabletemplate)
    {
        if (this._tabletemplate != tabletemplate)
        {
            tabletemplate = tabletemplate ? tabletemplate.split("*").join("fr") : "";
            this._tabletemplate = tabletemplate;
            // validation 필요. 정상값 외엔 "1fr / 1fr"

            var handle = this.dest_handle;
            if (handle)
            {
                if (tabletemplate)
                    nexacro.__setDOMStyle_TableTemplate(handle.style, tabletemplate);
                else
                    nexacro.__clearDOMStyle_TableTemplate(handle.style);
            }
        }
    };

    _pControlElement._setElementTableTemplateArea = function (tabletemplatearea)
    {
        if (this._tabletemplatearea != tabletemplatearea)
        {
            this._tabletemplatearea = tabletemplatearea;

            var handle = this.dest_handle;
            if (handle)
            {
                if (tabletemplatearea)
                    nexacro.__setDOMStyle_TableTemplateArea(handle.style, tabletemplatearea);
                else
                    nexacro.__clearDOMStyle_TableTemplateArea(handle.style);
            }
        }
    };

    // for Accessibility
    _pControlElement._refreshAccessibilityInfo = nexacro._emptyFn;
    _pControlElement._getAccessibilityInfoStr = function ()
    {
        return "";
    };
    _pControlElement._setAccessibility_notify = nexacro._emptyFn;
    //======================================================================
    // role - component role
    //inputelement에 직접 role을 설정하는 경우가 있어 내부에서 role converting을 함    
    _pControlElement.setElementAccessibilityEnable = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityDescLevel = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityValue = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatDisabled = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatChecked = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatPressed = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatSelected = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatExpanded = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatAutoComplete = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityFlagHasPopup = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityFlagFocusable = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityFlagPassword = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityFlagMultiSelectable = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityFlagDefaultButton = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityFlagMultiLine = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityInfoCount = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityInfoIndex = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityInfoValueMax = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityInfoValueMin = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityInfoValueCur = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityInfoLevel = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityHotKey = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatFocus = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatKillFocus = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityStatLive = nexacro._emptyFn;

    _pControlElement.notifyAccessibility = nexacro._emptyFn;
    _pControlElement._makeAccessibilityLabelbyReadtype = nexacro._emptyFn;
    _pControlElement.setElementAccessibilityParentLabel = nexacro._emptyFn;
    _pControlElement._updateElementAccessibilityLabel = nexacro._emptyFn;

    //======================================================================
    // nexacro.ScrollableControlElement
    //======================================================================
    /*
        Expand			: ListViewBand
        Scroll			: ListBox, FileUpload, ListView ETC..
        Scroll + Step	: Form
        
        Single Container: Other Component
        Multi  Container: ListView
    	
    */

    nexacro.ScrollableControlElement = function (parent_elem, use_multiinner)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this._use_multiinner = use_multiinner;

        if (use_multiinner)
            this._client_elem = new nexacro._MultiInnerContainerElement(this);
        else
            this._client_elem = new nexacro._ContainerElement(this);
    };

    var _pScrollableControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.ScrollableControlElement);
    nexacro.ScrollableControlElement.prototype = _pScrollableControlElement;
    _pScrollableControlElement._type_name = "ScrollableControlElement";

    _pScrollableControlElement.setLinkedControl = function (control)
    {
        if (!this.linkedcontrol && control)
        {
            this._p_parent = control;
            this.linkedcontrol = control;
            this.id = control.id;
            if (!this.parent_elem)
            {
                if (nexacro.ismodule && this.linkedcontrol.__containerhandle)
                {
                    control._unique_id = this.linkedcontrol.__containerhandle.id + "." + control._unique_id;
                    this._p_name = nexacro._prefixIDRootNodeClassName(control._unique_id);
                }
                else
                    this._p_name = control._unique_id;
            }
            else
                this._p_name = control._unique_id;
        }
    };

    _pScrollableControlElement.create = function (win)
    {
        // parent is always control element
        var owner_elem, _doc, handle, handle_style;

        if (!this._is_popup)
        {
            if (this.parent_elem)
            {
                owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
                if (owner_elem && owner_elem.handle)
                {
                    if (!this.handle)
                    {
                        this.owner_elem = owner_elem;
                        _doc = win._doc || owner_elem._getRootWindowHandle();

                        handle = _doc.createElement("div");
                        handle.id = this.name;
                        handle._linked_element = this;

                        this.handle = this.dest_handle = handle;
                        nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

                        /////////////////////////////////
                        handle_style = handle.style;
                        var control = this.linkedcontrol;
                        if (control && !control._is_form)
                        {
                            if (control._isFluidContainer(true))
                            {
                                if (control._isFluidContainerCalculation())
                                {
                                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                                }
                            }
                            else
                            {
                                nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                            }
                        }
                        else
                        {
                            nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                        }

                        nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                        // render & create Background SubElements
                        this._refreshControl(handle, handle_style, _doc);

                        // append TO Parent Element
                        nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
                    }
                }
            }
            else if (win.root == this.linkedcontrol)
            {
                let parent_handle = win.dest_handle;
                if (!this.handle)
                {
                    this.owner_elem = win;
                    this._doc = _doc = win._doc;
                    this._is_window_element = true;



                    handle = _doc.createElement("div");
                    handle.id = this.name;
                    handle._linked_element = this;

                    this.handle = this.dest_handle = handle;
                    nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
                    handle_style = handle.style;
                    var control = this.linkedcontrol;
                    if (control && !control._is_form)
                    {
                        if (control._isFluidContainer(true))
                        {
                            if (control._isFluidContainerCalculation())
                            {
                                nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                            }
                        }
                        else
                        {
                            nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                        }
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                    }

                    nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                    // render & create Background SubElements
                    this._refreshControl(handle, handle_style, _doc);
                    // append TO Parent Element
                    nexacro.__appendDOMNode(parent_handle, handle);
                }

            }


        }
        else //for is_popup
        {
            _doc = win._doc;
            owner_elem = win;

            handle = _doc.createElement("div");
            handle.id = this.name;
            handle._linked_element = this;

            this.handle = this.dest_handle = handle;
            nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

            handle_style = handle.style;
            nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
            nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);
            nexacro.__setDomNode_PopOver(handle);
            // render & create Background SubElements
            this._refreshControl(handle, handle_style, _doc);

            // append TO Parent Element
            this.handle = this.dest_handle = handle;
            if (this.linkedcontrol._findOwnerElementHandle)
            {
                var owner_elem_info = this.linkedcontrol._findOwnerElementHandle();
                if (owner_elem_info.is_append)
                {
                    nexacro.__appendDOMNode(owner_elem_info.owner_handle, handle);
                }
                else
                {
                    owner_elem_info.owner_handle.insertBefore(handle, owner_elem_info.ref_handle);
                }
                this.owner_elem = owner_elem_info.owner_handle._linked_element;
            }
            else
            {
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
                this.owner_elem = owner_elem;
            }
        }

        if (this.linkedcontrol._use_translate_scroll_force)
            this._use_translate_scroll = this.linkedcontrol._use_translate_scroll;
        else
        {
            if (this.linkedcontrol._use_translate_scroll === false)
                this._use_translate_scroll = this.linkedcontrol._use_translate_scroll;
            else
            {
                const env = nexacro.getEnvironment();
                this._use_translate_scroll = env ? env._use_translate_scroll : nexacro._use_translate_scroll;
            }
        }
        this._use_container_move = this.linkedcontrol._use_container_move;
        this._use_native_scroll = this.linkedcontrol._use_native_scroll;

        //container element create
        // no need set props for child --> only create it
        // props are already setted to child_elem
        if (this.handle)
        {
            if (!this._client_elem.handle)
                this._client_elem.create(win);

            var step_count = this._step_count;
            if (step_count > 0)
            {
                this._step_containers = [];
                for (var i = 0; i < step_count; i++)
                {
                    var step_client = new nexacro._ContainerElement(this._client_elem, this._use_translate_scroll);
                    step_client.setElementPosition(i * this.client_width, 0);
                    step_client.setElementSize(this.client_width, this.container_maxheight);
                    step_client.create(win);
                    this._step_containers.push(step_client);
                }

                if (this._client_elem._scroll_left != this._client_elem.handle.scrollLeft)
                    nexacro.__setDOMNode_HScrollPos(this._client_elem.handle, this._client_elem._scroll_left, this._isRtl());
            }
        }

    };

    _pScrollableControlElement.attachHandle = function (win)
    {
        var control = this.linkedcontrol;

        if (control._use_translate_scroll_force)
            this._use_translate_scroll = control._use_translate_scroll;
        else
        {
            if (control._use_translate_scroll === false)
                this._use_translate_scroll = control._use_translate_scroll;
            else
            {
                const env = nexacro.getEnvironment();
                this._use_translate_scroll = env ? env._use_translate_scroll : nexacro._use_translate_scroll;
            }
        }

        nexacro.ControlElement.prototype.attachHandle.call(this, win);
    };

    _pScrollableControlElement._on_destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            var step_containers = this._step_containers;
            if (step_containers)
            {
                var step_count = step_containers.length;
                for (var i = 0; i < step_count; i++)
                {
                    var step_client = step_containers[i];
                    step_client.destroy();
                }
                this._step_containers = null;
            }
        }
    };

    _pScrollableControlElement._on_clearContents = function ()
    {
        if (this.handle)
        {
            // destroy handle of client element : keep parent relation
            var step_containers = this._step_containers;
            if (step_containers)
            {
                var step_count = step_containers.length;
                for (var i = 0; i < step_count; i++)
                {
                    var step_client = step_containers[i];
                    step_client.destroy();
                }
                this._step_containers = null;
            }
        }
    };

    _pScrollableControlElement._setInnerElementScrollMaxTops = function (tops)
    {
        if (!this._use_multiinner)
            return;

        if (this._client_elem)
            this._client_elem._setScrollMaxTops(tops);
    };

    _pScrollableControlElement.initElementInfo = function ()
    {
        nexacro.ControlElement.prototype.initElementInfo.call(this);

        this._zclient_width = 0;
        this._zclient_height = 0;

        var control = this.linkedcontrol;
        if (control._is_scrollable)
        {
            // init variables
            this._hscroll_control = null;
            this._vscroll_control = null;

            this._step_containers = null;

            this.zoom = 100;

            this.scroll_left = 0;
            this.scroll_top = 0;
            if (this._client_elem)
            {
                this._client_elem._setElementHScrollPos(0);
                this._client_elem._setElementVScrollPos(0);
            }

            this.container_maxwidth = 0;
            this.container_maxheight = 0;

            this.hscroll_limit = 0;
            this.vscroll_limit = 0;

            this._hscroll_size = 0;
            this._vscroll_size = 0;
            this._hscrollbartype = "";
            this._vscrollbartype = "";
            this._scrolltype = "";

            this._scrollview_width_top = 0;
            this._step_count = 0;
            this._pre_step_count = 0;
            this._step_index = -1;

            // init status
            if (control._use_translate_scroll_force)
            {
                this._use_translate_scroll = control._use_translate_scroll;
            }
            else
            {
                if (control._use_translate_scroll === false)
                    this._use_translate_scroll = control._use_translate_scroll;
                else
                {
                    const env = nexacro.getEnvironment();
                    this._use_translate_scroll = env ? env._use_translate_scroll : nexacro._use_translate_scroll;
                }
            }
            this._use_container_move = control._use_container_move;
            //this._use_native_scroll = control._use_native_scroll;

            // init function

            this.setElementScrollbarSize(control._getHScrollBarSize(), control._getVScrollBarSize(), control._getHScrollBarType(), control._getVScrollBarType(), control.scrolltype);
        }
        else if (control._is_expandable)
        {
            // init variables
            this._expandbarwidth = 0;
            this._expandbarheight = 0;
            this._expandbartype = false;
            this._expanddirtype = "horz";
            this._expandvisible = undefined;
            this._expandarrange = undefined;

            // init status
            this._use_translate_scroll = false;
            this._use_container_move = false;
            //this._use_native_scroll = false;

            // init function
            this._on_updateClientRect = this._on_updateClientRectExpand;
            this._on_change_clientPos = this._on_change_clientPosExpand;
            this._on_change_clientSize = this._on_change_clientSizeExpand;
        }

        this._not_use_scrollLeft = control._not_use_scrollLeft;
        this._not_use_scrollTop = control._not_use_scrollTop;

        var client_elemt = this._client_elem;
        if (client_elemt)
        {
            client_elemt._not_use_scrollLeft = this._not_use_scrollLeft;
            client_elemt._not_use_scrollTop = this._not_use_scrollTop;
            client_elemt._use_translate_scroll = this._use_translate_scroll;
            client_elemt._use_container_move = this._use_container_move;
            //client_elemt._use_native_scroll = this._use_native_scroll;
        }
    };

    _pScrollableControlElement.setElementStepCount = function (count)
    {
        if (this._step_count != count)
        {
            var step_count = this._step_count;
            var step_containers = this._step_containers;
            var i, step_client;
            if (step_containers && this._step_count)
            {
                for (i = 0; i < step_count; i++)
                {
                    step_client = step_containers[i];
                    step_client.destroy();
                }
                this._step_containers = null;
            }

            this._pre_step_count = this._step_count;
            this._step_count = count;

            this._updateClientRect();
            if (this.handle && count > 0)
            {
                this._step_containers = [];

                for (i = 0; i < count; i++)
                {
                    step_client = new nexacro._ContainerElement(this._client_elem, this._use_translate_scroll);
                    step_client.setElementPosition(i * this.client_width, 0);
                    step_client.setElementSize(this.client_width, this.client_height);
                    step_client.create();
                    this._step_containers.push(step_client);
                }
            }

        }
    };

    _pScrollableControlElement.setElementStepIndex = function (index)
    {
        if (this._step_index != index)
        {
            if (this._step_count > 0)
            {
                if (index > -1 && this._step_count > index)
                {
                    this._step_index = index;
                }
            }
            else
            {
                this._step_index = index;
            }
        }
    };

    _pScrollableControlElement.setElementZoom = function (zoomfactor)
    {
        var handle = this.handle;
        if (handle)
        {
            if (zoomfactor < 0) zoomfactor = 0;
            this.zoom = zoomfactor;
            var client = this.getContainerElement(this._step_index);
            if (client)
            {
                client.setElementZoom(zoomfactor);
            }
            this._updateClientRect();
        }
    };

    _pScrollableControlElement.setElementScrollMaxSize = function (width, height)
    {
        if (this.container_maxwidth != width || this.container_maxheight != height)
        {
            this.container_maxwidth = width;
            this.container_maxheight = height;

            if (this._step_count)
            {
                var client_elem = this.getContainerElement(this._step_index);
                if (client_elem)
                    client_elem.setElementScrollMaxSize(this.client_width, height);
            }
            if (this._client_elem)
            {
                this._client_elem.setElementScrollMaxSize(width, height);

            }

            this._updateClientRect();
        }
    };

    _pScrollableControlElement.setElementScrollbarSize = function (hscroll_size, vscroll_size, hscrollbartype, vscrollbartype, scrolltype)
    {
        var ret = false;
        if (this._vscroll_size != vscroll_size || this._hscroll_size != hscroll_size)
        {
            this._vscroll_size = vscroll_size | 0;
            this._hscroll_size = hscroll_size | 0;

            ret = true;
        }

        if (this._hscrollbartype != hscrollbartype || this._vscrollbartype != vscrollbartype)
        {
            this._hscrollbartype = hscrollbartype;
            this._vscrollbartype = vscrollbartype;

            ret = true;
        }

        if (this._scrolltype != scrolltype)
        {
            this._scrolltype = scrolltype;
            var container = this._client_elem;
            if (container && this._scrolltype != "none")
                container._setElementScrolltype(this._getElementScrollType(scrolltype));
            ret = true;
        }
        if (ret)
            this._updateClientRect();
        return ret;
    };

    _pScrollableControlElement.setElementExpandbarSize = function (expandbarsize, expandbartype, expanddirtype, expandvisible, expandarrange)
    {
        var ret = false;

        if (this._expandbarwidth != expandbarsize[0])
        {
            this._expandbarwidth = +expandbarsize[0];
            ret = true;
        }
        if (this._expandbarheight != expandbarsize[1])
        {
            this._expandbarheight = +expandbarsize[1];
            ret = true;
        }
        if (this._expandbartype != expandbartype)
        {
            this._expandbartype = expandbartype;
            ret = true;
        }
        if (this._expanddirtype != expanddirtype)
        {
            this._expanddirtype = expanddirtype;
            ret = true;
        }
        if (this._expandvisible != expandvisible)
        {
            this._expandvisible = expandvisible;
            ret = true;
        }
        if (this._expandarrange != expandarrange)
        {
            this._expandarrange = expandarrange;
            ret = true;
        }

        if (ret)
            this._updateClientRect();

        return ret;
    };

    _pScrollableControlElement.getContainerElement = function (position_step)
    {
        var step_count = this._step_count;
        var step_index = this._step_index;
        var step_containers = this._step_containers;
        if (step_count > 0 && step_containers && step_count > position_step)
        {
            if (position_step < 0 || position_step == null)
                position_step = (step_index > -1 ? step_index : 0);

            return step_containers[position_step];
        }
        else
        {
            return this._client_elem;
        }
    };

    _pScrollableControlElement._getRootWindowHandle = function ()
    {
        if (this.owner_elem && this.owner_elem._getRootWindowHandle)
        {
            return this.owner_elem._getRootWindowHandle();
        }
        else
        {
            if (this._is_window_element)
                return this._doc;
        }
        return null;
    };

    _pScrollableControlElement.getElementScrollLeft = function ()
    {
        var container = this.getContainerElement(this.position_step);
        if (!container) return 0;

        return container.getElementScrollLeft();
    };

    _pScrollableControlElement.getElementScrollTop = function ()
    {
        var container = this._client_elem;
        if (!container) return 0;

        return container.getElementScrollTop();
    };

    _pScrollableControlElement.getElementScrollWidth = function ()
    {
        var container = this.getContainerElement(this.position_step);
        if (!container) return 0;

        return container.getElementScrollWidth();
    };

    _pScrollableControlElement.getElementScrollHeight = function ()
    {
        var container = this._client_elem;
        if (!container) return 0;

        return container.getElementScrollHeight();
    };

    _pScrollableControlElement.setElementVScrollPos = function (vpos)
    {
        if (vpos < 0) vpos = 0;
        if (vpos > this.vscroll_limit)
        {
            vpos = this.vscroll_limit;
        }
        if (this.scroll_top != vpos || this._reset_scrollpos)
        {
            this.scroll_top = vpos;
            if (this._step_count > 0)
            {
                this.getContainerElement(this._step_index)._setElementVScrollPos(vpos);
            }
            else if (this._use_container_move)
            {
                this._client_elem._setElementVScrollPos(vpos);
            }
            if (this.linkedcontrol)
            {
                this.linkedcontrol._setVscrollPos(vpos);
            }
        }
    };
    /*
     _pScrollableControlElement.setElementScrollPos = function (hpos, vpos)
     {
         if (hpos < 0) hpos = 0;
         if (vpos < 0) vpos = 0;
         if (hpos > this.hscroll_limit)
         {
             hpos = this.hscroll_limit;
         }
         if (vpos > this.vscroll_limit)
         {
             vpos = this.vscroll_limit;
         }
 
         if (this.scroll_left != hpos || this.scroll_top != vpos)
         {
             this.scroll_left = hpos;
             this.scroll_top = vpos;
             this.getContainerElement(this._step_index)._setElementScrollPos(hpos, vpos);
             if (this._hscroll_control)
             {
 
                 this._hscroll_control._setScrollPos(hpos);
             }
             if (this._vscroll_control)
             {
                 this._vscroll_control._setScrollPos(vpos);
             }
         }
     };
     */

    _pScrollableControlElement._updateClientRect = function ()
    {
        var ret = this._on_updateClientRect();
        if (ret & 1)
            this._on_change_clientPos(this.client_left, this.client_top);
        if (ret & 2)
            this._on_change_clientSize(this._zclient_width, this._zclient_height);
    };

    _pScrollableControlElement._on_change_clientPos = function (left, top)
    {
        var step_count = this._step_count;
        var step_index = this._step_index;
        var step_containers = this._step_containers;
        var zclient_width = this._zclient_width;
        var i;
        var step_client_elem;
        if (this._apply_client_padding)
        {
            //relative
            if (this._client_elem)
            {
                if (step_count > 0 && step_containers)
                {
                    for (i = 0; i < step_count; i++)
                    {
                        step_client_elem = step_containers[i];
                        step_client_elem.setElementPosition(zclient_width * i, 0);
                        if (i == step_index && this._use_translate_scroll)
                            step_client_elem.setElementSize(zclient_width, this.container_maxheight);
                    }
                    /*
                    step_index = this._step_index;
                    var step_scroll_left = zclient_width * step_index;
                    if (this.scroll_left != step_scroll_left)
                    {
                        this.scroll_left = step_scroll_left;
                        this._client_elem._setElementHScrollPos(step_scroll_left);
                    }
                    */
                }
                else
                {
                    this._client_elem.setElementPosition(left, top);
                }
            }
            else if (this.handle && this.handle != this.dest_handle)
            {
                var dest_handle = this.dest_handle;
                nexacro.__setDOMStyle_Pos(dest_handle.style, left, top);
            }
        }
        else if (this._client_elem)
        {
            this._client_elem.setElementPosition(left, top);
            if (step_count > 0 && step_containers)
            {
                for (i = 0; i < step_count; i++)
                {
                    step_client_elem = step_containers[i];
                    step_client_elem.setElementPosition(zclient_width * i, 0);
                }

                step_index = this._step_index;
                var step_scroll_left = zclient_width * step_index;
                if (this.scroll_left != step_scroll_left)
                {
                    this.scroll_left = step_scroll_left;
                    this._client_elem._setElementHScrollPos(step_scroll_left);
                }
            }
        }

        // position - ( 0,0)
        var control = this.linkedcontrol;
        if (control)
        {
            control.on_change_containerPos(left, top);
        }
    };

    _pScrollableControlElement._on_change_clientPosExpand = function (left, top)
    {
        var client_elem = this._client_elem;
        if (client_elem)
        {
            client_elem.setElementPosition(left, top);
        }
        else
        {
            var handle = this.handle;
            var dest_handle = this.dest_handle;
            if (handle && handle != dest_handle & this._apply_client_padding)
            {
                nexacro.__setDOMStyle_Pos(dest_handle.style, left, top);
            }
        }

        var control = this.linkedcontrol;
        if (control)
        {
            control.on_change_containerPos(left, top);
        }
    };

    _pScrollableControlElement._on_change_clientSize = function (width, height)
    {
        var handle = this.handle;
        var dest_handle = this.dest_handle;

        var client_elem = this._client_elem;
        var zclient_width = this._zclient_width;

        var max_width = Math.max(width, this.container_maxwidth);
        var max_height = Math.max(height, this.container_maxheight);

        var step_count = this._step_count;
        //var step_index = this._step_index;
        var step_containers = this._step_containers;
        var step_client_elem;
        var i;
        if (this._apply_client_padding)
        {
            if (client_elem)
            {
                client_elem.setElementSize(width, height);

                if (step_count > 0 && step_containers)
                {
                    if (this._use_translate_scroll)
                    {
                        for (i = 0; i < step_count; i++)
                        {
                            step_client_elem = step_containers[i];
                            if (step_client_elem)
                            {
                                step_client_elem.setElementSize(width, max_height);
                                dest_handle = step_client_elem.dest_handle;
                                if (dest_handle)
                                    nexacro.__setDOMStyle_Size(dest_handle.style, width, max_height);
                            }
                        }
                    }
                    else if (this._use_container_move)
                    {
                        for (i = 0; i < step_count; i++)
                        {
                            step_client_elem = step_containers[i];
                            if (step_client_elem)
                            {
                                step_client_elem.setElementSize(zclient_width, height);
                                dest_handle = step_client_elem.dest_handle;
                                if (dest_handle)
                                {
                                    nexacro.__setDOMStyle_Size(dest_handle.style, width, height);
                                }
                            }
                        }
                    }
                }
            }
            else if (handle && handle != dest_handle)
            {
                nexacro.__setDOMStyle_Size(dest_handle.style, width, height);
            }
        }
        else
        {
            if (client_elem)
            {
                if (step_count > 0 && step_containers)
                {
                    for (i = 0; i < step_count; i++)
                    {
                        step_client_elem = step_containers[i];
                        if (step_client_elem)
                        {
                            step_client_elem.setElementSize(zclient_width, max_height);
                        }
                    }
                }
                else
                {
                    client_elem.setElementSize(width, height);
                }
            }
        }

        if (client_elem && client_elem._use_translate_scroll)
        {
            if (this._use_multiinner)
            {
                client_elem.setElementScrollMaxSize(max_width, max_height);
            }
            else
            {
                if (client_elem.dest_handle)
                {
                    nexacro.__setDOMStyle_Size(client_elem.dest_handle.style, max_width, max_height);
                }
            }
        }

        var control = this.linkedcontrol;
        if (control)
        {
            control.on_change_containerRect(width, height);
        }
    };

    _pScrollableControlElement._on_change_clientSizeExpand = function (width, height)
    {
        var client_elem = this._client_elem;
        if (client_elem)
        {
            client_elem.setElementSize(width, height);
        }
        else
        {
            var handle = this.handle;
            var dest_handle = this.dest_handle;
            if (handle && handle != dest_handle & this._apply_client_padding)
            {
                nexacro.__setDOMStyle_Size(dest_handle.style, width, height);
            }
        }

        var control = this.linkedcontrol;
        if (control)
        {
            control.on_change_containerRect(width, height);
        }
    };

    _pScrollableControlElement._setAttachClientLeft = function (left)
    {
        if (this._attach_client_left != left)
        {
            this._attach_client_left = left;
            this._updateClientRect();
        }
    };

    _pScrollableControlElement._setAttachClientRight = function (right)
    {
        if (this._attach_client_right != right)
        {
            this._attach_client_right = right;
            this._updateClientRect();
        }
    };

    _pScrollableControlElement._setAttachClientTop = function (top)
    {
        if (this._attach_client_top != top)
        {
            this._attach_client_top = top;
            this._updateClientRect();
        }
    };

    _pScrollableControlElement._setAttachClientBottom = function (bottom)
    {
        if (this._attach_client_bottom != bottom)
        {
            this._attach_client_bottom = bottom;
            this._updateClientRect();
        }
    };

    _pScrollableControlElement._on_updateClientRect = function ()
    {
        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;

        //var cur_inner_width = client_width;
        //var cur_inner_height = client_height;
        var cur_client_width = this.client_width;
        //var cur_client_height = this.client_height;

        if (this._container_minwidth != undefined)
        {
            if (this._container_minwidth > client_width)
                client_width = this._container_minwidth;
        }


        if (this._apply_client_padding)
        {
            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }
        }

        if (this._attach_client_left > 0)
        {
            client_left += this._attach_client_left;
            client_width -= this._attach_client_left;

            if (client_width < 0)
                client_width = 0;
        }

        if (this._attach_client_right > 0)
        {
            client_width -= this._attach_client_right;

            if (client_width < 0)
                client_width = 0;
        }

        if (this._attach_client_top > 0)
        {
            client_top += this._attach_client_top;
            client_height -= this._attach_client_top;

            if (client_height < 0)
                client_height = 0;
        }

        if (this._attach_client_bottom > 0)
        {
            client_height -= this._attach_client_bottom;
            if (client_height < 0)
                client_height = 0;
        }

        // recalc scroll_left/scroll_top
        var client_elem = this._client_elem;
        if (!client_elem)// || client_width == 0 || client_height == 0)
            return 0;

        var zoomfactor = this.zoom / 100;
        var zclient_width = this._zclient_width = client_width / zoomfactor;
        var zclient_height = this._zclient_height = client_height / zoomfactor;

        var container_maxwidth = this.container_maxwidth;
        var container_maxheight = this.container_maxheight;

        var contents_maxwidth = this._contents_maxwidth;
        var contents_maxheight = this._contents_maxheight;
        var has_contents_size = this._has_contents_size;

        var scroll_left = this.scroll_left;
        var scroll_top = this.scroll_top;
        /*
        if (zoomfactor != 1)
        {
            zclient_width = zclient_width;
            zclient_height = zclient_height;
            container_maxwidth = container_maxwidth;
            container_maxheight = container_maxheight;
        }
        */
        var step_count = this._step_count;
        var pre_step_count = this._pre_step_count;
        var is_change_step_cnt = false;
        is_change_step_cnt = step_count != pre_step_count;
        //var step_index = this._step_index;
        var step_containers = this._step_containers;
        if ((step_count > 0 && step_containers) || is_change_step_cnt)
        {
            container_maxwidth = step_count * zclient_width;
        }

        var reset_vlimit = false;
        var reset_hlimit = false;

        //var hscroll_visible = false;
        //var vscroll_visible = false;

        var hscroll_limit = 0;
        var vscroll_limit = 0;

        var hscrollbartype = this._hscrollbartype;
        var vscrollbartype = this._vscrollbartype;
        var scrolltype = this._scrolltype;

        if ((step_count > 0 && step_containers) || is_change_step_cnt)
        {
            hscrollbartype = "none";
        }

        if (container_maxwidth > zclient_width)
        {
            if (/*(scrolltype != "none" && scrolltype != "vertical") &&*/ hscrollbartype != "none" && hscrollbartype != "autoindicator")
            {
                client_height -= this._hscroll_size;
                zclient_height = client_height / zoomfactor;
            }

            hscroll_limit = container_maxwidth - zclient_width;
        }
        else
        {
            if (hscrollbartype == "fixed")
            {
                client_height -= this._hscroll_size;
                zclient_height = client_height / zoomfactor;
            }

            //hscroll_limit = 0;
        }

        // 변경된 inner의 사이즈를 기준으로 client를 재계산 해야하는부분에서 현재 client의 값을 비교하는게 이상함.
        if (container_maxheight > zclient_height && (has_contents_size ? contents_maxheight > zclient_height : true))
        {
            //if (container_maxheight >= zclient_height)
            vscroll_limit = container_maxheight - zclient_height;
            //else if (container_maxheight > cur_client_height)
            //    vscroll_limit = container_maxheight - cur_client_height;

            if (/*(scrolltype != "none" && scrolltype != "horizontal") &&*/ vscrollbartype != "none" && vscrollbartype != "autoindicator")
            {
                client_width -= this._vscroll_size;
                zclient_width = client_width / zoomfactor;
            }

            if (container_maxwidth > zclient_width && (has_contents_size ? contents_maxwidth > zclient_width : true))
            {
                if (/*(scrolltype != "none" && scrolltype != "vertical") &&*/ hscrollbartype != "none" && hscrollbartype != "autoindicator" && hscroll_limit == 0)
                {
                    client_height -= this._hscroll_size;
                    zclient_height = client_height / zoomfactor;
                    vscroll_limit += this._hscroll_size;
                }
                hscroll_limit = container_maxwidth - zclient_width;
            }
            else if (container_maxwidth > cur_client_width)
            {
                hscroll_limit = container_maxwidth - cur_client_width;
            }

        }
        else
        {
            if (vscrollbartype == "fixed")
            {
                client_width -= this._vscroll_size;
                zclient_width = client_width / zoomfactor;

                if (container_maxwidth > zclient_width)
                {
                    hscroll_limit = container_maxwidth - zclient_width;
                }
                else if (container_maxwidth > cur_client_width)
                {
                    hscroll_limit = container_maxwidth - cur_client_width;
                }

            }
            //vscroll_limit = 0;
        }

        if ((step_count > 0 && step_containers) || is_change_step_cnt)
        {
            container_maxwidth = step_count * zclient_width;

            if (container_maxwidth > zclient_width)
            {
                hscroll_limit = container_maxwidth - zclient_width;
            }
        }

        if (this.hscroll_limit != hscroll_limit)
        {
            reset_hlimit = true;
            this.hscroll_limit = hscroll_limit;

            if (scroll_left > hscroll_limit && hscroll_limit >= 0)
            {
                this.setElementHScrollPos(hscroll_limit);
            }
        }

        if (this.vscroll_limit != vscroll_limit)
        {
            reset_vlimit = true;
            this.vscroll_limit = vscroll_limit;

            if (scroll_top > vscroll_limit && vscroll_limit >= 0)
            {
                this.setElementVScrollPos(vscroll_limit);
            }
        }

        this._zclient_width = zclient_width;
        this._zclient_height = zclient_height;

        var ret = 0;
        if (this.client_left != client_left || this.client_top != client_top)
        {
            this.client_left = client_left;
            this.client_top = client_top;
            ret = 1;
        }
        else if (step_count > 0)
            ret = 1;

        var cw = this.client_width != client_width;
        var ch = this.client_height != client_height;

        //여러 case에 대해 테스트 필요!
        if (cw || ch)
        {
            this.client_width = client_width;
            this.client_height = client_height;
            ret += 2;
        }
        else if (this.client_width != zclient_width || this.client_height != zclient_height)
        {
            ret += 2;
        }
        else if (reset_hlimit || reset_vlimit)
        {
            ret += 2;
        }
        return ret;
    };

    _pScrollableControlElement._on_updateClientRectExpand = function ()
    {
        var ret = 0;

        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;

        if (!this._client_elem)
            return ret;

        if (this._apply_client_padding)
        {
            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }
        }

        if (this._expandbartype && this._expanddirtype == "vert")
        {
            client_height -= this._expandbarheight;
        }

        if (this._expandbartype && this._expanddirtype == "horz")
        {
            client_width -= this._expandbarwidth;
        }

        if (this.client_left != client_left || this.client_top != client_top)
        {
            this.client_left = client_left;
            this.client_top = client_top;
            ret = 1;
        }

        if (this.client_width != client_width || this.client_height != client_height)
        {
            this.client_width = this._zclient_width = client_width;
            this.client_height = this._zclient_height = client_height;
            ret += 2;
        }

        return ret;
    };

    _pScrollableControlElement._getElementScrollType = function (scrolltype)
    {
        //10 - veritical , 01-  horizontal
        var ret = 0x11;
        if (scrolltype == "both")
            ret = 0x00;
        else if (scrolltype == "horizontal")
            ret = 0x01;
        else if (scrolltype == "vertical")
            ret = 0x10;
        return ret;
    };

    _pScrollableControlElement._setElementContentsMaxSize = function (width, height)
    {
        if (this._contents_maxwidth != width || this._contents_maxheight != height)
        {
            this._contents_maxwidth = width;
            this._contents_maxheight = height;
            this._has_contents_size = true;
        }
    };

    //======================================================================
    // nexacro.FrameControlElement - this Element is Frame ControlElement --> this is simple control element
    //======================================================================
    // this FrameControlElement has ScrollControlElement
    nexacro.FrameControlElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

        //remove Inner Container
        this._border_elems = new nexacro.Collection();
    };
    var _pFrameControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.FrameControlElement);
    nexacro.FrameControlElement.prototype = _pFrameControlElement;
    // overide nexacro.Object
    _pFrameControlElement._type_name = "FrameControlElement";

    //==== defaule values =========//
    _pFrameControlElement._title_control = null;
    _pFrameControlElement._status_control = null;
    _pFrameControlElement._title_height = 0;
    _pFrameControlElement._status_height = 0;
    _pFrameControlElement._title_top = 0;
    _pFrameControlElement._title_width = 0;
    _pFrameControlElement._status_top = 0;
    _pFrameControlElement._status_width = 0;
    _pFrameControlElement._max_child_zindex = 0;
    _pFrameControlElement._is_window_element = false;
    //==== internal variables =========//
    _pFrameControlElement._resizable = false;

    //==== internal handles =========//
    _pFrameControlElement._doc = null;         // Document Handle == HTML Document
    //==== default flags =========//
    //==== end of initial =========//

    _pFrameControlElement.create = function (win)
    {
        var _doc, handle, handle_style, inner_node, innernodestyle;
        if (!this.handle)
        {
            if (this.parent_elem == null)
            {
                // if parent is Window
                //var _win = this.linkedcontrol._getWindow();
                _doc = this._doc = win._doc;
                this.owner_elem = win;
                this._is_window_element = true;
                this.left = 0;
                this.top = 0;
                if (nexacro._allow_default_pinchzoom)
                {
                    this.width = nexacro._getContainerHandleClientWidth(win.handle);
                    this.height = nexacro._getContainerHandleClientHeight(win.handle);
                }
                else
                {
                    this.width = win.clientWidth; // 이렇게 하면 mainframe node 크기가 맞질 않음 .. (border가 있는 경우)
                    this.height = win.clientHeight;
                }
                // nexacro.Window 의 handle 이 Window 가 아니고 Container Element 일 경우 MFE 

                if (!nexacro._ishandleWindow(win.handle))
                {
                    const rect = nexacro._getContentRect(win.handle)
                    this.left = rect.paddingLeft;
                    this.top = rect.paddingTop;

                    handle = _doc.createElement("div");



                    handle.id = this.name;
                    handle._linked_element = this;

                    this.handle = this.dest_handle = handle;
                    nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
                }
                else
                {

                    handle = win.dest_handle;
                    handle.id = this.name;
                    handle._linked_element = this;

                    this.handle = this.dest_handle = handle;
                    nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());
                }

                nexacro.__setHTMLAttr_Property(handle, "data-screen", nexacro._getCurrentScreenType());


                if (!this._is_simple_control)
                {
                    inner_node = _doc.createElement("div");
                    this.dest_handle = inner_node;
                    nexacro.__setDOMNode_ClassName(inner_node, this._getElementNexaClassName("nexasimplecontainer"));

                    var linkedcontrol = this.parent;
                    var id_str = (linkedcontrol._is_window) ? "nexacontainer" : (this.name + ":container"); //mainframe, openwindow(childframe)

                    nexacro.__setDOMNode_Id(inner_node, "", id_str);
                    nexacro.__appendDOMNode(handle, inner_node);

                    innernodestyle = inner_node.style;
                    nexacro.__setDOMStyle_Pos(innernodestyle, this.client_left, this.client_top);
                    nexacro.__setDOMStyle_Size(innernodestyle, this.client_width, this.client_height);
                }

                /////////////////////////////////
                handle_style = handle.style;

                // PopupComponent 가 Body 바깥으로 나갔을 때 scroll 방지를 위해 fixed로 변경

                // pinchzoom시 Fixed이면 스크롤이 불가능함
                // desktop환경에서는 무조건 fixed로 (pinchzoom을 못함)
                // Mobile에서 화면 아래쪽에 Edit가 Focus 될 때 KeyPad에 가려짐
                if (!nexacro._allow_default_pinchzoom && nexacro._isDesktop())
                {
                    if (!nexacro._ishandleWindow(win.handle))
                    {
                        nexacro.__setDOMStyle_Absolute(handle_style);
                        nexacro.__setDOMStyle_Pos(handle_style, this.client_left, this.client_top);
                        nexacro.__setDOMStyle_Size(handle_style, this.client_width, this.client_height);
                    }
                    else
                        nexacro.__setDOMStyle_Fixed(handle_style);
                }

                // render & create Background SubElements
                this._refreshControl(handle, handle_style, _doc);

                //remove Inner Container
                //if (this._client_elem)
                //	this._client_elem.create();

                //bordernone
                nexacro.__setDOMStyle_BorderNone(handle_style, true, true, true, true, this.border, this.rtl);

                if (!nexacro._ishandleWindow(win.handle))
                {
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
                    if (this.width && this.height)
                        nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);
                    nexacro.__appendDOMNode(nexacro._getWindowDestinationHandle(win.handle), handle);
                }

                // no need set & create props for child
                // props are already setted to client_elem
                // client_elem is created by Component
            }
            else
            {
                // parent is always control element
                var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement();
                if (owner_elem && owner_elem.handle && !this.handle)
                {
                    this.owner_elem = owner_elem;
                    _doc = owner_elem._getRootWindowHandle();
                    handle = _doc.createElement("div");

                    handle.id = this.name;
                    handle._linked_element = this;

                    this.handle = this.dest_handle = handle;
                    nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

                    /////////////////////////////////
                    handle_style = handle.style;
                    if (owner_elem instanceof nexacro.ModalOverlayElement) // [REQ35522] 2014-05-28 showmodal fixed
                    {
                        if (!nexacro._allow_default_pinchzoom && nexacro._isDesktop())  // mobile에서 fixed 사용하면 안됨
                            nexacro.__setDOMStyle_Fixed(handle_style);
                        // else
                        //     nexacro.__setDOMStyle_Absolute(handle_style);
                    }
                    /*
                    else
                    {
                        nexacro.__setDOMStyle_Absolute(handle_style);
                    }*/

                    if (!this._is_simple_control)
                    {
                        inner_node = _doc.createElement("div");
                        this.dest_handle = inner_node;
                        nexacro.__setDOMNode_ClassName(inner_node, this._getElementNexaClassName("nexasimplecontainer"));
                        var linkedcontrol = this.parent;
                        var id_str = (linkedcontrol._is_window == true) ? "nexacontainer" : (this.name + ":container"); //mainframe, openwindow(childframe)

                        nexacro.__setDOMNode_Id(inner_node, "", id_str);
                        nexacro.__appendDOMNode(handle, inner_node);

                        innernodestyle = inner_node.style;
                        //					    if (this.client_left || this.client_top)
                        nexacro.__setDOMStyle_Pos(innernodestyle, this.client_left, this.client_top);
                        if (this.client_width && this.client_height)
                            nexacro.__setDOMStyle_Size(innernodestyle, this.client_width, this.client_height);
                    }

                    //if (this.left || this.top)
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
                    if (this.width && this.height)
                        nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                    // render & create Background SubElements
                    this._refreshControl(handle, handle_style, _doc);

                    // append TO Parent Element
                    nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
                }
            }

            if (this._resizable)
            {
                this._createBorderElements();
                this._updateBorderElementsPosition();
            }

        }
        else
        {
            // frameset에서 빼낸 경우 element는 그대로 존재함.
            if (this.parent_elem == null)
            {
                // if parent is Window
                var _win = win;
                if (this.handle != _win.root._control_element.handle)
                {
                    var old_handle = this.handle;

                    _doc = this._doc = _win._doc;
                    handle = _win.root._control_element.handle;

                    this.owner_elem = _win;
                    this._is_window_element = true;
                    this.left = 0;
                    this.top = 0;
                    this.width = _win.clientWidth;
                    this.height = _win.clientHeight;

                    handle.id = this.name;
                    handle._linked_element = this;

                    this.handle = this.dest_handle = handle;

                    /////////////////////////////////
                    handle_style = handle.style;

                    // 기존에 border가 있었다면 제거
                    if (this.border)
                        this.border = null;

                    this._title_height = 0;
                    this._status_height = 0;

                    //if (this.left || this.top)
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
                    if (this.width && this.height)
                        nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                    // render
                    this._refreshControl(handle, handle_style, _doc);

                    if (old_handle.hasChildNodes())
                    {
                        var childs = old_handle.childNodes;
                        for (var i = 0; i < childs.length; i++)
                        {
                            var child = childs[i];
                            nexacro.__appendDOMNode(handle, child);
                        }
                    }
                }
            }
        }
    };


    _pFrameControlElement.setLinkedControl = function (control)
    {
        if (!this.linkedcontrol && control)
        {
            this._p_parent = control;
            this.linkedcontrol = control;
            this.id = control.id;
            if (!this.parent_elem)
            {
                if (nexacro.ismodule && this.linkedcontrol.__containerhandle)
                {
                    control._unique_id = this.linkedcontrol.__containerhandle.id + "." + control._unique_id;
                    this._p_name = nexacro._prefixIDRootNodeClassName(control._unique_id);
                }
                else
                    this._p_name = nexacro._prefixIDRootNodeClassName(control._unique_id);
            }
            else
                this._p_name = control._unique_id;
        }
    };

    _pFrameControlElement._on_destroy = function ()
    {
        this._destroyBorderElements();

        this._title_control = null;
        this._status_control = null;
    };

    //frame don't supported padding
    _pFrameControlElement.setElementCSSMapInfo = function (border, padding, edge)
    {
        if (this.linkedcontrol && this.linkedcontrol._is_window)  //mainframe, openwindow(childframe)
            border = null;

        nexacro.ControlElement.prototype.setElementCSSMapInfo.call(this, border, null, edge);
    };

    _pFrameControlElement._getRootWindowHandle = function ()
    {
        if (this._is_window_element)
            return this._doc;
        else if (this.owner_elem)
            return this.owner_elem._getRootWindowHandle();
        else if (this.parent && this.parent._getRootWindowHandle)
            return this.parent._getRootWindowHandle();
        return null;
    };

    _pFrameControlElement.setElementBorder = function (border)
    {
        // Window Frame은 웹브라우저의 border가 있기때문에 Frame의 border는 제거한다.
        if (this.linkedcontrol && this.linkedcontrol._is_window)
            return;

        // update Border & Background SubElements
        nexacro.ControlElement.prototype.setElementBorder.call(this, border);
    };

    _pFrameControlElement._updateClientRect = function ()
    {
        var ret = this._on_updateClientRect();
        if (ret & 1)
            this._on_change_clientPos(this.client_left, this.client_top);
        if (ret & 2)
            this._on_change_clientSize(this.client_width, this.client_height);

        if (ret)
            this._updateBorderElementsPosition();
    };

    _pFrameControlElement._setAttachClientLeft = function (left)
    {
        if (this._attach_client_left != left)
        {
            this._attach_client_left = left;
            this._updateClientRect();
        }
    };

    _pFrameControlElement._setAttachClientRight = function (right)
    {
        if (this._attach_client_right != right)
        {
            this._attach_client_right = right;
            this._updateClientRect();
        }
    };

    _pFrameControlElement._setAttachClientTop = function (top)
    {
        if (this._attach_client_top != top)
        {
            this._attach_client_top = top;
            this._updateClientRect();
        }
    };

    _pFrameControlElement._setAttachClientBottom = function (bottom)
    {
        if (this._attach_client_bottom != bottom)
        {
            this._attach_client_bottom = bottom;
            this._updateClientRect();
        }
    };

    _pFrameControlElement._on_updateClientRect = function ()
    {
        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;

        if (this._apply_client_padding)
        {
            var padding = (this.padding || this._padding_info);
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }
        }

        var title_control = this._title_control;
        if (title_control)
        {
            if (!this._is_verticalmin && (this.client_left != client_left || this._title_top != client_top || this._title_width != client_width))
            {
                this._title_top = client_top;
                this._title_width = client_width;
                title_control.move(client_left, client_top, client_width, this._title_height);
            }
            else if (this._is_verticalmin && (this.client_top != client_top || this._title_top != client_top || this._title_height != client_height))
            {
                this._title_top = client_top;
                this._title_width = client_width;
                title_control.move(client_left, client_top, client_width, client_height);
            }
            client_top += this._title_height;
            client_height -= this._title_height;
            if (client_height < 0) client_height = 0;
        }
        else
        {
            this._title_top = client_top;
        }

        // recalc client_top/client_height
        var status_control = this._status_control;
        if (status_control)
        {
            if (this._status_height > 0)
            {
                client_height -= this._status_height;
                if (client_height < 0) client_height = 0;
            }
            var status_top = client_top + client_height;
            if (this.client_left != client_left || this._status_top != status_top || this._status_width != client_width)
            {
                this._status_top = status_top;
                this._status_width = client_width;
                status_control.move(client_left, status_top, client_width, this._status_height);
            }
        }
        else
        {
            this._status_top = client_top + client_height;
        }

        if (this._attach_client_left > 0)
        {
            client_left += this._attach_client_left;
            client_width -= this._attach_client_left;

            if (client_width < 0)
                client_width = 0;
        }

        if (this._attach_client_right > 0)
        {
            client_width -= this._attach_client_right;

            if (client_width < 0)
                client_width = 0;
        }

        if (this._attach_client_top > 0)
        {
            client_top += this._attach_client_top;
            client_height -= this._attach_client_top;

            if (client_height < 0)
                client_height = 0;
        }

        if (this._attach_client_bottom > 0)
        {
            client_height -= this._attach_client_bottom;
            if (client_height < 0)
                client_height = 0;
        }

        var ret = 0;
        if (this.client_left != client_left || this.client_top != client_top)
        {
            this.client_left = client_left;
            this.client_top = client_top;
            ret = 1;
        }
        if (this.client_width != client_width || this.client_height != client_height)
        {
            this.client_width = client_width;
            this.client_height = client_height;
            ret += 2;
        }
        return ret;
    };

    _pFrameControlElement.appendChildElement = function (child_elem)
    {
        // FrameControlElement > ContainerElement > Form Element
        // Frame의 ClientElement에 대한 내용 적용.
        if (this.handle)
        {
            if (!this._client_elem)
            {
                // it's impossible
                return;
            }

            if (child_elem.parent_elem == this._client_elem)
            {
                child_elem._is_nc_element = true;
            }
            else
            {
                if (child_elem.handle)
                {
                    var old_doc = child_elem._getRootWindowHandle();
                    var new_doc = this._getRootWindowHandle();
                    if (old_doc != new_doc)
                    {
                        child_elem.parent_elem = this._client_elem;
                        // for recreate Child Element Handle
                        child_elem._removeFromContainer();
                    }
                    else
                    {
                        child_elem.parent_elem = this._client_elem;
                    }
                }
                else
                {
                    child_elem.parent_elem = this._client_elem;
                }
            }

            // child element(form) : set as nc element
            child_elem._is_nc_element = true;

            // control for client element
            child_elem.setElementPosition(0, 0);
            child_elem.setElementSize(this.client_width, this.client_height);

            // if child element is not created ==> create child handle
            if (!child_elem.handle)
            {
                child_elem.create();
            }
            else
            {
                child_elem._appendToContainer(this._client_elem);
            }
        }
    };

    _pFrameControlElement.removeChildElement = function (child_elem)
    {
        // Frame의 ClientElement에 대한 내용 적용.

        // this child element is client element
        if (child_elem.parent_elem == this)
        {
            child_elem._removeFromContainer();
        }
    };

    _pFrameControlElement.sendToBackElement = function (elem)
    {
        if (elem && elem.owner_elem &&
            elem.owner_elem.owner_elem == this.owner_elem && elem.handle)
        {
            nexacro.__sendDOMNodeToBack(elem.handle);
            if (elem._border_elems)
            {
                for (var i = 0; i < elem._border_elems.length; i++)
                    nexacro.__sendDOMNodeToBack(elem._border_elems[i].handle);
            }
        }
    };

    _pFrameControlElement.bringToFrontElement = function (elem)
    {
        // click event 문제로 z-index를 사용하도록 함.
        if (this.handle)
        {
            this._max_child_zindex++;

            // frame은 resizable인 경우 border element를 8개 갖기때문에, ..
            // frame의 zIndex는 10단위로 구성한다. border element는 10+a의 zIndex를 갖는다.
            var new_zindex = (this._max_child_zindex * 10);

            elem.setElementZIndex(new_zindex);
            if (elem._border_elems)
            {
                for (var i = 0; i < elem._border_elems.length; i++)
                {
                    elem._border_elems[i].setElementZIndex(new_zindex + (i + 1));
                }
            }
        }
    };

    _pFrameControlElement.moveToNextElement = function (elem, base_elem)
    {
        var client_elem = this.getContainerElement(elem.position_step);
        client_elem.moveToNextElement(elem, base_elem);
    };

    _pFrameControlElement.moveToPrevElement = function (elem, base_elem)
    {
        var client_elem = this.getContainerElement(elem.position_step);
        client_elem.moveToPrevElement(elem, base_elem);
    };

    //======================================================================
    _pFrameControlElement.setTitleBarControl = function (title_control, title_height)
    {
        this._title_control = title_control;
        if (title_control)
        {
            // child element(form) : set as nc element
            this._title_height = parseInt(title_height) | 0;
            this._title_width = 0;
        }
        else
        {
            this._title_height = 0;
            this._title_width = 0;
        }

        this._updateClientRect();
    };

    _pFrameControlElement.setTitleBarDrag = function (title_control, value)
    {
        if (title_control)
            nexacro.__setDOMNode_WebkitAppRegion(title_control.handle, value);
    };

    _pFrameControlElement.setStatusBarControl = function (status_control, status_height)
    {
        this._status_control = status_control;
        if (status_control)
        {
            // child element(form) : set as nc element
            this._status_height = parseInt(status_height) | 0;
            this._status_width = 0;
        }
        else
        {
            this._status_height = 0;
            this._status_width = 0;
        }

        this._updateClientRect();
    };


    _pFrameControlElement._createBorderElements = function ()
    {
        if (this.parent == null || this.parent_elem == null)
            return;

        if (this._border_elems.length > 0)
        {
            // TODO check element.create가 두번 타는 case가 있음. (frame 동적생성시)
            return;
        }

        // 총 8개 resize영역에 해당하는 element 생성
        var i, border_elem;
        var name_table = Array("lt", "t", "rt", "l", "r", "lb", "b", "rb");
        for (i = 0; i < 8; i++)
        {
            border_elem = new nexacro._FrameResizeBorderElement(this.parent_elem);

            // Event 발생시 Search를 위해 Parent를 조절함.
            // Node는 상위에 포함시키고, Element는 Frame에..
            border_elem.parent = this;

            this._border_elems.add_item(name_table[i], border_elem);
        }

        this._setResizable(this._resizable);

        var win = this.linkedcontrol._getWindow();

        for (i = 0; i < 8; i++)
        {
            border_elem = this._border_elems[i];
            border_elem.linkedcontrol = this.linkedcontrol; // trackevent를 direct로 날림
            border_elem.create(win);
        }
    };

    _pFrameControlElement._destroyBorderElements = function ()
    {
        var cnt = this._border_elems.length;
        for (var i = 0; i < cnt; i++)
        {
            this._border_elems[i].destroy();
            this._border_elems[i] = null;
        }

        this._border_elems.clear();
        this._border_elems = null;
    };

    // border element 때문에 재정의함
    _pFrameControlElement.setElementPosition = function (x, y)
    {
        nexacro.ControlElement.prototype.setElementPosition.call(this, x, y);
        this._updateBorderElementsPosition();
    };


    _pFrameControlElement._updateBorderElementsPosition = function ()
    {
        if (this._border_elems.length == 0)
            return;

        var border = this.border || this._border_info;
        var lw = 0, tw = 0, rw = 0, bw = 0;
        if (border)
        {
            if (border._single == 1)
            {
                lw = tw = rw = bw = border._getBorderWidth();
            }
            else
            {
                // TODO check
                lw = border.left._width;
                tw = border.top._width;
                rw = border.right._width;
                bw = border.bottom._width;
            }
        }

        var inner_width = this.inner_width;
        var inner_height = this.inner_height;

        // 최소 5픽셀을 resize영역으로 잡을수 있도록 함. border가 얇은 경우 border 안쪽까지 보장
        if (lw < 5)
        {
            var lx = 5 - lw;
            lw += lx;
            inner_width -= lx;
        }
        if (tw < 5)
        {
            var tx = 5 - tw;
            tw += tx;
            inner_height -= tx;
        }
        if (rw < 5)
        {
            var rx = 5 - rw;
            rw += rx;
            inner_width -= rx;
        }
        if (bw < 5)
        {
            var bx = 5 - bw;
            bw += bx;
            inner_height -= bx;
        }

        var left = this.left;
        var top = this.top;
        //var right = left + this.width;
        //var bottom = top + this.height;

        // set BorderElementPos
        var x = left;
        var y = top;
        var i;
        for (i = 0; i < 8; i++)
        {
            this._border_elems[i].setElementPosition(x, y);
            switch (i)
            {
                case 0: x += lw; break;
                case 1: x += inner_width; break;
                case 2: x = left; y += tw; break;
                case 3: x += (lw + inner_width); break;
                case 4: x = left; y += inner_height; break;
                case 5: x += lw; break;
                case 6: x += inner_width; break;
                case 7: break;
            }
        }
        // set BorderElementSize
        var w, h;
        for (i = 0; i < 8; i++)
        {
            if (i == 0 || i == 3 || i == 5) w = lw;
            if (i == 1 || i == 6) w = inner_width;
            if (i == 2 || i == 4 || i == 7) w = rw;
            if (i < 3) h = tw;
            else if (i < 5) h = inner_height;
            else h = bw;
            this._border_elems[i].setElementSize(w, h);
        }
    };

    _pFrameControlElement._setResizable = function (resizable)
    {
        this._resizable = resizable;
        if (this.handle)
        {
            if (this._border_elems.length == 0)
            {
                if (resizable)
                {
                    this._createBorderElements();
                    this._updateBorderElementsPosition();
                }
                else
                    return;
            }

            var cursor_table = Array("nw", "n", "ne", "w", "e", "sw", "s", "se");
            for (var i = 0; i < 8; i++)
            {
                var border_elem = this._border_elems[i];
                border_elem._is_track = resizable;

                var cursor;
                if (resizable)
                    cursor = nexacro.CursorObject(cursor_table[i] + "-resize");
                else
                    cursor = nexacro.CursorObject("arrow"); // TODO check default로 되돌릴 방법??
                border_elem.setElementCursor(cursor);
            }
        }

        //// TODO statusbar grip image
        var statuscontrol = this._status_control;
        if (statuscontrol)
            statuscontrol.set_resizable(resizable);
    };

    //======================================================================
    // nexacro._FrameResizeBorderElement
    //======================================================================
    nexacro._FrameResizeBorderElement = function (parent_elem)
    {
        this._p_parent = parent_elem;  // frame client elem
        this.parent_elem = parent_elem;
    };

    var __pFrameResizeBorderElement = nexacro._createPrototype(nexacro.ControlElement, nexacro._FrameResizeBorderElement);
    nexacro._FrameResizeBorderElement.prototype = __pFrameResizeBorderElement;

    __pFrameResizeBorderElement._type_name = "FrameResizeBorderElement";
    __pFrameResizeBorderElement._is_simple_control = true;

    // resize border element는 controlelement의 일부만 필요하기 때문에 다시 재정의
    // cssclass, container, accessibility, fluidlayout, multiinner, stepcount, id 제외
    __pFrameResizeBorderElement.create = function (win)
    {
        // if parent is control element
        var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement();
        if (owner_elem && owner_elem.handle && !this.handle)
        {
            this.owner_elem = owner_elem;
            var _doc = win._doc || owner_elem._getRootWindowHandle();
            var handle = _doc.createElement("div");
            handle._linked_element = this;

            this.handle = this.dest_handle = handle;

            /////////////////////////////////
            var handle_style = handle.style;
            nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
            nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

            // render & create Background SubElements
            this._refreshControl(handle, handle_style, _doc);

            //container element create
            // no need set props for child --> only create it
            // props are already setted to child_elem
            //if (this._client_elem)
            //	this._client_elem.create();

            // append TO Parent Element
            nexacro.__appendDOMNode(this._is_nc_element ? owner_elem.handle : owner_elem.dest_handle, handle);
        }
    };

    __pFrameResizeBorderElement._on_starttrack = function ()
    {
        this.linkedcontrol._on_border_starttrack(this.cursor);
    };
    __pFrameResizeBorderElement._on_endtrack = function (x, y, dragdata)
    {
        this.linkedcontrol._on_border_endtrack(x, y, dragdata);
    };
    __pFrameResizeBorderElement._on_movetrack = function (x, y, dragdata)
    {
        this.linkedcontrol._on_border_movetrack(x, y, dragdata);
    };

    __pFrameResizeBorderElement._updateClientRect = nexacro._emptyFn;

    //======================================================================
    // nexacro.ModalOverlayElement - simple overlay
    //======================================================================
    nexacro.ModalOverlayElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

    };

    var _pModalOverlayElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.ModalOverlayElement);
    nexacro.ModalOverlayElement.prototype = _pModalOverlayElement;
    _pModalOverlayElement._type_name = "ModalOverlayElement";
    _pModalOverlayElement.__parentwindow = null;
    _pModalOverlayElement._is_modaloverlay = true;
    _pModalOverlayElement.create = function (win)
    {
        /* 크기는 브라우저 전체를 덮지만 이벤트 핸들링은 modal을 띄운 주체로 넘어가는 형태로 수정한다.*/
        this.__parentwindow = win;

        if (this.parent_elem && !this.handle)
        {
            var _doc = this._doc = this.parent_elem._getRootWindowHandle();
            var handle = _doc.createElement("div");
            handle._linked_element = this;


            this.handle = this.dest_handle = handle;

            /////////////////////////////////
            var handle_style = handle.style;

            let width = nexacro.ismodule ? nexacro._getWindowHandleClientWidth(win.handle) : win.clientWidth;
            let height = nexacro.ismodule ? nexacro._getWindowHandleClientHeight(win.handle) : win.clientHeight;

            width = nexacro._getWindowOverlayWidth(width);
            height = nexacro._getWindowOverlayHeight(height);

            nexacro.__setDOMNode_ClassName(handle, this._getElementNexaClassName("nexamodaloverlay"));
            nexacro.__setDOMNode_Id(handle, "", this.name + ":container");
            nexacro.__setDOMStyle_Pos(handle_style, 0, 0);
            nexacro.__setDOMStyle_Size(handle_style, width, height);
            nexacro.__setDomNode_PopOver(handle);

            var owner_elem = win.root.getElement();
            var waitcomp_elem = win.root._getWaitComponentElement();
            var ref_dest_handle = null;
            if (waitcomp_elem)
            {
                ref_dest_handle = waitcomp_elem.handle;
            }
            // insertBefore WaitCursor
            if (ref_dest_handle)
            {
                // WaitCursor가 먼저 생성된 경우
                owner_elem.dest_handle.insertBefore(handle, ref_dest_handle);
            }
            else
            {
                // WaitCursor가 아직 생성된적이 없는 경우
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
            }

            /*

            if (this._client_elem)
            {
                this._client_elem.setElementSize(this.width, this.height);
                this._client_elem.create();
            }
            */
            this._refreshControl(handle, handle.style, _doc);
            this._createBackgroundElement(_doc, handle, width, height);
            if (nexacro._isDesktop())
            {
                if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                {
                    var _window = this._getWindow();
                    if (_window)
                    {   // chrome에서 modal popup시에 흐려짐 현상 처리 
                        this.setElementZoom(_window._wheelZoom);
                    }
                }
            }
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility && env._a11ytype == 5)
                nexacro.__removeHTMLAttr_Property(handle, "tabindex");




        }

    };

    _pModalOverlayElement._getSysEvent = function ()
    {
        return nexacro.HTMLSysEvent._getSysEvent(this.__parentwindow.handle);
    };

    _pModalOverlayElement._iframe_eventhandler_onmouseup = function (evt)
    {
        const sysevt = this.getSysEvent()
        const context = sysevt.GetEventContext(evt);
        return nexacro._syshandler_onmouseup(sysevt, evt, context);
    };

    _pModalOverlayElement._iframe_eventhandler_onmousemove = function (evt)
    {
        // "this" is document
        const sysevt = this.getSysEvent()
        const context = sysevt.GetEventContext(evt);
        return nexacro._syshandler_onmousemove(sysevt, evt, context);
    };

    _pModalOverlayElement._iframe_eventhandler_oncontextmenu = function (evt)
    {
        const sysevt = this.getSysEvent()
        return nexacro._stopSysEvent(evt);
    };

    _pModalOverlayElement.destroy = function ()
    {
        if (!this.handle)
            return;

        var _win = this.linkedcontrol._getWindow();
        var owner_elem = _win.root.getElement();
        this._destroyBackgroundElement(this.handle);
        nexacro.__removeDOMNode(owner_elem.dest_handle, this.handle);
        this.handle = null;
    };

    _pModalOverlayElement.setElementSize = function (width, height, update)
    {
        nexacro.Element.prototype.setElementSize.call(this, width, height, update);
    };

    _pModalOverlayElement._createBackgroundElement = nexacro._emptyFn;
    _pModalOverlayElement._destroyBackgroundElement = nexacro._emptyFn;

    _pModalOverlayElement._getRootWindowHandle = function ()
    {
        return this._doc;
    };

    //======================================================================
    // nexacro.OverlayElement - simple overlay
    //======================================================================
    nexacro._OverlayElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

        this.background = nexacro.BackgroundObject("grey");
        this.opacity = nexacro.OpacityObject(0.1);
    };

    var _pOverlayElement = nexacro._createPrototype(nexacro.ModalOverlayElement, nexacro._OverlayElement);
    nexacro._OverlayElement.prototype = _pOverlayElement;
    _pOverlayElement._type_name = "OverlayElement";

    _pOverlayElement.create = function (win)
    {
        if (this.parent_elem && !this.handle)
        {
            var _doc = this._doc = this.parent_elem._getRootWindowHandle();
            var handle = _doc.createElement("div");
            handle._linked_element = this;

            this.handle = this.dest_handle = handle;

            /////////////////////////////////
            var handle_style = handle.style;
            nexacro.__setDOMNode_ClassName(handle, this._getElementNexaClassName("nexamodaloverlay"));
            nexacro.__setDOMNode_Id(handle, "", this.name + ":container");
            nexacro.__setDOMStyle_Pos(handle_style, 0, 0);

            var owner_elem = this.parent.getElement();
            nexacro.__appendDOMNode(owner_elem.dest_handle, handle);

            this._refreshControl(handle, handle.style, _doc);
            this._createBackgroundElement(_doc, handle);

            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility && env._a11ytype == 5)
                nexacro.__removeHTMLAttr_Property(handle, "tabindex");
        }
    };

    _pOverlayElement = null;

    //======================================================================
    // nexacro.ContainerElement
    //======================================================================
    // this ContainerElement has No Event Handlers -- Container only
    nexacro._ContainerElement = function (parent_elem, use_translate_scroll, type, use_onscroll_inner)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        if (use_translate_scroll === false)
            this._use_translate_scroll = use_translate_scroll
        else
        {
            const env = nexacro.getEnvironment();
            this._use_translate_scroll = env ? env._use_translate_scroll : nexacro._use_translate_scroll;
        }

        this.type = (type) ? type : ""; // container가 n개 일 경우 type으로 구분
        this._use_onscroll_inner = use_onscroll_inner; // scrolltop, scrollleft 사용 시에도 inner생성 여부
    };

    var __pContainerElement = nexacro._createPrototype(nexacro.Element, nexacro._ContainerElement);
    nexacro._ContainerElement.prototype = __pContainerElement;
    __pContainerElement._type_name = "ContainerElement";

    //==== defaule values =========//
    //==== internal handles =========//
    //==== default flags =========//
    __pContainerElement._scroll_left = 0;
    __pContainerElement._scroll_top = 0;
    __pContainerElement._scroll_maxwidth = 0;
    __pContainerElement._scroll_maxheight = 0;
    __pContainerElement._cached_scrollLeft = 0;
    __pContainerElement._cached_scrollTop = 0;
    __pContainerElement._is_nc_element = true;
    __pContainerElement._use_translate_scroll = nexacro._use_translate_scroll;
    __pContainerElement._use_container_move = true;
    __pContainerElement.type = "";
    //==== Fluid Layout =========//
    __pContainerElement._layoutbasis = null;
    __pContainerElement._layouttype = "default";
    __pContainerElement._layouthorizontalgap = undefined;
    __pContainerElement._layoutverticalgap = undefined;
    __pContainerElement._flexmainaxisalign = "";
    __pContainerElement._flexcrossaxisalign = "";
    __pContainerElement._flexcrossaxiswrapalign = "";
    __pContainerElement._flexwrap = "";
    __pContainerElement._tablecellalign = "";
    __pContainerElement._tablecellhalign = "";
    __pContainerElement._tablecellvalign = "";
    __pContainerElement._tablecellincompalign = "";
    __pContainerElement._tablecellincomphalign = "";
    __pContainerElement._tablecellincompvalign = "";
    __pContainerElement._tabletemplate = "";
    __pContainerElement._tabletemplatearea = "";
    __pContainerElement._tabledirection = "";
    __pContainerElement._layoutspacing = "";

    //==== end of initial =========//
    var _bind_container_scroll_handler_after = nexacro._emptyFn;

    var _bind_container_scroll_handler = function (elem)
    {
        return function (evt)
        {
            if (!evt && window.event) evt = window.event;

            var target = evt.srcElement || evt.target;
            if (!target)
                return;

            evt._node_activate_scroll = undefined;

            if (elem._use_translate_scroll)
            {
                target.scrollLeft = 0;
                target.scrollTop = 0;
            }
            else if (elem._not_use_scrollLeft || elem._not_use_scrollTop)
            {
                if (elem._not_use_scrollLeft)
                    target.scrollLeft = 0;
                if (elem._not_use_scrollTop)
                    target.scrollTop = 0;
            }
            else
            {
                if ((elem._scroll_top != target.scrollTop || elem._scroll_left != target.scrollLeft) && elem._use_onscroll_inner != true)
                {
                    evt._node_activate_scroll = true;
                    elem._callback_func_onscroll(evt);
                }
                else
                {
                    elem._scroll_left = target.scrollLeft;
                    elem._scroll_top = target.scrollTop;
                    elem._scroll_maxwidth = target.scrollWidth;
                    elem._scroll_maxheight = target.scrollHeight;
                }

                const env = nexacro.getEnvironment();
                if (env._p_enableaccessibility)
                {
                    var owner_elem = elem.parent_elem;
                    if (owner_elem instanceof nexacro.GridRowControlElement)
                        owner_elem._setScrollableElementHScrollPos(evt, target.scrollLeft);

                    _bind_container_scroll_handler_after(elem, target.scrollLeft, target.scrollTop);
                }
            }
        };
    };

    __pContainerElement._callback_func_onscroll = function (evt)
    {
        if ((!evt || evt.type != "scroll") && window.event) evt = window.event;
        if (evt.type != "scroll")
            return;

        var target = evt.srcElement;
        if (!target)
            return;

        var container = target._linked_element;

        if (container)
        {
            if (container._no_focus_scroll)
            {
                if (container._isRtl())
                {
                    target.scrollLeft = -container._scroll_left;
                }
                else
                {
                    target.scrollLeft = container._scroll_left;
                }
            }
        }
    };

    __pContainerElement.create = function (win)
    {
        var owner_elem = this.parent_elem;
        if (owner_elem && owner_elem.handle && !this.handle)
        {
            this.owner_elem = owner_elem;
            this._p_name = nexacro._filterIDRootNodeClassName(owner_elem.name) + ":container" + this.type;
            var _doc = win ? win._doc : owner_elem._getRootWindowHandle();

            var handle = _doc.createElement("div");
            handle._linked_element = this;

            this.handle = handle;

            //if (this._use_native_scroll)
            //{
            //    nexacro.__setDOMNode_ClassName(handle, this._getElementNexaClassName("nexacontainer", "nexanativescroll"));
            //    nexacro.__setDOMNode_Id(handle, "", this.name);
            //}
            //else
            //{
            nexacro.__setDOMNode_ClassName(handle, this._getElementNexaClassName("nexacontainer"));
            nexacro.__setDOMNode_Id(handle, "", this.name);
            //}

            // dest_handle을 여기서 결정
            this.createInnerContainer(_doc);

            var handle_style = handle.style;
            var control = this.linkedcontrol;
            if (control && !control._is_form)
            {
                if (control._isFluidContainer(true))
                {
                    if (control._isFluidContainerCalculation())
                    {
                        nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                    }
                }
                else
                {
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
                }
            }
            else
            {
                nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, this._isParentRtl());
            }

            nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

            this._on_createAccessibilityHandle(handle);

            // append TO Parent Element            
            // RP 89182 수정(container가 scrollbar 앞에 오도록 하는 동작)에서 n개의 container인 경우 제외 시키도록 수정 (type이 설정되면 multi container)
            if (owner_elem.dest_handle.hasChildNodes() && (nexacro._isNull(this.type) || this.type.length < 1)) 
            {
                if (owner_elem.dest_handle.firstChild.className == "nexaedge")
                {
                    nexacro.__insertDOMNode(owner_elem.dest_handle, handle, owner_elem.dest_handle.childNodes[0].nextSibling);
                }
                else
                {
                    nexacro.__insertDOMNode(owner_elem.dest_handle, handle, owner_elem.dest_handle.childNodes[0]);
                }
            }
            else
            {
                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
            }

            // prohibit div auto reset scroll when element was click.
            this._syshandler_onscroll_forward = _bind_container_scroll_handler(this);
            nexacro._observeSysEvent(handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
        }
    };

    __pContainerElement.createCommandStart = function ()
    {
        var owner_elem = this.parent_elem;
        if (owner_elem)
        {
            this.owner_elem = owner_elem;
            this._p_name = nexacro._filterIDRootNodeClassName(owner_elem.name) + ":container" + this.type;
            var str = "<div";
            //str += this._use_native_scroll ? " class='" + this._getElementNexaClassName("nexacontainer", "nexanativescroll") + "'" : " class='" + this._getElementNexaClassName("nexacontainer") + "'";
            str += " class='" + this._getElementNexaClassName("nexacontainer") + "'";
            str += " id='" + this.name + "' ";
            var style_str = this._getCommonStyleStr();
            str += " style='" + style_str + "'";
            str = this._on_createAccessibilityCommand(str);
            str += ">";
            if (this._use_translate_scroll || this._use_onscroll_inner)
                str += "<div class='" + this._getElementNexaClassName("nexainnercontainer") + "' id='" + this.name + ":innercontainer' style='" + nexacro.__getHTMLStyleSize((this._scroll_maxwidth ? this._scroll_maxwidth : this.width), (this._scroll_maxheight ? this._scroll_maxheight : this.height)) + "'>";

            return str;
        }
        return "";
    };

    __pContainerElement.createCommandEnd = function ()
    {
        var str = "";
        if (this._use_translate_scroll || this._use_onscroll_inner)
            str += "</div>";
        str += "</div>";

        return str;
    };

    __pContainerElement.attachHandle = function (win)
    {
        if (this.name)
        {
            var handle = this.handle || win._doc.getElementById(this.name);
            if (handle)
            {
                this.handle = handle;
                handle._linked_element = this;

                if (this._use_translate_scroll || this._use_onscroll_inner)
                    this.dest_handle = handle.firstChild;
                else
                    this.dest_handle = handle;

                this._syshandler_onscroll_forward = _bind_container_scroll_handler(this);
                nexacro._observeSysEvent(handle, "scroll", "onscroll", this._syshandler_onscroll_forward);

                if (!this._use_translate_scroll)
                {
                    var tempdiv = this._tempdiv;
                    if (!tempdiv)
                    {
                        var _doc = this._getRootWindowHandle();
                        tempdiv = this._tempdiv = _doc.createElement("div");
                        nexacro.__setDOMStyle_AbsoluteTransparent(tempdiv.style);

                        nexacro.__setDOMStyle_Size(tempdiv.style, 1, 1);
                        nexacro.__setDOMStyle_Visible(tempdiv.style, false);
                        nexacro.__appendDOMNode(this.handle, tempdiv);
                    }
                    nexacro.__setDOMStyle_Pos(tempdiv.style, this._scroll_maxwidth ? this._scroll_maxwidth - 1 : 0, this._scroll_maxheight ? this._scroll_maxheight - 1 : 0);
                }
            }
        }
    };

    __pContainerElement._syshandler_inner_onscroll_forward = function (evt)
    {
        evt.target.scrollTop = 0;
        evt.target.scrollLeft = 0;
    };

    __pContainerElement.createInnerContainer = function (_doc)
    {
        var handle = this.handle;
        var dest_handle;
        var scroll_maxwidth = this._scroll_maxwidth || this.parent._scroll_maxwidth;
        var scroll_maxheight = this._scroll_maxheight || this.parent._scroll_maxheight;

        if (handle)
        {
            if (this._use_translate_scroll)
            {
                dest_handle = this.dest_handle = _doc.createElement("div");

                nexacro.__setDOMNode_ClassName(dest_handle, this._getElementNexaClassName("nexainnercontainer"));
                nexacro.__setDOMNode_Id(dest_handle, "", this.name + ":innercontainer");

                nexacro.__appendDOMNode(handle, dest_handle);

                if (scroll_maxwidth && scroll_maxheight)
                    nexacro.__setDOMStyle_Size(dest_handle.style, scroll_maxwidth, scroll_maxheight);

                // set scroll pos
                if (this._scroll_left != 0 || this._scroll_top != 0)
                {
                    var bRtl = this._isRtl();
                    nexacro.__setDOMStyle_Translate(dest_handle.style, -this._scroll_left, -this._scroll_top, bRtl);
                }

                nexacro._observeSysEvent(dest_handle, "scroll", "onscroll", this._syshandler_inner_onscroll_forward);
            }
            else
            {
                if (this._use_onscroll_inner)
                {
                    dest_handle = this.dest_handle = _doc.createElement("div");

                    nexacro.__setDOMNode_ClassName(dest_handle, "nexainnercontainer");
                    nexacro.__setDOMNode_Id(dest_handle, "", this.name + ":innercontainer");

                    nexacro.__appendDOMNode(handle, dest_handle);

                    if (scroll_maxwidth && scroll_maxheight)
                        nexacro.__setDOMStyle_Size(dest_handle.style, scroll_maxwidth, scroll_maxheight);
                }
                else
                {
                    dest_handle = this.dest_handle = handle;
                }

                var tempdiv = this._tempdiv;
                if (!tempdiv)
                {
                    tempdiv = this._tempdiv = _doc.createElement("div");
                    nexacro.__setDOMStyle_AbsoluteTransparent(tempdiv.style);

                    nexacro.__setDOMStyle_Size(tempdiv.style, 1, 1);
                    nexacro.__setDOMStyle_Visible(tempdiv.style, false);
                    nexacro.__appendDOMNode(handle, tempdiv);
                }

                if (this._scroll_left)
                    nexacro.__setDOMNode_HScrollPos(handle, this._scroll_left);
                if (this._scroll_top)
                    nexacro.__setDOMNode_VScrollPos(handle, this._scroll_top);
            }

            // Layout set
            switch (this._layouttype)
            {
                case "horizontal":
                case "vertical":
                    nexacro.__setDOMStyle_LayoutType(dest_handle.style, this._layouttype);

                    if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                        nexacro.__setDOMStyle_LayoutGap(dest_handle.style, this._layouthorizontalgap, this._layoutverticalgap);
                    if (this._layoutspacing)
                        nexacro.__setDOMStyle_LayoutSpacing(dest_handle.style, this._layoutspacing, this.rtl);

                    if (this._flexmainaxisalign)
                        nexacro.__setDOMStyle_FlexMainAxisAlign(dest_handle.style, this._flexmainaxisalign);
                    if (this._flexcrossaxisalign)
                        nexacro.__setDOMStyle_FlexCrossAxisAlign(dest_handle.style, this._flexcrossaxisalign);
                    if (this._flexcrossaxiswrapalign)
                        nexacro.__setDOMStyle_FlexCrossAxisWrapAlign(dest_handle.style, this._flexcrossaxiswrapalign);
                    if (this._flexwrap)
                        nexacro.__setDOMStyle_FlexWrap(dest_handle.style, this._flexwrap);
                    break;
                case "table":
                    nexacro.__setDOMStyle_LayoutType(dest_handle.style, this._layouttype);

                    if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                        nexacro.__setDOMStyle_LayoutGap(dest_handle.style, this._layouthorizontalgap, this._layoutverticalgap);
                    if (this._layoutspacing)
                        nexacro.__setDOMStyle_LayoutSpacing(dest_handle.style, this._layoutspacing, this.rtl);

                    if (this._tablecellhalign)
                        nexacro.__setDOMStyle_TableCellHAlign(dest_handle.style, this._tablecellhalign);
                    if (this._tablecellvalign)
                        nexacro.__setDOMStyle_TableCellVAlign(dest_handle.style, this._tablecellvalign);
                    if (this._tablecellincomphalign)
                        nexacro.__setDOMStyle_TableCellinCompHAlign(dest_handle.style, this._tablecellincomphalign);
                    if (this._tablecellincompvalign)
                        nexacro.__setDOMStyle_TableCellinCompVAlign(dest_handle.style, this._tablecellincompvalign);
                    if (this._tabletemplate)
                        nexacro.__setDOMStyle_TableTemplate(dest_handle.style, this._tabletemplate);
                    if (this._tabletemplatearea)
                        nexacro.__setDOMStyle_TableTemplateArea(dest_handle.style, this._tabletemplatearea);
                    if (this._tabledirection)
                        nexacro.__setDOMStyle_TableDirection(dest_handle.style, this._tabledirection);
                    break;
                default:
                    nexacro.__setDOMStyle_LayoutType(dest_handle.style, this._layouttype);

                    if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                        nexacro.__clearDOMStyle_LayoutGap(dest_handle.style);
                    if (this._layoutspacing)
                        nexacro.__clearDOMStyle_LayoutSpacing(dest_handle.style);
                    break;
            }
        }
    };

    __pContainerElement._removeElementHandle = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            if (this._tempdiv)
            {
                nexacro.__removeDOMNode(handle, this._tempdiv);
                this._tempdiv = null;
            }
            var dest_handle;
            handle._linked_element = null;
            dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
            nexacro.__removeDOMNode(dest_handle, handle);
        }


    };

    // scroll control methods - this simple client no scroll
    __pContainerElement._setElementTranslateStart = function ()
    {
        if (!this._do_translate_scroll)
        {
            var do_translate_scroll = !!this._use_translate_scroll;

            if (do_translate_scroll && this._do_translate_scroll != do_translate_scroll)
            {
                this._scroll_offset_left = this._scroll_left;
                this._scroll_offset_top = this._scroll_top;

                this.dest_handle.style.willChange = "transform, left";
                this._do_translate_scroll = do_translate_scroll;
            }
        }
    };

    __pContainerElement._setElementTranslateEnd = function ()
    {
        if (this._do_translate_scroll)
        {
            this._do_translate_scroll = false;
            var inner_handle = this.dest_handle;

            nexacro.__clearDOMStyle_TranslateR(inner_handle.style);
            this.dest_handle.style.willChange = "";

            if (this._scroll_offset_left != this._scroll_left || this._scroll_offset_top != this._scroll_top)
            {
                nexacro.__setDOMStyle_Pos(inner_handle.style, -this._scroll_left, -this._scroll_top);
            }
        }
    };

    __pContainerElement._setElementVScrollPos = function (vpos)
    {
        if (this._scroll_top != vpos || this.parent._reset_scrollpos || this._use_container_move)
        {
            var bRtl = this._isRtl();
            var _old_scroll_top = this._scroll_top;

            this._scroll_top = vpos;
            if (this._use_translate_scroll)
            {
                var inner_handle = this.dest_handle;
                if (inner_handle)
                {
                    if (this._do_translate_scroll)
                    {
                        vpos = this._scroll_top - this._scroll_offset_top;
                        nexacro.__setDOMStyle_TranslateR(inner_handle.style, -this._scroll_left, -vpos, bRtl);
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Translate(inner_handle.style, -this._scroll_left, -vpos, bRtl);
                    }
                }
            }
            else if (this._use_container_move)
            {
                var handle = this.handle;
                if (handle)
                {
                    //아래 api 호출후 onscroll이벤트가 발생하기 전에 이 api를 다시 호출해야 하는 상황이 있다.
                    if (this._cached_scrollTop != vpos || this._cached_scrollTop != _old_scroll_top)
                        nexacro.__setDOMNode_VScrollPos(handle, vpos);
                }
            }
        }
    };

    // Fluid Layout
    __pContainerElement._setElementLayoutType = function (layouttype)
    {
        if (this._layouttype != layouttype)
        {
            this._layouttype = layouttype;

            var handle = this.dest_handle;

            if (handle)
            {
                nexacro.__setDOMStyle_LayoutType(handle.style, layouttype);
            }
        }
    };

    __pContainerElement._setElementLayoutHorizontalGap = function (layouthorizontalgap)
    {
        if (this._layouthorizontalgap != layouthorizontalgap)
        {
            this._layouthorizontalgap = layouthorizontalgap;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutGap(handle.style, layouthorizontalgap, this._layoutverticalgap);
            }
        }
    };

    __pContainerElement._setElementLayoutVerticalGap = function (layoutverticalgap)
    {
        if (this._layoutverticalgap != layoutverticalgap)
        {
            this._layoutverticalgap = layoutverticalgap;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutGap(handle.style, this._layouthorizontalgap, layoutverticalgap);
            }
        }
    };

    __pContainerElement._setElementFlexMainAxisAlign = function (flexmainaxisalign)
    {
        if (this._flexmainaxisalign != flexmainaxisalign)
        {
            this._flexmainaxisalign = flexmainaxisalign;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexMainAxisAlign(handle.style, flexmainaxisalign);
            }
        }
    };

    __pContainerElement._setElementFlexCrossAxisAlign = function (flexcrossaxisalign)
    {
        if (this._flexcrossaxisalign != flexcrossaxisalign)
        {
            this._flexcrossaxisalign = flexcrossaxisalign;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexCrossAxisAlign(handle.style, flexcrossaxisalign);
            }
        }
    };

    __pContainerElement._setElementFlexCrossAxisWrapAlign = function (flexcrossaxiswrapalign)
    {
        if (this._flexcrossaxiswrapalign != flexcrossaxiswrapalign)
        {
            this._flexcrossaxiswrapalign = flexcrossaxiswrapalign;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexCrossAxisWrapAlign(handle.style, flexcrossaxiswrapalign);
            }
        }
    };

    __pContainerElement._setElementFlexWrap = function (flexwrap)
    {
        if (this._flexwrap != flexwrap)
        {
            this._flexwrap = flexwrap;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexWrap(handle.style, flexwrap);
            }
        }
    };

    __pContainerElement._setElementLayoutSpacing = function (layoutspacing)
    {
        if (this._layoutspacing != layoutspacing)
        {
            this._layoutspacing = layoutspacing;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutSpacing(handle.style, layoutspacing, this.rtl);
            }
        }
    };

    __pContainerElement._setElementTableCellAlign = function (tablecellalign)
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

            var handle = this.dest_handle;
            if (handle)
            {
                if (this._tablecellhalign)
                    nexacro.__setDOMStyle_TableCellHAlign(handle.style, this._tablecellhalign);
                if (this._tablecellvalign)
                    nexacro.__setDOMStyle_TableCellVAlign(handle.style, this._tablecellvalign);
            }
        }
    };

    __pContainerElement._setElementTableCellinCompAlign = function (tablecellincompalign)
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

            var handle = this.dest_handle;
            if (handle)
            {
                if (this._tablecellincomphalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincomphalign);
                if (this._tablecellincompvalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincompvalign);
            }
        }
    };

    __pContainerElement._setElementTableDirection = function (tabledirection)
    {
        if (this._tabledirection != tabledirection)
        {
            this._tabledirection = tabledirection;

            var handle = this.dest_handle;
            if (handle)
            {
                nexacro.__setDOMStyle_TableDirection(handle.style, tabledirection);
            }
        }
    };

    __pContainerElement._setElementTableTemplate = function (tabletemplate)
    {
        if (this._tabletemplate != tabletemplate)
        {
            this._tabletemplate = tabletemplate;
            // validation 필요. 정상값 외엔 "1fr / 1fr"

            var handle = this.dest_handle;
            if (handle)
            {
                if (tabletemplate)
                    nexacro.__setDOMStyle_TableTemplate(handle.style, tabletemplate);
                else
                    nexacro.__clearDOMStyle_TableTemplate(handle.style);
            }
        }
    };

    __pContainerElement._setElementTableTemplateArea = function (tabletemplatearea)
    {
        if (this._tabletemplatearea != tabletemplatearea)
        {
            this._tabletemplatearea = tabletemplatearea;

            var handle = this.dest_handle;
            if (handle)
            {
                if (tabletemplatearea)
                    nexacro.__setDOMStyle_TableTemplateArea(handle.style, tabletemplatearea);
                else
                    nexacro.__clearDOMStyle_TableTemplateArea(handle.style);
            }
        }
    };

    __pContainerElement._setElementLayoutBasis = function (layoutbasis)
    {
        if (this._layoutbasis != layoutbasis)
        {
            this._layoutbasis = layoutbasis;

            var handle = this.dest_handle;
            if (handle)
            {
                if (layoutbasis)
                    nexacro.__setDOMStyle_FluidSize(handle.style, layoutbasis);
            }
        }
    };

    __pContainerElement._setElementHScrollPos = function (hpos)
    {
        if (this._scroll_left != hpos || this.parent._reset_scrollpos || this._use_container_move)
        {
            var bRtl = this._isRtl();
            var _old_scroll_left = this._scroll_left;

            this._scroll_left = hpos;
            if (this._use_translate_scroll)
            {
                var inner_handle = this.dest_handle;
                if (inner_handle)
                {
                    if (this._do_translate_scroll)
                    {
                        hpos = this._scroll_left - this._scroll_offset_left;
                        nexacro.__setDOMStyle_TranslateR(inner_handle.style, -hpos, -this._scroll_top, bRtl);
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Translate(inner_handle.style, -hpos, -this._scroll_top, bRtl);
                    }
                }
            }
            else if (this._use_container_move)
            {
                var handle = this.handle;
                if (handle)
                {
                    //아래 api 호출후 onscroll이벤트가 발생하기 전에 이 api를 다시 호출해야 하는 상황이 있다.
                    if (this._cached_scrollLeft != hpos || this._cached_scrollLeft != _old_scroll_left)
                        nexacro.__setDOMNode_HScrollPos(handle, hpos, bRtl);
                }
            }
        }
    };

    __pContainerElement._setElementScrolltype = function (scrolltype)
    {
    };

    __pContainerElement._setElementScrollPos = function (hpos, vpos)
    {
        if (this._scroll_left != hpos || this._scroll_top != vpos || this.parent._reset_scrollpos)
        {
            this._scroll_left = hpos;
            this._scroll_top = vpos;
            if (this._use_translate_scroll)
            {
                var inner_handle = this.dest_handle;
                if (inner_handle)
                {
                    if (this._do_translate_scroll)
                    {
                        hpos = this._scroll_left - this._scroll_offset_left;
                        vpos = this._scroll_top - this._scroll_offset_top;
                        nexacro.__setDOMStyle_Translate(inner_handle.style, -hpos, -vpos);
                    }
                    else
                    {
                        nexacro.__setDOMStyle_Pos(inner_handle.style, -hpos, -vpos);
                    }
                }
            }
            else if (this._use_container_move)
            {
                var handle = this.handle;
                if (handle)
                {
                    if (this._cached_scrollTop != vpos)
                        nexacro.__setDOMNode_VScrollPos(handle, vpos);
                    if (this._cached_scrollLeft != hpos)
                        nexacro.__setDOMNode_HScrollPos(handle, hpos);
                }
            }
        }
    };

    __pContainerElement.setElementScrollMaxSize = function (width, height)
    {
        this._scroll_maxwidth = width;
        this._scroll_maxheight = height;
        if (this._use_translate_scroll)
        {
            var inner_handle = this.dest_handle;
            if (inner_handle)
            {
                nexacro.__setDOMStyle_Size(inner_handle.style, width, height);
            }
        }
        else
        {
            if (this.handle)
            {
                var tempdiv = this._tempdiv;
                if (!tempdiv)
                {
                    var _doc = this._getRootWindowHandle();
                    tempdiv = this._tempdiv = _doc.createElement("div");
                    nexacro.__setDOMStyle_AbsoluteTransparent(tempdiv.style);

                    nexacro.__setDOMStyle_Size(tempdiv.style, 1, 1);
                    nexacro.__setDOMStyle_Visible(tempdiv.style, false);
                    nexacro.__appendDOMNode(this.handle, tempdiv);
                }
                nexacro.__setDOMStyle_Pos(tempdiv.style, width - 1, height - 1);
            }
        }
    };

    __pContainerElement.getElementScrollLeft = function ()
    {
        return this._scroll_left;
    };
    __pContainerElement.getElementScrollTop = function ()
    {
        return this._scroll_top;
    };

    __pContainerElement.getElementScrollWidth = function ()
    {
        return this._scroll_maxwidth;
    };
    __pContainerElement.getElementScrollHeight = function ()
    {
        return this._scroll_maxheight;
    };

    __pContainerElement.destroy = function ()
    {
        var handle = this.handle;
        if (handle)
            nexacro._stopSysObserving(handle, "scroll", "onscroll", this._syshandler_onscroll_forward);

        if (this.dest_handle)
            nexacro._stopSysObserving(this.dest_handle, "scroll", "onscroll", this._syshandler_inner_onscroll_forward);

        this._destroyElementHandle();

        this.owner_elem = null;
        this.dest_handle = null;
        this._p_parent = null;
        this.parent_elem = null;
    };

    __pContainerElement._syshandler_onscroll_forward = function (evt)
    {
        var target = evt.target;
        var container = target._linked_element;
        if (container)
        {
            var parent_elem = container.parent;

            if (parent_elem._recover_vpos != undefined)
            {
                target.scrollTop = parent_elem._recover_vpos;
                parent_elem._recover_vpos = undefined;
                return;
            }
            if (parent_elem._recover_hpos != undefined)
            {
                target.scrollLeft = parent_elem._recover_hpos;
                parent_elem._recover_hpos = undefined;
                return;
            }

            var elem_scroll_top = container._scroll_top | 0;
            var elem_scroll_left = container._scroll_left | 0;

            container._cached_scrollLeft = target.scrollLeft;
            container._cached_scrollTop = target.scrollTop;

            // DOM이 자동으로 스크롤 한 것에 맞춰 form의 스크롤을 조절함
            var hscroll_pos = container._cached_scrollLeft;
            var vscroll_pos = container._cached_scrollTop;

            var linkedcontrol = container._findScrollbarControl(container, false);

            var bhscroll = false;
            var bvscroll = false;
            if (linkedcontrol)
            {
                if (elem_scroll_left != container._cached_scrollLeft)
                {
                    if (linkedcontrol.scrollbartype != "none" && linkedcontrol.scrollbartype != "vertical")
                        bhscroll = true;
                }

                if (elem_scroll_top != container._cached_scrollTop)
                {
                    if (linkedcontrol.scrollbartype != "none" && linkedcontrol.scrollbartype != "horizontal")
                        bvscroll = true;
                }

                if (bhscroll || bvscroll)
                    linkedcontrol._scrollTo(bhscroll ? hscroll_pos : null, bvscroll ? vscroll_pos : null);
            }
        }
    };


    __pContainerElement._findScrollbarControl = function (elem, is_vert)
    {
        while (elem)
        {
            var linkedcontrol = elem.linkedcontrol;
            if (linkedcontrol)
            {
                return linkedcontrol;
            }

            elem = elem.parent;
        }

        return null;
    };

    __pContainerElement.clearContents = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro._stopSysObserving(handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            handle._linked_element = null;

            var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);
            nexacro.__removeDOMNode(dest_handle, handle);

            this.owner_elem = null;
            this.handle = this.dest_handle = null;
        }
    };

    __pContainerElement.appendChildElement = function (child_elem)
    {
        if (this.handle)
        {
            if (child_elem.parent_elem != this.parent_elem)
            {
                if (child_elem.handle)
                {
                    var old_doc = child_elem._getRootWindowHandle();
                    var new_doc = this._getRootWindowHandle();
                    if (old_doc != new_doc)
                    {
                        child_elem.parent_elem = this.parent_elem;
                        // for recreate Child Element Handle
                        child_elem._removeFromContainer();
                    }
                    else
                    {
                        child_elem.parent_elem = this.parent_elem;
                    }
                }
                else
                {
                    child_elem.parent_elem = this.parent_elem;
                }
            }

            // if child element is not created ==> create child handle
            if (!child_elem.handle)
            {
                child_elem.create();
            }
            else
            {
                child_elem._appendToContainer(this);
            }
        }
    };
    __pContainerElement.removeChildElement = function (child_elem)
    {
        if (child_elem.owner_elem == this)
        {
            child_elem._removeFromContainer();
        }
    };

    __pContainerElement._moveToNextElement = function (elem, base_elem)
    {
        if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
        {
            nexacro.__moveDOMNodeToNext(elem.handle, base_elem.handle);
        }
    };
    __pContainerElement._moveToPrevElement = function (elem, base_elem)
    {
        if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
        {
            nexacro.__moveDOMNodeToPrev(elem.handle, base_elem.handle);
        }
    };
    __pContainerElement._sendToBackElement = function (elem)
    {
        if (elem && elem.owner_elem == this && elem.handle)
        {
            nexacro.__sendDOMNodeToBack(elem.handle);
        }
    };
    __pContainerElement._bringToFrontElement = function (elem)
    {
        if (elem && elem.owner_elem == this && elem.handle)
        {
            nexacro.__bringDOMNodeToFront(elem.handle);
        }
    };

    __pContainerElement._getElementClassName = function ()
    {
        // return this._use_native_scroll ? this._getElementNexaClassName("nexacontainer", "nexanativescroll") : this._getElementNexaClassName("nexacontainer");
        return this._getElementNativeClassName() + this._getElementNexaClassName("nexacontainer");
    };

    //__pContainerElement.getZoom = function ()
    //{
    //    if (this.handle)
    //    {
    //        // CSS Zoom을 Transform Scale로 변경함. (성능문제, API버그문제 등)
    //        var scalevalue = nexacro.__getDOMNodeStyle_TransformScale(this.handle.style);
    //        if (scalevalue)
    //            return parseInt(scalevalue * 100.0);

    //        return 100;
    //    }
    //    return 100;
    //};

    __pContainerElement.setElementZoom = function (zoomfactor)
    {
        this.zoom = zoomfactor;
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMStyle_TransformScale(handle.style, zoomfactor / 100);
        }
    };

    //======================================================================
    // nexacro._MultiInnerContainerElement
    //======================================================================
    nexacro._MultiInnerContainerElement = function (parent_elem, use_translate_scroll, type)
    {
        nexacro._ContainerElement.call(this, parent_elem, use_translate_scroll, type);

        this._scroll_max_arr = [];
        this._ext_inners = [];
    };

    var __pMultiInnerContainerElement = nexacro._createPrototype(nexacro._ContainerElement, nexacro._MultiInnerContainerElement);
    nexacro._MultiInnerContainerElement.prototype = __pMultiInnerContainerElement;
    __pMultiInnerContainerElement._type_name = "MultiInnerContainerElement";

    __pMultiInnerContainerElement.attachHandle = function (win)
    {
        nexacro._ContainerElement.prototype.attachHandle.call(this, win);

        this.recalcInnerContainer();
    };

    __pMultiInnerContainerElement.destroy = function ()
    {
        nexacro._ContainerElement.prototype.destroy.call(this);

        this._destroyInnerContainerPages();
        this._scroll_max_arr = null;
    };

    __pMultiInnerContainerElement.createInnerContainer = function ()
    {
        // dest_handle을 array로 할지는 좀더 고민.
        // 현재 multiinner는 translate_scroll 전용.
        var handle = this.handle;
        if (handle)
        {
            if (this._use_translate_scroll)
            {
                var _doc = this.owner_elem._getRootWindowHandle();

                // create dest_handle
                var dest_handle = this.dest_handle = _doc.createElement("div");

                nexacro.__setDOMNode_ClassName(dest_handle, this._getElementNexaClassName("nexainnercontainer"));
                nexacro.__setDOMNode_Id(dest_handle, "", this.name + ":innercontainer");

                nexacro.__appendDOMNode(handle, dest_handle);

                // create extend inner
                var len = this._calcInnerContainerPages();
                if (len > 0)
                {
                    for (var i = 0; i < len; i++)
                    {
                        this.appendInnerContainer(i, _doc);
                    }
                }

                // update dest_handle + extend inner
                this.updateInnerContainerSize();
                this.updateInnerContainerPos();

                // set scroll pos
                if (this._scroll_left != 0 || this._scroll_top != 0)
                {
                    nexacro.__setDOMStyle_Translate(dest_handle.style, -this._scroll_left, -this._scroll_top);
                }
            }
            else
            {
                this.dest_handle = handle;

                if (this._scroll_left)
                    nexacro.__setDOMNode_HScrollPos(handle, this._scroll_left);
                if (this._scroll_top)
                    nexacro.__setDOMNode_VScrollPos(handle, this._scroll_top);
            }
        }
    };
    __pMultiInnerContainerElement.recalcInnerContainer = function ()
    {
        var owner_elem = this.owner_elem;
        if (owner_elem)
        {
            var i;
            var _doc = this.owner_elem._getRootWindowHandle();
            var len = this._calcInnerContainerPages();
            if (len > 0)
            {
                for (i = 0; i < len; i++)
                {
                    // 반복되면 innercontainer id 가 중복됨. 수정요소.
                    this.appendInnerContainer(i, _doc);
                }
            }

            if (len < 0)
            {
                for (i = len * -1; i > 0; i--)
                {
                    this.removeInnerContainer();
                }
            }

            this.updateInnerContainerSize();
            this.updateInnerContainerPos();
        }
    };

    __pMultiInnerContainerElement.appendInnerContainer = function (index, _doc)
    {
        var handle = this.handle;
        var dest_handle = this.dest_handle;

        var inner = _doc.createElement("div");
        nexacro.__setDOMNode_ClassName(inner, this._getElementNexaClassName("nexainnercontainer"));
        nexacro.__setDOMNode_Id(inner, "", dest_handle.id + "_ext_" + index);
        nexacro.__setDOMNode_Selectable(inner, false);

        var inner_style = inner.style;
        nexacro.__setDOMStyle_Absolute(inner_style);

        nexacro.__appendDOMNode(handle, inner);

        this._ext_inners.push(inner);
    };
    __pMultiInnerContainerElement.removeInnerContainer = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            var idx = this._ext_inners.length - 1;
            nexacro.__removeDOMNode(handle, this._ext_inners[idx]);

            this._ext_inners.splice(idx, 1);
        }
    };

    __pMultiInnerContainerElement.updateInnerContainerSize = function ()
    {
        // 반드시 _scroll_max_arr 계산된 만큼 ext_inners가 만들어 지고 수행되야함.

        var dest_handle = this.dest_handle;
        if (dest_handle)
        {
            var scroll_maxheight = this._scroll_maxheight;
            var scroll_page_tops = this._scroll_max_arr;

            var width = this._scroll_maxwidth;
            var height = 0;

            {
                if (scroll_maxheight > scroll_page_tops[0])
                {
                    height = scroll_page_tops[0];
                }
                else
                {
                    height = scroll_maxheight;
                }

                nexacro.__setDOMStyle_Size(dest_handle.style, width, height);
            }

            for (var i = 1, n = scroll_page_tops.length; i < n; i++)
            {
                dest_handle = this._ext_inners[i - 1];
                if (dest_handle)
                {
                    if (scroll_maxheight > scroll_page_tops[i])
                    {
                        height = scroll_page_tops[i] - scroll_page_tops[i - 1];
                    }
                    else
                    {
                        height = scroll_maxheight - scroll_page_tops[i - 1];
                    }

                    nexacro.__setDOMStyle_Size(dest_handle.style, width, height);

                }
            }
        }
    };
    __pMultiInnerContainerElement.updateInnerContainerPos = function ()
    {
        var dest_handle = this.dest_handle;
        if (dest_handle)
        {
            var ext_vpos;

            var hpos = this._scroll_left;
            var vpos = this._scroll_top;

            var scroll_max_arr = this._scroll_max_arr;
            var bRtl = this._isRtl();
            nexacro.__setDOMStyle_Translate(dest_handle.style, -hpos, -vpos, bRtl);

            for (var i = 0, n = this._ext_inners.length; i < n; i++)
            {
                if (vpos + this.height > scroll_max_arr[i] && vpos < scroll_max_arr[i + 1])
                {
                    if (nexacro._Browser_Transform3d > 0)
                        ext_vpos = vpos - (scroll_max_arr[i] - this.height);
                    else
                        ext_vpos = vpos - scroll_max_arr[i];
                }
                else
                {
                    ext_vpos = -this.height;
                }
                nexacro.__setDOMStyle_Translate(this._ext_inners[i].style, -hpos, -ext_vpos, bRtl);
            }
        }
    };

    __pMultiInnerContainerElement._calcInnerContainerPages = function ()
    {
        // InnerContainer를 얼마나 만들어야 하는지 계산.
        // + : inner 추가생성
        // - : inner 제거
        // 0 : 유지

        var curr_inner = this._ext_inners.length;
        var post_inner = this._scroll_max_arr.length - 1;

        return post_inner - curr_inner;
    };
    __pMultiInnerContainerElement._destroyInnerContainerPages = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            for (var i = 0, len = this._ext_inners.length; i < len; i++)
            {
                nexacro.__removeDOMNode(handle, this._ext_inners[i]);
            }
            this._ext_inners = null;
        }
    };

    __pMultiInnerContainerElement.setElementScrollMaxSize = function (width, height)
    {
        this._scroll_maxwidth = width;
        this._scroll_maxheight = height;

        if (this._use_translate_scroll)
        {
            this.recalcInnerContainer();
        }
    };

    __pMultiInnerContainerElement._setElementVScrollPos = function (vpos)
    {
        if (this._scroll_top != vpos || this.parent._reset_scrollpos)
        {
            this._scroll_top = vpos;

            this.updateInnerContainerPos();
        }
    };

    __pMultiInnerContainerElement._setScrollMaxTops = function (tops)
    {
        this._scroll_max_arr = tops;
    };

    __pMultiInnerContainerElement._getDestHandle = function (top, idx)
    {
        if (idx == undefined)
            idx = this._getExtInnerIdx(top);

        return (idx < 0) ? this.dest_handle : this._ext_inners[idx];
    };

    __pMultiInnerContainerElement._getExtInnerIdx = function (top)
    {
        var _scroll_max = this._scroll_max_arr;
        var idx = -1;

        if (_scroll_max)
        {
            for (var i = 0, n = _scroll_max.length; i < n; i++)
            {
                if (top < _scroll_max[i])
                {
                    idx = i - 1;
                    break;
                }
            }
        }
        return idx;
    };

    __pMultiInnerContainerElement._changeInnerElement = function (top, target_handle)
    {
        var idx = this._getExtInnerIdx(top);
        var next_handle = this._getDestHandle(top, idx);
        var prev_handle = target_handle.parentElement;

        if (idx != null && idx > -1)
        {
            top = top - this._scroll_max_arr[idx];
        }

        if (prev_handle && (prev_handle != next_handle))
        {
            nexacro.__removeDOMNode(prev_handle, target_handle);
            nexacro.__appendDOMNode(next_handle, target_handle);
        }
        return top;
    };

    //==============================================================================
    // nexacro.PluginElement : <DIV><Object>...</Object></DIV>
    // Object tag Plugin Element for ActiveX/Plugin
    //==============================================================================
    nexacro.PluginElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

        this._params = new nexacro.Collection();
        this._events = new nexacro.Collection();
    };

    var _pPluginElement = nexacro._createPrototype(nexacro.Element, nexacro.PluginElement);
    nexacro.PluginElement.prototype = _pPluginElement;
    _pPluginElement._type_name = "PluginElement";

    //==== defaule values =========//
    _pPluginElement.license = "";
    _pPluginElement.lpkpath = "";
    _pPluginElement.classid = "";
    //_pPluginElement.codetype = "";
    _pPluginElement.codebase = "";
    _pPluginElement.code = "";
    _pPluginElement.archive = "";
    _pPluginElement.mimetype = "";
    //_pPluginElement.data = "";

    _pPluginElement.pluginsrc = "";
    _pPluginElement.plugintype = "";
    _pPluginElement.pluginpage = "";

    _pPluginElement.windowed = false;
    _pPluginElement.popupstyle = false;

    _pPluginElement.enable = true;
    _pPluginElement.font = null;
    _pPluginElement.color = null;
    _pPluginElement.cursor = null;
    _pPluginElement.align = null;
    _pPluginElement.padding = null;
    _pPluginElement.color = null;

    //==== internal handles =========//
    _pPluginElement._object_node = null;
    _pPluginElement._embed_node = null; // for embed tag
    _pPluginElement._params = null;  // for Param tag
    _pPluginElement._events = null;
    _pPluginElement._object_id = null;
    //==== default flags =========//
    //==== end of initial =========//

    _pPluginElement.create = function ()
    {
        // parent is always control element
        // this is always NO nc_element
        var owner_elem;
        var _doc;
        if (!this.parent_elem)
        {
            _doc = nexacro._managerFrameDoc;
            owner_elem = _doc.body;
            this.owner_elem = _doc.body;
            this.owner_elem.dest_handle = _doc.body;
        }
        else
        {
            owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                _doc = owner_elem._getRootWindowHandle();
            }
        }

        if (owner_elem && !this.handle)
        {
            var handle = this._createObjectElementHandle(_doc, this.left, this.top, this.width, this.height, this._params);
            nexacro.__setDOMNode_Selectable(handle, false);
            var handle_style = handle.style;
            if (!this.visible)
            {
                nexacro.__setDOMStyle_Visible(handle_style, false);
            }

            this.handle = this.dest_handle = handle;

            var events = this._events;
            var event_cnt = events.length;
            for (var i = 0; i < event_cnt; i++)
            {
                this.addEventHandler(events.get_id(i), events.get_item(i), null);
            }

            nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
        }
    };

    _pPluginElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this._p_name = owner_elem.name + ":" + this._type_name;
            this._object_id = this.name;
            var handle_style = this._getCommonStyleStr();
            var str = "<object id = '" + this.name + "'";
            //codebase
            str += this.codebase ? "codebase = '" + this.codebase + "'" : "";
            //code
            str += this.code ? "code = '" + this.code + "'" : "";
            //archive
            str += this.archive ? "archive = '" + this.archive + "'" : "";
            //mimetype
            str += this.mimetype ? "mimetype = '" + this.mimetype + "'" : "";
            str += this.movie ? "data = '" + this.movie + "'" : "";
            //str += "/>";
            //style
            str += (handle_style) ? (" style='" + handle_style + "'/>") : "/>";
            //param
            var params = this._params;
            var param_cnt = (params ? params.length : 0);

            for (var i = 0; i < param_cnt; i++)
            {
                str += "<param name ='" + params.get_id(i) + "' value ='" + params.get_item(i) + "'/>";
            }
            //embed
            if (this.pluginsrc || this.pluginpage)
            {
                str += "<embed ";
                //pluginsrc
                str += this.pluginsrc ? "src = '" + this.pluginsrc + "'" : "";
                //pluginpage
                str += this.pluginpage ? "pluginpage = '" + this.pluginpage + "'" : "";
                //plugintype
                str += this.plugintype ? "type = '" + this.plugintype + "'" : "";
                //param
                for (i = 0; i < param_cnt; i++)
                {
                    str += " " + params.get_id(i) + " = '" + params.get_item(i) + "' ";
                }
                str += "/></embed>";
            }
            str += "</object>";
            return str;
        }
        return "";
    };

    _pPluginElement._createObjectElementHandle = function (_doc, left, top, width, height, params)
    {
        var handle = _doc.createElement("object");

        handle._linked_element = this;

        var handle_style = handle.style;
        nexacro.__setDOMStyle_Pos(handle_style, left, top);
        nexacro.__setDOMStyle_Size(handle_style, width, height);

        var codebase = this.codebase;
        if (codebase)
        {
            nexacro.__setHTMLAttr_Property(handle, 'codebase', codebase);
        }

        var code = this.code;
        if (code)
        {
            nexacro.__setHTMLAttr_Property(handle, 'code', code);
        }

        var movie = this.movie;
        if (movie)
        {
            nexacro.__setHTMLAttr_Property(handle, 'data', movie);
        }

        var archive = this.archive;
        if (archive)
        {
            nexacro.__setHTMLAttr_Property(handle, 'archive', archive);
        }

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            var mimetype = this.mimetype;
            if (mimetype)
            {
                nexacro.__setHTMLAttr_Property(handle, 'mimetype', mimetype);
            }
        }

        var param_cnt = (params ? params.length : 0);
        for (var i = 0; i < param_cnt; i++)
        {
            this._setObjectDOMParam(_doc, handle, params.get_id(i), params.get_item(i));
        }

        // embed tag
        if (this.pluginsrc || this.pluginpage)
        {
            var _embed_node = _doc.createElement("embed");

            var node_style = _embed_node.style;
            nexacro.__setDOMStyle_Absolute(node_style);
            nexacro.__setDOMStyle_Size(node_style, width, height);

            var pluginsrc = this.pluginsrc;
            if (pluginsrc)
            {
                nexacro.__setHTMLAttr_Property(_embed_node, 'src', pluginsrc);
            }

            var pluginpage = this.pluginpage;
            if (pluginpage)
            {
                nexacro.__setHTMLAttr_Property(_embed_node, 'pluginspage', pluginpage);
            }

            var plugintype = this.plugintype;
            if (plugintype)
            {
                nexacro.__setHTMLAttr_Property(_embed_node, 'type', plugintype);
            }

            for (i = 0; i < param_cnt; i++)
            {
                nexacro.__setHTMLAttr_Property(_embed_node, params.get_id(i), params.get_item(i));
            }

            this._embed_node = _embed_node;
            nexacro.__appendDOMNode(handle, _embed_node);
        }

        this._object_node = handle;
        return handle;
    };

    _pPluginElement.setElementClassId = nexacro._emptyFn;

    _pPluginElement.addEventHandler = function (name, callback)
    {
        if (this.handle && this._object_node)
        {
            var object_node = this._object_node;
            nexacro.__setHTMLAttr_Property(object_node, name, name);

            var doc = this._getRootWindowHandle();
            var script_node = doc.createElement("script");

            //var nameFromToStringRegex = /^function\s?([^\s(]*)/;
            var paramsFromToStringRegex = /\(.*?\)/;
            var params = callback.toString().match(paramsFromToStringRegex)[0];
            var eventValue = name + params;

            nexacro.__setHTMLAttr_Property(script_node, 'event', eventValue);

            var parentFrame, parentFrame2;
            var callfunc = "";
            var frmidx, frmlen;
            parentFrame = this.component ? this.component.parent : null;
            if (parentFrame)
            {
                callfunc = "." + this.component.id + '["' + name + '"]; \n';
                callfunc += '\tif (eventFn) eventFn._firePluginEvent' + params + ';' + "\n};";
                do
                {
                    if (parentFrame instanceof nexacro.MainFrame)
                    {
                        callfunc = '\tvar eventFn = nexacro.getApplication().mainframe' + callfunc;
                        break;
                    }
                    if (parentFrame instanceof nexacro.ChildFrame)
                    {
                        parentFrame2 = parentFrame.parent;
                        if (parentFrame2)
                        {
                            if (parentFrame2 instanceof nexacro.FrameSet ||
                                parentFrame2 instanceof nexacro.VFrameSet ||
                                parentFrame2 instanceof nexacro.HFrameSet ||
                                parentFrame2 instanceof nexacro.ChildFrame)
                            {
                                if (parentFrame2._frames && parentFrame2._frames.length)
                                {
                                    frmlen = parentFrame2._frames.length;
                                    for (frmidx = 0; frmidx < frmlen; frmidx++)
                                    {
                                        if (parentFrame2._frames[frmidx] == parentFrame)
                                        {
                                            callfunc = '._frames[' + frmidx + ']' + callfunc;
                                            break;
                                        }
                                    }
                                }
                            }
                            else if (parentFrame2 instanceof nexacro.MainFrame)
                            {
                                callfunc = '.frame' + callfunc;
                            }
                            else if (parentFrame2 instanceof nexacro.Form)
                            {
                                callfunc = '.' + parentFrame.id + callfunc;
                            }
                        }
                    }
                    else if (parentFrame instanceof nexacro.FrameSet ||
                        parentFrame instanceof nexacro.VFrameSet ||
                        parentFrame instanceof nexacro.HFrameSet)
                    {
                        parentFrame2 = parentFrame.parent;
                        if (parentFrame2)
                        {
                            if (parentFrame2._frames && parentFrame2._frames.length)
                            {
                                frmlen = parentFrame2._frames.length;
                                for (frmidx = 0; frmidx < frmlen; frmidx++)
                                {
                                    if (parentFrame2._frames[frmidx] == parentFrame)
                                    {
                                        callfunc = '._frames[' + frmidx + ']' + callfunc;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else if (parentFrame instanceof nexacro.Div)
                    {
                        callfunc = '.' + parentFrame.id + callfunc;
                    }
                    else if (parentFrame instanceof nexacro.Form)
                    {
                        callfunc = '.form' + callfunc;
                    }
                    parentFrame = parentFrame.parent;
                } while (parentFrame);
            }
            if (callfunc)
                callfunc = 'function ' + eventValue + '\n{\n' + callfunc;

            script_node.text = callfunc;
            this.handle.appendChild(script_node);
            return true;
        }
        else
        {
            this._events.add_item(name, callback);
        }
        return false;
    };

    _pPluginElement.removeEventHandler = function (name, callback)
    {
        if (this.handle && this._object_node)
        {
            var object_node = this._object_node;
            nexacro.__removeHTMLAttr_Property(object_node, name);
            object_node.removeAttribute(name);

            var paramsFromToStringRegex = /\(.*?\)/;
            var params = callback.toString().match(paramsFromToStringRegex)[0];
            var eventValue = name + params;

            var i;
            var scripts = this.handle.getElementsByTagName("script");
            var length = scripts.length;
            for (i = 0; i < length; i++)
            {
                var script = scripts[i];
                if (script)
                {
                    var eventAttribute = nexacro.__getHTMLAttr_Property(script, 'event');
                    if (eventAttribute === eventValue)
                    {
                        var parentNode = script.parentNode;
                        nexacro.__unlinkDOMNode(parentNode, script);
                        break;
                    }
                }
            }
        }
    };

    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
    {
        _pPluginElement.setElementMovie = function (movie)
        {
            if (this.movie) //when objectnode's data is changed, it wouldn't refresh.
            {
                nexacro.__removeDOMNode(this.owner_elem.handle, this._object_node);
                var handle = this._createObjectElementHandle(document, this.left, this.top, this.width, this.height, this._params);
                nexacro.__appendDOMNode(this.owner_elem.dest_handle, handle);
            }
            this.movie = movie;
            var obj_node = this._object_node;
            if (obj_node)
                nexacro.__setHTMLAttr_Property(obj_node, "data", movie);
        };
    }
    else
    {
        _pPluginElement.setElementMovie = function (movie)
        {
            this.movie = movie;
            var obj_node = this._object_node;
            if (obj_node)
                nexacro.__setHTMLAttr_Property(obj_node, "data", movie);
        };
    }

    _pPluginElement.setElementPluginPage = nexacro._emptyFn;

    _pPluginElement._play = function ()
    {
        var obj_node = this._object_node;
        if (obj_node)
            obj_node.Play();
    };

    _pPluginElement._stopPlay = function ()
    {
        var obj_node = this._object_node;
        if (obj_node)
            obj_node.StopPlay();
    };

    _pPluginElement.attachHandle = function (win)
    {
        var handle = this.handle = win._doc.getElementById(this.name);
        if (handle)
        {
            this._object_node = handle;
            var embed_node = null;
            var nodes = handle.getElementsByTagName("embed");
            if (nodes && nodes.length > 0)
            {
                embed_node = nodes[0];
            }
            this._embed_node = embed_node;

            var events = this._events;
            var event_cnt = events.length;
            for (var i = 0; i < event_cnt; i++)
            {
                this.addEventHandler(events.get_id(i), events.get_item(i), null);
            }
        }
    };

    _pPluginElement.destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            handle._linked_element = null;

            var _owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
            if (this.owner_elem && this.owner_elem.dest_handle)
                _owner_handle = this.owner_elem.dest_handle;

            if (!this.owner_elem || _owner_handle)
                nexacro.__removeDOMNode(_owner_handle, handle);

            this.owner_elem = null;
            this.handle = this.dest_handle = null;
            this._object_node = null;
            this._embed_node = null;
        }
        this._p_parent = null;
        this.parent_elem = null;

        var params = this._params;
        if (params)
        {
            params.destroy();
            this._params = null;
        }

        var events = this._events;
        if (events)
        {
            events.destroy();
            this._events = null;
        }
    };

    _pPluginElement._setObjectDOMParam = function (_doc, target_handle, name, value)
    {
        var param_node = _doc.createElement("param");
        nexacro.__setHTMLAttr_Property(param_node, "name", name);
        nexacro.__setHTMLAttr_Property(param_node, "value", value);
        nexacro.__appendDOMNode(target_handle, param_node);
    };

    _pPluginElement.on_update_position = function (resize_flag, move_flag, newleft, newtop)
    {
        var handle = this._object_node;
        if (handle)
        {
            var handle_style = handle.style;

            nexacro.__setDOMStyle_Absolute(handle_style);
            if (move_flag)
                nexacro.__setDOMStyle_Pos(handle_style, newleft, newtop);
            if (resize_flag)
                nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);
        }
    };

    _pPluginElement.setElementFocus = function (selffocus)
    {
        var handle = this._object_node;
        if (handle)
        {
            nexacro.__setDOMNode_Focus(handle, true);
            nexacro.__setLastFocusedElement(this);
        }
    };

    _pPluginElement.setElementLicense = function (license)
    {
        if (this.license != license)
        {
            this.license = license;
        }
    };

    _pPluginElement.setElementLicenseFile = function (lpkpath)
    {
        if (!this.handle && this.lpkpath != lpkpath)
        {
            this.lpkpath = lpkpath;
        }
    };

    _pPluginElement.setElementMIMEType = function (mimetype)
    {
        var object_node;
        if (this.mimetype != mimetype)
        {
            this.mimetype = mimetype;
            object_node = this._object_node;
            if (object_node)
            {
                nexacro.__setHTMLAttr_Property(object_node, 'mimetype', mimetype);
            }
        }
        if (this.plugintype != mimetype)
        {
            this.plugintype = mimetype;

            object_node = this._object_node;
            if (object_node)
            {
                var _embed_node = this._embed_node;
                if (_embed_node == null)
                {
                    var _doc = this._getRootWindowHandle();
                    this._embed_node = _embed_node = _doc.createElement("embed");
                    nexacro.__appendDOMNode(object_node, _embed_node);
                }
                nexacro.__setHTMLAttr_Property(_embed_node, 'type', mimetype);
            }
        }
    };

    _pPluginElement.setElementCodebase = function (codebase)
    {
        if (this.codebase != codebase)
        {
            this.codebase = codebase;
            var object_node = this._object_node;
            if (object_node)
            {
                nexacro.__setHTMLAttr_Property(object_node, 'codebase', codebase);
            }
        }
    };

    _pPluginElement.setElementCode = function (code)
    {
        if (this.code != code)
        {
            this.code = code;
            var object_node = this._object_node;
            if (object_node)
            {
                nexacro.__setHTMLAttr_Property(object_node, 'code', code);
            }
        }
    };

    _pPluginElement.setElementArchive = function (archive)
    {
        if (this.archive != archive)
        {
            this.archive = archive;
            var object_node = this._object_node;
            if (object_node)
            {
                nexacro.__setHTMLAttr_Property(object_node, 'archive', archive);
            }
        }
    };

    _pPluginElement.getElementParam = function (name)
    {
        var handle = this.handle;
        var object_node = this._object_node;
        if (handle && object_node)
        {
            var param = object_node.getElementsByTagName("param");
            for (var i in param)
            {
                if (param[i].name == name)
                {
                    return param[i].value;
                }
            }
            if (object_node[name])
            {
                return this._object_node[name];
            }
        }
        else
        {
            var params = this._params;
            return params.get_item(name);
        }
    };

    _pPluginElement.setElementParam = function (name, value)
    {
        var obj_node = this._object_node;
        if (this.handle && obj_node)
        {
            var _doc = this._getRootWindowHandle();
            var param = obj_node.getElementsByTagName("param");
            for (var i in param)
            {
                if (param[i].name == name)
                {
                    param[i].value = value;
                    this._object_node[name] = value;
                    return;
                }
            }
            this._setObjectDOMParam(_doc, obj_node, name, value);
            this._object_node[name] = value;
        }
        else
        {
            var params = this._params;
            if (params.get_item(name))
                params.set_item(name, value);
            else
                params.add_item(name, value);
        }
    };

    _pPluginElement.setElementPluginSrc = function (src)
    {
        if (this.pluginsrc != src)
        {
            this.pluginsrc = src;
            var object_node = this._object_node;
            if (object_node)
            {
                var embed_node = this._embed_node;
                if (embed_node == null)
                {
                    var _doc = this._getRootWindowHandle();
                    this._embed_node = embed_node = _doc.createElement("embed");
                    var embed_node_style = embed_node.style;
                    nexacro.__setDOMStyle_Absolute(embed_node_style);
                    nexacro.__setDOMStyle_Pos(embed_node_style, this.left, this.top);
                    nexacro.__setDOMStyle_Size(embed_node_style, this.width, this.height);
                    nexacro.__setHTMLAttr_Property(embed_node, 'src', src);
                    nexacro.__appendDOMNode(object_node, embed_node);
                }
                else
                {
                    //When only embed src was changed, embed node's contents wouldn't changed.
                    //So, if we only change the src of embed node, don't need to make a embed node because it's already exist, we are going to detach the embed node from object node,
                    //and then attach the embed node to object node, again.
                    nexacro.__setHTMLAttr_Property(embed_node, 'src', src);
                    nexacro.__removeDOMNode(object_node, embed_node);
                    nexacro.__appendDOMNode(object_node, embed_node);
                }
            }
        }
    };

    //for only android mobile.
    _pPluginElement._setElementPluginName = nexacro._emptyFn;

    _pPluginElement.setElementPluginMIMEType = function (type)
    {
        if (this.plugintype != type)
        {
            this.plugintype = type;
            var object_node = this._object_node;
            if (object_node)
            {
                var embed_node = this._embed_node;
                if (embed_node == null)
                {
                    var _doc = this._getRootWindowHandle();
                    this._embed_node = embed_node = _doc.createElement("embed");
                    nexacro.__appendDOMNode(object_node, embed_node);
                }
                nexacro.__setHTMLAttr_Property(embed_node, 'type', type);
            }
        }
    };

    _pPluginElement.callMethod = function ()
    {
        if (arguments.length < 1)
            return;

        if (this.handle && this._object_node)
        {
            var obj_idx = 0;
            var obj_arr = [];
            var target = this._embed_node ? this._embed_node : this._object_node;
            var fn_name = Array.prototype.shift.call(arguments);
            var script_str = "var ret = this." + fn_name + "(";

            for (var i = 0; i < arguments.length; i++)
            {
                if (arguments[i] === undefined)
                {
                    script_str = "var arg" + i + " = undefined" + ";\n" + script_str;
                }
                else if (arguments[i] === null)
                {
                    script_str = "var arg" + i + " = null" + ";\n" + script_str;
                }
                else if (arguments[i] === "")
                {
                    script_str = "var arg" + i + " = \"\"" + ";\n" + script_str;
                }
                else
                {
                    if (typeof arguments[i] == "string")
                    {
                        var replace_str = arguments[i].replace(/"/g, "\\\"").replace(/\n/g, "\\n");
                        script_str = "var arg" + i + " = \"" + replace_str + "\";\n" + script_str;
                    }
                    else if (typeof arguments[i] == "object")
                    {
                        script_str = "var arg" + i + " = arguments[" + obj_idx + "];\n" + script_str;
                        obj_arr.push(arguments[i]);
                        obj_idx++;
                    }
                    else
                    {
                        script_str = "var arg" + i + " = " + arguments[i] + ";\n" + script_str;
                    }
                }

                if (i < arguments.length - 1)
                    script_str += "arg" + i + ", ";
                else
                    script_str += "arg" + i;
            }
            script_str += ");\n";
            script_str += "return ret;";

            var callScript = function ()
            {
                var fn = new Function(arguments[0]);
                return fn.apply(this, obj_arr);
            };

            return callScript.call(target, script_str);
        }
    };

    _pPluginElement._getPluginObject = function ()
    {
        if (this.handle && this._object_node)
        {
            var obj = new nexacro.PluginObject();
            obj.handle = this._object_node;
            obj._doc = this._getRootWindowHandle();
            return obj;
        }
    };

    _pPluginElement.getProperty = _pPluginElement.getElementParam;
    _pPluginElement.setProperty = _pPluginElement.setElementParam;

    _pPluginElement.install = nexacro._emptyFn;
    _pPluginElement.isInstalled = nexacro._emptyFn;
    _pPluginElement.isLoaded = nexacro._emptyFn;
    _pPluginElement.setElementVisible = nexacro._emptyFn;
    _pPluginElement.setElementAdjustAlpha = nexacro._emptyFn;
    _pPluginElement.setElementWindowed = nexacro._emptyFn;
    _pPluginElement.setElementEnable = nexacro._emptyFn;
    _pPluginElement.setElementPopupStyle = nexacro._emptyFn;
    _pPluginElement.initEvent = nexacro._emptyFn;
    _pPluginElement.updateWindow = nexacro._emptyFn;
    _pPluginElement.setElementAdjustAlpha = nexacro._emptyFn;
    _pPluginElement.setElementUsePersistData = nexacro._emptyFn;
    _pPluginElement.getElementUsePersistData = nexacro._emptyFn;
    _pPluginElement.setElementClassId64 = nexacro._emptyFn;

    //==============================================================================
    // nexacro.PluginObject :
    //==============================================================================
    nexacro.PluginObject = function ()
    {
    };

    var __pPluginObject = nexacro._createPrototype(nexacro.Object, nexacro.PluginObject);
    nexacro.PluginObject.prototype = __pPluginObject;
    __pPluginObject._type_name = "PluginObject";
    __pPluginObject.handle = null;
    __pPluginObject._doc = null;
    __pPluginObject._window = null;

    __pPluginObject.getProperty = function (name)
    {
        var handle = this.handle;
        if (handle !== undefined) // [RP_36621] 2014-07-30 pss : because HTMLAllCollection casting boolean type is false
        {
            if (name)
            {
                //The typeof operator in JavaScript returns the string "undefined" when applied to objects implementing the HTMLAllCollection interface.
                var property = handle[name];
                if (property === null || (typeof property !== "undefined" && typeof property != "object" && typeof property != "function"))
                {
                    return property;
                }
                else
                {
                    if (property !== undefined)
                    {
                        var pobject = new nexacro.PluginObject();
                        pobject.handle = property;
                        pobject._window = this._window;
                        return pobject;
                    }
                }

                var param = this.handle.getElementsByTagName("param");
                for (var i in param)
                {
                    if (param[i].name == name)
                    {
                        return param[i].value;
                    }
                }
            }
        }
    };

    __pPluginObject.setProperty = function (name, value)
    {
        if (this.handle && name)
        {
            //var old_name = name;
            //if (name === "script")
            //{
            //    name = "scripts";
            //}

            if (this.handle[name] !== undefined)
            {
                this.handle[name] = value;
                return;
            }
            //this.handle[name] = value;

            //name = old_name;
            var param = this.handle.getElementsByTagName("param");
            for (var i in param)
            {
                if (param[i].name == name)
                {
                    param[i].value = value;
                    return;
                }
            }

            if (this._doc)
            {
                var param_node = this._doc.createElement("param");
                nexacro.__setHTMLAttr_Property(param_node, "name", name);
                nexacro.__setHTMLAttr_Property(param_node, "value", value);
                nexacro.__appendDOMNode(this.handle, param_node);
            }
        }
    };

    __pPluginObject._delete_property = function (name)
    {
        if (this.handle && name)
        {
            if (this.handle[name])
            {
                this.handle[name] = "";
                return;
            }
            //name = old_name;
            var param = this.handle.getElementsByTagName("param");
            for (var i in param)
            {
                if (param[i].name == name)
                {
                    nexacro.__unlinkDOMNode(this.handle, param[i]);
                    return;
                }
            }
        }
    };

    __pPluginObject.callMethod = function ()
    {
        if (arguments.length < 1)
            return;

        if (this.handle || this.handle !== undefined)  //HTMLAllCollection 은 The ToBoolean abstract operation in JavaScript returns false  
        {
            var obj_idx = 0;
            var obj_arr = [];
            var fn_name = Array.prototype.shift.call(arguments);
            var script_str = "var ret = this." + fn_name + "(";

            for (var i = 0; i < arguments.length; i++)
            {
                if (arguments[i] === undefined)
                {
                    script_str = "var arg" + i + " = undefined" + ";\n" + script_str;
                }
                else if (arguments[i] === null)
                {
                    script_str = "var arg" + i + " = null" + ";\n" + script_str;
                }
                else if (arguments[i] === "")
                {
                    script_str = "var arg" + i + " = \"\"" + ";\n" + script_str;
                }
                else
                {
                    if (typeof arguments[i] == "string")
                    {
                        var replace_str = arguments[i].replace(/"/g, "\\\"").replace(/\n/g, "\\n");
                        script_str = "var arg" + i + " = \"" + replace_str + "\";\n" + script_str;
                    }
                    else if (typeof arguments[i] == "object")
                    {
                        script_str = "var arg" + i + " = arguments[" + obj_idx + "];\n" + script_str;
                        obj_arr.push(arguments[i]);
                        obj_idx++;
                    }
                    else
                    {
                        script_str = "var arg" + i + " = " + arguments[i] + ";\n" + script_str;
                    }
                }

                if (i < arguments.length - 1)
                    script_str += "arg" + i + ", ";
                else
                    script_str += "arg" + i;
            }
            script_str += ");\n";
            script_str += "return ret;";

            var callScript = function ()
            {
                var fn = new Function(arguments[0]);
                return fn.apply(this, obj_arr);
            };

            var value = callScript.call(this.handle, script_str);
            if (value != null && typeof (value) == "object")
            {
                var pobject = new nexacro.PluginObject();
                pobject.handle = value;
                return pobject;
            }
            return value;
        }
    };

    __pPluginObject.callMethodAsync = function ()
    {
        var self = this;

        var promise = new Promise(function (resolve, reject)
        {
            if (arguments.length < 1)
            {
                throw new TypeError("Failed to execute plugin method: 1 argument required, but only 0 present.");
            }

            if (self.handle === undefined)
            {
                reject("Unexpected plugin object");
                return;
            }

            resolve(self.callMethod());
        });
        return promise;
    };

    __pPluginObject.destroy = nexacro._emptyFn;


    //==============================================================================
    // nexacro.WebBrowserPluginElement : <DIV><iframe>...</iframe></DIV>

    //==============================================================================
    nexacro._WebBrowserPluginElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.parent_elem.windowed = true;

        this._params = new nexacro.Collection();
        this._events = new nexacro.Collection();
    };

    var __pWebBrowserPluginElement = nexacro._createPrototype(nexacro.PluginElement, nexacro._WebBrowserPluginElement);
    nexacro._WebBrowserPluginElement.prototype = __pWebBrowserPluginElement;

    __pWebBrowserPluginElement._type_name = "WebBrowserPluginElement";
    __pWebBrowserPluginElement.initEvent = nexacro._emptyFn;

    //==== internal handles =========//
    __pWebBrowserPluginElement._object_node = null;
    __pWebBrowserPluginElement._embed_node = null; // for embed tag
    __pWebBrowserPluginElement._params = null;  // for Param tag
    __pWebBrowserPluginElement._events = null;
    __pWebBrowserPluginElement._window = null;
    __pWebBrowserPluginElement._document = null;
    __pWebBrowserPluginElement._block_node = null; //for iframe enable
    __pWebBrowserPluginElement._prev_outfocus_message_elem = null;
    __pWebBrowserPluginElement._next_outfocus_message_elem = null;
    __pWebBrowserPluginElement.__parentwindow = null;

    var _iframe_eventhandler_onmousemove = function (evt)
    {
        var target = evt.target;

        try
        {
            if (target)
            {
                var _doc = target.ownerDocument;
                var ct = _doc._nexacro_iframe_contaniner;

                if (nexacro._cur_track_info)
                {
                    const sysevt = this._getSysEvent()
                    const { win } = sysevt.GetEventContext(evt);


                    var elem = nexacro.__findParentElement(ct);
                    var wb = _doc._nexacro_iframe_contaniner._linked_element.linkedcontrol;
                    var pos = wb._getWindowPosition();

                    win._on_sys_mousemove(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX + pos.x, evt.clientY + pos.y, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
                }
            }
        }
        catch (e)
        {
            nexacro._settracemsg(e);
        }
    };

    var _iframe_eventhandler_ontouchmove = function (evt)
    {
        var target = evt.target;
        var scroll_target;

        function getDirection(tInfo1, tInfo2)
        {
            var gap_x = tInfo2[2] - tInfo1[2];
            var gap_y = tInfo2[3] - tInfo1[3];
            // direction
            //     1
            //   8   4
            //     2

            if (Math.abs(gap_y) >= Math.abs(gap_x))
            {
                return (gap_y > 0) ? 1 : 2;
            }
            return (gap_x < 0) ? 4 : 8;
        }

        if (target)
        {
            var _doc = target.ownerDocument;
            var _body = _doc.body;
            var ct = _doc._nexacro_iframe_contaniner;

            if (_doc._nexacro_bInnerScroll)
            {
                return;
            }

            if (nexacro._OS == "iOS")
            {
                scroll_target = _doc._nexacro_iframe;
            }
            else
            {
                scroll_target = _body;
            }

            if (_doc._nexacro_preTouchInfo)
            {
                var touchlen = evt.changedTouches ? evt.changedTouches.length : 1;
                var touch = {};
                for (var i = 0; i < touchlen; i++)
                {
                    touch = evt.changedTouches ? evt.changedTouches[i] : (evt.touches ? evt.touches[0] : evt);
                }

                var clientX = touch.pageX || touch.clientX;
                var clientY = touch.pageY || touch.clientY;
                var screenX = touch.screenX || clientX;
                var screenY = touch.screenY || clientY;

                var touchInfo = [clientX, clientY, screenX, screenY];


                /*
                function getDistance(dir, tInfo1, tInfo2)
                {
                    var gap_x = tInfo2[2] - tInfo1[2];
                    var gap_y = tInfo2[3] - tInfo1[3];
                    if (dir < 3)
                        return gap_y;
                    else
                        return gap_x;
                }
                */
                var pNode = target.parentNode;
                var dir = getDirection(_doc._nexacro_preTouchInfo, touchInfo);
                //var direction = (dir[1] > 0);
                //var distance = getDistance(dir, _doc._nexacro_preTouchInfo, touchInfo);
                var bNexacroScroll;
                var _win = _doc.defaultView || _doc.parentWindow;

                if (_doc._nexacro_bInnerScroll === false)
                {
                    if (dir != _doc._nexacro_bInnerScrollDir)
                    {
                        _doc._nexacro_bInnerScroll = undefined;
                    }
                }

                if (dir < 3) //y축 
                {
                    while (pNode && _doc._nexacro_bInnerScroll !== false && pNode != scroll_target)
                    {
                        if (dir == 1)
                        {
                            if (pNode.scrollTop > 0)
                            {
                                _doc._nexacro_bInnerScroll = true;
                                return;
                            }
                        }
                        else
                        {
                            if (pNode.scrollTop && (pNode.scrollTop + pNode.clientHeight) < pNode.scrollHeight)
                            {
                                //trace("top " + pNode.scrollTop + " --- " + pNode.clientHeight + "--- " + pNode.scrollHeight);
                                _doc._nexacro_bInnerScroll = true;
                                return;
                            }
                        }
                        pNode = pNode.parentNode;
                    }

                    var clientHeight;
                    if (nexacro._OS == "iOS")
                    {
                        clientHeight = parseInt(scroll_target.style.height);

                        //var clientHeight = scroll_target.clientHeight;
                    }
                    else
                    {

                        clientHeight = _win.innerHeight;
                        //clientHeight = (clientHeight > w_innerHeight) ? clientHeight : w_innerHeight;
                    }

                    var scrollHeight = scroll_target.scrollHeight || _doc.documentElement.scrollHeight;
                    var scrollTop = scroll_target.scrollTop || _doc.documentElement.scrollTop;
                    //if (bNexacroScroll === undefined)// && (scrollTop == 0 && distance > 0) || (((scrollTop + clientHeight - distance) < scrollHeight) && distance < 0))
                    //{
                    if (dir == 1)
                    {
                        if (scrollTop == 0)
                            bNexacroScroll = true;
                    }
                    else
                    {
                        if (scrollTop + clientHeight >= scrollHeight)
                            bNexacroScroll = true;
                    }
                    //}
                    var preClientY = _doc._nexacro_preTouchInfo[1];
                    if ((dir == 2 && clientY > preClientY) || (dir == 1 && clientY < preClientY))
                    {
                        return;
                    }
                }
                else  //x axis
                {
                    while (pNode && _doc._nexacro_bInnerScroll !== false && pNode != scroll_target)
                    {
                        if (dir == 4)
                        {
                            if (pNode.scrollLeft > 0)
                            {
                                _doc._nexacro_bInnerScroll = true;
                                return;
                            }
                        }
                        else
                        {
                            if (pNode.scrollLeft && (pNode.scrollLeft + pNode.clientWidth) < pNode.scrollWidth)
                            {
                                //trace("left" + pNode.scrollLeft + " --- " + pNode.clientWidth + "--- " + pNode.scrollWidth);
                                _doc._nexacro_bInnerScroll = true;
                                return;
                            }
                        }

                        pNode = pNode.parentNode;
                    }
                    var clientWidth;
                    if (nexacro._OS == "iOS")
                    {
                        clientWidth = parseInt(scroll_target.style.width);

                    }
                    else
                    {

                        clientWidth = _win.innerWidth;
                        //clientWidth = (clientWidth > w_innerWidth) ? clientWidth : w_innerWidth;
                    }


                    var scrollWidth = scroll_target.scrollWidth || _doc.documentElement.scrollWidth;
                    var scrollLeft = scroll_target.scrollLeft || _doc.documentElement.scrollLeft;

                    //if (bNexacroScroll === undefined)// && (scrollLeft == 0 && distance < 0) || (((scrollWidth - clientWidth) <= scrollLeft) && distance > 0))
                    //{
                    if (dir == 8)
                    {
                        if (scrollLeft == 0)
                            bNexacroScroll = true;
                    }
                    else
                    {
                        if (scrollLeft + clientWidth >= scrollWidth)
                            bNexacroScroll = true;
                    }
                    //}

                    var preClientX = _doc._nexacro_preTouchInfo[0];
                    //trace(dir + " -0-- " + clientX  + " +++ " + screenX+" ----- " + preClientX + " ----- " + _doc._nexacro_preTouchInfo[2]);
                    if ((dir == 4 && clientX > preClientX) || (dir == 8 && clientX < preClientX))
                    {
                        return;
                    }
                }
                _doc._nexacro_preTouchInfo[0] = clientX;
                _doc._nexacro_preTouchInfo[1] = clientY;
                _doc._nexacro_preTouchInfo[2] = screenX;
                _doc._nexacro_preTouchInfo[3] = screenY;
                _doc._nexacro_bInnerScroll = false;
                _doc._nexacro_bInnerScrollDir = dir;

                if (bNexacroScroll)
                {
                    const sysevt = this._getSysEvent();
                    const context = sysevt.GetEventContext(evt);
                    context.elem = ct;
                    nexacro._syshandler_ontouchmove(sysevt, evt, context);
                }
                else
                {
                    _doc._nexacro_bScroll = false;
                }
            }
        }
    };

    var _iframe_eventhandler_ontouchstart = function (evt)
    {
        var target = evt.target;
        var scroll_target;

        if (target)
        {
            var _doc = target.ownerDocument;
            var _body = _doc.body;
            var ct = _doc._nexacro_iframe_contaniner;

            _doc._nexacro_bInnerScroll = undefined;
            if (nexacro._OS == "iOS")
                scroll_target = _doc._nexacro_iframe;
            else
                scroll_target = _body;


            _doc._nexacro_bScroll = false;

            var _win = _doc.defaultView || _doc.parentWindow;
            var clientHeight;
            var clientWidth;
            if (nexacro._OS == "iOS")
            {
                clientHeight = parseInt(scroll_target.style.height);
                clientWidth = parseInt(scroll_target.style.width);
            }
            else
            {
                clientHeight = nexacro._getContainerHandleClientHeight(_win);
                clientWidth = nexacro._getContainerHandleClientWidth(_win);
                var w_innerHeight = _win.innerHeight;
                var w_innerWidth = _win.innerWidth;

                clientHeight = (clientHeight > w_innerHeight) ? clientHeight : w_innerHeight;
                clientWidth = (clientWidth > w_innerWidth) ? clientWidth : w_innerWidth;
            }

            var scrollHeight = scroll_target.scrollHeight || _doc.documentElement.scrollHeight;
            var scrollTop = scroll_target.scrollTop || _doc.documentElement.scrollTop;
            var scrollWidth = scroll_target.scrollWidth || _doc.documentElement.scrollWidth;
            var scrollLeft = scroll_target.scrollLeft || _doc.documentElement.scrollLeft;

            if ((scrollTop == 0 || (scrollHeight - clientHeight) <= scrollTop)
                || (scrollLeft == 0 || (scrollWidth - clientWidth) <= scrollLeft))
            {
                _doc._nexacro_bScroll = true;

                var touchlen = evt.changedTouches ? evt.changedTouches.length : 1;
                var touch = {};
                for (var i = 0; i < touchlen; i++)
                {
                    touch = evt.changedTouches ? evt.changedTouches[i] : (evt.touches ? evt.touches[0] : evt);
                }

                var clientX = touch.pageX || touch.clientX;
                var clientY = touch.pageY || touch.clientY;
                var screenX = touch.screenX || clientX;
                var screenY = touch.screenY || clientY;

                _doc._nexacro_preTouchInfo = [clientX, clientY, screenX, screenY];

                const sysevent = this._getSysEvent();
                const context = sysevent.GetEventContext(evt);
                context.elem = ct;

                nexacro._syshandler_ontouchstart(sysevent, evt, context);
            }
        }
    };

    var _iframe_eventhandler_ontouchend = function (evt)
    {
        var target = evt.target;

        if (target)
        {
            var _doc = target.ownerDocument;
            //var _body = _doc.body;
            var ct = _doc._nexacro_iframe_contaniner;

            if (_doc._nexacro_bScroll)
            {
                if (nexacro._last_touchend_time && (nexacro._last_touchend_doc != _doc))
                    nexacro._last_touchend_time = null;

                const sysevent = this._getSysEvent();
                const context = sysevent.GetEventContext(evt);
                context.elem = ct;

                nexacro._syshandler_ontouchend(sysevent, evt, context);
            }
        }
    };

    var _iframe_eventhandler_onmousewheel = function (evt)
    {
        var target = evt.target;

        if (target)
        {
            var _doc = target.ownerDocument;
            var _body = _doc.body;
            var ct = _doc._nexacro_iframe_contaniner;
            var scroll_target;

            if (nexacro._OS == "iOS")
                scroll_target = _doc._nexacro_iframe;
            else
                scroll_target = _body;

            var _win = _doc.defaultView || _doc.parentWindow;
            var clientHeight = 0;
            var scrollHeight = scroll_target.scrollHeight || _doc.documentElement.scrollHeight;
            var scrollTop = scroll_target.scrollTop || _doc.documentElement.scrollTop;
            var delta_y = nexacro.__getWheelDeltaY(evt);

            if (nexacro._OS == "iOS")
            {
                clientHeight = parseInt(scroll_target.style.height);
            }
            else
            {
                clientHeight = _win.innerHeight;
            }

            if ((scrollTop == 0 && delta_y > 0) || (scrollHeight - clientHeight <= scrollTop && delta_y < 0))
            {
                const sysevt = this._getSysEvent();
                const context = sysevt.GetEventContext(evt);
                context.elem = ct;

                nexacro._syshandler_onmousewheel(sysevt, evt, context);
            }
        }
    };

    var _iframe_eventhandler_onload = function (evt)
    {
        var node = evt.target;

        if (!node) return;

        try
        {
            var _doc = node.contentDocument || node.contentWindow.document;

            _doc._nexacro_iframe_contaniner = node._contaniner.handle;
            _doc._nexacro_iframe = node._contaniner.dest_handle;

            if (nexacro._SupportTouch)
            {
                nexacro._observeSysEvent(_doc, "touchmove", "ontouchmove", _iframe_eventhandler_ontouchmove.bind(this));
                nexacro._observeSysEvent(_doc, "touchstart", "ontouchstart", _iframe_eventhandler_ontouchstart.bind(this));
                nexacro._observeSysEvent(_doc, "touchend", "ontouchend", _iframe_eventhandler_ontouchend.bind(this));
            }

            nexacro._observeSysEvent(_doc, "mousewheel", "onmousewheel", _iframe_eventhandler_onmousewheel.bind(this));
            nexacro._observeSysEvent(_doc, "DOMMouseScroll", "onmousewheel", _iframe_eventhandler_onmousewheel.bind(this));
            nexacro._observeSysEvent(_doc, "mousemove", "onmousemove", _iframe_eventhandler_onmousemove.bind(this));
        }
        catch (e)
        {
            nexacro._settracemsg(e);
        }
        finally
        {
            var elem = node._linked_element;
            if (elem)
                elem._on_frame_load(node.contentWindow);
        }
    };

    __pWebBrowserPluginElement.create = function (win)
    {

        // parent is always control element
        // this is always NO nc_element
        this.__parentwindow = win;
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle && !this.handle)
        {
            this.owner_elem = owner_elem;
            var _doc = owner_elem._getRootWindowHandle();
            var handle = this._createInternalFrameElementHandle(_doc, this.left, this.top, this.width, this.height, this._params);
            handle._contaniner = owner_elem;

            nexacro.__setDOMNode_Selectable(handle, true);

            if (nexacro._OS == "iOS")
            {
                nexacro.__setMobileIframeDOMNodeStyleScroll(owner_elem.dest_handle.style);
            }

            if (nexacro._OS == "Android" && (nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari") && this.visible)
            {
                //Android web browser scroll bug
                this._need_hide = true; // [RP_36833] - property'name change this._is_visible -> this._need_hide , value change false -> true because : null , undefinde -> false
            }

            var handle_style = handle.style;
            if (!this.visible || this._need_hide)
            {
                nexacro.__setDOMStyle_Visible(handle_style, false);
            }

            if (this.font)
            {
                nexacro.__setDOMStyle_Font(handle_style, this.font);
            }

            if (this.color)
            {
                nexacro.__setDOMStyle_Color(handle_style, this.color);
            }

            var inner_focus_elem = this._createInternalFocusElementHandle("preFocus", win, _doc, owner_elem);
            if (inner_focus_elem)
            {
                this._pre_tab_focus_elem = inner_focus_elem;
                nexacro._observeSysEvent(inner_focus_elem, "focus", "onfocus", this._go_prev_focus);
            }

            // append TO Parent Element
            this.handle = this.dest_handle = handle;
            nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
            nexacro._observeSysEvent(handle, "load", "onload", _iframe_eventhandler_onload.bind(this));

            inner_focus_elem = this._createInternalFocusElementHandle("nextFocus", win, _doc, owner_elem);
            if (inner_focus_elem)
            {
                nexacro._observeSysEvent(inner_focus_elem, "focus", "onfocus", this._go_next_focus);
                this._next_outfocus_message_elem = this._createInternalAccessibilityElementHandle(win, owner_elem);
            }

            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                nexacro._observeSysEvent(handle, "focusin", "onfocusin", this._iframe_onfocusin_forward.bind(this));
                nexacro._observeSysEvent(handle, "focusout", "onfocusout", this._iframe_onfocusout_forward.bind(this));
            }
        }
    };

    __pWebBrowserPluginElement.createCommand = function ()
    {
        return "";
        /*
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this.handle)
        {
            this.owner_elem = owner_elem;
            var _doc = owner_elem._getRootWindowHandle();
            var str = "";
            var handle_style = "";
            if (!this.visible)
                handle_style += nexacro.__getHTMLStyle_Visible(false);
            if (this.color)
                handle_style += nexacro.__getHTMLStyle_ColorObject(this.color);
            if (this.font)
                handle_style += nexacro.__getHTMLStyle_FontObject(this.font);
//	        if (this.left || this.top)
                handle_style += nexacro.__getHTMLStyle_Pos(this.left, this.top);
            if (this.width && this.height)
                handle_style += nexacro.__getHTMLStyle_Size(this.width + this._getOverflowScrollSize(), this.height + this._getOverflowScrollSize());

            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                str += "<div tabindex='0' style='left:0px; top:0px; width:1px; height:1px; opacity:0;'></div>";
                str += "<div tabindex='0' style='left:0px; top:0px; width:1px; height:1px; opacity:0;'></div>";
            }
            str += "<iframe ";
            this._object_id = this.parent.name + ":" + this._type_name;
            if (this._object_id)
            {
                str += " id = '" + this._object_id + "'";
            }

            //str += nexacro.__getHTMLAttr_Selectable(true);
            //str += ">";

            var params = this._params;
            var param_cnt = (params ? params.length : 0);
            for (var i = 0 ; i < param_cnt; i++)
            {
                str += "<param name ='" + params.get_id(i) + "' value ='" + params.get_item(i) + "'/>";
            }

            if (nexacro._OS == "Android" && (nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari") && this.visible)
            { //Android web browser scroll bug
                this._need_hide = true; // [RP_36833] - property'name change this._is_visible -> this._need_hide , value change false -> true because : null , undefinde -> false
            }

            //if (this.padding)
            //    handle_style += nexacro.__getHTMLStyle_PaddingObject(this.padding);
            if (this.textAlign || this.verticalAlign)
                handle_style += nexacro.__getHTMLStyle_BKImageAlign(this.textAlign, this.verticalAlign);
            str += (handle_style) ? (" style='" + handle_style + "'>") : ">";
            str += "<div";
            str += (handle_style) ? (" style='" + handle_style + "'>") : ">";


            str += "<div";
            var handle_style = this._getCommonStyleStr();
            str += (handle_style) ? (" style='" + handle_style + "'>") : ">";
            str += "</div></div></iframe>";


            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                str += "<div tabindex='0' style='left:0px; top:0px; width:1px; height:1px; opacity:0;'></div>";
                str += "<div tabindex='0' style='left:0px; top:0px; width:1px; height:1px; opacity:0;'></div>";
            }


            return str;
        }
        
        return "";
        */
    };
    __pWebBrowserPluginElement.attachHandle = function (win)
    {
        return;
        /*
        if (this._object_id && !this.handle)
            {
                this.handle = win._doc.getElementById(this._object_id);
                this.handle._linked_element = this;
                nexacro._observeSysEvent(this.handle, "load", "onload", _iframe_eventhandler_onload);
        }
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle)
        {
            nexacro.__setMobileIframeDOMNodeStyleScroll(owner_elem.handle.style);
        }

        const env = nexacro.getEnvironment();
        if (env._p_enableaccessibility)
            {
                var owner_handle = this.handle.offsetParent;
                if (owner_handle)
                {
                var cur_handle = owner_handle.firstChild;
                cur_handle.parent_elem = this.parent;
                nexacro._observeSysEvent(cur_handle, "focus", "onfocus", this._go_prev_focus);

                cur_handle = cur_handle.nextSibling;
                nexacro._observeSysEvent(cur_handle, "focus", "onfocus", this._iframe_onfocus_forward);

                cur_handle = cur_handle.nextSibling.nextSibling;
                nexacro._observeSysEvent(cur_handle, "focus", "onfocus", this._iframe_onfocus_forward);

                cur_handle = cur_handle.nextSibling;
                cur_handle.parent_elem = this.parent;
                nexacro._observeSysEvent(cur_handle, "focus", "onfocus", this._go_next_focus);
    }
        }*/
    };

    __pWebBrowserPluginElement._createInternalAccessibilityElementHandle = function (win, owner_elem)
    {
        return null;
    };

    __pWebBrowserPluginElement._createInternalFocusElementHandle = function (id, win, _doc, owner_elem)
    {
        /* 일반 상태에서 탭키 포커스 이동 */
        var _focus_input = _doc.createElement("div");
        nexacro.__setDOMNode_TabIndex(_focus_input, 0);
        nexacro.__setDOMNode_Id(_focus_input, owner_elem.name, ":" + id);

        var f_input_style = _focus_input.style;
        nexacro.__setDOMStyle_Absolute(f_input_style);
        nexacro.__setDOMStyle_Pos(f_input_style, this.left, this.top);
        nexacro.__setDOMStyle_Size(f_input_style, 1, 1);
        nexacro.__setDOMStyle_OpacityObject(f_input_style, 0);
        //f_input_style.border = "0px solid #ffffff";

        _focus_input.parent_elem = this.parent;
        nexacro.__appendDOMNode(owner_elem.dest_handle, _focus_input);

        const env = nexacro.getEnvironment();
        if (env._p_enableaccessibility)
        {
            nexacro.__setDOMAccessibility_StatHidden(_focus_input, true);
        }

        return _focus_input;
    };

    __pWebBrowserPluginElement._go_prev_focus = function (evt)
    {
        var node = evt.target ? evt.target : evt.srcElement;
        var form = node.parent_elem.linkedcontrol._getForm();

        var newfocus_comp = form._searchPrevTabFocus(form._last_focused);

        if (newfocus_comp && newfocus_comp[0])
        {
            if (newfocus_comp[0] instanceof nexacro.Form && newfocus_comp[0]._last_focused)
            {
                var win = form._getWindow();
                win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
            }

            newfocus_comp[0]._setFocus(true, 1, true);
        }
    };

    __pWebBrowserPluginElement._go_next_focus = function (evt)
    {
        var node = evt.target ? evt.target : evt.srcElement;
        var form = node.parent_elem.linkedcontrol._getForm();

        var newfocus_comp = form._searchNextTabFocus(form._last_focused);

        if (newfocus_comp && newfocus_comp[0])
        {
            if (newfocus_comp[0] instanceof nexacro.Form && newfocus_comp[0]._last_focused)
            {
                var win = form._getWindow();
                win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
            }

            newfocus_comp[0]._setFocus(true, 0, true);
        }
    };

    __pWebBrowserPluginElement._on_frame_load = function (_win)
    {
        var comp;
        var docurl = "";
        try
        {
            comp = this.parent_elem.linkedcontrol;
            if (_win)
            {
                if (this._need_hide)
                {
                    nexacro.__setDOMStyle_Visible(this.handle.style, true);
                    this._need_hide = false;
                }

                this._window = _win;

                this._document = _win.document;
                if (_win.NEXACROWEBBROWSER == undefined)
                    _win.NEXACROWEBBROWSER = comp;
            }

            if (this._document)
            {
                docurl = this._document.location.href;
            }
        }
        catch (e)
        {
            this._window = null;
            this._document = null; // permissions problems when document=null processing
            nexacro._settracemsg(e);
        }

        _win = comp._getWindow();
        var cur_focus_paths = _win.getCurrentFocusPaths();
        var pThis = comp;

        while (pThis && pThis._is_nc_control)
        {
            pThis = pThis.parent;
        }

        if (!pThis)
            return;

        var focuspath_index = -1;
        if (cur_focus_paths)
        {
            focuspath_index = nexacro._indexOf(cur_focus_paths, pThis);
        }
        var len = cur_focus_paths.length;

        if (focuspath_index < 0)
        {
            var focus_comp = cur_focus_paths[len - 1];
            var input_elem = focus_comp._input_element;
            if (!input_elem || (input_elem && !input_elem._is_focused))
                focus_comp._apply_setfocus();

            if (input_elem)
            {
                input_elem._is_sys_focused = false;
                input_elem.setElementFocus();
            }
        }
        comp.on_load_handler(docurl);
    };

    __pWebBrowserPluginElement.destroy = function ()
    {
        if (this._prev_outfocus_message_elem)
        {
            if (this._prev_outfocus_message_elem.handle)
                nexacro._stopSysObserving(this._prev_outfocus_message_elem.handle, "focus", "onfocus", this._iframe_onfocus_forward);
            this._prev_outfocus_message_elem.destroy();
            this._prev_outfocus_message_elem = null;
        }

        if (this._next_outfocus_message_elem)
        {
            this._next_outfocus_message_elem.destroy();
            this._next_outfocus_message_elem = null;
        }

        var handle = this.handle;
        if (handle)
        {
            nexacro._stopSysObserving(handle, "load", "onload", _iframe_eventhandler_onload);
            handle._linked_element = null;

            var _owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
            if (this.owner_elem && this.owner_elem.dest_handle)
                _owner_handle = this.owner_elem.dest_handle;

            if (!this.owner_elem || _owner_handle)
            {
                nexacro.__removeDOMNode(_owner_handle, handle);
            }

            var overlay_elem = this._overlay_elem;
            if (overlay_elem)
            {
                overlay_elem.destroy();
            }

            this._overlay_elem = null;
            this._document = null;
            this.owner_elem = null;
            this.handle = this.dest_handle = null;
        }
        this._p_parent = null;
        this.parent_elem = null;

        var params = this._params;
        if (params)
        {
            params.destroy();
            this._params = null;
        }

        var events = this._events;
        if (events)
        {
            events.destroy();
            this.events = null;
        }
    };

    __pWebBrowserPluginElement._createInternalFrameElementHandle = function (_doc, left, top, width, height, params)
    {
        var handle = _doc.createElement("iframe");

        handle._linked_element = this;
        handle.frameBorder = 0; //webborwser don't use frameborder

        this._object_id = this.parent_elem.handle.id + '_' + this.component._type_name;
        if (this._object_id)
        {
            nexacro.__setHTMLAttr_Property(handle, 'id', this._object_id);
        }

        var handle_style = handle.style;
        handle_style.position = "absolute";

        const env = nexacro.getEnvironment();
        if (env._p_enableaccessibility && env._a11ytype != 5)
            nexacro.__setDOMNode_ToolTip(handle, this.parent_elem.tooltiptext ? this.parent_elem.tooltiptext : (this.parent_elem.accessibilitylabel ? this.parent_elem.accessibilitylabel : this.parent_elem.linkedcontrol.id));

        nexacro.__setDOMStyle_Pos(handle_style, left, top);
        nexacro.__setDOMStyle_Size(handle_style, width, height);

        var param_cnt = (params ? params.length : 0);
        for (var i = 0; i < param_cnt; i++)
        {
            this._setInternalFrameDOMParam(_doc, handle, params.get_id(i), params.get_item(i));
        }

        return handle;
    };

    __pWebBrowserPluginElement._setInternalFrameDOMParam = function (_doc, target_handle, name, value)
    {
        nexacro.__setHTMLAttr_Property(target_handle, name, value);
    };

    __pWebBrowserPluginElement.setElementFocus = nexacro._emptyFn;

    __pWebBrowserPluginElement._setElementFocus = function (selffocus)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMNode_Focus(handle, true);
            nexacro.__setLastFocusedElement(this);
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                var next_outfocus_message_elem = this._next_outfocus_message_elem;
                if (next_outfocus_message_elem)
                    next_outfocus_message_elem._killfocus_flag = false;

                var prev_outfocus_message_elem = this._prev_outfocus_message_elem;
                if (prev_outfocus_message_elem)
                    prev_outfocus_message_elem._killfocus_flag = false;
            }
        }
    };

    __pWebBrowserPluginElement.setElementCodebase = function (codebaseurl) // 삭제 ?
    {
        if (this.codebase != codebaseurl)
        {
            this.codebase = codebaseurl;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setHTMLAttr_Property(handle, 'codebase', codebaseurl);
            }
        }
    };

    __pWebBrowserPluginElement.getElementParam = function (name)
    {
        var handle = this.handle;
        if (handle)
        {
            var _doc = this._document;
            if (!_doc)
            {
                _doc = this._document = handle.contentDocument || handle.contentWindow.document;
            }
            var value = null;
            var pobject;
            if (name)
            {
                if (name === "document")
                {
                    pobject = new nexacro.PluginObject();
                    pobject.handle = _doc;
                    return pobject;
                }
                else if (name == "window")
                {
                    var _win = this._window;
                    if (!_win)
                    {
                        _win = this._window = handle.contentWindow;
                    }
                    pobject = new nexacro.PluginObject();
                    pobject.handle = _win;
                    return pobject;
                }
                value = handle[name];
                if (value != null && typeof (value) == "object")
                {
                    pobject = new nexacro.PluginObject();
                    pobject.handle = value;
                    return pobject;
                }
                return value;
            }
        }
        else
        {
            var params = this._params;
            return params.get_item(name);
        }
    };

    __pWebBrowserPluginElement.setElementParam = function (name, value)
    {
        if (this.handle)
        {
            var _doc = this._getRootWindowHandle();
            this._setInternalFrameDOMParam(_doc, this.handle, name, value);
        }
        else
        {
            var params = this._params;
            params.add_item(name, value);
        }
    };

    __pWebBrowserPluginElement.setElementEnable = function (value)
    {
        if (this.enable != value)
        {
            this.enable = value;
            var handle = this.handle;
            if (handle)
            {
                var overlay_elem = this._overlay_elem;
                if (value) // enable
                {
                    if (overlay_elem)
                        overlay_elem.setElementVisible(false);
                }
                else
                {
                    if (!overlay_elem)
                    {
                        var control_element = this.parent;
                        var linkedcontrol = control_element.linkedcontrol;
                        var win = linkedcontrol._getWindow();
                        if (!win)
                        {
                            // nre일 경우로 추정될 수 밖에 없으므로 코드 제거하고 원인파악.
                            throw new Error("nexacro k dev: not find root window obj.");

                        }
                        overlay_elem = this._overlay_elem = new nexacro._OverlayElement(control_element);

                        overlay_elem.setLinkedControl(linkedcontrol); //?

                        overlay_elem.create(win);
                    }
                    overlay_elem.setElementVisible(true);
                }
            }
        }
    };

    __pWebBrowserPluginElement._getDoc = function ()
    {
        return this._document;
    };

    __pWebBrowserPluginElement._setUrl = function (url, useurlhistory)
    {
        if (this.handle)
        {
            if (useurlhistory)
                this.setElementParam("src", url);
            else
                this._replaceURL(url);
        }
    };

    if (nexacro._Browser == "Gecko")
    {
        __pWebBrowserPluginElement._setGo = function ()
        {
            if (this.handle && this.handle.contentWindow)
            {
                try
                {
                    this.handle.contentWindow.location.reload(true);
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }
            }
        };
    }
    else
    {
        __pWebBrowserPluginElement._setGo = function ()
        {
            if (this.handle && this.handle.contentWindow)
            {
                try
                {
                    this.handle.contentWindow.history.go(0);
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }
            }
        };
    }

    __pWebBrowserPluginElement._setBack = function ()
    {
        if (this.handle && this.handle.contentWindow)
        {
            try
            {
                this.handle.contentWindow.history.back();
            }
            catch (e)
            {
                //if (self && self.history)
                //     self.history.back();
                nexacro._settracemsg(e);
            }
        }
    };

    __pWebBrowserPluginElement._setForward = function ()
    {
        if (this.handle && this.handle.contentWindow)
        {
            try
            {
                this.handle.contentWindow.history.forward();
            }
            catch (e)
            {
                //if (self && self.history)
                //    self.history.forward();
                nexacro._settracemsg(e);
            }
        }
    };


    __pWebBrowserPluginElement._replaceURL = function (v)
    {
        var iframe_window = this.handle.contentWindow;
        if (iframe_window)
            iframe_window.location.replace(v);
    };

    __pWebBrowserPluginElement.callMethod = function ()
    {
        if (arguments.length < 1)
            return;

        //var name = arguments[0];

        var fn_name = Array.prototype.shift.call(arguments);
        return this._window[fn_name].apply(this._window, arguments);
    };

    if (nexacro._isTouchInteraction && nexacro._SupportTouch)
    {
        __pWebBrowserPluginElement._iframe_onfocusout_forward = function (evt)
        {
            var win = this._linked_element.parent_elem.linkedcontrol._getWindow();
            win._is_iframe_focus = false;
        };

        __pWebBrowserPluginElement._iframe_onfocusin_forward = function (evt)
        {
            var win = this._linked_element.parent_elem.linkedcontrol._getWindow();
            win._is_iframe_focus = true;
        };
    }

    __pWebBrowserPluginElement._iframe_onfocus_forward = function (evt)
    {
        if (nexacro._com_waiting) nexacro._stopSysEvent(evt);
        this._linked_element._killfocus_flag = true;
    };

    __pWebBrowserPluginElement._setElementInternalFocus = function (keycode)
    {
        var E = nexacro.Event;
        if (keycode == E.KEY_UP)
        {
            if (this._prev_outfocus_message_elem._killfocus_flag == true)
            {
                this._prev_outfocus_message_elem._killfocus_flag = false;
            }
            else
            {
                try { this.handle.contentDocument.body.focus(); }
                catch (e) { nexacro._settracemsg(e); }
            }
        }
        else if (keycode == E.KEY_DOWN)
        {
            if (this._next_outfocus_message_elem._killfocus_flag == true)
            {
                this._next_outfocus_message_elem._killfocus_flag = false;
            }
            else
            {
                try { this.handle.contentDocument.body.focus(); }
                catch (e) { nexacro._settracemsg(e); }
            }
        }
    };

    __pWebBrowserPluginElement._setElementLeaveMessage = function (message)
    {
        //var prev_outfocus_elem = this._prev_outfocus_message_elem;
        //if (prev_outfocus_elem)
        //    prev_outfocus_elem.setElementText(message);
        var next_outfocus_elem = this._next_outfocus_message_elem;
        if (next_outfocus_elem)
            next_outfocus_elem.setElementText(message);
    };

    /*
    __pWebBrowserPluginElement._setElementBackwardFocus = function (prev_message, next_message)
    {
        var prev_outfocus_elem = this._prev_outfocus_message_elem;
        if (prev_outfocus_elem)
            prev_outfocus_elem.setElementText(next_message);

        var next_outfocus_elem = this._next_outfocus_message_elem;
        if (next_outfocus_elem)
        {
            next_outfocus_elem.setElementText(prev_message);
            next_outfocus_elem.handle.focus();
        }
    };    

    __pWebBrowserPluginElement._setElementForwardFocus = function (prev_message, next_message)
    {
        var prev_outfocus_elem = this._prev_outfocus_message_elem;
        if (prev_outfocus_elem)
        {
            prev_outfocus_elem.setElementText(prev_message);
            prev_outfocus_elem.handle.focus();
        }

        var next_outfocus_elem = this._next_outfocus_message_elem;
        if (next_outfocus_elem)
            next_outfocus_elem.setElementText(next_message);
    };
    */

    __pWebBrowserPluginElement.getProperty = __pWebBrowserPluginElement.getElementParam;
    __pWebBrowserPluginElement.setProperty = __pWebBrowserPluginElement.setElementParam;

    //======================================================================
    // nexacro._WebViewPluginElement
    //======================================================================
    nexacro._WebViewPluginElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.parent_elem.windowed = true;

        this._params = new nexacro.Collection();
        this._events = new nexacro.Collection();

    };

    var __pWebViewPluginElement = nexacro._createPrototype(nexacro.PluginElement, nexacro._WebViewPluginElement);
    nexacro._WebViewPluginElement.prototype = __pWebViewPluginElement;

    __pWebViewPluginElement._type_name = "WebViewPluginElement";
    __pWebViewPluginElement.initEvent = nexacro._emptyFn;

    //==== internal handles =========//
    __pWebViewPluginElement._object_node = null;
    __pWebViewPluginElement._embed_node = null; // for embed tag
    __pWebViewPluginElement._params = null;  // for Param tag
    __pWebViewPluginElement._events = null;
    __pWebViewPluginElement._window = null;
    __pWebViewPluginElement._document = null;
    __pWebViewPluginElement._block_node = null; //for iframe enable
    __pWebViewPluginElement._prev_outfocus_message_elem = null;
    __pWebViewPluginElement._next_outfocus_message_elem = null;

    //========= override===================================================
    __pWebViewPluginElement.create = __pWebBrowserPluginElement.create;
    __pWebViewPluginElement._go_prev_focus = __pWebBrowserPluginElement._go_prev_focus;
    __pWebViewPluginElement._go_next_focus = __pWebBrowserPluginElement._go_next_focus;
    __pWebViewPluginElement._createInternalFocusElementHandle = __pWebBrowserPluginElement._createInternalFocusElementHandle;
    __pWebViewPluginElement._createInternalAccessibilityElementHandle = __pWebBrowserPluginElement._createInternalAccessibilityElementHandle;

    __pWebViewPluginElement.createCommand = function ()
    {
        return "";

    };

    __pWebViewPluginElement.attachHandle = function (win)
    {
        return;
    };

    __pWebViewPluginElement._on_frame_load = function (_win)
    {
        var comp;
        var docurl = "";
        try
        {
            comp = this.parent_elem.linkedcontrol;
            if (_win)
            {
                if (this._need_hide)
                {
                    nexacro.__setDOMStyle_Visible(this.handle.style, true);
                    this._need_hide = false;
                }

                this._window = _win;
                this._document = _win.document;
                if (_win.nexacro == undefined)
                {
                    _win.nexacro =
                    {
                        firetargetfunc: undefined,
                        target: undefined,
                        fireUserNotify: function (userdata)
                        {
                            var msg =
                            {
                                message: 'fireUserNotify',
                                target: this.target,
                                data: userdata
                            };
                            this.firetargetfunc(msg);

                        }
                    };
                    _win.nexacro.firetargetfunc = comp.fireUserNotify;
                    _win.nexacro.target = comp;

                }
                // 하위 호환성 유지 
                if (_win.NEXACROWEBBROWSER == undefined)
                    _win.NEXACROWEBBROWSER = comp;
            }

            if (this._document)
            {
                var doc = this._document;
                var script_ = doc.createElement('script');
                script_.id = "_safeStringify";
                script_.crossorigin = 'anonymous';
                script_.async = "async";
                script_.text = "var _safeStringify = function (obj, indent)" +
                    "{ if (indent === void 0) { indent = 2; } var cache = [];" +
                    "if(obj === null || obj ==='' || obj === undefined) return undefined;" +
                    "if (typeof obj === 'object') {" +
                    "var retVal = JSON.stringify(obj, function (key, value)" +
                    "{ if(typeof value === 'object' && (value == document || value == window)) return value.toString();" +
                    "return typeof value === 'object' && value !== null ? cache.indexOf(value) !== -1 ? undefined : cache.push(value) && value : value;" +
                    "}, indent); cache = null; return retVal;" +
                    "} return obj.toString();} ";
                doc.body.appendChild(script_);
                docurl = this._document.location.href;
            }
        }
        catch (e)
        {
            this._window = null;
            this._document = null; // permissions problems when document=null processing
            nexacro._settracemsg(e);
        }

        _win = comp._getWindow();
        var cur_focus_paths = _win.getCurrentFocusPaths();
        var pThis = comp;

        while (pThis && pThis._is_nc_control)
        {
            pThis = pThis.parent;
        }

        if (!pThis)
            return;

        var focuspath_index = -1;
        if (cur_focus_paths)
        {
            focuspath_index = nexacro._indexOf(cur_focus_paths, pThis);
        }
        var len = cur_focus_paths.length;

        if (focuspath_index < 0)
        {
            var focus_comp = cur_focus_paths[len - 1];
            focus_comp._apply_setfocus();
            var input_elem = focus_comp._input_element;
            if (input_elem)
            {
                input_elem._is_sys_focused = false;
                input_elem.setElementFocus();
            }
        }
        comp.on_load_handler(docurl);
    };

    __pWebViewPluginElement.destroy = function ()
    {
        if (this._prev_outfocus_message_elem)
        {
            nexacro._stopSysObserving(this._prev_outfocus_message_elem.handle, "focus", "onfocus", this._iframe_onfocus_forward);
            this._prev_outfocus_message_elem.destroy();
            this._prev_outfocus_message_elem = null;
        }

        if (this._next_outfocus_message_elem)
        {
            this._next_outfocus_message_elem.destroy();
            this._next_outfocus_message_elem = null;
        }

        var handle = this.handle;
        if (handle)
        {
            nexacro._stopSysObserving(handle, "load", "onload", _iframe_eventhandler_onload);
            handle._linked_element = null;

            var _owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
            if (this.owner_elem && this.owner_elem.dest_handle)
                _owner_handle = this.owner_elem.dest_handle;

            if (!this.owner_elem || _owner_handle)
            {
                nexacro.__removeDOMNode(_owner_handle, handle);
            }

            var overlay_elem = this._overlay_elem;
            if (overlay_elem)
            {
                overlay_elem.destroy();
            }

            this._overlay_elem = null;
            this._document = null;
            this.owner_elem = null;
            this.handle = this.dest_handle = null;
        }
        this._p_parent = null;
        this.parent_elem = null;

        var params = this._params;
        if (params)
        {
            params.destroy();
            this._params = null;
        }

        var events = this._events;
        if (events)
        {
            events.destroy();
            this.events = null;
        }
    };

    __pWebViewPluginElement._createInternalFrameElementHandle = function (_doc, left, top, width, height, params)
    {
        var handle = _doc.createElement("iframe");

        handle._linked_element = this;
        handle.frameBorder = 0; //webborwser don't use frameborder

        this._object_id = this.parent_elem.handle.id + '_' + this.component._type_name;
        if (this._object_id)
        {
            nexacro.__setHTMLAttr_Property(handle, 'id', this._object_id);
        }

        var handle_style = handle.style;
        handle_style.position = "absolute";

        nexacro.__setDOMNode_ToolTip(handle, this.parent_elem.tooltiptext ? this.parent_elem.tooltiptext : (this.parent_elem.accessibilitylabel ? this.parent_elem.accessibilitylabel : this.parent_elem.linkedcontrol.id));

        nexacro.__setDOMStyle_Pos(handle_style, left, top);
        nexacro.__setDOMStyle_Size(handle_style, width, height);

        var param_cnt = (params ? params.length : 0);
        for (var i = 0; i < param_cnt; i++)
        {
            this._setInternalFrameDOMParam(_doc, handle, params.get_id(i), params.get_item(i));
        }

        return handle;
    };

    __pWebViewPluginElement._setInternalFrameDOMParam = function (_doc, target_handle, name, value)
    {
        nexacro.__setHTMLAttr_Property(target_handle, name, value);
    };

    __pWebViewPluginElement.setElementFocus = nexacro._emptyFn;

    __pWebViewPluginElement._setElementFocus = function (selffocus)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setDOMNode_Focus(handle, true);
            nexacro.__setLastFocusedElement(this);
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                var next_outfocus_message_elem = this._next_outfocus_message_elem;
                if (next_outfocus_message_elem)
                    next_outfocus_message_elem._killfocus_flag = false;

                var prev_outfocus_message_elem = this._prev_outfocus_message_elem;
                if (prev_outfocus_message_elem)
                    prev_outfocus_message_elem._killfocus_flag = false;
            }
        }
    };

    __pWebViewPluginElement.setElementCodebase = function (codebaseurl) // 삭제 ?
    {
        if (this.codebase != codebaseurl)
        {
            this.codebase = codebaseurl;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setHTMLAttr_Property(handle, 'codebase', codebaseurl);
            }
        }
    };

    __pWebViewPluginElement.getElementParam = function (name)
    {
        var handle = this.handle;
        if (handle)
        {
            var _doc = this._document;
            if (!_doc)
            {
                _doc = this._document = handle.contentDocument || handle.contentWindow.document;
            }
            var value = null;
            var pobject;
            if (name)
            {
                if (name === "document")
                {
                    pobject = new nexacro.PluginObject();
                    pobject.handle = _doc;
                    return pobject;
                }
                else if (name == "window")
                {
                    var _win = this._window;
                    if (!_win)
                    {
                        _win = this._window = handle.contentWindow;
                    }
                    pobject = new nexacro.PluginObject();
                    pobject.handle = _win;
                    return pobject;
                }
                value = handle[name];
                if (value != null && typeof (value) == "object")
                {
                    pobject = new nexacro.PluginObject();
                    pobject.handle = value;
                    return pobject;
                }
                return value;
            }
        }
        else
        {
            var params = this._params;
            return params.get_item(name);
        }
    };

    __pWebViewPluginElement.setElementParam = function (name, value)
    {
        if (this.handle)
        {
            var _doc = this._getRootWindowHandle();
            this._setInternalFrameDOMParam(_doc, this.handle, name, value);
        }
        else
        {
            var params = this._params;
            params.add_item(name, value);
        }
    };

    __pWebViewPluginElement.setElementEnable = function (value)
    {
        if (this.enable != value)
        {
            this.enable = value;
            var handle = this.handle;
            if (handle)
            {
                var overlay_elem = this._overlay_elem;
                if (value) // enable
                {
                    if (overlay_elem)
                        overlay_elem.setElementVisible(false);
                }
                else
                {
                    if (!overlay_elem)
                    {
                        var control_element = this.parent;
                        var linkedcontrol = control_element.linkedcontrol;
                        var win = linkedcontrol._getWindow();
                        if (!win)
                        {
                            // nre일 경우로 추정될 수 밖에 없으므로 코드 제거하고 원인파악.
                            throw new Error("nexacro k dev: not find root window obj.")

                        }
                        overlay_elem = this._overlay_elem = new nexacro._OverlayElement(control_element);

                        overlay_elem.setLinkedControl(linkedcontrol); //?

                        overlay_elem.create(win);
                    }
                    overlay_elem.setElementVisible(true);
                }
            }
        }
    };

    __pWebViewPluginElement._getDoc = function ()
    {
        return this._document;
    };

    __pWebViewPluginElement._setUrl = function (url, useurlhistory)
    {
        if (this.handle)
        {
            if (useurlhistory)
                this.setElementParam("src", url);
            else
                this._replaceURL(url);
        }
    };

    __pWebViewPluginElement._setInstallUrl = nexacro._emptyFn;

    if (nexacro._Browser == "Gecko")
    {
        __pWebViewPluginElement._setGo = function ()
        {
            if (this.handle && this.handle.contentWindow)
            {
                try
                {
                    this.handle.contentWindow.location.reload(true);
                }
                catch (e)
                {
                    //if (self && self.history)
                    //    self.history.go(0);
                    nexacro._settracemsg(e);
                }
            }
        };
    }
    else
    {
        __pWebViewPluginElement._setGo = function ()
        {
            if (this.handle && this.handle.contentWindow)
            {
                try
                {
                    this.handle.contentWindow.history.go(0);
                }
                catch (e)
                {
                    //if (self && self.history)
                    //    self.history.go(0);
                    nexacro._settracemsg(e);
                }
            }
        };
    }

    __pWebViewPluginElement._setBack = function ()
    {
        if (this.handle && this.handle.contentWindow)
        {
            try
            {
                this.handle.contentWindow.history.back();
            }
            catch (e)
            {
                //if (self && self.history)
                //     self.history.back();
                nexacro._settracemsg(e);
            }
        }
    };

    __pWebViewPluginElement._setForward = function ()
    {
        if (this.handle && this.handle.contentWindow)
        {
            try
            {
                this.handle.contentWindow.history.forward();
            }
            catch (e)
            {
                //if (self && self.history)
                //    self.history.forward();
                nexacro._settracemsg(e);
            }
        }
    };
    /*
    __pWebViewPluginElement.callMethod = function ()
    {
        if (arguments.length < 1)
            return;

    	

        var fn_name = Array.prototype.shift.call(arguments);
        return this._window[fn_name].apply(this._window, arguments);
    };
    */
    __pWebViewPluginElement._replaceURL = function (v)
    {
        var iframe_window = this.handle.contentWindow;
        if (iframe_window)
            iframe_window.location.replace(v);
    };


    __pWebViewPluginElement.injectScript = function ()
    {
        if (arguments.length < 1)
            return undefined;
        if (!this._window)
            return undefined;

        var script = arguments[0];

        if (script != null && typeof script == 'string')
        {
            script = script.replace(/\'/gi, "\\'");
            script = script.replace(/\r\n/gi, "\\n");
            script = script.replace(/\n/gi, "\\n");
            script = script.replace(/\r/gi, "\\n");
            var make = "this._safeStringify.call(this,new Function(\'return this." + script + "\').call(this))";
            //var make = "_safeStringify.call(this,eval(\'" + script + "\'))";
            //var ret = this._window.eval(make);

            var callScript = function ()
            {

                return Function("return " + arguments[0]).call(this);
            };
            var ret = callScript.call(this._window, make);

            if (ret === null || ret === undefined || ret === "")
            {
                return undefined;
            }
            else
            {
                ret = ret.toString();
                if (ret.charAt(0) == "\"")
                {
                    ret = ret.substr(1, ret.length - 1);
                    ret = ret.substr(0, ret.length - 1);
                }
            }
            return ret;
        }

        return undefined;
    };

    __pWebViewPluginElement.injectScriptAndReturnPromise = function ()
    {
        var self = this;
        var args = arguments;

        var promise = new Promise(function (resolve, reject)
        {
            if (arguments.length < 1 || !self._window)
            {
                throw new TypeError("Failed to execute 'injectScript': 1 argument required, but only 0 present.");
            }

            if (!self._window)
            {
                reject("Plugin not attached to window");
                return;
            }

            var script = args[0];
            if (script == null || typeof script !== 'string')
            {
                reject("Unexpected script");
                return;
            }

            resolve(self.injectScript.apply(self, args));
        });
        return promise;
    };


    __pWebViewPluginElement.injectScriptAsync = function ()
    {
        if (arguments.length < 1)
            return undefined;
        if (!this._window)
            return undefined;
        var script = arguments[0];
        var callback = arguments[1];
        var scope = arguments[2];

        if (script != null && typeof script == 'string')
        {
            // 개행문자와 홑따옴표 처리 
            script = script.replace(/\'/gi, "\\'");
            script = script.replace(/\r\n/gi, "\\r\\n");
            script = script.replace(/\n/gi, "\\n");
            script = script.replace(/\r/gi, "\\r");
            var make = "this._safeStringify.call(this,new Function(\'return this." + script + "\').call(this))";
            //var make = "_safeStringify.call(this,eval(\'" + script + "\'))";
            //var ret = this._window.eval(make);

            var callScript = function ()
            {

                return Function("return " + arguments[0]).call(this);
            };
            var ret = callScript.call(this._window, make);

            if (ret === null || ret === undefined || ret === "")
            {
                ret = undefined;
            }
            else
            {
                ret = ret.toString();
                if (ret.charAt(0) == "\"")
                {
                    ret = ret.substr(1, ret.length - 1);
                    ret = ret.substr(0, ret.length - 1);
                }

            }
            if (callback != null && typeof callback == "function")
            {
                // alive check 해야됨!!
                if (scope && scope._is_alive)
                    return callback.call(scope, ret);  // HTML5 sync only 
                else
                    return callback.call(null, ret);   // global scope
            }
        }

        return undefined;
    };

    if (nexacro._isTouchInteraction && nexacro._SupportTouch)
    {
        __pWebViewPluginElement._iframe_onfocusout_forward = function (evt)
        {
            var win = this._linked_element.parent_elem.linkedcontrol._getWindow();
            win._is_iframe_focus = false;
        };

        __pWebViewPluginElement._iframe_onfocusin_forward = function (evt)
        {
            var win = this._linked_element.parent_elem.linkedcontrol._getWindow();
            win._is_iframe_focus = true;
        };
    }

    __pWebViewPluginElement._iframe_onfocus_forward = function (evt)
    {
        if (nexacro._com_waiting) nexacro._stopSysEvent(evt);
        this._linked_element._killfocus_flag = true;
    };

    __pWebViewPluginElement._setElementInternalFocus = function (keycode)
    {
        var E = nexacro.Event;
        if (keycode == E.KEY_UP)
        {
            if (this._prev_outfocus_message_elem._killfocus_flag == true)
            {
                this._prev_outfocus_message_elem._killfocus_flag = false;
            }
            else
            {
                try { this.handle.contentDocument.body.focus(); }
                catch (e) { nexacro._settracemsg(e); }
            }
        }
        else if (keycode == E.KEY_DOWN)
        {
            if (this._next_outfocus_message_elem._killfocus_flag == true)
            {
                this._next_outfocus_message_elem._killfocus_flag = false;
            }
            else
            {
                try { this.handle.contentDocument.body.focus(); }
                catch (e) { nexacro._settracemsg(e); }
            }
        }
    };

    __pWebViewPluginElement._setElementLeaveMessage = function (message)
    {
        //var prev_outfocus_elem = this._prev_outfocus_message_elem;
        //if (prev_outfocus_elem)
        //	prev_outfocus_elem.setElementText(message);
        var next_outfocus_elem = this._next_outfocus_message_elem;
        if (next_outfocus_elem)
            next_outfocus_elem.setElementText(message);
    };

    __pWebViewPluginElement._getSysEvent = function ()
    {
        return nexacro.HTMLSysEvent._getSysEvent(this.__parentwindow.handle);
    }

    //__pWebViewPluginElement.getProperty = __pWebBrowserPluginElement.getElementParam;
    //__pWebViewPluginElement.setProperty = __pWebBrowserPluginElement.setElementParam;

    //======================================================================
    // nexacro._VideoPlayerPluginElement
    //======================================================================
    nexacro._VideoPlayerPluginElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this.parent_elem.windowed = true;

        this._params = new nexacro.Collection();
        this._events = new nexacro.Collection();

        this._node_type = null;
    };

    var __pVideoPlayerPluginElement = nexacro._createPrototype(nexacro.PluginElement, nexacro._VideoPlayerPluginElement);
    nexacro._VideoPlayerPluginElement.prototype = __pVideoPlayerPluginElement;

    __pVideoPlayerPluginElement._type_name = "VideoPlayerPluginElement";

    __pVideoPlayerPluginElement.classid = "{6bf52a52-394a-11d3-b153-00c04f79faa6}";

    __pVideoPlayerPluginElement._is_input_element = true;
    __pVideoPlayerPluginElement._current_event = "";

    //===============================================================
    // nexacro.VideoPlayerPluginElement : Create & Destroy & Update
    //===============================================================


    __pVideoPlayerPluginElement._getNodeType = function (file_type)
    {
        var ret = "video";

        switch (file_type)
        {
            //case "mp4":
            //case "webm":
            //case "ogg":
            //    ret = "video";
            //    break;
            case "mp3":
            case "wav":
                ret = "audio";
                break;
        }
        return ret;
    };

    __pVideoPlayerPluginElement._getType = function (file_type)
    {
        var ret = "video/" + file_type;

        switch (file_type)
        {
            //case "mp4":
            //case "webm":
            //case "ogg":
            //    ret = "video/" + file_type;
            //    break;
            case "mp3":
            case "wav":
                ret = "audio" + file_type;
                break;
        }
        return ret;
    };

    __pVideoPlayerPluginElement._createObjectElementHandle = function (_doc, left, top, width, height, params)
    {
        var source = this.source;
        var file_type = "";
        if (source)
        {
            file_type = (source + "").substring(source.lastIndexOf(".") + 1).toLowerCase();
        }
        //var type = this._getType(file_type);
        var node_name = this._getNodeType(file_type);
        var handle = _doc.createElement(node_name);

        //if (handle.canPlayType(type + "; codecs=''") == "maybe")
        //{
        this._node_type = node_name;

        handle._linked_element = this;

        var handle_style = handle.style;
        nexacro.__setDOMStyle_Absolute(handle_style);
        nexacro.__setDOMStyle_Pos(handle_style, left, top);
        nexacro.__setDOMStyle_Size(handle_style, width, height);

        var control = this.showcontrolbar;
        if (control != null)
        {
            handle.controls = control;
        }
        if (this.autoplay != null)
        {
            handle.autoplay = this.autoplay;
        }
        if (this.volume != null)
        {
            handle.volume = this.volume;
        }
        if (this.loop != null)
        {
            handle.loop = this.loop;
        }

        if (source)
        {
            var source_node = this._source_node = _doc.createElement("source");
            nexacro.__setHTMLAttr_Property(source_node, 'src', this.source);
            nexacro.__setHTMLAttr_Property(source_node, 'type', this._getType(file_type));
            nexacro.__appendDOMNode(handle, source_node);
        }

        //nexacro._observeSysEvent(handle, "abort", "onabort", this._video_eventhandler_abort);
        nexacro._observeSysEvent(handle, "canplay", "oncanplay", this._video_eventhandler_changedstatus);
        nexacro._observeSysEvent(handle, "canplaythrough", "oncanplaythrough", this._video_eventhandler_canplaythrough);
        nexacro._observeSysEvent(handle, "durationchange", "ondurationchange", this._video_eventhandler_durationchange);

        //nexacro._observeSysEvent(handle, "emptied", "onemptied", this._video_eventhandler_emptied);
        nexacro._observeSysEvent(handle, "ended", "onended", this._video_eventhandler_changedstatus);
        nexacro._observeSysEvent(handle, "error", "onerror", this._video_eventhandler_error);

        //nexacro._observeSysEvent(handle, "loadeddata", "onloadeddata", this._video_eventhandler_loadeddata);
        //nexacro._observeSysEvent(handle, "loadedmetadata", "onloadedmetadata", this._video_eventhandler_loadedmetadata);
        //nexacro._observeSysEvent(handle, "loadstart", "onloadstart", this._video_eventhandler_loadstart);

        nexacro._observeSysEvent(handle, "pause", "onpause", this._video_eventhandler_changedstatus);
        nexacro._observeSysEvent(handle, "play", "onplay", this._video_eventhandler_changedstatus);
        //nexacro._observeSysEvent(handle, "playing", "onplaying", this._video_eventhandler_playing);
        nexacro._observeSysEvent(handle, "progress", "onprogress", this._video_eventhandler_progress);
        //nexacro._observeSysEvent(handle, "ratechange", "onratechange", this._video_eventhandler_ratechange);

        //nexacro._observeSysEvent(handle, "seeked", "onseeked", this._video_eventhandler_seeked);
        //nexacro._observeSysEvent(handle, "seeking", "onseeking", this._video_eventhandler_seeking);
        //nexacro._observeSysEvent(handle, "stalled", "onstalled", this._video_eventhandler_stalled);
        //nexacro._observeSysEvent(handle, "suspend", "onsuspend", this._video_eventhandler_suspend);

        nexacro._observeSysEvent(handle, "timeupdate", "ontimeupdate", this._video_eventhandler_timeupdate);
        nexacro._observeSysEvent(handle, "volumechange", "onvolumechange", this._video_eventhandler_volumechange);
        //nexacro._observeSysEvent(handle, "waiting", "onwaiting", this._video_eventhandler_waiting);

        this._object_node = handle;
        return handle;
    };

    __pVideoPlayerPluginElement._video_eventhandler_changedstatus = function (evt) // playstatuschanged
    {
        var comp = evt.target._linked_element.parent_elem.linkedcontrol;
        if (comp)
        {
            if (comp._obj_elem)
            {
                if (evt.type == "pause" && comp._obj_elem._current_event == "stop")
                {
                    comp._obj_elem._current_event = "";
                    comp._on_statuschanged("stop");
                    return;
                }
                else if (evt.type == "canplay")
                {
                    comp._obj_elem._current_event = "";
                    comp._on_statuschanged("ready");
                    return;
                }
                else if (evt.type == "pause") { comp._obj_elem._current_event = "pause"; }
                else { comp._obj_elem._current_event = ""; }
                comp._on_statuschanged(evt.type);
            }
        }
    };

    __pVideoPlayerPluginElement._video_eventhandler_timeupdate = function (evt) // currenttimechanged
    {
        var node = evt.target;
        var comp = node._linked_element.parent_elem.linkedcontrol;
        comp && comp._on_currenttimechanged(node.currentTime * 1000);
    };

    __pVideoPlayerPluginElement._video_eventhandler_volumechange = function (evt) //
    {
        var node = evt.target;
        var comp = node._linked_element.parent_elem.linkedcontrol;
        comp && comp._on_volumechangechanged(parseInt(node.volume * 100), node.muted);
    };

    __pVideoPlayerPluginElement._video_eventhandler_error = function (evt) // error
    {
        var node = evt.target;
        var comp = node._linked_element.parent_elem.linkedcontrol;
        if (comp)
        {
            var errormsg = "";
            var statuscode = node.error.code;
            switch (statuscode)
            {
                case 1:
                    errormsg = "fetching process aborted by user";
                    break;
                case 2:
                    errormsg = "error occurred when downloading";
                    break;
                case 3:
                    errormsg = "error occurred when decoding";
                    break;
                case 4:
                    errormsg = "video not supported";
                    break;
            }
            comp._on_error("NativeError", errormsg, statuscode);
        }
    };

    __pVideoPlayerPluginElement._video_eventhandler_canplaythrough = function (evt) // get size, get duration
    {
        var node = evt.target;
        var comp = node._linked_element.parent_elem.linkedcontrol;
        comp.size = node.videoWidth + " " + node.videoHeight;
        comp._p_duration = node.duration * 1000;
        comp._on_statuschanged("buffer");
    };

    __pVideoPlayerPluginElement._video_eventhandler_durationchange = function (evt)
    {
        var node = evt.target;
        var comp = node._linked_element.parent_elem.linkedcontrol;
        comp._on_statuschanged("transition");
    };

    __pVideoPlayerPluginElement.setElementSource = function (v)
    {
        this.source = v;
        var object_node = this._object_node;
        if (object_node)
        {
            var source_node = this._source_node;
            if (source_node)
            {
                object_node.removeChild(source_node);
            }
            var _doc = nexacro._managerFrameDoc;
            source_node = this._source_node = _doc.createElement("source");
            nexacro.__setHTMLAttr_Property(source_node, 'src', v);
            if (this.type)
            {
                nexacro.__setHTMLAttr_Property(source_node, 'type', v);
            }
            nexacro.__appendDOMNode(object_node, source_node);
        }
    };

    __pVideoPlayerPluginElement.setElementAttribute = function (attribute_name, v)
    {
        this[attribute_name] = v;
        var object_node = this._object_node;
        if (object_node)
        {
            nexacro.__setHTMLAttr_Property(object_node, attribute_name, v);
        }
    };

    __pVideoPlayerPluginElement.setElementProperty = function (property_name, v)
    {
        this[property_name] = v;
        if (this._object_node)
        {
            this._object_node[property_name] = v;
        }
    };


    __pVideoPlayerPluginElement._play = function ()
    {
        var object_node = this._object_node;
        object_node.play();
    };

    __pVideoPlayerPluginElement._pause = function ()
    {
        var object_node = this._object_node;
        object_node.pause();
    };

    __pVideoPlayerPluginElement._stop = function ()
    {
        var object_node = this._object_node;
        if (object_node.currentTime != null)
        {
            object_node.pause();
            nexacro.__setHTMLElem_Property(object_node, "currentTime", 0);
            if (this._current_event == "pause")
            {
                var comp = this.parent_elem.linkedcontrol;
                if (comp)
                {
                    comp._on_statuschanged("stop");
                }
            }
            else
            {
                this._current_event = "stop";
            }
        }
    };

    __pVideoPlayerPluginElement._setVideoMute = function (name, v)
    {
        var object_node = this._object_node;
        if (object_node)
        {
            nexacro.__setHTMLElem_Property(object_node, "muted", !object_node.muted);
        }
        return;
    };

    __pVideoPlayerPluginElement._setVideoShowControlBar = function (name, v)
    {
        if (this.showcontrolbar != v)
        {
            this.showcontrolbar = v;
            var object_node = this._object_node;
            if (object_node)
            {
                if (this.showcontrolbar)
                {
                    this._object_node.controls = true;
                }
                else
                {
                    this._object_node.controls = false;
                }
            }
        }
    };

    __pVideoPlayerPluginElement._setVideoUrl = function (name, v)
    {
        this.source = v;
        var object_node = this._object_node;
        if (object_node)
        {
            nexacro.__setHTMLElem_Property(object_node, "src", v);
        }
    };

    __pVideoPlayerPluginElement._setVideoCurrentTime = function (name, v)
    {
        if (v > -1)
        {
            var object_node = this._object_node;
            if (object_node)
            {
                var seconds = v / 1000;
                nexacro.__setHTMLElem_Property(object_node, "currentTime", seconds);
            }
        }
    };

    __pVideoPlayerPluginElement._setVideoLoop = function (name, v)
    {
        var object_node = this._object_node;
        if (object_node)
        {
            nexacro.__setHTMLElem_Property(object_node, "loop", v);
        }
    };

    __pVideoPlayerPluginElement._setVideoAutoPlay = function (name, v)
    {
        var object_node = this._object_node;
        if (object_node)
        {
            nexacro.__setHTMLElem_Property(object_node, "autoplay", v);
        }
    };

    __pVideoPlayerPluginElement._setVideoVolume = function (name, v)
    {
        var volume = v / 100;

        var object_node = this._object_node;
        if (object_node)
        {
            nexacro.__setHTMLElem_Property(object_node, "volume", volume);
        }
    };

    __pVideoPlayerPluginElement._setVideoEnable = function (name, v)
    {
        this.enable = v;
    };

    __pVideoPlayerPluginElement._setVideo360VRMode = function (name, v)
    {
    };

    __pVideoPlayerPluginElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this.handle)
        {
            var file_type;
            var source = this.source;
            if (source)
            {
                file_type = (source + "").substring(source.lastIndexOf(".") + 1).toLowerCase();
            }
            //var type = this._getType(file_type);
            var node_name = this._node_type = this._getNodeType(file_type);
            this.owner_elem = owner_elem;
            //var _doc = owner_elem._getRootWindowHandle();
            var str = "";
            str += "<" + node_name + " ";

            if (this.showcontrolbar == true)
            {
                str += "controls ";
            }
            if (this.source != null)
            {
                str += "src = '" + this.source + "'";
            }
            var type = this._getType(file_type);
            if (type != null)
            {
                str += "type = '" + type + "'";
            }
            if (this.autoplay != null)
            {
                str += "autoplay ";
            }
            if (this.volume != null)
            {
                str += "volume = '" + this.volume + "' ";
            }
            if (this.loop != null)
            {
                str += "loop = '" + this.loop + "' ";
            }

            if (nexacro._OS == "iOS") 
            {
                //RP 91084 : Prevent Full Screen VideoPlayer for iOS
                str += "playsinline = '" + true + "' ";
            }

            var handle_style = this._getCommonStyleStr();
            if (handle_style)
            {
                str += "style = '" + handle_style + "' ";
            }
            str += ">";
            str += "</" + node_name + ">";
            return str;
        }
        return "";
    };

    __pVideoPlayerPluginElement.attachHandle = function (win)
    {
        if (!this.handle)
        {
            var parent_handle = win._doc.getElementById(this.parent.name);
            var handle = this._object_node = parent_handle.firstChild;
            this.handle = handle;
            handle._linked_element = this;
            nexacro._observeSysEvent(handle, "canplaythrough", "oncanplaythrough", this._video_eventhandler_canplaythrough);
            nexacro._observeSysEvent(handle, "durationchange", "ondurationchange", this._video_eventhandler_durationchange);

            //nexacro._observeSysEvent(handle, "emptied", "onemptied", this._video_eventhandler_emptied);
            nexacro._observeSysEvent(handle, "ended", "onended", this._video_eventhandler_changedstatus);
            nexacro._observeSysEvent(handle, "error", "onerror", this._video_eventhandler_error);

            //nexacro._observeSysEvent(handle, "loadeddata", "onloadeddata", this._video_eventhandler_loadeddata);
            //nexacro._observeSysEvent(handle, "loadedmetadata", "onloadedmetadata", this._video_eventhandler_loadedmetadata);
            //nexacro._observeSysEvent(handle, "loadstart", "onloadstart", this._video_eventhandler_loadstart);

            nexacro._observeSysEvent(handle, "pause", "onpause", this._video_eventhandler_changedstatus);
            nexacro._observeSysEvent(handle, "play", "onplay", this._video_eventhandler_changedstatus);
            //nexacro._observeSysEvent(handle, "playing", "onplaying", this._video_eventhandler_playing);
            nexacro._observeSysEvent(handle, "progress", "onprogress", this._video_eventhandler_progress);
            //nexacro._observeSysEvent(handle, "ratechange", "onratechange", this._video_eventhandler_ratechange);

            //nexacro._observeSysEvent(handle, "seeked", "onseeked", this._video_eventhandler_seeked);
            //nexacro._observeSysEvent(handle, "seeking", "onseeking", this._video_eventhandler_seeking);
            //nexacro._observeSysEvent(handle, "stalled", "onstalled", this._video_eventhandler_stalled);
            //nexacro._observeSysEvent(handle, "suspend", "onsuspend", this._video_eventhandler_suspend);

            nexacro._observeSysEvent(handle, "timeupdate", "ontimeupdate", this._video_eventhandler_timeupdate);
        }
    };

    __pVideoPlayerPluginElement.destroy = function ()
    {
        nexacro.PluginElement.prototype.destroy.call();
    };

    __pVideoPlayerPluginElement.set_volume = function (v)
    {
    };


    nexacro.CanvasElement = function (parent_elem, id)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        if (id)
            this.id = id;
    };

    var _pCanvasElement = nexacro._createPrototype(nexacro.Element, nexacro.CanvasElement);
    nexacro.CanvasElement.prototype = _pCanvasElement;

    // overide nexacro.Object
    _pCanvasElement._type_name = "CanvasElement";

    _pCanvasElement.lineOffset = 0.5;
    _pCanvasElement.scale = 10;
    _pCanvasElement.scalex = 0;
    _pCanvasElement.scaley = 0;


    //xp14 attribute
    _pCanvasElement.fillStyle = "#000000";
    _pCanvasElement.strokeStyle = "#000000";
    _pCanvasElement.lineCap = "butt";
    _pCanvasElement.lineJoin = "miter";
    _pCanvasElement.lineWidth = 1;
    _pCanvasElement.miterLimit = 10;
    _pCanvasElement.shadowColor = "#000000";
    _pCanvasElement._shadowColor = "#000000";
    _pCanvasElement.shadowOffsetX = 0;
    _pCanvasElement.shadowOffsetY = 0;
    _pCanvasElement.shadowBlur = 0;

    _pCanvasElement.font = null;
    _pCanvasElement._font = null;

    _pCanvasElement.textAlign = "start";
    _pCanvasElement.textBaseline = "top";
    _pCanvasElement.globalAlpha = 1;
    _pCanvasElement.globalCompositeOperation = 1;

    _pCanvasElement._status_stack = [];
    _pCanvasElement._matrix_stack = [];
    _pCanvasElement.lineType = "solid";

    _pCanvasElement.createPattern = function (imagesource, repeat_opt, size)
    {
        var handle = this.handle;
        if (handle)
        {
            var pattern = new nexacro._CanvasFillPattern();
            pattern.repeattype = repeat_opt;
            pattern.basecanvas = this;
            if (imagesource && imagesource instanceof nexacro.CanvasElement)
            {
                var canvas = imagesource.handle._draw_ctx.canvas;
                pattern.value = nexacro.__createCanvasPattern(handle, canvas, repeat_opt);
                pattern.isloaded = true;

                var url = imagesource.handle._draw_node.toDataURL();
                if (url)
                {
                    var imgObj = new nexacro.Image();

                    if (size)
                    {
                        imgObj.width = size.width;
                        imgObj.height = size.height;
                    }
                    imgObj.src = url;
                    imgObj.handle = nexacro._getImageObject(url, pattern.onloadcallback, pattern);

                    pattern.imageobject = imgObj;
                }
            }
            else if (imagesource && imagesource instanceof nexacro.Image)
            {
                pattern.imageobject = imagesource;

                if (imagesource.handle)
                {
                    pattern.value = nexacro.__createCanvasPattern(handle, imagesource.handle, repeat_opt);
                    if (pattern.value)
                    {
                        pattern.isloaded = true;
                        return pattern;
                    }
                }

                if (size)
                {
                    pattern.imageobject.width = size.width;
                    pattern.imageobject.height = size.height;
                }
                if (imagesource.src)
                {
                    imagesource.handle = nexacro._getImageObject(imagesource.src, pattern.onloadcallback, pattern);
                }
                else
                {
                    pattern.isloaded = false;
                }
            }
            return pattern;
        }

        return null;
    };

    _pCanvasElement.createLinearGradient = function (aX0, aY0, aX1, aY1)
    {
        var handle = this.handle;
        if (handle)
        {
            return nexacro.__createCanvasLinearGradient(handle, aX0, aY0, aX1, aY1);
        }
        return null;
    };

    _pCanvasElement.createRadialGradient = function (aX0, aY0, aR0, aX1, aY1, aR1)
    {
        var handle = this.handle;
        if (handle)
        {
            return nexacro.__createCanvasRadialGradient(handle, aX0, aY0, aR0, aX1, aY1, aR1);
        }
        return null;
    };

    _pCanvasElement.setElementFillStyle = function (fillstyle)
    {
        var handle = this.handle;
        if (handle && fillstyle)
        {
            this.fillStyle = fillstyle;
            if (fillstyle instanceof nexacro._ColorObject)
                nexacro.__setCanvasFillColor(handle, fillstyle);
            else if (fillstyle instanceof nexacro._CanvasFillPattern)
            {
                nexacro.__setCanvasFillPattern(handle, fillstyle);
            }
            else
                nexacro.__setCanvasFillGradation(handle, fillstyle);
        }
    };

    _pCanvasElement.setElementFont = function (font)
    {
        var handle = this.handle;
        if (!font || !handle) return;

        var sysvalue = font.value;
        if (!this.font || this.font.value != sysvalue)
        {
            this.font = font;
            this._font = sysvalue;
            nexacro.__setCanvasFont(handle, font, sysvalue);
        }
        else
        {
            nexacro.__setCanvasFont(handle, font, sysvalue);
        }
    };

    _pCanvasElement.clearRect = function (x, y, dx, dy)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasClearRect(handle, x, y, dx, dy);
        }
    };

    _pCanvasElement.setElementPosition = function (left, top)
    {
        if (this.left != left || this.top != top)
        {
            this.left = left;
            this.top = top;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setCanvasNodeStylePos(handle._draw_node.style, left, top);
            }
        }
    };

    _pCanvasElement.setElementGlobalAlpha = function (alpha)
    {
        var handle = this.handle;
        if (handle && alpha >= 0)
        {
            this.globalAlpha = alpha;
            nexacro.__setCanvasGlobalAlpha(handle, alpha);
        }
    };

    _pCanvasElement.setElementGlobalCompositeOperation = function (strOperation)
    {
        var handle = this.handle;
        if (handle && strOperation)
        {
            this.globalCompositeOperation = strOperation;
            nexacro.__setCanvasGlobalCompositeOperation(handle, strOperation);
        }
    };

    _pCanvasElement.setElementLineCap = function (linecap)
    {
        var handle = this.handle;
        if (handle)
        {
            this.lineCap = linecap;
            nexacro.__setCanvasLineCap(handle, linecap);
        }
    };

    _pCanvasElement.setElementLineJoin = function (linejoin)
    {
        var handle = this.handle;
        if (handle)
        {
            this.lineJoin = linejoin;
            nexacro.__setCanvasLineJoin(handle, linejoin);
        }
    };

    _pCanvasElement.setElementLineWidth = function (width)
    {
        var handle = this.handle;
        if (handle && isFinite(width))
        {
            this.lineWidth = width;
            this.lineOffset = width / 2;
            nexacro.__setCanvasLineWidth(handle, width);
        }
    };
    _pCanvasElement.setElementLineStyle = function (linetype)
    {
        var handle = this.handle;
        if (handle)
        {
            this.lineType = linetype;
            nexacro.__setCanvasLineStyle(handle, linetype);
        }
    };
    _pCanvasElement.setElementStrokeStyle = function (strokestyle)
    {
        var handle = this.handle;
        if (handle && strokestyle)
        {
            this.strokeStyle = strokestyle;
            nexacro.__setCanvasStrokeStyle(handle, strokestyle);
        }
    };

    _pCanvasElement.setElementMiterLimit = function (limit)
    {
        var handle = this.handle;
        if (handle && limit)
        {
            this.miterLimit = limit;
            nexacro.__setCanvasMiterLimit(handle, limit);
        }
    };

    _pCanvasElement.setElementShadowBlur = function (blur)
    {
        var handle = this.handle;
        if (handle)
        {
            this.shadowBlur = blur;
            nexacro.__setCanvasShadowBlur(handle, blur);
        }
    };

    _pCanvasElement.setElementShadowColor = function (color)
    {
        var handle = this.handle;
        if (color && handle)
        {
            this.shadowColor = color;
            handle._shadowColor = nexacro._getWebColorFromXreColor(color.value);
            nexacro.__setCanvasShadowColor(handle, handle._shadowColor);
        }
    };

    _pCanvasElement.setElementShadowOffsetX = function (offsetx)
    {
        var handle = this.handle;
        if (handle)
        {
            this.shadowOffsetX = offsetx;
            nexacro.__setCanvasShadowOffsetX(handle, offsetx);
        }
    };

    _pCanvasElement.setElementShadowOffsetY = function (offsety)
    {
        var handle = this.handle;
        if (handle)
        {
            this.shadowOffsetY = offsety;
            nexacro.__setCanvasShadowOffsetY(handle, offsety);
        }
    };

    _pCanvasElement.setElementTextAlign = function (align)
    {
        var handle = this.handle;
        if (handle)
        {
            this.textAlign = align;
            nexacro.__setCanvasTextAlign(handle, align);
        }
    };

    _pCanvasElement.setElementTextBaseline = function (value)
    {
        var handle = this.handle;
        if (handle)
        {
            this.textBaseline = value;
            nexacro.__setCanvasTextBaseline(handle, value);
        }
    };

    _pCanvasElement.arc = function (x, y, r, start_rad, end_rad, counterclockwise)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__darwCanvasArc(handle, x, y, r, start_rad, end_rad, counterclockwise);
        }
    };

    _pCanvasElement.arc2 = function (x, y, r, start_deg, end_deg, counterclockwise)
    {
        var start_rad = nexacro._degreesToRadians(start_deg);
        var end_rad = nexacro._degreesToRadians(end_deg);
        var handle = this.handle;
        if (handle)
        {
            nexacro.__darwCanvasArc(handle, x, y, r, start_rad, end_rad, counterclockwise);
        }
    };

    _pCanvasElement.arcTo = function (x, y, x2, y2, r)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasArcTo(handle, x, y, x2, y2, r);
        }
    };

    _pCanvasElement.beginPath = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasBeginPath(handle);
        }
    };

    _pCanvasElement.bezierCurveTo = function (p1x, p1y, p2x, p2y, x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasBezierCurveTo(handle, p1x, p1y, p2x, p2y, x, y);
        }
    };

    _pCanvasElement.clip = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__clipCanvas(handle);
        }
    };

    _pCanvasElement.closePath = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasClosePath(handle);
        }
    };

    _pCanvasElement.drawImage = function (objimage, x, y, imgWidth, imgHeight)
    {
        var handle = this.handle;
        var img = objimage.handle;
        if (img && handle)
        {
            nexacro.__drawCanvasImage(handle, img, x, y, imgWidth, imgHeight);
        }
    };

    _pCanvasElement.fill = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__fillCanvas(handle);
        }
    };

    _pCanvasElement.fillRect = function (x, y, dx, dy)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__fillCanvasRect(handle, x, y, dx, dy);
        }
    };

    _pCanvasElement.fillText = function (text, x, y, maxWidth)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setCanvasTextBaseline(handle, this.textBaseline);
            nexacro.__drawCanvasFillText(handle, text, x, y, maxWidth);
        }
    };

    _pCanvasElement.isPointInPath = function (x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            return nexacro.__isPointInCanvasPath(handle, x, y);
        }
        return false;
    };

    _pCanvasElement.lineTo = function (x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvaslineTo(handle, x, y);
        }
    };

    _pCanvasElement.moveTo = function (x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasmoveTo(handle, x, y);
        }
    };


    _pCanvasElement.quadraticCurveTo = function (px, py, x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasQuadraticCurveTo(handle, px, py, x, y);
        }
    };

    _pCanvasElement.rect = function (x, y, w, h)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__rectCanvas(handle, x, y, w, h);
        }
    };

    _pCanvasElement.rotate = function (angle_rad)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__rotateCanvas(handle, angle_rad);
        }
    };

    _pCanvasElement.rotate2 = function (angle)
    {
        var radians = nexacro._degreesToRadians(angle);
        this.rotate(radians);
    };

    _pCanvasElement.scale = function (dx, dy)
    {
        var handle = this.handle;
        this.scalex = dx;
        this.scaley = dy;
        if (handle)
        {
            nexacro.__scaleCanvas(handle, dx, dy);
        }
    };

    _pCanvasElement.setTransform = function (a, b, c, d, e, f)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setCanvasTransform(handle, a, b, c, d, e, f);
        }
    };

    _pCanvasElement.stroke = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__strokeCanvas(handle);
        }
    };

    _pCanvasElement.strokeRect = function (x, y, width, height)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasStrokeRect(handle, x, y, width, height);
        }
    };

    _pCanvasElement.strokeText = function (text, x, y, maxWidth)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__drawCanvasStrokeText(handle, text, x, y, maxWidth);
        }
    };

    _pCanvasElement.transform = function (a, b, c, d, e, f)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__transformCanvas(handle, a, b, c, d, e, f);
        }
    };

    _pCanvasElement.translate = function (x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__translateCanvas(handle, x, y);
        }
    };

    _pCanvasElement.save = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__saveCanvas(handle);
        }
    };

    _pCanvasElement.toDataURL = function (imgType, ImgOption)
    {
        var handle = this.handle;
        try
        {
            if (handle)
            {
                return nexacro.__toDataURLCanvas(handle, imgType, ImgOption);
            }
        }
        catch (e)
        {
            try
            {
                if (handle)
                {
                    return nexacro.__toDataURLCanvas(handle, imgType, ImgOption);
                }
            }
            catch (e)
            {
                return "";
            }
        }
    };


    _pCanvasElement.restore = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__restoreCanvas(handle);
        }
    };

    //arc2 와 동일
    //_pCanvasElement.drawArc = function (x, y, r, start_deg, end_deg, bClockwise, bNormal)
    //{
    //    if (!bNormal)
    //    {
    //        start_deg = start_deg * (Math.PI / 180);
    //        end_deg = end_deg * (Math.PI / 180);
    //    }
    //    this.arc(x, y, r, start_deg, end_deg, bClockwise);
    //};

    _pCanvasElement.drawFill = function ()
    {
        this.fill();
        this.beginPath();
    };

    _pCanvasElement._setPenStyle = function (pen)
    {
        if (pen) // && pen._isValid())
        {
            this.setElementStrokeStyle(pen.color);
            this.setElementLineWidth(parseInt(pen.width));
        }
    };

    _pCanvasElement.drawStrokeLine = function (x1, y1, x2, y2)
    {
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeVLine = function (x, y1, y2)
    {
        this.moveTo(x, y1);
        this.lineTo(x, y2);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeHLine = function (y, x1, x2)
    {
        this.moveTo(x1, y);
        this.lineTo(x2, y);
        this.drawStroke();
    };

    _pCanvasElement.drawFillArc = function (x, y, r, start_rad, end_rad, bClockwise)
    {
        this.drawArc(x, y, r, start_rad, end_rad, bClockwise, true);
        this.closePath();
        this.fill();
        this.beginPath();
    };

    _pCanvasElement.drawFillArc2 = function (x, y, r, start_deg, end_deg, bClockwise)
    {
        var start_rad = nexacro._degreesToRadians(start_deg);
        var end_rad = nexacro._degreesToRadians(end_deg);
        this.arc(x, y, r, start_rad, end_rad, bClockwise);
        this.closePath();
        this.fill();
        this.beginPath();
    };

    // this is only for stroke
    /* not use
    _pCanvasElement.halfRect = function (x, y, w, h)
    {
        var gap = this.lineWidth;
        var gap2 = (h > 0) ? gap : -gap;
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.lineTo(x + w - gap, y);
        this.lineTo(x + w - gap, y + h - gap2);
        this.lineTo(x + gap, y + h - gap2);
        this.lineTo(x + gap, y);
        this.closePath();
    };


    _pCanvasElement.drawStrokeHalfRect = function (x, y, w, h)
    {
        this.halfRect(x, y, w, h);
        this.drawStroke();
    };
    */

    _pCanvasElement.drawStrokeRect = function (x, y, w, h)
    {
        this.rect(x, y, w, h, true);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeArc = function (x, y, r, start_rad, end_rad, bClockwise)
    {
        this.arc(x, y, r, start_rad, end_rad, bClockwise);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeArc2 = function (x, y, r, start_deg, end_deg, bClockwise)
    {
        this.arc2(x, y, r, start_deg, end_deg, bClockwise);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeInsetRect = function (x, y, w, h)
    {
        this.insetRect(x, y, w, h);
        this.drawStroke();
    };

    _pCanvasElement.hline = function (y, x1, x2)
    {
        this.moveTo(x1, y);
        this.lineTo(x2, y);
    };

    _pCanvasElement.vline = function (x, y1, y2)
    {
        this.moveTo(x, y1);
        this.lineTo(x, y2);
    };

    _pCanvasElement._getElementScreenXY = function ()
    {
        var handle = this.handle;
        var _doc = handle.ownerDocument || handle.document;
        return nexacro.__getHTMLNodePositionInFrame(_doc, handle);
    };

    _pCanvasElement.create = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle)
        {
            var handle = this.handle;
            if (!handle)
            {
                this.owner_elem = owner_elem;
                var _doc = owner_elem._getRootWindowHandle();
                handle = _doc.createElement("div");
                handle._linked_element = this;

                nexacro.__setDOMNode_ClassName(handle, this._getElementNexaClassName("nexacontainer"));
                // append TO Parent Element
                handle.id = nexacro._filterIDRootNodeClassName(owner_elem.name) + ":container";
                this.handle = this.dest_handle = handle;
                var _draw_node = _doc.createElement("canvas");
                handle._draw_node = _draw_node;
                handle._draw_ctx = _draw_node.getContext("2d");
                var node_style = _draw_node.style;
                node_style.border = "none";

                nexacro.__setDOMStyle_AbsoluteTransparent(node_style);
                nexacro.__setDOMStyle_Pos(node_style, this.left, this.top);
                nexacro.__setCanvasNodeSize(_draw_node, this.width, this.height);
                nexacro.__setCanvasTextAlign(handle, this.textAlign);
                nexacro.__setCanvasTextBaseline(handle, this.textBaseline);

                nexacro.__appendDOMNode(handle, _draw_node);

                nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
            }
        }
    };

    _pCanvasElement.createCommand = function ()
    {
        return "";
    };

    _pCanvasElement.destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            handle._linked_element = null;

            var _owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
            if (this.owner_elem && this.owner_elem.dest_handle)
                _owner_handle = this.owner_elem.dest_handle;

            if (!this.owner_elem || _owner_handle)
                nexacro.__removeDOMNode(_owner_handle, handle);

            this.owner_elem = null;
            this.handle = this.dest_handle = null;

            handle._draw_node = null;
            handle._draw_ctx = null;
        }
        this._p_parent = null;
        this.parent_elem = null;
    };

    _pCanvasElement._drawRotate = function (angle_deg)
    {
        var handle = this.handle;
        if (!handle) return;

        var angle_rad = angle_deg * Math.PI / 180;
        this.handle._draw_ctx.rotate(angle_rad);
    };

    _pCanvasElement.circle = function (x, y, r)
    {
        this.arc(x, y, r, 0, 2 * Math.PI, true);
    };

    _pCanvasElement.drawStrokeCircle = function (x, y, r)
    {
        this.arc(x, y, r, 0, 2 * Math.PI, true);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeInsetArc = function (x, y, r, start_deg, end_deg)
    {
        var gap = this.lineWidth / 2;
        this.drawArc(x, y, r - gap, start_deg, end_deg);
        this.drawStroke();
    };

    _pCanvasElement.drawStrokeInsetCircle = function (x, y, r)
    {
        var gap = this.lineOffset;
        this.arc(x, y, r - gap, 0, 2 * Math.PI, true);
        this.drawStroke();
    };

    _pCanvasElement.drawFillRect = function (x, y, dx, dy)
    {
        this.rect(x, y, dx, dy);
        this.fill();
        this.beginPath();
    };

    _pCanvasElement.endDraw = function ()
    {
        this.beginPath();
        this.closePath();
    };

    _pCanvasElement.drawStroke = function ()
    {
        this.stroke();
        this.beginPath();
    };

    _pCanvasElement.drawFillCircle = function (x, y, r)
    {
        this.arc(x, y, r, 0, 2 * Math.PI, true);
        this.fill();
        this.beginPath();
    };

    // this is only for stroke
    _pCanvasElement.insetRect = function (x, y, w, h)
    {
        if (w == 0 || h == 0) return;
        var gap = this.lineOffset;
        var wgap = (w > 0) ? gap : -gap;
        var hgap = (h > 0) ? gap : -gap;
        this.moveTo(x + wgap, y + hgap);
        this.lineTo(x + wgap, y + h - hgap);
        this.lineTo(x + w - wgap, y + h - hgap);
        this.lineTo(x + w - wgap, y + hgap);
        this.closePath();
    };

    //##### internal function #####
    _pCanvasElement._setLineStyle = function (line)
    {
        if (line) // && line._isValid())
        {
            this.setElementStrokeStyle(line.color);
            this.setElementLineWidth(parseInt(line.width));
        }
    };

    _pCanvasElement._moveCanvas = function (left, top, width, height)
    {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        if (this.handle)
        {
            var _draw_node = this.handle._draw_node;
            if (_draw_node)
            {
                _draw_node.width = this.width;
                _draw_node.height = this.height;
                var nodeStyle = _draw_node.style;
                nodeStyle.left = this.left + "px";
                nodeStyle.top = this.top + "px";
                nodeStyle.width = this.width + "px";
                nodeStyle.height = this.height + "px";
            }
        }
    };

    _pCanvasElement.measureText = function (text, font)
    {
        var handle = this.handle;
        if (handle)
        {
            if (!font)
            {
                font = nexacro.FontObject(handle._draw_ctx.font);
            }
            var obj = nexacro._getTextSize(text, font);
            return { width: obj[0], height: obj[1] };
        }
    };

    _pCanvasElement.setElementSize = function (width, height)
    {
        if (this.width != width || this.height != height)
        {
            this.width = width;
            this.height = height;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setCanvasNodeSize(handle._draw_node, width, height);
            }
        }
    };

    _pCanvasElement.drawFillText = function (text, x, y, maxwidth)
    {
        this.setElementTextBaseline(this.textBaseline);
        this.fillText(text, x, y, maxwidth);
        this.beginPath();
    };

    nexacro._CanvasFillPattern = function ()
    {
        this.imageobject = null;
        this.repeattype = null;
        this.value = null;
        this.isloaded = false;
        this.control = null;
        this.basecanvas = null;
        this.controlonloadcallback = null;
    };
    var __pCanvasFillPattern = nexacro._CanvasFillPattern.prototype;

    __pCanvasFillPattern.onloadcallback = function (imageurl, width, height, handle, errstatus, temp, fireerrorcode, returncode, path, locationuri)
    {
        this.imageobject.width = width;
        this.imageobject.height = height;
        this.isloaded = true;

        if (errstatus < 0)
        {
            this.isloaded = false;
        }
        else
        {
            if (handle)
            {
                this.imageobject.handle = handle;
            }
            if (!this.value)
            {
                // html5 only
                this.value = nexacro.__createCanvasPattern(this.basecanvas.handle, this.imageobject.handle, this.repeattype);

            }
        }
        if (this.control && this.controlonloadcallback)
        {
            this.control.call(this.controlonloadcallback, this);
        }
    };

    __pCanvasFillPattern.clear = function ()
    {

        if (this.imageobject)
            delete this.imageobject;
        this.imageobject = null;
        this.repeattype = null;
        this.value = null;
        this.isloaded = null;
        this.control = null;
        this.controlonloadcallback = null;

    };
    nexacro._CanvasGradient = function (type)
    {
        this.type = type;
        this.x0 = 0;
        this.y0 = 0;
        this.r0 = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.r1 = 0;
        this.colors = [];
    };

    var __pCanvasGradient = nexacro._CanvasGradient.prototype;

    __pCanvasGradient.addColorStop = function (aOffset, aColor)
    {
        var color = nexacro._getWebColorFromXreColor(aColor);
        var alpha = nexacro._getXreColorAlpha(aColor) / 255;
        this.colors.push({ offset: aOffset, color: color, alpha: alpha });
    };


    //======================================================================
    // nexacro.GridScrollableControlElement - this Element is scrollable ControlElement
    //======================================================================
    // this GridScrollableControlElement has ScrollControlElement
    nexacro.GridScrollableControlElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

        // set container Element
        this._target_vscroll_elements = null;
        this._target_hscroll_elements = null;
        var client_elem = new nexacro._ContainerElement(this, false);
        this._client_elem = client_elem;
    };
    var _pGridScrollableControlElement = nexacro._createPrototype(nexacro.ScrollableControlElement, nexacro.GridScrollableControlElement);
    nexacro.GridScrollableControlElement.prototype = _pGridScrollableControlElement;
    // overide nexacro.Object
    _pGridScrollableControlElement._type_name = "GridScrollableControlElement";

    //==== defaule values =========//
    //_pGridScrollableControlElement.scroll_left = 0;
    //_pGridScrollableControlElement.scroll_top = 0;
    //_pGridScrollableControlElement.container_maxwidth = 0;
    //_pGridScrollableControlElement.container_maxheight = 0;
    //_pGridScrollableControlElement._hscroll_visible = false;
    //_pGridScrollableControlElement._vscroll_visible = false;
    //_pGridScrollableControlElement._hscroll_height = 0;
    //_pGridScrollableControlElement._vscroll_width = 0;
    //_pGridScrollableControlElement._hscroll_left = 0;
    //_pGridScrollableControlElement._hscroll_top = 0;
    //_pGridScrollableControlElement._hscroll_width = 0;
    //_pGridScrollableControlElement._vscroll_left = 0;
    //_pGridScrollableControlElement._vscroll_top = 0;
    //_pGridScrollableControlElement._vscroll_height = 0;
    //_pGridScrollableControlElement.hscroll_limit = 0;
    //_pGridScrollableControlElement.vscroll_limit = 0;
    //_pGridScrollableControlElement._scroll_showtype = -1; // 0 : auto, 1 : fix, 2 : overlap
    //_pGridScrollableControlElement._scrollview_width_top = 0;
    ////==== internal handles =========//
    //_pGridScrollableControlElement._hscroll_control = null;
    //_pGridScrollableControlElement._vscroll_control = null;
    //_pGridScrollableControlElement._resizebutton_element = null;
    ////==== default flags =========//
    //_pGridScrollableControlElement._scroll_overlap = false;
    //==== end of initial =========//

    //_pGridScrollableControlElement.create = function (win)
    //{
    //	// parent is always control element
    //	var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
    //	if (owner_elem && owner_elem.handle)
    //	{
    //		if (!this.handle)
    //		{
    //			this.owner_elem = owner_elem;
    //	        var _doc = win._doc || owner_elem._getRootWindowHandle();
    //			var handle = _doc.createElement("div");
    //			handle.id = this.name;
    //			handle._linked_element = this;

    //			// append TO Parent Element
    //			this.handle = this.dest_handle = handle;
    //			nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

    //			var handle_style = handle.style;
    //			nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top);
    //			nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

    //		    // render & create Background SubElements
    //			this._refreshControl(handle, handle_style, _doc);

    //			nexacro.__appendDOMNode(owner_elem.dest_handle, handle);
    //		}

    //		//container element create
    //		// no need set props for child --> only create it
    //		// props are already setted to child_elem
    //		if (this.handle && !this._client_elem.handle)
    //		{
    //			this._client_elem.create(win);
    //		}
    //	}
    //};

    _pGridScrollableControlElement._on_attachHandle = function (win)
    {
        if (this._hscroll_control)
            this._hscroll_control.attachHandle(win);
        if (this._vscroll_control)
            this._vscroll_control.attachHandle(win);

        nexacro._observeSysEvent(this._client_elem.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
        nexacro._observeSysEvent(this.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
    };

    _pGridScrollableControlElement.destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            this._removeElementHandle();
            this.dest_handle = null;

            // destroy Background SubElements
            if (this._edge_elem)
            {
                this._edge_elem.destroy();
                this._edge_elem = null;
            }

            // destroy client element
            if (this._client_elem)
            {
                nexacro._stopSysObserving(this._client_elem.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
                this._client_elem.destroy();
                this._client_elem = null;
            }

            this._on_destroy();
        }
        this.owner_elem = null;
        this.handle = null;
        this._p_parent = null;
        this.parent_elem = null;
        this.linkedcontrol = null;
    };

    _pGridScrollableControlElement._on_destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro._stopSysObserving(handle, "scroll", "onscroll", this._syshandler_onscroll_forward);

            var i, n;
            // scrollablecontainer_element destroyed by control_element
            if (this._target_vscroll_elements)
            {
                if (nexacro._isArray(this._target_vscroll_elements))
                {
                    for (i = 0, n = this._target_vscroll_elements.length; i < n; i++)
                        this._target_vscroll_elements[i] = null;
                }

                this._target_vscroll_elements = null;
            }

            if (this._target_hscroll_elements)
            {
                if (nexacro._isArray(this._target_hscroll_elements))
                {
                    for (i = 0, n = this._target_hscroll_elements.length; i < n; i++)
                        this._target_hscroll_elements[i] = null;
                }

                this._target_hscroll_elements = null;
            }

            // sctollbar control destroyed by component
            this._hscroll_control = null;
            this._vscroll_control = null;
        }
    };

    _pGridScrollableControlElement.clearContents = function ()
    {
        if (this.handle)
        {
            nexacro._stopSysObserving(this._client_elem.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            nexacro._stopSysObserving(this.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            // destroy handle of client element : keep parent relation
            this._client_elem.clearContents();
        }
    };

    _pGridScrollableControlElement._syshandler_onscroll_forward = function (evt)
    {
        if (window.event) evt = window.event;
        var target = evt.srcElement || evt.target;
        target.scrollLeft = 0;
        target.scrollTop = 0;
    };

    _pGridScrollableControlElement.getContainerElement = function (position_step)
    {
        return this._client_elem;
    };

    // vscroll_element : 1
    _pGridScrollableControlElement.setVertScrollElements = function (elems)
    {
        this._target_vscroll_elements = elems;
    };

    // hscroll_element : n
    _pGridScrollableControlElement.setHorzScrollElements = function (elems)
    {
        this._target_hscroll_elements = elems;
    };

    _pGridScrollableControlElement._setContainerVScrollPos = function (pos)
    {
        var vert_elems = this._target_vscroll_elements;
        if (vert_elems)
        {
            /*if (nexacro._isArray(vert_elems)) // pivot
            {
                var elem;
                for (var i = 0, n = vert_elems.length; i < n ; i++)
                {
                    elem = vert_elems[i];
                    elem.setElementVScrollPos(pos);
                }
            }
            else*/

            //{
            vert_elems.setElementVScrollPos(pos);
            //}
        }
    };

    _pGridScrollableControlElement._setContainerHScrollPos = function (pos)
    {
        var horz_elems = this._target_hscroll_elements;
        if (horz_elems)
        {
            if (nexacro._isArray(horz_elems))
            {
                var elem;
                for (var i = 0, n = horz_elems.length; i < n; i++)
                {
                    elem = horz_elems[i];
                    elem.setElementHScrollPos(pos);
                }
            }
            else
            {
                horz_elems.setElementHScrollPos(pos);
            }
        }
    };

    _pGridScrollableControlElement._setContainerMaxHeight = function (height)
    {
        var vert_elems = this._target_vscroll_elements;
        if (vert_elems)
        {
            this.container_maxheight = height;
            if (nexacro._isArray(vert_elems))
            {
                var elem;
                for (var i = 0, n = vert_elems.length; i < n; i++)
                {
                    elem = vert_elems[i];
                    elem._setContainerMaxHeight(height);
                }
            }
            else
            {
                vert_elems._setContainerMaxHeight(height);
            }
        }
    };

    _pGridScrollableControlElement._setContainerMaxWidth = function (width)
    {
        var horz_elems = this._target_hscroll_elements;
        if (horz_elems)
        {
            this.container_maxwidth = width;
            if (nexacro._isArray(horz_elems))
            {
                var elem;
                for (var i = 0, n = horz_elems.length; i < n; i++)
                {
                    elem = horz_elems[i];
                    elem._setContainerMaxWidth(width);
                }
            }
            else
            {
                horz_elems._setContainerMaxWidth(width);
            }
        }
    };

    _pGridScrollableControlElement._on_updateClientRect = function ()
    {
        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;
        var step_containers = this._step_containers;

        if (this._apply_client_padding)
        {
            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }
        }

        if (this._attach_client_top > 0)
        {
            client_top += this._attach_client_top;
            client_height -= this._attach_client_top;

            if (client_height < 0)
                client_height = 0;
        }

        // recalc scroll_left/scroll_top
        var client_elem = this._client_elem;
        if (!client_elem || (client_width == 0 && this.client_width == 0) || (client_height == 0 && this.client_height == 0))
            return 0;

        var v_elements = this._target_vscroll_elements, v_element = v_elements, h_elements = this._target_hscroll_elements, h_element = h_elements;
        if (nexacro._isArray(v_elements)) v_element = v_elements[0];
        if (nexacro._isArray(h_elements)) h_element = h_elements[0];

        // .inner_width : scrollsize가 포함 안된 clientsize.
        // .client_width : scrollsize가 포함 됨.

        var zoomfactor = this.zoom / 100;
        var zclient_width = this._zclient_width = client_width / zoomfactor;
        var zclient_height = this._zclient_height = client_height / zoomfactor;
        var zclient_width_body = ((h_element) ? h_element._calculateClientWidth(client_width) : client_width) / zoomfactor;
        var zclient_height_body = ((v_element) ? v_element._calculateClientHeight(client_height - this.client_height) : client_height) / zoomfactor;
        var container_maxwidth = (h_element) ? h_element._getContainerMaxWidth() : 0;
        var container_maxheight = (v_element) ? v_element._getContainerMaxHeight() : 0;

        var scroll_left = this.scroll_left;
        var scroll_top = this.scroll_top;
        /*
        if (zoomfactor != 1)
        {
            zclient_width = zclient_width;
            zclient_height = zclient_height;
            zclient_width_body = zclient_width_body;
            zclient_height_body = zclient_height_body;
            container_maxwidth = container_maxwidth;
            container_maxheight = container_maxwidth;
        }
        */
        var step_count = this._step_count;
        //var step_index = this._step_index;
        var pre_step_count = this._pre_step_count;
        var is_change_step_cnt = false;
        is_change_step_cnt = step_count != pre_step_count;
        if ((step_count > 0 && step_containers) || is_change_step_cnt)
        {
            container_maxwidth = step_count * zclient_width_body;
        }

        //var reset_vlimit = false;
        //var reset_hlimit = false;

        //var hscroll_visible = false;
        //var vscroll_visible = false;

        var hscroll_limit = 0;
        var vscroll_limit = 0;

        var hscrollbartype = this._hscrollbartype;
        var vscrollbartype = this._vscrollbartype;

        if ((step_count > 0 && step_containers) || is_change_step_cnt)
        {
            hscrollbartype = "none";
        }

        if (zclient_width_body >= 0 && container_maxwidth > zclient_width_body)
        {
            hscroll_limit = container_maxwidth - zclient_width_body;

            if (hscrollbartype != "none" && hscrollbartype != "autoindicator")
            {
                client_height -= this._hscroll_size;
                zclient_height = client_height / zoomfactor;
                zclient_height_body -= this._hscroll_size / zoomfactor;
            }
        }
        else
        {
            if (hscrollbartype == "fixed")
            {
                client_height -= this._hscroll_size;
                zclient_height = client_height / zoomfactor;
                zclient_height_body -= this._hscroll_size / zoomfactor;
            }

            //hscroll_limit = 0;
        }

        if (zclient_height_body < 0)
            zclient_height_body = 0;

        if (zclient_height_body >= 0 && container_maxheight > zclient_height_body)
        {
            vscroll_limit = container_maxheight - zclient_height_body;

            if (vscrollbartype != "none" && vscrollbartype != "autoindicator")
            {
                client_width -= this._vscroll_size;
                zclient_width = client_width / zoomfactor;
                zclient_width_body -= this._vscroll_size / zoomfactor;
            }

            if (zclient_width_body >= 0 && container_maxwidth > zclient_width_body)
            {
                if (hscrollbartype != "none" && hscrollbartype != "autoindicator" && hscroll_limit == 0)
                {
                    client_height -= this._hscroll_size;
                    zclient_height = client_height / zoomfactor;
                    //zclient_height_body -= this._hscroll_size / zoomfactor;
                    vscroll_limit += this._hscroll_size;
                }
                hscroll_limit = container_maxwidth - zclient_width_body;
            }
        }
        else
        {
            if (vscrollbartype == "fixed")
            {
                client_width -= this._vscroll_size;
                zclient_width = client_width / zoomfactor;
                zclient_width_body -= this._vscroll_size / zoomfactor;

                if (zclient_width_body >= 0 && container_maxwidth > zclient_width_body)
                {
                    hscroll_limit = container_maxwidth - zclient_width_body;
                }
            }

            //vscroll_limit = 0;
        }

        if ((step_count > 0 && step_containers) || is_change_step_cnt)
        {
            container_maxwidth = step_count * zclient_width_body;

            if (zclient_width_body >= 0 && container_maxwidth > zclient_width_body)
            {
                hscroll_limit = container_maxwidth - zclient_width_body;
            }
        }

        if (this.hscroll_limit != hscroll_limit)
        {
            //reset_hlimit = true;
            this.hscroll_limit = hscroll_limit;

            if (scroll_left > hscroll_limit)
            {
                this.setElementHScrollPos(hscroll_limit);
            }
        }

        if (this.vscroll_limit != vscroll_limit)
        {
            //reset_vlimit = true;
            this.vscroll_limit = vscroll_limit;

            if (scroll_top > vscroll_limit)
            {
                this.setElementVScrollPos(vscroll_limit);
            }
        }

        this._zclient_width = zclient_width;
        this._zclient_height = zclient_height;

        var ret = 0;
        if (this.client_left != client_left || this.client_top != client_top)
        {
            this.client_left = client_left;
            this.client_top = client_top;
            ret = 1;
        }
        else if (step_count > 0)
            ret = 1;

        //여러 case에 대해 테스트 필요!
        if (this.client_width != client_width || this.client_height != client_height)
        {
            this.client_width = client_width;
            this.client_height = client_height;
            ret += 2;
        }
        else if (this.client_width != zclient_width || this.client_height != zclient_height)
        {
            ret += 2;
        }

        return ret;
    };

    //////////////////////////////////////////////////////////////////////////
    // scrollable control not apply padding to client_elem
    //////////////////////////////////////////////////////////////////////////
    //_pGridScrollableControlElement.appendChildElement = function (child_elem)
    //{
    //	// this child element is client element
    //	if (this.handle)
    //	{
    //		if (child_elem.parent_elem != this)
    //		{
    //			if (child_elem.handle)
    //			{
    //				var old_doc = child.elem._getRootWindowHandle();
    //				var new_doc = this._client_elem._getRootWindowHandle();
    //				if (old_doc != new_doc)
    //				{
    //					child_elem.parent_elem = this;
    //					// for recreate Child Element Handle
    //					child_elem._removeFromContainer();
    //				}
    //				else
    //				{
    //					child_elem.parent_elem = this;
    //				}
    //			}
    //			else
    //			{
    //				child_elem.parent_elem = this;
    //			}
    //		}

    //		// if child element is not created ==> create child handle
    //		if (!child_elem.handle)
    //		{
    //			child_elem.create();
    //		}
    //		else
    //		{
    //			child_elem._appendToContainer(this._client_elem);
    //		}
    //	}
    //};


    //////////////////////////////////////////////////////////////////////////
    // for scrollbar
    _pGridScrollableControlElement.setElementHScrollPos = function (hpos)
    {
        if (this.parent._p_enableredraw == false)
        {
            this.parent._enable_redraw_history.scroll = true;
            return;
        }

        var h_element = this._target_hscroll_elements;

        if (h_element)
        {
            if (nexacro._isArray(h_element))
            {
                h_element = h_element[0];
            }
            if (hpos < 0) hpos = 0;
            if (hpos > this.hscroll_limit)
            {
                hpos = this.hscroll_limit;
            }
            var scrollLeft = h_element.scroll_left;
            if (scrollLeft != hpos || this._reset_scrollpos)
            {
                this.scroll_left = hpos;
                this.linkedcontrol._scroll_left = hpos;
                this._setContainerHScrollPos(hpos);
            }

            // Android Translate사용시 scrollbar trackbar이용시 trackbar draw가 안되는 경우가 있어 분기.
            if (!this._use_translate_scroll && this.parent._procRefreshDOM == true)
            {
                var areacontents;
                if (nexacro._isArray(h_element))
                    areacontents = h_element[0]._client_body_element;
                else
                    areacontents = h_element._client_body_element;

                if (areacontents)
                {
                    //	                areacontents._refreshDOM(); 필요시 다시 구현
                }
            }
        }
    };

    _pGridScrollableControlElement.setElementVScrollPos = function (vpos)
    {
        if (this.parent._p_enableredraw == false)
        {
            this.parent._enable_redraw_history.scroll = true;
            return;
        }

        var v_element = this._target_vscroll_elements;

        if (v_element)
        {
            if (nexacro._isArray(v_element))
            {
                v_element = v_element[0];
            }
            if (vpos < 0) vpos = 0;
            if (vpos > this.vscroll_limit)
            {
                vpos = this.vscroll_limit;
            }
            var scrollTop = v_element._getScrollTop();
            this.scroll_top = vpos;

            if (scrollTop != vpos || this._reset_scrollpos)
            {
                this.linkedcontrol._scroll_top = vpos;
                this._setContainerVScrollPos(vpos);
            }

            // Android Translate사용시 scrollbar trackbar이용시 trackbar draw가 안되는 경우가 있어 분기.
            if (!this._use_translate_scroll && this.parent._procRefreshDOM == true)
            {
                var bandcontents;
                if (nexacro._isArray(v_element))
                    bandcontents = v_element[0]._client_elem;
                else
                    bandcontents = v_element._client_elem;

                if (bandcontents)
                {
                    bandcontents._refreshDOM();
                }
            }
        }
    };


    _pGridScrollableControlElement.setElementScrollPos = function (hpos, vpos)
    {
        if (this.parent._p_enableredraw == false)
        {
            this.parent._enable_redraw_history.scroll = true;
            return;
        }

        var v_element = this._target_vscroll_elements;
        var h_element = this._target_hscroll_elements;

        if (v_element)
        {
            if (nexacro._isArray(v_element))
            {
                v_element = v_element[0];
            }
            if (vpos < 0) vpos = 0;
            if (vpos > this.vscroll_limit)
            {
                vpos = this.vscroll_limit;
            }

            var scrollTop = v_element._getScrollTop();
            if (scrollTop != vpos)
            {
                this.scroll_top = vpos;
                this.linkedcontrol._scroll_top = vpos;
                this._setContainerVScrollPos(vpos);
            }
        }
        if (h_element)
        {
            if (nexacro._isArray(h_element))
            {
                h_element = h_element[0];
            }
            if (hpos < 0) hpos = 0;
            if (hpos > this.hscroll_limit)
            {
                hpos = this.hscroll_limit;
            }

            var scrollLeft = h_element.scroll_left;
            if (scrollLeft != hpos)
            {
                this.scroll_left = hpos;
                this.linkedcontrol._scroll_left = hpos;
                this._setContainerHScrollPos(hpos);
            }
        }
    };

    _pGridScrollableControlElement._setInnerElementScrollMaxTops = function (tops)
    {
        var v_element = this._target_vscroll_elements;
        if (v_element && tops)
        {
            v_element._client_elem._scroll_max_arr = tops;
        }
    };

    _pGridScrollableControlElement.setElementScrollMaxSize = function (width, height)
    {
        if (this._client_elem)
        {
            this._client_elem.setElementScrollMaxSize(width, height);
        }

        var v_element = this._target_vscroll_elements;
        if (nexacro._isArray(v_element))
        {
            v_element = v_element[0];
        }
        /*
        var h_element = this._target_hscroll_elements;
        if (nexacro._isArray(h_element))
        {
            h_element = h_element[0];
        }
        */
        this._setContainerMaxHeight(height);
        this._setContainerMaxWidth(width);

        if (v_element)
            this._updateClientRect();
    };

    //======================================================================
    // nexacro.GridBandControlElement
    //======================================================================
    nexacro.GridBandControlElement = function (parent_elem, type)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;
        this._type = type;
        this._client_elem = new nexacro._GridBandContainerElement(this, (type == "body"));
        this._client_elem_fix = null;
        this._fix_height = 0;
        this.container_maxwidth = 0;
        this.container_maxheight = 0;
        this._cur_border = null;
    };

    var _pGridBandControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.GridBandControlElement);
    nexacro.GridBandControlElement.prototype = _pGridBandControlElement;

    _pGridBandControlElement._type_name = "GridBandControlElement";

    _pGridBandControlElement.scroll_left = 0;
    _pGridBandControlElement.scroll_top = 0;

    _pGridBandControlElement.create = function (win)
    {
        var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && owner_elem.handle)
        {
            if (!this.handle)
            {
                this.owner_elem = owner_elem;
                var _doc = win._doc || owner_elem._getRootWindowHandle();

                var handle = _doc.createElement("div");
                handle.id = this.name;
                handle._linked_element = this;

                var bPositionRtl = this._isParentRtl();

                this.handle = this.dest_handle = handle;
                nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

                /////////////////////////////////
                var handle_style = handle.style;
                nexacro.__setDOMStyle_Pos(handle_style, this.left, this.top, bPositionRtl);
                nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                //tooltip inheritance사용.
                //nexacro.__setDOMNode_ToolTip(handle, "");
                const env = nexacro.getEnvironment();
                if (env._p_enableaccessibility && env._a11ytype == 5) //android talkback
                {
                    if (this.linkedcontrol && this.linkedcontrol._skip_mobile_tabfocus)
                        this.tabindex = -99;
                }

                // render & create Background SubElements
                this._refreshControl(handle, handle_style, _doc);

                /*if (this.rtl != undefined)
                {
                    nexacro.__setDOMStyle_Direction(handle_style, this.rtl);
                }*/

                // append TO Parent Element
                nexacro.__appendDOMNode((this._is_nc_element) ? owner_elem.handle : owner_elem.dest_handle, handle);

                if (!this._client_elem.handle)
                    this._client_elem.create(win);

                if (this._client_elem_fix && !this._client_elem_fix.handle)
                    this._client_elem_fix.create(win);
            }
        }
    };

    _pGridBandControlElement.destroy = function ()
    {
        if (this._client_elem_fix)
        {
            this._client_elem_fix.destroy();
            this._client_elem_fix = null;
        }
        return nexacro.ControlElement.prototype.destroy.call(this);
    };

    _pGridBandControlElement._setFixArea = function (height)
    {
        this._fix_height = height;

        if (height)
        {
            if (!this._client_elem_fix)
                this._client_elem_fix = new nexacro._GridBandContainerElement(this, true, "fixed");
        }
        else
        {
            if (this._client_elem_fix)
            {
                this._client_elem_fix.destroy();
                this._client_elem_fix = null;
            }
        }

        if (this.handle && this._client_elem_fix && !this._client_elem_fix.handle)
        {
            this._client_elem_fix.create();
        }

        this._updateClientSize();
    };

    _pGridBandControlElement.getContainerElement = function (is_fixed)
    {
        if (is_fixed)
            return this._client_elem_fix;

        return this._client_elem;
    };

    _pGridBandControlElement._setContainerMaxHeight = function (height)
    {
        if (this._type == "body")
        {
            if (this.container_maxheight != height)
            {
                this.container_maxheight = height;
                this._client_elem._setScrollHeight(height);
            }
        }
    };

    _pGridBandControlElement._resetExtendContainer = function (scrollHeight)
    {
        if (!scrollHeight)
            scrollHeight = this.container_maxheight;

        this._client_elem._setScrollHeight(this.container_maxheight);
    };

    _pGridBandControlElement._calculateClientHeight = function (change_height)
    {
        var border = this.border || this.linkedcontrol._getCSSStyleValue("border", "enabled");
        var c_height = this.client_height + change_height + ((border) ? border._getBorderHeight() : 0);
        return c_height;
    };
    /*
    _pGridBandControlElement.setElementBorder = function (border, bordertype)
    {
        // update Border & Background SubElements
        this.border = border;
        this.bordertype = bordertype;
        this._setControlBorder(this, this._handle, border, bordertype, true);
        this._updateClientSize();
        this._client_elem.setElementPosition(this.left, this.top);
    };
    */

    _pGridBandControlElement._getContainerMaxHeight = function ()
    {
        if (this._type == "body")
        {
            return this.container_maxheight;
        }
        else
        {
            return this.client_height;
        }
    };
    /*
    _pGridBandControlElement._getScrollLeft = function ()
    {
        return this.scroll_left;
    };
    */
    _pGridBandControlElement._getScrollTop = function ()
    {
        if (this._type == "body")
        {
            return this.scroll_top;
        }
        else
        {
            return 0;
        }
    };

    _pGridBandControlElement.setElementScrollMaxSize = function (width, height)
    {
        if (this._client_elem)
        {
            this._client_elem.setElementScrollMaxSize(width, height);
        }
    };

    _pGridBandControlElement._on_change_clientSize = function (width, height)
    {
        nexacro.ControlElement.prototype._on_change_clientSize.call(this, width, height);

        var client_element_fix = this._client_elem_fix;

        if (client_element_fix)
            client_element_fix.setElementSize(width, this._fix_height);
    };

    _pGridBandControlElement._on_updateClientRect = function ()
    {
        var ret = 0;
        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;

        if (!this._cur_border)
            this._cur_border = this.border || this.linkedcontrol._getCSSStyleValue("border", "normal");

        var border = this._cur_border;

        if (border)
        {
            client_width += border._getBorderWidth();
            client_height += border._getBorderHeight();
        }

        var fix_height = this._fix_height;

        client_top += fix_height;
        client_height -= fix_height;

        if (this.client_left != client_left || this.client_top != client_top)
        {
            this.client_left = client_left;
            this.client_top = client_top;
            ret = 1;
        }
        if (this.client_width != client_width || this.client_height != client_height)
        {
            this.client_width = client_width;
            this.client_height = client_height;
            ret += 2;
        }

        return ret;
    };

    _pGridBandControlElement._updateClientSize = function ()
    {
        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;

        if (!this._cur_border)
            this._cur_border = this.border || this.linkedcontrol._getCSSStyleValue("border", "normal");

        var border = this._cur_border;

        if (border)
        {
            client_width += border._getBorderWidth();
            client_height += border._getBorderHeight();
        }

        var fix_height = this._fix_height;

        client_top += fix_height;
        client_height -= fix_height;

        var client_element_fix = this._client_elem_fix;
        if (client_element_fix)
        {
            client_element_fix.setElementPosition(client_left, 0);
            client_element_fix.setElementSize(client_width, fix_height);
        }

        var client_element = this._client_elem;
        if (client_element)
        {
            if (this.client_left != client_left || this.client_top != client_top)
            {
                this.client_left = client_left;
                this.client_top = client_top;
                client_element.setElementPosition(client_left, client_top);
            }
            if (this.client_width != client_width || this.client_height != client_height)
            {
                this.client_width = client_width;
                this.client_height = client_height;
                client_element.setElementSize(client_width, client_height);
            }
        }
        else
        {
            this.client_left = client_left;
            this.client_top = client_top;
            this.client_width = client_width;
            this.client_height = client_height;
        }
    };

    _pGridBandControlElement.setElementVScrollPos = function (vpos)
    {
        if (this._type == "body")
        {
            this._client_elem._try_user_setvpos = true;
            this._client_elem.setElementVScrollPos(vpos);
            this._client_elem._try_user_setvpos = null;
            this.scroll_top = vpos;
        }
    };

    _pGridBandControlElement._setOnScrollCallbackTarget = function (target)
    {
        if (this._type == "body")
        {
            this._client_elem._grid = target;
        }
    };

    _pGridBandControlElement._getExtendContainerCount = function ()
    {
        if (this._client_elem)
            return this._client_elem._ext_inners.length;

        return 0;
    };

    _pGridBandControlElement.setElementBorder = function (border)
    {
        var retn = nexacro.ControlElement.prototype.setElementBorder.call(this, border);
        this._cur_border = border;
        this._updateClientSize();
        this._client_elem._adjustPos();
        return retn;
    };

    _pGridBandControlElement.setElementShadow = nexacro._emptyFn;

    //======================================================================
    // nexacro.GridBandContainerElement
    //======================================================================

    nexacro._GridBandContainerElement = function (parent_elem, use_translate_scroll, type)
    {
        use_translate_scroll = use_translate_scroll && this._use_inner_move;

        nexacro._ContainerElement.call(this, parent_elem, use_translate_scroll, type, true);
        this._scroll_max_arr = []; // only HTML
        this._ext_inners = []; //scroll area extend
        this._grid = null;
    };

    /****** Android 기본브라우저 mobile safari 사용시 ******
    * scrollTop 사용 : 터치시 화면반응속도 느림, 스크롤속도 느림, 화면출렁거림 가끔
    * translate 사용 : 터치시 화면반응속도 빠름, 스크롤속도 빠름(텍스트량이 적을시만), 화면출렁거림 잦음(텍스트량이 많을시만)
    * position 이동  : 터치시 화면반응속도 중간, 스크롤속도 중간, 화면출렁거림 거의없음 (노드량이 많으면 느려질 수 있음)
    /*******************************************************/

    var __pGridBandContainerElement = nexacro._createPrototype(nexacro._ContainerElement, nexacro._GridBandContainerElement);

    nexacro._GridBandContainerElement.prototype = __pGridBandContainerElement;
    __pGridBandContainerElement._type_name = "GridBandContainerElement";
    __pGridBandContainerElement._use_inner_move = (nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari"); // safari만 inner_move가 빠름. 2020/2/26

    __pGridBandContainerElement._adjustPos = function ()
    {
        this.setElementPosition(this.left, this.top);
    };

    __pGridBandContainerElement.destroy = function ()
    {
        nexacro._ContainerElement.prototype.destroy.call(this);
        this._grid = null;
    };

    __pGridBandContainerElement.setElementPosition = function (left, top)
    {
        var border = this.parent._cur_border;
        this.left = left;
        this.top = top;
        var handle = this.handle;
        if (handle)
        {
            if (border)
            {
                left = left - border.left._width;
                top = top - border.top._width;
            }
            nexacro.__setDOMStyle_Pos(handle.style, left, top);
        }
    };

    __pGridBandContainerElement.setElementSize = function (width, height/*, update*/)
    {
        var border = this.parent._cur_border;
        this.width = width;
        this.height = height;
        if (width < 0) width = 0;
        if (height < 0) height = 0;

        var handle = this.handle;
        if (handle)
        {
            if (border)
            {
                width = width + border.left._width + border.right._width;
                height = height + border.top._width + border.bottom._width;
            }

            if (width && height)
                nexacro.__setDOMStyle_Size(handle.style, width, height);
            else
                nexacro.__clearDOMStyle_Size(handle.style);

            if (this.type == "fixed")
            {
                if (this.dest_handle)
                {
                    nexacro.__setDOMStyle_Size(this.dest_handle.style, width, height);
                }
            }
            else
            {
                if (this.dest_handle)
                {
                    var owner_elem = this.owner_elem;
                    var scroll_height = owner_elem ? Math.max(owner_elem.container_maxheight, this.height) : this.height;
                    this._setScrollHeight(scroll_height, true);
                }
            }
        }
    };

    __pGridBandContainerElement._setInnerElementExtend = function ()
    {
        var handle = this.handle;
        var dest_handle = this.dest_handle;
        var _scroll_max = this._scroll_max_arr;
        var _doc = this.owner_elem._getRootWindowHandle();

        this._deleteExtinners(_scroll_max.length - 1);

        var newinners = this._ext_inners;
        var newinners_cnt = newinners.length;
        var _ext_inner;
        var j = 0;

        if (_scroll_max.length > 0)
        {
            var test = ["red", "orange", "yellow", "green", "blue", "navy", "pupple"];
            for (var i = 1; i < _scroll_max.length; i++)
            {
                if (i <= newinners_cnt)
                {
                    _ext_inner = newinners[j++];
                    nexacro.__setDOMStyle_Size(_ext_inner.style, this.width, _scroll_max[i] - _scroll_max[i - 1]);
                    continue;
                }
                else
                {
                    // create inner container
                    _ext_inner = _doc.createElement("div");
                    nexacro.__setDOMNode_ClassName(_ext_inner, "nexainnercontainer");
                    nexacro.__setDOMNode_Id(_ext_inner, "", dest_handle.id + "_ext_" + (i - 1));
                    nexacro.__setDOMNode_Selectable(_ext_inner, false);

                    var inner_style = _ext_inner.style;
                    nexacro.__setDOMStyle_Absolute(inner_style);
                    nexacro.__setDOMStyle_Pos(inner_style, 0, this.height);  // 숨겨서 겹치게 놔둠.
                    nexacro.__setDOMStyle_Size(_ext_inner.style, this.width, _scroll_max[i] - _scroll_max[i - 1]);

                    if (nexacro._bigdata_innertest)
                        _ext_inner.style.border = "2px solid " + test[i - 1];   // test

                    // append inner container Element
                    nexacro.__appendDOMNode(handle, _ext_inner);

                    newinners.push(_ext_inner);
                }
            }
        }
    };

    __pGridBandContainerElement._changeInnerElement = function (top, row_handle)
    {
        var idx = this._getExtInnerIdx(top);
        var next_handle = this._getDestHandle(top, idx);
        var prev_handle = row_handle.parentElement;

        if (idx != null && idx > -1)
        {
            top = top - this._scroll_max_arr[idx];
        }

        if (prev_handle && (prev_handle != next_handle))
        {
            nexacro.__removeDOMNode(prev_handle, row_handle);
            nexacro.__appendDOMNode(next_handle, row_handle);
        }

        return top;
    };

    __pGridBandContainerElement._getDestHandle = function (top, idx)
    {
        if (idx == undefined)
            idx = this._getExtInnerIdx(top);

        return (idx < 0) ? this.dest_handle : this._ext_inners[idx];
    };

    __pGridBandContainerElement._getExtInnerIdx = function (top)
    {
        var _scroll_max = this._scroll_max_arr;
        var idx = -1;

        if (_scroll_max)
        {
            for (var i = 0, n = _scroll_max.length; i < n; i++)
            {
                if (top < _scroll_max[i])
                {
                    idx = i - 1;
                    break;
                }
            }
        }
        return idx;
    };

    __pGridBandContainerElement._removeExtinners = function ()
    {
        var handle = this.handle;
        var ext_inners = this._ext_inners;

        for (var i = 0; i < ext_inners.length; i++)
        {
            nexacro.__removeDOMNode(handle, ext_inners[i]);
        }
        this._ext_inners = null;
    };

    __pGridBandContainerElement._deleteExtinners = function (keepcnt)
    {
        var handle = this.handle;
        var ext_inners = this._ext_inners;

        if (!keepcnt)
            keepcnt = 0;

        for (var i = ext_inners.length - 1; i >= keepcnt; i--)
        {
            nexacro.__removeDOMNode(handle, ext_inners[i]);
            ext_inners.splice(i, 1);
        }
    };

    __pGridBandContainerElement._findScrollbarControl = function (elem, is_vert)
    {
        while (elem)
        {
            var linkedcontrol = elem.linkedcontrol;
            if (linkedcontrol)
            {
                if (is_vert)
                {
                    if (linkedcontrol._grid && linkedcontrol._grid.vscrollbar)
                        return linkedcontrol._grid.vscrollbar;
                }
                else
                {
                    if (linkedcontrol._grid && linkedcontrol._grid.hscrollbar)
                        return linkedcontrol._grid.hscrollbar;
                }
            }

            elem = elem.parent;
        }

        return null;
    };

    if (__pGridBandContainerElement._use_inner_move)
    {
        __pGridBandContainerElement.create = function (win)
        {
            var owner_elem = this.owner_elem = this.parent_elem;

            nexacro._ContainerElement.prototype.create.call(this, win);

            this._setScrollHeight(owner_elem.container_maxheight);
            nexacro._observeSysEvent(this.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            this._adjustPos();
        };

        __pGridBandContainerElement.attachHandle = function (win)
        {
            nexacro._ContainerElement.prototype.attachHandle.call(this, win);
            nexacro.__setDOMStyle_Size(this.dest_handle.style, this.width, this.height);

            if (this.parent._type == "body")
                this._setScrollHeight(this.owner_elem.container_maxheight);

            nexacro._observeSysEvent(this.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            this.setElementPosition(this.left, this.top);
        };

        __pGridBandContainerElement._syshandler_onscroll_forward = function (evt)
        {
            var target = evt.target;
            if (!target)
                return;

            var container = target._linked_element;
            if (container)
            {
                if (container._noEventScroll == true)
                {
                    container._noEventScroll = false;
                    return;
                }

                //var elem_scroll_top = container._scroll_top | 0;

                if (target.scrollLeft > 0)
                {
                    container._noEventScroll = true;
                    target.scrollLeft = 0;  // translate 사용시엔 scrollleft가 0으로 유지되어야함.
                }
                if (target.scrollTop > 0)
                {
                    container._noEventScroll = true;
                    target.scrollTop = 0;
                }
            }
        };

        __pGridBandContainerElement._setScrollHeight = function (height, update_size)
        {
            var handle = this.dest_handle;
            if (handle)
            {
                if (this._scroll_max_arr && this._scroll_max_arr.length > 0)
                {
                    height = this._scroll_max_arr[0];
                    if (height < this.height)
                        height = this.height;

                    nexacro.__setDOMStyle_Size(handle.style, this.width, height);

                    if (!update_size)
                        this._setInnerElementExtend();
                }
                else
                {
                    if (height < this.height)
                        height = this.height;

                    nexacro.__setDOMStyle_Size(handle.style, this.width, height);
                }
            }
        };

        __pGridBandContainerElement.setElementVScrollPos = function (vpos)
        {
            if (this._scroll_top != vpos || this.parent._reset_scrollpos)
            {
                this._scroll_top = vpos;
                var _inner_handle = this.dest_handle;
                if (_inner_handle)
                {
                    nexacro.__setDOMStyle_Translate(_inner_handle.style, 0, -vpos);

                    var ext_vpos;
                    var _ext_inner = this._ext_inners;
                    var scroll_max_arr = this._scroll_max_arr;

                    for (var i = 0; i < _ext_inner.length; i++)
                    {
                        if (vpos + this.height > scroll_max_arr[i] && vpos < scroll_max_arr[i + 1])
                        {
                            if (nexacro._Browser_Transform3d > 0)
                                ext_vpos = vpos - (scroll_max_arr[i] - this.height);
                            else
                                ext_vpos = vpos - scroll_max_arr[i];
                        }
                        else
                        {
                            ext_vpos = -this.height;
                        }
                        nexacro.__setDOMStyle_Translate(_ext_inner[i].style, 0, -ext_vpos);
                    }

                    if (this._grid)
                        this._grid._callback_onvscroll(vpos);
                }
            }
        };

        __pGridBandContainerElement._refreshDOM = nexacro._emptyFn;

        __pGridBandContainerElement.destroy = function ()
        {
            //var handle = this.handle;
            this._destroyElementHandle();

            this._removeExtinners();
            this.owner_elem = null;
            this.dest_handle = null;
            this._p_parent = null;
            this.parent_elem = null;
            this._scroll_max_arr = null;
        };
    }
    else  // scrollTop 사용
    {
        __pGridBandContainerElement.create = function (win)
        {
            nexacro._ContainerElement.prototype.create.call(this, win);

            var owner_elem = this.owner_elem = this.parent_elem;

            var _doc = win ? win._doc : owner_elem._getRootWindowHandle();
            var tempdiv = this._tempdiv = _doc.createElement("div");

            //TODO translate to class
            nexacro.__setDOMStyle_AbsoluteTransparent(tempdiv.style);
            nexacro.__setDOMStyle_Pos(tempdiv.style, 0, 0);
            nexacro.__setDOMStyle_Size(tempdiv.style, 1, 1);
            nexacro.__setDOMStyle_Display(tempdiv.style, "none");

            nexacro.__appendDOMNode(this.handle, tempdiv);
            this._setScrollHeight(owner_elem.container_maxheight);

            // prohibit div auto reset scroll when element was click.
            nexacro._stopSysObserving(this.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            nexacro._observeSysEvent(this.handle, "scroll", "onscroll", this._org_syshandler_onscroll_forward);
            this._adjustPos();
        };

        __pGridBandContainerElement.attachHandle = function (win)
        {
            nexacro._ContainerElement.prototype.attachHandle.call(this, win);
            if (this.name && !this.handle)
            {
                var handle = win._doc.getElementById(this.name);
                if (handle)
                {
                    this.handle = this.dest_handle = handle;
                    this._tempdiv = handle.nextSibling;
                }
            }
            this.handle._linked_element = this;
            nexacro.__setDOMStyle_Size(this.dest_handle.style, this.width, this.height);

            if (this.parent._type == "body")
                this._setScrollHeight(this.owner_elem.container_maxheight);

            nexacro._stopSysObserving(this.handle, "scroll", "onscroll", this._syshandler_onscroll_forward);
            nexacro._observeSysEvent(this.handle, "scroll", "onscroll", this._org_syshandler_onscroll_forward);
            this._adjustPos();
        };

        __pGridBandContainerElement.destroy = function ()
        {
            var handle = this.handle;
            if (handle)
                nexacro._stopSysObserving(handle, "scroll", "onscroll", this._org_syshandler_onscroll_forward);

            this._removeExtinners();
            this.handle._linked_element = null;
            this._destroyElementHandle();

            nexacro.__removeDOMNode(handle, this._tempdiv);
            this._tempdiv = null;

            this.owner_elem = null;
            this.dest_handle = null;
            this._p_parent = null;
            this.parent_elem = null;
            this._scroll_max_arr = null;
            this._ext_inners = null;
        };

        __pGridBandContainerElement._syshandler_onscroll_forward = function (evt)
        {
            var target = evt.target;
            if (!target)
                return;
            var container = target._linked_element;
            if (container)
            {
                if (container._noEventScroll == true)
                {
                    container._noEventScroll = false;

                    if (container._grid)
                        container._grid._callback_onvscroll(true);

                    return;
                }

                var elem_scroll_top = container._scroll_top | 0;
                var scrolltop = (target._org_scrollTop != undefined) ? target._org_scrollTop : target.scrollTop;
                target._org_scrollTop = undefined;

                // DOM이 자동으로 스크롤 한 것에 맞춰 form의 스크롤을 조절함
                if (elem_scroll_top != scrolltop)
                {
                    var vscrollbar = container._findScrollbarControl(container, true);
                    if (vscrollbar)
                        vscrollbar.set_pos(scrolltop);
                    else
                        container.setElementVScrollPos(elem_scroll_top);
                }
            }
        };

        __pGridBandContainerElement._org_syshandler_onscroll_forward = __pGridBandContainerElement._syshandler_onscroll_forward;

        __pGridBandContainerElement._setScrollHeight = function (height)
        {
            var handle = this.dest_handle;
            if (handle)
            {
                var tempdiv = this._tempdiv;
                if (!tempdiv)
                {
                    var owner_elem = this.owner_elem = this.parent_elem;

                    var _doc = owner_elem._getRootWindowHandle();

                    if (_doc)
                    {
                        tempdiv = this._tempdiv = _doc.createElement("div");
                        nexacro.__setDOMStyle_AbsoluteTransparent(tempdiv.style);
                        nexacro.__setDOMStyle_Size(tempdiv.style, 1, 1);
                        // nexacro.__setDOMStyle_Visible(tempdiv.style, false);
                        nexacro.__setDOMStyle_Display(tempdiv.style, "none");
                        nexacro.__appendDOMNode(this.handle, tempdiv);
                    }
                }

                if (tempdiv)
                    nexacro.__setDOMStyle_Pos(this._tempdiv.style, 0, height - 1);

                if (this._scroll_max_arr && this._scroll_max_arr.length > 0)
                {
                    height = this._scroll_max_arr[0];
                    if (height < this.height)
                        height = this.height;

                    nexacro.__setDOMStyle_Size(handle.style, this.width, height);
                    this._setInnerElementExtend();
                }
                else
                {
                    if (height < this.height)
                        height = this.height;

                    nexacro.__setDOMStyle_Size(handle.style, this.width, height);
                }
            }
        };

        __pGridBandContainerElement.setElementVScrollPos = function (vpos)
        {
            if (this._scroll_top != vpos || this.parent._reset_scrollpos)
            {
                var dir = vpos - this._scroll_top;

                this._scroll_top = vpos;

                var handle = this.handle;
                if (handle)
                {
                    var _inner_handle = this.dest_handle;
                    var _ext_inners = this._ext_inners;
                    var _ext_inners_len = _ext_inners.length;

                    if (_inner_handle && _ext_inners_len > 0)
                    {
                        var scroll_max_arr = this._scroll_max_arr;

                        // org inner ----------------------------------------
                        if (vpos <= scroll_max_arr[0])
                            nexacro.__setDOMStyle_Display(_inner_handle.style, "");
                        else
                            nexacro.__setDOMStyle_Display(_inner_handle.style, "none");

                        // ext inners ---------------------------------------
                        var extinner_top, extinner_handle;
                        var i, n;
                        var extinner_height, nextinner_handle;
                        if (dir > 0)
                        {
                            for (i = 0, n = scroll_max_arr.length - 1; i < n; i++)
                            {
                                if (vpos < scroll_max_arr[0])
                                    break;

                                if (vpos >= scroll_max_arr[i])
                                {
                                    if (extinner_handle)
                                        nexacro.__setDOMStyle_Display(extinner_handle.style, "none");

                                    extinner_top = scroll_max_arr[i];
                                    extinner_handle = _ext_inners[i];
                                    nextinner_handle = _ext_inners[i + 1];
                                    extinner_height = scroll_max_arr[i + 1] - extinner_top;
                                }
                                else if (extinner_handle)
                                    break;
                            }

                            if (extinner_handle)
                            {
                                nexacro.__setDOMStyle_Translate(extinner_handle.style, 0, 0);
                                nexacro.__setDOMStyle_Display(extinner_handle.style, "");

                                if (nextinner_handle)
                                {
                                    nexacro.__setDOMStyle_Translate(nextinner_handle.style, 0, extinner_height);
                                    nexacro.__setDOMStyle_Display(nextinner_handle.style, "");
                                    i++; // after nextinner_handle
                                }

                                for (; i < _ext_inners_len; i++)
                                {
                                    nexacro.__setDOMStyle_Display(_ext_inners[i].style, "none");
                                }

                                this._noEventScroll = true;
                                handle._org_scrollTop = vpos;
                                nexacro.__setDOMNode_VScrollPos(handle, vpos - extinner_top);
                            }
                            else
                            {
                                for (i = 0; i < _ext_inners_len; i++)
                                {
                                    if (i == 0)
                                    {
                                        nexacro.__setDOMStyle_Translate(_ext_inners[i].style, 0, scroll_max_arr[i]);
                                        nexacro.__setDOMStyle_Display(_ext_inners[i].style, "");
                                    }
                                    else
                                    {
                                        nexacro.__setDOMStyle_Display(_ext_inners[i].style, "none");
                                    }
                                }

                                this._noEventScroll = true;
                                nexacro.__setDOMNode_VScrollPos(handle, vpos);
                            }
                        }
                        else if (dir < 0)
                        {
                            for (i = 0, n = scroll_max_arr.length; i < n; i++)
                            {
                                if (vpos <= scroll_max_arr[i])
                                {
                                    if (i == 0)
                                        break;

                                    extinner_handle = _ext_inners[i - 1];
                                    extinner_top = scroll_max_arr[i - 1];
                                    extinner_height = scroll_max_arr[i] - extinner_top;
                                    nextinner_handle = _ext_inners[i];
                                    i++;
                                    break;
                                }
                            }

                            if (extinner_handle)
                            {
                                nexacro.__setDOMStyle_Translate(extinner_handle.style, 0, 0);
                                nexacro.__setDOMStyle_Display(extinner_handle.style, "");

                                if (nextinner_handle)
                                {
                                    nexacro.__setDOMStyle_Translate(nextinner_handle.style, 0, extinner_height);
                                    nexacro.__setDOMStyle_Display(nextinner_handle.style, "");
                                }

                                for (; i < _ext_inners_len; i++)
                                {
                                    nexacro.__setDOMStyle_Display(_ext_inners[i].style, "none");
                                }

                                this._noEventScroll = true;
                                handle._org_scrollTop = vpos;
                                nexacro.__setDOMNode_VScrollPos(handle, vpos - extinner_top);
                            }
                            else
                            {
                                for (i = 0; i < _ext_inners_len; i++)
                                {
                                    if (i == 0)
                                    {
                                        nexacro.__setDOMStyle_Translate(_ext_inners[i].style, 0, scroll_max_arr[i]);
                                        nexacro.__setDOMStyle_Display(_ext_inners[i].style, "");
                                    }
                                    else
                                    {
                                        nexacro.__setDOMStyle_Display(_ext_inners[i].style, "none");
                                    }
                                }

                                this._noEventScroll = true;
                                nexacro.__setDOMNode_VScrollPos(handle, vpos);
                            }
                        }
                    }
                    else
                    {
                        this._noEventScroll = true;
                        nexacro.__setDOMNode_VScrollPos(handle, vpos);
                    }
                }
            }
        };

        __pGridBandContainerElement._refreshDOM = nexacro._emptyFn;
    }


    //======================================================================
    // nexacro.GridRowControlElement
    //======================================================================

    nexacro.GridRowControlElement = function (parent_elem, left_gap)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

        var use_inner_move = (nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari"); // safari만 inner_move가 빠름. 2020/2/26

        this._client_body_element = new nexacro._ContainerElement(this, use_inner_move, "body");
        this._client_body_element._no_focus_scroll = true;

        this._client_right_element = null;

        this._left_width = 0;
        this._right_width = 0;
        this._body_width = 0;
        this.scroll_left = 0;
        this._left_gap = left_gap;
    };

    var _pGridRowControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.GridRowControlElement);

    nexacro.GridRowControlElement.prototype = _pGridRowControlElement;

    _pGridRowControlElement._type_name = "GridRowControlElement";

    _pGridRowControlElement.create = function (win)
    {
        // if parent is control element
        var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.linkedcontrol._fixed);
        if (owner_elem && owner_elem.handle)
        {
            if (!this.handle)
            {
                this.owner_elem = owner_elem;
                var _doc = win._doc || owner_elem._getRootWindowHandle();
                var handle = _doc.createElement("div");
                var control = this.linkedcontrol;

                if (control && control._is_temp)
                {
                    this.name += "_temp";
                }

                handle.id = this.name;
                handle._linked_element = this;

                this.handle = this.dest_handle = handle;
                nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

                /////////////////////////////////
                var handle_style = handle.style;
                var _owner_dest_handle = (this._is_nc_element) ? owner_elem.handle : owner_elem._getDestHandle(this.top);

                if (this._use_translate_move)
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, 0);

                this.setElementPosition(this.left, this.top, true);
                nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);
                handle_style.clip = "rect(0px, " + (this.width | 0) + "px, " + (this.height | 0) + "px, 0px)";

                this._refreshControl(handle, handle_style, _doc);

                // append TO Parent Element
                nexacro.__appendDOMNode(_owner_dest_handle, handle);
                // render & create Background SubElements

            }

            //container element create
            // no need set props for child --> only create it
            // props are already setted to child_elem
            if (this.handle)
            {
                if (this._client_body_element)
                {
                    const env = nexacro.getEnvironment();
                    this._client_body_element._no_focus_scroll = (env._p_enableaccessibility && env._a11ytype == 5) ? false : true;
                }

                if (this._client_left_element && !this._client_left_element.handle)
                    this._client_left_element.create(win);
                if (!this._client_body_element.handle)
                    this._client_body_element.create(win);
                if (this._client_right_element && !this._client_right_element.handle)
                    this._client_right_element.create(win);

                this._client_elem = this._client_body_element;
            }
        }
    };

    _pGridRowControlElement._removeElementHandle = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            var dest_handle;
            handle._linked_element = null;
            if (this._is_nc_element)
                dest_handle = (this.owner_elem ? this.owner_elem.handle : null);
            else
                dest_handle = (this.owner_elem ? this.owner_elem._getDestHandle(this.top) : null);
            nexacro.__removeDOMNode(dest_handle, handle);
        }
    };

    _pGridRowControlElement._on_destroy = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            // destroy client element
            this._client_body_element.destroy();

            if (this._client_left_element)
                this._client_left_element.destroy();

            if (this._client_right_element)
                this._client_right_element.destroy();

            this._client_body_element = null;
            this._client_left_element = null;
            this._client_right_element = null;
            this._client_elem = null;
        }
    };

    _pGridRowControlElement.createCommandStart = function ()
    {
        var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this.handle)
        {
            this.owner_elem = owner_elem;

            var str = "<div id='" + this.name + "' class='" + this._getElementClassName() + "'";
            if (!nexacro._isNull(this.tooltiptext))
                str += " title = '" + this.tooltiptext + "' ";
            var acc_str = this._getAccessibilityInfoStr();
            var style_str = this._getControlStyleStr();
            var status_str = this._getControlStatusStr();

            str += status_str ? (" " + status_str) : "";
            str += style_str ? (" style='" + style_str) : "";
            str += "clip:rect(0px, " + (this.width | 0) + "px, " + (this.height | 0) + "px, 0px);'";
            str += acc_str ? (" " + acc_str + ">") : ">";

            // for edge
            var edge_elem = this._edge_elem;
            if (edge_elem)
                str += edge_elem.createCommand();

            return str;
        }
    };

    _pGridRowControlElement.createCommandAreaStart = function (area)
    {
        var str = "";
        if (area == "body")
        {
            if (this._client_body_element)
            {
                str += this._client_body_element.createCommandStart();
            }
        }
        else if (area == "left")
        {
            if (this._client_left_element)
            {
                str += this._client_left_element.createCommandStart();
            }
        }
        else
        {
            if (this._client_right_element)
            {
                str += this._client_right_element.createCommandStart();
            }
        }
        return str;
    };

    _pGridRowControlElement.createCommandAreaEnd = function (area)
    {
        var str = "";
        if (area == "body")
        {
            if (this._client_body_element)
            {
                str += this._client_body_element.createCommandEnd();
            }
        }
        else if (area == "left")
        {
            if (this._client_left_element)
            {
                str += this._client_left_element.createCommandEnd();
            }
        }
        else
        {
            if (this._client_right_element)
            {
                str += this._client_right_element.createCommandEnd();
            }
        }
        return str;
    };

    _pGridRowControlElement.createCommandEnd = function (area)
    {
        return "</div>";
    };

    _pGridRowControlElement.attachHandle = function (win)
    {
        if (this.name)
        {
            var handle = this.handle || win._doc.getElementById(this.name);
            if (handle)
            {
                handle._linked_element = this;

                if (this._client_body_element)
                {
                    this.handle = this.dest_handle = handle;
                    this._client_body_element.attachHandle(win);
                }

                // for edge
                var edge_elem = this._edge_elem;
                if (edge_elem)
                    edge_elem.attach_handle_fromparent(handle);

                this._setAccessibility_notify();

                if (this._client_left_element)
                    this._client_left_element.attachHandle(win);

                if (this._client_right_element)
                    this._client_right_element.attachHandle(win);
            }
            this.owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.linkedcontrol._fixed);
        }
    };

    _pGridRowControlElement.setInnerHTML = function (str)
    {
        if (this.dest_handle)
        {
            if (this._client_left_element)
            {
                var tempdiv = this._client_left_element._tempdiv;
                if (tempdiv)
                {
                    var handle = this._client_left_element.handle;
                    nexacro.__removeDOMNode(handle, tempdiv);
                    this._client_left_element._tempdiv = null;
                }
            }

            if (this._client_right_element)
            {
                var tempdiv = this._client_right_element._tempdiv;
                if (tempdiv)
                {
                    var handle = this._client_right_element.handle;
                    nexacro.__removeDOMNode(handle, tempdiv);
                    this._client_right_element._tempdiv = null;
                }
            }

            if (this._client_body_element)
            {
                var tempdiv = this._client_body_element._tempdiv;
                if (tempdiv)
                {
                    var handle = this._client_body_element.handle;
                    nexacro.__removeDOMNode(handle, tempdiv);
                    this._client_body_element._tempdiv = null;
                }
            }

            this.dest_handle.innerHTML = str;
        }
    };

    _pGridRowControlElement.clearContents = function ()
    {
        if (this.handle)
        {
            // destroy handle of client element : keep parent relation
            this._client_body_element.clearContents();
            if (this._client_left_element)
                this._client_left_element.clearContents();
            if (this._client_right_element)
                this._client_right_element.clearContents();
        }
    };

    //index[0] - container[0] : _client_left_element
    //index[1] - container[1] : _client_right_element
    //index[-1]: client_elem  : _client_body_element
    _pGridRowControlElement.getContainerElement = function (area)
    {
        if (area == 1)
            return this._client_left_element;
        else if (area == 2)
            return this._client_right_element;

        return this._client_body_element;
    };

    _pGridRowControlElement._refreshCommonStyleProps = function (handle_style)
    {
        if (!this.visible)
            nexacro.__setDOMStyle_Visible(handle_style, false);

        if (this.width && this.height)
            nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

        // update Element's properties to DOM
        if (this.color)
            nexacro.__setDOMStyle_ColorObject(handle_style, this.color);
        if (this.font)
            nexacro.__setDOMStyle_FontObject(handle_style, this.font);
        if (this.wordSpacing)
            nexacro.__setDOMStyle_WordSpacingObject(handle_style, this.wordSpacing);
        if (this.letterSpacing)
            nexacro.__setDOMStyle_LetterSpacingObject(handle_style, this.letterSpacing);
        if (this.textDecoration)
            nexacro.__setDOMStyle_TextDecorationObject(handle_style, this.textDecoration);

        if (this.rtl != undefined)
            nexacro.__setDOMStyle_Direction(handle_style, this.rtl);
        if (this.wordWrap)
            nexacro.__setDOMStyle_WordWrap(handle_style, this.wordWrap);
    };

    _pGridRowControlElement.setArea = function (leftwidth, rightwidth)
    {
        if (leftwidth > 0 && !this._client_left_element)
            this._client_left_element = new nexacro._ContainerElement(this, false, "left");

        if (rightwidth > 0 && !this._client_right_element)
            this._client_right_element = new nexacro._ContainerElement(this, false, "right");

        this._left_width = leftwidth;

        var addgap = this._left_gap;

        if (this._client_left_element)
        {
            this._client_left_element.setElementPosition(this.client_left - addgap, this.client_top);
            this._client_left_element.setElementSize(leftwidth, this.client_height);
        }

        this._right_width = rightwidth;
        if (this._client_right_element)
        {
            this._client_right_element.setElementPosition(this.client_width - rightwidth + addgap, this.client_top);
            this._client_right_element.setElementSize(rightwidth - addgap, this.client_height);
        }

        this._body_width = this.client_width - leftwidth - rightwidth + (addgap * 2);
        this._client_body_element.setElementPosition(leftwidth - addgap, this.client_top);
        this._client_body_element.setElementSize(this._body_width, this.height);
    };

    _pGridRowControlElement._updateClientRect = function ()
    {
        var ret = this._on_updateClientRect();
        if (ret & 1)
            this._on_change_clientPos(this.client_left, this.client_top);
        if (ret & 2)
            this._on_change_clientSize(this.client_width, this.client_height);

        if (ret)
            this.setArea(this._left_width, this._right_width);

        this._setContainerMaxWidth(this._client_body_element._scroll_maxwidth, this.height);
    };

    _pGridRowControlElement._setContainerMaxWidth = function (width)
    {
        this._client_body_element.setElementScrollMaxSize(width, this.height);
    };

    _pGridRowControlElement._calculateClientWidth = function (parent_client_width)
    {
        return parent_client_width - this._left_width - this._right_width;
    };

    _pGridRowControlElement._getContainerMaxWidth = function ()
    {
        return this._client_body_element._scroll_maxwidth;
    };

    _pGridRowControlElement.setElementHScrollPos = function (hpos)
    {
        if (this.parent._grid._p_enableredraw == false)
        {
            this.parent._grid._enable_redraw_history.scroll = true;
            return;
        }

        this._client_body_element._setElementHScrollPos(hpos);
        this.scroll_left = hpos;
    };

    _pGridRowControlElement.setElementPosition = function (left, top, bForce)
    {
        if (this.parent_elem._use_container_move)
        {
            var owner_elem = this.owner_elem;
            if (this.left != left || this.top != top || bForce)
            {
                var adjust_top = top;

                if (!this._is_nc_element && owner_elem && (this.top != top || bForce))
                    adjust_top = owner_elem._changeInnerElement(top, this.handle);

                nexacro.Element.prototype.setElementPosition.call(this, left, adjust_top, bForce);
                this.top = top;
            }
        }
        else
        {
            nexacro.Element.prototype.setElementPosition.call(this, left, top, bForce);
        }
    };

    _pGridRowControlElement.setElementSize = function (width, height/*, update*/)
    {
        nexacro.ControlElement.prototype.setElementSize.call(this, width, height);

        var handle = this.handle;
        if (handle)
        {
            handle.style.clip = "rect(0px, " + (this.width) + "px, " + (this.height) + "px, 0px)";
        }
    };

    // for accessibility
    _pGridRowControlElement._setScrollableElementHScrollPos = nexacro._emptyFn;

    //======================================================================
    // nexacro.CellControlElement
    //======================================================================

    nexacro.CellControlElement = function (parent_elem, left_gap)
    {
        nexacro.ControlElement.call(this, parent_elem);
    };

    var _pCellControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.CellControlElement);

    nexacro.CellControlElement.prototype = _pCellControlElement;

    _pCellControlElement._type_name = "CellControlElement";

    _pCellControlElement.setInnerHTML = function (str)
    {
        if (this.handle)
        {
            this.handle.innerHTML = str;
        }
    };

    _pCellControlElement._refreshBorderNone = function ()
    {
        if (this.handle)
        {
            var _rtl = this._get_rtl();
            var _border = this.border;
            if (_rtl)
            {
                _border = this._border_info;
            }

            nexacro.__setDOMStyle_BorderNone(this.handle.style, this.borderLeftNone, this.borderTopNone, this.borderRightNone, this.borderBottomNone, _border, _rtl);
        }

        if (this._updateInnerSize())
        {
            this._updateClientRect();

            if (this._edge_elem)
            {
                this._edge_elem.setElementSize(this.inner_width, this.inner_height);
            }
        }
    };

    _pCellControlElement._attach_editor_node = function (editor_elem)
    {
        if (this.handle)
        {
            this.handle.appendChild(editor_elem.handle);
        }
    };

    //======================================================================
    // nexacro.TabBarItemSetControlElement
    //======================================================================
    nexacro.TabBarItemSetControlElement = function (parent_elem)
    {
        this._p_parent = parent_elem;
        this.parent_elem = parent_elem;

        this._fixed_container_element = new nexacro._ContainerElement(this, false, "fixed");
        this._scroll_container_element = new nexacro._ContainerElement(this, false, "scroll");

        // 가상 scroll 을 사용하지 않으므로 temp div 의 위치 변경을 수행하지 않기 위해 동적 override 함
        this._scroll_container_element.setElementScrollMaxSize = function (width, height)
        {
            this._scroll_maxwidth = width;
            this._scroll_maxheight = height;
        }

        this._fixed_container_width = 0;
        this._fixed_container_height = 0;

        this._scroll_container_width = 0;
        this._scroll_container_width = 0;

        this._is_horizontal_direction = true;

        this.scroll_left = 0;
        this.scroll_top = 0;
    };

    var _pTabBarItemSetControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.TabBarItemSetControlElement);

    nexacro.TabBarItemSetControlElement.prototype = _pTabBarItemSetControlElement;

    _pTabBarItemSetControlElement._type_name = "TabBarItemSetControlElement";
    _pTabBarItemSetControlElement._use_translate_move = false;

    _pTabBarItemSetControlElement.create = function (win)
    {
        const owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.linkedcontrol._fixed);
        if (owner_elem && owner_elem.handle)
        {
            if (!this.handle)
            {
                this.owner_elem = owner_elem;
                const _doc = win._doc || owner_elem._getRootWindowHandle();
                const handle = _doc.createElement("div");

                handle.id = this.name;
                handle._linked_element = this;

                this.handle = this.dest_handle = handle;
                nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

                /////////////////////////////////
                const handle_style = handle.style;

                if (this._use_translate_move)
                    nexacro.__setDOMStyle_Pos(handle_style, this.left, 0);

                this.setElementPosition(this.left, this.top, true);
                nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

                this._refreshControl(handle, handle_style, _doc);

                // append to parent element
                nexacro.__appendDOMNode((this._is_nc_element) ? owner_elem.handle : owner_elem.dest_handle, handle);
            }

            // create container element
            if (this.handle)
            {
                if (this._fixed_container_element && !this._fixed_container_element.handle)
                    this._fixed_container_element.create(win);
                if (this._scroll_container_element && !this._scroll_container_element.handle)
                    this._scroll_container_element.create(win);

                this._client_elem = this._scroll_container_element;
            }
        }
    };

    _pTabBarItemSetControlElement._on_destroy = function ()
    {
        const handle = this.handle;
        if (handle)
        {
            // destroy container element
            if (this._fixed_container_element)
                this._fixed_container_element.destroy();

            if (this._scroll_container_element)
                this._scroll_container_element.destroy();

            this._fixed_container_element = null;
            this._scroll_container_element = null;
            this._client_elem = null;
        }
    };

    _pTabBarItemSetControlElement.clearContents = function ()
    {
        if (this.handle)
        {
            // destroy handle of client element : keep parent relation
            if (this._fixed_container_element)
                this._fixed_container_element.clearContents();
            if (this._scroll_container_element)
                this._scroll_container_element.clearContents();
        }
    };

    _pTabBarItemSetControlElement.getContainerElement = function (bScroll)
    {
        if (bScroll)
            return this._scroll_container_element;

        return this._fixed_container_element;
    };

    _pTabBarItemSetControlElement._refreshCommonStyleProps = function (handle_style)
    {
        if (!this.visible)
            nexacro.__setDOMStyle_Visible(handle_style, false);

        if (this.width && this.height)
            nexacro.__setDOMStyle_Size(handle_style, this.width, this.height);

        // update Element's properties to DOM
        if (this.color)
            nexacro.__setDOMStyle_ColorObject(handle_style, this.color);
        if (this.font)
            nexacro.__setDOMStyle_FontObject(handle_style, this.font);
        if (this.wordSpacing)
            nexacro.__setDOMStyle_WordSpacingObject(handle_style, this.wordSpacing);
        if (this.letterSpacing)
            nexacro.__setDOMStyle_LetterSpacingObject(handle_style, this.letterSpacing);
        if (this.textDecoration)
            nexacro.__setDOMStyle_TextDecorationObject(handle_style, this.textDecoration);

        if (this.rtl != undefined)
            nexacro.__setDOMStyle_Direction(handle_style, this.rtl);
        if (this.wordWrap)
            nexacro.__setDOMStyle_WordWrap(handle_style, this.wordWrap);
    };

    _pTabBarItemSetControlElement.setFixedArea = function (width, height, is_horizontal_direction)
    {
        this._fixed_container_width = width;
        this._fixed_container_height = height;
        this._is_horizontal_direction = is_horizontal_direction;

        let scroll_width, scroll_height, scroll_left, scroll_top;

        if (is_horizontal_direction)
        {
            scroll_width = this.client_width - width;
            scroll_height = height;
            scroll_left = width;
            scroll_top = this.client_top;
        } else
        {
            scroll_width = width;
            scroll_height = this.client_height - height;
            scroll_left = this.client_left;
            scroll_top = height;
        }

        this._scroll_container_width = Math.max(0, scroll_width);
        this._scroll_container_height = Math.max(0, scroll_height);

        if (this._fixed_container_element)
        {
            this._fixed_container_element.setElementPosition(this.client_left, this.client_top);
            this._fixed_container_element.setElementSize(width, height);
        }

        if (this._scroll_container_element)
        {
            this._scroll_container_element.setElementPosition(scroll_left, scroll_top);
            this._scroll_container_element.setElementSize(this._scroll_container_width, this._scroll_container_height);
        }
    };

    _pTabBarItemSetControlElement._on_updateClientRect = function ()
    {
        var client_left = 0;
        var client_top = 0;
        var client_width = this.inner_width;
        var client_height = this.inner_height;

        if (this._apply_client_padding)
        {
            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }
        }

        var zoomfactor = this.zoom / 100;
        var zclient_width = this._scroll_container_width / zoomfactor;
        var zclient_height = this._scroll_container_height / zoomfactor;

        var container_maxwidth = this.container_maxwidth;
        var container_maxheight = this.container_maxheight;

        var scroll_left = this.scroll_left;
        var scroll_top = this.scroll_top;

        var reset_vlimit = false;
        var reset_hlimit = false;

        var hscroll_limit = 0;
        var vscroll_limit = 0;

        if (container_maxwidth > zclient_width)
        {
            hscroll_limit = container_maxwidth - zclient_width;
        }

        if (container_maxheight > zclient_height)
        {
            vscroll_limit = container_maxheight - zclient_height;
        }

        if (this.hscroll_limit != hscroll_limit)
        {
            reset_hlimit = true;
            this.hscroll_limit = hscroll_limit;

            if (scroll_left > hscroll_limit && hscroll_limit >= 0)
            {
                this.setElementHScrollPos(hscroll_limit);
            }
        }

        if (this.vscroll_limit != vscroll_limit)
        {
            reset_vlimit = true;
            this.vscroll_limit = vscroll_limit;

            if (scroll_top > vscroll_limit && vscroll_limit >= 0)
            {
                this.setElementVScrollPos(vscroll_limit);
            }
        }

        var ret = 0;
        if (this.client_left != client_left || this.client_top != client_top)
        {
            this.client_left = client_left;
            this.client_top = client_top;
            ret = 1;
        }

        var cw = this.client_width != client_width;
        var ch = this.client_height != client_height;
        if (cw || ch)
        {
            this.client_width = client_width;
            this.client_height = client_height;
            ret += 2;
        }
        else if (reset_hlimit || reset_vlimit)
        {
            ret += 2;
        }
        return ret;
    };

    _pTabBarItemSetControlElement._updateClientRect = function ()
    {
        var ret = this._on_updateClientRect();
        if (ret & 1)
            this._on_change_clientPos(this.client_left, this.client_top);
        if (ret & 2)
            this._on_change_clientSize(this.client_width, this.client_height);
    };

    _pTabBarItemSetControlElement.setElementHScrollPos = function (pos)
    {
        this._scroll_container_element._setElementHScrollPos(pos);
        this.scroll_left = pos;
    };

    _pTabBarItemSetControlElement.setElementVScrollPos = function (pos)
    {
        this._scroll_container_element._setElementVScrollPos(pos);
        this.scroll_top = pos;
    };

    _pTabBarItemSetControlElement.setElementScrollMaxSize = function (width, height)
    {
        if (this.container_maxwidth != width || this.container_maxheight != height)
        {
            this.container_maxwidth = width;
            this.container_maxheight = height;

            if (this._scroll_container_element)
            {
                this._scroll_container_element.setElementScrollMaxSize(width, height);
            }
        }
        this._updateClientRect();
    };

    //======================================================================
    // nexacro.HTMLControlElement
    //======================================================================
    nexacro.HTMLControlElement = function (parent_elem)
    {
        nexacro.ControlElement.call(this, parent_elem);
    };

    var _pHTMLControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.HTMLControlElement);

    nexacro.HTMLControlElement.prototype = _pHTMLControlElement;

    _pHTMLControlElement._type_name = "HTMLControlElement";

    const loadScripts = async (scripts, node, id) =>
    {
        const loadScript = (script, node, id) => 
        {
            return new Promise((resolve, reject) => 
            {            
                const newScript = document.createElement('script');

                if (script.src)
                {
                    newScript.src = script.src;
                    newScript.defer = true;
                    newScript.type = script.type;
                    newScript.integrity = script.integrity;
                    newScript.crossOrigin = script.crossOrigin;

                    newScript.onload = () => resolve();
                    newScript.onerror =  (e) => {
                        const srcInfo = script.src || '[inline script]';
                        const errorMsg = `Failed to load script resource: ${srcInfo} in component ${id}`;
                        reject(new Error(errorMsg));
                    };

                    node.appendChild(newScript);
                    node.removeChild(newScript);
                }
                else
                {
                    try 
                    {
                        newScript.textContent = script.textContent;
                        const runInlineScript = new Function(script.textContent);
                        runInlineScript();
                        resolve();
                    }
                    catch (e)
                    {
                        const errorMsg = `Failed to execute inline script: ${e.message || e.toString()} in component ${id}`;
                        reject(new Error(errorMsg));
                    }
                }
            });
        };

        for (const script of scripts) 
        {
            try 
            {
                await loadScript(script, node, id);
            }
            catch (e)
            {
                if(e && e.message && trace)
                    trace(e);
            }
        }
    };

    _pHTMLControlElement.setElementHTML = async function (html)
    {
        const node = this.handle;
        if (!node)
            return false;

        if (!html)
            return false;

        html = nexacro._sanitize(html);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        if (doc)
        {
            node.innerHTML = doc.documentElement.innerHTML;
            
            const scripts = doc.documentElement.querySelectorAll('script');
            if (scripts)
            {
                await loadScripts(scripts, node, this.id);
            }
            return true;
        }
        return false;
    };

    _pHTMLControlElement.querySelector = function (selector)
    {
        if (this.handle)
        {
            return this.handle.querySelector(selector);
        }
        return undefined;
    };

    _pHTMLControlElement.querySelectorAll = function (selector)
    {
        if (this.handle)
        {
            return this.handle.querySelectorAll(selector);
        }
        return undefined;
    };

    _pHTMLControlElement.getElementById = function (id)
    {
        if (this.handle)
        {
            return this.handle.getElementById(id);
        }
        return undefined;
    };

    _pHTMLControlElement.getElementsByTagName = function (name)
    {
        if (this.handle)
        {
            return this.handle.getElementsByTagName(name);
        }
        return undefined;
    };

    _pHTMLControlElement.getElementsByClassName = function (name)
    {
        if (this.handle)
        {
            return this.handle.getElementsByClassName(name);
        }
        return undefined;
    };

    _pHTMLControlElement.getElementsByName = function (name)
    {
        if (this.handle)
        {
            return this.handle.getElementsByName(name);
        }
        return undefined;
    };
} // end of HTML


if (_process)
{
    _process = null;
    _pElement = null;
    __pEdgeImageElement = null;
    _pTextBoxElement = null;
    _pTextBoxVirtualFlexElement = null;
    _pImageElement = null;
    _pIconElement = null;
    _pIconTextElement = null;
    _pTextAreaElement = null;
    __pFrameResizeBorderElement = null;
    _pModalOverlayElement = null;
    _pControlElement = null;
    _pInputElement = null;
    _pFrameControlElement = null;
    _pScrollableControlElement = null;
    __pContainerElement = null;
    _pPluginElement = null;
    __pPluginObject = null;
    __pWebBrowserPluginElement = null;
    __pVideoPlayerPluginElement = null;
    _pCanvasElement = null;
    __pCanvasGradient = null;
    _pGridScrollableControlElement = null;
    _pGridBandControlElement = null;
    __pGridBandContainerElement = null;
    _pGridRowControlElement = null;
    _pCellControlElement = null;
    _pHTMLControlElement = null;
}
