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

//========================================================
// nexacro.Point
//========================================================
if (!nexacro.Point)
{
    nexacro.Point = function (x, y)
    {
        if (x instanceof nexacro.Point)
        {
            this._p_x = x._p_x;
            this._p_y = x._p_y;
        }
        else if (x instanceof Array)
        {
            this._p_x = (x[0]);
            this._p_y = (x[1]);
        }
        else
        {
            if (x != undefined)
            {
                this._p_x = x;
            }

            if (y != undefined)
            {
                this._p_y = y;
            }
            else 
            {
                if (x != undefined)                 //trace("point error!!")
                    this._p_y = this._p_x;
            }
        }
    };

    var _pPoint = nexacro._createPrototype(nexacro.Object, nexacro.Point);
    nexacro.Point.prototype = _pPoint;
    _pPoint._type_name = "Point";
    _pPoint._p_x = 0;
    _pPoint._p_y = 0;

    nexacro.Point.min = function (pt0, pt1)
    {
        if (pt0 instanceof nexacro.Point && arguments.length == 4)
        {
            return new nexacro.Point(Math.min(arguments[0], arguments[1]), Math.min(arguments[2], arguments[3]));
        }
        else
        {
            return new nexacro.Point(Math.min(pt0._p_x, pt1._p_x), Math.min(pt0._p_y, pt1._p_y));
        }
    };

    nexacro.Point.max = function (pt0, pt1)
    {
        if (pt0 instanceof nexacro.Point && arguments.length == 4)
        {
            return new nexacro.Point(Math.max(arguments[0], arguments[2]), Math.max(arguments[1], arguments[3]));
        }
        else
        {
            return new nexacro.Point(Math.max(pt0._p_x, pt1._p_x), Math.max(pt0._p_y, pt1._p_y));
        }
    };

    _pPoint.set_x = function (v)
    {
        this._p_x = v;
    };

    _pPoint.set_y = function (v)
    {
        this._p_y = v;
    };

    _pPoint.set = function (x, y)
    {
        if (this._p_x != x || this._p_y != y)
        {
            this._p_x = x;
            this._p_y = y;
        }
        return this;
    };

    _pPoint.copy = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            this._p_x = pt._p_x;
            this._p_y = pt._p_y;
        }
        else
        {
            this._p_x = arguments[0];
            this._p_y = arguments[1];
        }
    };

    _pPoint.clone = function ()
    {
        return new nexacro.Point(this._p_x, this._p_y);
    };

    _pPoint.equals = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return (this._p_x == pt._p_x && this._p_y == pt._p_y);
        }
        else if (pt instanceof Array)
        {
            return (this._p_x == pt[0] && this._p_y == pt[1]);
        }
        else
        {
            return (this._p_x == arguments[0] && this._p_y == arguments[1]);
        }
    };

    _pPoint.translate = function (x, y)
    {
        this._p_x += (x);
        this._p_y += (y);
    };

    _pPoint.roundedEquals = function (pt)
    {
        return (Math.round(this._p_x) == Math.round(pt._p_x) && Math.round(this._p_y) == Math.round(pt._p_y));
    };

    _pPoint.add = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x + pt._p_x, this._p_y + pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x + arguments[0], this._p_y + arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x + arguments[0], this._p_y + arguments[1]);
            }
        }
    };

    _pPoint.subtract = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x - pt._p_x, this._p_y - pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x - arguments[0], this._p_y - arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x - arguments[0], this._p_y - arguments[1]);
            }

        }
    };

    _pPoint.multiply = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x * pt._p_x, this._p_y * pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x * arguments[0], this._p_y * arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x * arguments[0], this._p_y * arguments[1]);
            }
        }
    };

    _pPoint.divide = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x / pt._p_x, this._p_y / pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x / arguments[0], this._p_y / arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x / arguments[0], this._p_y / arguments[1]);
            }
        }
    };

    _pPoint.modulo = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x % pt._p_x, this._p_y % pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x % arguments[0], this._p_y % arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x % arguments[0], this._p_y % arguments[1]);
            }
        }
    };

    _pPoint.negate = function ()
    {
        return new nexacro.Point(-this._p_x, -this._p_y);
    };

    _pPoint.getDistance = function (pt, squared)
    {
        var x, y, d;
        if (pt instanceof nexacro.Point)
        {
            x = pt._p_x - this._p_x;
            y = pt._p_y - this._p_y;
            d = x * x + y * y;
            return squared ? d : Math.sqrt(d);
        }
        else
        {
            x = (arguments[0]) - this._p_x;
            y = (arguments[1]) - this._p_y;
            d = x * x + y * y;
            return arguments[2] ? d : Math.sqrt(d);
        }
    };

    _pPoint.isZero = function ()
    {
        return (this._p_x === 0 && this._p_y === 0);
    };

    _pPoint.isNaN = function ()
    {
        return isNaN(this._p_x) || isNaN(this._p_y);
    };



    //_pPoint.getAngle = function ()
    //{
    //    return this._getAngleInRadians.apply(this, arguments) * 180 / Math.PI;
    //};

    //_pPoint._getAngleInRadians = function ()
    //{
    //    if (arguments[0] === undefined)
    //    {
    //        return Math.atan2(this._p_y, this._p_x);
    //    }
    //    else
    //    {
    //        var pt = arguments[0];
    //        if (!(pt instanceof nexacro.Point))
    //        {
    //            pt = new nexacro.Point(arguments[0], arguments[1]);
    //        }
    //        var div = this.getLength() * pt.getLength();
    //        if (div === 0)
    //        {
    //            return NaN;
    //        }
    //        else
    //        {
    //            return Math.acos(this.dot(pt) / div);
    //        }
    //    }
    //};

    _pPoint.getDirectedAngle = function (pt)
    {
        if (!(pt instanceof nexacro.Point))
        {
            pt = new nexacro.Point(arguments[0], arguments[1]);
        }
        return Math.atan2(this.cross(pt), this.dot(pt)) * 180 / Math.PI;
    };

    _pPoint.getLength = function ()
    {
        return Math.sqrt(this._p_x * this._p_x + this._p_y * this._p_y);
    };


    _pPoint.rotate = function (angle, center)
    {
        if (angle === 0)
        {
            return this.clone();
        }

        angle = angle * Math.PI / 180;
        var pt = center ? this.subtract(center) : this;
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        pt = new nexacro.Point(pt._p_x * c - pt._p_y * s, pt._p_y * c + pt._p_x * s);
        return center ? pt.add(center) : pt;
    };


    _pPoint.dot = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return this._p_x * pt._p_x + this._p_y * pt._p_y;
        }
        else
        {
            return this._p_x * (arguments[0]) + this._p_y * (arguments[1]);
        }

    };

    _pPoint.cross = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return this._p_x * pt._p_y - this._p_y * pt._p_x;
        }
        else
        {
            return this._p_x * (arguments[1]) - this._p_y * (arguments[0]);
        }

    };

    _pPoint.project = function (pt)
    {
        if (!(pt instanceof nexacro.Point))
        {
            pt = new nexacro.Point(arguments[0], arguments[1]);
        }

        if (pt.isZero())
        {
            return new nexacro.Point();
        }
        else
        {
            var scale = this.dot(pt) / pt.dot(pt);
            return new nexacro.Point(pt._p_x * scale, pt._p_y * scale);
        }
    };

    _pPoint.round = function ()
    {
        return new nexacro.Point(Math.round(this._p_x), Math.round(this._p_y));
    };

    _pPoint.ceil = function ()
    {
        return new nexacro.Point(Math.ceil(this._p_x), Math.ceil(this._p_y));
    };

    _pPoint.floor = function ()
    {
        return new nexacro.Point(Math.floor(this._p_x), Math.floor(this._p_y));
    };

    _pPoint.abs = function ()
    {
        return new nexacro.Point(Math.abs(this._p_x), Math.abs(this._p_y));
    };

    _pPoint.lerp = function (pt, t)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x + (pt._p_x - this._p_x) * t, this._p_y + (pt._p_y - this._p_y) * t);
        }
        else
        {
            t = arguments[2];
            return new nexacro.Point(this._p_x + (arguments[0] - this._p_x) * t, this._p_y + (arguments[1] - this._p_y) * t);
        }
    };

    _pPoint.add = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x + pt._p_x, this._p_y + pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x + arguments[0], this._p_y + arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x + arguments[0], this._p_y + arguments[1]);
            }
        }
    };

    _pPoint.subtract = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x - pt._p_x, this._p_y - pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x - arguments[0], this._p_y - arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x - arguments[0], this._p_y - arguments[1]);
            }

        }
    };

    _pPoint.multiply = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x * pt._p_x, this._p_y * pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x * arguments[0], this._p_y * arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x * arguments[0], this._p_y * arguments[1]);
            }
        }
    };

    _pPoint.divide = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x / pt._p_x, this._p_y / pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x / arguments[0], this._p_y / arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x / arguments[0], this._p_y / arguments[1]);
            }
        }
    };

    _pPoint.modulo = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            return new nexacro.Point(this._p_x % pt._p_x, this._p_y % pt._p_y);
        }
        else
        {
            if (arguments.length == 1)
            {
                return new nexacro.Point(this._p_x % arguments[0], this._p_y % arguments[0]);
            }
            else
            {
                return new nexacro.Point(this._p_x % arguments[0], this._p_y % arguments[1]);
            }
        }
    };

    _pPoint.negate = function ()
    {
        return new nexacro.Point(-this._p_x, -this._p_y);
    };

    _pPoint._properties = [{ name: "x" }, { name: "y" }];
    nexacro._defineProperties(_pPoint, _pPoint._properties);

    _pPoint = null;
}

//========================================================
// nexacro.Offset
//========================================================
if (!nexacro.Offset)
{
    nexacro.Offset = function (x, y)
    {
        if (x != undefined)
            this._p_x = x;
        if (y != undefined)
            this._p_y = y;
    };

    var _pOffset = nexacro.Offset.prototype;
    _pOffset._p_x = 0;
    _pOffset._p_y = 0;

    _pOffset.copy = function ()
    {
        return new nexacro.Offset(this._p_x, this._p_y);
    };

    _pOffset.copyFrom = function (p)
    {
        this._p_x = p._p_x;
        this._p_y = p._p_y;
    };

    _pOffset.equals = function (offset)
    {
        if (!(offset instanceof nexacro.Offset))
            throw new Error('offset must be an instance of nexacro.Offset');
        return (this._p_x == offset._p_x && this._p_y == offset._p_y);
    };

    _pOffset.round = function (to)
    {
        // isNaN(v) === (+v) != (+v)
        var v = +to;
        if (!(v != v))
        {
            var factor = Math.pow(10, to);
            this._p_x = Math.round(this._p_x * factor) / factor;
            this._p_y = Math.round(this._p_y * factor) / factor;
        }
        else
        {
            this._p_x = Math.round(this._p_x);
            this._p_y = Math.round(this._p_y);
        }
    };

    _pOffset.isZero = function ()
    {
        return (this._p_x === 0 && this._p_y === 0);
    };

    _pOffset._properties = [{ name: "x" }, { name: "y" }];
    nexacro._defineProperties(_pOffset, _pOffset._properties);

    _pOffset = null;
}

//========================================================
// nexacro.Region
//========================================================
if (!nexacro.Region)
{
    nexacro.Region = function (t, r, b, l)
    {
        var me = this;
        me._p_top = t;
        me._p_right = r;
        me._p_bottom = b;
        me._p_left = l;
        me[0] = l;
        me[1] = t;
    };
    var _pRegion = nexacro.Region.prototype;

    _pRegion.contains = function (region)
    {
        var me = this;
        return (region._p_left >= me._p_left && region._p_right <= me._p_right
            && region._p_top >= me._p_top && region._p_bottom <= me._p_bottom);
    };

    _pRegion.intersect = function (region)
    {
        var me = this,
            t = Math.max(me._p_top, region._p_top),
            r = Math.min(me._p_right, region._p_right),
            b = Math.min(me._p_bottom, region._p_bottom),
            l = Math.max(me._p_left, region._p_left);

        if (b > t && r > l)
        {
            return new nexacro.Region(t, r, b, l);
        }
        else
        {
            return false;
        }
    };

    _pRegion.union = function (region)
    {
        var me = this,
            t = Math.min(me._p_top, region._p_top),
            r = Math.max(me._p_right, region._p_right),
            b = Math.max(me._p_bottom, region._p_bottom),
            l = Math.min(me._p_left, region._p_left);

        return new nexacro.Region(t, r, b, l);
    };

    _pRegion.constrainTo = function (region)
    {
        var me = this;
        me._p_top = this.constrain(me._p_top, region._p_top, region._p_bottom);
        me._p_bottom = this.constrain(me._p_bottom, region._p_top, region._p_bottom);
        me._p_left = this.constrain(me._p_left, region._p_left, region._p_right);
        me._p_right = this.constrain(me._p_right, region._p_left, region._p_right);
        return me;
    };

    _pRegion.constrain = function (num, minV, maxV)
    {
        // isNaN(v) === (+v) != (+v)
        num = parseFloat(num);
        var v = +minV;
        if (!(v != v))
        {
            num = Math.max(num, minV);
        }

        v = +maxV;
        if (!(v != v))
        {
            num = Math.min(num, maxV);
        }
        return num;
    };

    _pRegion.adjust = function (t, r, b, l)
    {
        var me = this;
        me._p_top += t;
        me._p_left += l;
        me._p_right += r;
        me._p_bottom += b;
        return me;
    };

    _pRegion.getOutOfBoundOffset = function (axis, p)
    {
        if (!(axis instanceof nexacro.Offset))
        {
            if (axis == 'x')
            {
                return this.getOutOfBoundOffsetX(p);
            }
            else
            {
                return this.getOutOfBoundOffsetY(p);
            }
        }
        else
        {
            p = axis;
            var d = new nexacro.Offset();
            d._p_x = this.getOutOfBoundOffsetX(p._p_x);
            d._p_y = this.getOutOfBoundOffsetY(p._p_y);
            return d;
        }
    };

    _pRegion.getOutOfBoundOffsetX = function (p)
    {
        if (p <= this._p_left)
        {
            return this._p_left - p;
        }
        else if (p >= this._p_right)
        {
            return this._p_right - p;
        }
        return 0;
    };

    _pRegion.getOutOfBoundOffsetY = function (p)
    {
        if (p <= this._p_top)
        {
            return this._p_top - p;
        }
        else if (p >= this._p_bottom)
        {
            return this._p_bottom - p;
        }
        return 0;
    };
    _pRegion.isOutOfBound = function (axis, p)
    {
        if (!(axis instanceof nexacro.Offset))
        {
            if (axis == 'x')
            {
                return this.isOutOfBoundX(p);
            }
            else
            {
                return this.isOutOfBoundY(p);
            }
        }
        else
        {
            p = axis;
            return (this.isOutOfBoundX(p._p_x) || this.isOutOfBoundY(p._p_y));
        }
    };

    _pRegion.isOutOfBoundX = function (p)
    {
        return (p < this._p_left || p > this._p_right);
    };

    _pRegion.isOutOfBoundY = function (p)
    {
        return (p < this._p_top || p > this._p_bottom);
    };

    _pRegion.restrict = function (axis, p, factor)
    {
        if (axis instanceof nexacro.Offset)
        {
            var newP;
            factor = p;
            p = axis;
            if (p.copy)
            {
                newP = p.copy();
            }
            else
            {
                newP = {
                    x: p._p_x,
                    y: p._p_y
                };
            }
            newP._p_x = this.restrictX(p._p_x, factor);
            newP._p_y = this.restrictY(p._p_y, factor);
            return newP;
        }
        else
        {
            if (axis == 'x')
            {
                return this.restrictX(p, factor);
            }
            else
            {
                return this.restrictY(p, factor);
            }
        }
    };
    _pRegion.restrictX = function (p, factor)
    {
        if (!factor)
        {
            factor = 1;
        }

        if (p <= this._p_left)
        {
            p -= (p - this._p_left) * factor;
        }
        else if (p >= this._p_right)
        {
            p -= (p - this._p_right) * factor;
        }
        return p;
    };

    _pRegion.restrictY = function (p, factor)
    {
        if (!factor)
        {
            factor = 1;
        }
        if (p <= this._p_top)
        {
            p -= (p - this._p_top) * factor;
        }
        else if (p >= this._p_bottom)
        {
            p -= (p - this._p_bottom) * factor;
        }
        return p;
    };

    _pRegion.getSize = function ()
    {
        return {
            width: this._p_right - this._p_left,
            height: this._p_bottom - this._p_top
        };
    };

    _pRegion.copy = function ()
    {
        return new nexacro.Region(this._p_top, this._p_right, this._p_bottom, this._p_left);
    };

    _pRegion.translateBy = function (offset)
    {
        this._p_left += offset._p_x;
        this._p_right += offset._p_x;
        this._p_top += offset._p_y;
        this._p_bottom += offset._p_y;
    };

    _pRegion.round = function ()
    {
        this._p_top = Math.round(this._p_top);
        this._p_right = Math.round(this._p_right);
        this._p_bottom = Math.round(this._p_bottom);
        this._p_left = Math.round(this._p_left);
        return this;
    };

    _pRegion.equals = function (region)
    {
        return (this._p_top == region._p_top && this._p_right == region._p_right
            && this._p_bottom == region._p_bottom && this._p_left == region._p_left);
    };

    _pRegion._properties = [{ name: "left" }, { name: "top" }, { name: "right" }, { name: "bottom" }];
    nexacro._defineProperties(_pRegion, _pRegion._properties);

    _pRegion = null;
}

//==============================================================================
//  nexacro Rect
//==============================================================================
if (!nexacro.Rect)
{
    nexacro.Rect = function (left, top, width, height)
    {
        (left != null) ? this._p_left = left : left = this._p_left = 0;
        (top != null) ? this._p_top = top : top = this._p_top = 0;
        (width != null) ? this._p_width = width : width = this._p_width = 0;
        (height != null) ? this._p_height = height : height = this._p_height = 0;

        this._p_left = Math.floor(this._p_left);
        var x = left - this._p_left;

        this._p_top = Math.floor(this._p_top);
        var y = top - this._p_top;

        this._p_width = Math.ceil(this._p_width + x);
        this._p_height = Math.ceil(this._p_height + y);

        this._p_right = this._p_left + this._p_width;
        this._p_bottom = this._p_top + this._p_height;
    };

    var _pRect = nexacro._createPrototype(nexacro.Object, nexacro.Rect);
    nexacro.Rect.prototype = _pRect;
    _pRect._type_name = "Rect";
    _pRect._p_left = 0;
    _pRect._p_top = 0;
    _pRect._p_width = 0;
    _pRect._p_height = 0;

    _pRect.clear = function ()
    {
        this._p_left = this._p_top = 0;
        this._p_width = this._p_height = 0;
        this._p_right = this._p_bottom = 0;
    };

    _pRect.copy = function (rc)
    {
        this._p_left = rc._p_left;
        this._p_top = rc._p_top;

        this._p_width = rc._p_width;
        this._p_height = rc._p_height;

        this._p_right = rc._p_right;
        this._p_bottom = rc._p_bottom;
    };

    _pRect.set = function (left, top, width, height)
    {
        if (left != this._p_left || top != this._p_top || width != this._p_width || height != this._p_height)
        {
            this._p_left = Math.floor(left);
            var x = left - this._p_left;

            this._p_top = Math.floor(top);
            var y = top - this._p_top;

            this._p_width = Math.ceil(width + x);
            this._p_height = Math.ceil(height + y);

            this._p_right = this._p_left + this._p_width;
            this._p_bottom = this._p_top + this._p_height;
        }
        return this;
    };

    _pRect.clone = function ()
    {
        return new nexacro.Rect(this._p_left, this._p_top, this._p_width, this._p_height);
    };

    _pRect.isSameSize = function (rc)
    {
        return (this._p_width == rc._p_width) && (this._p_height == rc._p_height);
    };

    _pRect.set_left = function (left)
    {
        this._p_left = Math.floor(left);
        var x = left - this._p_left;

        this._p_width = Math.ceil(this._p_width + x);
    };

    _pRect.set_top = function (top)
    {
        this._p_top = Math.floor(top);
        var y = top - this._p_top;

        this._p_height = Math.ceil(this._p_height + y);
    };

    _pRect.set_width = function (width)
    {
        this._p_width = Math.ceil(width);
        this._p_right = this._p_left + this._p_width;
    };

    _pRect.set_height = function (height)
    {
        this._p_height = Math.ceil(height);
        this._p_bottom = this._p_top + this._p_height;
    };

    _pRect.getRight = function ()
    {
        return this._p_left + this._p_width;
    };

    _pRect.getBottom = function ()
    {
        return this._p_top + this._p_height;
    };

    _pRect.getCenterX = function ()
    {
        return this._p_left + this._p_width * 0.5;
    };

    _pRect.setCenterX = function (v)
    {
        var left = v - this._p_width * 0.5;
        this._p_left = Math.floor(left);
        var x = left - this._p_left;

        this._p_width = Math.ceil(this._p_width + x);
        this._p_right = this._p_left + this._p_width;
    };

    _pRect.getCenterY = function ()
    {
        return this._p_top + this._p_height * 0.5;
    };

    _pRect.setCenterY = function (v)
    {
        var top = v - this._p_height * 0.5;
        this._p_top = Math.floor(top);
        var y = top - this._p_top;

        this._p_height = Math.ceil(this._p_height + y);
        this._p_bottom = this._p_top + this._p_height;
    };

    _pRect.getCenterPoint = function ()
    {
        return new nexacro.Point(this.getCenterX(), this.getCenterY());
    };

    _pRect.setCenterPoint = function (pt)
    {
        if (pt instanceof nexacro.Point)
        {
            this.setCenterX(pt._p_x);
            this.setCenterY(pt._p_y);

        }
        else
        {
            this.setCenterX(arguments[0]);
            this.setCenterY(arguments[1]);
        }

        return this;
    };

    _pRect.isEmpty = function ()
    {
        return this._p_width == 0 || this._p_height == 0;
    };

    _pRect.equals = function (rc)
    {
        return (this._p_left == rc._p_left) && (this._p_top == rc._p_top) && (this._p_width == rc._p_width) && (this._p_height == rc._p_height);
    };

    _pRect.containsPoint = function (pt)
    {
        var x, y;
        if (pt instanceof nexacro.Point)
        {
            x = pt._p_x;
            y = pt._p_y;
        }
        else
        {
            x = arguments[0];
            y = arguments[1];
        }

        return x >= this._p_left && y >= this._p_top && x <= this._p_left + this._p_width && y <= this._p_top + this._p_height;
    };

    _pRect.containsRect = function (rc)
    {
        var left, top, width, height;
        if (rc instanceof nexacro.Rect)
        {
            left = rc._p_left;
            top = rc._p_top;
            width = rc._p_width;
            height = rc._p_height;
        }
        else
        {
            left = arguments[0];
            top = arguments[1];
            width = arguments[2];
            height = arguments[3];
        }

        return left >= this._p_left && top >= this._p_top && left + width <= this._p_left + this._p_width && top + height <= this._p_top + this._p_height;
    };

    _pRect.intersectRect = function (rc)
    {
        if (rc instanceof nexacro.Rect)
        {
            return rc._p_left + rc._p_width > this._p_left && rc._p_top + rc._p_height > this._p_top && rc._p_left < this._p_left + this._p_width && rc._p_top < this._p_top + this._p_height;
        }
        else
        {
            var left = arguments[0], top = arguments[1];
            var width = arguments[2], height = arguments[3];
            return left + width > this._p_left && top + height > this._p_top && left < this._p_left + this._p_width && top < this._p_top + this._p_height;
        }
    };


    _pRect.intersect = function (rc)
    {
        var x1, y1, x2, y2;
        if (rc instanceof nexacro.Rect)
        {
            x1 = Math.max(this._p_left, rc._p_left);
            y1 = Math.max(this._p_top, rc._p_top);
            x2 = Math.min(this._p_left + this._p_width, rc._p_left + rc._p_width);
            y2 = Math.min(this._p_top + this._p_height, rc._p_top + rc._p_height);
        }
        else
        {
            var left = arguments[0], top = arguments[1];
            var width = arguments[2], height = arguments[3];
            x1 = Math.max(this._p_left, left);
            y1 = Math.max(this._p_top, top);
            x2 = Math.min(this._p_left + this._p_width, left + width);
            y2 = Math.min(this._p_top + this._p_height, top + height);
        }
        return new nexacro.Rect(x1, y1, x2 - x1, y2 - y1);
    };

    _pRect.union = function (rc)
    {
        var x1, y1, x2, y2;
        if (rc instanceof nexacro.Rect)
        {
            x1 = Math.min(this._p_left, rc._p_left);
            y1 = Math.min(this._p_top, rc._p_top);
            x2 = Math.max(this._p_left + this._p_width, rc._p_left + rc._p_width);
            y2 = Math.max(this._p_top + this._p_height, rc._p_top + rc._p_height);
        }
        else
        {
            var left = arguments[0], top = arguments[1];
            var width = arguments[2], height = arguments[3];
            x1 = Math.min(this._p_left, left);
            y1 = Math.min(this._p_top, top);
            x2 = Math.max(this._p_left + this._p_width, left + width);
            y2 = Math.max(this._p_top + this._p_height, top + height);
        }

        return new nexacro.Rect(x1, y1, x2 - x1, y2 - y1);
    };

    _pRect.includePoint = function (pt)
    {
        var x1, y1, x2, y2, x, y;
        if (pt instanceof nexacro.Point)
        {
            x = pt._p_x;
            y = pt._p_y;
            x1 = Math.min(this._p_x, x);
            y1 = Math.min(this._p_y, y);
            x2 = Math.max(this._p_x + this._p_width, x);
            y2 = Math.max(this._p_y + this._p_height, y);
        }
        else
        {
            x = arguments[0];
            y = arguments[1];
            x1 = Math.min(this._p_x, x);
            y1 = Math.min(this._p_y, y);
            x2 = Math.max(this._p_x + this._p_width, x);
            y2 = Math.max(this._p_y + this._p_height, y);
        }
        return new nexacro.Rect(x1, y1, x2 - x1, y2 - y1);
    };

    _pRect.expand = function (hor, ver)
    {
        if (ver === undefined)
            ver = hor;
        return new nexacro.Rect(this._p_left - hor, this._p_top - ver, this._p_width + hor * 2, this._p_height + ver * 2);
    };

    _pRect.scale = function (hor, ver)
    {
        return this.expand(this._p_width * hor - this._p_width, this._p_height * (ver === undefined ? hor : ver) - this._p_height);
    };

    _pRect._properties = [{ name: "left" }, { name: "top" }, { name: "width" }, { name: "height" }, { name: "right", readonly: true }, { name: "bottom", readonly: true }];
    nexacro._defineProperties(_pRect, _pRect._properties);

    _pRect = null;
}

//==============================================================================
// nexacro Decimal
//==============================================================================
if (!nexacro.Decimal)
{
    nexacro.Decimal = function (v1, v2)
    {
        if (!(this instanceof nexacro.Decimal))
            return new nexacro.Decimal(v1, v2);

        this.hi = 0.0;
        this.lo = 0.0;
        if (v2 == null)
        {
            if (typeof v1 == "boolean")
            {
                if (v1)
                    this.hi = 1;
                else
                    this.hi = 0;
            }
            else if (typeof v1 == "number")
            {
                if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
                {
                    if (!isFinite(v1))  //Infinity, -Infinity
                    {
                        this.hi = v1;
                        this.lo = 0;
                    }
                    else
                        this._parse(v1.toString());
                }
                else
                    this._parse(v1.toString());
                // 13.33 number type일때 decimal값을 string으로 변환시 유효숫자뒤로 이상한 값이 남는문제 우선조치. 원인은 lo값이 0이면 남는다. parse하면 lo값이 0이아니다. lo값이 0이 아니어야 찌꺼기값을 지운다.
                // 성능이슈가 있을수있다. 숫자를 문자로 치환해서 다시 숫자를 만든다. 
                // modifed by comnik 
            }
            else if (typeof v1 == 'object' && v1._type_name == "Decimal")
            {
                this.hi = v1.hi;
                this.lo = v1.lo;
            }
            else if (v1 != null)
            {
                if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0" && isNaN(+v1))
                {
                    this.hi = Number.NaN;
                    this.lo = 0;
                }
                else
                    this._parse(v1);
            }
        }
        else
        {
            this.hi = (v1 - 0.0);
            this.lo = (v2 - 0.0);
        }

        return this;
    };

    nexacro.Decimal.prototype._type_name = "Decimal";

    nexacro.Decimal._fraction_10 = [
        1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9,
        1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19,
        1e20, 1e21, 1e22, 1e23, 1e24, 1e25, 1e26, 1e27, 1e28, 1e29,
        1e30, 1e31, 1e32, 1e33, 1e34, 1e35, 1e36, 1e37, 1e38, 1e39,
        1e40, 1e41, 1e42, 1e43, 1e44, 1e45, 1e46, 1e47, 1e48, 1e49,
        1e50, 1e51, 1e52, 1e53, 1e54, 1e55, 1e56, 1e57, 1e58, 1e59,
        1e60, 1e61, 1e62, 1e63, 1e64, 1e65, 1e66, 1e67, 1e68, 1e69,
        1e70, 1e71, 1e72, 1e73, 1e74, 1e75, 1e76, 1e77, 1e78, 1e79,
        1e80, 1e81, 1e82, 1e83, 1e84, 1e85, 1e86, 1e87, 1e88, 1e89,
        1e90, 1e91, 1e92, 1e93, 1e94, 1e95, 1e96, 1e97, 1e98, 1e99,

        1e100, 1e101, 1e102, 1e103, 1e104, 1e105, 1e106, 1e107, 1e108, 1e109,
        1e110, 1e111, 1e112, 1e113, 1e114, 1e115, 1e116, 1e117, 1e118, 1e119,
        1e120, 1e121, 1e122, 1e123, 1e124, 1e125, 1e126, 1e127, 1e128, 1e129,
        1e130, 1e131, 1e132, 1e133, 1e134, 1e135, 1e136, 1e137, 1e138, 1e139,
        1e140, 1e141, 1e142, 1e143, 1e144, 1e145, 1e146, 1e147, 1e148, 1e149,
        1e150, 1e151, 1e152, 1e153, 1e154, 1e155, 1e156, 1e157, 1e158, 1e159,
        1e160, 1e161, 1e162, 1e163, 1e164, 1e165, 1e166, 1e167, 1e168, 1e169,
        1e170, 1e171, 1e172, 1e173, 1e174, 1e175, 1e176, 1e177, 1e178, 1e179,
        1e180, 1e181, 1e182, 1e183, 1e184, 1e185, 1e186, 1e187, 1e188, 1e189,
        1e190, 1e191, 1e192, 1e193, 1e194, 1e195, 1e196, 1e197, 1e198, 1e199,

        1e200, 1e201, 1e202, 1e203, 1e204, 1e205, 1e206, 1e207, 1e208, 1e209,
        1e210, 1e211, 1e212, 1e213, 1e214, 1e215, 1e216, 1e217, 1e218, 1e219,
        1e220, 1e221, 1e222, 1e223, 1e224, 1e225, 1e226, 1e227, 1e228, 1e229,
        1e230, 1e231, 1e232, 1e233, 1e234, 1e235, 1e236, 1e237, 1e238, 1e239,
        1e240, 1e241, 1e242, 1e243, 1e244, 1e245, 1e246, 1e247, 1e248, 1e249,
        1e250, 1e251, 1e252, 1e253, 1e254, 1e255, 1e256, 1e257, 1e258, 1e259,
        1e260, 1e261, 1e262, 1e263, 1e264, 1e265, 1e266, 1e267, 1e268, 1e269,
        1e270, 1e271, 1e272, 1e273, 1e274, 1e275, 1e276, 1e277, 1e278, 1e279,
        1e280, 1e281, 1e282, 1e283, 1e284, 1e285, 1e286, 1e287, 1e288, 1e289,
        1e290, 1e291, 1e292, 1e293, 1e294, 1e295, 1e296, 1e297, 1e298, 1e299,

        1e300, 1e301, 1e302, 1e303, 1e304, 1e305, 1e306, 1e307, 1e308
    ];
    nexacro.Decimal._fraction_10_n = [
        1e0, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9,
        1e-10, 1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17, 1e-18, 1e-19,
        1e-20, 1e-21, 1e-22, 1e-23, 1e-24, 1e-25, 1e-26, 1e-27, 1e-28, 1e-29,
        1e-30, 1e-31, 1e-32, 1e-33, 1e-34, 1e-35, 1e-36, 1e-37, 1e-38, 1e-39,
        1e-40, 1e-41, 1e-42, 1e-43, 1e-44, 1e-45, 1e-46, 1e-47, 1e-48, 1e-49,
        1e-50, 1e-51, 1e-52, 1e-53, 1e-54, 1e-55, 1e-56, 1e-57, 1e-58, 1e-59,
        1e-60, 1e-61, 1e-62, 1e-63, 1e-64, 1e-65, 1e-66, 1e-67, 1e-68, 1e-69,
        1e-70, 1e-71, 1e-72, 1e-73, 1e-74, 1e-75, 1e-76, 1e-77, 1e-78, 1e-79,
        1e-80, 1e-81, 1e-82, 1e-83, 1e-84, 1e-85, 1e-86, 1e-87, 1e-88, 1e-89,
        1e-90, 1e-91, 1e-92, 1e-93, 1e-94, 1e-95, 1e-96, 1e-97, 1e-98, 1e-99,

        1e-100, 1e-101, 1e-102, 1e-103, 1e-104, 1e-105, 1e-106, 1e-107, 1e-108, 1e-109,
        1e-110, 1e-111, 1e-112, 1e-113, 1e-114, 1e-115, 1e-116, 1e-117, 1e-118, 1e-119,
        1e-120, 1e-121, 1e-122, 1e-123, 1e-124, 1e-125, 1e-126, 1e-127, 1e-128, 1e-129,
        1e-130, 1e-131, 1e-132, 1e-133, 1e-134, 1e-135, 1e-136, 1e-137, 1e-138, 1e-139,
        1e-140, 1e-141, 1e-142, 1e-143, 1e-144, 1e-145, 1e-146, 1e-147, 1e-148, 1e-149,
        1e-150, 1e-151, 1e-152, 1e-153, 1e-154, 1e-155, 1e-156, 1e-157, 1e-158, 1e-159,
        1e-160, 1e-161, 1e-162, 1e-163, 1e-164, 1e-165, 1e-166, 1e-167, 1e-168, 1e-169,
        1e-170, 1e-171, 1e-172, 1e-173, 1e-174, 1e-175, 1e-176, 1e-177, 1e-178, 1e-179,
        1e-180, 1e-181, 1e-182, 1e-183, 1e-184, 1e-185, 1e-186, 1e-187, 1e-188, 1e-189,
        1e-190, 1e-191, 1e-192, 1e-193, 1e-194, 1e-195, 1e-196, 1e-197, 1e-198, 1e-199,

        1e-200, 1e-201, 1e-202, 1e-203, 1e-204, 1e-205, 1e-206, 1e-207, 1e-208, 1e-209,
        1e-210, 1e-211, 1e-212, 1e-213, 1e-214, 1e-215, 1e-216, 1e-217, 1e-218, 1e-219,
        1e-220, 1e-221, 1e-222, 1e-223, 1e-224, 1e-225, 1e-226, 1e-227, 1e-228, 1e-229,
        1e-230, 1e-231, 1e-232, 1e-233, 1e-234, 1e-235, 1e-236, 1e-237, 1e-238, 1e-239,
        1e-240, 1e-241, 1e-242, 1e-243, 1e-244, 1e-245, 1e-246, 1e-247, 1e-248, 1e-249,
        1e-250, 1e-251, 1e-252, 1e-253, 1e-254, 1e-255, 1e-256, 1e-257, 1e-258, 1e-259,
        1e-260, 1e-261, 1e-262, 1e-263, 1e-264, 1e-265, 1e-266, 1e-267, 1e-268, 1e-269,
        1e-270, 1e-271, 1e-272, 1e-273, 1e-274, 1e-275, 1e-276, 1e-277, 1e-278, 1e-279,
        1e-280, 1e-281, 1e-282, 1e-283, 1e-284, 1e-285, 1e-286, 1e-287, 1e-288, 1e-289,
        1e-290, 1e-291, 1e-292, 1e-293, 1e-294, 1e-295, 1e-296, 1e-297, 1e-298, 1e-299,

        1e-300, 1e-301, 1e-302, 1e-303, 1e-304, 1e-305, 1e-306, 1e-307, 1e-308
    ];
    nexacro.Decimal._QD_SPLITTER = 134217729.0;  // = 2^27 + 1
    nexacro.Decimal._QD_SPLIT_THRESH = 6.69692879491417e+299; // = 2^996
    nexacro.Decimal._zero_strs = ['', '0', '00', '000', '0000', '00000', '000000', '0000000', '00000000'];
    nexacro.Decimal._opt_precision = 15; // max: 21
    nexacro.Decimal._opt_max_int_digits = 24; // 31
    nexacro.Decimal._opt_max_digits = 31 // for old version compatible

    nexacro.Decimal._getPow = function (n, dec)
    {
        if (n == 0)
        {
            dec.setDouble(1.0);
            return;
        }

        var s = new nexacro.Decimal();
        s.setDouble(1.0);
        dec.setDouble(10.0);

        var N = Math.abs(n) | 0;
        if (N > 1)
        {
            while (N > 0)
            {
                if ((N % 2) | 0 == 1)
                    s.mulDecimal(dec);

                N = (N / 2) | 0;
                if (N > 0)
                {
                    dec.sqr();
                }
            }
        }
        else
        {
            s.setDouble(10.0);
        }

        if (n < 0)
        {
            dec.setDouble(1.0);
            dec.divDecimal(s);
        }
        else
        {
            dec.setDecimal(s);
        }

        return;
    };

    var _pDecimal = nexacro.Decimal.prototype;

    _pDecimal._parse = function (numstr)
    {
        this.hi = 0;
        this.lo = 0;

        var pos = 0;

        if (!numstr) return;

        var len = numstr.length;

        // trim whitespace
        var ch;
        while (pos < len)
        {
            ch = numstr.charAt(pos);
            if (!this._isSpace(ch) && ch != '\t')
                break;
            pos++;
        }

        if (pos >= len)
        {
            this.hi = Number.NaN;
            return;
        }

        // check sign
        var sign = 0;	// 0 : pos, 1 : neg
        ch = numstr.charAt(pos);
        if (ch == '-')
        {
            sign = 1;
            pos++;
        }
        else if (ch == '+')
        {
            pos++;
        }

        // check ipart & calculate ipart
        var ipos = pos;		// ipart position
        var fpos = pos;		// fpart position
        while (fpos < len)
        {
            ch = numstr.charAt(fpos);
            if (ch < '0' || ch > '9')
                break;
            fpos++;
        }

        var digits;
        var frac_offset = 0;

        var tpos = ipos;
        while (tpos < fpos)
        {
            pos = tpos;
            tpos += 9;
            if (tpos > fpos)
            {
                tpos = fpos;
            }

            while (pos < tpos)
            {
                ch = numstr.charAt(pos++);
                this.mulDouble(10.0);
                this.addDouble((ch - '0') | 0);
            }
        }

        // check fraction part & calculate fraction
        var epos, dfrac = 0;
        ch = numstr.charAt(fpos);
        if (ch == '.')
        {
            fpos++;
            pos = fpos;

            epos = numstr.search(/0+$/g);
            while (pos < len)
            {
                ch = numstr.charAt(pos);
                if (ch < '0' || ch > '9')
                    break;
                pos++;
            }
            if (epos < 0 || pos < epos)
                epos = pos;

            tpos = fpos;
            while (tpos < epos)
            {
                pos = tpos;
                tpos += 9;
                if (tpos > epos)
                {
                    tpos = epos;
                    frac_offset = tpos - pos;
                }
                else
                {
                    frac_offset = 9;
                }

                while (pos < tpos)
                {
                    ch = numstr.charAt(pos++);
                    this.mulDouble(10.0);
                    this.addDouble((ch - '0') | 0);
                }
                dfrac += frac_offset;
            }
        }
        else
        {
            epos = fpos;
        }

        var negf;
        // check exponent part & calculate exponent
        ch = numstr.charAt(epos);
        digits = 0;
        if (ch == 'e' || ch == 'E')
        {
            epos++;
            ch = numstr.charAt(epos);
            if (ch == '-')
            {
                negf = 1;
                epos++;
            }
            else if (ch == '+')
            {
                negf = 0;
                epos++;
            }
            else
            {
                negf = 0;
            }

            pos = epos;
            while (pos < len)
            {
                ch = numstr.charAt(pos);
                if (ch < '0' || ch > '9')
                    break;
                pos++;
            }
            len = pos + 1;
            if (len > numstr.length)
                len = numstr.length;

            pos = epos;

            while (pos < len)
            {
                digits *= 10;
                ch = numstr.charAt(pos++);
                digits += (ch - '0');
            }

            if (digits >= 308)
            {
                if (negf)
                {
                    this.hi = 0.0;
                    this.lo = 0.0;
                }
                else
                {
                    this.hi = (sign ? -Infinity : Infinity);
                    this.lo = 0.0;
                }
                return;
            }
            if (negf)
                digits = -digits;
        }

        var scale = new nexacro.Decimal();
        if (dfrac > 0)
            digits -= dfrac;

        if (digits != 0)
        {
            nexacro.Decimal._getPow(digits, scale);
            this.mulDecimal(scale);
        }

        if (this.hi == Infinity)
        {
            this.lo = 0.0;
        }

        if (sign)
        {
            this.hi = -this.hi;
            this.lo = -this.lo;
        }
    };

    _pDecimal._isSpace = function (ch)
    {
        if (ch == " " || ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0" && ch == "　"))
            return true;
        return false;
    }

    _pDecimal.setDouble = function (hi)
    {
        if (typeof hi != 'number')
            throw new TypeError("Invalid arguments type!");

        this.hi = hi;
        this.lo = 0.0;
    };

    _pDecimal.setDecimal = function (dec)
    {
        if (!(dec instanceof nexacro.Decimal))
            throw new TypeError("Invalid arguments type!");

        this.hi = dec.hi;
        this.lo = dec.lo;
    };

    _pDecimal.setString = function (numstr)
    {
        if (typeof numstr != 'string')
            throw new TypeError("Invalid arguments type!");

        this._parse(numstr);
    };

    _pDecimal.isZero = function ()
    {
        return (this.hi == 0.0 && this.lo == 0.0);
    };
    _pDecimal.isEqual = function (dec)
    {
        if (!(dec instanceof nexacro.Decimal))
            throw new TypeError("Invalid arguments type!");

        return (this.hi == dec.hi && this.lo == dec.lo);
    };
    _pDecimal.isInfinity = function ()
    {
        return (this.hi == Infinity || this.hi == -Infinity);
    };
    _pDecimal.isNaN = function ()
    {
        // isNaN(v) === (+v) != (+v), for Number v != v
        return (this.hi != this.hi);
    };
    _pDecimal.isNaNOrInf = function ()
    {
        // isNaN(v) === (+v) != (+v), for Number v != v
        return (this.hi == Infinity || this.hi == -Infinity || this.hi != this.hi);
    };
    _pDecimal.isNegative = function ()
    {
        return this.hi < 0.0 || (this.hi == 0.0 && this.lo < 0.0);
    };

    _pDecimal.addDouble = function (dval)
    {
        var H, S, s, e;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || !isFinite(dval))
            {
                this.hi += dval;
                this.lo = 0.0;

                return;
            }
        }

        S = this.hi + dval;
        e = S - this.hi;
        s = S - e;
        s = (this.hi - s) + (dval - e);
        e = s + this.lo;

        this.hi = S + e;
        this.lo = e - (this.hi - S);
    };

    _pDecimal.addDecimal = function (dec)
    {
        var S, s, e;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || dec.isInfinity())
            {
                this.hi += dec.hi;
                this.lo = 0.0;

                return;
            }
        }

        S = this.hi + dec.hi;
        e = S - this.hi;
        s = S - e;
        s = (this.hi - s) + (dec.hi - e);
        e = s + (this.lo + dec.lo);

        this.hi = S + e;
        this.lo = e - (this.hi - S);
    };

    _pDecimal.subDouble = function (dval)
    {
        var S, s, e;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || !isFinite(dval))
            {
                this.hi -= dval;
                this.lo = 0.0;

                return;
            }
        }

        S = this.hi - dval;
        e = S - this.hi;
        s = S - e;
        s = (this.hi - s) - (dval + e);
        e = s + this.lo;

        this.hi = S + e;
        this.lo = e - (this.hi - S);
    };

    _pDecimal.subDecimal = function (dec)
    {
        var H, h, T, t, S, s, e, f;
        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || dec.isInfinity())
            {
                this.hi -= dec.hi;
                this.lo = 0.0;

                return;
            }
        }

        S = this.hi - dec.hi;
        e = S - this.hi;
        s = S - e;
        s = (this.hi - s) - (dec.hi + e);
        e = s + this.lo - dec.lo;

        this.hi = S + e;
        this.lo = e - (this.hi - S);
    };

    _pDecimal.mulDouble = function (dval)
    {
        var hx, tx, hy, ty, C, c;
        var hi;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || !isFinite(dval))
            {
                this.hi *= dval;
                this.lo = 0.0;

                return;
            }
        }

        hi = this.hi;
        if (hi > nexacro.Decimal._QD_SPLIT_THRESH || hi < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            hi *= 3.7252902984619140625e-09;  // 2^-28
            C = nexacro.Decimal._QD_SPLITTER * hi;
            hx = C - hi;
            hx = C - hx;
            tx = hi - hx;
            hx = hx * 268435456.0;          // 2^28
            tx = tx * 268435456.0;          // 2^28
        }
        else
        {
            C = nexacro.Decimal._QD_SPLITTER * hi;
            hx = C - hi;
            hx = C - hx;
            tx = hi - hx;
        }

        hi = dval;
        if (hi > nexacro.Decimal._QD_SPLIT_THRESH || hi < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            hi *= 3.7252902984619140625e-09;  // 2^-28
            c = nexacro.Decimal._QD_SPLITTER * hi;
            hy = c - hi;
            hy = c - hy;
            ty = hi - hy;
            hy = hy * 268435456.0;          // 2^28
            ty = ty * 268435456.0;          // 2^28
        }
        else
        {
            c = nexacro.Decimal._QD_SPLITTER * hi;
            hy = c - hi;
            hy = c - hy;
            ty = hi - hy;
        }

        C = this.hi * dval;
        c = hx * hy;
        if ((c == Infinity || c == -Infinity) && C != Infinity && C != -Infinity)
        {
            var tC = C * 3.7252902984619140625e-09;
            var tc = hx * 3.7252902984619140625e-09 * hy;
            c = ((((tc - tC) * 268435456.0 + hx * ty) + tx * hy) + tx * ty) + (this.lo * dval);
        }
        else
        {
            c = ((((c - C) + hx * ty) + tx * hy) + tx * ty) + (this.lo * dval);
        }
        //c = ((((hx * hy - C) + hx * ty) + tx * hy) + tx * ty) + (this.lo * dval);

        this.hi = C + c;
        hx = C - this.hi;
        this.lo = c + hx;
    };

    _pDecimal.mulDecimal = function (dec)
    {
        var hx, tx, hy, ty, C, c;
        var hi;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || dec.isInfinity())
            {
                this.hi *= dec.hi;
                this.lo = 0.0;

                return;
            }
        }

        hi = this.hi;
        if (hi > nexacro.Decimal._QD_SPLIT_THRESH || hi < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            hi *= 3.7252902984619140625e-09;  // 2^-28
            C = nexacro.Decimal._QD_SPLITTER * hi;
            hx = C - hi;
            hx = C - hx;
            tx = hi - hx;
            hx = hx * 268435456.0;          // 2^28
            tx = tx * 268435456.0;          // 2^28
        }
        else
        {
            C = nexacro.Decimal._QD_SPLITTER * hi;
            hx = C - hi;
            hx = C - hx;
            tx = hi - hx;
        }

        hi = dec.hi;
        if (hi > nexacro.Decimal._QD_SPLIT_THRESH || hi < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            hi *= 3.7252902984619140625e-09;  // 2^-28
            c = nexacro.Decimal._QD_SPLITTER * hi;
            hy = c - hi;
            hy = c - hy;
            ty = hi - hy;
            hy = hy * 268435456.0;          // 2^28
            ty = ty * 268435456.0;          // 2^28
        }
        else
        {
            c = nexacro.Decimal._QD_SPLITTER * hi;
            hy = c - hi;
            hy = c - hy;
            ty = hi - hy;
        }

        C = this.hi * dec.hi;
        c = hx * hy;
        if ((c == Infinity || c == -Infinity) && C != Infinity && C != -Infinity)
        {
            var tC = C * 3.7252902984619140625e-09;
            var tc = hx * 3.7252902984619140625e-09 * hy;
            c = ((((tc - tC) * 268435456.0 + hx * ty) + tx * hy) + tx * ty) + (this.hi * dec.lo + this.lo * dec.hi);
        }
        else
        {
            c = ((((c - C) + hx * ty) + tx * hy) + tx * ty) + (this.hi * dec.lo + this.lo * dec.hi);
        }
        //c = ((((hx * hy - C) + hx * ty) + tx * hy) + tx * ty) + (this.hi * dec.lo + this.lo * dec.hi);

        this.hi = C + c;
        hx = C - this.hi;
        this.lo = c + hx;
    };

    _pDecimal.divDouble = function (dval)
    {
        var q1, q2, p1, p2, s, e, h1, l1, h2, l2;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || !isFinite(dval))
            {
                this.hi /= dval;
                this.lo = 0.0;

                return;
            }
        }
        q1 = this.hi / dval;
        p1 = q1 * dval;

        var temp, tempe;
        if (q1 > nexacro.Decimal._QD_SPLIT_THRESH || q1 < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            q1 *= 3.7252902984619140625e-09;  // 2^-28
            temp = nexacro.Decimal._QD_SPLITTER * q1;
            h1 = temp - (temp - q1);
            l1 = q1 - h1;
            h1 *= 268435456.0;          // 2^28
            l1 *= 268435456.0;          // 2^28
        }
        else
        {
            temp = nexacro.Decimal._QD_SPLITTER * q1;
            h1 = temp - (temp - q1);
            l1 = q1 - h1;
        }

        q2 = dval;
        if (q2 > nexacro.Decimal._QD_SPLIT_THRESH || q2 < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            q2 *= 3.7252902984619140625e-09;  // 2^-28
            temp = nexacro.Decimal._QD_SPLITTER * q2;
            h2 = temp - (temp - q2);
            l2 = q2 - h2;
            h2 *= 268435456.0;          // 2^28
            l2 *= 268435456.0;          // 2^28
        }
        else
        {
            temp = nexacro.Decimal._QD_SPLITTER * q2;
            h2 = temp - (temp - q2);
            l2 = q2 - h2;
        }
        p2 = ((h1 * h2 - p1) + h1 * l2 + l1 * h2) + l1 * l2;

        s = this.hi - p1;
        tempe = s - this.hi;
        e = (this.hi - (s - tempe)) - (p1 + tempe) + this.lo - p2;

        q2 = (s + e) / dval;

        this.hi = q1 + q2;
        this.lo = q2 - (this.hi - q1);
    };

    _pDecimal.divDecimal = function (dec)
    {
        var q1, q2, s1, s2;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || dec.isInfinity())
            {
                this.hi /= dec.hi;
                this.lo = 0.0;

                return;
            }
        }

        var r = new nexacro.Decimal(dec);

        q1 = this.hi / dec.hi;
        r.mulDouble(q1);

        s1 = this.hi - r.hi;
        s2 = (this.hi - (s1 - (s1 - this.hi))) - (r.hi + (s1 - this.hi));
        s2 -= r.lo;

        //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
        var _lo = this.lo;
        s2 += _lo;

        q2 = (s1 + s2) / dec.hi;

        this.hi = q1 + q2;
        this.lo = q2 - (this.hi - q1);
    };

    _pDecimal.modDouble = function (dval)
    {

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || !isFinite(dval))
            {
                this.hi %= dval;
                this.lo = 0.0;

                return;
            }
        }

        var r = new nexacro.Decimal(this);
        r.divDouble(dval);
        r.floor();
        r.mulDouble(dval);
        this.subDecimal(r);
    };

    _pDecimal.modDecimal = function (dec)
    {

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity() || dec.isInfinity())
            {
                this.hi %= dec.hi;
                this.lo = 0.0;

                return;
            }
        }

        var r = new nexacro.Decimal(this);
        r.divDecimal(dec);
        r.floor();
        r.mulDecimal(dec);
        this.subDecimal(r);
    };

    _pDecimal.sqr = function ()
    {
        var p1, p2;
        var hi = this.hi, lo = this.lo;
        var temp, ht, lt;

        if ((nexacro.getEnvironment()?._p_datatyperule || nexacro._datatyperule) != "1.0")
        {
            if (this.isInfinity())
            {
                this.hi = hi * hi;
                this.lo = 0.0;

                return this;
            }
        }

        p1 = hi * hi;
        if (hi > nexacro.Decimal._QD_SPLIT_THRESH || hi < -nexacro.Decimal._QD_SPLIT_THRESH)
        {
            hi *= 3.7252902984619140625e-09;  // 2^-28
            temp = nexacro.Decimal._QD_SPLITTER * hi;
            ht = temp - (temp - hi);
            lt = hi - ht;
            hi = ht * 268435456.0;          // 2^28
            lo = lt * 268435456.0;          // 2^28
        }
        else
        {
            temp = nexacro.Decimal._QD_SPLITTER * hi;
            hi = temp - (temp - hi);
            lo = this.hi - hi;
        }

        p2 = ((hi * hi - p1) + 2.0 * hi * lo) + lo * lo;

        //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
        var _hi = this.hi, _lo = this.lo;
        p2 += 2.0 * _hi * _lo;
        p2 += _lo * _lo;

        this.hi = p1 + p2;
        this.lo = p2 - (this.hi - p1);

        return this;
    };

    _pDecimal.abs = function ()
    {
        if (this.isNegative())
        {
            var s1 = -this.hi;
            var s2 = -this.lo;

            this.hi = s1 + s2;
            this.lo = s2 - (this.hi - s1);
        }
        return this;
    };

    _pDecimal.floor = function ()
    {
        var hi = Math.floor(this.hi), lo = 0.0;
        if (hi == this.hi)
        {
            lo = Math.floor(this.lo);

            var sum = hi + lo;
            lo = lo - (sum - hi);
            hi = sum;
        }
        this.hi = hi;
        this.lo = lo;

        return this;
    };
    _pDecimal.ceil = function ()
    {
        var hi = Math.ceil(this.hi), lo = 0.0;

        var fhi = Math.ceil(this.hi);
        // Hi is already integral.  Ceil the low word
        if (fhi == this.hi)
        {
            lo = Math.ceil(this.lo);

            var sum = hi + lo;
            lo = lo - (sum - hi);
            hi = sum;
        }
        this.hi = hi;
        this.lo = lo;

        return this;
    };
    _pDecimal.round = function ()
    {
        // may not be 100% correct
        this.addDouble(0.5);
        return this.floor();
    };
    _pDecimal.trunc = function ()
    {
        if (this.hi > 0.0)
            return this.floor();
        else
            return this.ceil();
    };

    _pDecimal.log = function ()
    {
        if (this.hi == 1.0 && this.lo == 0.0)
        {
            this.setDouble(1.0);
        }
        else 
        {
            var hi = this.hi, lo = this.lo;
            var decx = new nexacro.Decimal(Math.log(hi));

            var exp_val = new nexacro.Decimal(-decx.hi, -decx.lo);
            exp_val.exp();

            this.mulDecimal(exp_val);
            this.addDecimal(new nexacro.Decimal(Math.log(hi)));
            this.subDouble(1.0);
        }

        return this;
    };

    _pDecimal.log10 = function ()
    {
        this.log();

        this.divDecimal(nexacro.Decimal.LOG10E);
        return this;
    };

    nexacro.Decimal._inv_fact = [
        [1.66666666666666657e-01, 9.25185853854297066e-18],
        [4.16666666666666644e-02, 2.31296463463574266e-18],
        [8.33333333333333322e-03, 1.15648231731787138e-19],
        [1.38888888888888894e-03, -5.30054395437357706e-20],
        [1.98412698412698413e-04, 1.72095582934207053e-22],
        [2.48015873015873016e-05, 2.15119478667758816e-23],
        [2.75573192239858925e-06, -1.85839327404647208e-22],
        [2.75573192239858883e-07, 2.37677146222502973e-23],
        [2.50521083854417202e-08, -1.44881407093591197e-24],
        [2.08767569878681002e-09, -1.20734505911325997e-25],
        [1.60590438368216133e-10, 1.25852945887520981e-26],
        [1.14707455977297245e-11, 2.06555127528307454e-28],
        [7.64716373181981641e-13, 7.03872877733453001e-30],
        [4.77947733238738525e-14, 4.39920548583408126e-31],
        [2.81145725434552060e-15, 1.65088427308614326e-31]
    ];

    _pDecimal.exp = function ()
    {
        // exp(kr + m * log(2)) = 2^m * exp(r)^k
        var k = 512.0;
        var inv_k = 1.0 / k;
        var eps = 4.93038065763132e-32;

        var hi = this.hi, lo = this.lo;
        if (hi <= -709.0)
        {
            this.hi = this.lo = 0.0;
            return this;
        }

        if (hi >= 709.0)
        {
            this.hi = Number.Infinity;
            this.lo = 0.0;
            return this;
        }

        if (hi == 0.0)
        {
            this.hi = 1.0;
            this.lo = 0.0;
            return this;
        }

        if (hi == 1.0 && lo == 0.0)
        {
            this.setDecimal(nexacro.Decimal.E);
            return this;
        }

        var log2e = new nexacro.Decimal(nexacro.Decimal.LOG2E);
        var m = Math.floor(hi / log2e.hi + 0.5);

        var r = new nexacro.Decimal(this);
        log2e.mulDouble(m);
        r.subDecimal(log2e);
        r.hi *= inv_k; r.lo *= inv_k;

        hi = r.hi; lo = r.lo;

        var p = new nexacro.Decimal(r);
        p.sqr();

        var s = new nexacro.Decimal(p.hi * 0.5, p.lo * 0.5);

        s.addDecimal(r);
        p.mulDecimal(r);

        var temp = new nexacro.Decimal(nexacro.Decimal._inv_fact[0][0], nexacro.Decimal._inv_fact[0][1]);
        temp.mulDecimal(p);

        var i = 0;
        do
        {
            s.addDecimal(temp);
            p.mulDecimal(r);
            ++i;

            temp = new nexacro.Decimal(nexacro.Decimal._inv_fact[i][0], nexacro.Decimal._inv_fact[i][1]);
            temp.mulDecimal(p);

        } while (Math.abs(temp.hi) > inv_k * eps && i < 5);

        s.addDecimal(temp);

        function pwrsqr(a, b)
        {
            var val = new nexacro.Decimal(a.hi * b, a.lo * b);
            val.addDecimal(a.sqr());
            return val;
        }

        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s = pwrsqr(s, 2.0);
        s.addDouble(1.0);

        this.hi = s.hi * Math.pow(2, m | 0);
        this.lo = s.lo * Math.pow(2, m | 0);

        return this;
    };

    // format = undefined/0: plain, 1: tofixed, 2: toexponential
    _pDecimal._toString = function (precision, format, locale)
    {
        var locale_info, decimal_point = ".";
        if (locale && (locale_info = nexacro.Locale.getLocaleInfo(locale)))
        {
            decimal_point = locale_info.decimal_point || ".";
        }

        var is_specified_precision = precision != undefined;
        var toFixed = format == 1;
        var toExponential = format == 2;

        precision |= 0;
        if (this.isZero())
        {
            var s = "0";
            if (is_specified_precision)
            {
                var frag_digits;

                if (format >= 1) 
                {
                    frag_digits = Math.min(precision, nexacro.Decimal._opt_precision);
                }
                else 
                {
                    frag_digits = Math.min(precision - 1, nexacro.Decimal._opt_precision);
                }

                s += decimal_point;
                s += ((new Array(frag_digits)).fill(0)).join('');
            }
            return s;
        }

        if (this.isNaN())
        {
            return "NaN";
        }

        if (this.isInfinity())
        {
            return this.hi + "";
        }

        var dec = new nexacro.Decimal(this);
        dec.abs().log10().floor();

        var offset = (dec.hi | 0) + 1;

        var digitlen;
        if (is_specified_precision && toExponential)
        {
            precision += 1;
        }
        if (!toFixed && offset > nexacro.Decimal._opt_max_int_digits)
        {
            precision = nexacro.Decimal._opt_precision + 1;
            toExponential = true;
        }

        if (offset < 0)
        {
            digitlen = nexacro.Decimal._opt_precision + offset;
            if (is_specified_precision)
            {
                if (toFixed)
                {
                    if ((precision + offset) <= 0)
                    {
                        var s = "0";
                        if (precision > 0)
                        {
                            s += decimal_point;
                            s += ((new Array(precision)).fill(0)).join('');
                        }
                        return s;
                    }
                    precision += offset;
                }
                if (precision > digitlen)
                {
                    toExponential = true;
                }
                digitlen = precision;
            }
            else if (toExponential || (!toFixed && digitlen <= 0))
            {
                digitlen = nexacro.Decimal._opt_precision + 1;
                toExponential = true;
            }
        }
        else
        {
            if (is_specified_precision)
            {
                if (toFixed)
                {
                    precision += offset;
                }
                else if (precision > nexacro.Decimal._opt_max_int_digits || precision < offset)
                {
                    toExponential = true;
                }
                digitlen = precision;
            }
            else if (toFixed && offset > nexacro.Decimal._opt_max_int_digits && offset >= nexacro.Decimal._opt_max_digits)
            {
                digitlen = offset;
            }
            else
            {
                // 스펙은 정수+소수부 합쳐서 24자리 표현으로 제한해야 하지만,
                // 이전에 정수부가 24자리를 넘지 않는 경우, max digits를 31자리로 처리해줬던 이력이 있어서
                // 하위 호환 때문에 정수부 24자리 + 소수부 15자리로 처리 하도록 사양을 변경키로 함.
                //digitlen = Math.min(nexacro.Decimal._opt_precision + offset, nexacro.Decimal._opt_max_int_digits);
                digitlen = Math.min(nexacro.Decimal._opt_precision + offset, nexacro.Decimal._opt_max_digits);
            }
        }

        var _cvt = this._getCVT(digitlen, is_specified_precision);
        if (toExponential || (!toFixed && _cvt.dec > 24))
        {
            if (!is_specified_precision && _cvt.dec > nexacro.Decimal._opt_precision + 1)
            {
                _cvt = this._getCVT(nexacro.Decimal._opt_precision + 1, is_specified_precision);
            }
            return this._toScientificStr(_cvt, locale);
        }

        // fixed

        offset = _cvt.exp;

        var i, buf = _cvt.buf;
        var epos = digitlen + 1;

        /* Round, handle carry */
        if (buf[epos - 1] >= 5)
        {
            buf[epos - 2]++;

            i = epos - 2;
            while (i > 0 && buf[i] > 9)
            {
                buf[i] -= 10;
                buf[--i]++;
            }
        }

        /* If first digit is 10, shift everything. */
        if (buf[0] > 9)
        {
            for (i = epos; i >= 2; i--)
                buf[i] = buf[i - 1];

            buf[0] = 1;
            buf[1] = 0;

            offset++;
            epos++;

            _cvt.dec = offset + 1;
            _cvt.exp = offset;
            _cvt.pos = epos;
        }
        buf[epos] = 0;

        return this._toStandardStr(_cvt, locale);
    };

    _pDecimal.toString = function ()
    {
        return this._toString();
    };

    _pDecimal.valueOf = function ()
    {
        return this.hi + this.lo;

    };

    _pDecimal._getCVT = function (precision, fill_zero)
    {
        var sign = 0;
        var y = new nexacro.Decimal(this);

        var epos = precision + 1;

        if (this.hi < 0.0 || this.hi == 0.0 && this.lo < 0.0)
        {
            sign = 1;
            y.abs();
        }

        /* First determine the (approximate) exponent. */
        var dAbs = Math.abs(y.hi);
        var exp = Math.floor(Math.log(dAbs) * Math.LOG10E) | 0;

        var scale = new nexacro.Decimal();
        if (exp < -300)
        {
            nexacro.Decimal._getPow(300, scale);
            y.mulDecimal(scale);

            nexacro.Decimal._getPow(exp + 300, scale);
            y.divDecimal(scale);
        }
        else if (exp > 300)
        {
            y.hi *= Math.pow(2, -53); y.lo *= Math.pow(2, -53);
            nexacro.Decimal._getPow(exp, scale);
            y.divDecimal(scale);
            y.hi *= Math.pow(2, 53); y.lo *= Math.pow(2, 53);
        }
        else
        {
            nexacro.Decimal._getPow(exp, scale);
            y.divDecimal(scale);
        }

        /* Fix exponent if we are off by one */
        if ((y.hi > 10.0 || (y.hi == 10.0 && y.lo >= 0.0)))
        {
            y.divDouble(10.0);
            exp++;
        }
        else if ((y.hi < 1.0 || (y.hi == 1.0 && y.lo < 0.0)))
        {
            y.mulDouble(10.0);
            exp--;
        }

        var pos = 0, digit, buf = [];
        while (pos < epos)
        {
            digit = y.hi | 0;

            y.subDouble(digit);
            y.mulDouble(10.0);
            buf[pos++] = digit;
        }

        var len = buf.length;

        /* Fix out of range digits. */
        for (var i = epos - 1; i > 0; i--)
        {
            if (buf[i] < 0)
            {
                buf[i - 1]--;
                buf[i] += 10;
            }
            else if (buf[i] > 9)
            {
                buf[i - 1]++;
                buf[i] -= 10;
            }
        }

        /* Round, handle carry */
        if (buf[len - 1] >= 5)
        {
            if (len > 1)
            {
                buf[len - 2]++;
                buf[len - 1] = 0;
            }
            else if (precision == 0)
            {
                buf[len - 1] = 1;
                buf[len] = 0;
                exp++;
                len = 2;
            }

            i = len - 2;
            while (i > 0 && buf[i] > 9)
            {
                buf[i] -= 10;
                buf[--i]++;
            }
        }

        len = buf.length;

        /* If first digit is 10, shift everything. */
        if (buf[0] > 9)
        {
            exp++;
            for (i = len - 1; i >= 2; i--)
                buf[i] = buf[i - 1];

            buf[0] = 1;
            buf[1] = 0;
        }

        pos = buf.length - 1;
        if (!fill_zero)
        {
            while (pos > 0 && buf[pos - 1] == 0)
                --pos;
        }

        var _cvt_info = {};
        _cvt_info.dec = exp + 1;
        _cvt_info.exp = exp;
        _cvt_info.sign = sign;
        _cvt_info.pos = pos;
        _cvt_info.buf = buf.join('').substr(0, pos);
        return _cvt_info;
    };

    _pDecimal._toScientificStr = function (cvt, locale)
    {
        var str = '', digits = 0;
        var _cvt = cvt;
        if (_cvt == null || _cvt.pos == 0)
            return '0';

        var locale_info, decimal_point = ".";
        if (locale && (locale_info = nexacro.Locale.getLocaleInfo(locale)))
        {
            decimal_point = locale_info.decimal_point || ".";
        }

        digits = _cvt.pos;
        if (_cvt.sign)
            str = '-';

        str += _cvt.buf.charAt(0);
        if (digits > 1)
        {
            str += decimal_point;
            str += _cvt.buf.substring(1);
        }

        var exp = _cvt.exp;
        if (exp != 0)
        {
            str += ((exp > 0) ? 'e+' : 'e');
            str += exp;
        }

        return str;
    };

    _pDecimal._toStandardStr = function (cvt, locale)
    {
        var str = '', digits = 0, dec = 0;
        var _cvt = cvt;
        if (_cvt == null || _cvt.pos == 0)
            return '0';

        var locale_info, decimal_point = ".", thousands_sep = ",", grouping = null;
        if (locale && (locale_info = nexacro.Locale.getLocaleInfo(locale)))
        {
            decimal_point = locale_info.decimal_point || ".";
            thousands_sep = locale_info.thousands_sep || ","
            grouping = locale_info.grouping;
        }

        if (_cvt.sign)
            str = '-';

        dec = _cvt.dec;
        digits = _cvt.pos;
        var buf = _cvt.buf;
        function applyGrouping(value_str, grouping, sepCh)
        {
            var grouping_strs = [], grouping_value;
            var grouping_idx = 0, grouping_cnt = grouping.length;

            while (value_str.length > 0)
            {
                if (grouping_idx < grouping_cnt)
                {
                    grouping_value = grouping[grouping_idx++];
                    if (grouping_value <= 0) grouping_value = 3;
                }

                if (value_str.length > grouping_value)
                {
                    grouping_strs.push(value_str.substr(value_str.length - grouping_value, grouping_value));
                    value_str = value_str.slice(0, value_str.length - grouping_value);
                }
                else
                {
                    grouping_strs.push(value_str);
                    break;
                }
            }

            return grouping_strs.reverse().join(sepCh);
        }
        if (dec <= 0)
        {
            str += '0';
            str += decimal_point;
            for (var i = dec; i < 0; i++)
                str += '0';
            str += buf;
        }
        else if (digits > dec)
        {
            var intpart = buf.substring(0, dec);
            str += (grouping ? applyGrouping(intpart, grouping, thousands_sep) : intpart);
            str += decimal_point;
            str += buf.substring(dec);
        }
        else
        {
            var padding_str = buf;
            if ((dec - digits) > 0)
            {
                for (var j = 0; j < (dec - digits); j++)
                    padding_str += '0';
            }
            str += (grouping ? applyGrouping(padding_str, grouping, thousands_sep) : padding_str);
        }
        return str;


    };

    _pDecimal.toFixed = function (fractionDigits)
    {
        if (fractionDigits != undefined)
        {
            if (fractionDigits < 0)
                throw new Error('toFixed() argument must be greater than or equal to 0.');

            fractionDigits |= 0;
        }
        return this._toString(fractionDigits, 1);
    };

    _pDecimal.toExponential = function (fractionDigits)
    {
        if (fractionDigits != undefined)
        {
            if (fractionDigits < 0)
                throw new Error('toFixed() argument must be greater than or equal to 0.');

            fractionDigits |= 0;
        }
        return this._toString(fractionDigits, 2);
    };

    _pDecimal.toPrecision = function (precision)
    {
        if (precision != undefined)
        {
            if (precision < 1)
                throw new Error('toFixed() argument must be greater than 1.');

            precision |= 0;
        }
        return this._toString(precision);
    };

    _pDecimal.toLocaleString = function (locale)
    {
        return this._toString(undefined, 0, locale);
    };

    _pDecimal.toLocaleCurrencyString = function (locale)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var mon_decimal_point = locale_info.mon_decimal_point;
        var mon_thousands_sep = locale_info.mon_thousands_sep;
        //var int_currency_code = locale_info.int_curr_symbol;
        var currency_symbol = locale_info.currency_symbol.trim();
        var mon_grouping = locale_info.mon_grouping;
        var int_frac_digits = locale_info.int_frac_digits;
        var positive_sign = locale_info.positive_sign;
        var negative_sign = locale_info.negative_sign;
        var p_cs_precedes = locale_info.p_cs_precedes;
        var p_sep_by_space = locale_info.p_sep_by_space;
        var n_cs_precedes = locale_info.n_cs_precedes;
        var n_sep_by_space = locale_info.n_sep_by_space;
        var p_sign_position = locale_info.p_sign_posn;
        var n_sign_position = locale_info.n_sign_posn;
        var mon_n_sign_position = locale_info.mon_n_sign_posn;
        if (mon_n_sign_position != undefined)
            n_sign_position = mon_n_sign_position;

        var space_char = "\u0020";
        var isNegative = this.isNegative();

        var locale_string = this._getFormattedStringValue(this, mon_decimal_point, mon_thousands_sep, mon_grouping, int_frac_digits, true);

        //set positive/negative sign and currency symbol
        if (isNegative)
        {
            if (n_cs_precedes)
            {
                switch (n_sign_position)
                {
                    case 0:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0: case 2:
                                    {
                                        locale_string = "(" + currency_symbol + locale_string + ")";
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = "(" + currency_symbol + space_char + locale_string + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1: case 3:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = negative_sign + currency_symbol + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = negative_sign + currency_symbol + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = negative_sign + space_char + currency_symbol + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + locale_string + negative_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + space_char + locale_string + negative_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + locale_string + space_char + negative_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 4:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + negative_sign + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + negative_sign + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + space_char + negative_sign + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
            else
            {
                switch (n_sign_position)
                {
                    case 0:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = "(" + locale_string + currency_symbol + ")";
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = "(" + locale_string + space_char + currency_symbol + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = negative_sign + locale_string + currency_symbol;
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = negative_sign + locale_string + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2: case 4:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + currency_symbol + negative_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + currency_symbol + negative_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + currency_symbol + space_char + negative_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 3:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + negative_sign + currency_symbol;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + negative_sign + currency_symbol;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + negative_sign + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
        }
        else
        {
            if (p_cs_precedes)
            {
                switch (p_sign_position)
                {
                    case 0:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0: case 2:
                                    {
                                        locale_string = "(" + currency_symbol + locale_string + ")";
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = "(" + currency_symbol + space_char + locale_string + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1: case 3:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = positive_sign + currency_symbol + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = positive_sign + currency_symbol + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = positive_sign + space_char + currency_symbol + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + locale_string + positive_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + space_char + locale_string + positive_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + locale_string + space_char + positive_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 4:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + positive_sign + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + positive_sign + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + space_char + positive_sign + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
            else
            {
                switch (p_sign_position)
                {
                    case 0:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = "(" + locale_string + currency_symbol + ")";
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = "(" + locale_string + space_char + currency_symbol + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = positive_sign + locale_string + currency_symbol;
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = positive_sign + locale_string + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2: case 4:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + currency_symbol + positive_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + currency_symbol + positive_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + currency_symbol + space_char + positive_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 3:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + positive_sign + currency_symbol;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + positive_sign + currency_symbol;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + positive_sign + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        return locale_string;
    };

    _pDecimal.toFixedLocaleString = function (locale, fractionDigits)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var decimal_point = locale_info.decimal_point;
        var thousands_sep = locale_info.thousands_sep;
        var grouping = locale_info.grouping;
        var positive_sign = locale_info.positive_sign;
        var negative_sign = locale_info.negative_sign;
        var isNegative = this.isNegative();

        var locale_string = this._getFormattedStringValue(this, decimal_point, thousands_sep, grouping, fractionDigits, true);

        //set positive/negative sign
        if (isNegative)
        {
            locale_string = negative_sign + locale_string;
        }
        else
        {
            locale_string = positive_sign + locale_string;
        }

        return locale_string;
    };

    _pDecimal._getFormattedStringValue = function (value, decimal_point, thousands_sep, grouping, frac_digits, use_fraction_digits)
    {
        var hi = this.hi;
        var lo = this.lo;

        var value_string, exp_string;
        if (use_fraction_digits)
        {
            value_string = value.abs().toFixed(frac_digits).split(".");
        }
        else
        {
            var num_string = value.abs().toString().split(".");

            // exponent 체크
            var parse_strings = num_string.split('e');
            var base_string = parse_strings[0] || "";

            exp_string = parse_strings[1] || "";
            value_string = base_string.split(".");
        }

        // 1. 정수와 소수로 분리.
        var integer_string = value_string[0];
        var decimal_string = value_string[1];

        if (!decimal_string)
        {
            decimal_string = "";
        }

        var locale_string = "";
        var grouping_value;

        if (!decimal_point)
        {
            decimal_point = ".";
        }

        if (!thousands_sep)
        {
            thousands_sep = ",";
        }

        if (grouping && grouping.length > 0)
        {
            grouping_value = grouping[0];
        }

        if (grouping_value <= 0)
        {
            grouping_value = 3;
        }

        if (integer_string.length >= grouping_value && grouping_value > 0)
        {
            if (integer_string.length == grouping_value)
                locale_string = integer_string.substr(integer_string.length - grouping_value, grouping_value) + locale_string;
            else
                locale_string = thousands_sep + integer_string.substr(integer_string.length - grouping_value, grouping_value) + locale_string;
            integer_string = integer_string.slice(0, integer_string.length - grouping_value);
        }

        // apply thousand separator 
        if (grouping.length > 1)
        {
            grouping_value = grouping[1];
        }

        if (grouping_value <= 0)
        {
            grouping_value = 3;
        }

        if (grouping_value > 0)
        {
            while (integer_string.length > grouping_value)
            {
                locale_string = thousands_sep + integer_string.substr(integer_string.length - grouping_value, grouping_value) + locale_string;
                integer_string = integer_string.slice(0, integer_string.length - grouping_value);
            }
        }

        locale_string = integer_string + locale_string;

        // set decimal point
        if (use_fraction_digits)
        {
            var i = decimal_string.length;
            var fraction_string = "";
            while (i < frac_digits)
            {
                fraction_string = fraction_string + "0";
                i++;
            }

            decimal_string = decimal_string + fraction_string;
            decimal_string = decimal_string.slice(0, frac_digits);
        }

        if (decimal_string)
        {
            locale_string = locale_string + decimal_point + decimal_string;
        }

        if (exp_string)
        {
            locale_string += `e${exp_string}`;
        }

        this.hi = hi;
        this.lo = lo;
        return locale_string;
    };

    _pDecimal.clone = function ()
    {
        var obj = new nexacro.Decimal();
        obj.hi = this.hi;
        obj.lo = this.lo;

        return obj;
    };

    nexacro.Decimal.MAX_VALUE = new nexacro.Decimal(1.79769313486231570815e+308, 9.97920154767359795037e+291);
    nexacro.Decimal.E = new nexacro.Decimal(2.718281828459045091e+00, 1.445646891729250158e-16); /* E */
    nexacro.Decimal.LOG2E = new nexacro.Decimal(6.931471805599452862e-01, 2.319046813846299558e-17); /* log2e */
    nexacro.Decimal.LOG10E = new nexacro.Decimal(2.302585092994045901e+00, -2.170756223382249351e-16); /* log10e */

    _pDecimal = null;
}

if (!nexacro.Number)
{
    nexacro.Number = function (v)
    {
        this.value = new Number(v);
    };

    var _pNumber = nexacro._createPrototype(nexacro.Object, nexacro.Number);
    nexacro.Number.prototype = _pNumber;

    _pNumber.toString = function ()
    {
        return this.value.toString();
    };

    _pNumber.valueOf = function ()
    {
        return this.value;
    };

    _pNumber.isNegative = function ()
    {
        return this.value < 0;
    };

    _pNumber._getFormattedStringValue = function (value, decimal_point, thousands_sep, grouping, frac_digits, use_fraction_digits)
    {
        var value_string, exp_string;

        // exponent 체크 해서 지수로 표현되는 case에만 fixed로 string 처리
        var num_value = Math.abs(value);
        var num_string = num_value.toString();
        var parse_strings = num_string.split('e');

        var base_string;
        if (use_fraction_digits && parse_strings.length > 1)
        {
            base_string = num_value.toFixed(frac_digits);
        }
        else
        {
            base_string = parse_strings[0] || "";
            exp_string = parse_strings[1] || "";
        }

        value_string = base_string.split(".");

        //value_string = Math.abs(value).toString().split(".");

        // 1. 정수와 소수로 분리.
        var integer_string = value_string[0];
        var decimal_string = value_string[1];

        if (!decimal_string)
        {
            decimal_string = "";
        }

        var locale_string = "";
        var grouping_value;

        if (!decimal_point)
        {
            decimal_point = ".";
        }

        if (!thousands_sep)
        {
            thousands_sep = ",";
        }

        if (grouping && grouping.length > 0)
        {
            grouping_value = grouping[0];
        }

        if (grouping_value <= 0)
        {
            grouping_value = 3;
        }

        if (integer_string.length > grouping_value && grouping_value > 0)
        {
            locale_string = thousands_sep + integer_string.substr(integer_string.length - grouping_value, grouping_value) + locale_string;
            integer_string = integer_string.slice(0, integer_string.length - grouping_value);
        }

        // apply thousand separator 
        if (grouping.length > 1)
        {
            grouping_value = grouping[1];
        }

        if (grouping_value <= 0)
        {
            grouping_value = 3;
        }

        if (grouping_value > 0)
        {
            while (integer_string.length > grouping_value)
            {
                locale_string = thousands_sep + integer_string.substr(integer_string.length - grouping_value, grouping_value) + locale_string;
                integer_string = integer_string.slice(0, integer_string.length - grouping_value);
            }
        }

        locale_string = integer_string + locale_string;

        // set decimal point
        if (use_fraction_digits)
        {
            var i = decimal_string.length;
            var fraction_string = "";
            while (i < frac_digits)
            {
                fraction_string = fraction_string + "0";
                i++;
            }

            decimal_string = decimal_string + fraction_string;
            decimal_string = decimal_string.slice(0, frac_digits);
        }

        if (decimal_string)
        {
            locale_string = locale_string + decimal_point + decimal_string;
        }

        if (exp_string)
        {
            locale_string += `e${exp_string}`;
        }

        return locale_string;
    };

    _pNumber.toLocaleString = function (locale)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var decimal_point = locale_info.decimal_point;
        var thousands_sep = locale_info.thousands_sep;
        var grouping = locale_info.grouping;
        var positive_sign = locale_info.positive_sign;
        var negative_sign = locale_info.negative_sign;
        var isNegative = this.isNegative();

        var locale_string = this._getFormattedStringValue(this.value, decimal_point, thousands_sep, grouping, 3);

        // replace locale digits
        //locale_string = nexacro.Locale._replaceLocaleDigits(locale, locale_string);

        //set positive/negative sign
        if (isNegative)
        {
            locale_string = negative_sign + locale_string;
        }
        else
        {
            locale_string = positive_sign + locale_string;
        }

        return locale_string;
    };

    _pNumber.toLocaleCurrencyString = function (locale)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var mon_decimal_point = locale_info.mon_decimal_point;
        var mon_thousands_sep = locale_info.mon_thousands_sep;
        //var int_currency_code = locale_info.int_curr_symbol;
        var currency_symbol = locale_info.currency_symbol.trim();
        var mon_grouping = locale_info.mon_grouping;
        var int_frac_digits = locale_info.int_frac_digits;
        var positive_sign = locale_info.positive_sign;
        var negative_sign = locale_info.negative_sign;
        var p_cs_precedes = locale_info.p_cs_precedes;
        var p_sep_by_space = locale_info.p_sep_by_space;
        var n_cs_precedes = locale_info.n_cs_precedes;
        var n_sep_by_space = locale_info.n_sep_by_space;
        var p_sign_position = locale_info.p_sign_posn;
        var n_sign_position = locale_info.n_sign_posn;
        var mon_n_sign_position = locale_info.mon_n_sign_posn;
        if (mon_n_sign_position != undefined)
            n_sign_position = mon_n_sign_position;

        var space_char = "\u0020";
        var isNegative = this.isNegative();

        var locale_string = this._getFormattedStringValue(this.value, mon_decimal_point, mon_thousands_sep, mon_grouping, int_frac_digits, true);

        //set positive/negative sign and currency symbol
        if (isNegative)
        {
            if (n_cs_precedes)
            {
                switch (n_sign_position)
                {
                    case 0:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0: case 2:
                                    {
                                        locale_string = "(" + currency_symbol + locale_string + ")";
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = "(" + currency_symbol + space_char + locale_string + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1: case 3:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = negative_sign + currency_symbol + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = negative_sign + currency_symbol + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = negative_sign + space_char + currency_symbol + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + locale_string + negative_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + space_char + locale_string + negative_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + locale_string + space_char + negative_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 4:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + negative_sign + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + negative_sign + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + space_char + negative_sign + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
            else
            {
                switch (n_sign_position)
                {
                    case 0:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = "(" + locale_string + currency_symbol + ")";
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = "(" + locale_string + space_char + currency_symbol + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = negative_sign + locale_string + currency_symbol;
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = negative_sign + locale_string + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2: case 4:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + currency_symbol + negative_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + currency_symbol + negative_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + currency_symbol + space_char + negative_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 3:
                        {
                            switch (n_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + negative_sign + currency_symbol;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + negative_sign + currency_symbol;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + negative_sign + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;

                }
            }
        }
        else
        {
            if (p_cs_precedes)
            {
                switch (p_sign_position)
                {
                    case 0:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0: case 2:
                                    {
                                        locale_string = "(" + currency_symbol + locale_string + ")";
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = "(" + currency_symbol + space_char + locale_string + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1: case 3:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = positive_sign + currency_symbol + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = positive_sign + currency_symbol + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = positive_sign + space_char + currency_symbol + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + locale_string + positive_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + space_char + locale_string + positive_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + locale_string + space_char + positive_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 4:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = currency_symbol + positive_sign + locale_string;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = currency_symbol + positive_sign + space_char + locale_string;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = currency_symbol + space_char + positive_sign + locale_string;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
            else
            {
                switch (p_sign_position)
                {
                    case 0:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = "(" + locale_string + currency_symbol + ")";
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = "(" + locale_string + space_char + currency_symbol + ")";
                                    }
                                    break;
                            }
                        }
                        break;
                    case 1:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = positive_sign + locale_string + currency_symbol;
                                    }
                                    break;
                                case 1: case 2:
                                    {
                                        locale_string = positive_sign + locale_string + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 2: case 4:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + currency_symbol + positive_sign;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + currency_symbol + positive_sign;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + currency_symbol + space_char + positive_sign;
                                    }
                                    break;
                            }
                        }
                        break;
                    case 3:
                        {
                            switch (p_sep_by_space)
                            {
                                case 0:
                                    {
                                        locale_string = locale_string + positive_sign + currency_symbol;
                                    }
                                    break;
                                case 1:
                                    {
                                        locale_string = locale_string + space_char + positive_sign + currency_symbol;
                                    }
                                    break;
                                case 2:
                                    {
                                        locale_string = locale_string + positive_sign + space_char + currency_symbol;
                                    }
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        return locale_string;
    };

    _pNumber.toFixed = function (fractionDigits)
    {
        var decimal_point = ".";
        var thousands_sep = ",";
        var grouping = 0;
        var positive_sign = "";
        var negative_sign = "-";
        var isNegative = this.isNegative();

        var locale_string = this._getFormattedStringValue(this.value, decimal_point, thousands_sep, grouping, fractionDigits, true);

        //set positive/negative sign
        if (isNegative)
        {
            locale_string = negative_sign + locale_string;
        }
        else
        {
            locale_string = positive_sign + locale_string;
        }

        return locale_string;
    };

    _pNumber.toFixedLocaleString = function (locale, fractionDigits)
    {
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        var decimal_point = locale_info.decimal_point;
        var thousands_sep = locale_info.thousands_sep;
        var grouping = locale_info.grouping;
        var positive_sign = locale_info.positive_sign;
        var negative_sign = locale_info.negative_sign;
        var isNegative = this.isNegative();

        var locale_string = this._getFormattedStringValue(this.value, decimal_point, thousands_sep, grouping, fractionDigits, true);

        //set positive/negative sign
        if (isNegative)
        {
            locale_string = negative_sign + locale_string;
        }
        else
        {
            locale_string = positive_sign + locale_string;
        }

        return locale_string;
    };

    _pNumber.toPrecision = function (/*precision*/)
    {
    };

    _pNumber.toExponential = function ()
    {
    };

    _pNumber = null;
}

//==============================================================================
// nexacro Style Object Data
//==============================================================================
if (!nexacro.BindableValue)
{
    nexacro.BindableValue = function (def)
    {
        this._bindtype = 0;
        this._default = def;
        this._value = def;
    };
    var _pBindableValue = nexacro._createPrototype(nexacro.Object, nexacro.BindableValue);
    nexacro.BindableValue.prototype = _pBindableValue;
    _pBindableValue._type_name = "BindableValue";

    // override for value
    _pBindableValue.valueOf = function ()
    {
        return this._value;
    };
    _pBindableValue.toString = function ()
    {
        return this._value + "";
    };
    _pBindableValue._setBindExpr = function (v)
    {
        var str = v.toString().trim();

        this._bindtype = 0;

        var reg_exps = /BIND\s*\(/i;
        var tag = reg_exps.exec(str);

        if (tag && tag.index == 0)
        {
            this._bindtype = 1;
            str = str.replace(/BIND\s*\(\s*/i, "BIND:");
            str = str.substr(0, str.length - 1);
        }
        else
        {
            reg_exps = /BIND\s*:/i;
            tag = reg_exps.exec(str);

            if (tag && tag.index == 0)
            {
                this._bindtype = 1;
                str = str.replace(/BIND\s*\:\s*/i, "BIND:");
            }
        }

        if (!tag)
        {
            reg_exps = /EXPR\s*\(/i;
            tag = reg_exps.exec(str);

            if (tag && tag.index == 0)
            {
                this._bindtype = 2;
                str = str.replace(/EXPR\s*\(\s*/i, "EXPR:");
                str = str.substr(0, str.length - 1);
            }
            else
            {
                reg_exps = /EXPR\s*:/i;
                tag = reg_exps.exec(str);

                if (tag && tag.index == 0)
                {
                    this._bindtype = 2;
                    str = str.replace(/EXPR\s*\:\s*/i, "EXPR:");
                }
            }
        }

        if (tag)
        {
            str = str.trim();
            this._bindexpr = str.substr(5);
            this._value = v;

            return true;
        }

        return false;
    };

    _pBindableValue._set = function (v)
    {
        if (v != this._value)
        {
            if (v === null || v === undefined || v === "")
            {
                //              this._value = this._default;    setting 값을 유지하도록 함.
                this._value = v;
                this._bindtype = 0;
            }
            else
            {
                if (this._setBindExpr(v) == false)
                {
                    this._value = v;
                }
            }
        }
    };
    _pBindableValue._set_intval = function (v)
    {
        if (v != this._value)
        {
            if (v === null || v === undefined || v === "")
            {
                //              this._value = this._default;    setting 값을 유지하도록 함.
                this._value = v;
                this._bindtype = 0;
            }
            else
            {
                if (this._setBindExpr(v) == false)
                {
                    this._value = (v | 0);
                }
            }
        }
    };

    _pBindableValue._set_enumval = function (v, enumvals)
    {
        if (v != this._value)
        {
            if (v === null || v === undefined || v === "")
            {
                this._value = this._default;
                this._bindtype = 0;
            }
            else
            {
                if (this._setBindExpr(v) == false)
                {
                    var len = enumvals.length;
                    for (var i = 0; i < len; i++)
                    {
                        if (v == enumvals[i])
                        {
                            this._value = v;
                            return;
                        }
                    }
                    this._value = this._default;
                }
            }
        }
    };
}


if (!nexacro.Image)
{
    nexacro.Image = function (target)
    {
        if (target)
        {
            this._target = target;
        }

        this._event_list = {
            "onload": 1, "onerror": 1
        };
    };

    var _pImageObject = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Image);
    nexacro.Image.prototype = _pImageObject;
    _pImageObject._type_name = "Image";

    _pImageObject._p_height = 0;
    _pImageObject._p_width = 0;
    _pImageObject._p_src = "";
    _pImageObject._base64str = "";
    _pImageObject.handle = null;

    _pImageObject.setBase64String = function (v)
    {
        if (typeof v != "string")
        {
            return;
        }
        if (v === "")
        {
            this._base64str = v;
        }
        else
        {
            var format = nexacro._transImageBase64StringFormat(v, true);// header 검사 처리만 추가 
            if (format)
            {
                this._base64str = format.alldata;
            }
        }

    };

    _pImageObject.getBase64String = function (onlydata)
    {
        var base64str = this._base64str;
        if (onlydata && base64str && base64str.substr(0, 4) == "data")
        {
            return base64str.split(",")[1];
        }
        return base64str;
    };

    _pImageObject.set_src = function (v)
    {
        if (this._p_src != v)
        {
            this._p_src = v;
            this.handle = nexacro._getImageObject(v, this.on_load, this); //, this.on_loading, this); //, this.on_loading, this);
        }
    };

    //html5 : width, height 가 정상(>=0)일때는 handle 이 node 
    //        width, height 가 비정상(<0)일때는 handle 이 null  errstatus
    //runtime : width, height 가 정상(>=0)일때는 handle 이 없음
    //        width, height 가 비정상(<0)일때는 handle 이 errstatus
    _pImageObject.on_load = function (imageurl, width, height, handle, errstatus, fireerrorcode, returncode, locationurl)
    {
        this._p_width = width;
        this._p_height = height;

        if (errstatus && errstatus < 0)
        {
            var errormsg;
            if (fireerrorcode)
                errormsg = nexacro._GetSystemErrorMsg(this, fireerrorcode);

            this.on_fire_onerror(this, fireerrorcode, errormsg, returncode, imageurl, locationurl);
        }
        else
        {
            if (handle)
                this.handle = handle;
            this.on_fire_onload(this, imageurl);
        }
    };

    _pImageObject.on_fire_onload = function (obj, url)
    {
        if (this.onload && this.onload._has_handlers)
        {
            var evt = new nexacro.LoadEventInfo(obj, "onload", url);
            this.onload._fireEvent(obj, evt);
        }
    };

    _pImageObject.on_fire_onerror = function (obj, errorcode, errormsg, statuscode, requesturi, locationuri)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.ErrorEventInfo(obj, "onerror", errorcode, errormsg, this, statuscode, requesturi, locationuri);
            this.onerror._fireEvent(this, evt);
        }
    };

    _pImageObject._properties = [{ name: "width", readonly: true }, { name: "height", readonly: true }, { name: "src" }];
    nexacro._defineProperties(_pImageObject, _pImageObject._properties);

    _pImageObject = null;
}

if (!nexacro._HotKey)
{
    nexacro._HotKey = function (value)
    {
        this._load(value);
    };

    var __pHotKey = nexacro._createPrototype(nexacro.Object, nexacro._HotKey);
    nexacro._HotKey.prototype = __pHotKey;

    __pHotKey._modifierkey = 0;  // CTRL,ALT,SHIFT
    __pHotKey._keycode = 0;      // A,B,C,D, ...
    __pHotKey._is_registered = false;

    __pHotKey._type_name = "HotKey";

    // TODO OEM Key등 웹 환경에서 사용할수 없는 키 제거 
    __pHotKey._keytable = {
        //         "CANCEL": 0x03,
        "BACK": 0x08,
        "TAB": 0x09,
        //         "CLEAR": 0x0c,
        "RETURN": 0x0d,
        "PAUSE": 0x13,
        "CAPITAL": 0x14, // CapsLock
        //         "KANA": 0x15,
        //         "HANGEUL": 0x15,
        //         "HANGUL": 0x15,
        //         "JUNJA": 0x17,
        //         "FINAL": 0x18,
        //         "HANJA": 0x19,
        //         "KANJI": 0x19,
        "ESCAPE": 0x1b,
        //         "CONVERT": 0x1c,
        //         "NONCONVERT": 0x1d,
        //         "ACCEPT": 0x1e,
        //         "MODECHANGE": 0x1f,
        "SPACE": 0x20,
        "PRIOR": 0x21, // PageUp
        "NEXT": 0x22, // PageDown
        "END": 0x23,
        "HOME": 0x24,
        "LEFT": 0x25,
        "UP": 0x26,
        "RIGHT": 0x27,
        "DOWN": 0x28,
        //         "SELECT": 0x29,
        //         "PRINT": 0x2a,
        //         "EXECUTE": 0x2b,
        //         "SNAPSHOT": 0x2c,
        "INSERT": 0x2d,
        "DELETE": 0x2e,
        //         "HELP": 0x2f,
        "NUMPAD0": 0x60,
        "NUMPAD1": 0x61,
        "NUMPAD2": 0x62,
        "NUMPAD3": 0x63,
        "NUMPAD4": 0x64,
        "NUMPAD5": 0x65,
        "NUMPAD6": 0x66,
        "NUMPAD7": 0x67,
        "NUMPAD8": 0x68,
        "NUMPAD9": 0x69,
        "MULTIPLY": 0x6a,
        "ADD": 0x6b,
        "SEPARATOR": 0x6c,
        "SUBTRACT": 0x6d,
        "DECIMAL": 0x6e,
        "DIVIDE": 0x6f,
        "F1": 0x70,
        "F2": 0x71,
        "F3": 0x72,
        "F4": 0x73,
        "F5": 0x74,
        "F6": 0x75,
        "F7": 0x76,
        "F8": 0x77,
        "F9": 0x78,
        "F10": 0x79,
        "F11": 0x7a,
        "F12": 0x7b,
        //         "F13": 0x7c,
        //         "F14": 0x7d,
        //         "F15": 0x7e,
        //         "F16": 0x7f,
        //         "F17": 0x80,
        //         "F18": 0x81,
        //         "F19": 0x82,
        //         "F20": 0x83,
        //         "F21": 0x84,
        //         "F22": 0x85,
        //         "F23": 0x86,
        //         "F24": 0x87,
        "NUMLOCK": 0x90,
        "SCROLL": 0x91
        //         "OEM_NEC_EQUAL": 0x92,
        //         "OEM_FJ_JISHO": 0x92,
        //         "OEM_FJ_MASSHOU": 0x93,
        //         "OEM_FJ_TOUROKU": 0x94,
        //         "OEM_FJ_LOYA": 0x95,
        //         "OEM_FJ_ROYA": 0x96,
        //         "OEM_1": 0xba,
        //         "OEM_PLUS": 0xbb,
        //         "OEM_COMMA": 0xbc,
        //         "OEM_MINUS": 0xbd,
        //         "OEM_PERIOD": 0xbe,
        //         "OEM_2": 0xbf,
        //         "OEM_3": 0xc0,
        //         "OEM_4": 0xdb,
        //         "OEM_5": 0xdc,
        //         "OEM_6": 0xdd,
        //         "OEM_7": 0xde,
        //         "OEM_8": 0xdf,
        //         "OEM_AX": 0xe1,
        //         "OEM_102": 0xe2,
        //         "ICO_HELP": 0xe3,
        //         "ICO_00": 0xe4,
        //         "ICO_CLEAR": 0xe6,
        //         "OEM_RESET": 0xe9,
        //         "OEM_JUMP": 0xea,
        //         "OEM_PA1": 0xeb,
        //         "OEM_PA2": 0xec,
        //         "OEM_PA3": 0xed,
        //         "OEM_WSCTRL": 0xee,
        //         "OEM_CUSEL": 0xef,
        //         "OEM_ATTN": 0xf0,
        //         "OEM_FINISH": 0xf1,
        //         "OEM_COPY": 0xf2,
        //         "OEM_AUTO": 0xf3,
        //         "OEM_ENLW": 0xf4,
        //         "OEM_BACKTAB": 0xf5,
        //         "ATTN": 0xf6,
        //         "CRSEL": 0xf7,
        //         "EXSEL": 0xf8,
        //         "EREOF": 0xf9,
        //         "PLAY": 0xfa,
        //         "NONAME": 0xfc,
        //         "PA1": 0xfd,
        //         "OEM_CLEAR": 0xfe
    };

    __pHotKey._clear = function ()
    {
        this._modifierkey = 0;
        this._keycode = 0;
    };
    __pHotKey._load = function (value)
    {
        this._clear();
        if (value)
        {
            var ar = value.split("+");
            for (var i = 0; i < ar.length - 1; i++)
            {
                var token = ar[i].toUpperCase().trim();
                if (token == "CTRL" || token == "CONTROL")
                    this._modifierkey += 0x01;
                if (token == "ALT")
                    this._modifierkey += 0x02;
                if (token == "SHIFT")
                    this._modifierkey += 0x04;
            }
            var keycode_str = ar[ar.length - 1].toUpperCase().trim();
            var keycode = this._convToKeyCode(keycode_str);
            if (keycode < 0)
            {
                this._clear();
                return;
            }

            this._keycode = keycode;
        }
    };
    __pHotKey._isEmpty = function ()
    {
        if (this._keycode === 0)
            return true;
        return false;
    };
    __pHotKey._convToKeyCode = function (value)
    {
        var ret = -1;
        if (!value)
            return ret;

        // 문자열을 KeyCode값으로 변환 ex: "1" --> 49
        if (value.length == 1)
        {
            if ((value >= 'A' && value <= 'Z') || (value >= '0' && value <= '9'))
            {
                ret = value.charCodeAt(0);
            }
            else if (value >= 'a' && value <= 'z')
            {
                ret = value.toUpperCase().charCodeAt(0);
            }
        }
        else
        {
            if (this._keytable[value])
                ret = this._keytable[value];
        }

        return ret;
    };
    __pHotKey._convToKeyString = function (value)
    {
        var ret = -1;
        if (!value)
            return ret;

        // KeyCode값을 문자열로 변환 ex: 49 --> "1"
        if ((value >= 65 && value <= 90) || (value >= 48 && value <= 57))
        {
            ret = String.fromCharCode(value);
        }
        else
        {
            for (var keystr in this._keytable)
            {
                if (value == this._keytable[keystr])
                {
                    ret = keystr;
                    break;
                }
            }
        }

        return ret;

    };
    __pHotKey._toString = function ()
    {

        var ret = "";
        if ((this._modifierkey & 0x01) == 0x01)
        {
            ret += "CTRL";
        }
        if ((this._modifierkey & 0x02) == 0x02)
        {
            if (ret.length !== 0) ret += "+";
            ret += "ALT";
        }
        if ((this._modifierkey & 0x04) == 0x04)
        {
            if (ret.length !== 0) ret += "+";
            ret += "SHIFT";
        }
        if (ret.length !== 0) ret += "+";
        ret += this._convToKeyString(this._keycode);

        return ret;
    };

    __pHotKey = null;
}
