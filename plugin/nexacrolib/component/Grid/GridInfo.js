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

if (!nexacro.GridFormat)
{
    //==============================================================================
    // nexacro.GridFormat
    //==============================================================================
    // Grid's CellInfomation information
    nexacro.GridCellInfo = function (id, band, grid, type, idx, copy_prop_cellinfo)
    {
        this._grid = grid;

        nexacro.CellInfo.call(this, id, band, grid, type, idx, copy_prop_cellinfo);

        this._imgWidthTemp = {};
        this._imgHeightTemp = {};
        this._suppress_infos = [];
        this._virtualmerge_infos = [];

        // autosize용 (expr사용 안할시)
        this._cur1font_size = null;         // autosize시 grid에서 설정
        this._cur1selectfont_size = null;   // autosize시 grid에서 설정
        this._curfont = undefined;          // query시 설정
        this._curselfont = undefined;       // query시 설정
        this._curborder = undefined;        // query시 설정
        this._curpadding = undefined;       // query시 설정

        this._stylecache = {};

        this._is_group_temp = false;
    };

    var _pGridCellInfo = nexacro._createPrototype(nexacro.CellInfo, nexacro.GridCellInfo);
    nexacro.GridCellInfo.prototype = _pGridCellInfo;
    _pGridCellInfo._type_name = "GridCellInfo";

    _pGridCellInfo._addPropertyMap("_pGridCellInfo", [
        ["suppress", null, true, 0, false, 0],
        ["suppressalign", null, false, "first", false, 2, ["last", "middle", "first,over", "middle,over", "last,over"]],
        ["suppressedit", null, false, false, false, 1],
        ["suppresshorzcell", null, false, false, false, 1]
    ], false, _pGridCellInfo);

    _pGridCellInfo._properties = [
        { name: "suppress" },
        { name: "suppressalign" },
        { name: "suppressedit" },
        { name: "suppresshorzcell" }
    ];

    _pGridCellInfo.destroy = function ()
    {
        nexacro.CellInfo.prototype.destroy.call(this);
        this._grid._removeTreeCellinfo(this, true);
        this._grid = null;
        this._imgWidthTemp = null;
        this._imgHeightTemp = null;
        this._suppress_infos = null;
        this._virtualmerge_infos = null;
        this._stylecache = null;
        this._clearCurCache();
    };

    _pGridCellInfo._setStyleCache = function (prop, datarow, selected, odd, status, val)
    {
        if (this.cssclass._bindtype > 0)
            this._stylecache[prop + datarow + selected + status] = val;
        else
            this._stylecache[prop + selected + odd + status] = val;
    };

    _pGridCellInfo._getStyleCache = function (prop, datarow, selected, odd, status)
    {
        if (this.cssclass._bindtype > 0)
            return this._stylecache[prop + datarow + selected + status];
        else
            return this._stylecache[prop + selected + odd + status];
    };

    _pGridCellInfo._changedStyle = function (prop)
    {
        this._stylecache = {};
    };

    _pGridCellInfo._clearStyle = function ()
    {
        this._stylecache = {};
    };

    _pGridCellInfo._clearCurCache = function (fontcache)
    {
        if (fontcache)
            this._curselfont = this._curfont = this._cur1font_size = this._cur1selectfont_size = undefined;
        else
            this._curborder = this._curpadding = undefined;
    };

    _pGridCellInfo._getSuppressInfo = function (disprowidx, make)
    {
        if (disprowidx == undefined)
            return this._suppress_infos;

        if (disprowidx < 0) // head, summ
            disprowidx = 0;

        if (make && !this._suppress_infos[disprowidx])
        {
            var suppress_info = { text_proc: 0, border_proc: 0, horz_border_proc: 0, horz_text_proc: 0, first: false, middle: false, last: true, horzlast: true };
            this._suppress_infos[disprowidx] = suppress_info;
        }
        return this._suppress_infos[disprowidx];
    };

    _pGridCellInfo._clearSuppressInfo = function ()
    {
        this._suppress_infos = [];
    };

    _pGridCellInfo._initVirtualMergeInfo = function ()
    {
        this._virtualmerge_infos = [];
    };

    _pGridCellInfo._setVirtualMergeInfo = function (idx, info)
    {
        this._virtualmerge_infos[idx] = info;
    };

    _pGridCellInfo._getVirtualMergeInfo = function (idx)
    {
        if (!this._hasVirtualMergeInfo())
            return null;

        return this._virtualmerge_infos[idx];
    };

    _pGridCellInfo._hasVirtualMergeInfo = function ()
    {
        if (this._virtualmerge_infos && this._virtualmerge_infos.length > 0)
        {
            return true;
        }

        return false;
    };

    _pGridCellInfo._query_status_align = function (rowidx, displayType, userstatus, bExport)
    {
        return this._grid._getCellStyleInfo(this._cellidx, "align", rowidx, userstatus == "selected", null, null, bExport);
    };

    _pGridCellInfo._query_status_background = function (rowidx, userstatus, bExport)
    {
        return this._grid._getCellStyleInfo(this._cellidx, "background", rowidx, userstatus == "selected", null, null, bExport);
    };


    _pGridCellInfo._getExportCurrentStyleBorder = function (cell)
    {
        var control_elem = cell._control_element;
        if (control_elem)
        {
            var border = control_elem.border ? control_elem.border : control_elem._border_info;
            if (control_elem.borderLeftNone || control_elem.borderRightNone || control_elem.borderTopNone || control_elem.borderBottomNone)
            {
                if (border)
                {
                    var values = [border.top.value, border.right.value, border.bottom.value, border.left.value];

                    // cell._refinfo는 반드시 있어야함
                    if (cell._refinfo._col > 0)
                    {
                        if (control_elem.borderLeftNone)
                            values[3] = "0px solid transparent";
                    }

                    if ((cell._rowidx == -1 && cell._refinfo._row == 0) == false)
                    {
                        if (control_elem.borderTopNone)
                            values[0] = "0px solid transparent";
                    }

                    if (control_elem.borderRightNone)
                        values[1] = "0px solid transparent";
                    if (control_elem.borderBottomNone)
                        values[2] = "0px solid transparent";

                    values = values.join(",");
                    return nexacro.BorderObject(values);
                }
            }
            return border;
        }
        return undefined;
    };

    _pGridCellInfo._query_status_border = function (rowidx, userstatus, bExport)
    {
        var cellinfos = this._grid._getCellinfos(rowidx);
        if (!cellinfos)
        {
            return;
        }

        var cellidx = this._cellidx;
        var cellinfo = cellinfos[cellidx];
        var grididx = this._grid._getGridRow(rowidx);
        var odd = (rowidx >= 0) ? (rowidx % 2) : "";

        var is_change = false;
        var is_cached = true;
        var is_selected = userstatus == "selected";
        var checklist = ["top", "right", "bottom", "left"];

        // create temp cell
        this._grid._createTempCell(this._cellidx, rowidx, null);

        // get temp cell
        var cells = this._grid._getTempCell(cellidx, rowidx, null, null, null, bExport);
        var cell = cells.cell;

        var cell_style = this._getExportCurrentStyleBorder(cell);

        if (this._grid && this._grid._checkVirtualMerge(cellinfo, rowidx) && cell._control_element)
        {
            var vminfo = this._grid._checkVirtualMerge(cellinfo, rowidx);
            var remove = vminfo.remove;
            var remove_r, remove_l, remove_b, remove_t;

            if (remove.indexOf("right") >= 0)
            {
                remove_r = cell._control_element.borderRightNone;
                cell._control_element.borderRightNone = false;
            }
            else if (remove.indexOf("left") >= 0)
            {
                remove_l = cell._control_element.borderLeftNone;
                cell._control_element.borderLeftNone = false;
            }

            if (remove.indexOf("bottom") >= 0)
            {
                remove_b = cell._control_element.borderBottomNone;
                cell._control_element.borderBottomNone = false;
            }
            else if (remove.indexOf("top") >= 0)
            {
                remove_t = cell._control_element.borderTopNone;
                cell._control_element.borderTopNone = false;
            }

            cell_style = cell._getCurrentStyleBorder();

            if (remove_r)
            {
                cell._control_element.borderRightNone = remove_r;
            }
            else if (remove_l)
            {
                cell._control_element.borderLeftNone = remove_l;
            }

            if (remove_b)
            {
                cell._control_element.borderBottomNone = remove_b;
            }
            else if (remove_t)
            {
                cell._control_element.borderTopNone = remove_t;
            }
        }
        // prepare temp cell
        //cell._updateAll();
        cell._changeUserStatus("selected", !!is_selected);

        // get inheritence color
        var color = cell._getCurrentStyleInheritValue("color", "enabled");

        // get cached style & adjust border value
        var cached_style = cellinfo._getStyleCache("border", grididx, is_selected, odd, "");
        if (!cached_style)
        {
            // border color가 명시되지 않은항목에 대해서 inheritance color 넣어줌
            var cell_substyle;
            var cell_substyle_val;
            var change_val = [];
            while (checklist.length)
            {
                var prop = checklist[0];
                if (prop)
                {
                    cell_substyle = cell_style[prop];
                    cell_substyle_val = cell_substyle.value;
                    if (cell_substyle.style == "none")
                    {
                        cell_substyle_val = "0px solid transparent"
                    }
                    else 
                    {
                        if (cell_substyle.color == "")
                        {
                            is_change = true;
                            cell_substyle_val += " " + color;
                        }
                    }
                }
                change_val.push(cell_substyle_val);
                checklist.shift();
            }

            if (is_change)
            {
                cell_style = nexacro.BorderObject(change_val.join(","));
            }

            if (cellinfo._getSuppress(rowidx) > 0)
            {
                is_cached = false;
            }

            // set cached style
            if (is_cached)
            {
                cellinfo._setStyleCache("border", rowidx, is_selected, odd, "", cell_style.value);
            }
        }
        else
        {
            cell_style = nexacro.BorderObject(cached_style);
        }

        return cell_style;
    };

    _pGridCellInfo._query_status_color = function (rowidx, userstatus, bExport)
    {
        return this._grid._getCellStyleInfo(this._cellidx, "color", rowidx, userstatus == "selected", null, null, bExport);
    };

    _pGridCellInfo._query_status_font = function (rowidx, userstatus, bExport)
    {
        return this._grid._getCellStyleInfo(this._cellidx, "font", rowidx, userstatus == "selected", null, null, bExport);
    };

    _pGridCellInfo._query_status_treecontrol = function (rowidx, styleProp, userstatus, bExport)
    {
        var val = "";
        var commonprop;

        if (styleProp == "treecollapseimage")
        {
            val = this._getTreeCollapseImage(rowidx);
            commonprop = "treestatusicon";
        }
        else if (styleProp == "treeexpandimage")
        {
            val = this._getTreeExpandImage(rowidx);
            commonprop = "treestatusicon";
        }
        else if (styleProp == "treeitemimage")
        {
            val = this._getTreeItemImage(rowidx);
            commonprop = "treestatusicon";
        }
        else if (styleProp == "treeopenbuttonimage")
        {
            // todo?
            commonprop = "treebuttonicon";
        }
        else if (styleProp == "treeclosebuttonimage")
        {
            // todo?
            commonprop = "treebuttonicon";
        }

        if (!val && commonprop)
            val = this._grid._getCellStyleInfo(this._cellidx, commonprop, rowidx, userstatus == "selected", null, null, bExport);

        return val;
    };

    _pGridCellInfo._getGroupHeadText = function (groupcolumn)
    {
        var format = this.parent.parent;
        var cells = format._headcells;

        for (var i = 0; i < cells.length; i++)
        {
            var gcol = cells[i]._getAttrValue(cells[i]._p_groupcolumn, -1);

            if (gcol == groupcolumn)
            {
                return cells[i]._getDisplayText(-1);
            }
        }
        return "";
    };

    _pGridCellInfo._getDisplayText_text = function (rowidx)
    {
        var v;
        if (this._getEdittype(rowidx) == "checkbox")
            v = this._grid._getCheck(this._col, rowidx, this._row);
        else
            v = this._getTextValueForDisp(rowidx);

        if (v != null)
        {
            if (typeof v !== 'string')
                v = v.toString();
        }
        v = nexacro._getTextTemplateValue(v);

        return v;
    };

    _pGridCellInfo._findDataset = function (combodataset)
    {
        return this.parent.parent._findDataset(combodataset);
    };

    _pGridCellInfo._afterProcBindTypeProp = function ()
    {
        this._grid._clearBindTypeFlag();
    };

    _pGridCellInfo.set_treecheck = function (v)
    {
        if (v != this._p_treecheck._value)
        {
            this._p_treecheck._set(v);
            this._grid._clearBindTypeFlag();
            this._grid._initTreeStates();

            if (!this._loadingxml)
            {
                if (this._grid._bodyBand)
                    this._grid._bodyBand._recreate_contents();
            }
        }
    };

    _pGridCellInfo.set_treelevel = function (v)
    {
        if (v != this._p_treelevel._value)
        {
            this._p_treelevel._set(v);
            this._grid._clearBindTypeFlag();
            this._grid._initTreeStates();

            if (!this._loadingxml)
            {
                if (this._grid._bodyBand)
                    this._grid._bodyBand._recreate_contents();
            }
        }
    };

    _pGridCellInfo.set_edittype = function (v)
    {
        if (v != this._p_edittype)
        {
            var oldVal = this._p_edittype._value;
            this._p_edittype._set(v);
            this._afterProcBindTypeProp();

            if (this._view && !this._is_group_temp)
            {
                if (oldVal == "checkbox")
                    this._view._destroyChecked(this._col);

                if (v == "checkbox")
                    this._view._createChecked(this._col);
            }
        }
    };

    _pGridCellInfo.set_treestartlevel = function (v)
    {
        if (v != this._p_treestartlevel._value)
        {
            this._p_treestartlevel._set_intval(v);
            this._grid._clearBindTypeFlag();
            this._grid._rootlevel = Math.max(this._p_treestartlevel._value, this._grid._rootlevel);

            if (!this._loadingxml)
            {
                if (this._grid._bodyBand)
                    this._grid._bodyBand._recreate_contents();
            }
        }
    };

    _pGridCellInfo.set_treestate = function (v)
    {
        if (v != this._p_treestate._value)
            this._p_treestate._set(v);

        this._grid._clearBindTypeFlag();
        this._grid._initTreeStates();

        var rowidx = this._grid._getDataRow(this._grid.currentrow);

        if (!this._loadingxml)
        {
            if (this._getEdittype(rowidx) == "tree" || this._getEdittype(rowidx) == "rowgroup")
            {
                if (this._grid._bodyBand)
                    this._grid._bodyBand._recreate_contents();
            }
            else
            {
                this._grid._refreshBody();
            }
        }
    };

    _pGridCellInfo._getGroupCount = function ()
    {
        return this._grid._groupcount;
    };

    _pGridCellInfo._isGroupColumnFirstSubSumCell = function (rowidx)
    {
        var dataset = this._grid._binddataset;
        if (dataset)
        {
            var grid = this._grid;
            var format = this.parent.parent;
            var rowtype = dataset.getRowType(rowidx);

            if (format._group_info && (this._groupcol >= 0 && rowtype == 16) && this._col >= grid._getGroupsStartCol())
            {
                var treeinfo = this._grid._treeCellinfo;
                if (treeinfo && treeinfo._groupcol >= 0 && treeinfo._getDisplaytype(rowidx) == "rowgroupcontrol")
                {
                    var lvl = this._grid._treeCellinfo._getGroupRowLevel(rowidx, true);
                    var posi = (grid._getGroupsStartCol() + lvl);

                    if (this._col == posi)
                        return true;
                }
            }
        }
        return false;
    };

    _pGridCellInfo._checkGroupCellStyle = function (return_info, rowidx)
    {
        if (rowidx < 0)
            return 0;

        var dataset = this._grid._binddataset;
        if (dataset)
        {
            var grid = this._grid;
            var format = this.parent.parent;
            var rowtype = dataset.getRowType(rowidx);

            if (format._group_info && (this._groupcol >= 0 ||
                (rowtype == 32) && ((grid._groupcount > 0) ? (this._col >= grid._getGroupsStartCol()) : true)))
            {
                var treeinfo = this._grid._treeCellinfo;
                if (treeinfo && treeinfo._groupcol >= 0 && treeinfo._getDisplaytype(rowidx) == "rowgroupcontrol")
                {
                    var lvl = this._grid._treeCellinfo._getGroupRowLevel(rowidx, rowtype == 16);
                    var posi = (grid._getGroupsStartCol() + lvl);

                    if (return_info)
                    {
                        if (this._col == posi)
                            return_info._is_startarea = true;   // body format row length가 2이상 일때 활용.
                    }

                    if (this._row == treeinfo._row)
                    {
                        if (return_info)
                        {
                            if (this._col == posi)
                                return_info.is_start = true;
                            else if (this._col < posi)
                                return_info.is_before = true;
                            else if (this._col > posi)
                                return_info.is_after = true;
                        }
                    }

                    return 3;   // rowgroupcontrol을 사용하는 groupcolumn, groupheader
                }
                return 2;   // rowgroupcontrol을 사용하지 않는 & groupcolumn, groupheader
            }
            else if (!format._group_info && rowtype == 32) // group template column을 사용하지 않는 groupheader
            {
                return 1;
            }
        }
        return 0;   // not
    };

    _pGridCellInfo._getTooltipText = function (rowidx)
    {
        var text = this._getAttrValue(this._p_tooltiptext, rowidx);
        if (text === null || text === undefined)
        {
            text = this.parent._getTooltipText(rowidx);
        }
        return text;
    };

    _pGridCellInfo._getSuppress = function (rowidx)
    {
        var supp = this._getAttrValue(this._p_suppress, rowidx);

        if (supp > 0 && this._grid._groupcount > 0 && this._groupcol < 0)
            supp += this._grid._groupcount;

        return supp;
    };

    nexacro._defineProperties(_pGridCellInfo, _pGridCellInfo._properties);

    _pGridCellInfo = null;

    // ==============================================================================
    // Grid's BandInfomation information
    // ==============================================================================
    nexacro.GridBandInfo = function (id, type, parent, grid)
    {
        this.id = this.name = id;
        this.parent = parent;

        var _property_map = this._property_map;

        var prop, bind, deft;
        for (var i = 0; i < _property_map.length; i++)
        {
            prop = _property_map[i][0];
            bind = _property_map[i][1];
            deft = _property_map[i][2];

            if (bind)
                this["_p_" + prop] = new nexacro.BindableValue(deft);
            else
                this["_p_" + prop] = deft;
        }

        this._type = type;
        this._grid = grid;
        this._bandctrl = null;
        this._noborder = false;
    };
    var _pGridBandInfo = nexacro._createPrototype(nexacro.Object, nexacro.GridBandInfo);
    nexacro.GridBandInfo.prototype = _pGridBandInfo;
    _pGridBandInfo._type_name = "GridBandInfo";

    _pGridBandInfo._property_map = [    // propname, bindexpr, defaultval, style
        ["cssclass", true, "", true],
        ["tooltiptext", true, undefined, false],
        ["tooltiptype", false, "default", false],

        // accessibility
        ["accessibilityaction", false, null, false],
        ["accessibilitydesclevel", false, "all", false],
        ["accessibilitydescription", false, null, false],
        ["accessibilityenable", false, true, false],
        ["accessibilitylabel", false, null, false],
        ["accessibilityrole", false, "none", false],

        // normal style
        ["color", false, null, true],
        ["font", false, null, true],
        ["wordSpacing", false, null, true],
        ["letterSpacing", false, null, true],
        ["textDecoration", false, null, true],
        ["wordWrap", true, "none", true],
        ["borderRadius", false, null, true],
        ["border", false, null, true],
        ["background", false, null, true],
        ["edge", false, null, true],
        ["cursor", false, null, true],
        ["opacity", false, null, true],
        ["boxShadow", false, null, true],
        ["margin", false, null, true],
        ["padding", false, null, true],
        ["textAlign", false, null, true],
        ["verticalAlign", false, null, true]
    ];

    nexacro._makeBandInfoProperties = function (ptype_val, _property_map)
    {
        ptype_val._properties = [];

        for (var i = 0; i < _property_map.length; i++)
        {
            var prop = _property_map[i][0]
            var item = { name: prop };

            ptype_val._properties[i] = item;
        }
    };

    nexacro._makeBandInfoProperties(_pGridBandInfo, _pGridBandInfo._property_map);

    _pGridBandInfo.destroy = function ()
    {
        this.parent = null;
        this._grid = null;
        this._bandctrl = null;

        var _property_map = this._property_map;
        var prop;

        for (var i = 0; i < _property_map.length; i++)
        {
            prop = _property_map[i][0];
            this["_p_" + prop] = null;
        }
        this._property_map = null;
    };

    _pGridBandInfo.set_accessibilityaction = function (val)
    {
        this._p_accessibilityaction = val;
    };

    _pGridBandInfo.set_accessibilitydesclevel = function (val)
    {
        this._p_accessibilitydesclevel = val;
    };

    _pGridBandInfo.set_accessibilitydescription = function (val)
    {
        this._p_accessibilitydescription = val;
    };

    _pGridBandInfo.set_accessibilityenable = function (val)
    {
        this._p_accessibilityenable = val;
    };

    _pGridBandInfo.set_accessibilitylabel = function (val)
    {
        this._p_accessibilitylabel = val;
    };

    _pGridBandInfo.set_accessibilityrole = function (val)
    {
        this._p_accessibilityrole = val;
    };

    _pGridBandInfo.set_background = function (val)
    {
        this._p_background = val;
        if (this._bandctrl)
            this._bandctrl.set_background(val);
    };

    _pGridBandInfo.set_color = function (val)
    {
        this._p_color = val;

        if (this._bandctrl)
            this._bandctrl.set_color(val);
    };

    _pGridBandInfo.set_font = function (val)
    {
        this._p_font = val;

        if (this._bandctrl)
            this._bandctrl.set_font(val);
    };

    _pGridBandInfo.set_wordSpacing = function (val)
    {
        this._p_wordSpacing = val;

        if (this._bandctrl)
            this._bandctrl.set_wordSpacing(val);
    };

    _pGridBandInfo.set_letterSpacing = function (val)
    {
        this._p_letterSpacing = val;

        if (this._bandctrl)
            this._bandctrl.set_letterSpacing(val);
    };

    _pGridBandInfo.set_textDecoration = function (val)
    {
        this._p_textDecoration = val;

        if (this._bandctrl)
            this._bandctrl.set_textDecoration(val);
    };

    _pGridBandInfo.set_wordWrap = function (val)
    {
        this._p_wordWrap._set(val);

        if (this._bandctrl)
            this._bandctrl.set_wordWrap(val);
    };

    _pGridBandInfo.set_borderRadius = function (val)
    {
        this._p_borderRadius = val;

        if (this._bandctrl)
            this._bandctrl.set_borderRadius(val);
    };

    _pGridBandInfo.set_edge = function (val)
    {
        this._p_edge = val;

        if (this._bandctrl)
            this._bandctrl.set_edge(val);
    };

    _pGridBandInfo.set_border = function (val)
    {
        this._p_border = val;

        if (this._bandctrl)
            this._bandctrl.set_border(val);
    };

    _pGridBandInfo.set_opacity = function (val)
    {
        this._p_opacity = val;

        if (this._bandctrl)
            this._bandctrl.set_opacity(val);
    };

    _pGridBandInfo.set_cursor = function (val)
    {
        this._p_cursor = val;

        if (this._bandctrl)
            this._bandctrl.set_cursor(val);
    };

    _pGridBandInfo.set_boxShadow = function (val)
    {
        this._p_boxShadow = val;

        if (this._bandctrl)
            this._bandctrl.set_boxShadow(val);
    };

    _pGridBandInfo.set_margin = function (val)
    {
        this._p_margin = val;

        if (this._bandctrl)
            this._bandctrl.set_margin(val);
    };

    _pGridBandInfo.set_padding = function (val)
    {
        this._p_padding = val;

        if (this._bandctrl)
            this._bandctrl.set_padding(val);
    };

    _pGridBandInfo.set_textAlign = function (val)
    {
        this._p_textAlign = val;

        if (this._bandctrl)
            this._bandctrl.set_textAlign(val);
    };

    _pGridBandInfo.set_verticalAlign = function (val)
    {
        this._p_verticalAlign = val;

        if (this._bandctrl)
            this._bandctrl.set_verticalAlign(val);
    };

    _pGridBandInfo._set_backgroundimage = function (background, v)
    {
        v = v.toString();
        if (v.length >= 5)
        {
            if (v.substring(0, 3).toLowerCase() == "url")
            {
                var str = v.substr(4, 1);
                if (str == '\'' || str == '\"')
                {
                    v = v.substring(5, v.length - 2);
                }
                else
                {
                    v = v.substring(4, v.length - 1);
                }
            }
            else if (v.substring(0, 5).toLowerCase() != "theme")
            {

                var format = nexacro._transImageBase64StringFormat(v);
                if (format)
                {
                    v = format.alldata;
                }

            }
        }

        if (v != background.image)
        {
            background.set_image(v);
        }
        return background;
    };

    _pGridBandInfo.set_id = function (v) { };

    _pGridBandInfo.set_cssclass = function (v)
    {
        if (v != this._p_cssclass._value)
        {
            this._p_cssclass._set(v);

            if (this._bandctrl)
            {
                this._bandctrl.set_cssclass(v);
                this._grid._clearBindTypeFlag();
            }
        }
    };

    _pGridBandInfo.set_tooltiptype = function (v)
    {
        // TODO : Object로

        if (v != this._p_tooltiptype)
        {
            this._p_tooltiptype = v;
            this._grid._clearBindTypeFlag();
        }
    };

    _pGridBandInfo.set_tooltiptext = function (v)
    {
        if (v != this._p_tooltiptext._value)
        {
            this._p_tooltiptext._set(v);
            this._grid._clearBindTypeFlag();

            if (this._bandctrl)
                this._bandctrl.on_apply_prop_tooltip();
        }
    };

    _pGridBandInfo._getTooltipText = function (rowidx)
    {
        var text = this._getAttrValue(this._p_tooltiptext, rowidx);
        if (text === null || text === undefined)
        {
            text = this._grid._p_tooltiptext;
        }
        return text;
    };

    _pGridBandInfo._getAttrValue = function (attr, rowidx, cellinfo)
    {
        if (attr == undefined)
            return undefined;

        if (attr._bindtype == undefined)
        {
            return attr;
        }
        else if (attr._bindtype == 0)
        {
            return attr._value;
        }
        else
        {
            var grid = this._grid;
            var dataset = grid._binddataset;

            if (dataset == null)
                return undefined;

            if (attr._bindtype == 1)
            {
                return dataset.getColumn(rowidx, attr._bindexpr);
            }
            else
            {
                var bindexpr = attr._bindexpr;
                var val = attr._value;
                var s = val.toLowerCase().indexOf("bind:");
                if (s >= 0)
                {
                    bindexpr = bindexpr.substring(s, bindexpr.length);
                    bindexpr = dataset.getColumn(rowidx, bindexpr);
                }

                var exprfn = grid._exprcache[bindexpr];

                if (exprfn == null)
                {
                    exprfn = dataset._createExprFunc(bindexpr);
                    grid._exprcache[bindexpr] = exprfn;
                }
                if ((typeof exprfn) == "function")
                {
                    if (cellinfo)
                    {
                        cellinfo.col = cellinfo._col;
                        cellinfo.row = cellinfo._row;
                        return exprfn.call(cellinfo, rowidx, rowidx, grid, dataset, dataset._viewRecords, dataset._viewRecords[rowidx], []);
                    }
                    else
                    {
                        return exprfn.call(this, rowidx, rowidx, grid, dataset, dataset._viewRecords, dataset._viewRecords[rowidx], []);
                    }

                }
            }
        }

        return undefined;
    };

    _pGridBandInfo._setAttrValue = function (attr, rowidx, v)
    {
        if (attr._bindtype == 1)
        {
            var grid = this._grid;
            var dataset = grid._binddataset;
            if (dataset)
            {
                dataset.setColumn(rowidx, attr._bindexpr, v);
            }
        }
    };

    nexacro._defineProperties(_pGridBandInfo, _pGridBandInfo._properties);

    _pGridBandInfo = null;

    //==============================================================================
    // nexacro.GridFormat 
    //==============================================================================
    // Grid's Format information
    nexacro.GridFormat = function (id, grid)
    {
        this.id = id;
        this._grid = this.parent = grid;
        this._cols = [];

        this._headrows = null;
        this._bodyrows = null;
        this._summrows = null;

        this._headband = null;
        this._summband = null;
        this._bodyband = null;

        this._headcells = null;
        this._summcells = null;
        this._bodycells = null;

        this.leftWidth = 0;
        this.rightWidth = 0;
        this.bodyWidth = 0;

        this._orgleftWidth = 0;
        this._orgrightWidth = 0;
        this._orgbodyWidth = 0;

        this.endbodycol = 0;
        this.startrightcol = -1;

        this.headHeight = 0;
        this.summHeight = 0;
        this.bodyHeight = 0;

        //  this._formatElem = null;
        //  this._formatElemOrg = null;
        this._innerdatasets = {};
        this._innerdatasets_name = [];

        this._group_info = null;
    };

    var _pGridFormat = nexacro._createPrototype(nexacro.Object, nexacro.GridFormat);
    nexacro.GridFormat.prototype = _pGridFormat;

    _pGridFormat._type_name = "GridFormat";

    _pGridFormat._findDataset = function (id)
    {
        if (this._innerdatasets[id])
        {
            if (this._innerdatasets[id].parent != null)
            {
                return this._innerdatasets[id];
            }
            else
            {
                this._innerdatasets[id] = null;

                for (var i = 0; i < this._innerdatasets_name.length; i++)
                {
                    var name = this._innerdatasets_name[i];
                    if (name == id)
                    {
                        this._innerdatasets_name.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        var ds = this._grid._findDataset(id);
        if (ds)
        {
            ds._setEventHandler("onvaluechanged", this._on_updateInnerDs, this);
            ds._setEventHandler("onrowsetchanged", this._on_updateInnerDs, this);
            ds._setEventHandler("onrowsetchanged", this._on_updateInnerDs, this);
            this._innerdatasets[id] = ds;
            this._innerdatasets_name.push(id);
        }
        return ds;
    };

    _pGridFormat._on_updateInnerDs = function (obj, e)
    {
        if (this._grid)
            this._grid._on_useInnerDsCells(obj, e);
    };

    _pGridFormat.destroy = function ()
    {
        if (this._headband)
        {
            this._headband.destroy();
            this._headband = null;
        }

        if (this._summband)
        {
            this._summband.destroy();
            this._summband = null;
        }

        if (this._bodyband)
        {
            this._bodyband.destroy();
            this._bodyband = null;
        }

        var cells, len, i;

        if (this._headcells)
        {
            cells = this._headcells;
            len = cells.length;

            for (i = 0; i < len; i++)
                cells[i].destroy();

            this._headcells = null;
        }

        if (this._summcells)
        {
            cells = this._summcells;
            len = cells.length;

            for (i = 0; i < len; i++)
                cells[i].destroy();

            this._summcells = null;
        }

        if (this._bodycells)
        {
            cells = this._bodycells;
            len = cells.length;

            for (i = 0; i < len; i++)
                cells[i].destroy();

            this._bodycells = null;
        }
        this._headrows = null;
        this._bodyrows = null;
        this._summrows = null;
        //  this._formatElem = null;
        //  this._formatElemOrg = null;
        this._cols = null;
        this._grid = null;
        this.parent = null;

        for (i = 0; i < this._innerdatasets_name.length; i++)
        {
            var name = this._innerdatasets_name[i];
            var inds = this._innerdatasets[name];

            inds._removeEventHandler("onvaluechanged", this._on_updateInnerDs, this);
            inds._removeEventHandler("onrowsetchanged", this._on_updateInnerDs, this);
            inds._removeEventHandler("onrowsetchanged", this._on_updateInnerDs, this);
            this._innerdatasets[name] = null;
        }

        this._innerdatasets_name = null;
        this._innerdatasets = null;
        this._group_info = null;
    };

    _pGridFormat._resetOrgColSize = function (is_keep_area, autofitcol_rate, client_width)
    {
        var leftwidth, bodywidth, rightwidth;

        if (this._cols)
        {
            var _cols = this._cols;
            var _colsLen = this._cols.length;
            var i;

            leftwidth = bodywidth = rightwidth = 0;

            if (!autofitcol_rate.length)
            {
                for (i = 0; i < _colsLen; i++)
                {
                    _cols[i].size = _cols[i].orgsize;
                    _cols[i].left = _cols[i].orgleft;
                    _cols[i].right = _cols[i].orgright;
                    _cols[i].tempsize = undefined;

                    if (_cols[i]._area == "left")
                        leftwidth += _cols[i].getSize();
                    else if (_cols[i]._area == "right")
                        rightwidth += _cols[i].getSize();
                    else
                        bodywidth += _cols[i].getSize();
                }
            }
            else
            {
                var left = 0;
                for (i = 0; i < _colsLen; i++)
                {
                    _cols[i].tempsize = undefined;

                    if (_cols[i]._area == "left")
                    {
                        leftwidth += _cols[i].getSize();
                        continue;
                    }
                    else if (_cols[i]._area == "right")
                    {
                        rightwidth += _cols[i].getSize();
                        continue;
                    }

                    if (_cols[i].visible)
                        _cols[i].size = Math.round(autofitcol_rate[i] * client_width);

                    _cols[i].left = left;
                    _cols[i].right = left + _cols[i].getSize();
                    left = _cols[i].right;
                    bodywidth += _cols[i].getSize();
                }
            }
        }

        if (is_keep_area)
        {
            this.leftWidth = leftwidth;
            this.rightWidth = rightwidth;
            this._bodyWidth = this.bodyWidth = bodywidth;
        }
        else
        {
            this.leftWidth = this._orgleftWidth;
            this.rightWidth = this._orgrightWidth;
            this._bodyWidth = this.bodyWidth = this._orgbodyWidth;
        }
    };

    _pGridFormat._rearrangeCols = function ()
    {
        var cols = this._cols;
        var cols_len = cols.length;

        for (var i = 0; i < cols_len; i++)
            cols[i].orgidx = i;
    };

    _pGridFormat.__getColSize = function ()
    {
        if (!this.visible && this.groupcol < 0)
            return 0;

        return this.size;
    };

    _pGridFormat._addLeftColumn = function (size, groupcol, visible)
    {
        visible = (visible == null) ? true : visible;

        var width = this.leftWidth + (visible ? size : 0);
        var orgwidth = this._orgleftWidth + (visible ? size : 0);
        var col = {
            size: size, left: this.leftWidth, right: width, _area: "left", orgsize: size, orgleft: this._orgleftWidth, orgright: orgwidth, groupcol: groupcol, visible: visible,
            getSize: this.__getColSize
        };
        var leftcnt = this._getColFixCnt("left");

        col.groupcol = (col.groupcol == undefined) ? -1 : col.groupcol;
        this._cols.splice(leftcnt, 0, col);
        this.leftWidth = width;
        this._orgleftWidth = orgwidth;
        return col;
    };

    _pGridFormat._addRightColumn = function (size, groupcol, visible)
    {
        visible = (visible == null) ? true : visible;

        var width = this.rightWidth + (visible ? size : 0);
        var orgwidth = this._orgrightWidth + (visible ? size : 0);
        var col = {
            size: size, left: this.rightWidth, right: width, _area: "right", orgsize: size, orgleft: this._orgrightWidth, orgright: orgwidth, groupcol: groupcol, visible: visible,
            getSize: this.__getColSize
        };

        col.groupcol = (col.groupcol == undefined) ? -1 : col.groupcol;
        this._cols.push(col);
        this.rightWidth = width;
        this._orgrightWidth = orgwidth;
        return col;
    };

    _pGridFormat._addBodyColumn = function (size, groupcol, visible)
    {
        visible = (visible == null) ? true : visible;

        var width = this.bodyWidth + (visible ? size : 0);
        var orgwidth = this._orgbodyWidth + (visible ? size : 0);
        var col = {
            size: size, left: this.bodyWidth, right: width, _area: "body", orgsize: size, orgleft: this._orgbodyWidth, orgright: orgwidth, groupcol: groupcol, visible: visible,
            getSize: this.__getColSize
        };

        col.groupcol = (col.groupcol == undefined) ? -1 : col.groupcol;
        var leftcnt = this._getColFixCnt("left");
        var bodycnt = this._getColFixCnt("body");

        this._cols.splice(leftcnt + bodycnt, 0, col);
        this.endbodycol = this._cols.length;
        this._bodyWidth = this.bodyWidth = width;
        this._orgbodyWidth = orgwidth;
        return col;
    };

    _pGridFormat._insertLeftColumn = function (size, addidx, groupcol, visible)
    {
        visible = (visible == null) ? true : visible;

        // var width = this.leftWidth + size;
        // var orgwidth = this._orgleftWidth + size;

        if (addidx >= this._cols.length)
            return this._addLeftColumn(size, groupcol);

        var pcol = this._cols[addidx];
        var left = 0;
        var orgleft = 0;

        if (pcol)
        {
            left = pcol.left;
            orgleft = pcol.orgleft;
        }
        var right = left + (visible ? size : 0);
        var orgright = orgleft + (visible ? size : 0);

        var col = {
            size: size, left: left, right: right, _area: "left", orgsize: size, orgleft: orgleft, orgright: orgright, groupcol: groupcol, visible: visible,
            getSize: this.__getColSize
        };

        col.groupcol = (col.groupcol == undefined) ? -1 : col.groupcol;
        this._cols.splice(addidx, 0, col);

        this._adjustFormatColOrgSize();
        this._adjustFormatColSize();

        return col;
    };

    _pGridFormat._insertRightColumn = function (size, addidx, groupcol, visible)
    {
        visible = (visible == null) ? true : visible;

        // var width = this.rightWidth + size;
        // var orgwidth = this._orgrightWidth + size;

        if (addidx >= this._cols.length)
            return this._addRightColumn(size, groupcol);

        var pcol = this._cols[addidx];
        var left = 0;
        var orgleft = 0;

        if (pcol)
        {
            left = pcol.left;
            orgleft = pcol.orgleft;
        }
        var right = left + (visible ? size : 0);
        var orgright = orgleft + (visible ? size : 0);

        var col = {
            size: size, left: left, right: right, _area: "right", orgsize: size, orgleft: orgleft, orgright: orgright, groupcol: groupcol, visible: visible,
            getSize: this.__getColSize
        };

        col.groupcol = (col.groupcol == undefined) ? -1 : col.groupcol;
        this._cols.splice(addidx, 0, col);

        this._adjustFormatColOrgSize();
        this._adjustFormatColSize();

        return col;
    };

    _pGridFormat._insertBodyColumn = function (size, addidx, groupcol, visible)
    {
        visible = (visible == null) ? true : visible;

        // var width = this.bodyWidth + size;
        // var orgwidth = this._orgbodyWidth + size;

        if (addidx >= this._cols.length)
            return this._addBodyColumn(size, groupcol);

        var pcol = this._cols[addidx];
        var left = 0;
        var orgleft = 0;

        if (pcol)
        {
            left = pcol.left;
            orgleft = pcol.orgleft;
        }
        var right = left + (visible ? size : 0);
        var orgright = orgleft + (visible ? size : 0);

        var col = {
            size: size, left: left, right: right, _area: "body", orgsize: size, orgleft: orgleft, orgright: orgright, groupcol: groupcol, visible: visible,
            getSize: this.__getColSize
        };

        col.groupcol = (col.groupcol == undefined) ? -1 : col.groupcol;
        this._cols.splice(addidx, 0, col);

        this.endbodycol = this._cols.length;

        this._adjustFormatColOrgSize();
        this._adjustFormatColSize();

        return col;
    };

    _pGridFormat._moveColumn = function (fromcol, tocol, fromcolspan, tocolspan, cellmovingtype)
    {
        var from_col_info = this._cols[fromcol];
        // var from_area = from_col_info._area;
        var from_left = from_col_info.left;
        var from_right = from_col_info.right;

        if (!from_col_info || fromcol == tocol)
        {
            return false;
        }

        if (fromcol < tocol)
        {
            tocol += (tocolspan - 1);
        }

        var to_col_info = this._cols[tocol];

        switch (cellmovingtype)
        {
            case "col":
                break;
            case "col,band":
                if (from_col_info._area != to_col_info._area)
                    return false;
                break;
            case "col,merge":
            case "col,line":
            default:
                return false;
        }

        from_col_info._area = to_col_info._area;

        this._cols.splice(fromcol, 1);
        this._cols.splice(tocol, 0, from_col_info);

        var i;

        if (fromcol > tocol)
        {
            for (i = tocol; i < fromcol; i++)
            {
                this._cols[i].left = this._cols[i].orgleft = this._cols[i + 1].left;
                this._cols[i].right = this._cols[i].orgright = this._cols[i + 1].right;
            }
        }
        else
        {
            for (i = tocol; i > fromcol; i--)
            {
                this._cols[i].left = this._cols[i].orgleft = this._cols[i - 1].left;
                this._cols[i].right = this._cols[i].orgright = this._cols[i - 1].right;
            }
        }

        this._cols[fromcol].left = this._cols[fromcol].orgleft = from_left;
        this._cols[fromcol].right = this._cols[fromcol].orgright = from_right;

        this._adjustFormatColSize();

        this._moveContentsCol("body", this._bodycells, fromcol, tocol);
        this._moveContentsCol("head", this._headcells, fromcol, tocol);
        this._moveContentsCol("summ", this._summcells, fromcol, tocol);
        this._bodycells = this._reIndexCells(this._bodycells, this._bodyrows);
        this._headcells = this._reIndexCells(this._headcells, this._headrows);
        this._summcells = this._reIndexCells(this._summcells, this._summrows);
        this._updateFormatStr();

        return true;
    };

    _pGridFormat._addHeadRow = function (size)
    {
        if (this._headrows == null)
            this._headrows = [];
        var height = this.headHeight + size;
        var row = { size: size, top: this.headHeight, bottom: height, _area: "head", orgsize: size, orgtop: this.headHeight, orgbottom: height };
        this._headrows.push(row);
        this.headHeight = height;
        return row;
    };

    _pGridFormat._addSummRow = function (size)
    {
        if (this._summrows == null)
            this._summrows = [];
        var height = this.summHeight + size;
        var row = { size: size, top: this.summHeight, bottom: height, _area: "summ", orgsize: size, orgtop: this.summHeight, orgbottom: height };
        this._summrows.push(row);
        this.summHeight = height;
        return row;
    };

    _pGridFormat._addBodyRow = function (size)
    {
        if (this._bodyrows == null)
            this._bodyrows = [];
        var height = this.bodyHeight + size;
        var row = { size: size, top: this.bodyHeight, bottom: height, _area: "body", orgsize: size, orgtop: this.bodyHeight, orgbottom: height };
        this._bodyrows.push(row);
        this._body_height = this.bodyHeight = height;
        return row;
    };

    _pGridFormat._insertHeadRow = function (addidx, size)
    {
        var row = { size: size, top: 0, bottom: size, _area: "head", orgsize: size, orgtop: 0, orgbottom: size };

        if (this._headrows == null || this._headrows.length == 0)
        {
            this._headrows = [];
            this._headrows.push(row);
        }
        else
        {
            if (addidx > 0)
            {
                if (this._headrows.length < addidx)
                    addidx = this._headrows.length;

                row.top = this._headrows[addidx - 1].bottom;
                row.bottom = row.top + size;
            }
            this._headrows.splice(addidx, 0, row);
        }
        this.headHeight += size;
        this._adjustFormatRowSize(this._headrows);
        return row;
    };

    _pGridFormat._insertSummRow = function (addidx, size)
    {
        var row = { size: size, top: 0, bottom: size, _area: "summ", orgsize: size, orgtop: 0, orgbottom: size };

        if (this._summrows == null || this._summrows.length == 0)
        {
            this._summrows = [];
            this._summrows.push(row);
        }
        else
        {
            if (addidx > 0)
            {
                if (this._summrows.length < addidx)
                    addidx = this._summrows.length;

                row.top = this._summrows[addidx - 1].bottom;
                row.bottom = row.top + size;
            }
            this._summrows.splice(addidx, 0, row);
        }
        this.summHeight += size;
        this._adjustFormatRowSize(this._summrows);
        return row;
    };

    _pGridFormat._insertBodyRow = function (addidx, size)
    {
        var row = { size: size, top: 0, bottom: size, _area: "body", orgsize: size, orgtop: 0, orgbottom: size };

        if (this._bodyrows == null || this._bodyrows.length == 0)
        {
            this._bodyrows = [];
            this._bodyrows.push(row);
        }
        else
        {
            if (addidx > 0)
            {
                if (this._bodyrows.length < addidx)
                    addidx = this._bodyrows.length;

                row.top = this._bodyrows[addidx - 1].bottom;
                row.bottom = row.top + size;
            }
            else
            {
                addidx = 0;
            }
            this._bodyrows.splice(addidx, 0, row);
        }
        this.bodyHeight += size;
        this._body_height = this.bodyHeight;
        this._adjustFormatRowSize(this._bodyrows);
        return row;
    };

    _pGridFormat._addHeadCell = function (cell)
    {
        if (this._headcells == null)
            this._headcells = [];

        return this._addCell(this._headcells, cell);
    };

    _pGridFormat._addSummCell = function (cell)
    {
        if (this._summcells == null)
            this._summcells = [];

        return this._addCell(this._summcells, cell);
    };

    _pGridFormat._addBodyCell = function (cell)
    {
        if (this._bodycells == null)
            this._bodycells = [];

        return this._addCell(this._bodycells, cell);
    };

    _pGridFormat._addCell = function (cells, cell)
    {
        var scol = this._cols[cell._col];
        if (scol)
        {
            cell._area = scol._area;
            cells.push(cell);
            return cell;
        }
        return undefined;
    };

    _pGridFormat._insertHeadCell = function (cell, addidx, rowidx)
    {
        if (this._headcells == null)
            this._headcells = [];

        return this._insertCell(this._headcells, cell, addidx, rowidx);
    };

    _pGridFormat._insertSummCell = function (cell, addidx, rowidx)
    {
        if (this._summcells == null)
            this._summcells = [];

        return this._insertCell(this._summcells, cell, addidx, rowidx);
    };

    _pGridFormat._insertBodyCell = function (cell, addidx, rowidx)
    {
        if (this._bodycells == null)
            this._bodycells = [];

        return this._insertCell(this._bodycells, cell, addidx, rowidx);
    };

    _pGridFormat._insertCell = function (cells, cell, addidx, rowidx)
    {
        var scol = this._cols[cell._col];
        if (scol)
        {
            var cellsLen = cells.length;
            var cellinfo;
            var add;

            for (var i = 0; i < cellsLen; i++)
            {
                cellinfo = cells[i];
                if (add == undefined && cellinfo._col >= addidx && cellinfo._row >= rowidx)
                    add = i;

                if (cellinfo._col >= addidx && cellinfo._row == rowidx)
                {
                    cellinfo._col++;
                }
            }

            if (add == undefined)
                add = cellsLen;

            cell._area = scol._area;
            cells.splice(add, 0, cell);
            return cell;
        }
        return undefined;
    };

    _pGridFormat._arrayCopy = function (arr)
    {
        function cloneObj(obj)
        {
            var copy = {};
            for (var attr in obj)
            {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }

        var newarr = [];

        for (var i = 0; i < arr.length; i++)
        {
            newarr[i] = cloneObj(arr[i]);
        }
        return newarr;
    };

    _pGridFormat._getFormatStr = function ()
    {
        //  this._updateFormatStr(); 스펙변경시 todo
        //  return nexacro._documentToXml(this._formatElem);
        return this._getCurrFormatStr();
    };

    _pGridFormat._getOrgFormatStr = function ()
    {
        //  return nexacro._documentToXml(this._formatElemOrg);
        return this._getOrgnFormatStr();
    };

    _pGridFormat._updateFormatStr = function ()
    {
        if (!this._grid.enableredraw)
            return;
        //  this._curFormatStr = this._getCurFormatStr();
    };

    _pGridFormat._getCurrFormatStr = function ()
    {
        // var hr = 0;
        var i;
        var nColCount = 0;
        // var nPvtCount = 0;
        var _cols = this._cols;
        var _headrows = this._headrows;
        var _bodyrows = this._bodyrows;
        var _summrows = this._summrows;
        var _headcells = this._headcells;
        var _bodycells = this._bodycells;
        var _summcells = this._summcells;
        var _headband = this._headband;
        var _bodyband = this._bodyband;
        var _summband = this._summband;

        if (_cols && _cols.length)
            nColCount = _cols.length;

        var strContents;
        var group = this._group_info;

        if (nColCount > 0)
        {
            strContents = "<Format id=\"" + this.id + "\">\n";
            strContents += "<Columns>\n";
            {
                var bset = false;
                for (i = 0; i < nColCount; i++)
                {
                    if (!bset && group && group.startcol == i)
                    {
                        if (group.area != "body")
                            strContents += "<Column size=\"" + group.colsize + "\" band=\"" + group.area + "\" group=\"true\"";
                        else
                            strContents += "<Column size=\"" + group.colsize + "\" group=\"true\"";

                        if (!group.visible)
                            strContents += " visible=\"false\"";

                        bset = true;
                        i--;
                    }
                    else
                    {
                        if (parseInt(_cols[i].groupcol) < 0)
                        {
                            if (_cols[i]._area != "body")
                                strContents += "<Column size=\"" + _cols[i].size + "\" band=\"" + _cols[i]._area + "\"";
                            else
                                strContents += "<Column size=\"" + _cols[i].size + "\"";

                            if (!_cols[i].visible)
                                strContents += " visible=\"false\"";
                        }
                        else
                        {
                            continue;
                        }
                    }

                    strContents += "/>\n";
                }
            }
            strContents += "</Columns>\n";
            strContents += "<Rows>\n";
            {
                if (_headrows)
                {
                    var _headrowsLen = _headrows.length;
                    for (i = 0; i < _headrowsLen; i++)
                    {
                        strContents += "<Row band=\"head\" size=\"" + _headrows[i].size + "\"/>\n";
                    }
                }
                if (_bodyrows)
                {
                    var _bodyrowsLen = _bodyrows.length;
                    for (i = 0; i < _bodyrowsLen; i++)
                    {
                        strContents += "<Row band=\"body\" size=\"" + _bodyrows[i].size + "\"/>\n";
                    }
                }
                if (_summrows)
                {
                    var _summrowsLen = _summrows.length;
                    for (i = 0; i < _summrowsLen; i++)
                    {
                        strContents += "<Row band=\"summ\" size=\"" + _summrows[i].size + "\"/>\n";
                    }
                }
            }
            strContents += "</Rows>\n";

            function _makeBandPropstr(obj)
            {
                var xmlstr = "";
                var _property_map = obj._property_map;
                var prop, bind, deft;

                for (var i = 0; i < _property_map.length; i++)
                {
                    prop = _property_map[i][0];
                    bind = _property_map[i][1];
                    deft = _property_map[i][2];

                    if (bind)
                    {
                        if (obj[prop]._value != deft)
                            xmlstr += "\" " + prop + "=\"" + (typeof (obj[prop]._value) == "string" ? nexacro._encodeXml(obj[prop]._value) : obj[prop]._value);
                    }
                    else
                    {
                        if (obj[prop] != deft)
                            xmlstr += "\" " + prop + "=\"" + (typeof (obj[prop]) == "string" ? nexacro._encodeXml(obj[prop]) : obj[prop]);
                    }
                }
                return xmlstr;
            }

            function _makeCellstr(cells)
            {
                var cellsLen = cells.length;
                for (var i = 0; i < cellsLen; i++)
                {
                    var cellinfo = cells[i];
                    var adjust = 0;

                    if (nexacro._isArray(cellinfo))
                    {
                        adjust = cellinfo[1];
                        cellinfo = cellinfo[0];
                    }

                    if (cellinfo)
                        strContents += cellinfo._getXmlString(adjust);
                }
            }

            function adjustGroup(cells, band)
            {
                if (group)
                {
                    var logical_groupcnt = group.endcol >= 0 ? (group.endcol - group.startcol + 1) : 0;
                    var adjustcells = [];

                    for (var i = 0; i < cells.length; i++)
                    {
                        if (cells[i]._col < group.startcol)
                        {
                            adjustcells.push([cells[i], 0]);
                        }
                        else if (cells[i]._col == group.startcol)
                        {
                            if (band == "head")
                                adjustcells.push([group.headcellinfos[cells[i]._row], 0]);
                            else if (band == "body")
                                adjustcells.push([group.bodycellinfos[cells[i]._row], 0]);
                            else
                                adjustcells.push([group.summcellinfos[cells[i]._row], 0]);

                            if (cells[i]._groupcol < 0)
                                adjustcells.push([cells[i], 1 - logical_groupcnt]);
                        }
                        else
                        {
                            if (cells[i]._groupcol < 0)
                                adjustcells.push([cells[i], 1 - logical_groupcnt]);
                        }
                    }
                    return adjustcells;
                }
                return cells;
            }

            if (_headrows)
            {
                _headcells = adjustGroup(_headcells, "head");
                strContents += "<Band id=\"head" + _makeBandPropstr(_headband) + "\">\n";
                _makeCellstr(_headcells);
                strContents += "</Band>\n";
            }
            if (_bodyrows)
            {
                _bodycells = adjustGroup(_bodycells, "body");
                strContents += "<Band id=\"body" + _makeBandPropstr(_bodyband) + "\">\n";
                _makeCellstr(_bodycells);
                strContents += "</Band>\n";
            }
            if (_summrows)
            {
                _summcells = adjustGroup(_summcells, "summary");
                strContents += "<Band id=\"summary" + _makeBandPropstr(_summband) + "\">\n";
                _makeCellstr(_summcells);
                strContents += "</Band>\n";
            }
            strContents += "</Format>\n";
        }
        else
        {
            strContents = "<Format id=\"" + this.id + "\"></Format>\n";
        }

        /*
        var contentsElem = nexacro._parseXMLDocument(strContents);
        var format_elem = contentsElem.getElementsByTagName("Format");
        if (format_elem) {
            this._formatElem = format_elem[0];
        }
        */
        return strContents;
    };

    _pGridFormat._getOrgnFormatStr = function ()
    {
        var strContents = "";
        var strFormats = this._grid.formats;

        var contentsElem = nexacro._parseXMLDocument(strFormats);
        var formatElems = contentsElem.getElementsByTagName("Format");
        var len = formatElems ? formatElems.length : 0;

        for (var i = 0; i < len; i++)
        {
            var formatElem = formatElems[i];
            var idstr = formatElem.getAttribute("id");
            if (idstr == null || idstr == "")
            {
                idstr = "default";
            }

            if (idstr == this.id)
            {
                strContents = nexacro._documentToXml(formatElem);
                break;
            }
        }

        return strContents;
    };

    _pGridFormat._createGroupInfo = function (area, col, size, visible)
    {
        if (!this._group_info)
            this._group_info = { startcol: col, endcol: -1, area: area, headcellinfos: [], summcellinfos: [], bodycellinfos: [], colsize: size, visible: visible };  // cells의 length는 subrow 갯수와 일치함.
    };

    _pGridFormat._loadFromDOM = function (formatElem)
    {
        var i, j, len, cnt, bandstr, sizestr, bandtype, groupstr, visiblestr;
        // var colstr, colval, colspanstr, colspan, rowstr, rowval, rowspanstr, rowspan, attrval;
        var attrval;
        var bandobj, cellobj, bandElem, cellElem;

        // this._formatElemOrg = formatElem.cloneNode(true);

        var columns = formatElem.getElementsByTagName("Column");
        len = columns.length;

        if (len == 0)
        {
            columns = formatElem.getElementsByTagName("Col");
            len = columns.length;
        }
        var areaflag = 0;

        // this._formatElem = formatElem;

        for (i = 0; i < len; i++)
        {
            var columnElem = columns[i];
            bandstr = columnElem.getAttribute("band");
            sizestr = columnElem.getAttribute("size");
            groupstr = columnElem.getAttribute("group");
            visiblestr = columnElem.getAttribute("visible");

            var n_size, b_visible;

            n_size = parseInt(sizestr, 10);
            b_visible = (visiblestr == null) ? true : nexacro._toBoolean(visiblestr);

            if (areaflag == 0 && bandstr == "left")
            {
                if (groupstr == "true" && !this._group_info)
                    this._createGroupInfo("left", i, n_size, b_visible);
                else
                    this._addLeftColumn(n_size, -1, b_visible);
            }
            else if (areaflag == 2 || bandstr == "right")
            {
                if (groupstr == "true" && !this._group_info)
                    this._createGroupInfo("right", i, n_size, b_visible);
                else
                {
                    this._addRightColumn(n_size, -1, b_visible);
                    areaflag = 2;
                }
            }
            else
            {
                if (groupstr == "true" && !this._group_info)
                    this._createGroupInfo("body", i, n_size, b_visible);
                else
                {
                    this._addBodyColumn(n_size, -1, b_visible);
                    areaflag = 1;
                }
            }
        }
        this._bodyWidth = this.bodyWidth;

        this._rearrangeCols();

        var rows = formatElem.getElementsByTagName("Row");
        len = rows.length;
        for (i = 0; i < len; i++)
        {
            var rowElem = rows[i];
            bandstr = rowElem.getAttribute("band");
            sizestr = rowElem.getAttribute("size");
            if (bandstr == "head")
                this._addHeadRow((parseInt(sizestr) | 0));
            else if (bandstr == "summ" || bandstr == "summary")
                this._addSummRow((parseInt(sizestr) | 0));
            else
                this._addBodyRow((parseInt(sizestr) | 0));
        }
        this._body_height = this.bodyHeight;

        var bands = formatElem.getElementsByTagName("Band");
        len = bands.length;

        function _setProp(obj, xmlelem)
        {
            var _property_map = obj._property_map;
            var prop;

            for (var k = 0; k < _property_map.length; k++)
            {
                prop = _property_map[k][0];
                attrval = xmlelem.getAttribute(prop);

                if (attrval !== null && attrval !== undefined)
                    obj["set_" + prop](attrval);
            }
        }

        for (i = 0; i < len; i++)
        {
            bandElem = bands[i];
            bandtype = bandElem.getAttribute("id");
            if (bandtype == "head")
            {
                if (this._headband == null)
                {
                    this._headband = new nexacro.GridBandInfo("head", "head", this, this.parent);
                }
                bandobj = this._headband;
            }
            else if (bandtype == "summary")
            {
                if (this._summband == null)
                {
                    this._summband = new nexacro.GridBandInfo("summary", "summ", this, this.parent);
                }
                bandobj = this._summband;
            }
            else
            {
                bandtype = "body";
                if (this._bodyband == null)
                {
                    this._bodyband = new nexacro.GridBandInfo("body", "body", this, this.parent);
                }
                bandobj = this._bodyband;
            }

            _setProp(bandobj, bandElem);

            var cells = bandElem.getElementsByTagName("Cell");
            cnt = cells.length;

            var childcnt = 0;
            var idx = -1;

            for (j = 0; j < cnt; j++)
            {
                cellElem = cells[j];

                if (childcnt > 0)
                {
                    childcnt--;
                    continue;
                }
                else
                {
                    idx++;
                    cellobj = new nexacro.GridCellInfo(bandtype + idx, bandobj, this.parent, bandtype, idx);
                }

                var col = cellElem.getAttribute("col");

                if (col == null)
                    col = 0;

                if (this._group_info)
                {
                    if (this._group_info.startcol == col)
                    {
                        cellobj.id = "group";
                        cellobj._is_group_temp = true;
                    }
                    cellobj._loadXmlElement(cellElem, nexacro.GridCellInfo);

                    if (cellobj._col > this._group_info.startcol)
                        cellobj._col--;
                }
                else
                {
                    cellobj._loadXmlElement(cellElem, nexacro.GridCellInfo);
                }


                var subcells = cellElem.getElementsByTagName("Cell");
                childcnt = subcells.length;

                if (cellobj._is_group_temp)
                {
                    idx--;
                    var group_info = this._group_info;

                    if (bandtype == "head")
                        group_info.headcellinfos[cellobj._row] = cellobj;
                    else if (bandtype == "summary")
                        group_info.summcellinfos[cellobj._row] = cellobj;
                    else
                        group_info.bodycellinfos[cellobj._row] = cellobj;
                }
                else
                {
                    if (bandtype == "head")
                        this._addHeadCell(cellobj);
                    else if (bandtype == "summary")
                        this._addSummCell(cellobj);
                    else
                        this._addBodyCell(cellobj);
                }
            }
        }
        this._bodycells = this._sortCellIdx(this._bodycells, this._bodyrows);
        this._headcells = this._sortCellIdx(this._headcells, this._headrows);
        this._summcells = this._sortCellIdx(this._summcells, this._summrows);
    };

    _pGridFormat._sortCellIdx = function (cells, rows)
    {
        if (!cells || !rows) return null;

        var newcells = [];
        var cellsLen = cells.length;
        var rowsLen = rows.length;
        var idx = 0;

        for (var i = 0; i < rowsLen; i++)
        {
            for (var j = 0; j < cellsLen; j++)
            {
                if (cells[j]._row == i)
                {
                    cells[j]._cellidx = idx++;
                    newcells.push(cells[j]);
                }
            }
        }
        return newcells;
    };

    _pGridFormat._getFormatCellSize = function (col, row, colspan, rowspan, rowdix, orginal)
    {
        var cols = this._cols;
        var rows = this._bodyrows;
        var width = 0, height = 0;
        var endcol = col + colspan;
        var endrow = row + rowspan;

        if (rowdix == -1)
            rows = this._headrows;
        else if (rowdix == -2)
            rows = this._summrows;

        var i;
        for (i = col; i < endcol; i++)
        {
            width += cols[i].orgsize;
        }

        for (i = row; i < endrow; i++)
        {
            height += rows[i].orgsize;
        }

        return [width, height];
    };

    _pGridFormat._adjustColSizing = function (idx, movepos)
    {
        if (movepos != 0)
        {
            var len = this._cols.length;

            if (len == 0 && !this._cols[idx])
                return false;

            if (!this._cols[idx].visible)
                return false;

            var area = this._cols[idx]._area;

            if (area == "body")
                this.bodyWidth = this._bodyWidth = this._bodyWidth + movepos;
            else if (area == "left")
                this.leftWidth += movepos;
            else
                this.rightWidth += movepos;

            var col;
            // var pos = 0;

            for (var i = 0; i < len; i++)
            {
                if (i < idx)
                {
                    continue;
                }
                else if (i == idx)
                {
                    col = this._cols[i];
                    if (col._area != area)
                        continue;

                    col.right += movepos;
                    col.size += movepos;
                }
                else
                {
                    col = this._cols[i];
                    if (col._area != area)
                        continue;

                    col.left += movepos;
                    col.right += movepos;
                }
            }
            this._updateFormatStr();
            return true;
        }
        return false;
    };

    _pGridFormat._adjustColWidth = function (bodywidth, autofitcol_rate)
    {
        if (bodywidth <= 0)
            return false;

        if (!this._cols)
            return false;

        var retn = false;
        if (this._bodyWidth != bodywidth)
            retn = true;

        this._bodyWidth = bodywidth;
        var factor = bodywidth / this.bodyWidth;
        this.bodyWidth = this._bodyWidth;
        var len = this._cols.length;
        var col, bodylastcol = -1;//  bodylastcolidx = -1;
        var pos = 0;
        var tot = 0;
        var i;

        if (!autofitcol_rate.length)
        {
            for (i = 0; i < len; i++)
            {
                col = this._cols[i];
                if (col._area != "body")
                    continue;

                if (col.visible == false)
                    continue;

                col.left = pos;

                if (col.tempsize != undefined)
                {
                    col.size = col.tempsize;
                    col.tempsize = undefined;
                }

                col.size *= factor;

                autofitcol_rate[i] = col.size / bodywidth;

                if (col.size >= 0.5)
                    col.size = Math.round(col.size);

                tot += col.size;
                pos = pos + col.size;
                col.right = pos;

                if (col.size > 0)
                {
                    bodylastcol = col;
                    // bodylastcolidx = i;
                }
            }
        }
        else
        {
            for (i = 0; i < len; i++)
            {
                col = this._cols[i];
                if (col._area != "body")
                    continue;

                if (col.visible == false)
                    continue;

                col.left = pos;
                col.size = bodywidth * autofitcol_rate[i];

                if (col.size >= 0.5)
                    col.size = Math.round(col.size);

                tot += col.size;
                pos = pos + col.size;
                col.right = pos;
                bodylastcol = col;
                // bodylastcolidx = i;
            }
        }

        if (bodylastcol && bodylastcol.size > 0)    // 16/01/20 cmc
        {
            bodylastcol.tempsize = bodylastcol.size;
            bodylastcol.size += (bodywidth - tot); // 오차에 의해 공백이 생기는 만큼 메꿈.
            bodylastcol.right += (bodywidth - tot);

            if (bodylastcol.size <= 0)
            {
                bodylastcol.size = 1;
                bodylastcol.right = bodylastcol.left + bodylastcol.getSize();
            }
        }

        return retn;
    };

    _pGridFormat._adjustRowHeight = function (bodyheight)
    {
        if (bodyheight == 0)
            bodyheight = 0.1;

        if (this._body_height != bodyheight)
        {
            this._body_height = bodyheight;
            var factor = bodyheight / this.bodyHeight;
            this.bodyHeight = this._body_height;

            if (!this._rows)
                return true;

            var len = this._rows.length;
            var row;
            var pos = 0;

            for (var i = 0; i < len; i++)
            {
                row = this._rows[i];
                if (row._area != "body")
                    continue;

                row.top = pos;
                row.size = (row.size * factor);

                pos = pos + row.size;
                row.bottom = pos;
            }
            return true;
        }
        return false;
    };

    _pGridFormat._defaultColSize = 40;
    _pGridFormat._appendContentsCol = function (bandtype, bandobj, bandcells, bandrows, addfunc, col)
    {
        var cellsize = (bandcells) ? bandcells.length : 0;
        var rowsize = (bandrows) ? bandrows.length : 0;
        var cellobj = null;
        var i;

        for (i = 0; i < cellsize; i++)
        {
            bandcells[i]._endcol = false;

            if (bandcells[i]._col >= col)
                bandcells[i]._col++;
        }

        for (i = 0; i < rowsize; i++)
        {
            cellobj = new nexacro.GridCellInfo(bandtype + cellsize, bandobj, this.parent, bandtype, cellsize);
            cellobj.celltype = bandtype;
            cellobj._col = col;
            cellobj._colspan = 1;
            cellobj._row = i;
            cellobj._rowspan = 1;
            this[addfunc](cellobj);
            cellsize++;
        }
        bandcells[bandcells.length - 1]._endcol = true;

        this._arrangeCellIdx(bandtype);
        this._updateFormatStr();
    };

    _pGridFormat._arrangeCellIdx2 = function (bandcells, rowsize)
    {
        var j = 0;
        var cellobj;
        var cells = [];

        for (var k = 0; k < rowsize; k++)
        {
            for (var i = 0; i < bandcells.length; i++)
            {
                cellobj = bandcells[i];

                if (k == cellobj._row)
                {
                    cellobj._cellidx = j;
                    cells[j++] = cellobj;
                    bandcells.splice(i, 1);
                    i--;
                }
            }
        }
        return cells;
    };

    _pGridFormat._arrangeCellIdx = function (band)
    {
        var bandcells = this._bodycells;
        var bandrows = this._bodyrows;

        if (band == "body")
        {
            bandcells = this._bodycells;
            bandrows = this._bodyrows;
        }
        else if (band == "summ" || band == "summary")
        {
            bandcells = this._summcells;
            bandrows = this._summrows;
        }
        else if (band == "head")
        {
            bandcells = this._headcells;
            bandrows = this._headrows;
        }

        var rowsize = (bandrows) ? bandrows.length : 0;
        var cells = this._arrangeCellIdx2(bandcells, rowsize);

        if (band == "body")
        {
            this._bodycells = cells;
        }
        else if (band == "summ" || band == "summary")
        {
            this._summcells = cells;
        }
        else if (band == "head")
        {
            this._headcells = cells;
        }
    };

    _pGridFormat.appendContentsCol = function (strBand, bBandAppend)
    {
        var areatype = "body";

        if (bBandAppend == undefined)
            bBandAppend = true;

        bBandAppend = nexacro._toBoolean(bBandAppend);

        if (bBandAppend == false)
        {
            var rightcnt = this._getColFixCnt("right");
            if (rightcnt)
                areatype = "right";
            else
                areatype = "body";
        }
        else
        {
            if (strBand)
            {
                var areaidx = parseInt(strBand, 10);
                if (isFinite(areaidx))
                {
                    if (areaidx == -1)
                    {
                        areatype = "left";
                    }
                    else if (areaidx == -2)
                    {
                        areatype = "right";
                    }
                    else
                    {
                        areatype = "body";
                    }
                }
                else if (strBand.length)
                {
                    areatype = strBand.toLowerCase();
                }
            }
        }

        var retn_col = -1;
        var col; // = this._cols.length;
        var colSize = this._defaultColSize;

        if (areatype == "left")
        {
            col = this._getColFixCnt("left");
            this._addLeftColumn(colSize);
        }
        else if (areatype == "right")
        {
            col = this._cols.length;
            this._addRightColumn(colSize);
        }
        else
        {
            col = this._getColFixCnt("left");
            col += this._getColFixCnt("body");
            this._addBodyColumn(colSize);
            this.endbodycol = this._cols.length;
        }

        var bandtype, bandobj, bandcells, bandrows, addfunc;

        if (this._bodyband && this._bodyrows && this._bodyrows.length > 0)
        {
            retn_col = col;
            bandtype = "body";
            bandobj = this._bodyband;
            bandcells = this._bodycells;
            bandrows = this._bodyrows;
            addfunc = "_addBodyCell";
            this._appendContentsCol(bandtype, bandobj, bandcells, bandrows, addfunc, col);
        }

        if (this._headband && this._headrows && this._headrows.length > 0)
        {
            retn_col = col;
            bandtype = "head";
            bandobj = this._headband;
            bandcells = this._headcells;
            bandrows = this._headrows;
            addfunc = "_addHeadCell";
            this._appendContentsCol(bandtype, bandobj, bandcells, bandrows, addfunc, col);
        }

        if (this._summband && this._summrows && this._summrows.length > 0)
        {
            retn_col = col;
            bandtype = "summary";
            bandobj = this._summband;
            bandcells = this._summcells;
            bandrows = this._summrows;
            addfunc = "_addSummCell";
            this._appendContentsCol(bandtype, bandobj, bandcells, bandrows, addfunc, col);
        }
        this._rearrangeCols();
        return retn_col;
    };

    _pGridFormat._moveContentsCol = function (bandtype, bandcells, fromcol, tocol, colspan1, colspan2)
    {
        if (!bandcells)
        {
            return;
        }

        var bandcellsLen = bandcells.length;
        var endcol = (this._cols) ? (this._cols.length - 1) : -1;
        var cellobj, _col;

        var areaInfos = {};
        var colIdx; //, fromIdx, toIdx;
        var i;

        for (i = 0; i < bandcellsLen; i++)
        {
            cellobj = bandcells[i];
            colIdx = cellobj._col;

            // if (colIdx == fromcol)
            //     fromIdx = colIdx;
            // if (colIdx == tocol)
            //     toIdx = colIdx;

            areaInfos[colIdx] = cellobj._area;
        }

        for (i = 0; i < bandcellsLen; i++)
        {
            cellobj = bandcells[i];
            _col = cellobj._col;

            if (cellobj._orgcol == undefined)
                cellobj._orgcol = _col;

            if (_col == fromcol)
            {
                cellobj._area = areaInfos[tocol];
                cellobj._col = tocol;
            }
            else
            {
                if (fromcol < tocol)
                {
                    //move right
                    if (_col > fromcol && _col <= tocol)
                    {
                        cellobj._col--;
                    }
                }
                else
                {
                    //move left
                    if (_col < fromcol && _col >= tocol)
                    {
                        cellobj._col++;
                    }
                }
            }

            if (cellobj._col == endcol)
            {
                cellobj._endcol = true;
            }
            else
            {
                cellobj._endcol = false;
            }
        }

        this._arrangeCellIdx(bandtype);
    };

    _pGridFormat._reIndexCells = function (cells, rows)
    {
        if (!cells || !rows)
        {
            return;
        }

        var rowslen = rows.length;
        var cellslen = cells.length;

        var i, j = 0, k = 0;
        var tmp = [], tmp2 = [];

        for (i = 0; i < rowslen; i++)
        {
            tmp = [];
            k = 0;
            for (j = 0; j < cellslen; j++)
            {
                if (cells[j]._row == i)
                {
                    tmp[k++] = cells[j];
                }
            }
            tmp.sort(function (a, b) { return a._col - b._col; });
            tmp2 = tmp2.concat(tmp);
        }

        for (i = 0; i < cellslen; i++)
        {
            tmp2[i]._cellidx = i;
        }
        return tmp2;
    };

    _pGridFormat._insertContentsCol = function (bandtype, bandobj, bandcells, bandrows, addfunc, insertidx, nGroupCol)
    {
        var col = insertidx;
        var cellsize = bandcells.length;
        var rowsize = bandrows.length;
        var cellobj = null;
        var mergecells = [];
        var i, j;

        for (i = 0; i < cellsize; i++)
        {
            cellobj = bandcells[i];

            if (cellobj._col < insertidx && (cellobj._col + cellobj._colspan - 1) >= insertidx)
            {
                mergecells.push(cellobj);
            }
        }

        var mergecell;
        if (mergecells.length > 0)
        {
            for (i = 0; i < mergecells.length; i++)
            {
                mergecell = mergecells[i];
                mergecell._colspan++;

                if (mergecell._subcells.length > 0)
                {
                    var subcol = col - mergecell._col;
                    cellobj = new nexacro.GridCellInfo(bandtype + cellsize + "_sub" + subcol, bandobj, this.parent, bandtype, mergecell._subcells.length);
                    cellobj.celltype = bandtype;
                    cellobj._col = subcol;
                    cellobj._colspan = 1;
                    cellobj._row = 0;
                    cellobj._rowspan = 1;
                    cellobj._isSubCell = true;

                    this._insertCell(mergecell._subcells, cellobj, subcol, 0);
                }

                for (j = 0; j < cellsize; j++)
                {
                    cellobj = bandcells[j];

                    if (cellobj._col >= insertidx && cellobj._row == mergecell._row)
                    {
                        cellobj._col++;
                    }
                }
            }
        }

        var group_info = this._group_info;

        if (group_info && nGroupCol >= 0)
            group_info.endcol = Math.max(group_info.endcol, group_info.startcol + nGroupCol);

        for (i = 0; i < rowsize; i++)
        {
            var row = i;
            for (j = 0; j < mergecells.length; j++)
            {
                mergecell = mergecells[j];
                if (mergecell._row == row)
                {
                    break;
                }
            }

            if (mergecell && mergecell._row == row)
                continue;

            var copy_cellinfo = null;
            var colspan = 1;
            var rowspan = 1;

            if (group_info && nGroupCol >= 0)
            {
                if (bandtype == "head")
                    copy_cellinfo = group_info.headcellinfos[row];
                else if (bandtype == "body")
                    copy_cellinfo = group_info.bodycellinfos[row];
                else
                    copy_cellinfo = group_info.summcellinfos[row];

                //if (!copy_cellinfo)
                //  continue;

                rowspan = copy_cellinfo._rowspan;
                i += rowspan - 1;
            }

            cellobj = new nexacro.GridCellInfo(bandtype + cellsize, bandobj, this.parent, bandtype, cellsize, copy_cellinfo);
            cellobj.celltype = bandtype;
            cellobj._col = col;
            cellobj._colspan = colspan;
            cellobj._row = row;
            cellobj._rowspan = rowspan;
            cellobj._groupcol = nGroupCol >= 0 ? nGroupCol : -1;

            if (copy_cellinfo && copy_cellinfo._subcells.length)
            {
                for (var subrow = 0; subrow < rowspan; subrow++)
                {
                    var subcol = 0;
                    var subcellobj = new nexacro.GridCellInfo(bandtype + cellsize + "_sub" + subcol, bandobj, this.parent, bandtype, cellsize, copy_cellinfo._subcells[subrow]);
                    subcellobj.celltype = bandtype;
                    subcellobj._col = subcol;
                    subcellobj._colspan = 1;
                    subcellobj._row = subrow;
                    subcellobj._rowspan = 1;
                    subcellobj._isSubCell = true;
                    cellobj._subcells.push(subcellobj);
                }
            }

            this[addfunc](cellobj, col, row);

            for (var k = 1; k < rowspan; k++)
            {
                var nextrow = row + k;
                for (var l = 0; l < bandcells.length; l++)
                {
                    if (bandcells[l]._row == nextrow && bandcells[l]._col >= col)
                        bandcells[l]._col++;
                }
            }

            cellsize++;
        }

        var endcol = (this._cols) ? (this._cols.length - 1) : -1;

        cellsize = bandcells.length;
        for (i = 0; i < cellsize; i++)
        {
            cellobj = bandcells[i];

            if (cellobj._col == endcol)
                cellobj._endcol = true;
            else
                cellobj._endcol = false;
        }
        this._arrangeCellIdx(bandtype);
        this._updateFormatStr();
    };

    _pGridFormat.insertContentsCol = function (strBand, nColIndex, bBandAppend, nGroupCol)
    {
        var areatype = "body";

        if (bBandAppend == undefined)
            bBandAppend = true;

        bBandAppend = nexacro._toBoolean(bBandAppend);

        var lcnt = this._getColFixCnt("left");
        var bcnt = this._getColFixCnt("body");
        var rcnt = this._getColFixCnt("right");

        if (strBand != undefined)
        {
            var areaidx = parseInt(strBand, 10);

            if (isFinite(areaidx))
            {
                if (nColIndex != undefined)
                {
                    if (areaidx == -1)
                    {
                        areatype = "left";
                    }
                    else if (areaidx == -2)
                    {
                        areatype = "right";
                    }
                    else
                    {
                        areatype = "body";
                    }

                    if (nColIndex < 0)
                        nColIndex = 0;

                    if (bBandAppend)
                    {
                        if (areatype == "body")
                        {
                            nColIndex += lcnt;
                        }
                        else if (areatype == "right")
                        {
                            nColIndex += lcnt;
                            nColIndex += bcnt;
                        }

                        if (areatype == "left")
                        {
                            if (nColIndex > lcnt)
                                nColIndex = lcnt;
                        }
                        else if (areatype == "body")
                        {
                            if (nColIndex > lcnt + bcnt)
                                nColIndex = lcnt + bcnt;
                        }
                        else
                        {
                            if (nColIndex > lcnt + bcnt + rcnt)
                                nColIndex = lcnt + bcnt + rcnt;
                        }
                    }
                    else
                    {
                        if (nColIndex > this._cols.length)
                            nColIndex = this._cols.length;

                        if (nColIndex < lcnt)
                            areatype = "left";
                        else if (nColIndex >= lcnt + bcnt && nColIndex < lcnt + bcnt + rcnt)
                            areatype = "right";
                        else
                            areatype = "body";
                    }
                }
                else
                {
                    if (areaidx < 0)
                        areaidx = 0;
                    else if (areaidx > this._cols.length)
                        areaidx = this._cols.length;

                    nColIndex = areaidx;
                }
            }
            else if (strBand.length)
            {
                areatype = strBand.toLowerCase();

                if (nColIndex == undefined)
                    return -1;
                else if (nColIndex < 0)
                    nColIndex = 0;

                if (bBandAppend)
                {
                    if (areatype == "body")
                    {
                        nColIndex += lcnt;
                    }
                    else if (areatype == "right")
                    {
                        nColIndex += lcnt;
                        nColIndex += bcnt;
                    }

                    if (areatype == "left")
                    {
                        if (nColIndex > lcnt)
                            nColIndex = lcnt;
                    }
                    else if (areatype == "body")
                    {
                        if (nColIndex > lcnt + bcnt)
                            nColIndex = lcnt + bcnt;
                    }
                    else
                    {
                        if (nColIndex > lcnt + bcnt + rcnt)
                            nColIndex = lcnt + bcnt + rcnt;
                    }
                }
                else
                {
                    if (nColIndex > this._cols.length)
                        nColIndex = this._cols.length;

                    if (nColIndex < lcnt)
                        areatype = "left";
                    else if (nColIndex >= lcnt + bcnt && nColIndex < lcnt + bcnt + rcnt)
                        areatype = "right";
                    else
                        areatype = "body";
                }
            }
        }

        var retn_col = -1;
        var colSize = this._defaultColSize;

        if (areatype == "left")
        {
            this._insertLeftColumn(colSize, nColIndex, nGroupCol);
        }
        else if (areatype == "right")
        {
            this._insertRightColumn(colSize, nColIndex, nGroupCol);
        }
        else
        {
            this._insertBodyColumn(colSize, nColIndex, nGroupCol);
            this.endbodycol = this._cols.length;
        }

        var bandtype, bandobj, bandcells, bandrows, addfunc;

        if (this._bodyband)
        {
            retn_col = nColIndex;
            bandtype = "body";
            bandobj = this._bodyband;
            bandcells = this._bodycells;
            bandrows = this._bodyrows;
            addfunc = "_insertBodyCell";
            this._insertContentsCol(bandtype, bandobj, bandcells, bandrows, addfunc, nColIndex, nGroupCol);
        }

        if (this._headband)
        {
            retn_col = nColIndex;
            bandtype = "head";
            bandobj = this._headband;
            bandcells = this._headcells;
            bandrows = this._headrows;
            addfunc = "_insertHeadCell";
            this._insertContentsCol(bandtype, bandobj, bandcells, bandrows, addfunc, nColIndex, nGroupCol);
        }

        if (this._summband)
        {
            retn_col = nColIndex;
            bandtype = "summary";
            bandobj = this._summband;
            bandcells = this._summcells;
            bandrows = this._summrows;
            addfunc = "_insertSummCell";
            this._insertContentsCol(bandtype, bandobj, bandcells, bandrows, addfunc, nColIndex, nGroupCol);
        }
        this._rearrangeCols();
        return retn_col;
    };

    _pGridFormat._defaultRowSize = 24;
    _pGridFormat._appendContentsRow = function (bandtype, bandobj, bandcells, bandrows, rowfunc, addfunc)
    {
        var row = (bandrows) ? bandrows.length : 0;
        var rowSize = this._defaultRowSize;
        this[rowfunc](rowSize);
        var cellsize = (bandcells) ? bandcells.length : 0;
        var colsize = this._cols.length;
        var cellobj = null;

        if (colsize == 0)
        {
            this._addBodyColumn(this._defaultColSize);
            colsize = this._cols.length;
        }

        for (var i = 0; i < colsize; i++)
        {
            cellobj = new nexacro.GridCellInfo(bandtype + cellsize, bandobj, this.parent, bandtype, cellsize);
            cellobj.celltype = bandtype;
            cellobj._col = i;
            cellobj._colspan = 1;
            cellobj._row = row;
            cellobj._rowspan = 1;
            cellobj._endcol = ((i + 1) == this.endbodycol);

            this._updateGroupInfoRow(bandtype, cellobj, "A");
            this[addfunc](cellobj);
            cellsize++;
        }
        this._updateFormatStr();
        return row;
    };

    _pGridFormat.appendContentsRow = function (strBand, bBandAppend)
    {
        var bandtype = "";

        if (strBand != undefined)
        {
            var bandidx = parseInt(strBand, 10);
            if (isFinite(bandidx))
            {
                if (bandidx == -1)
                    bandtype = "head";
                else if (bandidx == -2)
                    bandtype = "summ";
                else if (bandidx >= 0)
                    bandtype = "body";
            }
            else if (strBand.length)
            {
                bandtype = strBand.toLowerCase();
            }

            if (bandtype == "")
                return -1;
        }

        var row = -1;
        var bandobj, bandcells, bandrows, rowfunc, addfunc;

        if (bandtype == "head")
        {
            if (this._headband == null)
                this._headband = new nexacro.GridBandInfo("head", "head", this, this.parent);

            bandobj = this._headband;
            bandcells = this._headcells;
            bandrows = this._headrows;
            rowfunc = "_addHeadRow";
            addfunc = "_addHeadCell";
            row = this._appendContentsRow("head", bandobj, bandcells, bandrows, rowfunc, addfunc);
        }
        else if (bandtype == "summ" || bandtype == "summary")
        {
            if (this._summband == null)
                this._summband = new nexacro.GridBandInfo("summary", "summ", this, this.parent);

            bandobj = this._summband;
            bandcells = this._summcells;
            bandrows = this._summrows;
            rowfunc = "_addSummRow";
            addfunc = "_addSummCell";
            row = this._appendContentsRow("summary", bandobj, bandcells, bandrows, rowfunc, addfunc);
        }
        else if (bandtype == "body")
        {
            if (this._bodyband == null)
                this._bodyband = new nexacro.GridBandInfo("body", "body", this, this.parent);

            bandobj = this._bodyband;
            bandcells = this._bodycells;
            bandrows = this._bodyrows;
            rowfunc = "_addBodyRow";
            addfunc = "_addBodyCell";
            row = this._appendContentsRow("body", bandobj, bandcells, bandrows, rowfunc, addfunc);
        }

        return row;
    };

    _pGridFormat._deleteRowCell = function (band, row)
    {
        var cells = this._bodycells;

        if (band == "summary")
            band = "summ";

        if (band == "head")
        {
            cells = this._headcells;
        }
        else if (band == "summ")
        {
            cells = this._summcells;
        }
        if (cells == null || cells.length == 0)
        {
            return undefined;
        }

        var rowspan; //, colspan;
        var subcells, subcell;
        var j, k;

        for (var i = 0; i < cells.length; i++)
        {
            if (cells[i]._row == row)
            {
                //colspan = cells[i]._colspan;
                rowspan = cells[i]._rowspan;

                if (rowspan == 1)
                {
                    delete cells[i];
                    cells.splice(i, 1);
                    i--;
                }
                else
                {
                    subcells = cells[i]._subcells;

                    for (j = 0; j < subcells.length; j++)
                    {
                        subcell = subcells[j];
                        if (subcell._row + cells[i]._row == row)
                        {
                            subcells.splice(j, 1);
                            for (k = j; k < subcells.length; k++)
                            {
                                subcells[k]._cellidx--;
                            }
                            j--;
                        }
                        else if (subcell._row + cells[i]._row > row)
                        {
                            subcell._row--;
                        }
                        else if (subcell._row + cells[i]._row < row && (subcell._row + cells[i]._row + subcell._rowspan - 1) >= row)
                        {
                            subcell._rowspan--;
                        }
                    }
                    cells[i]._rowspan--;
                }
            }
            else if (cells[i]._row > row)
            {
                cells[i]._row--;
            }
            else
            {
                if ((cells[i]._row + cells[i]._rowspan - 1) >= row)
                {
                    subcells = cells[i]._subcells;

                    for (j = 0; j < subcells.length; j++)
                    {
                        subcell = subcells[j];
                        if (subcell._row + cells[i]._row == row)
                        {
                            subcells.splice(j, 1);
                            for (k = j; k < subcells.length; k++)
                            {
                                subcells[k]._cellidx--;
                            }
                            j--;
                        }
                        else if (subcell._row + cells[i]._row > row)
                        {
                            subcell._row--;
                        }
                        else if (subcell._row + cells[i]._row < row && (subcell._row + cells[i]._row + subcell._rowspan - 1) >= row)
                        {
                            subcell._rowspan--;
                        }
                    }
                    cells[i]._rowspan--;
                }
            }
        }
        this._arrangeCellIdx(band);
        this._updateFormatStr();
    };

    _pGridFormat._deleteRow = function (band, row)
    {
        band = band.toLowerCase();

        if (band == "summary")
            band = "summ";

        this._deleteRowCell(band, row);

        var rows = this._bodyrows;

        if (band == "head")
        {
            rows = this._headrows;
        }
        else if (band == "summ")
        {
            rows = this._summrows;
        }

        if (rows == null || rows.length == 0 || rows.length <= row)
            return -1;

        this._updateGroupInfoRow(band, row, "D");

        var size = rows[row].size;
        rows.splice(row, 1);

        var rowsLen = rows.length;
        for (var i = row; i < rowsLen; i++)
        {
            rows[i].top -= size;
            rows[i].bottom -= size;
        }
        if (band == "head")
            this.headHeight -= size;
        else if (band == "summ")
            this.summHeight -= size;
        else
            this._body_height = this.bodyHeight -= size;

        return row;
    };

    _pGridFormat.deleteContentsRow = function (strBand, nSubRowIndex, bBandIndex)
    {
        var bandtype = "";

        if (bBandIndex == undefined)
            bBandIndex = true;

        if (strBand != undefined)
        {
            var bandidx = parseInt(strBand, 10);
            if (isFinite(bandidx))
            {
                if (bandidx == -1)
                    bandtype = "head";
                else if (bandidx == -2)
                    bandtype = "summ";
                else if (bandidx >= 0)
                    bandtype = "body";
            }
            else if (strBand.length)
            {
                bandtype = strBand.toLowerCase();
            }

            if (bandtype == "")
                return -1;
        }

        var retn = this._deleteRow(bandtype, nSubRowIndex);

        if (retn != -1)
        {
            if (this._grid.getFormatRowCount() == 0)
            {
                var cols = this._cols;
                cols.splice(0, cols.length);
                this.leftWidth = 0;
                this.rightWidth = 0;
                this.bodyWidth = 0;
                this._bodyWidth = 0;
                this.endbodycol = 0;

                cols = null;
            }

            this._updateFormatStr(bandtype.toLowerCase());
        }

        return retn;
    };

    _pGridFormat._updateGroupInfoRow = function (bandtype, param, act)
    {
        var group_info = this._group_info;
        if (group_info)
        {
            var addcells;
            if (bandtype == "head")
                addcells = group_info.headcellinfos;
            else if (bandtype == "body")
                addcells = group_info.bodycellinfos;
            else
                addcells = group_info.summcellinfos;

            var bupdate = false;
            var row;
            var cellinfo = param;

            if (act == "I" || act == "A")
            {
                if (group_info.startcol <= cellinfo._col && group_info.endcol >= cellinfo._col)
                {
                    cellinfo._groupcol = cellinfo._col - group_info.startcol;
                    bupdate = true;
                }
                else if (group_info.startcol == cellinfo._col)
                {
                    bupdate = true;
                }
            }
            else
            {
                row = param;
                bupdate = true;
            }

            if (bupdate)
            {
                if (act == "I" || act == "A")
                    addcells.splice(cellinfo._row, 0, cellinfo);
                else if (act == "D")
                    addcells.splice(row, 1);
            }
        }
    };

    _pGridFormat._insertContentsRow = function (bandtype, bandobj, bandcells, bandrows, rowfunc, addfunc, insertidx)
    {
        var rowSize = this._defaultRowSize;
        this[rowfunc](insertidx, rowSize);
        var cellsize = (bandcells) ? bandcells.length : 0;
        var colsize = this._cols.length;
        var cellobj = null;

        if (colsize == 0)
        {
            this._addBodyColumn(this._defaultColSize);
            colsize = this._cols.length;
        }

        var mergecells = [];
        var i, j;
        for (i = 0; i < cellsize; i++)
        {
            cellobj = bandcells[i];

            if (cellobj._row < insertidx)
            {
                if ((cellobj._row + cellobj._rowspan - 1) >= insertidx)
                    mergecells.push(cellobj);
            }
            else
            {
                cellobj._row++;
            }
        }

        if (mergecells.length > 0)
        {
            var mergecell, subcells;
            var skip_cells = [];

            for (i = 0; i < mergecells.length; i++)
            {
                mergecell = mergecells[i];
                subcells = mergecell._subcells;
                mergecell._rowspan++;
                skip_cells.push(mergecell._col);

                if (subcells.length)
                {
                    for (j = 0; j < subcells.length; j++)
                    {
                        if (subcells[j]._row >= insertidx - mergecell._row)
                            subcells[j]._row++;
                    }

                    for (j = mergecell._col; j < mergecell._col + mergecell._colspan; j++)
                    {
                        cellobj = new nexacro.GridCellInfo(bandtype + mergecell._cellidx + "_sub" + subcells.length, bandobj, this.parent, bandtype, subcells.length);
                        cellobj.celltype = bandtype;
                        cellobj._col = j - mergecell._col;
                        cellobj._colspan = 1;
                        cellobj._row = insertidx - mergecell._row;
                        cellobj._rowspan = 1;
                        cellobj._endcol = ((j + 1) == this.endbodycol);

                        this._updateGroupInfoRow(bandtype, cellobj, "I");
                        this._addCell(subcells, cellobj);
                    }
                    mergecell._subcells = this._arrangeCellIdx2(subcells, mergecell._rowspan);
                }
            }

            if (mergecell)
            {
                for (i = 0; i < colsize; i++)
                {
                    if (skip_cells[0] == i)
                    {
                        skip_cells.splice(0, 1);
                        continue;
                    }
                    cellobj = new nexacro.GridCellInfo(bandtype + cellsize, bandobj, this.parent, bandtype, cellsize);
                    cellobj.celltype = bandtype;
                    cellobj._col = i;
                    cellobj._colspan = 1;
                    cellobj._row = insertidx;
                    cellobj._rowspan = 1;
                    cellobj._endcol = ((i + 1) == this.endbodycol);

                    this._updateGroupInfoRow(bandtype, cellobj, "I");
                    this[addfunc](cellobj);
                    cellsize++;
                }
            }
        }
        else
        {
            for (i = 0; i < colsize; i++)
            {
                cellobj = new nexacro.GridCellInfo(bandtype + cellsize, bandobj, this.parent, bandtype, cellsize);
                cellobj.celltype = bandtype;
                cellobj._col = i;
                cellobj._colspan = 1;
                cellobj._row = insertidx;
                cellobj._rowspan = 1;
                cellobj._endcol = ((i + 1) == this.endbodycol);

                var group_info = this._group_info;
                if (group_info)
                {
                    if (group_info.startcol <= cellobj._col && group_info.endcol >= cellobj._col)
                        cellobj._groupcol = cellobj._col - group_info.startcol;
                }

                this._updateGroupInfoRow(bandtype, cellobj, "I");
                this[addfunc](cellobj);
                cellsize++;
            }
        }
        this._arrangeCellIdx(bandtype);
        this._updateFormatStr();
        return insertidx;
    };

    _pGridFormat.insertContentsRow = function (strBand, nSubRowIndex, bBandIndex)
    {
        var bandtype = "";

        if (bBandIndex == undefined)
            bBandIndex = true;

        if (strBand != undefined)
        {
            var bandidx = parseInt(strBand, 10);
            if (isFinite(bandidx))
            {
                if (bandidx == -1)
                    bandtype = "head";
                else if (bandidx == -2)
                    bandtype = "summ";
                else if (bandidx >= 0)
                    bandtype = "body";
            }
            else if (strBand.length)
            {
                bandtype = strBand.toLowerCase();
            }

            if (bandtype == "")
                return -1;
        }

        var row = -1;

        if (nSubRowIndex < 0)
            return -1;

        var bandobj, bandcells, bandrows, rowfunc, addfunc;

        if (bandtype == "head")
        {
            if (this._headband == null)
                this._headband = new nexacro.GridBandInfo("head", "head", this, this.parent);

            bandobj = this._headband;
            bandcells = this._headcells;
            bandrows = this._headrows;
            rowfunc = "_insertHeadRow";
            addfunc = "_addHeadCell";

            if (bandrows && nSubRowIndex > bandrows.length)
                nSubRowIndex = bandrows.length;

            row = this._insertContentsRow("head", bandobj, bandcells, bandrows, rowfunc, addfunc, nSubRowIndex);
        }
        else if (bandtype == "summ" || bandtype == "summary")
        {
            if (this._summband == null)
                this._summband = new nexacro.GridBandInfo("summary", "summ", this, this.parent);

            bandobj = this._summband;
            bandcells = this._summcells;
            bandrows = this._summrows;
            rowfunc = "_insertSummRow";
            addfunc = "_addSummCell";

            if (bandrows && nSubRowIndex > bandrows.length)
                nSubRowIndex = bandrows.length;

            row = this._insertContentsRow("summary", bandobj, bandcells, bandrows, rowfunc, addfunc, nSubRowIndex);
        }
        else
        {
            if (this._bodyband == null)
                this._bodyband = new nexacro.GridBandInfo("body", "body", this, this.parent);

            bandobj = this._bodyband;
            bandcells = this._bodycells;
            bandrows = this._bodyrows;
            rowfunc = "_insertBodyRow";
            addfunc = "_addBodyCell";

            if (bandrows && nSubRowIndex > bandrows.length)
                nSubRowIndex = bandrows.length;

            row = this._insertContentsRow("body", bandobj, bandcells, bandrows, rowfunc, addfunc, nSubRowIndex);
        }

        return row;
    };

    _pGridFormat._deleteColCell = function (col)
    {
        var hcells = this._headcells;
        var scells = this._summcells;
        var bcells = this._bodycells;
        var endcol = (this._cols) ? (this._cols.length - 1) : -1;

        if (!hcells && !scells && !bcells)
        {
            return undefined;
        }

        var delproc = function (cells, col)
        {
            if (!cells) return;

            for (var i = 0; i < cells.length; i++)
            {
                if (cells[i]._col == endcol)
                    cells[i]._endcol = true;
                else
                    cells[i]._endcol = false;

                if (cells[i]._col == col)
                {
                    var colspan = cells[i]._colspan;
                    // var rowspan = cells[i]._rowspan;

                    if (colspan == 1)
                    {
                        delete cells[i];
                        cells.splice(i, 1);
                        for (var j = i; j < cells.length; j++)
                        {
                            cells[j]._cellidx--;
                        }
                        i--;
                    }
                    else
                    {
                        col = cells[i]._col;
                        cells[i]._colspan--;

                        delproc(cells[i]._subcells, 0);
                    }
                }
                else if (cells[i]._col > col)
                {
                    cells[i]._col--;
                }
                else
                {
                    if ((cells[i]._col + cells[i]._colspan - 1) >= col)
                    {
                        cells[i]._colspan--;

                        var idx = col - cells[i]._col;
                        delproc(cells[i]._subcells, idx);
                    }
                }
            }
        };

        delproc(hcells, col);
        delproc(scells, col);
        delproc(bcells, col);
    };

    _pGridFormat._deleteColumn = function (area, col)
    {
        var cols = this._cols;

        if (cols == null || cols.length == 0 || cols.length <= col)
            return -1;

        if (cols[col]._area != area)
            return -1;

        if (cols[col].groupcol >= 0)
        {
            if (this._group_info && this._group_info.endcol >= 0)
                this._group_info.endcol--;
        }

        this._deleteColCell(col);
        var size = cols[col].getSize();
        cols.splice(col, 1);

        var colsLen = cols.length;
        var i;

        if (area == "left")
        {
            for (i = col; i < colsLen; i++)
            {
                if (cols[i]._area == "left")
                {
                    cols[i].left -= size;
                    cols[i].right -= size;
                }
            }
            this.leftWidth -= size;
        }
        else if (area == "right")
        {
            for (i = col; i < colsLen; i++)
            {
                if (cols[i]._area == "right")
                {
                    cols[i].left -= size;
                    cols[i].right -= size;
                }
            }
            this.rightWidth -= size;
        }
        else
        {
            for (i = col; i < colsLen; i++)
            {
                if (cols[i]._area == "body")
                {
                    cols[i].left -= size;
                    cols[i].right -= size;
                }
            }
            this.bodyWidth -= size;
            this._bodyWidth = this.bodyWidth;
            this.endbodycol = this._cols.length;
        }
        return col;
    };

    _pGridFormat._getColFixCnt = function (area)
    {
        var leftcnt = 0;
        var bodycnt = 0;
        var rightcnt = 0;
        var _cols = this._cols;
        var _colsLen = _cols.length;

        for (var i = 0; i < _colsLen; i++)
        {
            if (_cols[i]._area == "left")
                leftcnt++;
            else if (_cols[i]._area == "body")
                bodycnt++;
            else if (_cols[i]._area == "right")
                rightcnt++;
        }
        if (area == "left")
            return leftcnt;
        else if (area == "right")
            return rightcnt;
        else
            return bodycnt;
    };

    _pGridFormat.deleteContentsCol = function (strBand, nColIndex, bBandIndex)
    {
        if (bBandIndex == undefined)
            bBandIndex = false;

        var areatype = "body";
        if (strBand != undefined)
        {
            var areaidx = parseInt(strBand, 10);
            if (isFinite(areaidx))
            {
                if (nColIndex != undefined)
                {
                    if (areaidx == -1)
                        areatype = "left";
                    else if (areaidx == -2)
                        areatype = "right";
                    else
                        areatype = "body";

                    if (nColIndex < 0)
                        return -1;
                    else if (nColIndex > this._cols.length)
                        return -1;
                }
                else
                {
                    if (areaidx < 0)
                        return -1;
                    else if (areaidx > this._cols.length)
                        return -1;

                    nColIndex = areaidx;
                }
            }
            else if (strBand.length)
            {
                areatype = strBand.toLowerCase();
                if (nColIndex == undefined)
                    return -1;
            }
        }

        if (bBandIndex == true)
        {
            if (areatype == "body")
            {
                nColIndex += this._getColFixCnt("left");
            }
            else if (areatype == "right")
            {
                nColIndex += this._getColFixCnt("left");
                nColIndex += this._getColFixCnt("body");
            }
        }
        else
        {
            var lcnt = this._getColFixCnt("left");
            var bcnt = this._getColFixCnt("body");
            var rcnt = this._getColFixCnt("right");

            if (nColIndex < lcnt)
                areatype = "left";
            else if (nColIndex >= lcnt + bcnt && nColIndex < lcnt + bcnt + rcnt)
                areatype = "right";
            else
                areatype = "body";
        }

        if (this._cols.length <= nColIndex || nColIndex < 0)
            return -1;

        var retn = this._deleteColumn(areatype, nColIndex);

        if (retn != -1)
        {
            if (this._grid.getFormatColCount() == 0)
            {
                if (this._headrows)
                {
                    this._headrows.splice(0, this._headrows.length);
                    this.headHeight = 0;
                }
                if (this._summrows)
                {
                    this._summrows.splice(0, this._summrows.length);
                    this.summHeight = 0;
                }
                if (this._bodyrows)
                {
                    this._bodyrows.splice(0, this._bodyrows.length);
                    this._body_height = 0;
                    this.bodyHeight = 0;
                }
            }

            this._updateFormatStr();
            this._rearrangeCols();
        }
        return retn;
    };

    _pGridFormat.mergeContentsCell = function (strBand, nStartRow, nStartCol, nEndRow, nEndCol, nFirstCell, bKeepSubCell)
    {
        var bandtype = strBand.toLowerCase();
        if (bandtype != "head" && bandtype != "summ")
        {
            if (bandtype == "summary")
                bandtype = "summ";
            else
                bandtype = "body";
        }

        var startRow = parseInt(nStartRow, 10);
        var startCol = parseInt(nStartCol, 10);
        var endRow = parseInt(nEndRow, 10);
        var endCol = parseInt(nEndCol, 10);
        var firstCell = parseInt(nFirstCell, 10);

        if (!isFinite(startRow) || !isFinite(startCol) || !isFinite(endRow) || !isFinite(endCol))
        {
            return -1;
        }
        if (startCol > endCol || startRow > endRow)
        {
            return -1;
        }
        var colCount = this._cols.length;
        if (startCol < 0 || startCol >= colCount || endCol < 0 || endCol >= colCount)
        {
            return -1;
        }
        var bandrows = null;
        var bandcells = null;
        if (bandtype == "head")
        {
            bandrows = this._headrows;
            bandcells = this._headcells;
        }
        else if (bandtype == "summ")
        {
            bandrows = this._summrows;
            bandcells = this._summcells;
        }
        else
        {
            bandrows = this._bodyrows;
            bandcells = this._bodycells;
        }
        var cellCount = (bandcells) ? bandcells.length : 0;
        var rowCount = (bandrows) ? bandrows.length : 0;
        if (cellCount == 0)
        {
            return -1;
        }
        if (startRow < 0 || startRow >= rowCount || endRow < 0 || endRow >= rowCount)
        {
            return -1;
        }

        var area;
        var merged_check = -1;
        var merged_matrix = [];
        var i;
        var cell;
        for (i = 0; i < cellCount; i++)
        {
            cell = bandcells[i];
            if ((cell._row >= startRow && cell._row <= endRow) && (cell._col >= startCol && cell._col <= endCol))
            {
                // 2개이상의 band를 포함한 영역은 merge 되지 않음(단일 band)
                if (area && area != bandcells[i]._area)
                {
                    return -1;
                }
                else
                {
                    area = bandcells[i]._area;
                }
                merged_matrix[i] = true;
                if (cell._rowspan > 1 || cell._colspan > 1)
                {
                    merged_check = i;
                }
            }
            else
            {
                merged_matrix[i] = false;
            }
        }

        if (merged_check >= 0 && bandcells[merged_check]._rowspan > endRow && bandcells[merged_check]._colspan > endCol)
        {
            return -1;
        }

        if (!firstCell || firstCell < 0)
            firstCell = 0;

        var cellidx = -1;
        var first = bandcells[firstCell]; // for keepsubcell == false
        var subcells = [];

        if (!bKeepSubCell && !first)
            return -1;

        for (i = cellCount - 1; i >= 0; i--)
        {
            // cell = bandcells[i];
            // var row = cell._row;
            // var col = cell._col;

            if (merged_matrix[i])
            {
                if (bKeepSubCell)
                {
                    if (bandcells[i]._col == startCol && bandcells[i]._row == startRow)
                    {
                        // make parent merge cell
                        var cellinfo = new nexacro.GridCellInfo(bandcells[i].id, bandcells[i].parent, bandcells[i]._grid, bandcells[i].celltype, bandcells[i]._cellidx);
                        cellinfo._row = bandcells[i]._row;
                        cellinfo._rowspan = (endRow - startRow) + 1;
                        cellinfo._col = bandcells[i]._col;
                        cellinfo._colspan = (endCol - startCol) + 1;
                        cellinfo._isSubCell = false;
                        cellinfo._area = bandcells[i]._area;
                        cellinfo._endcol = bandcells[i]._endcol;

                        var group_info = this._group_info;
                        if (group_info)
                        {
                            if (group_info.startcol <= cellinfo._col && group_info.endcol >= cellinfo._col)
                                cellinfo._groupcol = cellinfo._col - group_info.startcol;
                        }

                        // insert FirstCell
                        subcells.unshift(bandcells[i]);

                        for (var j = 0; j < subcells.length; j++)
                        {
                            subcells[j]._col -= cellinfo._col;
                            subcells[j]._row -= cellinfo._row;
                            subcells[j]._cellidx = j;
                            subcells[j]._isSubCell = true;
                            subcells[j]._id = subcells[j].name = bandcells[i].id + "_sub" + j;
                        }

                        // insert bandcells & initialize subcells
                        cellinfo._subcells = subcells;
                        bandcells[i] = cellinfo;
                        subcells = [];
                        cellidx = i;
                    }
                    else
                    {
                        // current cell make by subcells
                        subcells.unshift(bandcells[i]);

                        // current cell is delete after make subcells
                        bandcells.splice(i, 1);
                    }
                }
                else
                {
                    if (first._row < startRow || first._row > endRow || first._col < startCol || first._col > endCol)
                        return -1;

                    if (bandcells[i]._col == startCol && bandcells[i]._row == startRow)
                    {
                        cellidx = bandcells[i]._cellidx;
                        first._row = bandcells[i]._row;
                        first._col = bandcells[i]._col;
                        first._rowspan = (endRow - startRow) + 1;
                        first._colspan = (endCol - startCol) + 1;
                        bandcells[i] = first;
                    }
                    else
                    {
                        bandcells.splice(i, 1);
                    }
                }
            }
        }

        var bandcellsLen = bandcells.length;
        for (i = 0; i < bandcellsLen; i++)
        {
            bandcells[i]._cellidx = i;
        }

        this._updateFormatStr();
        return cellidx;
    };

    _pGridFormat.splitContentsCell = function (strBand, nStartRow, nStartCol, nEndRow, nEndCol, bMakeSubCell)
    {
        var band_rows = null;
        var band_cells = null;
        var band_cols = this._cols;
        var band_type = strBand.toLowerCase();

        if (band_type == "head")
        {
            band_rows = this._headrows;
            band_cells = this._headcells;
        }
        else if (band_type == "summ" || band_type == "summary")
        {
            band_rows = this._summrows;
            band_cells = this._summcells;
        }
        else
        {
            band_rows = this._bodyrows;
            band_cells = this._bodycells;
        }

        var row_count = (band_rows) ? band_rows.length : 0;
        var col_count = (band_cols) ? band_cols.length : 0;

        if (row_count > 0 && col_count > 0)
        {
            // 잘못 된 인자는 가까운 유효한 값으로 설정
            if (nStartRow < 0 || nEndRow >= row_count)
            {
                if (nStartRow < 0)
                {
                    nStartRow = 0;
                }
                else
                {
                    nEndRow = row_count - 1;
                }
            }
            if (nStartCol < 0 || nEndCol >= col_count)
            {
                if (nStartCol < 0)
                {
                    nStartCol = 0;
                }
                else
                {
                    nEndCol = col_count - 1;
                }
            }

            var matrix = [];
            var cell_idx = 0;
            var split_cell = 0;
            var subcells = null;
            var current_merge_col = null;
            var current_merge_row = null;
            var i;

            if (band_cells)
            {
                for (i = 0; i < band_cells.length; i++)
                {
                    var row = band_cells[i]._row;
                    var col = band_cells[i]._col;
                    var area = band_cells[i]._area;

                    // reset cellidx
                    band_cells[i]._cellidx = col + (col_count * row);

                    subcells = band_cells[i]._subcells;
                    current_merge_col = (band_cells[i]._colspan + band_cells[i]._col) - 1;
                    current_merge_row = (band_cells[i]._rowspan + band_cells[i]._row) - 1;
                    var j;

                    if (subcells.length > 0)
                    {
                        if ((current_merge_col >= nStartCol && current_merge_col <= nEndCol) && (current_merge_row >= nStartRow && current_merge_row <= nEndRow))
                        {
                            // push subcells to matrix
                            for (j = 0; j < subcells.length; j++)
                            {
                                split_cell++;

                                subcells[j]._row = row;
                                subcells[j]._col = col;
                                subcells[j]._area = area;
                                subcells[j]._isSubCell = false;

                                // set subcell cellidx
                                if (band_cells[i + 1] && band_cells[i]._col < subcells[j]._col && subcells[j]._col < band_cells[i + 1]._col)
                                {
                                    subcells[j]._cellidx = col + 1 + (col_count * row);
                                }
                                else
                                {
                                    subcells[j]._cellidx = col + (col_count * row);
                                }

                                // subcell이 병합된 경우에도 변경없이 적용
                                var rowspan = subcells[j]._rowspan;
                                var colspan = subcells[j]._colspan;
                                col = col + colspan;
                                if (band_cells[i]._col + (band_cells[i]._colspan - 1) < col)
                                {
                                    row = row + rowspan;
                                    col = band_cells[i]._col;
                                }
                                matrix.push(subcells[j]);
                            }
                            // subcell 중복 생성 제어
                            band_cells[i]._subcells = [];
                            band_cells[i].destroy();
                        }
                        else // not split
                        {
                            band_cells[i]._cellidx = band_cells[i]._col + (band_cells[i]._row * col_count);
                            matrix.push(band_cells[i]);
                        }
                    }
                    else
                    {
                        if (bMakeSubCell)
                        {
                            if ((current_merge_col >= nStartCol && current_merge_col <= nEndCol) && (current_merge_row >= nStartRow && current_merge_row <= nEndRow))
                            {
                                if ((band_cells[i]._rowspan * band_cells[i]._colspan) > 1)
                                {
                                    var make_cell = null;
                                    matrix.push(band_cells[i]);
                                    for (j = 0; j < (band_cells[i]._rowspan * band_cells[i]._colspan) - 1; j++)
                                    {
                                        split_cell++;
                                        make_cell = new nexacro.GridCellInfo(band_type + cell_idx, band_cells[i].parent, band_cells[i]._grid, band_cells[i].celltype, cell_idx++);

                                        make_cell._area = area;
                                        make_cell._rowspan = 1;
                                        make_cell._colspan = 1;

                                        make_cell._isSubCell = false;
                                        make_cell.text._set(band_cells[i].text._value);

                                        if (col < band_cells[i]._col + (band_cells[i]._colspan - 1))
                                        {
                                            col++;
                                        }
                                        else
                                        {
                                            row++;
                                            col = band_cells[i]._col;
                                        }
                                        make_cell._cellidx = col + (col_count * row);
                                        make_cell._row = row;
                                        make_cell._col = col;
                                        matrix.push(make_cell);

                                        var group_info = this._group_info;
                                        if (group_info)
                                        {
                                            if (group_info.startcol <= make_cell._col && group_info.endcol >= make_cell._col)
                                                make_cell._groupcol = make_cell._col - group_info.startcol;
                                        }
                                    }
                                    band_cells[i]._colspan = 1;
                                    band_cells[i]._rowspan = 1;
                                }
                                else //not split
                                {
                                    matrix.push(band_cells[i]);
                                }
                            }
                            else //not split
                            {
                                matrix.push(band_cells[i]);
                            }
                        }
                        else // bMakeSubCell == false
                        {
                            matrix.push(band_cells[i]);
                        }
                    }
                }
            }

            // apply splitContentsCell
            if (split_cell > 0)
            {
                // cellindex sort
                matrix.sort(function (l, r) { return l._cellidx - r._cellidx; });

                // cellindex adjust
                for (i = 0; i < matrix.length; i++)
                {
                    matrix[i]._cellidx = i;
                }

                if (band_type == "head")
                {
                    this._headcells = matrix;
                }
                else if (band_type == "summ" || band_type == "summary")
                {
                    this._summcells = matrix;
                }
                else
                {
                    this._bodycells = matrix;
                }
                this._updateFormatStr();
                return split_cell;
            }
            // not splitContentsCell
        }
        return -1;
    };

    _pGridFormat.setBandProperty = function (strBand, strPropID, varValue)
    {
        var bandinfo = null;
        var bandtype = strBand.toLowerCase();

        if (bandtype == "head")
            bandinfo = this._headband;
        else if (bandtype == "summ" || bandtype == "summary")
            bandinfo = this._summband;
        else
            bandinfo = this._bodyband;

        if (bandinfo)
        {
            if (bandinfo["set_" + strPropID])
                bandinfo["set_" + strPropID](varValue);

            this._updateFormatStr();
            return bandinfo;
        }
        return undefined;
    };

    _pGridFormat.setSubCellProperty = function (strBand, nCellIdx, nSubCellIdx, strPropID, varValue)
    {
        var cellinfo = null;
        var bandtype = strBand.toLowerCase();

        if (bandtype == "head")
        {
            if (this._headband)
                cellinfo = this._headcells[nCellIdx];
        }
        else if (bandtype == "summ" || bandtype == "summary")
        {
            if (this._summband)
                cellinfo = this._summcells[nCellIdx];
        }
        else
        {
            if (this._bodyband)
                cellinfo = this._bodycells[nCellIdx];
        }

        if (cellinfo)
        {
            if (cellinfo._subcells.length > nSubCellIdx && nSubCellIdx >= 0)
            {
                cellinfo = cellinfo._subcells[nSubCellIdx];

                if (cellinfo)
                {
                    if (cellinfo["set_" + strPropID])
                        cellinfo["set_" + strPropID](varValue);

                    this._updateFormatStr();
                    return cellinfo;
                }
            }
        }
    };

    _pGridFormat.setCellProperty = function (strBand, nCellIdx, strPropID, varValue)
    {
        var cellinfo = null;
        var bandtype = strBand.toLowerCase();

        if (bandtype == "head")
        {
            if (this._headband)
            {
                cellinfo = this._headcells[nCellIdx];
                if (cellinfo && strPropID == "text")
                    cellinfo._value = undefined;
            }
        }
        else if (bandtype == "summ" || bandtype == "summary")
        {
            if (this._summband)
                cellinfo = this._summcells[nCellIdx];
        }
        else
        {
            if (this._bodyband)
                cellinfo = this._bodycells[nCellIdx];
        }

        if (cellinfo)
        {
            if (cellinfo["set_" + strPropID])
                cellinfo["set_" + strPropID](varValue);

            this._updateFormatStr();
            return cellinfo;
        }
    };

    _pGridFormat.getSubCellProperty = function (strBand, nCellIdx, nSubCellIdx, strPropID)
    {
        var cellinfo = null;
        var bandtype = strBand.toLowerCase();

        if (bandtype == "head")
        {
            if (this._headband)
                cellinfo = this._headcells[nCellIdx];
        }
        else if (bandtype == "summ" || bandtype == "summary")
        {
            if (this._summband)
                cellinfo = this._summcells[nCellIdx];
        }
        else
        {
            if (this._bodyband)
                cellinfo = this._bodycells[nCellIdx];
        }

        if (cellinfo)
        {
            if (cellinfo._subcells.length > nSubCellIdx && nSubCellIdx >= 0)
            {
                cellinfo = cellinfo._subcells[nSubCellIdx];

                if (cellinfo)
                {
                    var prop = cellinfo["_p_" + strPropID];
                    if (prop == undefined)
                        prop = cellinfo["_" + strPropID];

                    if (prop != undefined)
                    {
                        var type = typeof (prop);

                        if (type == "number" || type == "string")
                        {
                            return prop;
                        }
                        else
                        {
                            var val;

                            if (strPropID == "expr")
                            {
                                val = prop._bindexpr;
                            }
                            else
                            {
                                if (prop._bindtype == 2)
                                {
                                    val = prop._bindexpr;
                                    if (val.toLowerCase().indexOf("expr:") < 0)
                                        val = "expr:" + val;
                                }
                                else
                                {
                                    val = prop._value;
                                }
                            }

                            if (val)
                                return val;
                            else
                                return prop;
                        }
                    }
                }
            }
        }
        return undefined;
    };

    _pGridFormat.getCellProperty = function (strBand, nCellIdx, strPropID)
    {
        var cellinfo = null;
        var bandtype = strBand.toLowerCase();
        if (bandtype == "head")
        {
            if (this._headband)
                cellinfo = this._headcells[nCellIdx];
        }
        else if (bandtype == "summ" || bandtype == "summary")
        {
            if (this._summband)
                cellinfo = this._summcells[nCellIdx];
        }
        else
        {
            if (this._bodyband)
                cellinfo = this._bodycells[nCellIdx];
        }

        if (cellinfo)
        {
            if (strPropID == "subcell")
                return cellinfo._subcells.length;

            var prop = cellinfo["_p_" + strPropID];
            if (prop == undefined)
                prop = cellinfo["_" + strPropID];

            if (prop != undefined)
            {
                var type = typeof (prop);

                if (type == "number" || type == "string")
                {
                    return prop;
                }
                else
                {
                    var val;

                    if (prop instanceof nexacro.BindableValue)
                    {
                        if (strPropID == "expr")
                        {
                            val = prop._bindexpr;
                        }
                        else
                        {
                            if (prop._bindtype == 2)
                            {
                                val = prop._bindexpr;
                                if (val.toLowerCase().indexOf("expr:") < 0)
                                    val = "expr:" + val;
                            }
                            else
                            {
                                val = prop._value;
                            }
                        }
                    }
                    else
                    {
                        val = prop;
                    }

                    return val;
                }
            }
        }
        return null;
    };

    _pGridFormat.getSubCellPropertyValue = function (nRowidx, nCellIdx, nSubCellIdx, strPropID)
    {
        var cellinfo = null;

        if (nRowidx == -1)
        {
            if (this._headband)
                cellinfo = this._headcells[nCellIdx];
        }
        else if (nRowidx == -2)
        {
            if (this._summband)
                cellinfo = this._summcells[nCellIdx];
        }
        else if (nRowidx >= 0)
        {
            if (this._bodyband)
                cellinfo = this._bodycells[nCellIdx];
        }

        if (cellinfo)
        {
            if (cellinfo._subcells.length > nSubCellIdx && nSubCellIdx >= 0)
            {
                cellinfo = cellinfo._subcells[nSubCellIdx];

                if (cellinfo)
                {
                    var prop = cellinfo["_p_" + strPropID];
                    if (prop == undefined)
                        prop = cellinfo["_" + strPropID];

                    if (prop != undefined)
                    {
                        var val;
                        if (prop._bindtype > 0)
                            val = cellinfo._getAttrValue(prop, nRowidx);
                        else
                            val = prop;

                        return val;
                    }
                }
            }
        }
        return undefined;
    };

    _pGridFormat.getCellPropertyValue = function (nRowidx, nCellIdx, strPropID)
    {
        var cellinfo = null;

        if (nRowidx == -1)
        {
            if (this._headband)
                cellinfo = this._headcells[nCellIdx];
        }
        else if (nRowidx == -2)
        {
            if (this._summband)
                cellinfo = this._summcells[nCellIdx];
        }
        else if (nRowidx >= 0)
        {
            if (this._bodyband)
                cellinfo = this._bodycells[nCellIdx];
        }

        if (cellinfo)
        {
            if (strPropID == "subcell")
                return cellinfo._subcells.length;

            var prop = cellinfo["_p_" + strPropID];
            if (prop == undefined)
                prop = cellinfo["_" + strPropID];

            if (prop != undefined)
            {
                var val;
                if (prop._bindtype >= 0)
                    val = cellinfo._getAttrValue(prop, nRowidx);
                else
                    val = prop;

                return val;
            }
        }
        return null;
    };

    _pGridFormat.getBandProperty = function (strBand, strPropID)
    {
        var bandinfo = null;
        var bandtype = strBand.toLowerCase();

        if (bandtype == "head")
            bandinfo = this._headband;
        else if (bandtype == "summ" || bandtype == "summary")
            bandinfo = this._summband;
        else
            bandinfo = this._bodyband;

        if (bandinfo)
        {
            var prop = bandinfo["_p_" + strPropID];
            if (prop == undefined)
                prop = bandinfo["_" + strPropID];

            if (prop != undefined)
            {
                var type = typeof (prop);

                if (type == "number" || type == "string")
                {
                    return prop;
                }
                else
                {
                    var val;

                    if (strPropID == "expr")
                        val = prop._bindexpr;
                    else
                        val = prop._value;

                    if (val)
                        return val;
                    else
                        return prop;
                }
            }
        }
        return null;
    };

    _pGridFormat._adjustFormatColSize = function (is_change_area, no_update_xml)
    {
        var len = this._cols.length;
        var leftOffset = 0;
        var bodyOffset = 0;
        var rightOffset = 0;
        var col = null;

        for (var i = 0; i < len; i++)
        {
            col = this._cols[i];
            if (col._area == "left")
            {
                col.left = leftOffset;
                leftOffset += col.getSize();
                col.right = leftOffset;
            }
            else if (col._area == "right")
            {
                col.left = rightOffset;
                rightOffset += col.getSize();
                col.right = rightOffset;
            }
            else
            {
                col.left = bodyOffset;
                bodyOffset += col.getSize();
                col.right = bodyOffset;
            }
            // area 변경시 org 값도 수정되야함
            if (is_change_area)
            {
                col.orgleft = col.left;
                col.orgright = col.right;
            }
        }
        this.leftWidth = leftOffset;
        this._bodyWidth = this.bodyWidth = bodyOffset;
        this.rightWidth = rightOffset;

        if (!no_update_xml)
            this._updateFormatStr();
    };

    _pGridFormat._adjustFormatColOrgSize = function ()
    {
        var len = this._cols.length;
        var leftOffset = 0;
        var bodyOffset = 0;
        var rightOffset = 0;
        var col = null;

        for (var i = 0; i < len; i++)
        {
            col = this._cols[i];
            if (col._area == "left")
            {
                col.orgleft = leftOffset;
                leftOffset += col.orgsize;
                col.orgright = leftOffset;
            }
            else if (col._area == "right")
            {
                col.orgleft = rightOffset;
                rightOffset += col.orgsize;
                col.orgright = rightOffset;
            }
            else
            {
                col.orgleft = bodyOffset;
                bodyOffset += col.orgsize;
                col.orgright = bodyOffset;
            }
        }

        this._orgleftWidth = leftOffset;
        this._orgrightWidth = rightOffset;
        this._orgbodyWidth = bodyOffset;
    };

    _pGridFormat._setColSize = function (nColIdx, nValue, noUpdate)
    {
        if (this._cols)
        {
            var column = this._cols[nColIdx];
            var size = parseFloat(nValue, 10);

            if (column && isFinite(size))
            {
                var oldSize = column.size;

                if (size != oldSize)
                {
                    column.size = size;
                    this._adjustFormatColSize(false, noUpdate);

                    return true;
                }
                return false;
            }
        }
    };

    _pGridFormat._getColSizeRange = function (nBegColIdx, nEndColidx)
    {
        if (this._cols)
        {
            var tt = 0;
            for (var i = nBegColIdx; i <= nEndColidx; i++)
            {
                var column = this._cols[i];
                tt += column.getSize();
            }
            return tt;
        }
        return 0;
    };

    _pGridFormat._isExistMergeCell = function (colidx)
    {
        function chkMerge(cells)
        {
            if (!cells)
                return false;

            var celllen = cells.length;

            for (var i = 0; i < celllen; i++)
            {
                var cellobj = cells[i];

                if (cellobj._colspan > 1)
                {
                    if (cellobj._col <= colidx && (cellobj._col + cellobj._colspan - 1) >= colidx)
                        return true;
                }
            }
        }

        if (!chkMerge(this._headcells))
        {
            if (!chkMerge(this._bodycells))
            {
                if (!chkMerge(this._summcells))
                    return false;
            }
        }

        return true;
    };

    _pGridFormat.setFormatColProperty = function (nColIdx, strPropID, nValue)
    {
        if (this._cols)
        {
            var i;
            if (strPropID == "size")
            {
                var column = this._cols[nColIdx];
                var size = parseInt(nValue, 10);
                if (column && isFinite(size))
                {
                    var oldSize = column.size;
                    if (size != oldSize)
                    {
                        //format size를 변경한 것이기 때문에 orgsize도 동일하게 설정
                        column.size = column.orgsize = size;
                        column.orgright = column.orgleft + size;

                        var cols = this._cols;
                        var cols_len = cols.length;
                        var area = column._area;
                        var colleft = column.orgright;

                        for (i = nColIdx + 1; i < cols_len; i++)
                        {
                            if (area == cols[i]._area)
                            {
                                cols[i].orgleft = colleft;
                                cols[i].orgright = colleft + cols[i].orgsize;
                                colleft = cols[i].orgright;
                            }
                        }

                        this._adjustFormatColSize();
                        this._adjustFormatColOrgSize();
                        return true;
                    }
                    return false;
                }
            }
            else if (strPropID == "group")
            {
                return false;   // 동적 변경 불가능
            }
            else if (strPropID == "visible")
            {
                if (this._isExistMergeCell(nColIdx) || this._cols.length <= nColIdx)
                    return false;

                var column = this._cols[nColIdx];
                var val = nexacro._toBoolean(nValue);

                column[strPropID] = val;
                this._adjustFormatColSize();

                return true;
            }
            else if (strPropID == "band")
            {
                var val = nValue.toLowerCase();
                var _cols = this._cols;
                // var _colsLen = this._cols.length;
                var col, change = false;

                function isChangeAble(bandcells)
                {
                    if (!bandcells)
                        return true;

                    var celllen = bandcells.length;

                    for (var i = 0; i < celllen; i++)
                    {
                        var cellobj = bandcells[i];

                        if (val == "left" && cellobj._col <= nColIdx && (cellobj._col + cellobj._colspan - 1) > nColIdx)
                        {
                            return false;
                        }
                        else if (val != "left" && cellobj._col <= nColIdx && (cellobj._col + cellobj._colspan - 1) >= nColIdx)
                        {
                            if (cellobj._colspan > 1)
                            {
                                if (cellobj._col != nColIdx)
                                    return false;
                            }
                        }
                    }
                    return true;
                }

                var isAble = isChangeAble(this._headcells) && isChangeAble(this._bodycells) && isChangeAble(this._summcells);

                if (!isAble)
                    return false;

                for (i = 0; i < this._cols.length; i++)
                {
                    col = _cols[i];
                    if (val == "left")
                    {
                        if (i <= nColIdx && col._area != "left")
                        {
                            col._area = "left";
                            change = true;
                        }
                    }
                    else if (val == "right")
                    {
                        if (i >= nColIdx && col._area != "right")
                        {
                            col._area = "right";
                            change = true;
                        }
                    }
                    else
                    {
                        if ((i >= nColIdx && col._area == "left") || (i <= nColIdx && col._area == "right"))
                        {
                            col._area = "body";
                            change = true;
                        }
                    }
                }

                function _apply_area(cells)
                {
                    if (cells)
                    {
                        var cellsLen = cells.length;
                        var cellinfo;

                        for (var i = 0; i < cellsLen; i++)
                        {
                            cellinfo = cells[i];
                            if (val == "left")
                            {
                                if (cellinfo._col <= nColIdx)
                                    cellinfo._area = "left";
                            }
                            else if (val == "right")
                            {
                                if (cellinfo._col >= nColIdx)
                                    cellinfo._area = "right";
                            }
                            else
                            {
                                if ((cellinfo._col >= nColIdx && cellinfo._area == "left") || (cellinfo._col <= nColIdx && cellinfo._area == "right"))
                                    cellinfo._area = "body";
                            }
                        }
                    }
                }
                if (change)
                {
                    _apply_area(this._headcells);
                    _apply_area(this._bodycells);
                    _apply_area(this._summcells);
                    this._adjustFormatColSize(true);
                }
                return change;
            }
        }
        return false;
    };

    _pGridFormat.getFormatColProperty = function (nColIdx, strPropID)
    {
        if (this._cols)
        {
            var column;
            if (strPropID == "size")
            {
                column = this._cols[nColIdx];
                if (column)
                    return column.orgsize;
            }
            else if (strPropID == "band")
            {
                column = this._cols[nColIdx];
                if (column)
                    return column._area;
            }
            else if (strPropID == "group")
            {
                column = this._cols[nColIdx];
                if (column)
                    return column.group;
            }
            else if (strPropID == "visible")
            {
                column = this._cols[nColIdx];
                if (column)
                    return column.visible;
            }
            else if (strPropID == "fix")
            {
                column = this._cols[nColIdx];
                if (column)
                {
                    if (column._area == "left" || column._area == "right")
                        return "fixed";
                    else
                        return "";
                }
            }
        }
        return null;
    };

    _pGridFormat._adjustFormatRowSize = function (rows)
    {
        var len = rows.length;
        var bodyOffset = 0;
        var row = null;
        for (var i = 0; i < len; i++)
        {
            row = rows[i];
            row.top = bodyOffset;
            bodyOffset += row.size;
            row.bottom = bodyOffset;
        }
        return bodyOffset;
    };

    _pGridFormat.setFormatRowProperty = function (nRowIdx, strPropID, nValue)
    {
        if (strPropID == "size")
        {
            var size = parseInt(nValue, 10);
            if (isFinite(size))
            {
                var idx = nRowIdx;
                var headCount = (this._headrows) ? this._headrows.length : 0;
                var height;

                if (idx < headCount)
                {
                    this._headrows[idx].size = size;
                    height = this.headHeight;
                    this.headHeight = this._adjustFormatRowSize(this._headrows);

                    if (this.headHeight != height)
                        return true;

                    return false;
                }
                else
                {
                    idx -= headCount;
                }

                var bodyCount = (this._bodyrows) ? this._bodyrows.length : 0;

                if (idx < bodyCount)
                {
                    this._bodyrows[idx].size = size;
                    height = this.bodyHeight;
                    this._body_height = this.bodyHeight = this._adjustFormatRowSize(this._bodyrows);

                    if (this.bodyHeight != height)
                        return true;

                    return false;
                }
                else
                {
                    idx -= bodyCount;
                }

                var summCount = (this._summrows) ? this._summrows.length : 0;

                if (idx < summCount)
                {
                    this._summrows[idx].size = size;
                    height = this.summHeight;
                    this.summHeight = this._adjustFormatRowSize(this._summrows);

                    if (this.summHeight != height)
                        return true;

                    return false;
                }
            }
        }
        else if (strPropID == "band")
        {
            // var idx = nRowIdx;
            // var val = nValue.toLowerCase();

            return false;	// todo
            /*
            var headCount = (this._headrows) ? this._headrows.length : 0;
            if (idx < headCount)
            {
                var row = this._headrows[idx];

                if (val == "body")
                {
                    this._bodyrows.push(row);
                    this._headrows.splice(idx, 1);

                    this._body_height = this.bodyHeight = this._adjustFormatRowSize(this._bodyrows);
                    this.headHeight = this._adjustFormatRowSize(this._headrows);
                    return true;

                }
                else if (val == "summ" || val == "summary")
                {
                    this._summrows.push(row);
                    this._headrows.splice(idx, 1);

                    this.summHeight = this._adjustFormatRowSize(this._summrows);
                    this.headHeight = this._adjustFormatRowSize(this._headrows);
                    return true;
                }
            }
            else
            {
                idx -= headCount;
            }

            var bodyCount = (this._bodyrows) ? this._bodyrows.length : 0;

            if (idx < bodyCount)
            {
                var row = this._bodyrows[idx];

                if (val == "head")
                {
                    this._headrows.push(row);
                    this._bodyrows.splice(idx, 1);

                    this.headHeight = this._adjustFormatRowSize(this._headrows);
                    this._body_height = this.bodyHeight = this._adjustFormatRowSize(this._bodyrows);
                    return true;
                }
                else if (val == "summ" || val == "summary")
                {
                    this._summrows.push(row);
                    this._bodyrows.splice(idx, 1);

                    this.summHeight = this._adjustFormatRowSize(this._summrows);
                    this._body_height = this.bodyHeight = this._adjustFormatRowSize(this._bodyrows);
                    return true;
                }
            }
            else
            {
                idx -= bodyCount;
            }
            var summCount = (this._summrows) ? this._summrows.length : 0;

            if (idx < summCount)
            {
                var row = this._summrows[idx];

                if (val == "head")
                {
                    this._headrows.push(row);
                    this._summrows.splice(idx, 1);

                    this.headHeight = this._adjustFormatRowSize(this._headrows);
                    this.summHeight = this._adjustFormatRowSize(this._summrows);
                    return true;
                }
                else if (val == "body")
                {
                    this._bodyrows.push(row);
                    this._summrows.splice(idx, 1);

                    this._body_height = this.bodyHeight = this._adjustFormatRowSize(this._bodyrows);
                    this.summHeight = this._adjustFormatRowSize(this._summrows);
                    return true;
                }
            }*/
        }
        return false;
    };

    _pGridFormat.getFormatRowProperty = function (nRowIdx, strPropID)
    {
        var idx, headCount, bodyCount, summCount;
        if (strPropID == "size")
        {
            idx = nRowIdx;
            headCount = (this._headrows) ? this._headrows.length : 0;

            if (idx < headCount)
                return this._headrows[idx].orgsize;
            else
                idx -= headCount;

            bodyCount = (this._bodyrows) ? this._bodyrows.length : 0;

            if (idx < bodyCount)
                return this._bodyrows[idx].orgsize;
            else
                idx -= bodyCount;

            summCount = (this._summrows) ? this._summrows.length : 0;

            if (idx < summCount)
                return this._summrows[idx].orgsize;

        }
        else if (strPropID == "band")
        {
            idx = nRowIdx;
            headCount = (this._headrows) ? this._headrows.length : 0;

            if (idx < headCount)
                return "head";
            else
                idx -= headCount;

            bodyCount = (this._bodyrows) ? this._bodyrows.length : 0;

            if (idx < bodyCount)
                return "body";
            else
                idx -= bodyCount;

            summCount = (this._summrows) ? this._summrows.length : 0;

            if (idx < summCount)
                return "summ";
        }
        return null;
    };
    _pGridFormat = null;
}
