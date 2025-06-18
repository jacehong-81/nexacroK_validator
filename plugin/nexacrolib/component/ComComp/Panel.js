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

if (!nexacro.Panel)
    {
        //==============================================================================
        // nexacro.Panel
        //==============================================================================
        nexacro.Panel = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
        {
            nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
            this._p_items = new nexacro.Collection();    //Components
            if (this._p_parent)
                this._init(); 
        };
    
    
        var _pPanel = nexacro._createPrototype(nexacro.Component, nexacro.Panel);
        nexacro.Panel.prototype = _pPanel;
        _pPanel._type_name = "Panel";
    
        /* default properties */    
        _pPanel._p_tabstop = false;
        _pPanel._p_type = "horizontal";
        // Fluid Layout
        _pPanel._p_spacing = "";
        _pPanel._p_horizontalgap = undefined;
        _pPanel._p_verticalgap = undefined;
    
        _pPanel._p_flexwrap = "nowrap";
        _pPanel._p_flexmainaxisalign = "start";
        _pPanel._p_flexcrossaxisalign = "start";
        _pPanel._p_flexcrossaxiswrapalign = "start";
    
        _pPanel._p_tabletemplate = "1* / 1*";
        _pPanel._p_tabletemplatearea = "";
        _pPanel._p_tabledirection = "horizontal";
        _pPanel._p_tablecellalign = "start start";
        _pPanel._p_tablecellincompalign = "start start";
        _pPanel._p_tablecellmovingtype = "autofill";
        
        /* internal variable */
        _pPanel._is_focus_accept = true;
        _pPanel._is_panel = true;
        _pPanel._is_simple_control = true;
        _pPanel._is_eventinfo_control = false;
        _pPanel._is_container = true;
        //_pPanel._is_scrollable = true;
        _pPanel._is_flexible_container = true;
        _pPanel._is_flexible_container_calculation = false;
        _pPanel._is_initLayoutManager = false;
    
        // for fittocontents
        _pPanel._default_width = -1;
        _pPanel._default_height = -1;
        _pPanel._fit_height = -1;
        _pPanel._fit_width = -1;
    
        _pPanel._prop_map_layoutalign_basic = ["start", "center", "end"];
        _pPanel._prop_map_layoutalign_space = ["spacebetween", "spacearound", "spaceevenly"];
    
        /* status */    
        
        /* accessibility */
        _pPanel._p_accessibilityrole = "none";
        _pPanel._p_accessibilityenable = false;
        //_pPanel._is_eventinfo_control = true;
    
        _pPanel._event_list = {
            "onclick": 1, "onkillfocus": 1, "onsetfocus": 1,
            "onkeydown": 1, "onkeyup": 1,
            "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
            "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
            "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
            "onmove": 1, "onsize": 1, "oncontextmenu": 1,
            "onmouseup": 1, "onmousedown": 1,
            "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1
            // "ondblclick": 1,  "onmousewheel": 1,
        };
    
        //===============================================================
        // nexacro.Panel : Create & Destroy & Update
        //===============================================================
    
        _pPanel.on_create_contents = function ()
        {   
            if (!this._p_items)
            {
               this._p_items = new nexacro.Collection();    //Components
            }
             
            var obj = new Layout("default","",0,0,this,function(p){});                                                                      
            obj.set_type(this._p_type);                                                                     
            this._addLayout(obj.name, obj);  
            if (this._p_fittocontents != "none")
                this.on_apply_fittocontents();
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                var fm = manager._fluidlayoutmanager;
                if (fm)
                    this._setInnerFlexibleFlag(true, fm.getLayoutArrangeType());
            }
            
            /*
            var items = this._p_items;
            for (var i = 0,len = items._p_length; i < len; i++)
            {
                var item = items[i];
                if (item)
                {
                    var comp = item._getComponent();
                    if (comp && comp._is_group && !comp._is_created)
                    {   
                        comp._initControlElementLayoutProps();
                    }   
                }            
            }
            */
        };
    
        _pPanel.on_created_contents = function (win)
        {
            //this.on_apply_type();
            var items = this._p_items;
            for (var i = 0,len = items._p_length; i < len; i++)
            {
                var item = items[i];
                item._attachPanel();
                item._on_apply_itemPosition(false);  
    
            }
            this._on_apply_layoutProp();
            
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.calcFluidLayoutContents(this);
            }
            if (!this._p_visible)
                this._applyElementVisible(this._p_visible);
            
        };
        
        _pPanel.on_create_contents_command = function ()
        {
            var str = "";       
            var items = this._p_items;        
            for (var i = 0,len = items._p_length; i < len; i++)
            {
                var item = items[i];
                if (item)
                {
                    var comp = item._getComponent();
                    if (comp && comp._is_group)
                    {
                        str += comp.createCommand();
                        item._is_createcommand = true;
                    }   
                }            
            }
           
            return str;
        };
    
        _pPanel.on_attach_contents_handle = function (win)
        {
            var items = this._p_items;        
            for (var i = 0,len = items._p_length; i < len; i++)
            {     
                var item = items[i];
                item._on_apply_itemLayoutProperties();
                if(!item._is_createcommand)
                {
                    item._attachPanel(i);
                    item._on_apply_itemPosition(false);              
                }  
                else
                {
                    //owner_elem
                    var control_elem = this.getElement();
                    var comp = item._getComponent();
                    var comp_control_elem = comp.getElement();
                    if (control_elem && comp_control_elem)
                    {
                        comp_control_elem.owner_elem = control_elem;
                    }
                }
                item._is_createcommand = false;            
            }
            
            this._on_apply_layoutProp();
            //layout 추가 임시코드      
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.calcFluidLayoutContents(this);
            }     
            if (!this._p_visible)
                this._applyElementVisible(this._p_visible);
            //this._update_position(this._isRtl());
            this._on_apply_LayoutSpacing();
        };
        
        _pPanel._on_apply_LayoutSpacing = function () 
        { 
             //panel 제약
            //size =0이어도 padding이 적용되어 보임
            // size=0일땐 강제로 spacing 0적용
            if (this._p_spacing)
            {
                if (this._adjust_height <= 0 || this._adjust_width <= 0)
                {
                    if (!this._is_applied_nonpadding)
                    {                    
                        var control_elem = this.getElement();
                        if (control_elem)
                        {
                            var p = this._nonepadding;
                            if (!p)
                                p = this._nonepadding = new nexacro.PaddingObject("0px");
                            control_elem._setElementLayoutSpacing(p);
                            this._is_applied_nonpadding = true;
                        }   
                    }
                }            
                else
                {
                    if (this._is_applied_nonpadding)
                    {  
                        var control_elem = this.getElement();
                        if (control_elem)
                        {
                            control_elem._setElementLayoutSpacing(this._spacing);
                            this._is_applied_nonpadding = false;
                        } 
                    }
                }
            }
        };
    
        _pPanel._recalcitemPosition = function () 
        { 
            //로직 보완 필요함.
            var items = this._p_items;
            for (var i = 0,len = items._p_length; i < len; i++)
            {
                var item = items[i];
                if (this.getItemIndex(item.id) > -1)
                   item._on_apply_itemPosition(false);             
            }        
            this._recalculateLayout();
        };
    
        _pPanel.on_after_created = function () 
        {
            //this._recalclayout();
         };
    
        _pPanel.destroy = function (callremovechild)
        {
            if (!this._is_alive)
                return;
    
            var is_fluid = this._isFluidContainer();
            var parent = this._is_group ? this._group_panel : this._getForm();
            //item을 빼서 form 붙일것
            var items = this._p_items;
            for (var i = 0, len = items._p_length; i < len; i++)
            {
                var item = items[i];
                if (item)
                    item._destroy();
                /*
                var comp = items[i]._getComponent();
                if (comp && comp._is_alive && comp._is_created)
                {     
                    comp._destroy();
                }
                */
            }
    
            if(this._nonepadding)
                this._nonepadding = null;
    
            var ret = this.destroyComponent(callremovechild);
    
            if (is_fluid)
            {
                parent._update_position_fluid(false);
            }
            return ret;
        };
    
        _pPanel._destroy = function (callremovechild)
        {
            if (!this._is_alive)
                return;
    
            //var is_fluid = this._isFluidContainer();
            //var parent = this.parent;
            //item을 빼서 form 붙일것
            var items = this._p_items;
            for (var i = 0, len = items._p_length; i < len; i++)
            {
                var comp = items[i]._getComponent();
                if (comp && comp._is_alive && comp._is_created)
                {     
                    comp._destroy();
                }
            }
            return this.destroyComponent(callremovechild);
        };
    
        _pPanel.on_destroy_contents = function ()
        {
            var items = this._p_items;
            for (var i = 0, len = items._p_length; i < len; i++)
            {
                var item = items[i];
                item.destroy();
                item = null;            
            }
        };
        
       // overide layout function
       _pPanel.on_change_containerRect = function (width, height)
       {        
            if (!this._is_created) return;    
            this._calced_container = false;
            //this._is_calculated = false;  
            //trace("on_change_containerRect",nexacro._tracecnt++);
            if (this._is_flexible_container)
            {
                this._on_change_containerRect_fluid(width, height);
            }
            else
            {
                this._on_change_containerRect_static(width, height);
            }
       };
    
       _pPanel._on_change_containerRect_static = function (width, height)
       {
           var comp;
          // var comps = this.components;
           var items = this._p_items;
           var rtl = this._isRtl();
    
           for (var i = 0, len = items._p_length; i < len; i++)
           {
               comp = items[i]._getComponent();
               if (comp && comp._control_element)
                {
                   comp._update_position(rtl);
                }
           }
    
       };
    
       _pPanel._on_change_containerRect_fluid = function ()
       {
            //trace("_on_change_containerRect_fluid",this._is_calc,nexacro._ttt++,"\n")
            if (this._is_calc) return; 
            this._is_calc = true;
            var items = this._p_items;
            var rtl = this._isRtl();
            
            for (var i = 0, len = items._p_length; i < len; i++)
            {
                var comp = items[i]._getComponent();
                if (comp && comp._control_element)
                {
                    comp._update_position(rtl);
                }
            }
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.calcFluidLayoutContents(this);
            }   
            
            this._on_apply_LayoutSpacing();
            this._is_calc = false;
       };
    
        //===============================================================
        // nexacro.Panel : Override
        //===============================================================
        _pPanel._on_init = function ()
        {
            //Todo.. 
        };
    
        _pPanel._init = function ()
        {
            this._initLayoutManager();
        };
        
        _pPanel._setCalcedContainer = function (is_calc)
        {
            this._calced_container = is_calc;
        };
        
        _pPanel._on_apply_text = nexacro._emptyFn;
        _pPanel.removeChild = nexacro._emptyFn;
        //===============================================================
        // nexacro.Panel : Properties
        //===============================================================
    
        _pPanel._setContents = function (contents)
        {
            var data_type = 0; //1 - JSON, 0 - XML
            var i,len;
            var ret = true;
            if (!contents) return;
            if (this._p_items.length > 0)
                this._clear();
            if ((typeof contents) == "object") data_type = 1;
            //JSON
            if (data_type == 1)
            {
                //Todo..
                try{
                    var jsonitems = contents;
                    for (i = 0,len = jsonitems.length; i<len; i++)
                    {
                        var jsonitem = jsonitems[i];
                        //underbar api로 구현
                        if (jsonitem.id)
                            this.addItem(jsonitem.id, jsonitem.componentid ? jsonitem.componentid : "");                
                    }
                }catch(e){
                    return;
                }
            }
            else
            { //XML
                var xmldata = nexacro._parseXMLDocument(contents);
                if (xmldata)
                {
                    var root = xmldata.childNodes[0];
                    if (root)
                    {
                        var rows = root.childNodes;
                        for (i = 0;i < rows.length;i++)
                        {
                            var item = rows[i];
                            if (item && item.attributes)
                            {
                                var _id  = item.getAttribute("id");
                                var _componentid = item.getAttribute("componentid");
                                if (_id)
                                {
                                    if (_componentid && this._getIndexByComponetid(_componentid) < 0 && this.getItemIndex(_id) < 0)
                                    {   
                                        var retArr = this._addItem(_id, _componentid);       
                                        var ret = retArr[0];
                                        var panelitem = retArr[1];
                                        if (ret > -1 && panelitem)
                                        {
                                            panelitem._attachPanel();
                                            panelitem._on_apply_itemPosition(false);
                                        }    
                                    }
                                }
                            }
                        }
                    }                
                }
            }        
            this._update_position_fluid(false);
            if (this._isFluidContainer())
            {
                var parent = this._getForm();
                if (parent)
                    parent._update_position_fluid(false);
            }      
            return ret;
        };
    
        // Fluid Layout Setter
        _pPanel.set_type = function (v)
        {
            var type_enum = ["horizontal", "vertical", "table"];
            if (type_enum.indexOf(v) == -1)
            {
                v = "horizontal";
            }
    
            if (this._p_type != v)
            {
                this._p_type = v;
                this.on_apply_type();
            }        
        };
    
        _pPanel.on_apply_type = function () //layout
        {
            var v = this._p_type;
            var layout =  this._layout;
            if (layout)
                layout.set_type(v);
            var control_elem = this.getElement();
            if (control_elem)
            {    
                control_elem._setElementLayoutType(v);
                this._recalculateLayout();       
            }            
        };
    
        _pPanel.set_spacing = function (v)
        {
            if (this._p_spacing != v)
            {
                this._p_spacing = v;
                this._spacing = new nexacro.PaddingObject(v);
                this.on_apply_spacing();
            }      
        };
    
        _pPanel.on_apply_spacing = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_spacing(this._p_spacing);
            //TODO:
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementLayoutSpacing(this._spacing);
                this._recalculateLayout();
            }        
        };
    
        _pPanel.set_horizontalgap = function (v)
        {
            if (v !== undefined)
            {
                if (isNaN(v = +v) || v < 0)
                {
                    return;
                }
            }
    
            if (this._p_horizontalgap != v)
            {
                this._p_horizontalgap = v;
                this.on_apply_horizontalgap();
            }        
        };
    
        _pPanel.on_apply_horizontalgap = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_horizontalgap(this._p_horizontalgap);
            //Todo..
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementLayoutHorizontalGap(this._p_horizontalgap);
                this._recalculateLayout();  
            }        
        };
    
        _pPanel.set_verticalgap = function (v)
        {
            if (v !== undefined)
            {
                if (isNaN(v = +v) || v < 0)
                {
                    return;
                }
            }
    
            if (this._p_verticalgap != v)
            {
                this._p_verticalgap = v;
                this.on_apply_verticalgap();
            }
            
        };
        _pPanel.on_apply_verticalgap = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_verticalgap(this._p_verticalgap);
             var control_elem = this.getElement();
             if (control_elem)
             {
                 control_elem._setElementLayoutVerticalGap(this._p_verticalgap);
                 this._recalculateLayout();  
             }
            
        };
    
        _pPanel.set_flexwrap = function (v)
        {
            var wrap_enum = ["nowrap", "wrap"];
            if (wrap_enum.indexOf(v) == -1)
            {
                return;
            }
    
            if (this._p_flexwrap != v)
            {
                this._p_flexwrap = v;
                this.on_apply_flexwrap();
            }
        };
    
        _pPanel.on_apply_flexwrap = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_flexwrap(this._p_flexwrap);
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementFlexWrap(this._p_flexwrap);
                this._recalculateLayout();
            }       
        };
    
        _pPanel.set_flexmainaxisalign = function (v)
        {
            var align_enum = this._prop_map_layoutalign_basic.concat(this._prop_map_layoutalign_space);
            if (align_enum.indexOf(v) == -1)
            {
                return;
            }
    
            if (this._p_flexmainaxisalign != v)
            {
                this._p_flexmainaxisalign = v;
                this.on_apply_flexmainaxisalign();
            }
        };
    
        _pPanel.on_apply_flexmainaxisalign = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_flexmainaxisalign(this._p_flexmainaxisalign);
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementFlexMainAxisAlign(this._p_flexmainaxisalign);
                this._recalculateLayout();
            }      
        };
    
        _pPanel.set_flexcrossaxisalign = function (v)
        {
            var align_enum = this._prop_map_layoutalign_basic;
            if (align_enum.indexOf(v) == -1)
            {
                return;
            }
    
            if (this._p_flexcrossaxisalign != v)
            {
                this._p_flexcrossaxisalign = v;
                this.on_apply_flexcrossaxisalign();
            }
        };
    
        _pPanel.on_apply_flexcrossaxisalign = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_flexcrossaxisalign(this._p_flexcrossaxisalign);
             var control_elem = this.getElement();
             if (control_elem)
             {
                 control_elem._setElementFlexCrossAxisAlign(this._p_flexcrossaxisalign);
                 this._recalculateLayout();
             }         
        };
    
        _pPanel.set_flexcrossaxiswrapalign = function (v)
        {
            var align_enum = this._prop_map_layoutalign_basic.concat(this._prop_map_layoutalign_space);
            if (align_enum.indexOf(v) == -1)
            {
                return;
            }
    
            if (this._p_flexcrossaxiswrapalign != v)
            {
                this._p_flexcrossaxiswrapalign = v;
                this.on_apply_flexcrossaxiswrapalign();
            }
        };
    
        _pPanel.on_apply_flexcrossaxiswrapalign = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_flexcrossaxiswrapalign(this._p_flexcrossaxiswrapalign);
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementFlexCrossAxisWrapAlign(this._p_flexcrossaxiswrapalign);
                this._recalculateLayout();
            }        
        };
    
    
        _pPanel.set_tabletemplate = function (v)
        {
            if (v && this._p_tabletemplate != v)
            {
                this._p_tabletemplate = v;
                this.on_apply_tabletemplate();
            }
        };
        _pPanel._setDefaultTabletemplate = function (v)
        {
            this._tabletemplate = v;
        };
    
        _pPanel.on_apply_tabletemplate = function ()
        {
            v = this._p_tabletemplate;
            if (!this._tabletemplate)
                this._tabletemplate = v;
            var layout =  this._layout;
            if (layout)
                layout.set_tabletemplate(v);
    
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementTableTemplate(this._p_tabletemplate);
                this._recalculateLayout();
            }
            
        };
    
        _pPanel.set_tabletemplatearea = function (v)
        {
            if (this._p_tabletemplatearea != v)
            {
                this._p_tabletemplatearea = v;
                this.on_apply_tabletemplatearea();
            }       
        };
    
        _pPanel.on_apply_tabletemplatearea = function (v)
        {
            //layout set
            var layout =  this._layout;
            if (layout)
                layout.set_tabletemplatearea(this._p_tabletemplatearea);
    
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementTableTemplateArea(this._p_tabletemplatearea);
                this._recalculateLayout();  
            }       
        };
    
        _pPanel.set_tablecellmovingtype = function (v)
        {
            var type_enum = ["none", "autofit", "autofill"];
            if (type_enum.indexOf(v) == -1)
            {
                return;
            }
            if (this._p_tablecellmovingtype != v)
                this._p_tablecellmovingtype = v;
            //this.on_apply_tablecellmovingtype();
        };
        /*
        _pLayout.on_apply_tablecellmovingtype = function (v)
        {
            if (this.tablecellmovingtype && this.tablecellmovingtype != "none" && nexacro._isDesignMode())
            {
                this.on_apply_tabletemplate();
            }
        };
        */
        _pPanel.set_tabledirection = function (v)
        {
            var direction_enum = ["horizontal", "vertical"];
            if (direction_enum.indexOf(v) == -1)
            {
                return;
            }
    
            if (this._p_tabledirection != v)
            {
                this._p_tabledirection = v;
                this.on_apply_tabledirection();
            }
        };
    
        _pPanel.on_apply_tabledirection = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_tabledirection(this._p_tabledirection);
             var control_elem = this.getElement();
             if (control_elem)
             {
                 control_elem._setElementTableDirection(this._p_tabledirection);
                 this._recalculateLayout();  
             }
             
        };
    
        _pPanel.set_tablecellalign = function (v)
        {
            if  ( this._p_tablecellalign != v)
            {
                this._p_tablecellalign = v;
                this.on_apply_tablecellalign();
            }     
        };
    
        _pPanel.on_apply_tablecellalign = function (v)
        {
            var layout =  this._layout;
            if (layout)
                layout.set_tablecellalign(this._p_tablecellalign);
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementTableCellAlign(this._p_tablecellalign);
            }
            this._recalculateLayout();
        };
    
        _pPanel.set_tablecellincompalign = function (v)
        {
            if (this._p_tablecellincompalign != v)
            {
                this._p_tablecellincompalign = v;
                this.on_apply_tablecellincompalign();
            }        
        };
    
        _pPanel.on_apply_tablecellincompalign = function ()
        {
            var layout =  this._layout;
            if (layout)
                layout.set_tablecellincompalign(this._p_tablecellincompalign);
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem._setElementTableCellinCompAlign(this._p_tablecellincompalign);
                this._recalculateLayout();
            }       
        };
    
        _pPanel.on_apply_fittocontents = function ()
        {
            this._on_apply_fittocontents();
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                this._calced_container = false;
    
                manager.setContainerFitType(this, this._p_fittocontents);
                if (this._is_created)
                {
                    manager.calcLayout(this);
                }
            }
        };
    
        _pPanel.on_apply_prop_enable = function (enable)
        {
            nexacro.Component.prototype.on_apply_prop_enable.call(this, enable);
    
            var items = this._p_items;
            if (items)
            {            
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];               
                    var comp = item._getComponent();    
                    if (comp)// && comp._is_created)     
                        comp._setEnable(enable);                 
                }
            }
    
            if (enable == true)
            {            
                var root_form = this._getRootForm();
                var form = this.parent;
                while (form)
                {
                    var binds = form._p_binds;
                    if (binds && binds.length > 0)
                        form._applyBinditemEnable(binds);
                    if (root_form == form || form instanceof nexacro.ChildFrame )
                        break;
                    form = form._getParentForm();
                }
            }       
        };
        
        _pPanel.set_items = _pPanel._setContents;
    
    
        _pPanel._properties = [{ name: "flexcrossaxisalign" }, { name: "flexcrossaxiswrapalign" }, { name: "flexmainaxisalign"},
            { name: "flexwrap"}, { name: "horizontalgap" }, { name: "spacing"},
            { name: "tablecellalign" }, { name: "tablecellincompalign" }, { name: "tabledirection"},
            { name: "tabletemplate" }, { name: "tabletemplatearea" }, { name: "verticalgap"},
            { name: "items" }, { name: "type" }, { name: "fittocontents"}
        ]; 
        nexacro._defineProperties(_pPanel, _pPanel._properties);
    
        //===============================================================
        // nexacro.Panel : Methods
        //===============================================================
        _pPanel.addItem = function (id, componentid)
        {
            var ret = -1;
            var item;
            if (componentid && this._getIndexByComponetid(componentid) < 0 && this.getItemIndex(id) < 0)
            {   
                var retArr = this._addItem(id, componentid);       
                ret = retArr[0];
                item = retArr[1];
                if (ret > -1 && item)
                {
                    //item._on_apply_itemLayoutProperties();
                    item._attachPanel();
                    item._on_apply_itemPosition();
                }    
            }
            return ret;        
        };
        
        _pPanel._getItembyIndex = function (idx)
        {
            var items = this._p_items;
            if (items)
            {
                var id = items.get_id(idx);
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];
                    if (item.id == id)
                        return item;
                }
            }
            return null;
        };
    
        _pPanel.removeItem = function (itemid) //id[,componentid]
        {      
            //trace("\nremoveItem",this.id, itemid);//, componentid)  
            var items = this._p_items;
            if (items)
            {            
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];
                    if (item.id == itemid)
                    {      
                        var ret = this._p_items.delete_item(i);
                        var comp = item._getComponent();    
                        if (comp)     
                            this._update_removeitem(comp);     
                        return ret;
                    }    
                }
            }
            return null;
        };
    
        _pPanel.insertItem = function (idx, id, componentid)
        {
            //trace("\nremoveItem",this.id, id, componentid, idx)  
            var item; // = form[componentid];
            var ret = -1;
            if (componentid && this._getIndexByComponetid(componentid) < 0 && this.getItemIndex(id) < 0)
            {   
                var retArr = this._insertItem(idx, id, componentid);       
                ret = retArr[0];
                item = retArr[1];
                if (ret > -1)
                {
                    item._attachPanel(idx);
                    item._on_apply_itemPosition();
                } 
                
            }
            //bind 관리
            return ret;        
        };
    
        _pPanel.getItemCount = function ()
        {
            //Todo
            return this._p_items._p_length;
        };
    
        _pPanel.getItem = function (itemid)
        {
            var items = this._p_items;
            if (items)
            {
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];
                    if (item.id == itemid)
                        return item;
                }
            }
            return null;
        };
    
        _pPanel.getItemIDByComponent = function (obj)
        {
            if (!obj) return "";
            var id = obj.id;
            var items = this._p_items;
            if (items)
            {
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];
                    if (item._p_componentid == id)
                        return item.id;
                }
            }
            return "";
        };
    
        _pPanel.getItemIndex = function (itemid)
        {
            var items = this._p_items;
            if (items)
            {
                var idx = items.indexOf(itemid);
                return idx > -1 ? idx : -1;
            }
            return -1;
        };
    
    
        _pPanel.getComponentByID = function (itemid)
        {
            var component = null;
            var items = this._p_items;
            if (items)
            {
                var idx = items.indexOf(itemid);
                if (idx > -1)
                {
                    var item = this._getItembyIndex(idx);
                    if (item)
                        component = item._getComponent();
                }
            }
            return component;
        };
        
        _pPanel.setContents = function (str)
        {
            var ret = this._setContents(str);
            return ret;
        };
    
        //===============================================================
        // nexacro.Panel : Events
        //===============================================================
        //Todo
        
        //===============================================================
        // nexacro.Panel : Logical part
        //===============================================================
        _pPanel._refreshControl = function ()
        {
            //사이즈 갱신을 위한 테스트용
            var items = this._p_items;
            var left=0, top=0, width=0, height=0;
            var layouttype = "horizontal";
            var form = this._p_parent;
            if (form)
            {
                var manager = nexacro._getLayoutManager();
                layouttype = manager.getLayoutType(form);
                //0 = default
                //1 = horizontal
                //2 = vertical
                //3 = table
            }
    
            //default
            var adjust_left =0;
            //horizontal
            if (layouttype == 1)
            {
                for (var i = 0, len = items.length; i < len; i++)
                {
                    var item = items[i]._getComponent();
                    left = left > item._p_left ? item._p_left : left;
                    top =  top > item._p_top ? item._p_top : top;
                    width += +item._p_width;
                    item.move(adjust_left,top);
                    adjust_left +=width;            
                    height = +item._p_height > height ? +item._p_height : height;
                }
                //table
                this.move(left, top, width, height);
            }
            else if (layouttype == 3)
            {//table
    
                
                var panel_tablecellarea;
                //calculate panelitemsize
                var start_col_idx, end_col_idx, start_row_idx, end_row_idx;
                for (var i = 0, len = items.length; i < len; i++)
                {
                    var item = items[i]._getComponent();    
                    var ret = this._getTablecellarea(item._p_tablecellarea);
                    if (i == 0)
                    {
                        start_col_idx = ret[2]; 
                        end_col_idx = ret[3];
                        start_row_idx = ret[0]; 
                        end_row_idx = ret[1];
                    }
                    else
                    {   
                        start_col_idx = ret[2] > start_col_idx ? start_col_idx : ret[2];
                        end_col_idx = ret[3] < end_col_idx ? end_col_idx : ret[3] ;
                        start_row_idx = ret[0] > start_row_idx ? start_row_idx : ret[0];                
                        end_row_idx = ret[1] < end_row_idx ? end_row_idx : ret[1];
                    }
                }
    
                //calculate tablecellarea
                //0 0/1 2
                //row_start row_end / col_start col_end
                this.resize("100%", "100%");
                panel_tablecellarea = start_row_idx + " " + end_row_idx + " / " + start_col_idx + " " + end_col_idx;
                this.set_tablecellarea(panel_tablecellarea);
                
                for (var i = 0, len = items.length; i < len; i++)
                {
                    var item = items[i];
                    left = left > item._p_left ? item._p_left : left;
                    top =  top > item._p_top ? item._p_top : top;
                    var control_elem = item._control_element;
                    if (control_elem)
                    {
                        control_elem._layoutbasis = null;
                    }      
                    item.move(adjust_left,top, "50%","100%");
                    adjust_left += item._adjust_width;                  
                }
            }        
        };
    
        _pPanel._recalculateLayout = function ()
        {   
            //trace("\n_recalculateLayout",this.id)
            this._setCalcedContainer(false);
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.calcFluidLayoutContents(this);
            }
        };
    
        _pPanel._getTablecellarea = function (tablecellarea)
        {        
            if (tablecellarea)
            {
                var merge_pos = [];
                var coord = tablecellarea.split("/");
                coord.forEach(function (cell_pos, idx, orgArr)
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
                return merge_pos;
            }
            return;
        };
    
        _pPanel._getIndexByComponetid = function (id)
        {
            //Todo..
            var items = this._p_items;
            if (items)
            {
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];
                    if (item.componentid == id)
                        return i;
                }
            }
            return -1;
        };
    
        
        _pPanel._addItem = function (id, componentid)
        {
            var idx = -1;
            var item = new nexacro.PanelItem(id,this);
            item.set_componentid(componentid);
            idx = this._p_items.add_item(id, item);          
            return [idx, item];//, comp ? comp : null]; //check
        };
    
        _pPanel._insertItem = function (idx, id, componentid)
        {
            var item = new nexacro.PanelItem(id, this);
            item.set_componentid(componentid);
            idx = this._p_items.insert_item(idx, id, item);
            return [idx, item]; //check
        };
    
        _pPanel._removeItem = function (componentid)
        {
            var items = this._p_items;
            if (items)
            {
                for (var i =0,len = items._p_length;i<len; i++)
                {
                    var item = items[i];
                    if (item._p_componentid == componentid)
                        return this._p_items.delete_item(i);
                }
            }
            return null;
        };
    
        _pPanel._getNewPanelItemId = function ()
        {
            var items = this._p_items;
            if (items)
            {
                var len = items._p_length;
                var idx = len;
                for (var i =0;i<len; i++)
                {
                    var newId = "PanelItem" + idx < 10 ? "0" + idx : idx; 
                    var item = this.getComponentByID(newId);
                    if (!item)
                        return newId;
                    idx++;
                }
            }
            return "";
        };
    
        _pPanel._initLayoutManager = function ()
        {
            if (this._is_subcontrol)
                return;
            
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                // form계열 init 마다 containerinfo추가
                manager.createLayoutContainerInfo(this);
                this._is_initLayoutManager = true;
            }
        };
    
        _pPanel._addLayout = function (name, obj)
        {
            if (!obj) return;
            this._layout = obj;
            var manager = nexacro._getLayoutManager(this);
            if (manager)
            {
                manager.addLayoutList(this, obj);
            }
        };
    
        _pPanel._unGroup = function ()
        {
            if (!this._is_alive)
                return;
                
            //item을 빼서 form 붙일것
            this._clear(true);
            this.destroyComponent();
    
            return true;
        };
    
        _pPanel._clear = function (is_ungroup)
        {
            if (!this._is_alive)
                return;
                
            //item을 빼서 form 붙일것
            var items = this._p_items;
            if (items)
            {            
                for (var i =items._p_length-1;i>-1; i--)
                {
                    var item = items[i];  
                    this._p_items.delete_item(i);
                    var comp = item._getComponent(); 
                    if (comp)
                        this._update_removeitem(comp);
                    if (is_ungroup && this._is_group)
                    {
                        var parent = this._group_panel;
                        if (parent)
                            parent.addItem(this._getNewPanelItemId(), comp.id);
                    }    
    
                }
            }
    
            return true;
        };
    
        _pPanel._update_removeitem = function (comp)
        {
            var form = this._getForm();
            var form_control_element = form.getElement();
            var comp_control_element = comp.getElement();
            if (form_control_element && comp_control_element)
            {
                this._setGroup(comp, false);
                comp_control_element._removeFromContainer();
                form._addChildToContainer(comp);
                var manager = nexacro._getLayoutManager();
                var fluidmanager = manager._fluidlayoutmanager;
                var arrange_type = fluidmanager.getLayoutArrangeType();
                var form_layouttype = manager.getLayoutType(form);
                if (form_layouttype == 0) //default
                {
                    comp._restorePosition();
                    comp_control_element.setElementLayoutFluidPos(false); //sticky     
                }
                if (arrange_type == 1)
                    manager.calcFluidLayoutContents(this);
    
                manager.calcFluidLayoutContents(form);
                if (comp._p_enable != this._real_enable)
                    comp._setEnable(comp._p_enable);
            }      
        };
        
        _pPanel._setGroup = function (target , flag)
        {
            var manager = nexacro._getLayoutManager();
            if (!target || !manager) return;
            if (flag == true)
            {
                target._group_panel = this;
                target._is_group = true;
            }
            else
            {
                target._group_panel = null;
                target._is_group = false;
            }       
            manager.updateLayoutContainerInfo(target);
        };
        _pPanel._setLayoutContentsMaxRect = function (w, h)
        {
            this._contents_max_rect = [w, h];
        };
        _pPanel._getLayoutContentsMaxRect = function ()
        {
            return this._contents_max_rect;
        };
    
    
        _pPanel._getComponents = function ()
        {
            var comps = new nexacro.Collection();
            var items = this._p_items;
            for (var i = 0,len = items._p_length; i < len; i++)
            {     
                var item = items[i];
                var comp = item._getComponent();  
                if (comp)
                    comps.add_item(comp.id, comp);
            }
            return comps;
        };
    
        _pPanel._on_apply_layoutProp = function ()
        {
            var layout =  this._layout;
            if (!layout) return;
            var control_elem = this.getElement();
            if (control_elem)
            {
                var type = this._p_type;
                if (type)
                {
                    layout.set_type(type);
                    control_elem._setElementLayoutType(type);
                }
                
                if (this._p_spacing)
                {
                    var spacing = this._spacing;
                    layout.set_spacing(spacing);
                    control_elem._setElementLayoutSpacing(spacing);
                }   
                var horizontalgap = this._p_horizontalgap;
                if (horizontalgap)
                {
                    layout.set_horizontalgap(horizontalgap);
                    control_elem._setElementLayoutHorizontalGap(horizontalgap);
                }
                var verticalgap = this._p_verticalgap;
                if (verticalgap)
                {
                    layout.set_verticalgap(verticalgap);
                    control_elem._setElementLayoutVerticalGap(verticalgap);
                }
                if (type == "table")
                {
                    var tabletemplate = this._p_tabletemplate;
                    if (tabletemplate)
                    {
                        layout.set_tabletemplate(tabletemplate);
                        control_elem._setElementTableTemplate(tabletemplate);
                    }   
                    var tabletemplatearea = this._p_tabletemplatearea
                    if (tabletemplatearea)
                    {
                        layout.set_tabletemplatearea(tabletemplatearea);
                        control_elem._setElementTableTemplateArea(tabletemplatearea);
                    }    
                    var tabledirection = this._p_tabledirection;
                    if (tabledirection)
                    {
                        layout.set_tabledirection(tabledirection);
                        control_elem._setElementTableDirection(tabledirection);
                    }
                    var tablecellalign = this._p_tablecellalign;
                    if (tablecellalign)
                    {
                        layout.set_tablecellalign(tablecellalign);
                        control_elem._setElementTableCellAlign(tablecellalign);
                    }   
                    var tablecellincompalign = this._p_tablecellincompalign
                    if (tablecellincompalign)
                    {
                        layout.set_tablecellincompalign(tablecellincompalign);
                        control_elem._setElementTableCellinCompAlign(tablecellincompalign);
                    } 
                }
                else
                {
                    var flexwrap = this._p_flexwrap;
                    if (flexwrap)
                    {
                        layout.set_flexwrap(flexwrap);
                        control_elem._setElementFlexWrap(flexwrap);
                    } 
                    var flexmainaxisalign = this._p_flexmainaxisalign
                    if (flexmainaxisalign)
                    {
                        layout.set_flexmainaxisalign(flexmainaxisalign);
                        control_elem._setElementFlexMainAxisAlign(flexmainaxisalign);
                    }  
                    var flexcrossaxiswrapalign = this._p_flexcrossaxiswrapalign;
                    if (flexcrossaxiswrapalign)
                    {
                        layout.set_flexcrossaxiswrapalign(flexcrossaxiswrapalign);
                        control_elem._setElementFlexCrossAxisWrapAlign(flexcrossaxiswrapalign);
                    }    
                    var flexcrossaxisalign = this._p_flexcrossaxisalign;
                    if (flexcrossaxisalign)
                    {
                        layout.set_flexcrossaxisalign(flexcrossaxisalign);
                        control_elem._setElementFlexCrossAxisAlign(flexcrossaxisalign);
                    }   
                }
                //this._recalculateLayout();
            }
        };
    
        _pPanel._areConsecutive = function (componentids)
        {
            if (!componentids) return false;
            //table
            var ret = false;
            var i,j,k,l, compid,idx,comp;
            var form_comps = this._getComponents();
            var comps = componentids.replace(/\s/g, "").split(",");
            var len = comps.length;
            var arr = [];
            var manager = nexacro._getLayoutManager();
            var layouttype = manager.getLayoutType(this);
            var fluidManager = manager._fluidlayoutmanager;
            var row_len = 0, col_len = 0;
            if (fluidManager && fluidManager._tabletemplate_rect)
            {
                var tableinfo = fluidManager._tabletemplate_rect;
                row_len = tableinfo.length;
                col_len = tableinfo[0].length;
            }
    
            //hashmap 관리?
            if (layouttype == 0) //default
            {
                //Todo
                for (i=0;i<len;i++)
                {
                    compid = comps[i];
                    idx = form_comps.indexOf(compid);
                    if (idx < 0)
                        return false; //같은 폼이 아니라면
                    comp = form_comps[compid];         
                    if (comp._is_group)
                        return false; //같은 폼이 아니라면
                }
                ret = true;
            }
            else if (layouttype == 1 || layouttype == 2) //horizontal vertical
            {
                for (i=0;i<len;i++)
                {
                    compid = comps[i];
                    idx = this._getIndexByComponetid(compid);
                    if (idx > -1)
                        arr.push(idx);
                    else
                        return false; //같은 폼이 아니라면
                }
    
                if (arr.length > 0)
                {
                    arr.sort();
                    // checking the adjacent elements
                    for (i = 1; i < len; i++)
                    {
                        if(arr[i]!=arr[i-1]+1)
                            return false;
                    }
                    ret = true;
                }
            }   
            else if (layouttype == 3) // table
            {            
                //arr 배열형태는 row/col이 바뀐 transposed matrix형태로
                //툴에서 보이는 형태 그대로 디버그시 보여짐
                var start_col=-1, start_row = -1, end_col=-1,end_row=-1;
                for (i = 0; i<col_len;i++)                    
                {
                    var arrorw = [];
                    for (j =0; j<row_len;j++)
                    {
                        arrorw.push(false);
                    }
                    arr.push(arrorw);
                }            
                for (i=0;i<len;i++)
                {
                    compid = comps[i];
                    idx = form_comps.indexOf(compid);
                    if (idx > -1)
                    {
                        comp = form_comps[compid];
                        var tca = comp._getTablecellareaCoordinate();
                        for (k = tca[2]; k<=tca[3] ;k++)                    
                        {
                            for (l = tca[0]; l<=tca[1] ;l++)
                            {
                                arr[l][k] = true;
                            }
                        }
                        if (i == 0)
                        {
                            start_row = tca[0];
                            end_row = tca[1];
                            start_col = tca[2];
                            end_col = tca[3];
                        }
                        else
                        {
                            if (tca[0] < start_row) start_row = tca[0];
                            if (tca[1] > end_row) end_row = tca[1];
                            if (tca[2] < start_col)start_col = tca[2];
                            if (tca[3] > end_col) end_col = tca[3];                            
                        }                    
                    }    
                }
                if (start_col < 0 || start_row < 0) return false;
                for (i = start_col; i<=end_col;i++)                    
                {
                    for (j =start_row; j<=end_row;j++)
                    {
                        if (!arr[j][i])
                            return false;
                    }
                }   
                ret = true;         
            }   
            return ret;  
        };   
      
        _pPanel._getSizeInfo = function ()
        {        
            var _size;
            var width = this._p_width;
            var height = this._p_height; 
            var minwidth = this._minwidth; 
            var minheight = this._minheight;
            var adjust_fit_height, adjust_fit_width;
            var parent_comp = this._getParentComponent();
            var parent_fittocontents = parent_comp ? parent_comp._p_fittocontents : "none";
            switch (this._p_fittocontents)
            {
                case "width":
                    _size = this._on_getFitSize();
                    width = _size[0];// : this._adjust_width;
                    if (width > minwidth)
                        minwidth = width;
                    adjust_fit_height = this._getAdjustFitPositionHeight(height, parent_fittocontents);
                    if (adjust_fit_height != height)
                        this._fit_height = minheight = height = adjust_fit_height;
                    break;
                case "height":
                    _size = this._on_getFitSize();
                    height = _size[1];// : this._adjust_height;
                    if (height > minheight)
                        minheight = height;
                    adjust_fit_width = this._getAdjustFitPositionWidth(width, parent_fittocontents);
                    if (adjust_fit_width != width)
                        this._fit_width = minwidth = width = adjust_fit_width;
                    break;
                case "both":
                    _size = this._on_getFitSize();
                    width = _size[0];// : this._adjust_width;
                    if (width > minwidth)
                        minwidth = width;
                    adjust_fit_height = this._getAdjustFitPositionHeight(height, parent_fittocontents);
                    if (adjust_fit_height != height)
                        this._fit_height = minheight = height = adjust_fit_height;
    
                    height = _size[1];
                    if (height > minheight)
                        minheight = height;
                    adjust_fit_width = this._getAdjustFitPositionWidth(width, parent_fittocontents);
                    if (adjust_fit_width != width)
                        this._fit_width = minwidth = width = adjust_fit_width;
                    break;
                default:
                    //if (this._calced_container)
                    //{
                    adjust_fit_height = this._getAdjustFitPositionHeight(height, parent_fittocontents);
                    if (adjust_fit_height != height)
                        this._fit_height = height = adjust_fit_height;
                    //if (height > minheight)
                    //    minheight = height;
                    adjust_fit_width = this._getAdjustFitPositionWidth(width, parent_fittocontents);
                    if (adjust_fit_width != width)
                        this._fit_width = width = adjust_fit_width;
                    //if (width > minwidth)
                    //    minwidth = width;
                    //}
                    break;
            }
            return [width, height, minwidth, minheight];
        };
       
        _pPanel._on_getFitSize = function ()
        {
            //if (!this._is_created)
            //    return [this._adjust_width, this._adjust_height];
            var total_w = 0, total_h = 0;
            var manager = nexacro._getLayoutManager(); 
            var size = manager.getContentsMaxRect(this);       
            if (size)
            {
                total_w += size[0];// ? size[0] : this._basis_width;
                total_h += size[1];
                //total_w += size[0] ? size[0] : this._basis_width;
                //total_h += size[1] ? size[1] : this._basis_height; 
                if (total_w > 0 && total_h > 0)
                {
                    var style_size = this._on_getFitSize_style();
                    total_w += style_size[0];
                    total_h += style_size[1];
                }
            }   
            
            return [total_w, total_h];
        };
    
        _pPanel._on_getFluidHorizontalContainerSize = function (contents_max_rect)
        {
            var c_w = 0;
            var c_h = 0;
    
            var minwidth = this._minwidth;
            var maxwidth = this._maxwidth;
            var minheight = this._minheight;
            var maxheight = this._maxheight;
    
            var border = this._getCurrentStyleBorder();
    
            switch (this._p_fittocontents)
            {
                case "width":
                    c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                    c_h = this._adjust_height;
                    break;
                case "height":
                    c_w = this._adjust_width;
                    c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];
                    break;
                case "both":
                    c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                    c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];
                    break;
                case "none":
                default:
                    c_w = this._adjust_width;
                    c_h = this._adjust_height;
                    break;
            }
    
            if (minwidth != null && (c_w < minwidth))
                c_w = (minwidth < 0) ? 0 : minwidth;
            else if (maxwidth != null && (c_w > maxwidth))
                c_w = (maxwidth < 0) ? 0 : maxwidth;
    
            if (minheight != null && (c_h < minheight))
                c_h = (minheight < 0) ? 0 : minheight;
            else if (maxheight != null && (c_h > maxheight))
                c_h = (maxheight < 0) ? 0 : maxheight;
    
            return [c_w, c_h];
        };
        _pPanel._on_getFluidVerticalContainerSize = _pPanel._on_getFluidHorizontalContainerSize;
    
        _pPanel._on_getFluidTableContainerSize = _pPanel._on_getFluidHorizontalContainerSize;
    
        _pPanel._initComponent = function ()
        {
            this._initUniqueID();
            if (!this._is_initLayoutManager)
                this._init();
        };
    
        _pPanel._getForm = function ()
        {
            var _form = this._p_parent;
            for (var i= 0; i < 10; i++)
            {
                if (_form && (!_form._is_form || _form._is_panel))// || (_form instanceof nexacro._InnerForm)))
                    _form = _form._p_parent;
                else
                    break;                
            }   
            return _form;
        };
    
        _pPanel._getRootForm = function ()
        {
            var _form = this._p_parent;
            for (var i = 0; i < 10; i++)
            {
                if (_form && (!_form._is_form || _form._is_panel || (_form instanceof nexacro._InnerForm)))
                    _form = _form._p_parent;
                else
                    break;
            }
            return _form;
        };
    
        _pPanel._removeChildFromContainer = function (obj)
        {
            //Panel을 위한 함수로
            //component를 폼에서 remove시키는것이 아닌 객체는 폼에 존재하고
            //실제 dom, handle만 Panel만 remove 시키는 동작
            if (!obj) return;
            var compid = obj.id;
            if (compid)
            {
                this.getElement().removeChildElement(obj.getElement());             
            }
        };
    
        _pPanel._addChildToContainer = function (obj)
         {
            //Panel을 위한 함수로
            //component를 폼에서 remove시키는것이 아닌 객체는 폼에 존재하고
            //실제 dom, handle만 Panel만 remove 시키는 동작
            if (!obj) return;
            var compid = obj.id;
            if (compid)
            {
                var control_element = this.getElement();
                if (control_element)
                {
                    control_element.appendChildElement(obj.getElement());
                }
            }
         };
    
         _pPanel._setInnerFlexibleFlag = function (is_flexible, is_calc)
         {
             // container 종류에만 설정되어야함
             if (is_flexible != this._is_flexible_container)
             {
                 this._is_flexible_container = is_flexible;;
             }        
             this._is_flexible_container_calculation = is_flexible ? !!is_calc : false;
         };

        _pPanel._resetScrollPos = function (target_comp, left, top, right, bottom, focus_direction)
        {
            var control_elem = this.getElement();
            if (control_elem)
            {
                var parent = this._is_group ? this._group_panel : this._p_parent;
                var _left = this._adjust_left;
                var _top = this._adjust_top;

                left = _left + left;
                top = _top + top;
                right = _left + right;
                bottom = _top + bottom;

                if (parent && parent != this)
                {
                    parent._resetScrollPos(this, left, top, right, bottom, focus_direction);
                }
            }
        };
    
        _pPanel = null;
    }
    
    if (!nexacro.PanelItem)
    {
         //==============================================================================
        // nexacro.PanelItem
        //==============================================================================
        nexacro.PanelItem = function (id, parent)
        {
            nexacro._EventSinkObject.call(this, id, parent);
        };
    
        var _pPanelItem = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.PanelItem);
        nexacro.PanelItem.prototype = _pPanelItem;
        _pPanelItem._type_name = "PanelItem";
    
        // default properties
    
        // status
    
        // event list 
        //===============================================================
        // nexacro.PanelItem : Create
        //===============================================================
        _pPanelItem._destroy = function ()
        {
            var comp = this._getComponent();
            if (comp)
                comp._destroy();
            this._component = null;
            nexacro._EventSinkObject.prototype.destroy.call(this);       
        }
        //===============================================================
        // nexacro.PanelItem : Properties
        //===============================================================
        _pPanelItem.set_componentid = function (componentid)
        {
            //Todo..
            if (this._p_compoentid != componentid)
            {
                this._p_componentid = componentid;
                this.on_apply_componentid(componentid);
            }        
        };
    
        _pPanelItem.on_apply_componentid = function (componentid)
        {
            //todo..
            var panel = this._p_parent;
            if (panel)
            {
                var _form = panel._getForm();           
                if (_form)
                {
                    var comp = _form._p_components[componentid];
                    if (comp)
                        this._component =  comp;// get형식으로 매번가져올지 고민필요함
                }
            }
        };
    
        _pPanelItem._properties = [{ name: "itemid" }, { name: "componentid" }]; 
        nexacro._defineProperties(_pPanelItem, _pPanelItem._properties);
        //===============================================================
        // nexacro.PanelItem : Override
        //===============================================================
        
        //===============================================================
        // nexacro.PanelItem : Logical part
        //===============================================================
        _pPanelItem._getComponent = function (componentid)
        {
            //todo..
            //form에서 찾아올지 매달아 놓을지 결정 필요함
            if (this._component)
                return this._component;
            if (!componentid)
                componentid = this._p_componentid;
            var panel = this._p_parent;
            if (panel)
            {
                var _form = panel._p_parent;
                for (var i= 0; i < 10; i++)
                {
                    if (_form && _form._is_panel)
                        _form = panel._p_parent;
                    else
                        break;                
                }   
                if (_form)
                {
                    var comp = _form._p_components[componentid];
                    if (comp)
                        return (this._component = comp);// get형식으로 매번가져올지 고민필요함
                }
            }
            return null;
        };
    
        _pPanelItem._attachPanel = function (idx)
        {      
            //trace("\n_attachPanel",this.id)  
            var panel = this._p_parent;
            //var type = panel._p_type;
            var _form = panel._getForm();        
            var comp = this._getComponent(this._p_componentid);
            if (!comp) return;
            var prev_panel = comp._group_panel;
            panel._setGroup(comp, true);
            if (!_form) return;
            var control_elem = comp.getElement();
            if (control_elem)
            {  
                var manager = nexacro._getLayoutManager();
                var prev_layouttype = manager.getLayoutType(comp._getForm());
                if (comp._p_visible && prev_layouttype == 0)
                {              
                    comp._initControlElementLayoutProps();
                }            
                //attach
                if (comp._is_alive)
                {                    
                    var panel_control_elem = panel.getElement();
                    if (panel_control_elem)
                    {                    
                        if (!this._is_createcommand)
                        {
                            if (comp._is_group && prev_panel && prev_panel != panel) //추후 수정
                            {
                                prev_panel._removeItem(comp.id);
                                prev_panel._removeChildFromContainer(comp);
                            }
                            else
                                _form._removeChildFromContainer(comp);
                                    
                            if (idx > -1) //insert
                            {
                                var nextcomp = this._getNextComponent(idx + 1, panel);
                                if (nextcomp)
                                {
                                    panel_control_elem.insertChildElement(control_elem, nextcomp.getElement());
                                }
                                else
                                {
                                    panel._addChildToContainer(comp);
                                }                            
                            }
                            else
                            {
                                panel._addChildToContainer(comp);
                            }   
                        }                      
                        control_elem.setParentElement(panel_control_elem);                    
                    }
                }
            }        
        };
    
        _pPanelItem._getNextComponent = function (index, panel)
        {
            if (!panel) panel = this._p_parent;
            var cnt = panel.getItemCount();
            for (var i = index; i < cnt; i++)
            {
                var item = panel._getItembyIndex(i);
                if (item)
                {
                    var comp = item._getComponent();
                    if (comp && comp._group_panel == panel)
                        return comp;
                }
    
            }
            return null;
        };
    
        _pPanelItem._on_apply_itemPosition = function (brecalc)
        {
            //trace("\n_on_apply_itemPosition",this.id)
            if (this._is_createcommand) return;
            var comp = this._getComponent(this._p_componentid);
            if (!comp) return;
            var panel = this._p_parent;
            var control_elem = comp.getElement();
            if (control_elem)
            {
                var manager = nexacro._getLayoutManager();
                var fluidmanager = manager._fluidlayoutmanager;
                //var prev_panel = comp._group_panel;
                var prev_layouttype = manager.getLayoutType(comp._getForm());
                var arrange_type = fluidmanager.getLayoutArrangeType();
                if (comp._p_fittocontents != "both")
                    comp._on_apply_fittocontents();
                if (arrange_type == 0)
                {
                    //control_elem.setElementSize(comp._width, comp._height);
                    comp._initControlElementLayoutProps();
                    if (prev_layouttype == 0 && comp._p_visible) 
                    {                   
                        //comp._setAdjustPosition(0, 0);       
                        control_elem._setElementLayoutPosition();                         
                        //control_elem.clearElementPosition();
                    }
                    if (brecalc !== false)
                       comp._update_position_fluid(false);
                    
                }
                else  //if (arrange_type == 1)
                {   
                    
                    if (brecalc !== false)
                    {
                        comp._update_position_fluid(false);                                           
                        if (prev_layouttype == 0) 
                            manager.calcFluidLayoutContents(panel);
                        else
                            panel._update_position_fluid(false);
                    }                
                }
                
                if (comp._p_enable != panel._real_enable)
                    comp._setEnable(panel._real_enable);
            }
        };
    
        _pPanelItem._on_apply_itemLayoutProperties = function ()
        {
            //trace("\n_on_apply_itemLayoutProperties",this.id)
            var comp = this._getComponent(this._p_componentid);
            if (comp)
            {
                comp._refreshLayoutInfo();
            }
        };
        
        _pPanelItem = null;
    }
     