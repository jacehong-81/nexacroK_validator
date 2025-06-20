﻿//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.RadarChart)
{
    //==================================================================//
    // RadarChart
    //==================================================================//
    var _pRadarChart = nexacro.RadarChart.prototype;

    _pRadarChart._use_makeContentsString = false;
    _pRadarChart._use_categorycolumn = true;

    _pRadarChart.createCssDesignContents = function ()
    {
    };

    _pRadarChart.destroyCssDesignContents = function ()
    {
    };

    _pRadarChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pRadarChart.makeContentsString = function ()
    {
        // RadarChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn
		// radar chart는 categoryaxis,valueaxis 각각 1개씩만 존재한다.
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
			str_contents += this._getDesignContentsCategoryaxis() + ", \n";
			str_contents += this._getDesignContentsValueaxis(1) + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pRadarChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Radar Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";

            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                var index_cnt = 0;

                for (var i = 1; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };
	 _pRadarChart._getDesignContentsCategoryaxis = function ()
    {
        var str_contents = "\t\"categoryaxis\": {\n";
        str_contents += "\t\t\"id\": \"categoryaxis\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	_pRadarChart._getDesignContentsValueaxis = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
      
    };
	_pRadarChart._getDesignContentsAxis = function (index)
	{
		var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t  }";

        return str_contents;
	};
    _pRadarChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"series\", \n";
        str_contents += "\t\t\"linevisible\": true, \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextcolor\": \"#003860\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 6pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

    delete _pRadarChart;
}