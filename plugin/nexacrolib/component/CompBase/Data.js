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
// nexacro.DataUtils
//==============================================================================
if (!nexacro.DatasetBase)
{

    nexacro._DatasetRuleFuncsSet = {};

    // 오동후, 1.0 함수가 Dataset에 정의되어 있으면, 
    // RuleFuncSet인지 여부를 인지하지 못해서 함수인자가 Rule 1.0 함수에만 추가되는 경우가 발생하여 옮rlrh, 'list' 지움
    nexacro._DatasetRuleFuncsSet["1.0"] = {
        "_isInvalidValue": function (value, coltype)
        {
            return false;
        },
        "_compareValue": function (val1, val2, coltype, locale, localeoption, bSysLang)
        {
            if (val1 != null && val2 != null)
            {
                if (coltype == 4 || coltype < 0)
                {
                    if ((val1 instanceof nexacro.Decimal))
                    {
                        if (val2 instanceof nexacro.Decimal)
                        {
                            return (val1.hi == val2.hi) ? (val1.lo - val2.lo) : (val1.hi - val2.hi);
                        }
                        else
                        {
                            var v2 = (+val2);
                            return (val1.hi == v2) ? val1.lo : (val1.hi - v2);
                        }
                    }
                    else if (val2 instanceof nexacro.Decimal)
                    {
                        var v1 = (+val1);
                        return (val2.hi == v1) ? -val2.lo : (v1 - val2.hi);
                    }
                    else if (coltype == 4)
                    {
                        var compval1 = new nexacro.Decimal(val1);
                        var compval2 = new nexacro.Decimal(val2);
                        var ret = (compval1.hi == compval2.hi) ? (compval1.lo - compval2.lo) : (compval1.hi - compval2.hi);
                        compval1 = null;
                        compval2 = null;
                        return ret;
                    }
                    return (+val1 == +val2) ? 0 : (+val1 > +val2 ? 1 : -1);
                }
                else if (coltype >= 5 && coltype <= 7)
                {
                    if (val1 === "" || val2 === "")
                        return val1 > val2 ? 1 : -1;

                    return val1.date.valueOf() - val2.date.valueOf();
                }
                else if (coltype >= 2 && coltype <= 3)
                {
                    return (+val1 == +val2) ? 0 : (+val1 > +val2 ? 1 : -1);
                }
                else
                {
                    var collation = this._p_collation;
                    if (!locale && (collation == "none" || !collation) && !bSysLang) //check
                    {
                        return (val1 == val2) ? 0 : (val1 > val2 ? 1 : -1);
                    }
                    else
                    {
                        if (!locale)
                        {
                            if (collation == "currentlocale")
                            {
                                locale = this._getLocale().replace("_", "-");
                            }
                            else if (collation == "systemlanguage")
                            {
                                ;//do nothing
                            }
                            else if (collation)
                                locale = collation.replace("_", "-");
                        }
                        return nexacro._localeCompare(val1, val2, locale, localeoption);
                    }
                }
            }
            else if (val1)
            {
                if ((val1 instanceof nexacro.Decimal) && val1.isZero())
                    return 0;
                return 1;
            }
            else if (val2)
            {
                if ((val2 instanceof nexacro.Decimal) && val2.isZero())
                    return 0;
                return -1;
            }
            else
            {
                return 0;
            }
        },
        "_getSumValue": function (records, colidx, start, end, coltype)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            var sum;

            if (coltype == 4)
            {  // BIGDECIMAL
                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Decimal_loopFn);
                return sum.isNaN() ? 0 : sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Value_loopFn);
                return (typeof sum == "number" && !isNaN(sum)) ? sum : sum | 0;
            }
        },
        "_getSumExpr": function (records, exprFn, start, end, args)
        {
            var sum = 0;
            var isdecimal = false;

            function __Expr_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var colval = exprFn.call(this, i, i, null, this, records, rowRow, args);
                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                            {
                                sum += (colval);
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Expr_loopFn);

            if (isdecimal)
            {
                return sum.isNaN() ? 0 : sum;
            }

            return (typeof sum == "number" && !isNaN(sum)) ? sum : sum | 0;
        },
        "_getRowsSumValue": function (records, rows, colidx, coltype)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            var sum;

            if (coltype == 4)
            {  // BIGDECIMAL
                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Decimal_loopFn);
                return sum.isNaN() ? 0 : sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);
                return (typeof sum == "number" && !isNaN(sum)) ? sum : sum | 0;
            }
        },
        "_getRowsSumExpr": function (records, rows, exprFn, args)
        {
            var sum = 0;
            var isdecimal = false;

            function __Expr_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    var colval = exprFn.call(this, idx, idx, null, this, records, rowRow, args);
                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                            {
                                sum += (colval);
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);

            if (isdecimal)
                return sum;

            return (typeof sum == "number") ? sum : sum | 0;
        },
        "_getCaseSumValue": function (records, cmpFn, colidx, start, end, coltype, args)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            var sum;

            if (coltype == 4)
            {  // BIGDECIMAL
                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                        if (cmp)
                        {
                            var colval = rowRow[colidx];
                            if (colval)
                            {
                                if (colval instanceof nexacro.Decimal)
                                    sum.addDecimal(colval);
                                else
                                    sum.addDouble(+colval);
                            }
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Decimal_loopFn);
                return sum.isNaN() ? 0 : sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                        if (cmp)
                        {
                            var colval = rowRow[colidx];
                            if (colval)
                            {
                                sum += (+colval);
                            }
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Value_loopFn);
                return (typeof sum == "number" && !isNaN(sum)) ? sum : sum | 0;
            }
        },
        "_getCaseSumExpr": function (records, cmpFn, valFn, start, end, cmpargs, valargs)
        {
            var sum = 0;
            var isdecimal = false;

            function __Expr_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, cmpargs);
                    if (cmp)
                    {
                        var colval = valFn.call(this, i, i, null, this, records, rowRow, valargs);
                        if (colval)
                        {
                            if (isdecimal)
                            {
                                if (colval instanceof nexacro.Decimal)
                                    sum.addDecimal(colval);
                                else
                                    sum.addDouble(colval);
                            }
                            else
                            {
                                if (colval instanceof nexacro.Decimal)
                                {
                                    sum = new nexacro.Decimal(sum);
                                    sum.addDecimal(colval);
                                    isdecimal = true;
                                }
                                else
                                {
                                    sum += (colval);
                                }
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Expr_loopFn);

            if (isdecimal)
                return sum.isNaN() ? 0 : sum;

            return (typeof sum == "number" && !isNaN(sum)) ? sum : sum | 0;
        },
        "_getAvgValue": function (records, colidx, start, end, coltype, excludeNaN)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            var sum;
            var cnt = 0;

            if (coltype == 4)
            {  // BIGDECIMAL
                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var colval = rowRow[colidx];

                        if (!excludeNaN || (colval != null && colval !== ""))
                            cnt++;

                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Decimal_loopFn);

                if (cnt == 0 || sum.isNaN())
                    return NaN;

                sum.divDouble(cnt);
                return sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var colval = rowRow[colidx];

                        if (!excludeNaN || (colval != null && colval !== ""))
                            cnt++;

                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Value_loopFn);

                if (cnt == 0 || sum != sum)
                    return NaN;

                return sum / cnt;
            }
        },
        "_getAvgExpr": function (records, exprFn, start, end, excludeNaN, args)
        {
            var cnt = 0;
            var sum = 0;
            var isdecimal = false;

            function __Expr_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var colval = exprFn.call(this, i, rowRow._rawidx, null, this, records, rowRow, args);

                    if (!excludeNaN || (colval != null && !isNaN(colval) && colval !== ""))
                        cnt++;

                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                            {
                                sum += (colval);
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Expr_loopFn);

            if (cnt == 0 || sum != sum)
                return NaN;

            if (isdecimal)
            {
                sum.divDouble(cnt);
                return sum;
            }
            return (typeof sum == "number" && !isNaN(sum)) ? sum / cnt : 0;
        },
        "_getRowsAvgValue": function (records, rows, colidx, coltype, excludeNaN)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            var sum;
            var cnt = 0;

            if (coltype == 4)
            {  // BIGDECIMAL

                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];

                        if (!excludeNaN || (colval != null && colval !== ""))
                            cnt++;

                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Decimal_loopFn);

                if (cnt == 0 || sum.isNaN())
                    return NaN;

                sum.divDouble(cnt);
                return sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];

                        if (!excludeNaN || (colval != null && colval !== ""))
                            cnt++;

                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);

                if (cnt == 0 || sum != sum)
                    return NaN;

                return sum / cnt;
            }
        },
        "_getRowsAvgExpr": function (records, rows, exprFn, excludeNaN, args)
        {
            var cnt = 0;
            var sum = 0;
            var isdecimal = false;

            function __Expr_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 15))
                {
                    var colval = exprFn.call(this, idx, idx, null, this, records, rowRow, args);

                    if (!excludeNaN)
                    {
                        cnt++;
                    }
                    else
                    {
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                if (!colval.isNaN())
                                    cnt++;
                            }
                            else
                            {
                                cnt++;
                            }
                        }
                        else
                        {
                            if (colval === 0)
                                cnt++;
                        }
                    }

                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                            {
                                sum += (colval);
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);

            if (cnt == 0 || sum != sum)
                return NaN;

            if (isdecimal)
            {
                sum.divDouble(cnt);
                return sum;
            }
            return sum / cnt;
        },
        "_getCountValue": function (records, colidx, start, end, coltype)
        {
            var cnt = 0;

            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    if (colidx < 0 || rowRow[colidx] != null)
                    {
                        cnt++;
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);
            return cnt;
        },
        "_getRowsCountValue": function (records, rows, colidx, coltype)
        {
            var cnt = 0;

            function __loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    if (rowRow[colidx] != null)
                    {
                        cnt++;
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __loopFn);
            return cnt;
        }
    };

    nexacro._DatasetRuleFuncsSet["2.0"] = {
        "_isInvalidValue": function (value, coltype)
        {
            if (nexacro._isNull(value) || value === "")
                return false;

            var str = "";
            switch (coltype)
            {
                case 1:  //string
                    break;
                case 2:  //int
                case 3:  //float
                    if (!isFinite(value) || isNaN(value))
                        return true;
                    break;
                case 4:  //decimal
                    if (value instanceof nexacro.Decimal)
                    {
                        if (value.isInfinity() || value.isNaN())
                            return true;
                    }
                    else if (!isFinite(value) || isNaN(value))
                        return true;

                    break;
                case 5: //date
                case 6:  //time
                case 7:  //datetime
                    //str = value.toString();
                    if (value._isInvalidDate ? value._isInvalidDate() : isNaN(value.valueOf()))
                        return true;
                    break;
                case 8:  //blob
                    break;
                case 9:  //variant
                    break;
                default:
                    break;
            }

            return false;
        },
        "_compareValue": function (val1, val2, coltype, locale, localeoption, bSysLang)
        {
            if (val1 != null && val2 != null)
            {
                if (coltype == 4 || coltype < 0)
                {
                    if ((val1 instanceof nexacro.Decimal))
                    {
                        if (val2 instanceof nexacro.Decimal)
                        {
                            if (val1.isNaN())
                            {
                                if (val2.isNaN())
                                    return 0;

                                return 1;
                            }

                            if (val2.isNaN())
                                return -1;

                            return (val1.hi == val2.hi) ? (val1.lo - val2.lo) : (val1.hi - val2.hi);
                        }
                        else
                        {
                            if (val1.isNaN())
                            {
                                if (isNaN(val2))
                                    return 0;

                                return 1;
                            }

                            if (isNaN(val2) || val2 === "")
                                return -1;

                            var v2 = (+val2);
                            return (val1.hi == v2) ? val1.lo : (val1.hi - v2);
                        }
                    }
                    else if (val2 instanceof nexacro.Decimal)
                    {
                        if (isNaN(val1))
                        {
                            if (val2.isNaN())
                                return 0;

                            return 1;
                        }

                        if (val2.isNaN())
                            return -1;

                        if (val1 === "")
                            return 1;

                        var v1 = (+val1);
                        return (val2.hi == v1) ? -val2.lo : (v1 - val2.hi);
                    }

                    if (isNaN(val1))
                    {
                        if (isNaN(val2))
                            return 0;

                        return 1;
                    }

                    if (isNaN(val2))
                    {
                        return -1;
                    }

                    if (val1 === "")
                    {
                        if (val2 === "")
                            return 0;

                        return 1;
                    }

                    if (val2 === "")
                        return -1;

                    if (coltype == 4)
                    {
                        const compval1 = new nexacro.Decimal(val1);
                        const compval2 = new nexacro.Decimal(val2);
                        var ret = (compval1.hi === compval2.hi) ? (compval1.lo - compval2.lo) : (compval1.hi - compval2.hi);
                        return ret;
                    }
                    return (val1 == val2) ? 0 : (val1 > val2 ? 1 : -1);
                }
                else if (coltype >= 5 && coltype <= 7)  //date,time,datetime
                {
                    const compval1 = val1.date ? val1.date.valueOf() : val1;
                    const compval2 = val2.date ? val2.date.valueOf() : val2;

                    if (isNaN(compval1) && isNaN(compval2))
                        return 0;

                    if (isNaN(compval1))
                        return 1;

                    if (isNaN(compval2))
                        return -1;

                    if (compval1 === "" || compval2 === "")
                    {
                        if (compval1 == compval2)
                            return 0;

                        if (compval1 === "")
                            return 1;

                        return -1;
                    }

                    return compval1 - compval2;
                }
                else if (coltype >= 2 && coltype <= 3)  //int,float
                {
                    if (isNaN(val1))
                    {
                        if (isNaN(val2))
                            return 0;

                        return 1;
                    }

                    if (isNaN(val2))
                    {
                        return -1;
                    }

                    if (val1 === "")
                    {
                        if (val2 === "")
                            return 0;

                        return 1;
                    }

                    if (val2 === "")
                        return -1;

                    if (+val1 == +val2)
                        return 0;

                    return (+val1 > +val2 ? 1 : -1);
                }
                else if (coltype == 1) //string
                {
                    var collation = this._p_collation;
                    if (!locale && (collation == "none" || !collation) && !bSysLang) //check
                    {
                        if (val1 == val2)
                            return 0;

                        if (val1 === "")
                            return -1;

                        if (val2 === "")
                            return 1;

                        return (val1 > val2 ? 1 : -1);
                    }
                    else
                    {
                        if (!locale)
                        {
                            if (collation == "currentlocale")
                            {
                                locale = this._getLocale().replace("_", "-");
                            }
                            else if (collation == "systemlanguage")
                            {
                                ;//do nothing
                            }
                            else
                                locale = collation.replace("_", "-");
                        }
                        return nexacro._localeCompare(val1, val2, locale, localeoption);
                    }
                }
                else    //etc..
                {
                    return (val1 == val2) ? 0 : (val1 > val2 ? 1 : -1);
                }

            }
            else if ((val1 != null) || val1 === "")   // val1 != null
            {
                return -1;
            }
            else if ((val2 != null) || val2 === "")   // val1 == null
            {
                return 1;
            }
            else
            {
                return 0;
            }
        },
        "_getSumValue": function (records, colidx, start, end, coltype)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }
            var sum;
            if (coltype == 4)
            {  // BIGDECIMAL
                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Decimal_loopFn);
                return sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Value_loopFn);
                return (typeof sum == "number") ? sum : sum | 0;
            }
        },
        "_getSumExpr": function (records, exprFn, start, end, args)
        {
            var sum = 0;
            var isdecimal = false;
            function __Expr_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var colval = exprFn.call(this, i, i, null, this, records, rowRow, args);
                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                                sum += (colval);
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Expr_loopFn);

            if (isdecimal)
                return sum;

            return (typeof sum == "number") ? sum : sum | 0;
        },
        "_getRowsSumValue": function (records, rows, colidx, coltype)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            var sum;
            if (coltype == 4)
            {  // BIGDECIMAL
                sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Decimal_loopFn);
                return sum;
            }
            else
            {
                sum = 0;
                function __Value_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);
                return (typeof sum == "number") ? sum : sum | 0;
            }
        },
        "_getRowsSumExpr": function (records, rows, exprFn, args)
        {
            var sum = 0;
            var isdecimal = false;
            function __Expr_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 15))
                {
                    var colval = exprFn.call(this, idx, idx, null, this, records, rowRow, args);
                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                                sum += (colval);
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);
            if (isdecimal)
                return sum.isNaN() ? 0 : sum;

            return (typeof sum == "number" && !isNaN(sum)) ? sum : sum | 0;
        },
        "_getCaseSumValue": function (records, cmpFn, colidx, start, end, coltype, args)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            if (coltype == 4)
            {  // BIGDECIMAL
                var sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                        if (cmp)
                        {
                            var colval = rowRow[colidx];
                            if (colval)
                            {
                                if (colval instanceof nexacro.Decimal)
                                    sum.addDecimal(colval);
                                else
                                    sum.addDouble(+colval);
                            }
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Decimal_loopFn);
                return sum;
            }
            else
            {
                var sum = 0;
                function __Value_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(records[i]);
                    if (rowRow._rtype & 7)
                    {
                        var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                        if (cmp)
                        {
                            var colval = rowRow[colidx];
                            if (colval)
                            {
                                sum += (+colval);
                            }
                        }
                    }
                }
                nexacro.__forLoop(this, start, end, __Value_loopFn);
                return (typeof sum == "number") ? sum : sum | 0;
            }
        },
        "_getCaseSumExpr": function (records, cmpFn, valFn, start, end, cmpargs, valargs)
        {
            var sum = 0;
            var isdecimal = false;
            function __Expr_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, cmpargs);
                    if (cmp)
                    {
                        var colval = valFn.call(this, i, i, null, this, records, rowRow, valargs);
                        if (colval)
                        {
                            if (isdecimal)
                            {
                                if (colval instanceof nexacro.Decimal)
                                    sum.addDecimal(colval);
                                else
                                    sum.addDouble(colval);
                            }
                            else
                            {
                                if (colval instanceof nexacro.Decimal)
                                {
                                    sum = new nexacro.Decimal(sum);
                                    sum.addDecimal(colval);
                                    isdecimal = true;
                                }
                                else
                                    sum += (colval);
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Expr_loopFn);
            if (isdecimal)
                return sum;
            return (typeof sum == "number") ? sum : sum | 0;
        },
        "_getAvgExpr": function (records, exprFn, start, end, excludeNaN, args)
        {
            var cnt = 0;
            var sum = 0;
            var isdecimal = false;
            function __Expr_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var colval = exprFn.call(this, i, rowRow._rawidx, null, this, records, rowRow, args);

                    if (!excludeNaN)
                        cnt++;
                    else
                    {
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                if (!colval.isNaN())
                                    cnt++;
                            }
                            else
                            {
                                cnt++;
                            }
                        }
                        else
                        {
                            if (colval === 0)
                                cnt++;
                        }
                    }

                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum.addDecimal(colval);
                            }
                            else
                            {
                                sum.addDouble(colval);
                            }
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                            {
                                sum += (colval);
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Expr_loopFn);
            if (cnt == 0 || sum != sum)
                return NaN;
            if (isdecimal)
            {
                sum.divDouble(cnt);
                return sum;
            }
            return sum / cnt;
        },
        "_getRowsAvgValue": function (records, rows, colidx, coltype, excludeNaN)
        {
            if (coltype != 2 && coltype != 3 && coltype != 4)
            {
                return 0;
            }

            if (coltype == 4)
            {  // BIGDECIMAL
                var cnt = 0;
                var sum = new nexacro.Decimal();
                function __Decimal_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];
                        if (!excludeNaN)
                            cnt++;
                        else
                        {
                            if (colval)
                            {
                                if (colval instanceof nexacro.Decimal)
                                {
                                    if (!colval.isNaN())
                                        cnt++;
                                }
                                else
                                {
                                    cnt++;
                                }
                            }
                            else
                            {
                                if (colval === 0)
                                    cnt++;
                            }
                        }
                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Decimal_loopFn);
                if (cnt == 0 || sum.isNaN())
                    return NaN;
                sum.divDouble(cnt);
                return sum;
            }
            else
            {
                var cnt = 0;
                var sum = 0;
                function __Value_loopFn(i)
                {
                    var idx = rows[i];
                    var rowRow = this.__getParsedRow(records[idx]);
                    if (rowRow && (rowRow._rtype & 7))
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            sum += (+colval);
                            cnt++;
                        }
                        else
                        {
                            if (!excludeNaN || colval === 0)
                                cnt++;
                        }
                    }
                }
                nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);
                if (cnt == 0 || sum != sum)
                    return NaN;
                return sum / cnt;
            }
        },
        "_getRowsAvgExpr": function (records, rows, exprFn, excludeNaN, args)
        {
            var cnt = 0;
            var sum = 0;
            var isdecimal = false;
            function __Expr_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 15))
                {
                    var colval = exprFn.call(this, idx, idx, null, this, records, rowRow, args);
                    if (!excludeNaN || (colval != null && !isNaN(colval) && (colval !== "" || colval === 0)))
                        cnt++;
                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                                sum += (colval);
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);
            if (cnt == 0 || sum != sum)
                return NaN;
            if (isdecimal)
            {
                sum.divDouble(cnt);
                return sum;
            }
            return (typeof sum == "number" && !isNaN(sum)) ? sum / cnt : 0;
        },
        "_getCountValue": function (records, colidx, start, end, coltype)
        {
            var cnt = 0;
            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    // if colidx < 0 ==> result = rowcount
                    if (colidx < 0)
                    {
                        cnt++;
                    }
                    else
                    {
                        var colval = rowRow[colidx];
                        if (colval)
                        {
                            if (!((coltype == 5 || coltype == 6 || coltype == 7) && isNaN(colval.valueOf())))
                                cnt++;

                        }
                        else
                        {
                            if ((coltype == 1 && colval === "") || colval === 0)
                                cnt++;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);
            return cnt;
        },
        "_getRowsCountValue": function (records, rows, colidx, coltype)
        {
            var cnt = 0;
            function __loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    var colval = rowRow[colidx];
                    if (colval)
                    {
                        if (!((coltype == 5 || coltype == 6 || coltype == 7) && isNaN(colval.valueOf())))
                            cnt++;

                    }
                    else
                    {
                        if ((coltype == 1 && colval === "") || colval === 0)
                            cnt++;
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __loopFn);
            return cnt;
        }
    };
    nexacro._DatasetRuleFuncsSet["2.0"]["_getAvgValue"] = nexacro._DatasetRuleFuncsSet["1.0"]["_getAvgValue"];

    nexacro._getXMLTagData = function (xmlStr, parse_pos, startTag, endTag)
    {
        var start_pos = xmlStr.indexOf(startTag, parse_pos);
        if (start_pos > -1)
        {
            var data_pos = start_pos + startTag.length;
            var end_pos = xmlStr.indexOf(endTag, data_pos), str;
            if (end_pos > -1)
            {
                str = xmlStr.substring(data_pos, end_pos);
                return [str, "", start_pos, end_pos + endTag.length];
            }
            else
            {
                str = xmlStr.substring(data_pos);
                return [str, "", start_pos, xmlStr.length];
            }
        }
        return null;
    };

    nexacro._getXMLTagData2 = function (xmlStr, parse_pos, startTag, endTag)
    {
        var start_pos = xmlStr.indexOf(startTag, parse_pos);
        if (start_pos > -1)
        {
            var attr;
            var attr_pos = start_pos + startTag.length;
            var data_pos = xmlStr.indexOf(">", attr_pos);
            if (data_pos < 0)
            {
                return null;
            }
            else if (data_pos > 0 && xmlStr.charAt(data_pos - 1) == '/')
            {
                attr = xmlStr.substring(attr_pos, data_pos - 1).trim();
                return ["", attr, start_pos, data_pos];
            }
            else
            {
                attr = xmlStr.substring(attr_pos, data_pos).trim();
            }

            data_pos++;
            var end_pos = xmlStr.indexOf(endTag, data_pos), str;
            if (end_pos > -1)
            {
                str = xmlStr.substring(data_pos, end_pos);
                return [str, attr, start_pos, end_pos + endTag.length];
            }
            else
            {
                str = xmlStr.substring(data_pos);
                return [str, attr, start_pos, xmlStr.length];
            }
        }
        return null;
    };

    nexacro._getXMLTagData3 = function (xmlStr, parse_pos, startTag, endTag)
    {
        var start_pos = xmlStr.indexOf(startTag, parse_pos);
        if (start_pos > -1)
        {
            var start_pos2 = start_pos + startTag.length;
            var data_pos, end_pos, str;
            if (xmlStr.charAt(start_pos2) == " ")
            {
                var attr;
                var attr_pos = start_pos2 + 1;
                data_pos = xmlStr.indexOf(">", attr_pos);
                if (data_pos < 0)
                {
                    return null;
                }
                else if (data_pos > 0 && xmlStr.charAt(data_pos - 1) == '/')
                {
                    attr = xmlStr.substring(attr_pos, data_pos - 1).trim();
                    return ["", attr, start_pos, data_pos];
                }
                else
                {
                    attr = xmlStr.substring(attr_pos, data_pos).trim();
                }

                data_pos++;
                end_pos = xmlStr.indexOf(endTag, data_pos);
                if (end_pos > -1)
                {
                    str = xmlStr.substring(data_pos, end_pos);
                    return [str, attr, start_pos, end_pos + endTag.length];
                }
                else
                {
                    str = xmlStr.substring(data_pos);
                    return [str, attr, start_pos, xmlStr.length];
                }
            }
            else if (xmlStr.charAt(start_pos2) == "/")
            {
                start_pos2 = start_pos2 + 1;
                if (xmlStr.charAt(start_pos2) == ">")
                {
                    return ["", "", start_pos, start_pos2];
                }
            }
            else
            {
                if (xmlStr.charAt(start_pos + 1) == ">")
                    start_pos = start_pos + 1;

                data_pos = start_pos + startTag.length;
                end_pos = xmlStr.indexOf(endTag, data_pos);
                if (end_pos > -1)
                {
                    str = xmlStr.substring(data_pos, end_pos);
                    return [str, "", start_pos, end_pos + endTag.length];
                }
                else
                {
                    str = xmlStr.substring(data_pos);
                    return [str, "", start_pos, xmlStr.length];
                }
            }
        }
        return null;
    };

    nexacro._getXMLTagData4 = function (xmlStr, parse_pos, startTag)
    {
        var start_pos = xmlStr.indexOf(startTag, parse_pos);
        if (start_pos > -1)
        {
            var attr_pos = start_pos + startTag.length;
            var end_pos = xmlStr.indexOf("/>", attr_pos), attr;
            if (end_pos > -1)
            {
                attr = xmlStr.substring(attr_pos, end_pos).trim();
                return ["", attr, attr_pos, end_pos + 2];
            }
            else
            {
                attr = xmlStr.substring(attr_pos).trim();
                return ["", attr, attr_pos, xmlStr.length];
            }
        }
        return null;
    };

    nexacro._getXMLAttributeID = function (attrStr)
    {
        var attr_pos = attrStr.indexOf("id=\"");
        if (attr_pos > -1)
        {
            var data_pos = attr_pos + 4;
            var end_pos = attrStr.indexOf("\"", data_pos);
            if (end_pos > -1)
            {
                return attrStr.substring(data_pos, end_pos);
            }
            return "";
        }
        return null;
    };

    nexacro._getXMLAttributeType = function (attrStr)
    {
        var attr_pos = attrStr.indexOf("type=\"");
        if (attr_pos > -1)
        {
            var data_pos = attr_pos + 6;
            var end_pos = attrStr.indexOf("\"", data_pos);
            if (end_pos > -1)
            {
                return attrStr.substring(data_pos, end_pos);
            }
            return "";
        }
        return null;
    };

    nexacro._getXMLAttributeData = function (attrStr, attrid)
    {
        var attr_pos = attrStr.indexOf(attrid + "=\"");
        if (attr_pos > -1)
        {
            var data_pos = attr_pos + attrid.length + 2;
            var end_pos = attrStr.indexOf("\"", data_pos);
            if (end_pos > -1)
            {
                return attrStr.substring(data_pos, end_pos);
            }
            return "";
        }
        return null;
    };


    // 현재 Transaction 처리중인 Form List
    nexacro._appendCommContext = function (context)
    {
        if (!context)
            return;

        nexacro._comm_contextlist.push(context);
    };

    nexacro._removeCommContext = function (context)
    {
        if (!context)
            return;

        var contexts = nexacro._comm_contextlist;
        var cnt = contexts.length;
        for (var i = 0; i < cnt; i++)
        {
            var cur_context = contexts[i];
            if (cur_context == context)
            {
                for (var j = i; j < cnt - 1; j++)
                {
                    contexts[j] = contexts[j + 1];
                }
                contexts[cnt - 1] = null;
                contexts.length = contexts.length - 1;
                break;
            }
        }
    };

    // ----------------- internal API finctions ------------------ //
    nexacro.__whileLoop = function (thisArg, _func)
    {
        while (true)
        {
            if (_func.call(thisArg))
                break;
        }
    };
    nexacro.__forLoop = function (thisArg, i, end, _func)
    {
        for (; i < end; i++)
        {
            if (_func.call(thisArg, i))
                return i;
        }
        return i;
    };
    nexacro.__reverseForLoop = function (thisArg, i, end, _func)
    {
        for (; i >= end; i--)
        {
            if (_func.call(thisArg, i))
                return i;
        }
        return i;
    };

    //==============================================================================
    //nexacro.Date
    //==============================================================================
    nexacro.Date = function (year, month, day, hours, minutes, seconds, milliseconds)
    {
        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) == "2.0")
        {
            if (arguments.length > 0 && year === undefined)
            {
                this.date = new Date(undefined);     // undefined : Invalid Date
                return;
            }
        }

        var bsetfullyear = true;
        if (year == null)
        {
            this._timecheck = true;
            this.date = new Date();
            bsetfullyear = false;
        }
        else if (month == null && (typeof year == "string" || year > 9999))
        {
            this._timecheck = true;
            this.date = new Date(year);
            bsetfullyear = false;
        }
        else if (day == null)
        {
            year = (parseInt(year, 10) | 0);
            month = (parseInt(month, 10) | 0);
            this.date = new Date(year, month);
        }
        else if (hours == null)
        {
            year = (parseInt(year, 10) | 0);
            month = (parseInt(month, 10) | 0);
            day = (parseInt(day, 10) | 0);
            this.date = new Date(year, month, day);
        }
        else if (minutes == null)
        {
            this._timecheck = true;
            year = (parseInt(year, 10) | 0);
            month = (parseInt(month, 10) | 0);
            day = (parseInt(day, 10) | 0);
            hours = (parseInt(hours, 10) | 0);
            this.date = new Date(year, month, day, hours);
        }
        else if (seconds == null)
        {
            this._timecheck = true;
            year = (parseInt(year, 10) | 0);
            month = (parseInt(month, 10) | 0);
            day = (parseInt(day, 10) | 0);
            hours = (parseInt(hours, 10) | 0);
            minutes = (parseInt(minutes, 10) | 0);
            this.date = new Date(year, month, day, hours, minutes);
        }
        else if (milliseconds == null)
        {
            this._timecheck = true;
            year = (parseInt(year, 10) | 0);
            month = (parseInt(month, 10) | 0);
            day = (parseInt(day, 10) | 0);
            hours = (parseInt(hours, 10) | 0);
            minutes = (parseInt(minutes, 10) | 0);
            seconds = (parseInt(seconds, 10) | 0);
            this.date = new Date(year, month, day, hours, minutes, seconds);
        }
        else
        {
            this._timecheck = true;
            year = (parseInt(year, 10) | 0);
            month = (parseInt(month, 10) | 0);
            day = (parseInt(day, 10) | 0);
            hours = (parseInt(hours, 10) | 0);
            minutes = (parseInt(minutes, 10) | 0);
            seconds = (parseInt(seconds, 10) | 0);
            milliseconds = (parseInt(milliseconds, 10) | 0);
            this.date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
        }

        if (bsetfullyear)
        {
            if (year <= 99 && year >= 0)
            {

                var base_date = new Date(0, 0, 1);
                var base_fullyear = base_date.getFullYear();

                var fullyear = this.date.getFullYear();
                var calc_year = fullyear - base_fullyear;

                this.date.setFullYear(calc_year);
            }
        }

        return;
    };

    var _pDate = nexacro._createPrototype(nexacro.Object, nexacro.Date);
    nexacro.Date.prototype = _pDate;

    _pDate._type_name = "Date";
    _pDate._timecheck = false;
    _pDate._timeonly = false;

    _pDate.getFullYear = function ()
    {
        return this.date.getFullYear();
    };

    _pDate.setFullYear = function (year, month, day)
    {
        if (day != null)
        {
            this.date.setFullYear(year, month, day);
        }
        else if (month != null)
        {
            this.date.setFullYear(year, month);
        }
        else
        {
            this.date.setFullYear(year);
        }
    };

    _pDate.getYear = function ()
    {
        return this.date.getYear();
    };

    _pDate.setYear = function (year, month, day)
    {
        if (day != null)
        {
            this.date.setYear(year, month, day);
        }
        else if (month != null)
        {
            this.date.setYear(year, month);
        }
        else
        {
            this.date.setYear(year);
        }
    };

    _pDate.getMonth = function ()
    {
        return this.date.getMonth();
    };

    _pDate.setMonth = function (month, day)
    {
        if (day == null)
        {
            this.date.setMonth(month);
        }
        else
        {
            this.date.setMonth(month, day);
        }
    };

    _pDate.getDate = function ()
    {
        return this.date.getDate();
    };

    _pDate.setDate = function (day)
    {
        this.date.setDate(day);
    };

    _pDate.getDay = function ()
    {
        return this.date.getDay();
    };

    _pDate.getHours = function ()
    {
        return this.date.getHours();
    };

    _pDate.getHalfHours = function ()
    {
        var hh = this.date.getHours();
        if (hh > 12)
            hh -= 12;
        else if (hh == 0)
            hh = 12;

        return hh;
    };

    _pDate.setHours = function (hour, min, sec, millisec)
    {
        if (millisec != null)
        {
            this._timecheck = true;
            this.date.setHours(hour, min, sec, millisec);
        }
        else if (sec != null)
        {
            this._timecheck = true;
            this.date.setHours(hour, min, sec);
        }
        else if (min != null)
        {
            this._timecheck = true;
            this.date.setHours(hour, min);
        }
        else
        {
            this._timecheck = (hour != null);
            this.date.setHours(hour);
        }
    };

    _pDate.getMinutes = function ()
    {
        return this.date.getMinutes();
    };

    _pDate.setMinutes = function (min, sec, millisec)
    {
        if (millisec != null)
        {
            this._timecheck = true;
            this.date.setMinutes(min, sec, millisec);
        }
        else if (sec != null)
        {
            this._timecheck = true;
            this.date.setMinutes(min, sec);
        }
        else
        {
            this._timecheck = (min != null);
            this.date.setMinutes(min);
        }
    };

    _pDate.getSeconds = function ()
    {
        return this.date.getSeconds();
    };

    _pDate.setSeconds = function (sec, millisec)
    {
        if (millisec != null)
        {
            this._timecheck = true;
            this.date.setSeconds(sec, millisec);
        }
        else
        {
            this._timecheck = (sec != null);
            this.date.setSeconds(sec);
        }
    };

    _pDate.getMilliseconds = function ()
    {
        return this.date.getMilliseconds();
    };

    _pDate.setMilliseconds = function (millisec)
    {
        this._timecheck = (millisec != null);
        this.date.setMilliseconds(millisec);
    };

    _pDate.getTime = function ()
    {
        return this.date.getTime();
    };

    _pDate.setTime = function (millisec)
    {
        this._timecheck = (millisec != null);
        this.date.setTime(millisec);
    };

    _pDate.getTimezoneOffset = function ()
    {
        return this.date.getTimezoneOffset();
    };

    _pDate.getUTCFullYear = function ()
    {
        return this.date.getUTCFullYear();
    };

    _pDate.setUTCFullYear = function (year, month, day)
    {
        if (day != null)
        {
            this.date.setUTCFullYear(year, month, day);
        }
        else if (month != null)
        {
            this.date.setUTCFullYear(year, month);
        }
        else
        {
            this.date.setUTCFullYear(year);
        }
    };

    _pDate.getUTCMonth = function ()
    {
        return this.date.getUTCMonth();
    };

    _pDate.setUTCMonth = function (month, day)
    {
        if (day == null)
        {
            this.date.setUTCMonth(month);
        }
        else
        {
            this.date.setUTCMonth(month, day);
        }
    };

    _pDate.getUTCDate = function ()
    {
        return this.date.getUTCDate();
    };

    _pDate.setUTCDate = function (day)
    {
        this.date.setUTCDate(day);
    };

    _pDate.getUTCDay = function ()
    {
        return this.date.getUTCDay();
    };

    _pDate.getUTCHours = function ()
    {
        return this.date.getUTCHours();
    };

    _pDate.setUTCHours = function (hour, min, sec, millisec)
    {
        if (millisec != null)
        {
            this._timecheck = true;
            this.date.setUTCHours(hour, min, sec, millisec);
        }
        else if (sec != null)
        {
            this._timecheck = true;
            this.date.setUTCHours(hour, min, sec);
        }
        else if (min != null)
        {
            this._timecheck = true;
            this.date.setUTCHours(hour, min);
        }
        else
        {
            this._timecheck = (hour != null);
            this.date.setUTCHours(hour);
        }
    };

    _pDate.getUTCMinutes = function ()
    {
        return this.date.getUTCMinutes();
    };

    _pDate.setUTCMinutes = function (min, sec, millisec)
    {
        if (millisec != null)
        {
            this._timecheck = true;
            this.date.setUTCMinutes(min, sec, millisec);
        }
        else if (sec != null)
        {
            this._timecheck = true;
            this.date.setUTCMinutes(min, sec);
        }
        else
        {
            this._timecheck = (min != null);
            this.date.setUTCMinutes(min);
        }
    };

    _pDate.getUTCSeconds = function ()
    {
        return this.date.getUTCSeconds();
    };

    _pDate.setUTCSeconds = function (sec, millisec)
    {
        if (millisec == null)
        {
            this._timecheck = (sec != null);
            this.date.setUTCSeconds(sec);
        }
        else
        {
            this._timecheck = true;
            this.date.setUTCSeconds(sec, millisec);
        }
    };

    _pDate.getUTCMilliseconds = function ()
    {
        return this.date.getUTCMilliseconds();
    };

    _pDate.setUTCMilliseconds = function (millisec)
    {
        this._timecheck = (millisec != null);
        this.date.setUTCMilliseconds(millisec);
    };

    _pDate.parse = function (datestring)
    {
        return Date.parse(datestring);
    };

    _pDate.UTC = function (year, month, day, hours, minutes, seconds, ms)
    {
        if (!month) return Date.UTC(year);
        else if (!day) return Date.UTC(year, month);
        else if (!hours) return Date.UTC(year, month, day);
        else if (!minutes) return Date.UTC(year, month, day, hours);
        else if (!seconds) return Date.UTC(year, month, day, hours, minutes);
        else if (!ms) return Date.UTC(year, month, day, hours, minutes, seconds)
        else return Date.UTC(year, month, day, hours, minutes, seconds, ms);
    };

    _pDate.valueOf = function ()
    {
        return this.toString();
    };

    _pDate.toGMTString = function ()
    {
        return this.date.toGMTString();
    };

    _pDate.toDateString = function ()
    {
        return this.date.toDateString();
    };

    _pDate.toTimeString = function ()
    {
        return this.date.toTimeString();
    };

    _pDate.toLocaleDateString = function (locale)
    {
        //return this.date.toLocaleDateString();
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var format_string = this.getLocaleFormatString(locale, locale_info.date_format);



        return format_string;
    };

    _pDate.toLocaleTimeString = function (locale)
    {
        //return this.date.toLocaleTimeString();
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var format_string = this.getLocaleFormatString(locale, locale_info.time_format);

        return format_string;
    };

    _pDate.toString = function ()
    {
        if (!this.date || isNaN(this.date.valueOf()))
            return "Invalid Date";

        var y = this.getFullYear();

        var m = this.getMonth() + 1;
        var d = this.getDate();
        var h = this.getHours();
        var min = this.getMinutes();
        var sec = this.getSeconds();
        var millisec = this.getMilliseconds();

        y = y !== null ? this.toZeroDigitString(y, 4) : "0000";
        m = m ? this.toZeroDigitString(m, 2) : m;
        d = d !== null ? this.toZeroDigitString(d, 2) : d;
        h = h !== null ? this.toZeroDigitString(h, 2) : h;
        min = min !== null ? this.toZeroDigitString(min, 2) : min;
        sec = sec !== null ? this.toZeroDigitString(sec, 2) : sec;
        millisec = millisec !== null ? this.toZeroDigitString(millisec, 3) : millisec;

        if (this._timecheck)
        {
            if (this._timeonly)
            {
                return "" + h + min + sec + millisec;
            }
            else
            {
                return "" + y + m + d + h + min + sec + millisec;
            }
        }
        else
        {
            return "" + y + m + d;
        }
    };

    _pDate.toLocaleString = function (locale)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var format_string = this.getLocaleFormatString(locale, locale_info.date_time_format);

        return format_string;
    };

    _pDate.toUTCString = function ()
    {
        return this.date.toUTCString();
    };

    _pDate.toZeroDigitString = function (v, d)
    {
        var zero = "";
        v = v.toString();

        if (v.length < d)
        {
            for (var i = 0; i < d - v.length; i++)
            {
                zero += "0";
            }
        }
        return zero + v;
    };

    _pDate.getLocaleFormatString = function (locale, format, bLTRMark)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var format_string = format;

        //format
        format_string = format_string.replace(/%r/g, locale_info.time_format_ampm);
        format_string = format_string.replace(/%x/g, locale_info.date_format);
        format_string = format_string.replace(/%X/g, locale_info.time_format);
        format_string = format_string.replace(/%T/g, "%H:%M:%S");

        //locale language
        if (bLTRMark === true)
        {
            format_string = format_string.replace(/%Y/g, "\u200E%Y");
            format_string = format_string.replace(/%y/g, "\u200E%y");
            format_string = format_string.replace(/%d/g, "\u200E%d");
            format_string = format_string.replace(/%e/g, "\u200E%e");
        }

        format_string = format_string.replace(/%a/g, this.toLocaleWeekDayString(locale, "short"));
        format_string = format_string.replace(/%A/g, this.toLocaleWeekDayString(locale, "long"));
        format_string = format_string.replace(/%b/g, this.toLocaleMonthString(locale, "short"));
        format_string = format_string.replace(/%B/g, this.toLocaleMonthString(locale, "long"));
        format_string = format_string.replace(/%p/g, this.toLocaleAMPMString(locale));

        //date
        format_string = format_string.replace(/%y/g, this.getYear());
        format_string = format_string.replace(/%Y/g, this.getFullYear());
        format_string = format_string.replace(/%n/g, this.getMonth() + 1);
        format_string = format_string.replace(/%m/g, nexacro._toString(this.getMonth() + 1).padLeft(2, "0"));
        format_string = format_string.replace(/%d/g, nexacro._toString(this.getDate()).padLeft(2, "0"));
        format_string = format_string.replace(/%e/g, this.getDate());

        //time
        format_string = format_string.replace(/%H/g, this.getHours());
        format_string = format_string.replace(/%l/g, this.getHours());
        format_string = format_string.replace(/%I/g, this.getHalfHours());
        format_string = format_string.replace(/%M/g, this.getMinutes());
        format_string = format_string.replace(/%S/g, this.getSeconds());

        //etc
        format_string = format_string.replace(/\\a/g, "a");
        format_string = format_string.replace(/\\m/g, "m");
        format_string = format_string.replace(/\\d/g, "d");
        return format_string;
    };

    _pDate._getLocaleFormatString2 = function (locale, format)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var format_string = format;

        //date
        format_string = format_string.replace(/yyyy/g, this.getFullYear());
        format_string = format_string.replace(/yy/g, nexacro._toString(this.getFullYear()).substr(2, 2));
        format_string = format_string.replace(/MMMM/g, this.toLocaleMonthString(locale, "long"));
        format_string = format_string.replace(/MMM/g, this.toLocaleMonthString(locale, "short"));
        format_string = format_string.replace(/MM/g, nexacro._toString(this.getMonth() + 1).padLeft(2, "0"));
        format_string = format_string.replace(/M/g, this.getMonth() + 1);
        format_string = format_string.replace(/dddd/g, this.toLocaleWeekDayString(locale, "long"));
        format_string = format_string.replace(/ddd/g, this.toLocaleWeekDayString(locale, "short"));
        format_string = format_string.replace(/dd/g, nexacro._toString(this.getDate()).padLeft(2, "0"));
        format_string = format_string.replace(/d/g, this.getDate());

        //time
        format_string = format_string.replace(/aa/g, this.toLocaleAMPMString(locale));
        format_string = format_string.replace(/HH/g, nexacro._toString(this.getHours()).padLeft(2, "0"));
        format_string = format_string.replace(/H/g, this.getHours());
        format_string = format_string.replace(/hh/g, nexacro._toString(this.getHalfHours()).padLeft(2, "0"));
        format_string = format_string.replace(/h/g, this.getHalfHours());
        format_string = format_string.replace(/mm/g, nexacro._toString(this.getMinutes()).padLeft(2, "0"));
        format_string = format_string.replace(/m/g, this.getMinutes());
        format_string = format_string.replace(/ss/g, nexacro._toString(this.getSeconds()).padLeft(2, "0"));
        format_string = format_string.replace(/s/g, this.getSeconds());

        return format_string;
    };

    _pDate.toLocaleWeekDayString = function (locale, option)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var day = this.getDay();
        var weekday_string = "";

        switch (option)
        {
            case "short":
                {
                    weekday_string = locale_info.weekday_names_short[day];
                }
                break;
            case "narrow":
                {
                    weekday_string = locale_info.weekday_names_narrow[day];
                }
                break;
            case "long":
            default:
                {
                    weekday_string = locale_info.weekday_names_long[day];
                }
                break;
        }

        return weekday_string;
    };

    _pDate.toLocaleMonthString = function (locale, option)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var month = this.getMonth();
        var month_string = "";

        switch (option)
        {
            case "short":
                {
                    month_string = locale_info.month_names_short[month];
                }
                break;
            case "narrow":
                {
                    month_string = locale_info.month_names_narrow[month];
                }
                break;
            case "long":
            default:
                {
                    month_string = locale_info.month_names_long[month];
                }
                break;
        }

        return month_string;
    };

    _pDate.toLocaleAMPMString = function (locale)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var hours = this.getHours();
        var ampm_string = "";

        if (hours >= 12)
        {
            ampm_string = locale_info.ampm[1];
            if (!ampm_string)
            {
                ampm_string = "PM";
            }
        }
        else
        {
            ampm_string = locale_info.ampm[0];
            if (!ampm_string)
            {
                ampm_string = "AM";
            }
        }

        return ampm_string;
    };

    _pDate.addYear = function (v)
    {
        return this.date.setFullYear(this.date.getFullYear() + v);
    };

    _pDate.addMonth = function (v)
    {
        return this.date.setMonth(this.date.getMonth() + v);
    };

    _pDate.addDate = function (v)
    {
        return this.date.setDate(this.date.getDate() + v);
    };

    _pDate.addHours = function (v)
    {
        this._timecheck = (v != null);
        return this.date.setHours(this.date.getHours() + v);
    };

    _pDate.addMinutes = function (v)
    {
        this._timecheck = (v != null);
        return this.date.setMinutes(this.date.getMinutes() + v);
    };

    _pDate.addSeconds = function (v)
    {
        this._timecheck = (v != null);
        return this.date.setSeconds(this.date.getSeconds() + v);
    };

    _pDate.addMilliseconds = function (v)
    {
        this._timecheck = (v != null);
        return this.date.setMilliseconds(this.date.getMilliseconds() + v);
    };

    _pDate._isInvalidDate = function ()
    {
        if (!this.date || isNaN(this.date.valueOf()))
            return true;

        var year = this.date.getFullYear();

        if (year < 0 || year > 9999)
            return true;

        return false;
    };

    _pDate.clone = function ()
    {
        var obj = new nexacro.Date();
        obj.date = new Date(this.date.getTime());
        obj._timecheck = this._timecheck;
        obj._timeonly = this._timeonly;

        return obj;
    };

    _pDate = null;

    nexacro.DataUtilsSet = {
        "1.0":
        {
            _undefined_type: 0,
            _string_type: 1,
            _int_type: 2,
            _float_type: 3,
            _bicdecimal_type: 4,
            _dete_type: 5,
            _time_type: 6,
            _datetime_type: 7,
            _bolb_type: 8,
            _variant_type: 9,

            _typecodes: {
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5,
                "6": 6,
                "7": 7,
                "8": 8,
                "9": 9,
                "string": 1,
                "int": 2,
                "float": 3,
                "double": 3,
                "decimal": 3,
                "bigdecimal": 4,
                "date": 5,
                "time": 6,
                "datetime": 7,
                "blob": 8,
                "variant": 9
            },
            _typeint: {
                "string": 1,
                "int": 2,
                "float": 3,
                "double": 3,
                "decimal": 4,
                "bigdecimal": 4,
                "date": 5,
                "time": 6,
                "datetime": 7,
                "blob": 8,
                "variant": 9
            },
            _typeenums: [
                "string", // 1
                "int", // 2
                "float",  //3
                "bigdecimal", // 4
                "date", // 5
                "time", // 6
                "datetime", // 7
                "blob" // 8
            ],
            _typenames: [
                "undefined", // 0
                "string", // 1
                "int", // 2
                "double", // 3
                "bigdecimal", // 4
                "date", // 5
                "time", // 6
                "datetime", // 7
                "blob", // 8
                "variant" // 9
            ],
            _default_sizes: [
                8, // 0 undefined
                256, // 1 string
                4, // 2 int - NA
                8, // 3 float - NA
                16, // 4 bigdecimal - NA
                6, // 5 date - NA
                9, // 6 time - NA
                17, // 7 datetime - NA
                256, // 8 blob
                0 // 9 variant
            ],
            _default_values: [
                undefined, // 0 undefined
                "", // 1 string
                0, // 2 int
                0.0, // 3 float
                0.0, // 4 decimal
                null, // 5 date
                null, // 6 time
                null, // 7 datetime
                null, // 8 blob
                null // 9 any
            ],

            _boolean_values:
            {
                "false": false,
                "False": false,
                "FALSE": false,
                "no": false,
                "No": false,
                "NO": false,
                "n": false,
                "N": false,
                "off": false,
                "Off": false,
                "OFF": false,
                "0": false,
                "true": true,
                "True": true,
                "TRUE": true,
                "yes": true,
                "Yes": true,
                "YES": true,
                "y": true,
                "Y": true,
                "on": true,
                "On": true,
                "ON": true,
                "1": true
            },

            _init_date: new Date(0),
            _MAX_MILLISECONDS: 100000000 * 24 * 60 * 60 * 1000,
            _MIN_MILLISECONDS: -100000000 * 24 * 60 * 60 * 1000,

            getDefaultValue: function (type)
            {
                return nexacro.DataUtils._default_values[type.toLowerCase()];
            },

            getDefaultSize: function (type)
            {
                return nexacro.DataUtils._default_sizes[type.toLowerCase()];
            },

            toTypeCode: function (type)
            {
                var n = nexacro.DataUtils._typeint[type.toLowerCase()];
                return (n == null) ? 0 : n;
            },

            toTypeName: function (type)
            {
                var n = nexacro.DataUtils._typenames[type];
                return (n == null) ? "undefined" : n;
            },

            findDataType: function (value)
            {
                if ((typeof value) == "object")
                {
                    return (value instanceof Date) ? 7 : 0;
                }
                var n = nexacro.DataUtils._typenames[value];
                return (n == null) ? 0 : n;
            },

            isBinary: function (type)
            {
                return (type == 12);
            },

            toString: function (value)
            {
                if (value == null) return value;
                if (value instanceof Date) return nexacro.DataUtils._formatDateTime(value);
                return value.toString();
            },
            toStringFromText: function (value)
            {
                return value;
            },
            toStringFromXMLText: function (value)
            {
                return nexacro._decodeXml(value);
            },
            toTextFromString: function (value)
            {
                return value;
            },
            toXMLTextFromString: function (value)
            {
                return nexacro._encodeXml(value);
            },

            toInt: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (value | 0);
            },

            toIntFromText: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (value | 0);
            },
            toTextFromInt: function (value)
            {
                return (value == null) ? undefined : value + "";
            },

            toBoolean: function (value)
            {
                if (typeof value == "string")
                {
                    value = this._boolean_values[value];
                }
                return (value ? true : false);
            },
            toBooleanFromText: function (value)
            {
                value = this._boolean_values[value];
                return (value ? true : false);
            },
            toTextFromBoolean: function (value)
            {
                return (value == null) ? value : value + "";
            },

            toFloat: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (+value);
            },
            toFloatFromText: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (+value);
            },
            toTextFromFloat: function (value)
            {
                return (value == null) ? undefined : (value + "");
            },

            toNumber: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (+value);
            },
            toNumberFromText: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (+value);
            },
            toTextFromNumber: function (value)
            {
                return (value == null) ? undefined : (value + "");
            },

            toDecimal: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else if (value instanceof Date) return new nexacro.Decimal(value.getTime());
                return (isFinite(value)) ? new nexacro.Decimal(value) : "";
            },
            toDecimalFromText: function (value)
            {
                if (value == null || isNaN(+value)) return undefined;
                else if (value == "") return "";
                else return new nexacro.Decimal(value);
            },
            toTextFromDecimal: function (value)
            {
                return (value == null) ? undefined : value.toString();
            },

            toDate: function (value)
            {
                if (value == null) return undefined;
                else if (value === "") return "";
                if ((typeof value) == "string")
                    return nexacro.DataUtils._parseDateTime(value, "date");
                if (value instanceof Date)
                    return nexacro.DataUtils._datetimeToDate(value);
                if ((typeof value) == "number" && nexacro.DataUtils._isValidTime(value))
                    return nexacro.DataUtils._datetimeToDate(new Date(value));
                if (value instanceof nexacro.Date)
                    return value;
                return null;
            },
            toDateFromText: function (value)
            {
                if (value === undefined) return undefined;

                return (value == "") ? null : nexacro.DataUtils._parseDateTime(value, "date");
            },
            toTextFromDate: function (value)
            {
                return (value == null) ? null : nexacro.DataUtils._formatDate(value);
                /*
                if (value === null) return null; // RP_38152) distincted each. _toXMLText()
                if (value === undefined) return undefined;
                if (value == "") return "";
                return nexacro.DataUtils._formatDate(value);
                */
            },

            toTime: function (value)
            {
                if (value == null || value == "")
                {
                    return null;
                }
                if ((typeof value) == "string")
                {
                    return nexacro.DataUtils._parseDateTime(value, "time");
                }
                if (value instanceof Date)
                {
                    return nexacro.DataUtils._datetimeToTime(value);
                }
                if ((typeof value) == "number" && nexacro.DataUtils._isValidTime(value))
                {
                    return nexacro.DataUtils._datetimeToTime(new Date(value));
                }
                if (value instanceof nexacro.Date)
                {
                    return value;
                }
                return null;
            },
            toTimeFromText: function (value)
            {
                if (value === undefined) return undefined;

                return (value == "") ? null : nexacro.DataUtils._parseDateTime(value, "time");
            },
            toTextFromTime: function (value)
            {
                //return (value == null) ? null : nexacro.DataUtils._formatTime(value);
                if (value === null) return null;  // RP_38152) distincted each. _toXMLText()
                if (value === undefined) return undefined;
                if (value == "") return "";
                return nexacro.DataUtils._formatTime(value);
            },

            toDateTime: function (value)
            {
                if (value == null)
                {
                    return undefined;
                }
                if (value === "")
                {
                    return "";
                }
                if ((typeof value) == "string")
                {
                    if (isNaN(+value))
                    {
                        return "";
                    }
                    return nexacro.DataUtils._parseDateTime(value, "datetime");
                }
                if (value instanceof Date)
                {
                    return value;
                }
                if ((typeof value) == "number" && nexacro.DataUtils._isValidTime(value))
                {
                    return nexacro.DataUtils._datetimeToTime(new Date(value));
                }
                if (value instanceof nexacro.Date)
                {
                    return value;
                }
                return null;
            },
            toDateTimeFromText: function (value)
            {
                if (value === undefined) return undefined;
                return (value == "") ? null : nexacro.DataUtils._parseDateTime(value, "datetime");
            },
            toTextFromDateTime: function (value)
            {
                //return (value == null) ? null : nexacro.DataUtils._formatDateTime(value);
                if (value === null) return null;  // RP_38152) distincted each. _toXMLText()
                if (value === undefined) return undefined;
                if (value == "") return "";
                return nexacro.DataUtils._formatDateTime(value);
            },

            toBlob: function (value)
            {
                return value;
            },
            toBlobFromText: function (value)
            {
                return value;
            },
            toTextFromBlob: function (value)
            {
                return value;
            },

            toVariant: function (value)
            {
                return value;
            },
            toVariantFromText: function (value)
            {
                return value;
            },
            toVariantFromXMLText: function (value)
            {
                return nexacro._decodeXml(value);
            },
            toTextFromVariant: function (value)
            {
                return (value == null) ? value : (value + "");
            },
            toXMLTextFromVariant: function (value)
            {
                return (value == null) ? value : nexacro._encodeXml(value + "");
            },

            convert: function (value, type)
            {
                switch (type)
                {
                    case 1:
                        return this.toString(value);
                    case 2:
                        return this.toInt(value);
                    case 3:
                        return this.toFloat(value);
                    case 4:
                        return this.toDecimal(value);
                    case 5:
                        return this.toDate(value);
                    case 6:
                        return this.toTime(value);
                    case 7:
                        return this.toDateTime(value);
                    case 8:
                        return this.toBlob(value);
                    default:
                        return this.toVariant(value);
                }
            },

            _datetimeToDate: function (datetime)
            {
                datetime.setHours(0);
                datetime.setMinutes(0);
                datetime.setSeconds(0);
                datetime.setMilliseconds(0);
                return datetime;
            },

            _datetimeToTime: function (datetime)
            {
                return nexacro.DataUtils._toTime(datetime.getHours(), datetime.getMinutes(), datetime.getSeconds(), datetime.getMilliseconds());
            },

            _parseDateTime: function (str, cType)
            {
                str = str.trim();
                var year, month, date, hour, minute, second, millisecond;
                switch (cType)
                {
                    case "datetime": // yyyyMMddHHmmssZZZ
                        year = str.substring(0, 4);
                        month = str.substring(4, 6) || "01";
                        date = str.substring(6, 8) || "01";
                        hour = str.substring(8, 10);
                        minute = str.substring(10, 12);
                        second = str.substring(12, 14);
                        millisecond = str.substring(14, 17);
                        return nexacro.DataUtils._toDateTime(year, month, date, hour, minute, second, millisecond);
                    case "date": // yyyyMMdd
                        year = str.substring(0, 4);
                        month = str.substring(4, 6) || "01";
                        date = str.substring(6, 8) || "01";
                        return nexacro.DataUtils._toDate(year, month, date);
                    case "time": // HHmmssZZZ
                        hour = str.substring(0, 2);
                        minute = str.substring(2, 4);
                        second = str.substring(4, 6);
                        millisecond = str.substring(6, 9);
                        return nexacro.DataUtils._toTime(hour, minute, second, millisecond);
                }
                return "";
            },

            _formatDate: function (datetime)
            {
                if (!datetime) return undefined;
                return this._leftPad(datetime.getFullYear() * 10000 + (datetime.getMonth() + 1) * 100 + datetime.getDate(), 8);
            },
            _formatTime: function (datetime)
            {
                if (!datetime) return undefined;
                var millsecond = "";
                var ms = datetime.getMilliseconds();
                millsecond = this._leftPad(ms, 3);
                return this._leftPad(datetime.getHours() * 10000 + datetime.getMinutes() * 100 + datetime.getSeconds(), 6) + millsecond;
            },
            _formatDateTime: function (datetime)
            {
                if (!datetime) return undefined;
                var yyyymmdd = this._leftPad(datetime.getFullYear() * 10000 + (datetime.getMonth() + 1) * 100 + datetime.getDate(), 8);
                var millsecond = "";
                var ms = datetime.getMilliseconds();
                millsecond = this._leftPad(ms, 3);
                var hhmiss = this._leftPad(datetime.getHours() * 10000 + datetime.getMinutes() * 100 + datetime.getSeconds(), 6) + millsecond;
                return yyyymmdd + hhmiss;
            },

            _toDate: function (year, month, date)
            {
                var val = new nexacro.Date(year, month - 1, date);

                if (!isNaN(val.date))
                {
                    var cyear = val.getFullYear();
                    if (cyear > 9999)
                    {
                        val.setFullYear(9999);
                        val.setMonth(11);
                        val.setDate(31);
                    }
                    else if (cyear < 0)
                    {
                        val.setFullYear(0);
                        val.setMonth(0);
                        val.setDate(1);
                    }

                    return val;
                }
                else
                    return undefined;
            },

            _toTime: function (hour, minute, second, millisecond)
            {
                var val = new nexacro.Date(0, 0, 1, hour, minute, second, millisecond);
                var _val = +val.date;
                if (_val != _val)
                    return undefined;
                val._timeonly = true;

                return val;
            },

            _toDateTime: function (year, month, date, hour, minute, second, millisecond)
            {
                var val = new nexacro.Date(year, month - 1, date, hour, minute, second, millisecond);
                if (!isNaN(val.date))
                {
                    var cyear = val.getFullYear();
                    if (cyear > 9999)
                    {
                        val.setFullYear(9999);
                        val.setMonth(11);
                        val.setDate(31);
                    }
                    else if (cyear < 0)
                    {
                        val.setFullYear(0);
                        val.setMonth(0);
                        val.setDate(1);
                    }

                    return val;
                }
                else
                    return undefined;
            },

            _isValidTime: function (time)
            {
                return (time <= this._MAX_MILLISECONDS && time >= this._MIN_MILLISECONDS);
            },

            _leftPad: function (value, count)
            {
                value = value + "";
                var padcnt = count - value.length;
                switch (padcnt)
                {
                    case 0:
                        return value;
                    case 1:
                        return "0" + value;
                    case 2:
                        return "00" + value;
                    case 3:
                        return "000" + value;
                    case 4:
                        return "0000" + value;
                    case 5:
                        return "00000" + value;
                }
                return value;
            }
        },
        "2.0":
        {
            _undefined_type: 0,
            _string_type: 1,
            _int_type: 2,
            _float_type: 3,
            _bicdecimal_type: 4,
            _dete_type: 5,
            _time_type: 6,
            _datetime_type: 7,
            _bolb_type: 8,
            _variant_type: 9,

            _typecodes: {
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5,
                "6": 6,
                "7": 7,
                "8": 8,
                "9": 9,
                "string": 1,
                "int": 2,
                "float": 3,
                "double": 3,
                "decimal": 3,
                "bigdecimal": 4,
                "date": 5,
                "time": 6,
                "datetime": 7,
                "blob": 8,
                "variant": 9
            },
            _typeint: {
                "string": 1,
                "int": 2,
                "float": 3,
                "double": 3,
                "decimal": 4,
                "bigdecimal": 4,
                "date": 5,
                "time": 6,
                "datetime": 7,
                "blob": 8,
                "variant": 9
            },
            _typeenums: [
                "string", // 1
                "int", // 2
                "float",  //3
                "bigdecimal", // 4
                "date", // 5
                "time", // 6
                "datetime", // 7
                "blob" // 8
            ],
            _typenames: [
                "undefined", // 0
                "string", // 1
                "int", // 2
                "double", // 3
                "bigdecimal", // 4
                "date", // 5
                "time", // 6
                "datetime", // 7
                "blob", // 8
                "variant" // 9
            ],
            _default_sizes: [
                8, // 0 undefined
                256, // 1 string
                4, // 2 int - NA
                8, // 3 float - NA
                16, // 4 bigdecimal - NA
                6, // 5 date - NA
                9, // 6 time - NA
                17, // 7 datetime - NA
                256, // 8 blob
                0 // 9 variant
            ],
            _default_values: [
                undefined, // 0 undefined
                "", // 1 string
                0, // 2 int
                0.0, // 3 float
                0.0, // 4 decimal
                null, // 5 date
                null, // 6 time
                null, // 7 datetime
                null, // 8 blob
                null // 9 any
            ],

            _boolean_values:
            {
                "false": false,
                "False": false,
                "FALSE": false,
                "no": false,
                "No": false,
                "NO": false,
                "n": false,
                "N": false,
                "off": false,
                "Off": false,
                "OFF": false,
                "0": false,
                "true": true,
                "True": true,
                "TRUE": true,
                "yes": true,
                "Yes": true,
                "YES": true,
                "y": true,
                "Y": true,
                "on": true,
                "On": true,
                "ON": true,
                "1": true
            },

            _init_date: new Date(0),
            _MAX_MILLISECONDS: 100000000 * 24 * 60 * 60 * 1000,
            _MIN_MILLISECONDS: -100000000 * 24 * 60 * 60 * 1000,

            getDefaultValue: function (type)
            {
                return nexacro.DataUtils._default_values[type.toLowerCase()];
            },

            getDefaultSize: function (type)
            {
                return nexacro.DataUtils._default_sizes[type.toLowerCase()];
            },

            toTypeCode: function (type)
            {
                var n = nexacro.DataUtils._typeint[type.toLowerCase()];
                return (n == null) ? 0 : n;
            },

            toTypeName: function (type)
            {
                var n = nexacro.DataUtils._typenames[type];
                return (n == null) ? "undefined" : n;
            },

            findDataType: function (value)
            {
                if ((typeof value) == "object")
                {
                    return (value instanceof Date) ? 7 : 0;
                }
                var n = nexacro.DataUtils._typenames[value];
                return (n == null) ? 0 : n;
            },

            isBinary: function (type)
            {
                return (type == 12);
            },

            toString: function (value)
            {
                if (value == null) return undefined;
                if (value instanceof Date) return nexacro.DataUtils._formatDateTime(value);
                return value.toString();
            },
            toStringFromText: function (value)
            {
                return value;
            },
            toStringFromXMLText: function (value)
            {
                return nexacro._decodeXml(value);
            },
            toTextFromString: function (value)
            {
                return value;
            },
            toXMLTextFromString: function (value)
            {
                return nexacro._encodeXml(value);
            },

            toInt: function (value)
            {
                if (value && (typeof value == "string"))
                    value = value.trim();

                if (value == null) return undefined;
                else if (value === "") return "";
                else if (!isFinite(+value))
                {
                    if (value === "Infinity" || value === "-Infinity")
                        return NaN;
                    else
                        return +value;
                }

                return value | 0;
            },

            toIntFromText: function (value)
            {
                if (value && (typeof value == "string"))
                    value = value.trim();

                if (value == null) return undefined;
                else if (value === "") return "";
                else if (!isFinite(+value))
                {
                    if (value === "Infinity" || value === "-Infinity")
                        return NaN;
                    else
                        return +value;
                }

                return (value | 0);
            },
            toTextFromInt: function (value)
            {
                return (value == null) ? undefined : value + "";
            },

            toBoolean: function (value)
            {
                if (typeof value == "string")
                {
                    value = this._boolean_values[value];
                }
                return (value ? true : false);
            },
            toBooleanFromText: function (value)
            {
                value = this._boolean_values[value];
                return (value ? true : false);
            },
            toTextFromBoolean: function (value)
            {
                return (value == null) ? value : value + "";
            },

            toFloat: function (value)
            {
                if (value && (typeof value == "string"))
                    value = value.trim();

                if (value == null) return undefined;
                else if (value === "") return "";
                else if (!isFinite(+value))
                {
                    if (value === "Infinity" || value === "-Infinity")
                        return NaN;
                    else
                        return +value;
                }

                return (+value);
            },
            toFloatFromText: function (value)
            {
                if (value && (typeof value == "string"))
                    value = value.trim();

                if (value == null) return undefined;
                else if (value === "") return "";

                /*else if (!isFinite(+value)) {
                    if (value === "Infinity" || value === "-Infinity")
                        return NaN;
                    else
                        return +value;
                }*/

                return (+value);
            },
            toTextFromFloat: function (value)
            {
                return (value == null) ? undefined : (value + "");
            },

            toNumber: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (+value);
            },
            toNumberFromText: function (value)
            {
                if (value == null) return undefined;
                else if (value === "" || isNaN(+value)) return "";
                else return (+value);
            },
            toTextFromNumber: function (value)
            {
                return (value == null) ? undefined : (value + "");
            },

            toDecimal: function (value)
            {
                if (value && (typeof value == "string"))
                    value = value.trim();

                if (value == null) return undefined;
                else if (value === "") return "";
                else if (isNaN(+value)) return NaN;
                else if (!isFinite(+value))
                {
                    if (value === "Infinity" || value === "-Infinity")
                        return NaN;
                }
                else if (value instanceof Date) return new nexacro.Decimal(value.getTime());    //TODO : nexacro.Date ??

                return new nexacro.Decimal(value);
            },
            toDecimalFromText: function (value)
            {
                if (value && (typeof value == "string"))
                    value = value.trim();

                if (value === null || value === undefined) return undefined;
                else if (value === "") return "";
                else if (isNaN(+value) || !isFinite(+value))
                {
                    value = +value;
                }
                return new nexacro.Decimal(value);
            },
            toTextFromDecimal: function (value)
            {
                return (value == null) ? undefined : value.toString();
            },

            toDate: function (value)
            {
                var date;
                if (!nexacro.DataUtils._isValidPackedDate(value))
                {
                    if ((typeof value) != "number")
                    {
                        if (value === "" || value === undefined)
                            return value;

                        if (value === null) return undefined;

                        if (!/[^0-9]/.test(value) && value.length < 3)   // 0~99
                        {
                            return new nexacro.Date(value, 0, 1);
                        }
                        else
                            date = new Date(value);

                        if (isNaN(date.valueOf()))
                            return new nexacro.Date(undefined); //Invalid Date
                        else
                            value = date;
                    }
                }
                if ((typeof value) == "number")
                {
                    date = new Date(value);

                    if (nexacro.DataUtils._isValidTime(value))
                    {
                        value = nexacro.DataUtils._datetimeToDate(date);
                        return nexacro.DataUtils._toDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
                    }
                    else
                    {
                        if (isNaN(date.valueOf()))
                            return new nexacro.Date(undefined); //Invalid Date
                        else
                            value = date;
                    }
                }

                if (value instanceof Date || value instanceof nexacro.Date)
                    return nexacro.DataUtils._toDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
                if ((typeof value) == "string")
                    return nexacro.DataUtils._parseDateTime(value, "date");

                return null;
            },
            toDateFromText: function (value)
            {
                var date, ret;
                if (!nexacro.DataUtils._isValidPackedDate(value))
                {
                    if (value === "" || value === undefined)
                        return value;

                    if (value === null) return undefined;

                    if (!/[^0-9]/.test(value) && value.length < 3)   // 0~99
                    {
                        date = new nexacro.Date(value, 0, 1);
                    }
                    else
                        date = new Date(value);

                    if (isNaN(date.valueOf()))
                        return new nexacro.Date(undefined);
                    else
                    {
                        ret = nexacro.DataUtils._toDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
                    }
                }
                else
                    ret = nexacro.DataUtils._parseDateTime(value, "date");

                if (!ret || ret._isInvalidDate())
                    return new nexacro.Date(undefined);

                return ret;
            },
            toTextFromDate: function (value)
            {
                if (value === "") return "";
                return (value == null) ? null : nexacro.DataUtils._formatDate(value);
                /*
                if (value === null) return null; // RP_38152) distincted each. _toXMLText()
                if (value === undefined) return undefined;
                if (value == "") return "";
                return nexacro.DataUtils._formatDate(value);
                */
            },

            toTime: function (value)
            {
                var date;
                if (!nexacro.DataUtils._isValidPackedTime(value))
                {
                    if ((typeof value) != "number")
                    {
                        if (value === "" || value === undefined)
                            return value;

                        if (value === null) return undefined;

                        date = new Date(value);

                        if (isNaN(date.valueOf()))
                            return new nexacro.Date(undefined); //Invalid Date
                        else
                            value = date;
                    }
                }
                if ((typeof value) == "number")
                {
                    date = new Date(value);
                    if (nexacro.DataUtils._isValidTime(value))
                    {
                        value = nexacro.DataUtils._datetimeToTime(date);
                        return nexacro.DataUtils._toTime(value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
                    }
                    else
                    {
                        if (isNaN(date.valueOf()))
                            return new nexacro.Date(undefined); //Invalid Date
                        else
                            value = date;
                    }
                }

                if (value instanceof Date || value instanceof nexacro.Date)
                {
                    return nexacro.DataUtils._toTime(value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
                }

                if ((typeof value) == "string")
                {
                    return nexacro.DataUtils._parseDateTime(value, "time");
                }

                return null;
            },
            toTimeFromText: function (value)
            {
                if (!nexacro.DataUtils._isValidPackedTime(value))
                {
                    if (value === "" || value === undefined)
                        return value;

                    if (value === null) return undefined;

                    var date = new Date(value);

                    if (isNaN(date.valueOf()))
                        return new nexacro.Date(undefined); //Invalid Date
                    else
                    {
                        return nexacro.DataUtils._toTime(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                    }
                }

                return (value == "") ? null : nexacro.DataUtils._parseDateTime(value, "time");
            },
            toTextFromTime: function (value)
            {
                //return (value == null) ? null : nexacro.DataUtils._formatTime(value);
                if (value === null) return null;  // RP_38152) distincted each. _toXMLText()
                if (value === undefined) return undefined;
                if (value == "") return "";
                return nexacro.DataUtils._formatTime(value);
            },

            toDateTime: function (value)
            {
                var date;
                if (!nexacro.DataUtils._isValidPackedDateTime(value))
                {
                    if ((typeof value) != "number")
                    {
                        if (value === "" || value === undefined)
                            return value;

                        if (value === null) return undefined;

                        if (!/[^0-9]/.test(value) && value.length < 3)   // 0~99
                        {
                            return new nexacro.Date(value, 0, 1, 0, 0, 0);
                        }
                        else
                            date = new Date(value);

                        if (isNaN(date.valueOf()))
                            return new nexacro.Date(undefined); //Invalid Date
                        else
                            value = date;
                    }
                }
                if ((typeof value) == "number")
                {
                    date = new Date(value);

                    if (isNaN(date.valueOf()))
                        return new nexacro.Date(undefined); //Invalid Date
                    else
                        value = date;
                }

                if (value instanceof Date || value instanceof nexacro.Date)
                {
                    return nexacro.DataUtils._toDateTime(value.getFullYear(), value.getMonth() + 1, value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
                }

                if ((typeof value) == "string")
                    return nexacro.DataUtils._parseDateTime(value, "datetime");

                return null;

            },
            toDateTimeFromText: function (value)
            {
                var date, ret;
                if (!nexacro.DataUtils._isValidPackedDateTime(value))
                {
                    if (value === "" || value === undefined)
                        return value;

                    if (value === null) return undefined;
                    if (!/[^0-9]/.test(value) && value.length < 3)   // 0~99
                    {
                        date = new nexacro.Date(value, 0, 1, 0, 0, 0);
                    }
                    else
                        date = new Date(value);

                    if (isNaN(date.valueOf()))
                        return new nexacro.Date(undefined); //Invalid Date
                    else
                    {
                        ret = nexacro.DataUtils._toDateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                    }
                }
                else
                    ret = nexacro.DataUtils._parseDateTime(value, "datetime");

                if (!ret || ret._isInvalidDate())
                    return new nexacro.Date(undefined);

                return ret;
            },
            toTextFromDateTime: function (value)
            {
                //return (value == null) ? null : nexacro.DataUtils._formatDateTime(value);
                if (value === null) return null;  // RP_38152) distincted each. _toXMLText()
                if (value === undefined) return undefined;
                if (value == "") return "";
                return nexacro.DataUtils._formatDateTime(value);
            },

            toBlob: function (value)
            {
                return value;
            },
            toBlobFromText: function (value)
            {
                return value;
            },
            toTextFromBlob: function (value)
            {
                return value;
            },

            toVariant: function (value)
            {
                return value;
            },
            toVariantFromText: function (value)
            {
                return value;
            },
            toVariantFromXMLText: function (value)
            {
                return nexacro._decodeXml(value);
            },
            toTextFromVariant: function (value)
            {
                return (value == null) ? value : (value + "");
            },
            toXMLTextFromVariant: function (value)
            {
                return (value == null) ? value : nexacro._encodeXml(value + "");
            },

            convert: function (value, type)
            {
                switch (type)
                {
                    case 1:
                        return this.toString(value);
                    case 2:
                        return this.toInt(value);
                    case 3:
                        return this.toFloat(value);
                    case 4:
                        return this.toDecimal(value);
                    case 5:
                        return this.toDate(value);
                    case 6:
                        return this.toTime(value);
                    case 7:
                        return this.toDateTime(value);
                    case 8:
                        return this.toBlob(value);
                    default:
                        return this.toVariant(value);
                }
            },

            _datetimeToDate: function (datetime)
            {
                datetime.setHours(0);
                datetime.setMinutes(0);
                datetime.setSeconds(0);
                datetime.setMilliseconds(0);
                return datetime;
            },

            _datetimeToTime: function (datetime)
            {
                return nexacro.DataUtils._toTime(datetime.getHours(), datetime.getMinutes(), datetime.getSeconds(), datetime.getMilliseconds());
            },

            _parseDateTime: function (str, cType)
            {
                str = str.trim();
                var year, month, date, hour, minute, second, millisecond;
                var y_len = 4;
                switch (cType)
                {
                    case "datetime":
                        // yyyyMMddHHmmssuuu ,  yyyyMMddHHmmss
                        //  if (str.length == 15 || str.length == 12)
                        //      y_len = 2;

                        year = str.substring(0, y_len);
                        month = str.substring(y_len, y_len + 2) || "01";
                        date = str.substring(y_len + 2, y_len + 4) || "01";
                        hour = str.substring(y_len + 4, y_len + 6);

                        minute = str.substring(y_len + 6, y_len + 8);
                        second = str.substring(y_len + 8, y_len + 10);
                        millisecond = str.substring(y_len + 10, y_len + 13);

                        return nexacro.DataUtils._toDateTime(year, month, date, hour, minute, second, millisecond);

                    case "date": // yyyyMMdd
                        //      if (str.length == 6)
                        //          y_len = 2;
                        year = str.substring(0, y_len);
                        month = str.substring(y_len, y_len + 2) || "01";
                        date = str.substring(y_len + 2, y_len + 4) || "01";

                        return nexacro.DataUtils._toDate(year, month, date);
                    case "time": // HHmmssuuu
                        hour = str.substring(0, 2);
                        minute = str.substring(2, 4);
                        second = str.substring(4, 6);
                        millisecond = str.substring(6, 9);
                        return nexacro.DataUtils._toTime(hour, minute, second, millisecond);
                }
                return "";
            },

            _formatDate: function (datetime)
            {
                if (!datetime) return undefined;
                if (datetime._isInvalidDate ? datetime._isInvalidDate() : isNaN(datetime.valueOf()))
                    return "Invalid Date";

                return this._leftPad(datetime.getFullYear() * 10000 + (datetime.getMonth() + 1) * 100 + datetime.getDate(), 8);
            },
            _formatTime: function (datetime)
            {
                if (!datetime) return undefined;
                if (datetime._isInvalidDate ? datetime._isInvalidDate() : isNaN(datetime.valueOf()))
                    return "Invalid Date";

                var millsecond = "";
                var ms = datetime.getMilliseconds();
                millsecond = this._leftPad(ms, 3);
                return this._leftPad(datetime.getHours() * 10000 + datetime.getMinutes() * 100 + datetime.getSeconds(), 6) + millsecond;
            },
            _formatDateTime: function (datetime)
            {
                if (!datetime) return undefined;
                if (datetime._isInvalidDate ? datetime._isInvalidDate() : isNaN(datetime.valueOf()))
                    return "Invalid Date";
                var yyyymmdd = this._leftPad(datetime.getFullYear() * 10000 + (datetime.getMonth() + 1) * 100 + datetime.getDate(), 8);
                var millsecond = "";
                var ms = datetime.getMilliseconds();
                millsecond = this._leftPad(ms, 3);
                var hhmiss = this._leftPad(datetime.getHours() * 10000 + datetime.getMinutes() * 100 + datetime.getSeconds(), 6) + millsecond;
                return yyyymmdd + hhmiss;
            },

            _toDate: function (year, month, date)
            {
                var val = new nexacro.Date(year, month - 1, date);
                var _val = +val.date;
                return (_val != _val) ? undefined : val;
            },

            _toTime: function (hour, minute, second, millisecond)
            {
                var val = new nexacro.Date(0, 0, 1, hour, minute, second, millisecond);
                var _val = +val.date;
                if (_val != _val)
                    return undefined;
                val._timeonly = true;

                return val;
            },

            _toDateTime: function (year, month, date, hour, minute, second, millisecond)
            {
                var val = new nexacro.Date(year, month - 1, date, hour, minute, second, millisecond);
                var _val = +val.date;
                return (_val != _val) ? undefined : val;
            },

            _isValidTime: function (time)
            {
                return (time <= this._MAX_MILLISECONDS && time >= this._MIN_MILLISECONDS);
            },

            _isValidPackedDate: function (v)
            {
                if (!v)
                    return false;

                if (v instanceof Date || v instanceof nexacro.Date)
                    return true;
                else
                {
                    v = v.toString();
                    if (v.length != 8)
                    {
                        return false;
                    }

                    if (/[^0-9]/.test(v))
                        return false;

                }

                return true;
            },
            _isValidPackedDateTime: function (v)
            {
                if (!v)
                    return false;

                if (v instanceof Date || v instanceof nexacro.Date)
                    return true;
                else
                {
                    v = v.toString();
                    //YYYYMMDDHHmmssuuu,YYYYMMDDHHmmss 17,14
                    switch (v.length)
                    {
                        case 17: case 14://YYYYMMDDHHmmssuuu,YYYYMMDDHHmmss
                            break;
                        default:
                            return false;

                    }

                    if (/[^0-9]/.test(v))
                        return false;

                }

                return true;
            },
            _isValidPackedTime: function (v)
            {
                if (!v)
                    return false;

                if (v instanceof Date || v instanceof nexacro.Date)
                    return true;
                else
                {
                    v = v.toString();
                    if (v.length != 9 && v.length != 6)   //HHmmssuuu , HHmmss
                        return false;

                    if (/[^0-9]/.test(v))
                        return false;

                }

                return true;
            },
            _leftPad: function (value, count)
            {
                value = value + "";
                var padcnt = count - value.length;
                switch (padcnt)
                {
                    case 0:
                        return value;
                    case 1:
                        return "0" + value;
                    case 2:
                        return "00" + value;
                    case 3:
                        return "000" + value;
                    case 4:
                        return "0000" + value;
                    case 5:
                        return "00000" + value;
                }
                return value;
            }
        }
    }

    nexacro.DataUtils = nexacro.DataUtilsSet["1.0"];

    //==============================================================================
    // nexacro.ExprParser
    //==============================================================================
    nexacro.ExprParser = function ()
    {
        this.output = [];
        this._itemidx = -1;
        this._itempos = 0;
        this._prevtype = -1;
    };
    var _pExprParser = nexacro._createPrototype(nexacro.Object, nexacro.ExprParser);
    nexacro.ExprParser.prototype = _pExprParser;

    // static members
    _pExprParser.whitespace = nexacro._gen_arrmap("\n\r\t ".split(''));
    _pExprParser._replace_whitespace = nexacro._gen_arrmap("\\n,\\r,\\t,\\s".split(','));    // add backslashaaa
    _pExprParser.wordchars = nexacro._gen_arrmap("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split(''));
    _pExprParser.punct = nexacro._gen_arrmap("+ - * / % & ++ -- = += -= *= /= %= == === != <> !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::".split(' '));
    _pExprParser.line_starters = nexacro._gen_arrmap("continue,try,throw,return,var,if,switch,case,default,for,while,break,function".split(','));

    _pExprParser.regexp_hanja = /[\u2E80-\u2EFF]|[\u31C0-\u31EF]|[\u3200-\u32FF]|[\u3400-\u4DBF]|[\u4E00-\u9FBF]|[\uF900-\uFAFF]/;
    _pExprParser.regexp_nipon = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\u31F0-\u31FF]|[\uFF01-\uFFEF]|[\u3000-\u3002]|[\u300C]|[\u300D]|[\u309B]|[\u309C]|[\u2010-\u201F]/;   // 전각 ascii추가
    _pExprParser.regexp_greek = /[\u0370-\u03FF]/;
    _pExprParser.regexp_hangul = /[ㄱ-ㅎ]|[ㅏ-ㅣ]|[가-힣]/;
    _pExprParser.regexp_num = /^[0-9]+[Ee]$/;

    // operation container
    // inemtype : 0 -- nameed
    //          : 1 -- nameed function
    //          : 2 -- number
    //          : 3 -- string
    //          : 4 -- operator
    //          : 5 -- (
    //          : 6 -- )
    //          : 7 -- [
    //          : 8 -- ]
    //          : 9 -- ,
    //          : 10 -- .
    _pExprParser.append = function (text, type)
    {
        var output = this.output;
        var cnt = output.length;
        if (type == 2 && this._prevtype == 2)
        {
            output[cnt - 1].tok += text;
            return;
        }
        if (type == 10)
        {
            if (this._prevtype == 2)
            {
                output[cnt - 1].tok += text;
                return;
            }
            else if (cnt == 0)
            {
                output[cnt] = {
                    type: 2,
                    tok: text,
                    pos: -1
                };
                this._prevtype = 1;
                return;
            }
        }
        else if (type == 4)
        {
            this._itempos = 0;
        }
        else if (type == 5 && this._prevtype == 0)
        {
            output[cnt - 1].type = 1;
            this._itempos = 0;
        }

        var tok_item = {
            type: type,
            tok: text,
            pos: this._itempos
        };

        output[cnt] = tok_item;

        if (type == 10 && this._prevtype == 0)
        {
            if (this._itempos >= 0) this._itempos++;
        }
        else if (type == 5 || type == 7 || type == 9)
        {
            this._itempos = 0;
        }
        else if (type == 6 || type == 8)
        {
            this._itempos = -1;
        }
        this._prevtype = type;
    };

    _pExprParser.tokenizeExpr = function (expr_str)
    {
        // init parse info
        this.input = expr_str;
        var output = this.output;

        //var last_word = "";
        //var last_text = "";
        //var prev_last_text = "";
        //var last_type = -1;

        var src = expr_str + "";
        var src_len = src.length;
        var cur_pos = 0;
        if (cur_pos >= src_len)
        {
            return 0;
        }

        while (true)
        {
            if (cur_pos >= src_len) return output.length;

            var c, sep;
            var tok = src.charAt(cur_pos);
            cur_pos++;

            while (tok in this.whitespace)
            {
                if (cur_pos >= src_len)
                {
                    return output.length;
                }
                tok = src.charAt(cur_pos);
                cur_pos++;
            }


            // match -> test
            if (tok in this.wordchars || this.regexp_hangul.test(tok) || this.regexp_hanja.test(tok) || this.regexp_nipon.test(tok) || this.regexp_greek.test(tok))
            {
                if (cur_pos < src_len)
                {
                    c = src.charAt(cur_pos);
                    while (c in this.wordchars || this.regexp_hangul.test(c) || this.regexp_hanja.test(c) || this.regexp_nipon.test(c) || this.regexp_greek.test(c))
                    {
                        tok += c;
                        cur_pos++;
                        if (cur_pos >= src_len)
                        {
                            break;
                        }
                        c = src.charAt(cur_pos); //src[cur_pos]; --> ie6,7 errer
                    }
                }

                // small and surprisingly unugly hack for 1E-10 representation
                if (cur_pos < src_len && this.regexp_num.test(tok) && (c === '-' || c === '+'))
                {
                    //var sign = src.charAt(cur_pos);
                    cur_pos += 1;
                    this.parse_pos = cur_pos;
                    c = src.charAt(cur_pos);

                    while (c in this.wordchars || this.regexp_hangul.test(c) || this.regexp_hanja.test(c) || this.regexp_nipon.test(c) || this.regexp_greek.test(c))
                    {
                        tok += c;
                        cur_pos++;
                        if (cur_pos >= src_len)
                        {
                            break;
                        }
                        c = src.charAt(cur_pos);
                    }
                    this.append(tok, 3);
                    continue;
                }

                if (tok == 'in') // hack for 'in' operator
                {
                    this.append(tok, 4);
                }
                else
                {
                    var fval = parseFloat(tok);
                    if (isFinite(fval))
                    {
                        this.append(tok, 2);
                    }
                    else
                    {
                        this.append(tok, 0);
                    }
                }
                continue;
            }

            if (tok == '(')
            {
                this.append(tok, 5);
                var next_tok = src.charAt(cur_pos);
                if (next_tok == "/")
                {
                    tok = next_tok;
                    cur_pos++
                    while (cur_pos < src_len)
                    {
                        sep = '/';
                        let esc = false;
                        c = src.charAt(cur_pos);
                        tok += c;
                        cur_pos++;
                        while (esc || c != sep)
                        {
                            if (!esc)
                            {
                                esc = (c == '/');
                            }
                            else
                            {
                                esc = false;
                            }
                            c = src.charAt(cur_pos);
                            if (c == "\\") break;
                            tok += c;
                            cur_pos++;
                            if (cur_pos >= src_len) break;
                        }
                        if (c == sep || c == "\\")
                        {
                            this.append(tok, 3);
                            break;
                        }
                    }
                }
                continue;
            }
            if (tok == ')')
            {
                this.append(tok, 6);
                continue;
            }
            if (tok == '[')
            {
                this.append(tok, 7);
                continue;
            }
            if (tok == ']')
            {
                this.append(tok, 8);
                continue;
            }
            if (tok == ',')
            {
                this.append(tok, 9);
                continue;
            }
            if (tok == '{')
            {
                this.append(tok, 10);
                continue;
            }
            if (tok == '}')
            {
                this.append(tok, 11);
                continue;
            }
            if (tok == ';')
            {
                this.append(tok, 12);
                continue;
            }

            if (tok == "\\")
            {
                tok += src.charAt(cur_pos);
                cur_pos++;
                this.append(tok, 4);
                continue;
            }

            var esc;
            if (tok == "'" || tok == '"')
            {
                if (cur_pos < src_len)
                {
                    sep = tok;
                    esc = false;
                    c = src.charAt(cur_pos);
                    tok += c;
                    cur_pos++;
                    while (esc || c != sep)
                    {
                        if (!esc)
                        {
                            esc = (c == '\\');
                        }
                        else
                        {
                            esc = false;
                        }
                        c = src.charAt(cur_pos);
                        tok += c;
                        cur_pos++;
                        if (cur_pos >= src_len) break;
                    }
                    if (c == sep)
                    {
                        this.append(tok, 3);
                        continue;
                    }
                    return -1;
                }
                continue;
            }

            if (tok == '/')
            {
                c = src.charAt(cur_pos);
                if (c == '*')
                {
                    tok += c;
                    cur_pos++;
                    while (cur_pos < src_len)
                    {
                        c = src.charAt(cur_pos);
                        tok += c;
                        cur_pos++;
                        if (c == '*')
                        {
                            if (cur_pos >= src_len) break;
                            c = src.charAt(cur_pos);
                            tok += c;
                            cur_pos++;
                            if (c == '/')
                            {
                                continue;
                            }
                        }
                    }
                    return -1;
                }

                if (c == '/')
                {
                    tok += c;
                    cur_pos++;
                    c = src.charAt(cur_pos);
                    while (cur_pos < src_len)
                    {
                        c = src.charAt(cur_pos);
                        if (c == "\r" || c == "\n")
                        {
                            cur_pos += 1;
                            continue;
                        }
                        tok += c;
                        cur_pos++;
                    }
                    continue;
                }
                if ([-1, 4, 5, 7, 9].indexOf(output._prevtype) >= 0)
                {
                    if (cur_pos < src_len)
                    {
                        esc = false;
                        var in_char_class = false;
                        c = src.charAt(cur_pos);
                        tok += c;
                        cur_pos++;
                        while (esc || in_char_class || c != '/')
                        {
                            if (!esc)
                            {
                                esc = (c == '\\');
                                if (c == '[')
                                {
                                    in_char_class = true;
                                }
                                else if (c == ']')
                                {
                                    in_char_class = false;
                                }
                            }
                            else
                            {
                                esc = false;
                            }
                            c = src.charAt(cur_pos);
                            tok += c;
                            cur_pos++;
                        }
                        if (c != '/') // error : unclosed regexp
                        {
                            return -1;
                        }
                        c = src.charAt(cur_pos);

                        while (cur_pos < src_len && (c in this.wordchars || this.regexp_hangul.test(tok) || this.regexp_hanja.test(tok) || this.regexp_nipon.test(tok) || this.regexp_greek.test(tok)))
                        {
                            tok += c;
                            cur_pos++;
                            c = src.charAt(cur_pos);
                        }
                        this.append(tok, 3);
                    }
                    continue;
                }
            }

            if (tok in this.punct)
            {
                while (cur_pos < src_len)
                {
                    c = src.charAt(cur_pos);
                    if ((tok + c) in this.punct)
                    {
                        tok += c;
                        cur_pos++;
                    }
                    else
                    {
                        break;
                    }
                }
                if (tok.charAt(0) == '=')
                {
                    if (tok != '==' && tok != '===')
                    {
                        if (cur_pos >= src_len)
                        {
                            return -1;
                        }
                    }
                }
                this.append(tok, 4);
                continue;
            }

            if (tok == '.')
            {
                this.append(tok, 10);
                continue;
            }

            return -1;
        }
    };

    /*
    _pExprParser.makeSubExpr = function (ds, from, to) {
        var str = "";
        var output = this.output;
        //var len = output.length;
        var colinfos = ds.colinfos;
        var constinfos = ds._constVars;

        //var id;
        var i = from;
        function makeSubExpr_loop(pthis) {
            if (i < to) {
                var item = output[i];
                if (i != 0 && item.type == 4) {
                    //str += ' ';
                    str += item.tok;
                    //str += ' ';
                }
                else {
                    // var new_name = "";
                    if (item.type == 0 && item.pos == 0) {
                        var id = item.tok;

                        if ((colinfos != undefined && id in colinfos) || (constinfos != undefined && id in constinfos)) {
                            if (i < (to - 1) && output[i + 1].type == 7) {
                                var bcnt = 0, bcbt = 0;
                                var j;
                                for (j = i + 2; j < to; j++) {
                                    if (output[j].type == 7) bcbt++;
                                    if (output[j].type == 8) {
                                        if (bcnt == 0) {
                                            break;
                                        }
                                        else {
                                            bcnt--;
                                        }
                                    }
                                }
                                if (j < to && j > (i + 2)) {
                                    var substr = pthis.makeSubExpr(ds, i + 2, j);
                                    if (substr != null) {
                                        str += "dataset.getColumn(" + substr + ", '" + id + "')";
                                        i = j;
                                    }
                                    else {
                                        // error
                                        return undefined;
                                    }
                                }
                                else {
                                    // error
                                    return undefined;
                                }
                            }
                            else {
                                str += "dataset.getColumn(rowidx, '" + id + "')";
                            }
                        }
                        else if (id == "new") {
                            str += id + " ";
                        }
                        else {
                            str += id;
                        }
                    }
                    else {
                        str += item.tok;
                    }
                }
                i++;
                return false;
            }
            return true;
        }
        while (true) {
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
            if (makeSubExpr_loop(this)) break;
        }
        return str;
    };
    */
    _pExprParser.makeSubExpr = function (ds, from, to)
    {
        var str = "";
        var output = this.output;
        //var len = output.length;
        var colList = ds.colinfos;

        //var id;
        var i = from;
        while (i < to)
        {
            var item = output[i];
            if (i != 0 && item.type == 4)
            {
                //str += ' ';
                str += item.tok;
                //str += ' ';
            }
            else
            {
                // var new_name = "";
                if (item.type == 0 && item.pos == 0)
                {
                    var id = item.tok;

                    if (id == "currow" || id == "rowidx" || id == "comp" || id == "dataset" || id == "_records_" || id == "_row_" || id == "_args_" || id == "groupname" || id == "groupvalue" || id == "groupcount")
                    {
                        str += id;
                    }
                    else if (id[0] == '$')
                    {
                        var argno = +(id.substring(1, id.length));
                        if (argno >= 0)
                            str += "(_args_[" + argno + "])";
                        else
                            str += id;
                    }
                    else
                    {
                        if (ds.getColIndex)
                        {
                            var colidx = ds.getColIndex(id);
                            if (colidx >= 0)
                            {
                                if (i < (to - 1) && output[i + 1].type == 7)
                                {
                                    var j;
                                    /*
                                    var bcnt = 0, bcbt = 0;

                                    for (j = i + 2; j < to; j++)
                                    {
                                        if (output[j].type == 7) bcbt++;
                                        if (output[j].type == 8)
                                        {
                                            //if (bcnt == 0)
                                            //{
                                                break;
                                            //}
                                            //else
                                            //{
                                            //    bcnt--;
                                            //}
                                        }
                                    }
                                    */
                                    if (j < to && j > (i + 2))
                                    {
                                        var substr = this.makeSubExpr(ds, i + 2, j);
                                        if (substr != null)
                                        {
                                            //str += "dataset.getColumn(" + substr + ", '" + id + "')";
                                            if (colidx >= colList.length)
                                            {
                                                str += "(dataset._constVars[" + (colidx - colList.length) + "].value)";
                                            }
                                            else
                                            {
                                                str += "(dataset.__getParsedRow(_records_[" + substr + "])[" + colidx + "])";
                                            }
                                            i = j;
                                        }
                                        else
                                        {
                                            // error
                                            return null;
                                        }
                                    }
                                    else
                                    {
                                        // error
                                        return null;
                                    }
                                }
                                else
                                {
                                    //str += "dataset.getColumn(rowidx, '" + id + "')";
                                    if (colidx >= colList.length)
                                    {
                                        str += "(dataset._constVars[" + (colidx - colList.length) + "].value)";
                                    }
                                    else
                                    {
                                        str += "(_row_[" + colidx + "])";
                                    }
                                }
                            }
                            else if (id == "new")
                            {
                                str += id + " ";
                            }
                            else
                            {
                                str += id;
                            }
                        }
                        else if (id == "new")
                        {
                            str += id + " ";
                        }
                        else
                        {
                            str += id;
                        }
                    }
                }
                else if (item.type == 1) 
                {
                    var id = item.tok;
                    if (id == "TEXT")
                    {
                        str += "nexacro._getStringResourceValue";
                    }
                    else
                        str += id;
                }
                else
                {
                    str += item.tok;
                }
            }
            i++;
        }
        return str;
    };

    _pExprParser.makeExpr = function (ds, expr_str)
    {
        this.tokenizeExpr(expr_str);
        var str = this.makeSubExpr(ds, 0, this.output.length);
        return str;
    };

    _pExprParser.makeSubEval = function (ds, from, to)
    {
        var str = "";
        var output = this.output;

        var i = from;
        to = to > output.length ? output.length : to;
        while (i < to)
        {
            var item = output[i];
            if (i != 0 && item.type == 4)
            {
                str += ' ';
                str += item.tok;
                str += ' ';
            }
            else
            {
                //var new_name = "";
                var id;
                if (item.type == 0 && item.pos == 0)
                {
                    id = item.tok;

                    if (id != "var")
                    {
                        str += id;
                    }
                }
                else if (item.type == 1 && item.pos == 0)
                {
                    id = item.tok;
                    str += id;
                }
                else
                {
                    str += item.tok;
                }
            }
            i++;
        }

        return str;
    };

    _pExprParser.makeEval = function (ds, expr_str)
    {
        this.tokenizeExpr(expr_str);
        var str = this.makeSubEval(ds, 0, this.output.length);
        return str;
    };

    _pExprParser._transferWhitespace = function (edit_val)
    {
        var whitespace;
        var replace_whitespace;

        if (Object.keys)
        {
            whitespace = Object.keys(this.whitespace);
            replace_whitespace = Object.keys(this._replace_whitespace);
        }
        else
        {
            whitespace = [];
            for (var key in this.whitespace)
            {
                whitespace.push(key);
            }

            replace_whitespace = [];
            for (var key in this._replace_whitespace)
            {
                replace_whitespace.push(key);
            }
        }
        var block;
        var full = "";

        for (var i = 0; i < edit_val.length; i++)
        {
            block = edit_val.charAt(i);

            for (var j = 0; j < whitespace.length; j++)
            {
                if (block == whitespace[j])
                {
                    full += replace_whitespace[j];
                    break;
                }
            }

            full += block;
        }

        return full;
    }

    _pExprParser = null;


    //==============================================================================
    // nexacro.VariableList
    //==============================================================================
    nexacro.Variable = function (id, val, type, ntype, size, idx)
    {
        this.id = id;
        this.value = val;
        this.type = type;
        this.ntype = ntype;
        this.size = size;
        this._index = idx;
    };
    var _pVariable = nexacro._createPrototype(nexacro.Object, nexacro.Variable);
    nexacro.Variable.prototype = _pVariable;
    _pVariable._type_name = "Variable";
    _pVariable.id = null;
    _pVariable.type = null;
    _pVariable.ntype = 0;
    _pVariable.size = null;
    _pVariable._index = -1;

    nexacro.VariableList = function ()
    {
        nexacro.Collection.call(this);
    };
    var _pVariableList = nexacro._createPrototype(nexacro.Collection, nexacro.VariableList);
    nexacro.VariableList.prototype = _pVariableList;
    _pVariableList._type_name = "VariableList";

    _pVariableList._updateID = function (idx, newID)
    {
        var varinfo = this[idx];
        if (varinfo && varinfo.id != newID)
        {
            varinfo.set_id(newID);
            return this.update_id(idx, newID);
        }
        return false;
    };

    _pVariableList.deleteItem = function (id)
    {
        return this.delete_item(id);
    };

    _pVariableList.getValue = function (id)
    {
        var item = this.get_item(id);
        return item ? item.value : undefined;
    };

    _pVariableList = null;


    ////

    nexacro.ConstColumnVariable = function (id, val, type, ntype, size, datapath, idx)
    {
        this.id = id;
        this.value = val;
        this.type = type;
        this.ntype = ntype;
        this.size = size;
        this.datapath = datapath;
        this._index = idx;
    };
    var _pConstColumnVariable = nexacro._createPrototype(nexacro.Variable, nexacro.Variable);
    nexacro.ConstColumnVariable.prototype = _pVariable;

    _pConstColumnVariable._type_name = "Variable";
    _pConstColumnVariable.id = null;
    _pConstColumnVariable.type = null;
    _pConstColumnVariable.ntype = 0;
    _pConstColumnVariable.size = null;
    _pConstColumnVariable.datapath = null;
    _pConstColumnVariable._index = -1;


    _pConstColumnVariable = null;

    //==============================================================================
    // nexacro.DSColumnInfo
    // Dataset ColumnInfo
    //==============================================================================
    nexacro.DSColumnInfo = function (id, type, ntype, size, prop, sumtext, datapath, idx)
    {
        this.id = id;

        this._p_name = id;
        this._p_type = type;  //string : on caller this id Nomalized typeName : toLowerCase()
        this._p_size = size;
        this._p_prop = prop;
        this._p_sumtext = sumtext;
        this._p_datapath = datapath;

        this.ntype = ntype;    //integer
        this._index = idx;

        this._on_apply_columntype();
    };

    var _pDSColumnInfo = nexacro._createPrototype(nexacro.Object, nexacro.DSColumnInfo);
    nexacro.DSColumnInfo.prototype = _pDSColumnInfo;
    _pDSColumnInfo._type_name = "DSColumnInfo";

    _pDSColumnInfo.set_name = nexacro._emptyFn;

    _pDSColumnInfo.set_size = function (v)
    {
        v = +v;
        if (isFinite(v) && this._p_size != v)
        {
            this._p_size = v | 0;
        }
    };

    _pDSColumnInfo.set_type = function (v)
    {
        if (this._p_type != v)
        {
            v = nexacro._toString(v);
            var check = v.toLowerCase();
            if (nexacro.DataUtils._typeenums.indexOf(check) == -1)
            {
                return;
            }

            this._p_type = v;
            this.ntype = nexacro.DataUtils._typeint[check];

            this._on_apply_columntype();
        }
    };

    _pDSColumnInfo.set_prop = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_prop != v)
        {
            this._p_prop = v;
        }
    };

    _pDSColumnInfo.set_sumtext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_sumtext != v)
        {
            this._p_sumtext = v;
        }
    };

    _pDSColumnInfo.set_datapath = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_datapath != v)
        {
            this._p_datapath = v;
            this.on_apply_datapath()
        }
    };

    _pDSColumnInfo.on_apply_datapath = function ()
    {
        this._value = undefined;
    };

    _pDSColumnInfo._on_apply_columntype = function ()
    {
        var ntype = this.ntype;
        switch (ntype)
        {
            case 1:
                // string
                this._toText = nexacro.DataUtils.toTextFromString;
                this._fromText = nexacro.DataUtils.toStringFromText;
                this._fromVal = nexacro.DataUtils.toString;
                this._toXMLText = nexacro.DataUtils.toXMLTextFromString;
                this._fromXMLText = nexacro.DataUtils.toStringFromXMLText;
                break;
            case 2:
                // int
                this._toText = nexacro.DataUtils.toTextFromInt;
                this._fromText = nexacro.DataUtils.toIntFromText;
                this._fromVal = nexacro.DataUtils.toInt;
                this._toXMLText = nexacro.DataUtils.toTextFromInt;
                this._fromXMLText = nexacro.DataUtils.toIntFromText;
                break;
            case 3:
                // float
                this._toText = nexacro.DataUtils.toTextFromFloat;
                this._fromText = nexacro.DataUtils.toFloatFromText;
                this._fromVal = nexacro.DataUtils.toFloat;
                this._toXMLText = nexacro.DataUtils.toTextFromFloat;
                this._fromXMLText = nexacro.DataUtils.toFloatFromText;
                break;
            case 4:
                // bigdecimal
                this._toText = nexacro.DataUtils.toTextFromDecimal;
                this._fromText = nexacro.DataUtils.toDecimalFromText;
                this._fromVal = nexacro.DataUtils.toDecimal;
                this._toXMLText = nexacro.DataUtils.toTextFromDecimal;
                this._fromXMLText = nexacro.DataUtils.toDecimalFromText;
                break;
            case 5:
                // date
                this._toText = nexacro.DataUtils.toTextFromDate;
                this._fromText = nexacro.DataUtils.toDateFromText;
                this._fromVal = nexacro.DataUtils.toDate;
                this._toXMLText = nexacro.DataUtils.toTextFromDate;
                this._fromXMLText = nexacro.DataUtils.toDateFromText;
                break;
            case 6:
                // time
                this._toText = nexacro.DataUtils.toTextFromTime;
                this._fromText = nexacro.DataUtils.toTimeFromText;
                this._fromVal = nexacro.DataUtils.toTime;
                this._toXMLText = nexacro.DataUtils.toTextFromTime;
                this._fromXMLText = nexacro.DataUtils.toTimeFromText;
                break;
            case 7:
                // datetime
                this._toText = nexacro.DataUtils.toTextFromDateTime;
                this._fromText = nexacro.DataUtils.toDateTimeFromText;
                this._fromVal = nexacro.DataUtils.toDateTime;
                this._toXMLText = nexacro.DataUtils.toTextFromDateTime;
                this._fromXMLText = nexacro.DataUtils.toDateTimeFromText;
                break;
            case 8:
                // blob
                this._toText = nexacro.DataUtils.toTextFromBlob;
                this._fromText = nexacro.DataUtils.toBlobFromText;
                this._fromVal = nexacro.DataUtils.toBlob;
                this._toXMLText = nexacro.DataUtils.toTextFromBlob;
                this._fromXMLText = nexacro.DataUtils.toBlobFromText;
                break;
            default:
                // variant
                this._toText = nexacro.DataUtils.toTextFromVariant;
                this._fromText = nexacro.DataUtils.toVariantFromText;
                this._fromVal = nexacro.DataUtils.toVariant;
                this._toXMLText = nexacro.DataUtils.toXMLTextFromVariant;
                this._fromXMLText = nexacro.DataUtils.toVariantFromXMLText;
                break;
        }
    };

    _pDSColumnInfo._properties = [{ name: "name" }, { name: "size" }, { name: "type" }, { name: "prop" }, { name: "sumtext" }, { name: "datapath" }];
    nexacro._defineProperties(_pDSColumnInfo, _pDSColumnInfo._properties);

    _pDSColumnInfo = null;

    nexacro.DSColumnInfoList = function ()
    {
        nexacro.Collection.apply(this);
    };
    var _pDSColumnInfoList = nexacro._createPrototype(nexacro.Collection, nexacro.DSColumnInfoList);
    nexacro.DSColumnInfoList.prototype = _pDSColumnInfoList;
    _pDSColumnInfoList._type_name = "DSColumnInfoList";

    _pDSColumnInfoList._updateID = function (idx, newID)
    {
        var colinfo = this[idx];
        if (colinfo && colinfo.id != newID)
        {
            colinfo.set_id(newID);
            return this.update_id(idx, newID);
        }
        return false;
    };

    _pDSColumnInfoList.deleteItem = function (id)
    {
        return this.delete_item(id);
    };
    _pDSColumnInfoList = null;

    //--------------------------------------------------------------------------------------------
    // EventInfo
    //--------------------------------------------------------------------------------------------
    // nexacro.DSColChangeEventInfo
    //--------------------------------------------------------------------------------------------
    nexacro.DSColChangeEventInfo = function (obj, id, row, col, colidx, columnid, oldvalue, newvalue)
    {
        this.id = this.eventid = id || "oncolumnchanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.row = row;
        this.col = col;
        this.colidx = colidx;
        this.columnid = columnid;
        this.oldvalue = oldvalue;
        this.newvalue = newvalue;
    };
    var _pDSColChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DSColChangeEventInfo);
    nexacro.DSColChangeEventInfo.prototype = _pDSColChangeEventInfo;
    _pDSColChangeEventInfo._type_name = "DSColChangeEventInfo";

    _pDSColChangeEventInfo.set_newvalue = function (v)
    {
        if (this.newvalue != v)
        {
            this.newvalue = v;
        }
    };

    _pDSColChangeEventInfo = null;


    //--------------------------------------------------------------------------------------------
    // nexacro.DSLoadEventInfo
    //--------------------------------------------------------------------------------------------
    nexacro.DSLoadEventInfo = function (obj, id, errorcode, errormsg, reason, progressload)
    {
        this.id = this.eventid = id || "onload";
        this.fromobject = this.fromreferenceobject = obj;

        this.errorcode = errorcode;
        this.errormsg = errormsg;
        this.reason = reason;
        this.progressload = (progressload === true) ? true : false;
    };
    var _pDSLoadEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DSLoadEventInfo);
    nexacro.DSLoadEventInfo.prototype = _pDSLoadEventInfo;
    _pDSLoadEventInfo._type_name = "DSLoadEventInfo";

    _pDSLoadEventInfo = null;

    //--------------------------------------------------------------------------------------------
    // nexacro.DSRowPosChangeEventInfo
    //--------------------------------------------------------------------------------------------
    nexacro.DSRowPosChangeEventInfo = function (obj, id, oldRow, newRow, reason)
    {
        this.id = this.eventid = id || "onrowposchanged";
        this.fromobject = this.fromreferenceobject = obj;
        this.newrow = newRow;
        this.oldrow = oldRow;
        this.reason = reason;
    };
    var _pDSRowPosChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DSRowPosChangeEventInfo);
    nexacro.DSRowPosChangeEventInfo.prototype = _pDSRowPosChangeEventInfo;
    _pDSRowPosChangeEventInfo._type_name = "DSRowPosChangeEventInfo";

    _pDSRowPosChangeEventInfo = null;

    //--------------------------------------------------------------------------------------------
    // nexacro.DSRowsChangeEventInfo
    //--------------------------------------------------------------------------------------------
    nexacro.DSRowsetChangeEventInfo = function (obj, id, row, count, reason)
    {
        this.id = this.eventid = id || "onrowsetchanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.row = row;
        this.count = count;
        this.reason = reason;
    };
    var _pDSRowsetChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DSRowsetChangeEventInfo);
    nexacro.DSRowsetChangeEventInfo.prototype = _pDSRowsetChangeEventInfo;
    _pDSRowsetChangeEventInfo._type_name = "DSRowsetChangeEventInfo";

    _pDSRowsetChangeEventInfo = null;

    //==============================================================================
    // nexacro.DatasetBase
    //==============================================================================
    nexacro.DatasetBase = function (id, parent)
    {
        nexacro._EventSinkObject.call(this, id, parent);

        // init Datas
        this._p_colinfos = new nexacro.DSColumnInfoList();

        // ----------------- internal variable ------------------ //
        this._constVars = new nexacro.VariableList();
        this._rawRecords = [];
        this._viewRecords = this._rawRecords;
        this._deletedRecords = [];

        // init internal Keys
        this._keycols = [];
        this._keycols.max_keylevel = 0;
        // expr cache
        this._exprFuncs = {};

        this._dirtylist = [];

        this._initDatasetRuleFuncs(nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule);
    };

    var _pDatasetBase = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.DatasetBase);
    nexacro.DatasetBase.prototype = _pDatasetBase;
    _pDatasetBase._type_name = "Dataset";
    _pDatasetBase._isData = true;

    _pDatasetBase.loadstatus = false;
    _pDatasetBase.firefirstcount = 0;
    _pDatasetBase.firenextcount = 0;
    _pDatasetBase.lazyParsing = true;


    // readonly property
    _pDatasetBase._p_colcount = 0;
    _pDatasetBase._p_constcount = 0;
    _pDatasetBase._p_colinfos = null;
    _pDatasetBase._p_rowcount = 0;

    // normal property
    _pDatasetBase._p_arguments = "";
    _pDatasetBase._p_rowposition = -1;
    _pDatasetBase._p_enableevent = true;
    _pDatasetBase._p_updatecontrol = true;
    _pDatasetBase._p_keystring = "";
    _pDatasetBase._p_collation = undefined;
    _pDatasetBase._p_filterstr = "";
    _pDatasetBase._p_loadkeymode = "keep"; //nexacro.DatasetBase.LOADMODE_KEEP;
    _pDatasetBase._p_loadfiltermode = "keep"; //nexacro.DatasetBase.LOADMODE_KEEP;
    _pDatasetBase._p_reversesubsum = false;
    _pDatasetBase._p_useclientlayout = false;
    _pDatasetBase._p_savenan = undefined;
    _pDatasetBase._p_saveinfinity = undefined;
    _pDatasetBase._p_saveinvaliddate = undefined;

    // [TODO] Nexacro K용 Metainfo/Manual 작업
    // grouprowtype: both, header, summary(default)
    //  both: header, rows...., summary
    //  header: column's value=groupheadertext
    //   rowtype=32
    //  summary: sum or reversesubsum
    //   rowtype=16
    _pDatasetBase._p_grouprowtype = "summary"; // nexacro.DatasetBase._GROUPROWTYPES

    // [TODO] Nexacro K용 Metainfo/Manual 작업
    // groupheadertext: value(default) | summary | value (count rows)
    _pDatasetBase._p_groupheadertext = undefined;

    //DataObject  
    _pDatasetBase._p_binddataobject = null;
    _pDatasetBase._p_dataobjectpath = undefined;
    _pDatasetBase._p_dataobjectbindmode = undefined;

    _pDatasetBase._event_list = {
        "onload": 1, "cancolumnchange": 1, "oncolumnchanged": 1, "onvaluechanged": 1,
        "canrowposchange": 1, "onrowposchanged": 1, "onrowsetchanged": 1, "onworkcompleted": 1
    };

    _pDatasetBase._defaultKeyStr = "";
    _pDatasetBase._defaultFilterStr = "";
    _pDatasetBase._eventstat = true;

    // Add By Song --> for Shared Dataset
    _pDatasetBase._is_reftype = false;          // if Shared Dataset, this is true

    // Add for lazy parse error when cache level session,static
    _pDatasetBase._dataType = "";
    _pDatasetBase._colInfoLines = null;
    _pDatasetBase._cachedConvertFn = null;

    nexacro.DatasetBase.LOADMODE_KEEP = 0;
    nexacro.DatasetBase.LOADMODE_RESET = 1;

    nexacro.DatasetBase._LOADMODE_ENUM =
    {
        "keep": 0,
        "reset": 1
    };
    nexacro.DatasetBase._GROUPROWTYPES =
    {
        "both": 0,
        "header": 1,
        "summary": 2
    };
    nexacro.DatasetBase._GROUPHEADERTEXT =
    {
        "value": 0,
        "summary": 1
    };

    _pDatasetBase._isDataset = function ()
    {
        return true;
    };

    _pDatasetBase.destroy = function ()
    {
        if (!this._is_reftype)
        {
            if (this.colinfos)
            {
                this.colinfos.clear();

            }
            if (this._constVars)
            {
                this._constVars.clear();

            }
        }

        if (this._viewRecords != this._rawRecords)
        {
            this._viewRecords.length = 0;
        }
        if (this._rawRecords && this._rawRecords.length)
        {
            this._clearRecordData(this._rawRecords);
        }


        if (this._deletedRecords && this._deletedRecords.length)
        {
            this._clearRecordData(this._deletedRecords);
        }

        if (this._keycols)
            this._keycols.length = 0;

        this._clearAllExprs();
        this._p_rowcount = 0;

        this.on_fire_sys_onload(0, "", 91); //nexacro.Dataset.REASON_UNBINDSOURCE  //don't fire userevent

        this._viewRecords = null;
        this._rawRecords = null;
        this._deletedRecords = null;
        this._event_list = null;
        this._exprFuncs = null;
        this._filterFn = null;
        this.__loadConvertFn = null;
        this.__lazyParseRecordFn = null;
        this._keycols = null;
        this._p_colinfos = null;
        this._constVars = null;
        this._is_created = null;
        this._binddataobject = null;
        if (this._keycol_levels)
        {
            this._keycol_levels.length = null;
            this._keycol_levels = null;
        }

        if (this.parent)
            this.parent.removeChild(this.id);
        this.parent = null;

        nexacro._EventSinkObject.prototype.destroy.call(this);
    };

    // ----------------- property control ------------------ //
    _pDatasetBase.set_arguments = function (v) { };
    _pDatasetBase.set_binddataobject = function (v) { };

    _pDatasetBase.set_enableevent = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enableevent != v)
        {
            this._p_enableevent = v;
            this._eventstat = (v && !this.loadstatus);
            if (v)
            {
                this.on_fire_onrowsetchanged(-1, -1, 41); //nexacro.Dataset.REASON_ENABLEEVENT
                if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                {
                    var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
            }
        }
    };

    _pDatasetBase.set_updatecontrol = function (v)
    {
        this._p_updatecontrol = nexacro._toBoolean(v);
    };

    _pDatasetBase.set_rowposition = function (v)
    {
        v = +v;
        if (isFinite(v))
        {
            this._setRowPosition(v, 51);
        }
        return this._p_rowposition;
    };

    _pDatasetBase.set_keystring = function (v)
    {
        v = nexacro._toString(v);

        this._p_keystring = v;
        this.on_apply_keystring();

        return this._p_keystring;
    };

    _pDatasetBase.on_apply_keystring = function ()
    {
        this.updateSortGroup(this._p_keystring, true);
    };

    _pDatasetBase.set_filterstr = function (v)
    {
        var str = nexacro._toString(v);

        if (str != this._p_filterstr)
        {
            this.filter(str);
        }
        return this._p_filterstr;
    };

    _pDatasetBase.set_loadkeymode = function (v)
    {
        v = nexacro._toString(v).toLowerCase();
        if (this._p_loadkeymode != v)
        {
            this._p_loadkeymode = v;
        }
    };

    _pDatasetBase.set_loadfiltermode = function (v)
    {
        v = nexacro._toString(v).toLowerCase();
        if (this._p_loadfiltermode != v)
        {
            this._p_loadfiltermode = v;
        }
    };

    _pDatasetBase.set_reversesubsum = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_reversesubsum != v)
        {
            this._p_reversesubsum = v;
            this.on_apply_reversesubsum();
        }
    };

    _pDatasetBase.on_apply_reversesubsum = function ()
    {
        if (this._p_keystring)
            this.updateSortGroup(this._p_keystring);
    };

    _pDatasetBase.set_useclientlayout = function (v)
    {
        v = nexacro._toBoolean(v);
        this._p_useclientlayout = v;
    };

    _pDatasetBase.set_savenan = function (v)
    {
        if (!v) return;

        var type_enum = ["exclude", "include"];

        v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_savenan = v;
    };

    _pDatasetBase.set_saveinfinity = function (v)
    {
        if (!v) return;

        var type_enum = ["exclude", "include"];

        v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_saveinfinity = v;
    };

    _pDatasetBase.set_saveinvaliddate = function (v)
    {
        if (!v) return;

        var type_enum = ["exclude", "include"];

        v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_saveinvaliddate = v;
    };

    _pDatasetBase.getSaveNan = function (v)
    {
        v = this._p_savenan;
        var env = nexacro.getEnvironment();

        return v ? v : env.datasetsavenan;
    };

    _pDatasetBase.getSaveInfinity = function (v)
    {
        v = this._p_saveinfinity;
        var env = nexacro.getEnvironment();

        return v ? v : env.datasetsaveinfinity;
    };

    _pDatasetBase.getSaveInvalidDate = function (v)
    {
        v = this._p_saveinvaliddate;
        var env = nexacro.getEnvironment();

        return v ? v : env.datasetsaveinvaliddate;
    };

    _pDatasetBase.set_collation = function (v)
    {
        var collation_enum = ["none", "systemlanguage", "currentlocale"];
        if (collation_enum.indexOf(v) == -1 && (v && (v.indexOf("_") == -1 && v.indexOf("-") == -1)))
        {
            return;
        }

        if (this._p_collation != v)
        {
            this._p_collation = v;
            this.on_apply_collation();
        }
    };

    _pDatasetBase.on_apply_collation = function (v)
    {
        this.updateSortGroup(this._p_keystring, true);
    };

    _pDatasetBase._properties = [{ name: "dataobjectbindmode" }, { name: "dataobjectpath" }, { name: "enableevent" }, { name: "updatecontrol" }, { name: "rowposition" }, { name: "keystring" }, { name: "filterstr" }, { name: "loadkeymode" }, { name: "loadfiltermode" }, { name: "reversesubsum" }, { name: "useclientlayout" }, { name: "savenan" }, { name: "saveinfinity" }, { name: "saveinvaliddate" }, { name: "collation" }, { name: "colinfos", readonly: true }, { name: "colcount", readonly: true }, { name: "constcount", readonly: true }, { name: "rowcount", readonly: true }];
    nexacro._defineProperties(_pDatasetBase, _pDatasetBase._properties);

    _pDatasetBase.set_grouprowtype = function (v)
    {
        v = nexacro._toString(v).toLowerCase();
        if (this._p_grouprowtype != v)
        {
            this._p_grouprowtype = v;
            this.on_apply_grouprowtype();
        }
    };
    _pDatasetBase.on_apply_grouprowtype = function ()
    {
        if (!this._is_created) return;

        if (this._p_keystring)
            this.updateSortGroup(this._p_keystring);
    };
    nexacro._defineProperties(_pDatasetBase, [{ name: "grouprowtype" }]);

    _pDatasetBase.set_groupheadertext = function (v)
    {
        v = nexacro._toString(v).toLowerCase();
        if (this._p_groupheadertext != v)
        {
            this._p_groupheadertext = v;
        }
    };
    nexacro._defineProperties(_pDatasetBase, [{ name: "groupheadertext" }]);

    _pDatasetBase.on_apply_groupheadertext = function ()
    {
        if (!this._is_created) return;

        if (this._p_keystring)
            this.updateSortGroup(this._p_keystring);
    };

    // ----------------- event handling ------------------ //
    _pDatasetBase.on_fire_onload = function (errcode, errmsg, reason, progressload)
    {
        if (errcode >= 0)
        {
            // based on manual
            errcode = 0;
            errmsg = "SUCCESS";
        }

        var event = this.onload;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DSLoadEventInfo(this, "onload", errcode, errmsg, reason, progressload);
            event._fireEvent(this, evt);
        }
    };

    _pDatasetBase.on_fire_sys_onload = function (errcode, errmsg, reason, progressload)
    {
        var event = this.onload;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DSLoadEventInfo(this, "onload", errcode, errmsg, reason, progressload);
            event._fireSysEvent(this, evt);
        }
    };

    _pDatasetBase.on_fire_onrowsetchanged = function (row, count, reason)
    {
        var event = this.onrowsetchanged;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DSRowsetChangeEventInfo(this, "onrowsetchanged", row, count, reason);
            event._fireEvent(this, evt);
        }
    };

    _pDatasetBase.on_fire_canrowposchange = function (evt)
    {
        var event = this.canrowposchange;
        if (event && event._has_handlers)
        {
            evt.eventid = "canrowposchange";
            var ret = event._fireCheckEvent(this, evt);
            if (ret === undefined)
            {
                ret = true;
            }

            ret = nexacro._toBoolean(ret);

            if (ret)
            {
                this._p_rowposition = evt.newrow;
            }
            return ret;
        }
        return true;
    };

    _pDatasetBase.on_fire_onrowposchanged = function (evt)
    {
        var event = this.onrowposchanged;
        if (event && event._has_handlers)
        {
            evt.eventid = "onrowposchanged";
            event._fireEvent(this, evt);
        }
    };

    _pDatasetBase.on_fire_cancolumnchange = function (evt)
    {
        var event = this.cancolumnchange;
        if (event && event._has_handlers)
        {
            if (!event._firestat)
            {
                evt.eventid = "cancolumnchange";
                event._firestat = true;
                var ret = event._fireCheckEvent(this, evt);
                event._firestat = false;
                return (ret == undefined) ? true : ret;
            }
            else if (event._firestat)
            {
                return false;
            }
            else
            {
                return false;
            }
        }
        return true;
    };

    _pDatasetBase.on_fire_oncolumnchanged = function (evt)
    {
        var event = this.oncolumnchanged;
        if (event && event._has_handlers)
        {
            if (!event._firestat)
            {
                event._firestat = true;
                evt.eventid = "oncolumnchanged";
                event._fireEvent(this, evt);
                event._firestat = false;
            }
            else // user fire oncolumnchanged에서 다시 setColumn할 경우 sys만 호출 되도록.. cmc 15/10/12
            {
                evt.eventid = "oncolumnchanged";
                event._fireSysEvent(this, evt);
            }
        }
    };

    _pDatasetBase.on_fire_onvaluechanged = function (evt)
    {
        var event = this.onvaluechanged;
        if (event && event._has_handlers)
        {
            evt.eventid = "onvaluechanged";
            event._fireEvent(this, evt);
        }
    };

    // ----------------------------------------------------------- //
    _pDatasetBase.clear = function ()
    {
        var oldpos = this._p_rowposition;
        var cnt = this._p_rowcount;
        this._clearAll();

        if (this._eventstat)
        {
            this.on_fire_onrowsetchanged(-1, -1, 24); //nexacro.Dataset.REASON_CLEAR
            if (oldpos >= 0 && oldpos == this._p_rowposition)
            {
                this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
            }
        }
        else
        {
            this._p_rowposition = -1;
        }
        return cnt;
    };

    _pDatasetBase.getColCount = function ()
    {
        return this._p_colcount;
    };

    _pDatasetBase.getConstCount = function ()
    {
        return this._constVars.length;
    };

    _pDatasetBase.getRowCount = function ()
    {
        return this._viewRecords.length;
    };

    _pDatasetBase.getRowCountNF = function ()
    {
        return this._rawRecords.length;
    };

    _pDatasetBase.getDeletedRowCount = function ()
    {
        return this._deletedRecords.length;
    };

    _pDatasetBase.getDeletedRowset = function ()
    {
        return this._deletedRecords;
    };

    _pDatasetBase.setContents = function (str)
    {
        return this._setContents(str);
    };

    //-------------------------------------------------------------------
    _pDatasetBase._setLayout = function (ds)
    {
        this._p_colinfos = ds.colinfos;
        this._constVars = ds._constVars;
    };

    _pDatasetBase._setRawData = function (rawRecords, deletedData)
    {
        this._rawRecords = rawRecords;
        this._viewRecords = this._rawRecords;
        this._deletedRecords = deletedData;
    };

    _pDatasetBase._createExprFunc = function (expr_str)
    {
        var parser = new nexacro.ExprParser();
        var conv_expr = parser.makeExpr(this, expr_str);

        if (conv_expr == null)
            return nexacro._NullFn;
        var exprfn = nexacro._createInlineFunc(conv_expr, ["currow", "rowidx", "comp", "dataset", "_records_", "_row_", "_args_", "group"]);
        return exprfn;
    };

    _pDatasetBase._getColumnSize = function (col)
    {
        var colidx = (+col);
        var colinfo, constVar;
        if (colidx != colidx)
        { // isNaN
            colinfo = this.colinfos[col];
            if (colinfo)
            {
                return colinfo.size;
            }
            constVar = this._constVars[col];
            if (constVar)
            {
                return constVar.size;
            }

            if (typeof (col) == "string")
                return undefined;
            colinfo = this.colinfos[0];  //undefined, null
            if (colinfo)
                return colinfo.size;
        }
        else
        {
            if (colidx >= 0 && colidx < this.colinfos.length)
                return this.colinfos[colidx].size;
            if (colidx >= 0 && colidx <= this._p_colcount)
                return this._constVars[colidx - this.colinfos.length].size;
            else  // columnid 가 숫자인경우
            {
                colinfo = this.colinfos[col];
                if (colinfo)
                    return colinfo.size;
                constVar = this._constVars[col];
                if (constVar)
                    return constVar.size;
            }
        }
        return undefined;
    };

    _pDatasetBase._getColumnType = function (col)
    {
        var colidx = (+col);
        var colinfo, constVar;
        if (colidx != colidx)  //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        { // isNaN
            colinfo = this.colinfos[col];
            if (colinfo)
                return colinfo.ntype;
            constVar = this._constVars[col];
            if (constVar)
                return constVar.ntype;

            if (typeof (col) == "string")
                return undefined;

            colinfo = this.colinfos[0];  //undefined, null
            if (colinfo)
                return colinfo.ntype;
        }
        else
        {
            if (colidx >= 0 && colidx < this.colinfos.length)
                return this.colinfos[colidx].ntype;
            if (colidx >= 0 && colidx <= this._p_colcount)
                return this._constVars[colidx - this.colinfos.length].ntype;
            else  // columnid 가 숫자인경우
            {
                colinfo = this.colinfos[col];
                if (colinfo)
                    return colinfo.ntype;
                constVar = this._constVars[col];
                if (constVar)
                    return constVar.ntype;
            }
        }
        return undefined;
    };

    _pDatasetBase._isConstColumn = function (col)
    {
        var colidx = (+col);
        if (colidx != colidx)
        { // isNaN
            return (this._constVars[col]) ? true : false;
        }
        else
        {
            var idx = colidx - this.colinfos.length;
            return (idx >= 0 && idx < this._constVars.length) ? true : false;
        }
    };

    //==============================================================================
    // Column control functions
    //==============================================================================
    // column control functions
    _pDatasetBase._addConstColumn = function (id, value, type, size, datapath)
    {
        if (id in this.colinfos)
        {
            return -1;
        }

        var ntype;
        if (type)
        {
            ntype = nexacro.DataUtils._typeint[nexacro._toString(type).toLowerCase()];
        }
        else
        {
            type = (typeof value);
            if (type == "number")
                ntype = 2;
            else
                ntype = nexacro.DataUtils._typecodes[type];
        }

        if (ntype == null)
        {
            type = "variant";
            ntype = 9;
        }

        var prev_var = this._constVars[id];
        if (prev_var)
        {
            if (value != prev_var.value)
            {
                prev_var.value = nexacro.DataUtils.convert(value, ntype);
                return this._constVars.indexOf(id);
            }
            else
            {
                return -1;
            }
        }

        this._p_constcount++;
        this._p_colcount++;
        return this._constVars.add(id, new nexacro.ConstColumnVariable(id, value, type, ntype, size, datapath, this._constVars.length));
    };
    _pDatasetBase.addConstColumn = function (id, value, type, size, datapath)
    {
        var idx = this._addConstColumn(id, value, type, size, datapath);
        if (idx >= 0 && this._eventstat)
        {
            this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
        }
        return idx;
    };

    _pDatasetBase._addColumn = function (id, type, size, prop, text, datapath)
    {
        if ((id in this.colinfos) || (id in this._constVars))
            return -1;

        size = size | 0;

        var ntype = undefined;
        if (type)
        {
            //type = nexacro._toString(type).toLowerCase();
            ntype = nexacro.DataUtils._typeint[nexacro._toString(type).toLowerCase()];
        }

        if (ntype == null)
        {
            // default type == string
            ntype = 1;
            type = "STRING";
        }

        if (size == 0)
        {
            size = nexacro.DataUtils._default_sizes[ntype];
        }


        var idx = this.colinfos.length;  //확인 필요
        var colinfo = new nexacro.DSColumnInfo(id, type, ntype, size, prop, text, datapath, idx);
        this._p_colcount++;
        return this.colinfos.add(id, colinfo);
    };

    _pDatasetBase.addColumn = function (id, type, size, datapath)
    {
        var idx = this._addColumn(id, type, size, undefined, undefined, datapath);
        if (idx >= 0)
        {
            this._clearAllExprs();
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
            }
        }
        return idx;
    };


    _pDatasetBase._addColumnInfo = function (id, colinfo)
    {
        if ((id in this.colinfos) || (id in this._constVars))
        {
            return -1;
        }

        var newcolinfo = new nexacro.DSColumnInfo(id, colinfo.type, colinfo.ntype, colinfo.size, colinfo.prop, colinfo.sumtext, colinfo.datapath, this.colinfos.length); // RP_38601
        this._p_colcount++;
        return this.colinfos.add(id, newcolinfo);
    };

    _pDatasetBase.addColumnInfo = function (id, colinfo)
    {
        var idx = this._addColumnInfo(id, colinfo);
        if (idx >= 0)
        {
            this._clearAllExprs();
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
            }
        }
        return idx;
    };

    _pDatasetBase._appendColList = function (colList)
    {
        if (colList._type_name == "DSColumnInfoList")
        {
            var cnt = 0;

            function __appendColList_loopFn(i)
            {
                var colinfo = colList[i];
                var id = colinfo.id;
                if ((id in this.colinfos) || (id in this._constVars))
                {
                    return;
                }
                var newcolinfo = new nexacro.DSColumnInfo(id, colinfo.type, colinfo.ntype, colinfo.size, colinfo.prop, colinfo.sumtext, colinfo.datapath, this.colinfos.length);
                this.colinfos.add(id, newcolinfo);
                cnt++;
            }
            nexacro.__forLoop(this, 0, colList.length, __appendColList_loopFn);

            if (cnt > 0)
            {
                this._p_colcount += cnt;
            }
            return cnt;
        }
        return 0;
    };

    _pDatasetBase.appendColList = function (collist)
    {
        var cnt = this._appendColList(collist);
        if (cnt > 0)
        {
            this._clearAllExprs();
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
            }
        }
        return cnt;
    };

    _pDatasetBase._deleteColumn_Row = function (idx, Records)
    {
        var rowcount = Records.length;
        function __deleteColumm_Row_loopFn(i)
        {
            var rowRow = this.__getParsedRow(Records[i]);
            if (rowRow)
            {
                rowRow.splice(idx, 1);
                if (rowRow._orgrow)
                    rowRow._orgrow.splice(idx, 1);
            }
        }

        nexacro.__forLoop(this, 0, rowcount, __deleteColumm_Row_loopFn);
    };


    _pDatasetBase._deleteColumn = function (id)
    {
        //if (this.updatecontrol || this._rawRecords.length > 0)
        //    return false;

        if (this._p_updatecontrol)
            return false;

        var idx = this.getColIndex(id);
        if (idx < 0)
            return false;

        var colList = this.colinfos;
        if (idx >= colList.length)
        {
            var constList = this._constVars;
            idx = idx - colList.length;
            if (constList.delete_item(idx) >= 0)
            {
                function __adjustConstIdx_loopFn(i)
                {
                    constList[i]._index = i;
                }
                nexacro.__forLoop(this, idx, constList.length, __adjustConstIdx_loopFn);
                this._p_constcount--;
                this._p_colcount--;
            }
        }
        else
        {
            var viewRecords = this._viewRecords;
            var rawRecords = this._rawRecords;

            if (rawRecords == viewRecords)
            {
                this._deleteColumn_Row(idx, rawRecords);
            }
            else
            {
                this._deleteColumn_Row(idx, viewRecords);
                this._deleteColumn_Row(idx, rawRecords);
            }

            if (colList.delete_item(idx) >= 0)
            {
                function __adjustColIdx_loopFn(i)
                {
                    colList[i]._index = i;
                }
                nexacro.__forLoop(this, idx, colList.length, __adjustColIdx_loopFn);
                this._p_colcount--;
            }
        }
        return true;
    };

    _pDatasetBase.deleteColumn = function (id)
    {
        var deleted = this._deleteColumn(id);
        if (deleted)
        {
            this._clearAllExprs();
            if (this.colinfos.length == 0)
            {
                this._clearData();
            }
            var colcnt = this._constVars.length + this.colinfos.length;
            var oldpos = this._p_rowposition;
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
                if (colcnt == 0 && oldpos >= 0)
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE
                }
            }
            else if (colcnt == 0 && oldpos >= 0)
            {
                this._p_rowposition = -1;
            }
        }
        return deleted;
    };

    _pDatasetBase.getColID = function (idx)
    {
        idx = idx | 0;
        var colList = this.colinfos;
        if (idx >= colList.length)
        {
            return this._constVars.get_id(idx - colList.length);
        }
        else
        {
            return colList.get_id(idx);
        }
    };

    _pDatasetBase.getColIndex = function (id)
    {
        var colList = this.colinfos;
        var constList = this._constVars;
        var colCnt = colList.length;
        var constCnt = constList.length;

        if (colCnt <= 0 && constCnt <= 0)
            return -1;

        var colinfo = colList[id];
        if (colinfo)
            return colinfo._index;

        var idx = (+id);
        if (idx != id)
        {
            var constidx = constList.indexOf(id);
            return constidx >= 0 ? constidx + colCnt : -1;
        }

        return (idx >= 0 && idx < constCnt + colCnt) ? idx : -1;
    };

    _pDatasetBase.getConstColID = function (idx)
    {
        idx = idx | 0;
        return this._constVars.get_id(idx);
    };

    _pDatasetBase.getConstColIndex = function (id)
    {
        var constVar = this._constVars[id];
        return (constVar) ? constVar._index : -1;
    };

    _pDatasetBase.getColumnInfo = function (idx)
    {
        if (this.colinfos[idx])
            return this.colinfos[idx];

        var colidx = +(idx);
        if (colidx != idx)  //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            if (typeof (idx) == "string")
                return undefined;
            return this.colinfos[0]; //undefined, null 은 index 0 으로 처리
        }

        return undefined;
    };

    _pDatasetBase.updateColID = function (idx, newID)
    {
        var colList = this.colinfos;
        var constList = this._constVars;
        var updated;
        var evt;
        idx = this.getColIndex(idx);
        if (idx < 0)
        {
            return -1;
        }
        else if (idx < colList.length)
        {
            updated = colList._updateID(idx, newID);
            if (updated)
            {
                this._clearAllExprs();
                if (this._eventstat)
                {
                    this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
                    evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
                return idx;
            }
        }
        else
        {
            updated = constList._updateID(idx - colList.length, newID);
            if (updated)
            {
                this._clearAllExprs();
                if (this._eventstat)
                {
                    this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
                    evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
                return idx;
            }
        }
        return -1;
    };

    _pDatasetBase.updateConstColID = function (idx, newID)
    {
        var constList = this._constVars;
        var conatVar = constList[idx];
        if (conatVar)
        {
            var updated = constList._updateID(conatVar._index, newID);
            if (updated)
            {
                if (this._eventstat)
                {
                    this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
                    var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
                return conatVar._index;
            }
        }
        return -1;
    };

    //==============================================================================
    // helper functions
    _pDatasetBase._copyRowData = function (destRow, srcRow)
    {
        var colList = this.colinfos;
        function __copyRowData_loopFn(i)
        {
            destRow[i] = srcRow[i];
        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        if (cnt > 0)
        {
            nexacro.__forLoop(this, 0, cnt, __copyRowData_loopFn);

            if (cnt != destRow.length)
            {
                destRow.splice(cnt, destRow.length);
            }
        }
        else
        {
            destRow.splice(0, destRow.length);
        }
    };

    _pDatasetBase._copyConvRowData = function (destRow, srcRow)
    {
        var colList = this.colinfos;
        function __copyConvRowData_loopFn(i)
        {
            var value = colList[i]._fromVal(srcRow[i]);
            destRow[i] = value;
        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyConvRowData_loopFn);
    };

    _pDatasetBase._copyTextData = function (destRow, srcRow)
    {
        var colList = this.colinfos;
        function __copyTextRowData_loopFn(i)
        {
            var value = colList[i]._fromText(srcRow[i]);
            destRow[i] = value;
        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyTextRowData_loopFn);
    };

    // for lazyload
    _pDatasetBase.__getParsedRow = function (rowRow)
    {
        if (rowRow && rowRow._data)
        {
            if (this.__lazyParseRecordFn === undefined || this.__lazyParseRecordFn === null)
            {
                this.__loadConvertFn = this._cachedConvertFn;

                if (this._dataType == "CSV")
                {
                    if (nexacro._Array2DataUtil.isTypedArray(rowRow._data))
                        this.__lazyParseRecordFn = this._lazyParseRecordFromCSVLine_with_Uint8Array;
                    else
                        this.__lazyParseRecordFn = this._lazyParseRecordFromCSVLine;

                    if (this.__loadConvertFn === null)
                        this.__loadConvertFn = this._setColInfoFromCSVLine(this._colInfoLines, this._p_useclientlayout);
                }
                else if (this._dataType == "SSV") 
                {
                    if (nexacro._Array2DataUtil.isTypedArray(rowRow._data))
                        this.__lazyParseRecordFn = this._lazyParseRecordFromSSVLine_with_Uint8Array;
                    else
                        this.__lazyParseRecordFn = this._lazyParseRecordFromSSVLine;

                    if (this.__loadConvertFn === null)
                        this.__loadConvertFn = this._setColInfoFromSSVLines(this._colInfoLines, this._p_useclientlayout);
                }
                else if (this._dataType == "BIN") 
                {
                    this.__lazyParseRecordFn = this._lazyParseRecordFromBINLine_with_Uint8Array;
                }
            }

            this.__lazyParseRecordFn(rowRow, this.__loadConvertFn);
        }

        return rowRow;
    };

    _pDatasetBase._makeIndexMap = function (srcds, strcolinfo)
    {
        if (srcds == null)
        {
            return false;
        }

        if (srcds._isDataset && !srcds._isDataset())
        {
            return false;
        }

        var colList = this.colinfos;
        var srcList = srcds.colinfos;
        var idx_map = [];
        var dst_idx;
        var src_idx;
        if (strcolinfo != null && strcolinfo.length > 0)
        {
            var colArr = strcolinfo.split(',');
            function __makeIndexMap_fromStr_loopFn(i)
            {
                var colids = colArr[i].split('=');
                if (colids.length > 1)
                {
                    dst_idx = colList.indexOf(colids[0].trim());
                    src_idx = srcList.indexOf(colids[1].trim());
                    if (dst_idx >= 0 && src_idx >= 0)
                    {
                        idx_map[idx_map.length] = { dest: dst_idx, src: src_idx };
                    }
                }
                else
                {
                    var colid = colids[0].trim();
                    dst_idx = colList.indexOf(colid);
                    src_idx = srcList.indexOf(colid);
                    if (dst_idx >= 0 && src_idx >= 0)
                    {
                        idx_map[idx_map.length] = { dest: dst_idx, src: src_idx };
                    }
                }
            }
            nexacro.__forLoop(this, 0, colArr.length, __makeIndexMap_fromStr_loopFn);
        }
        else
        {
            function __makeIndexMap_fromCol_loopFn(i)
            {
                var dst_idx = colList.indexOf(srcList[i].id);
                if (dst_idx >= 0)
                {
                    idx_map[idx_map.length] = { dest: dst_idx, src: i };
                }
            }
            nexacro.__forLoop(this, 0, srcList.length, __makeIndexMap_fromCol_loopFn);
        }

        return (idx_map.length > 0) ? idx_map : null;
    };

    _pDatasetBase._copyMappingRowData = function (destRow, srcRow, idx_map)
    {
        if (idx_map)
        {
            var colList = this.colinfos;
            function __copyMappingRowData_loopFn(i)
            {
                var idxmap = idx_map[i];
                var dst_idx = idxmap.dest;
                var value = colList[dst_idx]._fromVal(srcRow[idxmap.src]);
                destRow[dst_idx] = value;
            }
            nexacro.__forLoop(this, 0, idx_map.length, __copyMappingRowData_loopFn);
        }
    };

    _pDatasetBase._copyMappingRowDataRowType = function (destRow, srcRow, idx_map, viewrow)
    {
        if (idx_map)
        {
            var colList = this.colinfos;
            var rowtype = 1;

            if (this._p_updatecontrol)
            {
                rowtype = destRow._rtype;
                if (destRow._rtype == 1) //nexacro.Dataset.ROWTYPE_NORMAL
                {
                    var orgRow = [];
                    // 원본을 복사하는 api인데 idx_map에 따른 copy api를 써서 오류 발생 - 수정함
                    this._copyRowData(orgRow, destRow);
                    destRow._orgrow = orgRow;
                    rowtype = 4;
                }
            }

            function __copyMappingRowData_loopFn(i)
            {
                var idxmap = idx_map[i];
                var dst_idx = idxmap.dest;
                var value = colList[dst_idx]._fromVal(srcRow[idxmap.src]);

                destRow[dst_idx] = value;
            }

            nexacro.__forLoop(this, 0, idx_map.length, __copyMappingRowData_loopFn);

            if (this._p_updatecontrol)
            {
                if (destRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
                {
                    if (destRow._orgrow)
                    {
                        var _rtypechange = this._isEqualRow(destRow._orgrow, destRow, -1);
                        if (_rtypechange)  //normal 로 변경
                        {
                            destRow._orgrow.length = 0;
                            delete destRow._orgrow;
                            rowtype = 1;
                        }
                    }
                }
            }

            destRow._rtype = rowtype;

            if (viewrow >= 0)
                this._updateGroupRowData(viewrow);
        }
    };

    // row control Helper functions
    _pDatasetBase._adjustRawIdx = function (start, end)
    {
        var rawRecords = this._rawRecords;
        if (start >= 0 && end > start)
        {
            function __adjustRawIdx_loopFn(i)
            {
                rawRecords[i]._rawidx = i;
            }
            end = end > rawRecords.length ? rawRecords.length : end;
            nexacro.__forLoop(this, start, end, __adjustRawIdx_loopFn);
        }
    };

    _pDatasetBase._removeRawRow = function (rowRow)
    {
        var rawRecords = this._rawRecords;
        //var idx = raw.indexOf(rowRow);
        var idx = rowRow._rawidx;
        if (idx >= 0)
        {
            rawRecords.splice(idx, 1);
            this._adjustRawIdx(idx, rawRecords.length);
            if (this._p_updatecontrol && this._isTwowayDataobjectBindMode())
            {
                this._addDirtyindex(idx, "delete");
            }
        }
    };

    _pDatasetBase._removeEmptyRawRows = function ()
    {
        var rawRecords = this._rawRecords;
        var firstidx = -1;
        function __removeEmptyRawRows_loopFn(i)
        {
            var rowRow = rawRecords[i];
            if (rowRow._rtype == 0)
            { //nexacro.Dataset.ROWTYPE_EMPTY
                rowRow.length = 0;
                rawRecords.splice(i, 1);
                firstidx = i;
            }
        }
        nexacro.__reverseForLoop(this, rawRecords.length - 1, 0, __removeEmptyRawRows_loopFn);

        if (firstidx >= 0)
        {
            this._adjustRawIdx(firstidx, rawRecords.length);
        }
    };

    _pDatasetBase._removeDeleteRawRows = function ()
    {
        var rawRecords = this._rawRecords;
        var firstidx = -1;
        function __removeDeleteRawRows_loopFn(i)
        {
            var rowRow = rawRecords[i];
            if (rowRow._rtype == 8)
            { //nexacro.Dataset.ROWTYPE_DELETE
                rawRecords.splice(i, 1);
                firstidx = i;
            }
        }
        nexacro.__reverseForLoop(this, rawRecords.length - 1, 0, __removeDeleteRawRows_loopFn);

        if (firstidx >= 0)
        {
            this._adjustRawIdx(firstidx, rawRecords.length);
        }
    };

    _pDatasetBase._clearRecordData = function (records)
    {
        function __clearRecordData_loopFn(i)
        {
            var rowRow = records[i];
            if (rowRow._orgrow)
            {
                rowRow._orgrow.splice(0, rowRow._orgrow.length);
                rowRow._orgrow = null;
            }

            if (rowRow._data)
                rowRow._data = null;

            if (rowRow._orgdata)
                rowRow._orgdata = null;

            rowRow.splice(0, rowRow.length);
            rowRow.length = 0;
        }
        nexacro.__forLoop(this, 0, records.length, __clearRecordData_loopFn);

        records.splice(0, records.length);
        records.length = 0;
    };

    _pDatasetBase._initDatasetRuleFuncs = function (v)
    {
        var funcsets = nexacro._DatasetRuleFuncsSet[v];
        if (!funcsets)
            return;

        Object.assign(this, funcsets);
    };

    _pDatasetBase._compareValue = function (val1, val2, coltype, locale, localeoption, bSysLang)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };

    _pDatasetBase._isEqualValue = function (value, cmpval, coltype)
    {
        if (value === cmpval)
            return true;
        if (value && cmpval)
        {
            if (coltype == 4)
            {
                if (cmpval instanceof nexacro.Decimal)
                {
                    return (value.hi == cmpval.hi) && (value.lo == cmpval.lo);
                }
                else
                {
                    return (value.hi == (+cmpval) && value.lo == 0);
                }
            }
            else if (coltype >= 5 && coltype <= 7)
            {
                if (cmpval instanceof nexacro.Date)
                {
                    return ((value.date ? value.date.valueOf() : null) == cmpval.date.valueOf());
                }
                else
                {
                    return (value.date == cmpval);
                }
            }
            /*
            else if (coltype < 0)
            {

                var val1, val2;
                if (val1 instanceof nexacro.Decimal)
                {
                    if (val2 instanceof nexacro.Decimal)
                    {
                        return (val1.hi == val2.hi && val1.lo == -val2.lo);
                    }
                    else
                    {
                        var v2 = (+val2);
                        return (val1.hi == v2 && val1.lo == 0);
                    }
                }
                else if (val2 instanceof nexacro.Decimal)
                {
                    var v1 = (+val1);
                    return (val2.hi == v1 && val2.lo == 0);
                }
            }
            */
        }
        return false;
    };

    _pDatasetBase._isInvalidValue = function (value, coltype)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
        //return false;
    };

    _pDatasetBase._isLikeValue = function (value, cmpval)
    {
        if (value)
        {
            value = value.toString();
            if (nexacro._isString(cmpval))
            {
                if (cmpval.length == 0)
                    return false;
                if (value.slice(0, cmpval.length) == cmpval)
                {
                    return true;
                }
            }
        }
        return false;
    };

    _pDatasetBase._isEqualRow = function (Row1, Row2, chkcol, chkval)
    {
        var colList = this.colinfos;
        var colCnt = colList.length;
        function _isEqualRow_loop(i)
        {
            var coltype = colList[i].ntype;
            var val1 = Row1[i];
            var val2 = (i == chkcol) ? chkval : Row2[i];
            if (coltype == 4 && val1 && val2)
            {
                if ((val1.hi != val2.hi) || (val1.lo != val2.lo))
                {
                    return true;
                }
                return false;
            }
            else if (coltype >= 5 && coltype <= 7 && val1 && val2)
            {
                if ((val1.date ? val1.date.valueOf() : val1) != (val2.date ? val2.date.valueOf() : val2))
                {
                    return true;
                }
            }
            else if (val1 !== val2)
            {
                return true;
            }
        }
        var idx = nexacro.__forLoop(this, 0, colCnt, _isEqualRow_loop);
        return (idx >= colCnt) ? true : false;
    };

    _pDatasetBase._clearAllExprs = function ()
    {
        //var funcs = this._exprFuncs
        //for (var name in funcs)
        //{
        //    delete funcs[name];
        //}
        this._exprFuncs = {};
    };

    _pDatasetBase._clearAll = function ()
    {
        var cnt = this._p_rowcount;

        this.colinfos.clear();
        this._constVars.clear();

        if (this._viewRecords != this._rawRecords)
        {
            this._viewRecords.splice(0, this._viewRecords.length);
            this._viewRecords.length = 0;
        }
        if (this._rawRecords.length)
        {
            this._clearRecordData(this._rawRecords);
            this._rawRecords.length = 0;
        }
        this._viewRecords = this._rawRecords;
        if (this._deletedRecords.length)
        {
            this._clearRecordData(this._deletedRecords);
            this._deletedRecords.length = 0;
        }

        this._p_colcount = 0;
        this._p_constcount = 0;
        this._p_rowcount = 0;

        // 동일 동작 함수로 대체
        this._clearKeyCols();

        if (this._is_created)
        {
            if (this._p_loadkeymode == "reset")
            {
                this._p_keystring = this._defaultKeyStr;
            }
            if (this._p_loadfiltermode == "reset")
            {
                this._p_filterstr = this._defaultFilterStr; //reset일때 DatasetFilterInfo의 속성을 따라가야 하나 이 부분은 현재 존재하지 않음;
            }
        }
        this._filterFn = null;
        this.__loadConvertFn = null;
        this.__lazyParseRecordFn = null;
        // this._binddataobject = null;

        this._clearAllExprs();

        return cnt;
    };

    //==============================================================================
    // row control functions
    _pDatasetBase.getRowType = function (row)
    {
        if (isNaN(row = +row))
        {
            row = 0;
        }

        var rowRow = this._viewRecords[row];
        return rowRow ? rowRow._rtype : 0;
    };
    _pDatasetBase.getRowTypeNF = function (row)
    {
        if (isNaN(row = +row))
        {
            row = 0;
        }

        var rowRow = this._rawRecords[row];
        return rowRow ? rowRow._rtype : 0;
    };

    _pDatasetBase.getRowLevel = function (row)
    {
        var rowRow = this._viewRecords[row];
        return rowRow ? rowRow._level : 0;
    };
    _pDatasetBase.getRowLevelNF = function (row)
    {
        var rowRow = this._rawRecords[row];
        return rowRow ? rowRow._level : 0;
    };
    _pDatasetBase.getMaxRowLevel = function ()
    {
        var keyList = this._keycols;
        return keyList.max_keylevel || 0;
    };

    _pDatasetBase.getGroupRangeStart = function (row)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
        {
            return -1;
        }
        var rowRow = this._viewRecords[row];
        return (rowRow._rtype == 16 || rowRow._rtype == 32) ? rowRow._grpstart : row;
    };
    _pDatasetBase.getGroupRangeCount = function (row)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
        {
            return 0;
        }
        var rowRow = this._viewRecords[row];
        return (rowRow._rtype == 16 || rowRow._rtype == 32) ? (rowRow._grpend - rowRow._grpstart) : 1;
    };

    // [TODO] Nexacro K용 Metainfo/Manual 작업
    _pDatasetBase.getGroupColumnIds = function (row)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
        {
            return [];
        }

        var columnIds = [];
        var rowRow = this._viewRecords[row];
        if (rowRow._rtype == 16 || rowRow._rtype == 32)
        {
            var keyList = this._keycols;
            var maxlevel = keyList.max_keylevel;
            if (maxlevel == 0 || this._viewRecords.length == 0)
            {
                return columnIds;
            }

            var colList = this.colinfos;
            function __getGroupColumnIds_rowlevel_loopFn(i)
            {
                var key = keyList[i];
                if (key.level == rowRow._level)
                {
                    columnIds.push(colList[key.colidx].name);
                }
            }
            nexacro.__forLoop(this, 0, keyList.length, __getGroupColumnIds_rowlevel_loopFn);
        }

        return columnIds;
    };
    // [TODO] Nexacro K용 Metainfo/Manual 작업
    _pDatasetBase.getGroupRangeRowCount = function (row)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
            return 0;

        var rowRow = this._viewRecords[row];
        if (rowRow._rtype == 16 || rowRow._rtype == 32)
        {
            var keyList = this._keycols;
            var maxlevel = keyList.max_keylevel;
            if (maxlevel == 0 || this._viewRecords.length == 0)
                return 0;

            return this._getCountValue(this._viewRecords, -1, rowRow._grpstart, rowRow._grpend, -1);
        }

        return 0;
    };

    _pDatasetBase._setRowType = function (rowRow, type)
    {
        var newtype = -1;
        switch (type)
        {
            case 0:
            case 1:
            case 2:
            case 4:
            case 8:
            case 16:
            case 32:
                newtype = type;
                break;
            default:
                switch (type.toString()[0].toUpperCase())
                {
                    case 'E':
                        newtype = 0;
                        break;
                    case 'I':
                        newtype = 2;
                        break;
                    case 'U':
                        newtype = 4;
                        break;
                    case 'D':
                        newtype = 8;
                        break;
                    case 'G':
                        newtype = 16;
                        break;
                    case 'H':
                        newtype = 32;
                        break;
                    default: //Normal
                        newtype = 1;
                        break;
                }
                break;
        }

        if (rowRow._rtype == newtype)
            return false;

        if (rowRow._rtype == 4)
        {
            if (rowRow._orgrow)
            {
                rowRow._orgrow.length = 0;
                delete rowRow._orgrow;
            }
            else if (rowRow._orgdata)
            {
                rowRow._data = rowRow._orgdata;
                delete rowRow._orgdata;
            }
        }
        else
        {
            if (newtype == 4)
            {
                rowRow = this.__getParsedRow(rowRow);
                var orgRow = [];
                this._copyRowData(orgRow, rowRow);
                rowRow._orgrow = orgRow;
            }
        }

        rowRow._rtype = newtype;
        return true;
    };

    _pDatasetBase.setRowType = function (row, type)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
        {
            return false;
        }
        if (type == null || this._p_updatecontrol == true)
        {
            return false;
        }

        var rowRow = this._viewRecords[row];
        var updated = false;
        if (rowRow)
            updated = this._setRowType(rowRow, type);

        if (updated && this._p_enableevent)
        {
            this.on_fire_onrowsetchanged(row, 1, 40); //nexacro.Dataset.REASON_CHANGESTATUS
        }
        return true;
    };
    _pDatasetBase.setRowTypeNF = function (row, type)
    {
        row = row | 0;
        if (row < 0 || row >= this._rawRecords.length)
        {
            return false;
        }
        if (type == null || this._p_updatecontrol == true)
        {
            return false;
        }

        var rowRow = this._rawRecords[row];
        var updated = false;
        if (rowRow)
            updated = this._setRowType(rowRow, type);

        if (updated && this._p_enableevent)
        {
            var viewidx = this._viewRecords.indexOf(rowRow);
            this.on_fire_onrowsetchanged(viewidx, 1, 40); //nexacro.Dataset.REASON_CHANGESTATUS
        }
        return true;
    };

    _pDatasetBase._appendRow = function ()
    {
        var rawRecords = this._rawRecords;
        var viewRecords = this._viewRecords;

        var row = viewRecords.length;

        var rowRow = [];
        rowRow._rawidx = rawRecords.length;
        rowRow._rtype = (this._p_updatecontrol ? 2 : 1);
        rowRow._level = 0;

        if (viewRecords != rawRecords)
        {
            viewRecords[viewRecords.length] = rowRow;
        }
        var idx = rawRecords.length;
        rawRecords[idx] = rowRow;

        if (this._p_updatecontrol && this._isTwowayDataobjectBindMode())
        {
            this._addDirtyindex(rowRow._rawidx, "add", rowRow);
        }

        this._p_rowcount = viewRecords.length;
        return row;
    };

    _pDatasetBase.appendRow = function ()
    {
        if (this.colinfos.length <= 0)
        {
            return -1;
        }

        var idx = this._appendRow();
        if (idx >= 0)
        {
            if (this._eventstat)
            {
                var oldpos = this._p_rowposition;
                this.on_fire_onrowsetchanged(idx, 1, this._is_data_updating ? 43 : 12); //nexacro.Dataset.REASON_APPEND
                // not changed by User Event
                if (oldpos == this._p_rowposition)
                {
                    this._setRowPosition(idx, 51); //nexacro.Dataset.REASON_ROWCHANGE                    
                }
            }
            else
            {
                this._p_rowposition = idx;
            }
            if (this._p_updatecontrol == false && this._isTwowayDataobjectBindMode())
            {
                if (this._binddataobject)
                    this._binddataobject.addDataInPath(this.dataobjectpath, null, idx, this.id);
            }
        }
        return idx;
    };
    _pDatasetBase.addRow = _pDatasetBase.appendRow;

    _pDatasetBase._insertRow = function (row)
    {
        // rawRecords Add
        // viewRecords Insert
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;

        if (row >= viewRecords.length)
            return this._appendRow();

        var rowRow = [];
        rowRow._rawidx = row;//rawRecords.length;
        rowRow._rtype = (this._p_updatecontrol ? 2 : 1);
        rowRow._level = 0;
        var rawidx;

        if (this._p_updatecontrol)
        {
            // update control
            if (viewRecords == rawRecords)
            {
                viewRecords = this._viewRecords = rawRecords.slice(0, rawRecords.length);
            }
            rawidx = viewRecords[row]._rawidx;
            viewRecords.splice(row, 0, rowRow);
            // rawRecords[rawRecords.length] = rowRow;
            rawRecords.splice(rawidx, 0, rowRow);
            this._adjustRawIdx(rawidx, rawRecords.length);
            if (this._isTwowayDataobjectBindMode())
                this._addDirtyindex(row, "insert", rowRow);
        }
        else
        {
            // direct control
            if (viewRecords == rawRecords)
            {
                //not indexed
                rawRecords.splice(row, 0, rowRow);
                this._adjustRawIdx(row, rawRecords.length);
            }
            else
            {
                // indexed
                rawidx = viewRecords[row]._rawidx;
                viewRecords.splice(row, 0, rowRow);
                rawRecords.splice(rawidx, 0, rowRow);
                this._adjustRawIdx(rawidx, rawRecords.length);
            }
        }
        this._p_rowcount = viewRecords.length;
        return row;
    };

    _pDatasetBase.insertRow = function (row)
    {
        row = row | 0;
        if (row < 0 || this.colinfos.length <= 0)
        {
            return -1;
        }

        var idx = this._insertRow(row);
        if (idx >= 0)
        {
            if (this._eventstat)
            {
                var oldpos = this._p_rowposition;
                this.on_fire_onrowsetchanged(idx, 1, this._is_data_updating ? 43 : 12); //nexacro.Dataset.REASON_APPEND
                var setpos = this._p_rowposition;

                if (oldpos == setpos)
                {
                    if (oldpos == idx)
                        this._setRowPosition(idx, 53, true); //nexacro.Dataset.REASON_ROWOBJECTCHANGE
                    else
                        this._setRowPosition(idx, 51, true); //nexacro.Dataset.REASON_ROWCHANGE
                }
            }
            else
            {
                this._p_rowposition = idx;
            }

            if (this._p_updatecontrol == false && this._isTwowayDataobjectBindMode() && this._binddataobject)
            {
                var temp = this._rowToData(this._rawRecords[idx]);
                this._binddataobject.insertDataInPath(this.dataobjectpath, temp, idx, this.id);
            }
        }
        return idx;
    };

    _pDatasetBase._deleteRow = function (row)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        var rowRow = viewRecords[row];
        if (this._p_updatecontrol)
        {
            // update control
            if (rowRow)
            {
                if (rowRow._rtype == 1) //nexacro.Dataset.ROWTYPE_NORMAL
                {
                    rowRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE
                    delRecords[delRecords.length] = rowRow;
                    this._removeRawRow(rowRow);
                }
                else if (rowRow._rtype == 2 || rowRow._rtype == 16 || rowRow._rtype == 32) //nexacro.Dataset.ROWTYPE_INSERT
                {
                    rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                    // clear rowRow : for IE leak
                    rowRow.length = 0;
                    this._removeRawRow(rowRow);
                }
                else if (rowRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
                {
                    if (rowRow._orgrow)
                    {
                        this._copyRowData(rowRow, rowRow._orgrow);
                        rowRow._orgrow.length = 0;
                        delete rowRow._orgrow;
                    }
                    else if (rowRow._orgdata)
                    {
                        rowRow._data = rowRow._orgdata;
                        delete rowRow._orgdata;
                    }
                    rowRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE
                    delRecords[delRecords.length] = rowRow;
                    this._removeRawRow(rowRow);
                }
                /*
                else if (rowRow._rtype == 16)
                { //nexacro.Dataset.ROWTYPE_GROUP
                    rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                    // clear rowRow : for IE leak
                    rowRow.length = 0;
                    this._removeRawRow(rowRow);
                }
                */
                else
                {
                    //nexacro.Dataset.ROWTYPE_DELETE
                    return -1;
                }

                // indexed
                if (viewRecords != rawRecords)
                {
                    viewRecords.splice(row, 1);
                }
            }
        }
        else
        {
            // direct control
            if (rowRow)
            {
                // clear rowRow : for IE leak
                if (rowRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
                {
                    if (rowRow._orgrow)
                    {
                        rowRow._orgrow.length = 0;
                        delete rowRow._orgrow;
                    }
                    else if (rowRow._orgdata)
                    {
                        rowRow._data = rowRow._orgdata = null;
                    }
                    rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                }

                if (viewRecords == rawRecords)
                {
                    // not indexed
                    rowRow.length = 0;
                    this._removeRawRow(rowRow);
                }
                else
                {
                    // indexed
                    rowRow.length = 0;
                    viewRecords.splice(row, 1);
                    this._removeRawRow(rowRow);
                }
            }
        }

        this._p_rowcount = viewRecords.length;
        return row;
    };

    _pDatasetBase.deleteRow = function (row)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
        {
            return false;
        }

        var idx = this._deleteRow(row);
        var oldpos;
        var setpos;
        if (idx >= 0)
        {
            if (this._eventstat)
            {
                oldpos = this._p_rowposition;
                this.on_fire_onrowsetchanged(idx, 1, this._is_data_updating ? 43 : 20); //nexacro.Dataset.REASON_DELETE
                setpos = this._p_rowposition;

                if (oldpos == setpos)
                {
                    if (setpos == idx)
                    {
                        if (this._p_rowcount == 0)
                        {
                            this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                        else
                        {
                            if (setpos == this._p_rowcount)
                            {
                                this._forcesetRowPosition(this._p_rowcount - 1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                            }
                            else
                            {
                                this._setRowPosition(setpos, 53, true);// nexacro.Dataset.REASON_ROWOBJECTCHANGE
                            }
                        }
                    }
                    else if (setpos > idx)
                    {
                        this._setRowPosition(setpos - 1, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE;
                    }
                }
            }
            else
            {
                setpos = this._p_rowposition;
                if (setpos == idx)
                {
                    if (this._p_rowcount == 0)
                    {
                        this._p_rowposition = -1;
                    }
                    else
                    {
                        if (setpos == this._p_rowcount)
                        {
                            this._p_rowposition = this._p_rowcount - 1;
                        }
                    }
                }
                else if (setpos > idx)
                {
                    this._p_rowposition = setpos - 1;
                }
            }
            if (this._p_updatecontrol == false && this._isTwowayDataobjectBindMode() && this._binddataobject)
                this._binddataobject.deleteDataInPath(this._p_dataobjectpath, null, idx, this.id);
        }

        return idx >= 0 ? true : false;
    };

    _pDatasetBase._deleteAll = function ()
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        var delcnt = 0;

        if (this._p_updatecontrol)
        {
            // update control
            delRecords = this._deletedRecords;
            function __deleteAll_updatectrl_loopFn(i)
            {
                var rowRow = viewRecords[i];
                if (rowRow)
                {
                    delcnt++;
                    if (rowRow._rtype == 1) //nexacro.Dataset.ROWTYPE_NORMAL
                    {
                        rowRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE
                        delRecords[delRecords.length] = rowRow;
                    }
                    else if (rowRow._rtype == 2) //nexacro.Dataset.ROWTYPE_INSERT
                    {
                        rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                    }
                    else if (rowRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
                    {
                        // recover row from org
                        if (rowRow._orgrow)
                        {
                            this._copyRowData(rowRow, rowRow._orgrow);
                            rowRow._orgrow.length = 0;
                            delete rowRow._orgrow;
                        }
                        else if (rowRow._orgdata)
                        {
                            rowRow._data = rowRow._orgdata;
                            delete rowRow._orgdata;
                        }
                        rowRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE
                        delRecords[delRecords.length] = rowRow;
                    }
                    else if (rowRow._rtype == 16 || rowRow._rtype == 32) //nexacro.Dataset.ROWTYPE_GROUP
                    {
                        rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                    }
                }
            }
            nexacro.__forLoop(this, 0, viewRecords.length, __deleteAll_updatectrl_loopFn);
            if (this._isTwowayDataobjectBindMode())
            {
                for (var i = 0, len = rawRecords.length; i < len; i++)
                {
                    this._addDirtyindex(0, "delete");
                }
            }

            delRecords.sort(function (a, b) { return (a._orgidx - b._orgidx); });
        }
        else
        {
            // direct control
            function __deleteAll_direct_loopFn(i)
            {
                var rowRow = viewRecords[i];
                if (rowRow)
                {
                    delcnt++;
                    if (rowRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
                    {
                        // recover row from org
                        if (rowRow._orgrow)
                        {
                            rowRow._orgrow.length = 0;
                            delete rowRow._orgrow;
                        }
                        else if (rowRow._orgdata)
                        {
                            rowRow._data = rowRow._orgdata = null;
                        }
                    }
                    rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                }
            }
            nexacro.__forLoop(this, 0, viewRecords.length, __deleteAll_direct_loopFn);
        }

        if (delcnt > 0)
        {
            this._removeEmptyRawRows();
            this._removeDeleteRawRows();
        }

        // indexed
        if (viewRecords != rawRecords)
        {
            viewRecords.length = 0;
        }

        this._p_rowcount = 0;
        return delcnt;
    };

    _pDatasetBase.deleteAll = function ()
    {
        var oldpos = this._p_rowposition;
        var cnt = this._deleteAll();
        if (cnt > 0)
        {
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 22); //nexacro.Dataset.REASON_DELETEALL
                if (oldpos >= 0 && oldpos == this._p_rowposition)
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE
                }
            }
            else
            {
                this._p_rowposition = -1;
            }
        }
        return cnt;
    };

    _pDatasetBase._clearData = function ()
    {
        var cnt = this._p_rowcount;

        if (this._viewRecords != this._rawRecords)
        {
            this._viewRecords.splice(0, this._viewRecords.length);
            this._viewRecords.length = 0;
        }
        if (this._rawRecords.length)
        {
            this._clearRecordData(this._rawRecords);
            this._rawRecords.length = 0;
        }
        this._viewRecords = this._rawRecords;

        if (this._deletedRecords.length)
        {
            this._clearRecordData(this._deletedRecords);
            this._deletedRecords.length = 0;
        }

        // useclientlayoutchange 속성이 true 여도 loadkeymode, loadfiltermode 동작
        this._clearKeyCols();

        if (this._is_created)
        {
            if (this._p_loadkeymode == "reset")
            {
                this._p_keystring = this._defaultKeyStr;
            }
            if (this._p_loadfiltermode == "reset")
            {
                this._p_filterstr = this._defaultFilterStr; //reset일때 DatasetFilterInfo의 속성을 따라가야 하나 이 부분은 현재 존재하지 않음;
            }
        }

        this._filterFn = null;
        this._p_rowcount = 0;
        return cnt;
    };

    _pDatasetBase.clearData = function ()
    {
        var oldpos = this._p_rowposition;
        var cnt = this._clearData();
        if (cnt > 0)
        {
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 23); //nexacro.Dataset.REASON_CLEARDATA
                if (oldpos >= 0 && oldpos == this._p_rowposition)
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE
                }
            }
            else
            {
                this._p_rowposition = -1;
            }
        }
        return cnt;
    };

    _pDatasetBase._deleteMultiRows = function (del_rows)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        var delcnt = 0;
        if (this._p_updatecontrol)
        {
            // update control
            function _deleteMultiRows_loop1(i)
            {
                var rowRow = viewRecords[del_rows[i]];
                if (rowRow)
                {
                    delcnt++;
                    if (rowRow._rtype == 1) //nexacro.Dataset.ROWTYPE_NORMAL
                    {
                        rowRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE
                        delRecords[delRecords.length] = rowRow;
                        this._removeRawRow(rowRow);
                    }
                    else if (rowRow._rtype == 2 || rowRow._rtype == 16 || rowRow._rtype == 32) //nexacro.Dataset.ROWTYPE_INSERT
                    {
                        rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                        // clear rowRow : for IE leak
                        rowRow.length = 0;
                    }
                    else if (rowRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
                    {
                        if (rowRow._orgrow)
                        {
                            this._copyRowData(rowRow, rowRow._orgrow);
                            rowRow._orgrow.length = 0;
                            delete rowRow._orgrow;
                        }
                        else if (rowRow._orgdata)
                        {
                            rowRow._data = rowRow._orgdata;
                            delete rowRow._orgdata;
                        }
                        rowRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE
                        delRecords[delRecords.length] = rowRow;
                        this._removeRawRow(rowRow);
                    }
                    /*
                    else if (rowRow._rtype == 16)
                    { //nexacro.Dataset.ROWTYPE_GROUP
                        rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                        // clear rowRow : for IE leak
                        rowRow.length = 0;
                    }
                    */
                    else
                    {
                        //nexacro.Dataset.ROWTYPE_DELETE
                        return -1;
                    }

                    // indexed
                    if (viewRecords != rawRecords)
                    {
                        viewRecords.splice(del_rows[i], 1);
                    }
                }
            }
            nexacro.__reverseForLoop(this, del_rows.length - 1, 0, _deleteMultiRows_loop1);
        }
        else
        {
            // direct control
            function _deleteMultiRows_loop2(i)
            {
                var rowRow = viewRecords[del_rows[i]];
                if (rowRow)
                {
                    delcnt++;
                    if (rowRow._rtype == 4)
                    { //nexacro.Dataset.ROWTYPE_UPDATE
                        if (rowRow._orgrow)
                        {
                            rowRow._orgrow.length = 0;
                            delete rowRow._orgrow;
                        }
                        rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                    }
                    else
                    {
                        rowRow._rtype = 0; //nexacro.Dataset.ROWTYPE_EMPTY
                    }

                    if (viewRecords != rawRecords)
                    {
                        viewRecords.splice(del_rows[i], 1);
                    }
                    if (this._isTwowayDataobjectBindMode() && this._binddataobject)
                        this._binddataobject.deleteDataInPath(this._p_dataobjectpath, null, del_rows[i], this.id);
                }
            }
            nexacro.__reverseForLoop(this, del_rows.length - 1, 0, _deleteMultiRows_loop2);
        }

        if (delcnt > 0)
        {
            this._removeEmptyRawRows();
            this._p_rowcount = viewRecords.length;
        }
        return delcnt;
    };

    _pDatasetBase.deleteMultiRows = function (del_rows)
    {
        if (!(del_rows instanceof Array))
            return 0;

        var oldpos = this._p_rowposition;
        var oldRow = this._viewRecords[oldpos];
        var rows = del_rows.reduce(function (a, b)
        {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        rows.sort(function (l, r) { return l - r; });

        var delcnt = this._deleteMultiRows(rows);
        if (delcnt > 0)
        {
            var newIdx = -1;
            if (oldRow != null)
                newIdx = this._viewRecords.indexOf(oldRow);
            if (this._eventstat)
            {
                this._deleteRows = del_rows; // 방안 필요
                this.on_fire_onrowsetchanged(-1, delcnt, this._is_data_updating ? 43 : 20); //nexacro.Dataset.REASON_DELETE
                // not changed by User Event
                if (oldpos == this._p_rowposition)
                {
                    if (newIdx < oldpos)
                    {
                        if (this._p_rowcount <= 0)
                        {
                            this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                        else if (newIdx == -1)
                        {
                            if (oldpos >= 0 && oldpos < this._p_rowcount)
                            {
                                this._setRowPosition(oldpos, 53); //nexacro.Dataset.REASON_ROWOBJECTCHANGE;
                                if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                                {
                                    var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                                    this.on_fire_onvaluechanged(evt);
                                }
                            }
                            else
                            {
                                this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                            }
                        }
                        else
                        {
                            this._setRowPosition(newIdx, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE;
                        }
                    }
                }
            }
            else
            {
                //var newIdx = -1;
                if (oldRow != null)
                    newIdx = this._viewRecords.indexOf(oldRow);
                if (newIdx < oldpos)
                {
                    if (this._p_rowcount <= 0)
                    {
                        this._p_rowposition = -1;
                    }
                    else if (newIdx == -1)
                    {
                        if (oldpos >= 0 && oldpos < this._p_rowcount)
                        {
                            this._p_rowposition = oldpos;
                        }
                        else
                        {
                            this._p_rowposition = -1;
                        }
                    }
                    else
                    {
                        this._p_rowposition = newIdx;
                    }
                }
            }
        }
        return delcnt;
    };

    _pDatasetBase._moveRow = function (oldrow, newrow)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;

        function _getInsertRawRecordIdx(idx, dir)
        {
            var viewRecord = viewRecords[idx];
            var rtype = viewRecord._rtype;
            var i;

            if (rtype != 8 && rtype != 16 && rtype != 32)
                return viewRecord._rawidx;

            if (dir < 0)
            {
                i = idx - 1;
                viewRecord = viewRecords[i];

                while (viewRecord)
                {
                    rtype = viewRecord._rtype;
                    if (rtype != 8 && rtype != 16 && rtype != 32)
                        return viewRecord._rawidx + 1;

                    viewRecord = viewRecords[i--];
                }
            }
            else
            {
                i = idx + 1;
                viewRecord = viewRecords[i];
                while (viewRecord)
                {
                    rtype = viewRecord._rtype;
                    if (rtype != 8 && rtype != 16 && rtype != 32)
                        return viewRecord._rawidx - 1;

                    viewRecord = viewRecords[i++];
                }
            }

            return -1;
        }

        // update control
        if (viewRecords == rawRecords)
        {
            viewRecords = this._viewRecords = rawRecords.slice(0, rawRecords.length);
        }

        var /*oldrawRow,*/ oldviewRow, oldidx, newidx;

        oldviewRow = viewRecords[oldrow];
        if (oldviewRow)
            oldidx = oldviewRow._rawidx;
        if (this._isTwowayDataobjectBindMode())
        {
            if (this._p_updatecontrol)
            {
                this._addDirtyindex(oldrow, "delete", rawRecords[oldrow]);
                this._addDirtyindex(newrow, "insert", rawRecords[oldrow]);
            }
            else
            {
                if (this._binddataobject)
                {
                    var temp = this._rowToData(rawRecords[oldrow]);
                    this._binddataobject.deleteDataInPath(this._p_dataobjectpath, temp, oldrow, this.id);
                    this._binddataobject.insertData(this._p_dataobjectpath, temp, newrow, this.id);
                }
            }
        }

        if (newrow < oldrow)
        {
            newidx = _getInsertRawRecordIdx(newrow, -1);
            if (!nexacro._isNull(oldidx))
            {
                if (newidx < 0)
                    newidx = 0;
                rawRecords.splice(oldidx, 1);
                rawRecords.splice(newidx, 0, oldviewRow);
                // adjust rawidx;
                this._adjustRawIdx(newidx, oldidx + 1);
            }

            viewRecords.splice(oldrow, 1);
            viewRecords.splice(newrow, 0, oldviewRow);

        }
        else
        {
            if (!nexacro._isNull(oldidx))
            {
                newidx = _getInsertRawRecordIdx(newrow, 1);

                if (newidx < 0)
                    newidx = rawRecords.length - 1;

                rawRecords.splice(newidx + 1, 0, oldviewRow);
                rawRecords.splice(oldidx, 1);
                // adjust rawidx;
                this._adjustRawIdx(oldidx, newidx + 1);
            }

            viewRecords.splice(newrow + 1, 0, oldviewRow);
            viewRecords.splice(oldrow, 1);
        }

        return newrow;
    };

    _pDatasetBase.moveRow = function (oldrow, newrow)
    {
        oldrow = oldrow | 0;
        newrow = newrow | 0;
        if (oldrow < 0 || oldrow >= this._p_rowcount || newrow < 0 || newrow >= this._p_rowcount || oldrow == newrow)
        {
            return -1;
        }

        var idx = this._moveRow(oldrow, newrow);
        if (idx >= 0)
        {
            var oldpos = this._p_rowposition;
            if (this._eventstat)
            {
                var from, cnt;
                if (oldrow > newrow)
                {
                    from = newrow;
                    cnt = (oldrow - newrow + 1);
                }
                else
                {
                    from = oldrow;
                    cnt = (newrow - oldrow + 1);
                }
                this.on_fire_onrowsetchanged(from, cnt, 32); //nexacro.Dataset.REASON_MOVE
                // not changed by User Event
                if (oldpos == this._p_rowposition)
                {
                    if (oldpos == oldrow)
                    {
                        this._setRowPosition(newrow, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE
                    }
                    else if (oldrow > newrow && oldpos >= newrow && oldpos < oldrow)
                    {
                        this._setRowPosition(oldpos + 1, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE
                    }
                    else if (oldrow < newrow && oldpos > oldrow && oldpos < newrow)
                    {
                        this._setRowPosition(oldpos - 1, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE
                    }
                }
            }
            else
            {
                if (oldpos == oldrow)
                {
                    this._p_rowposition = newrow;
                }
                else if (oldrow > newrow && oldpos >= newrow && oldpos < oldrow)
                {
                    this._p_rowposition = oldpos + 1;
                }
                else if (oldrow < newrow && oldpos > oldrow && oldpos < newrow)
                {
                    this._p_rowposition = oldpos - 1;
                }

            }
        }
        return idx;
    };

    _pDatasetBase._exchangeRow = function (row1, row2)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;

        if (rawRecords.length <= 0)
            return -1;

        if (row1 >= viewRecords.length || row2 >= viewRecords.length || row1 == row2)
            return false;

        if (this._isTwowayDataobjectBindMode())
        {
            if (this._p_updatecontrol)
            {
                var temp = rawRecords[row1];
                var temp2 = rawRecords[row2];
                this._addDirtyindex(row1, "update", temp2);
                this._addDirtyindex(row2, "update", temp);
                /*
                if (row2 > row1)
                {
                    
                    this._addDirtyindex(row1, "delete", temp);
                    this._addDirtyindex(row2, "insert", temp);
                    this._addDirtyindex(row1, "insert", temp2);
                    this._addDirtyindex(row2, "delete", temp2);
                    
                    this._addDirtyindex(row2, "delete", temp2);
                    this._addDirtyindex(row1, "delete", temp);
                    this._addDirtyindex(row1, "insert", temp2);
                    this._addDirtyindex(row2, "insert", temp);
                   
                    
                }
                else
                {
                    this._addDirtyindex(row1, "delete", temp);
                    this._addDirtyindex(row2, "delete", temp2);                    
                    this._addDirtyindex(row2, "insert", temp);
                    this._addDirtyindex(row1, "insert", temp2);
                  
                }
                */
            }
            else
            {
                if (this._isTwowayDataobjectBindMode())
                {
                    var temp = this._rowToData(rawRecords[row1]);
                    var temp2 = this._rowToData(rawRecords[row2]);
                    this._binddataobject.setDataInPath(this._p_dataobjectpath, temp, row2, this.id);
                    this._binddataobject.setDataInPath(this._p_dataobjectpath, temp2, row1, this.id);
                    /*
                    if (row2 > row1)
                    {
                        this._binddataobject.deleteDataInPath(this._p_dataobjectpath, temp, row1, this.id);
                        this._binddataobject.insertDataInPath(this._p_dataobjectpath, temp, row2, this.id);
                        this._binddataobject.deleteDataInPath(this._p_dataobjectpath, temp2, row2, this.id);
                        this._binddataobject.insertDataInPath(this._p_dataobjectpath, temp2, row1, this.id);
                    }
                    else
                    {
                        this._binddataobject.deleteDataInPath(this._p_dataobjectpath, temp2, row2,this.id);
                        this._binddataobject.insertDataInPath(this._p_dataobjectpath, temp2, row1, this.id);
                        this._binddataobject.deleteDataInPath(this._p_dataobjectpath, temp, row1, this.id);
                        this._binddataobject.insertDataInPath(this._p_dataobjectpath, temp, row2, this.id);
                    }
                    */
                }
            }
        }

        var rowData1, rowData2, idx1, idx2;
        if (viewRecords == rawRecords)
        {
            // not indexed
            rowData1 = rawRecords[row1];
            rowData2 = rawRecords[row2];
            rowData1._rawidx = row2;
            rowData2._rawidx = row1;
            rawRecords[row1] = rowData2;
            rawRecords[row2] = rowData1;
        }
        else
        {
            // indexed
            rowData1 = viewRecords[row1];
            rowData2 = viewRecords[row2];
            idx1 = rowData1._rawidx;
            idx2 = rowData2._rawidx;
            rowData1._rawidx = idx2;
            rowData2._rawidx = idx1;
            rawRecords[idx1] = rowData2;
            rawRecords[idx2] = rowData1;
            viewRecords[row1] = rowData2;
            viewRecords[row2] = rowData1;
        }

        return true;
    };

    _pDatasetBase.exchangeRow = function (row1, row2)
    {
        row1 = row1 | 0;
        row2 = row2 | 0;
        if (row1 < 0 || row1 >= this._p_rowcount || row2 < 0 || row2 >= this._p_rowcount)
        {
            return false;
        }

        if (this._exchangeRow(row1, row2))
        {
            if (this._eventstat)
            {
                var oldpos = this._p_rowposition;
                this.on_fire_onrowsetchanged(row1, 1, 33); //nexacro.Dataset.REASON_EXCHANGE
                this.on_fire_onrowsetchanged(row2, 1, 33); //nexacro.Dataset.REASON_EXCHANGE

                if (oldpos == this._p_rowposition)
                {
                    if (oldpos == row1)
                    {
                        this._setRowPosition(row2, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE
                    }
                    else if (oldpos == row2)
                    {
                        this._setRowPosition(row1, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE
                    }
                }
                return true;
            }
            else
            {
                if (this._p_rowposition == row1)
                {
                    this._p_rowposition = row2;
                }
                else if (this._p_rowposition == row2)
                {
                    this._p_rowposition = row1;
                }
            }
        }
        return false;
    };

    _pDatasetBase._filterRow = function (row)
    {
        var viewRecords = this._viewRecords;
        if (row < 0 || row >= viewRecords.length)
        {
            return false;
        }

        if (viewRecords == this._rawRecords)
        {
            viewRecords = this._viewRecords = this._rawRecords.slice(0, this._rawRecords.length);
            viewRecords.splice(row, 1);
        }
        else
        {
            var rowRow = viewRecords[row];
            if (rowRow._rtype & 48 === rowRow._rtype)
                return false;

            viewRecords.splice(row, 1);
            this._adjustGroupRowData(row);
        }

        this._p_rowcount = viewRecords.length;
        return true;
    };

    _pDatasetBase.filterRow = function (row)
    {
        row = row | 0;
        if (row < 0 || row >= this._p_rowcount)
        {
            return;
        }

        var oldpos = this._p_rowposition;
        var flag = this._filterRow(row);
        if (flag)
        {
            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(row, 1, 31); //nexacro.Dataset.REASON_FILTER
                // not changed by User Event
                if (oldpos == this._p_rowposition)
                {
                    if (oldpos > row)
                    {
                        this._setRowPosition(oldpos - 1, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE;
                    }
                    else if (oldpos == row)
                    {
                        if (this._p_rowcount == 0)
                        {
                            this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                        else
                        {
                            if (oldpos == this._p_rowcount)
                            {
                                this._forcesetRowPosition(this._p_rowcount - 1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                            }
                            else
                            {
                                this._setRowPosition(oldpos, 53); //nexacro.Dataset.REASON_ROWOBJECTCHANGE;
                            }
                        }
                    }
                }
            }
            else
            {
                if (oldpos > row)
                {
                    this._p_rowposition = (oldpos - 1);
                }
                else if (oldpos == row)
                {
                    if (oldpos > this._p_rowcount)
                    {
                        this._p_rowposition = this._p_rowcount - 1;
                    }
                    else
                    {
                        this._p_rowposition = oldpos;
                    }
                }
            }
        }
    };


    //clear(), clearData(), deleteAll(), deleteRow(), filterRow() 메소드를 수행한 결과 모든 Row 가 삭제되거나 표시되는 Row 가 없다면 false로 설정
    // dataset load 시 canrowposchange 발생안함
    _pDatasetBase._forcesetRowPosition = function (newpos, reason)
    {
        if (newpos < 0 || newpos >= this._p_rowcount)
        {
            newpos = -1;
        }

        var oldpos = this._p_rowposition;
        var evt;
        if (newpos != oldpos && newpos < this._p_rowcount)
        {
            /*
            if (this.canrowposchange && this.canrowposchange._has_handlers && oldpos != -1)//&& oldpos < this._p_rowcount)
            {
                var evt = new nexacro.DSRowPosChangeEventInfo(this, "canrowposchange", oldpos, newpos, reason);
                var ret = this.on_fire_canrowposchange(evt);
                if (ret == false)
                {
                    return;
                }
            }
            */
            if (this.onrowposchanged && this.onrowposchanged._has_handlers)
            {
                evt = new nexacro.DSRowPosChangeEventInfo(this, "onrowposchanged", oldpos, newpos, reason);
                this._p_rowposition = newpos;
                this.on_fire_onrowposchanged(evt);
            }
            else
            {
                this._p_rowposition = newpos;
            }
        }
        if (this.onvaluechanged && this.onvaluechanged._has_handlers)
        {
            evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", newpos, -1, -1, "", undefined, undefined);
            this.on_fire_onvaluechanged(evt);
        }
    };

    _pDatasetBase._setRowPosition = function (newpos, reason, value_update)
    {
        if (newpos < 0 || newpos >= this._p_rowcount)
        {
            newpos = -1;
        }

        var oldpos = this._p_rowposition;
        var evt;
        if (newpos != oldpos || reason == 53)// && newpos == oldpos))
        {
            if ((this.canrowposchange && this.canrowposchange._has_handlers) || (this.onrowposchanged && this.onrowposchanged._has_handlers))
            {
                evt = new nexacro.DSRowPosChangeEventInfo(this, "canrowposchange", oldpos, newpos, reason);

                if (this.canrowposchange && this.canrowposchange._has_handlers && this._eventstat
                    && (oldpos >= -1 && oldpos < this._p_rowcount))
                {
                    var ret = this.on_fire_canrowposchange(evt);
                    if (ret == false)
                    {
                        return;
                    }

                    if (newpos != evt.newrow)
                    {
                        newpos = evt.newrow;
                    }
                    if (newpos >= 0 || newpos < this._p_rowcount)
                    {
                        this._p_rowposition = newpos;
                        if (this.onrowposchanged && this.onrowposchanged._has_handlers)
                        {
                            this.on_fire_onrowposchanged(evt);
                        }
                        if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                        {
                            evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                            this.on_fire_onvaluechanged(evt);
                        }
                    }
                }
                else
                {
                    if (newpos >= 0 || newpos < this._p_rowcount)
                    {
                        this._p_rowposition = newpos;
                        if (this._eventstat)
                        {
                            if (this.onrowposchanged && this.onrowposchanged._has_handlers)
                            {
                                this.on_fire_onrowposchanged(evt);
                            }
                            if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                            {
                                evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                                this.on_fire_onvaluechanged(evt);
                            }
                        }
                    }
                }

            }
            else
            {
                this._p_rowposition = newpos;
                if (this._eventstat && this.onvaluechanged && this.onvaluechanged._has_handlers)
                {
                    evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
            }
        }
        else if (value_update)
        {
            if (this.onvaluechanged && this.onvaluechanged._has_handlers)
            {
                evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                this.on_fire_onvaluechanged(evt);
            }
        }
        return this._p_rowposition;
    };

    //==============================================================================
    // sort & group key functions
    _pDatasetBase.__splitKeyCols = function (str)
    {
        var arr = [];
        var plus, minus;
        if (str.charAt(0) != '+' && str.charAt(0) != '-')
        {
            str = '+' + str;
        }
        plus = str.indexOf('+');
        minus = str.indexOf('-');
        var pos = (plus >= 0 && minus >= 0) ? (minus < plus ? minus : plus) : (plus > minus ? plus : minus);
        var arrLength = 0;
        while (pos >= 0)
        {
            plus = str.indexOf('+', pos + 1);
            minus = str.indexOf('-', pos + 1);
            var nextpos = (plus >= 0 && minus >= 0) ? (minus < plus ? minus : plus) : (plus > minus ? plus : minus);
            if (nextpos < 0)
            {
                arr[arrLength] = str.substr(pos); arrLength++;
            }
            else
            {
                arr[arrLength] = str.substr(pos, nextpos - pos); arrLength++;
            }
            pos = nextpos;
        }
        return arr;
    };

    _pDatasetBase._clearKeyCols = function ()
    {
        this._keycols.length = 0;
        this._keycols.max_keylevel = 0;
        if (this._keycol_levels)
        {
            this._keycol_levels.length = null;
            this._keycol_levels = null;
        }
    };

    /*
        S:+Column1,O:Column1[en-US]
        G:+Column1,O:Column1[en-US]{"numeric":true}
        O:Column1[en-US],S:Column1
        G:+Column1,O:Column1[en-US],S:Column1
    */
    _pDatasetBase.__splitLocaleString = function (str, start_locale)
    {
        var str_locale = "";
        var loc_ind = 2;
        var punctuation_len = 1;
        var last_brace_idx = str.lastIndexOf("}");
        var last_bracket_idx = str.lastIndexOf("]");
        var last_idx = last_brace_idx > last_bracket_idx ? last_brace_idx : last_bracket_idx;
        var len = str.length;
        if (last_brace_idx > -1 || last_bracket_idx > -1)
        {
            if (last_idx == len - 1) //end
            {
                str_locale = str.substr(start_locale + loc_ind, len - start_locale + loc_ind);
                str = str.substr(0, start_locale - punctuation_len);
            }
            else if (start_locale == 0)  //first
            {
                str_locale = str.substr(loc_ind, last_idx - punctuation_len);
                str = str.substr(last_idx + loc_ind, len - last_idx + punctuation_len);
            }
            else//middle
            {
                str_locale = str.substr(start_locale + loc_ind, last_idx - start_locale - punctuation_len);
                str = str.substr(0, start_locale).concat(str.substr(last_idx + loc_ind, len - last_idx));
            }
        }
        else //예외처리
        {
            last_idx = str.indexOf(",", start_locale);
            if (last_idx == -1) //end
            {
                str_locale = str.substr(start_locale + loc_ind, len);
                str = str.substr(0, start_locale - punctuation_len);
            }
            else if (start_locale == 0) //first
            {
                str = str.substr(last_idx + punctuation_len, len - last_idx);
            }
            else // middle
            {
                str = str.substr(0, start_locale).concat(str.substr(last_idx + punctuation_len, len - last_idx));
            }
        }
        return [str, str_locale];
    };

    /*
     *  column[locale]{localeoption}
     *  예 ) column1[ko-KR]{"numeric":true}
     *       column1[ko-KR]
     *       column1{"numeric":true}
    */
    _pDatasetBase.__parseLocaleString = function (str)
    {
        //파싱 로직을 바꿀지 고민
        var keycols = this._keycols;
        var start_bracket_idx = str.indexOf('[');
        var start_brace_idx = str.indexOf('{');
        var pos = (start_bracket_idx >= 0 && start_brace_idx >= 0) ? (start_bracket_idx < start_brace_idx ? start_bracket_idx : start_brace_idx) : (start_bracket_idx > start_brace_idx ? start_bracket_idx : start_brace_idx);
        var end_pos = 0, str_idx = 0, cnt = 0;
        var locale_id, locale, locale_option;
        if (pos > -1)
        {
            while (pos >= 0 && cnt < 100)
            {
                if (start_bracket_idx > -1 && start_brace_idx > -1 && start_bracket_idx < start_brace_idx)
                {
                    end_pos = str.indexOf(']', str_idx);
                    locale_id = str.substr(str_idx, start_bracket_idx - str_idx);
                    locale = str.substr(start_bracket_idx + 1, end_pos - start_bracket_idx - 1);
                    if (end_pos + 1 == start_brace_idx)
                    {
                        end_pos = str.indexOf('}', str_idx);
                        locale_option = str.substr(start_brace_idx, end_pos - start_brace_idx + 1);
                    }
                }
                else if (start_brace_idx < 0)
                {
                    end_pos = str.indexOf(']', str_idx);
                    locale_id = str.substr(str_idx, start_bracket_idx - str_idx);
                    locale = str.substr(start_bracket_idx + 1, end_pos - start_bracket_idx - 1);
                }
                else
                {
                    end_pos = str.indexOf('}', str_idx);
                    locale_id = str.substr(str_idx, start_brace_idx - str_idx);
                    locale_option = str.substr(start_brace_idx, end_pos - start_brace_idx + 1);
                }
                str_idx = end_pos + 1;
                start_bracket_idx = str.indexOf('[', str_idx);
                start_brace_idx = str.indexOf('{', str_idx);
                pos = (start_bracket_idx >= 0 && start_brace_idx >= 0) ? (start_bracket_idx < start_brace_idx ? start_bracket_idx : start_brace_idx) : (start_bracket_idx > start_brace_idx ? start_bracket_idx : start_brace_idx);

                for (var i = 0, len = keycols.length; i < len; i++)
                {
                    var keycol = keycols[i];
                    if (keycol.colid == locale_id)
                    {
                        try
                        {
                            if (locale)
                            {
                                var _locale = locale.replace(/[\"\']/gi, "").replace("_", "-");
                                var ret = nexacro._supportedLocalesOf(_locale);
                                if (ret && ret.length < 1)
                                {
                                    nexacro._onSystemWarning(this, "msg_locale_notsupported", _locale);
                                }
                                keycol.locale = _locale;
                            }
                            if (locale_option)
                                keycol.localeoption = locale_option.replace(/[\']/gi, "\"");
                        }
                        catch (e)
                        {
                            // KISA 보안취약점(6-2) 지적사항
                            nexacro._settracemsg(e);
                        }
                        break;
                    }
                }
                locale_id = undefined;
                locale = undefined;
                locale_option = undefined;
                cnt++;
            }
        }
        else
        {
            for (var i = 0, len = keycols.length; i < len; i++)
            {
                var keycol = keycols[i];
                if (str.indexOf(keycol.colid) > -1)
                {
                    keycol._use_syslang = true;
                }
                else if (keycol._use_syslang)
                    keycol._use_syslang = undefined;

            }
        }

        //return 1;
    };

    _pDatasetBase._parseKeyCols = function ()
    {
        var keyCnt = this._keycols.length;

        if (keyCnt > 0)
        {
            return keyCnt;
        }

        var str = this._p_keystring;
        var str_locale = "";
        var level = 0;
        if (str.length > 0)
        {
            var start_locale = str.indexOf("O:");
            if (start_locale > -1)
            {
                var arr_str = this.__splitLocaleString(str, start_locale);
                str = arr_str[0];
                str_locale = arr_str[1];
            }
            var keys = str.split(',');
            function _parseKeyCols_loop(i)
            {
                var key = keys[i];
                key = key.trim();
                if (key.length == 0)
                {
                    return;
                }

                var colonpos = key.indexOf(':');
                if (colonpos <= 0 || (key.charAt(0) != 'S' && key.charAt(0) != 's')) level++;

                var keys2;
                if (colonpos >= 0)
                {
                    keys2 = this.__splitKeyCols(key.substr(colonpos + 1));
                }
                else
                {
                    keys2 = this.__splitKeyCols(key);
                }

                function _parseKeyCols_loop2(j)
                {
                    var key2 = keys2[j];
                    key2 = key2.trim();
                    if (key2.length == 0)
                    {
                        return;
                    }
                    var colid;
                    var colidx = -1;
                    var descending = false;
                    if (key2.charAt(0) == '-')
                    {
                        colid = key2.substr(1);
                        colidx = this.colinfos.indexOf(colid);
                        descending = true;
                    }
                    else if (key2.charAt(0) == '+')
                    {
                        colid = key2.substr(1);
                        colidx = this.colinfos.indexOf(colid);
                        //descending = false;
                    }
                    else
                    {
                        colid = key2;
                        colidx = this.colinfos.indexOf(colid);
                        //descending = false;
                    }

                    if (colidx >= 0)
                    {
                        this._keycols[keyCnt] = {
                            level: level,
                            colid: colid,
                            colidx: colidx,
                            descending: descending
                        };
                        keyCnt++;
                    }
                }
                nexacro.__reverseForLoop(this, keys2.length - 1, 0, _parseKeyCols_loop2);
            }
            nexacro.__reverseForLoop(this, keys.length - 1, 0, _parseKeyCols_loop);

            if (str_locale)
            {
                this.__parseLocaleString(str_locale);
            }
        }
        this._keycols.max_keylevel = level;
        return keyCnt;
    };

    _pDatasetBase._getLocale = function ()
    {
        var environment = nexacro.getEnvironment();
        var locale = environment.locale ? environment.locale : nexacro._getLocale();
        var pThis = this;

        while (pThis)
        {
            if (pThis._locale)
            {
                locale = pThis._locale;
                break;
            }
            pThis = pThis.parent;
        }

        if (locale.indexOf("_") > -1)
        {
            locale = locale.substr(0, 2);
        }

        return locale;
    };

    _pDatasetBase.__createSortFunc = function ()
    {
        var keyList = this._keycols;
        var colList = this.colinfos;
        var pThis = this;
        return function (a, b)
        {
            a = pThis.__getParsedRow(a);
            b = pThis.__getParsedRow(b);
            var cmp = 0;
            function __sort_compare_loopFn(i)
            {
                var key = keyList[i];
                var value1 = a[key.colidx];
                var value2 = b[key.colidx];
                var locale = key.locale;
                var localeoption = key.localeoption;
                cmp = this._compareValue(value1, value2, colList[key.colidx].ntype, locale, localeoption, key._use_syslang);
                if (cmp != 0)
                {
                    cmp = (key.descending) ? -cmp : cmp;
                    return true; // break;
                }
            }
            nexacro.__reverseForLoop(pThis, keyList.length - 1, 0, __sort_compare_loopFn);
            return cmp == 0 ? ((a._rawidx > b._rawidx) ? 1 : -1) : cmp;
        };
    };

    _pDatasetBase._sortData = function ()
    {
        var viewRecords = this._viewRecords;
        if (this._keycols.length > 0 && viewRecords.length > 0)
        {
            if (viewRecords == this._rawRecords)
            {
                viewRecords = this._viewRecords = this._rawRecords.slice(0, this._rawRecords.length);
            }
            var cmpfn = this.__createSortFunc();
            viewRecords.sort(cmpfn);
            //cmpfn = null;
        }
    };
    _pDatasetBase._sortRawData = function ()
    {
        var rawRecords = this._rawRecords;
        if (this._keycols.length > 0 && rawRecords.length > 0)
        {
            var cmpfn = this.__createSortFunc();
            rawRecords.sort(cmpfn);
            //cmpfn = null;
            this._adjustRawIdx(0, rawRecords.length);
        }
    };

    _pDatasetBase._reFilter = function ()
    {
        var viewRecords;
        if (this._p_filterstr.length > 0)
        {
            viewRecords = [];
            /*
                        var viewRecords = this._viewRecords;
                        if (viewRecords != this._rawRecords)
                        {
                            viewRecords.length = 0;
                        }
                        else
                        {
                            viewRecords = this._viewRecords;// = [];
                        }
            */
            if (this._filterFn == null)
            {
                var filterFn = this._createExprFunc(this._p_filterstr);
                if (typeof filterFn == "function")
                {
                    this._filterFn = filterFn;
                }
            }

            if (this._filterFn)
            {
                var exprfn = this._filterFn;
                var rawRecords = this._rawRecords;
                function __reFilter_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    var flag = exprfn.call(this, i, i, null, this, rawRecords, rowRow, []);
                    if (flag)
                        viewRecords[viewRecords.length] = rowRow;
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __reFilter_loopFn);

                this._viewRecords = viewRecords;
            }
        }
        else
        {
            viewRecords = this._viewRecords;
            if (viewRecords != this._rawRecords)
            {
                viewRecords.length = 0;
            }
            this._viewRecords = this._rawRecords;
        }
        this._p_rowcount = this._viewRecords.length;
    };

    _pDatasetBase.filter = function (strkey)
    {
        if (arguments.length == 1)
        {
            this._p_filterstr = nexacro._toString(strkey);
        }

        this._filterFn = null;
        if (!this.loadstatus && this._rawRecords.length > 0)
        {
            var oldpos = this._p_rowposition;
            var viewRecords = this._viewRecords;
            var oldrowRow = viewRecords[oldpos];

            this._reFilter();
            this._resetSortGroup();
            var newpos = this._viewRecords.indexOf(oldrowRow);

            if (this._eventstat)
            {
                this.on_fire_onrowsetchanged(-1, -1, 31);
                if (oldpos == this._p_rowposition)
                {
                    if (this._p_rowcount)
                    {
                        if (newpos == -1)
                        {
                            this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                        else if (oldpos >= 0 && oldpos != newpos)
                        {
                            this._setRowPosition(newpos, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE;
                        }
                        else
                        {
                            this._forcesetRowPosition(newpos, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                    }
                    else
                    {
                        this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                }
            }
            else
            {
                this._p_rowposition = newpos;
            }
        }
        else if (!this.loadstatus)
        {
            this._defaultFilterStr = this._p_filterstr;
        }
        //  return true;

        // return false;
    };

    _pDatasetBase._deleteAllGroupData = function ()
    {
        var viewRecords = this._viewRecords;
        var cnt = viewRecords.length;
        if (this._keycols.length <= 0 || cnt <= 0)
            return;

        function _deleteAllGroupData_loop(i)
        {
            var rowRow = viewRecords[i];
            if (rowRow._level > 0)
            {
                rowRow.length = 0;
                viewRecords.splice(i, 1);
            }
        }
        nexacro.__reverseForLoop(this, viewRecords.length - 1, 0, _deleteAllGroupData_loop);
    };

    _pDatasetBase._calcGroupHeaderData = function (grpRow, col_levels)
    {
        var colList = this.colinfos;
        var grpStart = grpRow._grpstart;
        var grpEnd = grpRow._grpend;
        var lvl = grpRow._level;
        var viewRecords = this._viewRecords;
        var keyRow = viewRecords[grpStart];

        function _calcGroupHeaderData_loop(colidx)
        {
            var headerText = this._p_groupheadertext;
            switch (headerText)
            {
                case "summary":
                    grpRow[colidx] = this._getRangeSummaryData(colidx, col_levels[colidx], grpStart, grpEnd, lvl);
                    break;
                default:
                    if (col_levels[colidx] >= lvl)
                    {
                        grpRow[colidx] = keyRow[colidx];
                    }
                    break;
            }
        }
        nexacro.__forLoop(this, 0, colList.length, _calcGroupHeaderData_loop);
    };

    _pDatasetBase._calcGroupData = function (grpRow, col_levels)
    {
        var colList = this.colinfos;
        var grpStart = grpRow._grpstart;
        var grpEnd = grpRow._grpend;
        var lvl = grpRow._level;
        var viewRecords = this._viewRecords;

        var keyRow = viewRecords[grpStart];

        function _calcGroupData_loop(colidx)
        {
            grpRow[colidx] = this._getRangeSummaryData(colidx, col_levels[colidx], grpStart, grpEnd, lvl);
        }
        nexacro.__forLoop(this, 0, colList.length, _calcGroupData_loop);
    };

    _pDatasetBase._getRangeSummaryData = function (colidx, collevel, start, end, rowlevel)
    {
        var colList = this.colinfos;
        var viewRecords = this._viewRecords;

        var keyRow = viewRecords[start];

        var colinfo = colList[colidx];
        var colprop = colinfo.prop;
        if (colprop)
            colprop = colprop.toLowerCase();
        var ntype = colinfo.ntype;

        switch (colprop)
        {
            case "count":
                // COLSUM_COUNT
                return this._getCountValue(viewRecords, -1, start, end, ntype);
                break;
            case "sum":
                // COLSUM_SUMM
                return this._getSumValue(viewRecords, colidx, start, end, ntype);
                break;
            case "max":
                // COLSUM_MAX
                return this._getMaxValue(viewRecords, colidx, start, end, ntype);
                break;
            case "min":
                // COLSUM_MIN
                return this._getMinValue(viewRecords, colidx, start, end, ntype);
                break;
            case "avg":
                // COLSUM_AVG
                return this._getAvgValue(viewRecords, colidx, start, end, ntype, true);
                break;
            case "text":
                // COLSUM_TEXT
                return colinfo.sumtext;
                break;
            case "key":
                // COLSUM_KEY
                // TODO : level < max_level : this key is ??
                return keyRow[colidx];
                break;
            default:
                if (collevel >= rowlevel)
                {
                    return keyRow[colidx];
                }
                else
                {
                    switch (ntype)
                    {
                        case 2:
                        // INT
                        case 3:
                        // float
                        case 4:
                            // BIGDECIMAL
                            return this._getSumValue(viewRecords, colidx, start, end, ntype);
                            break;
                        default:
                            // grpRow[colidx] = colinfo.sumtext;
                            break;
                    }
                }
                break;
        }
        return;
    };

    _pDatasetBase._createGroupData = function ()
    {
        var keyList = this._keycols;
        var maxlevel = keyList.max_keylevel;
        if (maxlevel == 0 || this._viewRecords.length == 0)
        {
            return;
        }
        var colList = this.colinfos;
        var level_idx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        var keycnt = keyList.length;

        var col_levels = this._keycol_levels;
        if (col_levels)
        {
            col_levels.length = 0;
        }
        else
        {
            this._keycol_levels = col_levels = [];
        }

        var showgroupheader = false, showgroupsummary = false;
        switch (this._p_grouprowtype)
        {
            case "both":
                showgroupheader = true;
                showgroupsummary = true;
                break;
            case "header":
                showgroupheader = true;
                break;
            case "summary":
                showgroupsummary = true;
                break;
        }
        const frontGroupRowCnt = (showgroupheader | 0) + ((showgroupsummary && this._p_reversesubsum) | 0);

        // col_levels
        function __createGroupData_keycollevel_loopFn(i)
        {
            var key = keyList[i];
            col_levels[key.colidx] = key.level;
        }
        nexacro.__forLoop(this, 0, keyList.length, __createGroupData_keycollevel_loopFn);

        var viewRecords = this._viewRecords;
        var cnt = viewRecords.length;

        var prevRow = viewRecords[0];

        var idx = 1;
        function __createGroupData_loopFn()
        {
            if (idx <= cnt)
            {
                var curRow = this._viewRecords[idx];

                var chklvl = 0;
                if (curRow)
                {
                    const __createGroupData_compare_loopFn = function (k)
                    {
                        var key = keyList[k];
                        if (key.level == 0)
                        {
                            return false;
                        }
                        var keyidx = key.colidx;
                        if (!this._isEqualValue(curRow[keyidx], prevRow[keyidx], colList[keyidx].ntype))
                        {
                            chklvl = key.level;
                            return true; // break;
                        }
                    }
                    nexacro.__reverseForLoop(this, keycnt - 1, 0, __createGroupData_compare_loopFn);
                }
                else
                {
                    chklvl = maxlevel;
                }

                // create group rows
                if (chklvl > 0)
                {
                    const __createGroupData_row_loopFn = function (lvl)
                    {
                        let rangeStart, rangeEnd;
                        if (showgroupheader)
                        {
                            const headerRow = [];
                            headerRow._rtype = 32;
                            headerRow._level = lvl;
                            headerRow._grpstart = level_idx[lvl];
                            headerRow._grpend = idx;

                            this._calcGroupHeaderData(headerRow, col_levels);

                            // add row to idx + (prev added rows)
                            viewRecords.splice(level_idx[lvl], 0, headerRow);

                            headerRow._grpstart += ((1 + maxlevel - lvl) * frontGroupRowCnt);
                            headerRow._grpend += ((1 + maxlevel - lvl) * frontGroupRowCnt);
                            rangeStart = headerRow._grpstart;
                            rangeEnd = headerRow._grpend;

                            idx++;
                            cnt++;
                        }

                        if (showgroupsummary)
                        {
                            if (this._p_reversesubsum)
                            {
                                const grpRow = [];
                                grpRow._rtype = 16;
                                grpRow._level = lvl;
                                // before calc add to index by prev added row count
                                grpRow._grpstart = level_idx[lvl];
                                grpRow._grpend = idx;
                                this._calcGroupData(grpRow, col_levels);
                                // add row to groupstart
                                viewRecords.splice(level_idx[lvl] + (showgroupheader ? 1 : 0), 0, grpRow);

                                // after calculate adjust group row idx
                                if (showgroupheader)
                                {
                                    grpRow._grpstart = rangeStart;
                                    grpRow._grpend = rangeEnd;
                                }
                                else 
                                {
                                    grpRow._grpstart += 1 + (maxlevel - lvl); // add (1:self group row) + (next added row count)
                                    grpRow._grpend += 1 + (maxlevel - lvl); // last index after all rows added
                                }

                                idx++;
                                cnt++;
                            }
                            else
                            {
                                const grpRow = [];
                                grpRow._rtype = 16;
                                grpRow._level = lvl;
                                //grpRow._grpstart = level_idx[lvl] + (showgroupheader ? lvl : 0);
                                //grpRow._grpend = idx + (showgroupheader ? lvl : 0);
                                grpRow._grpstart = level_idx[lvl];
                                grpRow._grpend = idx;
                                this._calcGroupData(grpRow, col_levels);

                                // add row to idx + (prev added rows)
                                //const rowPos = grpRow._grpend + lvl - 1;
                                //viewRecords.splice(rowPos, 0, grpRow);
                                viewRecords.splice(idx, 0, grpRow);

                                if (showgroupheader)
                                {
                                    grpRow._grpstart = rangeStart;
                                    grpRow._grpend = rangeEnd;
                                }

                                idx++;
                                cnt++;
                            }
                        }
                    };
                    nexacro.__forLoop(this, 1, chklvl + 1, __createGroupData_row_loopFn);

                    prevRow = curRow;

                    // next index = idx <== (added group row count)
                    const _updateLevelIndex_loopFn = function (i)
                    {
                        level_idx[i] = idx;
                    };
                    nexacro.__forLoop(this, 1, chklvl + 1, _updateLevelIndex_loopFn);
                }

                idx++;
                return false;
            }
            return true;
        }
        nexacro.__whileLoop(this, __createGroupData_loopFn);
    };

    _pDatasetBase._resetSortGroup = function ()
    {
        /*
        var oldpos = this._p_rowposition;
        if (this._p_rowposition == -1)
        {
            oldpos = 0;
        }
        */
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;

        if (this._parseKeyCols() > 0 && rawRecords.length > 0)
        {
            if (rawRecords != viewRecords)
            {
                if (viewRecords.length == 0)
                    return false;
                this._deleteAllGroupData();
            }
            else
            {
                viewRecords = this._viewRecords = this._rawRecords.slice(0, this._rawRecords.length);
            }

            this._sortData();
            this._createGroupData();

            this._p_rowcount = viewRecords.length;
            return true;
        }

        return false;
    };

    _pDatasetBase._adjustGroupRowData = function (row)
    {
        var keyList = this._keycols;
        var maxlevel = keyList.max_keylevel;
        if (maxlevel == 0 || this._viewRecords.length == 0)
        {
            return false;
        }

        var col_levels = this._keycol_levels;
        var viewRecords = this._viewRecords;

        var showgroupheader = false, showgroupsummary = false;
        switch (this._p_grouprowtype)
        {
            case "both":
                showgroupheader = true;
                showgroupsummary = true;
                break;
            case "header":
                showgroupheader = true;
                break;
            case "summary":
                showgroupsummary = true;
                break;
        }

        // find & remove empty group
        var delcnt = 1;
        var cnt = viewRecords.length;
        var idx;

        if (showgroupheader || (showgroupsummary && this._p_reversesubsum))
        {
            idx = row;

            const __adjustGroupData_reverse_loopFn = function ()
            {
                if (idx >= 0)
                {
                    var grpRow = viewRecords[idx];
                    if (grpRow && (grpRow._rtype & 48))
                    {
                        if (grpRow._grpstart <= row && grpRow._grpend > row)
                        {
                            grpRow._grpend -= delcnt;

                            if (grpRow._grpend - grpRow._grpstart == 1)
                            {
                                if (grpRow._rtype == 32)
                                {
                                    if (showgroupsummary)
                                    {
                                        delcnt += viewRecords.splice(idx, 2);
                                    }
                                }
                                else if (grpRow._rtype == 16 && this._p_reversesubsum)
                                {
                                    if (showgroupheader)
                                    {
                                        delcnt += viewRecords.splice(idx - 1, 2);
                                    }
                                }
                            }
                            else
                            {
                                if (grpRow._rtype == 32)
                                {
                                    this._calcGroupHeaderData(grpRow, col_levels);
                                }
                                else if (grpRow._rtype == 16)
                                {
                                    this._calcGroupData(grpRow, col_levels);
                                }
                            }
                        }
                        if (grpRow.level == maxlevel)
                            return true; // break;
                    }
                    idx--;
                    return false;
                }
                return true; // break;
            };
            nexacro.__whileLoop(this, __adjustGroupData_reverse_loopFn);
        }

        // remove forward empty group summary 

        // adjust forward index : next header, all summary
        if (showgroupheader || showgroupsummary)
        {
            idx = row - (delcnt - 1);
            cnt = viewRecords.length;

            const __adjustGroupData_forward_loopFn = function ()
            {
                if (idx < cnt)
                {
                    var grpRow = viewRecords[idx];
                    if (grpRow && (grpRow._rtype & 48))
                    {
                        if (grpRow._grpstart <= row && grpRow._grpend > row)
                        {
                            grpRow._grpend -= delcnt;
                            if (grpRow._grpend - grpRow._grpstart == 1)
                            {
                                delcnt += viewRecords.splice(idx, 1);
                            }
                            else
                            {
                                if (grpRow._rtype == 32)
                                {
                                    this._calcGroupHeaderData(grpRow, col_levels);
                                }
                                else if (grpRow._rtype == 16)
                                {
                                    this._calcGroupData(grpRow, col_levels);
                                }
                            }
                        }
                        else if (grpRow._grpstart > row && grpRow._grpend > row)
                        {
                            grpRow._grpstart -= delcnt;
                            grpRow._grpend -= delcnt;
                        }
                    }

                    idx++;
                    return false;
                }
                return true; // break;
            };
            nexacro.__whileLoop(this, __adjustGroupData_forward_loopFn);
        }
        /*
        if (this._p_reversesubsum)
        {
            idx = row - 1;
            const __removeEmptyGroup_reverse_loopFn = function ()
            {
                if (idx >= 0)
                {
                    var grpRow = viewRecords[idx];
                    if (grpRow && grpRow._rtype == 16 && grpRow._grpstart >= (row - delcnt) && grpRow._grpend <= row)
                    {
                        viewRecords.splice(idx, 1);
                        grpRow.length = 0;
                        delcnt++;
                        cnt--;
                        idx--;
                        return false;
                    }
                }
                return true; // break;
            };
            nexacro.__whileLoop(this, __removeEmptyGroup_reverse_loopFn);

            // adjust backward
            const __adjustGroupRowData_reverse1_loopFn = function ()
            {
                if (idx >= 0)
                {
                    var grpRow = viewRecords[idx];
                    if (grpRow && grpRow._rtype == 16)
                    {
                        if (grpRow._grpstart <= (row - delcnt) && grpRow._grpend > row)
                        {
                            grpRow._grpend -= delcnt;
                            this._calcGroupData(grpRow, col_levels);
                        }
                        else
                        {
                            if (grpRow._grpend >= (row + delcnt))
                                grpRow._grpend -= delcnt;
                        }
                    }
                    idx--;
                    return false;
                }
                return true; // break;
            };
            nexacro.__whileLoop(this, __adjustGroupRowData_reverse1_loopFn);
            // adjust forward
            idx = row - delcnt + 1;
            const __adjustGroupRowData_reverse2_loopFn = function ()
            {
                if (idx < cnt)
                {
                    var grpRow = viewRecords[idx];
                    if (grpRow && grpRow._rtype == 16)
                    {
                        if (grpRow._grpstart >= (row + delcnt))
                            grpRow._grpstart -= delcnt;
                        if (grpRow._grpend >= (row + delcnt))
                            grpRow._grpend -= delcnt;
                    }
                    idx++;
                    return false;
                }
                return true; // break;
            };
            nexacro.__whileLoop(this, __adjustGroupRowData_reverse2_loopFn);
        }
        else
        {
            idx = row;

            if (showgroupheader)
            {
                grpcnt = 1;
                const __removeEmptyGroupHeader_forward_loopFn = function ()
                {
                    if (idx > 0)
                    {
                        var headerRow = viewRecords[idx - 1];
                        if (headerRow && headerRow._rtype == 32 && headerRow._grpstart >= row && headerRow._grpend <= (row + grpcnt))
                        {
                            viewRecords.splice(--idx, 1);
                            headerRow.length = 0;
                            delcnt++;
                            grpcnt += showgroupsummary ? 2 : 1;
                            cnt--;
                            return false;
                        }
                    }
                    return true; // break;
                };
                nexacro.__whileLoop(this, __removeEmptyGroupHeader_forward_loopFn);
            }

            if (showgroupsummary)
            {
                grpcnt = 1;
                const __removeEmptyGroupSummary_forward_loopFn = function ()
                {
                    if (idx < cnt)
                    {
                        if (showgroupsummary)
                        {
                            var grpRow = viewRecords[idx];
                            if (grpRow && grpRow._rtype == 16 && grpRow._grpstart >= row && grpRow._grpend <= (row + grpcnt))
                            {
                                viewRecords.splice(idx, 1);
                                grpRow.length = 0;
                                delcnt++;
                                grpcnt += showgroupheader ? 2 : 1;
                                cnt--;
                                return false;
                            }
                        }
                    }
                    return true; // break;
                };
                nexacro.__whileLoop(this, __removeEmptyGroupSummary_forward_loopFn);
            }

            if (showgroupheader)
            {
                var delhdrcnt = row - idx;

                // adjust backward
                const __adjustGroupRowData_Header_forward_loopFn = function ()
                {
                    if (idx >= 0)
                    {
                        var headerRow = viewRecords[idx];
                        if (headerRow && headerRow._rtype == 32)
                        {
                            if (headerRow._grpstart <= row && headerRow._grpend > row)
                            {
                                headerRow._grpstart -= delhdrcnt;
                                headerRow._grpend -= delcnt;
                                this._calcGroupHeaderData(headerRow, col_levels);
                            }
                            else
                            {
                                if (headerRow._grpstart >= (row - delhdrcnt))
                                    headerRow._grpstart -= delhdrcnt;

                                if (headerRow._grpend >= (row + delcnt))
                                    headerRow._grpend -= delcnt;
                            }
                        }
                        idx--;
                        return false;
                    }
                    return true; // break;
                };
                nexacro.__whileLoop(this, __adjustGroupRowData_Header_forward_loopFn);
            }

            const __adjustGroupRowData_Summary_forward_loopfn = function ()
            {
                if (idx < cnt)
                {
                    var grpRow = viewRecords[idx];
                    if (grpRow && (grpRow._rtype == 16 || grpRow._rtype == 32))
                    {
                        if (grpRow._grpstart <= row && grpRow._grpend > (row + delcnt))
                        {
                            grpRow._grpend -= delcnt;
                            this._calcGroupData(grpRow, col_levels);
                        }
                        else
                        {
                            if (grpRow._grpstart >= (row + delcnt))
                                grpRow._grpstart -= delcnt;
                            if (grpRow._grpend >= (row + delcnt))
                                grpRow._grpend -= delcnt;
                        }
                    }
                    idx++;
                    return false;
                }
                return true; // break;
            };
            nexacro.__whileLoop(this, __adjustGroupRowData_Summary_forward_loopfn);
        }
        */
        return true;
    };

    _pDatasetBase._updateGroupRowData = function (row)
    {
        var keyList = this._keycols;
        if (keyList.length <= 0 || keyList.max_keylevel == 0)
        {
            return false;
        }

        var viewRecords = this._viewRecords;
        var col_levels = this._keycol_levels;
        function __updateGroupRowData_loopFn(i)
        {
            var grpRow = viewRecords[i];
            if (grpRow._rtype == 16 && grpRow._grpstart <= row && grpRow._grpend >= row)
            {
                this._calcGroupData(grpRow, col_levels);
            }
        }
        if (this._p_reversesubsum)
        {
            nexacro.__reverseForLoop(this, row - 1, 0, __updateGroupRowData_loopFn);
        }
        else
        {
            nexacro.__forLoop(this, row, viewRecords.length, __updateGroupRowData_loopFn);
        }
        return true;
    };

    // 오동후: 'apply_method' 사용되지 않는?
    _pDatasetBase.updateSortGroup = function (strkey, apply_method)
    {
        var ret = true;
        if (arguments.length < 2)
        {
            if (strkey)
            {
                strkey = strkey.toString();
                this._p_keystring = strkey;
            }
            else
            {
                if (!this._p_keystring)
                    ret = false;
            }
        }
        else
        {
            if (!apply_method)
                ret = false;
        }

        if (ret)
        {
            var isReset = false;
            if (this._p_keystring == "" || this._p_keystring == "S:" || this._p_keystring == "G:" || this._p_keystring == "O:")
            {
                isReset = true;
            }

            var viewRecords, oldpos, /*oldrowdata,*/ oldRow;
            if (this._p_keystring && !isReset)
            {
                viewRecords = this._viewRecords;
                oldpos = this._p_rowposition;
                if (viewRecords) oldRow = viewRecords[oldpos];



                if (!this.loadstatus && this._rawRecords.length > 0)
                {
                    this._clearKeyCols();
                    this._resetSortGroup();
                }
                else if (!this.loadstatus && this._rawRecords.length == 0 && viewRecords.length > 0)
                {
                    this._deleteAllGroupData();

                    this._clearKeyCols();
                    this._p_rowcount = viewRecords.length;

                }
            }
            else
            {
                viewRecords = this._viewRecords;
                oldpos = this._p_rowposition;
                oldRow = viewRecords[oldpos];

                this._deleteAllGroupData();

                this._clearKeyCols();
                if (!this.loadstatus && this._rawRecords.length > 0)
                {
                    this._viewRecords = this._rawRecords;
                    this._reFilter();
                }
            }

            var newpos = this._viewRecords.indexOf(oldRow);
            if (this._p_enableevent)
            {
                this.on_fire_onrowsetchanged(-1, -1, 30); //nexacro.Dataset.REASON_SORTGROUP
                if (oldpos == this._p_rowposition)
                {
                    if (oldpos >= 0 && oldpos != newpos)
                    {
                        this._setRowPosition(newpos, 52); //nexacro.Dataset.REASON_ROWINDEXCHANGE;
                    }
                }
            }
            else
            {
                this._p_rowposition = newpos;
            }
        }
        return ret;
    };

    _pDatasetBase._isValidColumn = function (col)
    {
        var colinfo = this.colinfos[col];
        if (colinfo) return true;

        var colidx = (+col);
        if (colidx != col)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            var constvar = this._constVars[col];
            if (constvar)
                return true;
            else
            {
                if (typeof (col) == "string")
                    return false;
                colinfo = this.colinfos[0];
                if (colinfo) return true;
            }
        }

        return false;
    };

    //==============================================================================
    // Data control functions
    _pDatasetBase.getConstColumn = function (id)
    {
        var constvar = this._constVars[id];
        if (constvar)
        {
            var ret = this._getConstValueByDatapath(constvar, this._binddataobject);
            if (ret != undefined)
                return ret;
            else
                return constvar.value;
        }
        return undefined;
    };

    _pDatasetBase.getColumn = function (row, col)
    {
        row = row | 0;
        var colinfo = this.colinfos[col];
        var rowRow, constvar;
        var coltype;

        if (colinfo)
        {
            coltype = colinfo.ntype;
            rowRow = this.__getParsedRow(this._viewRecords[row]);
            if (rowRow)
            {
                if (coltype >= 4 && coltype <= 7)
                    return nexacro._cloneObject(rowRow[colinfo._index]);

                return rowRow[colinfo._index];
            }
            return undefined;
        }

        var colidx = (+col);
        if (colidx != col)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
            {
                var dataobject = this._binddataobject;
                if (dataobject && constvar.datapath)
                {
                    return this._getConstValueByDatapath(constvar, dataobject);
                }
                if (constvar.value)
                    return constvar.value;

            }
            else
            {
                if (typeof (col) == "string")
                    return undefined;
                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    coltype = colinfo.ntype;
                    rowRow = this.__getParsedRow(this._viewRecords[row]);
                    if (rowRow)
                    {
                        if (coltype >= 4 && coltype <= 7)
                            return nexacro._cloneObject(rowRow[colinfo._index]);

                        return rowRow[colinfo._index];
                    }
                    return undefined;
                }
            }
            return undefined;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return constvar.value;
            else   //숫자 id
            {
                constvar = this._constVars[col];
                return constvar ? constvar.value : undefined;
            }
        }
    };
    _pDatasetBase.getColumnNF = function (row, col)
    {
        row = row | 0;
        var colinfo = this.colinfos[col];
        var rowRow;
        var constvar;
        var coltype;
        if (colinfo)
        {
            coltype = colinfo.ntype;
            rowRow = this.__getParsedRow(this._rawRecords[row]);
            if (rowRow)
            {
                if (coltype >= 4 && coltype <= 7)
                    return nexacro._cloneObject(rowRow[colinfo._index]);

                return rowRow[colinfo._index];
            }
            return undefined;
        }
        var colidx = (+col);
        if (colidx != col)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
                return constvar.value;
            else
            {
                if (typeof (col) == "string")
                    return undefined;
                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    coltype = colinfo.ntype;
                    rowRow = this.__getParsedRow(this._rawRecords[row]);
                    if (rowRow)
                    {
                        if (coltype >= 4 && coltype <= 7)
                            return nexacro._cloneObject(rowRow[colinfo._index]);

                        return rowRow[colinfo._index];
                    }
                    return undefined;
                }
            }
            return undefined;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return constvar.value;
            else   //숫자 id
            {
                constvar = this._constVars[col];
                return constvar ? constvar.value : undefined;
            }
        }
    };

    _pDatasetBase.getOrgColumn = function (row, col)
    {
        row = row | 0;
        var colinfo = this.colinfos[col];
        var rowRow;
        var constvar;
        var coltype;
        var ret;
        if (colinfo)
        {
            coltype = colinfo.ntype;
            rowRow = this.__getParsedRow(this._viewRecords[row]);
            if (rowRow)
            {
                ret = rowRow._orgrow ? rowRow._orgrow[colinfo._index] : rowRow[colinfo._index];

                if (coltype >= 4 && coltype <= 7)
                    return nexacro._cloneObject(ret);

                return ret;
            }
            return undefined;
        }
        var colidx = (+col);
        if (colidx != col)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
                return constvar.value;
            else
            {
                if (typeof (col) == "string")
                    return undefined;
                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    coltype = colinfo.ntype;
                    rowRow = this.__getParsedRow(this._viewRecords[row]);
                    if (rowRow)
                    {
                        ret = rowRow._orgrow ? rowRow._orgrow[colinfo._index] : rowRow[colinfo._index];
                        if (coltype >= 4 && coltype <= 7)
                            return nexacro._cloneObject(ret);

                        return ret;
                    }

                    return undefined;
                }
            }
            return undefined;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return constvar.value;
            else   //숫자 id
            {
                constvar = this._constVars[col];
                return constvar ? constvar.value : undefined;
            }
        }
    };

    _pDatasetBase.getOrgColumnNF = function (row, col)
    {
        row = row | 0;
        var colinfo = this.colinfos[col];
        var rowRow;
        var constvar;
        var coltype;
        var ret;
        if (colinfo)
        {
            coltype = colinfo.ntype;
            rowRow = this.__getParsedRow(this._rawRecords[row]);
            if (rowRow)
            {
                ret = rowRow._orgrow ? rowRow._orgrow[colinfo._index] : rowRow[colinfo._index];
                if (coltype >= 4 && coltype <= 7)
                    return nexacro._cloneObject(ret);

                return ret;
            }
            return undefined;
        }
        var colidx = (+col);
        if (colidx != col)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
                return constvar.value;
            else
            {
                if (typeof (col) == "string")
                    return undefined;
                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    coltype = colinfo.ntype;
                    rowRow = this.__getParsedRow(this._rawRecords[row]);
                    if (rowRow)
                    {
                        ret = rowRow._orgrow ? rowRow._orgrow[colinfo._index] : rowRow[colinfo._index];
                        if (coltype >= 4 && coltype <= 7)
                            return nexacro._cloneObject(ret);

                        return ret;
                    }
                    return undefined;
                }
            }
            return undefined;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return constvar.value;
            else   //숫자 id
            {
                constvar = this._constVars[col];
                return constvar ? constvar.value : undefined;
            }
        }
    };

    _pDatasetBase.getDeletedColumn = function (row, col)
    {
        row = row | 0;
        var colinfo = this.colinfos[col];
        var rowRow, constvar;
        if (colinfo)
        {
            rowRow = this.__getParsedRow(this._deletedRecords[row]);
            if (rowRow)
            {
                return rowRow[colinfo._index];
            }
            return undefined;
        }
        var colidx = (+col);
        if (colidx != col)  //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
                return constvar.value;
            else
            {
                if (typeof (col) == "string")
                    return undefined;
                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    rowRow = this.__getParsedRow(this._deletedRecords[row]);
                    if (rowRow)
                    {
                        return rowRow[colinfo._index];
                    }
                    return undefined;
                }
            }
            return undefined;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return constvar.value;
            else   //숫자 id
            {
                constvar = this._constVars[col];
                return constvar ? constvar.value : undefined;
            }
        }
    };

    _pDatasetBase.getColumnSet = function (/*row, col, pivotidx*/)
    {
        // Depricated
        return null;
    };

    _pDatasetBase.setConstColumn = function (id, value)
    {
        var constVar = this._constVars[id];
        if (constVar == null || constVar.value === value)
            return false;

        /* 추후 적용필요 : type 변환이 없음 column 과 통일성이 없음
        var coltype = constVar.ntype;
        var fromval = value; //constVar._fromVal(value);
        var oldval = constVar.value;

        // check same val
        if (this._isEqualValue(oldval, fromval, coltype))
            return false;

        
        if (this._isInvalidValue(fromval, coltype))
            return false;
        */

        if (constVar._value)
            constVar._value = undefined;

        if (this._eventstat && ((this.cancolumnchange && this.cancolumnchange._has_handlers) || (this.oncolumnchanged && this.oncolumnchanged._has_handlers) || (this.onvaluechanged && this.onvaluechanged._has_handlers)))
        {
            var evt = new nexacro.DSColChangeEventInfo(this, "cancolumnchange", -1, constVar._index + this.colinfos.length, -1, constVar.id, constVar.value, value);
            if (this.on_fire_cancolumnchange(evt))
            {
                value = evt.newvalue;
                if (value !== constVar.value)
                {
                    constVar.value = value;
                    constVar._value = value;
                    this.on_fire_oncolumnchanged(evt);
                    this.on_fire_onvaluechanged(evt);
                    if (constVar.datapath && this._isTwowayDataobjectBindMode())
                    {
                        //if (this._p_updatecontrol == true)
                        // {
                        //    this._addDirtyindex(-1, "update", null);
                        //}
                        //else
                        this._binddataobject.setDataValue(this._p_dataobjectpath, value, -1, constVar.datapath, this.id);
                    }
                    return true;
                }
            }
            return false;
        }
        else
        {
            constVar.value = value;
            return true;
        }
    };

    _pDatasetBase._updateColumn = function (viewrow, rowRow, colinfo, value)
    {
        var colidx = colinfo._index;
        var coltype = colinfo.ntype;
        var oldVal = rowRow[colidx];

        //if (oldVal === value || rowRow._rtype == 8 || rowRow._rtype == 16) //nexacro.Dataset.ROWTYPE_DELETE, nexacro.Dataset.ROWTYPE_GROUP
        if (oldVal === value || rowRow._rtype == 16 || rowRow._rtype == 32) //nexacro.Dataset.ROWTYPE_GROUP, ROWTYPE_DELETE때도 value 반영
        {
            return false;
        }

        // check invalid val
        if (this._isInvalidValue(value, coltype))
            return false;

        if (this._p_updatecontrol)
        {
            if (rowRow._rtype == 1) //nexacro.Dataset.ROWTYPE_NORMAL
            {
                var orgRow = [];
                this._copyRowData(orgRow, rowRow);
                rowRow._orgrow = orgRow;
                rowRow._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE
            }
            else if (rowRow._rtype == 4)
            {
                if (rowRow._orgrow)
                {
                    var _rtypechange = this._isEqualRow(rowRow._orgrow, rowRow, colidx, value);
                    if (_rtypechange)
                    {
                        rowRow._orgrow.length = 0;
                        delete rowRow._orgrow;
                        rowRow._rtype = 1;
                    }
                }
            }
        }

        rowRow[colidx] = value;
        if (viewrow >= 0)
            this._updateGroupRowData(viewrow);

        return true;
    };

    _pDatasetBase._setColumn = function (row, rowRow, colinfo, value, fail)
    {
        var coltype = colinfo.ntype;
        var fromval = colinfo._fromVal(value);
        var oldval = rowRow[colinfo._index];

        // check same val
        if (this._isEqualValue(oldval, fromval, coltype))
            return false;

        // check invalid val
        if (this._isInvalidValue(fromval, coltype))
            return false;

        if (row >= 0 && this._eventstat && ((this.cancolumnchange && this.cancolumnchange._has_handlers) ||
            (this.oncolumnchanged && this.oncolumnchanged._has_handlers) ||
            (this.onvaluechanged && this.onvaluechanged._has_handlers)))
        {
            var evt = new nexacro.DSColChangeEventInfo(this, "cancolumnchange", row, colinfo._index, -1, colinfo.id, oldval, fromval);
            if ((this.cancolumnchange && this.cancolumnchange._has_handlers))
            {
                if (this.on_fire_cancolumnchange(evt))
                {
                    fromval = colinfo._fromVal(evt.newvalue);
                    if (this._updateColumn(row, rowRow, colinfo, fromval))
                    {
                        evt.newvalue = fromval;
                        this.on_fire_oncolumnchanged(evt);
                        this.on_fire_onvaluechanged(evt);
                        if (this._isTwowayDataobjectBindMode())
                        {
                            if (this._p_updatecontrol)
                                this._addDirtyindex(rowRow._rawidx, "update", rowRow);
                            else
                            {
                                //var colinfos = this.colinfos;
                                this._binddataobject.setDataValue(this._p_dataobjectpath, value, rowRow._rawidx, this._getPathFromColinfo(colinfo), this.id);
                            }
                        }

                        return true;
                    }
                }
                else
                {
                    if (fail)
                        fail.status = "cancolumnchange";
                }
            }
            else
            {
                if (this._updateColumn(row, rowRow, colinfo, fromval))
                {
                    evt.newvalue = fromval;
                    this.on_fire_oncolumnchanged(evt);
                    this.on_fire_onvaluechanged(evt);

                    if (this._isTwowayDataobjectBindMode())
                    {
                        if (this._p_updatecontrol)
                            this._addDirtyindex(rowRow._rawidx, "update", rowRow);
                        else
                        {
                            //var colinfos = this.colinfos;
                            this._binddataobject.setDataValue(this._p_dataobjectpath, value, rowRow._rawidx, this._getPathFromColinfo(colinfo), this.id);
                        }
                    }
                    return true;
                }
            }
        }
        else
        {
            this._updateColumn(row, rowRow, colinfo, fromval);
            return true;
        }
        return false;
    };


    /*fail : 노출 스펙 아님, grid 나 일반 컴포넌트에서 fail 원인을 알 필요가 있어서 추가함 */

    _pDatasetBase.setColumn = function (row, col, value)
    {
        row = row | 0;
        var rowRow, constvar;
        if (row < 0 || row >= this._p_rowcount)
        {
            return false;
        }

        var fail = arguments[3];
        var colinfo = this.colinfos[col];

        if (colinfo)
        {
            rowRow = this.__getParsedRow(this._viewRecords[row]);
            if (rowRow)
                return this._setColumn(row, rowRow, colinfo, value, fail);
        }

        var colidx = (+col);
        if (colidx != col)    //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
                return this.setConstColumn(col, value);
            else  //undefined, null 은 index 0 으로 처리
            {
                if (typeof (col) == "string")
                    return false;

                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    rowRow = this.__getParsedRow(this._viewRecords[row]);
                    if (rowRow)
                        return this._setColumn(row, rowRow, colinfo, value, fail);
                }
            }
            return false;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return this.setConstColumn(colidx - this.colinfos.length, value);
            else //숫자 id
            {
                return this.setConstColumn(col, value);
            }
        }
    };

    _pDatasetBase.setColumnNF = function (row, col, value)
    {
        row = row | 0;
        var rowRow, constvar, newrow;
        if (row < 0 || row >= this._rawRecords.length)
        {
            return false;
        }

        var colinfo = this.colinfos[col];
        if (colinfo)
        {
            rowRow = this.__getParsedRow(this._rawRecords[row]);
            if (rowRow)
            {
                if (this._viewRecords != this._rawRecords)
                {
                    newrow = this._viewRecords.indexOf(rowRow);
                    if (newrow >= 0)
                    {
                        return this._setColumn(newrow, rowRow, colinfo, value, null);
                    }
                    else
                    {
                        return this._updateColumn(newrow, rowRow, colinfo, colinfo._fromVal(value));
                    }
                }
                else
                {
                    return this._setColumn(row, rowRow, colinfo, value, null);
                }
            }
        }

        var colidx = (+col);
        if (colidx != col)    //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constvar = this._constVars[col];
            if (constvar)
                return this.setConstColumn(col, value);
            else  //undefined, null 은 index 0 으로 처리
            {
                if (typeof (col) == "string")
                    return false;
                colinfo = this.colinfos[0];
                if (colinfo)
                {
                    rowRow = this.__getParsedRow(this._rawRecords[row]);
                    if (rowRow)
                    {
                        if (this._viewRecords != this._rawRecords)
                        {
                            newrow = this._viewRecords.indexOf(rowRow);
                            if (newrow >= 0)
                            {
                                return this._setColumn(newrow, rowRow, colinfo, value, null);
                            }
                            else
                            {
                                return this._updateColumn(newrow, rowRow, colinfo, colinfo._fromVal(value));
                            }
                        }
                        else
                        {
                            return this._setColumn(row, rowRow, colinfo, value, null);
                        }
                    }
                }
            }
            return false;
        }
        else
        {
            constvar = this._constVars[colidx - this.colinfos.length];
            if (constvar)
                return this.setConstColumn(colidx - this.colinfos.length, value);
            else //숫자 id
            {
                return this.setConstColumn(col, value);
            }
        }
    };

    //===================================================================
    _pDatasetBase._copyConstColList = function (constVars)
    {
        var cnt = 0;
        if (constVars._type_name == "VariableList" && constVars.length > 0)
        {
            function __copyConstColList_loopFn(i)
            {
                var varinfo = constVars[i];
                if ((varinfo.id in this.colinfos) || (varinfo.id in this._constVars))
                {
                    return;
                }

                this._constVars.add(varinfo.id, new nexacro.Variable(varinfo.id, varinfo.value, varinfo.type, varinfo.ntype, varinfo.size, this._constVars.length));
                cnt++;
            }
            nexacro.__forLoop(this, 0, constVars.length, __copyConstColList_loopFn);

            if (cnt > 0)
            {
                this.count += cnt;
                this._p_constcount += cnt;
            }
        }
        return cnt;
    };

    _pDatasetBase._appendConstColList = function (constVars, chkcol)
    {
        if (constVars._type_name == "VariableList")
        {
            var constList = this._constVars;

            var cnt = 0;
            if (chkcol)
            {
                function __appendConstColList_chkcol_loopFn(i)
                {
                    var id = constList.get_id(i);
                    var srcidx = constVars.indexOf(id);

                    if (srcidx != null)
                    {
                        var varinfo = constVars[srcidx];
                        constList.set_item(i, new nexacro.Variable(varinfo.id, varinfo.value, varinfo.type, varinfo.ntype, varinfo.size, constList.length));
                        cnt++;
                    }
                }
                nexacro.__forLoop(this, 0, constList.length, __appendConstColList_chkcol_loopFn);
            }
            else
            {
                var mincount = Math.min(constList.length, constVars.length);
                function __appendConstColList_loopFn(i)
                {
                    constList.set_item(i, constVars[i]);
                    cnt++;
                }
                nexacro.__forLoop(this, 0, mincount, __appendConstColList_loopFn);
            }
            return cnt;
        }
        return 0;
    };



    _pDatasetBase._copyRowList = function (srcds, srcRecords)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;

        var cnt = 0;
        var is_updatecontrol = this._p_updatecontrol;
        function __copyRowList_loopFn(i)
        {
            var srcRow = srcRecords[i];   //lazy data를 그대로 적용

            //var level = srcRow._level;
            //var rtype = srcRow._rtype;

            if ((srcRow._level == 0) && (srcRow._rtype & 7))
            {
                var rowRow = [];
                rowRow._level = 0;
                rowRow._rawidx = rawRecords.length;
                rowRow._rtype = 1; // nexacro.Dataset.ROWTYPE_NORMAL

                if (srcRow && srcRow._data)
                    rowRow._data = srcRow._data;
                else
                    this._copyRowData(rowRow, srcRow);

                if (viewRecords != rawRecords)
                {
                    viewRecords[viewRecords.length] = rowRow;
                }
                var idx = rawRecords.length;
                rawRecords[idx] = rowRow;
                if (this._isTwowayDataobjectBindMode())
                {
                    if (is_updatecontrol)
                        this._addDirtyindex(idx, "add", rowRow);
                    else
                    {
                        if (this._binddataobject)
                            this._binddataobject.addDataInPath(this._p_dataobjectpath, this._rowToData(rowRow), idx, this.id);
                    }
                }

                cnt++;
            }
        }
        nexacro.__forLoop(this, 0, srcRecords.length, __copyRowList_loopFn);
        return cnt;
    };



    _pDatasetBase._appendRowList = function (srcds, chkcol)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var srcRecords = srcds._viewRecords;

        var idx_map = null;
        if (chkcol == true || chkcol == "true")
            idx_map = this._makeIndexMap(srcds);

        var cnt = 0;
        //var len = srcRecords.length;
        var is_updatecontrol = this._p_updatecontrol;
        function __appendRowList_loopFn(i)
        {
            var srcRow = srcds.__getParsedRow(srcRecords[i]);
            if ((srcRow._level == 0) && (srcRow._rtype & 7))
            {
                var rowRow = [];
                rowRow._level = 0;
                rowRow._rawidx = rawRecords.length;
                rowRow._rtype = 1; // nexacro.Dataset.ROWTYPE_NORMAL

                if (idx_map)
                {
                    this._copyMappingRowData(rowRow, srcRow, idx_map);
                }
                else
                {
                    this._copyConvRowData(rowRow, srcRow);
                }

                if (viewRecords != rawRecords)
                {
                    viewRecords[viewRecords.length] = rowRow;
                }
                var index = rawRecords.length;
                rawRecords[index] = rowRow;

                if (this._isTwowayDataobjectBindMode())
                {
                    if (is_updatecontrol)
                        this._addDirtyindex(index, "add", rowRow);
                    else
                    {
                        if (this._binddataobject)
                            this._binddataobject.addDataInPath(this._p_dataobjectpath, null, index, this.id);
                    }
                }
                cnt++;
            }
        }
        nexacro.__forLoop(this, 0, srcRecords.length, __appendRowList_loopFn);
        return cnt;
    };

    _pDatasetBase._copyData = function (srcds, isFiltered)
    {
        if (this._p_name == undefined) this.id = this._p_name = srcds.id;

        this._copyConstColList(srcds._constVars);
        this._appendColList(srcds.colinfos);

        if (isFiltered == true)
        {
            if (srcds._viewRecords.length > 0)
            {
                this._copyRowList(srcds, srcds._viewRecords, true);
            }
        }
        else
        {
            if (srcds._rawRecords.length > 0)
            {
                this._copyRowList(srcds, srcds._rawRecords, true);
            }
        }

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;
    };

    _pDatasetBase._appendData = function (srcds, chkcol, bupdateconst)
    {
        if (this._p_colcount == 0)
        {
            this._appendColList(srcds.colinfos);

            if (bupdateconst == true && srcds._constVars.length > 0)
            {
                this._copyConstColList(srcds._constVars);
            }
        }
        else
        {
            if (bupdateconst == true && srcds._constVars.length > 0)
            {
                this._appendConstColList(srcds._constVars, chkcol);
            }
        }

        if (srcds._viewRecords.length > 0)
        {
            this._appendRowList(srcds, chkcol);
        }

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;
    };

    _pDatasetBase.copyRow = function (torow, srcds, fromrow, strcolinfo)
    {
        if (srcds == null)
        {
            return false;
        }

        torow = torow | 0;
        fromrow = fromrow | 0;

        if (torow < 0 || torow >= this._p_rowcount)
        {
            return false;
        }

        //if (srcds._type_name != "Dataset")
        if (srcds._isDataset && !srcds._isDataset())
        {
            return false;
        }
        if (fromrow < 0 || fromrow >= srcds.rowcount)
        {
            return false;
        }

        var destRow = this._viewRecords[torow];

        var srcRow = srcds.__getParsedRow(srcds._viewRecords[fromrow]);
        if (destRow && srcRow)
        {
            var idx_map = this._makeIndexMap(srcds, strcolinfo);
            if (idx_map)
            {

                this._copyMappingRowDataRowType(destRow, srcRow, idx_map, torow);

                if (this._eventstat && ((this.oncolumnchanged && this.oncolumnchanged._has_handlers) || (this.onvaluechanged && this.onvaluechanged._has_handlers)))
                {
                    var evt = new nexacro.DSColChangeEventInfo(this, "oncolumnchanged", torow, -1, -1, "", undefined, "");
                    this.on_fire_oncolumnchanged(evt);
                    this.on_fire_onvaluechanged(evt);
                    if (this._isTwowayDataobjectBindMode())
                    {
                        if (this._p_updatecontrol)
                        {
                            this._addDirtyindex(torow, "update", destRow);
                        }
                        else
                        {
                            this._binddataobject.setDataInPath(this._p_dataobjectpath, this._rowToData(destRow), torow, this.id);
                        }
                    }
                }
                return true;
            }
        }
        return false;
    };

    _pDatasetBase.copyData = function (srcds, isFiltered)
    {

        //if (!srcds || srcds._type_name != "Dataset")
        if (!srcds || (srcds._isDataset && !srcds._isDataset()))
        {
            return -1;
        }
        isFiltered = nexacro._toBoolean(isFiltered);

        var bFilter = (this._p_filterstr == null || this._p_filterstr == "") ? false : true;
        var bSortGroup = (this._p_keystring == "" || this._p_keystring == "S:" || this._p_keystring == "G:") ? false : true;

        var oldpos = this._p_rowposition;

        this._clearAll();
        this._copyData(srcds, isFiltered);

        var lazyParsing = srcds.lazyParsing;
        if (lazyParsing)
        {
            this.lazyParsing = lazyParsing;
            this.__loadConvertFn = srcds.__loadConvertFn;
            this.__lazyParseRecordFn = srcds.__lazyParseRecordFn;
        }

        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bFilter)
        {
            this._filterFn = null;
        }
        if (bSortGroup)
        {
            this._deleteAllGroupData();
            this._clearKeyCols();
        }

        if (bFilter)
            this._reFilter();
        if (bSortGroup)
            this._resetSortGroup();

        if (this._eventstat)
        {
            this.on_fire_onrowsetchanged(-1, this._p_rowcount, 11); // nexacro.Dataset.REASON_COPY
        }

        if (oldpos == this._p_rowposition)
        {
            if (this._p_rowcount > 0)
            {
                if (oldpos != 0)
                {
                    this._setRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE
                }
                else if (this.id != srcds.id)
                {
                    this._p_rowposition = -1;
                    this._setRowPosition(oldpos, 53); //nexacro.Dataset.REASON_ROWOBJECTCHANGE
                }
                else
                {
                    if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                    {
                        var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", 0, -1, -1, "", undefined, undefined);
                        this.on_fire_onvaluechanged(evt);
                    }
                }
            }
            else if (oldpos > -1)
            {
                this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
            }
        }

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return this._p_rowcount;
    };

    _pDatasetBase._mergeData = function (srcds)
    {
        var idx_map = this._makeIndexMap(srcds);
        if (idx_map == null)
            return 0;

        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var srcRecords = srcds._rawRecords;

        var cnt = 0;
        var is_updatecontrol = this._p_updatecontrol;
        function __mergeData_loopFn(i)
        {
            var srcRow = srcds.__getParsedRow(srcRecords[i]);
            if ((srcRow._level == 0) && (srcRow._rtype & 7))
            {
                var rowRow = [];
                rowRow._level = 0;
                rowRow._rawidx = rawRecords.length;
                rowRow._rtype = 1; // nexacro.Dataset.ROWTYPE_NORMAL
                this._copyMappingRowData(rowRow, srcRow, idx_map);

                if (viewRecords != rawRecords)
                {
                    viewRecords[viewRecords.length] = rowRow;
                }
                var idx = rawRecords.length;
                rawRecords[idx] = rowRow;
                if (this._isTwowayDataobjectBindMode())
                {
                    if (is_updatecontrol)
                        this._addDirtyindex(idx, "add", rowRow);
                    else
                    {
                        if (this._binddataobject)
                            this._binddataobject.addDataInPath(this._p_dataobjectpath, null, idx, this.id);
                    }
                }
                cnt++;
            }
        }
        nexacro.__forLoop(this, 0, srcRecords.length, __mergeData_loopFn);
        if (cnt > 0)
        {
            this._p_rowcount += cnt;
        }
        return cnt;
    };

    _pDatasetBase.mergeData = function (srcds)
    {

        if (!srcds || (srcds._isDataset && !srcds._isDataset()))
            return -1;

        var cnt = 0;

        if (srcds._rawRecords.length > 0)
        {
            var oldloadstatus = this.loadstatus;
            this.loadstatus = true;
            this._eventstat = false;

            cnt = this._mergeData(srcds);

            this.loadstatus = oldloadstatus;
            this._eventstat = !this.loadstatus && this._p_enableevent;
            if (this._eventstat)
            {
                var oldpos = this._p_rowposition;
                this.on_fire_onrowsetchanged(-1, cnt, 13); // nexacro.Dataset.REASON_MERGE
                if (oldpos == this._p_rowposition && oldpos == -1 && cnt > 0)
                {
                    this._setRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE
                }
            }
        }

        return this._p_rowcount;
    };

    _pDatasetBase.appendData = function (srcds, chkcol, bupdateconst)
    {
        //if ((srcds instanceof nexacro.DatasetBase) == false) return -1;
        //if (!srcds || srcds._type_name != "Dataset") return -1;
        if (!srcds || (srcds._isDataset && !srcds._isDataset()))
            return -1;

        if (srcds._viewRecords.length > 0)
        {
            var oldloadstatus = this.loadstatus;
            this.loadstatus = true;
            this._eventstat = !this.loadstatus && this._p_enableevent;

            this._appendData(srcds, chkcol, bupdateconst);

            this.loadstatus = oldloadstatus;
            this._eventstat = !this.loadstatus && this._p_enableevent;
            var oldpos = this._p_rowposition;
            if (this._eventstat)
                this.on_fire_onrowsetchanged(-1, this._p_rowcount, 12); // nexacro.Dataset.REASON_APPEND

            if (oldpos == this._p_rowposition && oldpos == -1 && this._p_rowcount > 0)
            {
                this._setRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE
            }

            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            return this._p_rowcount;
        }

        return 0;
    };

    _pDatasetBase.applyChange = function ()
    {
        var rawRecords = this._rawRecords;
        var delcnt = 0;
        if (this.binddataobject)
            this._refreshDirty();

        function applyChange_loop(i)
        {
            if (i >= 0)
            {
                var rowRow = rawRecords[i];
                if (rowRow._rtype == 0 || rowRow._rtype == 8 || rowRow._rtype == 16 || rowRow._rtype == 32) // nexacro.Dataset.ROWTYPE_EMPTY, nexacro.Dataset.ROWTYPE_DELETE
                {
                    rawRecords.splice(i, 1);
                    rowRow.length = 0;
                    delcnt++;
                }
                else
                {
                    rowRow._rtype = 1; // nexacro.Dataset.ROWTYPE_NORMAL
                    if (rowRow._orgrow)
                    {
                        rowRow._orgrow.length = 0;
                        delete rowRow._orgrow;
                    }
                    else if (rowRow._orgdata)
                    {
                        delete rowRow._orgdata;
                    }
                }
                i--;
                return false;
            }
            return true;
        }
        nexacro.__reverseForLoop(this, rawRecords.length - 1, 0, applyChange_loop);

        if (this._deletedRecords)
            this._clearRecordData(this._deletedRecords);

        if (delcnt > 0)
        {
            this._adjustRawIdx(0, rawRecords.length);
        }

        if (this._p_enableevent)
        {
            this.on_fire_onrowsetchanged(-1, rawRecords.length, 40); //nexacro.Dataset.REASON_CHANGESTATUS
        }
    };

    _pDatasetBase.reset = function ()
    {
        this.loadstatus = true;
        this._eventstat = this._p_enableevent;

        //var oldpos = this._p_rowposition;

        var rawRecords = this._rawRecords;
        //var len = rawRecords.length;
        //var i = len - 1;
        var b_sort = false;

        function __reset_loopFn(i)
        {
            var rowRow = rawRecords[i];
            if (rowRow._rtype == 0 || rowRow._rtype == 2 || rowRow._rtype == 16 || rowRow._rtype == 32) // nexacro.Dataset.ROWTYPE_EMPTY, nexacro.Dataset.ROWTYPE_INSERT
            {
                rawRecords.splice(i, 1);
                b_sort = true;
            }
            else if (rowRow._rtype == 4)
            {
                rowRow._rtype = 1; // nexacro.Dataset.ROWTYPE_NORMAL
                if (rowRow._orgrow)
                {
                    this._copyRowData(rowRow, rowRow._orgrow);
                    rowRow._orgrow.length = 0;
                    delete rowRow._orgrow;
                }
                else if (rowRow._orgdata)
                {
                    rowRow._data = rowRow._orgdata;
                    delete rowRow._orgdata;
                }
            }
            else if (rowRow._rtype == 8) // nexacro.Dataset.ROWTYPE_DELETE
            {
                rowRow._rtype = 1; // nexacro.Dataset.ROWTYPE_NORMAL
            }/*
            else if (rowRow._rtype == 16) // nexacro.Dataset.ROWTYPE_GROUP
            {
                rawRecords.splice(i, 1);
                b_sort = true;
            }*/
        }
        nexacro.__reverseForLoop(this, rawRecords.length - 1, 0, __reset_loopFn);

        // recover deleted records
        var delRecords = this._deletedRecords;
        if (delRecords.length > 0)
        {
            function __reset_del_loopFn(i)
            {
                delRecords[i]._rtype = 1;
                rawRecords[rawRecords.length] = delRecords[i];
            }
            nexacro.__reverseForLoop(this, delRecords.length - 1, 0, __reset_del_loopFn);
            delRecords.splice(0, delRecords.length);
            b_sort = true;
        }

        if (b_sort)
        {
            // sort by orgidx
            rawRecords.sort(function (a, b) { return (a._orgidx - b._orgidx); });
            this._adjustRawIdx(0, rawRecords.length);
        }

        if (this._viewRecords != this._rawRecords)
        {
            this._viewRecords.length = 0;
        }
        this._viewRecords = this._rawRecords;

        this._reFilter();

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        this._p_rowcount = this._viewRecords.length;
        if (this._eventstat)
        {
            this._bWorkingstatus = true;
            this.on_fire_onload(0, "", 2); // nexacro.Dataset.REASON_RESET

            if (this._p_rowposition >= this._p_rowcount && this._p_rowcount > 0)
            {
                this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
            }
            else
            {
                this._forcesetRowPosition(this._p_rowposition, 51); //nexacro.Dataset.REASON_ROWCHANGE;
            }
            this._bWorkingstatus = false;
        }
    };

    _pDatasetBase._assignRowList = function (srcds, srcRecords)
    {
        var cnt = 0;

        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        //var i = 0;
        //var len = srcRecords.length;
        function __assignRowList_loopFn(i)
        {
            var srcRow = srcds.__getParsedRow(srcRecords[i]);
            var rowRow;
            if (srcRow._level == 0)
            {
                if (srcRow._rtype & 7)
                {
                    rowRow = [];
                    rowRow._level = 0;
                    rowRow._rawidx = rawRecords.length;
                    rowRow._rtype = srcRow._rtype;
                    this._copyRowData(rowRow, srcRow);
                    if (srcRow._orgrow)
                    {
                        var srcOrgRow = srcRow._orgrow;
                        var orgRow = [];
                        this._copyRowData(orgRow, srcOrgRow);
                        rowRow._orgrow = orgRow;
                    }

                    if (viewRecords != rawRecords)
                    {
                        viewRecords[viewRecords.length] = rowRow;
                    }
                    rawRecords[rawRecords.length] = rowRow;
                    cnt++;
                }
                else if (srcRow._rtype == 8)
                {
                    rowRow = [];
                    rowRow._level = 0;
                    rowRow._rawidx = -1;
                    rowRow._rtype = 8;
                    this._copyRowData(rowRow, srcRow);
                    delRecords[delRecords.length] = rowRow;
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, 0, srcRecords.length, __assignRowList_loopFn);
        return cnt;
    };

    _pDatasetBase._assign = function (srcds)
    {
        this._copyConstColList(srcds._constVars);
        this._appendColList(srcds.colinfos);
        this._assignRowList(srcds, srcds._rawRecords);
        if (srcds._deletedRecords.length)
        {
            this._assignRowList(srcds, srcds._deletedRecords);
        }

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;
    };

    _pDatasetBase.assign = function (srcds)
    {

        if (!srcds || (srcds._isDataset && !srcds._isDataset()))
        {
            return -1;
        }

        this._eventstat = this._p_enableevent;
        var oldpos = this._p_rowposition;

        this._clearAll();

        this._assign(srcds);

        if (this._p_filterstr) this.filter(this._p_filterstr);
        if (this._p_keystring) this.on_apply_keystring();

        if (this._eventstat)
        {
            this.on_fire_onrowsetchanged(-1, this._p_rowcount, 10); // nexacro.Dataset.REASON_ASSIGN
        }

        if (oldpos == this._p_rowposition)
        {
            if (this._p_rowcount > 0)
            {
                if (oldpos != 0)
                {
                    this._setRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE
                }
                else if (this.id != srcds.id)
                {
                    this._p_rowposition = -1;
                    this._setRowPosition(oldpos, 53); // nexacro.Dataset.REASON_ROWOBJECTCHANGE
                }
                else
                {
                    if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                    {
                        var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", 0, -1, -1, "", undefined, undefined);
                        this.on_fire_onvaluechanged(evt);
                    }
                }
            }
            else if (oldpos > -1)
            {
                this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
            }
        }

        return this._p_rowcount;
    };

    //==================================================================
    _pDatasetBase._identifyExpr = function (expr)
    {
        if (typeof (expr) != "string")
        {
            return expr;
        }
        var ex = expr.substr(0, 4).toUpperCase();
        if (ex == "EXPR" || ex == "BIND")
        {
            var exp = expr.substr(4).trim();
            if (/^expr(\s*):|^bind(\s*):/.test(expr))
            {
                expr = exp.substr(1);
            }
            else
            {
                expr = exp.substring(1, exp.length - 1);
            }

            var exprfn = this._exprFuncs[expr];
            if (exprfn == null)
            {
                exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
            }
            if (typeof exprfn == "function")
            {
                expr = exprfn.call(null, this._p_rowposition, this._p_rowposition, this, this, this._viewRecords, this._viewRecords[this._p_rowposition], []);
            }
        }
        return expr;
    };

    _pDatasetBase._findRowColValue = function (records, colidx, cmpval, start, end)
    {
        var colinfo = this.colinfos[colidx];
        if (!colinfo)
            return -1;

        cmpval = colinfo._fromVal(cmpval);
        function __findRowColValue_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 7)
            {
                if (this._isEqualValue(rowRow[colidx], cmpval, colinfo.ntype))
                {
                    return true;
                }
            }
        }
        end = end > records.length ? records.length : end;
        var idx = nexacro.__forLoop(this, start, end, __findRowColValue_loopFn);
        return (idx < end) ? idx : -1;
    };

    /* '$+idx'에서 치환된 Column 내 첫번째로 일치하는 column value의 row 값 찾기 */
    _pDatasetBase._findRowValueArgs = function (records, exprfn, cmpval, start, end, args)
    {
        function __findRowValueArgs_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                var colinfo = this.colinfos[val];
                if (colinfo)
                {
                    cmpval = colinfo._fromVal(cmpval);
                    if (this._isEqualValue(rowRow[colinfo._index], cmpval, colinfo.ntype))
                    {
                        return true;
                    }
                }
            }
        }
        end = end > records.length ? records.length : end;
        var idx = nexacro.__forLoop(this, start, end, __findRowValueArgs_loopFn);
        return (idx < end) ? idx : -1;
    };

    _pDatasetBase._findRowExpr = function (records, exprfn, start, end, args)
    {
        function __findRowExpr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                if (val)
                {
                    return true;
                }
            }
        }
        end = end > records.length ? records.length : end;
        var idx = nexacro.__forLoop(this, start, end, __findRowExpr_loopFn);
        return (idx < end) ? idx : -1;
    };

    _pDatasetBase.findRow = function (expr, cmpval, start, end, args)
    {
        return this._findRow(this._viewRecords, expr, cmpval, start, end, args);
    };

    _pDatasetBase._findRow = function (records, expr, cmpval, start, end, args)
    {
        start = start | 0;
        if (start < 0)
            start = 0;
        end = (end == null) ? records.length : (end | 0);

        if (end < 0 || end > records.length)
        {
            end = records.length;
        }
        if (start >= end)
            return -1;

        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._findRowColValue(records, colinfo._index, cmpval, start, end);
        }

        var colidx = (+expr);
        var constVar;
        if (colidx != expr)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constVar = this._constVars[expr];
            if (constVar)
            {
                return (constVar.value == cmpval) ? start : -1;
            }
            else
            {
                if (typeof (expr) == "string")
                {
                    var exprfn = this._exprFuncs[expr];
                    if (exprfn == null)
                    {
                        exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
                    }
                    if (typeof exprfn != "function" || expr.indexOf("$") == -1)
                    {
                        return -1;
                    }

                    return this._findRowValueArgs(records, exprfn, cmpval, start, end, ((args instanceof Array) ? args : []));
                }

                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                    return this._findRowColValue(records, colinfo._index, cmpval, start, end);
            }
            return -1;
        }
        else
        {
            constVar = this._constVars[colidx - this.colinfos.length];
            if (constVar)
            {
                return (constVar.value == cmpval) ? start : -1;
            }
            else   //숫자 id
            {
                constVar = this._constVars[expr];
                return (constVar && constVar.value == cmpval) ? start : -1;
            }
        }

        //return -1;

        //기존 스펙유지를 위해 삭제
        //var exprfn = this._exprFuncs[expr];
        //if (exprfn == null)
        //{
        //    exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        //}
        //if (typeof exprfn != "function")
        //{
        //    return -1;
        //}

        //return this._findRowExprValue(records, exprfn, cmpval, start, end, ((args instanceof Array) ? args : []));
    };

    _pDatasetBase.findRowNF = function (expr, cmpval, start, end, args)
    {
        return this._findRow(this._rawRecords, expr, cmpval, start, end, args);
    };

    _pDatasetBase.findRowExpr = function (expr, start, end, args)
    {
        var records = this._viewRecords;

        start = start | 0;
        if (start < 0)
            start = 0;
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }
        if (start >= end)
            return -1;

        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return -1;
        }

        return this._findRowExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
    };

    _pDatasetBase.findRowExprNF = function (expr, start, end, args)
    {
        var records = this._rawRecords;

        start = start | 0;
        if (start < 0)
            start = 0;
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        if (start >= end)
            return -1;

        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return -1;
        }

        return this._findRowExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
    };

    _pDatasetBase._findRowAsValue = function (records, colidx, cmpval, start, end)
    {
        var colinfo = this.colinfos[colidx];
        if (!colinfo)
            return -1;

        cmpval = cmpval + "";
        function __findRowAsValue_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 7)
            {
                if (this._isLikeValue(rowRow[colidx], cmpval))
                {
                    return true;
                }
            }
        }
        end = end > records.length ? records.length : end;
        var idx = nexacro.__forLoop(this, start, end, __findRowAsValue_loopFn);
        return (idx < end) ? idx : -1;
    };

    /* '$+idx'에서 치환된 Column 내 첫번째로 시작하는 column value의 row 값 찾기 */
    _pDatasetBase._findRowAsValueArgs = function (records, exprfn, cmpval, start, end, args)
    {
        cmpval = cmpval + "";
        function __findRowAsValueArgs_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                var colinfo = this.colinfos[val];
                if (colinfo)
                {
                    cmpval = colinfo._fromVal(cmpval);
                    if (this._isLikeValue(rowRow[colinfo._index], cmpval))
                    {
                        return true;
                    }
                }
            }
        }
        end = end > records.length ? records.length : end;
        var idx = nexacro.__forLoop(this, start, end, __findRowAsValueArgs_loopFn);
        return (idx < end) ? idx : -1;
    };

    _pDatasetBase._findRowAsExpr = function (records, exprfn, cmpval, start, end, args)
    {
        cmpval = cmpval + "";
        function __findRowAsExpr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                if (this._isLikeValue(val, cmpval))
                {
                    return true;
                }
            }
        }
        end = end > records.length ? records.length : end;
        var idx = nexacro.__forLoop(this, start, end, __findRowAsExpr_loopFn);
        return (idx < end) ? idx : -1;
    };

    _pDatasetBase.findRowAs = function (expr, cmpval, start, end, args)
    {
        return this._findRowAs(this._viewRecords, expr, cmpval, start, end, args);
    };

    _pDatasetBase._findRowAs = function (records, expr, cmpval, start, end, args)
    {
        start = start | 0;
        if (start < 0)
            start = 0;
        end = (end == null) ? records.length : (end | 0);

        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        if (start >= end)
            return -1;

        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._findRowAsValue(records, colinfo._index, cmpval, start, end);
        }

        var colidx = (+expr);
        var constVar;
        if (colidx != expr)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constVar = this._constVars[expr];
            if (constVar)
            {
                if (this._isLikeValue(constVar.value, cmpval))
                {
                    return start;
                }
                else
                {
                    return -1;
                }
            }
            else
            {
                if (typeof (expr) == "string")
                {
                    var exprfn = this._exprFuncs[expr];
                    if (exprfn == null)
                    {
                        exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
                    }

                    if (typeof exprfn != "function" || expr.indexOf("$") == -1)
                    {
                        return -1;
                    }

                    return this._findRowAsValueArgs(records, exprfn, cmpval, start, end, ((args instanceof Array) ? args : []));
                }

                //undefined, null 은 index 0 으로 처리
                colinfo = this.colinfos[0];
                if (colinfo)
                    return this._findRowAsValue(records, colinfo._index, cmpval, start, end);
            }
            return -1;
        }
        else
        {
            constVar = this._constVars[colidx - this.colinfos.length];
            if (constVar)
            {
                if (this._isLikeValue(constVar.value, cmpval))
                {
                    return start;
                }
                else
                {
                    return -1;
                }
            }
            else //숫자 id
            {
                constVar = this._constVars[expr];
                if (constVar)
                {
                    if (this._isLikeValue(constVar.value, cmpval))
                    {
                        return start;
                    }
                    else
                    {
                        return -1;
                    }
                }
            }
        }

        return -1;

        //기존 스펙유지를 위해 삭제
        //var constVar = this._constVars[expr];
        //if (constVar)
        //{
        //    if (this._isLikeValue(constVar.value, cmpval))
        //    {
        //        return start;
        //    }
        //    else
        //    {
        //        return -1;
        //    }
        //}

        //var exprfn = this._exprFuncs[expr];
        //if (exprfn == null)
        //{
        //    exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        //}
        //if (typeof exprfn != "function")
        //{
        //    return -1;
        //}

        //return this._findRowAsExpr(records, exprfn, cmpval, start, end, ((args instanceof Array) ? args : []));
    };

    _pDatasetBase.findRowAsNF = function (expr, cmpval, start, end, args)
    {
        return this._findRowAs(this._rawRecords, expr, cmpval, start, end, args);
    };

    _pDatasetBase.findNFRowIndex = function (row)
    {
        if (this._viewRecords && this._viewRecords[row])
            return this._viewRecords[row]._rawidx;
        return -1;
    };

    //==================================================================
    _pDatasetBase.lookup = function (expr, cmpval, outcol, args)
    {
        expr = this._identifyExpr(expr);
        var row = this.findRow(expr, cmpval, 0, this._viewRecords.length, args);
        return (row == -1) ? undefined : this.getColumn(row, outcol);
    };

    _pDatasetBase.lookupNF = function (expr, cmpval, outcol, args)
    {
        expr = this._identifyExpr(expr);
        var row = this.findRowNF(expr, cmpval, 0, this._rawRecords.length, args);
        return (row < 0) ? undefined : this.getColumnNF(row, outcol);
    };

    _pDatasetBase.lookupAs = function (expr, cmpval, outcol, args)
    {
        expr = this._identifyExpr(expr);
        var row = this._findRowAs(this._viewRecords, expr, cmpval, 0, this._viewRecords.length, args);
        return (row < 0) ? undefined : this.getColumn(row, outcol);
    };

    _pDatasetBase.lookupAsNF = function (expr, cmpval, outcol, args)
    {
        expr = this._identifyExpr(expr);
        var row = this._findRowAs(this._rawRecords, expr, cmpval, 0, this._rawRecords.length, args);
        return (row < 0) ? undefined : this.getColumnNF(row, outcol);
    };



    //==================================================================
    // extract row array : Rows <== this rowset is dataset's internal row data array
    _pDatasetBase._extractRowsExpr = function (records, exprfn, start, end, args)
    {
        var rows = [];
        function __loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                if (val)
                {
                    rows[rows.length] = i;
                }
            }
        }
        nexacro.__forLoop(this, start, end, __loopFn);
        return rows;
    };

    _pDatasetBase.__extractRows = function (records, expr, start, end, args)
    {
        start = start | 0;
        if (start < 0)
            start = 0;
        end = (end == null) ? records.length : (end | 0);

        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        if (start >= end)
            return -1;

        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return -1;
        }

        return this._extractRowsExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.extractRows = function (expr, start, end, args)
    {
        return this.__extractRows(this._viewRecords, expr, start, end, args);
    };
    _pDatasetBase.extractRowsNF = function (expr, start, end, args)
    {
        return this.__extractRows(this._rawRecords, expr, start, end, args);
    };

    //==================================================================
    // count
    _pDatasetBase.__getCount = function (records, expr, start, end, args)
    {
        if (expr !== 0 && !expr)   //getcount 기존 스펙 유지
            return records.length;

        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }


        // isFinite()
        //var val = +expr;
        //if (val == val)
        //{
        //    return (val != null) ? (end - start) : 0;
        //}

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getCountValue(records, colinfo._index, start, end, colinfo.ntype);
        }

        var colidx = (+expr);
        var constVar;
        if (colidx != expr)   //숫자가 아닌 경우(10a, a10, aaa) 인 경우와 undefined, null
        {
            constVar = this._constVars[expr];
            if (constVar)
            {
                return (constVar.value != null) ? (end - start) : 0;
            }
        }
        else
        {
            constVar = this._constVars[colidx - this.colinfos.length];
            if (constVar)
                return (constVar.value != null) ? (end - start) : 0;
            else   //숫자 id
            {
                constVar = this._constVars[expr];
                return (constVar && constVar.value != null) ? (end - start) : 0;
            }
        }

        return 0;

        //기존 스펙유지를 위해 삭제
        //// expr
        //var exprfn = this._exprFuncs[expr];
        //if (exprfn == null)
        //{
        //    exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        //}
        //if (typeof exprfn != "function")
        //{
        //    return 0;
        //}
        //return this._getCountExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getCount = function (expr, start, end, args)
    {
        return this.__getCount(this._viewRecords, expr, start, end, args);
    };
    _pDatasetBase.getCountNF = function (expr, start, end, args)
    {
        return this.__getCount(this._rawRecords, expr, start, end, args);
    };

    _pDatasetBase.__getRowsCount = function (records, rows, expr, args)
    {
        if (!(rows instanceof Array) || rows.length <= 0)
            return 0;

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return rows.length;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getRowsCountValue(records, rows, colinfo._index, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return (constVar.value != null) ? (rows.length) : 0;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }
        return this._getRowsCountExpr(records, rows, exprfn, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getRowsCount = function (rows, expr, args)
    {
        return this.__getRowsCount(this._viewRecords, rows, expr, args);
    };
    _pDatasetBase.getRowsCountNF = function (rows, expr, args)
    {
        return this.__getRowsCount(this._rawRecords, rows, expr, args);
    };

    _pDatasetBase.__getCaseCount = function (records, cmpExpr, start, end, args)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()
        var val = +cmpExpr;
        if (val == val)
        {
            return (val) ? (end - start) : 0;
        }

        // const var
        var constVar = this._constVars[cmpExpr];
        if (constVar)
        {
            return constVar.value ? (end - start) : 0;
        }

        // column
        var colinfo = this.colinfos[cmpExpr];
        if (colinfo)
        {
            return this._getTrueCount(records, colinfo._index, start, end);
        }

        // expr
        var cmpFn = this._exprFuncs[cmpExpr];
        if (cmpFn == null)
        {
            cmpFn = this._exprFuncs[cmpExpr] = this._createExprFunc(cmpExpr);
        }
        if (typeof cmpFn != "function")
        {
            return 0;
        }

        return this._getCaseCount(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getCaseCount = function (cmpExpr, start, end, args)
    {
        return this.__getCaseCount(this._viewRecords, cmpExpr, start, end, args);
    };
    _pDatasetBase.getCaseCountNF = function (cmpExpr, start, end, args)
    {
        return this.__getCaseCount(this._rawRecords, cmpExpr, start, end, args);
    };

    _pDatasetBase.__getTrueCount = function (records, expr, start, end, args)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return (val) ? (end - start) : 0;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getTrueCountValue(records, colinfo._index, start, end);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return (constVar.value) ? (end - start) : 0;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }
        return this._getTrueCountExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getTrueCount = function (expr, start, end, args)
    {
        return this.__getTrueCount(this._viewRecords, expr, start, end, args);
    };
    _pDatasetBase.getTrueCountNF = function (expr, start, end, args)
    {
        return this.__getTrueCount(this._rawRecords, expr, start, end, args);
    };

    _pDatasetBase.__getRowsTrueCount = function (records, rows, expr, args)
    {
        if (!(rows instanceof Array) || rows.length <= 0)
            return 0;

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return (val) ? (rows.length) : 0;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getRowsTrueCountValue(records, rows, colinfo._index);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return (constVar.value) ? (rows.length) : 0;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }
        return this._getRowsTrueCountExpr(records, rows, exprfn, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getRowsTrueCount = function (rows, expr, args)
    {
        return this.__getRowsTrueCount(this._viewRecords, rows, expr, args);
    };
    _pDatasetBase.getRowsTrueCountNF = function (rows, expr, args)
    {
        return this.__getRowsTrueCount(this._rawRecords, rows, expr, args);
    };

    _pDatasetBase._getCountValue = function (records, colidx, start, end, coltype)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getCountExpr = function (records, exprFn, start, end, args)
    {
        var cnt = 0;
        function __Expr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var colval = exprFn.call(this, i, i, null, this, records, rowRow, args);
                if (colval)
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, start, end, __Expr_loopFn);
        return cnt | 0;
    };
    _pDatasetBase._getRowsCountValue = function (records, rows, colidx, coltype)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getRowsCountExpr = function (records, rows, exprFn, args)
    {
        var cnt = 0;
        function __loopFn(i)
        {
            var idx = rows[i];
            var rowRow = this.__getParsedRow(records[idx]);
            if (rowRow && (rowRow._rtype & 15))
            {
                var colval = exprFn.call(this, idx, idx, null, this, records, rowRow, args);
                if (colval)
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, 0, rows.length, __loopFn);
        return cnt | 0;
    };
    _pDatasetBase._getCaseCount = function (records, cmpFn, start, end, args)
    {
        var cnt = 0;

        function __loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                if (cmp)
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, start, end, __loopFn);
        return cnt;
    };
    _pDatasetBase._getTrueCountValue = function (records, colidx, start, end)
    {
        var cnt = 0;
        function __loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 7)
            {
                if (rowRow[colidx])
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, start, end, __loopFn);
        return cnt;
    };
    _pDatasetBase._getTrueCountExpr = function (records, exprFn, start, end, args)
    {
        var cnt = 0;
        function __loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var colval = exprFn.call(this, i, i, null, this, records, rowRow, args);
                if (colval)
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, start, end, __loopFn);
        return cnt | 0;
    };
    _pDatasetBase._getRowsTrueCountValue = function (records, rows, colidx)
    {
        var cnt = 0;
        function __Value_loopFn(i)
        {
            var idx = rows[i];
            var rowRow = this.__getParsedRow(records[idx]);
            if (rowRow && (rowRow._rtype & 7))
            {
                if (rowRow[colidx])
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);
        return cnt;
    };
    _pDatasetBase._getRowsTrueCountExpr = function (records, rows, exprFn, args)
    {
        var cnt = 0;

        function __Expr_loopFn(i)
        {
            var idx = rows[i];
            var rowRow = this.__getParsedRow(records[idx]);
            if (rowRow && (rowRow._rtype & 15))
            {
                var colval = exprFn.call(this, idx, idx, null, this, records, rowRow, args);
                if (colval)
                {
                    cnt++;
                }
            }
        }
        nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);
        return cnt | 0;
    };

    //------------------------------------------------------------------
    // sum
    _pDatasetBase.__getSum = function (records, expr, start, end, args)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val * (end - start);
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getSumValue(records, colinfo._index, start, end, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            val = constVar.value | 0;
            if (val == val)
                return 0;
            return val * (end - start);
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }
        return this._getSumExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getSum = function (expr, start, end, args)
    {
        return this.__getSum(this._viewRecords, expr, start, end, args);
    };
    _pDatasetBase.getSumNF = function (expr, start, end, args)
    {
        return this.__getSum(this._rawRecords, expr, start, end, args);
    };

    _pDatasetBase.__getRowsSum = function (records, rows, expr, args)
    {
        if (!(rows instanceof Array) || rows.length <= 0)
            return 0;

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val * (rows.length);
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getRowsSumValue(records, rows, colinfo._index, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            val = constVar.value | 0;
            if (val == val)
                return 0;
            return val * (rows.length);
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }
        return this._getRowsSumExpr(records, rows, exprfn, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getRowsSum = function (rows, expr, args)
    {
        return this.__getRowsSum(this._viewRecords, rows, expr, args);
    };
    _pDatasetBase.getRowsSumNF = function (rows, expr, args)
    {
        return this.__getRowsSum(this._rawRecords, rows, expr, args);
    };

    _pDatasetBase.__getCaseSum = function (records, cmpExpr, valExpr, start, end, args, valargs)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()  condition
        var val = +cmpExpr;
        if (val == val)
        {
            if (val)
            {
                return this.__getSum(records, valExpr, start, end, valargs);
            }
            return 0;
        }

        // const var  condition
        var constVar = this._constVars[cmpExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                return this.__getSum(records, valExpr, start, end, valargs);
            }
            return 0;
        }

        // column  condition
        var colinfo = this.colinfos[cmpExpr];
        if (colinfo)
        {
            cmpExpr = colinfo.id;
        }

        ///////////////////////////////////
        // expr (include column)  condition
        var cmpFn = this._exprFuncs[cmpExpr];
        if (cmpFn == null)
        {
            cmpFn = this._exprFuncs[cmpExpr] = this._createExprFunc(cmpExpr);
        }
        if (typeof cmpFn != "function")
        {
            return 0;
        }

        // isFinite()  value
        val = +valExpr;
        if (val == val)
        {
            if (val)
            {
                var cnt = this._getCaseCount(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                return val * cnt;
            }
            return 0;
        }

        // const var  value
        constVar = this._constVars[valExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                return constVar.value * this._getCaseCount(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
            }
            return 0;
        }

        // column  value
        colinfo = this.colinfos[valExpr];
        if (colinfo)
        {
            return this._getCaseSumValue(records, cmpFn, colinfo._index, start, end, colinfo.ntype, ((args instanceof Array) ? args : []));
        }

        // expr  value
        var valFn = this._exprFuncs[valExpr];
        if (valFn == null)
        {
            valFn = this._exprFuncs[valExpr] = this._createExprFunc(valExpr);
        }
        if (typeof valFn != "function")
        {
            return 0;
        }

        return this._getCaseSumExpr(records, cmpFn, valFn, start, end, ((args instanceof Array) ? args : []), ((valargs instanceof Array) ? valargs : []));
    };
    _pDatasetBase.getCaseSum = function (cmpExpr, valExpr, start, end, args, valargs)
    {
        return this.__getCaseSum(this._viewRecords, cmpExpr, valExpr, start, end, args, valargs);
    };
    _pDatasetBase.getCaseSumNF = function (cmpExpr, valExpr, start, end, args, valargs)
    {
        return this.__getCaseSum(this._rawRecords, cmpExpr, valExpr, start, end, args, valargs);
    };

    _pDatasetBase._getSumValue = function (records, colidx, start, end, coltype)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getSumExpr = function (records, exprFn, start, end, args)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getRowsSumValue = function (records, rows, colidx, coltype)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getRowsSumExpr = function (records, rows, exprFn, args)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getCaseSumValue = function (records, cmpFn, colidx, start, end, coltype, args)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getCaseSumExpr = function (records, cmpFn, valFn, start, end, cmpargs, valargs)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };

    //------------------------------------------------------------------
    // min
    _pDatasetBase.__getMin = function (records, expr, start, end, args)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getMinValue(records, colinfo._index, start, end, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return constVar.value;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return undefined;
        }

        var min = this._getMinExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
        if (min instanceof nexacro.Decimal)
        {
            return min.isNaN() ? undefined : min;
        }
        var _min = +min;
        return _min != _min ? undefined : min;
    };
    _pDatasetBase.getMin = function (expr, start, end, args)
    {
        return this.__getMin(this._viewRecords, expr, start, end, args);
    };
    _pDatasetBase.getMinNF = function (expr, start, end, args)
    {
        return this.__getMin(this._rawRecords, expr, start, end, args);
    };

    _pDatasetBase.__getRowsMin = function (records, rows, expr, args)
    {
        if (!(rows instanceof Array) || rows.length <= 0)
            return undefined;

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getRowsMinValue(records, rows, colinfo._index, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return constVar.value;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return undefined;
        }

        var min = this._getRowsMinExpr(records, rows, exprfn, ((args instanceof Array) ? args : []));
        if (min instanceof nexacro.Decimal)
        {
            return min.isNaN() ? undefined : min;
        }
        var _min = +min;
        return _min != _min ? undefined : min;
    };
    _pDatasetBase.getRowsMin = function (rows, expr, args)
    {
        return this.__getRowsMin(this._viewRecords, rows, expr, args);
    };
    _pDatasetBase.getRowsMinNF = function (rows, expr, args)
    {
        return this.__getRowsMin(this._rawRecords, rows, expr, args);
    };

    _pDatasetBase.__getCaseMin = function (records, cmpExpr, valExpr, start, end, args, valargs)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()  condition
        var val = +cmpExpr;
        if (val == val)
        {
            if (val)
            {
                return this.__getMin(records, valExpr, start, end, valargs);
            }
            return undefined;
        }

        // const var  condition
        var constVar = this._constVars[cmpExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                return this.__getMin(records, valExpr, start, end, valargs);
            }
            return undefined;
        }

        // column  condition
        var colinfo = this.colinfos[cmpExpr];
        if (colinfo)
        {
            cmpExpr = colinfo.id;
        }

        ///////////////////////////////////
        // expr (include column)  condition
        var cmpFn = this._exprFuncs[cmpExpr];
        if (cmpFn == null)
        {
            cmpFn = this._exprFuncs[cmpExpr] = this._createExprFunc(cmpExpr);
        }
        if (typeof cmpFn != "function")
        {
            return undefined;
        }

        // isFinite()  value
        val = +valExpr;
        var frow;
        if (val == val)
        {
            if (val)
            {
                frow = this._findRowExpr(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                if (frow >= 0)
                    return val;
            }
            return undefined;
        }

        // const var  value
        constVar = this._constVars[valExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                frow = this._findRowExpr(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                if (frow >= 0)
                    return constVar.value;
            }
            return undefined;
        }

        // column  value
        colinfo = this.colinfos[valExpr];
        if (colinfo)
        {
            return this._getCaseMinValue(records, cmpFn, colinfo._index, start, end, colinfo.ntype, ((args instanceof Array) ? args : []));
        }

        // expr  value
        var valFn = this._exprFuncs[valExpr];
        if (valFn == null)
        {
            valFn = this._exprFuncs[valExpr] = this._createExprFunc(valExpr);
        }
        if (typeof valFn != "function")
        {
            return undefined;
        }

        return this._getCaseMinExpr(records, cmpFn, valFn, start, end, ((args instanceof Array) ? args : []), ((valargs instanceof Array) ? valargs : []));
    };
    _pDatasetBase.getCaseMin = function (cmpExpr, valExpr, start, end, args, valargs)
    {
        return this.__getCaseMin(this._viewRecords, cmpExpr, valExpr, start, end, args, valargs);
    };
    _pDatasetBase.getCaseMinNF = function (cmpExpr, valExpr, start, end, args, valargs)
    {
        return this.__getCaseMin(this._rawRecords, cmpExpr, valExpr, start, end, args, valargs);
    };

    _pDatasetBase._getMinValue = function (records, colidx, start, end, coltype)
    {
        var min;
        var colinfo = this.colinfos[colidx];

        if (coltype == 4)
        {
            function __Decimal_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval && colval instanceof nexacro.Decimal)
                    {
                        if (min == null || (colval.hi < min.hi || (colval.hi == min.hi && colval.lo < min.lo)))
                        {
                            min = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Decimal_loopFn);
        }
        else
        {
            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval === 0 || colval)
                    {
                        if (min == null || colval < min)
                        {
                            min = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);
        }
        return min;
    };
    _pDatasetBase._getMinExpr = function (records, exprfn, start, end, args)
    {
        var min = undefined;
        function __Expr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                if (val === 0 || val)
                {
                    if (min == null || this._compareValue(val, min) < 0)
                    {
                        min = val;
                    }
                }
            }
        }
        nexacro.__forLoop(this, start, end, __Expr_loopFn);
        return min;
    };
    _pDatasetBase._getRowsMinValue = function (records, rows, colidx, coltype)
    {
        var min;
        var colinfo = this.colinfos[colidx];

        if (coltype == 4)
        {
            function __Decimal_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval && colval instanceof nexacro.Decimal)
                    {
                        if (min == null || (colval.hi < min.hi || (colval.hi == min.hi && colval.lo < min.lo)))
                        {
                            min = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Decimal_loopFn);
        }
        else
        {
            function __Value_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval === 0 || colval)
                    {
                        if (min == null || colval < min)
                        {
                            min = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);
        }
        return min;
    };
    _pDatasetBase._getRowsMinExpr = function (records, rows, exprfn, args)
    {
        var min;

        function __Expr_loopFn(i)
        {
            var idx = rows[i];
            var rowRow = this.__getParsedRow(records[idx]);
            if (rowRow && (rowRow._rtype & 15))
            {
                var val = exprfn.call(this, idx, idx, null, this, records, rowRow, args);
                if (val === 0 || val)
                {
                    if (min == null || this._compareValue(val, min) < 0)
                    {
                        min = val;
                    }
                }
            }
        }
        nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);
        return min;
    };
    _pDatasetBase._getCaseMinValue = function (records, cmpFn, colidx, start, end, coltype, args)
    {
        var min;
        var colinfo = this.colinfos[colidx];

        if (coltype == 4)
        {
            function __Decimal_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                    if (cmp)
                    {
                        var colval = colinfo._fromVal(rowRow[colidx]);
                        if (colval && colval instanceof nexacro.Decimal)
                        {
                            if (min == null || (colval.hi < min.hi || (colval.hi == min.hi && colval.lo < min.lo)))
                            {
                                min = colval;
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Decimal_loopFn);
        }
        else
        {
            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                    if (cmp)
                    {
                        var colval = colinfo._fromVal(rowRow[colidx]);
                        if (colval === 0 || colval)
                        {
                            if (min == null || colval < min)
                            {
                                min = colval;
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);
        }
        return min;
    };
    _pDatasetBase._getCaseMinExpr = function (records, cmpFn, valFn, start, end, args, valargs)
    {
        var min;

        function __Expr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                if (cmp)
                {
                    var val = valFn.call(this, i, i, null, this, records, rowRow, valargs);
                    if (val === 0 || val)
                    {
                        if (min == null || this._compareValue(val, min) < 0)
                        {
                            min = val;
                        }
                    }
                }
            }
        }
        nexacro.__forLoop(this, start, end, __Expr_loopFn);
        return min;
    };

    //------------------------------------------------------------------
    // max
    _pDatasetBase.__getMax = function (records, expr, start, end, args)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getMaxValue(records, colinfo._index, start, end, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return constVar.value;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return undefined;
        }

        var max = this._getMaxExpr(records, exprfn, start, end, ((args instanceof Array) ? args : []));
        if (max instanceof nexacro.Decimal)
        {
            return max.isNaN() ? undefined : max;
        }
        var _max = +max;
        return _max != _max ? undefined : max;
    };
    _pDatasetBase.getMax = function (expr, start, end, args)
    {
        return this.__getMax(this._viewRecords, expr, start, end, args);
    };
    _pDatasetBase.getMaxNF = function (expr, start, end, args)
    {
        return this.__getMax(this._rawRecords, expr, start, end, args);
    };

    _pDatasetBase.__getRowsMax = function (records, rows, expr, args)
    {
        if (!(rows instanceof Array) || rows.length <= 0)
            return undefined;

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val;
        }

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getRowsMaxValue(records, rows, colinfo._index, colinfo.ntype);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return constVar.value;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return undefined;
        }

        var max = this._getRowsMaxExpr(records, rows, exprfn, ((args instanceof Array) ? args : []));
        if (max instanceof nexacro.Decimal)
        {
            return max.isNaN() ? undefined : max;
        }
        var _max = +max;
        return _max != _max ? undefined : max;
    };
    _pDatasetBase.getRowsMax = function (rows, expr, args)
    {
        return this.__getRowsMax(this._viewRecords, rows, expr, args);
    };
    _pDatasetBase.getRowsMaxNF = function (rows, expr, args)
    {
        return this.__getRowsMax(this._rawRecords, rows, expr, args);
    };

    _pDatasetBase.__getCaseMax = function (records, cmpExpr, valExpr, start, end, args, valargs)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()  condition
        var val = +cmpExpr;
        if (val == val)
        {
            if (val)
            {
                return this.__getMax(records, valExpr, start, end, valargs);
            }
            return undefined;
        }

        // const var  condition
        var constVar = this._constVars[cmpExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                return this.__getMax(records, valExpr, start, end, valargs);
            }
            return undefined;
        }

        // column  condition
        var colinfo = this.colinfos[cmpExpr];
        if (colinfo)
        {
            cmpExpr = colinfo.id;
        }

        ///////////////////////////////////
        // expr (include column)  condition
        var cmpFn = this._exprFuncs[cmpExpr];
        if (cmpFn == null)
        {
            cmpFn = this._exprFuncs[cmpExpr] = this._createExprFunc(cmpExpr);
        }
        if (typeof cmpFn != "function")
        {
            return undefined;
        }

        // isFinite()  value
        var frow;
        val = +valExpr;
        if (val == val)
        {
            if (val)
            {
                frow = this._findRowExpr(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                if (frow >= 0)
                    return val;
            }
            return undefined;
        }

        // const var  value
        constVar = this._constVars[valExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                frow = this._findRowExpr(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                if (frow >= 0)
                    return constVar.value;
            }
            return undefined;
        }

        // column  value
        colinfo = this.colinfos[valExpr];
        if (colinfo)
        {
            return this._getCaseMaxValue(records, cmpFn, colinfo._index, start, end, colinfo.ntype, ((args instanceof Array) ? args : []));
        }

        // expr  value
        var valFn = this._exprFuncs[valExpr];
        if (valFn == null)
        {
            valFn = this._exprFuncs[valExpr] = this._createExprFunc(valExpr);
        }
        if (typeof valFn != "function")
        {
            return undefined;
        }

        return this._getCaseMaxExpr(records, cmpFn, valFn, start, end, ((args instanceof Array) ? args : []), ((valargs instanceof Array) ? valargs : []));
    };
    _pDatasetBase.getCaseMax = function (cmpExpr, valExpr, start, end, args, valargs)
    {
        return this.__getCaseMax(this._viewRecords, cmpExpr, valExpr, start, end, args, valargs);
    };
    _pDatasetBase.getCaseMaxNF = function (cmpExpr, valExpr, start, end, args, valargs)
    {
        return this.__getCaseMax(this._rawRecords, cmpExpr, valExpr, start, end, args, valargs);
    };

    _pDatasetBase._getMaxValue = function (records, colidx, start, end, coltype)
    {
        var max;
        var colinfo = this.colinfos[colidx];

        if (coltype == 4)
        {
            function __Decimal_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval && colval instanceof nexacro.Decimal)
                    {
                        if (max == null || (colval.hi > max.hi || (colval.hi == max.hi && colval.lo > max.lo)))
                        {
                            max = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Decimal_loopFn);
        }
        else
        {
            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 7)
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval === 0 || colval)
                    {
                        if (max == null || colval > max)
                        {
                            max = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);
        }

        return max;
    };
    _pDatasetBase._getMaxExpr = function (records, exprfn, start, end, args)
    {
        var max;

        function __Expr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var val = exprfn.call(this, i, i, null, this, records, rowRow, args);
                if (val === 0 || val)
                {
                    if (max == null || this._compareValue(val, max) > 0)
                    {
                        max = val;
                    }
                }
            }
        }
        nexacro.__forLoop(this, start, end, __Expr_loopFn);
        return max;
    };
    _pDatasetBase._getRowsMaxValue = function (records, rows, colidx, coltype)
    {
        var max;
        var colinfo = this.colinfos[colidx];

        if (coltype == 4)
        {
            function __Decimal_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval && colval instanceof nexacro.Decimal)
                    {
                        if (max == null || (colval.hi > max.hi || (colval.hi == max.hi && colval.lo > max.lo)))
                        {
                            max = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Decimal_loopFn);
        }
        else
        {
            function __Value_loopFn(i)
            {
                var idx = rows[i];
                var rowRow = this.__getParsedRow(records[idx]);
                if (rowRow && (rowRow._rtype & 7))
                {
                    var colval = colinfo._fromVal(rowRow[colidx]);
                    if (colval === 0 || colval)
                    {
                        if (max == null || colval > max)
                        {
                            max = colval;
                        }
                    }
                }
            }
            nexacro.__forLoop(this, 0, rows.length, __Value_loopFn);
        }

        return max;
    };
    _pDatasetBase._getRowsMaxExpr = function (records, rows, exprfn, args)
    {
        var max;

        function __Expr_loopFn(i)
        {
            var idx = rows[i];
            var rowRow = this.__getParsedRow(records[idx]);
            if (rowRow && (rowRow._rtype & 15))
            {
                var val = exprfn.call(this, idx, idx, null, this, records, rowRow, args);
                if (val === 0 || val)
                {
                    if (max == null || this._compareValue(val, max) > 0)
                    {
                        max = val;
                    }
                }
            }
        }
        nexacro.__forLoop(this, 0, rows.length, __Expr_loopFn);
        return max;
    };
    _pDatasetBase._getCaseMaxValue = function (records, cmpFn, colidx, start, end, coltype, args)
    {
        var max;
        var colinfo = this.colinfos[colidx];

        if (coltype == 4)
        {
            function __Decimal_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                    if (cmp)
                    {
                        var colval = colinfo._fromVal(rowRow[colidx]);
                        if (colval && colval instanceof nexacro.Decimal)
                        {
                            if (max == null || (colval.hi > max.hi || (colval.hi == max.hi && colval.lo > max.lo)))
                            {
                                max = colval;
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Decimal_loopFn);
        }
        else
        {
            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                    if (cmp)
                    {
                        var colval = colinfo._fromVal(rowRow[colidx]);
                        if (colval === 0 || colval)
                        {
                            if (max == null || colval > max)
                            {
                                max = colval;
                            }
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);
        }
        return max;
    };
    _pDatasetBase._getCaseMaxExpr = function (records, cmpFn, valFn, start, end, args, valargs)
    {
        var max;

        function __Expr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                if (cmp)
                {
                    var colval = valFn.call(this, i, i, null, this, records, rowRow, valargs);
                    if (colval === 0 || colval)
                    {
                        if (max == null || this._compareValue(colval, max) > 0)
                        {
                            max = colval;
                        }
                    }
                }
            }
        }
        nexacro.__forLoop(this, start, end, __Expr_loopFn);
        return max;
    };

    //------------------------------------------------------------------
    // avg
    _pDatasetBase.__getAvg = function (records, expr, start, end, excludeNaN, args)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val;
        }

        //default excludeNaN : false 로 동작 -> true 로 변경
        excludeNaN = nexacro._toBoolean(excludeNaN);

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getAvgValue(records, colinfo._index, start, end, colinfo.ntype, excludeNaN);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return constVar.value;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }

        return this._getAvgExpr(records, exprfn, start, end, excludeNaN, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getAvg = function (expr, start, end, excludeNaN, args)
    {
        return this.__getAvg(this._viewRecords, expr, start, end, ((excludeNaN || excludeNaN === false) ? excludeNaN : true), args);
    };
    _pDatasetBase.getAvgNF = function (expr, start, end, excludeNaN, args)
    {
        return this.__getAvg(this._rawRecords, expr, start, end, ((excludeNaN || excludeNaN === false) ? excludeNaN : true), args);
    };

    _pDatasetBase.__getRowsAvg = function (records, rows, expr, excludeNaN, args)
    {
        if (!(rows instanceof Array) || rows.length <= 0)
            return 0;

        // isFinite()
        var val = +expr;
        if (val == val)
        {
            return val;
        }

        //default excludeNaN : false 로 동작 ==> true로 변경
        excludeNaN = nexacro._toBoolean(excludeNaN);

        // column
        var colinfo = this.colinfos[expr];
        if (colinfo)
        {
            return this._getRowsAvgValue(records, rows, colinfo._index, colinfo.ntype, excludeNaN);
        }
        var constVar = this._constVars[expr];
        if (constVar)
        {
            return constVar.value;
        }

        // expr
        var exprfn = this._exprFuncs[expr];
        if (exprfn == null)
        {
            exprfn = this._exprFuncs[expr] = this._createExprFunc(expr);
        }
        if (typeof exprfn != "function")
        {
            return 0;
        }

        return this._getRowsAvgExpr(records, rows, exprfn, excludeNaN, ((args instanceof Array) ? args : []));
    };
    _pDatasetBase.getRowsAvg = function (rows, expr, excludeNaN, args)
    {
        return this.__getRowsAvg(this._viewRecords, rows, expr, ((excludeNaN || excludeNaN === false) ? excludeNaN : true), args);
    };
    _pDatasetBase.getRowsAvgNF = function (rows, expr, excludeNaN, args)
    {
        return this.__getRowsAvg(this._rawRecords, rows, expr, ((excludeNaN || excludeNaN === false) ? excludeNaN : true), args);
    };

    _pDatasetBase.__getCaseAvg = function (records, cmpExpr, valExpr, start, end, excludeNaN, args, valargs)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        //default excludeNaN : false 로 동작
        excludeNaN = nexacro._toBoolean(excludeNaN);

        // isFinite()  condition
        var val = +cmpExpr;
        if (val == val)
        {
            if (val)
            {
                return this.__getAvg(records, valExpr, start, end, excludeNaN, valargs);
            }
            return NaN;
        }

        // const var  condition
        var constVar = this._constVars[cmpExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                return this.__getAvg(records, valExpr, start, end, excludeNaN, valargs);
            }
            return NaN;
        }

        // column  condition
        var colinfo = this.colinfos[cmpExpr];
        if (colinfo)
        {
            cmpExpr = colinfo.id;
        }

        ///////////////////////////////////
        // expr (include column)  condition
        var cmpFn = this._exprFuncs[cmpExpr];
        if (cmpFn == null)
        {
            cmpFn = this._exprFuncs[cmpExpr] = this._createExprFunc(cmpExpr);
        }
        if (typeof cmpFn != "function")
        {
            return NaN;
        }

        // isFinite()  value
        var frow;
        val = +valExpr;
        if (val == val)
        {
            if (val)
            {
                frow = this._findRowExpr(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                if (frow >= 0)
                    return val;
            }
            return NaN;
        }

        // const var  value
        constVar = this._constVars[valExpr];
        if (constVar)
        {
            if (constVar.value)
            {
                frow = this._findRowExpr(records, cmpFn, start, end, ((args instanceof Array) ? args : []));
                if (frow >= 0)
                    return constVar.value;
            }
            return 0;
        }

        // column  value
        colinfo = this.colinfos[valExpr];
        if (colinfo)
        {
            return this._getCaseAvgValue(records, cmpFn, colinfo._index, start, end, colinfo.ntype, excludeNaN, ((args instanceof Array) ? args : []));
        }

        // expr  value
        var valFn = this._exprFuncs[valExpr];
        if (valFn == null)
        {
            valFn = this._exprFuncs[valExpr] = this._createExprFunc(valExpr);
        }
        if (typeof valFn != "function")
        {
            return 0;
        }

        return this._getCaseAvgExpr(records, cmpFn, valFn, start, end, excludeNaN, ((args instanceof Array) ? args : []), ((valargs instanceof Array) ? valargs : []));
    };
    _pDatasetBase.getCaseAvg = function (cmpExpr, valExpr, start, end, excludeNaN, args, valargs)
    {
        return this.__getCaseAvg(this._viewRecords, cmpExpr, valExpr, start, end, ((excludeNaN || excludeNaN === false) ? excludeNaN : true), args, valargs);
    };
    _pDatasetBase.getCaseAvgNF = function (cmpExpr, valExpr, start, end, excludeNaN, args, valargs)
    {
        return this.__getCaseAvg(this._rawRecords, cmpExpr, valExpr, start, end, ((excludeNaN || excludeNaN === false) ? excludeNaN : true), args, valargs);
    };

    _pDatasetBase._getAvgValue = function (records, colidx, start, end, coltype, excludeNaN)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getAvgExpr = function (records, exprFn, start, end, excludeNaN, args)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getRowsAvgValue = function (records, rows, colidx, coltype, excludeNaN)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getRowsAvgExpr = function (records, rows, exprFn, excludeNaN, args)
    {
        throw new Error("The 'datatyperule' isn't implemented.");
    };
    _pDatasetBase._getCaseAvgValue = function (records, cmpFn, colidx, start, end, coltype, excludeNaN, args)
    {
        if (coltype != 2 && coltype != 3 && coltype != 4)
        {
            return 0;
        }

        var sum;
        var cnt = 0;

        if (coltype == 4)
        {  // BIGDECIMAL
            sum = new nexacro.Decimal();
            function __Decimal_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                    if (cmp)
                    {
                        var colval = rowRow[colidx];

                        if (!excludeNaN || (colval != null && colval !== ""))
                            cnt++;

                        if (colval)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(+colval);
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Decimal_loopFn);

            if (cnt == 0 || sum.isNaN())
                return NaN;

            sum.divDouble(cnt);
            return sum;
        }
        else
        {

            sum = 0;
            function __Value_loopFn(i)
            {
                var rowRow = this.__getParsedRow(records[i]);
                if (rowRow._rtype & 15)
                {
                    var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                    if (cmp)
                    {
                        var colval = rowRow[colidx];

                        if (!excludeNaN || (colval != null && colval !== ""))
                            cnt++;

                        if (colval)
                        {
                            sum += (+colval);
                        }
                    }
                }
            }
            nexacro.__forLoop(this, start, end, __Value_loopFn);

            if (cnt == 0 || sum != sum)
                return NaN;

            return sum / cnt;
        }
    };
    _pDatasetBase._getCaseAvgExpr = function (records, cmpFn, valFn, start, end, excludeNaN, args, valargs)
    {
        var cnt = 0;
        var sum = 0;
        var isdecimal = false;

        function __Expr_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 15)
            {
                var cmp = cmpFn.call(this, i, i, null, this, records, rowRow, args);
                if (cmp)
                {
                    var colval = valFn.call(this, i, i, null, this, records, rowRow, valargs);

                    if (!excludeNaN || (colval != null && !isNaN(colval) && colval !== ""))
                        cnt++;

                    if (colval)
                    {
                        if (isdecimal)
                        {
                            if (colval instanceof nexacro.Decimal)
                                sum.addDecimal(colval);
                            else
                                sum.addDouble(colval);
                        }
                        else
                        {
                            if (colval instanceof nexacro.Decimal)
                            {
                                sum = new nexacro.Decimal(sum);
                                sum.addDecimal(colval);
                                isdecimal = true;
                            }
                            else
                            {
                                sum += (colval);
                            }
                        }
                    }
                }
            }
        }
        end = records.length < end ? records.length : end;
        nexacro.__forLoop(this, start, end, __Expr_loopFn);

        if (cnt == 0 || sum != sum)
            return NaN;

        if (isdecimal)
        {
            sum.divDouble(cnt);
            return sum;
        }
        return sum / cnt;
    };

    //------------------------------------------------------------------
    // find
    _pDatasetBase.__findMaxLengthRow = function (records, colid, start, end)
    {
        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        var colidx = this.getColIndex(colid);
        if (colidx >= 0)
        {
            if (colidx < this.colinfos.length)
            {
                return this._findMaxLengthRow(records, colidx, start, end);
            }
            else
            {
                return start;
            }
        }
        return -1;
    };
    _pDatasetBase.findMaxLengthRow = function (colid, start, end)
    {
        return this.__findMaxLengthRow(this._viewRecords, colid, start, end);
    };
    _pDatasetBase.findMaxLengthRowNF = function (colid, start, end)
    {
        return this.__findMaxLengthRow(this._rawRecords, colid, start, end);
    };

    _pDatasetBase._findMaxLengthRow = function (records, colidx, start, end)
    {
        var maxLen;
        var maxRow = -1;

        function __loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);
            if (rowRow._rtype & 7)
            {
                var colval = rowRow[colidx];
                if (colval)
                {
                    var len = colval.toString().length;
                    if (maxLen == null || len > maxLen)
                    {
                        maxLen = len;
                        maxRow = i;
                    }
                }
            }
        }
        nexacro.__forLoop(this, start, end, __loopFn);
        return maxRow;
    };

    //=================================================================
    // create new dataset from data
    // like SQL
    // select_list, [where expr], [groupby collist]
    // select_list = array new_column info ("id : value expr")
    //    ex : ["a:expr_a", "b:expr_b", "c:expr_c", ...]
    // where_expr = expr string
    // groupby = ["a","b"]; <== new column id array
    //=================================================================
    _pDatasetBase.__createKeyRowsSortFunc = function (keyList, keyCnt)
    {
        var pThis = this;
        return function (a, b)
        {
            var cmp = 0;
            function __loopFn(i)
            {
                var value1 = a[i];
                var value2 = b[i];
                cmp = pThis._compareValue(value1, value2, keyList[i].ntype);
                if (cmp != 0)
                {
                    return true; // break;
                }
            }
            nexacro.__forLoop(pThis, 0, keyCnt, __loopFn);
            return cmp == 0 ? ((a._rawidx > b._rawidx) ? 1 : -1) : cmp;
        };
    };

    _pDatasetBase._createDataset = function (records, dataset_id, select_list, where_expr, start, end)
    {
        if (!dataset_id || !(select_list instanceof Array) || select_list.length <= 0)
            return null;

        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        //var rawRecords = this._rawRecords;
        var colList = this.colinfos;
        var constList = this._constVars;

        // parse select list
        var sel_arr = [];
        var selid, selval;
        var constVar, colinfo;
        function __parse_selct_loopFn(i)
        {
            var selectitem = select_list[i];
            var seppos = selectitem.indexOf(":");
            if (seppos > 0)
            {
                selid = selectitem.substring(0, seppos).trim();
                selval = selectitem.substring(seppos + 1).trim();
                // for grouppig case : remove aggrigation type
                //seppos = selval.indexOf(":");
                //if (seppos > 0)
                //{
                //    var aggtype = selval.substring(0, seppos).trim().toLowerCase();
                //    if (aggtype == "key" || aggtype == "count" || aggtype == "sum" || aggtype == "min" || aggtype == "max" || aggtype == "avg")
                //    {
                //        selval = selval.substring(seppos + 1).trim();
                //    }
                //}

                colinfo = this.getColIndex(selval);
                if (colinfo)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "column", colid: selval, colidx: colinfo };
                    return false;
                }
                constVar = constList[selval];
                if (constVar)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "const", colid: selval, colval: constVar.value };
                    return false;
                }

                var valFn = null;
                if (selval && selval != "")
                {
                    valFn = this._exprFuncs[selval];
                    if (valFn == null)
                    {
                        valFn = this._exprFuncs[selval] = this._createExprFunc(selval);
                    }
                    if (typeof valFn == "function")
                    {
                        sel_arr[sel_arr.length] = { id: selid, type: "expr", exprFn: valFn };
                        return false;
                    }
                }
                sel_arr[sel_arr.length] = { id: selid, type: "null" };
            }
            else
            {
                selid = selectitem.trim();

                colinfo = colList[selid];
                if (colinfo)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "column", colid: selid, colidx: colinfo._index };
                    return false;
                }
                constVar = constList[selid];
                if (constVar)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "const", colid: selid, colval: constVar.value };
                    return false;
                }
                sel_arr[sel_arr.length] = { id: selid, type: "null" };
            }
        }
        nexacro.__forLoop(this, 0, select_list.length, __parse_selct_loopFn);

        if (sel_arr.length <= 0)
        {
            // if no column exists
            return null;
        }

        ///////////////////////////////
        // create New dataset
        ///////////////////////////////
        var outDS = new nexacro.NormalDataset(dataset_id, this.parent);
        // set for created Dataset's default property <== deferent with Normal Fataset
        outDS._p_enableevent = false;
        outDS._p_updatecontrol = true;
        // outDS.updateresetcontrol = true;   // this is flag for Check to change row type as Nomal Type when column updated
        outDS._p_useclientlayout = true;
        outDS.lazyParsing = false;
        outDS._eventstat = false;

        //-----------------------------
        // create layout
        function __create_colinfo_loopFn(j)
        {
            var selcol = sel_arr[j];
            if (selcol.type == "column")
            {
                outDS._addColumnInfo(selcol.id, colList[selcol.colid]);
            }
            else if (selcol.type == "const")
            {
                var constVar = constList[selcol.colid];
                outDS._addConstColumn(selcol.id, selcol.colval, constVar.type, constVar.size);
            }
            else
            {
                outDS._addColumn(selcol.id, "variant", 0);
            }
        }
        nexacro.__forLoop(this, 0, sel_arr.length, __create_colinfo_loopFn);

        //-----------------------------
        // select(extract) rows with where_expr
        var whereFn = null;
        if (where_expr && where_expr != "")
        {
            whereFn = this._exprFuncs[where_expr];
            if (whereFn == null)
            {
                whereFn = this._exprFuncs[where_expr] = this._createExprFunc(where_expr);
            }
            if (typeof whereFn != "function")
            {
                whereFn = null;
            }
        }

        // for no groupping case
        // 1 step create raw data ==> create data directly to outDS._rawRecords
        var outRecords = outDS._rawRecords;
        function __createDataset_rowdata_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);

            if (whereFn)
            {
                var chk = whereFn.call(this, i, i, null, this, records, rowRow, []);
                if (!chk)
                    return false;
            }

            var newRow = [];
            newRow._rtype = 1;
            newRow._rawidx = i;
            newRow._orgidx = rowRow._rawidx;
            newRow._level = 0;

            var k = 0;
            function __create_coldata_loopFn(j)
            {
                var selcol = sel_arr[j];
                if (selcol.type == "column")
                {
                    newRow[k] = rowRow[selcol.colidx];
                }
                else if (selcol.type == "const")
                {
                    return;
                    //newRow[j] = rowRow[selcol.colval];
                }
                else if (selcol.type == "expr")
                {
                    var val = selcol.exprFn.call(this, i, i, null, this, records, rowRow, []);
                    newRow[k] = val;
                }
                k++;
            }
            nexacro.__forLoop(this, 0, sel_arr.length, __create_coldata_loopFn);

            outRecords[outRecords.length] = newRow;
        }
        nexacro.__forLoop(this, start, end, __createDataset_rowdata_loopFn);

        // destroy temp memory
        sel_arr.length = 0;

        // last adjust data info
        outDS._viewRecords = outDS._rawRecords;

        outDS._p_constcount = outDS._constVars.length;
        outDS._p_colcount = outDS.colinfos.length + outDS._p_constcount;
        outDS._p_rowcount = outDS._viewRecords.length;

        return outDS;
    };
    _pDatasetBase.createDataset = function (dataset_id, select_list, where_expr, start, end)
    {
        return this._createDataset(this._viewRecords, dataset_id, select_list, where_expr, start, end);
    };
    _pDatasetBase.createDatasetNF = function (dataset_id, select_list, where_expr, start, end)
    {
        return this._createDataset(this._rawRecords, dataset_id, select_list, where_expr, start, end);
    };


    _pDatasetBase._createGrouppingDataset = function (records, dataset_id, select_list, where_expr, groupby, start, end)
    {
        if (!dataset_id || !(select_list instanceof Array) || select_list.length <= 0 || !groupby)
            return null;

        start = start | 0;
        if (start < 0)
        {
            start = 0;
        }
        end = (end == null) ? records.length : (end | 0);
        if (end < 0 || end > records.length)
        {
            end = records.length;
        }

        var colList = this.colinfos;
        var constList = this._constVars;

        // parse select list
        var sel_arr = [];
        function __parse_selct_loopFn(i)
        {
            var selectitem = select_list[i];
            var seppos = selectitem.indexOf(":");
            var colinfo;
            var selid;
            var selval;
            var constVar;
            if (seppos > 0)
            {
                selid = selectitem.substring(0, seppos).trim();
                selval = selectitem.substring(seppos + 1).trim();
                var aggtype = "sum";
                seppos = selval.indexOf(":");
                if (seppos > 0)
                {
                    aggtype = selval.substring(0, seppos).trim().toLowerCase();
                    if (aggtype == "key" || aggtype == "count" || aggtype == "sum" || aggtype == "min" || aggtype == "max" || aggtype == "avg")
                    {
                        selval = selval.substring(seppos + 1).trim();
                    }
                }

                colinfo = this.getColIndex(selval);
                if (colinfo)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "column", colid: selval, colidx: colinfo._index, ntype: colinfo.ntype, aggtype: aggtype };
                    return false;
                }
                constVar = constList[selval];
                if (constVar)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "const", colid: selval, colval: constVar.value };
                    return false;
                }

                var valFn = null;
                if (selval && selval != "")
                {
                    valFn = this._exprFuncs[selval];
                    if (valFn == null)
                    {
                        valFn = this._exprFuncs[selval] = this._createExprFunc(selval);
                    }
                    if (typeof valFn == "function")
                    {
                        sel_arr[sel_arr.length] = { id: selid, type: "expr", exprFn: valFn, ntype: -1, aggtype: aggtype };
                        return false;
                    }
                }
                sel_arr[sel_arr.length] = { id: selid, type: "null" };
            }
            else
            {
                selid = selectitem.trim();

                colinfo = colList[selid];
                if (colinfo)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "column", colid: selid, colidx: colinfo._index, ntype: colinfo.ntype, aggtype: "sum" };
                    return false;
                }
                constVar = constList[selid];
                if (constVar)
                {
                    sel_arr[sel_arr.length] = { id: selid, type: "const", colid: selid, colval: constVar.value };
                    return false;
                }
                sel_arr[sel_arr.length] = { id: selid, type: "null" };
            }
        }
        nexacro.__forLoop(this, 0, select_list.length, __parse_selct_loopFn);

        if (sel_arr.length <= 0)
        {
            // if no column exists
            return null;
        }

        // parse groupby
        var group_arr = null;
        if (groupby && groupby != null && groupby != "")
        {
            // groupping case
            var g_arr = groupby.split(",");
            group_arr = [];
            function __parse_group_loopFn(i)
            {
                var gid = g_arr[i].trim();
                function __createDataset_parsegroup_find_loopFn(j)
                {
                    if (sel_arr[j].id == gid)
                        return true;
                }
                var sidx = nexacro.__forLoop(this, 0, sel_arr.length, __createDataset_parsegroup_find_loopFn);

                if (sidx < sel_arr.length)
                {
                    if (sel_arr[sidx].type == "const" || sel_arr[sidx].type == "null")
                        return false;

                    var selitem = sel_arr[sidx];
                    selitem.key = group_arr.length; // sel_arr set as key index
                    group_arr[group_arr.length] = { id: selitem.id, idx: sidx, ntype: selitem.ntype };
                }
            }
            nexacro.__forLoop(this, 0, g_arr.length, __parse_group_loopFn);
        }

        ///////////////////////////////
        // create New dataset
        ///////////////////////////////
        var outDS = new this.constructor(dataset_id, this.parent);
        // set for created Dataset's default property <== deferent with Normal Fataset
        outDS._p_enableevent = false;
        outDS._p_updatecontrol = true;
        //outDS.updateresetcontrol = true;   // this is flag for Check to change row type as Nomal Type when column updated
        outDS._p_useclientlayout = true;
        outDS.lazyParsing = false;
        outDS._eventstat = false;

        //-----------------------------
        // create layout
        function __create_colinfo_loopFn(j)
        {
            var selcol = sel_arr[j];
            var constVar;
            if (selcol.key >= 0)
            {
                if (selcol.type == "column")
                {
                    outDS._addColumnInfo(selcol.id, colList[selcol.colid]);
                }
                else if (selcol.type == "const")
                {
                    constVar = constList[selcol.colid];
                    outDS._addConstColumn(selcol.id, selcol.colval, constVar.type, constVar.size);
                }
                else
                {
                    outDS._addColumn(selcol.id, "variant", 0);
                }
            }
            else
            {
                if (selcol.type == "const")
                {
                    constVar = constList[selcol.colid];
                    outDS._addConstColumn(selcol.id, selcol.colval, constVar.type, constVar.size);
                }
                else
                    outDS._addColumn(selcol.id, "variant", 0);
            }
        }
        nexacro.__forLoop(this, 0, sel_arr.length, __create_colinfo_loopFn);

        //-----------------------------
        // select(extract) rows with where_expr
        var whereFn = null;
        if (where_expr && where_expr != "")
        {
            whereFn = this._exprFuncs[where_expr];
            if (whereFn == null)
            {
                whereFn = this._exprFuncs[where_expr] = this._createExprFunc(where_expr);
            }
            if (typeof whereFn != "function")
            {
                whereFn = null;
            }
        }

        //-----------------------------
        // create data : groupping Dataset
        // for groupping case
        // 1 step : create group key ==> create data to tmpRecords
        // 2 step : sort & groupping key datas ==> key + (rows)
        // 3 step : create result data
        var keyRecords = [];
        function __create_keydata_loopFn(i)
        {
            var rowRow = this.__getParsedRow(records[i]);

            if (whereFn)
            {
                var chk = whereFn.call(this, i, i, null, this, records, rowRow, []);
                if (!chk)
                    return false;
            }

            var grouparraylen = group_arr.length;
            if (grouparraylen > 0)
            {
                var keyRow = [];
                keyRow._orgidx = i;

                function __group_keycol_loopFn(j)
                {
                    var gitem = group_arr[j];
                    var selcol = sel_arr[gitem.idx];
                    if (selcol.type == "column")
                    {
                        keyRow[j] = rowRow[selcol.colidx];
                    }
                    else if (selcol.type == "expr")
                    {
                        var val = selcol.exprFn.call(this, i, i, null, this, records, rowRow, []);
                        keyRow[j] = val;
                    }
                }
                nexacro.__forLoop(this, 0, grouparraylen, __group_keycol_loopFn);

                keyRecords[keyRecords.length] = keyRow;
            }
        }
        nexacro.__forLoop(this, start, end, __create_keydata_loopFn);

        //-----------------------------
        // sort key rows
        if (group_arr)
        {
            var cmpfn = this.__createKeyRowsSortFunc(group_arr, group_arr.length);
            keyRecords.sort(cmpfn);
        }

        //-----------------------------
        // create groupping datas
        var outRecords = outDS._rawRecords;

        var prev_keyRow = keyRecords[0];
        var prev_rowRow = records[prev_keyRow._orgidx];
        var grp_rows = [];
        grp_rows[0] = prev_keyRow._orgidx;

        function __create_grpdata_loopFn(i)
        {
            var keyRow = keyRecords[i];
            var rowRow = records[keyRow._orgidx];

            // compare & check group
            var cmp = 0;
            function __comparegrp_loopFn(j)
            {
                var val1 = prev_keyRow[j];
                var val2 = keyRow[j];
                cmp = this._compareValue(val1, val2, group_arr[j].ntype);
                if (cmp != 0)
                    return true;
            }
            nexacro.__forLoop(this, 0, group_arr.length, __comparegrp_loopFn);

            if (cmp != 0)
            {
                // new group add
                var newRow = [];
                newRow._rtype = 1;
                newRow._rawidx = outRecords.length;
                newRow._orgidx = outRecords.length;
                newRow._level = 0;

                var k = 0;
                function __create_grpcoldata_loopFn(j)
                {
                    var selcol = sel_arr[j];
                    if (selcol.key >= 0)
                    {
                        newRow[k] = prev_keyRow[selcol.key];
                    }
                    else if (selcol.type == "const")
                    {
                        return;
                        // newRow[j] = selcol.colval;
                    }
                    else
                    {
                        if (selcol.type == "null")
                        {
                            newRow[k] = null;
                        }
                        else if (selcol.type == "column")
                        {
                            if (selcol.aggtype == "key")
                            {
                                newRow[k] = prev_rowRow[selcol.colidx];
                            }
                            else if (selcol.aggtype == "count")
                            {
                                newRow[k] = grp_rows.length; //this._getRowsCountValue(records, grp_rows, selcol.colidx);
                            }
                            else if (selcol.aggtype == "sum")
                            {
                                newRow[k] = this._getRowsSumValue(records, grp_rows, selcol.colidx, selcol.ntype);
                            }
                            else if (selcol.aggtype == "min")
                            {
                                newRow[k] = this._getRowsMinValue(records, grp_rows, selcol.colidx, selcol.ntype);
                            }
                            else if (selcol.aggtype == "max")
                            {
                                newRow[k] = this._getRowsMaxValue(records, grp_rows, selcol.colidx, selcol.ntype);
                            }
                            else if (selcol.aggtype == "avg")
                            {
                                newRow[k] = this._getRowsAvgValue(records, grp_rows, selcol.colidx, selcol.ntype, true);
                            }
                            else
                            {
                                newRow[k] = this._getRowsSumValue(records, grp_rows, selcol.colidx, selcol.ntype);
                            }
                        }
                        else if (selcol.type == "expr")
                        {
                            if (selcol.aggtype == "key")
                            {
                                newRow[k] = selcol.exprFn.call(this, prev_keyRow._orgidx, prev_keyRow._orgidx, null, this, records, prev_rowRow, []);
                            }
                            else if (selcol.aggtype == "count")
                            {
                                newRow[k] = grp_rows.length; //this._getRowsCountExpr(grp_rows, selcol.exprFn, []);
                            }
                            else if (selcol.aggtype == "sum")
                            {
                                newRow[k] = this._getRowsSumExpr(records, grp_rows, selcol.exprFn, []);
                            }
                            else if (selcol.aggtype == "min")
                            {
                                newRow[k] = this._getRowsMinExpr(records, grp_rows, selcol.exprFn, []);
                            }
                            else if (selcol.aggtype == "max")
                            {
                                newRow[k] = this._getRowsMaxExpr(records, grp_rows, selcol.exprFn, []);
                            }
                            else if (selcol.aggtype == "avg")
                            {
                                newRow[k] = this._getRowsAvgExpr(records, grp_rows, selcol.exprFn, true, []);
                            }
                            else
                            {
                                newRow[k] = this._getRowsSumExpr(records, grp_rows, selcol.exprFn, []);
                            }
                        }
                    }
                    k++;
                }
                nexacro.__forLoop(this, 0, sel_arr.length, __create_grpcoldata_loopFn);

                outRecords[outRecords.length] = newRow;

                // last - reset group
                prev_keyRow = keyRow;
                prev_rowRow = rowRow;
                grp_rows.length = 0;
                grp_rows[0] = keyRow._orgidx;
            }
            else
            {
                // same group
                grp_rows[grp_rows.length] = keyRow._orgidx;
            }
        }
        nexacro.__forLoop(this, 1, keyRecords.length, __create_grpdata_loopFn);

        // for remain rows
        if (grp_rows.length > 0)
        {
            // new group add
            var newRow = [];
            newRow._rtype = 1;
            newRow._rawidx = outRecords.length;
            newRow._orgidx = outRecords.length;
            newRow._level = 0;

            var k = 0;
            function __create_last_grpcoldata_loopFn(j)
            {
                var selcol = sel_arr[j];
                if (selcol.key >= 0)
                {
                    newRow[k] = prev_keyRow[selcol.key];
                }
                else if (selcol.type == "const")
                {
                    return;
                    //newRow[j] = selcol.colval;
                }
                else
                {
                    if (selcol.type == "null")
                    {
                        newRow[k] = null;
                    }
                    else if (selcol.type == "column")
                    {
                        if (selcol.aggtype == "key")
                        {
                            newRow[k] = prev_rowRow[selcol.colidx];
                        }
                        else if (selcol.aggtype == "count")
                        {
                            newRow[k] = grp_rows.length; //this._getRowsCountValue(records, grp_rows, selcol.colidx);
                        }
                        else if (selcol.aggtype == "sum")
                        {
                            newRow[k] = this._getRowsSumValue(records, grp_rows, selcol.colidx, selcol.ntype);
                        }
                        else if (selcol.aggtype == "min")
                        {
                            newRow[k] = this._getRowsMinValue(records, grp_rows, selcol.colidx, selcol.ntype);
                        }
                        else if (selcol.aggtype == "max")
                        {
                            newRow[k] = this._getRowsMaxValue(records, grp_rows, selcol.colidx, selcol.ntype);
                        }
                        else if (selcol.aggtype == "avg")
                        {
                            newRow[k] = this._getRowsAvgValue(records, grp_rows, selcol.colidx, selcol.ntype, true);
                        }
                        else
                        {
                            newRow[k] = this._getRowsSumValue(records, grp_rows, selcol.colidx, selcol.ntype);
                        }
                    }
                    else if (selcol.type == "expr")
                    {
                        if (selcol.aggtype == "key")
                        {
                            newRow[k] = selcol.exprFn.call(this, prev_keyRow._orgidx, prev_rowRow._rawidx, null, this, records, prev_rowRow, []);
                        }
                        else if (selcol.aggtype == "count")
                        {
                            newRow[k] = grp_rows.length; //this._getRowsCountExpr(records, grp_rows, selcol.exprFn, []);
                        }
                        else if (selcol.aggtype == "sum")
                        {
                            newRow[k] = this._getRowsSumExpr(records, grp_rows, selcol.exprFn, []);
                        }
                        else if (selcol.aggtype == "min")
                        {
                            newRow[k] = this._getRowsMinExpr(records, grp_rows, selcol.exprFn, []);
                        }
                        else if (selcol.aggtype == "max")
                        {
                            newRow[k] = this._getRowsMaxExpr(records, grp_rows, selcol.exprFn, []);
                        }
                        else if (selcol.aggtype == "avg")
                        {
                            newRow[k] = this._getRowsAvgExpr(records, grp_rows, selcol.exprFn, true, []);
                        }
                        else
                        {
                            newRow[k] = this._getRowsSumExpr(records, grp_rows, selcol.exprFn, []);
                        }
                    }
                }
                k++;
            }
            nexacro.__forLoop(this, 0, sel_arr.length, __create_last_grpcoldata_loopFn);

            outRecords[outRecords.length] = newRow;

            // last - reset group
            prev_keyRow = null;
            prev_rowRow = null;
            grp_rows.length = 0;
            grp_rows = null;
        }

        // destroy temp memory
        this._clearRecordData(keyRecords);
        keyRecords = null;

        sel_arr.length = 0;
        if (group_arr)
            group_arr.length = 0;

        // last adjust data info
        outDS._viewRecords = outDS._rawRecords;

        outDS._p_constcount = outDS._constVars.length;
        outDS._p_colcount = outDS.colinfos.length + outDS._p_constcount;
        outDS._p_rowcount = outDS._viewRecords.length;

        return outDS;
    };
    _pDatasetBase.createGrouppingDataset = function (dataset_id, select_list, where_expr, groupby, start, end)
    {
        return this._createGrouppingDataset(this._viewRecords, dataset_id, select_list, where_expr, groupby, start, end);
    };
    _pDatasetBase.createGrouppingDatasetNF = function (dataset_id, select_list, where_expr, groupby, start, end)
    {
        return this._createGrouppingDataset(this._rawRecords, dataset_id, select_list, where_expr, groupby, start, end);
    };


    //=================================================================
    _pDatasetBase._bWorkingstatus = false;
    _pDatasetBase._endLoad = function (errorcode, errormsg, reason)
    {
        this._bWorkingstatus = true;
        this._reFilter();
        this._resetSortGroup();
        if (this._eventstat)
        {
            this.on_fire_onload(errorcode, errormsg, reason); //nexacro.Dataset.REASON_LOAD;

            if (this._viewRecords && this._viewRecords.length > 0)
            {
                var newpos = 0;
                if (newpos >= this._p_rowcount) newpos = -1;
                var oldpos = this._p_rowposition;
                var evt;
                if (newpos != oldpos)
                {
                    if (this.onrowposchanged && this.onrowposchanged._has_handlers)
                    {
                        evt = new nexacro.DSRowPosChangeEventInfo(this, "onrowposchanged", oldpos, newpos, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        if (newpos >= 0 || newpos < this._p_rowcount)
                        {
                            this._p_rowposition = newpos;
                            //if (newpos != oldpos)
                            //{
                            this.on_fire_onrowposchanged(evt);
                            //}
                        }
                    }
                    else
                    {
                        this._p_rowposition = newpos;
                    }
                }
                if (this.onvaluechanged && this.onvaluechanged._has_handlers)
                {
                    evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
            }
        }
        else if (this._viewRecords.length > 0)
        {
            this._p_rowposition = 0;
        }

        this._bWorkingstatus = false;
    };

    _pDatasetBase._setContents = function (contents)
    {
        var ret = false;

        if (contents)
        {
            if (typeof contents == "string" && contents.length)
            {
                ret = this._loadFromXMLStr(contents, undefined, undefined, undefined, true);
            }
            else
            {
                ret = this._loadFromJSONObj(contents, true, false, undefined, "", true);
            }

            this._p_rowposition = -1;
            if (this.binddataobject)
                this._loadDataObject(false);
        }

        this.updateSortGroup();

        if (this.parent && (!this.parent._is_application && this.parent._is_form == false))
            this.on_created();

        return nexacro._toBoolean(ret);
    };


    //---------------------------------------------
    //---------------------------------------------
    // load from DOM
    //---------------------------------------------
    _pDatasetBase._loadFromDOM = function (dsDOM, curIdx, loadCnt, bOrgLayout, bClear)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bClear)
        {
            if (bOrgLayout)
                this._clearData();
            else
                this._clearAll();
        }

        if (dsDOM == null)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            return 0;
        }
        if (!curIdx)
            curIdx = 0;
        if (!loadCnt)
            loadCnt = -1;

        this._setColInfoFromDOM(dsDOM, bOrgLayout);

        curIdx = this._loadRecordFromDOM(dsDOM, curIdx, loadCnt);

        var viewRecords = this._viewRecords;
        //var delRecords = this._deletedRecords;
        //var rawRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        //viewRecords = null;
        //delRecords = null;
        //rawRecords = null;

        return curIdx;
    };

    _pDatasetBase._setColInfoFromDOM = function (dsDOM, bOrgLayout)
    {
        //if (bOrgLayout)
        //{
        //    ;
        //}
        if (!bOrgLayout)
        {
            var _colElems = dsDOM.getElementsByTagName("ConstColumn");
            function __loadFromDOM_const_loopFn(i)
            {
                var _colElem = _colElems[i];
                var id = _colElem.getAttribute("id");
                if (id.length)
                {
                    this._addConstColumn(id, _colElem.getAttribute("value"), _colElem.getAttribute("type"));
                }
            }
            var len = (_colElems ? _colElems.length : 0);
            nexacro.__forLoop(this, 0, len, __loadFromDOM_const_loopFn);

            _colElems = dsDOM.getElementsByTagName("Column");
            function __loadFromDOM_col_loopFn(i)
            {
                var _colElem = _colElems[i];
                var id = _colElem.getAttribute("id");
                if (id.length)
                {
                    this._addColumn(id, _colElem.getAttribute("type"), _colElem.getAttribute("size"), _colElem.getAttribute("prop"), _colElem.getAttribute("sumtext"), _colElem.getAttribute("datapath"));
                }
            }
            len = (_colElems ? _colElems.length : 0);
            nexacro.__forLoop(this, 0, len, __loadFromDOM_col_loopFn);
        }
    };

    _pDatasetBase._loadRecordFromDOM = function (dsDOM, curIdx, loadCnt)
    {
        var colList = this.colinfos;
        //var curCol;

        var _rowElems = dsDOM.getElementsByTagName("Row");
        var cnt = (_rowElems ? _rowElems.length : 0);

        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var colCnt = colList.length;

        var templateRow = new Array(colCnt);
        function __loadRecordFromDOM_temp_loopFn(i)
        {
            var colinfo = colList[i];
            if (colinfo.ntype >= 4 && colinfo.ntype <= 7)
            {
                templateRow[colinfo._index] = null;
            }
        }
        nexacro.__forLoop(this, 0, colCnt, __loadRecordFromDOM_temp_loopFn);

        function __loadFromDOM_row_loopFn(idx)
        {
            var curRow = templateRow.slice(0, colCnt);
            curRow._orgidx = idx;
            curRow._rawidx = rawRecords.length;
            curRow._level = 0;

            var _rowElem = _rowElems[idx];

            var type = _rowElem.getAttribute("type");
            if (type == null) curRow._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
            else if (type.charAt(0) == 'I' || type.charAt(0) == 'i') curRow._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
            else if (type.charAt(0) == 'U' || type.charAt(0) == 'u') curRow._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
            else if (type.charAt(0) == 'D' || type.charAt(0) == 'd') curRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
            else curRow._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;

            var _colElems = _rowElem.getElementsByTagName("Col");
            var len = (_colElems ? _colElems.length : 0);
            if (len > 0)
            {
                function __loadRecordFromDOM_coldata_loopFn(j)
                {
                    var _colElem = _colElems[j];
                    var id = _colElem.getAttribute("id");
                    var colinfo = colList[id];
                    if (colinfo)
                    {
                        var _textElem = _colElem.firstChild;
                        if (_textElem)
                        {
                            // Sent from the server to the client,"\r\n|\r|\n" character is converted to the following (only IE)
                            // IXMLDOMText.nodeVlaue : "\r\n|\r|\n" -> "\n"
                            // IXMLDOMText.xml : "\r\n|\r|\n" -> "\r\n"
                            curRow[colinfo._index] = colinfo._fromText(_textElem.nodeValue);
                        }
                        else
                        {
                            curRow[colinfo._index] = colinfo._fromText("");
                        }
                    }
                }
                nexacro.__forLoop(this, 0, len, __loadRecordFromDOM_coldata_loopFn);
            }

            if (curRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE
            {
                var _orgrowElems = _rowElem.getElementsByTagName("OrgRow");
                var orgcnt = (_orgrowElems ? _orgrowElems.length : 0);
                if (orgcnt)
                {
                    var orgRow = templateRow.slice(0, colCnt);
                    _colElems = _orgrowElems[0].getElementsByTagName("Col");
                    len = (_colElems ? _colElems.length : 0);
                    if (len > 0)
                    {
                        function __loadRecordFromDOM_orgcoldata_loopFn(j)
                        {
                            var _colElem = _colElems[j];
                            var id = _colElem.getAttribute("id");
                            var colinfo = colList[id];
                            if (colinfo)
                            {
                                var _textElem = _colElem.firstChild;
                                if (_textElem)
                                {
                                    // Sent from the server to the client,"\r\n|\r|\n" character is converted to the following (only IE)
                                    // IXMLDOMText.nodeVlaue : "\r\n|\r|\n" -> "\n"
                                    // IXMLDOMText.xml : "\r\n|\r|\n" -> "\r\n"
                                    orgRow[colinfo._index] = colinfo._fromText(_textElem.nodeValue);
                                }
                                else
                                {
                                    orgRow[colinfo._index] = colinfo._fromText("");
                                }
                            }
                        }
                        nexacro.__forLoop(this, 0, len, __loadRecordFromDOM_orgcoldata_loopFn);
                    }
                    curRow._orgrow = orgRow;
                }
            }

            if (curRow._rtype == 8) //nexacro.Dataset.ROWTYPE_DELETE
            {
                delRecords[delRecords.length] = curRow;
            }
            else
            {
                rawRecords[rawRecords.length] = curRow;
            }

            if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
            {
                return true;
            }
        }
        curIdx = nexacro.__forLoop(this, curIdx, cnt, __loadFromDOM_row_loopFn);

        templateRow.length = 0;
        templateRow = null;
        return curIdx;
    };

    _pDatasetBase.loadFromDOM = function (doc, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;

        if (doc != null)
        {
            this._bWorkingstatus = true;

            var dsDOM;
            if (doc.nodeName == "Dataset")
            {
                dsDOM = doc;
            }
            else
            {
                var datasets = doc.getElementsByTagName("Dataset");
                dsDOM = datasets[0];
            }

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            var curIdx = 0;
            if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
            {
                curIdx = this._loadFromDOM(dsDOM, curIdx, this.firefirstcount, bOrgLayout, bClear);
                if (this.firefirstcount == this._p_rowcount)
                {
                    this._reFilter();
                    this._resetSortGroup();
                    this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    this._p_rowposition = 0;

                    /*curIdx = */this._loadFromDOM(dsDOM, curIdx, -1, bOrgLayout, false);
                }
            }
            else
            {
                /*curIdx = */this._loadFromDOM(dsDOM, curIdx, -1, bOrgLayout, bClear);
            }

            if (this.colinfos)
            {
                this._reFilter();
                this._resetSortGroup();
            }

            if (this._eventstat)
            {
                this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
                else
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;

            return this._p_rowcount;
        }
    };


    //---------------------------------------------
    //---------------------------------------------
    // load from XML
    //---------------------------------------------
    _pDatasetBase._setConstColInfoFromXMLStr = function (xmlStr)
    {
        var xml_parse_pos = 0;
        var colInfo = nexacro._getXMLTagData(xmlStr, xml_parse_pos, "<ColumnInfo>", "</ColumnInfo>");
        if (colInfo)
        {
            xml_parse_pos = colInfo[3];
            var colinfoData = colInfo[0];

            var const_parse_pos = 0;
            function __loadFromXMLStr_const_loopFn()
            {
                var constVar = nexacro._getXMLTagData2(colinfoData, const_parse_pos, "<ConstColumn ", "</ConstColumn>");
                if (constVar == null)
                {
                    return true;
                }

                const_parse_pos = constVar[3];
                var attrStr = constVar[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                var value = nexacro._getXMLAttributeData(attrStr, "value");
                if (id.length)
                {
                    var type = nexacro._getXMLAttributeType(attrStr);
                    var size = nexacro._getXMLAttributeData(attrStr, "size");
                    var datapath = nexacro._getXMLAttributeData(attrStr, "datapath");
                    this._addConstColumn(id, nexacro._decodeXml(value), type, size, datapath);
                }
                return false;
            }
            nexacro.__whileLoop(this, __loadFromXMLStr_const_loopFn);
        }
        return xml_parse_pos;
    };

    _pDatasetBase._setColInfoFromXMLStr = function (xmlStr)
    {
        var xml_parse_pos = 0;
        var colInfo = nexacro._getXMLTagData(xmlStr, xml_parse_pos, "<ColumnInfo>", "</ColumnInfo>");
        if (colInfo)
        {
            xml_parse_pos = colInfo[3];
            var colinfoData = colInfo[0];

            var const_parse_pos = 0;
            function __loadFromXMLStr_const_loopFn()
            {
                var constVar = nexacro._getXMLTagData2(colinfoData, const_parse_pos, "<ConstColumn ", "</ConstColumn>");
                if (constVar == null)
                {
                    return true;
                }

                const_parse_pos = constVar[3];
                var attrStr = constVar[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                var value = nexacro._getXMLAttributeData(attrStr, "value");
                if (id.length)
                {
                    var type = nexacro._getXMLAttributeType(attrStr);
                    var size = nexacro._getXMLAttributeData(attrStr, "size");
                    var datapath = nexacro._getXMLAttributeData(attrStr, "datapath");
                    this._addConstColumn(id, nexacro._decodeXml(value), type, size, datapath);
                }
                return false;
            }
            nexacro.__whileLoop(this, __loadFromXMLStr_const_loopFn);

            var colinfo_parse_pos = 0;
            function __loadFromXMLStr_col_loopFn()
            {
                var colInfo = nexacro._getXMLTagData4(colinfoData, colinfo_parse_pos, "<Column ");
                if (colInfo == null)
                {
                    return true;
                }

                colinfo_parse_pos = colInfo[3];
                var attrStr = colInfo[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                if (id && id.length)
                {
                    var type = nexacro._getXMLAttributeType(attrStr);
                    var size = nexacro._getXMLAttributeData(attrStr, "size");
                    var prop = nexacro._getXMLAttributeData(attrStr, "prop");
                    var sumtext = nexacro._getXMLAttributeData(attrStr, "sumtext");
                    var datapath = nexacro._getXMLAttributeData(attrStr, "datapath");
                    this._addColumn(id, type, size, prop, sumtext, datapath);
                }
            }
            nexacro.__whileLoop(this, __loadFromXMLStr_col_loopFn);
        }
        return xml_parse_pos;
    };

    _pDatasetBase._loadRecordFromXMLStr = function (xmlStr, xml_parse_pos, loadCnt)
    {
        var colList = this.colinfos;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var colCnt = colList.length;

        var templateRow = new Array(colCnt);
        function __loadRecordFromDOM_temp_loopFn(i)
        {
            var colinfo = colList[i];
            if (colinfo.ntype >= 4 && colinfo.ntype <= 7)
            {
                //templateRow[colinfo._index] = null;
                templateRow[colinfo._index] = undefined;
            }
        }
        nexacro.__forLoop(this, 0, colCnt, __loadRecordFromDOM_temp_loopFn);

        var rowidx = rawRecords.length + delRecords.length;
        if (xml_parse_pos > -1)
        {
            function __loadFromXMLStr_row_loopFn()
            {
                var rowInfo = nexacro._getXMLTagData3(xmlStr, xml_parse_pos, "<Row", "</Row>");
                if (rowInfo == null)
                {
                    return true;
                }

                xml_parse_pos = rowInfo[3];
                var rowStr = rowInfo[0];
                var attrStr = rowInfo[1];

                var curRow = templateRow.slice(0, colCnt);
                curRow._orgidx = rowidx;
                curRow._rawidx = rawRecords.length;
                curRow._level = 0;

                rowidx++;

                if (attrStr)
                {
                    var type = nexacro._getXMLAttributeType(attrStr);
                    if (!type)
                    {
                        curRow._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                    }
                    else
                    {
                        var typeChar = type.charAt(0);
                        if (typeChar == 'I' || typeChar == 'i')
                        {
                            curRow._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
                        }
                        else if (typeChar == 'U' || typeChar == 'u')
                        {
                            curRow._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
                        }
                        else if (typeChar == 'D' || typeChar == 'd')
                        {
                            curRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
                        }
                        else
                        {
                            curRow._rtype = 1;  //nexacro.Dataset.ROWTYPE_NORMAL;
                        }
                    }
                }
                else
                {
                    curRow._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                }

                if (curRow._rtype == 4) //nexacro.Dataset.ROWTYPE_UPDATE;
                {
                    var orgRowInfo = nexacro._getXMLTagData(rowStr, 0, "<OrgRow>", "</OrgRow>");
                    if (orgRowInfo)
                    {
                        rowStr = rowStr.substring(0, orgRowInfo[2]) + rowStr.substring(orgRowInfo[3]);

                        var orgStr = orgRowInfo[0];

                        var orgRow = templateRow.slice(0, colCnt);

                        var org_parse_pos = 0;
                        function __loadFromXMLStr_orgcolvalue_loopFn()
                        {
                            var colInfo = nexacro._getXMLTagData2(orgStr, org_parse_pos, "<Col ", "</Col>");
                            if (colInfo == null)
                            {
                                return true;
                            }

                            org_parse_pos = colInfo[3];
                            var attrStr = colInfo[1];
                            var id = nexacro._getXMLAttributeID(attrStr);
                            var colinfo = colList[id];
                            if (colinfo)
                            {
                                orgRow[colinfo._index] = colinfo._fromXMLText(colInfo[0]);
                            }
                        }
                        nexacro.__whileLoop(this, __loadFromXMLStr_orgcolvalue_loopFn);
                        curRow._orgrow = orgRow;
                    }
                }

                var row_parse_pos = 0;
                function __loadFromXMLStr_colvalue_loopFn()
                {
                    if (rowStr)
                    {
                        var colInfo = nexacro._getXMLTagData2(rowStr, row_parse_pos, "<Col ", "</Col>");
                        if (colInfo == null)
                        {
                            return true;
                        }

                        row_parse_pos = colInfo[3];
                        var attrStr = colInfo[1];
                        var id = nexacro._getXMLAttributeID(attrStr);
                        var colinfo = colList[id];
                        if (colinfo)
                        {
                            curRow[colinfo._index] = colinfo._fromXMLText(colInfo[0]);
                        }
                        return false;
                    }
                    return true;
                }
                nexacro.__whileLoop(this, __loadFromXMLStr_colvalue_loopFn);

                if (curRow._rtype == 8) //nexacro.Dataset.ROWTYPE_DELETE
                {
                    delRecords[delRecords.length] = curRow;
                }
                else
                {
                    rawRecords[rawRecords.length] = curRow;
                }

                if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
                    return true;
            }
            nexacro.__whileLoop(this, __loadFromXMLStr_row_loopFn);
        }

        return xml_parse_pos;
    };

    _pDatasetBase._loadFromXMLStr = function (xmlStr, xml_parse_pos, loadCnt, bOrgLayout, bClear)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (!xml_parse_pos)
            xml_parse_pos = 0;

        if (!loadCnt)
            loadCnt = -1;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        if (!xmlStr)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            return 0;
        }

        if (bOrgLayout)
        {
            if (xml_parse_pos <= 0)
            {
                xml_parse_pos = this._setConstColInfoFromXMLStr(xmlStr);
                xml_parse_pos = xmlStr.indexOf("<Rows>");
                if (xml_parse_pos > -1)
                {
                    xml_parse_pos += 6;
                }
            }
        }
        else
        {
            if (xml_parse_pos <= 0)
            {
                xml_parse_pos = this._setColInfoFromXMLStr(xmlStr);
                xml_parse_pos = xmlStr.indexOf("<Rows>", xml_parse_pos);
                if (xml_parse_pos > -1)
                {
                    xml_parse_pos += 6;
                }
            }
        }

        if (xml_parse_pos > -1)
            xml_parse_pos = this._loadRecordFromXMLStr(xmlStr, xml_parse_pos, loadCnt);

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return xml_parse_pos;
    };

    _pDatasetBase.loadFromXMLStr = function (xmlStr, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;
        this._bWorkingstatus = true;

        if (xmlStr)
        {
            this._bWorkingstatus = true;

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            var xml_parse_pos;
            if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
            {
                xml_parse_pos = this._loadFromXMLStr(xmlStr, 0, this.firefirstcount, bOrgLayout, bClear);
                if (this.firefirstcount == this._p_rowcount)
                {
                    this._reFilter();
                    this._resetSortGroup();
                    this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    this._p_rowposition = 0;

                    /*xml_parse_pos = */this._loadFromXMLStr(xmlStr, xml_parse_pos, -1, bOrgLayout, false);
                }
            }
            else
            {
                /*xml_parse_pos = */this._loadFromXMLStr(xmlStr, 0, -1, bOrgLayout, bClear);
            }

            if (this.colinfos)
            {
                this._reFilter();
                this._resetSortGroup();
            }

            if (this._eventstat)
            {
                this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
                else
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;

            return this._p_rowcount;
        }
    };

    _pDatasetBase.loadXML = function (strxml, bClear)
    {
        return this.loadFromXMLStr(strxml, bClear);
    };

    //---------------------------------------------
    // save XML
    //---------------------------------------------
    _pDatasetBase._TABS = ["", "\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t", "\t\t\t\t\t\t\t"];
    _pDatasetBase.__writeXMLData = function (list, str, depth)
    {
        list.push(this._TABS[depth] + str);
    };

    _pDatasetBase.__writeXMLNormalRow = function (list, rowRow, depth)
    {
        this.__writeXMLData(list, "<Row>", depth++);
        this.__writeXMLRowData(list, rowRow, depth);
        this.__writeXMLData(list, "</Row>", --depth);
    };

    _pDatasetBase.__writeXMLCrudRow = function (list, rowRow, depth)
    {
        var buffer = "<Row";
        switch (rowRow._rtype)
        {
            case 1:
                // nexacro.Dataset.ROWTYPE_NORMAL
                break;
            case 2:
                // nexacro.Dataset.ROWTYPE_INSERT
                buffer += " type=\"insert\"";
                break;
            case 4:
                // nexacro.Dataset.ROWTYPE_UPDATE
                buffer += " type=\"update\"";
                break;
            case 8:
                // nexacro.Dataset.ROWTYPE_DELETE
                buffer += " type=\"delete\"";
                break;
        }
        buffer += ">";
        this.__writeXMLData(list, buffer, depth++);

        this.__writeXMLRowData(list, rowRow, depth);

        if (rowRow._rtype == 4 && rowRow._orgrow)
        {
            this.__writeXMLData(list, "<OrgRow>", depth++);
            this.__writeXMLRowData(list, rowRow._orgrow, depth);
            this.__writeXMLData(list, "</OrgRow>", --depth);
        }

        this.__writeXMLData(list, "</Row>", --depth);
    };

    _pDatasetBase.__writeXMLRowData = function (list, rowRow, depth)
    {
        var colList = this.colinfos;
        function __writeColData_loopFn(i)
        {
            var colinfo = colList[i];
            var id = colinfo.id;
            var idx = colinfo._index;
            var value = rowRow[idx];

            value = this._convertValueBySaveProp(value);

            value = colinfo._toXMLText(value);

            if (value != null)
            {
                if (value.length == 0)
                {
                    this.__writeXMLData(list, "<Col id=\"" + id + "\" />", depth);
                }
                else
                {
                    this.__writeXMLData(list, "<Col id=\"" + id + "\">" + value + "</Col>", depth);
                }
            }
        }
        nexacro.__forLoop(this, 0, colList.length, __writeColData_loopFn);
    };

    _pDatasetBase._saveXML = function (id, type, depth, savenan, saveinfinity, saveinvaliddate)
    {
        if (!depth) depth = 0;
        var saveId = (id ? id : this.id);

        var saveType = "N";
        switch (type)
        {
            case "A":
            case "a":
            case "all":
            case "All":
                saveType = "A";
                break;
            case "U":
            case "u":
            case "update":
            case "Update":
                saveType = "U";
                break;
            case "N":
            case "n":
            case "normal":
            case "Normal":
                saveType = "N";
                break;
            case "V":
            case "v":
            case "view":
            case "View":
                saveType = "V";
                break;
        }

        //var i;
        //var n;

        this._setSaveProp(savenan, saveinfinity, saveinvaliddate);

        var list = [];
        this.__writeXMLData(list, "<Dataset id=\"" + saveId + "\">", depth++);

        var constList = this._constVars;
        var colList = this.colinfos;
        if (constList.length + colList.length)
        {
            this.__writeXMLData(list, "<ColumnInfo>", depth++);

            if (constList.length)
            {
                function __saveXML_constcol_loopFn(i)
                {
                    var constVar = constList[i];
                    var colId = this._constVars.get_id(i);
                    var colVal = nexacro._encodeXml(constVar.value);
                    var colType = constVar.ntype;
                    var colSize = constVar.size;
                    //var strcoldatapath = constVar.datapath ? "\" datapath=\"" + constVar.datapath : "";

                    var typestr = "";
                    if (colType != null && colType != 9)
                        typestr += " type=\"" + constVar.type + "\"";
                    if (colSize > 0)
                        typestr += " size=\"" + colSize + "\"";

                    colVal = this._convertValueBySaveProp(colVal);

                    if (colVal != null)
                    {
                        this.__writeXMLData(list, "<ConstColumn id=\"" + colId + "\"" + typestr + " value=\"" + colVal + (constVar.datapath ? "\" datapath=\"" + constVar.datapath : "") + "\" />", depth);
                    }
                    else
                    {
                        this.__writeXMLData(list, "<ConstColumn id=\"" + colId + "\"" + typestr + (constVar.datapath ? " datapath=\"" + constVar.datapath + "\"" : "") + " />", depth);
                    }
                }
                nexacro.__forLoop(this, 0, constList.length, __saveXML_constcol_loopFn);
            }

            function __saveXML_colinfo_loopFn(i)
            {
                var colinfo = colList[i];
                var colId = colinfo.id;
                var colType = colinfo.ntype == 9 ? "STRING" : colinfo.type ? colinfo.type : nexacro.DataUtils.toTypeName(colinfo.ntype);
                var colSize = colinfo.ntype == 9 ? nexacro.DataUtils._default_sizes[1] : colinfo.size;
                var colProp = colinfo.prop;
                var strcoldatapath = colinfo.datapath ? "\" datapath=\"" + colinfo.datapath : "";

                if (colProp == "NONE" || colProp == null || (typeof colProp) == "number" || colProp == "")
                    this.__writeXMLData(list, "<Column id=\"" + colId + "\" type=\"" + colType + "\" size=\"" + colSize + strcoldatapath + "\" />", depth);
                else
                {
                    var colSumText = colinfo.sumtext;
                    if (colSumText)
                        this.__writeXMLData(list, "<Column id=\"" + colId + "\" type=\"" + colType + "\" size=\"" + colSize + "\" prop=\"" + colProp + "\" sumtext=\"" + colSumText + strcoldatapath + "\" />", depth);
                    else
                        this.__writeXMLData(list, "<Column id=\"" + colId + "\" type=\"" + colType + "\" size=\"" + colSize + "\" prop=\"" + colProp + strcoldatapath + "\" />", depth);
                }
            }
            nexacro.__forLoop(this, 0, colList.length, __saveXML_colinfo_loopFn);

            this.__writeXMLData(list, "</ColumnInfo>", --depth);
        }
        else
        {
            this.__writeXMLData(list, "<ColumnInfo />", depth);
        }

        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        if (rawRecords.length + delRecords.length)
        {
            this.__writeXMLData(list, "<Rows>", depth++);

            if (delRecords.length > 0 && (saveType == "A" || saveType == "U"))
            {
                function __saveXML_delrows_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(delRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeXMLCrudRow(list, rowRow, depth);
                    }
                }
                nexacro.__forLoop(this, 0, delRecords.length, __saveXML_delrows_loopFn);
            }

            if (saveType == "A")
            {
                function __saveXML_allrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeXMLCrudRow(list, rowRow, depth);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveXML_allrow_loopFn);
            }
            else if (saveType == "U")
            {
                function __saveXML_updaterow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 14)
                    {
                        this.__writeXMLCrudRow(list, rowRow, depth);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveXML_updaterow_loopFn);
            }
            else if (saveType == "V")
            {
                function __saveXML_viewrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(viewRecords[i]);
                    this.__writeXMLNormalRow(list, rowRow, depth);
                }
                nexacro.__forLoop(this, 0, viewRecords.length, __saveXML_viewrow_loopFn);
            }
            else
            {
                function __saveXML_normalrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 7)
                    {
                        this.__writeXMLNormalRow(list, rowRow, depth);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveXML_normalrow_loopFn);
            }

            this.__writeXMLData(list, "</Rows>", --depth);
        }
        else
        {
            this.__writeXMLData(list, "<Rows>", depth);
            this.__writeXMLData(list, "</Rows>", depth);
        }

        this.__writeXMLData(list, "</Dataset>", --depth);

        return list.join("\n");
    };

    _pDatasetBase.saveXML = function (id, type, savenan, saveinfinity, saveinvaliddate)
    {
        return this._saveXML(id, type, 0, savenan, saveinfinity, saveinvaliddate);
    };

    _pDatasetBase._saveJSON = function (id, type, depth, savenan, saveinfinity, saveinvaliddate)
    {
        if (!depth) depth = 0;
        var saveId = (id ? id : this.id);

        var saveType = "N";
        switch (type)
        {
            case "A":
            case "a":
            case "all":
            case "All":
                saveType = "A";
                break;
            case "U":
            case "u":
            case "update":
            case "Update":
                saveType = "U";
                break;
            case "N":
            case "n":
            case "normal":
            case "Normal":
                saveType = "N";
                break;
            case "V":
            case "v":
            case "view":
            case "View":
                saveType = "V";
                break;
        }

        this._setSaveProp(savenan, saveinfinity, saveinvaliddate);

        var comma = "";
        var list = [];
        this.__writeJSONData(list, "{", depth++);
        this.__writeJSONData(list, "\"id\": \"" + saveId + "\",", depth);

        var constList = this._constVars;
        var colList = this.colinfos;
        if (constList.length + colList.length)
        {
            this.__writeJSONData(list, "\"ColumnInfo\" :", depth);
            this.__writeJSONData(list, "{", depth++);

            if (constList.length)
            {
                this.__writeJSONData(list, "\"ConstColumn\":", depth);
                this.__writeJSONData(list, "[", depth++);

                function __saveJSON_constcol_loopFn(i)
                {
                    var constVar = constList[i];
                    var colId = this._constVars.get_id(i);
                    var colVal = constVar.value;
                    var colType = constVar.ntype;
                    var colSize = constVar.size;


                    var typestr = "";
                    if (colType != null && colType != 9)
                        typestr += "\"type\":\"" + constVar.type + "\"";
                    if (colSize > 0)
                        typestr += ", \"size\":\"" + colSize + "\"";

                    colVal = this._convertValueBySaveProp(colVal);
                    comma = "";
                    if (i < constList.length - 1) comma = ",";
                    if (colVal != null)
                    {
                        if (typeof colVal == "string")
                        {
                            colVal = colVal.replace(/[\\]/gi, '\\\\');
                            colVal = colVal.replace(/[\"]/gi, '\\"');
                        }
                        this.__writeJSONData(list, "{\"id\":\"" + colId + "\"," + typestr + ", \"value\":\"" + colVal + "\"}" + comma, depth);
                    }
                    else
                    {
                        this.__writeJSONData(list, "{\"id\":\"" + colId + "\"," + typestr + "}" + comma, depth);
                    }
                }
                nexacro.__forLoop(this, 0, constList.length, __saveJSON_constcol_loopFn);
                this.__writeJSONData(list, "],", --depth);
            }

            this.__writeJSONData(list, "\"Column\":", depth);
            this.__writeJSONData(list, "[", depth++);

            function __saveJSON_colinfo_loopFn(i)
            {
                var colinfo = colList[i];
                var colId = colinfo.id;
                var colType = colinfo.ntype == 9 ? "STRING" : colinfo.type ? colinfo.type : nexacro.DataUtils.toTypeName(colinfo.ntype);
                var colSize = colinfo.ntype == 9 ? nexacro.DataUtils._default_sizes[1] : colinfo.size;
                var colProp = colinfo.prop;

                comma = "";
                if (i < colList.length - 1) comma = ",";
                if (colProp == "NONE" || colProp == null || (typeof colProp) == "number" || colProp == "")
                    this.__writeJSONData(list, "{ \"id\":\"" + colId + "\", \"type\":\"" + colType + "\", \"size\":\"" + colSize + "\" }" + comma, depth);
                else
                {
                    var colSumText = colinfo.sumtext;
                    if (colSumText)
                        this.__writeJSONData(list, "{ \"id\":\"" + colId + "\", \"type\":\"" + colType + "\", \"size\":\"" + colSize + "\", \"prop\":\"" + colProp + "\", \"sumtext\":\"" + colSumText + "\" }" + comma, depth);
                    else
                        this.__writeJSONData(list, "{ \"id\":\"" + colId + "\", \"type\":\"" + colType + "\", \"size\":\"" + colSize + "\", \"prop\":\"" + colProp + "\" }" + comma, depth);
                }
            }
            nexacro.__forLoop(this, 0, colList.length, __saveJSON_colinfo_loopFn);

            this.__writeJSONData(list, "]", --depth);
            this.__writeJSONData(list, "}", --depth);
        }

        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        if (rawRecords.length + delRecords.length)
        {
            this.__addStringJSONData(list, ",");
            var is_comma = false;
            //if (list.length > 0) this.__writeJSONData(list, ",", --depth);
            this.__writeJSONData(list, "\"Rows\":", depth);
            this.__writeJSONData(list, "[", depth++);

            if (delRecords.length > 0 && (saveType == "A" || saveType == "U"))
            {
                function __saveJSON_delrows_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(delRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeJSONCrudRow(list, rowRow, depth);
                        if (i < delRecords.length - 1) this.__addStringJSONData(list, ",");
                        is_comma = true;
                    }
                }
                nexacro.__forLoop(this, 0, delRecords.length, __saveJSON_delrows_loopFn);
            }

            if (saveType == "A")
            {
                if (is_comma && rawRecords.length > 0)
                    this.__addStringJSONData(list, ",");
                function __saveJSON_allrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeJSONCrudRow(list, rowRow, depth);
                        if (i < rawRecords.length - 1) this.__addStringJSONData(list, ",");
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveJSON_allrow_loopFn);
            }
            else if (saveType == "U")
            {
                if (is_comma && rawRecords.length > 0)
                    this.__addStringJSONData(list, ",");
                var is_U_comma = false;
                function __saveJSON_updaterow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 14)
                    {
                        if (is_U_comma)
                            this.__addStringJSONData(list, ",");
                        this.__writeJSONCrudRow(list, rowRow, depth);
                        if (is_U_comma === false)
                            is_U_comma = true;
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveJSON_updaterow_loopFn);
            }
            else if (saveType == "V")
            {
                if (is_comma && viewRecords.length > 0)
                    this.__addStringJSONData(list, ",");
                function __saveJSON_viewrow_loopFn(i)
                {
                    comma = "";
                    var rowRow = this.__getParsedRow(viewRecords[i]);
                    if (i < viewRecords.length - 1) comma = ",";
                    this.__writeJSONData(list, "{", depth);
                    this.__writeJSONNormalRow(list, rowRow, depth);
                    this.__writeJSONData(list, "}" + comma, depth);
                }
                nexacro.__forLoop(this, 0, viewRecords.length, __saveJSON_viewrow_loopFn);
            }
            else
            {
                if (is_comma && rawRecords.length > 0)
                    this.__addStringJSONData(list, ",");
                function __saveJSON_normalrow_loopFn(i)
                {

                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    /*
                    if (rowRow._rtype & 7)
                    {
                        //this.__writeJSONNormalRow(list, rowRow, depth);

                        this.__writeJSONCrudRow(list, rowRow, depth);
                        if (i < rawRecords.length - 1) this.__addStringJSONData(list,",");
                    }
                    */
                    if (rowRow._rtype & 7)
                    {
                        comma = "";
                        if (i < rawRecords.length - 1) comma = ",";
                        this.__writeJSONData(list, "{", depth);
                        this.__writeJSONNormalRow(list, rowRow, depth);
                        this.__writeJSONData(list, "}" + comma, depth);
                    }

                }

                nexacro.__forLoop(this, 0, rawRecords.length, __saveJSON_normalrow_loopFn);
            }
            this.__writeJSONData(list, "]", --depth);
        }
        this.__writeJSONData(list, "}", --depth);
        return list.join("\n");
    };

    _pDatasetBase.__writeJSONData = function (list, str, depth)
    {
        list.push(this._TABS[depth] + str);
    };

    _pDatasetBase.__addStringJSONData = function (list, str, depth)
    {
        list[list.length - 1] += str;
    };

    _pDatasetBase.__writeJSONNormalRow = function (list, rowRow, depth)
    {
        this.__writeJSONRowData(list, "", rowRow, depth);
    };

    _pDatasetBase.__writeJSONCrudRow = function (list, rowRow, depth)
    {
        var buffer = "{";
        this.__writeJSONData(list, buffer, depth++);
        var comma = "";
        if (rowRow.length > 0)
            comma = ",";
        switch (rowRow._rtype)
        {
            case 1:
                // nexacro.Dataset.ROWTYPE_NORMAL
                buffer = "";
                break;
            case 2:
                // nexacro.Dataset.ROWTYPE_INSERT
                buffer = "\"_RowType_\":\"I\"" + comma;
                break;
            case 4:
                // nexacro.Dataset.ROWTYPE_UPDATE
                buffer = "\"_RowType_\":\"U\"" + comma;
                break;
            case 8:
                // nexacro.Dataset.ROWTYPE_DELETE
                buffer = "\"_RowType_\":\"D\"" + comma;
                break;
        }

        //this.__writeJSONData(list, buffer, depth);
        this.__writeJSONRowData(list, buffer, rowRow, depth);
        this.__writeJSONData(list, "}", --depth);

        if (rowRow._rtype == 4 && rowRow._orgrow)
        {
            comma = "";
            for (var i = 0, len = rowRow._orgrow.length; i < len; i++)
            {
                if (rowRow._orgrow[i]) { comma = ","; break; }
            }
            this.__addStringJSONData(list, ",");
            this.__writeJSONData(list, "{", depth++);
            buffer = "\"_RowType_\":\"O\"" + comma;
            this.__writeJSONRowData(list, buffer, rowRow._orgrow, depth);
            this.__writeJSONData(list, "}", --depth);
        }
    };

    _pDatasetBase.__writeJSONRowData = function (list, buffer, rowRow, depth)
    {
        var colList = this.colinfos;
        var need_comma = false;
        var comma = "";
        var str = buffer;
        function __writeColData_loopFn(i)
        {
            var colinfo = colList[i];
            var id = colinfo.id;
            var idx = colinfo._index;
            var value = rowRow[idx];

            value = this._convertValueBySaveProp(value);
            value = colinfo._toText(value);

            if (value)
            {
                value = value.replace(/\n/gi, '\\n');
                value = value.replace(/\t/gi, '\\t');
                value = value.replace(/[\\]/gi, '\\\\');
                value = value.replace(/[\"]/gi, '\\"');
            }

            if (value != null)
            {
                if (need_comma && i < colList.length) comma = ","; //this.__addStringJSONData(list,",");
                str += comma + " \"" + id + "\":\"" + value + "\"";
                need_comma = true;
            }
        }
        nexacro.__forLoop(this, 0, colList.length, __writeColData_loopFn);
        this.__writeJSONData(list, str, depth);
    };

    _pDatasetBase.saveJSON = function (id, type, savenan, saveinfinity, saveinvaliddate)
    {
        return this._saveJSON(id, type, 0, savenan, saveinfinity, saveinvaliddate);
    };


    //---------------------------------------------
    //---------------------------------------------
    // load JSON
    //---------------------------------------------
    _pDatasetBase.loadFromDataObject = function (/*dataobject, jsonpath*/)
    {
        var dataobj = this._binddataobject;
        if (dataobj)
        {
            //this._clearData();
            this._loadFromJSONObject(dataobj.data, this._p_dataobjectpath);
            this._endLoad(0, "SUCCESS", 0);
        }
    };

    _pDatasetBase._loadFromJSONObject = function (jsonobj, jsonpath)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        var _convertFn = this.__makeJSONDataMappingFunc;
        /*this._p_rowcount  = */this._loadRecordFromJSONObj(jsonobj, jsonpath, _convertFn);
        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;
        this._rootpathcache = null;

    };

    _pDatasetBase._loadRecordFromJSONObj = function (jsonobj, jsonpath, _convertFn)
    {
        var colList = this.colinfos;
        var dataobjectpath = jsonpath ? jsonpath : this._p_dataobjectpath;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var indexRecords = this._indexRecords ? this._indexRecords : this._indexRecords = [];
        var colCnt = colList.length;

        if (this.lazyParsing)
        {
            this.__loadConvertFn = _convertFn;
            this.__lazyParseRecordFn = this._lazyParseRecordFromJSONObject;
        }

        var templateRow = new Array(colCnt);
        function __loadRecordFromDOM_temp_loopFn(i)
        {
            var colinfo = colList[i];
            if (colinfo.ntype >= 4 && colinfo.ntype <= 7)
            {
                //templateRow[colinfo._index] = null;
                templateRow[colinfo._index] = undefined;
            }
        }
        nexacro.__forLoop(this, 0, colCnt, __loadRecordFromDOM_temp_loopFn);

        var pathJSON = nexacro._JSONPath(jsonobj, dataobjectpath);
        if (pathJSON)
        {
            //if (dataobjectpath == "$")
            //    pathJSON = pathJSON[0];
            this._clearData();//확인

            function __makeDatapathColumnArr_temp_loopFn(i)
            {
                var colinfo = colList[i];
                var datapath = colinfo.datapath;
                if (datapath)
                {
                    colinfo._datapath = datapath.match(/[^\]\[.]+/g);
                }
            }
            nexacro.__forLoop(this, 0, colCnt, __makeDatapathColumnArr_temp_loopFn);

            for (var i = 0, len = pathJSON.length; i < len; i++)
            {
                var item = pathJSON[i];
                var curRow = templateRow.slice(0, colCnt);
                curRow._orgidx = i;
                curRow._rawidx = i;//rawRecords.length;
                curRow._level = 0;
                curRow._rtype = 1;
                if (this.lazyParsing)
                {
                    curRow._data = JSON.parse(JSON.stringify(item));
                    if (!this._datarootpath)
                    {
                        var _dpath = item ? item._path : undefined;
                        if (_dpath)
                            this._datarootpath = _dpath.slice(0, _dpath.lastIndexOf("["));
                    }
                }
                else
                {
                    this.__parseRecordFromJSONObject(curRow, item);
                }
                indexRecords[i] = rawRecords[i] = curRow;
            }
        }
        else //no data
        {
            for (var k = 0, rawlen = rawRecords.length; k < rawlen; k++)
            {
                //var curRow = templateRow.slice(0, colCnt);
                delRecords[k] = rawRecords[k];
            }
            rawRecords.splice(0, k);
        }

        this._reFilter();
        this._resetSortGroup();
        //return this._viewRecords.length;
    };

    _pDatasetBase._getConstValueByDatapath = function (constvar, dataobject)
    {
        if (!dataobject)
            return undefined;
        var datapath = constvar.datapath;
        if (datapath)
        {
            if (constvar._value && !this._is_data_updating)
                return constvar._value;
            if (datapath[0] == "$" && dataobject.getObject())
                return constvar.value = constvar._value = nexacro._JSONPath(dataobject.getObject(), constvar.datapath)[0];
            else if (datapath[0] == "@")
            {
                var pathobj = nexacro._JSONPath(dataobject.getObject(), this._p_dataobjectpath)[0];
                if (pathobj)
                {
                    var arr = datapath.match(/[^\]\[.]+/g);
                    for (var i = 1, len = arr.length; i < len; i++)
                    {
                        pathobj = pathobj[arr[i]];
                        if (!pathobj)
                            break;
                    }
                }
                /*
                for (var match, matcher = /^([^\.\[]+)|\.([^\.\[]+)|\["([^"]+)"\]|\[(\d+)\]/g; match = matcher.exec(datapath.slice(1, datapath.length));)
                {
                    pathobj = pathobj[Array.from(match).slice(1).filter(function (x) { return x !== undefined; })[0]];
                }*/
                if (pathobj && pathobj != "object")
                {
                    pathobj = this._getValueByColtype(pathobj, constvar.ntype);
                }
                return constvar.value = constvar._value = pathobj ? pathobj : "";
            }
        }
        return undefined;
    };

    _pDatasetBase._isTwowayDataobjectBindMode = function ()
    {
        if (this._p_dataobjectbindmode == "twoway" && !this._is_data_updating && this._binddataobject)
        {
            return true;
        }
        return false;
    };

    _pDatasetBase.loadJSON = function (strJSON, bClear)
    {
        return this._loadFromJSONStr(strJSON, bClear);
    };

    _pDatasetBase._loadFromJSONStr = function (JSONStr, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;
        this._bWorkingstatus = true;

        if (JSONStr)
        {
            this._bWorkingstatus = true;

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            //var JSON_parse_pos;

            this.__loadFromJSONStr(JSONStr, 0, -1, bOrgLayout, bClear);

            if (this.colinfos)
            {
                this._reFilter();
                this._resetSortGroup();
            }

            if (this._eventstat)
            {
                this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
                else
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;

            return this._p_rowcount;
        }
    };

    _pDatasetBase._loadFromJSONObj = function (jsonobj, bClear, bAppend, errorcode, errormsg, bContents)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = bContents ? false : this._p_useclientlayout;
        this._bWorkingstatus = true;

        if (jsonobj)
        {
            this._bWorkingstatus = true;

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            var JSON_parse_pos;

            this.__loadFromJSONObj(jsonobj, 0, -1, bOrgLayout, bClear, bContents);

            if (this.colinfos)
            {
                this._reFilter();
                this._resetSortGroup();
            }

            if (this._eventstat)
            {
                this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
                else
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;

            return this._p_rowcount;
        }
    };

    _pDatasetBase.__loadFromJSONStr = function (JSONStr, JSON_parse_pos, loadCnt, bOrgLayout, bClear)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        var jsonobj = JSON.parse(JSONStr);
        if (!JSON_parse_pos)
            JSON_parse_pos = 0;

        if (!loadCnt)
            loadCnt = -1;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        if (!JSONStr)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            return 0;
        }
        var rowsobj = null;

        if (bOrgLayout)
            this._setConstColInfoFromJSONObj(jsonobj);
        else
        {
            this._setColInfoFromJSONObj(jsonobj);
        }
        rowsobj = jsonobj.Rows;

        this._loadRecordFromJSONObject(rowsobj);

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return JSON_parse_pos;
    };

    _pDatasetBase.__loadFromJSONObj = function (jsonobj, JSON_parse_pos, loadCnt, bOrgLayout, bClear, bContents)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (!loadCnt)
            loadCnt = -1;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        if (!jsonobj)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            return 0;
        }
        var rowsobj = null;

        if (bOrgLayout)
            this._setConstColInfoFromJSONObj(jsonobj);
        else
            this._setColInfoFromJSONObj(jsonobj);

        rowsobj = jsonobj.Rows;
        if (rowsobj)
            this._loadRecordFromJSONObject(rowsobj, bContents);

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return JSON_parse_pos;
    };

    _pDatasetBase._setConstColInfoFromJSONObj = function (jsonobj)
    {
        var JSON_parse_pos = 0;
        var colInfo = jsonobj.ColumnInfo;
        if (colInfo)
        {
            var const_idx = 0;
            function ___loadFromJSONObj_const_loopFn()
            {
                var constVar = colInfo.ConstColumn;

                if (nexacro._isArray(constVar))
                    constVar = constVar[const_idx++];

                if (constVar == null)
                    return true;

                var id = constVar.id;
                var value = constVar.value;
                if (id.length)
                {
                    var type = constVar.type;
                    var size = constVar.size;
                    var datapath = constVar.datapath;
                    this._addConstColumn(id, value, type, size, datapath);
                }
                return false;
            }
            nexacro.__whileLoop(this, ___loadFromJSONObj_const_loopFn);
        }
        return JSON_parse_pos;
    };

    _pDatasetBase._setColInfoFromJSONObj = function (jsonobj)
    {
        var JSON_parse_pos = 0;
        var colInfo = jsonobj.ColumnInfo;
        if (colInfo)
        {
            var const_idx = 0;
            function ___loadFromJSONObj_const_loopFn()
            {
                var constVar = colInfo.ConstColumn;

                if (nexacro._isArray(constVar))
                    constVar = constVar[const_idx++];

                if (constVar == null)
                    return true;

                var id = constVar.id;
                var value = constVar.value;
                if (id.length)
                {
                    var type = constVar.type;
                    var size = constVar.size;
                    var datapath = constVar.datapath;
                    this._addConstColumn(id, value, type, size, datapath);
                }
                return false;
            }
            nexacro.__whileLoop(this, ___loadFromJSONObj_const_loopFn);

            var colinfo_idx = 0;
            function __loadFromJSONObj_col_loopFn()
            {
                var col = colInfo.Column;

                if (nexacro._isArray(col))
                    col = col[colinfo_idx++];

                if (col == null)
                    return true;

                var id = col.id;
                if (id && id.length)
                {
                    var type = col.type;
                    var size = col.size;
                    var prop = col.prop;
                    var sumtext = col.sumtext;
                    var datapath = col.datapath;
                    this._addColumn(id, type, size, prop, sumtext, datapath);
                }
            }
            nexacro.__whileLoop(this, __loadFromJSONObj_col_loopFn);
        }
        return JSON_parse_pos;
    };

    _pDatasetBase._loadRecordFromJSONObject = function (rowsobj, bContents)
    {
        var colList = this.colinfos;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var colCnt = colList.length;
        //var loadCnt = 0;

        var templateRow = new Array(colCnt);
        function __loadRecord_temp_loopFn(i)
        {
            var colinfo = colList[i];
            if (colinfo.ntype >= 4 && colinfo.ntype <= 7)
            {
                templateRow[colinfo._index] = undefined;
            }
        }

        nexacro.__forLoop(this, 0, colCnt, __loadRecord_temp_loopFn);

        var rowidx = rawRecords.length + delRecords.length;
        var i = 0;
        function __loadFromJSONObj_row_loopFn()
        {
            var rowInfo = rowsobj[i];
            if (rowInfo == null)
            {
                return true;
            }

            var /*_rowtypeid,*/ _rowtypevalue, _rowCol = [];
            for (var key in rowInfo)
            {
                if (key == "_RowType_")
                {
                    //_rowtypeid = key;
                    _rowtypevalue = rowInfo[key];
                }
                else
                {
                    var value = rowInfo[key];
                    if (value && nexacro._isString(value) && !bContents)
                    {
                        value = value.replace(/\\n/gi, '\n');
                        value = value.replace(/\\t/gi, '\t');
                    }
                    _rowCol.push({ "id": key, "value": value });
                }
            }

            //var rowStr = rowInfo[0];
            //var attrStr = rowInfo[1];

            var curRow = templateRow.slice(0, colCnt);
            curRow._orgidx = rowidx;
            curRow._rawidx = rawRecords.length;
            curRow._level = 0;

            rowidx++;
            i++;

            if (!_rowtypevalue)
            {
                curRow._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
            }
            else
            {
                var typeChar = _rowtypevalue;
                if (typeChar == 'I' || typeChar == 'i')
                {
                    curRow._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
                }
                else if (typeChar == 'U' || typeChar == 'u')
                {
                    curRow._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
                }
                else if (typeChar == 'O' || typeChar == 'o')
                {
                    curRow._rtype = -1; //nexacro.Dataset.ROWTYPE_ORIGINAL;
                }
                else if (typeChar == 'D' || typeChar == 'd')
                {
                    curRow._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
                }
                else
                {
                    curRow._rtype = 1;  //nexacro.Dataset.ROWTYPE_NORMAL;
                }
            }

            var row_col_idx = 0;
            function __loadFromJSONObj_colvalue_loopFn()
            {
                if (_rowCol)
                {
                    var colInfo = _rowCol[row_col_idx++];
                    if (colInfo == null)
                    {
                        return true;
                    }

                    var id = colInfo.id;
                    var colinfo = colList[id];
                    if (colinfo)
                    {
                        curRow[colinfo._index] = colinfo._fromText(colInfo.value);
                    }
                    return false;
                }
                return true;
            }
            nexacro.__whileLoop(this, __loadFromJSONObj_colvalue_loopFn);

            if (curRow._rtype == 8) //nexacro.Dataset.ROWTYPE_DELETE
            {
                delRecords[delRecords.length] = curRow;
            }
            else if (curRow._rtype == -1)//nexacro.Dataset.ROWTYPE_ORIGINAL;
            {
                rawRecords[rawRecords.length - 1]._orgrow = curRow;
            }
            else
            {
                rawRecords[rawRecords.length] = curRow;
            }

            //if ((rawRecords.length - delRecords.length) == loadCnt)
            //    return true;
        }
        nexacro.__whileLoop(this, __loadFromJSONObj_row_loopFn);

        return rowidx;
    };


    _pDatasetBase._getValueFromDataObject = function (obj, arrDatapath, colinfo)
    {
        var ret;
        var type = colinfo.ntype;
        if (arrDatapath[0] == "$")
        {
            var dataobj = this._binddataobject;

            var datapath = colinfo.datapath;
            var jsonpathobj = dataobj.data;
            if (jsonpathobj)
                ret = this._getValueFromRootJSON(jsonpathobj, datapath, type);
        }
        else if (arrDatapath[0] == "@")
            ret = this._getValueFromArray(obj, arrDatapath, type);
        return ret;

    };

    _pDatasetBase._getValueByColtype = function (value, coltype)
    {
        var ret = value;
        switch (coltype)
        {
            case 1:
                ret = "" + ret;
                break;
            case 2: //int
                ret = nexacro.DataUtils.toIntFromText(ret);
                break;
            case 3: //float
                ret = nexacro.DataUtils.toFloatFromText(ret);
                break;
            case 4: //bigdecimal
                ret = nexacro.DataUtils.toDecimalFromText(ret);
                break;
            case 5: //date
                ret = nexacro.DataUtils.toDateFromText(ret);
                break;
            case 6: //time
                ret = nexacro.DataUtils.toTimeFromText(ret);
                break;
            case 7: //datetime
                ret = nexacro.DataUtils.toDateTimeFromText(ret);
                break;
            case 8: //blob
                ret = nexacro.DataUtils.toBlobFromText(ret);
                break;
            default:
                // variant
                ret = nexacro.DataUtils.toTextFromVariant(ret);
                break;
        }
        return ret;
    };

    _pDatasetBase._getValueFromArray = function (obj, arr, coltype)
    {
        var ret = obj;
        for (var i = 1, len = arr.length; i < len; i++)
        {
            if (ret)
            {
                ret = ret[arr[i]];
            }
        }
        if (ret != null)
        {
            if (coltype == 1 && typeof ret == "object")// && ret.length == undefined)
                ret = JSON.stringify(ret);
            ret = this._getValueByColtype(ret, coltype);
        }
        return ret;// ? ret : "";
    };

    _pDatasetBase._getValueFromRootJSON = function (obj, datapath, coltype)
    {
        var ret;
        //var ret = obj;
        var rootpathcache = this._rootpathcache ? this._rootpathcache : this._rootpathcache = {};
        if (rootpathcache[datapath])
            ret = rootpathcache[datapath];
        else
        {
            ret = nexacro._JSONPath(obj, datapath)[0];
            ret = this._getValueByColtype(ret, coltype);
        } //JSONPath 방식
        return ret ? ret : "";
    };

    //_pDatasetBase.__makeJSONDataMappingFunc = function (rowRow, rowData)
    _pDatasetBase.__parseRecordFromJSONObject = function (rowRow, rowData)
    {
        var colList = this.colinfos;
        var colCnt = colList.length;
        for (var j = 0; j < colCnt; j++)
        {
            var colinfo = colList[j];
            var arrDatapath = colinfo._datapath;
            if (!arrDatapath && colinfo.datapath)
            {
                arrDatapath = colinfo._datapath = colinfo.datapath.match(/[^\]\[.]+/g);
            }
            if (arrDatapath)
            {
                rowRow[j] = this._getValueFromDataObject(rowData, arrDatapath, colinfo);
            }
            else
                rowRow[j] = "";
        }
    };

    // for lazy JSON load
    _pDatasetBase._lazyParseRecordFromJSONObject = function (rowRow, _convertFn)
    {
        var rowData = rowRow._data;
        //_convertFn(rowRow, rowData);
        this.__parseRecordFromJSONObject(rowRow, rowData);
        // rowData.length = 0;
        delete rowRow._data;
        //rowData = null;
        // rowData.length = 0;

        if (rowRow._orgdata)
        {
            rowData = rowRow._orgdata;
            this.__parseRecordFromJSONObject(rowRow, rowData);
            delete rowRow._orgdata;
            rowRow._orgrow = rowData;
        }
    };

    //---------------------------------------------
    //---------------------------------------------
    // load SSV
    //---------------------------------------------
    _pDatasetBase.__makeDataConvertFunc = function (type)
    {
        var colinfos = this.colinfos;
        var colLen = colinfos.length;

        var expr = "(function () { return function (target, arr) { ";
        var checkud = false;
        if (type == "S")
        {
            expr += " var ud = String.fromCharCode(3); target.length =" + colLen + ";";
            checkud = true;
        }

        for (var idx = 0; idx < colLen; idx++)
        {
            var colinfo = colinfos[idx];
            if (checkud)
                expr += " if (ud != arr[" + idx + "]) ";

            switch (colinfo.ntype)
            {
                case 1:
                    expr += "target[" + idx + "] = arr[" + idx + "]; ";
                    break;
                case 2:
                    // int
                    expr += "target[" + idx + "] = nexacro.DataUtils.toIntFromText(arr[" + idx + "]); ";
                    break;
                case 3:
                    // float
                    expr += "target[" + idx + "] = nexacro.DataUtils.toFloatFromText(arr[" + idx + "]); ";
                    break;
                case 4:
                    // bigdecimal
                    expr += "target[" + idx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
                    break;
                case 5:
                    // date
                    expr += "target[" + idx + "] = nexacro.DataUtils.toDateFromText(arr[" + idx + "]); ";
                    break;
                case 6:
                    // time
                    expr += "target[" + idx + "] = nexacro.DataUtils.toTimeFromText(arr[" + idx + "]); ";
                    break;
                case 7:
                    // datetime
                    expr += "target[" + idx + "] = nexacro.DataUtils.toDateTimeFromText(arr[" + idx + "]); ";
                    break;
                case 8:
                    // blob
                    expr += "target[" + idx + "] = nexacro.DataUtils.toBlobFromText(arr[" + idx + "]); ";
                    break;
                default:
                    // variant
                    expr += "target[" + idx + "] = nexacro.DataUtils.toTextFromvariant(arr[" + idx + "]); ";
                    break;
            }
        }
        expr += " }; })();";

        return nexacro._executeGlobalEvalStr(expr);
    };

    _pDatasetBase.__makeDataMappingFunc = function (colArr, colCnt, type)
    {
        var i;
        var idMap = {};
        for (i = 0; i < colCnt; i++)
        {
            var colItem = colArr[i].split(":");
            var id = colItem[0];
            idMap[id] = i;
        }

        var colinfos = this.colinfos;
        var colLen = colinfos.length;
        var expr = "(function () { return function (target, arr) { ";

        var checkud = false;
        if (type == "S")
        {
            expr += " var ud = String.fromCharCode(3); target.length =" + colLen + ";";
            checkud = true;
        }

        for (i = 0; i < colLen; i++)
        {
            var colinfo = colinfos[i];
            var idx = idMap[colinfo.id];
            var colidx = colinfo._index;

            if (idx != null)
            {
                if (checkud)
                    expr += " if (ud != arr[" + idx + "]) ";

                switch (colinfo.ntype)
                {
                    case 1:
                        expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        break;
                    case 2:
                        // int
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toIntFromText(arr[" + idx + "]); ";
                        break;
                    case 3:
                        // float
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toFloatFromText(arr[" + idx + "]); ";
                        break;
                    case 4:
                        // bigdecimal
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
                        break;
                    case 5:
                        // date
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDateFromText(arr[" + idx + "]); ";
                        break;
                    case 6:
                        // time
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toTimeFromText(arr[" + idx + "]); ";
                        break;
                    case 7:
                        // datetime
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDateTimeFromText(arr[" + idx + "]); ";
                        break;
                    case 8:
                        // blob
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toBlobFromText(arr[" + idx + "]); ";
                        break;
                    default:
                        // variant
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toTextFromvariant(arr[" + idx + "]); ";
                        break;
                }
            }
        }
        expr += "}; })();";

        return nexacro._executeGlobalEvalStr(expr);
    };

    _pDatasetBase.__ssvSetConstColInfo = function (strColInfo)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();
        var _ud_ = String.fromCharCode(3);

        var colArr = strColInfo.split(_cs_);
        var colCnt = colArr.length;
        function __ssvSetConstColInfo_loopFn(i)
        {
            var colStr = colArr[i];
            var colItem = colStr.split("=");
            var colInfo = colItem[0];
            if (colInfo && colInfo != "_Const_")
            {
                var value = colItem[1];
                var colInfoArr = colInfo.split(":");
                var id = colInfoArr[0];
                var type = colInfoArr[1];
                var size = 0;
                if (type)
                {
                    var bSIdx = type.indexOf("(");
                    if (bSIdx > -1)
                    {
                        size = type.substring(bSIdx + 1, type.indexOf(")", bSIdx + 1)) | 0;
                        type = type.substring(0, bSIdx);
                    }
                }

                if (value == _ud_)
                    value = undefined;
                if (this._p_useclientlayout)
                {
                    var constVar = this._constVars[id];
                    if (constVar != null && constVar.value != value)
                    {
                        if (constVar._value)
                            constVar._value = undefined;

                        constVar.value = value;
                    }
                }
                else
                {
                    this._addConstColumn(id, value, type, size);
                }
            }
        }
        nexacro.__forLoop(this, 0, colCnt, __ssvSetConstColInfo_loopFn);
    };

    _pDatasetBase.__ssvSetColInfo = function (strColInfo)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();
        var colArr = strColInfo.split(_cs_);
        var colCnt = colArr.length;
        function __ssvSetColInfo_loopFn(i)
        {
            var colStr = colArr[i];
            var colItem = colStr.split(":");
            var id = colItem[0];
            var type, size;
            if (id && id != "_RowType_")
            {
                var colInfo = colItem[1];
                if (colInfo)
                {
                    var sidx = colInfo.indexOf("(");
                    if (sidx > -1)
                    {
                        type = colInfo.substring(0, sidx).toUpperCase();
                        size = colInfo.substring(sidx + 1, colInfo.indexOf(")", sidx + 1)) | 0;
                    }
                    else
                    {
                        type = colInfo;
                    }
                }
                else
                {
                    type = "STRING";
                    size = 256;
                }
                this._addColumn(id, type, size, colItem[2], colItem[3]);
            }
        }
        nexacro.__forLoop(this, 0, colCnt, __ssvSetColInfo_loopFn);
        return colCnt;
    };

    _pDatasetBase._loadFromSSVArray = function (ssvColLines, ssvLines, curIdx, loadCnt, bOrgLayout, bClear, convertFn)
    {
        //var _cs_ = String.fromCharCode(31);

        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        var _convertFn = convertFn ? convertFn : this._setColInfoFromSSVLines(ssvColLines, bOrgLayout);

        if (!_convertFn)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;
            return curIdx;
        }

        curIdx = this._loadRecordFromSSVLines(ssvLines, curIdx, loadCnt, _convertFn);

        this._viewRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return curIdx;
    };

    _pDatasetBase._loadFromSSVUint8Array = function (data, offset, ssvColLines, loadCnt, bOrgLayout, bClear, convertFn)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        var _convertFn = convertFn ? convertFn : this._setColInfoFromSSVLines(ssvColLines, bOrgLayout);

        if (!_convertFn)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;
            return [++offset];
            //return offset;
        }

        var pos = offset;//, length = data.length;
        //curIdx = this._loadRecordFromSSVLines(ssvLines, curIdx, loadCnt, _convertFn);

        var ret = this._loadRecordFromSSVUint8Array(data, pos, loadCnt, _convertFn);
        //pos = ret[0];

        this._viewRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        //return pos;
        return ret;
    };

    _pDatasetBase._getColLinesFromSSVLines = function (ssvLines, curIdx)
    {
        var lineCnt = ssvLines.length;
        var idx = curIdx;

        if (idx < lineCnt && ssvLines[idx].substring(0, 7) == "_Const_")
        {
            idx++;
        }
        if (idx < lineCnt && ssvLines[idx].substring(0, 9) == "_RowType_")
        {
            idx++;
        }
        if (idx < lineCnt && ssvLines[idx].substring(0, 7) == "_Const_")
        {
            idx++;
        }

        return ssvLines.slice(curIdx, idx);
    };

    _pDatasetBase._getColLinesFromSSVLines_with_arraybuffer = function (data, offset, sep, colLines)
    {
        if (sep == undefined)
        {
            sep = nexacro._getSSVRecordSeparator();
        }

        var pos = offset;//, length = data.length;
        var curStr, cinfo;
        while (1)
        {
            cinfo = nexacro._Array2DataUtil.substringOf(data, pos, sep);
            curStr = cinfo.string;
            /* sonarQube 정적분석결과 검출되어 원래코드 주석 후 아래코드 적용 */
            if (curStr.substring(0, 7) == "_Const_" || curStr.substring(0, 9) == "_RowType_")
            {
                colLines.push(curStr);
                pos = cinfo.nextOffset;
            }
            else
                break;

            /*
            if (curStr.substring(0, 7) == "_Const_") 
            {
                colLines.push(curStr);
                pos = cinfo.nextOffset;
            }
            else if (curStr.substring(0, 9) == "_RowType_") 
            {
                colLines.push(curStr);
                pos = cinfo.nextOffset;
            }
            else
                break;
            */
        }

        return pos;
    };

    _pDatasetBase._setColInfoFromSSVLines = function (colLines, bOrgLayout)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();

        if (!colLines || colLines.length == 0)
            return null;

        var _convertFn = null;
        var lineCnt = colLines.length;
        var idx = 0;
        if (bOrgLayout)
        {
            if (idx < lineCnt && colLines[idx].substring(0, 7) == "_Const_")
            {
                this.__ssvSetConstColInfo(colLines[idx]);
                idx++;
            }
            if (idx > lineCnt)
            {
                return null;
            }
            while (idx < lineCnt && colLines[idx].substring(0, 9) != "_RowType_")
            {
                idx++;
            }
            if (idx < lineCnt && colLines[idx].substring(0, 7) == "_Const_")
            {
                this.__ssvSetConstColInfo(colLines[idx]);
                idx++;
            }
            if (idx >= lineCnt)
            {
                return null;
            }
            var colArr = colLines[idx].split(_cs_);
            colArr.shift();
            _convertFn = this.__makeDataMappingFunc(colArr, colArr.length, "S");
        }
        else
        {
            if (idx < lineCnt && colLines[idx].substring(0, 7) == "_Const_")
            {
                this.__ssvSetConstColInfo(colLines[idx]);
                idx++;
            }
            if (idx > lineCnt)
            {
                return null;
            }
            if (idx < lineCnt && colLines[idx].substring(0, 9) == "_RowType_")
            {
                this.__ssvSetColInfo(colLines[idx]);
                idx++;
            }
            if (idx > lineCnt)
            {
                return null;
            }
            if (idx < lineCnt && colLines[idx].substring(0, 7) == "_Const_")
            {
                this.__ssvSetConstColInfo(colLines[idx]);
                idx++;
            }
            if (idx > lineCnt)
            {
                return null;
            }
            _convertFn = this.__makeDataConvertFunc("S");
        }

        return _convertFn;
    };

    // for lazy load
    _pDatasetBase._lazyParseRecordFromSSVLine = function (rowRow, _convertFn)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();

        var rowData = rowRow._data.split(_cs_);
        rowData.shift();
        _convertFn(rowRow, rowData);
        rowData.length = 0;
        delete rowRow._data;
        rowData.length = 0;

        if (rowRow._orgdata)
        {
            rowData = rowRow._orgdata.split(_cs_);
            rowData.shift();
            delete rowRow._orgdata;
            _convertFn(rowData, rowData);
            rowRow._orgrow = rowData;
        }

    };

    _pDatasetBase._lazyParseRecordFromSSVLine_with_Uint8Array = function (rowRow, _convertFn)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();

        var dataArray = rowRow._data;
        var cinfo = nexacro._Array2DataUtil.substring(dataArray, 0);
        var curData = cinfo.string;

        var rowData = curData.split(_cs_);
        rowData.shift();
        _convertFn(rowRow, rowData);
        rowData.length = 0;
        delete rowRow._data;
        rowData.length = 0;

        if (rowRow._orgdata)
        {
            var orgDataArray = rowRow._orgdata;
            var oinfo = nexacro._Array2DataUtil.substring(orgDataArray, 0);
            var orgData = oinfo.string;

            rowData = orgData.split(_cs_);
            rowData.shift();
            delete rowRow._orgdata;
            _convertFn(rowData, rowData);
            rowRow._orgrow = rowData;
            //orgData = null;
            //oinfo = null;
        }
        //curData = null;
        //cinfo = null;
    };

    _pDatasetBase._loadRecordFromSSVLines = function (ssvLines, curIdx, loadCnt, _convertFn)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();
        //var _ud_ = String.fromCharCode(3); // undefined   moved by comnik 20150326

        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var lazyParsing = this.lazyParsing;

        // save for lazy parsing
        if (lazyParsing)
        {
            this.__loadConvertFn = _convertFn;
            this.__lazyParseRecordFn = this._lazyParseRecordFromSSVLine;
        }

        var rowidx = rawRecords.length + delRecords.length;

        var prefix = '', typePos = 0;

        if (lazyParsing)
        {
            function __lazyLoadRecordFromSSVLines_loopFn(idx)
            {
                var curLine = ssvLines[idx];
                if (curLine == "")
                {
                    return true;
                }

                curLine = prefix + curLine;
                // lazy parsing
                var curData;
                var typeChar = curLine.charAt(typePos);
                if (typeChar == 'I' || typeChar == 'i')
                {
                    curData = [];
                    curData._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'U' || typeChar == 'u')
                {
                    curData = [];
                    curData._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'D' || typeChar == 'd')
                {
                    if (curLine.indexOf("Dataset:") == typePos)
                        return true;

                    curData = [];
                    curData._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    delRecords[delRecords.length] = curData;
                }
                else if (typeChar == 'O' || typeChar == 'o')
                {
                    rawRecords[rawRecords.length - 1]._orgdata = curLine;
                }
                else
                {
                    curData = [];
                    curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    rawRecords[rawRecords.length] = curData;
                }

                rowidx++;
                if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
                    return true;
            }
            curIdx = nexacro.__forLoop(this, curIdx, ssvLines.length, __lazyLoadRecordFromSSVLines_loopFn);
        }
        else
        {
            function __loadRecordFromSSVLines_loopFn(idx)
            {
                var curLine = ssvLines[idx];
                if (curLine == "")
                {
                    return true;
                }

                curLine = prefix + curLine;
                // normal load
                var curData = [];
                var curSSVData = curLine.split(_cs_);
                var typeChar = curSSVData.shift().charAt(typePos);
                _convertFn(curData, curSSVData);

                if (typeChar == 'I' || typeChar == 'i')
                {
                    curData._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'U' || typeChar == 'u')
                {
                    curData._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'D' || typeChar == 'd')
                {
                    curData._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    delRecords[delRecords.length] = curData;
                }
                else if (typeChar == 'O' || typeChar == 'o')
                {
                    rawRecords[rawRecords.length - 1]._orgrow = curData;
                }
                else
                {
                    curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    rawRecords[rawRecords.length] = curData;
                }

                rowidx++;
                if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
                    return true;
            }
            curIdx = nexacro.__forLoop(this, curIdx, ssvLines.length, __loadRecordFromSSVLines_loopFn);
        }

        return curIdx;
    };

    _pDatasetBase._loadRecordFromSSVUint8Array = function (data, offset, loadCnt, _convertFn)
    {
        var _rs_ = nexacro._getSSVRecordSeparator();
        //var _cs_ = nexacro._getSSVUnitSeparator();

        var pos = offset,/* length = data.length,*/ cinfo, tinfo;
        var nullRecord = false;

        var rs_code_array = [];
        for (var i = 0, rslen = _rs_.length; i < rslen; i++)
        {
            rs_code_array[i] = _rs_.charCodeAt(i);
        }
        //var rs_code_len = rs_code_array.length;

        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var lazyParsing = this.lazyParsing;

        // save for lazy parsing
        if (lazyParsing)
        {
            this.__loadConvertFn = _convertFn;
            this.__lazyParseRecordFn = this._lazyParseRecordFromSSVLine_with_Uint8Array;
        }

        var rowidx = rawRecords.length + delRecords.length;

        //var prefix = '', typePos = 0;

        if (lazyParsing)
        {
            function __lazyLoadRecordFromUint8Array_loopFn()
            {
                var curLine;
                tinfo = nexacro._Array2DataUtil.indexOf(data, pos, rs_code_array);

                if (tinfo.index < 0)
                    return true;

                if (tinfo.index - pos == 0) // null record
                {
                    pos = (tinfo.index + tinfo.byteLength);
                    nullRecord = true;
                    return true;
                }
                else
                {
                    curLine = data.subarray(pos, tinfo.index);
                }

                // lazy parsing
                var curData;
                cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                var typeChar = cinfo.string;

                if (typeChar == 'I' || typeChar == 'i')
                {
                    curData = [];
                    curData._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'U' || typeChar == 'u')
                {
                    curData = [];
                    curData._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'D' || typeChar == 'd')
                {
                    cinfo = nexacro._Array2DataUtil.substr(data, pos, 8);
                    var substr = cinfo.string;
                    if (substr.toUpperCase() == "DATASET:")
                        return true;

                    curData = [];
                    curData._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    delRecords[delRecords.length] = curData;
                }
                else if (typeChar == 'O' || typeChar == 'o')
                {
                    rawRecords[rawRecords.length - 1]._orgdata = curLine;
                }
                else
                {
                    curData = [];
                    curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    curData._data = curLine;
                    rawRecords[rawRecords.length] = curData;
                }

                pos = tinfo.index + tinfo.byteLength;

                rowidx++;
                if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
                    return true;
            }
            nexacro.__whileLoop(this, __lazyLoadRecordFromUint8Array_loopFn);
        }
        else
        {
            /*function __loadRecordFromUtf8Array_loopFn()
            {
                var curLine = nexacro._substringFromUtf8ArrayOf(buf, parse_info, _rs_);
                if (curLine == "")
                {
                    return true;
                }

                curLine = prefix + curLine;
                // normal load
                var curData = [];
                var curSSVData = curLine.split(_cs_);
                var typeChar = curSSVData.shift().charAt(typePos);
                _convertFn(curData, curSSVData);

                if (typeChar == 'I' || typeChar == 'i')
                {
                    curData._rtype = 2; //nexacro.Dataset.ROWTYPE_INSERT;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'U' || typeChar == 'u')
                {
                    curData._rtype = 4; //nexacro.Dataset.ROWTYPE_UPDATE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    rawRecords[rawRecords.length] = curData;
                }
                else if (typeChar == 'D' || typeChar == 'd')
                {
                    curData._rtype = 8; //nexacro.Dataset.ROWTYPE_DELETE;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    delRecords[delRecords.length] = curData;
                }
                else if (typeChar == 'O' || typeChar == 'o')
                {
                    rawRecords[rawRecords.length - 1]._orgrow = curData;
                }
                else
                {
                    curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                    curData._orgidx = rowidx;
                    curData._rawidx = rawRecords.length;
                    curData._level = 0;
                    rawRecords[rawRecords.length] = curData;
                }

                rowidx++;
                if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
                    return true;
            }
             nexacro.__whileLoop(this, __loadRecordFromUtf8Array_loopFn);*/
        }

        return [pos, nullRecord];
    };

    _pDatasetBase.loadFromSSVArray = function (ssvLine, lineCnt, curIdx, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;

        if (ssvLine)
        {
            this._bWorkingstatus = true;

            while (ssvLine[curIdx].substring(0, 7) != "Dataset")
            {
                curIdx++;
            }

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            if (curIdx < lineCnt)
            {
                curIdx++;
                var ssvColLines = this._getColLinesFromSSVLines(ssvLine, curIdx);
                curIdx += ssvColLines.length;
                if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
                {
                    curIdx = this._loadFromSSVArray(ssvColLines, ssvLine, curIdx, this.firefirstcount, bOrgLayout, bClear);
                    if (this.firefirstcount == this._p_rowcount)
                    {
                        this._reFilter();
                        this._resetSortGroup();
                        this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                        this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        this._p_rowposition = 0;
                        curIdx++;
                        curIdx = this._loadFromSSVArray(ssvColLines, ssvLine, curIdx, -1, bOrgLayout, false);
                    }
                }
                else
                {
                    curIdx = this._loadFromSSVArray(ssvColLines, ssvLine, curIdx, -1, bOrgLayout, bClear);
                }

                if (this.colinfos)
                {
                    this._reFilter();
                    this._resetSortGroup();
                }

                if (this._eventstat)
                {
                    this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                    if (this._viewRecords && this._viewRecords.length > 0)
                    {
                        this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                }
                else if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._p_rowposition = 0;
                }
            }

            this._bWorkingstatus = false;

            return curIdx;
        }
    };

    _pDatasetBase.loadSSVFromUint8Array = function (data, offset, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;

        if (data)
        {
            this._bWorkingstatus = true;

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            var _rs_ = nexacro._getSSVRecordSeparator();
            //var _cs_ = nexacro._getSSVUnitSeparator();

            // get column info
            var pos = offset/*, length = data.length*/, colLines = [];
            pos = this._getColLinesFromSSVLines_with_arraybuffer(data, pos, _rs_, colLines);
            var ret = [];
            if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
            {
                ret = this._loadFromSSVUint8Array(data, pos, colLines, this.firefirstcount, bOrgLayout, bClear);
                pos = ret[0];

                if (this.firefirstcount == this._p_rowcount)
                {
                    this._reFilter();
                    this._resetSortGroup();
                    this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    this._p_rowposition = 0;

                    ret = this._loadFromSSVUint8Array(data, pos, colLines, -1, bOrgLayout, false);
                    pos = ret[0];
                }
            }
            else
            {
                ret = this._loadFromSSVUint8Array(data, pos, colLines, -1, bOrgLayout, bClear);
                pos = ret[0];
            }

            this._viewRecords = this._rawRecords;

            this._p_constcount = this._constVars.length;
            this._p_colcount = this.colinfos.length + this._p_constcount;
            this._p_rowcount = this._viewRecords.length;

            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            if (this.colinfos)
            {
                this._reFilter();
                this._resetSortGroup();
            }

            if (this._eventstat)
            {
                this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
                else
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;
            return pos;
        }
        return offset;
    };

    _pDatasetBase.loadSSV = function (strssv, bClear)
    {
        //var _rs_ = String.fromCharCode(30);
        var _rs_ = nexacro._getSSVRecordSeparator();
        if (strssv)
        {
            var ssvLine = strssv.split(_rs_);
            if (ssvLine.length)
            {
                this.loadFromSSVArray(ssvLine, ssvLine.length, 0, bClear);
            }
        }
        return this._p_rowcount;
    };

    //---------------------------------------------
    // save SSV
    //---------------------------------------------
    _pDatasetBase.__writeData = function (list, str)
    {
        list.push(str);
    };

    _pDatasetBase.__getRowTypeChar = function (_rtype)
    {
        var rtnVal = null;
        switch (_rtype)
        {
            case 1:
                // nexacro.Dataset.ROWTYPE_NORMAL
                rtnVal = "N";
                break;
            case 2:
                // nexacro.Dataset.ROWTYPE_INSERT
                rtnVal = "I";
                break;
            case 4:
                // nexacro.Dataset.ROWTYPE_UPDATE
                rtnVal = "U";
                break;
            case 8:
                // nexacro.Dataset.ROWTYPE_DELETE
                rtnVal = "D";
                break;
            case -1:
                // ORGROW
                rtnVal = "O";
                break;
        }

        return rtnVal;
    };

    _pDatasetBase.__writeSSVNormalRow = function (list, rowRow)
    {
        this.__writeSSVRowData(list, "N", rowRow);
    };

    _pDatasetBase.__writeSSVCrudRow = function (list, rowRow)
    {
        this.__writeSSVRowData(list, this.__getRowTypeChar(rowRow._rtype), rowRow);
        if (rowRow._rtype == 4 && rowRow._orgrow)
        {
            this.__writeSSVRowData(list, this.__getRowTypeChar(-1), rowRow._orgrow);
        }
    };

    _pDatasetBase.__writeSSVRowData = function (list, type, rowRow)
    {
        //var _rs_ = String.fromCharCode(30);
        //var _cs_ = String.fromCharCode(31);
        var _rs_ = nexacro._getSSVRecordSeparator();
        var _cs_ = nexacro._getSSVUnitSeparator();

        var colList = this.colinfos;

        this.__writeData(list, type); // US
        function __writeSSVColData_loopFn(i)
        {
            var colinfo = colList[i];
            var idx = colinfo._index;
            var value = rowRow[idx];

            value = this._convertValueBySaveProp(value);
            value = colinfo._toText(value);
            if (value === undefined)
            {
                value = String.fromCharCode(3);
            }

            if (value != null)
            {
                this.__writeData(list, _cs_ + value);
            }
            else
            {
                this.__writeData(list, _cs_);
            }
        }
        nexacro.__forLoop(this, 0, colList.length, __writeSSVColData_loopFn);
        this.__writeData(list, _rs_);
    };

    _pDatasetBase.saveSSV = function (id, type, savenan, saveinfinity, saveinvaliddate)
    {
        //var _rs_ = String.fromCharCode(30);
        //var _cs_ = String.fromCharCode(31);
        var _rs_ = nexacro._getSSVRecordSeparator();
        var _cs_ = nexacro._getSSVUnitSeparator();

        var saveId = this.id;
        if (id && id.length > 0)
        {
            saveId = id;
        }

        var saveType = "N";
        switch (type)
        {
            case "A":
            case "a":
            case "all":
            case "All":
                saveType = "A";
                break;
            case "U":
            case "u":
            case "update":
            case "Update":
                saveType = "U";
                break;
            case "V":
            case "v":
            case "view":
            case "View":
                saveType = "V";
                break;
        }

        this._setSaveProp(savenan, saveinfinity, saveinvaliddate);

        var list = [];
        this.__writeData(list, "Dataset:" + saveId + _rs_);

        var constList = this._constVars;
        if (constList.length > 0)
        {
            this.__writeData(list, "_Const_");
            function __saveSSV_constcol_loopFn(i)
            {
                var constVar = constList[i];
                var colId = this._constVars.get_id(i);
                var colVal = constVar.value;
                if (colVal === undefined)
                    colVal = String.fromCharCode(3);
                var colType = constVar.type;
                var colSize = constVar.size;
                if (colType != null && constVar.ntype != 9)
                {
                    colId += ":" + colType;
                    if (colSize > 0)
                    {
                        colId += "(" + colSize + ")";
                    }
                }

                colVal = this._convertValueBySaveProp(colVal);

                if (colVal)
                {
                    this.__writeData(list, _cs_ + colId + "=" + colVal);
                }
                else
                {
                    this.__writeData(list, _cs_ + colId + "=");
                }
            }
            nexacro.__forLoop(this, 0, constList.length, __saveSSV_constcol_loopFn);
            this.__writeData(list, _rs_);
        }

        var colList = this.colinfos;
        if (colList.length > 0)
        {
            this.__writeData(list, "_RowType_");
            function __saveSSV_colinfo_loopFn(i)
            {
                var colinfo = colList[i];
                var colId = colinfo.id;

                var colType = colinfo.ntype == 9 ? "STRING" : colinfo.type ? colinfo.type : nexacro.DataUtils.toTypeName(colinfo.ntype);
                var colSize = colinfo.ntype == 9 ? nexacro.DataUtils._default_sizes[1] : colinfo.size;
                var colProp = colinfo.prop;

                var colStr = _cs_ + colId + ":" + colType;
                if (colSize)
                    colStr += "(" + colSize + ")";
                if (colProp)
                {
                    colStr += ":" + colProp;
                    var colSumText = colinfo.sumtext;
                    if (colSumText)
                        colStr += ":" + colSumText;
                }
                this.__writeData(list, colStr);
            }
            nexacro.__forLoop(this, 0, colList.length, __saveSSV_colinfo_loopFn);
            this.__writeData(list, _rs_);
        }
        else
        {
            this.__writeData(list, "_RowType_" + _rs_);
        }

        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;

        if (delRecords.length)
        {
            if (saveType == "A" || saveType == "U")
            {
                function __saveSSV_delrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(delRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeSSVCrudRow(list, rowRow);
                    }
                }
                nexacro.__forLoop(this, 0, delRecords.length, __saveSSV_delrow_loopFn);
            }
        }

        if (rawRecords.length)
        {
            if (saveType == "A")
            {
                function __saveSSV_allrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeSSVCrudRow(list, rowRow);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveSSV_allrow_loopFn);
            }
            else if (saveType == "U")
            {
                function __saveSSV_updaterow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 14)
                    {
                        this.__writeSSVCrudRow(list, rowRow);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveSSV_updaterow_loopFn);
            }
            else
            {
                if (saveType == "V")
                {
                    function __saveSSV_viewrow_loopFn(i)
                    {
                        var rowRow = this.__getParsedRow(viewRecords[i]);
                        if (rowRow._rtype & 7)
                        {
                            this.__writeSSVNormalRow(list, rowRow);
                        }
                    }
                    nexacro.__forLoop(this, 0, viewRecords.length, __saveSSV_viewrow_loopFn);
                }
                else
                {
                    function __saveSSV_normalrow_loopFn(i)
                    {
                        var rowRow = this.__getParsedRow(rawRecords[i]);
                        if (rowRow._rtype & 7)
                        {
                            this.__writeSSVNormalRow(list, rowRow);
                        }
                    }
                    nexacro.__forLoop(this, 0, rawRecords.length, __saveSSV_normalrow_loopFn);
                }
            }
        }
        this.__writeData(list, _rs_);
        return list.join("");
    };


    //---------------------------------------------
    //---------------------------------------------
    // load from PPX : pre parsed XML
    //---------------------------------------------
    _pDatasetBase.__makePPXDataMappingFunc = function (colLines)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();

        var idMap = {};

        function __makePPXDataMappingFunc_loopFn(i)
        {
            var curStr = colLines[i];
            var curType = curStr.charAt(0);
            if (curType == 'C')
            {
                var valArr = curStr.split(_cs_);
                var id = valArr[1];
                idMap[id] = i;
                return true;
            }/*
            else if (curType == 'C')
            {
                return false;
            }*/
            return true;
        }
        nexacro.__forLoop(this, 0, colLines.length, __makePPXDataMappingFunc_loopFn);

        var colinfos = this.colinfos;
        var colLen = colinfos.length;
        var expr = "(function () { return function (target, arr) { ";
        for (var i = 0; i < colLen; i++)
        {
            var colinfo = colinfos[i];
            var idx = idMap[colinfo.id];
            var colidx = colinfo._index;
            if (idx != null)
            {
                switch (colinfo.ntype)
                {
                    case 1:
                        expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        break;
                    case 2:
                        // int
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toIntFromText(arr[" + idx + "]); ";
                        break;
                    case 3:
                        // float
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toFloatFromText(arr[" + idx + "]); ";
                        break;
                    case 4:
                        // bigdecimal
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
                        break;
                    case 5:
                        // date
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDateFromText(arr[" + idx + "]); ";
                        break;
                    case 6:
                        // time
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toTimeFromText(arr[" + idx + "]); ";
                        break;
                    case 7:
                        // datetime
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDateTimeFromText(arr[" + idx + "]); ";
                        break;
                    case 8:
                        // blob
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toBlobFromText(arr[" + idx + "]); ";
                        break;
                    default:
                        // variant
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toTextFromvariant(arr[" + idx + "]); ";
                        break;
                }
            }
        }
        expr += "}; })();";

        return nexacro._executeGlobalEvalStr(expr);
    };

    _pDatasetBase._setColInfoFromPPXLines = function (colLines)
    {
        //var _cs_ = String.fromCharCode(31);
        var _cs_ = nexacro._getSSVUnitSeparator();

        function __setColInfoFromPPXLines_loopFn(i)
        {
            var curStr = colLines[i];
            var curType = curStr.charAt(0);
            var valArr;
            if (curType == 'V')
            {
                valArr = curStr.split(_cs_);
                this._addConstColumn(valArr[1], valArr[3], valArr[2]);
                return false;
            }
            else if (curType == 'C')
            {
                valArr = curStr.split(_cs_);
                this._addColumn(valArr[1], valArr[2], valArr[3], valArr[4], valArr[5]);
                return false;
            }
            return true;
        }
        nexacro.__forLoop(this, 0, colLines.length, __setColInfoFromPPXLines_loopFn);

    };



    _pDatasetBase._loadFromPPXArray = function (ppxColLines, ppxLines, curIdx, loadCnt, bOrgLayout, bClear)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        var _convertFn = null;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        if (!ppxColLines || ppxColLines.length == 0)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            return curIdx;
        }

        if (bOrgLayout)
        {
            _convertFn = this.__makePPXDataMappingFunc(ppxColLines);
        }
        else
        {
            this._setColInfoFromPPXLines(ppxColLines);
            _convertFn = this.__makeDataConvertFunc("P");
        }

        // same row spec PPX & SSV
        curIdx = this._loadRecordFromSSVLines(ppxLines, curIdx, loadCnt, _convertFn);

        this._viewRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return curIdx;
    };

    _pDatasetBase._getColLinesFromPPXLines = function (ppxLines, curIdx)
    {
        var lineCnt = ppxLines.length;
        var idx = curIdx;

        while (true)
        {
            var type = ppxLines[idx].charAt(0);
            if (idx < lineCnt && (type == "C" || type == "V"))
                idx++;
            else
                break;
        }

        return ppxLines.slice(curIdx, idx);
    };

    _pDatasetBase.loadFromPPXArray = function (ppxLine, lineCnt, curIdx, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;

        if (ppxLine)
        {
            this._bWorkingstatus = true;

            while (ppxLine[curIdx].charAt(0) != "D")
            {
                curIdx++;
            }

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            if (curIdx < lineCnt)
            {
                curIdx++;
                var ppxColLines = this._getColLinesFromPPXLines(ppxLine, curIdx);
                curIdx += ppxColLines.length;
                if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
                {
                    curIdx = this._loadFromPPXArray(ppxColLines, ppxLine, curIdx, this.firefirstcount, bOrgLayout, bClear);
                    if (this.firefirstcount == this._p_rowcount)
                    {
                        this._reFilter();
                        this._resetSortGroup();
                        this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                        this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        this._p_rowposition = 0;

                        curIdx = this._loadFromPPXArray(ppxColLines, ppxLine, curIdx, -1, bOrgLayout, false);
                    }
                }
                else
                {
                    curIdx = this._loadFromPPXArray(ppxColLines, ppxLine, curIdx, -1, bOrgLayout, bClear);
                }

                if (this.colinfos)
                {
                    this._reFilter();
                    this._resetSortGroup();
                }

                if (this._eventstat)
                {
                    this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                    if (this._viewRecords && this._viewRecords.length > 0)
                    {
                        this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                }
                else if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._p_rowposition = 0;
                }
            }

            this._bWorkingstatus = false;

            return curIdx;
        }
    };


    //---------------------------------------------
    //---------------------------------------------
    // load CSV
    //---------------------------------------------
    _pDatasetBase.__splitCSVRowData = function (strRow, base_colCnt)
    {
        var colArr = strRow.split(",");
        var idx = 0;
        var quote = null;
        var tmp_str = "";
        function __splitCSVRowData_loopFn(i)
        {
            var colStr = colArr[i];
            if (quote == null)
            {
                quote = colStr.charAt(0);
                if (quote == "\"" || quote == "\'")
                {
                    if (colStr[colStr.length - 1] == quote && colStr.length > 1)
                    {
                        colArr[idx++] = nexacro._unQuoteStr(colStr);
                        quote = null;
                    }
                    else
                    {
                        tmp_str = colStr;
                    }
                }
                else
                {
                    quote = null;
                    colArr[idx++] = colStr;
                }
            }
            else
            {
                if (colStr[colStr.length - 1] == quote)
                {
                    colArr[idx++] = nexacro._unQuoteStr(tmp_str + "," + colStr);
                    tmp_str = "";
                    quote = null;
                }
                else
                {
                    tmp_str += "," + colStr;
                }
            }
        }
        nexacro.__forLoop(this, 0, colArr.length, __splitCSVRowData_loopFn);
        if (idx != colArr.length)
            colArr.length = idx;
        return colArr;
    };

    _pDatasetBase.__csvSetColInfo = function (strColInfo)
    {
        var colArr = strColInfo.split(",");
        var colCnt = colArr.length;
        function __csvSetColInfo_loopFn(i)
        {
            var colStr = colArr[i];
            var colItem = colStr.split(":");
            var id = colItem[0];
            var type, size;
            if (id)
            {
                var colInfo = colItem[1];
                if (colInfo)
                {
                    var sidx = colInfo.indexOf("(");
                    if (sidx > -1)
                    {
                        type = colInfo.substring(0, sidx).toUpperCase();
                        size = colInfo.substring(sidx + 1, colInfo.indexOf(")", sidx + 1)) | 0;
                    }
                    else
                    {
                        type = colInfo;
                    }
                }
                else
                {
                    type = "STRING";
                    size = 256;
                }
                this._addColumn(id, type, size, colItem[2], colItem[3]);
            }
        }
        nexacro.__forLoop(this, 0, colArr.length, __csvSetColInfo_loopFn);
        return colCnt;
    };

    _pDatasetBase._setColInfoFromCSVLine = function (csvColLine, bOrgLayout)
    {
        if (!csvColLine || csvColLine.length == 0)
            return null;

        var _convertFn = null, csvColCnt;
        if (bOrgLayout)
        {
            var colArr = csvColLine.split(",");
            csvColCnt = colArr.length;
            _convertFn = this.__makeDataMappingFunc(colArr, csvColCnt, "C");
        }
        else
        {
            this.__csvSetColInfo(csvColLine);
            _convertFn = this.__makeDataConvertFunc("C");
        }

        return _convertFn;
    };

    // for lazy load
    _pDatasetBase._lazyParseRecordFromCSVLine = function (rowRow, _convertFn)
    {
        var rowData = this.__splitCSVRowData(rowRow._data, this.colinfos.length);
        _convertFn(rowRow, rowData);
        delete rowRow._data;
        rowData.length = 0;
        return rowRow;
    };

    _pDatasetBase._lazyParseRecordFromCSVLine_with_Uint8Array = function (rowRow, _convertFn)
    {
        var dataArray = rowRow._data;
        var cinfo = nexacro._Array2DataUtil.substring(dataArray, 0);
        var curData = cinfo.string;

        var rowData = this.__splitCSVRowData(curData, this.colinfos.length);
        _convertFn(rowRow, rowData);
        delete rowRow._data;
        rowData.length = 0;

        return rowData;
    };

    _pDatasetBase._loadRecordFromCSVLines = function (csvLines, curIdx, loadCnt, _convertFn)
    {
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var lazyParsing = this.lazyParsing;

        // save for lazy load
        if (lazyParsing)
        {
            this.__loadConvertFn = _convertFn;
            this.__lazyParseRecordFn = this._lazyParseRecordFromCSVLine;
        }

        var colCnt = this.colinfos.length;
        var rowidx = rawRecords.length + delRecords.length;

        var postfix = '';

        if (lazyParsing)
        {
            function __lazyLoadRecordFromCSVLines_loopFn(i)
            {
                var curLine = csvLines[i];
                if (curLine == "" || (curLine.substring(0, 7) == "Dataset"))
                {
                    return true;
                }
                curLine += postfix;

                var curData = [];
                curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                curData._orgidx = rowidx;
                curData._rawidx = rawRecords.length;
                curData._level = 0;
                curData._data = curLine; // lazyload data
                rawRecords[rawRecords.length] = curData;

                rowidx++;

                if (loadCnt > 0 && rawRecords.length == loadCnt)
                    return true;
            }
            curIdx = nexacro.__forLoop(this, curIdx, csvLines.length, __lazyLoadRecordFromCSVLines_loopFn);
        }
        else
        {
            function __loadRecordFromCSVLines_loopFn(i)
            {
                var curLine = csvLines[i];
                if (curLine == "")
                {
                    return true;
                }
                curLine += postfix;

                var curData = this.__splitCSVRowData(curLine, colCnt);
                _convertFn(curData, curData);

                curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                curData._orgidx = rowidx;
                curData._rawidx = rawRecords.length;
                curData._level = 0;
                rawRecords[rawRecords.length] = curData;

                rowidx++;

                if (loadCnt > 0 && rawRecords.length == loadCnt)
                    return true;
            }
            curIdx = nexacro.__forLoop(this, curIdx, csvLines.length, __loadRecordFromCSVLines_loopFn);
        }

        if (csvLines[curIdx] == "")
            curIdx++;
        return curIdx;
    };

    _pDatasetBase._loadRecordFromCSVUint8Array = function (data, offset, loadCnt, _convertFn, rs)
    {
        var pos = offset/*, length = data.length, cinfo*/, tinfo;
        var nullRecord = false;

        var rs_code_array = [];
        for (var i = 0, rslen = rs.length; i < rslen; i++)
        {
            rs_code_array[i] = rs.charCodeAt(i);
        }
        //var rs_code_len = rs_code_array.length;

        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var lazyParsing = this.lazyParsing;

        // save for lazy parsing
        if (lazyParsing)
        {
            this.__loadConvertFn = _convertFn;
            this.__lazyParseRecordFn = this._lazyParseRecordFromCSVLine_with_Uint8Array;
        }

        var rowidx = rawRecords.length + delRecords.length;

        //var prefix = '', typePos = 0;

        if (lazyParsing)
        {
            function __lazyLoadRecordFromUint8Array_loopFn()
            {
                var curLine;
                tinfo = nexacro._Array2DataUtil.indexOf(data, pos, rs_code_array);

                if (tinfo.index < 0)
                    return true;

                if (nexacro._Array2DataUtil.substr(data, pos, 7).string == "Dataset")
                    return true;

                if (tinfo.index - pos == 0) // null record
                {
                    pos = (tinfo.index + tinfo.byteLength);
                    nullRecord = true;
                    return true;
                }
                else
                {
                    curLine = data.subarray(pos, tinfo.index);
                }

                // lazy parsing
                var curData;
                //cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                //var typeChar = cinfo.string;


                curData = [];
                curData._rtype = 1; //nexacro.Dataset.ROWTYPE_NORMAL;
                curData._orgidx = rowidx;
                curData._rawidx = rawRecords.length;
                curData._level = 0;
                curData._data = curLine;
                rawRecords[rawRecords.length] = curData;


                pos = tinfo.index + tinfo.byteLength;

                rowidx++;
                if (loadCnt > 0 && rawRecords.length == loadCnt)
                    return true;
            }
            nexacro.__whileLoop(this, __lazyLoadRecordFromUint8Array_loopFn);
        }
        else
        {

        }

        return [pos, nullRecord];
    };

    _pDatasetBase._loadFromCSVUint8Array = function (data, offset, csvColLines, loadCnt, bOrgLayout, bClear, convertFn, rs)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        var _convertFn = null;
        if (convertFn)
        {
            _convertFn = convertFn;
        }
        else
        {
            _convertFn = this._setColInfoFromCSVLine(csvColLines ? csvColLines[0] : null, bOrgLayout);
        }

        if (!_convertFn)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;
            return [++offset];
        }

        var pos = offset;//, length = data.length;
        //curIdx = this._loadRecordFromSSVLines(ssvLines, curIdx, loadCnt, _convertFn);

        var ret = this._loadRecordFromCSVUint8Array(data, pos, loadCnt, _convertFn, rs);
        //pos = ret[0];

        this._viewRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        //return pos;
        return ret;
    };

    _pDatasetBase._loadFromCSVArray = function (csvColLine, csvLines, curIdx, loadCnt, bOrgLayout, bClear, convertFn)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        var _convertFn = convertFn ? convertFn : this._setColInfoFromCSVLine(csvColLine, bOrgLayout);
        if (!_convertFn)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;
            return curIdx;
        }

        curIdx = this._loadRecordFromCSVLines(csvLines, curIdx, loadCnt, _convertFn);

        this._viewRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        return curIdx;
    };

    _pDatasetBase.loadFromCSVArray = function (csvLine, lineCnt, curIdx, bClear, bAppend, errorcode, errormsg)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;

        if (csvLine)
        {
            this._bWorkingstatus = true;

            function __findDatasetStart_loopFn(i)
            {
                if (csvLine[i].substring(0, 7) == "Dataset")
                    return true;
                curIdx++;
            }
            curIdx = nexacro.__forLoop(this, curIdx, lineCnt, __findDatasetStart_loopFn);

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            if (curIdx < (lineCnt - 1))
            {
                curIdx++;
                var csvColLine = csvLine[curIdx++];
                if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
                {
                    curIdx = this._loadFromCSVArray(csvColLine, csvLine, curIdx, this.firefirstcount, bOrgLayout, bClear);

                    if (this.firefirstcount == this._p_rowcount)
                    {
                        this._reFilter();
                        this._resetSortGroup();
                        this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                        this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        this._p_rowposition = 0;

                        curIdx = this._loadFromCSVArray(csvColLine, csvLine, curIdx, -1, bOrgLayout, false);
                    }
                }
                else
                {
                    curIdx = this._loadFromCSVArray(csvColLine, csvLine, curIdx, -1, bOrgLayout, bClear);
                }

                if (this.colinfos)
                {
                    this._reFilter();
                    this._resetSortGroup();
                }

                if (this._eventstat)
                {
                    this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                    if (this._viewRecords && this._viewRecords.length > 0)
                    {
                        this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                }
                else if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._p_rowposition = 0;
                }
            }
            else if (curIdx < lineCnt)
            {
                curIdx++;
            }

            this._bWorkingstatus = false;

            return curIdx;
        }
    };

    _pDatasetBase._getColLinesFromCSVLines_with_arraybuffer = function (data, offset, sep, colLines)
    {

        var pos = offset;//, length = data.length;
        var curStr, cinfo;

        cinfo = nexacro._Array2DataUtil.substringOf(data, pos, sep);
        curStr = cinfo.string;
        pos = cinfo.nextOffset;
        colLines.push(curStr);

        return pos;
    };

    _pDatasetBase.loadCSVFromUint8Array = function (data, offset, bClear, bAppend, errorcode, errormsg, rs)
    {
        if (bClear == null)
        {
            bClear = true;
        }
        bClear = nexacro._toBoolean(bClear);
        var bOrgLayout = this._p_useclientlayout;

        if (data)
        {
            this._bWorkingstatus = true;

            if (bAppend)
            {
                bClear = false;
                if (this.colinfos && this.colinfos.length > 0)
                    bOrgLayout = true;
            }

            // get column info
            var pos = offset/*, length = data.length*/, colLines = [];
            pos = this._getColLinesFromCSVLines_with_arraybuffer(data, pos, rs, colLines);
            var ret = [];
            if (nexacro._use_firefirstcount && bClear && this.firefirstcount > 0)
            {
                ret = this._loadFromCSVUint8Array(data, pos, colLines, this.firefirstcount, bOrgLayout, bClear, undefined, rs);
                pos = ret[0];

                if (this.firefirstcount == this._p_rowcount)
                {
                    this._reFilter();
                    this._resetSortGroup();
                    this.on_fire_onload(errorcode, errormsg, 1); //nexacro.Dataset.REASON_LOADPROCESS
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    this._p_rowposition = 0;

                    ret = this._loadFromCSVUint8Array(data, pos, colLines, -1, bOrgLayout, false);
                    pos = ret[0];
                }
            }
            else
            {
                ret = this._loadFromCSVUint8Array(data, pos, colLines, -1, bOrgLayout, bClear, undefined, rs);
                pos = ret[0];
            }

            this._viewRecords = this._rawRecords;

            this._p_constcount = this._constVars.length;
            this._p_colcount = this.colinfos.length + this._p_constcount;
            this._p_rowcount = this._viewRecords.length;

            this.loadstatus = false;
            this._eventstat = this._p_enableevent;

            if (this.colinfos)
            {
                this._reFilter();
                this._resetSortGroup();
            }

            if (this._eventstat)
            {
                this.on_fire_onload(errorcode, errormsg, bClear ? 0 : 12); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
                else
                {
                    this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;
            return pos;
        }
        return offset;
    };

    _pDatasetBase.loadCSV = function (strcsv, bClear)
    {
        if (strcsv)
        {
            var csvLine = strcsv.split(/\r\n|\n/);
            if (csvLine.length)
            {
                this.loadFromCSVArray(csvLine, csvLine.length, 0, bClear);
            }
        }
        return this._p_rowcount;
    };

    //---------------------------------------------
    // save CSV
    //---------------------------------------------
    _pDatasetBase.__writeCSVRowData = function (list, rowRow)
    {
        var colList = this.colinfos;
        var colCnt = colList.length;
        function __writeCSVColData_loopFn(i)
        {
            var colinfo = colList[i];
            var value = rowRow[colinfo._index];

            value = this._convertValueBySaveProp(value);
            value = colinfo._toText(value);
            if (value != null)
            {
                if (colinfo.ntype == 1)
                {
                    if (i == (colCnt - 1))
                    {
                        this.__writeData(list, nexacro._quoteStr(value) + "\r\n");
                    }
                    else
                    {
                        this.__writeData(list, nexacro._quoteStr(value) + ",");
                    }
                }
                else
                {
                    if (i == (colCnt - 1))
                    {
                        this.__writeData(list, value + "\r\n");
                    }
                    else
                    {
                        this.__writeData(list, value + ",");
                    }
                }
            }
            else
            {
                if (i == (colCnt - 1))
                {
                    this.__writeData(list, "\r\n");
                }
                else
                {
                    this.__writeData(list, ",");
                }
            }
        }
        nexacro.__forLoop(this, 0, colList.length, __writeCSVColData_loopFn);
    };

    _pDatasetBase.saveCSV = function (id, savenan, saveinfinity, saveinvaliddate)
    {
        var saveId = this.id;
        if (id && id.length > 0)
        {
            saveId = id;
        }

        this._setSaveProp(savenan, saveinfinity, saveinvaliddate);

        var list = [];
        this.__writeData(list, "Dataset:" + saveId + "\r\n");

        var colList = this.colinfos;
        var colCnt = colList.length;
        if (colCnt > 0)
        {
            function __saveCSV_colinfo_loopFn(i)
            {
                var colinfo = colList[i];
                var colId = colinfo.id;

                var colType = colinfo.ntype == 9 ? "STRING" : colinfo.type ? colinfo.type : nexacro.DataUtils.toTypeName(colinfo.ntype);
                var colSize = colinfo.ntype == 9 ? nexacro.DataUtils._default_sizes[1] : colinfo.size;
                var colStr;
                if (i == 0)
                    colStr = colId + ":" + colType;
                else
                    colStr = "," + colId + ":" + colType;

                if (colSize)
                    colStr += "(" + colSize + ")";

                var colProp = colinfo.prop;
                if (colProp)
                {
                    colStr += ":" + colProp;
                    var colSumText = colinfo.sumtext;
                    if (colSumText)
                        colStr += ":" + colSumText;
                }
                this.__writeData(list, colStr);

            }
            nexacro.__forLoop(this, 0, colList.length, __saveCSV_colinfo_loopFn);
            this.__writeData(list, "\r\n");
        }
        else
        {
            this.__writeData(list, "\r\n");
        }

        var rawRecords = this._rawRecords;

        if (rawRecords.length > 0)
        {
            function __saveCSV_row_loopFn(i)
            {
                var rowRow = this.__getParsedRow(rawRecords[i]);
                if (rowRow._rtype & 7)
                {
                    this.__writeCSVRowData(list, rowRow);
                }
            }
            nexacro.__forLoop(this, 0, rawRecords.length, __saveCSV_row_loopFn);
        }
        this.__writeData(list, "\r\n");
        return list.join("");
    };


    //---------------------------------------------
    //---------------------------------------------
    // load BIN
    //---------------------------------------------
    _pDatasetBase.__makeBINDataConvertFunc = function (type)
    {
        var colinfos = this.colinfos;
        var colLen = colinfos.length;

        var expr = "(function () { return function (target, arr) { target.length =" + colLen + ";";

        for (var idx = 0; idx < colLen; idx++)
        {
            var colinfo = colinfos[idx];
            if (colinfo.ntype == 4)
            {
                expr += "target[" + idx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
            }
            else
            {
                expr += "target[" + idx + "] = arr[" + idx + "]; ";
            }
        }
        expr += " }; })();";

        return nexacro._executeGlobalEvalStr(expr);
    };

    _pDatasetBase.__makeBINDataMappingFunc = function (colArr, colCnt, type)
    {
        var i;
        var idMap = {};
        var typeArr = [];
        for (i = 0; i < colCnt; i++)
        {
            idMap[colArr[i].id] = i;
            typeArr[i] = colArr[i].type;
        }

        var colinfos = this.colinfos;
        var colLen = colinfos.length;
        var expr = "(function () { return function (target, arr) { target.length =" + colLen + ";";

        for (i = 0; i < colLen; i++)
        {
            var colinfo = colinfos[i];
            var idx = idMap[colinfo.id];
            var colidx = colinfo._index;

            if (idx != null)
            {
                var sourcetype = nexacro.DataUtils._typeint[typeArr[idx]];
                var is_date = false;
                if (sourcetype == 5 || sourcetype == 6 || sourcetype == 7)
                    is_date = true;

                if (colinfo.ntype == sourcetype)
                {
                    if (sourcetype == 4)
                        expr += "target[" + colidx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
                    else
                        expr += "target[" + colidx + "] = arr[" + idx + "]; ";

                    continue;
                }

                switch (colinfo.ntype)
                {
                    case 1: // string
                        if (sourcetype == 1 || sourcetype == 4)
                            expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        else if (sourcetype == 2)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toTextFromInt(arr[" + idx + "]); ";
                        else if (sourcetype == 3)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toTextFromFloat(arr[" + idx + "]); ";
                        else
                        {
                            if (is_date)
                                expr += "target[" + colidx + "] = nexacro.DataUtils.toTextFromDateTime(arr[" + idx + "]); ";
                            else
                                expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        }
                        break;
                    case 2: // int
                        if (sourcetype == 1 || sourcetype == 4)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toIntFromText(arr[" + idx + "]); ";
                        else if (sourcetype == 2)
                            expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        else if (sourcetype == 3)
                            expr += "target[" + colidx + "] = nexacro._toInt(arr[" + idx + "]); ";
                        else
                        {
                            if (is_date)
                                expr += "target[" + colidx + "] = nexacro.DataUtils.toIntFromText(arr[" + idx + "]); ";
                            else
                                expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        }
                        break;
                    case 3: // float
                        if (sourcetype == 2 || sourcetype == 3)
                            expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        else
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toFloatFromText(arr[" + idx + "]); ";
                        break;
                    case 4: // bigdecimal
                        if (sourcetype == 1 || sourcetype == 4)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toDecimalFromText(arr[" + idx + "]); ";
                        else
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toDecimal(arr[" + idx + "]); ";
                        break;
                    case 5: // date
                        if (sourcetype == 1 || sourcetype == 4)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toDateFromText(arr[" + idx + "]); ";
                        else
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toDate(arr[" + idx + "]); ";
                        break;
                    case 6: // time
                        if (sourcetype == 1 || sourcetype == 4)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toTimeFromText(arr[" + idx + "]); ";
                        else
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toTime(arr[" + idx + "]); ";
                        break;
                    case 7: // datetime
                        if (sourcetype == 1 || sourcetype == 4)
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toDateTimeFromText(arr[" + idx + "]); ";
                        else
                            expr += "target[" + colidx + "] = nexacro.DataUtils.toDateTime(arr[" + idx + "]); ";
                        break;
                    case 8: // TODO: blob
                        break;
                        expr += "target[" + colidx + "] = arr[" + idx + "]; ";
                        break;
                }
            }
        }
        expr += "}; })();";

        return nexacro._executeGlobalEvalStr(expr);
    };

    _pDatasetBase._loadFromBINUint8Array = function (data, offset, binColLines, loadCnt, bOrgLayout, bClear, convertFn)
    {
        this.loadstatus = true;
        this._eventstat = !this.loadstatus && this._p_enableevent;

        if (bClear)
        {
            if (bOrgLayout)
            {
                this._clearData();
            }
            else
            {
                this._clearAll();
            }
        }

        var _convertFn = convertFn ? convertFn : null;

        if (!_convertFn)
        {
            this.loadstatus = false;
            this._eventstat = this._p_enableevent;
            return [++offset];
            //return offset;
        }

        var pos = offset;//, length = data.length;
        var ret = this._loadRecordFromBINUint8Array(data, pos, loadCnt, _convertFn);
        //pos = ret[0];

        this._viewRecords = this._rawRecords;

        this._p_constcount = this._constVars.length;
        this._p_colcount = this.colinfos.length + this._p_constcount;
        this._p_rowcount = this._viewRecords.length;

        this.loadstatus = false;
        this._eventstat = this._p_enableevent;

        //return pos;
        return ret;
    };

    // for lazy load    
    _pDatasetBase._lazyParseRecordFromBINLine_with_Uint8Array = function (rowRow, _convertFn)
    {
        var data = rowRow._data;
        if (data.length <= 6) 
        {
            data.length = 0;
            delete rowRow._data;
            return;
        }
        var dataview = new DataView(data.buffer);

        var pos = 0;
        //var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
        //pos = ret[0];
        //var size = ret[1];
        var rtype = dataview.getUint16(pos);
        pos += 2;
        var cnt = dataview.getUint16(pos);
        pos += 2;
        var _data = [];
        for (var i = 0; i < cnt; i++)
        {
            var type = (pos + 2 < data.length) ? dataview.getUint16(pos) : 0;
            pos += 2;
            switch (type)
            {
                case 2: //bool, short
                    if (pos + 2 < data.length)
                    {
                        _data[i] = dataview.getInt16(pos);
                        pos += 2;
                    }
                    break;
                case 3: //int, long
                    if (pos + 4 < data.length)
                    {
                        _data[i] = dataview.getInt32(pos);
                        pos += 4;
                    }
                    break;
                case 4: //float,decimal, double
                    if (pos + 8 < data.length)
                    {
                        _data[i] = dataview.getFloat64(pos);
                        pos += 8;
                    }
                    break;
                case 41: //date, double
                    var ret = nexacro._Array2DataUtil.getDatetimeFromUint8Array(data, pos, dataview);
                    pos = ret[0];
                    _data[i] = ret[1];
                    break;
                case 21: //string
                case 26: //blob;js에서는 지원안하나 일단 처리는 문자열 포맷으로 해줌;
                case 40: //bigdecimal
                    var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
                    pos = ret[0];
                    _data[i] = nexacro._Array2DataUtil.substr(data, pos, ret[1]).string
                    pos += ret[1];
                    break;
                default:
                    break;
            }
        }
        _convertFn(rowRow, _data);

        if (rtype == 0x0004) //update --> 추가로 origin이 들어옴;
        {
            var cnt = dataview.getUint16(pos);
            pos += 2;
            var _orgdata = [];
            for (var i = 0; i < cnt; i++)
            {
                var type = (pos + 2 < data.length) ? dataview.getUint16(pos) : 0;
                pos += 2;
                switch (type)
                {
                    case 2: //bool, short
                        if (pos + 2 < data.length)
                        {
                            _orgdata[i] = dataview.getInt16(pos);
                            pos += 2;
                        }
                        break;
                    case 3: //int, long
                        if (pos + 4 < data.length)
                        {
                            _orgdata[i] = dataview.getInt32(pos);
                            pos += 4;
                        }
                        break;
                    case 4: //float,decimal, double
                        if (pos + 8 < data.length)
                        {
                            _orgdata[i] = dataview.getFloat64(pos);
                            pos += 8;
                        }
                        break;
                    case 41: //date, double
                        var ret = nexacro._Array2DataUtil.getDatetimeFromUint8Array(data, pos, dataview);
                        pos = ret[0];
                        _orgdata[i] = ret[1];
                        break;
                    case 21: //string
                    case 26: //bin
                    case 40: //decimal
                        ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
                        pos = ret[0];
                        _orgdata[i] = nexacro._Array2DataUtil.substr(data, pos, ret[1]).string
                        pos += ret[1];
                        break;
                    default:
                        break;
                }
            }
            _convertFn(rowRow._orgrow, _orgdata);
        }

        data.length = 0;
        delete rowRow._data;
    };

    _pDatasetBase._loadRecordFromBINUint8Array = function (data, offset, loadCnt, _convertFn)
    {
        var pos = offset;
        var nullRecord = false;

        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var lazyParsing = true;

        this.__loadConvertFn = _convertFn;
        this.__lazyParseRecordFn = this._lazyParseRecordFromBINLine_with_Uint8Array;

        var rowidx = rawRecords.length + delRecords.length;

        //var prefix = '', typePos = 0;
        if ((pos + 4) > data.length)
            return [pos, nullRecord];

        var break_parse = false;
        var dataview = new DataView(data.buffer);
        if (lazyParsing)
        {
            function __lazyLoadRecordFromUint8Array_loopFn()
            {
                var beforepos = pos;
                var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
                var prepos = pos = ret[0];
                var size = ret[1];
                if (pos + size >= data.length) //데이터가 덜 찬 경우?
                {
                    pos = beforepos;
                    break_parse = true;
                    return true;
                }
                else if (size <= 0) //last record?
                {
                    pos += 2; //null record는 4바이트로 표시함;
                    nullRecord = true;
                    return true;
                }
                // lazy parsing
                var rtype = dataview.getUint16(pos);
                pos += 2;

                var curData = [];
                curData._rtype = 0 + rtype;
                curData._orgidx = rowidx;
                curData._rawidx = rawRecords.length;
                curData._level = 0;
                curData._data = data.slice(prepos, prepos + size);

                if (rtype == 0x0008) //delete
                    delRecords[delRecords.length] = curData;
                else
                    rawRecords[rawRecords.length] = curData;

                pos = prepos + size;
                rowidx++;
                if (loadCnt > 0 && (rawRecords.length - delRecords.length) == loadCnt)
                    return true;
            }
            nexacro.__whileLoop(this, __lazyLoadRecordFromUint8Array_loopFn);
        }

        return [pos, nullRecord, break_parse];
    };

    _pDatasetBase.loadBIN = function (binData)
    {
        return nexacro._datasetFromBINString(this, binData);
    };

    //---------------------------------------------
    // save BIN
    //---------------------------------------------
    _pDatasetBase.saveBIN = function (id, strSaveType, savenan, saveinfinity, saveinvaliddate)
    {
        return nexacro._datasetToBINString(this, id, strSaveType, savenan, saveinfinity, saveinvaliddate);
    };

    _pDatasetBase._saveBINUint8Array = function (id, type, savenan, saveinfinity, saveinvaliddate)
    {
        if (nexacro._Browser == "Runtime")
            return null;

        var list = [];
        const buf = new ArrayBuffer(8);
        var dv = new DataView(buf);

        nexacro._Array2DataUtil.addLenStrToUint8Array(id, list, dv); //dataset id len, id
        this._setSaveProp(savenan, saveinfinity, saveinvaliddate);

        var var_list = [];
        var constList = this._constVars;
        if (constList.length > 0)
        {
            function __saveBIN_constcol_loopFn(i)
            {
                var constVar = constList[i];
                var colId = this._constVars.get_id(i);

                nexacro._Array2DataUtil.addLenStrToUint8Array(colId, var_list, dv);

                var colVal = constVar.value;
                var j = 0;
                switch (constVar.ntype) //_typeint 
                {
                    case 1: //string
                    case 6: //time //binary 포맷에서 지원 안함;nre와 통일
                    case 7: //datetime //binary 포맷에서 지원 안함;nre와 통일
                        dv.setUint16(0, 21, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1)); //vt type
                        nexacro._Array2DataUtil.addLenStrToUint8Array(colVal, var_list, dv);
                        break;
                    case 2: //int, long
                        dv.setUint16(0, 3, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1));
                        var value = nexacro.DataUtils.convert(this._convertValueBySaveProp(colVal), constVar.ntype);
                        dv.setInt32(0, value, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
                        break;
                    case 3: //float, double
                        dv.setUint16(0, 4, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1));
                        var value = nexacro.DataUtils.convert(this._convertValueBySaveProp(colVal), constVar.ntype);
                        dv.setFloat64(0, value, false);
                        for (j = 0; j < 8; j++)
                            var_list.push(dv.getUint8(j));
                        break;
                    case 4: //decimal, bigdecimal
                        dv.setUint16(0, 40, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1));
                        nexacro._Array2DataUtil.addLenToUint8Array(colVal.length, var_list, dv);
                        for (j = 0; j < colVal.length; j++)
                            var_list.push(colVal.charCodeAt(j)); //value
                        break;
                    case 5: //date
                        dv.setUint16(0, 41, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1));
                        var value = nexacro.DataUtils.convert(this._convertValueBySaveProp(colVal), constVar.ntype);
                        nexacro._Array2DataUtil.addDatetimeToUint8Array(value, var_list, dv);
                        break;
                    case 8: //blob  
                        dv.setUint16(0, 26, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1));
                        nexacro._Array2DataUtil.addLenToUint8Array(colVal.length, var_list, dv);
                        for (j = 0; j < colVal.length; j++)
                            var_list.push(colVal.charCodeAt(j)); //value
                        break;
                    default:
                        dv.setUint16(0, 0, false);
                        var_list.push(dv.getUint8(0), dv.getUint8(1));
                        break;
                }
            }
            nexacro.__forLoop(this, 0, constList.length, __saveBIN_constcol_loopFn);
        }

        //variable list mark 0xFE10
        list.push(0xFE, 0x10);

        //version 5000;
        dv.setUint16(0, 5000, false);
        list.push(dv.getUint8(0), dv.getUint8(1));

        nexacro._Array2DataUtil.addLenToUint8Array(var_list.length, list, dv);

        //count
        dv.setUint16(0, constList.length, false);
        list.push(dv.getUint8(0), dv.getUint8(1));

        //idlen,id,variant
        var_list.forEach(element => list.push(element));

        var_list = [];
        var colList = this.colinfos;

        if (colList.length > 0)
        {
            function __saveBIN_colinfo_loopFn(i)
            {
                var colinfo = colList[i];
                var colId = colinfo.id;

                nexacro._Array2DataUtil.addLenStrToUint8Array(colId, var_list, dv);

                var colType = colinfo.ntype == 9 ? 1 : colinfo.ntype; //string
                dv.setUint16(0, colType, false);
                var_list.push(dv.getUint8(0), dv.getUint8(1));

                var colSize = colinfo.ntype == 9 ? nexacro.DataUtils._default_sizes[1] : colinfo.size;
                dv.setUint16(0, colSize, false);
                var_list.push(dv.getUint8(0), dv.getUint8(1));

                var colProp = 0; //none(0)이 디폴트값;
                var prop = colinfo.prop ? colinfo.prop.toLowerCase() : "";
                switch (prop) 
                {
                    case "count":
                        colProp = 0x1000;
                        break;
                    case "sum":
                        colProp = 0x2000;
                        break;
                    case "max":
                        colProp = 0x3000;
                        break;
                    case "min":
                        colProp = 0x4000;
                        break;
                    case "avg":
                        colProp = 0x5000;
                        break;
                    case "text":
                        colProp = 0x6000;
                        break;
                    case "key":
                        colProp = 0x7000;
                        break;
                    default:
                        break;
                }
                dv.setUint16(0, colProp, false);
                var_list.push(dv.getUint8(0), dv.getUint8(1));

                if (colProp == 0x6000 || colProp == 0x7000)
                {
                    nexacro._Array2DataUtil.addLenStrToUint8Array(colinfo.sumtext, var_list, dv);
                }
            }
            nexacro.__forLoop(this, 0, colList.length, __saveBIN_colinfo_loopFn);
        }

        //count
        dv.setUint16(0, colList.length, false);
        list.push(dv.getUint8(0), dv.getUint8(1));

        //idlen,id,variant
        var_list.forEach(element => list.push(element));

        //dataset head len
        dv.setUint16(0, list.length, false);
        list.unshift(dv.getUint8(0), dv.getUint8(1));

        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;
        var delRecords = this._deletedRecords;
        var saveType = "N";
        switch (type)
        {
            case "A":
            case "a":
            case "all":
            case "All":
                saveType = "A";
                break;
            case "U":
            case "u":
            case "update":
            case "Update":
                saveType = "U";
                break;
            case "V":
            case "v":
            case "view":
            case "View":
                saveType = "V";
                break;
        }

        if (delRecords.length)
        {
            if (saveType == "A" || saveType == "U")
            {
                function __saveBIN_delrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(delRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeBINCrudRow(list, rowRow);
                    }
                }
                nexacro.__forLoop(this, 0, delRecords.length, __saveBIN_delrow_loopFn);
            }
        }

        if (rawRecords.length)
        {
            if (saveType == "A")
            {
                function __saveBIN_allrow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 15)
                    {
                        this.__writeBINCrudRow(list, rowRow);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveBIN_allrow_loopFn);
            }
            else if (saveType == "U")
            {
                function __saveBIN_updaterow_loopFn(i)
                {
                    var rowRow = this.__getParsedRow(rawRecords[i]);
                    if (rowRow._rtype & 14)
                    {
                        this.__writeBINCrudRow(list, rowRow);
                    }
                }
                nexacro.__forLoop(this, 0, rawRecords.length, __saveBIN_updaterow_loopFn);
            }
            else
            {
                if (saveType == "V")
                {
                    function __saveBIN_viewrow_loopFn(i)
                    {
                        var rowRow = this.__getParsedRow(viewRecords[i]);
                        if (rowRow._rtype & 7)
                        {
                            this.__writeBINNormalRow(list, rowRow);
                        }
                    }
                    nexacro.__forLoop(this, 0, viewRecords.length, __saveBIN_viewrow_loopFn);
                }
                else
                {
                    function __saveBIN_normalrow_loopFn(i)
                    {
                        var rowRow = this.__getParsedRow(rawRecords[i]);
                        if (rowRow._rtype & 7)
                        {
                            this.__writeBINNormalRow(list, rowRow);
                        }
                    }
                    nexacro.__forLoop(this, 0, rawRecords.length, __saveBIN_normalrow_loopFn);
                }
            }
        }

        if (constList.length <= 0 && colList.length <= 0 && delRecords.length <= 0 && rawRecords.length <= 0)
            return [];

        return list;
    };

    _pDatasetBase.__writeBINNormalRow = function (list, rowRow)
    {
        //if (rowRow._data) //이 조건에 해당하는 시나리오 찾으면 아래 로직 구현해야 함;
        //rowRow._data의 3,4바이트가 row type이므로 이것만 일치하면 list에 바로 넣어도 무방
        //if (rowRow._data.length > 4 && rowRow._data[3] == 1)
        //    rowRow._data.forEach(element => list.push(element));

        this.__writeBINRowData(list, 1, rowRow); //normal
    };

    _pDatasetBase.__writeBINCrudRow = function (list, rowRow)
    {
        this.__writeBINRowData(list, rowRow._rtype, rowRow);
        if (rowRow._rtype == 4 && rowRow._orgrow)
        {
            this.__writeBINRowData(list, -1, rowRow._orgrow);
        }
    };

    _pDatasetBase.__writeBINRowData = function (list, type, rowRow)
    {
        var colList = this.colinfos;

        var var_list = [];
        const buf = new ArrayBuffer(8);
        var dv = new DataView(buf);

        function __writeBINColData_loopFn(i)
        {
            var colinfo = colList[i];
            var idx = colinfo._index;
            var ntype = colinfo.ntype;
            var value = rowRow[idx];

            value = this._convertValueBySaveProp(value);
            if ((value === undefined) || (value.length <= 0 && ntype != 0))
            {
                ntype = 0;
            }
            //value = colinfo._fromVal(value);
            var j = 0;
            switch (ntype) //_typeint 
            {
                case 1: //string
                    dv.setUint16(0, 21, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1)); //vt type
                    nexacro._Array2DataUtil.addLenStrToUint8Array(value, var_list, dv);
                    break;
                case 2: //int, long
                    dv.setUint16(0, 3, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1));
                    dv.setInt32(0, value, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
                    break;
                case 3: //float, double
                    dv.setUint16(0, 4, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1));
                    dv.setFloat64(0, value, false);
                    for (j = 0; j < 8; j++)
                        var_list.push(dv.getUint8(j));
                    break;
                case 4: //decimal, bigdecimal
                    dv.setUint16(0, 40, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1));
                    value = colinfo._toText(value);
                    nexacro._Array2DataUtil.addLenToUint8Array(value.length, var_list, dv);
                    for (j = 0; j < value.length; j++)
                        var_list.push(value.charCodeAt(j)); //value
                    break;
                case 5: //date
                case 6: //time
                case 7: //datetime
                    dv.setUint16(0, 41, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1));
                    nexacro._Array2DataUtil.addDatetimeToUint8Array(value, var_list, dv);
                    break;
                case 8: //blob  
                    dv.setUint16(0, 26, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1));
                    nexacro._Array2DataUtil.addLenToUint8Array(value.length, var_list, dv);
                    for (j = 0; j < value.length; j++)
                        var_list.push(value.charCodeAt(j)); //value
                    break;
                default:
                    dv.setUint16(0, 0, false);
                    var_list.push(dv.getUint8(0), dv.getUint8(1));
                    break;
            }
        }
        nexacro.__forLoop(this, 0, colList.length, __writeBINColData_loopFn);

        //record type
        if (type != -1) //original(-1)은 타입 적지 않음
        {
            //record size --> type + count 까지 포함하므로 4를 더해줌
            nexacro._Array2DataUtil.addLenToUint8Array(var_list.length + 4, list, dv);

            dv.setUint16(0, type, false); //normal
            list.push(dv.getUint8(0), dv.getUint8(1));

            //count
            dv.setUint16(0, colList.length, false);
            list.push(dv.getUint8(0), dv.getUint8(1));

            //idlen,id,variant
            var_list.forEach(element => list.push(element));

        }

    };

    _pDatasetBase._setSaveProp = function (savenan, saveinfinity, saveinvaliddate)
    {
        this._savenan = nexacro._isNull(savenan) ? this.getSaveNan() : (savenan == "exclude" ? "exclude" : "include");
        this._saveinfinity = nexacro._isNull(saveinfinity) ? this.getSaveInfinity() : (saveinfinity == "exclude" ? "exclude" : "include");
        this._saveinvaliddate = nexacro._isNull(saveinvaliddate) ? this.getSaveInvalidDate() : (saveinvaliddate == "exclude" ? "exclude" : "include");
    };

    _pDatasetBase._convertValueBySaveProp = function (v)
    {
        if (nexacro._isNull(v)) return v;

        var savenan = this._savenan;
        var saveinfinity = this._saveinfinity;
        var saveinvaliddate = this._saveinvaliddate;

        if (savenan == "exclude")
        {
            if (v != v)   //NaN
                return "";
            else if (v instanceof nexacro.Decimal && v.isNaN())
                return "";
        }

        if (saveinfinity == "exclude")
        {
            if (typeof v == "number" && !isNaN(v) && !isFinite(v))
                return "";
            else if (v instanceof nexacro.Decimal && v.isInfinity())
                return "";
        }

        if ((saveinvaliddate == "exclude") && (v instanceof nexacro.Date) && isNaN(v.valueOf()))
            return "";

        return v;
    };

    _pDatasetBase._addDirtyindex = function (idx, type, _row)
    {
        if (this.binddataobject)// && this._is_data_updating != true)
        {
            var row = [];
            var dirtylist = this._dirtylist;
            var prev_idx = dirtylist.length - 1;
            var prev_item = dirtylist[prev_idx];
            var bUpdate = false;
            if (prev_item)
            {
                var check_type = prev_item.type;
                var check_index = prev_item.idx;
                if (check_index == idx)
                {
                    if (check_type != "delete" && type == "update")
                    {
                        type = check_type;
                        idx = check_index;
                        bUpdate = true;
                    }
                }
            }
            if (_row)
            {
                for (var i = 0, len = _row.length; i < len; i++)
                {
                    row[i] = _row[i];
                }
            }
            if (bUpdate)
            {
                var item = dirtylist[prev_idx];
                //dirtylist[prev_idx] = { idx, type, row };
                dirtylist[prev_idx].idx = idx;
                dirtylist[prev_idx].type = type;
                dirtylist[prev_idx].row = row;
            }
            else
            {
                var obj = {};
                obj.idx = idx;
                obj.type = type;
                obj.row = row;
                dirtylist.push(obj);
            }
        }
    };

    _pDatasetBase._refreshDirty = function ()
    {
        var dirty_rows = [];
        var obj = this._binddataobject;
        if (obj)
        {
            var path = this._p_dataobjectpath;
            //var rawRecords = this._rawRecords;

            var dirtylist = this._dirtylist;
            for (var i = 0, len = dirtylist.length; i < len; i++)
            {
                var item = dirtylist[i];
                var type = item.type;
                var idx = item.idx;
                var destRow;
                if (type != "delete")
                    destRow = this._rowToData(item.row);
                dirty_rows.push([type, idx, destRow]);
            }
            if (dirty_rows.length > 0)
                obj.setDataInPath(path, dirty_rows, -1, this.id);
            for (var i = 0, len = dirtylist.length; i < len; i++)
            {
                var item = dirtylist[i];
                item.row = null;
            }
        }

        this._dirtylist.length = 0;
    };

    _pDatasetBase._rowToData = function (srcRow)
    {
        var destRow = {};
        var colList = this.colinfos;
        function __copyRowData_loopFn(i)
        {
            var dpath = this._getPathFromColumninfo(colList[i]);
            if (dpath)
            {
                var value = srcRow[i];
                if (value)
                {
                    var last_idx = value.length - 1;
                    if ((value[0] == "[" && value[last_idx] == "]") || (value[0] == "{" && value[last_idx] == "}"))
                    {
                        value = JSON.parse(value);
                    }
                }
                //destRow[dpath] = value;
                this._setDataInPath(destRow, dpath, value);

            }

        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyRowData_loopFn);
        return destRow;
    };

    _pDatasetBase._setDataInPath = function (target, path, data)
    {
        var temp_target = [];
        if (path.indexOf("@") > -1 || path.indexOf("$") > -1)
        {
            var arr_path = path.match(/[^\]\[.]+/g);
            for (var i = 1, len = arr_path.length; i < len; i++)
            {
                if (i == len - 1)
                    temp_target[arr_path[i]] = data;
                else
                {
                    temp_target = target[arr_path[i]];
                    if (!temp_target)
                    {
                        target[arr_path[i]] = {};
                        temp_target = target = target[arr_path[i]];
                    }
                }
            }
        }
        else
            target[path] = data;
    };

    _pDatasetBase._getPathFromColumninfo = function (colitem)
    {
        var arr_datapath = colitem._datapath;
        if (arr_datapath === undefined && colitem.datapath)
            arr_datapath = colitem.datapath.match(/[^\]\[.]+/g);
        if (arr_datapath && arr_datapath.length == 2)
        {
            return arr_datapath[1];
        }
        return colitem.datapath;
    };


    _pDatasetBase = null;


    //==============================================================================
    // nexacro.TransactionItem : CommunicationItem 상속
    //==============================================================================
    nexacro.TransactionItem = function (path, context, svcid, inDatasetsParam, outDatasetsParam, argsParam, datatype, async, last_modified, version)
    {
        nexacro._CommunicationItem.call(this, path, "data", false, last_modified, version); //"data"type -> this.type

        this.context = context;
        this.svcid = svcid;
        this.inputDatasets = this._parseDSParam(inDatasetsParam);
        this.outputDatasets = this._parseDSParam(outDatasetsParam);
        this.parameters = this._parseVarParam(argsParam);
        this.datatype = (!datatype ? 0 : datatype); // datatype => 0:XML, 1:Binary(Runtime only), 2:SSV

        this._sendData = this._serializeData();

        const env = nexacro.getEnvironment();
        this._usewaitcursor = async && (env && env._p_usewaitcursor);
        this._remain_data = null;

        this._progress_data = null;           // for processing firstrow
        this._is_unknowntype_data = false;
        this._recieved_data = null;
        this._async_progress_timer_id = null;

        this._has_firstcount_dataset = this._hasFirstCountDs();

        this._check_responseXML = false; // do not read responseXML.

        var hascookie = nexacro._hasCookieVariables();
        if (hascookie == false && !this.parameters && !this.inputDatasets)
            this._http_method = "GET";
        else
            this._http_method = "POST";

    };

    var _pTransactionItem = nexacro._createPrototype(nexacro._CommunicationItem, nexacro.TransactionItem);
    nexacro.TransactionItem.prototype = _pTransactionItem;

    _pTransactionItem.handle = null;
    _pTransactionItem.callbackList = [];
    _pTransactionItem.type = "data";
    _pTransactionItem.bcache = false;

    _pTransactionItem._type_name = "TransactionItem";

    _pTransactionItem.on_start = function ()
    {
        if (this._usewaitcursor)
        {
            this._showWaitCursor(this.context);
        }

        nexacro._appendCommContext(this.context);

        const root = this.context._getRootObject();
        if (root)
        {
            root.on_fire_oncommunication(root, 0);
        }
    };

    _pTransactionItem.on_load_data = function (data, cookie, last_modified)
    {
        var datasets = null;
        var parameters = null;
        var errorinfo, i;
        var bcache = this.bcache;
        var ret = null;

        this._addCookieToCookieVariable(cookie);

        if (data && data._type_name == "DataCache")
        {
            bcache = false;
            errorinfo = data._loadData(this);
        }
        else
        {
            if (data && this._protocol < 0)
                data = this.on_decrypt(data);

            if (this._progress_data)
            {
                this.on_progress_data(data, true);
                errorinfo = this._progress_data._error_info;

                var target_ds = null;

                datasets = new nexacro.Collection();
                for (var buff_ds in this._progress_data._datasets)
                {
                    var bufferObj_arr = this._progress_data._datasets[buff_ds];
                    if (bufferObj_arr)
                    {
                        for (i = 0; i < bufferObj_arr.length; i++)
                        {
                            target_ds = bufferObj_arr[i]._target_ds;
                            if (target_ds)
                            {
                                if (bufferObj_arr[i]._isEnable)
                                {
                                    if (bcache)
                                        datasets.add_item(target_ds.id, new nexacro._DataSetCache(target_ds.id, target_ds.colinfos, target_ds._constVars, target_ds._rawRecords));
                                    else
                                        datasets.add_item(target_ds.id, "");
                                }
                                else
                                {
                                    datasets.add_item(target_ds.id, "");
                                }
                            }
                        }
                    }
                }

                this._progress_data._datasets = null;

                parameters = this._progress_data._parameters;
            }
            else
            {
                ret = this._deserializeData(data);
                if (bcache)
                {
                    parameters = ret[1];
                }

                datasets = ret[2];
                errorinfo = ret[0];
            }
        }

        if (bcache)
        {
            var d_cache = nexacro._DataCacheList[this.path];
            if (!d_cache)
            {
                nexacro._DataCacheList[this.path] = new nexacro._DataCache(parameters, datasets, last_modified, this.version)._setContext(this.context);
            }
            else
            {
                d_cache.parameters = parameters;
                d_cache.datasets = datasets;
                d_cache.last_modified = last_modified ? last_modified : "";
                d_cache.version = this.version;
            }
        }

        if (this._usewaitcursor)
        {
            this._hideWaitCursor(this.context);
        }

        nexacro._removeCommContext(this.context);

        const root = this.context._getRootObject();
        if (root)
        {
            root.on_fire_oncommunication(root, 1);
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            var errorcode = errorinfo ? errorinfo[0] : 0;
            var errormsg = errorinfo ? errorinfo[1] : "SUCCESS";

            var loadmanager = this.context._load_manager;
            var dataitem = loadmanager ? loadmanager.getDataItem(this.svcid) : null;
            if (dataitem)
            {
                dataitem._is_cancel = undefined;
            }

            for (i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    if (this._is_unknowntype_data)
                    {
                        item.callback.call(target, this.svcid, errorcode, errormsg, "comm_fail_loaddetail", 10599, this.path, this.path);
                    }
                    else
                    {
                        item.callback.call(target, this.svcid, errorcode, errormsg);
                    }
                }
            }
            callbackList.splice(0, n);
        }

        var view = this.context.parent;
        if (view && view._is_view)
        {
            // 반드시 view여야만 함.
            var form = view.parent;
            // view의 parent는 무조건 form이다
            var manager = form._trigger_manager;
            var triggertype = "";
            var triggerview = view._ismodeltrigger ? view : form;
            var triggerobj = view.getViewDataset();

            if (datasets.indexOf(view._p_viewdataset) >= 0)
            {
                triggertype = "Model Load Success";
            }
            else
            {
                triggertype = "Model Load Fail";
            }

            manager._notifyTrigger(triggertype, triggerobj, triggerview);
        }

        this.handle = null;
    };

    _pTransactionItem.on_load_arraybuffer = function (data, cookie, last_modified)
    {
        var datasets = null;
        var parameters = null;
        var errorinfo, i;
        var bcache = this.bcache;
        var ret = null;

        this._addCookieToCookieVariable(cookie);

        if (data && data._type_name == "DataCache")
        {
            bcache = false;
            errorinfo = data._loadData(this);
        }
        else
        {
            if (data && this._protocol < 0)
                data = this.on_decrypt(data);

            if (this._progress_data)
            {
                this.on_progress_arraybuffer_chunk(data, true);
                errorinfo = this._progress_data._error_info;

                var target_ds = null;

                datasets = new nexacro.Collection();
                for (var buff_ds in this._progress_data._datasets)
                {
                    var bufferObj_arr = this._progress_data._datasets[buff_ds];
                    if (bufferObj_arr)
                    {
                        for (i = 0; i < bufferObj_arr.length; i++)
                        {
                            target_ds = bufferObj_arr[i]._target_ds;
                            if (target_ds)
                            {
                                if (bufferObj_arr[i]._isEnable)
                                {
                                    if (bcache)
                                        datasets.add_item(target_ds.id, new nexacro._DataSetCache(target_ds.id, target_ds.colinfos, target_ds._constVars, target_ds._rawRecords));
                                    else
                                        datasets.add_item(target_ds.id, "");
                                }
                                else
                                {
                                    datasets.add_item(target_ds.id, "");
                                }
                            }
                        }
                    }
                }

                this._progress_data._datasets = null;

                parameters = this._progress_data._parameters;
            }
            else
            {
                //var data_array = new Uint8Array(data);
                ret = this._deserializeUint8Array(data);

                if (bcache)
                {
                    parameters = ret[1];
                }

                datasets = ret[2];
                errorinfo = ret[0];
            }
        }

        if (bcache)
        {
            var d_cache = nexacro._DataCacheList[this.path];
            if (!d_cache)
            {
                nexacro._DataCacheList[this.path] = new nexacro._DataCache(parameters, datasets, last_modified, this.version)._setContext(this.context);
            }
            else
            {
                d_cache.parameters = parameters;
                d_cache.datasets = datasets;
                d_cache.last_modified = last_modified ? last_modified : "";
                d_cache.version = this.version;
            }
        }

        if (this._usewaitcursor)
        {
            this._hideWaitCursor(this.context);
        }

        nexacro._removeCommContext(this.context);

        const root = this.context._getRootObject();
        if (root)
        {
            root.on_fire_oncommunication(root, 1);
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            var errorcode = errorinfo ? errorinfo[0] : 0;
            var errormsg = errorinfo ? errorinfo[1] : "SUCCESS";

            var loadmanager = this.context._load_manager;
            var dataitem = loadmanager ? loadmanager.getDataItem(this.svcid) : null;
            if (dataitem)
            {
                dataitem._is_cancel = undefined;
            }

            for (i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    if (this._is_unknowntype_data)
                    {
                        item.callback.call(target, this.svcid, errorcode, errormsg, "comm_fail_loaddetail", 10599, this.path, this.path);
                    }
                    else
                    {
                        item.callback.call(target, this.svcid, errorcode, errormsg);
                    }
                }
            }
            callbackList.splice(0, n);
        }

        var view = this.context.parent;
        if (view && view._is_view)
        {
            // 반드시 view여야만 함.
            var form = view.parent;
            // view의 parent는 무조건 form이다
            var manager = form._trigger_manager;
            var triggertype = "";
            var triggerview = view._ismodeltrigger ? view : form;
            var triggerobj = view.getViewDataset();

            if (datasets.indexOf(view._p_viewdataset) >= 0)
            {
                triggertype = "Model Load Success";
            }
            else
            {
                triggertype = "Model Load Fail";
            }

            manager._notifyTrigger(triggertype, triggerobj, triggerview);
        }

        this.handle = null;
    };

    _pTransactionItem.on_load_xmldom = function (xmldom, cookie, last_modified)
    {
        this._addCookieToCookieVariable(cookie);

        var ret = this.__deserializeXML("", xmldom);
        var errorcode = 0;
        var errormsg = "SUCCESS";
        var errorinfo = ret[0];

        if (this.bcache)
        {
            var d_cache = nexacro._DataCacheList[this.path];
            if (!d_cache)
            {
                nexacro._DataCacheList[this.path] = new nexacro._DataCache(ret[1], ret[2], last_modified, this.version)._setContext(this.context);
            }
            else
            {
                d_cache.parameters = ret[1];
                d_cache.datasets = ret[2];
                d_cache.last_modified = last_modified;
                d_cache.version = this.version;
            }
        }

        if (errorinfo)
        {
            errorcode = errorinfo[0];
            errormsg = errorinfo[1];
        }

        if (this._usewaitcursor)
        {
            this._hideWaitCursor(this.context);
        }

        nexacro._removeCommContext(this.context);

        const root = this.context._getRootObject();
        if (root)
        {
            root.on_fire_oncommunication(root, 1);
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    if (this._is_unknowntype_data)
                        item.callback.call(target, this.svcid, errorcode, errormsg, "comm_fail_loaddetail", 10599, this.path, this.path);
                    else
                        item.callback.call(target, this.svcid, errorcode, errormsg);
                }
            }
            callbackList.splice(0, n);
        }

        var view = this.context.parent;
        if (view && view._is_view)
        {
            // load_data를 탔지만 data가 없는 경우. fail로 처리하자.
            // 반드시 view여야만 함.
            var form = view.parent;
            // view의 parent는 무조건 form이다
            var manager = form._trigger_manager;
            var triggertype = "";
            var triggerview = view._ismodeltrigger ? view : form;
            var triggerobj = view.getViewDataset();

            if (ret[2].indexOf(view._p_viewdataset) >= 0)
            {
                triggertype = "Model Load Success";
            }
            else
            {
                triggertype = "Model Load Fail";
            }

            manager._notifyTrigger(triggertype, triggerobj, triggerview);
        }

        this.handle = null;
    };

    _pTransactionItem.on_progress = nexacro._emptyFn;
    _pTransactionItem.on_progress_data = function (data, bFinal)
    {
        if (!this._progress_data)
        {
            if (data.charAt(0) === " ")
                data = nexacro.trimLeft(data);

            var data_type = this._getStreamType(data);

            switch (data_type)
            {
                case "CSV":
                    this._progress_data = new nexacro._ProgressDataCSV(this);
                    break;
                case "SSV":
                    this._progress_data = new nexacro._ProgressDataSSV(this);
                    break;
                case "PPX":
                    this._progress_data = new nexacro._ProgressDataPPX(this);
                    break;
                case "XML":
                    this._progress_data = new nexacro._ProgressDataXML(this);
                    break;
                case "UNKNOWN":
                    this._is_unknowntype_data = true;
                    return;
                default:        // XML or unknown type
                    return;
            }
        }

        this._progress_data._on_progress(data, bFinal);
    };

    _pTransactionItem._async_progress_data = function ()
    {
        if (this._b_recieved_all_data)
        {
            this._recieved_data = null;
            return;
        }

        this.on_progress_data(this._recieved_data, false);

        this._b_block_onprogress = false;

        this._recieved_data = null;
    };

    _pTransactionItem.on_progress_arraybuffer_chunk = function (data, bFinal)
    {
        if (!this._progress_data)
        {
            var pos = nexacro._Array2DataUtil.trimLeft(data, 0);

            var data_type = "UNKNOWN";
            if (data && data.length >= (4 + pos))
            {
                if ((data[pos] == 0xfe && data[pos + 1] == 0xff) || (data[pos] == 0xff && data[pos + 1] == 0xfe))
                    pos += 2; //utf-16;
                else if ((data[pos] == 0xef && data[pos + 1] == 0xbb && data[pos + 2] == 0xbf))
                    pos += 3; //utf-8;

                pos = nexacro._Array2DataUtil.trimLeft(data, pos);
                if ((data[pos] == 0xFE) && (data[pos + 1] == 0x10 || data[pos + 1] == 0x01))
                    data_type = "BIN";
            }
            if (data_type == "UNKNOWN")
            {
                var cinfo = nexacro._Array2DataUtil.substr(data, pos, 10);
                data_type = this._getStreamType(cinfo.string);
            }

            switch (data_type)
            {
                case "CSV":
                    {
                        var rs_code_array = [];
                        rs_code_array[0] = "\r".charCodeAt(0);
                        rs_code_array[1] = "\n".charCodeAt(0);
                        var tinfo = nexacro._Array2DataUtil.indexOf(data, pos, rs_code_array);
                        var rs;
                        if (tinfo.index < 0)
                            rs = "\n";
                        else
                            rs = "\r\n";

                        this._progress_data = new nexacro._ProgressDataCSV(this, rs);
                    }
                    break;
                case "SSV":
                    this._progress_data = new nexacro._ProgressDataSSV(this);
                    break;
                case "PPX":
                    this._progress_data = new nexacro._ProgressDataPPX(this);
                    break;
                case "XML":
                    this._progress_data = new nexacro._ProgressDataXML(this);
                    this._progress_data._parsing_min_size = 1024 * 16;
                    break;
                case "{":   // JSON
                    this._b_block_onprogress = true;
                    return false;
                case "BIN":
                    this._progress_data = new nexacro._ProgressDataBIN(this);
                    this._progress_data._skipbinpos = pos;
                    break;
                case "UNKNOWN":
                    this._is_unknowntype_data = true;
                    return false;
                default:        // XML or unknown type
                    return false;
            }
        }

        this._progress_data._on_progress_arraybuffer_chunk(data, bFinal);

        this._b_block_onprogress = false;

        return true;
    };

    _pTransactionItem.on_error = function (errstatus, fireerrorcode, returncode, locationurl, extramsg)
    {
        // cancel을 하게 되면 ajax.abort를 하기 전에 application.onerror를 fire해서 return값을 얻어온다.

        if (this._usewaitcursor)
        {
            this._hideWaitCursor(this.context);
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        var ret = false;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    ret = item.callback.call(target, this.svcid, -1, "FAILED", fireerrorcode, returncode, this.path, locationurl, extramsg);
                    if (ret)
                    {
                        if (this._usewaitcursor)
                        {
                            this._showWaitCursor(this.context);
                        }
                        continue;
                    }
                }
            }

            var view = this.context.parent;
            if (view && view._is_view)
            {
                for (var j = 0; this.outputDatasets.length > j; j++)
                {
                    if (this.outputDatasets[j].lval == view._p_viewdataset)
                    {
                        // 반드시 view여야만 함.
                        var form = view.parent;
                        // view의 parent는 무조건 form이다
                        var manager = form._trigger_manager;
                        var triggertype = "Model Load Fail";
                        var triggerview = view._ismodeltrigger ? view : form;
                        var triggerobj = view.getViewDataset();

                        manager._notifyTrigger(triggertype, triggerobj, triggerview);
                        break;
                    }
                }
            }

            if (ret) return true;
        }

        var loadmanager = this.context._load_manager;
        var dataitem = loadmanager ? loadmanager.getDataItem(this.svcid) : null;
        //var dataitem_handle = dataitem ? dataitem.handle : null;

        // cancel로 들어올때는 dataitem이 null인상태임.

        if (dataitem && !dataitem._is_cancel) return;

        callbackList.splice(0, n);

        nexacro._removeCommContext(this.context);

        //if (dataitem_handle && dataitem_handle._user_aborted)
        const root = this.context._getRootObject();
        if (root)
        {
            root.on_fire_oncommunication(root, 1);
        }

        this.handle = null;
    };

    _pTransactionItem._loadFromData = function (data)
    {
        var ret;
        if (nexacro._Array2DataUtil.isTypedArray(data))
        {
            ret = this._deserializeUint8Array(data);
        }
        else
        {
            ret = this._deserializeData(data);
        }

        var errorcode = 0;
        var errormsg = "SUCCESS";
        var bcache = this.bcache;
        var last_modified = this.last_modified;

        var errorinfo = ret[0];
        if (errorinfo)
        {
            errorcode = errorinfo[0];
            errormsg = errorinfo[1];
        }

        if (bcache)
        {
            var parameters = ret[1];
            var datasets = ret[2];

            var d_cache = nexacro._DataCacheList[this.path];
            if (!d_cache)
            {
                nexacro._DataCacheList[this.path] = new nexacro._DataCache(parameters, datasets, last_modified, this.version)._setContext(this.context);
            }
            else
            {
                d_cache.parameters = parameters;
                d_cache.datasets = datasets;
                d_cache.last_modified = last_modified ? last_modified : "";
                d_cache.version = this.version;
            }
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    item.callback.call(target, this.svcid, errorcode, errormsg);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };

    _pTransactionItem._showWaitCursor = function (context)
    {
        if (context)
        {
            context._waitCursor(true, context);

            if (nexacro._refcommuni && nexacro._refcommuni >= 0)
            {
                nexacro._refcommuni++;
            }
            else
            {
                nexacro._refcommuni = 0;
            }
        }
    };

    _pTransactionItem._hideWaitCursor = function (context)
    {
        if (context)
        {
            context._waitCursor(false, context);

            if (nexacro._refcommuni > 0)
            {
                nexacro._refcommuni--;
            }
        }
    };

    _pTransactionItem._parseDSParam = function (paramStr)
    {
        if (!paramStr)
        {
            return undefined;
        }

        var list = [];
        var expr = /([a-zA-Z가-힣_$][.a-zA-Z가-힣0-9_$]*)\s*=\s*([a-zA-Z가-힣_$][.,a-zA-Z가-힣0-9_$]*(?:\:[aAuUnNPp])?)/g; // 2014-07-31 case hangle , $
        var splitedParams = paramStr.match(expr);

        if (!splitedParams || splitedParams.length == 0)
        {
            // clear RegExp input & Matched variables
            //" ".match(/\s/);
            return undefined;
        }
        var splitedParamCnt = splitedParams.length;

        //var listLength = 0;
        var i;
        for (i = 0; i < splitedParamCnt; i++)
        {
            var param = splitedParams[i].split("=");
            var key = param[0].trim();
            var value = param[1].trim();
            /*
            var bduplicate = false;
            for (var j = 0; j < i; j++)
            {
                var checkparam = splitedParams[j].split("=");
                var checkkey = checkparam[0].trim();

                if (key == checkkey)
                {
                    bduplicate = true;
                }

            }

            if (bduplicate)
            {
                i++;

                // clear RegExp input & Matched variables
                //" ".match(/\s/);
                return false;
            }
            */
            var type = "N";

            var index = value.indexOf(":");
            if (index > -1)
            {
                type = value.substring(index + 1);
                value = value.substring(0, index);
            }

            var paramObj =
            {
                lval: key,
                rval: value,
                saveType: type
            };
            list.push(paramObj);
        }

        // clear RegExp input & Matched variables
        //" ".match(/\s/);

        return list;
    };

    _pTransactionItem._parseVarParam = function (paramStr)
    {
        if (!paramStr)
        {
            return;
        }

        paramStr = paramStr.replace(/^\s*|\s*$/g, '');
        if (paramStr.length == 0)
        {
            return undefined;
        }

        var list = [];
        var expr = /([a-zA-Z_][a-zA-Z0-9_]*)\s*="((\\\")+|[^\"])*"|([a-zA-Z_][a-zA-Z0-9_]*)\s*='((\\\')+|[^\'])*'|([a-zA-Z_][a-zA-Z0-9_]*)\s*=([^ ]*)/g;

        var splitedParams = paramStr.match(expr);
        if (splitedParams)
        {
            var splitedParamCnt = splitedParams.length;
            for (var i = 0; i < splitedParamCnt; i++)
            {
                var param = splitedParams[i].split("=");
                var len = param.length;
                var key = param[0].trim();
                var value = param[1].trim();

                for (var j = 2; j < len; j++)
                {
                    value = value + "=" + param[j].trim();
                }

                var type = "N";

                len = value.length;
                if (len > 0)
                {
                    value = nexacro.stripQuote(value);	// change the code by comnik in upgarage 20150827
                }

                var paramObj =
                {
                    lval: key,
                    rval: value,
                    saveType: type
                };

                list.push(paramObj);
            }
        }

        // clear RegExp input & Matched variables
        //" ".match(/\s/);

        return list;
    };

    _pTransactionItem._serializeData = function ()
    {
        if (this.datatype == 1) // BIN (Runtime Only)
        {
            return this.__serializeBIN();
        }
        else if (this.datatype == 2) // SSV
        {
            return this.__serializeSSV();
        }
        else if (this.datatype == 3) //JSON
        {
            return this.__serializeJSON();
        }
        else
        {
            return this.__serializeXML();
        }
    };

    _pTransactionItem.__serializeXML = function ()
    {
        var depth = 0;
        var list = [], cookievar = [], pro;

        var argParamsCnt = 0;
        var cookievarCnt = 0;
        var i;
        var id, val;
        var enginecookievars = nexacro._getCookieVariables(4);
        if (enginecookievars)
        {
            for (pro in enginecookievars)
            {
                cookievar.push({ id: pro, value: enginecookievars[pro].value });
            }

            //enginecookievars = null;
        }

        enginecookievars = nexacro._getCookieVariables(6);  // secure cookie
        if (enginecookievars)
        {
            for (pro in enginecookievars)
            {
                cookievar.push({ id: pro, value: enginecookievars[pro].value });
            }

            //enginecookievars = null;
        }

        this._writeData(list, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>", depth);
        this._writeData(list, "<Root xmlns=\"http://www.nexacroplatform.com/platform/dataset\">", depth++);



        var argParams = this.parameters;
        if (argParams)
        {
            argParamsCnt = argParams.length;
        }
        //if (cookievar)
        //{
        cookievarCnt = cookievar.length;
        //}

        if (argParamsCnt > 0 || cookievarCnt > 0)
        {
            this._writeData(list, "<Parameters>", depth++);

            if (cookievarCnt)
            {
                for (i = 0; i < cookievarCnt; i++)
                {
                    var cookie = cookievar[i];
                    if (!cookie)
                        continue;
                    id = cookie.id;
                    val = cookie.value;

                    if (val && val.length)
                    {
                        val = nexacro._encodeXml(val);
                        this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
                    }
                    else
                    {
                        this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
                    }
                }
            }
            if (argParamsCnt > 0)
            {
                for (i = 0; i < argParamsCnt; i++)
                {
                    id = argParams[i].lval;
                    val = argParams[i].rval;

                    if (val && val.length)
                    {
                        val = nexacro._encodeXml(val);
                        this._writeData(list, "<Parameter id=\"" + id + "\">" + val + "</Parameter>", depth);
                    }
                    else
                    {
                        this._writeData(list, "<Parameter id=\"" + id + "\" />", depth);
                    }
                }
            }
            this._writeData(list, "</Parameters>", --depth);
        }
        else
        {
            this._writeData(list, "<Parameters />", depth);
        }

        var datasetParams = this.inputDatasets;
        if (datasetParams && datasetParams.length)
        {
            var datasetCnt = datasetParams.length;
            for (i = 0; i < datasetCnt; i++)
            {
                id = datasetParams[i].rval;
                var ds = this.context._getDatasetObject(id);
                if (ds)
                {
                    list.push(ds._saveXML(datasetParams[i].lval, datasetParams[i].saveType, depth));
                }
            }
        }
        this._writeData(list, "</Root>", --depth);

        var rntVal;

        if (argParamsCnt == 0 && cookievarCnt == 0 && (!datasetParams || datasetParams.length == 0))
        {
            rntVal = "";
        }
        else
        {
            rntVal = list.join("\n");
        }

        return rntVal;
    };

    _pTransactionItem.__serializeSSV = function ()
    {
        //var _rs_ = String.fromCharCode(30);
        var _rs_ = nexacro._getSSVRecordSeparator();
        //var _cs_ = String.fromCharCode(31);

        //var depth = 0;
        var list = [], cookievar = [], pro;

        var enginecookievars = nexacro._getCookieVariables(4);
        if (enginecookievars)
        {
            for (pro in enginecookievars)
            {
                cookievar.push({ id: pro, value: enginecookievars[pro].value });
            }

            //enginecookievars = null;
        }

        enginecookievars = nexacro._getCookieVariables(6);  // secure cookie
        if (enginecookievars)
        {
            for (pro in enginecookievars)
            {
                cookievar.push({ id: pro, value: enginecookievars[pro].value });
            }

            //enginecookievars = null;
        }

        var id, val, ds, i;

        //var listLength = 0;
        list.push("SSV:utf-8" + _rs_);

        // Variables
        var argParamsCnt = 0;
        var cookievarCnt = 0;

        var argParams = this.parameters;
        if (argParams)
        {
            argParamsCnt = argParams.length;
        }
        //if (cookievar)
        //{
        cookievarCnt = cookievar.length;
        //}

        if (cookievarCnt > 0)
        {
            for (i = 0; i < cookievarCnt; i++)
            {
                var cookie = cookievar[i];
                if (!cookie)
                    continue;
                id = cookie.id;
                val = cookie.value;


                if (val && val.length)
                {
                    //val = val;
                    list.push(id + "=" + val + _rs_);
                }
                else
                {
                    list.push(id + "=" + _rs_);
                }
            }
        }
        if (argParamsCnt > 0)
        {
            for (i = 0; i < argParamsCnt; i++)
            {
                id = argParams[i].lval;
                val = argParams[i].rval;

                if (val)
                {
                    //val = val;
                    list.push(id + "=" + val + _rs_);
                }
                else
                {
                    list.push(id + "=" + _rs_);
                }
            }
        }

        // Dataset
        var datasetParams = this.inputDatasets;
        if (datasetParams && datasetParams.length)
        {
            var datasetCnt = datasetParams.length;
            for (i = 0; i < datasetCnt; i++)
            {
                id = datasetParams[i].rval;
                ds = this.context._getDatasetObject(id);
                if (ds)
                {
                    list.push(ds.saveSSV(datasetParams[i].lval, datasetParams[i].saveType));
                }
            }
        }

        var rtnVal = list.join("");
        return rtnVal;
    };

    _pTransactionItem.__serializeBIN = function ()
    {
        var use_fakexhr = false;
        if (nexacro._isHybrid && nexacro._isHybrid())
        {
            // TODO: compress 인 경우에도 FakeXMLHttpRequest를 사용한다.
            if (nexacro._OS == "iOS" || (nexacro._OS == "Android" && this.type == "data"))
            {
                if (document.location.href.indexOf("file://") == 0)
                {
                    use_fakexhr = true;
                }
            }

            if (this._protocol == -1)
            {
                use_fakexhr = true;
            }
        }

        if (use_fakexhr)
        {
            return this.__serializeSSV();
        }

        if (nexacro._Browser != "Runtime")
        {
            //var depth = 0;
            var list = [], cookievar = [], pro;

            var enginecookievars = nexacro._getCookieVariables(4);
            if (enginecookievars)
            {
                for (pro in enginecookievars)
                {
                    cookievar.push({ id: pro, value: enginecookievars[pro].value });
                }

                //enginecookievars = null;
            }

            enginecookievars = nexacro._getCookieVariables(6);  // secure cookie
            if (enginecookievars)
            {
                for (pro in enginecookievars)
                {
                    cookievar.push({ id: pro, value: enginecookievars[pro].value });
                }

                //enginecookievars = null;
            }

            var id, val, ds, i, j;

            // Variables
            var argParamsCnt = 0;
            var cookievarCnt = 0;

            var argParams = this.parameters;
            if (argParams)
            {
                argParamsCnt = argParams.length;
            }
            cookievarCnt = cookievar.length;

            const buf = new ArrayBuffer(8);
            var dv = new DataView(buf);
            var var_list = []; //idlen,id,variant
            if (cookievarCnt > 0)
            {
                for (i = 0; i < cookievarCnt; i++)
                {
                    var cookie = cookievar[i];
                    if (!cookie)
                        continue;
                    id = cookie.id;
                    val = cookie.value;

                    nexacro._Array2DataUtil.addLenStrToUint8Array(id, var_list, dv);

                    //value type
                    dv.setUint16(0, 21, false); //string (vt = 21)
                    var_list.push(dv.getUint8(0), dv.getUint8(1));

                    //value
                    nexacro._Array2DataUtil.addLenStrToUint8Array(val, var_list, dv); //string len;
                }
            }
            if (argParamsCnt > 0)
            {
                for (i = 0; i < argParamsCnt; i++)
                {
                    id = argParams[i].lval;
                    val = argParams[i].rval;

                    nexacro._Array2DataUtil.addLenStrToUint8Array(id, var_list, dv); //string len;

                    //value type
                    dv.setUint16(0, 21, false); //string (vt = 21)
                    var_list.push(dv.getUint8(0), dv.getUint8(1));

                    //value
                    nexacro._Array2DataUtil.addLenStrToUint8Array(val, var_list, dv); //string len;
                }
            }

            if (var_list.length > 0)
            {
                //variable list mark 0xFE10
                list.push(0xFE, 0x10);

                //version 5000;
                dv.setUint16(0, 5000, false);
                list.push(dv.getUint8(0), dv.getUint8(1));
                //size
                nexacro._Array2DataUtil.addLenToUint8Array(var_list.length, list, dv);
                //count
                dv.setUint16(0, cookievarCnt + argParamsCnt, false);
                list.push(dv.getUint8(0), dv.getUint8(1));

                //idlen,id,variant
                var_list.forEach(element => list.push(element));
            }

            // Dataset
            var datasetParams = this.inputDatasets;
            if (datasetParams && datasetParams.length)
            {
                var datasetCnt = datasetParams.length;
                for (i = 0; i < datasetCnt; i++)
                {
                    id = datasetParams[i].rval;
                    ds = this.context._getDatasetObject(id);
                    if (ds)
                    {
                        var dsdata = ds._saveBINUint8Array(datasetParams[i].lval, datasetParams[i].saveType);
                        if (dsdata.length > 0)
                        {
                            //dataset mark 0xFE01
                            list.push(0xFE, 0x01);

                            //version 5000;
                            dv.setUint16(0, 5000, false);
                            list.push(dv.getUint8(0), dv.getUint8(1));

                            //dataset value
                            dsdata.forEach(element => list.push(element));
                            list.push(0, 0, 0, 0); //null record;
                        }
                    }
                }
            }
            const bin_list = new Uint8Array(list.length);
            bin_list.set(list);
            return bin_list;
            //return list;
        }
        var ssvdata = this.__serializeSSV();
        if (ssvdata)
        {
            return nexacro._convertStreamSSVToBIN(ssvdata);
        }
        return "";
    };

    _pTransactionItem.__serializeJSON = function ()
    {
        var depth = 0;
        var list = [], cookievar = [], pro;

        var argParamsCnt = 0;
        var cookievarCnt = 0;
        var i, id, val, rntVal;

        var enginecookievars = nexacro._getCookieVariables(4);
        if (enginecookievars)
        {
            for (pro in enginecookievars)
            {
                cookievar.push({ id: pro, value: enginecookievars[pro].value });
            }
        }

        enginecookievars = nexacro._getCookieVariables(6);  // secure cookie
        if (enginecookievars)
        {
            for (pro in enginecookievars)
            {
                cookievar.push({ id: pro, value: enginecookievars[pro].value });
            }
        }

        this._writeData(list, "{", depth++);
        var version = "1.0";
        this._writeData(list, "\"version\":\"" + version + "\",", depth);
        var argParams = this.parameters;
        if (argParams)
        {
            argParamsCnt = argParams.length;
        }

        cookievarCnt = cookievar.length;

        if (argParamsCnt > 0 || cookievarCnt > 0)
        {
            this._writeData(list, "\"Parameters\":", depth);
            this._writeData(list, "[", depth++);
            var comma = "";
            if (cookievarCnt)
            {
                for (i = 0; i < cookievarCnt; i++)
                {
                    var cookie = cookievar[i];
                    if (!cookie)
                        continue;
                    id = cookie.id;
                    val = cookie.value;

                    this._writeData(list, "{", depth++);
                    if (i < cookievarCnt - 1 || argParamsCnt > 0) comma = ",";
                    else comma = "";

                    if (val && val.length)
                    {
                        val = nexacro._encodeXml(val);
                        this._writeData(list, "\"id\":\"" + id + "\", \"value\":\"" + val + "\"", depth);
                    }
                    else
                    {
                        this._writeData(list, "\"id\":\"" + id + "\"", depth);
                    }
                    this._writeData(list, "}" + comma, --depth);
                }
            }
            if (argParamsCnt > 0)
            {
                comma = "";
                for (i = 0; i < argParamsCnt; i++)
                {
                    id = argParams[i].lval;
                    val = argParams[i].rval;
                    this._writeData(list, "{", depth++);
                    if (i < argParamsCnt - 1) comma = ",";
                    else comma = "";
                    if (val && val.length)
                    {
                        val = nexacro._encodeXml(val);
                        this._writeData(list, "\"id\":\"" + id + "\", \"value\":\"" + val + "\"", depth);
                    }
                    else
                    {
                        this._writeData(list, "\"id\":\"" + id + "\"", depth);
                    }
                    this._writeData(list, "}" + comma, --depth);
                }
            }
            this._writeData(list, "],", --depth);
        }

        var datasetParams = this.inputDatasets;
        if (datasetParams && datasetParams.length)
        {
            var datasetCnt = datasetParams.length;
            this._writeData(list, "\"Datasets\":", depth);
            this._writeData(list, "[", depth++);

            for (i = 0; i < datasetCnt; i++)
            {
                id = datasetParams[i].rval;
                var ds = this.context._getDatasetObject(id);
                if (ds)
                {
                    if (i > 0)
                        this._addStringJSONData(list, ",");
                    list.push(ds._saveJSON(datasetParams[i].lval, datasetParams[i].saveType, depth));
                }
            }
            this._writeData(list, "]", --depth);
        }
        this._writeData(list, "}", --depth);

        if (argParamsCnt == 0 && cookievarCnt == 0 && (!datasetParams || datasetParams.length == 0))
        {
            rntVal = "";
        }
        else
        {
            rntVal = list.join("\n");
        }

        return rntVal;
    };

    _pTransactionItem._deserializeData = function (strRecvData)
    {
        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], [], new nexacro.Collection()];
        }
        if (strRecvData.charAt(0) == " ")
            strRecvData = strRecvData.trim();

        var fstr = strRecvData.substring(0, 3);

        if (fstr == "SSV") // SSV Type (HEX:53,53,56)
        {
            return this.__deserializeSSV(strRecvData);
        }
        else if (fstr == "CSV") // CSV Type (HEX:43,53,56)
        {
            return this.__deserializeCSV(strRecvData);
        }
        else if (fstr == "PPX") // PPX Type : Runtime only
        {
            return this.__deserializePPX(strRecvData);
        }
        else if (fstr[0] == "{")
        {
            return this.__deserializeJSON(strRecvData);
        }
        else // XML Type (HEX:3C,3F)
        {
            return this.__deserializeXML(strRecvData);
        }
    };

    //////////////////////////////////////////////////////////////////////////////
    // _Array2DataUtil
    nexacro._Array2DataUtil = {

        isTypedArray: function (data)
        {
            return !!data && data.byteLength !== undefined;
        },
        getCh: function (data, offset)
        {
            if (!data)
            {
                return { string: '', byteLength: 0 };
            }

            var pos = offset, length = data.length;
            if (length == 0 || offset >= length) 
            {
                return { string: '', byteLength: 0 };
            }

            var cc, cc2, cc3, ch = '', bytes = 0;
            cc = data[pos++];

            switch (cc >> 4)
            {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    {
                        ch = String.fromCharCode(cc);
                        bytes = 1;
                    }
                    break;

                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    {
                        if (pos < length) 
                        {
                            cc2 = data[pos++];
                            ch = String.fromCharCode(((cc & 0x1F) << 6) | (cc2 & 0x3F));

                            bytes = 2;
                        }
                    }
                    break;

                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    {
                        if (pos + 1 < length) 
                        {
                            cc2 = data[pos++];
                            cc3 = data[pos++];
                            ch = String.fromCharCode(((cc & 0x0F) << 12) |
                                ((cc2 & 0x3F) << 6) |
                                ((cc3 & 0x3F) << 0));

                            bytes = 3;
                        }
                    }
                    break;
            }

            return { string: ch, byteLength: bytes };
        },
        getString: function (data)
        {
            if (!data)
            {
                return "";
            }
            var decoder = nexacro._getTextDecoder();
            if (decoder)
            {
                return decoder.decode(data);
            }
            else
            {
                return this.substring(data, 0).string;
            }
        },
        indexOf: function (data, offset, findarray) 
        {
            if (!data)
            {
                return { index: -1, byteLength: 0 };
            }

            var pos = offset, length = data.length;
            if (length == 0 || offset >= length) 
            {
                return { index: -1, byteLength: 0 };
            }

            var token_len = findarray.length;
            if (token_len == 0) 
            {
                return { index: pos, byteLength: 0 };
            }
            if (offset + token_len >= length) 
            {
                return { index: -1, byteLength: 0 };
            }

            var matched = false;

            var fidx = 0, fpos = -1;
            var _pos = -1;
            if (data.indexOf !== undefined)
            {
                while (pos <= length)
                {
                    if (fidx == 0)        
                    {
                        _pos = data.indexOf(findarray[fidx], pos);
                        if (_pos == -1)
                        {
                            matched = false;
                            break;
                        }
                        else
                        {
                            fpos = pos = _pos;
                            fidx++;
                        }
                    }
                    else
                    {
                        if (data[pos] == findarray[fidx])
                        {
                            fidx++;
                        }
                        else
                        {
                            //pos++;
                            fidx = 0;
                            fpos = -1;
                        }
                    }
                    if (token_len == fidx)
                    {
                        matched = true;
                        break;
                    }
                    pos++;
                }
            }
            else
            {
                var cc, bytes = 1;
                while (pos < length)
                {
                    cc = data[pos];

                    switch (cc >> 4)
                    {
                        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                            bytes = 1;
                            break;

                        case 12: case 13:
                            bytes = 2;
                            break;

                        case 14:
                            bytes = 3;
                            break;

                        default:
                            bytes = 0;
                            break;
                    }

                    if (bytes == 0) break;

                    matched = (cc == findarray[fidx] && (token_len - fidx) >= bytes);
                    if (matched)
                    {
                        if (bytes >= 2) matched = (data[pos + 1] == findarray[fidx + 1]);
                        if (bytes >= 3) matched = (data[pos + 2] == findarray[fidx + 2]);

                        if (matched)
                        {
                            if (fidx == 0) fpos = pos;
                            fidx += bytes;

                            if (fidx == token_len) break;
                        }
                        else
                        {
                            fidx = 0;
                            fpos = -1;
                        }
                    }
                    else
                    {
                        fidx = 0;
                    }
                    pos += bytes;
                    matched = false;
                }
            }
            // RP_93305 : csv데이터 마지막에 엔터정보가 없을때 데이터 못가져오는 현상 (해당 코드가 필요함, 이코드가 들어가면 기본 대용량 통신시 추가 데이터가 들어가고 있음)
            //if (!matched && pos == length)
            //{                
            //return { index: pos, byteLength: token_len };
            //}

            return matched ? { index: fpos, byteLength: token_len } : { index: -1, byteLength: 0 };
        },
        lastIndexOf: function (data, offset, findarray) 
        {
            if (!data)
            {
                return { index: -1, byteLength: 0 };
            }

            var length = data.length;
            var pos = offset ? offset : length;
            if (length == 0 || offset >= length) 
            {
                return { index: -1, byteLength: 0 };
            }

            var token_len = findarray.length;
            if (token_len == 0) 
            {
                return { index: pos, byteLength: 0 };
            }
            if (offset + token_len >= length) 
            {
                return { index: -1, byteLength: 0 };
            }

            var matched = false;

            var fidx = token_len - 1, fpos = -1;

            var _pos = -1;
            if (data.lastIndexOf !== undefined)
            {
                while (pos >= 0)
                {
                    if (fidx == token_len - 1)        
                    {
                        _pos = data.lastIndexOf(findarray[fidx], pos);
                        if (_pos == -1)
                        {
                            matched = false;
                            break;
                        }
                        else
                        {
                            pos = _pos;
                            fidx--;
                        }
                    }
                    else
                    {
                        if (data[pos] == findarray[fidx])
                        {
                            if (fidx == 0)
                            {
                                matched = true;
                                fpos = pos;
                                break;
                            }
                            fidx--;
                        }
                        else
                        {
                            //pos++;
                            fidx = token_len - 1;
                            fpos = -1;
                        }
                    }
                    pos--;
                }
            }
            else
            {
                var cc, bytes = 1;
                while (pos >= 0)
                {
                    cc = data[pos];

                    switch (cc >> 4)
                    {
                        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                            bytes = 1;
                            break;

                        case 12: case 13:
                            bytes = 2;
                            break;

                        case 14:
                            bytes = 3;
                            break;

                        default:
                            bytes = 0;
                            break;
                    }

                    if (bytes == 0) break;
                    matched = (cc == findarray[fidx] && (token_len - fidx) >= bytes);

                    if (matched)
                    {
                        if (bytes >= 2) matched = (data[pos - 1] == findarray[fidx - 1]);
                        if (bytes >= 3) matched = (data[pos - 2] == findarray[fidx - 2]);

                        if (matched)
                        {
                            if (fidx == 1)
                                fpos = pos;
                            fidx -= bytes;

                            if (fidx == 0)
                                break;
                        }
                        else
                        {
                            fidx = token_len - 1;
                            fpos = -1;
                        }
                    }
                    else
                    {
                        fidx = token_len - 1;
                    }
                    pos -= bytes;
                    matched = false;
                }

            }
            return matched ? { index: fpos, byteLength: token_len } : { index: -1, byteLength: 0 };
        },
        find: function (data, offset, token_str)
        {
            if (!data)
            {
                return { index: -1, byteLength: 0 };
            }

            var pos = offset, length = data.length;
            var tok_len = token_str.length;

            if (length == 0 || offset >= length) 
            {
                return { index: -1, byteLength: 0 };
            }
            if (tok_len == 0) 
            {
                return { index: pos, byteLength: 0 };
            }

            var cinfo, tinfo, tok_ch = token_str[0];
            while (pos < length)
            {
                cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                if (cinfo.string == '') break;

                if (cinfo.string == tok_ch)
                {
                    var i = 1, tpos = pos + cinfo.byteLength, tstr = cinfo.string;
                    for (; i < tok_len; i++)
                    {
                        tinfo = nexacro._Array2DataUtil.getCh(data, tpos);
                        if (tinfo.string == '') break;

                        tstr += tinfo.string;
                        tpos += tinfo.byteLength;

                        if (tinfo.string == '' || tinfo.string != token_str[i])
                            break;
                    }

                    if (tstr == token_str)
                    {
                        return { index: pos, byteLength: (tpos - pos) };
                    }

                    pos = tpos;
                }
                else
                {
                    pos += cinfo.byteLength;
                }
            }

            return { index: -1, byteLength: 0 };
        },
        substr: function (data, offset, charCnt)
        {
            if (!data)
            {
                return { string: '', byteLength: 0 };
            }

            var pos = offset, length = data.length;

            if (length == 0 || offset >= length) 
            {
                return { string: '', byteLength: 0 };
            }

            charCnt |= 0;
            if (charCnt < 1) charCnt = 1;

            var cinfo, str = '';
            var decoder = nexacro._getTextDecoder();
            if (decoder)
            {
                var end = offset + charCnt;
                var _data = data.slice(offset, end);
                str = decoder.decode(_data);
                pos += _data.length;
            }
            else
            {
                while (pos < length && charCnt > 0)
                {
                    cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                    if (cinfo.string == '') break;

                    str += cinfo.string;
                    pos += cinfo.byteLength;

                    charCnt--;
                }
            }
            return { string: str, byteLength: (pos - offset) };
        },
        substring: function (data, offset, end)
        {
            if (!data)
            {
                return { string: '', byteLength: 0 };
            }

            var pos = offset, length = data.length;

            if (length == 0 || offset >= length) 
            {
                return { string: '', byteLength: 0 };
            }

            if (end == undefined) end = length;
            else if (end < 0 || end > length) end = length;

            let str = '';
            var decoder = nexacro._getTextDecoder();
            if (decoder)
            {
                var _data = data.slice(offset, end);
                str = decoder.decode(_data);
                pos += _data.length;
            }
            else
            {
                var cinfo;
                while (pos < end)
                {
                    cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                    if (cinfo.string == '') break;

                    str += cinfo.string;
                    pos += cinfo.byteLength;
                }
            }

            return { string: str, byteLength: (pos - offset) };
        },
        substringOf: function (data, offset, find_chars)
        {
            if (!data)
            {
                return { string: '', byteLength: 0, nextOffset: offset, matched: false };
            }

            var pos = offset, nextPos = offset, length = data.length;

            var find_str = find_chars;
            if (Array.isArray(find_chars))
                find_str = find_chars.join();

            var find_len = find_str.length;

            if (length == 0 || offset >= length || find_len <= 0) 
            {
                return { string: '', byteLength: 0, nextOffset: offset, matched: false };
            }

            var matched = false;
            var cinfo, tinfo, find_ch = find_str[0], str = '';
            while (pos < length)
            {
                cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                if (cinfo.string == '') break;

                if (cinfo.string == find_ch)
                {
                    var i = 1, tpos = pos + cinfo.byteLength, tstr = cinfo.string;
                    for (; i < find_len; i++)
                    {
                        tinfo = nexacro._Array2DataUtil.getCh(data, tpos);
                        if (tinfo.string == '') break;

                        tstr += tinfo.string;
                        tpos += tinfo.byteLength;

                        if (tinfo.string == '' || tinfo.string != find_str[i])
                            break;
                    }

                    if (tstr == find_str)
                    {
                        matched = true;
                        nextPos = tpos;
                        break;
                    }

                    str += tstr;
                    nextPos = pos = tpos;
                }
                else
                {
                    str += cinfo.string;
                    pos += cinfo.byteLength;
                    nextPos = pos;
                }
            }

            return { string: str, byteLength: (pos - offset), nextOffset: nextPos, matched: matched };
        },
        trimLeft: function (data, offset, trim_chars)
        {
            if (!data) return

            var pos = offset, length = data.length;

            if (length == 0 || offset >= length) return;

            if (trim_chars == undefined) trim_chars = ' ';

            var cinfo;
            while (pos < length)
            {
                cinfo = nexacro._Array2DataUtil.getCh(data, pos);
                if (cinfo.string == '') break;

                if (trim_chars.indexOf(cinfo.string) < 0)
                    break;

                pos += cinfo.byteLength;
            }

            return pos;
        },
        getLenFromUint8Array: function (data, offset, dataview)
        {
            var dv = dataview;
            if (!dv)
                dv = new DataView(data.buffer);

            var pos = offset;
            if (pos + 2 >= data.length)
                return [pos, null];

            var len = dv.getUint16(pos);
            if ((data[offset] & 0x80) != 0) // long
            {
                len = (dv.getUint32(offset, false) & 0x7FFFFFFF);
                pos += 4;
            }
            else
                pos += 2;

            return [pos, len];
        },
        addLenToUint8Array: function (val, list, dataview)
        {
            var dv = dataview;
            if (!dv)
            {
                const buf = new ArrayBuffer(4);
                dv = new DataView(buf);
            }

            if (val <= 32767) //unsigned short max;
            {
                dv.setUint16(0, val, false);
                list.push(dv.getUint8(0), dv.getUint8(1));
            }
            else
            {
                dv.setUint32(0, val | 0x80000000, false);
                list.push(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
            }
        },
        addLenStrToUint8Array: function (str, list, dataview)
        {
            var encoder = nexacro._getTextEncoder();
            if (encoder && str.length > 0)
            {
                var _data = encoder.encode(str);
                nexacro._Array2DataUtil.addLenToUint8Array(_data.length, list, dataview);
                //this.addLenToUint8Array(_data.length, list, dataview);//이것도 가능함
                _data.forEach(element => list.push(element));
            }
            else
            {
                this.addLenToUint8Array(str.length, list, dataview);
                for (var i = 0; i < str.length; i++)
                    list.push(str.charCodeAt(i));
            }
        },
        getDatetimeFromUint8Array: function (data, offset, dataview)
        {
            var dv = dataview;
            if (!dv)
                dv = new DataView(data.buffer);

            var pos = offset;
            if (pos + 8 > data.length)
                return [pos, null];

            var val = new Date(dv.getFloat64(pos, false));
            var addtime = val.getTimezoneOffset() * 60 * 1000;//getTimezoneOffset 부호 주의
            //var gDt = new nexacro.Date(val.getTime() + addtime);
            var gDt = new Date(val.getTime() + addtime);

            return [pos + 8, gDt];

        },
        addDatetimeToUint8Array: function (val, list, dataview)
        {
            var dv = dataview;
            if (!dv)
            {
                const buf = new ArrayBuffer(4);
                dv = new DataView(buf);
            }
            if (val instanceof nexacro.Date || val instanceof Date)
            {
                var m_date = val.getTime() - (val.getTimezoneOffset() * 60 * 1000); //getTimezoneOffset 부호 주의
                dv.setFloat64(0, m_date, false);
                for (var i = 0; i < 8; i++)
                    list.push(dv.getUint8(i));
            }
        }
    };
    // 
    ////////////////////////////////////////////////////////////////////////////////////

    _pTransactionItem._deserializeUint8Array = function (data_array)
    {
        if (!data_array || data_array.length == 0)
        {
            return [[-1, "Stream Data is null!"], [], new nexacro.Collection()];
        }

        var pos = 0/*, length = data_array.length*/, cinfo;

        // trim left
        pos = nexacro._Array2DataUtil.trimLeft(data_array, pos);

        // move to next record
        var _rs_ = "";

        var cinfo = nexacro._Array2DataUtil.substr(data_array, pos, 10);
        var data_type = this._getStreamType(cinfo.string);

        if (data_type == "SSV")
        {
            _rs_ = nexacro._getSSVRecordSeparator();
        }
        else if (data_type == "CSV")
        {
            var rs_code_array = [];
            rs_code_array[0] = "\r".charCodeAt(0);
            rs_code_array[1] = "\n".charCodeAt(0);
            var tinfo = nexacro._Array2DataUtil.indexOf(data_array, pos, rs_code_array);
            if (tinfo.index < 0)
                _rs_ = "\n";
            else
                _rs_ = "\r\n";
        }
        else if (data_type == "XML")
        {
            //return this.__deserializeXMLFromStr(nexacro._Array2DataUtil.substring(data_array, 0).string);
            return this.__deserializeXMLFromStr(nexacro._Array2DataUtil.getString(data_array));
        }
        else if (data_type == "JSON")
        {
            //return this.__deserializeJSONFromStr(nexacro._Array2DataUtil.substring(data_array, 0).string);
            return this.__deserializeJSONFromStr(nexacro._Array2DataUtil.getString(data_array));
        }

        cinfo = nexacro._Array2DataUtil.substringOf(data_array, pos, _rs_);
        if (cinfo.string.length < 3)
        {
            this._is_unknowntype_data = true;
            return [[-1, "invalid nexacro communication format"], [], new nexacro.Collection()];
        }

        pos = cinfo.nextOffset;

        //var fstr = cinfo.string.substring(0, 3);
        if (data_type == "SSV") // SSV Type (HEX:53,53,56)
        {
            return this.__deserializeSSVFromUint8Array(data_array, pos);
        }
        else if (data_type == "CSV") // CSV Type (HEX:43,53,56)
        {
            return this.__deserializeCSVFromUint8Array(data_array, pos, _rs_);
        }

    };

    // param data
    // A. form transaciton 
    //   1. form.var           
    //   2. application.var
    //   3. nexacro.setEnvironmentVariable
    // B. application transaciton     
    //   1. application.var 
    //   2. nexacro.setEnvironmentVariable
    // C. environment transaciton         
    //   1. environment.var
    //   2. nexacro.setEnvironmentVariable
    _pTransactionItem._setParamter = function (id, val)
    {
        let form = this.context;
        if (id in form)  //1.form/application/environment variable
        {
            if (nexacro._isNull(form[id]) || !nexacro._isObject(form[id]))
            {
                form[id] = val;
            }
        }
        else //   2.application globalvariable
        {
            if (form == nexacro.getEnvironment())
            {
                const hasvariable = nexacro._hasEnvironmentVariable(id);
                if (hasvariable)
                    nexacro.setEnvironmentVariable(id, val);
            }
            else
            {
                let app = this.context._getApplication();
                if (app && app._existVariable(id))
                {
                    app[id] = val;
                }
                else
                {
                    const hasvariable = nexacro._hasEnvironmentVariable(id);
                    if (hasvariable)
                        nexacro.setEnvironmentVariable(id, val);
                }
            }
        }
    };

    _pTransactionItem._getDataset = function (id)
    {
        var form = this.context;
        var outDatasets = this.outputDatasets;
        if (outDatasets && outDatasets.length)
        {
            var outDataCnt = outDatasets.length;
            for (var i = 0; i < outDataCnt; i++)
            {
                var param = outDatasets[i];
                if (param.rval == id)
                {
                    return form._getDatasetObject(param.lval);
                }
            }
        }
    };

    _pTransactionItem._hasFirstCountDs = function ()
    {
        if (!this.outputDatasets)
            return false;

        var outDataCnt = this.outputDatasets.length;
        var form = this.context;

        for (var i = 0; i < outDataCnt; i++)
        {
            var param = this.outputDatasets[i];
            var ds = form._getDatasetObject(param.lval);
            if (ds)
            {
                if (ds.firefirstcount > 0)
                {
                    return true;
                }
            }
        }

        return false;
    };

    _pTransactionItem.__deserializeXML = function (strRecvData, doc)
    {
        var i, ds;
        var parameters = [];
        var datasets = new nexacro.Collection();
        var errorinfo = [0, "SUCCESS"];

        if (strRecvData.length > 0 && !this._check_responseXML)
        {
            var fstr = strRecvData.substr(0, 10).toLowerCase();
            if (fstr.indexOf("<?xml") < 0)
            {
                this._is_unknowntype_data = true;
                return [[-1, "invalid nexacro communication format"], parameters, datasets];
            }

            return this.__deserializeXMLFromStr(strRecvData);
        }
        else
        {
            if (!doc)
            {
                if (strRecvData.indexOf("&quot;") >= 0)
                {
                    strRecvData = nexacro._replaceAll(strRecvData, "&quot;", "\"");
                }
                if (strRecvData.indexOf("&apos;") >= 0)
                {
                    strRecvData = nexacro._replaceAll(strRecvData, "&apos;", "\'");
                }
                doc = nexacro._parseXMLDocument(strRecvData);
            }

            if (doc.parseError && doc.parseError.errorCode != 0) // IE 8, 9
            {
                this._is_unknowntype_data = true;
                return [[-1, "invalid nexacro communication format"], parameters, datasets];
            }
            else
            {
                var param, paramId, paramVal;
                var paramElem;
                var paramElems = doc.getElementsByTagName("Parameter");
                if (paramElems)
                {
                    var paramCnt = paramElems.length;
                    for (i = 0; i < paramCnt; i++)
                    {
                        paramElem = paramElems[i];
                        paramId = paramElem.getAttribute("id");
                        if (paramId && paramId.length)
                        {
                            paramVal = (paramElem.textContent || (paramElem.firstChild ? paramElem.firstChild.nodeValue : ""));
                            if (paramId == "ErrorCode")
                            {
                                paramVal = parseInt(paramVal) | 0;
                                if (isFinite(paramVal) == false)
                                {
                                    errorinfo[0] = -1;
                                }
                                else
                                {
                                    errorinfo[0] = paramVal;
                                }
                            }
                            else if (paramId == "ErrorMsg")
                            {
                                errorinfo[1] = paramVal;
                            }
                            else
                            {
                                this._setParamter(paramId, paramVal);
                            }

                            if (this.bcache)
                            {
                                parameters[parameters.length] = new nexacro._ParametersCache(paramId, paramVal);
                            }
                        }
                    }
                }

                if (errorinfo[0] >= 0)
                {
                    var inDatasets = this.inputDatasets;
                    var inDataCnt = inDatasets ? inDatasets.length : 0;

                    for (i = 0; i < inDataCnt; i++)
                    {
                        param = inDatasets[i];
                        ds = this.context._getDatasetObject(param.rval);
                        if (ds)
                        {
                            ds.applyChange();
                        }
                    }

                    var dsId, dsType;
                    var dsIds = {};
                    var dsTypes = {};
                    var outDatasets = this.outputDatasets;
                    var outDataCnt = outDatasets ? outDatasets.length : 0;

                    for (i = 0; i < outDataCnt; i++)
                    {
                        param = outDatasets[i];
                        if (dsIds[param.rval] == null)
                        {
                            dsIds[param.rval] = [];
                            dsTypes[param.rval] = [];
                        }

                        dsId = dsIds[param.rval];
                        dsType = dsTypes[param.rval];
                        if (dsId.indexOf(param.lval) == -1)
                        {
                            dsId.push(param.lval);
                            dsType.push(param.saveType);
                        }
                    }

                    var parmaDatasets = doc.getElementsByTagName("Dataset");
                    var paramDataCnt = parmaDatasets ? parmaDatasets.length : 0;

                    for (i = 0; i < paramDataCnt; i++)
                    {
                        var remoteId = parmaDatasets[i].getAttribute("id");
                        if (remoteId && remoteId.length)
                        {
                            var localIds = dsIds[remoteId];
                            if (localIds)
                            {
                                var types = dsTypes[remoteId];
                                for (i = 0; i < localIds.length; i++)
                                {
                                    var localId = localIds[i];
                                    var type = types[i];
                                    ds = this.context._getDatasetObject(localId);
                                    if (!ds)
                                    {
                                        ds = new nexacro.DatasetBase(remoteId);
                                    }

                                    ds._p_rowposition = -1;
                                    ds.loadFromDOM(parmaDatasets[i], null, (type == "P"), errorinfo[0], errorinfo[1]);

                                    if (this.bcache)
                                    {
                                        datasets.add_item(ds.id, new nexacro._DataSetCache(ds.id, ds.colinfos, ds._constVars, ds._rawRecords));
                                    }
                                    else
                                    {
                                        datasets.add_item(ds.id, "");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return [errorinfo, parameters, datasets];
    };

    _pTransactionItem.__deserializeXMLFromStr = function (strRecvData)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var code = 0;
        var message = "SUCCESS";
        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;
        var i, param, attrStr, ds;

        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var form = this.context;

        var xml_parse_pos = strRecvData.indexOf("<Dataset ");
        var headerData;
        if (xml_parse_pos > -1)
        {
            headerData = strRecvData.substring(0, xml_parse_pos);
        }
        else
        {
            headerData = strRecvData;
        }

        var head_parse_pos = 0;
        var paramsInfo = nexacro._getXMLTagData(headerData, head_parse_pos, "<Parameters>", "</Parameters>");
        if (paramsInfo)
        {
            var paramsData = paramsInfo[0];
            //head_parse_pos = paramsInfo[3];

            var param_parse_pos = 0;
            var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            while (varInfo)
            {
                param_parse_pos = varInfo[3];
                attrStr = varInfo[1];
                var id = nexacro._getXMLAttributeID(attrStr);
                if (id && id.length)
                {
                    var val = varInfo[0];

                    if (id == "ErrorCode")
                    {
                        code = parseInt(val) | 0;
                        if (isFinite(code) == false)
                        {
                            code = -1;
                        }
                        val = code;
                    }
                    else if (id == "ErrorMsg")
                    {
                        val = nexacro._decodeXml(val);
                        message = val;
                    }
                    else 
                    {
                        this._setParamter(id, nexacro._decodeXml(val));
                    }

                    if (this.bcache)
                    {
                        parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                    }

                }
                // for Next
                varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
            }
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = form._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }
        }

        if (xml_parse_pos >= -1)
        {
            var datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            while (datasetInfo)
            {
                xml_parse_pos = datasetInfo[3];
                attrStr = datasetInfo[1];
                var remoteId = nexacro._getXMLAttributeID(attrStr);
                var localIds = dsIds[remoteId];
                if (localIds)
                {
                    var types = dsTypes[remoteId];
                    for (i = 0; i < localIds.length; i++)
                    {
                        var localId = localIds[i];
                        var type = types[i];
                        ds = form._getDatasetObject(localId);
                        if (ds)
                        {
                            ds._p_rowposition = -1;
                            ds.loadFromXMLStr(datasetInfo[0], null, (type == "P"), code, message);
                            if (this.bcache)
                            {
                                datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                            }
                            else
                            {
                                datasets.add_item(localId, "");
                            }
                        }
                    }
                }
                datasetInfo = nexacro._getXMLTagData2(strRecvData, xml_parse_pos, "<Dataset ", "</Dataset>");
            }
        }

        return [[code, message], parameters, datasets];
    };

    _pTransactionItem.__deserializePPX = function (strRecvData)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var _rs_ = nexacro._getSSVRecordSeparator();
        var _cs_ = nexacro._getSSVUnitSeparator();

        var code = 0;
        var message = "SUCCESS";

        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;

        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var ppxLines = strRecvData.split(_rs_); //record seperator
        var lineCnt = ppxLines.length;
        var curIdx = 1;
        var param, curStr, ds;
        var i;

        var __find_next_dataset_loopFn = function (i)
        {
            if (ppxLines[i].charAt(0) == "D")
            {
                return true;
            }
        };

        for (; curIdx < lineCnt; curIdx++)
        {
            curStr = ppxLines[curIdx];
            var curType = curStr.charAt(0);

            if (curType == "P")
            {
                var paramArr = curStr.split(_cs_);
                var id = paramArr[1];
                var val = paramArr[2];
                if (val == String.fromCharCode(3))
                    val = undefined;

                if (id == "ErrorCode")
                {
                    code = parseInt(val) | 0;
                    if (isFinite(code) == false)
                    {
                        code = -1;
                    }
                    val = code;
                }
                else if (id == "ErrorMsg")
                {
                    message = paramArr[2];
                }
                else
                {
                    this._setParamter(val, val);
                }

                if (this.bcache)
                {
                    parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                }
            }
            else
            {
                break;
            }
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            ppxLines.length = 0;
            strRecvData = null;
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = this.context._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }
        }

        while (true)
        {
            curIdx = nexacro.__forLoop(this, curIdx, lineCnt, __find_next_dataset_loopFn);
            if (curIdx >= lineCnt)
                break;

            curStr = ppxLines[curIdx];
            var valArr = curStr.split(_cs_);

            var remoteId = valArr[1];
            var localIds = dsIds[remoteId];
            if (localIds)
            {
                var types = dsTypes[remoteId];
                for (i = 0; i < localIds.length; i++)
                {
                    var is_last = i == (localIds.length - 1);
                    var localId = localIds[i];
                    var type = types[i];
                    ds = this.context._getDatasetObject(localId);
                    if (ds)
                    {
                        ds._p_rowposition = -1;
                        if (is_last)
                        {
                            curIdx = ds.loadFromPPXArray(ppxLines, lineCnt, curIdx, true, (type == "P"), code, message);
                        }
                        else
                        {
                            ds.loadFromPPXArray(ppxLines, lineCnt, curIdx, true, (type == "P"), code, message);
                        }

                        if (this.bcache)
                        {
                            datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                        }
                        else
                        {
                            datasets.add_item(localId, "");
                        }
                    }
                    else
                    {
                        curIdx++;
                    }
                }
            }
            else
            {
                curIdx++;
            }
        }

        ppxLines.length = 0;
        return [[code, message], parameters, datasets];
    };

    _pTransactionItem.__deserializeSSV = function (strRecvData)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var _rs_ = nexacro._getSSVRecordSeparator();
        var _cs_ = nexacro._getSSVUnitSeparator();

        var code = 0;
        var message = "SUCCESS";

        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;

        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var ssvLines = strRecvData.split(_rs_);
        var lineCnt = ssvLines.length;
        var curIdx = 1;
        var i, param, curStr, sep_pos, ds;

        var __find_next_dataset_loopFn = function (i)
        {
            if (ssvLines[i].substring(0, 7) == "Dataset")
            {
                return true;
            }
        };

        // parse parameters
        for (; curIdx < lineCnt; curIdx++)
        {
            curStr = ssvLines[curIdx];
            if (curStr.substring(0, 7) != "Dataset")
            {
                var paramArr = curStr.split(_cs_);
                var paramCnt = paramArr.length;
                for (i = 0; i < paramCnt; i++)
                {
                    var paramStr = paramArr[i];
                    var varInfo = paramStr;
                    var val = undefined;
                    sep_pos = paramStr.indexOf("=");
                    if (sep_pos >= 0)
                    {
                        varInfo = paramStr.substring(0, sep_pos);
                        val = paramStr.substring(sep_pos + 1);
                        if (val == String.fromCharCode(3))
                            val = undefined;
                    }

                    if (varInfo)
                    {
                        var id = varInfo;
                        sep_pos = varInfo.indexOf(":");
                        if (sep_pos >= 0)
                        {
                            id = varInfo.substring(0, sep_pos);
                        }

                        if (id == "ErrorCode")
                        {
                            code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                code = -1;
                            }
                            val = code;
                        }
                        else if (id == "ErrorMsg")
                        {
                            message = val;
                        }
                        else
                        {
                            this._setParamter(id, val);
                        }

                        if (this.bcache)
                        {
                            parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                        }
                    }
                }
            }
            else
            {
                break;
            }
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            ssvLines.length = 0;
            strRecvData = null;
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = this.context._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }
        }

        while (true)
        {
            curIdx = nexacro.__forLoop(this, curIdx, lineCnt, __find_next_dataset_loopFn);
            if (curIdx >= lineCnt)
                break;

            curStr = ssvLines[curIdx];
            sep_pos = curStr.indexOf(":");
            if (sep_pos >= 0)
            {
                var remoteId = curStr.substring(sep_pos + 1);
                var localIds = dsIds[remoteId];
                if (localIds)
                {
                    var types = dsTypes[remoteId];
                    for (i = 0; i < localIds.length; i++)
                    {
                        var is_last = i == (localIds.length - 1);
                        var localId = localIds[i];
                        var type = types[i];
                        ds = this.context._getDatasetObject(localId);
                        if (ds)
                        {
                            ds._p_rowposition = -1;
                            if (is_last)
                            {
                                curIdx = ds.loadFromSSVArray(ssvLines, lineCnt, curIdx, true, (type == "P"), code, message);
                            }
                            else
                            {
                                ds.loadFromSSVArray(ssvLines, lineCnt, curIdx, true, (type == "P"), code, message);
                            }

                            if (this.bcache)
                            {
                                datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                            }
                            else
                            {
                                datasets.add_item(localId, "");
                            }
                        }
                        else
                        {
                            curIdx++;
                        }
                    }
                }
                else
                {
                    curIdx++;
                }
            }
            else
            {
                curIdx++;
            }
        }

        ssvLines.length = 0;
        return [[code, message], parameters, datasets];
    };

    _pTransactionItem.__deserializeCSV = function (strRecvData)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var code = 0;
        var message = "SUCCESS";

        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;

        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var csvLines = strRecvData.split(/\r\n|\n/);
        var lineCnt = csvLines.length;
        var curIdx = 1;
        var i, param, curStr, sep_pos, ds;

        var __find_next_dataset_loopFn = function (i)
        {
            if (csvLines[i].substring(0, 7) == "Dataset")
            {
                return true;
            }
        };

        for (; curIdx < lineCnt; curIdx++)
        {
            curStr = csvLines[curIdx];
            if (curStr.substring(0, 7) == "Dataset")
                break;

            var paramArr = curStr.split(",");
            var paramCnt = paramArr.length;
            for (i = 0; i < paramCnt; i++)
            {
                var paramStr = paramArr[i];
                if (paramStr.charAt(0) == "\"" || paramStr.charAt(0) == "\'")
                {
                    paramStr = paramStr.substring(1, paramStr.length - 1);
                }
                var varInfo = paramStr;
                var val = undefined;
                sep_pos = paramStr.indexOf("=");
                if (sep_pos >= 0)
                {
                    varInfo = paramStr.substring(0, sep_pos);
                    val = paramStr.substring(sep_pos + 1);
                }
                if (varInfo)
                {
                    var id = varInfo;
                    sep_pos = varInfo.indexOf(":");
                    if (sep_pos >= 0)
                    {
                        id = varInfo.substring(0, sep_pos);
                    }

                    if (id == "ErrorCode")
                    {
                        code = parseInt(val) | 0;
                        if (isFinite(code) == false)
                        {
                            code = -1;
                        }
                        val = code;
                    }
                    else if (id == "ErrorMsg")
                    {
                        message = val;
                    }
                    else
                    {
                        this._setParamter(id, val);
                    }

                    if (this.bcache)
                    {
                        parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                    }
                }
            }
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            csvLines.length = 0;
            strRecvData = null;
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = this.context._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }
            dsIds.length = i;
        }

        while (true)
        {
            // find Dataset
            curIdx = nexacro.__forLoop(this, curIdx, lineCnt, __find_next_dataset_loopFn);
            if (curIdx >= lineCnt)
                break;

            curStr = csvLines[curIdx];
            sep_pos = curStr.indexOf(":");
            if (sep_pos >= 0)
            {
                var remoteId = curStr.substring(sep_pos + 1);
                var localIds = dsIds[remoteId];
                if (localIds)
                {
                    var types = dsTypes[remoteId];
                    for (i = 0; i < localIds.length; i++)
                    {
                        var is_last = i == (localIds.length - 1);
                        var localId = localIds[i];
                        var type = types[i];
                        ds = this.context._getDatasetObject(localId);
                        if (ds)
                        {
                            ds._p_rowposition = -1;
                            if (is_last)
                            {
                                curIdx = ds.loadFromCSVArray(csvLines, lineCnt, curIdx, true, (type == "P"), code, message);
                            }
                            else
                            {
                                ds.loadFromCSVArray(csvLines, lineCnt, curIdx, true, (type == "P"), code, message);
                            }

                            if (this.bcache)
                            {
                                datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                            }
                            else
                            {
                                datasets.add_item(localId, "");
                            }
                        }
                        else
                        {
                            curIdx++;
                        }
                    }
                }
                else
                {
                    curIdx++;
                }
            }
            else
            {
                curIdx++;
            }
        }

        csvLines.length = 0;
        return [[code, message], parameters, datasets];
    };

    _pTransactionItem.__deserializeJSON = function (strRecvData, doc)
    {
        var i, ds;
        var parameters = [];
        var datasets = new nexacro.Collection();
        var errorinfo = [0, "SUCCESS"];

        var fstr = strRecvData.substr(0, 2).toLowerCase();
        if (fstr.indexOf("{") < 0)
        {
            this._is_unknowntype_data = true;
            return [[-1, "invalid nexacro communication format"], parameters, datasets];
        }

        return this.__deserializeJSONFromStr(strRecvData);
    };

    _pTransactionItem.__deserializeJSONFromStr = function (strRecvData)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var code = 0;
        var message = "SUCCESS";
        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;
        var i, j, param/*, attrStr*/, ds, type;

        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var form = this.context;
        var jsonobj = JSON.parse(strRecvData);
        //var dsobj = jsonobj.Datasets;

        //var head_parse_pos = 0;
        var paramsInfo = jsonobj.Parameters;
        if (paramsInfo)
        {
            var paramslen = paramsInfo.length;

            for (i = 0; i < paramslen; i++)
            {
                var attr = paramsInfo[i];
                var id = attr.id;
                var val = attr.value;
                type = attr.type;
                if (id && id.length)
                {
                    if (id == "ErrorCode")
                    {
                        code = parseInt(val) | 0;
                        if (isFinite(code) == false)
                        {
                            code = -1;
                        }
                        val = code;
                    }
                    else if (id == "ErrorMsg")
                    {
                        message = val;
                    }
                    else
                    {
                        this._setParamter(id, val);
                    }

                    if (this.bcache)
                    {
                        parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                    }

                }
            }
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = form._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }
        }

        var datasetInfo = jsonobj.Datasets;
        var dslen = datasetInfo ? datasetInfo.length : 0;
        for (i = 0; i < dslen; i++)
        {
            var obj = datasetInfo[i];
            var remoteId = obj.id;
            var localIds = dsIds[remoteId];
            if (localIds)
            {
                var types = dsTypes[remoteId];
                for (j = 0; j < localIds.length; j++)
                {
                    var localId = localIds[j];
                    type = types[j];
                    ds = form._getDatasetObject(localId);
                    if (ds)
                    {
                        ds._p_rowposition = -1;
                        ds._loadFromJSONObj(datasetInfo[i], null, (type == "P"), code, message);
                        if (this.bcache)
                        {
                            datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                        }
                        else
                        {
                            datasets.add_item(localId, "");
                        }
                    }
                }
            }
        }
        return [[code, message], parameters, datasets];
    };

    _pTransactionItem.__deserializeCSVFromUint8Array = function (data, offset, rs)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var code = 0;
        var message = "SUCCESS";

        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;

        if (!data || data.length == 0)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var i, param, sep_pos, ds;

        var cinfo, curStr;
        var pos = offset;//, length = data.length;

        while (1)
        {
            cinfo = nexacro._Array2DataUtil.substringOf(data, pos, rs);

            curStr = cinfo.string;
            if (curStr.substring(0, 7) != "Dataset")
            {
                var paramArr = curStr.split(",");
                var paramCnt = paramArr.length;
                for (i = 0; i < paramCnt; i++)
                {
                    var paramStr = paramArr[i];
                    var varInfo = paramStr;
                    var val = undefined;

                    sep_pos = paramStr.indexOf("=");
                    if (sep_pos >= 0)
                    {
                        varInfo = paramStr.substring(0, sep_pos);
                        val = paramStr.substring(sep_pos + 1);
                    }

                    if (varInfo)
                    {
                        var id = varInfo;
                        sep_pos = varInfo.indexOf(":");
                        if (sep_pos >= 0)
                        {
                            id = varInfo.substring(0, sep_pos);
                        }

                        if (id == "ErrorCode")
                        {
                            code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                code = -1;
                            }
                            val = code;
                        }
                        else if (id == "ErrorMsg")
                        {
                            message = val;
                        }
                        else
                        {
                            this._setParamter(id, val);
                        }

                        if (this.bcache)
                        {
                            parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                        }
                    }
                }
            }
            else
            {
                break;
            }

            pos = cinfo.nextOffset;
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = this.context._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }

            dsIds.length = i;
        }

        while (true)
        {
            cinfo = nexacro._Array2DataUtil.substringOf(data, pos, rs);

            curStr = cinfo.string;
            pos = cinfo.nextOffset;

            if (curStr == '') break;
            if (curStr.substring(0, 7) == "Dataset")
            {
                sep_pos = curStr.indexOf(":");
                if (sep_pos >= 0)
                {
                    var remoteId = curStr.substring(sep_pos + 1);
                    var localIds = dsIds[remoteId];
                    if (localIds)
                    {
                        var new_offset = pos;
                        var types = dsTypes[remoteId];
                        for (i = 0; i < localIds.length; i++)
                        {
                            //var is_last = i == (localIds.length - 1);
                            var localId = localIds[i];
                            var type = types[i];
                            ds = this.context._getDatasetObject(localId);
                            if (ds)
                            {
                                ds._p_rowposition = -1;

                                // get dataset records
                                new_offset = ds.loadCSVFromUint8Array(data, pos, true, (type == "P"), code, message, rs);

                                if (this.bcache)
                                {
                                    datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                                }
                                else
                                {
                                    datasets.add_item(localId, "");
                                }
                            }
                        }

                        pos = new_offset;
                        if (pos < 0)
                            break;
                    }
                }
            }
        }

        return [[code, message], parameters, datasets];

    };

    _pTransactionItem.__deserializeSSVFromUint8Array = function (data, offset)
    {
        var parameters = [];
        var datasets = new nexacro.Collection();

        var _rs_ = nexacro._getSSVRecordSeparator();
        var _cs_ = nexacro._getSSVUnitSeparator();

        var code = 0;
        var message = "SUCCESS";

        var env = nexacro.getEnvironment();
        var datasetloadtype = env.datasetloadtype;

        if (!data || data.length == 0)
        {
            return [[-1, "Stream Data is null!"], null, null];
        }

        var i, param, sep_pos, ds;

        var cinfo, curStr;
        var pos = offset;//, length = data.length;

        while (1)
        {
            cinfo = nexacro._Array2DataUtil.substringOf(data, pos, _rs_);

            curStr = cinfo.string;
            if (curStr.substring(0, 7) != "Dataset")
            {
                var paramArr = curStr.split(_cs_);
                var paramCnt = paramArr.length;
                for (i = 0; i < paramCnt; i++)
                {
                    var paramStr = paramArr[i];
                    var varInfo = paramStr;
                    var val = undefined;

                    sep_pos = paramStr.indexOf("=");
                    if (sep_pos >= 0)
                    {
                        varInfo = paramStr.substring(0, sep_pos);
                        val = paramStr.substring(sep_pos + 1);
                        if (val == String.fromCharCode(3))
                            val = undefined;
                    }

                    if (varInfo)
                    {
                        var id = varInfo;
                        sep_pos = varInfo.indexOf(":");
                        if (sep_pos >= 0)
                        {
                            id = varInfo.substring(0, sep_pos);
                        }

                        if (id == "ErrorCode")
                        {
                            code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                code = -1;
                            }
                            val = code;
                        }
                        else if (id == "ErrorMsg")
                        {
                            message = val;
                        }
                        else
                        {
                            this._setParamter(id, val);
                        }

                        if (this.bcache)
                        {
                            parameters[parameters.length] = new nexacro._ParametersCache(id, val);
                        }
                    }
                }
            }
            else
            {
                break;
            }

            if (pos == cinfo.nextOffset) break;

            pos = cinfo.nextOffset;
        }

        if (code <= -1 && datasetloadtype == "onsuccess")
        {
            return [[code, message], parameters, datasets];
        }

        var inDatasets = this.inputDatasets;
        if (code >= 0 && inDatasets && inDatasets.length)
        {
            var inDataCnt = inDatasets.length;
            for (i = 0; i < inDataCnt; i++)
            {
                param = inDatasets[i];
                ds = this.context._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        }

        var dsId, dsType;
        var dsIds = {};
        var dsTypes = {};
        var outDatasets = this.outputDatasets;
        var outDataCnt = outDatasets ? outDatasets.length : 0;
        if (outDataCnt > 0)
        {
            for (i = 0; i < outDataCnt; i++)
            {
                param = outDatasets[i];
                if (dsIds[param.rval] == null)
                {
                    dsIds[param.rval] = [];
                    dsTypes[param.rval] = [];
                }

                dsId = dsIds[param.rval];
                dsType = dsTypes[param.rval];
                if (dsId.indexOf(param.lval) == -1)
                {
                    dsId.push(param.lval);
                    dsType.push(param.saveType);
                }
            }
        }

        while (true)
        {
            cinfo = nexacro._Array2DataUtil.substringOf(data, pos, _rs_);

            curStr = cinfo.string;
            pos = cinfo.nextOffset;

            if (curStr == '') 
            {
                if (data.length > pos)
                    continue; // data remain (ex. multiple Dataset)
                else
                    break; // data end
            }
            if (curStr.substring(0, 7) == "Dataset")
            {
                sep_pos = curStr.indexOf(":");
                if (sep_pos >= 0)
                {
                    var remoteId = curStr.substring(sep_pos + 1);
                    var localIds = dsIds[remoteId];
                    if (localIds)
                    {
                        var new_offset = pos;
                        var types = dsTypes[remoteId];
                        for (i = 0; i < localIds.length; i++)
                        {
                            //var is_last = i == (localIds.length - 1);
                            var localId = localIds[i];
                            var type = types[i];
                            ds = this.context._getDatasetObject(localId);
                            if (ds)
                            {
                                ds._p_rowposition = -1;

                                // get dataset records
                                new_offset = ds.loadSSVFromUint8Array(data, pos, true, (type == "P"), code, message);

                                if (this.bcache)
                                {
                                    datasets.add_item(localId, new nexacro._DataSetCache(localId, ds.colinfos, ds._constVars, ds._rawRecords));
                                }
                                else
                                {
                                    datasets.add_item(localId, "");
                                }
                            }
                        }

                        pos = new_offset;
                        if (pos < 0)
                            break;
                    }
                }
            }
        }

        return [[code, message], parameters, datasets];
    };

    _pTransactionItem._TABS = ["", "\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t"];
    _pTransactionItem._writeData = function (list, str, depth)
    {
        list[list.length] = this._TABS[depth] + str;
    };

    _pTransactionItem._addStringJSONData = function (list, str, depth)
    {
        list[list.length - 1] += str;
    };

    _pTransactionItem._dsUpdate = function (ds)
    {
        if (ds)
        {
            var dsCnt;
            var viewRecords = ds._viewRecords;
            var viewRecLength = viewRecords.length;
            if (ds._deletedRecords.length > 0)
            {
                viewRecords = ds._viewRecords = [];
                var len = ds._rawRecords.length;
                for (dsCnt = 0; dsCnt < len; dsCnt++)
                {
                    var _currowData = ds._rawRecords[dsCnt];
                    if (_currowData._rtype != 8) // nexacro.Dataset.ROWTYPE_DELETE)
                    {
                        viewRecords[viewRecLength] = _currowData;
                    }
                }
            }

            ds._p_colcount = ds.colinfos.length;
            ds._p_rowcount = ds._viewRecords.length;

            ds.loadstatus = false;
            ds._eventstat = ds.enableevent;

            ds._reFilter();
            ds._resetSortGroup();
        }
    };

    _pTransactionItem._dsOnload = function (ds, reason)
    {
        if (ds)
        {
            if (ds._viewRecords.length > 0)
            {
                ds._p_rowposition = 0;
            }
            if (ds._eventstat)
            {
                if (reason)
                {
                    ds.on_fire_onload(0, "", reason);
                }
                else
                {
                    ds.on_fire_onload(0, "", 0); //nexacro.Dataset.REASON_LOAD);
                }
            }
        }
    };

    _pTransactionItem._getStreamType = function (strRecvData)
    {
        if (!strRecvData)
        {
            return null;
        }

        var data = strRecvData.trim();
        var type = data.slice(0, 10).toUpperCase();

        if (type.indexOf("CSV") == 0)
            return "CSV";
        else if (type.indexOf("SSV") == 0)
            return "SSV";
        else if (type.indexOf("PPX") == 0)
            return "PPX";
        else if (type.indexOf("<?XML") == 0)
            return "XML";
        else if (type.indexOf("{") == 0)
            return "JSON";
        else if (type.length == 10)
            return "UNKNOWN";

        return null;
    };

    _pTransactionItem._destroy = function ()
    {
        this._sendData = null;
        this._recieved_data = null;

        if (this._b_block_onprogress && this._async_progress_timer_id != null)
            clearTimeout(this._async_progress_timer_id);

        //this.inputDatasets
        //this.outputDatasets
        //this.parameters

    };

    _pTransactionItem = null;
}
