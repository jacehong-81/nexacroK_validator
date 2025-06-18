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
    "use strict";
    var _process = true;

    if (!nexacro.Element)
    {
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
        // Nexacro N Element
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

        //==== for common style =========//        
        _pElement.color = null;
        _pElement.font = null;
        _pElement.textDecoration = null;
        _pElement.wordSpacing = null;
        _pElement.letterSpacing = null;
        _pElement.pointerEvent = "";

        //==== internal handles =========//
        _pElement.handle = null;		// HTML DOM Element Handle
        _pElement.owner_elem = null;

        //==== default flags =========//
        _pElement._is_nc_element = false;
        _pElement._is_input_element = false;

        //==== css selector =========//
        _pElement.typeselector = "";
        _pElement.classselector = "";
        _pElement.idselector = "";

        //==== end of initial =========//

        _pElement.clearContents = nexacro._emptyFn;

        _pElement.create = function (win)
        {
            // parent is always control element
            var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = nexacro.__createElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name);

                this._refreshCommonStyleProps(handle);

                // append TO Parent Element
                this.handle = handle;
                nexacro.__appendElementHandle(this._is_nc_element ? owner_elem.handle : owner_elem.dest_handle, handle);
            }
        };

        _pElement._refreshCommonStyleProps = function (handle)
        {
            if (!this.visible)
                nexacro.__setElementHandleVisible(handle, false);
            if (this.display == "none")
                nexacro.__setElementHandleVisible(handle, false);
            if (this.color)
                nexacro.__setElementHandleColorObject(handle, this.color);
            if (this.font)
                nexacro.__setElementHandleFontObject(handle, this.font);
            if (this.wordSpacing)
                nexacro.__setElementHandleWordSpacingObject(handle, this.wordSpacing);
            if (this.letterSpacing)
                nexacro.__setElementHandleLetterSpacingObject(handle, this.letterSpacing);
            if (this.textDecoration)
                nexacro.__setElementHandleTextDecorationObject(handle, this.textDecoration);
            if (this.wordWrap)
                nexacro.__setElementHandleWordwrapObject(handle, this.wordWrap);
            if (this.pointerEvent)
                nexacro.__setElementHandlePointerEvents(handle, this.pointerEvent);
            if (this.rtl !== undefined)
                nexacro.__setElementHandleRtlDirection(handle, this.rtl);
        };

        _pElement.destroy = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                //var owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
                var dest_handle = (this.owner_elem ? this.owner_elem.dest_handle : null);

                if (dest_handle)
                    nexacro.__destroyElementHandle(dest_handle, handle);

                this.owner_elem = null;
                this.handle = null;
            }
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

        _pElement._destroyElementHandle = function (_is_stepcontainer_for_layoutchange)
        {
            var handle = this.handle;
            var owner_elem = this.owner_elem;
            if (handle)
            {
                var owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
                if (owner_elem && owner_elem.handle)
                {
                    owner_handle = owner_elem.handle;
                    nexacro.__destroyElementHandle(owner_handle, handle, _is_stepcontainer_for_layoutchange);
                }
            }
            this.owner_elem = null;
            this.handle = null;
        };

        _pElement._appendToContainer = function (owner_elem)
        {
            var handle = this.handle;
            if (handle && owner_elem.handle && this.owner_elem == null)
            {
                this.owner_elem = owner_elem;
                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
            }
        };


        _pElement._insertToContainer = function (owner_elem, before_elem)
        {
            var handle = this.handle;
            if (handle && owner_elem.handle && this.owner_elem == null)
            {
                nexacro.__insertElementHandle(owner_elem.dest_handle, handle, before_elem.handle);
            }
        };

        _pElement._removeFromContainer = function ()
        {
            var owner_elem = this.owner_elem;
            if (owner_elem)
            {
                this.owner_elem = null;
                var handle = this.handle;
                if (handle && owner_elem.handle)
                {
                    nexacro.__unlinkElementHandle(owner_elem.dest_handle, handle);
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

        _pElement._getWindowHandle = function ()
        {
            return this._getRootWindowHandle();
        };

        _pElement._isRtl = function (bPosition)
        {
            var elem = bPosition ? (this.parent_elem ? this.parent_elem : this.linkedcontrol.getElement()) : this;
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
            var bPositionRtl = this._isRtl(true);
            //var bRtl = this._isRtl();

            if (handle)
            {
                //var handle_style = handle.style;

                if (typeof prop == "number")
                {
                    var left = nexacro.__getElementHandlePositionLeft(handle);

                    if (!((left == prop) ^ bPositionRtl))
                    {
                        ret = true;
                    }
                }
                //else
                //{
                //    var type_name = prop._type_name;
                //    switch (type_name)
                //    {
                //        case "BorderRadiusObject":
                //            break;
                //        case "BorderObject":
                //            {
                //                if (handle_style.left && !((handle_style.borderLeft == prop.left.value) ^ bRtl))
                //                {
                //                    ret = true;
                //                }
                //            }
                //            break;
                //        case "BKGradientObject":
                //            break;
                //        case "MarginObject":
                //            break;
                //        case "PaddingObject":
                //            break;
                //        case "AlignObject":
                //            break;
                //        case "ShadowObject":
                //            break;
                //        case "UrlObject":
                //            if (handle.src === undefined)
                //            {
                //                if (prop._sysrtlurl && bRtl && (handle_style.backgroundImage.indexOf(prop._sysrtlurl) > -1))
                //                {
                //                    ret = true;
                //                }
                //            }
                //            else
                //            {
                //                if (prop._sysrtlurl && !((handle.src == prop._sysurl) ^ bRtl))
                //                {
                //                    ret = true;
                //                }
                //            }
                //            break;
                //        default:
                //            break;
                //    }
                //}
            }
            return ret;
        };

        _pElement._getRTLPositionLeft = function (left, width)
        {
            var bPositionRtl = this._isParentRtl();
            var rtlLeft = left;
            var owner_elem = this.owner_elem;
            var parent_width = 0;
            //var gap = owner_elem.width - owner_elem.inner_width;
            if (bPositionRtl)
            {
                if (owner_elem)
                {
                    parent_width = owner_elem.width;
                    //var paddingwidth = owner_elem.inner_width - owner_elem.client_width;

                    if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                    {
                        if (owner_elem instanceof nexacro._Window)
                        {
                            var win = this._getWindow();
                            var client_width = nexacro._getWindowHandleClientWidth(win.handle);

                            parent_width = (parent_width == client_width) ? parent_width : client_width;
                        }
                    }
                    if (owner_elem instanceof nexacro.ControlElement)
                    {
                        if (this._is_nc_element || owner_elem._is_simple_control)
                        {
                            parent_width = owner_elem.inner_width;
                        }
                        else
                        {
                            if (this instanceof nexacro.FrameControlElement)
                            {
                                var win = this._getWindow();
                                parent_width = win.getClientWidth();

                                if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                                {
                                    if (this.parent_elem.linkedcontrol instanceof nexacro.MainFrame)
                                    {
                                        var client_width = nexacro._getWindowHandleClientWidth(win.handle);
                                        parent_width = (parent_width == client_width) ? parent_width : client_width;
                                    }
                                }
                            }
                            else 
                            {
                                parent_width = owner_elem.client_width;
                            }
                        }
                    }

                    //var parent_width = owner_elem.client_width;

                    /* if (this instanceof nexacro.ControlElement && owner_elem instanceof nexacro.ScrollableControlElement)
                     {
                         trace(1);
                         //   parent_width = Math.max(parent_width, this.parent_elem.container_maxwidth);
                     }
                     else if (this instanceof nexacro._ContainerElement && owner_elem instanceof nexacro.ScrollableControlElement)
                     {
                         trace(2);
                         parent_width = owner_elem.container_maxwidth;
                     }
                     else if (this instanceof nexacro._ContainerElement)
                     {
                         trace(3);
                         if (this.parent_elem.parent instanceof nexacro.TextArea)
                         {
                         }
                         else
                         {
                             this.setElementHScrollPos(this._scroll_left, true);
                         }
                     }
                     else { trace(4) };*/
                    // border만큼 여백 생기는 문제  
                }
                else
                {
                    var _win = this._getWindow();
                    parent_width = _win.getClientWidth();
                }

                ////스크롤이 왼쪽에 생기므로 left를 더해주는게 맞다는 판단; 다만 모든곳에서 다 호출하므로 영향도 고려하여 조건 넣음;
                ////최종적으로는 Element 타입에 따라 세밀한 조정이 있을지도...
                //if (owner_elem instanceof nexacro.ScrollableControlElement && owner_elem.parent instanceof nexacro.TextArea)
                ////if (owner_elem instanceof nexacro.ScrollableControlElement )
                //{
                //    rtlLeft = parent_width - width + left;
                //}
                //else
                {
                    rtlLeft = parent_width - width - left;
                }

                //                trace("this : " + (this.linkedcontrol ? this.linkedcontrol.name : this) + "// owner_elem : " + (owner_elem.linkedcontrol ? owner_elem.linkedcontrol.name : owner_elem) + " // parent_elem : " + ((this.parent_elem && this.parent_elem.linkedcontrol) ? this.parent_elem.linkedcontrol.name : this.parent_elem));
                //trace("\nconversion : " + parent_width + " " + width + " " + left + " " + rtlLeft);
            }

            //delete owner_elem;
            //owner_elem = null;

            return rtlLeft;
        };

        _pElement._getRTLContainerPositionLeft = function (left, width)
        {
            //var rtlleft = left;
            var parent_width = this.inner_width;
            var rtlleft = parent_width - width - left;
            return rtlleft;
        };

        _pElement._getRtlScrollLeft = function (scrollLeft, parentWidth)
        {
            scrollLeft = this.getElementScrollWidth() - parentWidth - scrollLeft;
            return scrollLeft;
        };

        //-----------------------------------------------------------------------------
        // Fluid Layout
        //-----------------------------------------------------------------------------
        _pElement.setElementLayoutType = nexacro._emptyFn;
        _pElement.setElementLayoutFluidPos = nexacro._emptyFn;
        _pElement.setElementLayoutHorizontalGap = nexacro._emptyFn;
        _pElement.setElementLayoutVerticalGap = nexacro._emptyFn;
        _pElement.setElementFlexMainAxisAlign = nexacro._emptyFn;
        _pElement.setElementFlexCrossAxisAlign = nexacro._emptyFn;
        _pElement.setElementFlexCrossAxisWrapAlign = nexacro._emptyFn;
        _pElement.setElementTableCellAlign = nexacro._emptyFn;
        _pElement.setElementTableCellinCompAlign = nexacro._emptyFn;
        _pElement.setElementFlexWrap = nexacro._emptyFn;
        _pElement.setElementTableTemplate = nexacro._emptyFn;
        _pElement.setElementTableTemplateArea = nexacro._emptyFn;
        _pElement.setElementTableDirection = nexacro._emptyFn;
        _pElement.setElementLayoutSpacing = nexacro._emptyFn;
        //_pElement.clearElementPosition = nexacro._emptyFn;
        _pElement._setElementLayoutType = nexacro._emptyFn;
        _pElement._setElementLayoutPosition = nexacro._emptyFn;

        _pElement._setElementLayoutHorizontalGap = nexacro._emptyFn;
        _pElement._setElementLayoutVerticalGap = nexacro._emptyFn;

        _pElement._setElementFlexMainAxisAlign = nexacro._emptyFn;

        _pElement._setElementFlexCrossAxisAlign = nexacro._emptyFn;
        _pElement._setElementFlexCrossAxisWrapAlign = nexacro._emptyFn;
        _pElement._setElementFlexWrap = nexacro._emptyFn;
        _pElement._setElementLayoutSpacing = nexacro._emptyFn;
        _pElement._setElementTableCellAlign = nexacro._emptyFn;
        _pElement._setElementTableCellinCompAlign = nexacro._emptyFn;
        _pElement._setElementTableDirection = nexacro._emptyFn;
        _pElement._setElementTableTemplate = nexacro._emptyFn;
        _pElement._setElementTableTemplateArea = nexacro._emptyFn;

        //////////////////////////////////////////////////////////////////////////
        _pElement.setElementPosition = function (left, top)
        {
            /*
            if (this.linkedcontrol)
            {
                trace("setElementPosition", this.linkedcontrol.id, left, top);
                nexacro._traceV8CallStack();
            }
            */
            if (this.left != left || this.top != top)// || bUpdate)
            {
                this.left = left;
                this.top = top;
                var handle = this.handle;
                if (handle)
                {
                    var newLeft = this._getRTLPositionLeft(left, this.width);
                    if (newLeft || top)
                    {
                        nexacro.__setElementHandlePosition(handle, newLeft, top);
                    }
                    else
                    {
                        nexacro.__clearElementHandlePosition(handle);
                    }
                }
            }
        };
        _pElement.clearElementPosition = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__clearElementHandlePosition(handle);
                //nexacro.__clearElementHandleSize(handle);
            }
        };

        _pElement.setElementSize = function (width, height, update)
        {
            if (this.width != width || this.height != height || update)
            {
                this.width = width;
                this.height = height;
                if (width < 0) width = 0;
                if (height < 0) height = 0;

                var handle = this.handle;
                if (handle)
                {
                    var bPositionRtl = this._isParentRtl();
                    if (bPositionRtl)
                    {
                        var newLeft = this._getRTLPositionLeft(this.left, width);
                        if (newLeft || this.top)
                        {
                            nexacro.__setElementHandlePosition(handle, newLeft, this.top);
                        }
                        else
                            nexacro.__clearElementHandlePosition(handle);
                    }

                    if (width && height)
                        nexacro.__setElementHandleSize(handle, width, height);
                    else
                        nexacro.__clearElementHandleSize(handle);
                }
            }
        };

        _pElement.setElementVisible = function (visible)
        {
            if (this.visible != visible)
            {
                this.visible = visible;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleVisible(handle, visible);
                }
            }
        };

        _pElement.setElementRtl = function (rtl)
        {
            if (this.rtl != rtl)
            {
                this.rtl = rtl;
                var handle = this.handle;
                if (handle)
                {
                    //                    trace((this.linkedcontrol? this.linkedcontrol.name : "not component : ") + " " + rtl);
                    nexacro.__setElementHandleRtlDirection(handle, rtl);
                }
                //this._updateClientRect();
            }
        };

        //_pElement.setElementTypeCSSSelector = function (typename)
        //{
        //    if (this.typeselector != typename)
        //    {
        //        this.typeselector = typename;

        //        var handle = this.handle;
        //        if (handle)
        //        {
        //            nexacro.__setElementHandleCSSClassName(handle, this._getElementClassName());
        //        }
        //    }
        //};

        //_pElement.setElementClassCSSSelector = function (classname)
        //{
        //    if (this.classselector != classname)
        //    {
        //        this.classselector = classname;

        //        var handle = this.handle;
        //        if (handle)
        //        {
        //            nexacro.__setElementHandleCSSClassName(handle, this._getElementClassName());
        //        }
        //    }
        //};
        _pElement.setElementTypeCSSSelector = function (typename)
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
                        nexacro.__setElementHandleCSSClassName(handle, classname);
                    }
                }
            }
        };

        _pElement.setElementClassCSSSelector = function (classname)
        {
            if (this.classselector != classname)
            {
                this.classselector = classname;
                if (classname)
                {
                    var _classname = this._getElementClassName();
                    if (this._classname != _classname)
                    {
                        this._classname = _classname;
                        var handle = this.handle;
                        if (handle)
                        {
                            nexacro.__setElementHandleCSSClassName(handle, _classname);
                        }
                    }
                }
            }
        };


        _pElement.setElementTextAlignByClassCSSSelector = function (textalign)
        {
            var classselector = "nexacenteralign";
            if (this._isRtl())
            {
                if (textalign == "left")
                    classselector = "nexarightalign";
                else if (textalign == "right")
                    classselector = "nexaleftalign";
            }
            else
            {
                if (textalign == "left")
                    classselector = "nexaleftalign";
                else if (textalign == "right")
                    classselector = "nexarightalign";
            }

            this.setElementClassCSSSelector(classselector);
        };

        _pElement._setElementHandleTextAlign = function (handle, textalign, rtl)
        {
            if (handle)
            {
                if (rtl)
                    textalign = ((textalign == "left") ? "right" : (textalign == "right" ? "left" : textalign));

                nexacro.__setElementHandleTextAlign(handle, textalign);
            }
        };

        // Ex> Button btn1 btn1_cssclass
        _pElement._getElementClassName = function ()
        {
            var classname = this.typeselector;

            if (this.idselector)
                classname += " " + this.idselector;

            if (this.rtl)
                classname += " nexartl";

            if (this.classselector)
                classname += " " + this.classselector;

            return classname;
        };

        _pElement.setElementStatus = function (status)
        {
            if (this.status != status)
            {
                this.status = status;

                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleStatus(handle, status);
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
                    nexacro.__setElementHandleUserStatus(handle, userstatus);
                }
            }
        };

        // font like -- inhereted to Child / from Parent
        _pElement.setElementColor = function (color)
        {
            this.color = color;
            if (this.handle)
            {
                nexacro.__setElementHandleColorObject(this.handle, color);
            }
        };

        _pElement.setElementFont = function (font)
        {
            this.font = font;
            if (this.handle)
            {
                nexacro.__setElementHandleFontObject(this.handle, font);
            }
        };

        _pElement.setElementTextDecoration = function (decoration)
        {
            this.textDecoration = decoration;
            if (this.handle)
            {
                nexacro.__setElementHandleTextDecorationObject(this.handle, decoration);
            }
        };

        _pElement.setElementWordSpacing = function (wordspacing)
        {
            this.wordSpacing = wordspacing;
            if (this.handle)
            {
                nexacro.__setElementHandleWordSpacingObject(this.handle, wordspacing);
            }
        };
        _pElement.setElementLetterSpacing = function (letterspacing)
        {
            this.letterSpacing = letterspacing;
            if (this.handle)
            {
                nexacro.__setElementHandleLetterSpacingObject(this.handle, letterspacing);
            }
        };

        _pElement.setElementOverflow = nexacro._emptyFn;
        _pElement.setElementClipPath = nexacro._emptyFn;
        _pElement.setElementFlexGrow = nexacro._emptyFn;

        _pElement.setElementPointerEvents = function (pointerevent)
        {
            if (this.pointerEvent != pointerevent)
            {
                this.pointerEvent = pointerevent;

                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandlePointerEvents(handle, pointerevent);
            }
        };

        _pElement._getWindow = function ()
        {
            return this.linkedcontrol._getWindow();
        };

        _pElement._getComputedStyle = function (/*prop*/)
        {
            /*
            if (this.handle)
            {
                var propval1 = nexacro.__getElementHandleStyleValue(this.handle, prop1);
                var propval2 = nexacro.__getElementHandleStyleValue(this.handle, prop1);

                return { prop1: propval1, prop2: propval2 };
            }
            */
        };

        _pElement._getComputedStyleValue = function (prop)
        {
            if (this.handle && prop)
            {
                return nexacro.__getElementHandleStyleValue(this.handle, prop);
            }
        };
        _pElement._getComputedStyleSubValue = function (prop, subprop)
        {
            if (this.handle && prop && subprop)
            {
                return nexacro.__getElementHandleStyleSubValue(this.handle, prop, subprop);
            }
        };
        _pElement._getComputedStyleWithCallback = function (prop, target_win_handle, target_node_hanlde)
        {
            if (this.handle && prop)
            {
                return nexacro.__getElementHandleStyleValueWithCallback(this.handle, prop, target_win_handle, target_node_hanlde);
            }
        };

        _pElement._getComputedStyleBackgroundColor = nexacro._emptyFn;
        _pElement.setElementAccessibilityRole = nexacro._emptyFn;
        _pElement.setElementAccessibilityLabel = nexacro._emptyFn;
        _pElement.setElementAccessibilityDescription = nexacro._emptyFn;
        _pElement.setElementAccessibilityAction = nexacro._emptyFn;
        _pElement.setElementAccessibilityFlagReadOnly = nexacro._emptyFn;
        _pElement.setElementAccessibilityStatHidden = nexacro._emptyFn;
        _pElement.getElementCaretPos = nexacro._emptyFn;
        _pElement._change_to_keypad_type = nexacro._emptyFn;
        // coordinate info
        _pElement._getPositionInWindow = function ()
        {
            return nexacro._getElementXYInWindow(this.handle);
        };

        _pElement._getOverflowScrollSize = function ()
        {
            return 0;
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

        //==== defaule values =========//
        // basic element attrubutes
        _pTextBoxElement.text = "";
        _pTextBoxElement._use_decoration = false;

        _pTextBoxElement.padding = null;
        _pTextBoxElement.textAlign = null;
        _pTextBoxElement.verticalAlign = null;

        _pTextBoxElement.wordWrap = null;
        _pTextBoxElement._wordwrap_info = null;

        _pTextBoxElement.typeselector = "nexacontentsbox";

        //==== default flags =========//
        _pTextBoxElement._use_newline = true;

        //==== end of initial =========//

        _pTextBoxElement.create = function (win)
        {
            // parent is always control element
            // this is always NO nc_element
            var owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var width = this.width;
                var height = this.height;

                if (width < 0) width = 0;
                if (height < 0) height = 0;

                var handle = nexacro.__createTextElementHandle(this, win_handle, left, this.top, width, height, this._getElementClassName(), this.name);

                nexacro.__initTextElementText(handle, this.text, this._use_newline, this._use_decoration, this.wordWrap || this._wordwrap_info);

                this._refreshCommonStyleProps(handle);

                if (this.textAlign)
                    this._setElementHandleTextAlign(handle, this.textAlign, this.rtl);
                if (this.verticalAlign)
                    nexacro.__setElementHandleVerticalAlign(handle, this.verticalAlign);

                // append TO Parent Element
                this.handle = handle;
                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
            }
        };


        _pTextBoxElement.setElementTextAlign = function (textalign)
        {
            this.textAlign = textalign;
            var handle = this.handle;
            if (handle)
            {
                this._setElementHandleTextAlign(handle, textalign, this.rtl);
            }
        };

        _pTextBoxElement.setElementVerticalAlign = function (verticalalign)
        {
            this.verticalAlign = verticalalign;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleVerticalAlign(handle, verticalalign);
            }
        };


        _pTextBoxElement.setElementPadding = function (/*padding*/)
        {
            /*
            this.padding = padding;		    
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandlePaddingObject(handle, this.padding);
            }
            */
        };

        _pTextBoxElement.setElementSize = function (width, height, update)
        {
            if (this.width != width || this.height != height || update)
            {
                this.width = width;
                this.height = height;
                if (width < 0) width = 0;
                if (height < 0) height = 0;

                var handle = this.handle;
                if (handle)
                {
                    var bPositionRtl = this._isParentRtl();
                    if (bPositionRtl)
                    {
                        var newLeft = this._getRTLPositionLeft(this.left, width);
                        if (newLeft || this.top)
                        {
                            nexacro.__setElementHandlePosition(handle, newLeft, this.top);
                        }
                        else
                            nexacro.__clearElementHandlePosition(handle);
                    }

                    if (width >= 0 && height >= 0)
                        nexacro.__setElementHandleSize(handle, width, height);
                    else
                        nexacro.__clearElementHandleSize(handle);
                }
            }
        };

        _pTextBoxElement.setElementText = function (text)
        {
            if (this.text != text || this._use_decoration == true)
            {
                if (text == null)
                    this.text = "";
                else
                    this.text = text;

                this._use_decoration = false;

                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleText(handle, this.text, this._use_newline, this.wordWrap || this._wordwrap_info);
                }
            }
        };

        _pTextBoxElement.setElementDecorateText = function (text)
        {
            if (this.text != text || this._use_decoration == false)
            {
                if (text == null)
                    this.text = "";
                else
                    this.text = text;

                this._use_decoration = true;

                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleDecorateText(handle, text);
                }
            }
        };

        _pTextBoxElement.setElementWordWrap = function (wordwrap)
        {
            if (this.wordWrap != wordwrap)
            {
                var oldwordwrap = this.wordWrap || this._wordwrap_info;
                this.wordWrap = wordwrap;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleWordwrapObject(handle, wordwrap);
                    if (this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                    {
                        nexacro.__setElementHandleText(handle, this.text, this._use_newline, this.wordWrap || this._wordwrap_info);
                    }
                }
            }
        };


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
                        nexacro.__setElementHandleText(handle, this.text, this._use_newline, this.wordWrap || this._wordwrap_info);
                    }
                }
            }
        };


        _pTextBoxElement._getComputedStyle = function (prop, noflush)
        {
            if (this.handle && prop)
            {
                if (!noflush)
                {
                    if (nexacro._Browser == "Runtime")
                    {
                        var parent = this;
                        while (parent)
                        {
                            if (parent.linkedcontrol)
                            {
                                nexacro._flushCommand(parent._getWindow());
                                break;
                            }
                            parent = parent.parent;
                        }
                    }
                }
                var computedstyle = nexacro.__getElementHandleStyleValue(this.handle, prop);
                return computedstyle;
            }
        };

        _pTextBoxElement._getComputedStyleAlign = function (noflush)
        {
            var align = { textAlign: "", verticalAlign: "" };
            align.textAlign = this._getComputedStyle("text-align", noflush);
            align.verticalAlign = this._getComputedStyle("vertical-align", noflush);
            return align;
        };

        _pTextBoxElement.setElementMove = function (left, top, width, height, bforce)
        {
            this.setElementPosition(left, top, bforce);
            this.setElementSize(width, height);
        };

        nexacro.TextBoxFlexElement = nexacro.TextBoxElement;
        nexacro.TextBoxVirtualFlexElement = nexacro.TextBoxFlexElement;

        // _pTextBoxElement.setElementTextOverFlow = nexacro._emptyFn;

        //======================================================================
        // nexacro.IconElement - this Element
        // this Image : No Stretch && Align from Size Box
        //======================================================================
        nexacro.IconElement = function (parent_elem, id, fiticonsize)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
            this.id = id;
            this._p_name = this.parent_elem.name + ":" + (id || "icon");

            this._fiticonsize = fiticonsize;
        };
        var _pIconElement = nexacro._createPrototype(nexacro.Element, nexacro.IconElement);
        nexacro.IconElement.prototype = _pIconElement;

        _pIconElement._type_name = "IconElement";

        _pIconElement.typeselector = "nexacontentsbox";

        //==== defaule values =========//
        _pIconElement.padding = null;
        _pIconElement.textAlign = null;
        _pIconElement.verticalAlign = null;
        _pIconElement.icon = "";

        //==== default flags =========//
        //==== end of initial =========//


        _pIconElement.create = function (win)
        {
            // parent is always control element
            // this is always NO nc_element
            var owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = nexacro.__createIconTextElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name);

                var icon = this.icon;
                if (icon && icon.value != "none")
                {
                    if (this._fiticonsize)
                        nexacro.__initElementIcon(handle, icon.value, icon._sysurl, Math.min(this.height, this.width));
                    else
                        nexacro.__initElementIcon(handle, icon.value, icon._sysurl);
                }

                this._refreshCommonStyleProps(handle);

                if (this.textAlign)
                    this._setElementHandleTextAlign(handle, this.textAlign, this.rtl);
                if (this.verticalAlign)
                    nexacro.__setElementHandleVerticalAlign(handle, this.verticalAlign);

                // append TO Parent Element
                this.handle = handle;
                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
            }
        };


        /////////////////////////////////
        _pIconElement.setElementTextAlign = function (textalign)
        {
            if (this.textAlign != textalign)
            {
                this.textAlign = textalign;

                var handle = this.handle;
                if (handle)
                    this._setElementHandleTextAlign(handle, textalign || "center", this.rtl);
            }
        };

        _pIconElement.setElementVerticalAlign = function (verticalalign)
        {
            if (this.verticalAlign != verticalalign)
            {
                this.verticalAlign = verticalalign;

                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleVerticalAlign(handle, verticalalign || "middle");
            }
        };

        _pIconElement.setElementIcon = function (icon)
        {
            if (this.icon != icon)
            {
                this.icon = icon;
                var handle = this.handle;
                if (handle)
                {
                    if (icon && icon.value != "none")
                    {
                        if (this._fiticonsize)
                            nexacro.__setElementHandleIconObject(handle, icon, (Math.min(this.height, this.width) || 16));
                        else
                            nexacro.__setElementHandleIconObject(handle, icon);
                    }
                    else
                    {
                        nexacro.__setElementHandleIconObject(handle, "");
                    }
                }
            }
        };

        /*
        _pIconElement._getComputedStyle = function ()
        {
            var handle = this.handle;

            return { textAlign: "center", verticalAlign: "middle" };
        };
        */

        //end of nexacro.IconElement

        //==============================================================================
        // nexacro.IconText : nexacro Element's basic flags & Utility Functions
        // IconTextElement's Node size control is always fitToParent
        // move text by padding & align
        //type = 1 text only
        //type = 2 IconUrl only
        //type = 3 IconUrl + text
        //==============================================================================
        nexacro.IconTextElement = function (parent_elem, id, fiticonsize)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
            this.id = id;
            this._p_name = this.parent_elem.name + ":" + (id || "contents");

            this._fiticonsize = fiticonsize;
        };

        var _pIconTextElement = nexacro._createPrototype(nexacro.Element, nexacro.IconTextElement);
        nexacro.IconTextElement.prototype = _pIconTextElement;

        _pIconTextElement._type_name = "IconTextElement";
        _pIconTextElement.typeselector = "nexacontentsbox";

        //==== defaule values =========//
        // basic element attrubutes
        _pIconTextElement.text = "";
        _pIconTextElement.icon = null;
        _pIconTextElement.iconPos = "left";
        _pIconTextElement.padding = null;
        _pIconTextElement.textAlign = null;
        _pIconTextElement.verticalAlign = null;
        _pIconTextElement.textwidth = 0;
        _pIconTextElement.wordWrap = null;
        _pIconTextElement._wordwrap_info = null;
        // internal use

        //==== default flags =========//
        _pIconTextElement._use_decoration = false;
        _pIconTextElement._use_newline = true;
        //==== end of initial =========//

        _pIconTextElement.create = function (win)
        {
            // parent is always control element
            // this is always NO nc_element
            var owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();

                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = nexacro.__createIconTextElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName());

                var textPadding = this.textPadding;
                if (textPadding)
                {
                    if (this.rtl)
                        nexacro.__initIconTextElementTextPadding(handle, textPadding.top, textPadding.left, textPadding.bottom, textPadding.right);
                    else
                        nexacro.__initIconTextElementTextPadding(handle, textPadding.top, textPadding.right, textPadding.bottom, textPadding.left);
                }

                nexacro.__initIconTextElementText(handle, this.text, this._use_newline, this._use_decoration, this.wordWrap || this._wordwrap_info);

                var icon = this.icon;
                if (icon)
                {
                    if (this._fiticonsize)
                        nexacro.__initElementIcon(handle, icon.value, icon._sysurl, Math.min(this.height, this.width));
                    else
                        nexacro.__initElementIcon(handle, icon.value, icon._sysurl);
                }

                this._refreshCommonStyleProps(handle);

                //              if (this.iconPos)  // iconPosition 이 undefined 일 경우 NRE 엔진에서 rtl 처리가 되어 있음
                {
                    if (this.rtl)
                    {
                        var iconpos = ((this.iconPos == "left") ? "right" : (this.iconPos == "right" ? "left" : this.iconPos));

                        nexacro.__initIconTextElementIconPos(handle, iconpos);
                    }
                    else
                        nexacro.__initIconTextElementIconPos(handle, this.iconPos);
                }



                if (this.textAlign)
                    this._setElementHandleTextAlign(handle, this.textAlign, this.rtl);
                if (this.verticalAlign)
                    nexacro.__setElementHandleVerticalAlign(handle, this.verticalAlign);
                if (this.textwidth)
                    nexacro.__setElementHandleTextWidth(handle, this.textwidth);

                // append TO Parent Element
                this.handle = handle;
                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
            }
        };

        _pIconTextElement.setElementTextAlign = function (textalign)
        {
            if (this.textAlign != textalign)
            {
                this.textAlign = textalign;

                var handle = this.handle;
                if (handle)
                {
                    this._setElementHandleTextAlign(handle, textalign, this.rtl);
                }
            }
        };

        _pIconTextElement.setElementVerticalAlign = function (verticalalign)
        {
            if (this.verticalAlign != verticalalign)
            {
                this.verticalAlign = verticalalign;

                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleVerticalAlign(handle, verticalalign);
                }
            }
        };

        _pIconTextElement.setElementTextPadding = function (textpadding)
        {
            if (this.textPadding != textpadding)
            {
                this.textPadding = textpadding;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleTextPaddingObject(handle, textpadding);
                }
            }
        };

        _pIconTextElement.setElementTextWidth = function (textwidth)
        {
            if (this.textwidth != textwidth)
            {
                this.textwidth = textwidth;
                var handle = this.handle;
                if (handle)
                {
                    if (textwidth)
                    {
                        nexacro.__setElementHandleTextWidth(handle, textwidth);
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

                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleText(handle, text, this._use_newline, this.wordWrap || this._wordwrap_info);
                }
            }
        };

        _pIconTextElement.setElementDecorateText = function (text)
        {
            if (this.text != text || this._use_decoration == false)
            {
                this.text = text;
                this._use_decoration = true;

                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleDecorateText(handle, text);
                }
            }
        };

        _pIconTextElement.setElementIcon = function (icon)
        {
            if (this.icon != icon)
            {
                if (icon && icon.value == "none")
                    icon = undefined

                this.icon = icon;
                var handle = this.handle;
                if (handle)
                {
                    if (this._fiticonsize)
                        nexacro.__setElementHandleIconObject(handle, icon, (Math.min(this.height, this.width) || 16));
                    else
                        nexacro.__setElementHandleIconObject(handle, icon);
                }
            }
        };

        _pIconTextElement.setElementIconPos = function (iconpos)
        {
            if (this.iconPos != iconpos)
            {
                this.iconPos = iconpos;

                var handle = this.handle;
                if (handle)
                {
                    if (this.rtl)
                        iconpos = ((iconpos == "left") ? "right" : (iconpos == "right" ? "left" : iconpos));

                    nexacro.__setElementHandleIconPos(handle, iconpos);
                }
            }
        };

        _pIconTextElement.setElementWordWrap = function (wordwrap)
        {
            if (this.wordWrap != wordwrap)
            {
                var oldwordwrap = this.wordWrap || this._wordwrap_info;
                this.wordWrap = wordwrap;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleWordwrapObject(handle, wordwrap);
                    if (this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                    {
                        nexacro.__setElementHandleText(handle, this.text, this._use_newline, this.wordWrap || this._wordwrap_info);
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
                        nexacro.__setElementHandleText(handle, this.text, this._use_newline, this.wordWrap || this._wordwrap_info);
                    }
                }
            }
        };

        /*
        _pIconTextElement._getComputedStyle = function ()
        {
            var handle = this.handle;

            return { textAlign: "center", verticalAlign: "middle" };
        };
        */

        //end of nexacro.IconTextElement

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
        //==== internal handles =========//
        //==== default flags =========//
        //_pImageElement._is_nc_element = false;
        //==== end of initial =========//

        _pImageElement.create = function (win)
        {
            // parent is always control element
            // this is always NO nc_element
            var owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = nexacro.__createImageElementHandle(this, win_handle, left, this.top, this.width, this.height, "", "", false, true);

                if (!this.visible)
                    nexacro.__setElementHandleVisible(handle, false);

                if (this.image)
                {
                    nexacro.__setElementHandleImageUrlObject(handle, this.image);
                }

                // append TO Parent Element
                this.handle = handle;
                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
            }
        };

        /*
        _pImageElement.setElementAlign = function (align)
        {
            this.align = align;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleAlignObject(handle, align);
            }
        };
       
        _pImageElement.setElementImage = function (image)
        {
            if (this.image != image) {
                this.image = image;

                var handle = this.handle;

                // load image
                if (handle && image) {
                    nexacro.__setElementHandleImageUrlObject(handle, image);
                }		            // 이미지 unload를 위해 null url에 대한 처리를 추가
                else {
                    nexacro.__setElementHandleImageUrlObject(handle, null);
                }
            }
        };
        */

        _pImageElement.setElementImage = function (image, width, height, stretch, comp)
        {
            if ((this.image != image) || (this.width != width || this.height != height || this.stretch != stretch))
            {
                this.image = image;
                var handle = this.handle;

                // load image
                if (handle && image)
                {
                    if (comp && comp.parent instanceof nexacro.ImageViewer)
                    {
                        var service;
                        var org_src = comp._p_image.toString();
                        org_src = nexacro._getURIValue(org_src);

                        if (org_src.indexOf("theme://") >= 0)
                        {
                            service = nexacro._getServiceObject("theme::");
                        }
                        else
                        {
                            service = nexacro._getServiceObject(org_src);
                        }

                        if (service)
                            nexacro.__setElementHandleImageUrlObject(handle, image, comp.width, comp.height, stretch, true, service.cachelevel);
                        else
                            nexacro.__setElementHandleImageUrlObject(handle, image, comp.width, comp.height, stretch, true);
                    }
                    else
                    {
                        nexacro.__setElementHandleImageUrlObject(handle, image, width, height, stretch, false);
                    }
                }   // 이미지 unload를 위해 null url에 대한 처리를 추가
                else
                {
                    nexacro.__setElementHandleImageUrlObject(handle, null);
                }
            }
        };

        _pImageElement.getImageCount = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                return nexacro.__getImageElementHandleImageCount(handle);
            }
        };

        _pImageElement.setImageIndex = function (nIndex)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setImageElementHandleImageIndex(handle, nIndex);
            }
        };

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
        _pInputElement.maxlength = 0;
        _pInputElement.autoskip = false;
        _pInputElement.autoselect = false;
        _pInputElement.value = null;
        _pInputElement.defaultvalue = "";
        _pInputElement.displaynulltext = "";
        _pInputElement.displayinvalidtext = undefined;
        _pInputElement.tabindentsize = 4;
        _pInputElement.usesoftkeyboard = true;
        _pInputElement.inputtype = "text"; // ['text', 'password', 'number']
        _pInputElement.imeaction = "none";
        _pInputElement.usemultiline = false;

        _pInputElement._is_focused = false;
        _pInputElement._is_sys_focused = false;

        _pInputElement._is_input_element = true;
        _pInputElement._is_invalid_value = false;
        _pInputElement._is_insert_mode = false;

        _pInputElement._zerolength_value = undefined;
        _pInputElement._input_text = "";

        _pInputElement._checkmax_editing_only = true;
        _pInputElement._last_selection_range = null; // for blur

        _pInputElement._skip_check_imelocale = false;

        _pInputElement.create = function (win)
        {
            // parent is always control element
            // this is always NO nc_element
            var owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = this.handle = nexacro.__createInputElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, true, false);

                if (this.rtl !== undefined)
                    nexacro.__setElementHandleRtlDirection(handle, this.rtl);

                if (!this.visible)
                {
                    nexacro.__setElementHandleVisible(handle, false);
                }
                if (!this.enable)
                {
                    nexacro.__setElementHandleEnable(handle, false);
                }
                if (this.readonly)
                {
                    nexacro.__setElementHandleReadOnly(handle, true);
                }
                if (this.padding)
                {
                    nexacro.__setElementHandlePaddingObject(handle, this.padding);
                }
                if (this.textAlign)
                {
                    this._setElementHandleTextAlign(handle, this.textAlign, this.rtl);
                }
                if (this.caretcolor)
                {
                    nexacro.__setInputElementHandleCaretColor(handle, this.caretcolor);
                }
                if (this.selectcolor)
                {
                    nexacro.__setInputElementHandleSelectColor(handle, this.selectcolor);
                }
                if (this.selectbackground)
                {
                    nexacro.__setInputElementHandleSelectBackgroundColor(handle, this.selectbackground);
                }
                if (this.compositecolor)
                {
                    nexacro.__setInputElementHandleCompositeColor(handle, this.compositecolor);
                }
                if (this.textDecoration)
                {
                    nexacro.__setElementHandleTextDecorationObject(handle, this.textDecoration);
                }

                if (this.inputtype == "password")
                {
                    nexacro.__setInputElementHandleUsePassword(handle, true);
                    nexacro.__setInputElementHandleSetIme(handle, "none", "none");
                }
                else
                {
                    nexacro.__setInputElementHandleUsePassword(handle, false);
                    nexacro.__setInputElementHandleSetIme(handle, this.useime, this.imemode);
                }

                if (this.inputtype)
                {
                    nexacro.__setInputElementHandleInputType(handle, this.inputtype);
                }

                if (this.imeaction)
                {
                    nexacro.__setInputElementHandleImeAction(handle, this.imeaction);
                }

                // 일본어 입력을 위해 maxlength 0으로 유지                
                if (this.maxlength)
                {
                    nexacro.__setInputElementHandleMaxLength(handle, 0);
                }

                if (this.value || this.value === "")
                {
                    if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                    {
                        nexacro.__setElementHandleValue(handle, this.displayinvalidtext);
                        nexacro.__setInputElementHandleInputType(handle, "text");
                    }
                    else
                    {
                        nexacro.__setElementHandleValue(handle, this.value);
                    }

                }
                else if (this.displaynulltext)
                {
                    nexacro.__setElementHandleValue(handle, this.displaynulltext, true);
                }
                else if (this.defaultvalue)
                {
                    this.setElementValue(this.value);
                }
                nexacro.__appendElementHandle(owner_elem.handle, handle);

                this._bindSysEvent();
            }
        };

        _pInputElement.destroy = function ()
        {
            this._unbindSysEvent();
            return nexacro.Element.prototype.destroy.call(this);
        };

        _pInputElement.setElementTextAlign = function (textalign)
        {
            this.textAlign = textalign;
            var handle = this.handle;
            if (handle)
            {
                this._setElementHandleTextAlign(handle, textalign, this.rtl);
            }
        };

        _pInputElement.setElementPadding = function (padding)
        {
            this.padding = padding;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandlePaddingObject(handle, padding);
            }
        };

        _pInputElement.setElementCaretColor = function (color)
        {
            this.caretcolor = color;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setInputElementHandleCaretColor(handle, color);
            }

        };

        _pInputElement.setElementSelectColor = function (color)
        {
            this.selectcolor = color;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setInputElementHandleSelectColor(handle, color);
            }
        };

        _pInputElement.setElementSelectBackgroundColor = function (color)
        {
            this.selectbackground = color;
            var handle = this.handle;

            if (handle)
            {
                nexacro.__setInputElementHandleSelectBackgroundColor(handle, color);
            }
        };

        _pInputElement.setElementCompositeColor = function (color)
        {
            this.compositecolor = color;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setInputElementHandleCompositeColor(handle, color);
            }
        };

        _pInputElement.setElementTabindentSize = function (indent)
        {
            this.tabindentsize = indent;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleTabIndentSize(handle, indent);
            }
        };

        _pInputElement.setElementEnable = function (enable)
        {
            if (this.enable != enable)
            {
                this.enable = enable;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleEnable(handle, enable);
                }
            }
        };

        _pInputElement.setElementReadonly = function (readonly)
        {
            if (this.readonly != readonly)
            {
                this.readonly = readonly;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleReadOnly(handle, readonly);
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
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setInputElementHandleMaxLength(handle, 0);

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

        _pInputElement.setElementUseSoftKeyboard = function (usesoftkeyboard)
        {
            if (this.usesoftkeyboard != usesoftkeyboard)
            {
                this.usesoftkeyboard = usesoftkeyboard;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setInputElementHandleUseSoftKeyboard(handle, usesoftkeyboard);
                }
            }
        };

        _pInputElement.setElementUseIme = function (useime)
        {
            if (this.useime != useime)
            {
                this.useime = useime;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setInputElementHandleUseIme(handle, useime);
                }
            }
        };

        _pInputElement.setElementImeMode = function (imemode)
        {
            if (this.imemode != imemode)
            {
                this.imemode = imemode;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setInputElementHandleImeMode(handle, imemode);
                }
            }
        };

        _pInputElement.setElementDisplayNullText = function (text, applytext)
        {
            if (this.displaynulltext != text)
            {
                this.displaynulltext = text;

                var handle = this.handle;
                var owner_elem = this.parent_elem.getContainerElement(this.position_step);
                if (handle && owner_elem && owner_elem.handle)
                {
                    if (nexacro._isNull(this.value) && !this._is_focused)
                    {
                        if (applytext != "" && applytext != undefined)
                        {
                            nexacro.__setElementHandleValue(handle, applytext, true);
                            this._input_text = applytext;
                        }
                        else
                        {
                            nexacro.__setElementHandleValue(handle, this.displaynulltext, true);
                            this._input_text = this.displaynulltext;
                        }
                    }
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
            if (!nexacro._isNull(bInvalidValue))
                this._is_invalid_value = (bInvalidValue === true) ? true : false;

            if (!bInvalidValue && (this.value == value) && (this._getInputValue() == text))
                return;

            this.value = value;
            this._input_text = text;
            //var color = this.color;

            var handle = this.handle;
            var comp = this.parent_elem.linkedcontrol;
            if (handle)
            {
                if (bInvalidValue)
                {
                    if (!nexacro._isNull(this.displayinvalidtext) && !this._is_focused)
                    {
                        this._updateInputValue(this.displayinvalidtext);
                    }
                    else
                    {
                        this._updateInputValue(text);
                    }
                }
                else
                {
                    if (this.value || this.value === "") 
                    {
                        if (!comp._is_killfocusing && (this._is_focused || !this._checkmax_editing_only)) 
                        {
                            if (this.maxlength > 0 && text.length > this.maxlength) 
                            {
                                text = text.substring(0, this.maxlength);
                            }
                        }

                        if (this._is_focused && this.value === "")
                        {
                            this._updateInputValue(text, false, text.length);
                        }
                        else
                        {
                            this._setElementLastSelectionRange([text.length, text.length]);
                            this._updateInputValue(text);
                        }
                    }
                    else if (!this._is_focused && this.displaynulltext != "")
                    {
                        nexacro.__setElementHandleValue(handle, this.displaynulltext, true);
                        this._input_text = this.displaynulltext;
                    }
                    else
                    {
                        this._updateInputValue(text);
                    }
                }
            }
        };

        _pInputElement.replaceElementText = function (value, begin, end, bselect)
        {
            var input_value = this._getInputValue();
            if (begin < 0) return;

            if (end < 0) end = input_value.length;
            if (begin > end) end = begin;

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

        _pInputElement.updateElementText = function (value, caretpos, beginpos)
        {
            value = (value ? value : "");

            if (this.autoselect && (beginpos != null || beginpos != undefined)) // beginpos 값이 0인 경우가 있을 수 있으므로 null, undefined 체크로 해야함.
                this._updateInputValue(value, !this._processing_oninput, caretpos, beginpos);
            else
                this._updateInputValue(value, !this._processing_oninput, caretpos);
        };

        _pInputElement._updateElementValue = function (value)
        {
            if (this.value == value)
                return;

            if (!value) value = this._zerolength_value;
            this.value = value;
        };

        _pInputElement._updateInputValue = function (value, fireevent, selectionStart, selectionEnd)
        {
            var handle = this.handle;
            var checkAutoSelc = false;

            if (handle)
            {
                if (this._input_text == value)
                {
                    nexacro.__setElementHandleValue(handle, "");
                    checkAutoSelc = true;
                }

                this._input_text = value;
                nexacro.__setElementHandleValue(handle, value);

                if (selectionStart != null && selectionStart > -1)
                {
                    if (selectionEnd == -1) selectionEnd = value.length;
                    if ((selectionEnd != 0) && (selectionEnd == null || selectionEnd < selectionStart))
                        selectionEnd = selectionStart;

                    if (this.autoselect && (selectionEnd == 0 && selectionStart == this._input_text.length))
                    {
                        nexacro.__setInputElementHandleSetSelect(handle, 0, -1, this.autoselect);
                        this._setElementLastSelectionRange([0, selectionEnd]);
                    }
                    else
                    {
                        nexacro.__setInputElementHandleSetSelect(handle, selectionStart, selectionStart, false);
                        this._setElementLastSelectionRange([selectionStart, selectionEnd]);
                    }
                }
                else
                {
                    if (this._is_focused)
                    {
                        if (this.autoselect && checkAutoSelc && (selectionEnd != -99)) // 값을 수정중이거나(checkAutoSelc) Calendar에 복사붙여넣기로 같은 값을 넣었을 때(-99) 전체선택되지 않도록 설정.
                            this.setElementSetSelect(0, (this._input_text ? this._input_text.length : 0));
                        else
                            this.setElementSetSelect(this._input_text ? this._input_text.length : 0);

                        // 해동조건을 추가한 이유
                        // Runtime환경에서 edit 나 textarea에 포커스가 있는 상태에서 동적으로 value를 바꿀시 
                        // Caret의 위치가 어디에 위치해있던 상관없이 맨앞으로 Caret이 이동하기때문에 추가
                    }
                }

                if (fireevent) 
                {
                    this._on_sys_keyinput_forward();
                }
            }
        };

        // ['text', 'password', 'number', 'tel']
        _pInputElement.setElementInputType = function (type)
        {
            if (type == "number" || type == "tel")
            {
                type = "number"; // android runtime internal : phone type 설정할 것
            }
            else if (type == "date")
            {
                type = "date";
            }
            else if (type != "password")
            {
                type = "text";
            }

            if (this.inputtype != type)
            {
                this.inputtype = type;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setInputElementHandleInputType(handle, this.inputtype);

                    if (type == "password")
                    {
                        nexacro.__setInputElementHandleSetIme(handle, "none", "none");
                    }
                    else
                    {
                        nexacro.__setInputElementHandleSetIme(handle, this.useime, this.imemode);
                    }
                    nexacro.__setInputElementHandleUsePassword(handle, type == "password");
                }
            }
        };

        _pInputElement.setElementImeAction = function (imeaction)
        {
            if (this.imeaction != imeaction)
            {
                this.imeaction = imeaction;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setInputElementHandleImeAction(handle, imeaction);
                }
            }
        };

        _pInputElement._applyMaxlength = function ()
        {
            if (this._checkmax_editing_only && this.maxlength > 0)
            {
                var text = (nexacro._isNull(this.value) ? this.defaultvalue : (this.value + ""));
                if (text.length > this.maxlength)
                {
                    text = text.substring(0, this.maxlength);
                    this._updateInputValue(text);
                }
            }
        };

        _pInputElement.setElementFocus = function (trigger_type)
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused)
                {
                    this._is_focused = true;

                    if (!this.readonly)
                        this._applyMaxlength();
                }

                if (nexacro._isNull(this.value) || this._is_invalid_value)
                {
                    var value = this._getInputValue();
                    if (value != this.defaultvalue)
                    {
                        nexacro.__setElementHandleValue(handle, this.defaultvalue);
                    }
                }
                var comp = this.parent_elem.linkedcontrol;

                if (trigger_type != "lbutton")
                {
                    var byTouch = (trigger_type == "tap" || trigger_type == "touch") ? true : false;
                    if (!this._is_sys_focused || comp._use_softkeyboard > 1)
                    {
                        nexacro.__setElementHandleFocus(handle, comp._use_softkeyboard, byTouch);
                    }
                }

                this._setElementLastSelectionRange();
                nexacro.__setLastFocusedElement(this);
            }
        };

        _pInputElement.setElementBlur = function ()
        {
            var handle = this.handle;
            if (handle && this._is_focused)
            {
                // selection range is clear after blur, and selection style will represent.(it is bug)
                var range = this.getElementSelectionRange();
                if (range)
                {
                    this._setElementLastSelectionRange(range);
                    if (range[0] == range[1])
                        this._setElementLastSelectionRange();
                    else
                        this._setElementLastSelectionRange(range);
                }

                if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                {
                    const env = nexacro.getEnvironment();
                    if (!env._p_enableaccessibility)
                    {
                        nexacro.__setInputElementHandleSetSelect(handle, 0, 0, false);
                    }
                }
                else
                {
                    // other
                    nexacro.__setInputElementHandleSetSelect(handle, 0, 0, false);
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

                    if (this._is_sys_focused)
                    {
                        nexacro.__setInputElementHandleBlur(handle);
                    }
                }

                if (this.value == null && this.displaynulltext != "")
                {
                    nexacro.__setElementHandleValue(handle, this.displaynulltext, true);
                }
                else
                {
                    if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                    {
                        nexacro.__setElementHandleValue(handle, this.displayinvalidtext);
                    }

                }
            }
        };

        _pInputElement.setElementSetSelect = function (start, end)
        {
            if (this.isComposing()) return;

            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused)
                {
                    // selection range is set, node will has focus;
                    this._setElementLastSelectionRange([start, end]);
                    return;
                }

                nexacro.__setInputElementHandleSetSelect(handle, start, end, false);
                //nexacro.__setInputElementHandleSetSelect(_handle, start, end, this.autoselect);
                //this.autoselect = false;//autoselect일때만 이 함수 호출전에 true설정하고 무조건 여기서 해제...그래야 mouse select가 됨;
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
            var handle = this.handle;
            if (handle)
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
                    var pos = nexacro.__getInputElementHandleCaretPos(handle);
                    if (pos)
                    {
                        return { begin: pos[0], end: pos[1] };
                    }
                }
            }
            return -1;
        };

        _pInputElement.getElementSelectionRange = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this._last_selection_range)
                {
                    return this._last_selection_range;
                }

                if (this._is_focused)
                {
                    return nexacro.__getInputElementHandleSelectionRange(handle);
                }
            }
            return [0, 0];
        };

        _pInputElement.getElementText = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                return this._getInputValue();
            }
            return this._input_text;
        };

        _pInputElement._getInputValue = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (this._is_focused || (!this.displaynulltext && !this._is_invalid_value))
                {
                    return nexacro.__getElementHandleValue(handle);
                }
                else
                {
                    return this._input_text;
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

            var _is_composing = this._composer.isComposing();
            if (_is_composing)
            {
                this._composer.setStatus(nexacro._CompositionState.END, pos.end);
                this._updateInputValue(value, !this._processing_oninput);
            }
            return true;
        };

        _pInputElement.setCompositionComplete = function (end_pos, is_composing)
        {
            var handle = this.handle;
            if (handle)
            {
                this.setCompositionComplete_process.call(this, end_pos, is_composing);

                var pos = this.getElementCaretPos();
                this._composer.setStatus(nexacro._CompositionState.NONE, pos.end);
            }
        };

        _pInputElement.setCompositionCancel_process = function (end_pos, is_composing)
        {
            //var pos;// = this.getElementCaretPos();//unused
            var value = this._getInputValue();

            var _is_composing = this._composer.isComposing();
            if (_is_composing)
            {
                var offset = this._composer.getOffset();
                this._composer.setStatus(nexacro._CompositionState.END, offset.begin);
                this._updateInputValue(value.substring(0, offset.begin), !this._processing_oninput);
            }
            return true;
        };

        _pInputElement.setCompositionCancel = function (end_pos, is_composing)
        {
            var handle = this.handle;
            if (handle)
            {
                this.setCompositionCancel_process.call(this, end_pos, is_composing);

                var pos = this.getElementCaretPos();
                this._composer.setStatus(nexacro._CompositionState.NONE, pos.end);
            }
        };

        _pInputElement.clearComposition = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var is_composing = this._composer.isComposing();
                if (is_composing)
                {
                    this.setCompositionCancel();
                }
                else
                {
                    nexacro.__clearInputElementHandleCompositeChar(handle);
                }
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
                var _has_candidate_window;
                /**
                 * composition確定時のフラグが立っているときは分岐内を処理しない。
                 * composition확정 시의 flag가 true일 경우 분기내의 처리를 수행하지 않음
                 */
                if (_is_composing && !fix_composition)
                {
                    _has_candidate_window = this._composer.isHasCandiateWindow(value.charAt(caretpos - 1));
                }

                //var bcheck;
                //var status = this._composer.status;
                // nexacro._CompositionState.NONE - for keypress, paste -
                // nexacro._CompositionState.COMPOSING & has not candidate window - for korean 
                // nexacro._CompositionState.END - for all CJK 
                /**
                 * composition確定時のフラグが立っているときも分岐内を処理する。
                 * composition확정 시의 flag가 true일 경우에도 분기내의 처리를 수행
                 */
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
            var handle = this.handle;
            var comp = this.parent_elem.linkedcontrol;
            if (handle && comp)
            {
                var form = comp._getForm();
                var newfocus_comp = form._searchNextTabFocus(form._last_focused, undefined, undefined, 0);
                comp = newfocus_comp[0];

                if (newfocus_comp && comp)
                {
                    if (comp._hasContainer() && comp._last_focused)
                    {
                        var win = form._getWindow();
                        win._removeFromCurrentFocusPath(comp._last_focused);
                    }

                    if (comp._has_inputElement)
                        comp._processing_autoskip = true;

                    comp._setFocus(true, 0, true);

                    var bEdit = (comp instanceof nexacro.Edit || comp instanceof nexacro.MaskEdit || comp instanceof nexacro.TextArea);
                    if (bEdit && !comp._p_autoselect)
                    {
                        comp._setDefaultCaret();
                    }


                }
            }
        };

        _pInputElement._bindSysEvent = function ()
        {
            var input = this.handle;

            nexacro._observeInputEvent(input, "keydown", "onkeydown", this._on_sys_keydown_forward);
            nexacro._observeInputEvent(input, "keyup", "onkeyup", this._on_sys_keyup_forward);
            nexacro._observeInputEvent(input, "keypress", "onkeypress", this._on_sys_keypress_forward);

            nexacro._observeInputEvent(input, "input", "oninput", this._on_sys_keyinput_forward);

            nexacro._observeInputEvent(input, "compositionstart", "oncompositionstart", this._on_sys_compositionstart);
            nexacro._observeInputEvent(input, "compositionupdate", "oncompositionupdate", this._on_sys_compositionupdate);
            nexacro._observeInputEvent(input, "compositionend", "oncompositionend", this._on_sys_compositionend);

            nexacro._observeInputEvent(input, "cut", "oncut", this._on_sys_cut);
            nexacro._observeInputEvent(input, "paste", "onpaste", this._on_sys_paste);
            nexacro._observeInputEvent(input, "contextmenu", "oncontextmenu", this._on_sys_contextmenu);
            nexacro._observeInputEvent(input, "select", "onselect", this._on_sys_select);

            nexacro._observeInputEvent(input, "lbuttondown", "onlbuttondown", this._on_sys_lbuttondown_forward);
            nexacro._observeInputEvent(input, "lbuttonup", "onlbuttonup", this._on_sys_lbuttonup_forward);
            nexacro._observeInputEvent(input, "rbuttondown", "onrbuttondown", this._on_sys_rbuttondown_forward);
            nexacro._observeInputEvent(input, "rbuttonup", "onrbuttonup", this._on_sys_rbuttonup_forward);
            nexacro._observeInputEvent(input, "mousemove", "onmousemove", this._on_sys_mousemove_forward);

            if (nexacro._SupportTouchEvent)
            {
                nexacro._observeInputEvent(input, "touchstart", "ontouchstart", this._on_sys_lbuttondown_forward);
                nexacro._observeInputEvent(input, "touchend", "ontouchend", this._on_sys_lbuttonup_forward);
                nexacro._observeInputEvent(input, "touchmove", "ontouchmove", this._on_sys_mousemove_forward);
            }

            nexacro._observeInputEvent(input, "focus", "onfocus", this._on_sys_focus);
            nexacro._observeInputEvent(input, "blur", "onblur", this._on_sys_blur);
        };

        _pInputElement._unbindSysEvent = function ()
        {
            var input = this.handle;
            if (input)
            {
                nexacro._stopInputObserving(input, "keydown", "onkeydown", this._on_sys_keydown_forward);
                nexacro._stopInputObserving(input, "keyup", "onkeyup", this._on_sys_keyup_forward);
                nexacro._stopInputObserving(input, "keypress", "onkeypress", this._on_sys_keypress_forward);

                nexacro._stopInputObserving(input, "input", "oninput", this._on_sys_keyinput_forward);
                nexacro._stopInputObserving(input, "compositionstart", "oncompositionstart", this._on_sys_compositionstart);
                nexacro._stopInputObserving(input, "compositionupdate", "oncompositionupdate", this._on_sys_compositionupdate);
                nexacro._stopInputObserving(input, "compositionend", "oncompositionend", this._on_sys_compositionend);

                nexacro._stopInputObserving(input, "cut", "oncut", this._on_sys_cut);
                nexacro._stopInputObserving(input, "paste", "onpaste", this._on_sys_paste);
                nexacro._stopInputObserving(input, "contextmenu", "oncontextmenu", this._on_sys_contextmenu);
                nexacro._stopInputObserving(input, "select", "onselect", this._on_sys_select);

                nexacro._stopInputObserving(input, "lbuttondown", "onlbuttondown", this._on_sys_lbuttondown_forward);
                nexacro._stopInputObserving(input, "lbuttonup", "onlbuttonup", this._on_sys_lbuttonup_forward);
                nexacro._stopInputObserving(input, "rbuttondown", "onrbuttondown", this._on_sys_rbuttondown_forward);
                nexacro._stopInputObserving(input, "rbuttonup", "onrbuttonup", this._on_sys_rbuttonup_forward);
                nexacro._stopInputObserving(input, "mousemove", "onmousemove", this._on_sys_mousemove_forward);

                if (nexacro._SupportTouchEvent)
                {
                    nexacro._stopInputObserving(input, "touchstart", "ontouchstart", this._on_sys_lbuttondown_forward);
                    nexacro._stopInputObserving(input, "touchend", "ontouchend", this._on_sys_lbuttonup_forward);
                    nexacro._stopInputObserving(input, "touchmove", "ontouchmove", this._on_sys_mousemove_forward);
                }

                nexacro._stopInputObserving(input, "focus", "onfocus", this._on_sys_focus);
                nexacro._stopInputObserving(input, "blur", "onblur", this._on_sys_blur);
            }
        };

        _pInputElement._on_sys_keydown_forward = function (keycode, altkey, ctrlkey, shiftkey, metakey)
        {
            var ret, comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                nexacro._syshandler_onkeydown_forward(_win, this, keycode, altkey, ctrlkey, shiftkey, metakey);
                if (this._event_stop)
                {
                    if (nexacro._OS == "OSX")
                    {
                        this._event_stop = false;
                    }
                    var _locale = this._imelocale.getLocale();
                    if (_locale != "ja" || !ctrlkey || keycode != 86 || !this.isComposing())
                    {
                        this.clearComposition();
                    }
                    return false;
                }

            }
            ret = this._on_sys_keydown(keycode, altkey, ctrlkey, shiftkey, metakey);
            if (ret === false || this._event_stop)
            {
                this._event_stop = false;
                return false;
            }

            return true;
        };

        _pInputElement.on_sys_keydown_before_process = function (keycode/*, altkey, ctrlkey, shiftkey*/)
        {

            var comp = this.parent_elem.linkedcontrol;
            var _win = comp._getWindow();
            var capture_comp;
            if (comp) capture_comp = _win._getCaptureComp(false, true, comp);

            if (capture_comp && capture_comp != comp)
            {
                this.stopSysEvent();
                return false;
            }

            var pos = this.getElementCaretPos();
            this._composer.setDelayStatus(undefined);

            if (keycode != nexacro.KeyCode_ImeInput) // 229
            {
                if (!this._composer.isComposing())
                {
                    this._composer.setStatus(nexacro._CompositionState.NONE, pos.begin);
                }
            }

            return true;
        };

        _pInputElement.on_sys_keydown_specialkey_process = function (keycode/*, altkey, ctrlkey, shiftkey*/)
        {
            if (keycode == nexacro.Event.KEY_INSERT)
            {
                this._is_insert_mode = !this._is_insert_mode;
            }
            return true;
        };

        _pInputElement.on_sys_keydown_process = function (keycode/*, altkey, ctrlkey, shiftkey*/)
        {


            return true;
        };

        _pInputElement._on_sys_keydown = function (keycode/*, altkey, ctrlkey, shiftkey*/)
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this.readonly)
                {
                    if (!this.on_sys_keydown_before_process.call(this, keycode)) return;
                    if (!this.on_sys_keydown_specialkey_process.call(this, keycode)) return;

                    this.on_sys_keydown_process.call(this, keycode);
                }
            }
        };

        _pInputElement._on_sys_keyup_forward = function (keycode, altkey, ctrlkey, shiftkey, metakey)
        {
            /*var ret = */this._on_sys_keyup(keycode, altkey, ctrlkey, shiftkey, metakey);

            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                /*ret = */nexacro._syshandler_onkeyup_forward(_win, this, keycode, altkey, ctrlkey, shiftkey, metakey);

                if (this._event_stop)
                {
                    this._event_stop = false;
                    return false;
                }
            }

            return true;
        };

        _pInputElement.on_sys_keyup_before_process = function (keycode, altkey, ctrlkey/*, shiftkey*/)
        {
            return true;
        };

        _pInputElement.on_sys_keyup_specialkey_process = function (keycode, altkey, ctrlkey/*, shiftkey*/)
        {
            var pos = this.getElementCaretPos();
            var is_composing = this._composer.isComposing();
            if (is_composing)
            {
                // 일본어의 경우, keydown에서 keycode 알 수 없음 (IME Mode에서는 항상 229)
                if (keycode == nexacro.Event.KEY_RETURN
                    || keycode == nexacro.Event.KEY_ESC
                    || (ctrlkey && keycode == 77) // ctrl+m 
                    || (ctrlkey && keycode == 90)) // ctrl+z
                {
                    this._composer.setStatus(nexacro._CompositionState.END, pos.end);

                    var value = this._getInputValue();
                    this._updateInputValue(value, true);
                }
            }
            return true;
        };

        _pInputElement.on_sys_keyup_process = function (keycode, altkey, ctrlkey/*, shiftkey*/)
        {
            return true;
        };

        _pInputElement._on_sys_keyup = function (keycode, altkey, ctrlkey/*, shiftkey*/)
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this.readonly)
                {
                    if (this.on_sys_keyup_before_process.call(this, keycode, altkey, ctrlkey)) return;
                    if (this.on_sys_keyup_specialkey_process.call(this, keycode, altkey, ctrlkey)) return;
                    this.on_sys_keyup_process.call(this, keycode, altkey, ctrlkey);
                }
            }
        };

        _pInputElement._on_sys_keypress_forward = function (keycode, charcode, altkey, ctrlkey, shiftkey, metakey)
        {
            var ret = this._on_sys_keypress(keycode, charcode, altkey, ctrlkey, shiftkey, metakey);

            if (ret === false || this._event_stop)
            {
                this._event_stop = false;
                return false;
            }

            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();

                // [RP 46605][팝업화면에서 space키 입력시..] - 변경집합 34118
                // [RP 100563][메세지(showModalSync) 팝업 종료시..]
                if (_win && (_win._keydown_element == null || _win._keydown_element.handle == null))
                    return false;

                ret = nexacro._syshandler_onkeypress_forward(_win, this, keycode, charcode, altkey, ctrlkey, shiftkey, metakey);

                if (this._event_stop)
                {
                    this._event_stop = false;
                    return false;
                }
            }

            return ret;
        };

        _pInputElement.on_sys_keypress_before_process = function (keycode, charcode, altkey, ctrlkey, shiftkey, metakey)
        {
            // iOS는 한글/일본어가 229가 아님, Mac OS는??
            if (nexacro._OS == "iOS")
            {
                return false;
            }

            var pThis = this;

            var comp = pThis.parent_elem.linkedcontrol;
            var _win = comp._getWindow();
            var capture_comp;
            if (comp) capture_comp = _win._getCaptureComp(false, true, comp);

            if (capture_comp && capture_comp != comp)
            {
                this.stopSysEvent();
                return false;
            }

            return true;
        };

        _pInputElement.on_sys_keypress_specialkey_process = function (keycode, charcode, altkey, ctrlkey, shiftkey, metakey)
        {
            return true;
        };

        _pInputElement.on_sys_keypress_process = function (keycode, charcode, altkey, ctrlkey, shiftkey, metakey)
        {
            //var handle = this.handle;
            var pThis = this;
            //if (!this._composer.isComposing())                
            {
                var value = this._getInputValue();
                var _range = this.getElementSelectionRange();

                var comp = pThis.parent_elem.linkedcontrol;
                var _win = comp._getWindow();

                if (_win && _win._keydown_element)
                {
                    if (_win._keydown_element.name !== pThis.name && comp._processing_autoskip)
                    {
                        comp._processing_autoskip = false;
                        return false;
                    }
                }

                if (!ctrlkey && !altkey && charcode)
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

                if (this.maxlength > 0)
                {
                    value = this._getInputValue();
                    if (value.length >= this.maxlength && _range[0] == _range[1])
                    {
                        this._event_stop = false;
                        return false;
                    }
                }
            }
            return true;
        };

        _pInputElement._on_sys_keypress = function (keycode, charcode, altkey, ctrlkey, shiftkey, metakey)
        {
            var handle = this.handle;
            if (handle)
            {
                if (nexacro._OS == "iOS")
                {
                    this._updateImeLocale();

                    return false;
                }

                if (!this.on_sys_keypress_before_process.call(this, keycode, altkey, ctrlkey)) return;
                if (!this.on_sys_keypress_specialkey_process.call(this, keycode, altkey, ctrlkey)) return;
                return this.on_sys_keypress_process.call(this, keycode, charcode, altkey, ctrlkey);
            }
        };

        _pInputElement._on_sys_keyinput_forward = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var ret;
                if (!this._processing_oninput)
                {
                    var value = this._getInputValue();

                    // detemine changed status & value 
                    //var is_changed_status = false;
                    var prev_status = this._composer._prev_status;
                    var cur_status = this._composer.status;

                    var comp = this.parent_elem.linkedcontrol;
                    var _win = comp._getRootWindow();
                    if (_win && _win._keydown_element)
                    {
                        if (_win._keydown_element !== this && comp._processing_autoskip)
                        {
                            var old_value = this.value;
                            this._updateInputValue(old_value);
                            comp._processing_autoskip = false;
                            return false;
                        }
                    }

                    if (prev_status == cur_status)
                    {
                        if (!this.value && this.defaultvalue == value)
                        {
                            this._paste_caret_pos = null;
                            //return;
                        }
                    }

                    this._processing_oninput = true;
                    ret = this._on_sys_keyinput();
                    this._processing_oninput = false;

                    this._paste_caret_pos = null;
                }

                return ret;
            }
        };

        _pInputElement.on_complete_composition_value_process = function ()
        {
            return true;
        };

        _pInputElement.on_complete_composition_value = function ()    
        {
            return this.on_complete_composition_value_process.call(this);
        };

        _pInputElement.on_apply_imeSet = function ()
        {
            var i, len;
            var pThis = this;
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

            pThis.on_apply_ime_environment();
        };

        _pInputElement.on_apply_ime_environment_process = function ()
        {

            return true;
        };

        _pInputElement.on_apply_ime_environment = function ()
        {
            this.on_apply_ime_environment_process.call(this);
        };

        _pInputElement.on_apply_force_imeSet = function ()
        {
            return true;
        };

        _pInputElement._updateLocale = function ()
        {
            var pThis = this;
            var comp = pThis.parent_elem.linkedcontrol;
            if (comp instanceof nexacro.MaskEdit)
            {
                pThis._skip_check_imelocale = true;
                pThis._imelocale.setLocale("");
                pThis.on_apply_imeSet();
                return;
            }

            var pos = pThis.getElementCaretPos();
            var value = pThis._getInputValue();
            var char = this._is_insert_mode ? value.substr(pos.end, 1) : value.substr(pos.end - 1, 1);

            pThis._imelocale.updateLocale(char);
            if (pThis._imelocale.IsChangeLocale())
            {
                pThis.on_apply_imeSet();
            }

            pThis.on_apply_force_imeSet.call(pThis);
        };

        _pInputElement._updateImeLocale = function ()
        {
            //var handle = this.handle; //unused
            //var comp = this.parent_elem.linkedcontrol; //unused
            var composing_status = this._composer.status;
            //var beginOffset, endOffset;
            if (this._skip_check_imelocale) return true;

            var value = this._getInputValue();

            // inputfilter / inputtype
            //var pos = this.getElementCaretPos(); //unused
            //var paste_pos = this._paste_caret_pos;
            //var offsetCompose = this._composer.getOffset();

            var prev_status = this._composer._prev_status;

            //trace("_updateimetype: ", comp.id, this.isComposing(), prev_status, composing_status, pos.begin, pos.end, value, this.value);

            // 한글 입력
            // 첫입력 (1/2)
            // compositionstart -> compositionupdate -> keyinput
            // 두번째 입력 (2/3, 3/2)
            // compositionend -> keyinput -> compositionupdate -> keyinput

            // 일본어 입력
            // 첫입력 (1/2)
            // 두번째 입력 (2/2)
            // 확정 하면 (2/3)
            // inputtype/filter/maxlength 등으로 값이 변경되서 들어도면 (0/3) 
            //if (pos != -1)
            {
                //if (!this.isComposing() &&
                //    !(prev_status == nexacro._CompositionState.COMPOSING && composing_status == nexacro._CompositionState.END))

                if (!this.isComposing())
                {
                    //trace("아스키입력");

                }
                else
                {
                    if (prev_status == nexacro._CompositionState.START && composing_status == nexacro._CompositionState.COMPOSING)
                    {
                        if (value)
                        {
                            this._updateLocale();

                        }
                    }
                }
            }

            return true;
        };

        _pInputElement.on_sys_keyinput_before_process = function ()
        {
            var comp = this.parent_elem.linkedcontrol;
            var _win = comp._getWindow();
            var capture_comp;
            if (comp) capture_comp = _win._getCaptureComp(false, true, comp);

            if (capture_comp && capture_comp != comp)
            {
                this.stopSysEvent();
                return false;
            }

            return true;
        };

        _pInputElement.on_sys_keyinput_process = function ()
        {
            var composing_status = this._composer.status;
            var beginOffset, endOffset;

            var value = this._getInputValue();

            // inputfilter / inputtype
            var pos = this.getElementCaretPos();
            var paste_pos = this._paste_caret_pos;
            var offsetCompose = this._composer.getOffset();

            if (composing_status == nexacro._CompositionState.NONE)
            {
                beginOffset = paste_pos ? paste_pos.begin : offsetCompose.begin;
                endOffset = paste_pos ? paste_pos.end : pos.end;

                if (beginOffset > endOffset)
                {
                    beginOffset = endOffset;
                }
            }
            else
            {
                beginOffset = offsetCompose.begin;
                endOffset = offsetCompose.end;

            }

            var new_value = "";
            var comp = this.parent_elem.linkedcontrol;
            if (comp._on_beforekeyinput)
            {
                comp._on_beforekeyinput(this, value, composing_status, beginOffset, endOffset);
                /*if (this._event_stop)
                {
                    // this._use_event_beforeinput = true인 경우에만 해당
                    this._event_stop = false;
                    return false;
                }*/

                new_value = this._getInputValue();
                pos = this.getElementCaretPos();

            }

            // check maxlength
            var ismax = false;
            if (this.maxlength > 0)
            {
                var caretpos = this._paste_caret_pos ? this._paste_caret_pos.end - (value.length - new_value.length) : pos.end;

                value = new_value;
                var check = this._checkMaxLength(value, caretpos);
                if (check)
                {
                    ismax = check.ismax;
                    var newpos = check.pos;

                    if (ismax)
                    {
                        if (caretpos != newpos)
                        {
                            value = value.substring(0, newpos) + value.substring(caretpos);
                            this.setCompositionCancel();

                            if (!this._is_simple_input)
                                this._updateInputValue(value);

                            this.setElementSetSelect(newpos, newpos);

                            value = this._getInputValue();
                            pos = this.getElementCaretPos();
                        }

                        this.setCompositionComplete();
                    }
                }
            }
            else
            {
                value = new_value;
            }

            if (this._composer.isComposing())
            {
                this._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);
            }

            // fire oninput event
            var old_value = this.value;
            this._updateElementValue(value);

            // detemine changed status & value 
            var prev_status = this._composer._prev_status;
            var cur_status = this._composer.status;

            if (prev_status == cur_status && this.value == old_value)
            {
                if (comp._on_input_autoskip)
                {
                    comp._on_input_autoskip();
                }

                //return;
            }

            this._composer._prev_status = cur_status;

            if (comp._on_keyinput)
            {
                comp._on_keyinput(this);
            }

            if (this._event_stop)
            {
                this._event_stop = false;
                return false;
            }

            // autoskip
            if (ismax && this.autoskip)
            {
                if (this.value && value.length > this.value.length)
                {
                    ismax = false;
                }

                if (ismax)
                {
                    this._go_next_focus();
                }
            }

            return true;
        };

        // 일본어 조합 완료 하게 되면 compositionend -> keyinput
        // compositionend쪽에서 filter가 이루어 지지만, 다시 keyinput에서 같은 로직을 수행한다.
        // 다만 조건에 의해서 튕겨내고는 있음.
        // compositionend에서 처리 할필요가 있을까?
        _pInputElement._on_sys_keyinput = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._updateImeLocale())
                {
                    return;
                }

                if (!this.on_sys_keyinput_before_process.call(this)) return;
                return this.on_sys_keyinput_process.call(this);
            }
        };

        _pInputElement.on_sys_select_before_process = function ()
        {
            return true;
        };

        _pInputElement.on_sys_select_process = function ()
        {
            var handle = this.handle;
            if (this._is_focused)
            {
                var sel = this.getElementSelectionRange();
                if (sel && sel[0] != sel[1])
                    this._setElementLastSelectionRange(sel);
            }
            return true;
        };

        _pInputElement._on_sys_select = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this.on_sys_select_before_process()) return;
                if (!this.on_sys_select_process()) return;

            }
        };

        _pInputElement._on_sys_cut = function ()
        {
        };

        _pInputElement._on_sys_paste = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                //var value = this._getInputValue();

                var pos = this.getElementCaretPos();
                var begin = pos.begin;
                //var end = pos.end;

                //var newvalue;
                var data = nexacro.__getClipboard("CF_UNICODETEXT");
                if (data)
                {
                    if (nexacro._OS == "Windows")
                    {
                        var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
                        if (comp instanceof nexacro.Edit || comp instanceof nexacro.MaskEdit)
                            data = data.replace(/\r\n|\r|\n/g, "");
                        else
                        {
                            data = data.replace(/\r\n/g, "\n");
                            data = data.replace(/\r/g, "\n");
                        }
                    }

                    //newvalue = value.substring(0, begin) + data + value.substring(end);
                    pos.end = begin + data.length;
                }
                this._paste_caret_pos = pos;
            }
        };

        _pInputElement._on_sys_contextmenu = function (button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY, metakey)
        {
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                return nexacro._syshandler_oncontextmenu_forward(_win, this, button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY, metakey);
            }
        };

        _pInputElement.on_sys_compositionstart_process = function ()
        {
            var pos = this.getElementCaretPos();
            this._composer.setStatus(nexacro._CompositionState.START, pos.begin);
            // 왜 여기만 false?
            return false;
        };

        _pInputElement._on_sys_compositionstart = function (/*data*/)
        {
            if (this.readonly == true)
                return true;

            var handle = this.handle;
            //if (handle && this._inputtype == "text")
            if (handle)
            {
                return this.on_sys_compositionstart_process.call(this);
            }
            else
            {
                return true;
            }
        };

        _pInputElement.on_sys_compositionupdate_process = function ()
        {
            var pos = this.getElementCaretPos();
            this._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);

            return;
        };

        _pInputElement._on_sys_compositionupdate = function (/*data*/)
        {
            if (this.readonly == true)
                return true;

            var handle = this.handle;
            //if (handle && this._inputtype == "text")
            if (handle)
            {
                nexacro.InputElement.prototype.on_sys_compositionupdate_process.call(this);

                this._updateLocale();

                return this.on_sys_compositionupdate_process.call(this);
            }
            else
            {
                return true;
            }
        };

        _pInputElement.on_sys_compositionend_process = function (evt)
        {
            var pos = this.getElementCaretPos();
            this._composer.setStatus(nexacro._CompositionState.END, pos.end);
            var value = this._getInputValue();
            var comp = this.parent.linkedcontrol;
            if (comp)
                comp._on_input_compositionend(value);

            return;
        };

        _pInputElement._on_sys_compositionend = function (/*data*/)
        {
            var handle = this.handle;
            //if (handle && this._inputtype == "text")
            if (handle)
            {
                return this.on_sys_compositionend_process.call(this);
            }
            else
            {
                return true;
            }

        };

        _pInputElement._on_sys_lbuttondown_forward = function (/*button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY*/)
        {
            /*
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                nexacro._syshandler_onlbuttondown_forward(_win, this, button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY);
            }
            */
            return false;
        };

        _pInputElement._on_sys_lbuttonup_forward = function (/*button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY*/)
        {
            /*
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                nexacro._syshandler_onlbuttonup_forward(_win, this, button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY);
            }
            */
            return false;
        };

        _pInputElement._on_sys_rbuttondown_forward = function (/*button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY*/)
        {
            /*
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                nexacro._syshandler_onrbuttondown_forward(_win, this, button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY);
            }
            */
            return false;
        };

        _pInputElement._on_sys_rbuttonup_forward = function (button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY, metakey)
        {

            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                nexacro._syshandler_onrbuttonup_forward(_win, this, button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY, metakey);

                return true;
            }

            return false;
        };

        _pInputElement._on_sys_mousemove_forward = function (button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY, metakey)
        {
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                var _win = comp._getWindow();
                return nexacro._syshandler_onmousemove_forward(_win, this, button, altkey, ctrlkey, shiftkey, windowX, windowY, screenX, screenY, metakey);
            }
        };

        _pInputElement._on_sys_focus = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var sel;
                this._is_sys_focused = true;
                this._event_stop = undefined;

                if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                {
                    sel = this.getElementSelectionRange();
                    if (sel[0] == sel[1])
                    {
                        this._setElementLastSelectionRange();
                    }
                }

                if (this.autoselect)
                {
                    nexacro.__setInputElementHandleSetSelect(handle, 0, -1, this.autoselect);
                }
                else if (this._last_selection_range)
                {
                    sel = this._last_selection_range;
                    nexacro.__setInputElementHandleSetSelect(handle, sel[0], sel[1], false);
                }

                if (this.value == null) this._zerolength_value = undefined;
                else this._zerolength_value = "";

                // Change 여부 체크
                //this._default_value = this.value;

                var pos = this.getElementCaretPos();
                this._composer.setStatus(nexacro._CompositionState.NONE, pos.begin);

                // TODO : set keypad type (android runtime)
            }
        };

        _pInputElement._on_sys_blur = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                this._is_sys_focused = false;
            }
        };

        _pInputElement._applyElementFocus = nexacro._emptyFn;

        // accessibility        
        _pInputElement.setElementAccessibilityStatAutoComplete = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityStatExpanded = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityFlagHasPopup = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityInfoValueMax = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityInfoValueMin = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityInfoValueCur = nexacro._emptyFn;
        _pInputElement._setElementInputRole = nexacro._emptyFn;
        _pInputElement._wantAccessibilityAdditionalLabel = nexacro._emptyFn;
        _pInputElement._updateElementAccessibilityLabel = nexacro._emptyFn;

        // mobile component or usesoftkeyboard for android web
        _pInputElement.setElementInputMode = nexacro._emptyFn;

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

            this._composer = new nexacro._CompositionState();
            this._imelocale = new nexacro._ImeLocale();
        };

        var _pTextAreaElement = new nexacro._createPrototype(nexacro.InputElement, nexacro.TextAreaElement);
        nexacro.TextAreaElement.prototype = _pTextAreaElement;

        _pTextAreaElement._type_name = "TextAreaElement";
        _pTextAreaElement.typeselector = "nexatextarea";

        _pTextAreaElement.usemultiline = true;
        //_pTextAreaElement.wordWrap = "none";

        _pTextAreaElement.create = function (win)
        {
            // parent is always control element
            // this is always NO nc_element
            var owner_elem = this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = this.handle = nexacro.__createInputElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, true, this.usemultiline);

                if (this.rtl !== undefined)
                    nexacro.__setElementHandleRtlDirection(handle, this.rtl);

                if (!this.visible)
                {
                    nexacro.__setElementHandleVisible(handle, false);
                }

                if (!this.enable)
                {
                    nexacro.__setElementHandleEnable(handle, false);
                }

                if (this.readonly)
                {
                    nexacro.__setElementHandleReadOnly(handle, true);
                }

                if (this.font)
                {
                    nexacro.__setElementHandleFontObject(handle, this.font);
                }
                if (this.color)
                {
                    nexacro.__setElementHandleColorObject(owner_elem.handle, this.color);
                }

                if (this.cursor)
                {
                    nexacro.__setElementHandleCursorObject(handle, this.cursor);
                }

                if (this.caretcolor)
                {
                    nexacro.__setInputElementHandleCaretColor(handle, this.caretcolor);
                }
                if (this.selectcolor)
                {
                    nexacro.__setInputElementHandleSelectColor(handle, this.selectcolor);
                }
                if (this.selectbackground)
                {
                    nexacro.__setInputElementHandleSelectBackgroundColor(handle, this.selectbackground);
                }
                if (this.compositecolor)
                {
                    nexacro.__setInputElementHandleCompositeColor(handle, this.compositecolor);
                }

                if (this.padding)
                {
                    nexacro.__setElementHandlePaddingObject(handle, this.padding);
                }
                if (this.textAlign)
                {
                    this._setElementHandleTextAlign(handle, this.textAlign, this.rtl);
                }
                if (this.textDecoration)
                {
                    nexacro.__setElementHandleTextDecorationObject(handle, this.textDecoration);
                }

                //if (this.wordWrap != "none") //로딩시 none으로 설정된 것도 세팅된 것이므로 전달되어야 함;
                if (this.wordWrap)
                {
                    nexacro.__setElementHandleWordwrapObject(handle, this.wordWrap);
                }

                if (this.tabindentsize > 4)
                {
                    nexacro.__setElementHandleTabIndentSize(handle, this.tabindentsize);
                }

                if (this.imemode)
                {
                    nexacro.__setInputElementHandleImeMode(handle, this.imemode);
                }
                // 일본어 입력을 위해 0으로 유지
                if (this.maxlength)
                {
                    nexacro.__setInputElementHandleMaxLength(handle, 0);
                }

                if (this.value)
                {
                    if (this._is_invalid_value && !nexacro._isNull(this.displayinvalidtext))
                    {
                        nexacro.__setElementHandleValue(handle, this.displayinvalidtext);
                    }
                    else
                    {
                        nexacro.__setElementHandleValue(handle, this.value);
                    }
                }
                else if (this.displaynulltext)
                {
                    nexacro.__setElementHandleValue(handle, this.displaynulltext, true);
                }

                nexacro.__setElementHandleVerticalAlign(handle, "top"); // runtime 기본값

                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);

                this._bindSysEvent();
            }
        };

        _pTextAreaElement.setElementCSSMapInfo = function (wordwrap)
        {
            if (this._wordwrap_info != wordwrap)
            {
                this._wordwrap_info = wordwrap;
            }
        };

        _pTextAreaElement.setElementWordWrap = function (wordwrap)
        {
            if (this.wordWrap != wordwrap)
            {
                var oldwordwrap = this.wordWrap || this._wordwrap_info;
                this.wordWrap = wordwrap;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleWordwrapObject(handle, wordwrap);
                    if (this.text && this._use_decoration == false && oldwordwrap != wordwrap)
                    {
                        nexacro.__setElementHandleText(handle, this.text, this._use_newline, this.wordWrap || this._wordwrap_info);
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

            nexacro.InputElement.prototype.setElementValue.call(this, value);
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

        _pTextAreaElement.setElementInputType = function (/*type*/)
        {

        };

        _pTextAreaElement.getElementCaretLine = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                return nexacro.__getInputElementHandleCaretLine(handle);
            }
            return 0;
        };

        _pTextAreaElement.getElementTextLineCount = function (withwrap)
        {
            var handle = this.handle;
            if (handle)
            {
                var text = this._getInputValue();

                if (withwrap)
                {
                    if (nexacro.__getInputElementHandleLineCount)
                    {
                        return nexacro.__getInputElementHandleLineCount(handle);
                    }

                    var select = nexacro.__getInputElementHandleSelectionRange(handle);
                    nexacro.__setInputElementHandleCaretPos(handle, text.length);

                    var line = nexacro.__getInputElementHandleCaretLine(handle);

                    nexacro.__setInputElementHandleSetSelect(handle, select[0], select[1], false);
                    return line;
                }
                else
                {
                    var textarr = text.split("\n");
                    return textarr.length;
                }
            }
            return 0;
        };

        _pTextAreaElement.isFirstCaretLine = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var lines = nexacro.__getInputElementHandleCaretLine(handle);
                if (lines <= 1) return true;
            }
            return false;
        };

        _pTextAreaElement.isLastCaretLine = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var caret_line = nexacro.__getInputElementHandleCaretLine(handle);
                var total_line = this.getElementTextLineCount();
                if (total_line == caret_line) return true;
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
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return 0;

                return nexacro.__getInputElementHandleScrollLeft(handle);
            }
            return 0;
        };

        _pTextAreaElement.setElementHScrollPos = function (v)
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return;

                if (this._isRtl())
                {
                    v = this._getRtlScrollLeft(v, this.parent_elem.inner_width);
                }

                nexacro.__setInputElementHandleScrollLeft(handle, v);
            }
        };

        _pTextAreaElement.getElementVScrollPos = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return 0;

                return nexacro.__getInputElementHandleScrollTop(handle);
            }
            return 0;
        };

        _pTextAreaElement.setElementVScrollPos = function (v)
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return;

                nexacro.__setInputElementHandleScrollTop(handle, v);
            }
        };

        _pTextAreaElement.getElementScrollSize = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return { width: this.width, height: this.height };

                if (nexacro.__getInputElementHandleScrollSize)
                {
                    return nexacro.__getInputElementHandleScrollSize(handle);
                }
                else
                {
                    var w = nexacro.__getInputElementHandleScrollWidth(handle);
                    var h = nexacro.__getInputElementHandleScrollHeight(handle);
                    return { width: w, height: h };
                }
            }
            return 0;
        };

        _pTextAreaElement.getElementScrollWidth = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return this.width;

                return nexacro.__getInputElementHandleScrollWidth(handle);
            }
            return 0;
        };

        _pTextAreaElement.getElementScrollHeight = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                if (!this._is_focused && this.value == null && this.displaynulltext)
                    return this.height;

                return nexacro.__getInputElementHandleScrollHeight(handle);
            }
            return 0;
        };

        _pTextAreaElement._bindSysEvent = function ()
        {
            var input = this.handle;
            if (input)
            {
                nexacro.InputElement.prototype._bindSysEvent.call(this);
                nexacro._observeInputEvent(input, "scroll", "onscroll", this._on_sys_scroll);
            }
        };

        _pTextAreaElement._unbindSysEvent = function ()
        {
            var input = this.handle;
            if (input)
            {
                nexacro.InputElement.prototype._unbindSysEvent.call(this);
                nexacro._stopInputObserving(input, "scroll", "onscroll", this._on_sys_scroll);
            }
        };

        _pTextAreaElement._on_sys_scroll = function (posTop, posLeft)
        {
            var container = this.parent_elem.getContainerElement(this.position_step);
            if (container)
            {
                var elem_scroll_top = container.parent.scroll_top;
                var elem_scroll_left = container.parent.scroll_left;

                var hscroll_pos = elem_scroll_left;
                var vscroll_pos = elem_scroll_top;

                var scrolltype = this.parent._scrolltype;
                var linkedcontrol = this.parent.linkedcontrol;

                var bscroll = false;
                if (elem_scroll_left != posLeft)
                {
                    if (scrolltype != "none" && scrolltype != "vertical" && !linkedcontrol._is_tracking)
                    {
                        hscroll_pos = posLeft;
                        bscroll = true;
                    }
                }

                if (elem_scroll_top != posTop)
                {
                    if (scrolltype != "none" && scrolltype != "horizontal" && !linkedcontrol._is_tracking)
                    {
                        vscroll_pos = posTop;
                        bscroll = true;
                    }
                }

                if (bscroll)
                    linkedcontrol._scrollTo(hscroll_pos, vscroll_pos, true, true);

            }
        };

        _pTextAreaElement = null;

        //======================================================================
        // nexacro.ControlElement - this ControlElement has container or element
        //======================================================================	
        // this ControlElement has No Event Handlers -- Container only
        // this ControlElement has Border
        nexacro.ControlElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
        };

        var _pControlElement = nexacro._createPrototype(nexacro.Element, nexacro.ControlElement);
        nexacro.ControlElement.prototype = _pControlElement;
        // overide nexacro.Object
        _pControlElement._type_name = "ControlElement";

        //==== defaule values =========//
        _pControlElement.enable = true;
        _pControlElement.tabindex = -1;
        _pControlElement.zindex = -1;

        _pControlElement.color = null;
        _pControlElement.font = null;
        _pControlElement.textDecoration = null;

        _pControlElement.borderRadius = null;
        _pControlElement.border = null;
        _pControlElement.background = null;
        _pControlElement.edgeImage = null;

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
        _pControlElement._is_control = false;
        _pControlElement.zoom = 100;
        _pControlElement._edge_elem = null;
        _pControlElement._apply_client_padding = true;
        _pControlElement._contents_maxheight = 0;
        _pControlElement._contents_maxwidth = 0;
        _pControlElement._has_contents_size = false;

        //--------------------------------
        _pControlElement._border_info = null;
        _pControlElement._padding_info = null;
        _pControlElement._edge_info = null;

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

        // lym: designform 용
        _pControlElement._step_container_elements = null;

        _pControlElement.create = function (win)
        {
            var win_handle;
            var owner_elem;
            var bPositionRtl;
            var left;
            var handle;
            // if parent is control element
            if (!this._is_popup)
            {
                owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
                if (owner_elem && owner_elem.handle && !this.handle)
                {
                    this.owner_elem = owner_elem;
                    win_handle = win.handle || owner_elem._getRootWindowHandle();
                    var classname = this._classname ? this._classname : this._getElementClassName();
                    bPositionRtl = this._isParentRtl();
                    left = this.left;

                    if (bPositionRtl)
                    {
                        left = this._getRTLPositionLeft(left, this.width);
                    }
                    handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height, classname, this.name, this._is_control);

                    /////////////////////////////////
                    // append TO Parent Element
                    this.handle = this.dest_handle = handle;

                    // render
                    this._refreshControl(handle);

                    if (this.linkedcontrol && this.linkedcontrol._real_enable == false)
                    {
                        if (!this.status)
                        {
                            this.status = "disabled";
                            nexacro.__setElementHandleStatus(handle, "disabled");
                        }
                    }
                    if (!this._is_nc_element)
                    {
                        nexacro.__setElementHandleStatus(owner_elem.dest_handle, owner_elem.status);
                    }
                    nexacro.__appendElementHandle((this._is_nc_element) ? owner_elem.handle : owner_elem.dest_handle, handle);

                    if (!this._is_simple_control)
                    {
                        left = this.client_left;
                        if (bPositionRtl)
                        {
                            left = this._getRTLContainerPositionLeft(this.client_left, this.client_width);
                        }

                        var inner_node = nexacro.__createContainerElementHandle(this, win_handle, left, this.client_top, this.client_width, this.client_height, "nexasimplecontainer");
                        this.dest_handle = inner_node;
                        nexacro.__appendElementHandle(handle, inner_node);
                    }
                }
            }
            else   //for is_popup
            {
                if (!this.handle)
                {
                    var linkedcontrol = this.linkedcontrol;

                    // if parent is Window	                
                    win_handle = win.handle;
                    owner_elem = win;
                    bPositionRtl = this._isParentRtl();
                    left = this.left;

                    if (bPositionRtl)
                    {
                        left = this._getRTLPositionLeft(left, this.width);
                    }

                    handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, this._is_control);

                    this._refreshControl(handle);

                    // append TO Parent Element
                    this.handle = this.dest_handle = handle;

                    if (linkedcontrol._findOwnerElementHandle)
                    {
                        var owner_elem_info = linkedcontrol._findOwnerElementHandle();
                        if (owner_elem_info.is_append)
                        {
                            nexacro.__appendElementHandle(owner_elem_info.owner_handle, handle);
                        }
                        else
                        {
                            // TODO Runtime버젼 미구현!!!!
                            nexacro.__insertElementHandle(owner_elem_info.owner_handle, handle, owner_elem_info.ref_handle);
                        }

                        this.owner_elem = owner_elem_info.owner_handle._linked_element; // Runtime Handle은 Number 확인필요
                    }
                    else
                    {
                        nexacro.__appendElementHandle(win_handle, handle);
                        this.owner_elem = owner_elem;
                    }
                }
            }
        };

        _pControlElement.createCommandStart = function ()
        {
            return "";
        };
        //_pControlElement.createCommandEnd = function ()
        //{
        //};

        //_pControlElement.attachHandle = function (win)
        //{
        //};

        _pControlElement._on_destroy = nexacro._emptyFn;
        _pControlElement.destroy = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.	           
                if (this.owner_elem)
                    owner_handle = this.owner_elem.dest_handle;

                owner_handle = (this._is_nc_element) ? this.parent_elem.handle : owner_handle;

                if (!this.owner_elem || owner_handle)
                {
                    nexacro._AccessibilityUtil.unsupportMobileApplicationAccessibility(this);
                    nexacro.__destroyElementHandle(owner_handle, handle);
                }

                if (!this._is_simple_control)
                {
                    nexacro.__destroyElementHandle(handle, this.dest_handle);
                    this.dest_handle = null;
                }

                this.owner_elem = null;

                if (this._client_elem)
                {
                    this._client_elem.destroy();
                    this._client_elem = null;
                }

                this._on_destroy();

            }

            this.handle = null;
            this._p_parent = null;
            this.parent_elem = null;
            this.linkedcontrol = null;
        };

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


        // control common functions
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
            this._is_control = control._is_subcontrol;   //for css class search
        };

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
                this.parent_elem = this.owner_elem = elem;
            }
        };

        _pControlElement.setElementLayoutContainerProps = function ()
        {

        };
        _pControlElement.setElementLayoutContentsProps = function ()
        {

        };

        _pControlElement.setElementPositionStep = function (position_step)
        {
            if (this.position_step != position_step || position_step == -1)
            {
                this.position_step = position_step;

                var handle = this.handle;
                if (handle && this.parent_elem)
                {
                    var oldowner_elem = this.owner_elem;
                    var owner_elem = this.parent_elem.getContainerElement(position_step);
                    if (oldowner_elem && oldowner_elem.dest_handle && owner_elem && owner_elem.dest_handle)
                    {
                        nexacro.__unlinkElementHandle(oldowner_elem.dest_handle, handle);
                        nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
                        this.owner_elem = owner_elem;
                    }
                }
            }
        };

        // TODO2 동적 set검토 필요
        _pControlElement.setElementFlexShrink = nexacro._emptyFn;
        _pControlElement._setElementLayoutBasis = nexacro._emptyFn;
        _pControlElement.setElementLayoutOrder = nexacro._emptyFn;
        _pControlElement.setElementTableCellArea = nexacro._emptyFn;

        _pControlElement._setElementTransition = nexacro._emptyFn;

        _pControlElement.appendChildElement = function (elem)
        {
            if (this.handle)
            {
                if (elem.parent_elem != this)
                {
                    elem.parent_elem = this;
                    /*
                                        if (elem.handle)
                                        {
                                            elem.parent_elem = this;
                    
                                            var old_win_handle = elem._getRootWindowHandle();
                                            var new_win_handle = this.getContainerElement(this.position_step)._getRootWindowHandle();
                                            if (old_win_handle != new_win_handle)   // 
                                            {
                                                elem.parent_elem = this;
                                                // for recreate Child Element Handle
                                                elem._destroyElementHandle();
                                            }
                                            else
                                            {
                                                elem.parent_elem = this;
                                            }
                                        }
                                        else
                                        {
                                            elem.parent_elem = this;
                                        }
                    */
                }

                // if child element is not created ==> create child handle
                if (!elem.handle)
                {
                    elem.create(this._getWindow());
                }
                else
                {
                    //elem._appendToContainer(this._client_elem);
                    elem._appendToContainer(this.getContainerElement(elem.position_step));
                }
            }
        };

        _pControlElement.insertChildElement = function (elem, before_elem)
        {
            if (this.handle)
            {
                if (elem.parent_elem != this)
                {
                    elem.parent_elem = this;
                }

                // if child element is not created ==> create child handle
                if (!elem.handle)
                {
                    elem.create(this._getWindow());
                }
                else
                {
                    //elem._appendToContainer(this._client_elem);
                    elem._insertToContainer(this.getContainerElement(elem.position_step), before_elem);
                }
            }
        };

        _pControlElement.removeChildElement = function (elem)
        {
            // this child element is client element
            if (elem.parent_elem == this)
            {
                elem._removeFromContainer();
            }
        };

        _pControlElement._getComputedStyle = function (prop, noflush)
        {
            if (this.handle && prop)
            {
                if (!noflush)
                    this._flushCommand();

                var computedstyle = nexacro.__getElementHandleStyleValue(this.handle, prop);
                return computedstyle;
            }
        };

        _pControlElement._getComputedStyleSubValue = function (prop, subprop, noflush)
        {
            if (this.handle && prop && subprop)
            {
                if (!noflush)
                    this._flushCommand();

                return nexacro.__getElementHandleStyleSubValue(this.handle, prop, subprop);
            }
        };

        _pControlElement._getComputedStyleBackgroundColor = function (noflush, bExport)
        {
            if (this.handle)
            {
                if (!noflush)
                    this._flushCommand();
                if (bExport)
                {
                    var ret = nexacro.__getElementHandleStyleValue(this.handle, "background");

                    if (ret && ret.indexOf("linear-gradient") >= 0)
                        return ret;
                }
                return nexacro.__getElementHandleStyleSubValue(this.handle, "background", "background-color");
            }
        };

        _pControlElement._flushCommand = function ()
        {
            if (nexacro._Browser == "Runtime")
                nexacro._flushCommand(this._getWindow());
        };

        _pControlElement._sendToBackElement = function (elem)
        {
            if (elem && elem.owner_elem.dest_handle == this.dest_handle && elem.handle)
            {
                nexacro.__setElementHandleSendToBack(elem.handle);
            }
        };

        _pControlElement._bringToFrontElement = function (elem)
        {
            if (elem && elem.owner_elem.dest_handle == this.dest_handle && elem.handle)
            {
                nexacro.__setElementHandleBringToFront(elem.handle);
            }
        };

        _pControlElement._moveToNextElement = function (elem, base_elem)
        {
            if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
            {
                nexacro.__setElementHandleMoveToNext(elem.handle, base_elem.handle);
            }
        };

        _pControlElement._moveToPrevElement = function (elem, base_elem)
        {
            if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
            {
                nexacro.__setElementHandleMoveToPrev(elem.handle, base_elem.handle);
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

        _pControlElement.saveToImageObject = function ()
        {
            var handle = this.handle;
            if (handle && this.parent_elem)
            {
                var url = nexacro.__saveToImageBase64String(handle);
                if (url)
                {
                    var imgObj = new nexacro.Image();
                    imgObj.set_src(url);
                    imgObj.setBase64String(imgObj.src);
                    return imgObj;
                }
            }
        };

        _pControlElement._setElementHScrollPos = function (hpos)
        {
            var handle = this.handle;
            if (handle)
            {
                if (this._isRtl()) hpos = -hpos;
                nexacro.__setElementHandleHScrollPos(handle, hpos);
            }
        };

        _pControlElement._setElementVScrollPos = function (vpos)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleVScrollPos(handle, vpos);
            }
        };

        _pControlElement._setElementScrollPos = function (hpos, vpos)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleOffset(handle, hpos, vpos);
            }
        };

        _pControlElement.setElementTranslateStart = nexacro._emptyFn;
        _pControlElement.setElementTranslateEnd = nexacro._emptyFn;

        _pControlElement.setElementHScrollPos = function (hpos)
        {
            if (hpos < 0) hpos = 0;
            if (hpos > this.hscroll_limit)
            {
                hpos = this.hscroll_limit;
            }

            if (this.scroll_left != hpos)
            {
                this.scroll_left = hpos;
                if (this._client_elem._use_translate_scroll)
                {
                    //this.getContainerElement(this.position_step)._setElementHScrollPos(hpos);
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
            if (this.scroll_top != vpos)
            {
                this.scroll_top = vpos;
                if (this._client_elem._use_translate_scroll)
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
                if (this._client_elem._use_translate_scroll)
                {
                    this._client_elem._setElementScrollPos(hpos, vpos);
                }

                /*
                if (this._hscroll_control)
                {
                    this._hscroll_control._setScrollPos(this.scroll_left);
                }
                if (this._vscroll_control)
                {
                    this._vscroll_control._setScrollPos(this.scroll_top);
                }
                */
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
                        nexacro.__setElementHandleCSSClassName(handle, classname);
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
                        nexacro.__setElementHandleCSSClassName(handle, classname);
                    }
                }
            }
        };

        _pControlElement.setElementCSSMapInfo = function (border, padding, edge)
        {
            var change_border = false, change_padding = false;
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

            //var handle = this.handle;
            var change_inner = (change_border && this._updateInnerSize());
            //          if (handle)
            {
                if (change_inner || change_padding)
                {
                    this._updateClientRect();
                }
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
                    nexacro.__setElementHandleZindex(handle, zindex);
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
                    if (nexacro._isNull(tooltiptext))
                        tooltiptype = "none";
                    nexacro.__setElementHandleToolTip(handle, tooltiptext, tooltiptype);
                }
            }
        };

        _pControlElement.setElementFocus = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleFocus(handle);
                nexacro.__setLastFocusedElement(this);
            }
        };

        // override functions
        _pControlElement.setElementSize = function (width, height, update)
        {
            if (this.width != width || this.height != height || update)
            {
                this.width = width;
                this.height = height;

                if (this._updateInnerSize() || update)
                {
                    this._updateClientRect(update);
                }

                var handle = this.handle;
                if (handle)
                {
                    var bPositionRtl = this._isParentRtl();
                    if (bPositionRtl)
                    {
                        var newLeft = this._getRTLPositionLeft(this.left, width);
                        if (newLeft || this.top)
                        {
                            //trace("name:"+ this.name + " rtl left:"+ newLeft + " left:"+ this.left);
                            nexacro.__setElementHandlePosition(handle, newLeft, this.top);
                        }
                        else
                            nexacro.__clearElementHandlePosition(handle);
                    }

                    nexacro.__setElementHandleSize(handle, this.width, this.height);
                }
            }
        };

        _pControlElement.setElementBorderRadius = function (borderradius)
        {
            this.borderRadius = borderradius;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleBorderRadiusObject(handle, borderradius, this.rtl);
            }
        };

        _pControlElement.setElementBorder = function (border)
        {
            // update Border
            this.border = border;

            // Check New Architecture
            if (this._updateInnerSize())
            {
                this._updateClientRect();
            }

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleBorderObject(handle, border, this.rtl);
            }
        };

        _pControlElement.setElementBorderLeftNone = function (borderleft)
        {
            // update Border
            this.borderLeftNone = borderleft;
            if (this._updateInnerSize())
            {
                this._updateClientRect();
            }

            var handle = this.handle;
            if (handle)
            {
                if (this._get_rtl())
                    nexacro.__setElementHandleBorderRightNone(handle, borderleft);
                else
                    nexacro.__setElementHandleBorderLeftNone(handle, borderleft);
            }
        };

        _pControlElement.setElementBorderTopNone = function (bordertop)
        {
            // update Border
            this.borderTopNone = bordertop;
            if (this._updateInnerSize())
            {
                this._updateClientRect();
            }

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleBorderTopNone(handle, bordertop);
            }
        };

        _pControlElement.setElementBorderRightNone = function (borderright)
        {
            // update Border
            this.borderRightNone = borderright;
            if (this._updateInnerSize())
            {
                this._updateClientRect();
            }

            var handle = this.handle;
            if (handle)
            {
                if (this._get_rtl())
                    nexacro.__setElementHandleBorderLeftNone(handle, borderright);
                else
                    nexacro.__setElementHandleBorderRightNone(handle, borderright);
            }
        };

        _pControlElement.setElementBorderBottomNone = function (borderbottom)
        {
            // update Border
            this.borderBottomNone = borderbottom;
            if (this._updateInnerSize())
            {
                this._updateClientRect();
            }

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleBorderBottomNone(handle, borderbottom);
            }
        };

        _pControlElement.setElementBorderNone = function (borderleft, bordertop, borderright, borderbottom)
        {
            if (borderleft != this.borderLeftNone || bordertop != this.borderTopNone || borderright != this.borderRightNone || borderbottom != this.borderBottomNone)
            {
                //return;
                this.borderLeftNone = borderleft;
                this.borderTopNone = bordertop;
                this.borderRightNone = borderright;
                this.borderBottomNone = borderbottom;

                this._refreshBorderNone();
            }
        };

        _pControlElement._get_rtl = function ()
        {
            return this.rtl;
        };

        _pControlElement._refreshBorderNone = function ()
        {
            if (this.handle)
            {
                if (this._get_rtl())
                {
                    nexacro.__setElementHandleBorderLeftNone(this.handle, this.borderRightNone);
                    nexacro.__setElementHandleBorderRightNone(this.handle, this.borderLeftNone);
                }
                else
                {
                    nexacro.__setElementHandleBorderLeftNone(this.handle, this.borderLeftNone);
                    nexacro.__setElementHandleBorderRightNone(this.handle, this.borderRightNone);
                }
                nexacro.__setElementHandleBorderTopNone(this.handle, this.borderTopNone);
                nexacro.__setElementHandleBorderBottomNone(this.handle, this.borderBottomNone);
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

        _pControlElement.setElementBackground = function (background)
        {
            // update Background Color
            this.background = background;
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleBackgroundObject(handle, background, this.rtl);
        };

        _pControlElement.setElementEdge = function (edge)
        {
            this.edge = edge;
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleEdgeImageObject(handle, edge);
        };


        // override functions
        _pControlElement.setElementPadding = function (padding)
        {
            this.padding = padding;
            this._updateClientRect();
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandlePaddingObject(handle, padding);
        };

        _pControlElement._updateClientRect = function (update)
        {
            var ret = this._on_updateClientRect();
            if (ret & 1)
                this._on_change_clientPos(this.client_left, this.client_top);
            if ((ret & 2) || update)
                this._on_change_clientSize(this.client_width, this.client_height, update);
        };

        _pControlElement.setElementCursor = function (cursor)
        {
            this.cursor = cursor;
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleCursorObject(handle, cursor);
        };

        // override functions
        _pControlElement.setElementOpacity = function (opacity)
        {
            this.opacity = opacity;
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleOpacityObject(handle, opacity);
        };


        _pControlElement.setElementBoxShadow = function (boxshadow)
        {
            this.boxShadow = boxshadow;
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleShadowObject(handle, boxshadow, this.rtl);
        };

        _pControlElement.setElementZoom = function (zoomfactor)
        {
            var handle = this.handle;
            if (handle)
            {
                if (zoomfactor < 0) zoomfactor = 0;
                this.zoom = zoomfactor;
                nexacro.__setElementHandleScale(handle, zoomfactor);
            }
        };

        _pControlElement.setElementDisplay = function (display)
        {
            if (this.display != display)
            {
                this.display = display;
                var handle = this.handle;
                if (handle)
                {
                    if (display == "none")
                        nexacro.__setElementHandleVisible(handle, false);
                    else
                        nexacro.__setElementHandleVisible(handle, true);
                }
            }
        };



        //simplecontrol : true/false 
        _pControlElement.setElementSimpleControl = function (simplecontrol)
        {
            if (this._is_simple_control != simplecontrol)
            {
                var handle = this.handle;
                if (handle)
                {
                    if (!this._is_simple_control)
                    {
                        nexacro.__destroyElementHandle(handle, this.dest_handle);
                        this.dest_handle = handle;
                    }
                    else  //simple
                    {
                        var owner_elem = this.owner_elem;
                        var win_handle = owner_elem._getRootWindowHandle();

                        var inner_node = nexacro.__createContainerElementHandle(this, win_handle, this.client_left, this.client_top, this.client_width, this.client_height, "nexasimplecontainer");
                        this.dest_handle = inner_node;
                        nexacro.__appendElementHandle(handle, inner_node);
                    }
                }
                this._is_simple_control = simplecontrol;
            }
        };

        _pControlElement.setElementHittestType = function (httype)
        {
            if (this._hittest_type != httype)
            {
                this._hittest_type = httype;
                if (this.handle)
                {
                    nexacro.__setElementHittestValue(this.handle, httype);
                }
            }
        };

        _pControlElement.getClientLeft = function ()
        {
            if (!this._is_simple_control)
            {
                return 0;
            }
            return this.client_left;
        };

        _pControlElement.getClientTop = function ()
        {
            if (!this._is_simple_control)
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

        _pControlElement.beginTransitionEffect = function (obj)
        {
            if (this.handle && obj)
            {
                nexacro.__beginTransitionEffect(this.handle, obj);
            }
        };
        _pControlElement.applyTransitionEffect = function ()
        {
            if (this.handle)
            {
                nexacro.__applyTransitionEffect(this.handle);
            }
        };
        _pControlElement.cancelTransitionEffect = function ()
        {
            if (this.handle)
            {
                nexacro.__cancelTransitionEffect(this.handle);
            }
        };

        // Accessibility functions
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
        _pControlElement.notifyAccessibility = nexacro._emptyFn;
        _pControlElement._refreshAccessibilityInfo = nexacro._emptyFn;
        _pControlElement._makeAccessibilityLabelbyReadtype = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityParentLabel = nexacro._emptyFn;
        _pControlElement._updateElementAccessibilityLabel = nexacro._emptyFn;

        _pControlElement._setElementScrolltype = nexacro._emptyFn;
        _pControlElement._refreshLayoutInfo = nexacro._emptyFn;

        _pControlElement._refreshControl = function (handle)
        {
            this._refreshCommonStyleProps(handle);

            if (this._hittest_type)
                nexacro.__setElementHittestValue(handle, this._hittest_type);
            if (this.tabindex >= -1)
                nexacro.__setElementHandleTabIndex(handle, this.tabindex);
            if (!nexacro._isNull(this.tooltiptext))
                nexacro.__setElementHandleToolTip(handle, this.tooltiptext, this.tooltiptype);
            if (this.zindex >= 0)
                nexacro.__setElementHandleZindex(handle, this.zindex);
            if (this.borderRadius)
                nexacro.__setElementHandleBorderRadiusObject(handle, this.borderRadius, this.rtl);
            if (this.border)
                nexacro.__setElementHandleBorderObject(handle, this.border, this.rtl);
            if (this.borderLeftNone)
            {
                if (this._get_rtl())
                    nexacro.__setElementHandleBorderRightNone(handle, this.borderLeftNone);
                else
                    nexacro.__setElementHandleBorderLeftNone(handle, this.borderLeftNone);
            }
            if (this.borderTopNone)
                nexacro.__setElementHandleBorderTopNone(handle, this.borderTopNone);
            if (this.borderRightNone)
            {
                if (this._get_rtl())
                    nexacro.__setElementHandleBorderLeftNone(handle, this.borderRightNone);
                else
                    nexacro.__setElementHandleBorderRightNone(handle, this.borderRightNone);
            }
            if (this.borderBottomNone)
                nexacro.__setElementHandleBorderBottomNone(handle, this.borderBottomNone);
            if (this.background)
                nexacro.__setElementHandleBackgroundObject(handle, this.background, this.rtl);
            if (this.padding)
                nexacro.__setElementHandlePaddingObject(handle, this.padding);
            if (this.cursor)
                nexacro.__setElementHandleCursorObject(handle, this.cursor);
            if (this.opacity)
                nexacro.__setElementHandleOpacityObject(handle, this.opacity);
            if (this.boxShadow)
                nexacro.__setElementHandleShadowObject(handle, this.boxShadow, this.rtl);
            if (this.edge)
                nexacro.__setElementHandleEdgeImageObject(handle, this.edge);
            if (this.status)
                nexacro.__setElementHandleStatus(handle, this.status);
            if (this.userstatus)
                nexacro.__setElementHandleUserStatus(handle, this.userstatus);

            this._refreshAccessibilityInfo(handle);

            //TODO2
        };

        _pControlElement._refreshControlTabIndex = nexacro._emptyFn;

        _pControlElement.getElementScrollWidth = function ()
        {
            return this.inner_width;
        };
        _pControlElement.getElementScrollHeight = function ()
        {
            return this.inner_height;
        };

        //======================================================================
        // _pControlElement's Platform Methods
        //======================================================================
        _pControlElement._updateInnerSize = function ()
        {
            var inner_width = this.width;
            var inner_height = this.height;

            var border = this.border ? this.border : this._border_info;
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
            return ret;
        };

        _pControlElement._on_change_clientPos = function (left, top)
        {
            var notify = false;

            var client_elem = this._client_elem;
            if (client_elem)
            {
                client_elem.setElementPosition(left, top);
            }
            else if (this.handle && this.handle != this.dest_handle)
            {
                var newLeft = this._getRTLPositionLeft(left, this.width);
                var dest_handle = this.dest_handle;
                if (newLeft || top)
                {
                    nexacro.__setElementHandlePosition(dest_handle, newLeft, top);
                }
                else
                    nexacro.__clearElementHandlePosition(dest_handle);
            }
            else
                notify = true;

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
            else if (!this._is_simple_control)
            {
                if (this.handle && this.handle != this.dest_handle)
                {
                    var dest_handle = this.dest_handle;
                    nexacro.__setElementHandleSize(dest_handle, width, height);
                }
            }

            var control = this.linkedcontrol;
            if (control)
            {
                control.on_change_containerRect(width, height);
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

        _pControlElement._isMultiInnerProc = function ()
        {
            return false;
        };

        //======================================================================
        // nexacro.FrameControlElement - this Element is Frame ControlElement --> this is simple control element
        //======================================================================
        // this FrameControlElement has ScrollControlElement
        nexacro.FrameControlElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;

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

        _pFrameControlElement._resizable = false;

        //==== internal handles =========//
        _pFrameControlElement.win_handle = null;  // Window Handle
        //==== default flags =========//
        //==== end of initial =========//

        _pFrameControlElement.create = function (win)
        {
            var win_handle;
            var bPositionRtl;
            var left;
            var handle;
            var inner_node;
            if (!this.handle)
            {
                if (this.parent_elem == null)
                {
                    // if parent is Window	                
                    win_handle = this.win_handle = win.handle;
                    this.owner_elem = win;
                    this._is_window_element = true;
                    this.left = 0;
                    this.top = 0;
                    this.width = win.clientWidth;
                    this.height = win.clientHeight;

                    bPositionRtl = this._isParentRtl();
                    left = this.left;

                    if (bPositionRtl)
                    {
                        left = this._getRTLPositionLeft(left, this.width);
                    }

                    handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, this._is_control);

                    // append TO Parent Element
                    this.handle = this.dest_handle = handle;
                    nexacro.__appendElementHandle(this.owner_elem.handle, handle);

                    if (!this._is_simple_control)
                    {
                        left = this.client_left;
                        if (bPositionRtl)
                        {
                            left = this._getRTLContainerPositionLeft(this.client_left, this.client_width);
                        }
                        inner_node = nexacro.__createContainerElementHandle(this, win_handle, left, this.client_top, this.client_width, this.client_height, "nexasimplecontainer");
                        this.dest_handle = inner_node;
                        nexacro.__appendElementHandle(handle, inner_node);
                    }

                    // render
                    this._refreshControl(handle);
                }
                else
                {
                    // parent is always control element
                    var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement();
                    if (owner_elem && owner_elem.handle && !this.handle)
                    {
                        this.owner_elem = owner_elem;
                        win_handle = win.handle || owner_elem._getRootWindowHandle();

                        bPositionRtl = this._isParentRtl();
                        left = this.left;

                        if (bPositionRtl)
                        {
                            left = this._getRTLPositionLeft(left, this.width);
                        }

                        handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, this._is_control);

                        // append TO Parent Element
                        this.handle = this.dest_handle = handle;
                        nexacro.__appendElementHandle(owner_elem.dest_handle, handle);

                        if (!this._is_simple_control)
                        {
                            left = this.client_left;
                            if (bPositionRtl)
                            {
                                left = this._getRTLContainerPositionLeft(this.client_left, this.client_width);
                            }
                            inner_node = nexacro.__createContainerElementHandle(this, win_handle, left, this.client_top, this.client_width, this.client_height, "nexasimplecontainer");
                            this.dest_handle = inner_node;
                            nexacro.__appendElementHandle(handle, inner_node);
                        }

                        // render
                        this._refreshControl(handle);
                    }
                }

                if (this._resizable)
                {
                    this._createBorderElements();
                    this._updateBorderElementsPosition();
                }
            }
            //else
            //{
            //    // frameset에서 빼낸 경우 element는 그대로 존재함.
            //}
        };

        _pFrameControlElement._on_destroy = function ()
        {
            this.win_handle = null;
            this._destroyBorderElements();
            this._title_control = null;
            this._status_control = null;
        };

        //_pFrameControlElement.getContainerElement = function ()
        //{
        //    return this;
        //};

        _pFrameControlElement._getRootWindowHandle = function ()
        {
            if (this._is_window_element)
                return this.win_handle;
            else if (this.owner_elem)
                return this.owner_elem._getRootWindowHandle();
            else if (this.parent && this.parent._getRootWindowHandle)
                return this.parent._getRootWindowHandle();
            return null;
        };

        _pFrameControlElement._updateClientRect = function (update)
        {
            var ret = this._on_updateClientRect();
            if (ret & 1)
                this._on_change_clientPos(this.client_left, this.client_top);
            if ((ret & 2) || update)
                this._on_change_clientSize(this.client_width, this.client_height);

            if (ret)
                this._updateBorderElementsPosition();
        };

        _pFrameControlElement._setAttachClientLeft = nexacro._emptyFn;
        _pFrameControlElement._setAttachClientRight = nexacro._emptyFn;
        _pFrameControlElement._setAttachClientTop = nexacro._emptyFn;
        _pFrameControlElement._setAttachClientBottom = nexacro._emptyFn;
        _pFrameControlElement.setTitleBarDrag = nexacro._emptyFn;

        _pFrameControlElement._on_updateClientRect = function ()
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

        //////////////////////////////////////////////////////////////////////////
        // frame control not apply padding to client_element

        //////////////////////////////////////////////////////////////////////////
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
                        if (child_elem._doc != this._doc)
                        {
                            child_elem.parent_elem = this._client_elem;
                            // for recreate Child Element Handle
                            child_elem._destroyDOMHandle();
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
                if (this.font)
                {
                    child_elem.setElementFont(this.font);
                }
                if (this.color)
                {
                    child_elem.setElementColor(this.color);
                }
                //if (this.align)
                //{
                //    child_elem.setElementAlign(this.align);
                //}
                //else if (this.halign || this.valign)
                //{
                //    child_elem.setElementAlignXY(this.halign, this.valign);
                //}

                // if child element is not created ==> create child handle
                if (!child_elem.handle)
                {
                    child_elem.create(this._getWindow());
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
                nexacro.__setElementHandleSendToBack(elem.handle);
                if (elem._border_elems)
                {
                    for (var i = 0; i < elem._border_elems.length; i++)
                        nexacro.__setElementHandleSendToBack(elem._border_elems[i].handle);
                }
            }
        };
        _pFrameControlElement.bringToFrontElement = function (cur_elem)
        {
            // client_element가 생김에 따라 ..
            // this                 = frameset control_elem
            // cur_elem             = childframe's control_elem
            // cur_elem.owner_elem = frameset's client_elem
            if (cur_elem && cur_elem.owner_elem &&
                cur_elem.owner_elem.owner_elem == this.owner_elem && cur_elem.handle)
            {
                nexacro.__setElementHandleBringToFront(cur_elem.handle);
                if (cur_elem._border_elems)
                {
                    for (var i = 0; i < cur_elem._border_elems.length; i++)
                        nexacro.__setElementHandleBringToFront(cur_elem._border_elems[i].handle);
                }
            }
        };

        _pFrameControlElement.moveToNextElement = function (elem, base_elem)
        {
            var client_element = this.getContainerElement(elem.position_step);
            client_element.moveToNextElement(elem, base_elem);
        };

        _pFrameControlElement.moveToPrevElement = function (elem, base_elem)
        {
            var client_element = this.getContainerElement(elem.position_step);
            client_element.moveToPrevElement(elem, base_elem);
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
            var parent_elem = this.parent_elem;
            if (this._border_elems.length > 0)
            {
                // TODO check element.create가 두번 타는 case가 있음. (frame 동적생성시)
                return;
            }

            // 총 8개 resize영역에 해당하는 element 생성
            var i, border_elem, name_table = Array("lt", "t", "rt", "l", "r", "lb", "b", "rb");
            for (i = 0; i < 8; i++)
            {
                border_elem = new nexacro._FrameResizeBorderElement(parent_elem);
                this._border_elems.add_item(name_table[i], border_elem);
            }

            for (i = 0; i < 8; i++)
            {
                border_elem = this._border_elems[i];
                border_elem.linkedcontrol = this.linkedcontrol; // trackevent를 direct로 날림
                border_elem.create(this._getWindow());
            }

            this._setResizable(this._resizable);
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
            var lw, tw, rw, bw;
            if (!border)
            {
                lw = tw = rw = bw = 0;
            }
            else if (border._linecnt == 1)
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

            var inner_width = this.inner_width;
            var inner_height = this.inner_height;
            if (this.zoom != 100 && this.parent._window_type > 0)
            {
                inner_width *= nexacro._getDevicePixelRatio(this);
                inner_height *= nexacro._getDevicePixelRatio(this);
            }

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
            var i, y = top;
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
            for (i = 0; i < 8; i++)
            {
                if (i == 0 || i == 3 || i == 5) x = lw;
                if (i == 1 || i == 6) x = inner_width;
                if (i == 2 || i == 4 || i == 7) x = rw;
                if (i < 3) y = tw;
                else if (i < 5) y = inner_height;
                else y = bw;

                this._border_elems[i].setElementSize(x, y);
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

                var is_apply;
                if (nexacro.System.navigatorname == "nexacro")
                {
                    // Runtime
                    is_apply = (this._is_window_element && resizable);
                }
                else
                {
                    // Embeded Plugin
                    is_apply = (this._is_window_element && resizable);
                    if (this._getWindowHandle() == nexacro._getMainWindowHandle())
                        is_apply = false;
                }

                var cursor_table = Array("nw", "n", "ne", "w", "e", "sw", "s", "se");
                var hittest_table = Array("topleft", "top", "topright", "left", "right", "bottomleft", "bottom", "bottomright");
                for (var i = 0; i < 8; i++)
                {
                    var border_elem = this._border_elems[i];
                    border_elem._is_track = resizable;

                    var cursor;
                    if (resizable)
                        cursor = nexacro.CursorObject(cursor_table[i] + "-resize");
                    else
                        cursor = nexacro.CursorObject("arrow"); // TODO check default로 되돌릴 방법??

                    if (is_apply)
                        border_elem.setElementHittestType("resizingborder_" + hittest_table[i]);
                    else
                        border_elem.setElementHittestType("fixedborder");

                    border_elem.setElementCursor(cursor);

                    // Runtime에서 Quicksort로 인해 동일 zIndex인 node의 순서가 보장되지 않는다.
                    // border에 높은 zIndex를 줄 필요가 있음.
                    /*
                    if (this.zindex == -1)
                        border_elem.setElementZIndex(1);
                    else
                        border_elem.setElementZIndex(this.zindex + 1);
                    */
                }
            }

            // TODO statusbar grip image
            var statuscontrol = this._status_control;
            if (statuscontrol)
                statuscontrol.set_resizable(resizable);
        };

        //frame don't supported padding
        _pFrameControlElement.setElementCSSMapInfo = function (border, padding, edge)
        {
            nexacro.ControlElement.prototype.setElementCSSMapInfo.call(this, border, null, edge);
        };

        _pFrameControlElement.setElementSize = function (width, height, update, isInnerFrame)
        {
            //if (this._type_name == "FrameControlElement")   // for wheel zoom. this._type_name == "FrameControlElement" : mainframe, this._type_name == "ScrollableControlElement" : open widnow childframe.form
            {
                this._unscaledwidth = width;
                this._unscaledheight = height;
                if (this.zoom == 100 || isInnerFrame == true)
                {
                    this.width = width;
                    this.height = height;
                }
                else
                {
                    this.width = width * 100 / this.zoom;
                    this.height = height * 100 / this.zoom;
                }
            }

            if (this._updateInnerSize() || update)
            {
                this._updateClientRect(update);
            }

            var handle = this.handle;
            if (handle)
            {
                var bPositionRtl = this._isParentRtl();
                if (bPositionRtl)
                {
                    var newLeft = this._getRTLPositionLeft(this.left, width);
                    if (newLeft || this.top)
                    {
                        nexacro.__setElementHandlePosition(handle, newLeft, this.top);
                    }
                    else
                        nexacro.__clearElementHandlePosition(handle);
                }

                nexacro.__setElementHandleSize(handle, this.width, this.height);
            }
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

        //==== internal handles =========//
        __pFrameResizeBorderElement.win_handle = null;  // Window Handle

        __pFrameResizeBorderElement.create = function (win)
        {
            var owner_elem;
            var win_handle;
            if (this.parent_elem == null)
            {
                owner_elem = win;
                win_handle = this.win_handle = win.handle;
                this.left = 0;
                this.top = 0;
                //this.width = win.clientWidth;
                //this.height = win.clientHeight;
            }
            else
            {
                owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement();
                win_handle = win.handle || owner_elem._getRootWindowHandle();
            }

            // if parent is control element
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;

                //var bPositionRtl = this._isParentRtl();
                var left = this.left;

                /*if (bPositionRtl)
                {   
                    //left = this._getRTLPositionLeft(left, this.width);
                }*/

                var handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height);

                // render
                this._refreshControl(handle);

                // append TO Parent Element
                this.handle = this.dest_handle = handle;
                nexacro.__appendElementHandle(this._is_nc_element ? owner_elem.handle : owner_elem.dest_handle, handle);
            }
        };

        __pFrameResizeBorderElement.setElementSize = function (width, height, update)
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
                        nexacro.__setElementHandleSize(handle, width, height);
                    else
                        nexacro.__clearElementHandleSize(handle);
                }
            }
        };

        __pFrameResizeBorderElement._on_destroy = function ()
        {
            this.win_handle = null;
        };


        __pFrameResizeBorderElement._getRootWindowHandle = function ()
        {
            if (this._is_window_element)
                return this.win_handle;
            else if (this.owner_elem && this.owner_elem._getRootWindowHandle)
                return this.owner_elem._getRootWindowHandle();
            return null;
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

        __pFrameResizeBorderElement._getRTLPositionLeft = function (left, width)
        {
            return left;
        };

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

        _pModalOverlayElement.create = function (/*win*/)
        {
            if (this.parent_elem && !this.handle)
            {
                var _win = this.linkedcontrol._getWindow();
                this.win_handle = _win.handle;

                this.left = 0;
                this.top = 0;
                this.width = _win.clientWidth;
                this.height = _win.clientHeight;

                //var bPositionRtl = this._isParentRtl();
                //var left = this.left;

                /* if (bPositionRtl)
                 {
                     this.rtl = bPositionRtl;
                     //left = this._getRTLPositionLeft(left, this.width);
                 }*/

                var handle = this.handle = this.dest_handle = nexacro.__createControlElementHandle(this, this.win_handle, this.left, this.top, this.width, this.height, null, this.name);
                handle._linked_element = this;  // Runtime Handle은 Number 확인필요

                //var handle_style = handle.style;
                if (this.zindex >= 0)
                    nexacro.__setElementHandleZindex(handle, this.zindex);

                _win = this.linkedcontrol._getWindow();
                var waitcomp_elem = _win.root._getWaitComponentElement();
                var ref_dest_handle = null;
                if (waitcomp_elem)
                    ref_dest_handle = waitcomp_elem.handle;
                var owner_elem = _win;

                if (ref_dest_handle)
                {
                    nexacro.__insertElementHandle(owner_elem.dest_handle, handle, ref_dest_handle);
                }
                else
                {
                    nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
                }

                this._refreshControl(handle);
            }
        };

        _pModalOverlayElement.destroy = function ()
        {
            if (!this.handle)
                return;

            var _win = this.linkedcontrol._getWindow();
            var owner_elem = _win;

            nexacro.__destroyElementHandle(owner_elem.handle, this.handle);
            this.handle = null;
        };

        _pModalOverlayElement.setElementSize = function (width, height, update)
        {
            nexacro.Element.prototype.setElementSize.call(this, width, height, update);
        };

        _pModalOverlayElement._getRootWindowHandle = function ()
        {
            return this.win_handle;
        };

        //======================================================================
        // nexacro.ScrollableControlElement
        //======================================================================
        /*
            Scroll : ListBox, FileUpload, ListView ETC..
            Scroll + Step : Form
            Expand : ListViewBand
        */
        nexacro.ScrollableControlElement = function (parent_elem, use_multiinner)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;

            // set container Element
            var client_element = new nexacro._ContainerElement(this);
            this._client_elem = client_element;
        };

        var _pScrollableControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.ScrollableControlElement);
        nexacro.ScrollableControlElement.prototype = _pScrollableControlElement;
        _pScrollableControlElement._type_name = "ScrollableControlElement";

        _pScrollableControlElement.create = function (win)
        {
            var win_handle;
            var owner_elem;
            var bPositionRtl;
            var left;
            var handle;
            // parent is always control element
            if (!this._is_popup)
            {
                owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
                if (owner_elem && owner_elem.handle)
                {
                    if (!this.handle)
                    {
                        this.owner_elem = owner_elem;
                        win_handle = win.handle || owner_elem._getRootWindowHandle();

                        bPositionRtl = this._isParentRtl();
                        left = this.left;

                        if (bPositionRtl)
                        {
                            left = this._getRTLPositionLeft(left, this.width);
                        }
                        handle = nexacro.__createScrollableControlElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, this._is_control);

                        //for designform
                        if (this._init_width > 0 || this._init_height > 0)
                            nexacro.__setElementHandleInitPosSize(handle, this._init_left, this._init_top, this._init_width, this._init_height);

                        // render
                        this._refreshControl(handle);

                        // append TO Parent Element
                        this.handle = this.dest_handle = handle;
                        nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
                    }
                }
            }
            else
            {
                if (!this.handle)
                {
                    var linkedcontrol = this.linkedcontrol;

                    // if parent is Window	                
                    win_handle = win.handle;
                    owner_elem = win;

                    bPositionRtl = this._isParentRtl();
                    left = this.left;

                    if (bPositionRtl)
                    {
                        left = this._getRTLPositionLeft(left, this.width);
                    }

                    handle = nexacro.__createScrollableControlElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), linkedcontrol._unique_id, this._is_control);

                    // append TO Parent Element
                    this.handle = this.dest_handle = handle;

                    this._refreshControl(handle);

                    if (linkedcontrol._findOwnerElementHandle)
                    {
                        var owner_elem_info = linkedcontrol._findOwnerElementHandle();
                        if (owner_elem_info.is_append)
                        {
                            nexacro.__appendElementHandle(owner_elem_info.owner_handle, handle);
                        }
                        else
                        {
                            // TODO Runtime버젼 미구현!!!!
                            nexacro.__insertElementHandle(owner_elem_info.owner_handle, handle, owner_elem_info.ref_handle);
                        }

                        this.owner_elem = owner_elem_info.owner_handle._linked_element;
                    }
                    else
                    {
                        nexacro.__appendElementHandle(win_handle, handle);
                        this.owner_elem = owner_elem;
                    }
                }
            }

            //container element create
            // no need set props for child --> only create it
            // props are already setted to child_elem
            if (this.handle && !this._client_elem.handle)
            {
                this._client_elem.create(win);
            }

            if (this.handle)
            {
                var step_count = this._step_count;
                if (step_count > 0)
                {
                    this._step_containers = [];
                    for (var i = 0; i < step_count; i++)
                    {
                        var step_client = new nexacro._ContainerElement(this._client_elem);
                        step_client.setElementPosition(i * this.client_width, 0);
                        step_client.setElementSize(this.client_width, this.container_maxheight);
                        step_client.create(this._getWindow());
                        this._step_containers.push(step_client);
                    }
                }
            }
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

                // sctollbar control destroyed by component
                this._hscroll_control = null;
                this._vscroll_control = null;
            }

        };

        _pScrollableControlElement._on_clearContents = function ()
        {
            if (this.handle)
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

        _pScrollableControlElement._setInnerElementScrollMaxTops = function (tops) { };

        _pScrollableControlElement.initElementInfo = function ()
        {
            nexacro.ControlElement.prototype.initElementInfo.call(this);

            this._init_left = 0;
            this._init_top = 0;
            this._init_width = 0;
            this._init_height = 0;

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
                if (control._use_translate_scroll === false)
                    this._use_translate_scroll = control._use_translate_scroll;
                else
                {
                    const env = nexacro.getEnvironment();
                    this._use_translate_scroll = env ? env._use_translate_scroll : nexacro._use_translate_scroll;
                }
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

                // init function
                this._on_updateClientRect = this._on_updateClientRectExpand;
                this._on_change_clientPos = this._on_change_clientPosExpand;
                this._on_change_clientSize = this._on_change_clientSizeExpand;
            }
        };

        _pScrollableControlElement.setElementStepCount = function (count)
        {
            if (this._step_count != count)
            {
                var i, step_client, step_count = this._step_count;
                var step_containers = this._step_containers;
                if (step_containers && this._step_count)
                {
                    var _destroy_for_layoutchange = true; // to delete step container only, not children
                    for (i = 0; i < step_count; i++)
                    {
                        step_client = step_containers[i];
                        step_client.destroy(_destroy_for_layoutchange);
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
                        step_client = new nexacro._ContainerElement(this._client_elem);
                        step_client.setElementPosition(i * this.client_width, 0);
                        step_client.setElementSize(this.client_width, this.client_height);
                        step_client.create(this._getWindow());
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
                nexacro.__setElementHandleScale(client.handle, this.zoom);
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

                return true;
            }
            return false;
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
                else if (this._client_elem._use_translate_scroll)
                {
                    this._client_elem._setElementVScrollPos(vpos);
                }

                if (this.linkedcontrol)
                {
                    this.linkedcontrol._setVscrollPos(vpos);
                }
            }
        };

        _pScrollableControlElement._updateClientRect = function (update)
        {
            var ret = this._on_updateClientRect();
            if (ret & 1)
                this._on_change_clientPos(this.client_left, this.client_top);
            if ((ret & 2) || update)
                this._on_change_clientSize(this.client_width, this.client_height);

            //this._on_updateScrollBar(ret & 4, ret & 8);
        };

        _pScrollableControlElement._on_change_clientPos = function (left, top)
        {
            if (this._client_elem)
            {
                if (this.rtl && this._vscroll_visible)
                {
                    //setElementPosition 내부에서 _getRTLPositionLeft으로 가져오는 값이 아래 주석처럼 되어 있어 -값 넘겨줌;
                    //rtlLeft = parent_width - width - left;
                    if (this.linkedcontrol instanceof nexacro.TextArea)
                        left = -left - this._vscroll_size;
                    else
                        left = left - this._vscroll_size;

                }
                this._client_elem.setElementPosition(left, top);

                var step_count = this._step_count;
                var step_index = this._step_index;
                var step_containers = this._step_containers;
                if (step_count > 0 && step_containers)
                {
                    var zclient_width = this._zclient_width;
                    for (var i = 0; i < step_count; i++)
                    {
                        var step_client_elem = step_containers[i];
                        left = zclient_width * i;
                        if (this.rtl && this._vscroll_visible)
                            left = (zclient_width * i) + this._vscroll_size;

                        step_client_elem.setElementPosition(left, 0);
                        if (i == step_index)
                        {
                            step_client_elem.setElementSize(zclient_width, this.container_maxheight);
                        }

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
            }
            else if (this.handle && this.handle != this.dest_handle)
            {
                var dest_handle = this.dest_handle;
                var newLeft = this._getRTLPositionLeft(left, this.width);
                if (newLeft || top)
                {
                    nexacro.__setElementHandlePosition(dest_handle, newLeft, top);
                }
                else
                    nexacro.__clearElementHandlePosition(dest_handle);
            }

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
                if (this.rtl && this._expandbartype && this._expanddirtype == "horz")
                    left = left - this._expandbarwidth;
                client_elem.setElementPosition(left, top);
            }
            else
            {
                var handle = this.handle;
                var dest_handle = this.dest_handle;
                if (handle && handle != dest_handle)
                {
                    var newLeft = this._getRTLPositionLeft(left, this.width);
                    // trace("\nScrollableControlElementEx : " + this.id, left, newLeft);
                    if (newLeft || top)
                    {
                        nexacro.__setElementHandlePosition(dest_handle, newLeft, top);
                    }
                    else
                        nexacro.__clearElementHandlePosition(dest_handle);
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
            if (this._client_elem)
            {
                this._client_elem.setElementSize(width, height);

                var step_count = this._step_count;
                //var step_index = this._step_index;
                var step_containers = this._step_containers;
                if (step_count > 0 && step_containers)
                {
                    var max_height = Math.max(height, this.container_maxheight);

                    var zclient_width = this._zclient_width;
                    for (var i = 0; i < step_count; i++)
                    {
                        var step_client_elem = step_containers[i];
                        step_client_elem.setElementSize(zclient_width, max_height);
                    }
                }
            }
            else if (this.handle && this.handle != this.dest_handle)
            {
                var dest_handle = this.dest_handle;
                nexacro.__setElementHandleSize(dest_handle, width, height);
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
                if (handle && handle != dest_handle)
                {
                    nexacro.__setElementHandleSize(dest_handle, width, height);
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

        _pScrollableControlElement._on_updateClientRect = function ()
        {
            var client_left = 0;
            var client_top = 0;
            var client_width = this.inner_width;
            var client_height = this.inner_height;

            //var cur_inner_width = client_width;
            //var cur_inner_height = client_height;
            var cur_client_width = this.client_width;
            var cur_client_height = this.client_height;

            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
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
            else if (this._attach_client_width > 0)
            {
                client_width = this._attach_client_width;
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
            if (!client_elem)
                return 0;

            var zoomfactor = this.zoom / 100;
            var zclient_width = client_width;
            var zclient_height = client_height;

            if (client_width != 0)
                zclient_width = client_width / zoomfactor;

            if (client_height != 0)
                zclient_height = client_height / zoomfactor;

            this._zclient_width = zclient_width;
            this._zclient_height = zclient_height;

            var container_maxwidth = this.container_maxwidth;
            var container_maxheight = this.container_maxheight;

            var contents_maxwidth = this._contents_maxwidth;
            var contents_maxheight = this._contents_maxheight;
            var has_contents_size = this._has_contents_size;

            var scroll_left = this.scroll_left;
            var scroll_top = this.scroll_top;

            if (zoomfactor != 1)
            {
                var factor = 4;
                zclient_width = nexacro.floor(zclient_width, factor);
                zclient_height = nexacro.floor(zclient_height, factor);
                container_maxwidth = nexacro.floor(container_maxwidth, factor);
                container_maxheight = nexacro.floor(container_maxheight, factor);
            }

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
            this._vscroll_visible = false;

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

                hscroll_limit = 0;
            }

            // 변경된 inner의 사이즈를 기준으로 client를 재계산 해야하는부분에서 현재 client의 값을 비교하는게 이상함.
            if (container_maxheight > zclient_height && (has_contents_size ? contents_maxheight > zclient_height : true))
            {
                if (container_maxheight >= zclient_height)
                    vscroll_limit = container_maxheight - zclient_height;
                else if (container_maxheight > cur_client_height)
                    vscroll_limit = container_maxheight - cur_client_height;

                if (/*(scrolltype != "none" && scrolltype != "horizontal") &&*/ vscrollbartype != "none" && vscrollbartype != "autoindicator")
                {
                    client_width -= this._vscroll_size;
                    zclient_width = client_width / zoomfactor;
                    this._vscroll_visible = true;
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
                    this._vscroll_visible = true;
                    if (container_maxwidth > zclient_width)
                    {
                        hscroll_limit = container_maxwidth - zclient_width;
                    }
                    else if (container_maxwidth > cur_client_width)
                    {
                        hscroll_limit = container_maxwidth - cur_client_width;
                    }
                }

                vscroll_limit = 0;
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

                if (scroll_left > hscroll_limit)
                {
                    this.setElementHScrollPos(hscroll_limit);
                }
            }

            if (this.vscroll_limit != vscroll_limit)
            {
                reset_vlimit = true;
                this.vscroll_limit = vscroll_limit;

                if (scroll_top > vscroll_limit)
                {
                    this.setElementVScrollPos(vscroll_limit);
                }
            }

            this._zclient_width = zclient_width;
            this._zclient_height = zclient_height;

            var ret = 0;
            if (this.client_left != client_left || this.client_top != client_top || this._isRtl())
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

            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
            }

            var client_elem = this._client_elem;
            if (!client_elem || client_width == 0 || client_height == 0)
                return ret;

            if (this._expandbartype && this._expanddirtype == "vert")
            {
                client_height -= this._expandbarheight;
            }

            if (this._expandbartype && this._expanddirtype == "horz")
            {
                client_width -= this._expandbarwidth;
            }

            if (this.client_left != client_left || this.client_top != client_top || this._isRtl())
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

        //for designform 
        _pScrollableControlElement.setElementInitPosSize = function (init_left, init_top, init_width, init_height)
        {
            this._init_left = init_left;
            this._init_top = init_top;
            this._init_width = init_width;
            this._init_height = init_height;

            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleInitPosSize(handle, init_left, init_top, init_width, init_height);
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
        // nexacro._ContainerElement
        //======================================================================
        // this ContainerElement has No Event Handlers -- Container only

        nexacro._ContainerElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
        };
        var __pContainerElement = nexacro._createPrototype(nexacro.Element, nexacro._ContainerElement);
        nexacro._ContainerElement.prototype = __pContainerElement;
        // overide nexacro.Object
        __pContainerElement._type_name = "ContainerElement";

        //==== defaule values =========//
        __pContainerElement._scroll_left = 0;
        __pContainerElement._scroll_top = 0;
        __pContainerElement._use_translate_scroll = nexacro._use_translate_scroll;

        __pContainerElement.create = function (win)
        {
            // this is always nc_element
            // this is always nc_element
            var owner_elem = this.parent_elem;
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                this._use_translate_scroll = owner_elem._use_translate_scroll;
                this._p_name = owner_elem.name + ":container";
                var win_handle = win.handle || owner_elem._getRootWindowHandle();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    //_pElement._getRTLPositionLeft = function (left, width)에서 처리했던 작업을 이곳으로 옮김;
                    //rtlLeft = parent_width - width - left; --> parent_width - width + left;
                    if (owner_elem instanceof nexacro.ScrollableControlElement && owner_elem.parent instanceof nexacro.TextArea)
                    {
                        left = owner_elem.client_width - this.width + left;
                    }
                    else
                        left = this._getRTLPositionLeft(left, this.width);

                }

                var handle = nexacro.__createScrollableContainerElementHandle(this, win_handle, left, this.top, this.width, this.height, "nexacontainer", this.name);

                // set scroll pos
                if (this._scroll_left != 0 || this._scroll_top != 0)
                {
                    nexacro.__setElementHandleOffset(handle, this._scroll_left, this._scroll_top);
                }

                // append TO Parent Element
                this.handle = this.dest_handle = handle;
                nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
            }
        };

        __pContainerElement.destroy = function (_is_stepcontainer_for_layoutchange)
        {
            //if _is_stepcontainer_for_layoutchange == true, destroy step container only, not children
            this._destroyElementHandle(_is_stepcontainer_for_layoutchange);
            this.dest_handle = null;

            this._p_parent = null;
            this.parent_elem = null;
        };

        __pContainerElement.clearContents = function ()
        {
            var handle = this.handle;
            var owner_elem = this.owner_elem;
            if (handle)
            {
                handle._linked_element = null; // Runtime Handle은 Number 확인필요
                if (owner_elem && owner_elem.handle)
                {
                    nexacro.__destroyElementHandle(owner_elem.handle, handle);
                }
                this.owner_elem = null;
                this.handle = null;
            }
        };

        // scroll control methods - this simple client no scroll
        __pContainerElement._setElementVScrollPos = function (vpos)
        {
            if (this._use_translate_scroll)
            {
                if (this._scroll_top != vpos || this.parent._reset_scrollpos)
                {
                    this._scroll_top = vpos;
                    var handle = this.handle;
                    if (handle)
                    {
                        nexacro.__setElementHandleVScrollPos(handle, vpos);
                    }
                }
            }
        };

        __pContainerElement._setElementHScrollPos = function (hpos)
        {
            if (this._use_translate_scroll)
            {
                if (this._scroll_left != hpos || this.parent._reset_scrollpos)
                {
                    this._scroll_left = hpos;
                    var handle = this.handle;
                    if (handle)
                    {
                        if (this._isRtl()) hpos = -hpos;
                        nexacro.__setElementHandleHScrollPos(handle, hpos);
                    }
                }
            }
        };

        __pContainerElement._setElementScrollPos = function (hpos, vpos)
        {
            if (this._use_translate_scroll)
            {
                if (this._scroll_left != hpos || this._scroll_top != vpos || this.parent._reset_scrollpos)
                {
                    this._scroll_left = hpos;
                    this._scroll_top = vpos;
                    var handle = this.handle;
                    if (handle)
                    {
                        nexacro.__setElementHandleOffset(handle, hpos, vpos);
                    }
                }
            }
        };


        __pContainerElement.setElementZoom = function (zoomfactor)
        {
            if (this.handle)
            {
                this.zoom = zoomfactor;
                nexacro.__setElementHandleScale(this.handle, zoomfactor);
            }
        };

        __pContainerElement._findScrollbarControl = function (elem, is_vert)
        {
            while (elem)
            {
                if (is_vert && elem._vscroll_control && elem._vscroll_control._isVisible())
                {
                    return elem._vscroll_control;
                }
                else if (elem._hscroll_control && elem._hscroll_control._isVisible())
                {
                    return elem._hscroll_control;
                }
                elem = elem.parent;
            }
        };

        __pContainerElement._sendToBackElement = function (elem)
        {
            if (elem && elem.owner_elem.dest_handle == this.dest_handle && elem.handle)
            {
                nexacro.__setElementHandleSendToBack(elem.handle);
            }
        };

        __pContainerElement._bringToFrontElement = function (elem)
        {
            if (elem && elem.owner_elem.dest_handle == this.dest_handle && elem.handle)
            {
                nexacro.__setElementHandleBringToFront(elem.handle);
            }
        };

        __pContainerElement._moveToNextElement = function (elem, base_elem)
        {
            if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
            {
                nexacro.__setElementHandleMoveToNext(elem.handle, base_elem.handle);
            }
        };

        __pContainerElement._moveToPrevElement = function (elem, base_elem)
        {
            if (elem && base_elem && elem.owner_elem == this && base_elem.owner_elem == this && elem.handle && base_elem.handle)
            {
                nexacro.__setElementHandleMoveToPrev(elem.handle, base_elem.handle);
            }
        };

        __pContainerElement.setElementScrollMaxSize = function (width, height)
        {
            this._scroll_maxwidth = width;
            this._scroll_maxheight = height;
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

        // end of ContainerElement

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

        _pPluginElement._plugin_object = null;

        //==== defaule values =========//
        _pPluginElement.license = "";
        _pPluginElement.lpkpath = "";
        _pPluginElement.classid = "";
        _pPluginElement.classid64 = "";
        _pPluginElement.codebase = "";
        _pPluginElement.code = "";
        _pPluginElement.archive = "";
        _pPluginElement.mimetype = "";

        _pPluginElement.pluginsrc = "";
        _pPluginElement.plugintype = "";
        _pPluginElement.pluginpage = "";

        _pPluginElement.windowed = false;
        _pPluginElement.popupstyle = false;
        _pPluginElement.adjustalpha = false;
        _pPluginElement.usepersistdata = false;

        _pPluginElement.enable = true;
        _pPluginElement.font = null;
        _pPluginElement.color = null;
        _pPluginElement.cursor = null;
        _pPluginElement.align = null;
        _pPluginElement.padding = null;
        _pPluginElement.color = null;
        _pPluginElement.component = null;

        //==== internal handles =========//
        _pPluginElement._params = null;  // for Param tag    
        _pPluginElement._events = null;
        _pPluginElement._pluginname = "";        //for only android mobile
        //==== default flags =========//
        //==== end of initial =========//

        _pPluginElement.create = function (win)
        {
            if (!this.handle)
            {
                var win_handle = null;
                var owner_elem = null;
                var _linked_comp = null;
                if (this.parent_elem)
                {
                    owner_elem = this.parent_elem.getContainerElement(this.position_step);
                    if (owner_elem && owner_elem.handle)
                    {
                        this.owner_elem = owner_elem;
                        win_handle = win.handle || owner_elem._getRootWindowHandle();
                    }
                    _linked_comp = this.parent_elem.linkedcontrol;
                }

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = nexacro.__createPluginElementHandle(this, win_handle, left, this.top, this.width, this.height);
                // for activeX
                if (this.classid)
                {
                    nexacro.__setPluginElementHandleClassId(handle, this.classid);
                }
                if (this.classid64)
                {
                    nexacro.__setPluginElementHandleClassId64(handle, this.classid64);
                }
                if (this.adjustalpha)
                {
                    nexacro.__setPluginElementHandleAdjustAlpha(handle, this.adjustalpha);
                }

                //for only android mobile
                if (this._pluginname)
                {
                    nexacro.__setPluginElementHandlePluginName(handle, this._pluginname);
                }

                //for Plugin
                if (this.mimetype)
                {
                    nexacro.__setPluginElementHandleMIMEType(handle, this.mimetype);
                }
                if (this.pluginsrc)
                {
                    nexacro.__setPluginElementHandlePluginSrc(handle, this.pluginsrc);
                }
                if (this.pluginpage)
                {
                    nexacro.__setPluginElementHandlePluginPage(handle, this.pluginpage);
                }
                if (this.code)
                {
                    nexacro.__setPluginElementHandleCode(handle, this.code);
                }

                // both
                if (this.codebase)
                {
                    nexacro.__setPluginElementHandleCodebase(handle, this.codebase);
                }

                var params = this._params;
                var i, param_cnt = (params ? params.length : 0);
                for (i = 0; i < param_cnt; i++)
                {
                    nexacro.__setPluginElementHandleAttribute(handle, params.get_id(i), params.get_item(i));
                }

                if (this.mimetype && this.classid == "")
                {
                    var events = this._events;
                    var event_cnt = events.length;
                    for (i = 0; i < event_cnt; i++)
                    {
                        this.addEventHandler(events.get_id(i), events.get_item(i));
                    }
                }

                if (this.license || this.lpkpath)
                {
                    if (nexacro.__setPluginElementHandleLicense)
                        nexacro.__setPluginElementHandleLicense(handle, this.license, this.lpkpath);
                }

                if (!this.visible || (_linked_comp && _linked_comp.visible == false))
                {
                    nexacro.__setElementHandleVisible(handle, false);
                    if (this.visible) this.visible = false;
                }

                if (!this.enable || (_linked_comp && _linked_comp.enable == false))
                {
                    nexacro.__setElementHandleEnable(handle, false);
                    if (this.enable) this.enable = false;
                }

                if (this.windowed)
                {
                    nexacro.__setPluginElementHandleWindowed(handle, this.windowed);
                    if (this.popupstyle) // windowed가 true인 경우만 해당
                    {
                        nexacro.__setPluginElementHandlePopupstyle(handle, this.popupstyle);
                    }
                }

                if (this.font)
                {
                    nexacro.__setElementHandleFontObject(handle, this.font);
                }
                if (this.color)
                {
                    nexacro.__setElementHandleColorObject(handle, this.color);
                }
                /*
                if (this.align)
                {
                    var align = this.align;
                    nexacro.__setElementHandleAlign(handle, align.halign, align.valign);
                }
                */


                // append TO Parent Element
                this.handle = handle;

                this.initEvent();

                if (owner_elem && owner_elem.handle)
                    nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
                nexacro.__createdPluginElementHandle(handle);

                this._plugin_object = new nexacro.PluginObject();
                if (this._plugin_object)
                    this._plugin_object.handle = nexacro.__getPluginElementHandleObject(this.handle);
            }
        };

        _pPluginElement.destroy = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
                if (this.owner_elem && this.owner_elem.handle)
                {
                    owner_handle = this.owner_elem.handle;
                    nexacro.__destroyElementHandle(owner_handle, this.handle);
                }

                this.owner_elem = null;
                this.handle = null;
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

            var plugin_object = this._plugin_object;
            if (plugin_object)
            {
                plugin_object.destroy();
                this._plugin_object = null;
            }

        };

        _pPluginElement.initEvent = function ()
        {
            if (this.handle)
            {
                nexacro._observeWrapperEvent(this.handle, null, "_on_plugin_event", this._on_plugin_event, -1, null);
            }
        };


        _pPluginElement._on_plugin_event = function (evt_id, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19)
        {
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp && evt_id)
            {
                if (comp[evt_id])
                {
                    var listener = comp[evt_id];
                    if (listener)
                    {
                        var handlers = listener._user_handlers;
                        var len = 0;
                        if (handlers)
                        {
                            len = handlers.length;
                        }

                        var i, ret;
                        var h;
                        var obj = comp;
                        try
                        {
                            if (obj.enableevent !== false)
                            {
                                for (i = 0; i < len; i++)
                                {
                                    h = handlers[i];
                                    if (h)
                                    {
                                        ret = h.handler.call(h.target, obj, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19);
                                    }
                                }
                            }
                        }
                        catch (e)
                        {
                            if (e.obj)
                            {
                                nexacro._onSystemError(e.obj, e.name, e.message);
                            }
                            else
                            {
                                var msg = nexacro._getExceptionMessage(e);

                                var environment = nexacro.getEnvironment();
                                if (environment)
                                {
                                    nexacro._onSystemError(environment, e.name, msg);
                                }
                            }
                        }
                    }
                }
            }
        };

        //=======================================================================================

        _pPluginElement.on_update_position = function ()
        {
            // control element 변경 후 component에서 호출 
            // Plugin element는 직접 사이즈를 변경하지 않고, node의 parent 크기를 받아 처리한다. 
            if (this.handle)
            {
                nexacro.__updatePluginElementHandlePosition(this.handle);
            }
        };

        _pPluginElement.setElementFocus = function ()
        {
            if (this.handle)
            {
                nexacro.__setElementHandleFocus(this.handle);
                nexacro.__setLastFocusedElement(this);
            }
        };

        _pPluginElement.setElementPluginPosition = function (left, top)
        {
            if (this.handle)
            {
                this.setElementPosition(left, top);
            }
        };

        //=======================================================================================
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

        _pPluginElement.setElementMIMEType = function (_type)
        {
            if (this.mimetype != _type)
            {
                this.mimetype = _type;
            }
        };

        _pPluginElement.setElementClassId = function (classid)
        {
            if (this.classid != classid)
            {
                this.classid = classid;
            }
        };

        _pPluginElement.setElementClassId64 = function (classid64)
        {
            if (this.classid64 != classid64)
            {
                this.classid64 = classid64;
            }
        };

        _pPluginElement.setElementCodebase = function (codebase)
        {
            if (this.codebase != codebase)
            {
                this.codebase = codebase;

                if (this.handle)
                {
                    nexacro.__setPluginElementHandleCodebase(this.handle, this.codebase);
                }
            }
        };

        _pPluginElement.setElementCode = function (code)
        {
            if (this.code != code)
            {
                this.code = code;
            }
        };

        _pPluginElement.setElementArchive = function (archive)
        {
            if (this.archive != archive)
            {
                this.archive = archive;
            }
        };

        _pPluginElement.setElementAdjustAlpha = function (adjustalpha)
        {
            if (this.adjustalpha != adjustalpha)
            {
                this.adjustalpha = adjustalpha;
            }
        };

        _pPluginElement.setElementUsePersistData = function (usepersistdata)
        {
            if (this.usepersistdata != usepersistdata)
            {
                this.usepersistdata = usepersistdata;
                this.setElementParam("__usepersistdata", usepersistdata);
            }
        };

        _pPluginElement.getElementUsePersistData = function ()
        {
            return this.getElementParam("__usepersistdata");
        };

        _pPluginElement.getElementParam = function (name)
        {
            if (this._plugin_object)
            {
                return this._plugin_object.getProperty(name);
            }
            else
            {
                var params = this._params;
                return params.get_item(name);
            }
        };
        _pPluginElement.setElementParam = function (name, value)
        {
            if (this._plugin_object)
            {
                if (name)
                {
                    this._plugin_object.setProperty(name, value);
                }
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
            }
        };

        _pPluginElement.setElementPluginPage = function (pluginpage)
        {
            if (this.pluginpage != pluginpage)
            {
                this.pluginpage = pluginpage;
            }
        };

        _pPluginElement.setElementWindowed = function (windowed)
        {
            if (this.windowed != windowed)
            {
                this.windowed = windowed;
                if (this.handle)
                {
                    // wrong usage : Before create element handle, this function should called.
                }
            }
        };

        _pPluginElement.setElementEnable = function (enable)
        {
            if (this.enable != enable)
            {
                this.enable = enable;
                if (this.handle)
                {
                    nexacro.__setElementHandleEnable(this.handle, enable);
                }
            }
        };

        _pPluginElement.setElementVisible = function (visible)
        {
            if (this.handle)
            {
                nexacro.__setElementHandleVisible(this.handle, visible);
            }
        };

        _pPluginElement.setElementPopupStyle = function (popupstyle)
        {
            if (this.popupstyle != popupstyle)
            {
                this.popupstyle = popupstyle;
            }
        };

        //for only android mobile.
        _pPluginElement._setElementPluginName = function (pluginname)
        {
            if (this._pluginname != pluginname)
            {
                this._pluginname = pluginname;
            }
        };

        _pPluginElement.callMethod = function ()
        {
            if (arguments.length < 1)
                return;

            if (this._plugin_object)
            {
                return this._plugin_object.callMethod.apply(this._plugin_object, arguments);
            }
        };

        _pPluginElement._getPluginObject = function ()
        {
            if (this._plugin_object)
            {
                return this._plugin_object;
            }
            return null;
        };

        _pPluginElement.install = function ()
        {
            if (this.handle && this.codebase)
            {
                nexacro.__callPluginElementHandleInstall(this.handle);
            }
        };

        _pPluginElement.isInstalled = function ()
        {
            if (this.handle)
            {
                return nexacro.__getPluginElementHandleIsInstalled(this.handle);
            }
            return false;
        };

        _pPluginElement.isLoaded = function ()
        {
            if (this.handle)
            {
                return nexacro.__isPluginElementHandleLoaded(this.handle);
            }
            return false;
        };

        _pPluginElement.addEventHandler = function (name, callback)
        {
            if (this.handle && this.classid == "" && this.mimetype)
            {
                //var nameFromToStringRegex = /^function\s?([^\s(]*)/;
                var paramsFromToStringRegex = /\(\)|\(.+\)/;
                var params = callback.toString().match(paramsFromToStringRegex)[0];
                //var eventValue = name + params;
                var callfunc;
                var frmidx, frmlen;
                var parentFrame, parentFrame2;
                parentFrame = this.component.parent;
                if (parentFrame)
                {
                    callfunc = "." + this.component.id + '["' + name + '"]; \n';
                    callfunc += 'if (eventFn) eventFn._firePluginEvent' + params + ';';
                    do
                    {
                        if (parentFrame instanceof nexacro.MainFrame)
                        {
                            callfunc = 'var eventFn = nexacro.getApplication().mainframe' + callfunc;
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
                callfunc = 'callback = function' + params + '\n{\n' + callfunc + "\n}";
                nexacro.__appendGlobalScript(name, nexacro._executeEvalStr(callfunc));
            }
            else
            {
                this._events.add_item(name, callback);
            }
        };

        _pPluginElement.removeEventHandler = function (name, callback)
        {
            if (this.handle && this.classid == "" && this.mimetype)
            {
                nexacro.__removeGlobalScript(name);
            }
            else
            {
                this._events.delete_item(name);
            }
        };

        _pPluginElement.updateWindow = function ()
        {
            if (this.windowed == true)
            {
                nexacro.__updatePluginElementHandleWindow(this.handle);
            }
        };

        _pPluginElement.setElementMovie = function (movie)
        {
            this.setElementParam("movie", movie);
        };

        _pPluginElement._play = function ()
        {
        };

        _pPluginElement._stopPlay = function ()
        {
        };
        _pPluginElement.getProperty = _pPluginElement.getElementParam;
        _pPluginElement.setProperty = _pPluginElement.setElementParam;
        _pPluginElement.setElementPluginMIMEType = nexacro._emptyFn;
        _pPluginElement._setElementFocus = _pPluginElement.setElementFocus;
        // end of PluginElement
        //==============================================================================
        // nexacro.PluginObject : 
        //==============================================================================
        nexacro.PluginObject = function (handle)
        {
            this.handle = handle;
            this._parentObject = null;
        };

        var __pPluginObject = nexacro._createPrototype(nexacro.Object, nexacro.PluginObject);
        nexacro.PluginObject.prototype = __pPluginObject;
        __pPluginObject._type_name = "PluginObject";

        __pPluginObject.getProperty = function ()
        {
            if (this.handle)
            {
                Array.prototype.unshift.call(arguments, this.handle);
                var value = nexacro.__getPluginObjectHandleAttribute.apply(nexacro, arguments);
                if (value != null && typeof (value) == "object")
                {
                    var pobject = new nexacro.PluginObject();
                    pobject.handle = value;
                    return pobject;
                }
                return value;
            }
        };

        __pPluginObject.setProperty = function (name, value)
        {
            if (this.handle)
            {
                if (name)
                {
                    if (value instanceof nexacro.PluginElement)
                        nexacro.__setPluginObjectHandleAttribute(this.handle, name, value._plugin_object);
                    else
                        nexacro.__setPluginObjectHandleAttribute(this.handle, name, value);
                }
            }
        };

        __pPluginObject.callMethod = function ()
        {
            if (arguments.length < 1)
                return;

            if (this.handle)
            {
                Array.prototype.unshift.call(arguments, this.handle);
                var len = arguments.length;
                for (var i = 1; i < len; i++)
                {
                    if (arguments[i] instanceof nexacro.PluginElement)
                        arguments[i] = arguments[i]._plugin_object;
                }
                var value = nexacro.__callPluginObjectHandleMethod.apply(nexacro, arguments);
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
            if (arguments.length < 1)
            {
                return new Promise(function ()
                {
                    throw new TypeError("Failed to execute plugin method: 1 argument required, but only 0 present.");
                    return;
                });
            }

            if (!this.handle)
            {
                return new Promise(function (resolve, reject)
                {
                    reject("Unexpected plugin object");
                    return;
                });
            }

            Array.prototype.unshift.call(arguments, this.handle);
            var len = arguments.length;
            for (var i = 1; i < len; i++)
            {
                if (arguments[i] instanceof nexacro.PluginElement)
                    arguments[i] = arguments[i]._plugin_object;
            }

            return nexacro.__callPluginObjectHandleMethodAndReturnPromise.apply(nexacro, arguments);
        };

        __pPluginObject.callScriptMethod = function ()
        {
            if (arguments.length < 1)
                return;

            if (this.handle)
            {
                Array.prototype.unshift.call(arguments, this.handle);
                var value = nexacro.__callPluginObjectHandleScriptMethod.apply(nexacro, arguments);
                if (value != null && typeof (value) == "object")
                {
                    var pobject = new nexacro.PluginObject();
                    pobject.handle = value;

                    return pobject;
                }
                return value;
            }
        };


        __pPluginObject.destroy = function ()
        {
            if (this.handle)
            {
                nexacro.__destroyPluginObjectHandle(this.handle);
                this.handle = null;
                if (this._parentObject)
                {
                    this._parentObject.destroy();
                    this._parentObject = null;
                }
            }
        };



        //==============================================================================
        // nexacro.WebBrowserPluginElement : 
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

        __pWebBrowserPluginElement.windowed = true;
        __pWebBrowserPluginElement.classid = "{8856F961-340A-11D0-A96B-00C04FD705A2}";
        __pWebBrowserPluginElement.src = "";
        __pWebBrowserPluginElement._pluginname = "WebBrowser";  // using NRE Android
        __pWebBrowserPluginElement._bInitNavigate = false       // using NRE Windows 

        //===============================================================
        // nexacro.WindowedWebBrowserElement : Create & Destroy & Update
        //===============================================================
        __pWebBrowserPluginElement.initEvent = function ()
        {
            if (this.handle)
            {
                nexacro._observeWrapperEvent(this.handle, null, "_on_plugin_event", this._on_plugin_event);
            }
        };

        __pWebBrowserPluginElement._on_plugin_event = function (evt_id, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9)
        {
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                if (evt_id == "DocumentComplete")
                {
                    var locationURL = this.getElementParam("LocationURL");
                    if (locationURL == arg1)
                    {
                        evt_id = "onloadcompleted";
                        if (comp.on_load_handler)
                        {
                            var _win = comp._getWindow();
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

                            if (focuspath_index < 0)
                            {
                                var focus_comp = cur_focus_paths ? cur_focus_paths[cur_focus_paths.length - 1] : null;
                                if (focus_comp)
                                {

                                    var input_elem = focus_comp._input_element;
                                    if (!input_elem || (input_elem && !input_elem._is_focused))
                                    {
                                        focus_comp._apply_setfocus();
                                        focus_comp.on_focus_basic_action();
                                    }
                                }
                            }
                            nexacro.__restorePluginElementHandleWindowFocus(this.handle);
                            return comp.on_load_handler(arg1);
                        }
                    }
                }
                else if (evt_id == "TitleChange")
                {
                    comp.on_fire_onusernotify(comp, arg0);
                }

                if (comp[evt_id])
                {
                    var listener = comp[evt_id];
                    if (listener)
                    {
                        return listener._fireEvent(this, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9);
                    }
                }

            }
        };

        __pWebBrowserPluginElement._getDoc = function ()
        {
            return null;
        };

        __pWebBrowserPluginElement._setUrl = function (url, useurlhistory)
        {
            if (this._plugin_object)
            {
                this._setSharedVariablesToCookie(url);
                if (useurlhistory == false)
                {
                    var _url;
                    if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                    {
                        _url = "javascript:location.replace(\"" + url + "\");";

                        return this._plugin_object.callMethod("Navigate", _url);
                    }
                    else
                    {
                        if (url == "about:blank" || this._bInitNavigate == false)
                        {
                            this._bInitNavigate = true;
                            this._plugin_object.callMethod("Navigate", url);
                            return;
                        }
                        else
                        {
                            _url = "javascript:location.replace(\"" + url + "\");";
                        }
                        this._plugin_object.callMethod("Navigate", _url);
                    }
                }
                else
                {
                    if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                    {
                        return this._plugin_object.callMethod("Navigate", url);
                    }
                    else
                    {
                        this._plugin_object.callMethod("Navigate", url);
                    }
                }
            }
        };

        __pWebBrowserPluginElement._setGo = function ()
        {
            if (this._plugin_object)
            {
                this._plugin_object.callMethod("Refresh");
            }
        };

        __pWebBrowserPluginElement._setBack = function ()
        {
            if (this._plugin_object)
            {
                var state = this._plugin_object.callMethod("GoBack");
                if (state)
                    return state.toLowerCase() == "true" ? true : false;
            }
        };

        __pWebBrowserPluginElement._setForward = function ()
        {
            if (this._plugin_object)
            {
                var state = this._plugin_object.callMethod("GoForward");
                if (state)
                    return state.toLowerCase() == "true" ? true : false;
            }
        };

        __pWebBrowserPluginElement.callMethod = function ()
        {
            if (arguments.length < 1)
                return;

            if (this._plugin_object)
            {
                return this._pluginCallMethod(arguments);
            }
        };

        __pWebBrowserPluginElement._pluginCallMethod = function (args)
        {
            var value;

            if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
            {
                var str = args[0];

                str += "(";
                for (var i = 1; i < args.length; i++)
                {
                    if (typeof (args[i]) == "object")
                    {
                        args[i] = args[i].toString();
                    }

                    if (typeof (args[i]) == "string")
                    {
                        //[21/07/23] 오지현 - [RP 92614]
                        // "\n" 개행문자가 처리되지 않는 현상 수정.
                        args[i] = nexacro.replaceAll(args[i], "\\", "\\\\");
                        args[i] = nexacro.replaceAll(args[i], "'", "\\\'");
                        args[i] = nexacro.replaceAll(args[i], "\n", "\\n"); // html eval script error
                        args[i] = nexacro.replaceAll(args[i], "\r", "\\r"); // \r(&#13) script error
                    }

                    str += "'";
                    str += args[i];
                    str += "'";

                    if (i + 1 < args.length)
                        str += ",";

                }
                str += ")";

                value = this._setUrl("javascript:" + str);
            }
            else
            {
                var _document = this._plugin_object.getProperty("document");
                if (_document)
                {
                    var _script = _document.getProperty("script");
                    if (_script)
                    {
                        value = _script.callScriptMethod.apply(_script, args);
                        _script.destroy();
                    }
                    _document.destroy();
                }
            }
            return value;
        };

        __pWebBrowserPluginElement.getProperty = function (name)
        {
            if (this._plugin_object)
            {
                if (name == "window")
                {
                    var _doc = this._plugin_object.getProperty("document");
                    if (_doc)
                    {
                        var _win = _doc.getProperty("parentWindow");
                        if (_win)
                        {
                            _win._parentObject = _doc; // _doc 삭제를 위해 추가
                            return _win;
                        }
                        _doc.destroy();
                    }
                }
                return this._plugin_object.getProperty(name);
            }
            else
            {
                var params = this._params;
                return params.get_item(name);
            }
        };

        __pWebBrowserPluginElement._setSharedVariablesToCookie = function (url)
        {
            var cookies = "";
            //var cookievar = [];
            var enginecookievars = nexacro._getCookieVariables(4);
            if (enginecookievars)
            {
                for (var prop in enginecookievars)
                {
                    cookies += (prop + '=' + enginecookievars[prop].value + ';'); // "a=A;b=B;...;"
                }
            }

            if (url && url.indexOf("https") == 0)
            {
                enginecookievars = nexacro._getCookieVariables(6);
                if (enginecookievars)
                {
                    for (var _prop in enginecookievars)
                    {
                        cookies += (_prop + '=' + enginecookievars[_prop].value + ';'); // "a=A;b=B;...;"
                    }
                }
            }

            if (cookies)
                nexacro._setSharedVariablesToCookie(url, cookies);
        };

        __pWebBrowserPluginElement._setElementInternalFocus = nexacro._emptyFn;
        __pWebBrowserPluginElement._setElementLeaveMessage = nexacro._emptyFn;


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

        __pWebViewPluginElement.windowed = true;
        __pWebViewPluginElement.classid = "";
        __pWebViewPluginElement.src = "";
        __pWebViewPluginElement._pluginname = "WebView";  // using NRE Android  - _pluginname 추가 요청필요 
        __pWebViewPluginElement._bInitNavigate = false       // using NRE Windows 

        //===============================================================
        // nexacro.WindowedWebViewElement : Create & Destroy & Update
        //===============================================================
        __pWebViewPluginElement.initEvent = function ()
        {
            if (this.handle)
            {
                nexacro._observeWrapperEvent(this.handle, null, "_on_plugin_event", this._on_plugin_event);
            }
            // add callback event
        };

        __pWebViewPluginElement._on_plugin_event = function (evt_id, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9)
        {
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {

                if (evt_id == "DocumentComplete")
                {

                    // make global object
                    //var locationURL = this.getElementParam("LocationURL");
                    //if (locationURL == arg1)
                    {

                        evt_id = "onloadcompleted";
                        if (comp.on_load_handler)
                        {
                            var _win = comp._getWindow();
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

                            if (focuspath_index < 0)
                            {
                                var focus_comp = cur_focus_paths ? cur_focus_paths[cur_focus_paths.length - 1] : null;
                                if (focus_comp)
                                {
                                    focus_comp._apply_setfocus();
                                    focus_comp.on_focus_basic_action();
                                }
                            }
                            nexacro.__restorePluginElementHandleWindowFocus(this.handle);
                            return comp.on_load_handler(arg1);
                        }
                    }
                }
                else if (evt_id == "Error") // NRE에서만 call된다
                {
                    // 설치가 되지 않아서 env의 onerror를 발생 시킴 - 현재는 이거 하나  
                    //trace("error: " + arg0);
                    var ret = false;


                    var errorobj = nexacro.MakeError("ObjectError", comp, "module_not_installed", "WebView", arg0);
                    nexacro._onSystemError(errorobj.obj, errorobj.name, errorobj.message);

                    return ret;
                }
                else if (evt_id == "UserNotify")
                {
                    comp.on_fire_onusernotify(comp, arg0);
                }
                /*else if (evt_id == "TitleChange")
                {
                    comp.on_fire_onusernotify(comp, arg0);
                }*/
                // script callback
                else if (evt_id.indexOf("script_callback?") != -1)
                {
                    function FindIndex(callbacklist, name)
                    {
                        var ret = callbacklist.findIndex(
                            function (x)
                            {
                                return x.name === name;
                            });
                        return ret;
                    }
                    evt_id = evt_id.replace("script_callback?", "");

                    var callbacklist = comp._scriptcallbacklist;

                    var index = FindIndex(callbacklist, evt_id);
                    if (index >= 0)
                    {
                        if (callbacklist[index].scope && callbacklist[index].scope._is_alive && callbacklist[index].func)
                        {
                            var ret = arg0;



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
                            callbacklist[index].func.call(callbacklist[index].scope, ret);
                        }
                        // callback object remove
                        callbacklist.splice(index, 1);
                    }



                }
                else if (comp[evt_id])
                {
                    var listener = comp[evt_id];
                    if (listener)
                    {
                        return listener._fireEvent(this, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9);
                    }
                }

            }
        };
        __pWebViewPluginElement._getDoc = function ()
        {
            return null;
        };
        __pWebViewPluginElement._setUrl = function (url, useurlhistory)
        {
            if (this._plugin_object)
            {
                this._setSharedVariablesToCookie(url);
                if (useurlhistory == false)
                {
                    var _url;
                    if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                    {
                        _url = "javascript:location.replace(\"" + url + "\");";

                        return this._plugin_object.callMethod("Navigate", _url);
                    }
                    else
                    {
                        if (url == "about:blank" || this._bInitNavigate == false)
                        {
                            this._bInitNavigate = true;
                            this._plugin_object.callMethod("Navigate", url);
                            return;
                        }
                        else
                        {
                            _url = "javascript:location.replace(\"" + url + "\");";
                        }
                        this._plugin_object.callMethod("Navigate", _url);
                    }
                }
                else
                {
                    if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                    {
                        return this._plugin_object.callMethod("Navigate", url);
                    }
                    else
                    {
                        this._plugin_object.callMethod("Navigate", url);
                    }
                }
            }
        };
        __pWebViewPluginElement._setInstallUrl = function (url)
        {

            if (this._plugin_object)
            {
                this._plugin_object.callMethod("InstallUrl", url);
            }
        };
        __pWebViewPluginElement._setGo = function ()
        {
            // reload
            if (this._plugin_object)
            {
                this._plugin_object.callMethod("Refresh");
            }
        };

        __pWebViewPluginElement._setBack = function ()
        {
            if (this._plugin_object)
            {
                var state = this._plugin_object.callMethod("GoBack");
                if (state)
                    return state.toLowerCase() == "true" ? true : false;
            }
        };

        __pWebViewPluginElement._setForward = function ()
        {
            if (this._plugin_object)
            {
                var state = this._plugin_object.callMethod("GoForward");
                if (state)
                    return state.toLowerCase() == "true" ? true : false;
            }
        };

        __pWebViewPluginElement.injectScript = function ()
        {
            if (arguments.length < 1)
                return undefined;

            var script = arguments[0];

            if (script != null && typeof script == 'string')
            {

                script = script.replace(/\'/gi, "\\'");
                script = script.replace(/\r\n/gi, "\\n");
                script = script.replace(/\n/gi, "\\n");
                script = script.replace(/\r/gi, "\\n");
                var make = "this._safeStringify.call(this,new Function(\'return this." + script + "\').call(this))";


                if (this._plugin_object)
                {

                    var ret = this._plugin_object.callMethod("InjectScript", make);

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
            }
            return undefined;
        }

        __pWebViewPluginElement.injectScriptAndReturnPromise = function ()
        {
            if (arguments.length < 1)
                return undefined;

            var script = arguments[0];

            if (script != null && typeof script == 'string')
            {

                script = script.replace(/\'/gi, "\\'");
                script = script.replace(/\r\n/gi, "\\n");
                script = script.replace(/\n/gi, "\\n");
                script = script.replace(/\r/gi, "\\n");
                var make = "this._safeStringify.call(this,new Function(\'return this." + script + "\').call(this))";


                if (this._plugin_object)
                {
                    return this._plugin_object.callMethodAsync("InjectScript", make);
                }
            }
            return undefined;
        }

        __pWebViewPluginElement.injectScriptAsync = function ()
        {
            function UniqueID()
            {
                function s4()
                {
                    return ((1 + nexacro._random()) * 0x10000 | 0).toString(16).substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            function Find(callbacklist, name)
            {
                var ret = callbacklist.find(
                    function (x)
                    {
                        return x.name === name;
                    });
                return ret;
            }

            if (arguments.length < 3)
                return undefined;

            var script = arguments[0];
            var callback = arguments[1];
            var scope = arguments[2];

            var comp = this.parent_elem.linkedcontrol;
            var callbacklist = comp._scriptcallbacklist;

            if (script != null && typeof script == 'string')
            {
                script = script.replace(/\'/gi, "\\'");
                script = script.replace(/\r\n/gi, "\\r\\n");
                script = script.replace(/\n/gi, "\\n");
                script = script.replace(/\r/gi, "\\r");
                var make = "this._safeStringify.call(this,new Function(\'return this." + script + "\').call(this))";

                // make callback list

                var callbackid = "empty_callback";
                var isnamed = false;

                if (callback != null && typeof callback == "function")
                {
                    var name = callback.name;
                    var object = null;
                    var obj = null;
                    if (!name)
                    {
                        callbackid = UniqueID();

                        obj = Find(callbacklist, callbackid);
                        if (!obj)
                        {
                            object = { name: undefined, func: undefined, scope: undefined, anonymous: undefined };
                            object.name = callbackid;
                            object.func = callback;
                            object.scope = scope;
                            object.anonymous = !isnamed;
                            callbacklist.push(object);
                        }
                    }
                    else
                    {
                        isnamed = true;
                        callbackid = name + UniqueID();
                        obj = Find(callbacklist, callbackid);
                        if (!obj)
                        {
                            object = { name: undefined, func: undefined, scope: undefined, anonymous: undefined };
                            object.name = callbackid;
                            object.func = callback;
                            object.scope = scope;
                            object.anonymous = !isnamed;
                            callbacklist.push(object);
                        }


                    }
                }
                if (this._plugin_object)
                {
                    return this._plugin_object.callMethod("InjectScriptAsync", "script_callback?" + callbackid, make);
                }
            }
        };

        __pWebViewPluginElement._setSharedVariablesToCookie = function (url)
        {
            var cookies = "";
            //var cookievar = [];
            var enginecookievars = nexacro._getCookieVariables(4);
            if (enginecookievars)
            {
                for (var prop in enginecookievars)
                {
                    cookies += (prop + '=' + enginecookievars[prop].value + ';'); // "a=A;b=B;...;"
                }
            }

            if (url && url.indexOf("https") == 0)
            {
                enginecookievars = nexacro._getCookieVariables(6);
                if (enginecookievars)
                {
                    for (var _prop in enginecookievars)
                    {
                        cookies += (_prop + '=' + enginecookievars[_prop].value + ';'); // "a=A;b=B;...;"
                    }
                }
            }

            if (cookies)
                nexacro._setSharedVariablesToCookie(url, cookies);
        };
        //========= override===================================================

        __pWebViewPluginElement.create = function (win)
        {
            if (!this.handle)
            {
                var win_handle = null;
                var owner_elem = null;
                var _linked_comp = null;
                if (this.parent_elem)
                {
                    owner_elem = this.parent_elem.getContainerElement(this.position_step);
                    if (owner_elem && owner_elem.handle)
                    {
                        this.owner_elem = owner_elem;
                        win_handle = win.handle || owner_elem._getRootWindowHandle();
                    }
                    _linked_comp = this.parent_elem.linkedcontrol;
                }

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    this.rtl = bPositionRtl;
                    left = this._getRTLPositionLeft(left, this.width);
                }
                var handle;
                if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                {
                    handle = nexacro.__createPluginElementHandle(this, win_handle, left, this.top, this.width, this.height);
                    //for only android mobile
                    if (this._pluginname)
                    {
                        nexacro.__setPluginElementHandlePluginName(handle, this._pluginname);
                    }
                }
                else if (nexacro._OS == "OSX" && nexacro._Browser == "Runtime")
                {
                    handle = nexacro.__createPluginElementHandle(this, win_handle, left, this.top, this.width, this.height);
                    if (this._pluginname)
                    {
                        nexacro.__setPluginElementHandlePluginName(handle, this._pluginname);
                    }
                }
                else
                {
                    handle = nexacro._plugin.__createWebViewPluginElementHandle(this, win_handle, left, this.top, this.width, this.height);
                }



                var params = this._params;
                var i, param_cnt = (params ? params.length : 0);
                for (i = 0; i < param_cnt; i++)
                {
                    nexacro.__setPluginElementHandleAttribute(handle, params.get_id(i), params.get_item(i));
                }

                if (this.mimetype && this.classid == "")
                {
                    var events = this._events;
                    var event_cnt = events.length;
                    for (i = 0; i < event_cnt; i++)
                    {
                        this.addEventHandler(events.get_id(i), events.get_item(i));
                    }
                }

                if (!this.visible || (_linked_comp && _linked_comp.visible == false))
                {
                    nexacro.__setElementHandleVisible(handle, false);
                    if (this.visible) this.visible = false;
                }

                if (!this.enable || (_linked_comp && _linked_comp.enable == false))
                {
                    nexacro.__setElementHandleEnable(handle, false);
                    if (this.enable) this.enable = false;
                }

                if (this.windowed)
                {
                    nexacro.__setPluginElementHandleWindowed(handle, this.windowed);
                    if (this.popupstyle) // windowed가 true인 경우만 해당
                    {
                        nexacro.__setPluginElementHandlePopupstyle(handle, this.popupstyle);
                    }
                }

                if (this.font)
                {
                    nexacro.__setElementHandleFontObject(handle, this.font);
                }
                if (this.color)
                {
                    nexacro.__setElementHandleColorObject(handle, this.color);
                }


                // append TO Parent Element
                this.handle = handle;

                this.initEvent();

                if (owner_elem && owner_elem.handle)
                    nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
                if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                {
                    nexacro.__createdPluginElementHandle(handle);

                }
                else if (nexacro._OS == "OSX" && nexacro._Browser == "Runtime")
                {
                    nexacro.__createdPluginElementHandle(handle);

                }
                else
                {
                    nexacro._plugin.__createdWebViewPluginElementHandle(handle);
                }

                this._plugin_object = new nexacro.PluginObject();
                if (this._plugin_object)
                    this._plugin_object.handle = nexacro.__getPluginElementHandleObject(this.handle);


            }
        };


        __pWebViewPluginElement._setElementInternalFocus = nexacro._emptyFn;
        __pWebViewPluginElement._setElementLeaveMessage = nexacro._emptyFn;

        //==============================================================================
        // nexacro.VideoPlayerPluginElement : 
        //==============================================================================
        nexacro._VideoPlayerPluginElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
            this.windowed = true;

            this._params = new nexacro.Collection();
            this._events = new nexacro.Collection();
        };

        var __pVideoPlayerPluginElement = nexacro._createPrototype(nexacro.PluginElement, nexacro._VideoPlayerPluginElement);
        nexacro._VideoPlayerPluginElement.prototype = __pVideoPlayerPluginElement;
        __pVideoPlayerPluginElement._type_name = "VideoPlayerPluginElement";
        __pVideoPlayerPluginElement.classid = "{6bf52a52-394a-11d3-b153-00c04f79faa6}";
        __pVideoPlayerPluginElement._pluginname = "VideoPlayer";


        __pVideoPlayerPluginElement.initEvent = function ()
        {
            if (this.handle)
            {
                nexacro._observeWrapperEvent(this.handle, null, "_on_plugin_event", this._on_plugin_event);
            }
        };

        __pVideoPlayerPluginElement._on_plugin_event = function (evt_id, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9)
        {
            // trace("__pVideoPlayerPluginElement._on_plugin_event==>id-" + evt_id + ",arg0-" + arg0 + ",arg1-" + arg1 + ",arg2-" + arg2 + ",arg3-" + arg3 + ",arg4-" + arg4);
            var getpro;
            var getitem;
            var errormsg;
            var statuscode;
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                if (evt_id == "PlayStateChange")
                {
                    var state = null;
                    switch (arg0)
                    {
                        case 1:
                            state = "stop";
                            break;
                        case 2:
                            state = "pause";
                            break;
                        case 3:
                            state = "play";
                            break;
                        case 4:
                            state = "scanforward";
                            break;
                        case 5:
                            state = "scanreverse";
                            break;
                        case 6:
                            state = "buffer";
                            break;
                        case 7:
                            state = "wait";
                            break;
                        case 8:
                            state = "ended";
                            break;
                        case 9:
                            state = "transition";
                            break;
                        case 10:
                            state = "ready";
                            break;
                        default:
                            state = "undefined";
                            break;
                    }

                    //if (state)
                    comp._on_statuschanged(state);
                }
                else if (evt_id == "OpenStateChange")
                {
                    getpro = this._plugin_object.getProperty("controls");
                    if (getpro)
                    {
                        getitem = getpro.getProperty("currentItem");
                        if (getitem)
                        {
                            var width = getitem.getProperty("imagesourcewidth");
                            var height = getitem.getProperty("imagesourceheight");
                            var duration = getitem.getProperty("duration");

                            var nResult = height / width;
                            if (nResult == 0.7500)
                                comp.aspectratio = "4 : 3";
                            else if (nResult == 0.5625)
                                comp.aspectratio = "16 : 9";
                            else if (nResult == 0.625)
                                comp.aspectratio = "16 : 10";
                            else if (nResult == 0.8)
                                comp.aspectratio = "4 : 3";
                            else if (nResult == 1)
                                comp.aspectratio = "1 : 1";
                            else
                            {
                                if (width > 0 && height > 0)
                                {
                                    var max, min;
                                    var temp, gcd;
                                    if (width < height)
                                    {
                                        max = width;
                                        min = height;
                                    }
                                    else
                                    {
                                        max = height;
                                        min = width;
                                    }
                                    while (max % min != 0)
                                    {
                                        temp = max % min;
                                        max = min;
                                        min = temp;
                                    }

                                    gcd = min;

                                    width = width / gcd;
                                    height = height / gcd;

                                    comp.aspectratio = width + " : " + height;
                                }
                                else
                                {
                                    comp.aspectratio = width + " : " + height;
                                }

                            }

                            if (width > 0 && height > 0)
                            {
                                comp.videosize[0] = width;
                                comp.videosize[1] = height;
                            }
                            else
                            {
                                //Not media open
                                comp.videosize[0] = 0;
                                comp.videosize[1] = 0;
                            }
                            comp.duration = duration > 0 ? Math.floor(duration * 1000) : 0;
                            getitem.destroy();
                        }
                        getpro.destroy();
                    }
                }
                else if (evt_id == "PositionChange")
                {
                    var millis = Math.floor(arg1 * 1000);
                    comp._on_currenttimechanged(millis);
                    ////arg0 - old,arg1 - new 값이 들어와야 하나 그렇지 않아 직접...
                    //var getpro = this._plugin_object.getProperty("controls");
                    //var currenttime = comp.currenttime;
                    //if (getpro)
                    //{
                    //    currenttime = getpro.getProperty("currentPosition");
                    //    getpro.destroy();
                    //}
                    //comp._on_currenttimechanged(currenttime > 0 ? currenttime : 0);
                }
                else if (evt_id == "MediaError")
                {
                    if (typeof arg0 == "object")
                    {
                        var mediaobj = new nexacro.PluginObject();
                        mediaobj.handle = arg0;
                        //if (mediaobj)
                        {
                            var erroritem = mediaobj.getProperty("error");
                            if (erroritem)
                            {
                                var errorcode = erroritem.getProperty("errorCode");
                                if (!nexacro._isNull(errorcode))
                                {
                                    var resultcode = nexacro.__getHResultFromWin32(errorcode).toUpperCase();
                                    //trace("videoplayer, errorcode=" + errorcode + ", resultcode="+resultcode);
                                    switch (resultcode)
                                    {
                                        /*
                                        case "C00D1194": //NS_E_WMP_PROTOCOL_PROBLEM
                                        case "C00D1195": //NS_E_WMP_NO_DISK_SPACE
                                        case "C00D1196": //NS_E_WMP_LOGON_FAILURE
                                        case "C00D1198": //NS_E_WMP_SERVER_INACCESSIBLE
                                            statuscode = 1;
                                            errormsg = "fetching process aborted by user";
                                            break;
                                        */
                                        case "C00D11B0": //NS_E_WMP_SERVER_UNAVAILABLE
                                        case "C00D11B3": //NS_E_WMP_SERVER_NOT_RESPONDING
                                        //case "C00D11B1": //NS_E_WMP_FILE_OPEN_FAILED
                                        case "C00D11C0": //NS_E_WMP_NETWORK_ERROR
                                        case "C00D11C1": //NS_E_WMP_CONNECT_TIMEOUT
                                        case "C00D11B1": //NS_E_WMP_FILE_OPEN_FAILED
                                            statuscode = 2;
                                            errormsg = "error occurred when downloading";
                                            break;
                                        case "C00D11A1": //NS_E_WMP_CODEC_NEEDED_WITH_4CC
                                        case "C00D11A2": //NS_E_WMP_CODEC_NEEDED_WITH_FORMATTAG
                                            statuscode = 3;
                                            errormsg = "error occurred when decoding";
                                            break;
                                        case "C00D1199": //NS_E_WMP_UNSUPPORTED_FORMAT
                                        case "C00D119A": //NS_E_WMP_DSHOW_UNSUPPORTED_FORMAT
                                        case "C00D1197": //NS_E_WMP_CANNOT_FIND_FILE
                                            statuscode = 4;
                                            errormsg = "video not supported";
                                            break;
                                        default:
                                            statuscode = 1;
                                            errormsg = "fetching process aborted by user";
                                            break;
                                    }
                                }
                                erroritem.destroy();
                                comp._on_error("NativeError", errormsg, statuscode);
                            }
                            mediaobj.destroy();
                        }
                    }
                }
                else if (evt_id == "macVideoError")
                {
                    getpro = this._plugin_object.getProperty("error");
                    if (getpro)
                    {
                        getitem = getpro.getProperty("Item");
                        errormsg = "error";
                        statuscode = arg0;
                        if (getitem)
                        {
                            errormsg = getitem.getProperty("errorDescription");
                            statuscode = getitem.getProperty("errorCode");
                            getitem.destroy();
                        }
                        getpro.destroy();
                        comp._on_error("NativeError", errormsg, statuscode);
                    }
                }

                if (comp[evt_id])
                {
                    var listener = comp[evt_id];
                    if (listener)
                    {
                        return listener._fireEvent(this, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9);
                    }
                }
            }
        };

        //===============================================================
        // nexacro.VideoPlayerPluginElement : Properties
        //===============================================================
        __pVideoPlayerPluginElement._setVideoUrl = function (name, v)
        {
            var source = v;
            var file_type;
            if (source)
            {
                file_type = (source + "").substring(source.lastIndexOf(".") + 1).toLowerCase();
            }

            var object = this._getPluginObject();
            if (object)
            {
                object.setProperty(name, v);
            }

            if (this._getType(file_type) == false)
            {
                var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
                var statuscode = 4;
                var errormsg = "video not supported";
                if (comp)
                    comp._on_error("NativeError", errormsg, statuscode);
            }
        };

        __pVideoPlayerPluginElement._getType = function (file_type)
        {
            var ret = false;
            switch (file_type)
            {
                case "avi":
                case "mov":
                case "mp4":
                    ret = true;
                    break;
            }

            return ret;
        };

        __pVideoPlayerPluginElement._setVideoEnable = function (name, v)
        {
            this.enable = v;
        };

        __pVideoPlayerPluginElement._setVideoShowControlBar = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                var uiModeValue;
                if (nexacro._OS == "Windows")
                {
                    uiModeValue = "none";
                }
                else
                {
                    if (v == true)
                    {
                        uiModeValue = "full";
                    }
                    else
                    {
                        uiModeValue = "none";
                    }
                }
                object.setProperty("uiMode", uiModeValue);
            }
        };

        __pVideoPlayerPluginElement._setVideoCurrentTime = function (name, v)
        {
            if (v > -1)
            {
                var object = this._getPluginObject();
                if (object)
                {
                    var controls = object.getProperty("controls");
                    if (controls)
                    {
                        var millis = v / 1000;
                        controls.setProperty("currentPosition", millis);
                        controls.destroy();
                    }
                }
            }
        };

        __pVideoPlayerPluginElement._setVideoLoop = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                var getpro = object.getProperty("settings");
                if (getpro)
                {
                    getpro.callMethod("setMode", "loop", v);
                    getpro.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._setVideoAutoPlay = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                var getpro = object.getProperty("settings");
                if (getpro)
                {
                    getpro.setProperty("autostart", v);
                    getpro.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._setVideoVolume = function (name, v)
        {
            //volume (min 0~ max 100)
            var object = this._getPluginObject();
            if (object)
            {
                var getpro = object.getProperty("settings");
                if (getpro)
                {
                    getpro.setProperty("volume", v);
                    getpro.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._setVideoMute = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                var settings = object.getProperty("settings");
                if (settings)
                {
                    settings.setProperty("mute", v);
                    settings.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._setVideo360VRMode = function (name, v)
        {
        };

        //===============================================================
        // nexacro.VideoPlayerPluginElement : Methods
        //===============================================================
        __pVideoPlayerPluginElement._play = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                var controls = object.getProperty("controls");
                if (controls)
                {
                    controls.callMethod("play");
                    controls.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._pause = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                var controls = object.getProperty("controls");
                if (controls)
                {
                    controls.callMethod("pause");
                    controls.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._rewind = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                var controls = object.getProperty("controls");
                if (controls)
                {
                    controls.callMethod("fastReverse");
                    controls.destroy();
                }
            }
        };

        __pVideoPlayerPluginElement._stop = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                var controls = object.getProperty("controls");
                if (controls)
                {
                    controls.callMethod("stop");
                    controls.destroy();
                }
            }
        };
        __pVideoPlayerPluginElement.destroy = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.callMethod("close");
            }
        };

        //for only android runtime.
        //start --->				
        nexacro._GoogleMapPluginElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
            this.parent_elem.windowed = true;

            this._params = new nexacro.Collection();
            this._events = new nexacro.Collection();
        };

        var __pGoogleMapPluginElement = nexacro._createPrototype(nexacro.PluginElement, nexacro._GoogleMapPluginElement);
        nexacro._GoogleMapPluginElement.prototype = __pGoogleMapPluginElement;
        __pGoogleMapPluginElement._type_name = "GoogleMapElement";
        __pGoogleMapPluginElement._pluginname = "GoogleMap";

        //===============================================================
        // nexacro.GoogleMapPluginElement : Create & Destroy & Update
        //===============================================================
        __pGoogleMapPluginElement.destroy = function ()
        {
            nexacro.PluginElement.prototype.destroy.call(this);
        };

        //===============================================================
        // nexacro.GoogleMapPluginElement : Properties
        //===============================================================


        //===============================================================
        // nexacro.GoogleMapPluginElement : Methods
        //===============================================================
        __pGoogleMapPluginElement._setLoad = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("load", params);
            }
        };

        __pGoogleMapPluginElement._setDestroy = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("destroy", params);
            }
        };

        __pGoogleMapPluginElement._getAddress = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("getAddress", params);
            }
        };

        __pGoogleMapPluginElement._getCoordinates = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("getCoordinates", params);
            }
        };

        __pGoogleMapPluginElement._setRemove = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("removeItem", params);
            }
        };

        __pGoogleMapPluginElement._setMarker = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("Marker", params);
            }
        };

        __pGoogleMapPluginElement._setPolyline = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("Polyline", params);
            }
        };

        __pGoogleMapPluginElement._setPolygon = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("Polygon", params);
            }
        };

        __pGoogleMapPluginElement._setCircle = function (params)
        {
            if (this._plugin_object)
            {
                this.callMethod("Circle", params);
            }
        };

        //===============================================================
        // nexacro.GoogleMapPluginElement : Logical Part
        //===============================================================
        __pGoogleMapPluginElement.initEvent = function ()
        {
            if (this.handle)
            {
                nexacro._observeWrapperEvent(this.handle, null, "_on_plugin_event", this._on_plugin_event, -1, null);
            }
        };

        __pGoogleMapPluginElement._on_plugin_event = function (evt_id, args)
        {
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);

            if (comp)
            {
                var objArgs = nexacro._executeGlobalEvalStr("(" + args + ")");
                if (evt_id == "GoogleMap")
                {
                    if (objArgs.eventid == "onload")
                    {
                        if (comp.on_load_handler)
                        {
                            return comp.on_load_handler(objArgs.eventid, objArgs.centerlocation, objArgs.coordinates, objArgs.viewmode, objArgs.zoomlevel, objArgs.addresses);
                        }
                    }
                    else if (objArgs.eventid == "onerror")
                    {
                        if (comp.on_error_handler)
                        {
                            return comp.on_error_handler(objArgs.eventid, objArgs.errormsg, objArgs.errorcode);
                        }
                    }
                    else if (objArgs.eventid == "onrecvsuccess")
                    {
                        if (comp.on_recvsuccess_handler)
                        {
                            return comp.on_recvsuccess_handler(objArgs.eventid, objArgs.centerlocation, objArgs.coordinates, objArgs.viewmode, objArgs.zoomlevel, objArgs.addresses);
                        }
                    }
                    else if (objArgs.eventid == "onclick")
                    {
                        if (comp.on_click_handler)
                        {
                            return comp.on_click_handler(objArgs.eventid, objArgs.location);
                        }
                    }
                    else if (objArgs.eventid == "ondrag")
                    {
                        if (comp.on_drag_handler)
                        {
                            return comp.on_drag_handler(objArgs.eventid, objArgs.location);
                        }
                    }
                    else if (objArgs.eventid == "oncenterchanged")
                    {
                        if (comp.on_centerchanged_handler)
                        {
                            return comp.on_centerchanged_handler(objArgs.eventid, objArgs.centerlocation, objArgs.coordinates, objArgs.viewmode, objArgs.zoomlevel, objArgs.addresses);
                        }
                    }
                    else if (objArgs.eventid == "onmapdragstart")
                    {
                        if (comp.on_mapdragstart_handler)
                        {
                            return comp.on_mapdragstart_handler(objArgs.eventid, objArgs.location);
                        }
                    }
                    else if (objArgs.eventid == "onmapdrag")
                    {
                        if (comp.on_mapdrag_handler)
                        {
                            return comp.on_mapdrag_handler(objArgs.eventid, objArgs.location);
                        }
                    }
                    else if (objArgs.eventid == "onmapdragend")
                    {
                        if (comp.on_mapdragend_handler)
                        {
                            return comp.on_mapdragend_handler(objArgs.eventid, objArgs.location);
                        }
                    }
                }
            }
        };
        //<--- end

        nexacro.CanvasElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
        };

        var _pCanvasElement = nexacro._createPrototype(nexacro.Element, nexacro.CanvasElement);
        nexacro.CanvasElement.prototype = _pCanvasElement;

        // overide nexacro.Object
        _pCanvasElement._type_name = "CanvasElement";

        //==== defaule values =========//
        _pCanvasElement.lineOffset = 0.5;

        _pCanvasElement.scale = 10;
        _pCanvasElement.half_scale = 5;
        _pCanvasElement.scalex = 0;
        _pCanvasElement.scaley = 0;

        //xp14 attribute
        _pCanvasElement.fillStyle = null;
        _pCanvasElement.strokeColor = "#000000";
        _pCanvasElement.lineType = "solid";
        _pCanvasElement.lineCap = 'butt';
        _pCanvasElement.lineJoin = 'miter';
        _pCanvasElement.lineWidth = 1;
        _pCanvasElement.miterLimit = 10;
        _pCanvasElement.shadowColor = null;
        _pCanvasElement.shadowOffsetX = 0;
        _pCanvasElement.shadowOffsetY = 0;
        _pCanvasElement.shadowBlur = 0;
        _pCanvasElement.font = null;
        _pCanvasElement.textAlign = "left";
        _pCanvasElement.textBaseline = "top";
        _pCanvasElement.globalAlpha = 1;
        _pCanvasElement.globalCompositeOperation = 1;

        //------------- internal variable -------------//
        _pCanvasElement._fillStyle_rgb = "#000000";
        _pCanvasElement.strokeStyle_rgb = "#000000";
        _pCanvasElement.shadowColor_rgb = "#000000";

        _pCanvasElement.create = function (win)
        {
            // parent is always control element
            var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle)
            {
                var handle = this.handle;
                if (!handle)
                {
                    this.owner_elem = owner_elem;
                    var win_handle = win.handle || owner_elem._getRootWindowHandle();

                    var bPositionRtl = this._isParentRtl();
                    var left = this.left;

                    if (bPositionRtl)
                    {
                        this.rtl = bPositionRtl;
                        left = this._getRTLPositionLeft(left, this.width);
                    }

                    handle = nexacro.__createCanvasElementHandle(this, win_handle, left, this.top, this.width, this.height);

                    if (!this.font)//초기값 폰트 설정
                    {
                        this.font = new nexacro.FontObject("8px Arial");
                        nexacro.__setCanvasElementHandleFontObject(handle, this.font);
                    }

                    // update Element's properties to DOM
                    if (!this.visible)
                    {
                        nexacro.__setElementHandleVisible(handle, false);
                    }

                    // append TO Parent Element
                    this.handle = handle;
                    nexacro.__appendElementHandle(owner_elem.dest_handle, handle);
                }
            }
        };

        _pCanvasElement.destroy = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var owner_handle = null;   // unlink 인 경우 owner_elem이 null이다.
                if (this.owner_elem && this.owner_elem.handle)
                {
                    owner_handle = this.owner_elem.handle;
                    nexacro.__destroyElementHandle(owner_handle, handle);
                }

                this.owner_elem = null;
                this.handle = null;
            }
            this._p_parent = null;
            this.parent_elem = null;
        };

        //##### Basic set properties #####
        _pCanvasElement.createPattern = function (imagesource, repeat_opt, size)
        {
            // implement
            var handle = this.handle;
            if (handle)
            {
                var pattern = new nexacro._CanvasFillPattern();
                pattern.repeattype = repeat_opt;
                pattern.value = imagesource;

                if (imagesource instanceof nexacro.CanvasElement)
                {
                    var url = nexacro.__toDataURLCanvasElementHandle(handle);

                    if (url)
                    {
                        var imgObj = new nexacro.Image();
                        imgObj.set_src(url);
                        if (size)
                        {
                            imgObj.width = size.width;
                            imgObj.height = size.height;
                        }

                        pattern.imageobject = imgObj;
                        pattern.imageobject.handle = nexacro._getImageObject(url, pattern.onloadcallback, pattern);



                    }
                }
                else if (imagesource instanceof nexacro.Image)
                {
                    pattern.imageobject = imagesource;
                    if (imagesource.handle)
                    {
                        pattern.isloaded = true;
                    }
                    else
                    {
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
                var gradient = new nexacro._CanvasGradient('linear');
                gradient.x0 = aX0;
                gradient.y0 = aY0;
                gradient.x1 = aX1;
                gradient.y1 = aY1;
                return gradient;
            }
            return null;
        };

        _pCanvasElement.createRadialGradient = function (aX0, aY0, aR0, aX1, aY1, aR1)
        {
            var handle = this.handle;
            if (handle)
            {
                var gradient = new nexacro._CanvasGradient('radial');
                gradient.x0 = aX0;
                gradient.y0 = aY0;
                gradient.r0 = aR0;
                gradient.x1 = aX1;
                gradient.y1 = aY1;
                gradient.r1 = aR1;
                return gradient;
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
                    nexacro.__setCanvasElementHandleFillColor(handle, fillstyle);
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
            if (!font) return;
            this.font = font;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setCanvasElementHandleFontObject(handle, font);
            }
        };

        _pCanvasElement.setElementGlobalAlpha = function (alpha)
        {
            // min, max 처리
            this.globalAlpha = alpha;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setCanvasElementHandleGlobalAlpha(handle, alpha);
            }
        };

        _pCanvasElement.setElementGlobalCompositeOperation = function (operation)
        {
            this.globalCompositeOperation = operation;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setCanvasElementHandleGlobalCompositoperation(handle, operation);
            }
        };

        _pCanvasElement.setElementLineStyle = function (linetype)
        {
            var handle = this.handle;
            if (handle)
            {
                this.lineType = linetype;
                nexacro.__setCanvasElementHandleLineStyle(handle, linetype);
            }
        };

        _pCanvasElement.setElementLineCap = function (captype)
        {
            var handle = this.handle;
            if (handle)
            {
                this.lineCap = captype;
                nexacro.__setCanvasElementHandleLineCap(handle, captype);
            }
        };

        _pCanvasElement.setElementLineJoin = function (jointype)
        {
            var handle = this.handle;
            if (handle)
            {
                this.lineJoin = jointype;
                nexacro.__setCanvasElementHandleLineJoin(handle, jointype);
            }
        };

        _pCanvasElement.setElementLineWidth = function (size)
        {
            var handle = this.handle;
            if (handle && isFinite(size))
            {
                this.lineWidth = size;
                this.lineOffset = Math.round(size / 2);
                nexacro.__setCanvasElementHandleLineWidth(handle, size);
            }
        };

        _pCanvasElement.setElementMiterLimit = function (size)
        {
            var handle = this.handle;
            if (handle)
            {
                this.miterLimit = size;
                nexacro.__setCanvasElementHandleMiterLimit(handle, size);
            }
        };

        _pCanvasElement.setElementShadowBlur = function (fact)
        {
            var handle = this.handle;
            if (handle)
            {
                this.shadowBlur = fact;
                nexacro.__setCanvasElementHandleShadowBlur(handle, fact);
            }
        };

        _pCanvasElement.setElementShadowColor = function (color)
        {
            var handle = this.handle;
            if (handle)
            {
                this.shadowColor = color;
                nexacro.__setCanvasElementHandleShadowColor(handle, nexacro._getWebColorFromXreColor(color.value));
            }
        };

        _pCanvasElement.setElementShadowOffsetX = function (sx)
        {
            var handle = this.handle;
            if (handle)
            {
                this.shadowOffsetX = sx;
                nexacro.__setCanvasElementHandleShadowOffsetx(handle, sx);
            }
        };

        _pCanvasElement.setElementShadowOffsetY = function (sy)
        {
            var handle = this.handle;
            if (handle)
            {
                this.shadowOffsetY = sy;
                nexacro.__setCanvasElementHandleShadowOffsety(handle, sy);
            }
        };

        _pCanvasElement.setElementStrokeStyle = function (color)
        {
            var handle = this.handle;
            if (handle && color)
            {
                this.strokeStyle = color;
                nexacro.__setCanvasElementHandleStrokeColor(handle, color);
            }
        };

        _pCanvasElement.setElementTextAlign = function (textalign)
        {
            var handle = this.handle;
            if (handle)
            {
                this.textAlign = textalign;
                nexacro.__setCanvasElementHandleTextAlign(handle, textalign);
            }
        };

        _pCanvasElement.setElementTextBaseline = function (basealign)
        {
            var handle = this.handle;
            if (handle)
            {
                this.textBaseline = basealign;
                nexacro.__setCanvasElementHandleTextBaseline(handle, basealign);
            }
        };


        //##### Basic method #####
        _pCanvasElement.arc = function (x, y, r, start_rad, end_rad, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                counterclockwise = (counterclockwise) ? false : counterclockwise;
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r, start_rad, end_rad, counterclockwise);
            }
        };

        _pCanvasElement.arcTo = function (x, y, x2, y2, r)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleArcToPath(handle, x, y, x2, y2, r);
            }
        };

        _pCanvasElement.beginPath = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.bezierCurveTo = function (p1x, p1y, p2x, p2y, x, y)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleBezierCurveToPath(handle, p1x, p1y, p2x, p2y, x, y);
            }
        };

        _pCanvasElement.clearRect = function (x, y, dx, dy)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__clearCanvasElementHandleRect(handle, x, y, dx, dy);
            }
        };

        _pCanvasElement.clip = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__clipCanvasElementHandle(handle);
            }
        };

        _pCanvasElement.closePath = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleClosePath(handle);
            }
        };

        _pCanvasElement.createImageData = function (iWidth, iHeight)
        {
            var handle = this.handle;
            if (handle)
            {
                return nexacro.__createCanvasElementHandleImageData(handle, iWidth, iHeight);
            }
        };

        _pCanvasElement.drawImage = function (_image_handle, x, y, imgwidth, imgheight)
        {
            var handle = this.handle;
            if (handle)
            {
                var absoluteUrl = _image_handle.src;
                if (absoluteUrl && absoluteUrl.substring(0, 4).toLowerCase() == "url(")
                {
                    absoluteUrl = absoluteUrl.substring(5, absoluteUrl.length - 2);
                }
                if (absoluteUrl && !nexacro._isAbsolutePath(absoluteUrl))
                {
                    absoluteUrl = nexacro._getImageLocation(absoluteUrl);
                }
                nexacro.__drawCanvasElementHandleImage(handle, absoluteUrl, x, y, imgwidth, imgheight);
            }
        };

        _pCanvasElement.fill = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__fillCanvasElementHandlePath(handle);
            }
        };

        _pCanvasElement.fillRect = function (x, y, dx, dy)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__fillCanvasElementHandleRect(handle, x, y, dx, dy);
            }
        };

        _pCanvasElement.fillText = function (text, x, y, maxwidth)
        {
            var handle = this.handle;
            if (handle)
            {
                var font = this.font;
                if (font)
                    nexacro.__setCanvasElementHandleFontObject(handle, font);

                var color = this.fillStyle;
                if (color)
                    nexacro.__setCanvasElementHandleFillColor(handle, nexacro._getWebColorFromXreColor(color.value));

                nexacro.__fillCanvasElementHandleText(handle, text, x, y, maxwidth);
            }
        };

        _pCanvasElement.getImageData = function (sx, sy, width, height)
        {
            var handle = this.handle;
            if (handle)
            {
                return nexacro.__getCanvasElementHandleImageData(handle, sx, sy, width, height);
            }
        };

        _pCanvasElement.isPointInPath = function (x, y)
        {
            var handle = this.handle;
            if (handle)
            {
                return nexacro.__isPointInCanvasElementHandlePath(handle, x, y);
            }
        };

        _pCanvasElement.lineTo = function (x, y)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleLineToPath(handle, x, y);
            }
        };

        _pCanvasElement.moveTo = function (x, y)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleMoveToPath(handle, x, y);
            }
        };

        _pCanvasElement.putImageData = function (_image_handle, sx, sy, ix, iy, iwidth, iheight)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__putCanvasElementHandleImageData(handle, _image_handle, sx, sy, ix, iy, iwidth, iheight);
            }
        };

        _pCanvasElement.quadraticCurveTo = function (cp1x, cp1y, cp2x, cp2y)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleQuadraticCurveToPath(handle, cp1x, cp1y, cp2x, cp2y);
            }
        };

        _pCanvasElement.rect = function (x, y, dx, dy)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleRectPath(handle, x, y, dx, dy);
            }
        };

        _pCanvasElement.rotate = function (angle)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__rotateCanvasElementHandle(handle, angle);
            }
        };

        _pCanvasElement.rotate2 = function (radian)
        {
            var handle = this.handle;
            if (handle)
            {
                var angle = radian * Math.PI / 180;
                nexacro.__rotateCanvasElementHandle(handle, angle);
            }
        };

        _pCanvasElement.scale = function (dx, dy)
        {
            var handle = this.handle;
            this.scalex = dx;
            this.scaley = dy;
            if (handle)
            {
                nexacro.__scaleCanvasElementHandle(handle, dx, dy);
            }
        };

        _pCanvasElement.setTransform = function (a, b, c, d, e, f)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setCanvasElementHandleTransform(handle, a, b, c, d, e, f);
            }
        };

        _pCanvasElement.stroke = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__strokeCanvasElementHandlePath(handle);
            }
        };

        _pCanvasElement.strokeRect = function (x, y, dx, dy)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__strokeCanvasElementHandleRect(handle, x, y, dx, dy);
            }
        };

        _pCanvasElement.strokeText = function (text, tx, ty, maxwidth)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__strokeCanvasElementHandleText(handle, text, tx, ty, maxwidth);
            }
        };

        _pCanvasElement.transform = function (a, b, c, d, e, f)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__transformCanvasElementHandle(handle, a, b, c, d, e, f);
            }
        };

        _pCanvasElement.translate = function (x, y)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__translateCanvasElementHandle(handle, x, y);
            }
        };


        //##### Composite #####
        // CanvasBase.arc();
        _pCanvasElement.arc2 = function (x, y, r, start_deg, end_deg, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                var start_rad = start_deg * Math.PI / 180;
                var end_rad = end_deg * Math.PI / 180;
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r, start_rad, end_rad, counterclockwise);
            }
        };

        _pCanvasElement.circle = function (x, y, r)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r, 0, 2 * Math.PI, true);
            }
        };

        _pCanvasElement.drawStrokeArc = function (x, y, r, start_deg, end_deg, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                this.arc(x, y, r, start_deg, end_deg, counterclockwise);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawStrokeArc2 = function (x, y, r, start_deg, end_deg, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                this.arc2(x, y, r, start_deg, end_deg, counterclockwise);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawStrokeCircle = function (x, y, r)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r, 0, 2 * Math.PI, true);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        /*
        _pCanvasElement.drawStrokeHalfRect = function (x, y, w, h)
        {
            var handle = this.handle;
            if (handle)
            {
                this.halfRect(x, y, w, h);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };
        */

        _pCanvasElement.drawStrokeLine = function (x1, y1, x2, y2)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleMoveToPath(handle, x1, y1);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x2, y2);
                this.drawStroke();
            }
        };

        _pCanvasElement.drawStrokeVLine = function (x, y1, y2)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleMoveToPath(handle, x, y1);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x, y2);
                this.drawStroke();
            }
        };

        _pCanvasElement.drawStrokeHLine = function (y, x1, x2)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleMoveToPath(handle, x1, y);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x2, y);
                this.drawStroke();
            }
        };

        _pCanvasElement.drawStrokeInsetArc = function (x, y, r, start_deg, end_deg, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                var gap = this.lineOffset;
                start_deg = start_deg * (Math.PI / 180);
                end_deg = end_deg * (Math.PI / 180);
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r - gap, start_deg, end_deg, counterclockwise);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawStrokeInsetCircle = function (x, y, r)
        {
            var handle = this.handle;
            if (handle)
            {
                var gap = this.lineOffset;
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r - gap, 0, 2 * Math.PI, true);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawStrokeInsetRect = function (x, y, w, h)
        {
            var handle = this.handle;
            if (handle)
            {
                this.insetRect(x, y, w, h);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawStrokeRect = function (x, y, w, h)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleRectPath(handle, x, y, w, h);
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawFillRect = function (x, y, dx, dy)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleRectPath(handle, x, y, dx, dy);
                nexacro.__fillCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawFillText = function (text, x, y, maxwidth)
        {
            var handle = this.handle;
            if (handle)
            {
                var font = this.font;
                if (font)
                    nexacro.__setCanvasElementHandleFontObject(handle, font);

                var color = this.fillStyle;
                if (color)
                    nexacro.__setCanvasElementHandleFillColor(handle, nexacro._getWebColorFromXreColor(color.value));

                nexacro.__setCanvasElementHandleTextBaseline(handle, this.textBaseline);
                nexacro.__fillCanvasElementHandleText(handle, text, x, y, maxwidth);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.endDraw = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleBeginPath(handle);
                nexacro.__plotCanvasElementHandleClosePath(handle);
            }
        };

        _pCanvasElement.drawFill = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__fillCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawStroke = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__strokeCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawFillArc = function (x, y, r, start_rad, end_rad, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                this.arc(x, y, r, start_rad, end_rad, counterclockwise);
                nexacro.__plotCanvasElementHandleClosePath(handle);
                nexacro.__fillCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawFillArc2 = function (x, y, r, start_deg, end_deg, counterclockwise)
        {
            var handle = this.handle;
            if (handle)
            {
                this.arc2(x, y, r, start_deg, end_deg, counterclockwise);
                nexacro.__plotCanvasElementHandleClosePath(handle);
                nexacro.__fillCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        _pCanvasElement.drawFillCircle = function (x, y, r)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleArcPath(handle, x, y, r, 0, 2 * Math.PI, true);
                nexacro.__fillCanvasElementHandlePath(handle);
                nexacro.__plotCanvasElementHandleBeginPath(handle);
            }
        };

        // this is only for stroke
        /*
        _pCanvasElement.halfRect = function (x, y, w, h)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__plotCanvasElementHandleMoveToPath(handle, x, y);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x, y + h);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x + w, y + h);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x + w, y);
            }
        };
        */

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

        // this is only for stroke
        _pCanvasElement.insetRect = function (x, y, w, h)
        {
            var handle = this.handle;
            if (handle)
            {
                if (w == 0 || h == 0) return;
                var gap = this.lineOffset;
                var wgap = (w > 0) ? gap : -gap;
                var hgap = (h > 0) ? gap : -gap;
                nexacro.__plotCanvasElementHandleMoveToPath(handle, x + wgap, y + hgap);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x + wgap, y + h - hgap);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x + w - wgap, y + h - hgap);
                nexacro.__plotCanvasElementHandleLineToPath(handle, x + w - wgap, y + hgap);
                nexacro.__plotCanvasElementHandleClosePath(handle);
            }
        };

        _pCanvasElement.measureText = function (text, font)
        {
            var handle = this.handle;
            if (handle)
            {
                if (!font)
                {
                    font = new nexacro.FontObject();
                }

                var obj = nexacro._getTextSize(text, font);
                return { width: obj[0], height: obj[1] };
            }
        };

        _pCanvasElement.save = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__saveCanvasElementHandle(handle);
            }
        };
        _pCanvasElement.restore = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                return nexacro.__restoreCanvasElementHandle(handle);
            }
        };
        /*
        _pCanvasElement.drawBorder = function (x, y, width, height, border, bordertype)
        {
            if (border && !border._is_empty)
            {
                if (border._linecnt == 1)
                {
                    if (border.width && border.color != "" && border.color != "transparent") 
                    {
                        var color = new nexacro.Style_color(border.color);
                        this.setElementStrokeStyle(color);
                        this.setElementLineWidth(border.width);
                        this.drawStrokeInsetRect(x, y, width, height);
                    }
                }
                else if (border._linecnt == 2) 
                {
                    if (border.top._isValid()) 
                    {
                        this._setLineStyle(border.top);
                        var offset = border.top._width / 2;
                        this.moveTo(x, y + offset);
                        this.lineTo(x + width, y + offset);
                        this.moveTo(x, y + height - offset);
                        this.lineTo(x + width, y + height - offset);
                        this.stroke();
                    }
                    if (border.right._isValid()) 
                    {
                        this._setLineStyle(border.right);
                        var offset = border.right._width / 2;
                        this.moveTo(x + width - offset, y);
                        this.lineTo(x + width - offset, y + height);
                        this.moveTo(x + offset, y);
                        this.lineTo(x + offset, y + height);
                        this.stroke();
                    }
                }
                else if (border._linecnt == 3) 
                {
                    if (border.top._isValid()) 
                    {
                        this._setLineStyle(border.top);
                        var offset = border.top._width / 2;
                        this.moveTo(x, y + offset);
                        this.lineTo(x + width, y + offset);
                        this.stroke();
                    }
                    if (border.right._isValid()) 
                    {
                        this._setLineStyle(border.right);
                        var offset = border.right._width / 2;
                        this.moveTo(x + width - offset, y);
                        this.lineTo(x + width - offset, y + height);
                        this.moveTo(x + offset, y);
                        this.lineTo(x + offset, y + height);
                        this.stroke();
                    }
                    if (border.bottom._isValid()) 
                    {
                        this._setLineStyle(border.bottom);
                        var offset = border.bottom._width / 2;
                        this.moveTo(x, y + width - offset);
                        this.lineTo(x + width, y + width - offset);
                        this.stroke();
                    }
                }
                else 
                {
                    if (border.top._isValid()) 
                    {
                        this._setLineStyle(border.top);
                        var offset = border.top._width / 2;
                        this.moveTo(x, y + offset);
                        this.lineTo(x + width, y + offset);
                        this.stroke();
                    }
                    if (border.right._isValid()) 
                    {
                        this._setLineStyle(border.right);
                        var offset = border.right._width / 2;
                        this.moveTo(x + width - offset, y);
                        this.lineTo(x + width - offset, y + height);
                        this.stroke();
                    }
                    if (border.bottom._isValid()) 
                    {
                        this._setLineStyle(border.bottom);
                        var offset = border.bottom._width / 2;
                        this.moveTo(x, y + width - offset);
                        this.lineTo(x + width, y + width - offset);
                        this.stroke();
                    }
                    if (border.left._isValid()) 
                    {
                        this._setLineStyle(border.left);
                        var offset = border.left._width / 2;
                        this.moveTo(x + offset, y);
                        this.lineTo(x + offset, y + height);
                        this.stroke();
                    }
                }
            }
        };
        */

        _pCanvasElement.toDataURL = function (imgType, imgOption)
        {
            var handle = this.handle;
            if (handle)
            {
                var url = nexacro.__toDataURLCanvasElementHandle(handle, imgType, imgOption);
                if (url)
                {
                    var imgObj = new nexacro.Image();
                    imgObj.set_src(url);
                    return imgObj;
                }
            }
        };

        //arc2 와 동일 
        //_pCanvasElement.drawArc = function (x, y, r, start_deg, end_deg, bClockwise, bNormal)
        //{
        //    //Todo..            
        //};

        //##### internal function #####
        _pCanvasElement._setLineStyle = function (line)
        {
            if (line) // && line._isValid())
            {
                this.setElementStrokeStyle(line.color);
                this.setElementLineWidth(parseInt(line.width));
            }
        };

        _pCanvasElement._setPenStyle = function (pen)
        {
            if (pen) // && pen._isValid())
            {
                this.setElementStrokeStyle(pen.color);
                this.setElementLineWidth(parseInt(pen.width));
            }
        };

        _pCanvasElement._moveCanvas = function (left, top, width, height)
        {
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;

            var handle = this.handle;
            if (handle)
            {
                var newLeft = this._getRTLPositionLeft(left, this.width);
                // trace("\nCanvasElement : " + this.id, left, newLeft);
                nexacro.__setElementHandleSize(handle, width, height);
                nexacro.__setElementHandlePosition(handle, newLeft, top);
            }
        };

        _pCanvasElement._getElementScreenXY = function ()
        {
            return nexacro._getElementPositionInFrame(this);
        };
        nexacro._CanvasFillPattern = function ()
        {
            this.imageobject = null;
            this.repeattype = null;
            this.value = null;
            this.isloaded = false;
            this.control = null;
            this.controlonloadcallback = null;


        };
        var __pCanvasFillPattern = nexacro._CanvasFillPattern.prototype;
        __pCanvasFillPattern.onloadcallback = function (imageurl, width, height, handle, errstatus, temp, fireerrorcode, returncode, path, locationuri)
        {

            if (width > 0)
                this.imageobject.width = width;
            if (height > 0)
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
            this.colors.push({ offset: aOffset, color: color });
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
            this._target_vscroll_elements = null; //control_elements
            this._target_hscroll_elements = null; //control_elements
            var client_element = new nexacro._ContainerElement(this);
            this._client_elem = client_element;
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

        //CHECK change baseElement : nexacro.ControlElement ->nexacro.ScrollableControlElement 
        //CHECK nexacro.__createControlElementHandle -> nexacro.__createScrollableControlElementHandle
        /*
        _pGridScrollableControlElement.create = function (win)
        {
            // parent is always control element
            var owner_elem = (this._is_nc_element) ? this.parent_elem : this.parent_elem.getContainerElement(this.position_step);
            if (owner_elem && owner_elem.handle)
            {
                if (!this.handle)
                {
                    this.owner_elem = owner_elem;
                    var win_handle = win.handle || owner_elem._getRootWindowHandle();
                    var handle = nexacro.__createControlElementHandle(this, win_handle, this.left, this.top, this.width, this.height);
                    this.linkedcontrol._unique_id = this.linkedcontrol.parent._unique_id + '_' + this.linkedcontrol.id;
                    nexacro.__setAttachedControlUniqueID(handle, this.linkedcontrol._unique_id);

                    // append TO Parent Element
                    this.handle = this.dest_handle = handle;
                    nexacro.__appendElementHandle(owner_elem.dest_handle, handle);

                    // set border & background
                    if (this.border || this.bordertype)
                    {
                        this._setControlBorder(handle, this.border, this.bordertype);
                    }
                    if (this.background)
                    {
                        this._setControlBackground(handle, this.background, this.gradation);
                    }
                    if (this.opacity)
                    {
                        nexacro.__setElementHandleOpacity(handle, this.opacity)
                    }
                    if (this._hittest_type)
                    {
                        nexacro.__setElementHittestValue(handle, this._hittest_type);
                    }
                    // render
                    this._refreshControl(handle);
                }

                //container element create
                // no need set props for child --> only create it
                // props are already setted to child_elem
                if (this.handle && !this._client_elem.handle)
                {
                    this._client_elem.create(win);
                }
            }
        };
        */
        _pGridScrollableControlElement._on_destroy = function ()
        {
            // scrollablecontainer_element destroyed by control_element
            this._target_vscroll_elements = null;
            this._target_hscroll_elements = null;
            // sctollbar control destroyed by component
            this._hscroll_control = null;
            this._vscroll_control = null;

        };

        //_pGridScrollableControlElement.clearContents = function ()
        //{
        //    if (this.handle)
        //    {
        //        // destroy handle of client element : keep parent relation
        //        this._client_elem.clearContents();
        //    }
        //};

        _pGridScrollableControlElement.getContainerElement = function ()
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
                //if (nexacro._isArray(vert_elems)) pivot
                //{
                //    var elem;
                //    for (var i = 0, n = vert_elems.length; i < n ; i++)
                //    {
                //        elem = vert_elems[i];
                //        elem.setElementVScrollPos(pos);
                //    }
                //}
                //else
                {
                    vert_elems.setElementVScrollPos(pos);
                }
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

            var padding = this.padding ? this.padding : this._padding_info;
            if (padding)
            {
                client_left = padding.left;
                client_top = padding.top;
                client_width -= padding.left + padding.right;
                client_height -= padding.top + padding.bottom;
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
            var factor = 4;

            if (zoomfactor != 1)
            {
                zclient_width = nexacro._floor(zclient_width, factor);
                zclient_height = nexacro._floor(zclient_height, factor);
                zclient_width_body = nexacro._floor(zclient_width_body, factor);
                zclient_height_body = nexacro._floor(zclient_height_body, factor);
                container_maxwidth = nexacro._floor(container_maxwidth, factor);
                container_maxheight = nexacro._floor(container_maxheight, factor);
            }

            var step_count = this._step_count;
            var pre_step_count = this._pre_step_count;
            var is_change_step_cnt = false;
            is_change_step_cnt = step_count != pre_step_count;
            //var step_index = this._step_index;
            var step_containers = this._step_containers;
            if ((step_count > 0 && step_containers) != is_change_step_cnt)
            {
                container_maxwidth = step_count * zclient_width_body;
            }

            //var reset_vlimit = false;
            //var reset_hlimit = false;

            // var hscroll_visible = false;
            this._vscroll_visible = false;

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
                    zclient_height = nexacro._floor(client_height / zoomfactor, factor);
                    zclient_height_body -= nexacro._floor(this._hscroll_size / zoomfactor, factor);
                }
            }
            else
            {
                if (hscrollbartype == "fixed")
                {
                    client_height -= this._hscroll_size;
                    zclient_height = nexacro._floor(client_height / zoomfactor, factor);
                    zclient_height_body -= nexacro._floor(this._hscroll_size / zoomfactor, factor);
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
                    zclient_width = nexacro._floor(client_width / zoomfactor, factor);
                    zclient_width_body -= nexacro._floor(this._vscroll_size / zoomfactor, factor);
                    this._vscroll_visible = true;
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
                    zclient_width = nexacro._floor(client_width / zoomfactor, factor);
                    zclient_width_body -= nexacro._floor(this._vscroll_size / zoomfactor, factor);
                    this._vscroll_visible = true;
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
            if (this.client_left != client_left || this.client_top != client_top || this._isRtl())
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
            else if (nexacro._floor(this.client_width, factor) != nexacro._floor(zclient_width, factor) || nexacro._floor(this.client_height, factor) != nexacro._floor(zclient_height, factor))
            {
                ret += 2;
            }

            return ret;
        };
        //////////////////////////////////////////////////////////////////////////
        // scrollable control not apply padding to client_element
        //////////////////////////////////////////////////////////////////////////
        //_pGridScrollableControlElement.appendChildElement = function (child_elem)
        //{
        //    // this child element is client element
        //    if (this.handle)
        //    {
        //        if (child_elem.parent_elem != this)
        //        {
        //            if (child_elem.handle)
        //            {
        //                var old_win_handle = child_elem._getRootWindowHandle();
        //                var new_win_handle = this._client_elem._getRootWindowHandle();
        //                if (old_win_handle != new_win_handle)
        //                {
        //                    child_elem.parent_elem = this;
        //                    // for recreate Child Element Handle
        //                    child_elem._destroyElementHandle();
        //                }
        //                else
        //                {
        //                    child_elem.parent_elem = this;
        //                }
        //            }
        //            else
        //            {
        //                child_elem.parent_elem = this;
        //            }
        //        }

        //        // if child element is not created ==> create child handle
        //        if (!child_elem.handle)
        //        {
        //            child_elem.create(this._getWindow());
        //        }
        //        else
        //        {
        //            child_elem._appendToContainer(this._client_elem);
        //        }
        //    }
        //};
        //_pGridScrollableControlElement.removeChildElement = function (child_elem)
        //{
        //    // this child element is client element
        //    if (child_elem.parent_elem == this)
        //    {
        //        child_elem._removeFromContainer();
        //    }
        //};

        //_pGridScrollableControlElement.sendToBackElement = function (cur_elem)
        //{
        //    this._client_elem.sendToBackElement(cur_elem);
        //};
        //_pGridScrollableControlElement.bringToFrontElement = function (cur_elem)
        //{
        //    this._client_elem.bringToFrontElement(cur_elem);
        //};
        //_pGridScrollableControlElement.moveToNextElement = function (cur_elem, target_elem)
        //{
        //    this._client_elem.moveToNextElement(cur_elem, target_elem);
        //};
        //_pGridScrollableControlElement.moveToPrevElement = function (cur_elem, target_elem)
        //{
        //    this._client_elem.moveToPrevElement(cur_elem, target_elem);
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
        };

        _pGridScrollableControlElement._setInnerElementScrollMaxTops = nexacro._emptyFn; // HTML only        

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
            this._client_elem = new nexacro._GridBandContainerElement(this);
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
            if (owner_elem && owner_elem.handle && !this.handle)
            {
                this.owner_elem = owner_elem;
                var win_handle = win.handle || owner_elem._getRootWindowHandle();
                var classname = this._classname ? this._classname : this._getElementClassName();

                var bPositionRtl = this._isParentRtl();
                var left = this.left;

                if (bPositionRtl)
                {
                    left = this._getRTLPositionLeft(left, this.width);
                }

                var handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height, classname, this.name, this._is_control);

                // render
                this._refreshControl(handle);

                /////////////////////////////////
                // append TO Parent Element
                this.handle = this.dest_handle = handle;

                nexacro.__appendElementHandle((this._is_nc_element) ? owner_elem.handle : owner_elem.dest_handle, handle);

                if (!this._client_elem.handle)
                    this._client_elem.create(win);

                if (this._client_elem_fix && !this._client_elem_fix.handle)
                    this._client_elem_fix.create(win);
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
                    this._client_elem_fix = new nexacro._GridBandContainerElement(this);
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
                var _win = this.linkedcontrol._getWindow();
                this._client_elem_fix.create(_win);
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
                }
            }
        };

        _pGridBandControlElement._resetExtendContainer = function () { };

        _pGridBandControlElement._calculateClientHeight = function (change_height)
        {
            var border = this.border || this.linkedcontrol._getCSSStyleValue("border", "enabled");
            var c_height = this.client_height + change_height + ((border) ? border._getBorderHeight() : 0);
            return c_height;
        };

        //_pGridBandControlElement.setElementBorder = function (border, bordertype)
        //{
        //    // update Border & Background SubElements
        //    this.border = border;
        //    this.bordertype = bordertype;
        //    this._setControlBorder(this.handle, border, bordertype, true);
        //    this._updateClientRect();
        //    this._client_elem._adjustPos();
        //};

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

            if (this.client_left != client_left || this.client_top != client_top || this._isRtl())
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
                if (this.client_left != client_left || this.client_top != client_top || this._isRtl())
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
                this._client_elem.setElementVScrollPos(vpos);
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

        //======================================================================
        // nexacro.GridBandContainerElement
        //======================================================================
        nexacro._GridBandContainerElement = function (parent_elem)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;
            this._grid = null;
        };

        var __pGridBandContainerElement = nexacro._createPrototype(nexacro._ContainerElement, nexacro._GridBandContainerElement);
        nexacro._GridBandContainerElement.prototype = __pGridBandContainerElement;
        // overide nexacro.Object
        __pGridBandContainerElement._type_name = "GridBandContainerElement";

        //==== defaule values =========//
        __pGridBandContainerElement._container_maxwidth = 0;
        __pGridBandContainerElement._container_maxheight = 0;

        __pGridBandContainerElement.destroy = function ()
        {
            nexacro._ContainerElement.prototype.destroy.call(this);
            this._grid = null;
        };

        __pGridBandContainerElement.setElementVScrollPos = function (vpos)
        {
            if (this._scroll_top != vpos || this.parent._reset_scrollpos)
            {
                this._scroll_top = vpos;

                if (!this.parent._no_setscroll)
                {
                    var handle = this.handle;
                    if (handle)
                    {
                        nexacro.__setElementHandleVScrollPos(handle, vpos);

                        if (this._grid)
                            this._grid._callback_onscroll(vpos);
                    }
                }
            }
        };

        __pGridBandContainerElement._adjustPos = function ()
        {
            this.setElementPosition(this.left, this.top);
        };

        __pGridBandContainerElement.setElementPosition = function (left, top)
        {
            var border = this.parent._cur_border;
            this.left = left;
            this.top = top;
            var handle = this.handle;
            if (handle)
            {
                var newLeft = this._getRTLPositionLeft(left, this.width);
                if (border)
                {
                    if (this._isParentRtl())
                    {
                        newLeft = newLeft - border.right._width;
                    }
                    else
                    {
                        newLeft = newLeft - border.left._width;
                    }
                    top = top - border.top._width;
                }

                if (newLeft || top)
                {
                    nexacro.__setElementHandlePosition(handle, newLeft, top);
                }
                else
                    nexacro.__clearElementHandlePosition(handle);
            }
        };

        __pGridBandContainerElement.setElementSize = function (width, height, update)
        {
            var border = this.parent._cur_border;
            this.width = width;
            this.height = height;
            if (width < 0) width = 0;
            if (height < 0) height = 0;

            var handle = this.handle;
            if (handle)
            {
                var left = this.left;
                var top = this.top;
                var newLeft = this._getRTLPositionLeft(left, width);

                if (border)
                {
                    width = width + border.left._width + border.right._width;
                    height = height + border.top._width + border.bottom._width;

                    if (this._isParentRtl())
                    {
                        newLeft = newLeft - border.right._width;
                    }
                    else
                    {
                        newLeft = newLeft - border.left._width;
                    }
                    top = top - border.top._width;
                }


                if (newLeft || top)
                {
                    nexacro.__setElementHandlePosition(handle, newLeft, top);
                }
                else
                    nexacro.__clearElementHandlePosition(handle);

                if (width && height)
                    nexacro.__setElementHandleSize(handle, width, height);
                else
                    nexacro.__clearElementHandleSize(handle);
            }
        };

        __pGridBandContainerElement.create = function (win)
        {
            var retn = nexacro._ContainerElement.prototype.create.call(this, win);
            this._adjustPos();
            return retn;
        };


        //======================================================================
        // nexacro.GridRowControlElement
        //======================================================================

        nexacro.GridRowControlElement = function (parent_elem, left_gap)
        {
            this._p_parent = parent_elem;
            this.parent_elem = parent_elem;

            this._client_left_element = null;
            this._client_body_element = new nexacro._ContainerElement(this);//, "body");
            this._client_right_element = null;
            this._use_translate_scroll = true;

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
                    var win_handle = win.handle || owner_elem._getRootWindowHandle();
                    var bPositionRtl = this._isParentRtl();
                    var left = this.left;

                    if (bPositionRtl)
                    {
                        this.rtl = bPositionRtl;
                        left = this._getRTLPositionLeft(left, this.width);
                    }

                    var handle = nexacro.__createControlElementHandle(this, win_handle, left, this.top, this.width, this.height, this._getElementClassName(), this.name, this._is_control);

                    this._refreshControl(handle);

                    // append TO Parent Element
                    this.handle = this.dest_handle = handle;

                    nexacro.__appendElementHandle((this._is_nc_element) ? owner_elem.handle : owner_elem.dest_handle, handle);
                }

                //container element create
                // no need set props for child --> only create it
                // props are already setted to child_elem
                if (this.handle)
                {
                    if (!this._client_body_element.handle)
                        this._client_body_element.create(win);
                    if (this._client_left_element && !this._client_left_element.handle)
                        this._client_left_element.create(win);
                    if (this._client_right_element && !this._client_right_element.handle)
                        this._client_right_element.create(win);

                    this._client_elem = this._client_body_element;
                }
            }
        };

        _pGridRowControlElement._on_destroy = function ()
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

        _pGridRowControlElement.getContainerElement = function (area)
        {
            if (area == 1)
                return this._client_left_element;
            else if (area == 2)
                return this._client_right_element;

            return this._client_body_element;
        };

        _pGridRowControlElement.setArea = function (leftwidth, rightwidth)
        {
            if (leftwidth > 0 && !this._client_left_element)
                this._client_left_element = new nexacro._ContainerElement(this);//, "left");

            if (rightwidth > 0 && !this._client_right_element)
                this._client_right_element = new nexacro._ContainerElement(this);//, "right");

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

        _pGridRowControlElement._updateClientRect = function (update)
        {
            var ret = this._on_updateClientRect();
            if (ret & 1)
                this._on_change_clientPos(this.client_left, this.client_top);
            if ((ret & 2) || update)
                this._on_change_clientSize(this.client_width, this.client_height);

            if (ret)
                this.setArea(this._left_width, this._right_width);

            this._setContainerMaxWidth(this._client_body_element._scroll_maxwidth, this.height);
        };

        _pGridRowControlElement._setContainerMaxWidth = function (width)
        {
            if (this._client_body_element)
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
    }

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

    _pCellControlElement._refreshBorderNone = function ()
    {
        if (this.handle)
        {
            if (this._get_rtl())
            {
                this.setElementBorder(this._border_info);
                nexacro.__setElementHandleBorderLeftNone(this.handle, this.borderRightNone);
                nexacro.__setElementHandleBorderRightNone(this.handle, this.borderLeftNone);
            }
            else
            {
                nexacro.__setElementHandleBorderLeftNone(this.handle, this.borderLeftNone);
                nexacro.__setElementHandleBorderRightNone(this.handle, this.borderRightNone);
            }
            nexacro.__setElementHandleBorderTopNone(this.handle, this.borderTopNone);
            nexacro.__setElementHandleBorderBottomNone(this.handle, this.borderBottomNone);
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

    _pCellControlElement._attach_editor_node = function (editor_elem) { };

    //======================================================================
    // nexacro.TabBarItemSetControlElement
    //======================================================================
    nexacro.TabBarItemSetControlElement = function (parent_elem)
    {
        nexacro.ControlElement.call(this, parent_elem);
    };

    var _pTabBarItemSetControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.TabBarItemSetControlElement);

    nexacro.TabBarItemSetControlElement.prototype = _pTabBarItemSetControlElement;

    _pTabBarItemSetControlElement._type_name = "TabBarItemSetControlElement";

    _pTabBarItemSetControlElement.setFixedArea = nexacro._emptyFn;
    _pTabBarItemSetControlElement.setElementScrollMaxSize = nexacro._emptyFn;
    _pTabBarItemSetControlElement.setElementHScrollPos = nexacro._emptyFn;
    _pTabBarItemSetControlElement.setElementVScrollPos = nexacro._emptyFn;

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

    _pHTMLControlElement.setElementHTML = nexacro._emptyFn;
    _pHTMLControlElement.querySelector = nexacro._emptyFn;
    _pHTMLControlElement.querySelectorAll = nexacro._emptyFn;
    _pHTMLControlElement.getElementById = nexacro._emptyFn;
    _pHTMLControlElement.getElementsByTagName = nexacro._emptyFn;
    _pHTMLControlElement.getElementsByClassName = nexacro._emptyFn;
    _pHTMLControlElement.getElementsByName = nexacro._emptyFn;
}

if (_process)
{
    _process = null;
    _pElement = null;
    _pTextBoxElement = null;
    _pIconElement = null;
    _pIconTextElement = null;
    _pImageElement = null;
    _pInputElement = null;
    _pTextAreaElement = null;
    _pControlElement = null;
    _pFrameControlElement = null;
    _pScrollableControlElement = null;
    __pContainerElement = null;
    __pFrameResizeBorderElement = null;
    _pModalOverlayElement = null;
    _pPluginElement = null;
    __pPluginObject = null;
    __pWebBrowserPluginElement = null;
    __pVideoPlayerPluginElement = null;
    _pCanvasElement = null;
    __pCanvasGradient = null;
    __pGoogleMapPluginElement = null;
    _pGridScrollableControlElement = null;
    _pGridBandControlElement = null;
    __pGridBandContainerElement = null;
    _pGridRowControlElement = null;
    _pCellControlElement = null;
    //_pTabBarItemSetControlElement = null;
    //_pHTMLTagControlElement = null;
}