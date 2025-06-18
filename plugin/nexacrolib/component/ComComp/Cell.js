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
if (!nexacro.CellInfo)
{
    //==============================================================================
    // nexacro.CellInfo
    //==============================================================================
    nexacro.CellInfo = function (id, parent, view, type, idx, copy_prop_cellinfo)
    {
        this._groupcol = -1;
        this._p_parent = parent;
        this.id = this.name = id;
        this._type = type;
        this._view = view;  // main component;
        this._cellidx = idx;
        this._col = 0;
        this._colspan = 0;
        this._row = 0;
        this._rowspan = 0;
        this._area = "";
        this._endcol = false;
        this._subcells = [];
        this._isSubCell = false;
        this._maskstringtypeobj = new nexacro._EditMaskTypeString();
        this._masknumbertypeobj = new nexacro._GridMaskTypeNumber();
        this._key_direction = null;
        this._blinked_status = [];
        this._value = undefined;

        this._sortidx = "";
        this._sortstr = "";
        this._sortstatus = "";

        this._filterstr = "";
        this._filtersaveinfo = null;

        this._allocatePropertys(this._property_map, copy_prop_cellinfo);
    };

    var _pCellInfo = nexacro._createPrototype(nexacro.Object, nexacro.CellInfo);
    nexacro.CellInfo.prototype = _pCellInfo;
    _pCellInfo._type_name = "CellInfo";

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // [property map index]
    nexacro._CELLINFO_PMAP_PROPNAME = 0;    // property name
    nexacro._CELLINFO_PMAP_CTRLPROPNAME = 1;// info.(property) value를 해당 control에 전달해야 할 때.
    nexacro._CELLINFO_PMAP_EXPRBIND = 2;    // expr, bind 사용유무
    nexacro._CELLINFO_PMAP_DEFTVALUE = 3;   // default 값
    nexacro._CELLINFO_PMAP_STYLE = 4;       // style 프로퍼티 여부
    nexacro._CELLINFO_PMAP_VALTYPE = 5;     // default:undefined, int:0, bool:1, enum:2
    nexacro._CELLINFO_PMAP_ENUMVAL = 6;     // default:undefined

    // property map (auto create property & setter)
    _pCellInfo._property_map = [];
    _pCellInfo._property_map_cell = [
        ["cssclass", null, true, "", true],
        ["displaytype", null, true, "normal", false],
        ["edittype", null, true, "none", false],
        ["tooltiptype", null, false, "default", false],
        ["tooltiptext", null, true, undefined, false],
        ["autosizecol", null, false, "default", false, 2, ["none", "limitmin", "limitmax", "default"]],
        ["autosizerow", null, false, "default", false, 2, ["none", "limitmin", "limitmax", "default"]],
        ["displayexpdec", null, true, -1, false, 0],
        ["locale", null, true, "", false],
        ["text", null, true, null, false],
        ["expr", null, true, null, false],
        ["subsumtext", null, true, null, false],
        ["controlautosizingtype", null, true, "both", false, 2, ["none", "width", "height", "both"]],
        ["rtl", null, false, "", false],
        ["sortcolumn", null, false, "", false],
        ["groupcolumn", null, false, "", false],
        ["filtercolumn", null, false, "", false],
        ["filtertype", null, false, "condition", false, 2, ["condition", "select", "condition,select"]],

        // accessibility
        ["accessibilityaction", "accessibilityaction", false, null, false],
        ["accessibilitydesclevel", "accessibilitydesclevel", false, "all", false],
        ["accessibilitydescription", "accessibilitydescription", false, null, false],
        ["accessibilityenable", "accessibilityenable", true, true, false, 1],
        ["accessibilitylabel", "accessibilitylabel", true, null, false],
        ["accessibilityrole", "accessibilityrole", false, "gridcell", false],

        // normal style
        ["color", "color", false, null, true],
        ["font", "font", false, null, true],
        ["wordSpacing", "wordSpacing", false, null, true],
        ["letterSpacing", "letterSpacing", false, null, true],
        ["textDecoration", "textDecoration", false, null, true],
        ["wordWrap", null, true, null, true],
        ["borderRadius", "borderRadius", false, null, true],
        ["border", "border", false, null, true],
        ["background", "background", false, null, true],
        ["edge", "edge", false, null, true],
        ["cursor", "cursor", false, null, true],
        ["opacity", "opacity", false, null, true],
        ["boxShadow", "boxShadow", false, null, true],
        ["padding", "padding", false, null, true],
        ["textAlign", "textAlign", false, null, true],
        ["verticalAlign", "verticalAlign", false, null, true]
    ];

    _pCellInfo._property_map_checkbox = [
        ["checkboxsize", null, true, -1, false, 0],
        ["checkboxtruevalue", "truevalue", true, null, false],
        ["checkboxfalsevalue", "falsevalue", true, null, false]
    ];

    _pCellInfo._property_map_radioitem = [
        ["radioitemsize", null, true, -1, false, 0],
        ["radioitemcodevalue", "codevalue", false, -1, false, 0],
    ];

    _pCellInfo._property_map_edit = [
        ["editmaxlength", null, true, -1, false, 0],
        ["editautoselect", "autoselect", true, false, false],
        ["editautoskip", "autoskip", true, false, false],
        ["editimemode", "imemode", true, "none", false, 2, ["none", "alpha", "alpha,full", "hangul", "hangul,full", "katakana", "katakana,full", "hiragana", "direct"]],
        ["edituseime", "useime", true, "global", false, 2, ["global", "local", "local,keep", "none"]],
        ["editinputfilter", "inputfilter", true, "none", false],
        ["editinputmode", "inputmode", true, "normal", false],
        ["editinputtype", "inputtype", true, "normal", false],
        ["editimeaction", "imeaction", true, "none", false, 2, ["none", "done", "go", "search", "send", "next", "previous"]]
    ];

    _pCellInfo._property_map_maskedit = [
        ["maskeditautoselect", "autoselect", true, false, false],
        ["maskeditlimitbymask", "limitbymask", true, "decimal", false, 2, ["none", "integer", "decimal", "both"]],
        ["maskeditformat", "format", true, "", false],
        ["maskeditmaskchar", "maskchar", false, "_", false],
        ["maskeditclipmode", "clipmode", true, "includespace", false, 2, ["includespace", "excludespace"]],
        ["maskeditautoskip", "autoskip", true, false, false],
        ["maskedittrimtype", "trimtype", true, "none", false, 2, ["none", "left", "right", "both"]],
        ["maskeditpostfixtext", "postfixtext", true, "", false],
        ["maskedittype", "type", true, "number", false, 2, ["number", "string"]],
        ["maskeditimeaction", "imeaction", true, "none", false, 2, ["none", "done", "go", "search", "send", "next", "previous"]]
    ];

    _pCellInfo._property_map_textarea = [
        ["textareaacceptsenter", null, true, false, false],
        ["textareaacceptstab", null, true, false, false],
        ["textareamaxlength", null, true, -1, false, 0],
        ["textareaautoselect", "autoselect", true, false, false],
        ["textareaimemode", "imemode", true, "none", false, 2, ["none", "alpha", "alpha,full", "hangul", "hangul,full", "katakana", "katakana,full", "hiragana", "direct"]],
        ["textareainputfilter", "inputfilter", true, "none", false],
        ["textareainputmode", "inputmode", true, "normal", false],
        ["textareainputtype", "inputtype", true, "normal", false],
        ["textareascrollbarsize", null, true, undefined, false, 0],
        ["textareascrollbartype", null, true, "auto", false],
        ["textareascrolltype", null, true, "both", false, 2, ["none", "both", "horizontal", "vertical"]],
        ["textareaautoskip", "autoskip", true, false, false],
        ["textareauseime", "useime", true, "global", false, 2, ["global", "local", "local,keep", "none"]]
    ];

    _pCellInfo._property_map_combo = [
        ["combocodecol", "codecolumn", true, "", false],
        ["combodatacol", "datacolumn", true, "", false],
        ["combodataset", "innerdataset", true, "", false],
        ["combodisplaynulltext", null, true, "", false],
        ["combodisplaynulltype", null, true, "none", false, 2, ["none", "nulltext"]],
        ["combodisplayrowcount", "displayrowcount", true, undefined, false, 0],
        ["combotype", "type", true, "dropdown", false, 2, ["dropdown", "search", "filter", "filterlike", "caseisearch", "caseifilter", "caseifilterlike"]],
        ["comboitemheight", "itemheight", true, undefined, false, 0],
        ["combopopuptype", null, true, "", false, 2, ["normal", "center", "system", "none"]],
        ["comboscrollbarsize", null, true, undefined, false, 0],
        ["combobuttonsize", null, true, undefined, false],
        ["comboautoselect", "autoselect", true, false, false],
        ["comboimemode", "imemode", true, "none", false, 2, ["none", "alpha", "alpha,full", "hangul", "hangul,full", "katakana", "katakana,full", "hiragana", "direct"]],
        ["combopopupsize", null, true, undefined, false]
    ];

    _pCellInfo._property_map_multicombo = [
        ["multicombocodecol", "codecolumn", true, "", false],
        ["multicombodatacol", "datacolumn", true, "", false],
        ["multicombodataset", "innerdataset", true, "", false],
        ["multicombodisplaynulltext", null, true, "", false],
        ["multicombodisplaynulltype", null, true, "none", false, 2, ["none", "nulltext"]],
        ["multicombodisplayrowcount", "displayrowcount", true, undefined, false, 0],
        ["multicombotype", "type", true, "dropdown", false, 2, ["dropdown", "search", "filter", "filterlike", "caseisearch", "caseifilter", "caseifilterlike"]],
        ["multicomboitemheight", "itemheight", true, undefined, false, 0],
        ["multicombopopuptype", null, true, "", false, 2, ["normal", "center", "system", "none"]],
        ["multicomboscrollbarsize", null, true, undefined, false, 0],
        ["multicombobuttonsize", null, true, undefined, false],
        ["multicomboautoselect", "autoselect", true, false, false],
        ["multicomboimemode", "imemode", true, "none", false, 2, ["none", "alpha", "alpha,full", "hangul", "hangul,full", "katakana", "katakana,full", "hiragana", "direct"]],
        ["multicombopopupsize", null, true, undefined, false],
        ["multicombocounttextformat", "counttextformat", true, "", false],
        ["multicomboedittype", "edittype", true, "text", false, 2, ["text", "count", "singletag", "multitag"]],
        ["multicombotextseparator", "textseparator", false, ",", false],
        ["multicomboreadonlycolumn", "readonlycolumn", true, ",", false],
        ["multicomboshowselectallcheckbox", "showselectallcheckbox", true, false, false]
    ];

    _pCellInfo._property_map_group = [
        ["groupitemheight", "itemheight", true, undefined, false, 0],
        ["grouppopuptype", null, true, "", false, 2, ["normal", "center", "system", "none"]],
        ["grouppopupsize", null, true, undefined, false],
        ["groupscrollbarsize", null, true, undefined, false, 0],
        ["groupbuttonsize", null, true, undefined, false],
    ];

    _pCellInfo._property_map_calendar = [
        ["calendardataset", "innerdataset", true, "", false],
        ["calendardisplaynulltext", null, true, "", false],
        ["calendardisplaynulltype", null, true, "default", false, 2, ["default", "none", "nulltext", "nullmask"]],
        ["calendardisplayinvalidtext", null, true, "invalid value", false],
        ["calendardisplayinvalidtype", null, true, "default", false, 2, ["default", "none", "invalidtext"]],
        ["calendarbackgroundcol", "backgroundcolumn", true, "", false],
        ["calendarbordercol", "bordercolumn", true, "", false],
        ["calendardatecol", "datecolumn", true, "", false],
        ["calendartextcolorcol", "textcolorcolumn", true, "", false],
        ["calendardaysize", "daysize", true, undefined, false],
        ["calendarheadformat", "headformat", true, "yyyy.MM", false],
        ["calendardateformat", null, true, "yyyy-MM-dd ddd", false],
        ["calendareditformat", null, true, "yyyy-MM-dd", false],
        ["calendarweekformat", "weekformat", true, undefined, false],
        ["calendarpopupsize", null, true, undefined, false],
        ["calendarpopuptype", null, true, undefined, false, 2, ["normal", "center", "system", "none"]],
        ["calendarbuttonsize", null, true, undefined, false],
        ["calendarheadheight", "headheight", true, undefined, false, 0],
        ["calendarshowmonthspin", "showmonthspin", true, false, false, 1],
        ["calendarshowyearspin", "showyearspin", true, false, false, 1],
        ["calendartype", "type", true, "normal", false],
        ["calendarusetrailingday", "usetrailingday", true, false, false],
        ["calendarautoselect", "autoselect", true, false, false]
    ];

    _pCellInfo._property_map_progressbar = [
        ["progressbarblockgap", "blockgap", true, undefined, false],
        ["progressbarblocksize", "blocksize", true, undefined, false],
        ["progressbardirection", "direction", true, "forward", false],
        ["progressbarsmooth", "smooth", true, false, false]
    ];

    _pCellInfo._property_map_image = [
        ["imagestretch", "stretch", true, "none", false, 2, ["none", "fit", "fixaspectratio"]]
    ];

    _pCellInfo._property_map_tree = [
        ["treecheck", null, true, "", false],
        ["treecollapseimage", null, true, "", false],
        ["treeexpandimage", null, true, "", false],
        ["treeitemimage", null, true, "", false],
        ["treelevel", null, true, "", false],
        ["treestartlevel", null, true, 0, false, 0],
        ["treestate", null, true, "", false]
    ];

    _pCellInfo._property_map_expand = [
        ["expandchar", null, true, "", false],
        ["expandimage", null, true, "", false],
        ["expandshow", null, true, "hide", false, 2, ["hide", "show"]],
        ["expandsize", null, true, 16, false, 0]
    ];
    /*
    _pCellInfo._property_map_custom = [
        ["customcontrolproperties", null, false, "", false],
        ["customcontrolinitvalueid", null, false, "", false],
        ["customcontrolevents", null, false, "", false],
        ["customcontroltypename", null, false, "", false],
        ["customcontrolid", null, false, "", false]
    ];
    */
    _pCellInfo._property_map_htmlcontrol = [
        ["htmlcontent", "content", false, "", false],
        ["htmlproperties", null, false, "", false],
    ];

    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_tree);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_cell);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_checkbox);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_radioitem);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_edit);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_maskedit);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_textarea);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_combo);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_multicombo);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_group);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_calendar);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_progressbar);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_image);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_expand);
    //_pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_custom);
    _pCellInfo._property_map = _pCellInfo._property_map.concat(_pCellInfo._property_map_htmlcontrol);

    _pCellInfo._setCellChildControlProperty = function (prefix, ctrl, datarow)
    {
        var _property_map = this["_property_map_" + prefix];
        var v, prop, ctrlprop;

        for (var i = 0, n = _property_map.length; i < n; i++)
        {
            ctrlprop = _property_map[i][nexacro._CELLINFO_PMAP_CTRLPROPNAME];
            if (ctrlprop != null)
            {
                prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
                v = this._getAttrValue(this["_p_" + prop], datarow);
                ctrl["set_" + ctrlprop](v);
            }
        }
    };

    _pCellInfo._setCellControlProperty = function (cellcontrol, datarow)
    {
        var _property_map = this._property_map_cell;
        var v, prop, ctrlprop;

        for (var i = 0, n = _property_map.length; i < n; i++)
        {
            ctrlprop = _property_map[i][nexacro._CELLINFO_PMAP_CTRLPROPNAME];
            if (ctrlprop != null)
            {
                prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
                v = this._getAttrValue(this["_p_" + prop], datarow);
                if (v === undefined || v === null)
                {
                    if (prop == "rtl")
                    {
                        cellcontrol.on_apply_prop_rtl(); // rtl은 내부 값 업데이트
                    }

                    if (cellcontrol._setted_computed_style[prop] !== undefined && cellcontrol._setted_computed_style[prop] !== null)
                        v = cellcontrol._setted_computed_style[prop];
                }
                cellcontrol["set_" + ctrlprop](v);
            }
        }
    };

    _pCellInfo._setCellControlPropertyForAutosize = function (cellcontrol, datarow, prop)
    {
        var v, ctrlprop;

        if (nexacro._isArray(prop))
        {
            for (var i = 0; i < prop.length; i++)
            {
                ctrlprop = prop[i];

                switch (ctrlprop)
                {
                    case "font":
                    case "wordSpacing":
                    case "letterSpacing":
                    case "border":
                    case "padding":
                    case "wordWrap":
                        break;
                    default:
                        continue;
                }
                v = this._getAttrValue(this["_p_" + ctrlprop], datarow);
                cellcontrol["set_" + ctrlprop](v);
            }
        }
        else
        {
            switch (prop)
            {
                case "font":
                case "wordSpacing":
                case "letterSpacing":
                case "border":
                case "padding":
                case "wordWrap":
                    break;
                default:
                    return;
            }
            v = this._getAttrValue(this["_p_" + prop], datarow);
            cellcontrol["set_" + prop](v);
        }
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // displaytype
    _pCellInfo._use_displaytype_controls = [
        "buttoncontrol",
        "checkboxcontrol",
        "imagecontrol",
        "treeitemcontrol",
        "combocontrol",
        "multicombocontrol",
        "calendarcontrol",
        "editcontrol",
        "maskeditcontrol",
        "textareacontrol",
        "progressbarcontrol",
        "radioitemcontrol",
        //"customcontrol",
        "rowgroupcontrol",
        "htmlcontrol",
    ];

    _pCellInfo._isDisplayEditOnlyOneControl = function (datarow)
    {
        return false;
        /*
        var disptype = this._getDisplaytype(datarow);
        var edittype = this._getEdittype(datarow);

        var sametable = {
            // displaytype : edittype
            "customcontrol": "customcontrol"
        };

        var retn = (sametable[disptype] == edittype);

        if (this._view)
            retn = retn && (this._view._p_autoenter == "select")

        return retn;
        */
    };

    // edittype
    _pCellInfo._hasEditor = function (datarow)
    {
        var editType = this._getEdittype(datarow);

        switch (editType)
        {
            case "none":
                return false;
            case "normal":
            case "text":
            case "combo":
            case "multicombo":
            case "date":
            case "mask":
            case "textarea":
            case "button":
            case "readonly":
            //case "customcontrol":
                return true;
        }
        return false;
    };

    _pCellInfo._chkExistSubControl = function (displaytype)
    {
        var usecontrols = this._use_displaytype_controls;

        for (var i = 0, n = usecontrols.length; i < n; i++)
        {
            if (usecontrols[i] == displaytype)
                return displaytype;
        }
        return "";
    };

    _pCellInfo._getDefaultPropVal = function (propname)
    {
        var _property_map = this._property_map;
        var prop, deft;

        for (var i = 0, n = _property_map.length; i < n; i++)
        {
            prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
            deft = _property_map[i][nexacro._CELLINFO_PMAP_DEFTVALUE];

            if (prop == propname)
                return deft;
        }
        return undefined;
    };

    _pCellInfo._allocatePropertys = function (_property_map, copy_prop_cellinfo)
    {
        var prop, bind, deft, attrval;
        for (var i = 0; i < _property_map.length; i++)
        {
            prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
            bind = _property_map[i][nexacro._CELLINFO_PMAP_EXPRBIND];
            deft = _property_map[i][nexacro._CELLINFO_PMAP_DEFTVALUE];

            if (bind)
            {
                this["_p_" + prop] = new nexacro.BindableValue(deft);
                this["_p_" + prop]._propname = prop;
            }
            else
            {
                this["_p_" + prop] = deft;
            }

            if (copy_prop_cellinfo)
            {
                var propobj = copy_prop_cellinfo["_p_" + prop];
                attrval = (propobj && propobj._bindtype >= 0) ? propobj._value : propobj;

                if (this["set_" + prop])
                {
                    if (attrval !== null && attrval !== undefined)
                        this["set_" + prop](attrval);
                }
            }
        }
    };

    nexacro._makeCellInfoPropertySetter = function (ptype_val, _property_map, target = null)
    {
        var definestr, prop, bind, str, type, styl, eval_str = ""; // deft
        function enumjoin(arr)
        {
            var _str = "\"" + arr[0] + "\"";
            for (var i = 1; i < arr.length; i++)
            {
                _str += ",\"" + arr[i] + "\"";
            }
            return _str;
        }

        definestr = "$PTYPE$._properties = [\n";

        for (var i = 0; i < _property_map.length; i++)
        {
            prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
            bind = _property_map[i][nexacro._CELLINFO_PMAP_EXPRBIND];
            // deft = _property_map[i][nexacro._CELLINFO_PMAP_DEFTVALUE];
            type = _property_map[i][nexacro._CELLINFO_PMAP_VALTYPE];
            styl = _property_map[i][nexacro._CELLINFO_PMAP_STYLE];

            definestr += "{ name: \"" + prop + "\" },\n";

            if (bind)
            {
                str = "$PTYPE$.set_$ATTR$ = function (v)\n";
                str += "{\n";
                str += "    if (v != this._p_$ATTR$._value)\n";
                str += "    {\n";

                if (type == 0)      // int
                    str += "        this._p_$ATTR$._set_intval(v);\n";
                else if (type == 2) // enum
                    str += "        this._p_$ATTR$._set_enumval(v, [" + enumjoin(_property_map[i][nexacro._CELLINFO_PMAP_ENUMVAL]) + "]);\n";
                else
                    str += "        this._p_$ATTR$._set(v);\n";

                str += "        this._afterProcBindTypeProp();\n";

                if (styl)
                    str += "        this._changedStyle(\"" + prop + "\");\n";

                str += "    }\n";
                str += "};\n\n";
            }
            else
            {
                str = "$PTYPE$.set_$ATTR$ = function (v)\n";
                str += "{\n";

                if (type == 2)
                {
                    str += "    var val = this._p_$ATTR$;\n";
                    str += "    switch (v)\n";
                    str += "    {\n";

                    var arr = _property_map[i][nexacro._CELLINFO_PMAP_ENUMVAL];
                    for (var j = 0; j < arr.length; j++)
                    {
                        str += "        case \"" + arr[j] + "\":\n";
                    }
                    str += "            val = v;\n";
                    str += "    }\n";
                    str += "    if (val != this._p_$ATTR$)\n";
                }
                else
                {
                    str += "    if (v != this._p_$ATTR$)\n";
                }

                str += "    {\n";
                str += "        this._p_$ATTR$ = v;\n";

                if (styl)
                    str += "        this._changedStyle(\"" + prop + "\");\n";

                str += "    }\n";
                str += "};\n\n";
            }

            if (typeof (ptype_val) == "object")
                str = str.replace(/\$PTYPE\$/g, "arguments[0]").replace(/\$ATTR\$/g, prop);
            else
                str = str.replace(/\$PTYPE\$/g, ptype_val).replace(/\$ATTR\$/g, prop);

            eval_str += str;
        }

        definestr += "];\n";

        eval_str += definestr;

        if (typeof (ptype_val) == "object")
            eval_str = eval_str.replace(/\$PTYPE\$/g, "arguments[0]");
        else
            eval_str = eval_str.replace(/\$PTYPE\$/g, ptype_val);


        if (typeof arguments[0] === 'object')
        {
            new Function(eval_str)(arguments[0]);

        }
        else
            new Function(String(arguments[0]), eval_str)(target ? target : arguments[0]);
    };

    nexacro._makeCellInfoPropertySetter("_pCellInfo", _pCellInfo._property_map, _pCellInfo);

    nexacro._makePropertyDesignSetter = function (ptype_val, _property_map, target = null)
    {
        var prop;
        var str = "";

        for (var i = 0; i < _property_map.length; i++)
        {
            prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];

            str += "$PTYPE$.design_set_" + prop + " = function (v)\n";
            str += "{\n";
            str += "        try\n";
            str += "        {\n";
            str += "            this._refinfo.set_" + prop + "(v);\n";
            str += "            this._updateAll();\n";
            //          str += "            trace(\"" + prop + "\");\n";
            str += "            this._apply_normalproperty(\"" + prop + "\", v);\n";
            str += "        }\n";
            str += "        catch(e)\n";
            str += "        {\n";
            str += "           if (e.obj)\n";
            str += "           {\n";
            str += "               trace(e.message);\n";
            str += "           }\n";
            str += "           else\n";
            str += "           {\n";
            str += "               var msg = nexacro._getExceptionMessage(e);\n";
            str += "               trace(msg);\n";
            str += "           }\n";
            str += "        }\n";
            str += "};\n\n";

            str += "$PTYPE$.design_get_" + prop + " = function ()\n";
            str += "{\n";
            str += "        var prop = this._refinfo._p_" + prop + ";\n";
            str += "        if (prop)\n";
            str += "        {\n";
            //          str += "            trace(\"" + prop + "\", prop);\n";
            str += "            if (nexacro._isNumber(prop) || prop._bindtype == undefined)\n";
            str += "                return prop;\n";
            str += "            else\n";
            str += "                return prop._value;\n";
            str += "        }\n";
            str += "        return prop;\n";
            str += "};\n\n";
        }

        if (typeof (ptype_val) == "object")
            str = str.replace(/\$PTYPE\$/g, "arguments[0]");
        else
            str = str.replace(/\$PTYPE\$/g, ptype_val);

        if (typeof arguments[0] === 'object')
        {
            new Function(str)(arguments[0]);

        }
        else
            new Function(String(arguments[0]), str)(target ? target : arguments[0]);
    };

    _pCellInfo._addPropertyMap = function (ptype_val, _property_map_add, is_add_design_setter, target = null)
    {
        this._property_map = this._property_map.concat(_property_map_add);
        nexacro._makeCellInfoPropertySetter(ptype_val, _property_map_add, target);

        if (is_add_design_setter)
            nexacro._makePropertyDesignSetter(ptype_val, _property_map_add, target);
    };

    ////////////////////////////////////////////////////////////////////////////////////
    // extra override
    ////////////////////////////////////////////////////////////////////////////////////
    _pCellInfo.set_id = function (id)
    {
        this.id = this.name = id;
    };

    _pCellInfo.set_name = function (name) { };

    _pCellInfo.set_displaytype = function (v)
    {
        if (v != this._p_displaytype)
        {
            var oldVal = this._p_displaytype._value;
            this._p_displaytype._set(v);
            this._afterProcBindTypeProp();

            if (this._view && !this._is_group_temp)
            {
                if (oldVal == "treeitemcontrol" && v == "rowgroupcontrol")
                    this._view._resetTreeCellinfo(this);

                if (v == "treeitemcontrol")
                {
                    if (!this._view._treeCellinfo)
                        this._view._setTreeCellinfo(this);
                }
                else if (v == "rowgroupcontrol")
                {
                    if (this._groupcol >= 0 || !this._view._treeCellinfo)
                        this._view._setTreeCellinfo(this);
                }
            }
        }
    };

    _pCellInfo.set_maskeditmaskchar = function (v)
    {
        if (!v) v = "_";
        var val = v.toString().charAt(0);
        if (val != this._p_maskeditmaskchar)
        {
            this._p_maskeditmaskchar = val;
            this._afterProcBindTypeProp();
        }
    };

    _pCellInfo.set_cssclass = function (v)
    {
        if (v != this._p_cssclass._value)
        {
            this._p_cssclass._set(v);
            this._afterProcBindTypeProp();
        }
    };

    _pCellInfo.set_expr = function (v)
    {
        if (v != this._p_expr._value)
        {
            var str;
            if (typeof v !== 'string')
                str = v.toString();
            else
                str = v;

            var tag = str.substr(0, 4).toUpperCase();
            if (tag != "" && tag != "EXPR")
                v = "EXPR:" + v;
            this._p_expr._set(v);
            this._afterProcBindTypeProp();
        }
    };

    nexacro._defineProperties(_pCellInfo, _pCellInfo._properties);

    ////////////////////////////////////////////////////////////////////////////////////

    _pCellInfo.destroy = function ()
    {
        this._p_parent = null;
        var i;
        var n = this._subcells.length;

        for (i = 0; i < n; i++)
        {
            this._subcells[i].destroy();
        }
        this._subcells = null;
        this._maskstringtypeobj = null;
        this._masknumbertypeobj = null;

        var _property_map = this._property_map;
        var prop;

        for (i = 0; i < _property_map.length; i++)
        {
            prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
            this["_p_" + prop] = null;
        }
        this._property_map = null;
        this._key_direction = null;
        this._blinked_status = null;
        this._filtersaveinfo = null;
    };

    _pCellInfo._getBindDataset = function ()
    {
        if (this._view)
            return this._view._getBindDataSet ? this._view._getBindDataSet() : this._view._binddataset;

        return null;
    };
    _pCellInfo._getExprCacheFn = function (ctx)
    {
        if (this._view)
            return this._view._getExprFuncByCtx ? this._view._getExprFuncByCtx(ctx) : this._view._exprcache[ctx];
    };
    _pCellInfo._setExprCacheFn = function (ctx, func)
    {
        if (this._view)
            return this._view._setExprFuncByCtx ? this._view._setExprFuncByCtx(ctx, func) : this._view._exprcache[ctx] = func;
    };

    _pCellInfo._getDisplaytype = function (rowidx)
    {
        var dt = this._p_displaytype;
        var d = this._getAttrValue(dt, rowidx);
        if (d === undefined)
        {
            d = "normal";
        }
        if (d == "normal")
        {
            var t = this.text;
            if (t && t._bindtype == 1)
            {
                var dataset = this._getBindDataset();
                if (!dataset) return "text";
                var colid = t._bindexpr;
                var coltype = dataset._getColumnType(colid);

                switch (coltype)
                {
                    case 1: //string
                    case 9: //variant   
                        return "text";
                    case 2: //int
                    case 3: //float
                    case 4: //bigdecimal
                        return "number";
                    case 5: //date
                        return "date";
                    case 6: //time
                        return "time";
                    case 7: //datetime
                        return "datetime";
                    default: //blob
                        return "none";
                }
            }
            else
            {
                return "text";
            }
        }
        return d;
    };

    _pCellInfo._getEdittype = function (rowidx)
    {
        var dt = this._p_edittype;
        var d = this._getAttrValue(dt, rowidx);

        if (d == "normal")
        {
            var t = this.text;
            if (t._bindtype == 1)
            {
                var dataset = this._getBindDataset();
                if (!dataset) return "text";
                var colid = t._bindexpr;
                var colinfo = dataset._getColumnType(colid);
                if (!colinfo) return "text";

                var coltype = colinfo;

                switch (coltype)
                {
                    case 1: //string
                    case 2: //int
                    case 3: //float
                    case 4: //bigdecimal
                    case 9: //variant
                        return "text";
                    case 5: //date
                    case 6: //time
                    case 7: //datetime
                        return "date";
                    case 8: //blob
                        return "none";
                }
            }
            else
            {
                return "text";
            }
        }
        return d;
    };

    _pCellInfo._getWordwrap = function (rowidx)
    {
        var wordwrap = this._getAttrValue(this._p_wordWrap, rowidx);
        return wordwrap;
    };

    _pCellInfo._getValue = function (rowidx, nowritable)
    {
        if (nowritable)
        {
            if (this._p_expr._value != "" && this._p_expr._value != null)
                return this._getAttrValue(this._p_expr, rowidx);
        }

        return this._getAttrValue(this._p_text, rowidx);
    };

    _pCellInfo._getAttrValue = function (attr, rowidx, is_NF)
    {
        if (attr == undefined)
            return undefined;

        if (attr._bindtype == undefined)
        {
            return attr;
        }
        else if (attr._bindtype == 0)
        {
            if (rowidx == -1 && attr._propname == "text")
            {
                if (this._value != undefined)
                    return this._value;
                else
                    return attr._value;
            }
            else
                return attr._value;
        }
        else
        {
            var dataset = this._getBindDataset();
            if (dataset == null)
                return undefined;

            if (attr._bindtype == 1)
            {
                //if (is_NF)
                //    return dataset.getColumnNF(rowidx, attr._bindexpr);
                //else
                return dataset.getColumn(rowidx, attr._bindexpr);
            }
            else
            {
                var bindexpr = attr._bindexpr;
                var val = attr._value;
                var reg_exps = /BIND\s*:/i;
                var tag = reg_exps.exec(val);
                var s = -1;
                if (tag && tag.index >= 0)
                {
                    s = tag.index;
                }
                if (s >= 0)
                {
                    bindexpr = bindexpr.substring(s, bindexpr.length);
                    if (is_NF)
                        bindexpr = dataset.getColumnNF(rowidx, bindexpr);
                    else
                        bindexpr = dataset.getColumn(rowidx, bindexpr);
                }

                var exprfn = this._getExprCacheFn(bindexpr);
                if (exprfn == null)
                {
                    exprfn = dataset._createExprFunc(bindexpr);
                    this._setExprCacheFn(bindexpr, exprfn);
                }

                if ((typeof exprfn) == "function")
                {
                    dataset.__getParsedRow(dataset._viewRecords[rowidx]);
                    this.col = this._col;
                    this.row = this._row;

                    var group = { text: "", value: undefined, count: 0, colid: "", depth: -1, type: "" };

                    if (dataset.getMaxRowLevel() > 0)
                    {
                        var colid = dataset.getGroupColumnIds(rowidx);
                        var rowtype = dataset ? dataset.getRowType(rowidx) : 1;
                        var level = this._getGroupRowLevel(rowidx);
                        var groupcol = this._groupcol;

                        if (colid.length)
                        {
                            group.text = this._getGroupHeadText(colid[0]);
                            group.value = dataset.getColumn(rowidx, colid[0]);
                            group.count = dataset.getGroupRangeRowCount(rowidx);
                            group.colid = colid[0];
                        }

                        if ((this._checkGroupCellStyle(null, rowidx) >= 1))
                        {
                            if (rowtype == 16 && level <= groupcol)
                            {
                                group.depth = level - 1;
                                group.type = "subsum";
                            }
                            else
                            {
                                if (groupcol < 0 || groupcol >= level)
                                    group.depth = level;
                                else if (groupcol >= 0)
                                    group.depth = groupcol;

                                group.type = "header";
                            }
                        }
                        else if (rowtype == 16)
                        {
                            group.depth = level - 1;
                            group.type = "subsum";
                        }
                    }
                    return exprfn.call(this, rowidx, rowidx, this._view, dataset, dataset._viewRecords, dataset._viewRecords[rowidx], [], group);
                }
            }
        }

        return undefined;
    };

    _pCellInfo._setAttrValue = function (attr, rowidx, v)
    {
        if (attr._bindtype == 1)
        {
            var dataset = this._getBindDataset();
            if (dataset)
                dataset.setColumn(rowidx, attr._bindexpr, v);
        }
    };

    _pCellInfo._getDefaultTextAlign = function (displayType, rowidx)
    {
        var align;

        switch (displayType)
        {
            case "normal":
                displayType = this._getDisplaytype(rowidx);
                if (displayType == "number")
                    align = "right";
                else if (displayType == "date" || displayType == "time" || displayType == "datetime")
                    align = "center";
                else
                    align = "left";
                break;
            case "mask":
                var type = this._getAttrValue(this._p_maskedittype, rowidx);
                if (type == "number")
                    align = "right";
                else
                    align = "left";
                break;
            case "number":
            case "exponent":
            case "currency":
                align = "right";
                break;
            default:
                align = "center";
                break;
        }
        return align;
    };

    _pCellInfo._getCheckboxsize = function (rowidx)
    {
        var val = this._getAttrValue(this._p_checkboxsize, rowidx);

        if ((val === "" || val < 0) && this._view)
            val = this._view.cellcheckboxsize;

        return val;
    };

    _pCellInfo._getRadioitemsize = function (rowidx)
    {
        var val = this._getAttrValue(this._p_radioitemsize, rowidx);

        if ((val === "" || val < 0) && this._view)
            val = this._view.cellradioitemsize;

        return val;
    };

    _pCellInfo._getControlButtonsize = function (rowidx, control)
    {
        var val = this._getAttrValue(this["_p_" + control + "buttonsize"], rowidx);

        if (val == null && this._view)
            val = this._view["_p_cell" + control + "buttonsize"];

        return val;
    };

    _pCellInfo._getControlScrollbarsize = function (rowidx, control)
    {
        var val = this._getAttrValue(this["_p_" + control + "scrollbarsize"], rowidx);

        if (val == null || val < 0)
        {
            if (this._view)
                val = this._view["_p_cell" + control + "scrollbarsize"];
        }
        else
            val = parseInt(val, 10);

        if (val == null || val < 0)
            val = undefined;

        return val;
    };

    _pCellInfo._getControlPopuptype = function (rowidx, control)
    {
        var val = this._getAttrValue(this["_p_" + control + "popuptype"], rowidx);

        if (!val && this._view)
            val = this._view["_p_cell" + control + "popuptype"];

        return val;
    };

    _pCellInfo._getControlPopupsize = function (rowidx, control)
    {
        var val = this._getAttrValue(this["_p_" + control + "popupsize"], rowidx);

        if (!val && this._view)
            val = this._view["_p_cell" + control + "popupsize"];

        return val;
    };

    _pCellInfo._afterProcBindTypeProp = function () { };
    _pCellInfo._changedStyle = function (prop) { };

    _pCellInfo._getTooltipText = function (rowidx)
    {
        var text = this._getAttrValue(this._p_tooltiptext, rowidx);
        return text;
    };

    _pCellInfo._getTreeCheck = function (rowidx)
    {
        return this._getAttrValue(this._p_treecheck, rowidx);
    };

    _pCellInfo._getTreeCollapseImage = function (rowidx)
    {
        return this._getAttrValue(this._p_treecollapseimage, rowidx);
    };

    _pCellInfo._getTreeExpandImage = function (rowidx)
    {
        return this._getAttrValue(this._p_treeexpandimage, rowidx);
    };

    _pCellInfo._getTreeItemImage = function (rowidx)
    {
        return this._getAttrValue(this._p_treeitemimage, rowidx);
    };

    _pCellInfo._getTreeLevel = function (rowidx)
    {
        var v = this._getAttrValue(this._p_treelevel, rowidx);

        if (this._groupcol >= 0 || this._getDisplaytype(rowidx) == "rowgroupcontrol")
        {
            return this._getGroupRowLevel(rowidx);
        }

        v = parseInt(v) | 0;
        return v;
    };

    _pCellInfo._getGroupRowLevel = function (rowidx, ignore_indent)
    {
        var v;

        var dataset = this._getBindDataset();
        if (dataset != null)
        {
            var rowlevel = dataset.getRowLevel(rowidx);
            var maxlevel = dataset.getMaxRowLevel();
            var rowtype = dataset.getRowType(rowidx);

            v = maxlevel - rowlevel;

            if (this._view && this._view._b_indentsubsum)
            {
                if (!ignore_indent)
                {
                    if (rowtype == 16)  // leaf와 동일 레벨로 하여 트리가 접힐 때 안으로 들어가게..
                        v++;
                }
            }
        }
        else
        {
            v = 0;
        }

        v = parseInt(v) | 0;
        return v;
    };

    _pCellInfo._getTreeStartLevel = function (rowidx)
    {
        var v = this._getAttrValue(this._p_treestartlevel, rowidx);
        v = parseInt(v) | 0;
        return v;
    };

    _pCellInfo._getTreeState = function (rowidx)
    {
        return this._getAttrValue(this._p_treestate, rowidx);
    };

    _pCellInfo._setTreeCheck = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treecheck, rowidx, v);
    };

    _pCellInfo._setTreeCollapseImage = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treecollapseimage, rowidx, v);
    };

    _pCellInfo._setTreeExpandImage = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treeexpandimage, rowidx, v);
    };

    _pCellInfo._setTreeItemImage = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treeitemimage, rowidx, v);
    };

    _pCellInfo._setTreeLevel = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treelevel, rowidx, v);
    };

    _pCellInfo._setTreeStartLevel = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treestartlevel, rowidx, v);
    };

    _pCellInfo._setTreeState = function (rowidx, v)
    {
        return this._setTreeBindValue(this._p_treestate, rowidx, v);
    };

    _pCellInfo._setTreeBindValue = function (attr, rowidx, v)
    {
        if (attr._bindtype == 1)
        {
            var dataset = this._getBindDataset();
            if (dataset)
            {
                dataset._treeBindChanged = true;
                dataset.setColumn(rowidx, v);
            }
        }
    };

    _pCellInfo._setValue = function (v)
    {
        if (this._value != v)
        {
            this._value = v;
            return true;
        }
        return false;
    };

    _pCellInfo._getLocale = function (rowidx)
    {
        var locale = this._getAttrValue(this._p_locale, rowidx);
        if (!locale && this._view)
        {
            locale = this._view._getLocale();
        }

        return locale;
    };
    _pCellInfo._getDisplayTypeValue = function (rowidx)
    {
        var dt = this._p_displaytype;
        var d = this._getAttrValue(dt, rowidx);
        if (d === undefined)
        {
            d = "normal";
        }
        return d;
    };

    _pCellInfo._getGroupCount = function () // override..
    {
        return 0;
    };

    _pCellInfo._checkGroupCellStyle = function (return_info, rowidx) // override..
    {
        var dataset = this._getBindDataset();
        if (dataset)
        {
            if (dataset.getRowType(rowidx) == 32)
                return 1;
        }
        return 0;
    };

    _pCellInfo._isStartGroupHeadCell = function (rowidx)
    {
        var info = {};
        var dataset = this._getBindDataset();

        if (!dataset)
            return false;

        var rowtype = dataset.getRowType(rowidx);

        if (this._getGroupCount() > 0 && this._checkGroupCellStyle(info, rowidx) >= 1 && rowtype == 32)
        {
            if (info.is_start)
                return true;
        }
        return false;
    };

    _pCellInfo._isStartGroupHeadArea = function (rowidx)
    {
        var info = {};
        var dataset = this._getBindDataset();

        if (!dataset)
            return false;

        var rowtype = dataset.getRowType(rowidx);

        if (this._getGroupCount() > 0 && this._checkGroupCellStyle(info, rowidx) >= 1 && rowtype == 32)
        {
            if (info._is_startarea)
                return true;
        }
        return false;
    };

    _pCellInfo._isStartGroupSubsumArea = function (rowidx)
    {
        var info = {};
        var dataset = this._getBindDataset();

        if (!dataset)
            return false;

        var rowtype = dataset.getRowType(rowidx);

        if (this._getGroupCount() > 0 && this._checkGroupCellStyle(info, rowidx) >= 1 && rowtype == 16)
        {
            if (info._is_startarea)
                return true;
        }
        return false;
    };

    _pCellInfo._getGroupHeadText = function (groupcolumn) { return ""; }; // override

    _pCellInfo._getDisplayText = function (rowidx)
    {
        if (this._isHideContentsForGroupCell(rowidx))
            return "";

        var dataset = this._getBindDataset();
        if (dataset && this.subsumtext._value !== null && this.subsumtext._value !== undefined && dataset.getRowType(rowidx) == 16)
        {
            var val = this._getAttrValue(this._p_subsumtext, rowidx);
            return nexacro._toString(val);
        }

        var d = this._getDisplayTypeValue(rowidx);

        if (d == "normal")
        {
            var t = this.text;
            if (t._bindtype == 1)
            {
                if (!dataset) return "";
                var colid = t._bindexpr;
                var coltype = dataset._getColumnType(colid);

                switch (coltype)
                {
                    case 1: //string
                    case 9: //variant
                        return this._getDisplayText_text(rowidx);
                    case 2: //int
                    case 3: //float
                    case 4: //bigdecimal
                        return this._getDisplayText_localenumber(rowidx);
                    case 5: //date
                        return this._getDisplayText_date(rowidx, 0);
                    case 6: //time
                        return this._getDisplayText_date(rowidx, 1);
                    case 7: //datetime
                        return this._getDisplayText_date(rowidx, 2);
                    default: //blob
                        return "";
                }
            }
        }
        else
        {
            if (d == "mask" || d == "maskeditcontrol")
            {
                var type = this._getAttrValue(this._p_maskedittype, rowidx);

                if (type == "number")
                    return this._getDisplayText_masknumber(rowidx);
                else
                    return this._getDisplayText_maskstring(rowidx);

            }
            else if (d == "number")
                return this._getDisplayText_localenumber(rowidx);
            else if (d == "currency")
                return this._getDisplayText_currency(rowidx);
            else if (d == "date")
                return this._getDisplayText_date(rowidx);
            else if (d == "calendarcontrol")
                return this._getDisplayText_date(rowidx, null, true);
            else if (d == "combotext")
                return this._getDisplayText_combo(rowidx);
            else if (d == "combocontrol")
                return this._getDisplayText_combo(rowidx, true);
            else if (d == "multicombocontrol")
                return this._getDisplayText_multicombo(rowidx, true);
            else if (d == "rowgroupcontrol")
                return this._getDisplayText_rowgroup(rowidx, true);
            else if (d == "none")
                return "";
        }

        // default
        return this._getDisplayText_text(rowidx);
    };

    _pCellInfo._getTextValueForDisp = function (rowidx)
    {
        if (this._p_expr._value != "" && this._p_expr._value != null)
            return this._getAttrValue(this._p_expr, rowidx);

        return this._getAttrValue(this._p_text, rowidx);
    };

    _pCellInfo._getDisplayText_text = function (rowidx)
    {
        var v = this._getTextValueForDisp(rowidx);

        if (v != null)
        {
            if (typeof v !== 'string')
                v = v.toString();
        }
        v = nexacro._getTextTemplateValue(v);

        return v;
    };

    _pCellInfo._getDisplayText_maskstring = function (rowidx)
    {
        var v = this._getTextValueForDisp(rowidx);
        var mask = this._getAttrValue(this._p_maskeditformat, rowidx);

        if (v != null)
        {
            if (typeof v !== 'string')
                v = v.toString();
        }

        if (mask && mask.length)
        {
            var maskobj = this._maskstringtypeobj;
            var maskchar = this._getAttrValue(this._p_maskeditmaskchar, rowidx);
            var locale = this._getLocale(rowidx);
            var maskeditpostfixtext = this._getAttrValue(this._p_maskeditpostfixtext, rowidx);

            maskobj.setLocale(locale);
            maskobj.setMask(mask);
            maskobj.setMaskChar(maskchar);
            maskobj.setPostfixtext(maskeditpostfixtext);
            v = maskobj.applyMask(v);
        }
        return v;
    };

    _pCellInfo._getDisplayText_masknumber = function (rowidx)
    {
        var v = this._getTextValueForDisp(rowidx);
        var mask = this._getAttrValue(this._p_maskeditformat, rowidx);

        if (mask && mask.length)
        {
            var locale = this._getLocale(rowidx);
            var maskobj = this._masknumbertypeobj;
            var limittype = this._getAttrValue(this._p_maskeditlimitbymask, rowidx);
            var maskeditpostfixtext = this._getAttrValue(this._p_maskeditpostfixtext, rowidx);

            if (mask === ".")
                maskobj.setUseGrouping(true);

            maskobj.setLimitType(limittype);
            maskobj.setLocale(locale);
            maskobj.setMask(mask);
            maskobj.setPostfixtext(maskeditpostfixtext);
            v = maskobj.applyMask(v);
        }
        else
        {
            v = nexacro._toString(v);
        }
        return v;
    };

    // by ODH, mask를 사용하면 exponent 형식을 표시하지 못하기 때문에,
    // Number/Decimal의 toLocalNumber를 사용하는 _getDisplayText_localenumber함수를 대신사용하도록 수정
    // 단, Number.toLocaleString 함수는 아래의 문제가 있어서 nexacro.Number().toLocaleString() 사용함.
    // 1.'ar', 'ch' 등에서 arab 또는 한자 등으로 숫자를 출력
    // 2. 출력되는 소수점 자리수가 toString과 같지 않음
    _pCellInfo._getDisplayText_number = function (rowidx)
    {
        var v = this._getTextValueForDisp(rowidx);
        var limittype = this._getAttrValue(this._p_maskeditlimitbymask, rowidx);
        var locale = this._getLocale(rowidx);
        var maskobj = this._masknumbertypeobj;

        maskobj.setUseGrouping(true);
        maskobj.setLimitType(limittype);
        maskobj.setLocale(locale);
        maskobj.setMask("");
        v = maskobj.applyMask(v);

        return v;
    };

    _pCellInfo._getDisplayText_localenumber = function (rowidx)
    {
        var v = this._getTextValueForDisp(rowidx);
        var locale = this._getLocale(rowidx);

        if (v instanceof nexacro.Decimal)
        {
            if (v.isNaNOrInf()) return "";
            return v.toLocaleString(locale);
        }
        else if (isFinite(v))
        {
            return (new nexacro.Number(v)).toLocaleString(locale);
        }

        return "";
    };

    _pCellInfo._getDisplayText_currency = function (rowidx)
    {
        var v = this._getTextValueForDisp(rowidx);
        var locale = this._getLocale(rowidx);

        if (v instanceof nexacro.Decimal)
        {
            if (v.isNaNOrInf()) return "";
            v = v.toLocaleCurrencyString(locale);
        }
        else if (isFinite(v))
        {
            v = (new nexacro.Number(v)).toLocaleCurrencyString(locale);
        }
        else
        {
            v = "";
        }

        return v;
    };

    _pCellInfo._getDisplayText_date = function (rowidx, colType, is_control)
    {
        var v = this._getTextValueForDisp(rowidx);
        var date = undefined;
        var nullmask = false;
        var is_date_empty = false;
        var dateformatmask;

        switch (colType)
        {
            case 0: // date
                dateformatmask = "yyyy-MM-dd";
                break;
            case 1: // time
                dateformatmask = "hh:mm:ss";
                break;
            case 2: // datetime
                dateformatmask = "yyyy-MM-dd hh:mm:ss";
                break;
            default:
                dateformatmask = this._getAttrValue(this._p_calendardateformat, rowidx);
                break;
        }

        v = (v) ? v : "";

        if (v.constructor == Date)
        {
            date = v;
        }
        else
        {
            var strVal;
            var calendardisplayinvalidtype;
            var calendardisplaynulltype;
            // 문자열로 변환
            if (typeof v !== 'string')
                strVal = v.toString();
            else
                strVal = v;
            if (strVal.search(/\S/) > -1)
            {
                if (colType == undefined)
                {
                    var editformatmask = this._getAttrValue(this._p_calendareditformat, rowidx);

                    //coltype이 지정되지 않으면 value의 길이에 따라 coltype 지정
                    if (editformatmask && editformatmask.length)
                    {

                        if (editformatmask == "LONGDATE" || editformatmask == "SHORTDATE")
                        {
                            colType = 2;
                        }
                        else
                        {
                            var maskobj = new nexacro._EditMaskTypeDate();
                            maskobj.setDateMask(editformatmask);
                            maskobj.setEditMask(editformatmask);

                            colType = maskobj.getEditFormatType();
                        }
                    }
                    else
                    {
                        if (strVal.length == 8) //date
                        {
                            colType = 0;
                        }
                        else if (strVal.length == 6 || strVal.length == 9) //time
                        {
                            colType = 1;
                        }
                        else //datetime
                        {
                            colType = 2;
                        }
                    }
                }
                date = this.__parseDate(strVal, colType);

                if (date && (date._isInvalidDate ? date._isInvalidDate() : isNaN(date.valueOf())))
                {
                    calendardisplayinvalidtype = this._getAttrValue(this._p_calendardisplayinvalidtype, rowidx);
                    if ((calendardisplayinvalidtype == "invalidtext" || calendardisplayinvalidtype == "default") && !is_control)
                    {
                        return this._getAttrValue(this._p_calendardisplayinvalidtext, rowidx);
                    }

                    return strVal;
                }
            }
            else
            {
                calendardisplaynulltype = this._getAttrValue(this._p_calendardisplaynulltype, rowidx);
                if (calendardisplaynulltype == "nulltext" && !is_control)
                {
                    return this._getAttrValue(this._p_calendardisplaynulltext, rowidx);
                }
                else if (calendardisplaynulltype == "nullmask" && !is_control)
                {
                    nullmask = true;
                }
                else if (calendardisplaynulltype == "default")
                {
                    // skip
                }
                else
                {
                    return "";
                }
            }
        }

        if (date == null)
        {
            is_date_empty = true;
            date = new nexacro.Date();
            date.setFullYear(0);
            date.setMonth(0);
            date.setDate(1);
        }

        var dateStr;
        var locale = this._getLocale(rowidx);
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var format;

        if (dateformatmask == "SHORTDATE" || dateformatmask == "LONGDATE")
        {
            if (dateformatmask == "SHORTDATE")
                format = locale_info.shortdate_format;
            else
                format = locale_info.longdate_format;

            if (format == "")
                format = nexacro.Locale._default_shortdate_format;

            var b_ltr_mark = ((this._view && !this._view._isRtl()) && locale_info.direction == "rtl") ? true : false;

            dateStr = date.getLocaleFormatString(locale, format, b_ltr_mark);

        }
        else
        {
            var yyyy = date.getFullYear();
            if (yyyy == 0)
                yyyy = "0000";
            else
                yyyy = yyyy.toString().padLeft(4, "0");

            var MM = date.getMonth() + 1;
            var MMM = locale_info.month_names_short[date.getMonth()];
            var MMMM = locale_info.month_names_long[date.getMonth()];
            MM = (MM < 10 ? "0" : "") + MM;

            var dddd = locale_info.weekday_names_long[date.getDay()];
            var ddd = locale_info.weekday_names_short[date.getDay()];
            var dd = date.getDate();

            dd = (dd < 10 ? "0" : "") + dd;

            var yy = date.getYear() % 100;
            yy = (yy < 10 ? "0" : "") + yy;

            var M = +MM;
            var d = +dd;

            var hour = date.getHours();
            hour = (hour < 10 ? "0" : "") + hour;
            var h = +hour;

            var minute = date.getMinutes();
            minute = (minute < 10 ? "0" : "") + minute;
            var mn = +minute;

            var second = date.getSeconds();
            second = (second < 10 ? "0" : "") + second;

            var s = +second;

            var millisecond = date.getMilliseconds();
            millisecond = (millisecond < 10 ? "00" : millisecond < 100 ? "0" : "") + millisecond;

            if (is_date_empty)
            {
                hour = h = "00";
                minute = mn = "00";
                second = s = "00";
                millisecond = "000";
            }

            format = dateformatmask;

            if (format == null || format.length == 0 || !format.match(/[yMdHhms]/))
            {
                format = "yyyy-MM-dd ddd";
            }

            if (nullmask)
            {
                var maskchar1 = "_";
                var maskchar2 = maskchar1 + maskchar1;
                var maskchar3 = maskchar2 + maskchar1;
                var maskchar4 = maskchar3 + maskchar1;


                dateStr = format.replace("yyyy", maskchar4);
                dateStr = dateStr.replace("MMMM", "lunari");
                dateStr = dateStr.replace("MMM", maskchar3);
                dateStr = dateStr.replace("MM", maskchar2);
                dateStr = dateStr.replace("ddd", "week");
                dateStr = dateStr.replace("dd", maskchar2);
                //dateStr = dateStr.replace("dddd", "weekL");

                dateStr = dateStr.replace("yy", maskchar2);
                dateStr = dateStr.replace("M", maskchar1);
                dateStr = dateStr.replace("d", maskchar1);
                dateStr = dateStr.replace("tt", maskchar2);
                dateStr = dateStr.replace("HH", maskchar2);
                dateStr = dateStr.replace("hh", maskchar2);
                dateStr = dateStr.replace("H", maskchar1);
                dateStr = dateStr.replace("h", maskchar1);
                dateStr = dateStr.replace("mm", maskchar2);
                dateStr = dateStr.replace("m", maskchar1);
                dateStr = dateStr.replace("sss", maskchar3);
                dateStr = dateStr.replace("ss", maskchar2);
                dateStr = dateStr.replace("s", maskchar1);
                dateStr = dateStr.replace("lunari", maskchar4);
                //dateStr = dateStr.replace("weekL", maskchar4);
                dateStr = dateStr.replace("week", maskchar3);
            }
            else
            {
                var is_month_change = false;
                var hh = hour;
                var tt = "오전";
                if (hour > 12 && hour < 25)
                {
                    hh = hour < 22 ? "0" + (hour - 12) : hour - 12;
                    tt = "오후";
                }

                dateStr = format.replace("tt", tt);
                dateStr = dateStr.replace("HH", hour);
                dateStr = dateStr.replace("hh", hh);
                dateStr = dateStr.replace("H", h);
                dateStr = dateStr.replace("h", h);
                dateStr = dateStr.replace("mm", minute);
                dateStr = dateStr.replace("m", mn);
                dateStr = dateStr.replace("sss", millisecond);
                dateStr = dateStr.replace("ss", second);
                dateStr = dateStr.replace("s", s);

                dateStr = dateStr.replace("dddd", "weekL");
                dateStr = dateStr.replace("ddd", "week");
                dateStr = dateStr.replace("yyyy", yyyy);
                dateStr = dateStr.replace("MMMM", "lunari");
                if (dateStr.indexOf("MMM") > -1)
                {
                    dateStr = dateStr.replace("MMM", MMM);
                    is_month_change = true;
                }
                dateStr = dateStr.replace("MM", MM);
                dateStr = dateStr.replace("dd", dd);
                dateStr = dateStr.replace("yy", yy);
                if (!is_month_change)
                    dateStr = dateStr.replace("M", M);
                dateStr = dateStr.replace("d", d);
                dateStr = dateStr.replace("lunari", MMMM);
                dateStr = dateStr.replace("weekL", dddd);
                dateStr = dateStr.replace("week", ddd);
            }
        }

        return dateStr;
    };

    _pCellInfo.__parseDate = function (v, formattype)
    {
        var dateobj;
        var maskobj = new nexacro._EditMaskTypeDate();
        if (/[^0-9]/.test(v))
        {
            dateobj = new Date(v);
        }
        else
        {
            dateobj = maskobj.convertToDateObject(v, formattype);
        }

        if (dateobj)
        {
            if (isNaN(dateobj.valueOf()))
                return dateobj;

            switch (formattype)
            {
                case 0:
                    dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate());
                    break;
                case 1:
                    dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate(), dateobj.getHours(), dateobj.getMinutes(), dateobj.getSeconds(), dateobj.getMilliseconds());
                    dateobj._timeonly = true;
                    break;
                case 2:
                    dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate(), dateobj.getHours(), dateobj.getMinutes(), dateobj.getSeconds(), dateobj.getMilliseconds());
                    break;
                default:
                    break;
            }
        }

        return dateobj;

    };

    _pCellInfo._getDisplayText_combo = function (rowidx, is_control)
    {
        var combodataset = this._getAttrValue(this._p_combodataset, rowidx);
        var combocodecol = this._getAttrValue(this._p_combocodecol, rowidx);
        var combodatacol = this._getAttrValue(this._p_combodatacol, rowidx);
        if (combodataset && combodataset.length && combocodecol && combocodecol.length && combodatacol && combodatacol.length)
        {
            var ds = this._findDataset(combodataset);
            if (ds)
            {
                var v = this._getTextValueForDisp(rowidx);
                var text = ds.lookupNF(combocodecol, v, combodatacol);
                if (text)
                {
                    if (typeof text !== 'string')
                        return text.toString();
                    else
                        return text;
                }
            }
        }

        if (this.combodisplaynulltype._value == "nulltext" && !is_control)
        {
            return this._getAttrValue(this._p_combodisplaynulltext, rowidx);
        }

        return "";
    };

    _pCellInfo._getDisplayText_multicombo = function (rowidx, is_control)
    {
        var multicombodataset = this._getAttrValue(this._p_multicombodataset, rowidx);
        var multicombocodecol = this._getAttrValue(this._p_multicombocodecol, rowidx);
        var multicombodatacol = this._getAttrValue(this._p_multicombodatacol, rowidx);

        var text = "";
        if (multicombodataset && multicombodataset.length && multicombocodecol && multicombocodecol.length && multicombodatacol && multicombodatacol.length)
        {
            var ds = this._findDataset(multicombodataset);
            if (ds)
            {
                var v = this._getTextValueForDisp(rowidx);
                var codes = [];
                if (v) codes = v.split(',');
                for (let code of codes) //cats warning 처리
                {
                    if (text.length > 0)
                        text += ",";

                    let data = ds.lookupNF(multicombocodecol, code, multicombodatacol);
                    if (data)
                    {
                        if (typeof data !== 'string')
                            text += data.toString();
                        else
                            text += data;
                    }
                }
            }
        }

        if (text.length == 0 && this.multicombodisplaynulltype._value == "nulltext" && !is_control)
        {
            text = this._getAttrValue(this._p_multicombodisplaynulltext, rowidx);
        }

        return text;
    };

    _pCellInfo._getDisplayText_rowgroup = function (rowidx, is_control)
    {
        var displaytext = "";
        var dataset = this._getBindDataset();

        if (dataset)
        {
            if (this._isStartGroupHeadArea(rowidx) // 역'ㄱ' 의 모서리에 해당 되는 cell 
                || (this._groupcol < 0 && dataset.getRowType(rowidx) == 32))
            {
                displaytext = this._getDisplayText_text(rowidx);
                if (displaytext == "" || displaytext == null)
                {
                    var colid = dataset.getGroupColumnIds(rowidx);
                    var defformat = "{groupvalue}";

                    displaytext = defformat.replace(/{groupvalue}/g, dataset.getColumn(rowidx, colid[0]));

                    //displaytext += "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
                }
            }
        }

        return displaytext;
    };

    _pCellInfo._findDataset = function (combodataset)
    {
        var view = this._view;
        if (view)
        {
            return view._findDataset(combodataset);
        }

        return null;
    };

    _pCellInfo._loadXmlElement = function (cellElem, subcell_override_info/*=undefined*/, is_sub/*=undefined*/) // subcell 포함.
    {
        var col = cellElem.getAttribute("col"),
            row = cellElem.getAttribute("row"),
            colspan = cellElem.getAttribute("colspan"),
            rowspan = cellElem.getAttribute("rowspan");

        this._col = (col == null ? 0 : parseInt(col));
        this._row = (row == null ? 0 : parseInt(row));
        this._colspan = (colspan == null ? 1 : parseInt(colspan));
        this._rowspan = (rowspan == null ? 1 : parseInt(rowspan));
        var prop, attrval;
        var i;
        var attrs = cellElem.attributes;
        var n = attrs.length;

        for (i = 0; i < n; i++)
        {
            prop = attrs[i].name;
            attrval = cellElem.getAttribute(prop);

            this._loadingxml = true;
            if (this["set_" + prop])
            {
                if (attrval !== null && attrval !== undefined)
                    this["set_" + prop](attrval);
            }
            else if (this.hasOwnProperty(prop) == false)    // userdata
            {
                switch (prop)
                {
                    //--- reserved ---
                    case "col":
                    case "row":
                    case "colspan":
                    case "rowspan":
                        break;
                    //----------------
                    default:
                        this["_p_" + prop] = new nexacro.BindableValue(undefined);
                        this["_p_" + prop]._propname = prop;
                        this._addPropertyMap(this, [[prop, null, true, undefined, false]], true);

                        if (attrval !== null && attrval !== undefined)
                            this["set_" + prop](attrval);

                        break;
                }
            }
            this._loadingxml = false;
        }

        if (!is_sub)
        {
            var subcells = cellElem.getElementsByTagName("Cell"),
                subinfo, subcellElem;

            if (!subcell_override_info)
                subcell_override_info = nexacro.CellInfo;

            for (i = 0, n = subcells.length; i < n; i++)
            {
                subcellElem = subcells[i];
                subinfo = new subcell_override_info((this._type + this._cellidx + "_sub" + i), this._p_parent, this._view, this._type, i);
                subinfo._loadXmlElement(subcellElem, subinfo, true);
                subinfo._isSubCell = true;
                this._subcells[i] = subinfo;
            }
        }
    };

    _pCellInfo._getXmlString = function (adjustcol)   // subcell 포함.
    {
        var strContents = "";

        if (this._isSubCell)
            strContents += "    ";

        if (adjustcol == undefined)
            adjustcol = 0;

        strContents += "<Cell col=\"" + (this._col + adjustcol);
        strContents += "\" row=\"" + this._row;

        if (this._colspan > 1)
            strContents += "\" colspan=\"" + this._colspan;
        if (this._rowspan > 1)
            strContents += "\" rowspan=\"" + this._rowspan;

        var _property_map = this._property_map;
        var prop, bind, deft;
        var i;
        var n = _property_map.length;

        for (i = 0; i < n; i++)
        {
            prop = _property_map[i][nexacro._CELLINFO_PMAP_PROPNAME];
            bind = _property_map[i][nexacro._CELLINFO_PMAP_EXPRBIND];
            deft = _property_map[i][nexacro._CELLINFO_PMAP_DEFTVALUE];

            if (bind)
            {
                if (this["_p_" + prop]._value != deft)
                    strContents += "\" " + prop + "=\"" + (typeof (this["_p_" + prop]._value) == "string" ? nexacro._encodeXml(this["_p_" + prop]._value) : this["_p_" + prop]._value);
            }
            else
            {
                if (this["_p_" + prop] != deft)
                    strContents += "\" " + prop + "=\"" + (typeof (this["_p_" + prop]) == "string" ? nexacro._encodeXml(this["_p_" + prop]) : this["_p_" + prop]);
            }
        }

        var subcells = this._subcells;

        if (subcells.length > 0)
        {
            strContents += "\">\n";

            for (i = 0, n = subcells.length; i < n; i++)
                strContents += subcells[i]._getXmlString(true);

            strContents += "</Cell>\n";
        }
        else
        {
            strContents += "\"/>\n";
        }

        return strContents;
    };

    _pCellInfo._isHideContentsForGroupCell = function (datarow)
    {
        if (this._isStartGroupSubsumArea(datarow))       // 역'ㄱ' 안의 subsum에 해당 되는 cell
        {
            if (this._getDisplaytype(datarow) == "rowgroupcontrol") // subsum에서는 rowgroup만 보이게..
                return false;
            else
                return true;
        }
        else if (this._isStartGroupHeadArea(datarow))    // 역'ㄱ' 의 모서리(header)에 해당 되는 cell
        {
            return false;
        }
        else if (this._getGroupCount() > 0 && this._checkGroupCellStyle(null, datarow) == 3)   // 그 외, 역'ㄱ' 안의 cell
        {
            return true;
        }

        return false;
    };

    _pCellInfo._isGroupColumnFirstSubSumCell = function (rowidx)    // override
    {
        return true;
    };

    _pCellInfo._convCheckValueToBoolean = function (value, rowidx)
    {
        var falsevalue = this._getAttrValue(this._p_checkboxfalsevalue, rowidx);
        var truevalue = this._getAttrValue(this._p_checkboxtruevalue, rowidx);

        if (falsevalue != null && falsevalue === value)
            return 0;
        else if (truevalue != null && truevalue === value)
            return 1;

        return value;
    };

    _pCellInfo._convBooleanToCheckValue = function (value, rowidx)
    {
        var falsevalue = this._getAttrValue(this._p_checkboxfalsevalue, rowidx);
        var truevalue = this._getAttrValue(this._p_checkboxtruevalue, rowidx);

        if (nexacro._toBoolean(value) && truevalue != null)
            return truevalue;
            
        if (!nexacro._toBoolean(value) && falsevalue != null)
            return falsevalue;

        return value;
    };

    _pCellInfo = null;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (!nexacro._CellControl)
{
    //==============================================================================
    // nexacro._CellControl
    //==============================================================================
    nexacro._CellControl = function (id, left, top, width, height, right, bottom, parent, refinfo, cellidx, view, rowidx/*=undefined*/)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);

        var add_event_list = ["onexpandup", "onexpanddown", "oninput", "ondropdown", "oncloseup"];

        this._view = view;  // main component
        this._rowidx = (rowidx != undefined) ? rowidx : -9;
        this._p_tabstop = false;
        this._cellidx = cellidx;
        this._refinfo = refinfo ? refinfo : this._makeCellInfo(id, null, view, id, cellidx);
        this.subcells = [];
        this.parentcell = (parent instanceof nexacro._CellControl) ? parent : null;
        this.selected = false;
        this._p_accessibilityrole = "gridcell";
        this._subComp = null;
        this._text_elem = null;
        this._curDisplayType = "";
        this._expand_width = 0;
        this._expandCtrl = null;
        this._filterCtrl = null;
        this._sortCtrl = null;
        this._isSubCell = (this.parentcell) ? true : false;
        this._fakecell = false;
        this._hideInner = false;
        this._is_real_upelem = null;
        this._editor = null;
        this._client_mode = "";
        this._disp_show = true;
        this._writable = false;
        this._setted_computed_style = {};
        this._use_flex_text_node = true;    // cell single node
        this._static_create = false; //editor has created with accessibility
        this._filter_popup = null;

        // child control
        this._cellExpandObj = "_CellExpandControl";
        this._cellFilterIconObj = "_CellFilterIconControl";
        this._cellSortIconObj = "_CellSortIconControl";
        this._cellButtonObj = "_CellButtonControl";
        this._cellCheckBoxObj = "_CellCheckboxControl";
        this._cellImageObj = "_CellImageControl";
        this._cellComboObj = "_CellComboControl";
        this._cellMultiComboObj = "_CellMultiComboControl";
        this._cellCalendarObj = "_CellCalendarControl";
        this._cellEditObj = "_CellEditControl";
        this._cellTextAreaObj = "_CellTextAreaControl";
        this._cellProgressBarObj = "_CellProgressBarControl";
        this._cellMaskEditObj = "_CellMaskEditControl";
        this._cellTreeObj = "_CellTreeControl";
        this._cellRadioItemObj = "_CellRadioItemControl";
        this._cellCustomObj = "_CellCustomControl";
        this._cellHTMLControlObj = "_CellHTMLControl";
        this._cellRowGroupExpandObj = "_CellRowGroupControl";

        for (var i = 0, n = add_event_list.length; i < n; i++)
            this._event_list[add_event_list[i]] = 1;

        this._visible_states = {};
    };

    var _pCellControl = nexacro._createPrototype(nexacro.Component, nexacro._CellControl);
    nexacro._CellControl.prototype = _pCellControl;

    _pCellControl._type_name = "CellControl";
    _pCellControl._is_subcontrol = true;
    _pCellControl._is_tablecell = true;
    _pCellControl._is_simple_control = true;
    _pCellControl._use_selected_status = true;
    _pCellControl._use_readonly_status = true;
    _pCellControl._is_use_auto_selected_status = true;
    _pCellControl._avail_left = 0;
    _pCellControl._avail_top = 0;
    _pCellControl._avail_width = 0;
    _pCellControl._avail_height = 0;

    _pCellControl.init = function (id, left, top, width, height, right, bottom, refinfo, cellidx, view, rowidx)
    {
        nexacro.Component.prototype.init.call(this, id, left, top, width, height, right, bottom, null, null, null, null);

        var info = this._refinfo;
        info.id = refinfo.name = id;
        info._view = view;
        info._type = "";
        info._cellidx = cellidx;
    };

    _pCellControl._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Component.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellControl._setContentsVisible = function (kind, visible, ignore_kinds)
    {
        this._visible_states[kind] = visible;
        var states = this._visible_states;

        if (visible == false)
            return this._hideInnerElement();

        // true
        for (var kind in states)
        {
            if (ignore_kinds)
            {
                for (var j = 0; j < ignore_kinds.length; j++)
                {
                    if (kind == ignore_kinds[j])
                        break;
                }

                if (j < ignore_kinds.length)    // exist ignore
                    continue;
            }

            if (states[kind] == false)
                return this._hideInnerElement();
        }
        return this._showInnerElement();
    };

    _pCellControl._changeCell = function (target_cell)
    {
        var refinfo = this._refinfo;
        var cellidx = this._cellidx;
        this._refinfo = target_cell._refinfo;
        this._cellidx = target_cell._cellidx;
        target_cell._refinfo = refinfo;
        target_cell._cellidx = cellidx;

        var l = this._adjust_left;
        var t = this._adjust_top;
        var w = this._adjust_width;
        var h = this._adjust_height;

        this.move(target_cell._adjust_left, target_cell._adjust_top, target_cell._adjust_width, target_cell._adjust_height);
        target_cell.move(l, t, w, h);
    };

    _pCellControl._makeCellInfo = function (id, parent, view, type, idx)
    {
        return new nexacro.CellInfo(id, parent, view, type, idx);
    };

    _pCellControl._apply_normalproperty = function (prop, val) { };

    _pCellControl._getDisplaytype = function ()
    {
        var datarow = this._getDataRow();
        return this._refinfo._getDisplaytype(datarow);
    };

    _pCellControl._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };

        if (this._text_elem)
            align = this._text_elem._getComputedStyleAlign(noflush);

        return align;
    };

    _pCellControl.on_create_contents = function ()
    {
        this._disp_show = this._updateDisplayer();
        if (this._env._p_enableaccessibility)
        {
            this._on_create_accessibility_contents();
        }
    };

    _pCellControl.on_created_contents = function (win)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            if (control_elem.setInnerHTML && this._view._use_innerhtml && !this._p_parent._is_nc_control)
            {
                this._is_create_commandstr = true;
                var str = this.on_create_contents_command();
                control_elem.setInnerHTML(str);
                this.on_attach_contents_handle(win);
                this._is_created = true;
            }
            else
            {
                var subcells = this.subcells;
                var subcells_len = subcells.length;

                if (subcells_len == 0)
                {
                    var sub_ctrl = this._subComp;

                    if (sub_ctrl)
                        sub_ctrl.on_created(win);
                }

                var text_elem = this._text_elem;

                if (text_elem)
                    text_elem.create(win);

                var sort_ctrl = this._sortCtrl; // text_elem의 텍스트 위로 덮어야하므로 순서 중요

                if (sort_ctrl)
                    sort_ctrl.on_created();

                var filter_ctrl = this._filterCtrl; // text_elem의 텍스트 위로 덮어야하므로 순서 중요

                if (filter_ctrl)
                    filter_ctrl.on_created();

                var expand_ctrl = this._expandCtrl; // text_elem의 텍스트 위로 덮어야하므로 순서 중요

                if (expand_ctrl)
                    expand_ctrl.on_created();

                for (var i = 0; i < subcells_len; i++)
                    subcells[i].on_created();
            }

            if (this._env._p_enableaccessibility)
            {
                this._on_created_accessibility_contents(win);
            }

            if (!this._adjust_width || !this._adjust_height)
                this._setDisplay(false);
        }
    };

    _pCellControl._on_changeStatus = function (status, value)
    {
        this._status_changing = true;
        nexacro.Component.prototype._on_changeStatus.call(this, status, value);
        this._status_changing = false;
    };

    _pCellControl.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        if (this._isSubCell)
            return currentstatus;

        return nexacro.Component.prototype.on_changeStatus.call(this, changestatus, value, applystatus, currentstatus, currentuserstatus);
    };

    _pCellControl.on_create_contents_command = function (area)
    {
        var str = "";
        var control_elem = this._control_element;
        if (control_elem)
        {
            var subcells = this.subcells;
            var subcells_len = subcells.length;

            if (subcells_len == 0)
            {
                var sub_ctrl = this._subComp;

                if (sub_ctrl)
                    str += sub_ctrl.createCommand();
            }
            else
            {
                for (var i = 0; i < subcells_len; i++)
                    str += subcells[i].createCommand();
            }

            var text_elem = this._text_elem;

            if (text_elem)
                str += text_elem.createCommand();

            var sort_ctrl = this._sortCtrl;  // text_elem의 텍스트 위로 덮어야하므로 순서 중요

            if (sort_ctrl)
                str += sort_ctrl.createCommand();

            var filter_ctrl = this._filterCtrl;  // text_elem의 텍스트 위로 덮어야하므로 순서 중요

            if (filter_ctrl)
                str += filter_ctrl.createCommand();

            var expand_ctrl = this._expandCtrl;  // text_elem의 텍스트 위로 덮어야하므로 순서 중요

            if (expand_ctrl)
                str += expand_ctrl.createCommand();
        }
        return str;
    };

    _pCellControl.on_attach_contents_handle = function (win)
    {
        var subcells = this.subcells;
        var subcells_len = subcells.length;

        for (var i = 0; i < subcells_len; i++)
            subcells[i].attachHandle(win);

        var sub_ctrl = this._subComp;
        if (sub_ctrl)
            sub_ctrl.attachHandle(win);

        var sort_ctrl = this._sortCtrl;
        if (sort_ctrl)
            sort_ctrl.attachHandle(win);

        var filter_ctrl = this._filterCtrl;
        if (filter_ctrl)
            filter_ctrl.attachHandle(win);

        var expand_ctrl = this._expandCtrl;
        if (expand_ctrl)
            expand_ctrl.attachHandle(win);

        var text_elem = this._text_elem;
        if (text_elem)
            text_elem.attachHandle(win);

        if (this._env._p_enableaccessibility)
        {
            this._on_attach_accessibility_contents_handle(win);
        }

        if (!this._adjust_width || !this._adjust_height)
            this._setDisplay(false);
    };

    _pCellControl.destroyComponent = function ()
    {
        nexacro.Component.prototype.destroyComponent.call(this);

        if (this._text_elem)
        {
            this._text_elem.destroy();
            this._text_elem = null;
        }
        this._refinfo = this._view = this.parentcell = this._band = this._is_real_upelem = null;
    };

    _pCellControl.on_destroy_contents = function ()
    {
        this._destroyDisplayer();

        if (this._sortCtrl)
        {
            this._sortCtrl.destroy();
            this._sortCtrl = null;
        }

        if (this._filterCtrl)
        {
            this._filterCtrl.destroy();
            this._filterCtrl = null;
        }

        if (this._filter_popup)
        {
            this._filter_popup.destroy();
            this._filter_popup = null;
        }

        if (this._expandCtrl)
        {
            this._expandCtrl.destroy();
            this._expandCtrl = null;
        }

        var subcells = this.subcells;
        var subcells_len = subcells.length;
        var i;

        if (this._is_tempcell)
        {
            for (i = 0; i < subcells_len; i++)   // temp subcell은 필요할 때만 만듬.
            {
                if (subcells[i])
                    subcells[i].destroy();
            }
        }
        else
        {
            for (i = 0; i < subcells_len; i++)
                subcells[i].destroy();
        }

        this.subcells = null;

        if (this._tempdestroyeditor)
        {
            this._tempdestroyeditor.destroy();
            this._tempdestroyeditor = null;
        }
        if (this._editor)
        {
            this._editor.destroy();
            this._editor = null;
        }
        if (this._tempdestroyeditor_list)
        {
            for (i = 0; i < this._tempdestroyeditor_list.length; i++)
            {
                this._tempdestroyeditor_list[i].destroy();
            }
            this._tempdestroyeditor_list = null;
        }

        this._setted_computed_style = null;
        this._visible_states = null;
    };

    _pCellControl._makeEventInfoBase = function (evt_id)
    {
        var cellobj = this;
        var subcellobj = null;

        if (cellobj.parentcell)
        {
            subcellobj = cellobj;
            cellobj = cellobj.parentcell;
        }

        var obj = { cell: -1, col: -1, row: -9, subrow: -1, mergecell: -1, mergecol: -1, mergerow: -1, pivotindex: -9, eventid: "", id: "" };

        if (evt_id)
            obj.eventid = obj.id = evt_id;

        obj.cell = cellobj._cellidx;
        obj.col = cellobj._refinfo._col;
        obj.row = cellobj._getDataRow();
        obj.subrow = cellobj._refinfo._row;
        obj.cellid = cellobj.id;

        if (subcellobj)
        {
            obj.mergecell = subcellobj._cellidx;
            obj.mergecol = subcellobj._refinfo._col;
            obj.mergerow = subcellobj._refinfo._row;
        }
        return obj;
    };

    _pCellControl._isPopupVisible = function ()
    {
        if (this._popupcontrol && this._popupcontrol.visible)
            return true;

        return false;
    };

    _pCellControl._showFilterPopup = function (type, filtertype)
    {
        if (!this._filter_popup)
        {
            this._popupcontrol = this._filter_popup = new nexacro._CellFilterPopupControl("cellfilterpopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._popupcontrol._setPopupContains(true);

            this._filter_popup._setCallbackFunc(this._callbackFilter);
            this._filter_popup.set_display(filtertype);
            this._filter_popup.set_type(type);
            this._filter_popup.set_useclearbutton(!!this._refinfo._filterstr);
            this._filter_popup.createComponent();
            this._filter_popup._popupBy(this, this._filterCtrl._adjust_left, this._adjust_height, this._filter_popup._adjust_width, this._filter_popup._adjust_height);
        }
        else
        {
            //if (!this._refinfo._filterstr)
            //  this._filter_popup._updateAll();

            this._filter_popup.set_display(filtertype);
            this._filter_popup.set_type(type);
            this._filter_popup.set_useclearbutton(!!this._refinfo._filterstr);
            this._filter_popup._popupBy(this, this._filterCtrl._adjust_left, this._adjust_height, this._filter_popup._adjust_width, this._filter_popup._adjust_height);
        }

        if (this._filter_popup._operator_ctrls.length)
            this._filter_popup._operator_ctrls[0].edit._setFocus();
        else if (this._filter_popup._searchedit)
            this._filter_popup._searchedit._setFocus();
    };

    _pCellControl._clearSort = function ()
    {
        this._refinfo._sortstr = "";
        this._refinfo._sortstatus = "";

        if (this._sortCtrl)
        {
            this._sortCtrl._changeUserStatus("ascending", false);
            this._sortCtrl._changeUserStatus("descending", false);
        }
    };

    _pCellControl.on_fire_onsortclick = function (obj, e)
    {
        return this.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "sorticon");
    };

    _pCellControl._changeSortStatus = function (alt_key, ctrl_key, shift_key)
    {
        var cellinfo = this._refinfo;
        var sortcolumn = cellinfo._getAttrValue(cellinfo._p_sortcolumn, -1);

        if (sortcolumn)
        {
            if (this._refinfo._sortstatus == "ascending")
            {
                this._sortCtrl._changeUserStatus("ascending", false);
                this._sortCtrl._changeUserStatus("descending", true);
                this._refinfo._sortstatus = "descending";
                this._refinfo._sortstr = "-" + sortcolumn;
            }
            else if (this._refinfo._sortstatus == "descending")
            {
                this._sortCtrl._changeUserStatus("ascending", false);
                this._sortCtrl._changeUserStatus("descending", false);
                this._refinfo._sortstatus = "";
                this._refinfo._sortstr = "";
            }
            else
            {
                this._sortCtrl._changeUserStatus("ascending", true);
                this._sortCtrl._changeUserStatus("descending", false);
                this._refinfo._sortstatus = "ascending";
                this._refinfo._sortstr = "+" + sortcolumn;
            }
        }
    };

    _pCellControl._clearSortStatus = function ()
    {
        var cellinfo = this._refinfo;
        var sortshow = cellinfo._getAttrValue(cellinfo._p_sortcolumn, -1);

        if (sortshow)
        {
            this._sortCtrl._changeUserStatus("ascending", false);
            this._sortCtrl._changeUserStatus("descending", false);
            this._refinfo._sortstatus = "";
            this._refinfo._sortstr = "";
        }
    };

    _pCellControl._clearFilter = function ()
    {
        this._refinfo._filterstr = "";
        if (this._filter_popup)
            this._filter_popup._updateAll();
        if (this._filterCtrl)
            this._filterCtrl._changeUserStatus("selected", false);
    };

    _pCellControl._callbackFilter = function (str)
    {
        this._refinfo._filterstr = str;

        if (this._view && this._view._applyFilter)
            this._view._applyFilter();
    };

    _pCellControl.on_fire_onexpandup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onexpandup && this.onexpandup._has_handlers)
        {
            var evt = this._makeEventInfoBase("onexpandup");
            evt.button = button;
            evt.altkey = alt_key;
            evt.ctrlkey = ctrl_key;
            evt.shiftkey = shift_key;
            evt.metakey = meta_key;
            evt.screenX = screenX;
            evt.screenY = screenY;
            evt.canvasX = canvasX;
            evt.canvasY = canvasY;
            evt.clientX = clientX;
            evt.clientY = clientY;
            evt.fromobject = from_comp;
            evt.fromreferenceobject = from_refer_comp;
            return this.onexpandup._fireEvent(this, evt);
        }
        return false;
    };

    _pCellControl.on_fire_onexpanddown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onexpandup && this.onexpandup._has_handlers)
        {
            var evt = this._makeEventInfoBase("onexpanddown");
            evt.button = button;
            evt.altkey = alt_key;
            evt.ctrlkey = ctrl_key;
            evt.shiftkey = shift_key;
            evt.metakey = meta_key;
            evt.screenX = screenX;
            evt.screenY = screenY;
            evt.canvasX = canvasX;
            evt.canvasY = canvasY;
            evt.clientX = clientX;
            evt.clientY = clientY;
            evt.fromobject = from_comp;
            evt.fromreferenceobject = from_refer_comp;
            return this.onexpandup._fireEvent(this, evt);
        }
        return false;
    };

    _pCellControl.on_fire_oninput = function (refcomp)
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = this._makeEventInfoBase("oninput");
            evt.from_refer_comp = refcomp;
            return this.oninput._fireEvent(this, evt);
        }
        return true;
    };

    _pCellControl.on_fire_ondropdown = function (obj)
    {
        if (this.ondropdown && this.ondropdown._has_handlers)
        {
            var evt = this._makeEventInfoBase("ondropdown");
            evt.value = this.__evtvalue(obj);
            return this.ondropdown._fireCheckEvent(this, evt);
        }
        return true;
    };

    _pCellControl.on_fire_oncloseup = function (obj, pretext, posttext, prevalue, postvalue)
    {
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var evt = this._makeEventInfoBase("oncloseup");
            evt.value = this.__evtvalue(obj, postvalue);
            return this.oncloseup._fireEvent(this, evt);
        }
        return true;
    };

    _pCellControl.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        if (this.onclick && this.onclick._has_handlers)
        {
            var subcomp = from_refer_comp;

            while (subcomp && subcomp instanceof nexacro.Component)
            {
                if (subcomp instanceof nexacro._CellControl)
                    break;

                var canvas = subcomp._getRecalcCanvasXY(from_refer_comp._control_element, canvasX, canvasY);
                canvasX = canvas[0];
                canvasY = canvas[1];

                if (this._subComp == subcomp)
                    break;

                subcomp = subcomp._p_parent;
            }

            if (this._subComp == from_comp)
            {
                var padding = this._getCurrentStylePadding();

                if (padding)
                {
                    canvasX += padding.left;
                    canvasY += padding.top;
                    clientX += padding.left;
                    clientY += padding.top;
                }
            }

            canvasX += this._adjust_left;
            canvasY += this._adjust_top;
            clientX += this._adjust_left;
            clientY += this._adjust_top;

            var evt = this._makeEventInfoBase("onclick");
            evt.button = button;
            evt.altkey = alt_key;
            evt.ctrlkey = ctrl_key;
            evt.shiftkey = shift_key;
            evt.metakey = meta_key;
            evt.screenx = screenX;
            evt.screeny = screenY;
            evt.canvasx = canvasX;
            evt.canvasy = canvasY;
            evt.clientx = clientX;
            evt.clienty = clientY;
            evt.fromobject = from_comp;
            evt.fromreferenceobject = from_refer_comp;
            evt.clickitem = clickitem || "";
            return this.onclick._fireEvent(this, evt);
        }
        return false;
    };

    _pCellControl.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        if (this.ondblclick && this.ondblclick._has_handlers)
        {
            var subcomp = from_refer_comp;

            while (subcomp && subcomp instanceof nexacro.Component)
            {
                if (subcomp instanceof nexacro._CellControl)
                    break;

                var canvas = subcomp._getRecalcCanvasXY(from_refer_comp._control_element, canvasX, canvasY);
                canvasX = canvas[0];
                canvasY = canvas[1];

                if (this._subComp == subcomp)
                    break;

                subcomp = subcomp._p_parent;
            }

            if (this._subComp == from_comp)
            {
                var padding = this._getCurrentStylePadding();

                if (padding)
                {
                    canvasX += padding.left;
                    canvasY += padding.top;
                    clientX += padding.left;
                    clientY += padding.top;
                }
            }

            canvasX += this._adjust_left;
            canvasY += this._adjust_top;
            clientX += this._adjust_left;
            clientY += this._adjust_top;

            var evt = this._makeEventInfoBase("ondblclick");
            evt.button = button;
            evt.altkey = alt_key;
            evt.ctrlkey = ctrl_key;
            evt.shiftkey = shift_key;
            evt.metakey = meta_key;
            evt.screenx = screenX;
            evt.screeny = screenY;
            evt.canvasx = canvasX;
            evt.canvasy = canvasY;
            evt.clientx = clientX;
            evt.clienty = clientY;
            evt.fromobject = from_comp;
            evt.fromreferenceobject = from_refer_comp;
            evt.clickitem = clickitem || "";
            return this.ondblclick._fireEvent(this, evt);
        }
        return false;
    };

    _pCellControl._common_fire_lbuttonup = function (touchinfos, changedtouchinfos, button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, obj, from_refer_comp, from_elem, metaKey)
    {
        var window = this._getWindow();
        var elem = window._cur_ldown_elem;

        var comp = window.findComponent(elem, 0, 0)[0];
        var up_comp = window.findComponent(from_elem, 0, 0)[0];

        if (elem != from_elem)
        {
            while (comp)
            {
                if (comp instanceof nexacro._CellControl)
                    break;

                comp = comp._p_parent;
            }

            while (up_comp)
            {
                if (up_comp instanceof nexacro._CellControl)
                    break;

                up_comp = up_comp._p_parent;
            }

            if (comp == up_comp)
            {
                var clickitem = "";
                if (this._editor)
                    clickitem = "control";

                this.on_fire_onclick(button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, obj, from_refer_comp, metaKey, clickitem);
            }
        }
    };

    _pCellControl.on_fire_user_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        this._common_fire_lbuttonup(touchinfos, changedtouchinfos, "", false, false, false, -1, -1, -1, -1, -1, -1, from_comp, from_refer_comp, null);
        return nexacro.Component.prototype.on_fire_user_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pCellControl.on_fire_user_onlbuttonup = function (button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, obj, refer_comp, from_elem, metaKey)
    {
        this._common_fire_lbuttonup(null, null, button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, obj, refer_comp, from_elem, metaKey);
        return nexacro.Component.prototype.on_fire_user_onlbuttonup.call(this, button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, obj, refer_comp, from_elem, metaKey);
    };

    _pCellControl._on_imeaction = function (elem, keycode, alt_key, ctrl_key, shift_key, meta_key)
    {
        if (!this._is_alive) return;

        if (this._p_visible && this._isEnable() && this.enableevent)
        {
            this.on_fire_onimeaction(keycode, alt_key, ctrl_key, shift_key, this, this, meta_key);
            var pThis = this._getFromComponent(this);
            if (pThis && (!pThis.oncellimeaction || (pThis.oncellimeaction && !pThis.oncellimeaction.defaultprevented)))
            {
                this.on_imeaction_default_action(elem, keycode, alt_key, ctrl_key, shift_key, meta_key);
            }
        }
    };

    _pCellControl.on_imeaction_default_action = function (elem, keycode, alt_key, ctrl_key, shift_key, meta_key)
    {
        if (this._subComp)
        {
            var root_comp = this._getRootComponent(this);
            if (this._subComp.imeaction == "next")
            {
                var next_comp = this._getForm().getNextComponent(root_comp, true);
                if (next_comp)
                {
                    next_comp.setFocus();
                }
            }
            else if (this._subComp.imeaction == "previous")
            {
                var prev_comp = this._getForm().getPrevComponent(root_comp, true);
                if (prev_comp)
                {
                    if (prev_comp instanceof Array)
                        prev_comp = prev_comp[0];

                    prev_comp.setFocus();
                }
            }
        }
    };

    _pCellControl.on_fire_customcontrolevent = function (e)
    {
        return this._view.on_fire_oncellcustomcontrolevent(e);
    };

    _pCellControl.__evtvalue = function (obj, postvalue)
    {
        var val = "";

        if (obj && obj.value)
            val = obj.value;
        else if (postvalue)
            val = postvalue;

        return val;
    };

    _pCellControl._destroyDisplayer = function (b_async)
    {
        if (this._subComp)
        {
            if (b_async)
            {
                var subcomp = this._subComp;
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    if (subcomp)
                    {
                        subcomp.destroy();
                    }
                });
                subcomp.set_visible(false);
                this._subComp = null;
            }
            else
            {
                this._subComp.destroy();
                this._subComp = null;
            }
        }
    };

    _pCellControl._getBindDataset = function ()
    {
        return this._view ? (this._view._getBindDataSet ? this._view._getBindDataSet() : this._view._binddataset) : null;
    };

    _pCellControl._applyEditorDataset = function (async, prevalue)
    {
        if (!this._editor || !this._writable)
            return;

        var dataset = this._getBindDataset();
        if (dataset)
        {
            var datarow = this._getDataRow();
            var colid = this._refinfo._p_text._bindexpr;
            var value = this._editor._getValueData();
            var view = this._view;

            if (this._refinfo._p_text._bindtype == 1)
            {
                view._is_async_recreate = async;
                view._dsEventOccured = true;

                var fail = { status: "" };
                dataset.setColumn(datarow, colid, value, fail);

                if (fail.status == "cancolumnchange")
                {
                    this._editor.set_value(prevalue);
                }
                view._is_async_recreate = false;
                view._dsEventOccured = false;
            }
        }
    };

    _pCellControl._getDataRow = function ()
    {
        // todo : tree
        return this._rowidx;
    };

    _pCellControl._isFakeCell = function ()
    {
        var datarow = this._getDataRow();
        var dataset = this._getBindDataset();
        var rowcount = (dataset) ? dataset.rowcount : 0;

        if (rowcount <= datarow || datarow < -2)
            return true;

        return false;
    };

    _pCellControl.on_change_containerRect = function (width, height)
    {
        this._updateAvailableArea();
    };

    _pCellControl.on_getIDCSSSelector = function ()
    {
        if (this._isSubCell)
            return "subcell";

        return "cell";
    };

    _pCellControl._getClassCSSSelector = function ()
    {
        var cssarr = nexacro.Component.prototype._getClassCSSSelector.call(this);

        if (this._refinfo._checkGroupCellStyle(null, this._getDataRow()) >= 1 && !this._is_export_temp)
        {
            if (!cssarr)
                cssarr = [];

            var dataset = this._getBindDataset();
            var datarow = this._getDataRow();
            var rowtype = dataset ? dataset.getRowType(datarow) : 1;
            var level = this._refinfo._getGroupRowLevel(datarow);
            var group = this._refinfo._groupcol;

            if (rowtype == 16 && level <= group)
                cssarr.push("subsumcell");
            else
                cssarr.push("groupcell");
        }
        else if (this._isGroupSubsumStyle() && !this._is_export_temp)
        {
            if (!cssarr)
                cssarr = [];

            cssarr.push("subsumcell");
        }
        else if (this._rowidx >= 0 && this._rowidx % 2)
        {
            if (!cssarr)
                cssarr = [];

            cssarr.push("oddcell");
        }

        return cssarr;
    };

    _pCellControl._isGroupSubsumStyle = function (info) // override
    {
        var dataset = this._getBindDataset();
        if (dataset)
        {
            var datarow = this._getDataRow();

            if (dataset.getRowType(datarow) == 16)
                return true;
        }
        return false;
    };

    _pCellControl._getGroupCount = function ()   // need override..
    {
        return this._refinfo._getGroupCount();
    };

    _pCellControl._getElementClassCSSSelector = function ()
    {
        var cssarr = this._getClassCSSSelector(this);

        if (cssarr)
        {
            cssarr.push("dummy"); //GRID
            cssarr.push("dummy"); //BAND
            cssarr.push("dummy"); //ROW
        }

        return cssarr;
    };

    _pCellControl._apply_setfocus = function (evt_name, self_flag)
    {
        if (self_flag || this._env._p_enableaccessibility)
            nexacro.Component.prototype._apply_setfocus.call(this, evt_name);
    };

    _pCellControl.on_apply_prop_tooltip = function ()
    {
        var datarow = this._getDataRow();

        this._p_tooltiptext = this._refinfo._getTooltipText(datarow);
        this._p_tooltiptype = this._refinfo._p_tooltiptype;

        nexacro.Component.prototype.on_apply_prop_tooltip.call(this);

    };

    _pCellControl.on_fire_onsize = function (width, height)
    {
        if (width && height)
            this._setDisplay(true);

        var retn = nexacro.Component.prototype.on_fire_onsize.call(this, width, height);

        if (!width || !height)
            this._setDisplay(false);

        return retn;
    };

    _pCellControl._setDisplay = function (v)
    {
        if (this._control_element)
        {
            this._control_element.setElementDisplay((v) ? "" : "none");
        }
    };

    _pCellControl.on_apply_text = function ()
    {
        var text_elem = this._text_elem;

        if (text_elem)
        {
            var cellinfo = this._refinfo;
            var datarow = this._getDataRow();
            var displaytype = cellinfo._getDisplayTypeValue(datarow);
            var strtext = nexacro._toString(this._displaytext);

            if (displaytype == "decoratetext")
            {
                text_elem.setElementDecorateText(strtext);
            }
            else
            {
                if (text_elem.decoration != "")
                {
                    text_elem.decoration = "";
                    text_elem.text = null;
                }

                if (!text_elem.text && strtext)
                {
                    text_elem.setElementText(strtext);
                    if (this._expandCtrl && this._expandCtrl._is_created)
                    {
                        this._control_element.bringToFrontElement(this._expandCtrl._control_element);
                    }
                    if (this._filterCtrl && this._filterCtrl._is_created)
                    {
                        this._control_element.bringToFrontElement(this._filterCtrl._control_element);
                    }
                    if (this._sortCtrl && this._sortCtrl._is_created)
                    {
                        this._control_element.bringToFrontElement(this._sortCtrl._control_element);
                    }
                }
                else
                {
                    text_elem.setElementText(strtext);
                }
            }
        }
    };

    _pCellControl.on_apply_wordWrap = function ()
    {
        var text_elem = this._text_elem;

        if (text_elem)
        {
            var datarow = this._getDataRow();
            var wordwrap = this._refinfo._getWordwrap(datarow);
            var enabledselector = null;
            // [23/02/24] - 오지현 - [RP 96248][css에서 그리드 head wordWrap 설정 시 적용되지 않는 것처럼 보이는 현상]
            if (nexacro._Browser == "Runtime")
            {
                if (this._cssselector)
                    enabledselector = this._cssselector.enabled;
            }

            if (enabledselector && (enabledselector.wordWrap != null && enabledselector.wordWrap != undefined) && wordwrap == null)
                text_elem.setElementWordWrap(enabledselector.wordWrap);
            else
                text_elem.setElementWordWrap(wordwrap);
        }
    };

    _pCellControl.on_apply_textAlign = function (halign)
    {
        var text_elem = this._text_elem;

        if (text_elem)
            text_elem.setElementTextAlign(halign);

        if (this._subComp)
        {
            if (this._subComp._setAlign)
                this._subComp._setAlign(halign, this.verticalAlign);
            else
                this._subComp.set_textAlign(halign);
        }
    };

    _pCellControl.on_apply_verticalAlign = function (valign)
    {
        var text_elem = this._text_elem;

        if (text_elem)
            text_elem.setElementVerticalAlign(valign);

        if (this._subComp)
        {
            if (this._subComp._setAlign)
                this._subComp._setAlign(this.textAlign, valign);
            else
                this._subComp.set_verticalAlign(valign);
        }
    };

    _pCellControl._needToggle = function ()
    {
        var datarow = this._getDataRow();
        var cellinfo = this._refinfo;
        var displaytype = cellinfo._getDisplaytype(datarow);
        var edittype = cellinfo._getEdittype(datarow);
        var view = this._view;

        if (nexacro._toBoolean(view._p_readonly))
            return;

        if (edittype == "checkbox")
        {
            if (displaytype == "checkboxcontrol")
            {
                if (this._subComp)
                    this._subComp._toggleCheck();
            }
            else
            {
                var v = cellinfo._getValue(datarow);
                v = nexacro._toBoolean(v);
                v = (v) ? 0 : 1;

                if (cellinfo.text._bindtype == 1)
                {
                    var dataset = this._getBindDataset();
                    view._dsEventOccured = true;

                    dataset.setColumn(datarow, cellinfo.text._bindexpr, v);

                    if (this._env._p_enableaccessibility)
                        this._setAccessibilityStatChecked(nexacro._toBoolean(v));

                    view._dsEventOccured = false;
                }
            }
        }
        else if (edittype == "radioitem")
        {
            if (displaytype == "radioitemcontrol")
            {
                if (this._subComp)
                    this._subComp._itemSelect();
            }
            else
            {
                var v = cellinfo.radioitemcodevalue;

                if (cellinfo.text._bindtype == 1)
                {
                    var dataset = this._getBindDataset();
                    view._dsEventOccured = true;

                    dataset.setColumn(datarow, cellinfo.text._bindexpr, v);

                    if (this._env._p_enableaccessibility)
                        this._setAccessibilityStatChecked(nexacro._toBoolean(v));

                    view._dsEventOccured = false;
                }
            }
        }
    };

    _pCellControl.on_apply_subControlAlign = function (halign, valign)
    {
        var controlSizeW = this._subComp._adjust_width;
        var controlSizeH = this._subComp._adjust_height;
        var clientrect = this._getAvailableRect();
        var x = clientrect.left, y = clientrect.top;
        var w = clientrect.width, h = clientrect.height;

        switch (halign)
        {
            case "left":
                break;
            case "right":
                x += (w - controlSizeW);
                break;
            default:
                x += ((w - controlSizeW) / 2);
                break;
        }
        switch (valign)
        {
            case "top":
                break;
            case "bottom":
                y += (h - controlSizeH);
                break;
            default:
                y += ((h - controlSizeH) / 2);
                break;
        }
        this._subComp.move(x, y, this._subComp._adjust_width, this._subComp._adjust_height);
    };

    _pCellControl.on_apply_textDecoration = function (textDecoration)
    {
        var cellinfo = this._refinfo;

        if (!textDecoration && cellinfo.textDecoration)
        {
            if (this.textDecoration != cellinfo.textDecoration)
            {
                this.textDecoration = cellinfo.textDecoration;
                textDecoration = nexacro.TextDecorationObject(this.textDecoration);
                this._textdecoration = textDecoration;
            }
            else
            {
                textDecoration = this._textdecoration;
            }
        }

        if (this._text_elem)
            this._text_elem.setElementTextDecoration(textDecoration);
        else if (this._subComp)
            this._subComp.set_textDecoration(this.textDecoration);
    };

    _pCellControl._hideInnerElement = function ()
    {
        var subcells = this.subcells;

        for (var i = 0, n = subcells.length; i < n; i++)
            subcells[i].set_visible(false);

        if (this._subComp)
            this._subComp.set_visible(false);
        else if (this._text_elem)
            this._text_elem.setElementVisible(false);

        this._hideInner = true;
        this.__showExpand(false);

        if (this._curDisplayType == "treeitemcontrol")
            this._subComp._treeline_visible(false);
    };

    _pCellControl._isShowEditor = function ()
    {
        if (this._editor)
            return this._editor._p_visible;

        return false;
    };

    _pCellControl._isEnterDownable = function ()
    {
        var cellinfo = this._refinfo;
        var datarow = this._getDataRow();
        var edittype = cellinfo._getEdittype(datarow);

        if ((this._curDisplayType == "checkboxcontrol" && edittype == "checkbox") || (this._curDisplayType == "radioitemcontrol" && edittype == "radioitem"))
            return true;
        else if (edittype == "button")
            return false;
        else if (this._isShowEditor())
            return true;

        return false;
    };

    _pCellControl._showInnerElement = function ()
    {
        var subcells = this.subcells;

        for (var i = 0, n = subcells.length; i < n; i++)
            subcells[i].set_visible(true);

        if (this._isShowEditor() == false)
        {
            if (this._subComp)
                this._subComp.set_visible(true);
            else if (this._text_elem)
                this._text_elem.setElementVisible(true);
        }
        this._hideInner = false;
        this.__showExpand(true);

        if (this._curDisplayType == "treeitemcontrol")
            this._subComp._treeline_visible(true);
    };

    _pCellControl.__showExpand = function (flag)
    {
        if (!this._expandCtrl)
            return;

        if (this._fakecell)
        {
            this._expandCtrl.set_visible(false);
            return;
        }

        var cellinfo = this._refinfo;
        var datarow = this._getDataRow();
        var expandshow = cellinfo._getAttrValue(cellinfo._p_expandshow, datarow);

        if (expandshow == "show")
        {
            if (flag == false)
                this._expandCtrl.set_visible(this.selected);    // hide 처리시 select가 될 경우엔 보임. 
            else
                this._expandCtrl.set_visible(true);
        }
        else
        {
            this._expandCtrl.set_visible(false);
        }
        this._updateAvailableArea();
    };

    _pCellControl._createDisplayer = function (displayType)
    {
        var view = this._view;
        var cellinfo = this._refinfo;

        switch (displayType)
        {
            case "buttoncontrol":
                this._createButtonDisplayer();
                break;
            case "checkboxcontrol":
                this._createCheckboxDisplayer();
                break;
            case "imagecontrol":
                this._createImageDisplayer();
                break;
            case "treeitemcontrol":
                this._createTreeDisplayer();
                break;
            case "rowgroupcontrol":
                this._createRowGroupDisplayer();
                break;
            case "combocontrol":
                this._createComboDisplayer();
                break;
            case "multicombocontrol":
                this._createMultiComboDisplayer();
                break;
            case "calendarcontrol":
                this._createCalendarDisplayer();
                break;
            case "maskeditcontrol":
                this._createMaskEditDisplayer();
                break;
            case "textareacontrol":
                this._createTextAreaDisplayer();
                break;
            case "progressbarcontrol":
                this._createBarDisplayer();
                break;
            case "editcontrol":
                this._createEditDisplayer();
                break;
            case "radioitemcontrol":
                this._createRadioItemDisplayer();
                break;
            //case "customcontrol":
              //  this._createCustomDisplayer();
                //break;
            case "htmlcontrol":
                this._createHtmlControlDisplayer();
                break;
            default:
                this._createTextDisplayer();
                break;
        }

        if (this._subComp)
        {
            this._subComp.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
            {
                if (this._displaymode)
                {
                    if (changestatus == "nulltext" && value)
                        return changestatus;
                    else
                        return applyuserstatus;
                }
                return applyuserstatus;
            };
        }

        this._curDisplayType = displayType;
        this.on_apply_textAlign(cellinfo.textAlign);
        this.on_apply_verticalAlign(cellinfo.verticalAlign);
        //this.on_apply_cursor(this.cursor);

        // listview 예외처리
        if (view && view._applyCellSelection)
            view._applyCellSelection();
    };

    _pCellControl._isChangeDisplayer = function (displayType)
    {
        var view = this._view;
        var cur_disptype = this._curDisplayType;

        if ((displayType != cur_disptype) || (view && view._changeDisplayer))
            return true;

        return false;
    };

    _pCellControl._updateDisplayer = function ()
    {
        var show = true;
        var view = this._view;
        var cellinfo = this._refinfo;
        var datarow = this._getDataRow();
        var displayType = cellinfo._getDisplayTypeValue(datarow);
        if (displayType === undefined)
            displayType = "normal";
        if (cellinfo._p_displaytype._bindtype > 0 && ((displayType === "treeitemcontrol") || (displayType === "rowgroupcontrol")))
        {
            if (!view._hasTree && view._setTreeCellinfo)
            {
                view._setTreeCellinfo(cellinfo, this._is_tempcell);
                view._useexprtree = true;
            }
        }
        var expandshow = cellinfo._getAttrValue(cellinfo._p_expandshow, datarow);
        var expandsize = cellinfo._getAttrValue(cellinfo._p_expandsize, datarow);
        if (expandsize !== 0 && !expandsize)
            expandsize = 16;

        if (expandshow == "show")
        {
            if (!this._expandCtrl)
            {
                this._createExpandDisplayer();
            }
            else
            {
                if (this._expand_width != expandsize)
                {
                    this._expandCtrl.destroy();
                    this._expandCtrl = null;
                    this._createExpandDisplayer();
                }
            }
            this._changeClientmode("expand");
        }
        else
        {
            if (this._expandCtrl)
            {
                this._expand_width = 0;
                this._expandCtrl.destroy();
                this._expandCtrl = null;
                this._changeClientmode("text");
            }
        }

        if (this._band.id == "head")
        {
            var filtershow = cellinfo._getAttrValue(cellinfo._p_filtercolumn, datarow);

            if (filtershow)
            {
                if (!this._filterCtrl)
                {
                    this._createFilterIcon();
                }
                else
                {
                    if (this._refinfo._filterstr)
                        this._filterCtrl._changeUserStatus("selected", true);
                    else
                        this._filterCtrl._changeUserStatus("selected", false);
                }

                this._changeClientmode("expand");
            }
            else
            {
                if (this._filterCtrl)
                {
                    this._filterCtrl.destroy();
                    this._filterCtrl = null;
                    this._changeClientmode("text");
                }
            }

            var sortshow = cellinfo._getAttrValue(cellinfo._p_sortcolumn, datarow);

            if (sortshow)
            {
                if (!this._sortCtrl)
                {
                    this._createSortIcon();
                }
                else
                {
                    this._sortCtrl.set_text(cellinfo._sortidx);
                    var w = this._sortCtrl._on_getFitSize()[0];
                    this._sortCtrl.set_width(w);

                    if (this._refinfo._sortstatus)
                    {
                        if (this._refinfo._sortstatus == "descending")
                            this._sortCtrl._changeUserStatus("ascending", false);
                        else if (this._refinfo._sortstatus == "ascending")
                            this._sortCtrl._changeUserStatus("descending", false);

                        this._sortCtrl._changeUserStatus(this._refinfo._sortstatus, true);
                    }
                    else
                    {
                        this._sortCtrl._changeUserStatus("ascending", false);
                        this._sortCtrl._changeUserStatus("descending", false);
                    }
                }

                this._changeClientmode("expand");
            }
            else
            {
                if (this._sortCtrl)
                {
                    this._sortCtrl._removeEventHandler("onclick", this.on_fire_onsortclick);
                    this._sortCtrl.destroy();
                    this._sortCtrl = null;
                    this._changeClientmode("text");
                }
            }
        }

        if (this._isChangeDisplayer(displayType))
        {
            if (this._curDisplayType != "")
                this._destroyDisplayer(view ? view._lbuttondown_proc : null);

            this._createDisplayer(displayType);

            if (view && view._lbuttondown_proc)
            {
                var window = this._getWindow();

                if (window._cur_ldown_elem && window._cur_ldown_elem.parent == null && this._p_parent != null) // ex) displaytype expr 사용시
                    window._cur_ldown_elem = this;
            }

            var def_align = cellinfo._getDefaultTextAlign(displayType, datarow);
            var textelem = this._text_elem;

            if (textelem)
                textelem.setElementTextAlignByClassCSSSelector(def_align);

            if (this._is_created && this._subComp && !this._subComp._is_created)
                this._subComp.on_created();

            this._updateEditor();
        }
        else
        {
            this.on_apply_wordWrap();
        }

        var fake = view ? view._isFakeCell(datarow) : this._isFakeCell();

        if (fake && view)
        {
            if (view.fillareatype == "datarow")
            {
                if (!this._isDisplayDataType(displayType))
                {
                    // displayType =="date"도 display 되야함
                    if (displayType != "date")
                    {
                        show = false;
                        if (fake != this._fakecell || view._resetfillarea)
                        {
                            this._setContentsVisible("fake", false);
                            this._fakecell = fake;
                        }
                    }
                }
            }
            else if (view.fillareatype == "linerow")
            {
                show = false;
                if (fake != this._fakecell || view._resetfillarea)
                {
                    this._setContentsVisible("fake", false);
                    this._fakecell = fake;
                }
            }
            else if (view.fillareatype == "controlrow")
            {
                if (this._isDisplayDataType(displayType))
                {
                    show = false;
                    if (fake != this._fakecell || view._resetfillarea)
                    {
                        this._setContentsVisible("fake", false);
                        this._fakecell = fake;
                    }
                }
            }
        }
        else
        {
            if (fake != this._fakecell)
            {
                this._setContentsVisible("fake", true);
                this._fakecell = fake;
            }
        }
        return show;
    };

    _pCellControl._isUpdateArea = function ()
    {
        return true;
    };

    _pCellControl.on_apply_select = function (select)
    {
        this._updateAll();
    };


    _pCellControl._isSelectedColor = function ()
    {
        var useselcolor = this._view ? this._view.useselcolor : false;
        return (this.selected && ((useselcolor == undefined) ? true : useselcolor));
    };

    _pCellControl._getRemoveLine = function ()
    {
        var remove_l, remove_t, remove_r, remove_b; // cell line 처리

        if (this._isSubCell)
        {
            remove_l = true;
            remove_t = true;
            remove_r = true;
            remove_b = true;
        }
        else
        {
            remove_l = true;
            remove_t = true;
            remove_r = false;
            remove_b = false;
        }

        return [remove_l, remove_t, remove_r, remove_b];
    };

    _pCellControl.__update = function (status, onlycontents, nochk_updatearea, bexport)
    {
        if (!this._is_alive)
            return false;

        var cellinfo = this._refinfo;

        if (!cellinfo._property_map)
            return false;

        var view = this._view;
        var evenodd_change = false;

        if (this._p_parent._rowidx >= 0)
        {
            if (this._rowidx != this._p_parent._rowidx)    // parent는 변경됬는데 update가 안됬을 경우
            {
                var oldrowidx = this._rowidx;
                this._rowidx = this._p_parent._rowidx; // parent : cell or viewrow
                if ((this._rowidx % 2) != (oldrowidx % 2))
                    evenodd_change = true;

                this._updateEditor();
            }
        }

        var datarow = this._getDataRow();

        //--------------------------------------------------------------------------
        var cssname = cellinfo._getAttrValue(cellinfo._p_cssclass, datarow);
        // expr update

        if (this._p_cssclass != cssname)
        {
            this.set_cssclass(cssname);
        }
        else
        {
            var dataset = this._getBindDataset();

            this._is_export_temp = bexport;

            if (evenodd_change || (dataset && (this._getGroupCount() > 0 || dataset.getMaxRowLevel() > 0)))
                this.on_apply_cssclass();

            this._is_export_temp = null;
        }

        cellinfo._setCellControlProperty(this, datarow);    // cellinfo property -> cellcontrol set 필요.
        //--------------------------------------------------------------------------

        var control_elem = this._control_element;
        if (control_elem)
        {
            if (!nochk_updatearea && this._isUpdateArea() == false)
                return false;

            var readonly = view ? !!view._p_readonly : false;

            if (this._is_use_auto_selected_status)
                this._changeUserStatus("selected", this._isSelectedColor());

            if (cellinfo._blinked_status[datarow])
                this._changeUserStatus("blinked", true);
            else
                this._changeUserStatus("blinked", false);

            this._changeStatus("readonly", readonly);

            this._disp_show = this._updateDisplayer();

            if (!onlycontents && status)
                this._changeStatus(status, true);

            this._displaytext = this._getDisplayText();
            this.on_apply_text();
            this.on_apply_textDecoration();

            var is_header_style = false;

            if (datarow >= 0)
            {
                if (cellinfo._isHideContentsForGroupCell(datarow))       // 역'ㄱ' 안의 subsum에 해당 되는 cell
                    this._setContentsVisible("groupcell", false);
                else
                    this._setContentsVisible("groupcell", true);
            }

            var subComp = this._subComp;
            if (subComp)
            {
                //subComp._changeStatus("readonly", readonly);
                subComp._updateAll(true, readonly);
            }

            if (this._expandCtrl)
            {
                // this._expandCtrl._changeStatus("readonly", readonly);
                this._expandCtrl._updateAll(true, readonly);
            }

            if (this._filterCtrl)
            {
                this._filterCtrl._updateAll(true, readonly);
            }

            if (this._sortCtrl)
            {
                this._sortCtrl._updateAll(true, readonly);
            }

            this.on_apply_prop_tooltip();

            if (this._env._p_enableaccessibility)
                this.on_apply_accessibility();
        }
        return true;
    };

    _pCellControl._updateAll = function (status, onlycontents, nochk_updatearea)
    {
        if (this.__update(status, onlycontents, nochk_updatearea))
        {
            var control_elem = this._control_element;
            if (control_elem)
            {
                var remove_line = this._getRemoveLine();
                var remove_l, remove_t, remove_r, remove_b; // cell line 처리

                remove_l = remove_line[0];
                remove_t = remove_line[1];
                remove_r = remove_line[2];
                remove_b = remove_line[3];

                if (this.subcells.length > 0)
                {
                    for (var i = 0, n = this.subcells.length; i < n; i++)
                        this.subcells[i]._updateAll();
                }
                else
                {
                    if (this._disp_show && this._hideInner)
                        this._setContentsVisible("fake", true);
                }

                if (!onlycontents)
                    this._control_element.setElementBorderNone(remove_l, remove_t, remove_r, remove_b, this._isRtl(this._view ? this._view : undefined));

                if (control_elem._mode == "text")
                    this._changeClientmode("text");
            }
        }
    };

    _pCellControl.on_apply_border = function (border)
    {
        nexacro.Component.prototype.on_apply_border.call(this, border);
        var control_elem = this._control_element;

        if (control_elem)
            control_elem._refreshBorderNone();
    };

    _pCellControl._updateAllEx = function (prop, rowidx) // for autosize
    {
        if (!this._is_alive)
            return false;

        var cellinfo = this._refinfo;
        var view = this._view;
        var evenodd_change = false;

        if (this._p_parent._rowidx >= 0)
        {
            if (this._rowidx != this._p_parent._rowidx)    // parent는 변경됬는데 update가 안됬을 경우
            {
                var oldrowidx = this._rowidx;
                this._rowidx = this._p_parent._rowidx; // parent : cell or viewrow
                if ((this._rowidx % 2) != (oldrowidx % 2))
                    evenodd_change = true;
            }
        }

        var datarow = rowidx;

        //--------------------------------------------------------------------------
        var cssname = cellinfo._getAttrValue(cellinfo._p_cssclass, datarow);
        // expr update

        if (this._p_cssclass != cssname)
        {
            this.set_cssclass(cssname);
        }
        else
        {
            if (evenodd_change)
                this.on_apply_cssclass();
        }

        cellinfo._setCellControlPropertyForAutosize(this, datarow, prop);
        //--------------------------------------------------------------------------

        var control_elem = this._control_element;
        if (control_elem)
        {
            var readonly = view ? !!view._p_readonly : false;

            if (this._is_use_auto_selected_status)
                this._changeUserStatus("selected", this._isSelectedColor());

            this._changeStatus("readonly", readonly);
            this._disp_show = this._updateDisplayer();

            this._displaytext = this._getDisplayText();
            this.on_apply_text();
            this.on_apply_textDecoration();

            var subComp = this._subComp;
            if (subComp)
            {
                //subComp._changeStatus("readonly", readonly);
                subComp._updateAll(true, readonly);
            }

            if (this._expandCtrl)
            {
                // this._expandCtrl._changeStatus("readonly", readonly);
                this._expandCtrl._updateAll(true, readonly);
            }

            if (this._filterCtrl)
            {
                // this._expandCtrl._changeStatus("readonly", readonly);
                this._filterCtrl._updateAll(true, readonly);
            }

            if (this._sortCtrl)
            {
                // this._expandCtrl._changeStatus("readonly", readonly);
                this._sortCtrl._updateAll(true, readonly);
            }


            var remove_line = this._getRemoveLine();
            var remove_l, remove_t, remove_r, remove_b; // cell line 처리

            remove_l = remove_line[0];
            remove_t = remove_line[1];
            remove_r = remove_line[2];
            remove_b = remove_line[3];

            this._control_element.setElementBorderNone(remove_l, remove_t, remove_r, remove_b, this._isRtl(this._view ? this._view : undefined));
        }
        return true;
    };

    _pCellControl.on_apply_prop_cssclass = function ()
    {
        if (this._editor)
            this._editor.on_apply_cssclass();

        if (this._subComp)
            this._subComp.on_apply_cssclass();

        if (this._expandCtrl)
            this._expandCtrl.on_apply_cssclass();

        if (this._filterCtrl)
            this._filterCtrl.on_apply_cssclass();

        if (this._sortCtrl)
            this._sortCtrl.on_apply_cssclass();
    };

    _pCellControl.on_apply_cursor = function (cursor)
    {
        nexacro.Component.prototype.on_apply_cursor.call(this, cursor);

        if (this._subComp)
            this._subComp.set_cursor(cursor);
    };

    _pCellControl._getAvailableRect = function ()
    {
        var rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
        rect.left = this._getClientLeft();
        rect.top = this._getClientTop();
        rect.right = this._getClientLeft() + this._getClientWidth();
        rect.bottom = this._getClientTop() + this._getClientHeight();
        rect.width = this._getClientWidth();
        rect.height = this._getClientHeight();

        var expand_ctrl = this._expandCtrl;

        if (expand_ctrl && expand_ctrl._p_visible)
        {
            rect.width -= expand_ctrl.width;
            rect.right -= expand_ctrl.width;
        }

        var filter_ctrl = this._filterCtrl;

        if (filter_ctrl && filter_ctrl._p_visible)
        {
            rect.width -= filter_ctrl.width;
            rect.right -= filter_ctrl.width;
        }

        var sort_ctrl = this._sortCtrl;

        if (sort_ctrl && sort_ctrl._p_visible)
        {
            rect.width -= sort_ctrl.width;
            rect.right -= sort_ctrl.width;
        }

        return rect;
    };

    _pCellControl._changeClientmode = function (mode)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            if (this._refinfo._subcells.length)
            {
                mode = "normal";
            }
            else if (mode == "expand")
            {
                if (this._client_mode != "normal")
                    mode = "expandtext";
                else
                    mode = "normal";
            }
            else if (mode == "text")
            {
                if (this._expandCtrl || this._filterCtrl || this._sortCtrl)
                    mode = "expandtext";
            }

            if (mode == "text" || mode == "expandtext")
            {
                if (!this._text_elem)
                {
                    var disp = this._curDisplayType;
                    if (!disp)
                    {
                        var datarow = this._getDataRow();
                        disp = this._refinfo._getDisplayTypeValue(datarow);
                    }

                    if (this._use_flex_text_node && !this._hasEditor() && disp != "decoratetext")
                        this._text_elem = new nexacro.TextBoxVirtualFlexElement(control_elem, mode);  // single node
                    else
                        this._text_elem = new nexacro.TextBoxElement(control_elem, "text");
                }
            }
            else
            {
                if (this._text_elem)
                {
                    this._text_elem.destroy();
                    this._text_elem = null;
                }
            }

            this._updateAvailableArea(true);
            this._client_mode = mode;
        }
    };

    _pCellControl._createExpandDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var cellinfo = this._refinfo;
            var datarow = this._getDataRow();
            var border = this._getCurrentStyleBorder();
            var padding = this._getCurrentStylePadding();

            this._expand_width = cellinfo._getAttrValue(cellinfo._p_expandsize, datarow);

            var l = this._adjust_width - this._expand_width - ((border) ? border.right._width : 0) - ((padding) ? padding.right : 0);
            var t = this._getClientTop();
            var r = l + this._expand_width;
            var b = t + this._getClientHeight();

            if (l < 0)
            {
                l = this._getClientLeft();
                r = l + this._getClientWidth();
            }

            var expCtrl = this._expandCtrl = new nexacro[this._cellExpandObj](this, l, t, r, b);
            expCtrl.createComponent();
        }
    };

    _pCellControl._createFilterIcon = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var border = this._getCurrentStyleBorder();
            var padding = this._getCurrentStylePadding();

            var filterCtrl = this._filterCtrl = new nexacro[this._cellFilterIconObj](this, 0, 0, 0, 0);

            if (this._refinfo._filterstr)
                filterCtrl._changeUserStatus("selected", true);
            else
                filterCtrl._changeUserStatus("selected", false);

            filterCtrl.createComponent();
            var w = filterCtrl._on_getFitSize()[0];

            var l = this._adjust_width - this._expand_width - w - ((border) ? border.right._width : 0) - ((padding) ? padding.right : 0);
            var t = this._getClientTop();
            var b = t + this._getClientHeight();

            if (l < 0)
            {
                l = this._getClientLeft();
                w = this._getClientWidth();
            }

            filterCtrl.move(l, t, w, b);
        }
    };

    _pCellControl._createSortIcon = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var border = this._getCurrentStyleBorder();
            var padding = this._getCurrentStylePadding();

            var sortCtrl = this._sortCtrl = new nexacro[this._cellSortIconObj](this, 0, 0, 0, 0);
            sortCtrl._setEventHandler("onclick", this.on_fire_onsortclick, this);
            sortCtrl.set_text(this._refinfo._sortidx);

            if (this._refinfo._sortstatus)
                sortCtrl._changeUserStatus(this._refinfo._sortstatus, true);

            sortCtrl.createComponent();

            var w = sortCtrl._on_getFitSize()[0];
            var l = this._adjust_width - this._expand_width - w - ((border) ? border.right._width : 0) - ((padding) ? padding.right : 0);
            var t = this._getClientTop();
            var b = t + this._getClientHeight();

            if (this._filterCtrl)
                l -= this._filterCtrl._adjust_width;

            if (l < 0)
            {
                l = this._getClientLeft();
                w = this._getClientWidth();
            }

            sortCtrl.move(l, t, w, b);
        }
    };

    _pCellControl._createTextDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._changeClientmode("text"); // text_elem 생성

            var text_elem = this._text_elem;
            if (text_elem)
            {
                if (!this._is_created)
                {
                    this._displaytext = this._getDisplayText();
                    this.on_apply_text();
                }
                else
                {
                    text_elem.create(this._getWindow());
                }
                this.on_apply_textDecoration();
                this.on_apply_wordWrap();
            }
        }
    };

    _pCellControl._createButtonDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = new nexacro[this._cellButtonObj]("cellbutton", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);
            var datarow = this._getDataRow();
            var wordwrap = this._refinfo._getWordwrap(datarow);
            controlComp.set_wordWrap(wordwrap);

            this._subComp = controlComp;
        }
    };

    _pCellControl._createCheckboxDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._changeClientmode("normal");
            var controlComp = new nexacro[this._cellCheckBoxObj]("cellcheckbox", 0, 0, 0, 0, this, true);
            controlComp.createComponent(true);
            controlComp._skip_mobile_tabfocus = true;
            this._subComp = controlComp;
        }
    };

    _pCellControl._createRadioItemDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._changeClientmode("normal");
            var controlComp = new nexacro[this._cellRadioItemObj]("cellradioitem", 0, 0, 0, 0, this, true);
            controlComp.createComponent(true);
            controlComp._skip_mobile_tabfocus = true;

            this._subComp = controlComp;
        }
    };

    _pCellControl._createImageDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = new nexacro[this._cellImageObj]("cellimage", rect.left, rect.top, rect.width, rect.height, this);
            controlComp.createComponent(true);

            this._subComp = controlComp;
        }
    };

    _pCellControl._createComboDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = new nexacro[this._cellComboObj]("cellcombo", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);
            controlComp.comboedit._input_element._isUseDelCaret = true;

            this._subComp = controlComp;
        }
    };

    _pCellControl._createMultiComboDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = new nexacro[this._cellMultiComboObj]("cellmulticombo", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);
            if (!this._tagmode)
                controlComp.multicombotext._input_element._isUseDelCaret = true;
            else
                controlComp.multicomboedit._input_element._isUseDelCaret = true;
            this._subComp = controlComp;
        }
    };

    _pCellControl._createCalendarDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellCalendarObj]("cellcalendar", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp._setAccessibilityEnable(false);
            controlComp.createComponent(true);
            controlComp.calendaredit._input_element._isUseDelCaret = true;

            this._subComp = controlComp;
        }
    };

    _pCellControl._createEditDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellEditObj]("celledit", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);
            controlComp._input_element._isUseDelCaret = true;

            this._subComp = controlComp;
        }
    };

    _pCellControl._createMaskEditDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellMaskEditObj]("cellmaskedit", rect.left, rect.top, rect.width, rect.height, this, true, true);
            controlComp.createComponent(true);
            controlComp._input_element._isUseDelCaret = true;

            this._subComp = controlComp;
        }
    };


    _pCellControl._createTextAreaDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellTextAreaObj]("celltextarea", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);
            controlComp._input_element._isUseDelCaret = true;
            var datarow = this._getDataRow();
            var wordwrap = this._refinfo._getWordwrap(datarow);
            controlComp.set_wordWrap(wordwrap);

            this._subComp = controlComp;
        }
    };

    _pCellControl._createBarDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellProgressBarObj]("cellprogressbar", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);

            this._subComp = controlComp;
        }
    };
    
    _pCellControl._createHtmlControlDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellHTMLControlObj]("cellhtmlcontrol", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);

            this._subComp = controlComp;
        }
    };
    /*
    _pCellControl._createCustomDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var controltype = this._refinfo._getAttrValue(this._refinfo.customcontroltypename, this._getDataRow());

            if (!controltype)
                return;

            var rect = this._getControlRect();
            this._changeClientmode("normal");
            var controlComp = this._subComp = new nexacro[this._cellCustomObj]("cellcustom", rect.left, rect.top, rect.width, rect.height, this, true);
            controlComp.createComponent(true);

            this._subComp = controlComp;
        }
    };
    */
    _pCellControl._createTreeDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            var left = rect.left;
            var top = rect.top;
            var width = rect.width;
            var height = rect.height;

            this._changeClientmode("normal");

            var controlComp = this._subComp = new nexacro[this._cellTreeObj]("celltreeitem", left, top, width, height, null, null, this);
            controlComp.createComponent(true);
            this._subComp = controlComp;
        }

        var view = this._view;
        var cellinfo = this._refinfo;

        if (view) view._treeCellinfo = cellinfo;
    };

    _pCellControl._createRowGroupDisplayer = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var rect = this._getControlRect();
            var left = rect.left;
            var top = rect.top;
            var width = rect.width;
            var height = rect.height;

            this._changeClientmode("normal");

            var controlComp = this._subComp = new nexacro[this._cellRowGroupExpandObj]("cellrowgroup", left, top, width, height, null, null, this);
            controlComp.createComponent(true);
            this._subComp = controlComp;
        }

        var view = this._view;
        var cellinfo = this._refinfo;

        if (!this._isSubCell)
        {
            cellinfo._p_suppress._set(cellinfo._groupcol + 1);
            if (view)
            {
                view._treeCellinfo = cellinfo;
                view._is_use_suppress = true;
            }
        }
    };

    _pCellControl._updateAvailableArea = function (force)
    {
        var rc = this._getAvailableRect();
        var subcomp = this._subComp;

        var l = rc.left;
        var t = rc.top;
        var w = rc.width;
        var h = rc.height;

        if (!force)
        {
            if (this._avail_left == l && this._avail_top == t && this._avail_width == w && this._avail_height == h)
                return false;
        }

        if (subcomp)
        {
            if (this._curDisplayType == "checkboxcontrol" || this._curDisplayType == "radioitemcontrol")
                this.on_apply_subControlAlign("center", "middle");    // 현재는 중앙 고정값으로 사용.
            else
            {
                var ctrlrc = this._getControlRect();
                subcomp.move(ctrlrc.left, ctrlrc.top, ctrlrc.width, ctrlrc.height);
            }
        }

        if (this._text_elem)
        {
            this._text_elem.setElementMove(l, t, w, h);
        }

        if (this._editor && this._isConditionEditor())
            this._editor.move(l, t, w, h);

        var expand_ctrl = this._expandCtrl;

        if (expand_ctrl)
        {
            var left = this._getClientWidth() + this._getClientLeft() - this._expand_width;
            var top = rc.top;
            var width = this._expand_width;
            var height = rc.height;

            if (left < 0)
            {
                left = rc.left;
                width = this._getClientWidth();
            }

            expand_ctrl.move(left, top, width, height);
        }

        var filter_ctrl = this._filterCtrl;

        if (filter_ctrl)
        {
            var left = this._getClientWidth() + this._getClientLeft() - this._expand_width - filter_ctrl._adjust_width;
            var top = rc.top;
            var width = filter_ctrl._adjust_width;
            var height = rc.height;

            filter_ctrl.move(left, top, width, height);
        }

        var sort_ctrl = this._sortCtrl;

        if (sort_ctrl)
        {
            var left = this._getClientWidth() + this._getClientLeft() - this._expand_width - (filter_ctrl ? filter_ctrl._adjust_width : 0) - sort_ctrl._adjust_width;
            var top = rc.top;
            var width = sort_ctrl._adjust_width;
            var height = rc.height;

            sort_ctrl.move(left, top, width, height);
        }

        this._avail_left = rc.left;
        this._avail_top = rc.top;
        this._avail_width = rc.width;
        this._avail_height = rc.height;

        return true;
    };

    _pCellControl._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellControl._getDisplayText = function ()
    {
        var cellinfo = this._refinfo;
        var datarow = this._getDataRow();
        var displayText;

        if (cellinfo)
        {
            displayText = cellinfo._getDisplayText(datarow);
            //displayText = this._getStringResourceProperty(displayText);
            return displayText;
        }
        return "";
    };

    _pCellControl._isDisplayDataType = function (displayType)
    {
        if (displayType == "number" || displayType == "exponent" || displayType == "currency" ||
            displayType == "normal" || displayType == "text" || displayType == "decoratetext" || displayType == "mask" || displayType == "combotext" || displayType == "date")
            return true;

        return false;
    };

    _pCellControl._updateEditor = function ()
    {
        var text_elem = this._text_elem;
        var editComp = this._editor;

        if (editComp)
        {
            // round robin 등 cell 재사용시 상황에 맞게 editor show/hide처리
            if (this._isConditionEditor())
            {
                if (text_elem)
                    text_elem.setElementVisible(false);
                if (this._subComp)
                    this._subComp.set_visible(false);

                var rect = this._getControlRect();
                editComp.move(rect.left, rect.top, rect.width, rect.height);
            }
            else
            {
                if (text_elem)
                    text_elem.setElementVisible(true);
                if (this._subComp)
                    this._subComp.set_visible(true);

                editComp.move(-10, -10, 0, 0);
            }
        }
    };

    _pCellControl._isConditionEditor = function ()  // cell정보가 변경되어도 cell 재사용시 edit visible 여부 재정의 하여 사용. (ex : round robin)
    {
        return true;
    };

    _pCellControl._getAutoEnter = function ()
    {
        return this._view.autoenter;
    };
    _pCellControl._getAutoUpdateType = function ()
    {
        return this._view.autoupdatetype;
    };

    _pCellControl._showEditor = function ()
    {
        const enableaccessibility = this._env._p_enableaccessibility;
        if (this._isShowEditor() && !enableaccessibility)
            return;

        var text_elem = this._text_elem;
        // var cellinfo = this._refinfo;
        var editComp;
        var view = this._view;

        if (text_elem)
            text_elem.setElementVisible(false);
        if (this._subComp)
        {
            this._subComp._changeStatus("mouseover", false);

            if (nexacro._isTouchInteraction)
            {
                nexacro._OnceCallbackTimer.callonce(this, function ()   // touch tap에서 밑에 로직이후 visible false 문제로 onclick이 발생하지 않음.
                {
                    if (this._editor != null)   // cell tap시 modal창등이 뜨는경우 editor가 먼저 파괴되는 경우가 있음.
                        this._subComp.set_visible(false);
                });
            }
            else
            {
                this._subComp.set_visible(false);
            }
        }

        if (enableaccessibility && this._isShowEditor())
        {
            editComp = this._editor;
            if (editComp)
                editComp.set_height(this._getControlRect().height);
        }
        else
        {
            editComp = this._createEditor();
            editComp._EditUpdateAll();
            editComp.set_visible(true);
        }

        editComp._setFocus(false);
        if (!editComp._p_autoselect)
        {
            if (editComp.setCaretPos)
                editComp.setCaretPos(0);
            else if (editComp.comboedit && editComp.comboedit.setCaretPos)
                editComp.comboedit.setCaretPos(0);
            else if (editComp.multicomboedit && editComp.multicomboedit.setCaretPos)
                editComp.multicomboedit.setCaretPos(0);
        }

        if (nexacro._isTouchInteraction || (view && view.selectchangetype == "up"))    // 모바일 환경일때 포커스를 준다.
            editComp._setFocus(false);

        if (view && view.autoenter == "select" && view._lbuttondown_proc)
        {
            editComp._user_push = true;
            editComp._changeStatus("focused", true);
            editComp._is_pushed_area = true;
            editComp._is_push = true;
        }
        else
        {
            editComp._changeStatus("focused", true);
        }
        /*
        if (editComp instanceof nexacro._CellCustomControl)
            editComp = editComp._control;
            */
        this._editor = editComp;
    };

    _pCellControl._hideEditor = function ()
    {
        var text = this._text_elem;

        if (!this._hideInner)
        {
            if (text)
                text.setElementVisible(true);

            if (this._subComp)
                this._subComp.set_visible(true);
        }

        var value;
        if (this._editor)
        {
            value = this._editor._getValueData();
            this._destroyEditor();
        }
        return value;
    };

    _pCellControl._hasEditor = function ()
    {
        return this._refinfo._hasEditor(this._getDataRow());
    };

    _pCellControl._destroyEditor = function ()
    {
        var bPreventFocus = false;
        var win = this._getWindow();
        if (win)
            bPreventFocus = !(win._indexOfCurrentFocusPaths(this) > -1); // Modal form load 후 불필요한 포커스 변경 방지

        var editComp;
        if (this._editor)
        {
            if (!this._tempdestroyeditor_list)
                this._tempdestroyeditor_list = [];

            // pre create editor 사이즈 조정
            if (this._static_create)
            {
                this._editor.set_height(0);
                return;
            }
            else
            {
                // 기존에 있는 것도 삭제
                if (this._tempdestroyeditor)
                {
                    this._tempdestroyeditor_list.push(this._tempdestroyeditor);
                }
            }

            editComp = this._tempdestroyeditor = this._editor;

            if (nexacro._Browser == "Safari")
            {
                nexacro._OnceCallbackTimer.callonce(editComp, function ()
                {
                    editComp.set_visible(false);
                });
            }
            else
            {
                editComp.set_visible(false);

                if (this._control_element && !bPreventFocus)
                    this._control_element.setElementFocus();
            }

            //  editor도 접근성에선 삭제
            if (this._env._p_enableaccessibility && this._tempdestroyeditor)
            {
                this._tempdestroyeditor_list.push(this._tempdestroyeditor);
            }

            if (this._tempdestroyeditor_list)
            {
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    var tempeditor = null;
                    var len = this._tempdestroyeditor_list.length;
                    for (var i = 0; i < len; i++)
                    {
                        tempeditor = this._tempdestroyeditor_list.pop();
                        if (tempeditor)
                        {
                            tempeditor.destroy();
                        }
                    }
                });
            }

            if (this._tempdestroyeditor)
            {
                var tempeditor = this._tempdestroyeditor;
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    tempeditor.destroy();
                    tempeditor = null;
                }, 3000);
            }
            this._editor = null;
        }
        else if (this._tempdestroyeditor && nexacro._Browser == "Runtime" && nexacro._OS == "Windows") 
        {
            editComp = this._tempdestroyeditor;
            editComp.set_visible(false);

            this._tempdestroyeditor.destroy();
            this._tempdestroyeditor = null;
        }
    };

    _pCellControl._getFormatSize = function () // parent로 부터 정보를 받아와야함. 필요시 재정의하여 사용.
    {
        return null; //return [width, height];
    };

    _pCellControl._getControlRect = function ()
    {
        var rect = this._getAvailableRect();
        var fomatsize = this._getFormatSize();
        var cellinfo = this._refinfo;
        var controlautosizingtype = cellinfo._getAttrValue(cellinfo._p_controlautosizingtype, this._getDataRow());

        if (fomatsize != null)
        {
            var left = rect.left,
                top = rect.top;
            var width, height, right, bottom;

            var border = this._getCurrentStyleBorder();
            var padding = this._getCurrentStylePadding();
            var fixwidth = fomatsize[0] - (border ? border.left._width + border.right._width : 0) - (padding ? padding.left + padding.right : 0);
            var fixheight = fomatsize[1] - (border ? border.top._width + border.bottom._width : 0) - (padding ? padding.top + padding.bottom : 0);

            if (controlautosizingtype == "none")
            {
                width = fixwidth;

                if (width < rect.width)
                    left += (rect.width - width) / 2;

                right = left + width;

                height = fixheight;

                if (height < rect.height)
                    top += (rect.height - height) / 2;

                bottom = top + height;

                rect.left = left;
                rect.top = top;
                rect.width = width;
                rect.height = height;
                rect.right = right;
                rect.bottom = bottom;
            }
            else if (controlautosizingtype == "width")
            {
                height = fixheight;

                if (height < rect.height)
                    top += (rect.height - height) / 2;

                bottom = top + height;

                rect.top = top;
                rect.height = height;
                rect.bottom = bottom;
            }
            else if (controlautosizingtype == "height")
            {
                width = fixwidth;

                if (width < rect.width)
                    left += (rect.width - width) / 2;

                right = left + width;

                rect.left = left;
                rect.width = width;
                rect.right = right;
            }
        }

        return rect;
    };

    _pCellControl._createidx = 0;
    _pCellControl._createEditor = function (onlyone_control)
    {
        if (this._static_create && !this._isComponentKeydownAction())
            return this._editor;

        var cellinfo = this._refinfo;
        var datarow = this._getDataRow();

        if (onlyone_control || cellinfo._isDisplayEditOnlyOneControl(datarow))
        {
            var dispType = cellinfo._getDisplaytype(datarow);
            this._editor = this._subComp;

            if (this._editor._updateDisplayMode)
                this._editor._updateDisplayMode(false);

            this._subComp = null;
            this._createDisplayer(dispType);
            this._subComp.set_visible(false);
        }
        else
        {
            var editType = cellinfo._getEdittype(datarow);

            var creator = this["_createEditor_" + editType];

            if (editType == "group" && this._band.id != "head")
                creator = null;

            if (creator == null)
                creator = this._createEditor_text;

            this._destroyEditor();

            this._editor = creator.call(this);
        }
        
        this._editor._update_datarow = this._getDataRow();

        this._createidx++;

        return this._editor;
    };

    _pCellControl._createEditor_text = function ()
    {
        var datarow = this._getDataRow();
        var rect = this._getControlRect();
        var cellinfo = this._refinfo;
        var cEdit = new nexacro[this._cellEditObj]("celledit" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        var v = cellinfo._getValue(datarow);
        var editmaxlength = cellinfo._getAttrValue(cellinfo._p_editmaxlength, datarow);
        var dataset = this._getBindDataset();

        if (editmaxlength == 0)
            editmaxlength = dataset ? dataset._getColumnSize(cellinfo.text._bindtype == 1 ? cellinfo.text._bindexpr : 0) : 0;

        cEdit.set_maxlength(editmaxlength);
        cEdit.set_value(v);
        if (cEdit._view)
        {
            var usesoftkeyboard = cEdit._view._initsoftkeyboard;
            cEdit.set_usesoftkeyboard(cEdit._view._getUseSoftKeyboardValue(usesoftkeyboard));
        }

        cEdit.createComponent();

        this._writable = true;

        return cEdit;
    };

    _pCellControl._createEditor_mask = function ()
    {
        var rect = this._getControlRect();
        var cellinfo = this._refinfo;
        var cMaskEdit = new nexacro[this._cellMaskEditObj]("cellmaskedit" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        var datarow = this._getDataRow();
        var value = cellinfo._getValue(datarow);
        var locale = cellinfo._getLocale(datarow);
        var mask = cellinfo._getAttrValue(cellinfo._p_maskeditformat, datarow);
        var type = cellinfo._getAttrValue(cellinfo._p_maskedittype, datarow);
        // var displayType = cellinfo._getDisplaytype(datarow);

        cMaskEdit.set_type(type);
        if (mask)
            cMaskEdit.set_format(mask);

        cMaskEdit.set_locale(locale);
        cMaskEdit.set_value(value);
        if (cMaskEdit._view)
        {
            var usesoftkeyboard = cMaskEdit._view._initsoftkeyboard;
            cMaskEdit.set_usesoftkeyboard(cMaskEdit._view._getUseSoftKeyboardValue(usesoftkeyboard));
        }

        cMaskEdit.createComponent();

        this._writable = true;

        return cMaskEdit;
    };

    _pCellControl._createEditor_combo = function ()
    {
        var rect = this._getControlRect();
        var cCombo = new nexacro[this._cellComboObj]("cellcombo" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        if (cCombo._view)
        {
            var usesoftkeyboard = cCombo._view._initsoftkeyboard;
            cCombo.set_usesoftkeyboard(cCombo._view._getUseSoftKeyboardValue(usesoftkeyboard));
        }

        cCombo.createComponent();
        cCombo._child_editor = cCombo.comboedit;

        this._writable = true;

        return cCombo;
    };

    _pCellControl._createEditor_multicombo = function ()
    {
        var rect = this._getControlRect();
        var cMultiCombo = new nexacro[this._cellMultiComboObj]("cellmulticombo" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        if (cMultiCombo._view)
        {
            var usesoftkeyboard = cMultiCombo._view._initsoftkeyboard;
            cMultiCombo.set_usesoftkeyboard(cMultiCombo._view._getUseSoftKeyboardValue(usesoftkeyboard));
        }

        cMultiCombo.createComponent();
        cMultiCombo._child_editor = cMultiCombo.multicomboedit;

        this._writable = true;

        return cMultiCombo;
    };

    _pCellControl._createEditor_date = function ()
    {
        var datarow = this._getDataRow();
        var rect = this._getControlRect();
        var cellinfo = this._refinfo;
        var cCalendar = new nexacro[this._cellCalendarObj]("cellcalendar" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        var v = cellinfo._getValue(datarow);
        var calendarpopuptype = cellinfo._getAttrValue(cellinfo._p_calendarpopuptype, datarow);
        var calendardateformat = cellinfo._getAttrValue(cellinfo._p_calendardateformat, datarow);
        var calendareditformat = cellinfo._getAttrValue(cellinfo._p_calendareditformat, datarow);
        var locale = cellinfo._getLocale(datarow);

        if (this._displaymode == true && !v)
            v = cellinfo._getDisplayText(datarow);

        if (cCalendar._view)
        {
            var usesoftkeyboard = cCalendar._view._initsoftkeyboard;
            cCalendar.set_usesoftkeyboard(cCalendar._view._getUseSoftKeyboardValue(usesoftkeyboard));
        }

        cCalendar.createComponent();
        cCalendar._child_editor = cCalendar.calendaredit;
        cCalendar._is_value_changed = false;

        if (!calendardateformat)
            calendardateformat = nexacro.Calendar.prototype.dateformat;
        if (!calendareditformat)
            calendareditformat = nexacro.Calendar.prototype.editformat;
        cCalendar.set_popuptype(calendarpopuptype);
        cCalendar.set_dateformat(calendardateformat);
        cCalendar.set_editformat(calendareditformat);
        cCalendar.set_locale(locale);
        cCalendar.set_value(v);

        cCalendar._recalcLayout();

        this._writable = true;

        return cCalendar;
    };

    _pCellControl._createEditor_textarea = function (readonly)
    {
        var datarow = this._getDataRow();
        var rect = this._getControlRect();
        var cellinfo = this._refinfo;
        var cTextArea = new nexacro[this._cellTextAreaObj]("celltextarea" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        var v;

        if (cTextArea._displaymode == true || readonly)
            v = cellinfo._getDisplayText(datarow);
        else
            v = cellinfo._getValue(datarow);

        var wordwrap = cellinfo._getWordwrap(datarow);
        var textareamaxlength = cellinfo._getAttrValue(cellinfo._p_textareamaxlength, datarow);
        var dataset = this._getBindDataset();
        var textareabartype = cellinfo._getAttrValue(cellinfo._p_textareascrollbartype, datarow);
        var textareascrolltype = cellinfo._getAttrValue(cellinfo._p_textareascrolltype, datarow);

        if (textareamaxlength == 0)
            textareamaxlength = dataset ? dataset._getColumnSize(cellinfo._col) : 0;

        cTextArea.set_maxlength(textareamaxlength);
        cTextArea.set_wordWrap(wordwrap);
        cTextArea.set_value(v);
        cTextArea.set_scrollbartype(textareabartype);
        cTextArea.set_scrolltype(textareascrolltype);
        if (cTextArea._view)
        {
            var usesoftkeyboard = cTextArea._view._initsoftkeyboard;
            cTextArea.set_usesoftkeyboard(cTextArea._view._getUseSoftKeyboardValue(usesoftkeyboard));
        }

        cTextArea.createComponent();

        if (readonly)
            cTextArea.set_readonly(true);

        this._writable = !readonly;

        return cTextArea;
    };

    _pCellControl._createEditor_readonly = function ()
    {
        return this._createEditor_textarea(true);
    };

    _pCellControl._createEditor_button = function ()
    {
        var rect = this._getControlRect();
        var cButton = new nexacro[this._cellButtonObj]("cellbutton" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        cButton.createComponent();

        this._writable = false;

        return cButton;
    };
        /*
    _pCellControl._createEditor_customcontrol = function ()
    {
        var rect = this._getControlRect();
        var cCustom = new nexacro[this._cellCustomObj]("cellcustom" + this._createidx, rect.left, rect.top, rect.width, rect.height, this);
        cCustom.createComponent(true);

        this._writable = false;

        return cCustom;
    };
    */
    _pCellControl._setSubControlFocus = function (bfocus)
    {
        var cellobj = this;
        var subcomp = this._subComp;
        var view = this._view;
        var edittype = cellobj._refinfo._getEdittype(cellobj._getDataRow());

        if ((edittype == "checkbox" || edittype == "radioitem") && (subcomp && subcomp._is_alive))
        {
            if (bfocus)
            {
                // checkbox는 왜 재정의 한거지
                if (nexacro._isTouchInteraction || (view.selectchangetype && view.selectchangetype == "up"))
                    subcomp._apply_setfocus("touch");

                subcomp._changeStatus("focused", true);
                if (this._env._p_enableaccessibility)
                    subcomp._setFocus(false);

                if (view)
                    view._FocuedCell = cellobj;
            }
            else
            {
                subcomp._changeStatus("focused", false);

                if (view)
                    view._FocuedCell = null;
            }
        }
    };

    _pCellControl._isEditable = function ()
    {
        if (this._editor)
            return (this._editor._p_visible && this._editor._adjust_width > 0);

        return false;
    };

    _pCellControl._getTreeStatus = function ()  // parent 구조에 따라 다르므로 재정의하여 사용.
    {

    };


    _pCellControl._getComputedStyleWithProp = function (prop)
    {
        var obj;

        if (prop == "background")
        {
            obj = this._control_element._getComputedStyleBackgroundColor();
        }
        else if (prop == "textAlign" || prop == "verticalAlign")
        {
            var align = this._getCurrentStyleAlign();
            obj = align[prop];
        }
        else if (prop == "font" || prop == "color" || prop == "wordSpacing" || prop == "letterSpacing")
        {
            obj = this._getCurrentStyleInheritValue(prop, "enabled");
        }
        else if (prop == "border")
        {
            obj = this._getCurrentStyleBorder();
        }
        else if (prop == "textDecoration" || prop == "borderRadius" || prop == "cursor" || prop == "opacity")
        {
            if (prop == "textDecoration")
                prop = "-nexa-text-decoration";
            if (prop == "borderRadius")
                prop = "border-radius";

            obj = nexacro._getStyleProperty(this, prop);
        }
        else
        {
            obj = this._getCSSStyleValue(prop, "enabled");
        }

        return obj;
    };

    _pCellControl._getComputedStyle = function (is_subcomp)
    {
        var ctrl_cs = { "styles": {}, "subcomp": { "styles": null } };
        var properties = this._computed_prop_list;
        var prop;

        for (var i = 0, n = properties.length; i < n; i++)
        {
            prop = properties[i];
            ctrl_cs.styles[prop] = this._getComputedStyleWithProp(prop);
        }

        if (is_subcomp && this._subComp)
            ctrl_cs.subcomp = this._subComp._getComputedStyle();

        return ctrl_cs;
    };

    _pCellControl._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        var subcomp = this._subComp;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                var val = ctrl_cs.styles[prop_name];
                val = val && val.value ? val.value : val;

                if (this[func_name])
                {
                    this[func_name].call(this, val);
                    this._setted_computed_style[prop_name] = val;
                }
            }
        }

        if (subcomp)
            subcomp._setComputedStyle(ctrl_cs.subcomp);
    };

    _pCellControl.on_apply_padding = function (padding)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._updateAvailableArea();
        }
    };

    _pCellControl.on_apply_prop_enable = function (v)
    {
        if (v == null)
            v = this._isEnable();

        nexacro.Component.prototype.on_apply_prop_enable.call(this, v);

        if (this._subComp)
            this._subComp._setEnable(v);

        if (this._expandCtrl)
            this._expandCtrl._setEnable(v);

        if (this._filterCtrl)
            this._filterCtrl._setEnable(v);

        if (this._sortCtrl)
            this._sortCtrl._setEnable(v);

        var subcells = this.subcells;
        var subcells_len = subcells ? subcells.length : 0;

        for (var i = 0; i < subcells_len; i++)
        {
            subcells[i]._setEnable(v);
        }
    };

    _pCellControl.on_apply_prop_rtl = function ()
    {
        if (this._is_created) // rtl은 현재 생성할 때만 설정
            return;

        var v = this.rtl = this._refinfo._getAttrValue(this._refinfo._p_rtl, this._getDataRow());
        if (nexacro._isBoolean(v))
        {
            this._rtl = nexacro._toBoolean(v);
        }
        else
        {
            this._rtl = undefined; // 상위 상속 설정을 위한 undefined
        }

        nexacro.Component.prototype.on_apply_prop_rtl.call(this);

        if (this._subComp)
        {
            this._subComp.on_apply_prop_rtl();
        }
    };

    _pCellControl._getPositionInRootComponent = nexacro._emptyFn;

    //===============================================================
    // nexacro._CellExpandControl
    //===============================================================
    nexacro._CellExpandControl = function (parent, left, top, right, bottom, controlmode)
    {
        nexacro.Button.call(this, "cellexpandbutton", left, top, right - left, bottom - top, null, null, null, null, null, null, parent);

        /* internal variable */
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellobj = parent;
        this._cellinfo = parent._refinfo;
        this._setControl();
    };

    var _pCellExpand = nexacro._createPrototype(nexacro.Button, nexacro._CellExpandControl);
    nexacro._CellExpandControl.prototype = _pCellExpand;

    _pCellExpand.on_destroy_contents = function ()
    {
        nexacro.Button.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellobj = null;
        this._cellinfo = null;
    };

    _pCellExpand._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellExpand._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        var control_elem = this._control_element;
        if (control_elem)
        {
            if (breadonly !== undefined)
            {
                if (this.on_apply_readonly)
                {
                    this.on_apply_readonly(breadonly);
                }
                else
                {
                    this._changeStatus("readonly", breadonly);
                }
            }
            var datarow = this._cellobj._getDataRow();

            if (!onlycontents)
                this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

            if (this._cellinfo) // _on_apply_status에서 cell update후 expr로 초기화 될 수 있음.
            {
                var icon = this._cellinfo._getAttrValue(this._cellinfo._p_expandimage, datarow);

                if (icon)
                    this.set_icon(icon);

                var text = this._cellinfo._getAttrValue(this._cellinfo._p_expandchar, datarow);
                this.set_text(text);
            }
        }
    };

    _pCellExpand._setAlign = function (halign, valign)
    {
        var elem = this._text_elem;

        if (elem)
        {
            if (halign)
                this.set_textAlign(halign);
            if (valign)
                this.set_verticalAlign(valign);
        }
    };

    _pCellExpand.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "expandbutton");
    };

    _pCellExpand.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "expandbutton");
    };

    //===============================================================
    // nexacro._CellFilterIconControl
    //===============================================================
    nexacro._CellFilterIconControl = function (parent, left, top, right, bottom, controlmode)
    {
        nexacro.Button.call(this, "cellfiltericon", left, top, right - left, bottom - top, null, null, null, null, null, null, parent);

        /* internal variable */
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellobj = parent;
        this._cellinfo = parent._refinfo;
        this._setControl();
    };

    var _pCellFilterIcon = nexacro._createPrototype(nexacro.Button, nexacro._CellFilterIconControl);
    nexacro._CellFilterIconControl.prototype = _pCellFilterIcon;

    _pCellFilterIcon._type_name = "CellFilterIconControl";

    _pCellFilterIcon.on_destroy_contents = function ()
    {
        nexacro.Button.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellobj = null;
        this._cellinfo = null;
    };

    _pCellFilterIcon._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellFilterIcon._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        var control_elem = this._control_element;
        if (control_elem)
        {
            if (breadonly !== undefined)
            {
                if (this.on_apply_readonly)
                {
                    this.on_apply_readonly(breadonly);
                }
                else
                {
                    this._changeStatus("readonly", breadonly);
                }
            }
            var datarow = this._cellobj._getDataRow();

            if (!onlycontents)
                this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        }
    };

    _pCellFilterIcon.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "filtericon");
    };

    _pCellFilterIcon.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var colid = cellinfo._getAttrValue(cellinfo._p_filtercolumn, datarow);
        var dataset = cellinfo._getBindDataset();
        var coltype = dataset._getColumnType(colid);
        var filtertype = cellinfo._getAttrValue(cellinfo._p_filtertype, datarow);

        if (!cellobj._filter_popup || !cellobj._filter_popup.visible)
        {
            switch (coltype)
            {
                case 1: //string
                case 9: //variant   
                    cellobj._showFilterPopup("text", filtertype);
                    break;
                case 2: //int
                case 3: //float
                case 4: //bigdecimal
                    cellobj._showFilterPopup("num", filtertype);
                    break;
                case 5: //date
                    cellobj._showFilterPopup("date", filtertype);
                    break;
                case 6: //time
                    cellobj._showFilterPopup("time", filtertype);
                    break;
                case 7: //datetime
                    cellobj._showFilterPopup("datetime", filtertype);
                    break;
            }
        }

        return this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "filtericon");
    };

    //===============================================================
    // nexacro._CellSortIconControl
    //===============================================================
    nexacro._CellSortIconControl = function (parent, left, top, right, bottom, controlmode)
    {
        nexacro.Button.call(this, "cellsorticon", left, top, right - left, bottom - top, null, null, null, null, null, null, parent);

        /* internal variable */
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellobj = parent;
        this._cellinfo = parent._refinfo;
        this._setControl();
    };

    var _pCellSortIcon = nexacro._createPrototype(nexacro.Button, nexacro._CellSortIconControl);
    nexacro._CellSortIconControl.prototype = _pCellSortIcon;

    _pCellSortIcon._type_name = "CellSortIconControl";
    _pCellSortIcon._usedecoratetext = true;

    _pCellSortIcon.on_destroy_contents = function ()
    {
        nexacro.Button.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellobj = null;
        this._cellinfo = null;
    };

    _pCellSortIcon._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellSortIcon._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        var control_elem = this._control_element;
        if (control_elem)
        {
            if (!onlycontents)
                this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        }
    };

    _pCellSortIcon.set_text = function (v)
    {
        if (v)
            v = `<sup>${v}</sup>`;

        nexacro.Button.prototype.set_text.call(this, v);
    }

    _pCellSortIcon._on_changeUserStatus = function (status, value)
    {
        this._olduserstatus = this._userstatus;
        var applystatus = "";

        this._userstatusmap[status] = value;
        var statusmap = this._userstatusmap;

        if (statusmap.ascending)
            applystatus = "ascending";
        else if (statusmap.descending)
            applystatus = "descending";

        this._userstatus = this.on_changeUserStatus(status, value, applystatus, this._status, this._userstatus);
        if (this._olduserstatus != this._userstatus)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus, undefined, status, value);

        this._setAccessibilityStatFlag(this._status, this._userstatus);
    };

    //===============================================================
    // nexacro._CellButtonControl
    //===============================================================
    nexacro._CellButtonControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.Button.call(this, id, left, top, width, height, null, null, null, null, null, null, parent);

        this._p_tabstop = false;
        this._clickevt_able = true;
        this._displaymode = (displaymode) ? true : false;
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };

    var _pCellButton = nexacro._createPrototype(nexacro.Button, nexacro._CellButtonControl);
    nexacro._CellButtonControl.prototype = _pCellButton;
    _pCellButton._is_subcontrol = true;

    _pCellButton.on_getIDCSSSelector = function ()
    {
        return "cellbutton";
    };

    _pCellButton._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Button.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellButton.on_destroy_contents = function ()
    {
        nexacro.Button.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellButton._apply_setfocus = function (evt_name)
    {
        if (!this._displaymode || this._env._p_enableaccessibility)
            nexacro.Button.prototype._apply_setfocus.call(this, evt_name);
    };

    _pCellButton._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellButton.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.Button.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellButton.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.Button.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellButton._EditUpdateAll = function ()
    {
        if (this._control_element)
        {
            this._updateAll();

            var datarow = this._cellobj._getDataRow();
            var wordwrap = this._cellinfo._getWordwrap(datarow);
            this.set_wordWrap(wordwrap);
        }
    };

    _pCellButton._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();

        if (onlycontrolprop)
            return;

        var v;
        if (this._displaymode == true)
            v = cellinfo._getDisplayText(datarow);
        else
            v = cellinfo._getValue(datarow, this._displaymode);

        if (v != null)
            this.set_text(v);
        else
            this.set_text("");
    };

    _pCellButton._getValueData = function () { };

    _pCellButton._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellButton._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = { "styles": null };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        return ctrl_cs;
    };

    _pCellButton._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }
        }
    };

    _pCellButton._getCurrentStyleAlign = function (noflush)
    {
        // TODO
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    _pCellButton.on_fire_user_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key) // 2013-04-23 pss - override for keyup 'enter' or 'space'
    {
        var ret = nexacro.Component.prototype.on_fire_user_onkeyup.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        if (key_code == 13 || key_code == 32) // 13 'enter' , 32 'space'
        {
            this.click();
        }
        return ret;
    };

    //===============================================================
    // nexacro._CellProgressBarControl
    //===============================================================
    nexacro._CellProgressBarControl = function (id, left, top, width, height, parent, controlmode)
    {
        nexacro.ProgressBar.call(this, id, left, top, width, height, null, null, null, null, null, null, parent);

        this._p_tabstop = false;
        this._p_max = 100;
        this._p_min = 0;
        this._p_step = 1;
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };
    var _pCellBar = nexacro._CellProgressBarControl.prototype = nexacro._createPrototype(nexacro.ProgressBar, nexacro._CellProgressBarControl);
    _pCellBar._is_subcontrol = true;

    _pCellBar._properties = [
        { name: "pos" },
    ];

    _pCellBar._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.ProgressBar.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellBar._apply_dblclick_event = function ()
    {
        var items = this._progressbaritems;

        if (items)
        {
            for (var i = 0; i < items.length; i++)
            {
                items[i].on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
                {
                    nexacro._ProgressBarItemControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                    this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                    return true;
                };
            }
        }

        if (this.progressstartcap)
        {
            this.progressstartcap.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
            {
                nexacro._Icon.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                return true;
            };
        }
        if (this.progressendcap)
        {
            this.progressendcap.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
            {
                nexacro._Icon.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                return true;
            };
        }
        if (this._progressbartext)
        {
            this._progressbartext.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
            {
                nexacro.Static.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                return true;
            };
        }
    };

    _pCellBar.set_pos = function (v)
    {
        nexacro.ProgressBar.prototype.set_pos.call(this, v);
        this._apply_dblclick_event();
    };

    _pCellBar.on_destroy_contents = function ()
    {
        nexacro.ProgressBar.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellBar.set_text = function (v)
    {
        var retn = nexacro.Component.prototype.set_text.call(this, v);
        var pos = parseInt(this._displaytext);

        pos = isNaN(pos) ? 0 : pos;

        this.set_pos(pos);
        return retn;
    };

    _pCellBar._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellBar.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellBar.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellBar._getDisplayText = function ()
    {
        if (this._p_parent)
            return this._p_parent._getDisplayText();

        return "";
    };

    _pCellBar._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellBar._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();

        cellinfo._setCellChildControlProperty("progressbar", this, datarow);

        if (onlycontrolprop)
            return;

        var v = cellinfo._getDisplayText(datarow);

        if (v != null)
            this.set_text(v);
        else
            this.set_text("");
    };

    _pCellBar._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = {
            "styles": null,
            "progressbaritem": { styles: null },
            "progressbartext": { styles: null },
            "progressstartcap": { styles: null },
            "progressendcap": { styles: null }
        };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        if (this.progressbaritem)
        {
            str = nexacro._getComputedStyleProperties(this.progressbaritem._control_element, properties, null, true);
            ctrl_cs.progressbaritem.styles = (new Function("return " + str))();
        }
        if (this.progressbartext)
        {
            str = nexacro._getComputedStyleProperties(this.progressbartext._control_element, properties, null, true);
            ctrl_cs.progressbartext.styles = (new Function("return " + str))();
        }
        if (this.progressstartcap)
        {
            str = nexacro._getComputedStyleProperties(this.progressstartcap._control_element, properties, null, true);
            ctrl_cs.progressstartcap.styles = (new Function("return " + str))();
        }
        if (this.progressendcap)
        {
            str = nexacro._getComputedStyleProperties(this.progressendcap._control_element, properties, null, true);
            ctrl_cs.progressendcap.styles = (new Function("return " + str))();
        }
        return ctrl_cs;
    };

    _pCellBar._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        var progressbaritem = this.progressbaritem;
        var progressbartext = this.progressbartext;
        var progressstartcap = this.progressstartcap;
        var progressendcap = this.progressendcap;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }

            if (progressbaritem)
            {
                if (ctrl_cs.progressbaritem.styles)
                {
                    if (progressbaritem[func_name])
                        progressbaritem[func_name].call(progressbaritem, ctrl_cs.progressbaritem.styles[prop_name]);
                }
            }
            if (progressbartext)
            {
                if (ctrl_cs.progressbartext.styles)
                {
                    if (progressbartext[func_name])
                        progressbartext[func_name].call(progressbartext, ctrl_cs.progressbartext.styles[prop_name]);
                }
            }
            if (progressstartcap)
            {
                if (ctrl_cs.progressstartcap.styles)
                {
                    if (progressstartcap[func_name])
                        progressstartcap[func_name].call(progressstartcap, ctrl_cs.progressstartcap.styles[prop_name]);
                }
            }
            if (progressendcap)
            {
                if (ctrl_cs.progressendcap.styles)
                {
                    if (progressendcap[func_name])
                        progressendcap[func_name].call(progressendcap, ctrl_cs.progressendcap.styles[prop_name]);
                }
            }
        }
    };

    _pCellBar._getCurrentStyleAlign = function (noflush)
    {
        // TODO
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    nexacro._defineProperties(_pCellBar, _pCellBar._properties);

    //===============================================================
    // nexacro._CellEditControl
    //===============================================================
    nexacro._CellEditControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.Edit.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);

        this._p_tabstop = false;

        if (displaymode)
        {
            this._displaymode = true;
            this._p_readonly = true;
        }
        else
        {
            this._displaymode = false;
        }

        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;

        this._setControl();
    };

    var _pCellEdit = nexacro._createPrototype(nexacro.Edit, nexacro._CellEditControl);
    nexacro._CellEditControl.prototype = _pCellEdit;
    _pCellEdit._is_subcontrol = true;

    _pCellEdit.on_getIDCSSSelector = function ()
    {
        return "celledit";
    };

    _pCellEdit._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Edit.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellEdit.on_destroy_contents = function ()
    {
        nexacro.Edit.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellEdit._apply_setfocus = function (evt_name, self_flag, callback)
    {
        if (this._view._onceTime_focus && !callback)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var _win = this._getWindow();
                if (!_win || !_win._isActiveLayerComponent(this))
                    return;

                this._apply_setfocus(evt_name, self_flag, true);
            }, 0);
            return;
        }

        var caret_pos = this._caret_pos;
        if (this._caret_pos == -1)
            this._caret_pos = this._input_element._last_selection_range;

        nexacro.Edit.prototype._apply_setfocus.call(this, evt_name, self_flag);
        this._caret_pos = caret_pos;
    };

    _pCellEdit.setOnlyElementFocus = function ()
    {
        if (this._input_element)
            this._input_element._applyElementFocus();
    };

    _pCellEdit.on_fire_oninput = function ()
    {
        nexacro.Edit.prototype.on_fire_oninput.call(this);
        return this._cellobj.on_fire_oninput(this);
    };

    _pCellEdit.on_fire_onimeaction = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        nexacro.Edit.prototype.on_fire_onimeaction.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        return this._cellobj.on_fire_onimeaction(key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
    };

    _pCellEdit.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        nexacro.Edit.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellEdit.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._displaymode)
            this.setSelect(0, 0);

        nexacro.Edit.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellEdit.on_getBindableProperties = function ()
    {
        if (!this._displaymode)
            return "value";
    };

    _pCellEdit._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellEdit._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellEdit._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();

        cellinfo._setCellChildControlProperty("edit", this, datarow);

        if (this._view)
            this.set_usesoftkeyboard(this._view._getUseSoftKeyboardValue(this._view._initsoftkeyboard));

        if (onlycontrolprop)
            return;

        var v;
        if (this._displaymode == true)
            v = cellinfo._getDisplayText(datarow);
        else
            v = cellinfo._getValue(datarow);

        this.set_value(v);
    };

    _pCellEdit._setEditingValue = function (value)
    {
        return this.set_value(value);
    };

    _pCellEdit._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellEdit._getEditingText = function ()
    {
        return this.text;
    };

    _pCellEdit._getEditingValue = function ()
    {
        return this._p_value;
    };

    _pCellEdit._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellEdit._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = { "styles": null };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        return ctrl_cs;
    };

    _pCellEdit._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }
        }
    };

    _pCellEdit._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };

        if (this._input_element)
            align = this._input_element._getComputedStyleAlign(noflush);

        return align;
    };

    //===============================================================
    // nexacro._CellTextAreaControl
    //===============================================================
    nexacro._CellTextAreaControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.TextArea.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);
        this._p_tabstop = false;

        if (displaymode)
        {
            this._displaymode = true;
            this._p_readonly = true;
        }
        else
        {
            this._displaymode = false;
        }

        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;

        this._setControl();
    };

    var _pCellTextArea = nexacro._createPrototype(nexacro.TextArea, nexacro._CellTextAreaControl);
    nexacro._CellTextAreaControl.prototype = _pCellTextArea;
    _pCellTextArea._is_subcontrol = true;

    _pCellTextArea.on_getIDCSSSelector = function ()
    {
        return "celltextarea";
    };

    _pCellTextArea._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.TextArea.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellTextArea.on_destroy_contents = function ()
    {
        nexacro.TextArea.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellTextArea._apply_setfocus = function (evt_name, self_flag, callback)
    {
        if (this._view._onceTime_focus && !callback)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var _win = this._getWindow();
                if (!_win || !_win._isActiveLayerComponent(this))
                    return;

                this._apply_setfocus(evt_name, self_flag, true);
            }, 0);
            return;
        }

        var caret_pos = this._caret_pos;
        if (this._caret_pos == -1)
            this._caret_pos = this._input_element._last_selection_range;

        nexacro.TextArea.prototype._apply_setfocus.call(this, evt_name, self_flag);
        this._caret_pos = caret_pos;
    };

    _pCellTextArea.setOnlyElementFocus = _pCellEdit.setOnlyElementFocus;

    _pCellTextArea.on_fire_oninput = function ()
    {
        nexacro.TextArea.prototype.on_fire_oninput.call(this);
        return this._cellobj.on_fire_oninput(this);
    };

    _pCellTextArea.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        nexacro.TextArea.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellTextArea.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._displaymode)
            this.setSelect(0, 0);

        nexacro.TextArea.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellTextArea.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        nexacro.TextArea.prototype.on_keydown_basic_action.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);

        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var acceptsenter = cellinfo._getAttrValue(cellinfo._p_textareaacceptsenter, datarow);
        acceptsenter = nexacro._toBoolean(acceptsenter);

        if (keycode == nexacro.Event.KEY_ENTER && (ctrl_key || alt_key))
        {
            if (acceptsenter == false)
            {
                var input_elem = this._input_element;
                var pos = this.getCaretPos();
                var text = this.text;
                var chars = text.split("");

                chars.splice(pos, 0, "\n");
                var newValue = chars.join("");
                var newPos = pos + "\n".length;

                if (input_elem && (this.maxlength == 0 || newValue.length <= this.maxlength))
                {
                    var font = this._getCurrentStyleInheritValue("font");
                    var refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem

                    function callback()
                    {
                        input_elem.updateElementText(newValue, newPos);

                        if (this.scrollbartype == "none" && (this.scrolltype == "both" || this.scrolltype == "vertical"))
                        {
                            var textsize = nexacro._getTextSize("A", font, false, undefined, "none",
                                this._getCurrentStyleInheritValue("wordSpacing"),
                                this._getCurrentStyleInheritValue("letterSpacing"), undefined, undefined, undefined, refer_font);

                            var caretline = this._getCaretLine();
                            var control_elem = this.getElement();
                            var clientheight = control_elem.getClientHeight();

                            var scroll_pos = (textsize[1] * caretline) - clientheight;
                            if (scroll_pos > 0)
                            {
                                input_elem.setElementVScrollPos(scroll_pos);
                                var adjust_scrollpos = scroll_pos + (textsize[1] - (scroll_pos % textsize[1]));
                                input_elem.setElementVScrollPos(adjust_scrollpos);
                            }
                        }
                    }

                    if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
                    {
                        nexacro._OnceCallbackTimer.callonce(this, callback, 50);
                    }
                    else
                    {
                        nexacro._OnceCallbackTimer.callonce(this, callback, 0);
                    }

                    /*
                    nexacro._OnceCallbackTimer.callonce(this, function ()
                    {
                        input_elem.updateElementText(newValue, newPos);

                        if (this.scrollbartype == "none" && (this.scrolltype == "both" || this.scrolltype == "vertical"))
                        {
                            var textsize = nexacro._getTextSize("A",
                                this._getCurrentStyleInheritValue("font"), false, undefined, "none",
                                this._getCurrentStyleInheritValue("wordSpacing"),
                                this._getCurrentStyleInheritValue("letterSpacing"));

                            var caretline = this._getCaretLine();
                            var control_elem = this.getElement();
                            var clientheight = control_elem.getClientHeight();

                            var scroll_pos = (textsize[1] * caretline) - clientheight;
                            if (scroll_pos > 0)
                            {
                                input_elem.setElementVScrollPos(scroll_pos);
                                var adjust_scrollpos = scroll_pos + (textsize[1] - (scroll_pos % textsize[1]));
                                input_elem.setElementVScrollPos(adjust_scrollpos);
                            }
                        }
                    }, 0);
                    */

                    input_elem.stopSysEvent();
                }
            }
        }
    };

    _pCellTextArea.on_getBindableProperties = function ()
    {
        if (!this._displaymode)
            return "value";
    };

    _pCellTextArea._isEnable = _pCellEdit._isEnable;

    _pCellTextArea._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellTextArea._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var v;

        if (!onlycontrolprop)
        {
            if (this._displaymode == true || this._p_readonly)
                v = cellinfo._getDisplayText(datarow);
            else
                v = cellinfo._getValue(datarow);

            this.set_value(v);
        }

        cellinfo._setCellChildControlProperty("textarea", this, datarow);

        if (this._displaymode == true)
        {
            this.set_scrollbartype("none");
        }
        else
        {
            v = cellinfo._getAttrValue(cellinfo._p_textareascrollbartype, datarow);

            if (v != null)
                this.set_scrollbartype(v);
            else
                this.set_scrollbartype("none");
        }

        v = cellinfo._getAttrValue(cellinfo._p_textareascrolltype, datarow);

        if (v != null)
            this.set_scrolltype(v);
        else
            this.set_scrolltype("none");

        v = cellinfo._getControlScrollbarsize(datarow, "textarea"); // textareascrollbarsize
        if (v != null)
            this.set_scrollbarsize(v);

        if (this._view)
            this.set_usesoftkeyboard(this._view._getUseSoftKeyboardValue(this._view._initsoftkeyboard));
    };

    _pCellTextArea._setEditingValue = function (value)
    {
        return this.set_value(value);
    };

    _pCellTextArea._EditUpdateAll = function ()
    {
        if (this._control_element)
        {
            var datarow = this._cellobj._getDataRow();

            this._updateAll();

            var wordwrap = this._cellinfo._getWordwrap(datarow);
            this.set_wordWrap(wordwrap);
        }
    };

    _pCellTextArea._getEditingText = function ()
    {
        return this.text;
    };

    _pCellTextArea._getEditingValue = function ()
    {
        return this._p_value;
    };

    _pCellTextArea._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellTextArea._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = {
            "styles": null,
            "hscrollbar": {
                styles: null,
                "decbutton": { styles: null },
                "incbutton": { styles: null },
                "trackbar": { styles: null }
            },
            "vscrollbar": {
                styles: null,
                "decbutton": { styles: null },
                "incbutton": { styles: null },
                "trackbar": { styles: null }
            },
        };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        if (this.hscrollbar)
        {
            str = nexacro._getComputedStyleProperties(this.hscrollbar._control_element, properties, null, true);
            ctrl_cs.hscrollbar.styles = (new Function("return " + str))();

            str = nexacro._getComputedStyleProperties(this.hscrollbar.decbutton._control_element, properties, null, true);
            ctrl_cs.hscrollbar.decbutton.styles = (new Function("return " + str))();

            str = nexacro._getComputedStyleProperties(this.hscrollbar.incbutton._control_element, properties, null, true);
            ctrl_cs.hscrollbar.incbutton.styles = (new Function("return " + str))();

            str = nexacro._getComputedStyleProperties(this.hscrollbar.trackbar._control_element, properties, null, true);
            ctrl_cs.hscrollbar.trackbar.styles = (new Function("return " + str))();
        }
        if (this.vscrollbar)
        {
            str = nexacro._getComputedStyleProperties(this.vscrollbar._control_element, properties, null, true);
            ctrl_cs.vscrollbar.styles = (new Function("return " + str))();

            str = nexacro._getComputedStyleProperties(this.vscrollbar.decbutton._control_element, properties, null, true);
            ctrl_cs.vscrollbar.decbutton.styles = (new Function("return " + str))();

            str = nexacro._getComputedStyleProperties(this.vscrollbar.incbutton._control_element, properties, null, true);
            ctrl_cs.vscrollbar.incbutton.styles = (new Function("return " + str))();

            str = nexacro._getComputedStyleProperties(this.vscrollbar.trackbar._control_element, properties, null, true);
            ctrl_cs.vscrollbar.trackbar.styles = (new Function("return " + str))();
        }
        return ctrl_cs;
    };

    _pCellTextArea._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        var hscrollbar = this.hscrollbar;
        var vscrollbar = this.vscrollbar;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }

            if (hscrollbar)
            {
                if (ctrl_cs.hscrollbar.styles)
                {
                    if (hscrollbar[func_name])
                        hscrollbar[func_name].call(hscrollbar, ctrl_cs.hscrollbar.styles[prop_name]);
                }
                if (ctrl_cs.hscrollbar.decbutton.styles)
                {
                    if (hscrollbar.decbutton[func_name])
                        hscrollbar.decbutton[func_name].call(hscrollbar.decbutton, ctrl_cs.hscrollbar.decbutton.styles[prop_name]);
                }
                if (ctrl_cs.hscrollbar.incbutton.styles)
                {
                    if (hscrollbar.incbutton[func_name])
                        hscrollbar.incbutton[func_name].call(hscrollbar.incbutton, ctrl_cs.hscrollbar.incbutton.styles[prop_name]);
                }
                if (ctrl_cs.hscrollbar.trackbar.styles)
                {
                    if (hscrollbar.trackbar[func_name])
                        hscrollbar.trackbar[func_name].call(hscrollbar.trackbar, ctrl_cs.hscrollbar.trackbar.styles[prop_name]);
                }
            }

            if (vscrollbar)
            {
                if (ctrl_cs.vscrollbar.styles)
                {
                    if (vscrollbar[func_name])
                        vscrollbar[func_name].call(vscrollbar, ctrl_cs.vscrollbar.styles[prop_name]);
                }
                if (ctrl_cs.vscrollbar.decbutton.styles)
                {
                    if (vscrollbar.decbutton[func_name])
                        vscrollbar.decbutton[func_name].call(vscrollbar.decbutton, ctrl_cs.vscrollbar.decbutton.styles[prop_name]);
                }
                if (ctrl_cs.vscrollbar.incbutton.styles)
                {
                    if (vscrollbar.incbutton[func_name])
                        vscrollbar.incbutton[func_name].call(vscrollbar.incbutton, ctrl_cs.vscrollbar.incbutton.styles[prop_name]);
                }
                if (ctrl_cs.vscrollbar.trackbar.styles)
                {
                    if (vscrollbar.trackbar[func_name])
                        vscrollbar.trackbar[func_name].call(vscrollbar.trackbar, ctrl_cs.vscrollbar.trackbar.styles[prop_name]);
                }
            }
        }
    };

    _pCellTextArea._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };

        if (this._input_element)
            align = this._input_element._getComputedStyleAlign(noflush);

        return align;
    };

    //===============================================================
    // nexacro._CellMaskEditControl
    //===============================================================
    nexacro._CellMaskEditControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.MaskEdit.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);

        this._displaymode = (displaymode) ? true : false;
        this._p_tabstop = false;
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;

        this._setControl();
    };

    var _pCellMaskEdit = nexacro._createPrototype(nexacro.MaskEdit, nexacro._CellMaskEditControl);
    nexacro._CellMaskEditControl.prototype = _pCellMaskEdit;
    _pCellMaskEdit._is_subcontrol = true;

    _pCellMaskEdit.on_getIDCSSSelector = function ()
    {
        return "cellmaskedit";
    };

    _pCellMaskEdit._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.MaskEdit.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellMaskEdit.on_destroy_contents = function ()
    {
        nexacro.MaskEdit.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellMaskEdit._apply_setfocus = function (evt_name, self_flag, callback)
    {
        if (this._view._onceTime_focus && !callback)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var _win = this._getWindow();
                if (!_win || !_win._isActiveLayerComponent(this))
                    return;

                this._apply_setfocus(evt_name, self_flag, true);
            }, 0);
            return;
        }

        var caret_pos = this._caret_pos;
        if (this._caret_pos == -1)
            this._caret_pos = this._input_element._last_selection_range;

        nexacro.MaskEdit.prototype._apply_setfocus.call(this, evt_name, self_flag);
        this._caret_pos = caret_pos;
    };

    _pCellMaskEdit.setOnlyElementFocus = _pCellEdit.setOnlyElementFocus;


    _pCellMaskEdit.on_fire_oninput = function ()
    {
        nexacro.MaskEdit.prototype.on_fire_oninput.call(this);
        return this._cellobj.on_fire_oninput(this);
    };

    _pCellMaskEdit.on_fire_onimeaction = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        nexacro.MaskEdit.prototype.on_fire_onimeaction.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        return this._cellobj.on_fire_onimeaction(key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
    };

    _pCellMaskEdit.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        nexacro.MaskEdit.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellMaskEdit.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._displaymode)
            this.setSelect(0, 0);

        nexacro.MaskEdit.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellMaskEdit._isEnable = _pCellEdit._isEnable;

    _pCellMaskEdit._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellMaskEdit._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var dataset = cellinfo._getBindDataset();

        cellinfo._setCellChildControlProperty("maskedit", this, datarow);

        if (!onlycontrolprop)
        {
            var v;
            if (dataset && cellinfo._p_subsumtext._value != "" && dataset.getRowType(datarow) == 16)
                v = cellinfo._getAttrValue(cellinfo._p_subsumtext, datarow);
            else
                v = cellinfo._getValue(datarow, this._displaymode);

            this.set_value(v);
        }

        if (this._view)
            this.set_usesoftkeyboard(this._view._getUseSoftKeyboardValue(this._view._initsoftkeyboard));
    };

    _pCellMaskEdit._setEditingValue = function (value)
    {
        return this.set_value(value);
    };

    _pCellMaskEdit._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellMaskEdit._getEditingText = function ()
    {
        return this.text;
    };

    _pCellMaskEdit._getEditingValue = function ()
    {
        return this._p_value;
    };

    _pCellMaskEdit._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellMaskEdit._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = { "styles": null };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        return ctrl_cs;
    };

    _pCellMaskEdit._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }
        }
    };

    _pCellMaskEdit._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };

        if (this._input_element)
            align = this._input_element._getComputedStyleAlign(noflush);

        return align;
    };
    //===============================================================
    // nexacro._CellCalendarPopupControl
    //===============================================================
    nexacro._CellCalendarPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._CalendarPopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pCellCalendarPopupControl = nexacro._createPrototype(nexacro._CalendarPopupControl, nexacro._CellCalendarPopupControl);
    nexacro._CellCalendarPopupControl.prototype = _pCellCalendarPopupControl;


    /* internal variable */
    _pCellCalendarPopupControl._is_subcontrol = true;

    //===============================================================
    // nexacro._CellCalendarPopupControl : Override
    //===============================================================
    _pCellCalendarPopupControl._getPopupParentPos = function ()
    {
        var calendar = this._p_parent;
        var rect;
        var bandrect;
        if (calendar._p_parent._getPositionInRootComponent)
        {
            var ret = calendar._p_parent._getPositionInRootComponent(calendar);
            rect = ret[0];
            bandrect = ret[1];
            var calendar_size = [rect.width, rect.height];
            var calendar_elem_pos = nexacro._getElementPositionInFrame(calendar.getElement(), true);
            var xgap = 0;
            var ygap = 0;
            if (0 > bandrect.orgl)
            {
                xgap = Math.abs(bandrect.orgl);
            }
            if (0 > bandrect.orgt)
            {
                ygap = Math.abs(bandrect.orgt);
            }


            //var x,y,
            return { "x": calendar_elem_pos.x, "y": calendar_elem_pos.y, "width": calendar_size[0], "height": calendar_size[1], "xgap": xgap, "ygap": ygap };
        }
        else
            return nexacro._CalendarPopupControl.prototype._getPopupParentPos.call(this);

    };
    //===============================================================
    // nexacro._CellCalendarControl
    //===============================================================
    nexacro._CellCalendarControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.Calendar.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);

        this._p_tabstop = false;
        this.ondropdown = "grid";
        this._p_readonly = this._displaymode = (displaymode) ? true : false;
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };

    var _pCellCalendar = nexacro._createPrototype(nexacro.Calendar, nexacro._CellCalendarControl);
    nexacro._CellCalendarControl.prototype = _pCellCalendar;
    _pCellCalendar._is_subcontrol = true;

    _pCellCalendar.on_getIDCSSSelector = function ()
    {
        return "cellcalendar";
    };

    _pCellCalendar.on_create_contents = function ()
    {
        nexacro.Calendar.prototype.on_create_contents.call(this);

        if (this._displaymode)
        {
            if (this.calendaredit)
            {
                this.calendaredit.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
                {
                    nexacro._CalendarEditControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                    this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                    return true;
                };
            }

            if (this.dropbutton)
            {
                this.dropbutton.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
                {
                    nexacro._CalendarDropButtonControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                    this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                    return true;
                };
            }
        }
    };

    _pCellCalendar.on_destroy_contents = function ()
    {
        nexacro.Calendar.prototype.on_destroy_contents.call(this);
        this._child_editor = null;
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellCalendar._apply_setfocus = function (evt_name)
    {
        if (!this._displaymode || this._env._p_enableaccessibility)
            return nexacro.Calendar.prototype._apply_setfocus.call(this, evt_name);
    };

    _pCellCalendar.setOnlyElementFocus = function ()
    {
        if (this.calendaredit && this.calendaredit._input_element)
            this.calendaredit._input_element._applyElementFocus();
    };

    _pCellCalendar._getPopupSizeArr = function ()
    {
        if (this.type != "monthonly")
            return nexacro.Calendar.prototype._getPopupSizeArr.call(this);

        var size = this.popupsize;
        if (!size)
            size = this.getOffsetWidth() + " " + this.getOffsetHeight();

        size = size.split(/\s+/);

        var width = +size[0];
        var height = size[1] ? +size[1] : width;

        return { width: width, height: height };
    };

    _pCellCalendar._confirmValue = function ()
    {
        if (this._p_readonly)
            return;

        var calendaredit = this.calendaredit;
        var datepicker = this.datepicker;

        switch (this.type)
        {
            case "normal":
                if (this._isPopupVisible())
                {
                    var e = { keycode: 13 };
                    datepicker._changeDate(calendaredit, e);
                    datepicker.on_fire_ondayclick(datepicker._value);
                }
                else
                {
                    if (this._p_value != calendaredit._p_value)
                    {
                        this._on_value_change(this._p_value, calendaredit._p_value);
                    }
                    else if (this.text != calendaredit.text)
                    {
                        this._setValue(this._p_value);
                    }
                }
                this._setZeroCaret();
                break;
            case "spin":
                if (this._p_value != calendaredit._p_value)
                {
                    this._on_value_change(this._p_value, calendaredit._p_value);
                }
                else if (this.text != calendaredit.text)
                {
                    this._setValue(this._p_value);
                }
                this._setZeroCaret();
                break;
            default:
                break;
        }
    };

    _pCellCalendar._setValueCtrl = function (fire_event, post_text, post_value)
    {
        this._currentformat = "editformat";
        var edit = this.calendaredit;

        if (edit && edit._p_value != undefined)
        {
            var pre_value = this._p_value;
            var pre_text = this.text;
            var cur_value, cur_text;

            if (post_text != undefined)
            {
                cur_value = post_value;
                cur_text = edit.text;
            }
            else
            {
                cur_value = edit._p_value;
                cur_text = edit.text;
            }

            if (pre_value != cur_value.trim())
            {
                if (fire_event)
                {
                    if (!this._on_value_change(pre_value, cur_value))
                        cur_value = pre_value;
                }

                this._setValue(cur_value);
                edit._setValue(cur_value);
                this._default_value = this._p_value;
                this._default_text = this.text;
            }
        }
    };

    _pCellCalendar._on_value_change = function (prevalue, postvalue)
    {
        this._is_value_changed = true;
        return nexacro.Calendar.prototype._on_value_change.call(this, prevalue, postvalue);
    };

    _pCellCalendar._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._CellCalendarPopupControl("calendarpopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol.createComponent(true);
        }
    };

    _pCellCalendar.on_fire_oninput = function ()
    {
        nexacro.Calendar.prototype.on_fire_oninput.call(this);
        return this._cellobj.on_fire_oninput(this);
    };

    _pCellCalendar.on_fire_oncloseup = function (obj, pretext, posttext, prevalue, postvalue, isselect)
    {
        this._cellobj.on_fire_oncloseup(obj, pretext, posttext, prevalue, postvalue, isselect);
    };

    _pCellCalendar.on_fire_ondropdown = function (obj)
    {
        return this._cellobj.on_fire_ondropdown(obj);
    };

    _pCellCalendar.on_fire_sys_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        var ret = nexacro.Calendar.prototype.on_fire_sys_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);

        if (this._view)
        {
            if (this._isPopupVisible())
                this._view._is_editor_keyaction = false;
            else
                this._view._is_editor_keyaction = true;
        }

        return ret;
    };

    _pCellCalendar.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        nexacro.Calendar.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellCalendar.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._displaymode)
            this.setSelect(0, 0);

        nexacro.Calendar.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellCalendar._on_edit_oneditclick = function (obj, e)
    {
        nexacro.Calendar.prototype._on_edit_oneditclick.call(this, obj, e);

        if (this._displaymode)
            return this._cellobj.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "control");
    };
    _pCellCalendar._on_edit_onkeydown = function (obj, e)
    {
        if (!this._displaymode && this._p_visible)
            return nexacro.Calendar.prototype._on_edit_onkeydown.call(this, obj, e);
        else
            return false;
    };
    _pCellCalendar._on_drop_onclick = function (obj, e)
    {
        nexacro.Calendar.prototype._on_drop_onclick.call(this, obj, e);

        if (this._displaymode)
            return this._cellobj.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "control");
    };

    _pCellCalendar.on_fire_onchanged = function (obj, pre_text, pre_value, post_text, post_value)
    {
        if (!obj._displaymode)
        {
            var update = this._cellobj._getAutoUpdateType();
            if (update == "dateselect" || update == "itemselect" || this._cellobj._band.id == "head")
            {
                // on_fire_onchanged는 발생되었지만 dataset은 갱신 안된 상태.
                this._cellobj._applyEditorDataset(true, pre_value);
            }
            return (nexacro.Calendar.prototype.on_fire_onchanged.call(this, obj, pre_text, pre_value, post_text, post_value));
        }
    };

    _pCellCalendar.on_getBindableProperties = function ()
    {
        if (!this._displaymode)
            return "value";
    };

    _pCellCalendar._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellCalendar._getDisplayText = function ()
    {
        if (this._p_parent)
            return this._p_parent._getDisplayText();

        return "";
    };

    _pCellCalendar._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                if (this._is_created)
                    this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellCalendar._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var view = this._view;
        var datarow = cellobj._getDataRow();
        var dataset = cellinfo._getBindDataset();

        var calendardateformat = cellinfo._getAttrValue(cellinfo._p_calendardateformat, datarow);
        if (!calendardateformat)
            calendardateformat = nexacro.Calendar.prototype.dateformat;

        this.set_dateformat(calendardateformat);

        var calendareditformat = cellinfo._getAttrValue(cellinfo._p_calendareditformat, datarow);

        if (!calendareditformat)
            calendareditformat = nexacro.Calendar.prototype.editformat;

        this.set_editformat(calendareditformat);

        var locale = cellinfo._getLocale(datarow);
        this.set_locale(locale);

        if (view)
            this.set_usesoftkeyboard(view._getUseSoftKeyboardValue(view._initsoftkeyboard));

        var org_v;
        if (dataset && cellinfo._p_subsumtext._value != "" && dataset.getRowType(datarow) == 16)
            org_v = cellinfo._getAttrValue(cellinfo._p_subsumtext, datarow);
        else
            org_v = cellinfo._getValue(datarow, true);

        var v = org_v;

        if (!onlycontrolprop)
        {
            if (this._displaymode == true && nexacro._isNull(v))
            {
                var maskobj = this._masktypeobj;
                v = cellinfo._getDisplayText(datarow);
                v = maskobj.removeMask(v.split(''), true); // dateformat 기준 제거
                v = maskobj.changeNormalizeValue(v);
            }
            this.set_value(v);
        }

        var buttonsize = cellinfo._getControlButtonsize(datarow, "calendar");   // calendarbuttonsize
        this.set_buttonsize(buttonsize);
        var popuptype = cellinfo._getControlPopuptype(datarow, "calendar"); // calendarpopuptype
        if (popuptype) this.set_popuptype(popuptype);

        if (this._displaymode == true)
        {
            if (nexacro._isNull(org_v))
            {
                var calendardisplaynulltype = cellinfo._getAttrValue(cellinfo._p_calendardisplaynulltype, datarow);
                if (calendardisplaynulltype != "default")
                {
                    if (!onlycontrolprop)
                        this.set_value(org_v);

                    if (calendardisplaynulltype == "nulltext")
                    {
                        v = cellinfo._getAttrValue(cellinfo._p_calendardisplaynulltext, datarow);
                        this.set_displaynulltext(v);
                    }
                    else if (calendardisplaynulltype == "nullmask")
                    {
                        this.set_displaynulltext("");
                    }
                    else // none
                    {
                        this.set_displaynulltext("");
                        this.set_dateformat("");
                    }
                }
            }
            else
            {
                if (this._isInvalidValue(org_v))
                {
                    var calendardisplayinvalidtype = cellinfo._getAttrValue(cellinfo._p_calendardisplayinvalidtype, datarow);

                    if (!onlycontrolprop)
                        this.set_value(org_v);

                    this.set_dateformat("");
                    this.set_displayinvalidtext("");

                    if (calendardisplayinvalidtype == "invalidtext" || calendardisplayinvalidtype == "default")
                    {
                        v = cellinfo._getAttrValue(cellinfo._p_calendardisplayinvalidtext, datarow);
                        if (v != null)
                            this.set_displayinvalidtext(v);
                    }
                    else // none
                    {
                        this.set_displayinvalidtext(org_v);
                    }
                }

            }
        }

        var calendarpopupsize = cellinfo._getControlPopupsize(datarow, "calendar"); // calendarpopupsize
        if (calendarpopupsize) this.set_popupsize(calendarpopupsize);

        if (this._view)
        {
            if (this._view._is_update_inner_dataset)
                this.innerdataset = null;
        }

        cellinfo._setCellChildControlProperty("calendar", this, datarow);

        // innerdataset for custom daydisplay
    };

    _pCellCalendar._setEditingValue = function (value)
    {
        return this.calendaredit.set_value(value);
    };


    _pCellCalendar._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellCalendar._getEditingText = function ()
    {
        return this.calendaredit.text;
    };

    _pCellCalendar._getEditingValue = function ()
    {
        return this.calendaredit._p_value;
    };

    _pCellCalendar._getValueData = function ()
    {
        this._setValueCtrl(true);
        return this._p_value;
    };

    _pCellCalendar._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Calendar.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellCalendar._getChildren = function ()
    {
        return [this.calendaredit, this.dropbutton];
    };

    _pCellCalendar._on_dataset_onvaluechanged = function (obj, e)
    {
        if (!this._displaymode)
            nexacro.Calendar.prototype._on_dataset_onvaluechanged.call(this, obj, e);
    };

    _pCellCalendar._on_dataset_onrowsetchanged = function (obj, e)
    {
        if (!this._displaymode)
        {
            nexacro.Calendar.prototype._on_dataset_onrowsetchanged.call(this, obj, e);
        }
        else if (e.reason != nexacro.NormalDataset.REASON_FILTER && e.reason != nexacro.NormalDataset.REASON_SORTGROUP) // displaymode 일 때는 dataset의 뷰데이터가 아닌 실데이터가 변경된 경우만 udpate처리
        {
            this._p_value = undefined;
            this._updateAll();
        }
    };

    _pCellCalendar._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = {
            "styles": null,
            "calendaredit": { styles: null },
            "dropbutton": { styles: null },
            "calendarspinupbutton": { styles: null },
            "calendarspindownbutton": { styles: null }
        };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        if (this.calendaredit)
        {
            str = nexacro._getComputedStyleProperties(this.calendaredit._control_element, properties, null, true);
            ctrl_cs.calendaredit.styles = (new Function("return " + str))();
        }
        if (this.dropbutton)
        {
            str = nexacro._getComputedStyleProperties(this.dropbutton._control_element, properties, null, true);
            ctrl_cs.dropbutton.styles = (new Function("return " + str))();
        }
        if (this.calendarspinupbutton)
        {
            str = nexacro._getComputedStyleProperties(this.calendarspinupbutton._control_element, properties, null, true);
            ctrl_cs.calendarspinupbutton.styles = (new Function("return " + str))();
        }
        if (this.calendarspindownbutton)
        {
            str = nexacro._getComputedStyleProperties(this.calendarspindownbutton._control_element, properties, null, true);
            ctrl_cs.calendarspindownbutton.styles = (new Function("return " + str))();
        }

        return ctrl_cs;
    };

    _pCellCalendar._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        var calendaredit = this.calendaredit;
        var dropbutton = this.dropbutton;
        var calendarspinupbutton = this.calendarspinupbutton;
        var calendarspindownbutton = this.calendarspindownbutton;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }

            if (calendaredit)
            {
                if (ctrl_cs.calendaredit.styles)
                {
                    if (calendaredit[func_name])
                        calendaredit[func_name].call(calendaredit, ctrl_cs.calendaredit.styles[prop_name]);
                }
            }
            if (dropbutton)
            {
                if (ctrl_cs.dropbutton.styles)
                {
                    if (dropbutton[func_name])
                        dropbutton[func_name].call(dropbutton, ctrl_cs.dropbutton.styles[prop_name]);
                }
            }
            if (calendarspinupbutton)
            {
                if (ctrl_cs.calendarspinupbutton.styles)
                {
                    if (calendarspinupbutton[func_name])
                        calendarspinupbutton[func_name].call(calendarspinupbutton, ctrl_cs.calendarspinupbutton.styles[prop_name]);
                }
            }
            if (calendarspindownbutton)
            {
                if (ctrl_cs.calendarspindownbutton.styles)
                {
                    if (calendarspindownbutton[func_name])
                        calendarspindownbutton[func_name].call(calendarspindownbutton, ctrl_cs.calendarspindownbutton.styles[prop_name]);
                }
            }
        }
    };

    _pCellCalendar._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };
        var calendaredit = this.calendaredit;

        if (calendaredit && calendaredit._input_element)
            align = calendaredit._input_element._getComputedStyleAlign(noflush);

        return align;
    };

    _pCellCalendar._setAccessibilityInputLabel = nexacro._emptyFn;

    _pCellCalendar.on_apply_readonly = function (readonly)
    {
        nexacro.Calendar.prototype.on_apply_readonly.call(this, this._view._p_readonly);
    };

    _pCellCalendar._isReadOnly = function ()
    {
        return this._view._p_readonly;
    };

    //===============================================================
    // nexacro._CellComboPopupControl
    //===============================================================
    nexacro._CellComboPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._ComboPopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pCellComboPopupControl = nexacro._createPrototype(nexacro._ComboPopupControl, nexacro._CellComboPopupControl);
    nexacro._CellComboPopupControl.prototype = _pCellComboPopupControl;


    /* internal variable */
    _pCellComboPopupControl._is_subcontrol = true;

    //===============================================================
    // nexacro._CellComboPopupControl : Override
    //===============================================================
    _pCellComboPopupControl._getPopupParentPos = function ()
    {

        var combo = this._p_parent;

        var rect;
        var bandrect;
        if (combo._p_parent._getPositionInRootComponent)
        {
            var ret = combo._p_parent._getPositionInRootComponent(combo);
            rect = ret[0];
            bandrect = ret[1];

            var combo_size = [rect.width, rect.height];
            var combo_elem_pos = nexacro._getElementPositionInFrame(combo.getElement(), true);
            var xgap = 0;
            var ygap = 0;
            if (0 > bandrect.orgl)
            {
                xgap = Math.abs(bandrect.orgl);
            }
            if (0 > bandrect.orgt)
            {
                ygap = Math.abs(bandrect.orgt);
            }


            //var x,y,
            return { "x": combo_elem_pos.x, "y": combo_elem_pos.y, "width": combo_size[0], "height": combo_size[1], "xgap": xgap, "ygap": ygap };
        }
        else
            return nexacro._ComboPopupControl.prototype._getPopupParentPos.call(this);

    };
    //===============================================================
    // nexacro._CellComboControl
    //===============================================================
    nexacro._CellComboControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.Combo.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);
        this._p_tabstop = false;

        if (displaymode)
        {
            this._displaymode = true;
            this._p_readonly = true;
        }
        else
        {
            this._displaymode = false;
        }

        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };

    var _pCellCombo = nexacro._createPrototype(nexacro.Combo, nexacro._CellComboControl);
    nexacro._CellComboControl.prototype = _pCellCombo;
    _pCellCombo._is_subcontrol = true;

    _pCellCombo.on_getIDCSSSelector = function ()
    {
        return "cellcombo";
    };

    _pCellCombo.on_create_contents = function ()
    {
        nexacro.Combo.prototype.on_create_contents.call(this);

        if (this._displaymode)
        {
            this.comboedit.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
            {
                nexacro._ComboEditControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                return true;
            };
            this.dropbutton.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
            {
                nexacro._ComboButtonControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                return true;
            };
        }
    };

    _pCellCombo.setOnlyElementFocus = function ()
    {
        if (this.comboedit && this.comboedit._input_element)
            this.comboedit._input_element._applyElementFocus();
    };

    _pCellCombo.on_destroy_contents = function ()
    {
        nexacro.Combo.prototype.on_destroy_contents.call(this);
        this._child_editor = null;
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellCombo._apply_setfocus = function (evt_name)
    {
        if (!this._displaymode || this._env._p_enableaccessibility)
            return nexacro.Combo.prototype._apply_setfocus.call(this, evt_name);
    };

    _pCellCombo.on_fire_oncloseup = function (obj, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue, isSelect)
    {
        nexacro.Combo.prototype.on_fire_oncloseup.call(this, obj, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue, isSelect);
        this._cellobj.on_fire_oncloseup(obj, beforeText, afterText, beforeValue, afterValue, isSelect);
    };

    _pCellCombo.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        var view = this._view;
        if (view)
        {
            if (keycode == nexacro.Event.KEY_DOWN || keycode == nexacro.Event.KEY_UP
                || (keycode == nexacro.Event.KEY_DOWN && alt_key))
            {
                view._is_editor_keyaction = false;
            }
        }

        nexacro.Combo.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);

        if (!this._displaymode)
            return this._cellobj.on_fire_user_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pCellCombo.on_fire_user_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmousewheel && this.onmousewheel._has_handlers)
        {
            var evt = new nexacro.MouseWheelEventInfo(this, "onmousewheel", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, wheelDeltaY, from_comp, from_refer_comp, meta_key);
            return this.onmousewheel._fireUserEvent(this, evt);
        }
        else if (!this._displaymode && this._grid)
        {
            var pThis = this._grid;
            pThis.on_fire_user_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, pThis, from_refer_comp, meta_key)
            return (!pThis.onmousewheel || (pThis.onmousewheel && !pThis.onmousewheel.defaultprevented)) ? false : true;
        }
        return false;
    };

    _pCellCombo.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, comp, refer_comp, meta_key)
    {
        if (!this._displaymode)
            return nexacro.Combo.prototype.on_fire_sys_onmousewheel.call(this, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, comp, refer_comp, meta_key);
    };

    _pCellCombo.on_fire_ondropdown = function (obj)
    {
        return this._cellobj.on_fire_ondropdown(obj);
    };

    _pCellCombo.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.Combo.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellCombo.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._displaymode)
            this.setSelect(0, 0);

        nexacro.Combo.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellCombo._on_edit_oneditclick = function (obj, e)
    {
        nexacro.Combo.prototype._on_edit_oneditclick.call(this, obj, e);

        if (this._displaymode)
            return this._cellobj.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "control");
    };
    _pCellCombo._on_edit_onkeydown = function (obj, e)
    {

        if (!this._displaymode && this._p_visible)
            return nexacro.Combo.prototype._on_edit_onkeydown.call(this, obj, e);
        else
            return false;
    };
    _pCellCombo._on_drop_onclick = function (obj, e)
    {
        nexacro.Combo.prototype._on_drop_onclick.call(this, obj, e);

        if (this._displaymode)
            return this._cellobj.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "control");
    };

    _pCellCombo.on_fire_oninput = function ()
    {
        nexacro.Combo.prototype.on_fire_oninput.call(this);
        return this._cellobj.on_fire_oninput(this);
    };

    _pCellCombo.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        var retn = nexacro.Component.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        if (this._isPopupVisible() && this == refer_comp)
            this._closePopup();

        return retn;
    };

    _pCellCombo.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (!obj._displaymode)
        {
            var update = this._cellobj._getAutoUpdateType();
            if (update == "comboselect" || update == "itemselect" || this._cellobj._band.id == "head")
            {
                // on_fire_onchanged는 발생되었지만 dataset은 갱신 안된 상태.
                this._cellobj._applyEditorDataset(true, prevalue);
            }
            return (nexacro.Combo.prototype.on_fire_onitemchanged.call(this, obj, preindex, pretext, prevalue, postindex, posttext, postvalue));
        }
    };

    _pCellCombo.on_getBindableProperties = function ()
    {
        if (!this._displaymode)
            return "value";
    };

    _pCellCombo._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellCombo._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                if (this._is_created)
                    this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellCombo._confirmValue = function ()
    {
        if (this._p_readonly)
            return;

        var combolist = this.combolist;
        var ds = this._selectDataset();
        var pre_value = this._default_value;
        var pre_text = this._default_text;
        var pre_index = this._default_index;

        var cur_value = this._p_value;
        var cur_text = this.text;
        var cur_index = this.index;
        var rawidx, curobj;

        if (this._isPopupVisible())
        {
            curobj = combolist._get_rowobj_status("mouseover", "status") || combolist._get_rowobj_status("selected", "userstatus");
            if (curobj)
            {
                cur_index = curobj.index;
            }
        }

        if (cur_index >= 0)
        {
            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                rawidx = this._getRawIndex(ds, cur_index);
                rawidx = (rawidx == -1) ? cur_index : rawidx;
                ds.set_filterstr("");
            }
            else
            {
                rawidx = cur_index;
            }
        }
        else
        {
            rawidx = cur_index;
        }

        if (this.index != rawidx)
        {
            cur_value = this._getItemValue(rawidx);
            cur_text = this._getItemText(rawidx);
            cur_index = rawidx;

            if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
            {
                this._setEditValue(this.text);
                cur_value = pre_value;
                cur_text = pre_text;
                cur_index = pre_index;
            }
        }

        this._setDefaultProps(cur_index, cur_value, cur_text);
    };

    _pCellCombo._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();

        var buttonsize = cellinfo._getControlButtonsize(datarow, "combo");  // combobuttonsize
        this.set_buttonsize(buttonsize);
        var popuptype = cellinfo._getControlPopuptype(datarow, "combo");    // combopopuptype
        if (popuptype) this.set_popuptype(popuptype);
        var scrollsize = cellinfo._getControlScrollbarsize(datarow, "combo");   // comboscrollbarsize
        if (scrollsize != null) this.set_scrollbarsize(scrollsize);
        var popupsize = cellinfo._getControlPopupsize(datarow, "combo");    // combopopupsize
        if (popupsize) this.set_popupsize(popupsize);

        var v;

        v = cellinfo._getAttrValue(cellinfo._p_combodisplaynulltype, datarow);
        if (v == "nulltext")
        {
            v = cellinfo._getAttrValue(cellinfo._p_combodisplaynulltext, datarow);
            this.set_displaynulltext(v);
        }
        else
        {
            this.set_displaynulltext("");
        }

        if (this._view)
        {
            if (this._view._is_update_inner_dataset)
                this.innerdataset = null;
        }
        cellinfo._setCellChildControlProperty("combo", this, datarow);

        if (!onlycontrolprop)
        {
            v = cellinfo._getAttrValue(cellinfo._p_text, datarow, this._displaymode);
            var _value = this._p_value;
            this.set_value(v);
            if (!v)
            {
                if (this._displaymode == true)
                {
                    var text = cellinfo._getDisplayText(datarow);
                    this.set_text(text);
                }

                if (v === undefined && _value === undefined)
                {
                    if (this.applyto_bindSource("value", v))
                    {
                        this._p_value = v;
                        this.on_apply_value(v);
                        this.redraw();
                    }
                }
            }
        }

        if (this._view)
            this.set_usesoftkeyboard(this._view._getUseSoftKeyboardValue(this._view._initsoftkeyboard));
    };

    _pCellCombo._selectDataset = function (bInit)
    {
        if (this._displaymode)
            return this._innerdataset;

        return nexacro.Combo.prototype._selectDataset.call(this, bInit);
    };

    _pCellCombo._getColumn = function (ds, index, column)
    {
        if (this._displaymode)
            return ds.getColumnNF(index, column);
        else
            return ds.getColumn(index, column);
    };

    _pCellCombo._getRowCount = function (ds)
    {
        if (this._displaymode)
            return ds.getRowCountNF();
        else
            return ds.getRowCount();
    };

    _pCellCombo._setEditingValue = function (value)
    {
        return this.comboedit.set_value(value);
    };

    _pCellCombo.on_apply_text = function (text)
    {
        if (this._displaymode == true)
        {
            if (!nexacro._isNull(this._p_value))
            {
                var cellinfo = this._cellinfo,
                    cellobj = this._cellobj;

                var datarow = cellobj._getDataRow();

                var v = cellinfo._getAttrValue(cellinfo._p_combodisplaynulltype, datarow);
                if (v == "nulltext")
                {
                    if (this.index < 0)   // value가 있어도 선택된 아이템이 존재하지 않는다면..
                        this._setEditValue(undefined);
                    else
                        this._setEditValue(text);
                }
            }
            else
            {
                if (this.displaynulltext || text == "")
                    this._setEditValue(undefined);
                else
                    this._setEditValue(text);
            }
        }
        else
        {
            return nexacro.Combo.prototype.on_apply_text.call(this, text);
        }
    };

    _pCellCombo._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellCombo._getEditingText = function ()
    {
        return this.comboedit.text;
    };

    _pCellCombo._getEditingValue = function ()
    {
        return this.comboedit._p_value;
    };

    _pCellCombo._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellCombo._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Combo.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellCombo._getChildren = function ()
    {
        return [this.comboedit, this.dropbutton];
    };

    _pCellCombo._on_dataset_onvaluechanged = function (obj, e)
    {
        if (!this._displaymode)
            nexacro.Combo.prototype._on_dataset_onvaluechanged.call(this, obj, e);
    };

    _pCellCombo._on_dataset_onrowsetchanged = function (obj, e)
    {
        if (!this._displaymode)
            nexacro.Combo.prototype._on_dataset_onrowsetchanged.call(this, obj, e);
        else if (e.reason != nexacro.NormalDataset.REASON_FILTER && e.reason != nexacro.NormalDataset.REASON_SORTGROUP) // displaymode 일 때는 dataset의 뷰데이터가 아닌 실데이터가 변경된 경우만 udpate처리
        {
            this._p_value = undefined;
            this._updateAll();
        }
    };

    _pCellCombo._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = {
            "styles": null,
            "comboedit": { styles: null },
            "dropbutton": { styles: null },
        };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        if (this.comboedit)
        {
            str = nexacro._getComputedStyleProperties(this.comboedit._control_element, properties, null, true);
            ctrl_cs.comboedit.styles = (new Function("return " + str))();
        }
        if (this.dropbutton)
        {
            str = nexacro._getComputedStyleProperties(this.dropbutton._control_element, properties, null, true);
            ctrl_cs.dropbutton.styles = (new Function("return " + str))();
        }
        return ctrl_cs;
    };

    _pCellCombo._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        var comboedit = this.comboedit;
        var dropbutton = this.dropbutton;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }

            if (comboedit)
            {
                if (ctrl_cs.comboedit.styles)
                {
                    if (comboedit[func_name])
                        comboedit[func_name].call(comboedit, ctrl_cs.comboedit.styles[prop_name]);
                }
            }
            if (dropbutton)
            {
                if (ctrl_cs.dropbutton.styles)
                {
                    if (dropbutton[func_name])
                        dropbutton[func_name].call(dropbutton, ctrl_cs.dropbutton.styles[prop_name]);
                }
            }
        }
    };

    _pCellCombo._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };
        var comboedit = this.comboedit;

        if (comboedit && comboedit._input_element)
            align = this.comboedit._input_element._getComputedStyleAlign(noflush);

        return align;
    };

    _pCellCombo._setAccessibilityInputLabel = nexacro._emptyFn;

    _pCellCombo._isReadOnly = function ()
    {
        return this._view._p_readonly;
    };

    _pCellCombo._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._CellComboPopupControl("combopopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol._setType(this.popuptype);

            popupcontrol.createComponent(true);
        }
    };

    //===============================================================
    // nexacro._CellMultiComboPopupControl
    //===============================================================
    nexacro._CellMultiComboPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._MultiComboPopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pCellMultiComboPopupControl = nexacro._createPrototype(nexacro._MultiComboPopupControl, nexacro._CellMultiComboPopupControl);
    nexacro._CellMultiComboPopupControl.prototype = _pCellMultiComboPopupControl;


    /* internal variable */
    _pCellMultiComboPopupControl._is_subcontrol = true;

    //===============================================================
    // nexacro._CellMultiComboPopupControl : Override
    //===============================================================
    _pCellMultiComboPopupControl._getPopupParentPos = function ()
    {
        var combo = this._p_parent;

        var rect;
        var bandrect;
        if (combo._p_parent._getPositionInRootComponent)
        {
            var ret = combo._p_parent._getPositionInRootComponent(combo);
            rect = ret[0];
            bandrect = ret[1];

            var combo_size = [rect.width, rect.height];
            var combo_elem_pos = nexacro._getElementPositionInFrame(combo.getElement(), true);
            var xgap = 0;
            var ygap = 0;
            if (0 > bandrect.orgl)
            {
                xgap = Math.abs(bandrect.orgl);
            }
            if (0 > bandrect.orgt)
            {
                ygap = Math.abs(bandrect.orgt);
            }


            //var x,y,
            return { "x": combo_elem_pos.x, "y": combo_elem_pos.y, "width": combo_size[0], "height": combo_size[1], "xgap": xgap, "ygap": ygap };
        }
        else
            return nexacro._MultiComboPopupControl.prototype._getPopupParentPos.call(this);

    };

    //===============================================================
    // nexacro._CellMultiComboControl
    //===============================================================
    nexacro._CellMultiComboControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.MultiCombo.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);
        this._p_tabstop = false;

        if (displaymode)
        {
            this._displaymode = true;
            this._p_readonly = true;
        }
        else
        {
            this._displaymode = false;
        }

        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };

    var _pCellMultiCombo = nexacro._createPrototype(nexacro.MultiCombo, nexacro._CellMultiComboControl);
    nexacro._CellMultiComboControl.prototype = _pCellMultiCombo;
    _pCellMultiCombo._is_subcontrol = true;

    _pCellMultiCombo.on_getIDCSSSelector = function ()
    {
        return "cellmulticombo";
    };

    _pCellMultiCombo.on_create_contents = function ()
    {
        nexacro.MultiCombo.prototype.on_create_contents.call(this);

        if (this._displaymode)
        {
            if (!this._tagmode)
            {
                this.multicombotext.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
                {
                    nexacro._MultiComboEditControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                    this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                    return true;
                };
            }
            else
            {
                this.multicomboedit.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
                {
                    nexacro._MultiComboEditControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                    this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                    return true;
                };
            }
            this.dropbutton.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
            {
                nexacro._MultiComboButtonControl.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

                this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
                return true;
            };
        }
    };

    _pCellMultiCombo.setOnlyElementFocus = function ()
    {
        if (this.multicomboedit && this.multicomboedit._input_element)
            this.multicomboedit._input_element._applyElementFocus();
    };

    _pCellMultiCombo.on_destroy_contents = function ()
    {
        nexacro.MultiCombo.prototype.on_destroy_contents.call(this);
        this._child_editor = null;
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellMultiCombo._apply_setfocus = function (evt_name)
    {
        if (!this._displaymode || this._env._p_enableaccessibility)
            return nexacro.MultiCombo.prototype._apply_setfocus.call(this, evt_name);
    };

    _pCellMultiCombo.on_fire_oncloseup = function (obj, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue, isSelect)
    {
        nexacro.MultiCombo.prototype.on_fire_oncloseup.call(this, obj, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue, isSelect);
        this._cellobj.on_fire_oncloseup(obj, beforeText, afterText, beforeValue, afterValue, isSelect);
    };

    _pCellMultiCombo.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        var view = this._view;
        if (view)
        {
            if (keycode == nexacro.Event.KEY_DOWN || keycode == nexacro.Event.KEY_UP
                || (keycode == nexacro.Event.KEY_DOWN && alt_key))
            {
                view._is_editor_keyaction = false;
            }
        }

        nexacro.MultiCombo.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);

        if (!this._displaymode)
            return this._cellobj.on_fire_user_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pCellMultiCombo.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, comp, refer_comp, meta_key)
    {
        if (!this._displaymode)
            return nexacro.MultiCombo.prototype.on_fire_sys_onmousewheel.call(this, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, comp, refer_comp, meta_key);
    };

    _pCellMultiCombo.on_fire_ondropdown = function (obj)
    {
        return this._cellobj.on_fire_ondropdown(obj);
    };

    _pCellMultiCombo.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.MultiCombo.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellMultiCombo.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.MultiCombo.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellMultiCombo._on_edit_oneditclick = function (obj, e)
    {
        nexacro.MultiCombo.prototype._on_edit_oneditclick.call(this, obj, e);

        if (this._displaymode)
            return this._cellobj.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "control");
    };
    _pCellMultiCombo._on_edit_onkeydown = function (obj, e)
    {

        if (!this._displaymode && this._p_visible)
            return nexacro.MultiCombo.prototype._on_edit_onkeydown.call(this, obj, e);
        else
            return false;
    };
    _pCellMultiCombo._on_drop_onclick = function (obj, e)
    {
        nexacro.MultiCombo.prototype._on_drop_onclick.call(this, obj, e);

        if (this._displaymode)
            return this._cellobj.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, "control");
    };

    _pCellMultiCombo.on_fire_oninput = function ()
    {
        nexacro.MultiCombo.prototype.on_fire_oninput.call(this);
        return this._cellobj.on_fire_oninput(this);
    };

    _pCellMultiCombo.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        var retn = nexacro.Component.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        if (this._isPopupVisible() && this == refer_comp)
            this._closePopup();

        return retn;
    };

    _pCellMultiCombo.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (!obj._displaymode)
        {
            var update = this._cellobj._getAutoUpdateType();
            if (update == "comboselect" || update == "itemselect" || this._cellobj._band.id == "head")
            {
                // on_fire_onchanged는 발생되었지만 dataset은 갱신 안된 상태.
                this._cellobj._applyEditorDataset(true, prevalue);
            }
            return (nexacro.MultiCombo.prototype.on_fire_onitemchanged.call(this, obj, preindex, pretext, prevalue, postindex, posttext, postvalue));
        }
    };

    _pCellMultiCombo.on_getBindableProperties = function ()
    {
        if (!this._displaymode)
            return "value";
    };

    _pCellMultiCombo._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellMultiCombo._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                if (this._is_created)
                    this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellMultiCombo._confirmValue = function ()
    {
        if (this._p_readonly)
            return;

        var multicombolist = this.multicombolist;
        var ds = this._selectDataset();
        var pre_value = this._default_value;
        var pre_text = this._default_text;
        var pre_index = this._default_index;

        var cur_value = this._p_value;
        var cur_text = this.text;
        var cur_index = this.index;
        var rawidx, curobj;

        if (this._isPopupVisible())
        {
            curobj = multicombolist._get_rowobj_status("mouseover", "status") || multicombolist._get_rowobj_status("selected", "userstatus");
            if (curobj)
            {
                cur_index = curobj.index;
            }
        }

        if (cur_index >= 0)
        {
            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                rawidx = this._getRawIndex(ds, cur_index);
                rawidx = (rawidx == -1) ? cur_index : rawidx;
                ds.set_filterstr("");
            }
            else
            {
                rawidx = cur_index;
            }
        }
        else
        {
            rawidx = cur_index;
        }

        if (this.index != rawidx)
        {
            cur_value = this._getItemValue(rawidx);
            cur_text = this._getItemText(rawidx);
            cur_index = rawidx;

            if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
            {
                this._setEditValue(this.text);
                cur_value = pre_value;
                cur_text = pre_text;
                cur_index = pre_index;
            }
        }

        this._setDefaultProps(cur_index, cur_value, cur_text);
    };

    _pCellMultiCombo._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();

        var buttonsize = cellinfo._getControlButtonsize(datarow, "multicombo");  // multicombobuttonsize
        this.set_buttonsize(buttonsize);
        var popuptype = cellinfo._getControlPopuptype(datarow, "multicombo");    // multicombopopuptype
        if (popuptype) this.set_popuptype(popuptype);
        var scrollsize = cellinfo._getControlScrollbarsize(datarow, "multicombo");   // multicomboscrollbarsize
        if (scrollsize != null) this.set_scrollbarsize(scrollsize);
        var popupsize = cellinfo._getControlPopupsize(datarow, "multicombo");    // multicombopopupsize
        if (popupsize) this.set_popupsize(popupsize);

        var v;

        v = cellinfo._getAttrValue(cellinfo._p_multicombodisplaynulltype, datarow);
        if (v == "nulltext")
        {
            v = cellinfo._getAttrValue(cellinfo._p_multicombodisplaynulltext, datarow);
            this.set_displaynulltext(v);
        }
        else
        {
            this.set_displaynulltext("");
        }

        if (this._view)
        {
            if (this._view._is_update_inner_dataset)
                this.innerdataset = null;
        }

        cellinfo._setCellChildControlProperty("multicombo", this, datarow);

        if (!onlycontrolprop)
        {
            v = cellinfo._getAttrValue(cellinfo._p_text, datarow, this._displaymode);
            var _value = this._p_value;
            this.set_value(v);
            if (v === undefined && _value === undefined)
            {
                if (this.applyto_bindSource("value", v))
                {
                    this._p_value = v;
                    this.on_apply_value(v);
                    this.redraw();
                }
            }
        }

        if (this._view)
            this.set_usesoftkeyboard(this._view._getUseSoftKeyboardValue(this._view._initsoftkeyboard));
    };

    _pCellMultiCombo._selectDataset = function (bInit)
    {
        if (this._displaymode)
            return this._innerdataset;

        return nexacro.MultiCombo.prototype._selectDataset.call(this, bInit);
    };

    _pCellMultiCombo._getColumn = function (ds, index, column)
    {
        if (this._displaymode)
            return ds.getColumnNF(index, column);
        else
            return ds.getColumn(index, column);
    };

    _pCellMultiCombo._getRowCount = function (ds)
    {
        if (this._displaymode)
            return ds.getRowCountNF();
        else
            return ds.getRowCount();
    };

    _pCellMultiCombo._setEditingValue = function (value)
    {
        return this.comboedit.set_value(value);
    };

    _pCellMultiCombo.on_apply_text = function (text)
    {
        if (this._displaymode == true)
        {
            if (!nexacro._isNull(this._p_value))
            {
                var cellinfo = this._cellinfo,
                    cellobj = this._cellobj;

                var datarow = cellobj._getDataRow();

                var v = cellinfo._getAttrValue(cellinfo._p_multicombodisplaynulltype, datarow);
                if (v == "nulltext")
                {
                    if (this.index < 0)   // value가 있어도 선택된 아이템이 존재하지 않는다면..
                        this._setEditValue(undefined);
                    else
                        this._setEditValue(text);
                }
            }
            else
            {
                if (this.displaynulltext || text == "")
                    this._setEditValue(undefined);
                else
                    this._setEditValue(text);
            }
        }
        else
        {
            return nexacro.MultiCombo.prototype.on_apply_text.call(this, text);
        }
    };

    _pCellMultiCombo._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellMultiCombo._getEditingText = function ()
    {
        return this.multicomboedit.text;
    };

    _pCellMultiCombo._getEditingValue = function ()
    {
        return this.multicomboedit._p_value;
    };

    _pCellMultiCombo._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellMultiCombo._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.MultiCombo.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellMultiCombo._getChildren = function ()
    {
        return [this.multicomboedit, this.dropbutton];
    };

    _pCellMultiCombo._on_dataset_onvaluechanged = function (obj, e)
    {
        if (!this._displaymode)
            nexacro.MultiCombo.prototype._on_dataset_onvaluechanged.call(this, obj, e);
    };

    _pCellMultiCombo._on_dataset_onrowsetchanged = function (obj, e)
    {
        if (!this._displaymode)
            nexacro.MultiCombo.prototype._on_dataset_onrowsetchanged.call(this, obj, e);
        else if (e.reason != nexacro.NormalDataset.REASON_FILTER && e.reason != nexacro.NormalDataset.REASON_SORTGROUP) // displaymode 일 때는 dataset의 뷰데이터가 아닌 실데이터가 변경된 경우만 udpate처리
        {
            this._p_value = undefined;
            this._updateAll();
        }
    };

    _pCellMultiCombo._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = {
            "styles": null,
            "multicomboedit": { styles: null },
            "dropbutton": { styles: null },
        };

        var str = nexacro._getComputedStyleProperties(this._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        if (this.multicomboedit)
        {
            str = nexacro._getComputedStyleProperties(this.multicomboedit._control_element, properties, null, true);
            ctrl_cs.multicomboedit.styles = (new Function("return " + str))();
        }
        if (this.dropbutton)
        {
            str = nexacro._getComputedStyleProperties(this.dropbutton._control_element, properties, null, true);
            ctrl_cs.dropbutton.styles = (new Function("return " + str))();
        }
        return ctrl_cs;
    };

    _pCellMultiCombo._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._computed_prop_list;
        var multicomboedit = this.multicomboedit;
        var dropbutton = this.dropbutton;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this[func_name])
                    this[func_name].call(this, ctrl_cs.styles[prop_name]);
            }

            if (multicomboedit)
            {
                if (ctrl_cs.multicomboedit.styles)
                {
                    if (multicomboedit[func_name])
                        multicomboedit[func_name].call(multicomboedit, ctrl_cs.multicomboedit.styles[prop_name]);
                }
            }
            if (dropbutton)
            {
                if (ctrl_cs.dropbutton.styles)
                {
                    if (dropbutton[func_name])
                        dropbutton[func_name].call(dropbutton, ctrl_cs.dropbutton.styles[prop_name]);
                }
            }
        }
    };

    _pCellMultiCombo._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };
        var multicomboedit = this.multicomboedit;

        if (multicomboedit && multicomboedit._input_element)
            align = this.multicomboedit._input_element._getComputedStyleAlign(noflush);

        return align;
    };

    _pCellMultiCombo._setAccessibilityInputLabel = nexacro._emptyFn;

    _pCellMultiCombo._isReadOnly = function ()
    {
        return this._view._p_readonly;
    };

    _pCellMultiCombo._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._CellMultiComboPopupControl("multicombopopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol._setType(this.popuptype);

            popupcontrol.createComponent(true);
        }
    };

    //===============================================================
    // nexacro._CellCheckboxControlBase
    //===============================================================
    nexacro._CellCheckboxControlBase = function (id, left, top, width, height, parent)
    {
        nexacro.CheckBox.call(this, id, left, top, width, height, null, null, null, null, null, null, parent);
        this._p_tabstop = false;
        this._is_usetextbox = false;

        var wnd = parent;   // parent 구조가 다를 수 있음.
        while (wnd)
        {
            if (wnd._refinfo)
            {
                this._cellobj = wnd;
                this._cellinfo = wnd._refinfo;
                this._view = wnd._view;
                break;
            }
            wnd = wnd._p_parent;
        }
        this.checked = false;
        this._setControl();
    };

    var _pCellCheckboxBase = nexacro._createPrototype(nexacro.CheckBox, nexacro._CellCheckboxControlBase);
    nexacro._CellCheckboxControlBase.prototype = _pCellCheckboxBase;
    _pCellCheckboxBase._is_subcontrol = true;

    _pCellCheckboxBase._apply_setfocus = function (evt_name, callback) { }; // lbuttondown시 focus때문에 DOM이 이동하지 않도록 함.

    _pCellCheckboxBase._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.CheckBox.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellCheckboxBase.on_create_contents = function ()
    {
        this._adjustAlign();
        nexacro.CheckBox.prototype.on_create_contents.call(this);
    };

    _pCellCheckboxBase.on_destroy_contents = function ()
    {
        nexacro.CheckBox.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellCheckboxBase.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellCheckboxBase.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellCheckboxBase._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };
    _pCellCheckboxBase._on_icon_onload = function (url, width, height)
    {
        if (this._cellinfo && this._cellobj)
        {
            nexacro._IconText.prototype._on_icon_onload.call(this, url, width, height);
            this._adjustAlign(undefined, undefined, width, height);
        }
    };
    _pCellCheckboxBase._adjustAlign = function (halign, valign, w, h)
    {
        var prect = this._cellobj._getAvailableRect();
        var left = prect.left;
        var top = prect.top;
        var right = prect.right;
        var bottom = prect.bottom;
        var width = prect.width;
        var height = prect.height;
        var datarow = this._cellobj._getDataRow();
        var controlSize = this._cellinfo._getCheckboxsize(datarow);

        if (controlSize < 0 || controlSize == undefined)    // autosize
        {
            var size = this._on_getFitSize(w, h);
            controlSize = size[1];
        }

        if (!halign)
            halign = "center";
        if (!valign)
            valign = "middle";

        if (halign == "center")
            left += ((width - controlSize) / 2);
        else if (halign == "right")
            left = right - controlSize;

        if (valign == "middle")
            top += ((height - controlSize) / 2);
        else if (valign == "bottom")
            top = bottom - controlSize;

        this.move(left, top, controlSize, controlSize);
    };

    _pCellCheckboxBase._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._adjustAlign();
        this._setProperty();
    };

    _pCellCheckboxBase._getCheckValue = function ()
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var v = cellinfo._getTextValueForDisp(datarow);

        return v;
    };

    _pCellCheckboxBase._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();
        cellinfo._setCellChildControlProperty("checkbox", this, datarow);

        if (onlycontrolprop)
            return;

        var v = this._getCheckValue();

        if (!nexacro._isNull(this.falsevalue) && !nexacro._isNull(this.truevalue) && this.truevalue != v)
            v = this.falsevalue;

        this._p_value = false;
        this.set_value(v);
        this.checked = this._isChecked(v);
        this._cellobj._setAccessibilityStatChecked(this.checked);
    };

    _pCellCheckboxBase.set_value = function (v)
    {
        v = this._changeValue(v);
        this._setValue(v);
        this.on_apply_value();
    };

    _pCellCheckboxBase._getComputedStyle = function ()
    {
        var ctrl_cs = { "styles": null };
        return ctrl_cs;
    };

    _pCellCheckboxBase._setComputedStyle = function (ctrl_cs)
    {
    };

    _pCellCheckboxBase._getCurrentStyleAlign = function (noflush)
    {
        // TODO
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    _pCellCheckboxBase._on_getFitSize = function (w, h)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                var icon_pos = this.iconPosition || this._getCSSStyleValue("iconPosition");
                var icon_size;
                if (w != undefined && h != undefined)
                {
                    icon_size = { width: w, height: h };
                }
                else
                {
                    icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, this._view ? this._view._getRefFormBaseUrl() : undefined, icon.value) || { width: 0, height: 0 };
                }

                if (icon_pos == "top" || icon_pos == "bottom")
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width);
                }
                else
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height);
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro._CellCheckboxControl
    //===============================================================
    nexacro._CellCheckboxControl = function (id, left, top, width, height, parent, controlmode)
    {
        nexacro._CellCheckboxControlBase.call(this, id, left, top, width, height, parent);
        this._controlmode = (controlmode) ? true : false;
    };

    var _pCellCheckbox = nexacro._createPrototype(nexacro._CellCheckboxControlBase, nexacro._CellCheckboxControl);
    nexacro._CellCheckboxControl.prototype = _pCellCheckbox;

    _pCellCheckbox.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (!this._is_alive)
            return;

        if (this._cellobj._isFakeCell())
            return false;

        if (this._view && this._view.selectchangetype != "down")
        {
            if (nexacro._toBoolean(this._view._p_readonly) == false)
                this._toggleCheck();
        }

        return this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellCheckbox.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._cellobj._isFakeCell())
            return false;

        return this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellCheckbox._toggleCheck = function ()
    {
        var cellobj = this._cellobj;
        var cellinfo = this._cellinfo;
        var view = this._view;
        var datarow = cellobj._getDataRow();
        var editType = cellinfo._getEdittype(datarow);
        var grid = this._grid;

        if (view && editType == "checkbox")
        {
            var v = this._isChecked(this._p_value);

            if (v)
                v = nexacro._isNull(this.falsevalue) ? 0 : this.falsevalue;
            else
                v = nexacro._isNull(this.truevalue) ? 1 : this.truevalue;

            if (cellinfo.text._bindtype == 1)
            {
                view._dsEventOccured = true;
                var dataset = cellobj._getBindDataset();
                if (dataset && dataset.setColumn(datarow, cellinfo.text._bindexpr, v))
                {
                    v = cellinfo._getTextValueForDisp(datarow);
                    this.set_value(v);
                }
                view._dsEventOccured = false;
            }
            else if (datarow == -1)
            {
                this.set_value(v);
                var cellidx;
                if (this._cellobj._isSubCell)
                {
                    cellidx = this._cellobj._p_parent._cellidx;
                }
                else
                {
                    cellidx = cellinfo._cellidx;
                }
                var prevalue = cellinfo._value;
                if (cellinfo._setValue(this._p_value))
                    grid._on_fire_onheadvaluechanged(prevalue, this._p_value, cellidx);
            }
        }
    };

    _pCellCheckbox._getDisplayText = function ()
    {
        if (this._p_parent)
            return this._p_parent._getDisplayText();

        return "";
    };

    _pCellCheckbox._getCurrentStyleAlign = function (noflush)
    {
        // TODO
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    //===============================================================
    // nexacro._CellRadioItemControl
    //===============================================================
    nexacro._CellRadioItemControl = function (id, left, top, width, height, parent, controlmode)
    {
        nexacro._RadioItemControl.call(this, id, left, top, width, height, null, null, null, null, null, null, parent);
        this._controlmode = (controlmode) ? true : false;
        this._p_tabstop = false;
        this._is_usetextbox = false;

        var wnd = parent;   // parent 구조가 다를 수 있음.
        while (wnd)
        {
            if (wnd._refinfo)
            {
                this._cellobj = wnd;
                this._cellinfo = wnd._refinfo;
                this._view = wnd._view;
                break;
            }
            wnd = wnd._p_parent;
        }
    };

    var _pCellRadioItem = nexacro._createPrototype(nexacro._RadioItemControl, nexacro._CellRadioItemControl);
    nexacro._CellRadioItemControl.prototype = _pCellRadioItem;

    _pCellRadioItem._properties = [
        { name: "value" },
        { name: "codevalue" },
    ];

    _pCellRadioItem.on_getIDCSSSelector = function ()
    {
        return "cellradioitem";
    };

    _pCellRadioItem._apply_setfocus = function (evt_name, callback) { }; // lbuttondown시 focus때문에 DOM이 이동하지 않도록 함.

    _pCellRadioItem._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.CheckBox.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellRadioItem.on_create_contents = function ()
    {
        this._adjustAlign();
        nexacro._RadioItemControl.prototype.on_create_contents.call(this);
    };

    _pCellRadioItem.on_destroy_contents = function ()
    {
        nexacro._RadioItemControl.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellRadioItem._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellRadioItem._on_icon_onload = function (url, width, height)
    {
        nexacro._RadioItemControl.prototype._on_icon_onload.call(this, url, width, height);

        this._adjustAlign(undefined, undefined, width, height);
    };

    _pCellRadioItem._adjustAlign = function (halign, valign, w, h)
    {
        var prect = this._cellobj._getAvailableRect();
        var left = prect.left;
        var top = prect.top;
        var right = prect.right;
        var bottom = prect.bottom;
        var width = prect.width;
        var height = prect.height;
        var datarow = this._cellobj._getDataRow();
        var controlSize = this._cellinfo._getRadioitemsize(datarow);

        if (controlSize < 0 || controlSize == undefined)    // autosize
        {
            var size = this._on_getFitSize(w, h);
            controlSize = size[1];
        }

        if (!halign)
            halign = "center";
        if (!valign)
            valign = "middle";

        if (halign == "center")
            left += ((width - controlSize) / 2);
        else if (halign == "right")
            left = right - controlSize;

        if (valign == "middle")
            top += ((height - controlSize) / 2);
        else if (valign == "bottom")
            top = bottom - controlSize;

        this.move(left, top, controlSize, controlSize);
    };

    _pCellRadioItem._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._adjustAlign();
        this._setProperty();
    };

    _pCellRadioItem._getRadioItemValue = function ()
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var v = cellinfo._getTextValueForDisp(datarow);

        return v;
    };

    _pCellRadioItem._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();
        cellinfo._setCellChildControlProperty("radioitem", this, datarow);

        if (onlycontrolprop)
            return;

        var v = this._getRadioItemValue();
        this.set_value(v);
        this._cellobj._setAccessibilityStatChecked(!!this._p_value);
    };

    _pCellRadioItem.set_value = function (v)
    {
        this._p_value = v;
        this.on_apply_value();
    };

    _pCellRadioItem.set_codevalue = function (v)
    {
        this._p_codevalue = v;
        this.on_apply_value();
    };

    _pCellRadioItem.on_apply_value = function ()
    {
        this._changeUserStatus("selected", this._p_codevalue == this._p_value);
    };

    _pCellRadioItem._getComputedStyle = function ()
    {
        var ctrl_cs = { "styles": null };
        return ctrl_cs;
    };

    _pCellRadioItem._setComputedStyle = function (ctrl_cs)
    {
    };

    _pCellRadioItem._getCurrentStyleAlign = function (noflush)
    {
        // TODO
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    _pCellRadioItem._on_getFitSize = function (w, h)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                var icon_pos = this.iconPosition || this._getCSSStyleValue("iconPosition");
                var icon_size;
                if (w !== undefined && h !== undefined)
                {
                    icon_size = { width: w, height: h };
                }
                else
                {
                    icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, this._view ? this._view._getRefFormBaseUrl() : undefined, icon.value) || { width: 0, height: 0 };
                }

                if (icon_pos == "top" || icon_pos == "bottom")
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width);
                }
                else
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height);
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pCellRadioItem.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (!this._is_alive)
            return;

        if (this._cellobj._isFakeCell())
            return false;

        if (this._view && this._view.selectchangetype != "down")
        {
            if (nexacro._toBoolean(this._view._p_readonly) == false)
                this._itemSelect();
        }

        return this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellRadioItem.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._cellobj._isFakeCell())
            return false;

        return this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
    };

    _pCellRadioItem._itemSelect = function ()
    {
        var cellobj = this._cellobj;
        var cellinfo = this._cellinfo;
        var view = this._view;
        var datarow = cellobj._getDataRow();
        var editType = cellinfo._getEdittype(datarow);

        if (view && editType == "radioitem")
        {
            if (cellinfo.text._bindtype == 1)
            {
                view._dsEventOccured = true;
                var dataset = cellobj._getBindDataset();
                if (dataset && dataset.setColumn(datarow, cellinfo.text._bindexpr, this._p_codevalue))
                {
                    var v = cellinfo._getTextValueForDisp(datarow);
                    this.set_value(v);
                }
                view._dsEventOccured = false;
            }
        }
    };

    _pCellRadioItem.isChecked = function ()
    {
        return (this._p_codevalue == this._p_value);
    };

    _pCellRadioItem._getDisplayText = function ()
    {
        if (this._p_parent)
            return this._p_parent._getDisplayText();

        return "";
    };

    nexacro._defineProperties(_pCellRadioItem, _pCellRadioItem._properties);

    //===============================================================
    // nexacro._CellImageControl
    //===============================================================
    nexacro._CellImageControl = function (id, left, top, width, height, parent)
    {
        nexacro._ImageAreaControl.call(this, id, left, top, width, height, null, null, null, null, null, null, parent);

        this._p_tabstop = false;
        this._p_imagewidth = 0;
        this._p_imageheight = 0;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._img_elem = null;
        this._img_type = "url";
        this._p_accessibilityrole = "image";
    };

    var _pCellImage = nexacro._createPrototype(nexacro._ImageAreaControl, nexacro._CellImageControl);
    nexacro._CellImageControl.prototype = _pCellImage;

    _pCellImage._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro._ImageAreaControl.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellImage.on_destroy_contents = function ()
    {
        nexacro._ImageAreaControl.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellImage.on_apply_text = function ()
    {
        this.set_image(this._getDisplayText());
    };

    _pCellImage.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "cellimage");
    };

    _pCellImage.on_fire_user_ontouchstart = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        return this._p_parent.on_fire_user_ontouchstart(touchinfos, changedtouchinfos, this, from_refer_comp);
    };

    _pCellImage.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key, "cellimage");
    };

    _pCellImage.on_fire_onsize = function (width, height)
    {
        if (this._complete)
        {	// 동적으로 autosizing 처리 될 경우 처리하도록
            this.__apply_text();
        }
        return nexacro._ImageAreaControl.prototype.on_fire_onsize.call(this, width, height);
    };

    _pCellImage._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellImage._getDisplayText = function ()
    {
        if (this._p_parent)
            return this._p_parent._getDisplayText();

        return "";
    };

    _pCellImage._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellImage._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();

        if (!onlycontrolprop)
            this.on_apply_text();

        cellinfo._setCellChildControlProperty("image", this, datarow);
    };

    _pCellImage._adjustAlign = function (halign, valign)
    {
        if (!halign)
            halign = "center";
        if (!valign)
            valign = "middle";

        this.set_imagealign(halign + " " + valign);
        this._updateElementPositions();
    };

    _pCellImage._getComputedStyle = function ()
    {
        var ctrl_cs = { "styles": null };
        return ctrl_cs;
    };

    _pCellImage._setComputedStyle = function (ctrl_cs)
    {
    };

    _pCellImage._getCurrentStyleAlign = function (noflush)
    {
        // TODO
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    //===============================================================
    // nexacro._CellHTMLControl
    //===============================================================
    nexacro._CellHTMLControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.HTMLComponent.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);
        this._p_tabstop = false;

        this._displaymode = !!displaymode;
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };

    var _pCellHTMLControl = nexacro._createPrototype(nexacro.HTMLComponent, nexacro._CellHTMLControl);
    nexacro._CellHTMLControl.prototype = _pCellHTMLControl;

    _pCellHTMLControl._is_subcontrol = true;
    _pCellHTMLControl._p_value = undefined;

    _pCellHTMLControl.on_getIDCSSSelector = function ()
    {
        return "cellhtmlcontrol";
    };

    _pCellHTMLControl._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.HTMLComponent.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellHTMLControl.on_destroy_contents = function ()
    {
        nexacro.HTMLComponent.prototype.on_destroy_contents.call(this);
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellHTMLControl._apply_setfocus = function (evt_name)
    {
        if (!this._displaymode || this._env._p_enableaccessibility)
            return nexacro.HTMLComponent.prototype._apply_setfocus.call(this, evt_name);
    };

    _pCellHTMLControl.setOnlyElementFocus = _pCellEdit.setOnlyElementFocus;

    _pCellHTMLControl.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        nexacro.HTMLComponent.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellHTMLControl.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.HTMLComponent.prototype.on_fire_ondblclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        return true;
    };

    _pCellHTMLControl._isEnable = _pCellEdit._isEnable;

    _pCellHTMLControl._updateAll = function (onlycontents)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellHTMLControl._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo;
        var cellobj = this._cellobj;
        var datarow = cellobj._getDataRow();
        var dataset = cellinfo._getBindDataset();

        cellinfo._setCellChildControlProperty("htmlcontrol", this, datarow);

        var controlprops = cellinfo._getAttrValue(cellinfo.htmlproperties, datarow);
        var is_reload = false;

        if (controlprops)
        {
            try
            {
                controlprops = JSON.parse(controlprops);
            }
            catch (e)
            {
                trace(e);
            }

            for (var [prop, value] of Object.entries(controlprops))
            {
                if (prop == "value")    // 예약어
                    continue;

                var val = new nexacro.BindableValue();

                val._set(value);
                val = cellinfo._getAttrValue(val, datarow);
                
                if (this[prop] != val)
                {
                    this[prop] = val;
                    is_reload = true;
                }
            }
        }

        if (!onlycontrolprop)
        {
            var v;
            if (dataset && cellinfo._p_subsumtext._value != "" && dataset.getRowType(datarow) == 16)
                v = cellinfo._getAttrValue(cellinfo._p_subsumtext, datarow);
            else
                v = cellinfo._getValue(datarow, this._displaymode);
            
            if (this.value != v)
            {
                this.set_value(v);
                is_reload = false;
            }
        }

        if (is_reload)
        {
            this._reloading = true;
            this.reload();
        }
    };

    _pCellHTMLControl.on_apply_value = function (no_load)
    {
        if (this._view && this._control_element.handle && this._control_element.handle.hasChildNodes && this._control_element.handle.hasChildNodes())
        {
            var row = this.parent._rowidx;
            var cellidx = this.parent._cellidx;
            var band = "body";

            if (row == -1)
                band = "head";
            else if (row == -2)
                band = "summary";

            var retn = this._view._on_fire_onhtmlcontrolapplyvalue(this.value, band, cellidx, this.getElement().handle);

            if (this._view.onhtmlcontrolapplyvalue.defaultprevented == true)
                return retn;

            this._reloading = true;
            this.reload();

            return retn;
        }
    };

    _pCellHTMLControl.on_fire_oncontentloaded = async function (obj, enablestatus)
    {
        if (!this._reloading)
            this.on_apply_value();
        else
            this._reloading = false;
    };

    _pCellHTMLControl._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellHTMLControl._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellHTMLControl._getComputedStyle = function ()
    {
        var ctrl_cs = { "styles": null };
        return ctrl_cs;
    };

    _pCellHTMLControl._setComputedStyle = function (ctrl_cs)
    {
    };

    _pCellHTMLControl._getCurrentStyleAlign = function (noflush)
    {
        return this._cellobj._getCurrentStyleAlign(noflush);
    };

    //===============================================================
    // nexacro._CellCustomControl
    //===============================================================
    nexacro._CellCustomControl = function (id, left, top, width, height, parent, displaymode, controlmode)
    {
        nexacro.Component.call(this, id, left, top, width, height, null, null, null, null, null, null, parent, displaymode);
        this._p_tabstop = false;

        this._displaymode = !!displaymode;
        this._controlmode = (controlmode) ? true : false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._setControl();
    };

    var _pCellCustom = nexacro._createPrototype(nexacro.Component, nexacro._CellCustomControl);
    nexacro._CellCustomControl.prototype = _pCellCustom;
    _pCellCustom._is_subcontrol = true;
    _pCellCustom._is_simple_control = true;
    _pCellCustom._control = null;

    _pCellCustom._updateDisplayMode = function (mode)
    {
        this._displaymode = mode;

        var control = this._control;
        if (control.set_readonly)
            control.set_readonly(mode);
    };

    _pCellCustom.createCustomControl = function ()
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();
        var controltype = cellinfo._getAttrValue(cellinfo.customcontroltypename, datarow);

        if (!controltype)
        {
            controltype = nexacro.Component;
        }
        else
        {
            var controltype_str = controltype;
            var suffix = "Control";

            if (controltype_str.endsWith(suffix))
            {
                controltype = (new Function("return " + controltype_str + "? " + controltype_str + " : null")).call(this);

                if (controltype == null)
                {
                    controltype_str = controltype_str.slice(0, -suffix.length);
                    controltype = (new Function("return " + controltype_str + "? " + controltype_str + " : null")).call(this);

                    if (controltype == null)
                        controltype = nexacro.Component;
                }
            }
            else
            {
                controltype = nexacro.Component;
            }
        }

        var controlid = cellinfo._getAttrValue(cellinfo.customcontrolid, datarow);

        if (!controlid)
            controlid = "custom";

        var controlevts = cellinfo._getAttrValue(cellinfo.customcontrolevents, datarow);
        var control = this._control = new controltype(controlid, this.left, this.top, this.width, this.height, null, null, null, null, null, null, this.parent);

        if (this._displaymode && control.set_readonly)
        {
            if (!cellinfo._isDisplayEditOnlyOneControl(datarow))
                control.set_readonly(true);
        }

        control._setAccessibilityInputLabel = nexacro._emptyFn;

        if (!control._is_subcontrol)
            control._setControl();

        control._linked_interface = this;
        control._use_subcontrol_tabkey = true;

        if (controlevts)
        {
            var evtnames = controlevts.split(",");

            for (var i = 0; i < evtnames.length; i++)
            {
                control._setEventHandler(evtnames[i], this.on_fire_oncustomcontrolevent, this);
            }
        }

        control.applyto_bindSource = function (propid, Val)
        {
            if (this._view && this._view._dsEventOccured)
                return true;

            return this._linked_interface._controlApplyBindSource(propid, Val);
        };

        control.on_fire_org_onclick = control.on_fire_onclick;
        control.on_fire_org_ondblclick = control.on_fire_ondblclick;

        control.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
        {
            if (!this._is_alive)
                return;

            this.on_fire_org_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

            if (this._linked_interface._cellobj._isFakeCell())
                return false;

            return this._linked_interface._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        };

        control.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
        {
            if (!this._is_alive)
                return;

            this.on_fire_org_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

            if (this._linked_interface._cellobj._isFakeCell())
                return false;

            return this._linked_interface._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, "control");
        };

        /*
        control.on_fire_oninput = function ()
        {
            if (this._linked_interface._cellobj._isFakeCell())
                return false;

            return this._linked_interface._cellobj.on_fire_oninput(this);
        };
        */
        this._control_element.createCommandStart = function () { return " " };
        this._control_element.createCommandEnd = function () { return " " };

        control.createComponent();
    };

    /* initvalue 필요시 해제
    _pCellCustom._set_initvalueid = function ()
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();
        var controlprops = this._getInitValueProps(datarow);

        for (var [prop, value] of Object.entries(controlprops))
        {
            var val = new nexacro.BindableValue();

            val._set(value);
            val = cellinfo._getAttrValue(val, datarow);

            this._no_bindsource = true;
            if (this._control[`set_${prop}`])
                this._control[`set_${prop}`](val);
            this._no_bindsource = undefined;
        }
    };

    _pCellCustom._getInitValueProps = function (datarow)
    {
        var typename = this._control._type_name;
        var cellinfo = this.parent._refinfo;
        var initvalueid = cellinfo._getAttrValue(cellinfo.customcontrolinitvalueid, datarow);

        const fn = typename + initvalueid;
        const nexacro_init = nexacro.getNexacro_init();
        var controlbindprops = {};

        if (nexacro_init[fn])
        {
            var func_str = nexacro_init[fn].toString();
            const fullCalls = func_str.match(/obj\.set_\w+\(.*?\);/gs) || [];

            for (const call of fullCalls)
            {
                const [_, methodNameWithSet, argPart] = call.match(/(set_\w+)\s*(\((?:.|\n)*\));?/) || [];

                if (!methodNameWithSet || !argPart) continue;

                const prop = methodNameWithSet.replace(/^set_/, "");
                const argMatch = argPart.match(/^[(]\s*(['"])((?:\\.|[^\\])*?)\1\s*[)]$/s);
                if (!argMatch) continue;

                const value = argMatch[2];
                const unescaped_value = value.replace(/\\(["'\\])/g, "$1");

                controlbindprops[prop] = unescaped_value;
            }
        }

        return controlbindprops;
    };
    */

    _pCellCustom._getBindWritablePropInfos = function (datarow)
    {
        var bindproperties = null;
        var controlbindprops = null;
        var cellinfo = this.parent._refinfo;
        /* initvalue 필요시 해제
        controlbindprops = this._getInitValueProps(datarow);

        if (controlbindprops)
        {
            var bind_values = this._control.on_getBindableProperties();
            if (bind_values)
            {
                if (typeof (bind_values) == "string")
                    bind_values = [bind_values];

                for (var i = 0; i < bind_values.length; i++)
                {
                    if (controlbindprops[bind_values[i]])
                    {
                        var val = new nexacro.BindableValue();

                        val._set(controlbindprops[bind_values[i]]);
                        if (val._bindtype == 1)
                        {
                            if (!bindproperties)
                                bindproperties = {};

                            bindproperties[bind_values[i]] = val._bindexpr;
                        }
                    }
                }
            }
        }
        */
        controlbindprops = cellinfo._getAttrValue(cellinfo.customcontrolproperties, datarow);

        if (controlbindprops)
        {
            try
            {
                controlbindprops = JSON.parse(controlbindprops);
            }
            catch (e)
            {
                trace(e);
            };

            var bind_values = this._control.on_getBindableProperties();
            if (bind_values)
            {
                if (typeof (bind_values) == "string")
                    bind_values = [bind_values];

                for (var i = 0; i < bind_values.length; i++)
                {
                    if (controlbindprops[bind_values[i]])
                    {
                        var val = new nexacro.BindableValue();

                        val._set(controlbindprops[bind_values[i]]);
                        if (val._bindtype == 1)
                        {
                            if (!bindproperties)
                                bindproperties = {};

                            bindproperties[bind_values[i]] = val._bindexpr;
                        }
                    }
                }
            }
        }
        return bindproperties;
    };

    _pCellCustom.setFocus = function (bResetScroll, bInnerFocus)
    {
        this._control.setFocus(bResetScroll, bInnerFocus);
    };

    _pCellCustom._setFocus = function (bResetScroll, bInnerFocus)
    {
        return this._control.setFocus(bResetScroll, bInnerFocus);
    };

    _pCellCustom._setFocus = function (bResetScroll, calledby, block_inner_focus)
    {
        return this._control._setFocus(bResetScroll, calledby, block_inner_focus);
    };

    _pCellCustom._apply_setfocus = function (evt_name)
    {
        if (!this._displaymode || this._env._p_enableaccessibility)
            return this._control._apply_setfocus(evt_name);
    };

    _pCellCustom._changeStatus = function (status, value)
    {
        return this._control._changeStatus(status, value);
    };

    _pCellCustom._changeUserStatus = function (changestatus, value)
    {
        return this._control._changeUserStatus(changestatus, value);
    };

    _pCellCustom.set_visible = function (v)
    {
        this._control.set_visible(v);
    };

    _pCellCustom._controlApplyBindSource = function (propid, value)
    {
        if (this._no_bindsource)
            return true;

        var view = this._view;
        var retn = true;
        var cellinfo = this.parent._refinfo;
        var datarow = this.parent._getDataRow();
        var edittype = cellinfo._getEdittype(datarow);
        

        if (edittype == "customcontrol" && this._displaymode == false)
        {
            var controlbindprops = this._getBindWritablePropInfos(datarow);
            if (controlbindprops)
            {
                if (datarow >= 0)
                {
                    var dataset = this._cellobj._getBindDataset();
                    var datarow = this._cellobj._getDataRow();
                    var colid = controlbindprops[propid];

                    view._dsEventOccured = true;

                    var fail = { status: "" };
                    dataset.setColumn(datarow, colid, value, fail);

                    if (fail.status == "cancolumnchange")
                        retn = false;

                    view._dsEventOccured = false;
                }
            }
            else if (propid == "value")
            {
                return this._setValueDataset(value);
            }
        }
        else
        {
            retn = false;
        }
        return retn;
    };

    _pCellCustom.on_fire_oncustomcontrolevent = function (obj, e)
    {
        if (this._view && this._view.on_fire_oncellcustomcontrolevent)
            return this._view.on_fire_oncellcustomcontrolevent(obj, e);
    };

    _pCellCustom.on_create_contents = function ()
    {
        this.createCustomControl();
    };

    _pCellCustom.on_created = function (_window)
    {
        this._control.on_created(_window);
    };

    _pCellCustom._createdControlElement = function (window)
    {
        return null;
    };

    _pCellCustom.on_create_contents_command = function ()
    {
        var command = "";
        var control = this._control;
        if (control)
        {
            command += control.createCommand();
        }
        return command;
    };

    _pCellCustom.on_attach_contents_handle = function (win)
    {
        var control = this._control;
        if (control)
        {
            control.attachHandle(win);
        }
    };

    _pCellCustom.on_destroy_contents = function ()
    {
        this._control.destroy();
        this._control = null;
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellCustom.on_change_containerRect = function (width, height)
    {
        if (this._control)
            this._control.move(this.left, this.top, this.width, this.height);
    };

    _pCellCustom._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellCustom._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (breadonly !== undefined)
        {
            if (this.on_apply_readonly)
            {
                if (this._is_created)
                    this.on_apply_readonly(breadonly);
            }
            else
            {
                this._changeStatus("readonly", breadonly);
            }
        }
        if (!onlycontents)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        this._setProperty();
    };

    _pCellCustom._getValueData = function ()
    {
        return this._p_value;
    };

    _pCellCustom._setProperty = function (onlycontrolprop)
    {
        var cellinfo = this._cellinfo,
            cellobj = this._cellobj;

        var datarow = cellobj._getDataRow();

        // this._set_initvalueid();

        var controlprops = cellinfo._getAttrValue(cellinfo.customcontrolproperties, datarow);

        if (controlprops)
        {
            try
            {
                controlprops = JSON.parse(controlprops);
            }
            catch (e)
            {
                trace(e);
            }

            for (var [prop, value] of Object.entries(controlprops))
            {
                var val = new nexacro.BindableValue();

                val._set(value);
                val = cellinfo._getAttrValue(val, datarow);

                this._no_bindsource = true;
                if (this._control[`set_${prop}`])
                    this._control[`set_${prop}`](val);
                this._no_bindsource = undefined;
            }
        }

        if (onlycontrolprop)
            return;

        var controlbindprops = this._getBindWritablePropInfos(datarow);
        if (!controlbindprops)
        {
            var bind_value = this._control.on_getBindableProperties();
            if (bind_value && typeof (bind_value) == "string")  // only single prop
            {
                var v = cellinfo._getValue(datarow);

                this._no_bindsource = true;
                if (this._control[`set_${bind_value}`])
                    this._control[`set_${bind_value}`](v);
                this._no_bindsource = undefined;
            }
        }
    };

    _pCellCustom._selectDataset = function (bInit)
    {
        if (this._displaymode)
            return this._innerdataset;

        return nexacro.Component.prototype._selectDataset.call(this, bInit);
    };

    _pCellCustom.on_apply_text = function (text)
    {
        if (this._displaymode == true)
        {
            if (!nexacro._isNull(this._p_value))
            {
                var cellinfo = this._cellinfo,
                    cellobj = this._cellobj;

                var datarow = cellobj._getDataRow();

                var v = cellinfo._getAttrValue(cellinfo._p_combodisplaynulltype, datarow);
                if (v == "nulltext")
                {
                    if (this.index < 0)   // value가 있어도 선택된 아이템이 존재하지 않는다면..
                        this._setEditValue(undefined);
                    else
                        this._setEditValue(text);
                }
            }
            else
            {
                if (this.displaynulltext || text == "")
                    this._setEditValue(undefined);
                else
                    this._setEditValue(text);
            }
        }
        else
        {
            return nexacro.Component.prototype.on_apply_text.call(this, text);
        }
    };

    _pCellCustom._EditUpdateAll = function ()
    {
        this._updateAll();
    };

    _pCellCustom._getEditingText = function ()
    {
        return this.comboedit.text;
    };

    _pCellCustom._getEditingValue = function ()
    {
        return this.comboedit._p_value;
    };

    _pCellCustom._isUsingCustomKeyAction = function ()
    {
        // todo : want key
        return false;
    };

    _pCellCustom._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Component.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellCustom._getComputedStyle = function ()
    {
        if (!nexacro._getComputedStyleProperties)
            return;

        var properties = this._control._computed_prop_list;
        properties = properties.toString();

        var ctrl_cs = {
            "styles": null,
            "comboedit": { styles: null },
            "dropbutton": { styles: null },
        };

        var str = nexacro._getComputedStyleProperties(this._control._control_element, properties, null, true);
        ctrl_cs.styles = (new Function("return " + str))();

        return ctrl_cs;
    };

    _pCellCustom._setComputedStyle = function (ctrl_cs)
    {
        var properties = this._control._computed_prop_list;

        for (var i = 0; i < properties.length; i++)
        {
            var prop_name = properties[i];
            var func_name = "set_" + prop_name;

            if (ctrl_cs.styles)
            {
                if (this._control[func_name])
                    this._control[func_name].call(this._control, ctrl_cs.styles[prop_name]);
            }
        }
    };

    _pCellCustom._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };
        return align;
    };

    _pCellCustom._setAccessibilityInputLabel = nexacro._emptyFn;

    _pCellCustom._isReadOnly = function ()
    {
        return this._view._p_readonly;
    };



    //===============================================================
    // nexacro._CellTreeControl
    //===============================================================
    nexacro._CellTreeControl = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);
        this._p_tabstop = false;
        this._view = parent._view;
        this._cellinfo = parent._refinfo;
        this._cellobj = parent;
        this._leftline_ctrls = [];
        this._btnimg_ctrl = null;
        this._chk_ctrl = null;
        this._img_ctrl = null;
        this._text_ctrl = null;
        this._displaytext = "";
        this._upline_ctrl = null;
        this._downline_ctrl = null;
        this._clicktarget = null;
        this._checkboxObj = "_CellCheckboxControlBase";
    };

    var _pCellTree = nexacro._createPrototype(nexacro.Component, nexacro._CellTreeControl);
    nexacro._CellTreeControl.prototype = _pCellTree;
    _pCellTree._is_subcontrol = true;
    _pCellTree._type_name = "CellTreeItemControl";

    _pCellTree._apply_setfocus = function (evt_name)
    {

    };

    _pCellTree._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var retn = nexacro.Component.prototype._getDlgCode.call(this, keycode, altKey, ctrlKey, shiftKey);
        retn.want_tab = (this._view ? this._view._acceptstab : retn.want_tab);

        return retn;
    };

    _pCellTree.on_create_contents = function ()
    {
        this._createLines(true);
        this._createCheckbox(true);
        this._createImage(true);
        this._createButton(true);
        this._createText(true);
    };

    _pCellTree._createLines = function (bCreateOnly)
    {
        if (!this._view || !this._view.treeuseline)
            return;

        if (!this._rightline_ctrl)
        {
            this._rightline_ctrl = new nexacro._CellTreeLineControl("treerightline", 0, 0, 0, 0, null, null, this._p_parent);
            this._childctrl_setevent(this._rightline_ctrl);
            this._rightline_ctrl.createComponent(bCreateOnly);
        }
        if (!this._upline_ctrl)
        {
            this._upline_ctrl = new nexacro._CellTreeLineControl("treeupline", 0, 0, 0, 0, null, null, this._p_parent);
            this._childctrl_setevent(this._upline_ctrl);
            this._upline_ctrl.createComponent(bCreateOnly);
        }
        if (!this._downline_ctrl)
        {
            this._downline_ctrl = new nexacro._CellTreeLineControl("treedownline", 0, 0, 0, 0, null, null, this._p_parent);
            this._childctrl_setevent(this._downline_ctrl);
            this._downline_ctrl.createComponent(bCreateOnly);
        }
    };

    _pCellTree._createCheckbox = function (bCreateOnly)
    {
        if (!this._view && !this._view.treeusecheckbox)
            return;

        if (!this._chk_ctrl)
        {
            this._chk_ctrl = new nexacro[this._checkboxObj]("treeitemcheckbox", 0, 0, 0, 0, this);
            this._childctrl_setevent(this._chk_ctrl);
            this._chk_ctrl._getCheckValue = function ()
            {
                var cellinfo = this._cellinfo;
                var cellobj = this._cellobj;
                var datarow = cellobj._getDataRow();

                if (cellinfo.treecheck._bindtype > 0)
                    return cellinfo._getAttrValue(cellinfo._p_treecheck, datarow);
                else
                    return this._view._treeChecked[datarow];
            };
            if (this._env._p_enableaccessibility)
                this._chk_ctrl.accessibilityenable = false;
            this._chk_ctrl.createComponent(bCreateOnly);
        }
    };

    _pCellTree._createImage = function (bCreateOnly)
    {
        if (!this._view || !this._view.treeuseimage)
            return;

        if (!this._img_ctrl)
        {
            this._img_ctrl = new nexacro._TreeItemIconControl("treeitemimage", 0, 0, 0, 0, null, null, this);
            this._childctrl_setevent(this._img_ctrl);

            if (this._env._p_enableaccessibility)
                this._img_ctrl.accessibilityenable = false;

            this._img_ctrl.createComponent(bCreateOnly);
        }
    };

    _pCellTree._createButton = function (bCreateOnly)
    {
        // button은 size계산 때문에 use체크 생략.
        this._btnimg_ctrl = new nexacro._TreeItemIconControl("treeitembutton", 0, 0, 0, 0, null, null, this);
        this._childctrl_setevent(this._btnimg_ctrl);

        if (this._env._p_enableaccessibility)
            this._btnimg_ctrl.accessibilityenable = false;

        this._btnimg_ctrl.createComponent(bCreateOnly);
    };

    _pCellTree._createText = function (bCreateOnly)
    {
        this._text_ctrl = new nexacro._TreeItemTextControl("treeitemtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._text_ctrl._setControl();
        this._childctrl_setevent(this._text_ctrl);
        this._text_ctrl.createComponent(bCreateOnly);
    };

    _pCellTree._childctrl_setevent = function (obj)
    {
        obj.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
        {
            var clickitem = this.id;

            if (clickitem == "treeitemtext" || clickitem == "treeitemimage")
                clickitem = "";

            return this._p_parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem);
        };

        obj.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
        {
            var clickitem = this.id;

            if (clickitem == "treeitemtext" || clickitem == "treeitemimage")
                clickitem = "";

            return this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem);
        };

        obj._on_last_lbuttonup = function ()
        {
            return this._p_parent._on_last_lbuttonup();
        };
    };

    _pCellTree.on_created_contents = function (win)
    {
        var leftlines = this._leftline_ctrls;

        for (var i = 0, n = leftlines.length; i < n; i++)
            leftlines[i].on_created(win);

        if (this._rightline_ctrl)
            this._rightline_ctrl.on_created(win);

        if (this._upline_ctrl)
            this._upline_ctrl.on_created(win);

        if (this._downline_ctrl)
            this._downline_ctrl.on_created(win);

        if (this._btnimg_ctrl)
            this._btnimg_ctrl.on_created(win);

        if (this._chk_ctrl)
            this._chk_ctrl.on_created(win);

        if (this._img_ctrl)
            this._img_ctrl.on_created(win);

        if (this._text_ctrl)
            this._text_ctrl.on_created(win);

        this._on_created_accessibility_contents(win); // command와 create 동일 처리

        this._is_created = true;
    };

    _pCellTree.on_attach_contents_handle = _pCellTree.on_created_contents;

    _pCellTree.on_destroy_contents = function ()
    {
        var leftlines = this._leftline_ctrls;

        for (var i = 0, n = leftlines.length; i < n; i++)
            leftlines[i].destroy();

        this._leftline_ctrls = null;

        if (this._rightline_ctrl)
        {
            this._rightline_ctrl.destroy();
            this._rightline_ctrl = null;
        }
        if (this._upline_ctrl)
        {
            this._upline_ctrl.destroy();
            this._upline_ctrl = null;
        }
        if (this._downline_ctrl)
        {
            this._downline_ctrl.destroy();
            this._downline_ctrl = null;
        }
        if (this._btnimg_ctrl)
        {
            this._btnimg_ctrl.destroy();
            this._btnimg_ctrl = null;
        }
        if (this._chk_ctrl)
        {
            this._chk_ctrl.destroy();
            this._chk_ctrl = null;
        }
        if (this._img_ctrl)
        {
            this._img_ctrl.destroy();
            this._img_ctrl = null;
        }
        if (this._text_ctrl)
        {
            this._text_ctrl.destroy();
            this._text_ctrl = null;
        }

        this._clicktarget = null;
        this._view = null;
        this._cellinfo = null;
        this._cellobj = null;
    };

    _pCellTree.on_apply_text = function ()
    {
        var text_ctrl = this._text_ctrl;

        if (text_ctrl)
            text_ctrl.set_text(this._displaytext);
    };

    _pCellTree.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        return this._cellobj.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem);
    };

    _pCellTree.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        return this._cellobj.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem);
    };

    _pCellTree._isEditTypeTree = function ()
    {
        var cellobj = this._cellobj;
        var cellinfo = this._cellinfo;
        var datarow = cellobj._getDataRow();
        var editType = cellinfo._getEdittype(datarow);

        return (editType == "tree" || editType == "rowgroup");
    };

    _pCellTree._getLineHeight = function ()
    {
        var height = this._p_parent._adjust_height;
        var border = this._p_parent._getCurrentStyleBorder();
        var bordbottom = (border) ? border.bottom._width : 0;
        return height - bordbottom;
    };

    _pCellTree._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellTree._load_image = function (img_ctrl, image)
    {
        var val = (image) ? image.toString() : null;

        if (this._control_element && val)
        {
            if (val != "none")
            {
                val = nexacro._getURIValue(val);
                val = nexacro._getImageLocation(val, this._getRefFormBaseUrl());
                img_ctrl._load_url = val;

                var size = nexacro._getImageSize(val, this._on_loadImage, this, this._getRefFormBaseUrl(), image.value);

                if (size)
                    this._on_loadImage(val, size.width, size.height);
            }
        }
    };

    _pCellTree._on_loadImage = function (url, imgW, imgH)
    {
        var adjust = false;
        var width, height;
        if (this._btnimg_ctrl && this._btnimg_ctrl._load_url == url)
        {
            width = this._btnimg_ctrl._adjust_width;
            height = this._btnimg_ctrl._adjust_height;

            if (width != imgW || height != imgH)
            {
                adjust = true;
                this._btnimg_ctrl.move(this._btnimg_ctrl._adjust_left, this._btnimg_ctrl._adjust_top, imgW, imgH);
            }
        }

        if (this._img_ctrl && this._img_ctrl._load_url == url)
        {
            width = this._img_ctrl._adjust_width;
            height = this._img_ctrl._adjust_height;

            if (width != imgW || height != imgH)
            {
                adjust = true;
                this._img_ctrl.move(this._img_ctrl._adjust_left, this._img_ctrl._adjust_top, imgW, imgH);
            }
        }

        if (adjust)
            this._adjustSubCompAlign(this._lvl);
    };

    _pCellTree._changeTreeStatus = function (changestatus, value)
    {
        this._userstatus = changestatus;

        if (this._img_ctrl)
            this._img_ctrl._changeUserStatus(changestatus, value);

        if (changestatus != "leaf" && this._btnimg_ctrl)
            this._btnimg_ctrl._changeUserStatus(changestatus, value);
    };

    _pCellTree._buttonUpdate = function (state)
    {
        var view = this._view;
        if (view && view.treeusebutton != this._treeusebutton)
        {
            if (view.treeusebutton == "use")
                this._btnimg_ctrl.set_visible(true);
            else
                this._btnimg_ctrl.set_visible(false);

            this._treeusebutton = view.treeusebutton;
        }

        // var datarow = this._cellobj._getDataRow();
        var val;

        if (state == 2 || state == 3 || state == -1)
        {
            val = this._btnimg_ctrl._getCSSStyleValue("icon", "expand");

            this._load_image(this._btnimg_ctrl, val);
            this._btnimg_ctrl.set_visible(false);
            this._btnimg_ctrl._tmpw = this._btnimg_ctrl.width;
            this._btnimg_ctrl._tmph = this._btnimg_ctrl.height;
            this._btnimg_ctrl.move(this._btnimg_ctrl._adjust_left, this._btnimg_ctrl._adjust_top, 0, 0); // adjust에서 visible 체크를 하면 안되므로 사이즈 조절해줌. cmc 14/7/9
        }
        else
        {
            val = this._btnimg_ctrl._getCSSStyleValue("icon", this._userstatus);
            this._load_image(this._btnimg_ctrl, val);
        }
    };

    _pCellTree._checkUpdate = function (check)
    {
        var view = this._view;
        if (view && view.treeusecheckbox != this._treeusecheckbox)
        {
            if (this._chk_ctrl)
                this._chk_ctrl.set_visible(view.treeusecheckbox);
            else
                this._createCheckbox();

            this._treeusecheckbox = view.treeusecheckbox;
        }

        if (this._chk_ctrl)
        {
            if (view)
                this._chk_ctrl._changeStatus("readonly", view._p_readonly);

            var w = this._chk_ctrl.width;
            var h = this._chk_ctrl.height;
            this._chk_ctrl.set_value(check);
            this._chk_ctrl._adjustAlign("center", "middle", w, h);
        }
        this._adjustSubCompAlign(this._lvl);
    };

    _pCellTree._imageUpdate = function (state)
    {
        var view = this._view;
        if (view && view.treeuseimage != this._treeuseimage)
        {
            if (this._img_ctrl)
                this._img_ctrl.set_visible(view.treeuseimage);
            else
                this._createImage();

            this._treeuseimage = view.treeuseimage;
        }

        if (this._img_ctrl)
        {
            var val = this._img_ctrl._getCSSStyleValue("icon", this._userstatus);

            this._load_image(this._img_ctrl, val);

            if (val && val != "none")
                this._img_ctrl.set_visible(view ? view.treeuseimage : true);
            else
                this._img_ctrl.set_visible(false);
        }

        this._adjustSubCompAlign(this._lvl);
    };

    _pCellTree._lineUpdate = function (rowidx, level)
    {
        var view = this._view;

        if (view && view.treeuseline != this._treeuseline)
        {
            this._createLines();

            if (this._rightline_ctrl)
                this._rightline_ctrl.set_visible(view.treeuseline);

            if (this._upline_ctrl)
                this._upline_ctrl.set_visible(view.treeuseline);

            if (this._downline_ctrl)
                this._downline_ctrl.set_visible(view.treeuseline);

            this._treeuseline = view.treeuseline;
        }

        var startlevel = this._cellinfo._getTreeStartLevel(rowidx);
        var bExistNextNode = (view && view._hasSameNextNode[rowidx]) ? view._hasSameNextNode[rowidx][1] : false;    // fakecell인 경우 rowidx -9
        var bRootNode = (startlevel >= level) ? true : false;

        this._createLeftLine(rowidx);
        var ctrl;

        if (this._rightline_ctrl)
        {
            ctrl = this._rightline_ctrl;
            ctrl._set_line(false, true);
        }
        if (this._upline_ctrl)
        {
            ctrl = this._upline_ctrl;
            ctrl._set_line(!bRootNode, false);
        }

        if (this._downline_ctrl && !bRootNode && bExistNextNode)
        {
            ctrl = this._downline_ctrl;
            ctrl._set_line(true, false);
        }
        else if (this._downline_ctrl)
        {
            this._downline_ctrl.set_visible(false);
        }

        this._treeline_visible(!this._cellobj._hideInner);
    };

    _pCellTree._createLeftLine = function (rowidx)
    {
        var view = this._view;
        var i;

        if (!view || !view.treeuseline)
        {
            var n = this._leftline_ctrls.length;
            for (i = 0; i < n; i++)
            {
                this._leftline_ctrls[i].destroy();
            }
            this._leftline_ctrls = [];

            return;
        }

        var level = this._cellinfo._getTreeLevel(rowidx);
        // var startlevel = this._cellinfo._getTreeStartLevel(rowidx);
        var parentlevel = level - 1;
        var bExistNextParentNode;
        i = 0;
        var leftlines = this._leftline_ctrls;

        while (view._rootlevel < parentlevel)
        {
            bExistNextParentNode = this.__isNextSameLevelInSameParent(parentlevel, rowidx);

            if (bExistNextParentNode)
            {
                var parentheight = this._getLineHeight();
                var ctrl = leftlines[i];

                if (!ctrl)
                {
                    ctrl = new nexacro._CellTreeLineControl("treeleftline", 0, 0, 1, parentheight, null, null, this._p_parent);
                    ctrl.createComponent();
                    this._leftline_ctrls[i] = ctrl;
                }
                else
                {
                    ctrl.set_height(parentheight);
                }

                ctrl._set_line(true, false);
                ctrl._depth = parentlevel;
                i++;
            }
            parentlevel--;
        }

        while (leftlines.length > i)
        {
            leftlines[leftlines.length - 1].destroy();
            leftlines.splice(leftlines.length - 1, 1);
        }
    };

    _pCellTree._toggleItem = function (bHide, state)
    {
        var view = this._view;

        if (!view || bHide)
        {
            if (this._btnimg_ctrl)
                this._btnimg_ctrl.set_visible(false);
            if (this._rightline_ctrl)
                this._rightline_ctrl.set_visible(false);
            if (this._upline_ctrl)
                this._upline_ctrl.set_visible(false);
            if (this._downline_ctrl)
                this._downline_ctrl.set_visible(false);
            if (this._chk_ctrl)
                this._chk_ctrl.set_visible(false);
            if (this._img_ctrl)
                this._img_ctrl.set_visible(false);
            if (this._text_ctrl)
                this._text_ctrl.set_visible(false);
        }
        else
        {
            if (view.treeusebutton == "use")
                this._btnimg_ctrl.set_visible(true);
            else
                this._btnimg_ctrl.set_visible(false);

            if (state == 2 || state == 3 || state == -1)
            {
                this._btnimg_ctrl.set_visible(false);
                this._btnimg_ctrl.move(this._btnimg_ctrl._adjust_left, this._btnimg_ctrl._adjust_top, 0, 0); // adjust에서 visible 체크를 하면 안되므로 사이즈 조절해줌. cmc 14/7/9
            }

            if (this._rightline_ctrl)
                this._rightline_ctrl.set_visible(view.treeuseline);
            if (this._upline_ctrl)
                this._upline_ctrl.set_visible(view.treeuseline);
            if (this._downline_ctrl)
                this._downline_ctrl.set_visible(view.treeuseline);
            if (this._chk_ctrl)
                this._chk_ctrl.set_visible(view.treeusecheckbox);
            if (this._img_ctrl)
                this._img_ctrl.set_visible(view.treeuseimage);
            if (this._text_ctrl)
                this._text_ctrl.set_visible(true);
        }
    };

    _pCellTree.on_apply_prop_tooltip = function ()
    {
        var datarow = this._cellobj._getDataRow();

        this._p_tooltiptext = this._cellinfo._getTooltipText(datarow);
        this._p_tooltiptype = this._cellinfo._p_tooltiptype;

        nexacro.Component.prototype.on_apply_prop_tooltip.call(this);

    };

    _pCellTree._treeline_visible = function (v)
    {
        var i;
        var n = this._leftline_ctrls.length;
        if (v)
        {
            for (i = 0; i < n; i++)
                this._leftline_ctrls[i]._control_element.setElementVisible(this._leftline_ctrls[i]._p_visible);

            if (this._rightline_ctrl)
                this._rightline_ctrl._control_element.setElementVisible(this._rightline_ctrl._p_visible);
            if (this._upline_ctrl)
                this._upline_ctrl._control_element.setElementVisible(this._upline_ctrl._p_visible);
            if (this._downline_ctrl)
                this._downline_ctrl._control_element.setElementVisible(this._downline_ctrl._p_visible);
        }
        else
        {
            for (i = 0; i < n; i++)
                this._leftline_ctrls[i]._control_element.setElementVisible(false);

            if (this._rightline_ctrl)
                this._rightline_ctrl._control_element.setElementVisible(false);
            if (this._upline_ctrl)
                this._upline_ctrl._control_element.setElementVisible(false);
            if (this._downline_ctrl)
                this._downline_ctrl._control_element.setElementVisible(false);
        }
    };

    _pCellTree.on_apply_prop_cssclass = function ()
    {
        if (this._chk_ctrl)
            this._chk_ctrl.on_apply_cssclass();
        if (this._img_ctrl)
            this._img_ctrl.on_apply_cssclass();
        if (this._text_ctrl)
            this._text_ctrl.on_apply_cssclass();
        if (this._btnimg_ctrl)
            this._btnimg_ctrl.on_apply_cssclass();

    };

    _pCellTree.on_apply_prop_enable = function (v)
    {
        if (this._chk_ctrl)
            this._chk_ctrl._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        if (this._img_ctrl)
            this._img_ctrl._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        if (this._text_ctrl)
            this._text_ctrl._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        if (this._btnimg_ctrl)
            this._btnimg_ctrl._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
    };

    _pCellTree.on_apply_prop_rtl = function ()
    {
        nexacro.Component.prototype.on_apply_prop_rtl.call(this);

        if (this._chk_ctrl)
            this._chk_ctrl.on_apply_prop_rtl();
        if (this._img_ctrl)
            this._img_ctrl.on_apply_prop_rtl();
        if (this._text_ctrl)
            this._text_ctrl.on_apply_prop_rtl();
        if (this._btnimg_ctrl)
            this._btnimg_ctrl.on_apply_prop_rtl();
    };

    _pCellTree._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (this._control_element)
        {
            var view = this._view;
            var cellobj = this._cellobj;
            var rowidx = cellobj._getDataRow();

            if (breadonly !== undefined)
            {
                if (this.on_apply_readonly)
                {
                    this.on_apply_readonly(breadonly);
                }
                else
                {
                    this._changeStatus("readonly", breadonly);
                }
            }

            var stats = 1;
            var check = 0;
            var level = 0;

            if (view && !cellobj._isFakeCell())
            {
                stats = view._getTreeStats(rowidx);
                check = view._getTreeCheck(rowidx);
                level = view._getTreeLevel ? view._getTreeLevel(rowidx) : this._cellinfo._getTreeLevel(rowidx);
            }

            if (rowidx == null || rowidx == -9)
            {
                this._toggleItem(true, stats);
                return;
            }
            else
            {
                this._toggleItem(false, stats);
            }

            if (!onlycontents)
                this._apply_status(cellobj._oldstatus, cellobj._status, cellobj._olduserstatus, cellobj._userstatus);

            this._lvl = level;

            if (stats == 0)
                this._changeTreeStatus("collapse", true);
            else if (stats == 1)
                this._changeTreeStatus("expand", true);
            else if (stats >= 2)
                this._changeTreeStatus("leaf", true);

            this._buttonUpdate(stats);
            this._lineUpdate(rowidx, level);
            this._checkUpdate(check);
            this._imageUpdate(stats);

            var txt = this._p_parent._getDisplayText();
            if (this._displaytext != txt)
            {
                if (this._text_ctrl)
                    this._text_ctrl.set_text(txt);

                this._displaytext = txt;
            }

            this.on_apply_prop_tooltip();
            this._adjustSubCompAlign(level);
        }
    };

    _pCellTree._getCurrentStyleAlign = function (noflush)
    {
        var align = { textAlign: "center", verticalAlign: "middle" };

        if (this._text_ctrl && this._text_ctrl._cell_elem)
            align = this._text_ctrl._cell_elem._getComputedStyleAlign(noflush);

        return align;
    };

    _pCellTree._adjustSubCompAlign = function (level)
    {
        // 여기가 수정되면 _pGrid._getDepthWidth도 동일한 처리가 필요합니다.

        var cellobj = this._p_parent;
        var cellinfo = this._cellinfo;
        var rect = cellobj._getControlRect();

        var width = rect.width;
        var height = rect.height;
        var datarow = cellobj._getDataRow();
        var start = cellinfo._getTreeStartLevel(datarow);
        var defaultsize = 9;
        var gap = 16;   //defaultsize;
        var parentlevel = level - 1;

        level -= start;

        if (level < 0)
            level = 0;

        var padding = cellobj._getCurrentStylePadding();
        var line_adjust_top = cellobj._adjust_top;
        var line_adjust_left = ((padding) ? padding.left : 0);
        var parentheight = this._getLineHeight();
        var offset = (level * gap) + defaultsize;
        var lineleft = offset;
        var linetop = line_adjust_top;
        var linewidth = 0;
        var halfheight = (parentheight / 2);
        var lineheight = halfheight;
        var left_lines = this._leftline_ctrls;
        var left_lines_len = left_lines.length;
        var j = 0;
        var elem;

        for (var i = 0; j < left_lines_len; i++)
        {
            if (parentlevel == left_lines[j]._depth)
            {
                elem = left_lines[j++]._control_element;
                elem.setElementPosition(offset - (gap * (i + 1)) + line_adjust_left, linetop);
            }

            if (parentlevel-- < 0)
                break;
        }

        var line_button_gap_width = 0;
        var line_button_gap_height = 0;

        if (this._btnimg_ctrl)
        {
            var buttonWidth = this._btnimg_ctrl.width;

            if (buttonWidth <= 0 && this._btnimg_ctrl._tmpw)
                buttonWidth = this._btnimg_ctrl._tmpw;

            var buttonHeight = this._btnimg_ctrl.height;

            if (buttonHeight <= 0 && this._btnimg_ctrl._tmph)
                buttonHeight = this._btnimg_ctrl._tmph;

            var buttonLeft = offset - (buttonWidth / 2);

            if (buttonLeft < 0)
            {
                buttonLeft = offset - (defaultsize / 2);
            }

            if (!this._rightline_ctrl || !this._rightline_ctrl._p_visible)
            {
                buttonLeft -= ((buttonWidth / 2) * level);
            }

            var buttonTop = ((height - buttonHeight) / 2);

            if (this._btnimg_ctrl._p_visible)
            {
                lineheight = ((parentheight - buttonHeight) / 2);
                line_button_gap_width = buttonWidth;
                line_button_gap_height = buttonHeight;
                offset = buttonLeft + buttonWidth;
            }
            else
            {
                if (!this._view.treeuseline)
                {
                    offset = buttonLeft + buttonWidth;
                }
            }

            linewidth = buttonWidth;
            this._btnimg_ctrl.move(buttonLeft, buttonTop, buttonWidth, buttonHeight);   // 버튼은 no일때도 기능이 동작해야 하므로 보이는것과 상관없이 위치 조정 noclick일때는 무시  
        }
        else
        {
            linewidth = defaultsize;
        }

        if (this._rightline_ctrl && this._rightline_ctrl._p_visible)
        {
            this._rightline_ctrl.move(offset + line_adjust_left, linetop, linewidth - (line_button_gap_width / 2), halfheight);
            offset = this._rightline_ctrl.left + this._rightline_ctrl.width - line_adjust_left;


        }
        else
        {
            offset += 1;
        }

        if (this._upline_ctrl && this._upline_ctrl._p_visible)
            this._upline_ctrl.move(lineleft + line_adjust_left, linetop, linewidth, lineheight);

        if (this._downline_ctrl && this._downline_ctrl._p_visible)
        {
            // elem = this._downline_ctrl._control_element;
            linetop = line_adjust_top + lineheight + line_button_gap_height;

            var b = lineheight + linetop;
            var pb = parentheight + line_adjust_top;

            if (b > pb)
                lineheight = pb - linetop;

            this._downline_ctrl.move(lineleft + line_adjust_left, linetop, linewidth, lineheight);
        }

        // treecheckbox
        if (this._chk_ctrl && this._chk_ctrl._p_visible)
        {
            var checkWidth = this._chk_ctrl.width;
            var checkHeight = this._chk_ctrl.height;
            var checkLeft = offset;
            var checkTop = ((height - checkHeight) / 2);

            offset += checkWidth;
            this._chk_ctrl.move(checkLeft, checkTop, checkWidth, checkHeight);
        }

        // treeimage
        if (this._img_ctrl && this._img_ctrl._p_visible)
        {
            offset += 1;

            var imageWidth = this._img_ctrl._adjust_width;
            var imageHeight = this._img_ctrl._adjust_height;
            var imageLeft = null;
            var imageTop = null;

            if (imageWidth > 0 && imageHeight > 0)
            {
                imageLeft = offset;
                imageTop = ((height - imageHeight) / 2);
                // var imageRight = imageLeft + imageWidth;
                // var imageBottom = imageTop + imageHeight;

                offset += imageWidth;
            }
            else
            {
                // image size <= 0 이면 offset 변화 없음
                // offset += 15;	// default size
            }

            this._img_ctrl.move(imageLeft, imageTop, imageWidth, imageHeight);

            offset += 5;
        }
        else
        {
            offset += 4;
        }

        if (this._text_ctrl)
            this._text_ctrl.move(offset, 0, width - offset, height);
    };

    _pCellTree._setAlign = function (halign, valign)
    {
        if (halign)
            this._text_ctrl.set_textAlign(halign);
        if (valign)
            this._text_ctrl.set_verticalAlign(valign);
    };

    if (nexacro._Browser == "Runtime")
    {
        _pCellTree.on_change_containerRect = function (width, height)
        {
            if (this._lvl || this._isRtl())
                this._adjustSubCompAlign(this._lvl);
        };
    }
    else
    {
        _pCellTree.on_change_containerRect = function (width, height)
        {
            if (this._lvl)
                this._adjustSubCompAlign(this._lvl);
        };
    }

    _pCellTree._getComputedStyle = function ()
    {
        var ctrl_cs = { "styles": null };

        // todo
        return ctrl_cs;
    };

    _pCellTree._setComputedStyle = function (ctrl_cs)
    {
        // todo
    };

    //===============================================================
    // nexacro._CellRowGroupControl
    //===============================================================
    nexacro._CellRowGroupControl = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro._CellTreeControl.call(this, id, left, top, width, height, right, bottom, parent);
    };

    var _pCellRowGroup = nexacro._createPrototype(nexacro._CellTreeControl, nexacro._CellRowGroupControl);
    nexacro._CellRowGroupControl.prototype = _pCellRowGroup;

    _pCellRowGroup._type_name = "CellRowGroupControl";

    _pCellRowGroup._createLines = nexacro._emptyFn;
    _pCellRowGroup._createCheckbox = nexacro._emptyFn;
    _pCellRowGroup._createImage = nexacro._emptyFn;

    _pCellRowGroup._createButton = function (bCreateOnly)
    {
        // button은 size계산 때문에 use체크 생략.
        this._btnimg_ctrl = new nexacro._RowGroupExpandButtonControl("rowgroupexpandbutton", 0, 0, 0, 0, null, null, this);
        this._childctrl_setevent(this._btnimg_ctrl);

        if (this._env._p_enableaccessibility)
            this._btnimg_ctrl.accessibilityenable = false;

        this._btnimg_ctrl.createComponent(bCreateOnly);
    };

    _pCellRowGroup._createText = function (bCreateOnly)
    {
        this._text_ctrl = new nexacro.Static("rowgrouptext", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._text_ctrl._setControl();
        this._childctrl_setevent(this._text_ctrl);
        this._text_ctrl.createComponent(bCreateOnly);
    };

    _pCellRowGroup._updateAll = function (onlycontents, breadonly)
    {
        this._cellinfo = this._p_parent._refinfo;

        if (this._control_element)
        {
            var view = this._view;
            var cellobj = this._cellobj;
            var rowidx = cellobj._getDataRow();
            var dataset = cellobj._getBindDataset();
            var rowtype = dataset ? dataset.getRowType(rowidx) : 1;
            var level = this._cellinfo._getGroupRowLevel(rowidx);
            var group = this._cellinfo._groupcol;
            var button_visible = true;

            if (rowtype == 32 && (group < 0 || level == group))
                button_visible = true;
            else
                button_visible = false;

            if (breadonly !== undefined)
            {
                if (this.on_apply_readonly)
                {
                    this.on_apply_readonly(breadonly);
                }
                else
                {
                    this._changeStatus("readonly", breadonly);
                }
            }

            var stats = 1;
            //var check = 0;
            var level = 0;

            if (view && !cellobj._isFakeCell())
            {
                stats = view._getTreeStats(rowidx);
                //  check = view._getTreeCheck(rowidx);
                level = view._getGroupRowLevel ? view._getGroupRowLevel(rowidx) : this._cellinfo._getGroupRowLevel(rowidx);
            }

            if (rowidx == null || rowidx == -9)
            {
                this._btnimg_ctrl.set_visible(false);

                if (this._text_ctrl)
                    this._text_ctrl.set_visible(false);
                return;
            }
            else
            {
                this._btnimg_ctrl.set_visible(true && button_visible);

                if (this._text_ctrl)
                    this._text_ctrl.set_visible(true);
            }

            if (!onlycontents)
                this._apply_status(cellobj._oldstatus, cellobj._status, cellobj._olduserstatus, cellobj._userstatus);

            this._lvl = level;

            if (stats == 0)
                this._changeTreeStatus("collapse", true);
            else if (stats == 1)
                this._changeTreeStatus("expand", true);

            this._buttonUpdate();
            this._textUpdate();

            this.on_apply_prop_tooltip();
            this._adjustSubCompAlign(level);
        }
    };

    _pCellRowGroup._setAlign = function (halign, valign)
    {
        if (halign)
        {
            if (this._text_ctrl)
                this._text_ctrl.set_textAlign(halign);
        }
        if (valign)
        {
            if (this._text_ctrl)
                this._text_ctrl.set_verticalAlign(valign);
        }
    };

    _pCellRowGroup._adjustSubCompAlign = function (level)
    {
        // 여기가 수정되면 _pGrid._getGroupWidth도 동일한 처리가 필요합니다.

        var cellobj = this._p_parent;
        var cellinfo = cellobj._refinfo;
        var rect = cellobj._getControlRect();
        var width = rect.width;
        var height = rect.height;
        var defaultsize = 9;
        var gap = 16;   //defaultsize;

        // rowspan 2 이상일 때, image 상단에 표시
        /*
         var datarow = cellobj._getDataRow();
        if (cellinfo._rowspan > 1 && cellobj._view)
        {
            height = cellobj._view.getRealRowSize(datarow, 0);
            height -= ((padding) ? (padding.top + padding.bottom) : 0);
        }
        */

        if (cellinfo._groupcol >= 0)    // group column에서는 indent 사용안함.
            level = 0;

        var offset = (level * gap) + defaultsize;

        if (this._btnimg_ctrl && this._btnimg_ctrl.visible)
        {
            var buttonWidth = this._btnimg_ctrl.width;

            if (buttonWidth <= 0 && this._btnimg_ctrl._tmpw)
                buttonWidth = this._btnimg_ctrl._tmpw;

            var buttonHeight = this._btnimg_ctrl.height;

            if (buttonHeight <= 0 && this._btnimg_ctrl._tmph)
                buttonHeight = this._btnimg_ctrl._tmph;

            var buttonLeft = offset - (buttonWidth / 2);

            if (buttonLeft < 0)
                buttonLeft = offset - (defaultsize / 2);

            var buttonTop = ((height - buttonHeight) / 2);

            offset = buttonLeft + buttonWidth;
            this._btnimg_ctrl.move(buttonLeft, buttonTop, buttonWidth, buttonHeight);   // 버튼은 no일때도 기능이 동작해야 하므로 보이는것과 상관없이 위치 조정 noclick일때는 무시  
        }

        offset += 8;

        this._adjustTextPos(offset, width);
    };

    _pCellRowGroup._adjustTextPos = function (offset, width)
    {
        var cellobj = this._p_parent;
        var rect = cellobj._getControlRect();

        var height = rect.height;
        if (this._text_ctrl)
            this._text_ctrl.move(offset, 0, width - offset, height);
    };

    _pCellRowGroup._buttonUpdate = function ()
    {
        var val = this._btnimg_ctrl._getCSSStyleValue("icon", this._userstatus);
        this._load_image(this._btnimg_ctrl, val);
    };

    _pCellRowGroup._textUpdate = function ()
    {
        var txt = this._p_parent._getDisplayText();
        if (this._displaytext != txt)
        {
            if (this._text_ctrl)
                this._text_ctrl.set_text(txt);

            this._displaytext = txt;
        }
    };


    //===============================================================
    // nexacro._TreeItemIconControl
    //===============================================================
    nexacro._TreeItemIconControl = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro._Icon.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);
    };

    var _pTreeItemIcon = nexacro._createPrototype(nexacro._Icon, nexacro._TreeItemIconControl);
    nexacro._TreeItemIconControl.prototype = _pTreeItemIcon;
    _pTreeItemIcon._is_subcontrol = true;
    _pTreeItemIcon._type_name = "TreeItemIconControl";

    _pTreeItemIcon.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        return changestatus;
    };


    //===============================================================
    // nexacro._TreeItemTextControl
    //===============================================================
    nexacro._TreeItemTextControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Static.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);
    };
    var _pTreeItemTextControl = nexacro._createPrototype(nexacro.Static, nexacro._TreeItemTextControl);
    nexacro._TreeItemTextControl.prototype = _pTreeItemTextControl;

    //===============================================================
    // nexacro._CellTreeLineControl
    //===============================================================
    nexacro._CellTreeLineControl = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);

        this._p_tabstop = false;
        this._is_simple_control = true;
        this._is_nc_control = true;
        this._view = parent._view;
        this._depth = -1;
        this._showleft = false;
        this._showbottom = false;
    };

    var _pCellTreeLine = nexacro._createPrototype(nexacro.Component, nexacro._CellTreeLineControl);
    nexacro._CellTreeLineControl.prototype = _pCellTreeLine;
    _pCellTreeLine._is_subcontrol = true;
    _pCellTreeLine._type_name = "CellTreeLineControl";

    _pCellTreeLine.on_destroy_contents = function () //ok
    {
        this._view = null;
    };

    _pCellTreeLine._isEnable = function ()
    {
        if (this._view && this._view._enable !== undefined)
            return this._view._enable;

        if (this._p_parent && this._p_parent._isEnable)
            return this._p_parent._isEnable();

        return true;
    };

    _pCellTreeLine._set_line = function (left, bottom)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._showleft = left;
            this._showbottom = bottom;
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        }
    };

    _pCellTreeLine._on_apply_status = function (oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param, applycssstatus, applycssuserstatus)
    {
        nexacro.Component.prototype._on_apply_status.call(this, oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param, applycssstatus, applycssuserstatus);

        var remove_l = false, remove_t = false, remove_r = false, remove_b = false;

        if (this.id == "treerightline")
        {
            remove_l = true;
            remove_r = true;
            remove_t = true;
        }
        else if (this.id == "treeleftline" || this.id == "treeupline" || "treedownline")
        {
            remove_r = true;
            remove_t = true;
            remove_b = true;
        }

        if (!this._showbottom)
            remove_b = true;
        if (!this._showleft)
            remove_l = true;

        this._control_element.setElementBorderNone(remove_l, remove_t, remove_r, remove_b);
    };

    _pCellTreeLine.on_getIDCSSSelector = function ()
    {
        return "celltreeline";
    };

    //===============================================================
    // nexacro._RowGroupExpandButtonControl
    //===============================================================
    nexacro._RowGroupExpandButtonControl = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro._Icon.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);
    };

    var _pRowGroupExpandButtonControl = nexacro._createPrototype(nexacro._Icon, nexacro._RowGroupExpandButtonControl);
    nexacro._RowGroupExpandButtonControl.prototype = _pRowGroupExpandButtonControl;
    _pRowGroupExpandButtonControl._is_subcontrol = true;
    _pRowGroupExpandButtonControl._type_name = "RowGroupExpandButtonControl";

    _pRowGroupExpandButtonControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        return changestatus;
    };

    //===============================================================
    // nexacro._CellFilterPopupControl
    //===============================================================
    nexacro._CellFilterPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._attached_comp = this;
        this._operator_ctrls = [];
        this._andor_ctrls = [];
        this._setfilterlist = null;
        this._searchedit = null;
        this._selectall = null;
        this._splitline = null;
        this._applybutton = null;
        this._clearbutton = null;
        this._cellinfo = parent._refinfo;
    };

    var _pCellFilterPopupControl = nexacro._createPrototype(nexacro.PopupControl, nexacro._CellFilterPopupControl);
    nexacro._CellFilterPopupControl.prototype = _pCellFilterPopupControl;
    _pCellFilterPopupControl._type_name = "CellFilterPopupControl";

    _pCellFilterPopupControl._is_scrollable = true;

    _pCellFilterPopupControl._p_type = "text";
    _pCellFilterPopupControl._p_display = "condition";
    _pCellFilterPopupControl._p_useclearbutton = true;

    _pCellFilterPopupControl._callbackParentFunc = null;
    _pCellFilterPopupControl._default_width = 200;

    _pCellFilterPopupControl._code_apply_msg = "comp_apply";
    _pCellFilterPopupControl._code_clear_msg = "comp_clear";
    _pCellFilterPopupControl._code_search_msg = "comp_search";
    _pCellFilterPopupControl._code_selectall_msg = "comp_selectall";
    _pCellFilterPopupControl._code_contains_msg = "comp_contains";
    _pCellFilterPopupControl._code_not_contains_msg = "comp_notcontains";
    _pCellFilterPopupControl._code_equals_msg = "comp_equals";
    _pCellFilterPopupControl._code_not_equals_msg = "comp_notequals";
    _pCellFilterPopupControl._code_startswidth_msg = "comp_startswidth";
    _pCellFilterPopupControl._code_endswidth_msg = "comp_endswidth";
    _pCellFilterPopupControl._code_empty_msg = "comp_empty";
    _pCellFilterPopupControl._code_not_empty_msg = "comp_notempty";

    _pCellFilterPopupControl.on_create_control_element = function (parent_elem)
    {
        var control_elem = this.on_create_popupscrollable_control_element(parent_elem);
        /*if (control_elem && this._default_zindex > 0)
        {
            control_elem.setElementZIndex(this._default_zindex);
        }*/
        return control_elem;
    };

    _pCellFilterPopupControl.on_create_contents = function ()
    {
        this.set_width(this._default_width);

        nexacro.addErrorMessage("ko", this._code_apply_msg, "적용");
        nexacro.addErrorMessage("en", this._code_apply_msg, "Apply");
        nexacro.addErrorMessage("ja", this._code_apply_msg, "適用");
        nexacro.addErrorMessage("zh", this._code_apply_msg, "應用");

        nexacro.addErrorMessage("ko", this._code_clear_msg, "해제");
        nexacro.addErrorMessage("en", this._code_clear_msg, "Clear");
        nexacro.addErrorMessage("ja", this._code_clear_msg, "クリア");
        nexacro.addErrorMessage("zh", this._code_clear_msg, "清除");

        //search
        nexacro.addErrorMessage("ko", this._code_search_msg, "검색");
        nexacro.addErrorMessage("en", this._code_search_msg, "Search");
        nexacro.addErrorMessage("ja", this._code_search_msg, "検索");
        nexacro.addErrorMessage("zh", this._code_search_msg, "搜索");

        // 
        nexacro.addErrorMessage("ko", this._code_selectall_msg, "전체 선택");
        nexacro.addErrorMessage("en", this._code_selectall_msg, "Select All");
        nexacro.addErrorMessage("ja", this._code_selectall_msg, "すべて選択");
        nexacro.addErrorMessage("zh", this._code_selectall_msg, "全選");

        //contains
        nexacro.addErrorMessage("ko", this._code_contains_msg, "포함");
        nexacro.addErrorMessage("en", this._code_contains_msg, "Contains");
        nexacro.addErrorMessage("ja", this._code_contains_msg, "含む");
        nexacro.addErrorMessage("zh", this._code_contains_msg, "包含");

        //notContains
        nexacro.addErrorMessage("ko", this._code_not_contains_msg, "포함하지 않음");
        nexacro.addErrorMessage("en", this._code_not_contains_msg, "Does not contain");
        nexacro.addErrorMessage("ja", this._code_not_contains_msg, "含まない");
        nexacro.addErrorMessage("zh", this._code_not_contains_msg, "不包含");

        //equals
        nexacro.addErrorMessage("ko", this._code_equals_msg, "같음");
        nexacro.addErrorMessage("en", this._code_equals_msg, "Equals");
        nexacro.addErrorMessage("ja", this._code_equals_msg, "等しい");
        nexacro.addErrorMessage("zh", this._code_equals_msg, "等於");

        //notEqual
        nexacro.addErrorMessage("ko", this._code_not_equals_msg, "같지 않음");
        nexacro.addErrorMessage("en", this._code_not_equals_msg, "Does not equal");
        nexacro.addErrorMessage("ja", this._code_not_equals_msg, "等しくない");
        nexacro.addErrorMessage("zh", this._code_not_equals_msg, "不等於");

        //startsWith
        nexacro.addErrorMessage("ko", this._code_startswidth_msg, "시작");
        nexacro.addErrorMessage("en", this._code_startswidth_msg, "Starts with");
        nexacro.addErrorMessage("ja", this._code_startswidth_msg, "で始まる");
        nexacro.addErrorMessage("zh", this._code_startswidth_msg, "開始於");

        //endwidth
        nexacro.addErrorMessage("ko", this._code_endswidth_msg, "끝");
        nexacro.addErrorMessage("en", this._code_endswidth_msg, "Ends with");
        nexacro.addErrorMessage("ja", this._code_endswidth_msg, "で終わる");
        nexacro.addErrorMessage("zh", this._code_endswidth_msg, "結束於");

        //empty
        nexacro.addErrorMessage("ko", this._code_empty_msg, "빈칸");
        nexacro.addErrorMessage("en", this._code_empty_msg, "Is empty");
        nexacro.addErrorMessage("ja", this._code_empty_msg, "空白");
        nexacro.addErrorMessage("zh", this._code_empty_msg, "空白");

        //not empty
        nexacro.addErrorMessage("ko", this._code_not_empty_msg, "비어 있지 않음");
        nexacro.addErrorMessage("en", this._code_not_empty_msg, "Is not empty");
        nexacro.addErrorMessage("ja", this._code_not_empty_msg, "空白ではない");
        nexacro.addErrorMessage("zh", this._code_not_empty_msg, "非空白");
    };

    _pCellFilterPopupControl.on_created_contents = function (win)
    {
        this._updateAll();
        this._setViewDatasetHandler();
    };

    _pCellFilterPopupControl.on_destroy_contents = function ()
    {
        this._destroyControls();
        nexacro._OnceCallbackTimer.callonce(this, function ()
        {
            this._removeViewDatasetHandler();
        });
        this._callbackParentFunc = null;
    };

    _pCellFilterPopupControl._destroyControls = function ()
    {
        if (this._operator_ctrls)
        {
            for (var i = 0; i < this._operator_ctrls.length; i++)
            {
                this._operator_ctrls[i].oper.destroy();
                this._operator_ctrls[i].edit.destroy();
            }
            this._operator_ctrls = null;
        }

        if (this._andor_ctrls)
        {
            for (i = 0; i < this._andor_ctrls.length; i++)
            {
                this._andor_ctrls[i].destroy();
            }
            this._andor_ctrls = null;
        }

        if (this._splitline)
        {
            this._splitline.destroy();
            this._splitline = null;
        }

        if (this._searchedit)
        {
            this._searchedit.destroy();
            this._searchedit = null;
        }

        if (this._selectall)
        {
            this._selectall.destroy();
            this._selectall = null;
        }

        if (this._setfilterlist)
        {
            this._setfilterlist.destroy();
            this._setfilterlist = null;
        }

        if (this._applybutton)
        {
            this._applybutton.destroy();
            this._applybutton = null;
        }

        if (this._clearbutton)
        {
            this._clearbutton.destroy();
            this._clearbutton = null;
        }

    };

    _pCellFilterPopupControl._clearControls = function ()
    {
        this._destroyControls();
        this._operator_ctrls = [];
        this._andor_ctrls = [];
    };

    _pCellFilterPopupControl.set_display = function (v)
    {
        if (this._p_display != v)
        {
            this._p_display = v;
            this._updateAll();
        }
    };

    _pCellFilterPopupControl.set_useclearbutton = function (v)
    {
        if (this._p_useclearbutton != v)
        {
            this._p_useclearbutton = v;
            this._updateAll();
        }
    };

    _pCellFilterPopupControl.set_type = function (v)
    {
        if (this._p_type != v)
        {
            switch (v)
            {
                case "text":
                case "num":
                case "date":
                case "time":
                case "datetime":
                    this._p_type = v;
                    this._cellinfo._filtersaveinfo = null;
                    this._updateAll();
                    break;
            }
        }
    };

    _pCellFilterPopupControl._updateAll = function ()
    {
        this._clearControls();
        this._addOperatorControls();
        this._addOperatorControls();
        //this._addOperatorControls();
    };

    _pCellFilterPopupControl._ctrl_height = 20;
    _pCellFilterPopupControl._ctrl_topgap = 5;
    _pCellFilterPopupControl._addOperatorControls = function ()
    {
        if (!this._control_element)
            return;

        var l = 0;
        var t = 0;
        var w = this._getClientWidth();
        var h = this._ctrl_height;
        var oper_ctrls = this._operator_ctrls;
        var filterinfo = this._cellinfo._filtersaveinfo;
        var opts;

        if (this._p_display.indexOf("condition") >= 0)
        {
            if (this._operator_ctrls.length > 0)
            {
                t += oper_ctrls[oper_ctrls.length - 1].edit._adjust_top + oper_ctrls[oper_ctrls.length - 1].edit._adjust_height;
                t += this._ctrl_topgap;

                opts = [["AND", "&&"], ["OR", "||"]];

                var radio_innerds = this._createInnerDataset(opts);
                var andor = new nexacro.Radio("filterpopuplogicalradio" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
                andor.on_getIDCSSSelector = function ()
                {
                    return "filterpopuplogicalradio";
                };

                andor._setControl();
                andor.set_innerdataset(radio_innerds);
                andor.set_codecolumn("codecolumn");
                andor.set_datacolumn("datacolumn");
                andor.set_direction("vertical");

                if (filterinfo && filterinfo.andor[this._andor_ctrls.length] != undefined)
                    andor.set_value(filterinfo.andor[this._andor_ctrls.length]);
                else
                    andor.set_index(0);

                andor.createComponent();

                this._andor_ctrls.push(andor);

                t += this._ctrl_topgap;
                t += h;
            }

            var ctrls = { oper: null, edit: null };

            ctrls.oper = new nexacro.Combo("filterpopupoperatorlist" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
            ctrls.oper.on_getIDCSSSelector = function ()
            {
                return "filterpopupoperatorlist";
            };
            ctrls.oper.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
            {
                if (postvalue.indexOf("empty") >= 0)
                {
                    this._refedit._setEnable(false);
                    this.parent._makeFilterString();
                }
                else
                {
                    this._refedit._setEnable(true);
                }

                if (this.onitemchanged && this.onitemchanged._has_handlers)
                {
                    var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
                    this.onitemchanged._fireEvent(this, evt);
                }
            };

            ctrls.oper.on_org_destroy_contents = ctrls.oper.on_destroy_contents;
            ctrls.oper.on_destroy_contents = function ()
            {
                this.on_org_destroy_contents();
                this._refedit = null;
            };

            t += this._ctrl_topgap;
            t += h;

            if (this._p_type == "num")
            {
                ctrls.edit = new nexacro.MaskEdit("filterpopupnumberedit" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
                ctrls.edit.on_getIDCSSSelector = function ()
                {
                    return "filterpopupnumberedit";
                };
                opts = [
                    ["=", "=="], ["<>", "!="], [">", ">"], [">=", ">="], ["<", "<"], ["<=", "<="]   // data, code
                ];
            }
            else if (this._p_type == "date")
            {
                ctrls.edit = new nexacro.Calendar("filterpopupcalendar" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
                ctrls.edit.on_getIDCSSSelector = function ()
                {
                    return "filterpopupcalendar";
                };
                opts = [
                    ["=", "=="], ["<>", "!="], [">", ">"], [">=", ">="], ["<", "<"], ["<=", "<="]
                ];
                ctrls.edit.set_dateformat("SHORTDATE");
                ctrls.edit.set_editformat("SHORTDATE");
            }
            else if (this._p_type == "time")
            {
                ctrls.edit = new nexacro.Calendar("filterpopupcalendar" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
                ctrls.edit.on_getIDCSSSelector = function ()
                {
                    return "filterpopupcalendar";
                };
                opts = [
                    ["=", "=="], ["<>", "!="], [">", ">"], [">=", ">="], ["<", "<"], ["<=", "<="]
                ];
                ctrls.edit.set_dateformat("HH:mm:ss");
                ctrls.edit.set_editformat("HH:mm:ss");
                ctrls.edit.set_type("spin");
            }
            else if (this._p_type == "datetime")
            {
                ctrls.edit = new nexacro.Calendar("filterpopupcalendar" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
                ctrls.edit.on_getIDCSSSelector = function ()
                {
                    return "filterpopupcalendar";
                };
                opts = [
                    ["=", "=="], ["<>", "!="], [">", ">"], [">=", ">="], ["<", "<"], ["<=", "<="]
                ];

                var format = nexacro.Locale._makeDateMaskString(this._getLocale(), "SHORTDATE");
                format += " HH:mm:ss";

                ctrls.edit.set_dateformat(format);
                ctrls.edit.set_editformat(format);
            }
            else
            {
                ctrls.edit = new nexacro.Edit("filterpopuptextedit" + this._operator_ctrls.length, l, t, w, h, null, null, null, null, null, null, this);
                ctrls.edit.on_getIDCSSSelector = function ()
                {
                    return "filterpopuptextedit";
                };
                opts = [
                    [nexacro._GetSystemErrorMsg(this, this._code_contains_msg), this._code_contains_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_not_contains_msg), this._code_not_contains_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_equals_msg), this._code_equals_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_not_equals_msg), this._code_not_equals_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_startswidth_msg), this._code_startswidth_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_endswidth_msg), this._code_endswidth_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_empty_msg), this._code_empty_msg],
                    [nexacro._GetSystemErrorMsg(this, this._code_not_empty_msg), this._code_not_empty_msg]
                ];
            }

            if (filterinfo && filterinfo.vals[oper_ctrls.length] != undefined)
                ctrls.edit.set_value(filterinfo.vals[oper_ctrls.length]);

            var combo_innerds = this._createInnerDataset(opts);

            ctrls.oper._setControl();
            ctrls.oper.set_innerdataset(combo_innerds);
            ctrls.oper.set_codecolumn("codecolumn");
            ctrls.oper.set_datacolumn("datacolumn");
            ctrls.oper.createComponent();

            if (filterinfo && filterinfo.opers[oper_ctrls.length] != undefined)
                ctrls.oper.set_value(filterinfo.opers[oper_ctrls.length]);
            else
                ctrls.oper.set_index(0);

            ctrls.edit._setControl();
            ctrls.edit.createComponent();

            ctrls.oper._refedit = ctrls.edit;

            oper_ctrls.push(ctrls);
            t += h;
        }

        var padding = this._getCurrentStylePadding();

        if (this._p_display.indexOf("select") >= 0)
        {
            if (!this._searchedit)
            {
                if (this._p_display != "select")
                {
                    t += (padding) ? padding.bottom : 0;
                    this._splitline = new nexacro.Component("filterpopupsplitline", l, t, this._adjust_width, 1, null, null, null, null, null, null, this);
                    this._splitline._is_simple_control = true;
                    this._splitline._type_name = "Static";
                    this._splitline._setControl();
                    this._splitline.createComponent();
                    this._splitline._control_element.setElementBorderNone(true, false, true, true);

                    t += 1 + ((padding) ? padding.top : 0);
                }

                this._searchedit = new nexacro.Edit("filterpopupsearchedit", l, t, w, h, null, null, null, null, null, null, this);
                this._searchedit._setControl();
                this._searchedit.displaynulltext = nexacro._GetSystemErrorMsg(this, this._code_search_msg) + "...";
                this._searchedit._setEventHandler("oninput", this.on_search_oninput, this);
                this._searchedit.createComponent();

                t += this._ctrl_topgap;
                t += h;

                this._selectall = new nexacro.CheckBox("filterpopupselectallcheck", l, t, w, h, null, null, null, null, null, null, this);
                this._selectall._setControl();
                this._selectall.text = nexacro._GetSystemErrorMsg(this, this._code_selectall_msg);
                this._selectall._setEventHandler("onchanged", this.on_selectall, this);
                this._selectall.createComponent();

                if (filterinfo && filterinfo.selectall != undefined)
                    this._selectall.set_value(filterinfo.selectall);
                else
                    this._selectall.set_value(true);

                t += this._ctrl_topgap;
                t += h;

                this._createSetFilter(l, t, w, 200);

                t += 200;
            }
            else
            {
                if (this._splitline)
                {
                    t += (padding) ? padding.bottom : 0;
                    this._splitline.move(l, t, this._adjust_width, 1);

                    t += 1 + ((padding) ? padding.top : 0);
                }

                this._searchedit.move(l, t, w, h);

                t += this._ctrl_topgap;
                t += h;

                this._selectall.move(l, t, w, h);

                t += this._ctrl_topgap;
                t += h;

                this._setfilterlist.move(l, t, w, 200);

                t += 200;
            }
        }

        t += this._ctrl_topgap;

        if (!this._applybutton)
        {
            this._applybutton = new nexacro.Button("filterpopupapplybutton", l, t, w, h, null, null, null, null, null, null, this);
            this._applybutton._setControl();
            this._applybutton._setEventHandler("onclick", this.on_applybutton_click, this);
            this._applybutton.set_text(nexacro._GetSystemErrorMsg(this, this._code_apply_msg));
            this._applybutton.createComponent();

            t += h;
        }
        else
        {
            this._applybutton.move(l, t, w, h);
            t += h;
        }

        if (this._p_useclearbutton)
        {
            t += this._ctrl_topgap;

            if (!this._clearbutton)
            {
                this._clearbutton = new nexacro.Button("filterpopupclearbutton", l, t, w, h, null, null, null, null, null, null, this);
                this._clearbutton._setControl();
                this._clearbutton._setEventHandler("onclick", this.on_clearbutton_click, this);
                this._clearbutton.set_text(nexacro._GetSystemErrorMsg(this, this._code_clear_msg));
                this._clearbutton.createComponent();

                t += h;
            }
            else
            {
                this._clearbutton.move(l, t, w, h);
                t += h;
            }
        }

        var height = t;
        var border = this._getCurrentStyleBorder();

        if (this._control_element)
            this._control_element.setElementScrollMaxSize(w, height);

        this._onResetScrollBar();

        this._popup_width = this._default_width;

        if (border)
            height += border.top._width + border.bottom._width;

        if (padding)
            height += padding.top + padding.bottom;

        if (this._operator_ctrls.length <= 2)
        {
            this.resize(this._default_width, height);
        }
        else
        {
            var vscroll_size = this._getVScrollBarSize();
            this.resize(this._default_width + vscroll_size, this._adjust_height);
        }
    };

    _pCellFilterPopupControl._createSetFilter = function (l, t, w, h)
    {
        var filterinfo = this._cellinfo._filtersaveinfo;
        this._setfilterlist = new nexacro._SetFilterList("filterpopupsetfilter", l, t, w, h, null, null, null, null, null, null, this);
        this._setfilterlist.set_scrolltype("vertical");
        this._setfilterlist.createComponent();

        var checkboxset = this._setfilterlist.getCheckSet();

        checkboxset._removeindex = function (v, change_by_script, isNotFireEvent)
        {
            var retn = nexacro.CheckBoxSet.prototype._removeindex.call(this, v, change_by_script, isNotFireEvent);
            this.parent.parent.on_setfilter_onremoveitem();
            return retn;
        };

        let opts = this._doSetValueList();
        var checkboxset_innerds = this._createInnerDataset(opts);

        checkboxset.setInnerDataset(checkboxset_innerds);
        checkboxset.createComponent();
        checkboxset.set_fittocontents("height");

        if (filterinfo && filterinfo.setfilters != undefined)
            checkboxset.set_value(filterinfo.setfilters);
        else
            checkboxset.selectAll();
    };

    _pCellFilterPopupControl._doSetValueList = function ()
    {
        var dataset = this._getViewDataset();
        if (dataset)
        {
            var vallist = [];
            var colid = this._getFilterColumn();
            var rowcount = dataset.getRowCountNF();

            for (var i = 0; i < rowcount; i++)
            {
                vallist[i] = dataset.getColumnNF(i, colid);
            }

            var unique_vallist = [...new Set(vallist)];

            if (this._p_type == "text")
                unique_vallist = unique_vallist.sort();
            else
                unique_vallist = unique_vallist.sort((a, b) => a - b);

            var retn = [];

            for (i = 0; i < unique_vallist.length; i++)
            {
                retn[i] = [unique_vallist[i], unique_vallist[i]];
            }

            return retn;
        }
    };

    _pCellFilterPopupControl._getViewDataset = function ()
    {
        var cellinfo = this.parent._refinfo;
        var view = cellinfo._view;

        if (view)
        {
            return view._binddataset;
        }
    };

    _pCellFilterPopupControl._setViewDatasetHandler = function ()
    {
        if (!this._p_display)
            return;

        var ds = this._getViewDataset();
        if (ds)
        {
            ds._setEventHandler("onload", this.on_setfilter_dataset_changed, this);
            ds._setEventHandler("onvaluechanged", this.on_setfilter_dataset_changed, this);
            ds._setEventHandler("onrowsetchanged", this.on_setfilter_dataset_changed, this);
        }
    };

    _pCellFilterPopupControl._removeViewDatasetHandler = function ()
    {
        var ds = this._getViewDataset();
        if (ds)
        {
            ds._removeEventHandler("onload", this.on_setfilter_dataset_changed, this);
            ds._removeEventHandler("onvaluechanged", this.on_setfilter_dataset_changed, this);
            ds._removeEventHandler("onrowsetchanged", this.on_setfilter_dataset_changed, this);
        }
    };

    _pCellFilterPopupControl._getFilterColumn = function ()
    {
        var cellinfo = this.parent._refinfo;
        var datarow = this.parent._getDataRow();
        var colid = cellinfo._getAttrValue(cellinfo._p_filtercolumn, datarow);

        return colid;
    };

    _pCellFilterPopupControl._isSelectAllCheckboxset = function ()
    {
        var checkboxset = this._setfilterlist.getCheckSet();
        var rowcnt = checkboxset._innerdataset.rowcount;

        if (checkboxset._select_multi.items.length == rowcnt)
            return true;
        else
            return false;
    };

    _pCellFilterPopupControl.on_setfilter_onremoveitem = function ()
    {
        this._selectall.set_value(false);
    };

    _pCellFilterPopupControl.on_setfilter_dataset_changed = function (obj, e)
    {
        if (this._setfilterlist && !this._is_setfiltering)
        {
            var l = this._setfilterlist._adjust_left;
            var t = this._setfilterlist._adjust_top;
            var w = this._setfilterlist._adjust_width;
            var h = this._setfilterlist._adjust_height;

            this._setfilterlist.destroy();
            this._createSetFilter(l, t, w, h);
        }
    };

    _pCellFilterPopupControl.on_selectall = function (obj, e)
    {
        var checkboxset = this._setfilterlist.getCheckSet();

        if (obj.value)
            checkboxset.selectAll();
        else
            checkboxset.clearSelect();
    };

    _pCellFilterPopupControl.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        return true;
    };

    _pCellFilterPopupControl.on_fire_sys_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        return true;
    };

    _pCellFilterPopupControl._convStringForFilter = function (edit_val)
    {
        if (!edit_val)
            return edit_val;

        var regExp;
        var parse_val = "";
        var trans_val = "";
        var edit_val_len = edit_val.length;

        // 특수문자 입력시 \\을 붙여준다.
        for (var i = 0; i < edit_val_len; i++)
        {
            regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
            var c = edit_val.charAt(i);

            if (regExp.test(c))
                parse_val += "\\";
            parse_val += c;
        }

        trans_val = new nexacro.ExprParser()._transferWhitespace(parse_val);
        return trans_val;
    };

    _pCellFilterPopupControl.on_search_oninput = function (obj, e)
    {
        var checkboxset = this._setfilterlist.getCheckSet();
        var ds = checkboxset._innerdataset;
        var trans_val = this._convStringForFilter(obj.value);

        if (trans_val)
            ds.set_filterstr("datacolumn.match(/^(" + trans_val + ")/i)");
        else
            ds.set_filterstr("");
    };

    _pCellFilterPopupControl.on_applybutton_click = function (obj, e)
    {
        this._applyFilter();
        this._closePopup();
    };

    _pCellFilterPopupControl.on_clearbutton_click = function (obj, e)
    {
        this._clearFilter();
        this._closePopup();
    };

    _pCellFilterPopupControl._applyFilter = function ()
    {
        var str = "";

        if (this._setfilterlist)
        {
            if (!this._cellinfo._filtersaveinfo)
                this._cellinfo._filtersaveinfo = {};

            this._cellinfo._filtersaveinfo.selectall = this._selectall.value;
            this._cellinfo._filtersaveinfo.setfilters = this._setfilterlist.getCheckSet().value ? this._setfilterlist.getCheckSet().value : "";

            if (this._isSelectAllCheckboxset())
            {
                ;   // skip
            }
            else if (this._setfilterlist.getCheckSet()._select_multi.items.length == 0)
            {
                str = "1==2";
            }
            else
            {
                var colid = this._getFilterColumn();
                var values = this._setfilterlist.getCheckSet().value;

                if (values)
                {
                    var count = this._setfilterlist.getCheckSet()._innerdataset.rowcount / 2;

                    values = values.split(",");

                    for (var i = 0; i < values.length; i++)
                    {
                        if (str != "")
                            str += " || ";

                        str += (colid + " == '" + values[i] + "'");
                    }
                }
            }
        }
        this._makeFilterString(str);
    };

    _pCellFilterPopupControl._clearFilter = function ()
    {
        this._cellinfo._filtersaveinfo = null;
        this.parent._filterCtrl._changeUserStatus("selected", false);
        this._callbackParentFunc.call(this.parent, "");
    };

    _pCellFilterPopupControl._createInnerDataset = function (opts)
    {
        var innerds = new nexacro.NormalDataset("filter_combo_innerdataset", this);
        var contents = "<ColumnInfo><Column id=\"codecolumn\" size=\"256\"/><Column id=\"datacolumn\" size=\"256\"/></ColumnInfo><Rows>";

        for (var i = 0; i < opts.length; i++)
        {
            contents += "<Row>";
            contents += "<Col id=\"codecolumn\">" + opts[i][1] + "</Col><Col id=\"datacolumn\">" + opts[i][0] + "</Col>";
            contents += "</Row>";
        }

        innerds._setContents(contents);
        return innerds;
    };

    _pCellFilterPopupControl.on_change_containerRect = function (width, height)
    {
        if (!this._popup_width)
            return;

        this._onResetScrollBar();
        /*
        var vscroll_size;
        if (!this.vscrollbar || !this.vscrollbar.visible)
            vscroll_size = 0;
        else
            vscroll_size = this._getVScrollBarSize();
        
        if (this._adjust_width != this._popup_width + vscroll_size)
        {
            var hscroll_size;
            if (!this.hscrollbar || !this.hscrollbar.visible)
                hscroll_size = 0;
            else
                hscroll_size = this._getHScrollBarSize();

            this.resize(this._popup_width + vscroll_size, this._adjust_height + hscroll_size);

            if (this._splitline)
                this._splitline.set_width(this._adjust_width);

            return;
        }
        */
        if (this._clearbutton)
            this._clearbutton.set_width(width);

        if (this._operator_ctrls)
        {
            for (var i = 0; i < this._operator_ctrls.length; i++)
            {
                this._operator_ctrls[i].oper.set_width(width);
                this._operator_ctrls[i].edit.set_width(width);
            }

            for (i = 0; i < this._andor_ctrls.length; i++)
            {
                this._andor_ctrls[i].set_width(width);
            }
        }

        if (this._searchedit)
            this._searchedit.set_width(width);

        if (this._selectall)
            this._selectall.set_width(width);

        if (this._setfilterlist)
            this._setfilterlist.set_width(width);

        if (this._applybutton)
            this._applybutton.set_width(width);
    };

    _pCellFilterPopupControl.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (keycode == 13) // enter
        {
            this._applybutton._setFocus(false);
            this._applybutton.click();
        }
        else if (keycode == 27)
        {
            this._closePopup();
        }
    };

    _pCellFilterPopupControl._makeFilterString = function (setfilter_str)
    {
        var str = "";
        if (this._operator_ctrls)
        {
            if (!this._cellinfo._filtersaveinfo)
                this._cellinfo._filtersaveinfo = {};

            this._cellinfo._filtersaveinfo.opers = [];
            this._cellinfo._filtersaveinfo.andor = [];
            this._cellinfo._filtersaveinfo.vals = [];

            for (var i = 0; i < this._operator_ctrls.length; i++)
            {
                var oper = this._operator_ctrls[i].oper.value;
                var edit = this._operator_ctrls[i].edit.value;

                this._cellinfo._filtersaveinfo.opers[i] = oper;
                this._cellinfo._filtersaveinfo.vals[i] = edit;

                if (i > 0)
                    this._cellinfo._filtersaveinfo.andor[i - 1] = this._andor_ctrls[i - 1].value;

                if (edit || oper == "Is empty" || oper == "Is not empty")
                {
                    if (str)
                        str += (" " + this._andor_ctrls[i - 1].value + " ");

                    var colid = this._getFilterColumn();

                    if (this._p_type == "text")
                    {
                        let trans_val = this._convStringForFilter(edit);

                        if (oper == "==" || oper == "!=" || oper == "<" || oper == ">" || oper == "<=" || oper == ">=")
                        {
                            str += (colid + oper + "\'" + trans_val + "\'");
                        }
                        else
                        {
                            if (oper == this._code_startswidth_msg)
                                str += (colid + ".match(/^(" + trans_val + ")/i)");
                            else if (oper == this._code_endswidth_msg)
                                str += (colid + ".match(/(" + trans_val + ")$/i)");
                            else if (oper == this._code_contains_msg)
                                str += (colid + ".match(/(" + trans_val + ")/i)");
                            else if (oper == this._code_not_contains_msg)
                                str += ("(" + colid + ".match(/(" + trans_val + ")/i) == undefined)");
                            if (oper == this._code_equals_msg)
                                str += (colid + ".match(/^(" + trans_val + ")$/i)");
                            else if (oper == this._code_not_equals_msg)
                                str += ("(" + colid + ".match(/^(" + trans_val + ")$/i) == undefined)");
                            else if (oper == this._code_empty_msg)
                                str += (colid + "==''");
                            else if (oper == this._code_not_empty_msg)
                                str += (colid + "!=''");
                        }
                    }
                    else // not text
                    {
                        str += (colid + oper + "\'" + edit + "\'");
                    }
                }
            }
        }

        if (setfilter_str)
        {
            if (str != "")
                str += " && ";

            str += ("(" + setfilter_str + ")");
        }

        if (str)
            this.parent._filterCtrl._changeUserStatus("selected", true);
        else
            this.parent._filterCtrl._changeUserStatus("selected", false);

        this._callbackParentFunc.call(this.parent, str);
        return str;
    };

    _pCellFilterPopupControl._setCallbackFunc = function (f)
    {
        this._callbackParentFunc = f;
    };

    nexacro._SetFilterList = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, null, null, null, null, null, null, parent);
    };

    var _pSetFilterList = nexacro._createPrototype(nexacro.Component, nexacro._SetFilterList);
    nexacro._SetFilterList.prototype = _pSetFilterList;

    _pSetFilterList._is_subcontrol = true;
    _pSetFilterList._is_scrollable = true;

    _pSetFilterList.on_create_contents = function (win)
    {

    };

    _pSetFilterList.on_created_contents = function (win)
    {
        this._checkset = new nexacro.CheckBoxSet("setfiltercheckset", 0, 0, this._getClientWidth(), this._getClientHeight(), null, null, null, null, null, null, this);
        this._checkset._setControl();

        this._checkset.set_direction("vertical");
        this._checkset.set_codecolumn("codecolumn");
        this._checkset.set_datacolumn("datacolumn");
        this._checkset.set_columncount(1);
    };

    _pSetFilterList.on_destroy_contents = function ()
    {
        this._checkset.destroy();
        this._checkset = null;
    };

    _pSetFilterList.resetScrollBar = function ()
    {
        if (this._control_element)
            this._control_element.setElementScrollMaxSize(this._getClientWidth(), this._checkset._adjust_height);

        this._onResetScrollBar();
    };

    _pSetFilterList.getCheckSet = function ()
    {
        return this._checkset;
    };

    _pSetFilterList.on_change_containerRect = function (width, height)
    {
        if (this._checkset)
        {
            this._checkset.set_width(width);

            if (this._control_element)
                this._control_element.setElementScrollMaxSize(this._getClientWidth(), this._checkset._adjust_height);

            this._onResetScrollBar();
        }
    };

    _pSetFilterList._type_name = "SetFilterListControl";

    _pCellControl = null;
    //_pSubCellControl = null;
    _pCellExpand = null;
    _pCellFilterIcon = null;
    _pCellSortIcon = null;
    _pCellButton = null;
    _pCellBar = null;
    _pCellEdit = null;
    _pCellTextArea = null;
    _pCellMaskEdit = null;
    _pCellCalendar;
    _pCellCombo = null;
    _pCellMultiCombo = null;
    _pCellCheckboxBase = null;
    _pCellCheckbox = null;
    _pCellRadioItem = null;
    _pCellImage = null;
    _pCellTree = null;
    _pTreeItemIcon = null;
    _pTreeItemTextControl = null;
    _pCellTreeLine = null;
    _pCellHTMLControl = null;
}