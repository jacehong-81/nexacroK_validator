//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2014 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro-public-license-readme-1.0.html	
//
//==============================================================================

if (nexacro.ListView)
{
    var _pListViewCellInfo = nexacro.ListViewCellInfo.prototype;

    _pListViewCellInfo._org_getDisplayText = _pListViewCellInfo._getDisplayText;
    _pListViewCellInfo._getDisplayText = function (rowidx)
    {
        if (this._isSubEditorMode && this._isSubEditorMode())
        {
            var text = this.text;
            if (text._bindtype > 0)
            {
                return "";
            }
            else
            {
                return text._value;
            }
        }
        else
        {
            return this._org_getDisplayText(rowidx);
        }
    };

    //==================================================================//
    // cell
    //==================================================================//
    var _pListViewCellControl = nexacro._ListViewCellControl.prototype;

    _pListViewCellControl._is_design = true;
    _pListViewCellControl._org_on_apply_status = _pListViewCellControl._on_apply_status;
    _pListViewCellControl._on_apply_status = function (oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param, applycssstatus, applycssuserstatus)
    {
        if (!this._isPreviewMode() || this.parent instanceof nexacro._ListViewBandControl)
            return this._org_on_apply_status();

        nexacro.Component.prototype._on_apply_status.call(this, oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param, applycssstatus, applycssuserstatus);
    };

    _pListViewCellControl._org_on_create_contents = _pListViewCellControl.on_create_contents;
    _pListViewCellControl.on_create_contents = function ()
    {
        if (this._isPreviewMode())
        {
            // Case : CSSPreView
            this._text_elem = new nexacro.TextBoxElement(this._control_element, "text");
            this._text_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
            this._text_elem.setElementText(this._type_name);
        }
        else if (this._isSubEditorMode())
        {
            // Case : SubEditor
            // subcontents 모드에서 computedlistview의 cell create와 design cell create가 전부 들어옴.
            // design cell create만 computed 적용되도록 함.
            var p = this.parent.parent;
            if (p && p._is_form)
            {
                var target = p["ComputedListView"];
                if (target)
                    this._apply_computedstyle_all(target, p.openerid);
            }

            this._org_on_create_contents();
        }
        else
        {
            // Case : DesignForm
            this._org_on_create_contents();
        }
    };

    _pListViewCellControl._getDisplaytype = function ()
    {
        return this._refinfo.displaytype;
    };

    _pListViewCellControl._apply_computedstyle_all = function (target, openerid)
    {
        var key, prop, func;
        var stylelist = this._computed_prop_list;
        for (key in stylelist)
        {
            prop = stylelist[key];

            if (prop == "cssclass")
                continue;

            func = this["design_set_" + prop];
            if (func)
            {
                func.call(this, target._getCellComputedStyle(openerid, "ComputedCell", prop));
            }
        }
    };

    _pListViewCellControl.move = function (left, top, width, height, right, bottom)
    {
        nexacro.Component.prototype.move.call(this, left, top, width, height, right, bottom);

        // sync info
        this._refinfo._syncPosition(this);
    };

    _pListViewCellControl.show = function ()
    {
        nexacro.Component.prototype.show.call(this);

        // sync info
        this._refinfo._syncPosition(this);
    };

    _pListViewCellControl._apply_normalproperty = function (prop, val)
    {
        var p = this.parent.parent;
        var info = this._refinfo;
        var target = p["ComputedListView"];
        if (target && info)
        {
            var cellid = "Computed" + info._chkExistSubControl(info.displaytype) + "Cell";

            if (!val)
            {
                var stylelist = this._computed_prop_list;
                if (stylelist.indexOf(prop) > -1)
                {
                    // Cell style
                    val = target._getCellComputedStyle(p.openerid, cellid, prop);
                }

                var func = info["set_" + prop];
                if (func)
                    func.call(info, val);

                this._updateAll();
            }

            // Css normalproperty
            var setter = this["set_" + prop];
            if (setter)
                setter.call(this, val);

            // subcontrol style apply
            if (prop == "displaytype")
            {
                var bandidx;

                if (p.openerid == "body")
                    bandidx = 0;
                else if (p.openerid == "detail")
                    bandidx = 1;
                else if (p.openerid == "head")
                    bandidx = -1;

                this._apply_subcontrol_normalproperty(val, bandidx, cellid);
            }
            else if (prop == "left" || prop == "top" || prop == "width" || prop == "height" || prop == "right" || prop == "bottom")
            {
                this._refinfo._syncPosition(this);
            }
        };
    };

    _pListViewCellControl._apply_subcontrol_normalproperty = function (displaytype, bandidx, cellid)
    {
        if (this._subComp)
        {
            var listview = this.parent.parent["ComputedListView"];
            var computedcell = listview._getCurrentCell(0, bandidx, cellid);

            var cs = computedcell._subComp._getComputedStyle();
            this._subComp._setComputedStyle(cs);
        }
    };

    _pListViewCellControl._initDesignDefaultProperty = function ()
    {
        // 로딩된 이후로 새롭게 만든 Component의 경우 이쪽을 탐.
        //traceD("initprop : " + this.parent["ComputedListView"])
    };

    _pListViewCellControl._org_on_created_contents = _pListViewCellControl.on_created_contents;
    _pListViewCellControl.on_created_contents = function (win)
    {
        if (!this._isPreviewMode() || this.parent instanceof nexacro._ListViewBandControl)
            return this._org_on_created_contents(win);

        var text_elem = this._text_elem;
        if (text_elem)
            text_elem.create(win);
    };

    _pListViewCellControl._org_on_destroy_contents = _pListViewCellControl.on_destroy_contents;
    _pListViewCellControl.on_destroy_contents = function ()
    {
        if (!this._isPreviewMode() || this.parent instanceof nexacro._ListViewBandControl)
            return this._org_on_destroy_contents();

        if (this._text_elem)
        {
            this._text_elem.destroy();
            this._text_elem = null;
        }
    };

    _pListViewCellControl._org_on_change_containerRect = _pListViewCellControl.on_change_containerRect;
    _pListViewCellControl.on_change_containerRect = function (width, height)
    {
        if (!this._isPreviewMode() || this.parent instanceof nexacro._ListViewBandControl)
            return this._org_on_change_containerRect(width, height);

        if (this._text_elem)
            this._text_elem.setElementSize(width, height);
    };

    _pListViewCellControl._makeCellInfo = function (id, parent, view, type, idx)
    {
        return new nexacro.ListViewCellInfo(id, parent, view, type, idx);
    };



    //==============================================================================
    // nexacro.ListView : Design
    //==============================================================================

    var _pListView = nexacro.ListView.prototype;

    //==============================================================================
    // nexacro.ListView : Design Contents
    //==============================================================================

    // [상위 Component 처리]
    // Design 시점에 별도로 처리되어야 하는 부분 처리

    // [component.design.contents:create]           // Css 편집화면에서 Preview용 Contents를 설정할때 Override 
    _pListView._onCreateCssDesignContents = function (mode)
    {
        // user sample contents create
    };
    // [component.design.contents:show] 
    _pListView._onShowCssDesignContents = function ()
    {
        // user sample apperance set
    };
    // [component.design.contents:destroy] 
    _pListView._onDestroyCssDesignContents = function ()
    {
        // user sample contents destroy
    };

    _pListView._analyzeKeyMatrix = function () { };  // 디자인시 키액션 분석 불필요.

    _pListView._getCellComputedStyle = function (bandid, cellid, prop)
    {
        var cell = this._getItemChildById(0, bandid, cellid);
        var obj = null;

        if (cell)
            obj = cell._getComputedStyleWithProp(prop);

        return obj;
    };

    _pListView.getComputedStyles = function (args)
    {
        // Make Component : ListView
        var compt_list = new nexacro._ComputedListView("ComputedListView", "0", "0", "0", "0", null, null, null, null, null, null, this.parent);
        compt_list.copyStyleProp(this);
        compt_list.createComponent();

        var properties = this._computed_prop_list;
        var response = {};

        var apply_css = function (bandid, band, bandclass, cellclasses)
        {
            band.set_cssclass(bandclass);

            nexacro._flushCommand(band._getWindow());

            response[bandid] = JSON.parse(nexacro._getComputedStyleProperties(band._control_element, properties, null, true));

            var bandcells_id = bandid + "cells";
            response[bandcells_id] = null;

            var cells = compt_list._getBandCells(band);
            if (cells.length > 0 && cellclasses)
            {
                //////////////////////////////////////////////////////////////
                function get_css_cells(cssclass)
                {
                    var obj = {};
                    for (var i = 0, n = cells.length; i < n; i++)
                    {
                        // set cssclass
                        cells[i].set_cssclass(cssclass);

                        // get computedstyle
                        obj[cells[i]._getDisplaytype()] = cells[i]._getComputedStyle(true);
                    }
                    return obj;
                };
                //////////////////////////////////////////////////////////////

                response[bandcells_id] = { "nocssclass": get_css_cells("") };

                for (var j = 0, n = cellclasses.length; j < n; j++)
                {
                    response[bandcells_id][cellclasses[j]] = get_css_cells(cellclasses[j]);
                }
            }
        };

        var request = JSON.parse(args);
        if (request.hasOwnProperty("head"))
        {
            var headclass = request.head;
            var headcellclass = request.headcell.cssclasses;
            var band = compt_list._getCurrentBand(-1, 0);

            apply_css("head", band, headclass, headcellclass);
        }
        if (request.hasOwnProperty("body"))
        {
            var bodyclass = request.body;
            var bodycellclass = request.bodycell.cssclasses;
            var band = compt_list._getCurrentBand(0, 0);

            apply_css("body", band, bodyclass, bodycellclass);
        }
        if (request.hasOwnProperty("detail"))
        {
            var detailclass = request.detail;
            var detailcellclass = request.detailcell.cssclasses;
            var band = compt_list._getCurrentBand(0, 1);

            apply_css("detail", band, detailclass, detailcellclass);
        }

        compt_list.destroy();

        return JSON.stringify(response);
    };

    //==============================================================================
    // nexacro.ComplexComponent : Design Logic
    //==============================================================================


    nexacro._ComputedListView = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.ListView.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._setUseSelect(false);
    };

    // [object.prototype:create]
    var _pComputedListView = nexacro._createPrototype(nexacro.ListView, nexacro._ComputedListView);
    nexacro._ComputedListView.prototype = _pComputedListView;

    _pComputedListView.createComponent = function (bCreateOnly)
    {
        var _getFormatCellsStr = function ()
        {
            // MakeContextString : computed cell 
            var controls = nexacro.ListViewCellInfo.prototype._use_displaytype_controls;
            var str = "<Cell id=\"ComputedCell\" left=\"0\" top=\"0\" bottom=\"0\" width=\"100%\"/>";
            for (var i = 0, n = controls.length; i < n; i++)
            {
                str += "<Cell id=\"Computed" + controls[i] + "Cell\" left=\"0\" top=\"0\" bottom=\"0\" width=\"100%\" text=\"\" displaytype=\"" + controls[i] + "\"/>";
            }
            return str;
        };

        // Make Component : Dataset
        var obj = new nexacro.DatasetBase("ComputedDataset", this.parent);
        obj._setContents("<ColumnInfo><Column id=\"Column0\" type=\"STRING\" size=\"256\"/></ColumnInfo><Rows><Row>1</Row></Rows>");
        obj.on_created();

        // MakeContextString : computed format
        var contents = "";
        contents += "<Formats><Format id=\"default\">";
        // todo head
        contents += "<Band id=\"body\" width=\"100%\" height=\"24\" expandbartype=\"true\">";
        contents += _getFormatCellsStr();
        contents += "</Band>";
        contents += "<Band id=\"detail\" width=\"100%\" height=\"24\">";
        contents += _getFormatCellsStr();
        contents += "</Band></Format></Formats>";

        nexacro._makePropertyDesignSetter("_pListViewCellControl", nexacro.ListViewCellInfo.prototype._property_map, _pListViewCellControl);

        this.set_binddataset(obj);
        this._setContents(contents);

        nexacro.ListView.prototype.createComponent.call(this, bCreateOnly);
    };

    _pComputedListView.copyStyleProp = function (org_listview)
    {
        var _computed_prop_list = this._computed_prop_list;
        for (var i = 0, n = _computed_prop_list.length; i < n; i++)
        {
            if (this["set_" + _computed_prop_list[i]])
                this["set_" + _computed_prop_list[i]](org_listview[_computed_prop_list[i]]);
        }
    };
    _pListView = null;
    _pListViewCellControl = null;
    _pComputedListView = null;
}