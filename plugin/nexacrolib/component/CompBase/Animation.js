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

/** 
 * http://animejs.com
 * JavaScript animation engine
 * @version v2.0.2
 * @author Julian Garnier
 * @copyright ©2017 Julian Garnier
 * Released under the MIT license
**/
if (!nexacro.Animation)
{
    "use strict";

    var _process = true;
    var pThis = this ? this : globalThis;
    (function (root, factory)
    {
        if (typeof define === 'function' && define.amd)
        {
            // AMD. Register as an anonymous module.
            define([], factory);
        }
        else if (typeof module === 'object' && module.exports)
        {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like environments that support module.exports,
            // like Node.
            module.exports = factory();
        }
        else
        {
            // Browser globals (root is window)
            root.anime = factory();
        }
    }(pThis, function ()
    {
        // Defaults
        var defaultInstanceSettings =
        {
            update: undefined,
            begin: undefined,
            run: undefined,
            complete: undefined,
            loop: 1,
            direction: 'normal',
            autoplay: false,
            offset: 0
        };

        var defaultTweenSettings =
        {
            duration: 1000,
            delay: 0,
            easing: 'easeOutElastic',
            elasticity: 500,
            round: 0
        };

        var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];
        var transformString;

        // Utils
        function stringContains(str, text)
        {
            return str.indexOf(text) > -1;
        }

        /*!
         * Cross-Browser Split 1.1.1
         * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
         * Available under the MIT License
         * ECMAScript compliant, uniform cross-browser split method
         */

        /**
         * Splits a string into an array of strings using a regex or string separator. Matches of the
         * separator are not included in the result array. However, if `separator` is a regex that contains
         * capturing groups, backreferences are spliced into the result each time `separator` is matched.
         * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
         * cross-browser.
         * @param {String} str String to split.
         * @param {RegExp|String} separator Regex or string to use for separating the string.
         * @param {Number} [limit] Maximum number of items to include in the result array.
         * @returns {Array} Array of substrings.
         * @example
         *
         * // Basic use
         * split('a b c d', ' ');
         * // -> ['a', 'b', 'c', 'd']
         *
         * // With limit
         * split('a b c d', ' ', 2);
         * // -> ['a', 'b']
         *
         * // Backreferences in result array
         * split('..word1 word2..', /([a-z]+)(\d+)/i);
         * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
         */
        var crossBrowserSplit;

        // Avoid running twice; that would break the `nativeSplit` reference
        crossBrowserSplit = function (undef)
        {

            var nativeSplit = String.prototype.split,
                compliantExecNpcg = /()??/.exec("")[1] === undef, // NPCG: nonparticipating capturing group
                self;

            self = function (str, separator, limit)
            {
                // If `separator` is not a regex, use `nativeSplit`
                if (Object.prototype.toString.call(separator) !== "[object RegExp]")
                {
                    return nativeSplit.call(str, separator, limit);
                }
                var output = [],
                    flags = (separator.ignoreCase ? "i" : "") +
                        (separator.multiline ? "m" : "") +
                        (separator.extended ? "x" : "") + // Proposed for ES6
                        (separator.sticky ? "y" : ""), // Firefox 3+
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy					
                    separator2, match, lastIndex, lastLength;
                separator = new RegExp(separator.source, flags + "g");
                str += ""; // Type-convert
                if (!compliantExecNpcg)
                {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // Math.pow(2, 32) - 1
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                limit = limit === undef ?
                    -1 >>> 0 : // Math.pow(2, 32) - 1
                    limit >>> 0; // ToUint32(limit)
                while (match = separator.exec(str))
                {
                    // `separator.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex)
                    {
                        output.push(str.slice(lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1)
                        {
                            match[0].replace(separator2, function ()
                            {
                                for (var i = 1; i < arguments.length - 2; i++)
                                {
                                    if (arguments[i] === undef)
                                    {
                                        match[i] = undef;
                                    }
                                }
                            });
                        }
                        if (match.length > 1 && match.index < str.length)
                        {
                            Array.prototype.push.apply(output, match.slice(1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= limit)
                        {
                            break;
                        }
                    }
                    if (separator.lastIndex === match.index)
                    {
                        separator.lastIndex++; // Avoid an infinite loop
                    }
                }
                if (lastLastIndex === str.length)
                {
                    if (lastLength || !separator.test(""))
                    {
                        output.push("");
                    }
                }
                else
                {
                    output.push(str.slice(lastLastIndex));
                }
                return output.length > limit ? output.slice(0, limit) : output;
            };

            // For convenience
            //String.prototype.split = function (separator, limit) {
            //    return self(this, separator, limit);
            //};

            return self;
        }();

        var is = {
            arr: function (a) { return nexacro._isArray(a); },
            obj: function (a) { return stringContains(Object.prototype.toString.call(a), 'Object'); },
            //svg: function(a) { return a instanceof SVGElement; },
            dom: function (a) { return a.nodeType; },
            str: function (a) { return typeof a === 'string'; },
            fnc: function (a) { return typeof a === 'function'; },
            und: function (a) { return typeof a === 'undefined'; },
            hex: function (a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a); },
            rgb: function (a) { return /^rgb/.test(a); },
            hsl: function (a) { return /^hsl/.test(a); },
            col: function (a) { return (is.hex(a) || is.rgb(a) || is.hsl(a) || nexacro._xreNamedColorList.hasOwnProperty(a)); }
        };

        // BezierEasing https://github.com/gre/bezier-easing
        var bezier = function ()
        {
            var kSplineTableSize = 11;
            var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

            function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
            function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
            function C(aA1) { return 3.0 * aA1; }

            function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
            function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

            function binarySubdivide(aX, aA, aB, mX1, mX2)
            {
                var currentX, currentT, i = 0;
                do
                {
                    currentT = aA + (aB - aA) / 2.0;
                    currentX = calcBezier(currentT, mX1, mX2) - aX;
                    if (currentX > 0.0) { aB = currentT; }
                    else { aA = currentT; }
                } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
                return currentT;
            }

            function newtonRaphsonIterate(aX, aGuessT, mX1, mX2)
            {
                for (var i = 0; i < 4; ++i)
                {
                    var currentSlope = getSlope(aGuessT, mX1, mX2);
                    if (currentSlope === 0.0) return aGuessT;
                    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                    aGuessT -= currentX / currentSlope;
                }
                return aGuessT;
            }

            function _bezier(mX1, mY1, mX2, mY2)
            {
                if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return;
                var sampleValues = new Array(kSplineTableSize);

                if (mX1 !== mY1 || mX2 !== mY2)
                {
                    for (var i = 0; i < kSplineTableSize; ++i)
                    {
                        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
                    }
                }

                function getTForX(aX)
                {
                    var intervalStart = 0.0;
                    var currentSample = 1;
                    var lastSample = kSplineTableSize - 1;

                    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample)
                    {
                        intervalStart += kSampleStepSize;
                    }
                    --currentSample;

                    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
                    var guessForT = intervalStart + dist * kSampleStepSize;
                    var initialSlope = getSlope(guessForT, mX1, mX2);

                    if (initialSlope >= 0.001)
                    {
                        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
                    }
                    else if (initialSlope === 0.0)
                    {
                        return guessForT;
                    }
                    else
                    {
                        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
                    }
                }

                return function (x)
                {
                    if (mX1 === mY1 && mX2 === mY2) return x;
                    if (x === 0) return 0;
                    if (x === 1) return 1;
                    return calcBezier(getTForX(x), mY1, mY2);
                };
            }
            return _bezier;
        }(); // bezier

        var easings = function ()
        {
            var names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ', 'Back', 'Elastic', 'Bounce'];

            // Elastic easing adapted from jQueryUI http://api.jqueryui.com/easings/
            function elastic(t, p)
            {
                return t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2.0) * Math.asin(1))) * (Math.PI * 2)) / p);
            }

            function bounce(t)
            {
                if (t < (1 / 2.75))
                {
                    return (7.5625 * t * t);
                }
                else if (t < (2 / 2.75))
                {
                    t -= (1.5 / 2.75);
                    return (7.5625 * (t) * t + 0.75);
                }
                else if (t < (2.5 / 2.75))
                {
                    t -= (2.25 / 2.75);
                    return (7.5625 * (t) * t + .9375);
                }
                else
                {
                    t -= (2.625 / 2.75);
                    return (7.5625 * (t) * t + .984375);
                }
            }

            // Approximated Penner equations http://matthewlein.com/ceaser/
            var equations =
            {
                In: [
                    [0.550, 0.085, 0.680, 0.530], /* InQuad */
                    [0.550, 0.055, 0.675, 0.190], /* InCubic */
                    [0.895, 0.030, 0.685, 0.220], /* InQuart */
                    [0.755, 0.050, 0.855, 0.060], /* InQuint */
                    [0.470, 0.000, 0.745, 0.715], /* InSine */
                    [0.950, 0.050, 0.795, 0.035], /* InExpo */
                    [0.600, 0.040, 0.980, 0.335], /* InCirc */
                    [0.600, -0.280, 0.735, 0.045], /* InBack */
                    elastic, /* InElastic */
                    function (t) { return 1 - bounce(1 - t); } /* InBounce */
                ], Out: [
                    [0.250, 0.460, 0.450, 0.940], /* OutQuad */
                    [0.215, 0.610, 0.355, 1.000], /* OutCubic */
                    [0.165, 0.840, 0.440, 1.000], /* OutQuart */
                    [0.230, 1.000, 0.320, 1.000], /* OutQuint */
                    [0.390, 0.575, 0.565, 1.000], /* OutSine */
                    [0.190, 1.000, 0.220, 1.000], /* OutExpo */
                    [0.075, 0.820, 0.165, 1.000], /* OutCirc */
                    [0.175, 0.885, 0.320, 1.275], /* OutBack */
                    function (t, f) { return 1 - elastic(1 - t, f); }, /* OutElastic */
                    bounce /* OutBounce */
                ], InOut: [
                    [0.455, 0.030, 0.515, 0.955], /* InOutQuad */
                    [0.645, 0.045, 0.355, 1.000], /* InOutCubic */
                    [0.770, 0.000, 0.175, 1.000], /* InOutQuart */
                    [0.860, 0.000, 0.070, 1.000], /* InOutQuint */
                    [0.445, 0.050, 0.550, 0.950], /* InOutSine */
                    [1.000, 0.000, 0.000, 1.000], /* InOutExpo */
                    [0.785, 0.135, 0.150, 0.860], /* InOutCirc */
                    [0.680, -0.550, 0.265, 1.550], /* InOutBack */
                    function (t, f) { return t < .5 ? elastic(t * 2, f) / 2 : 1 - elastic(t * -2 + 2, f) / 2; }, /* InOutElastic */
                    function (t) { return t < .5 ? (1 - bounce(1 - (t * 2))) * 0.5 : bounce(t * 2 - 1) * 0.5 + 0.5; } /* InOutBounce */
                ]
            };

            var functions =
            {
                linear: bezier(0.250, 0.250, 0.750, 0.750)
            };

            var that = this;

            for (var type in equations)
            {
                if (equations.hasOwnProperty(type))
                {
                    for (var i = 0; i < equations[type].length; i++)
                    {
                        var f = equations[type][i];
                        functions[('ease' + type + names[i]).toLowerCase()] = is.fnc(f) ? f : bezier.apply(that, f);
                    }
                }
            }
            return functions;
        }(); //easings

        // Strings
        function stringToHyphens(str)
        {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }

        function selectString(str)
        {
            if (is.col(str)) return;
            try
            {
                // 필요하면 수정
                //var nodes = document.querySelectorAll(str);
                //return nodes;
            }
            catch (e)
            {
                return;
            }
        }

        // Arrays
        function arrayLength(arr)
        {
            return arr.length;
        }

        function filterArray(arr, callback)
        {
            var len = arr.length;
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            var result = [];
            for (var i = 0; i < len; i++)
            {
                if (i in arr)
                {
                    var val = arr[i];
                    if (callback.call(thisArg, val, i, arr))
                    {
                        result.push(val);
                    }
                }
            }
            return result;
        }

        function flattenArray(arr)
        {
            return arr.reduce(function (a, b) { return a.concat(is.arr(b) ? flattenArray(b) : b); }, []);
        }

        function toArray(o)
        {
            if (is.arr(o)) return o;
            //if (is.str(o)) o = o; //selectString(o) || o; // 현재 selectString메소드에 리턴되는것이 없어 주석처리
            // 필요하면 수정
            //if (o instanceof NodeList || o instanceof HTMLCollection) return [].slice.call(o);
            return [o];
        }

        function arrayContains(arr, val)
        {
            return arr.some(function (a) { return a === val; });
        }

        // Objects
        function objectHas(obj, prop)
        {
            return obj.hasOwnProperty(prop);
        }

        function cloneObject(o)
        {
            var clone = {};
            for (var p in o) clone[p] = o[p];
            return clone;
        }

        function replaceObjectProps(o1, o2)
        {
            var o = cloneObject(o1);
            for (var p in o1) o[p] = objectHas(o2, p) ? o2[p] : o1[p];
            return o;
        }

        function mergeObjects(o1, o2)
        {
            var o = cloneObject(o1);
            for (var p in o2) o[p] = is.und(o1[p]) ? o2[p] : o1[p];
            return o;
        }

        // Colors

        function rgbToRgba(rgbValue)
        {
            var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
            return rgb ? 'rgba(' + rgb[1] + ',1)' : rgbValue;
        }

        function hexToRgba(hexValue)
        {
            var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            var hex = hexValue.replace(rgx, function (m, r, g, b) { return r + r + g + g + b + b; });
            var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            var r = parseInt(rgb[1], 16);
            var g = parseInt(rgb[2], 16);
            var b = parseInt(rgb[3], 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',1)';
        }

        function hslToRgba(hslValue)
        {
            var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
            var h = parseInt(hsl[1]) / 360;
            var s = parseInt(hsl[2]) / 100;
            var l = parseInt(hsl[3]) / 100;
            var a = hsl[4] || 1;
            function hue2rgb(p, q, t)
            {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var r, g, b;
            if (s == 0)
            {
                r = g = b = l;
            }
            else
            {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return 'rgba(' + (r * 255) + ',' + (g * 255) + ',' + (b * 255) + ',' + a + ')';
        }

        function isNamedColor(val)
        {
            return nexacro._xreNamedColorList.hasOwnProperty(val);
        }

        function colorToRgb(val)
        {
            if (is.rgb(val)) return rgbToRgba(val);
            if (is.hex(val)) return hexToRgba(val);
            if (is.hsl(val)) return hslToRgba(val);
            if (isNamedColor(val)) return hexToRgba(nexacro._xreNamedColorList[val] || '#000000');
        }

        // Units
        function getUnit(val)
        {
            if (val.toString().split(' ').length > 1) return;

            var split = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg|rad|turn)?/.exec(val);
            if (split) return split[2];
        }

        function getTransformUnit(propName)
        {
            if (stringContains(propName, 'translate')) return 'px';
            if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) return 'deg';
        }

        // Values
        function parseFloatValue(val)
        {
            return parseFloat(val);
        }

        function minMaxValue(val, min, max)
        {
            return Math.min(Math.max(val, min), max);
        }

        function getFunctionValue(val, animatable)
        {
            if (!is.fnc(val)) return val;
            return val(animatable.target, animatable.id, animatable.total);
        }

        function getCSSValue(el, prop)
        {
            if (prop in el.style)
            {
                return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0'; // 필요하면 수정
            }
        }

        function getAnimationType(el, prop)
        {
            if (is.dom(el) && arrayContains(validTransforms, prop)) return 'transform';
            if (is.dom(el) && (el.getAttribute(prop) || (is.svg(el) && el[prop]))) return 'attribute'; // 필요하면 수정
            if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) return 'css';
            if (el[prop] != null) return 'object';
        }

        function getTransformValue(el, propName)
        {
            var defaultUnit = getTransformUnit(propName);
            var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + defaultUnit;
            var str = el.style.transform;
            if (!str) return defaultVal;
            var match = [];
            var props = [];
            var values = [];
            var rgx = /(\w+)\((.+?)\)/g;
            while (match = rgx.exec(str))
            {
                props.push(match[1]);
                values.push(match[2]);
            }
            var value = values.filter(function (val, i) { return (props[i] === propName); });
            return arrayLength(value) ? value[0] : defaultVal;
        }

        function getOriginalTargetValue(target, propName)
        {
            switch (getAnimationType(target, propName))
            {
                case 'transform': return getTransformValue(target, propName);
                case 'css': return getCSSValue(target, propName); // 필요하면 수정
                case 'attribute': return target.getAttribute(propName);
            }
            return target[propName] || 0;
        }

        function getRelativeValue(to, from)
        {
            var operator = /^(\*=|\+=|-=)/.exec(to);
            if (!operator) return to;
            var x = parseFloatValue(from);
            var y = parseFloatValue(to.replace(operator[0], ''));
            switch (operator[0][0])
            {
                case '+': return x + y;
                case '-': return x - y;
                case '*': return x * y;
            }
        }

        function validateValue(val, unit)
        {
            var valSplit = val.toString().split(' ');
            var value = '';

            for (var i = 0; i < valSplit.length; i++)
            {
                if (is.col(valSplit[i]))
                {
                    value += colorToRgb(valSplit[i]);
                }
                else
                {
                    var originalUnit = getUnit(valSplit[i]);
                    var unitLess = originalUnit ? valSplit[i].substr(0, arrayLength(valSplit[i]) - arrayLength(originalUnit)) : valSplit[i];
                    value += ((unit ? unitLess + unit : (originalUnit ? unitLess + originalUnit : unitLess)) + ' ');
                }
            }

            return value.trim();
        }

        // Motion path // 필요하면 수정
        function isPath(val)
        {
            return is.obj(val) && objectHas(val, 'totalLength');
        }

        function setDashoffset(el)
        {
            var pathLength = el.getTotalLength();
            el.setAttribute('stroke-dasharray', pathLength);
            return pathLength;
        }

        function getPath(path, percent)
        {
            var el = path;//is.str(path) ? selectString(path)[0] : path;
            var p = percent || 100;
            return function (prop)
            {
                return {
                    el: el,
                    property: prop,
                    totalLength: el.getTotalLength() * (p / 100)
                };
            };
        }

        function getPathProgress(path, progress)
        {
            function point(offset)
            {
                var l = progress + offset >= 1 ? progress + offset : 0;
                return path.el.getPointAtLength(l);
            }
            var p = point(0);
            var p0 = point(-1);
            var p1 = point(+1);
            switch (path.property)
            {
                case 'x': return p.x;
                case 'y': return p.y;
                case 'angle': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
            }
        }

        // Decompose / recompose functions adapted from Animate Plus https://github.com/bendc/animateplus
        function decomposeValue(val, unit)
        {
            var rgx = /-?\d*\.?\d+/g;
            var value = validateValue((isPath(val) ? val.totalLength : val), unit) + '';
            return {
                original: value,
                numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
                strings: crossBrowserSplit(value, rgx)
            };
        }
        /* not yet used
        function recomposeValue(numbers, strings)
        {
            return strings.reduce(function (a, b, i) { return (a + numbers[i - 1] + b); });
        }
        */
        // Animatables
        function parseTargets(targets)
        {
            var targetsArray = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
            return targetsArray.filter(function (item, pos, self) { return self.indexOf(item) === pos; });
        }

        function getAnimatables(targets)
        {
            var parsed = parseTargets(targets);
            return parsed.map(function (t, i) { return { target: t, id: i, total: arrayLength(parsed) }; });
        }

        // Properties
        function normalizePropertyTweens(prop, tweenSettings)
        {
            var settings = cloneObject(tweenSettings);
            if (is.arr(prop))
            {
                var l = arrayLength(prop);
                var isFromTo = (l === 2 && !is.obj(prop[0]));
                if (!isFromTo)
                {
                    // Duration divided by the number of tweens
                    if (!is.fnc(tweenSettings.duration)) settings.duration = tweenSettings.duration / l;
                }
                else
                {
                    // Transform [from, to] values shorthand to a valid tween value
                    prop = { value: prop };
                }
            }
            return toArray(prop).map(function (v, i)
            {
                // Default delay value should be applied only on the first tween
                var delay = !i ? tweenSettings.delay : 0;
                // Use path object as a tween value
                var obj = is.obj(v) && !isPath(v) ? v : { value: v };
                // Set default delay value
                if (is.und(obj.delay)) obj.delay = delay;
                return obj;
            }).map(function (k) { return mergeObjects(k, settings); });
        }

        function getProperties(instanceSettings, tweenSettings, animatables, params)
        {
            var properties = [];
            var settings = mergeObjects(instanceSettings, tweenSettings);
            animatables.map(function (animatable)
            {
                var props = params.props[animatable.target.id];
                for (var p in props)
                {
                    properties.push({
                        name: p,
                        animatableid: animatable.id,
                        offset: settings['offset'],
                        tweens: normalizePropertyTweens(props[p], tweenSettings)
                    });
                }
            });
            return properties;
        }

        // Tweens
        function normalizeTweenValues(tween, animatable)
        {
            var t = {};
            for (var p in tween)
            {
                var value = getFunctionValue(tween[p], animatable);
                if (is.arr(value))
                {
                    value = value.map(function (v) { return getFunctionValue(v, animatable); });
                    if (arrayLength(value) === 1) value = value[0];
                }
                t[p] = value;
            }
            t.duration = parseFloatValue(t.duration);
            t.delay = parseFloatValue(t.delay);
            return t;
        }

        function normalizeEasing(val)
        {
            return is.arr(val) ? bezier.apply(this, val) : easings[val];
        }

        function normalizeTweens(prop, animatable)
        {
            var previousTween;
            return prop.tweens.map(function (t)
            {
                var tween = normalizeTweenValues(t, animatable);
                var tweenValue = tween.value;
                var originalValue = getOriginalTargetValue(animatable.target, prop.name);
                var previousValue = previousTween ? previousTween.to.original : originalValue;
                var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
                var to = getRelativeValue(is.arr(tweenValue) ? tweenValue[1] : tweenValue, from);
                var unit = getUnit(to) || getUnit(from) || getUnit(originalValue);
                tween.isPath = isPath(tweenValue);
                tween.from = decomposeValue(from, unit);
                tween.to = decomposeValue(to, unit);
                tween.start = previousTween ? previousTween.end : prop.offset;
                tween.end = tween.start + tween.delay + tween.duration;
                tween.easing = normalizeEasing(tween.easing);
                tween.elasticity = (1000 - minMaxValue(tween.elasticity, 1, 999)) / 1000;
                tween.isColor = is.col(tween.from.original);
                if (tween.isColor) tween.round = 1;
                previousTween = tween;
                return tween;
            });
        }

        // Tween progress // 필요하면 수정
        var setTweenProgress = {
            css: function (t, p, v) { t.style[p] = v; },
            attribute: function (t, p, v) { t.setAttribute(p, v); },
            object: function (t, p, v) { (t["set_" + p] && t["set_" + p](v)) || (t[p] = v); },
            transform: function (t, p, v, transforms, id)
            {
                if (!transforms[id]) transforms[id] = [];
                transforms[id].push("" + p + "" + v);
            }
        };

        // Animations
        function createAnimation(animatable, prop)
        {
            var animType = getAnimationType(animatable.target, prop.name);
            if (animType)
            {
                var tweens = normalizeTweens(prop, animatable);
                return {
                    type: animType,
                    property: prop.name,
                    animatable: animatable,
                    tweens: tweens,
                    duration: tweens[arrayLength(tweens) - 1].end,
                    delay: tweens[0].delay
                };
            }
        }

        function getAnimations(animatables, properties)
        {
            return flattenArray(animatables.map(function (animatable)
            {
                return properties.map(function (prop)
                {
                    if (prop.animatableid == animatable.id)
                        return createAnimation(animatable, prop);
                });
            })).filter(function (a) { return !is.und(a); });
        }

        // Create Instance
        function getInstanceTimings(type, animations, tweenSettings)
        {
            var math = (type === 'delay') ? Math.min : Math.max;
            return arrayLength(animations) ? math.apply(Math, animations.map(function (anim) { return anim[type]; })) : tweenSettings[type];
        }

        function createNewInstance(params)
        {
            var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
            var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
            var animatables = getAnimatables(params.targets);
            var properties = getProperties(instanceSettings, tweenSettings, animatables, params);
            var animations = getAnimations(animatables, properties);
            return mergeObjects(instanceSettings, {
                children: [],
                animatables: animatables,
                animations: animations,
                duration: getInstanceTimings('duration', animations, tweenSettings),
                delay: getInstanceTimings('delay', animations, tweenSettings)
            });
        }

        // Core
        var activeInstances = [];
        var raf = 0;

        function step(t)
        {
            var activeLength = arrayLength(activeInstances);
            if (activeLength)
            {
                var i = 0;
                if (!Date.now) // IE 8 Object doesn't supprots this function
                {
                    Date.now = function ()
                    {
                        return new Date().getTime();
                    };
                }
                while (i < activeLength)
                {
                    if (activeInstances[i]) activeInstances[i].tick(Date.now());
                    i++;
                }

                if (raf)
                    raf.start();
            }
            else
            {
                raf.stop();
                raf = 0;
            }
        }

        // Public Instance
        function anime(params)
        {
            var now, startTime, lastTime = 0;
            var instance = createNewInstance(params);

            function toggleInstanceDirection()
            {
                instance.reversed = !instance.reversed;
            }

            function adjustTime(time)
            {
                return instance.reversed ? instance.duration - time : time;
            }

            function syncInstanceChildren(time)
            {
                var i;
                var children = instance.children;
                if (time >= instance.currentTime)
                {
                    for (i = 0; i < arrayLength(children); i++) children[i].seek(time);
                }
                else
                {
                    for (i = arrayLength(children); i--;) children[i].seek(time);
                }
            }

            function setAnimationsProgress(insTime)
            {
                var i = 0, n;
                var transforms = {};
                var animations = instance.animations;
                var animationsLength = animations.length;
                while (i < animationsLength)
                {
                    var anim = animations[i];
                    var animatable = anim.animatable;
                    var tweens = anim.tweens;
                    var tweenLength = tweens.length - 1;
                    var tween = tweens[tweenLength];
                    // Only check for keyframes if there is more than one tween
                    if (tweenLength) tween = filterArray(tweens, function (t) { return (insTime < t.end); })[0] || tween;
                    var elapsed = minMaxValue(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
                    var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed, tween.elasticity);
                    var strings = tween.to.strings;
                    var round = tween.round;
                    if (!round)
                    {
                        var valSplit = tween.to.original.toString().split(' ');
                        var isSubColor;

                        for (n = 0; n < valSplit.length; n++)
                        {
                            if (is.col(valSplit[n])) isSubColor = true;
                        }
                    }
                    var numbers = [];
                    var progress;
                    var toNumbersLength = tween.to.numbers.length;
                    for (n = 0; n < toNumbersLength; n++)
                    {
                        var value;
                        var toNumber = tween.to.numbers[n];
                        var fromNumber = tween.from.numbers[n];
                        if (!tween.isPath)
                        {
                            value = fromNumber + (eased * (toNumber - fromNumber));
                        }
                        else
                        {
                            value = getPathProgress(tween.value, eased * toNumber);
                        }
                        if (round)
                        {
                            if (!(tween.isColor && n > 2))
                            {
                                value = Math.round(value * round) / round;
                            }
                        }
                        else
                        {
                            if (isSubColor && n >= toNumbersLength - 4)
                            {
                                value = Math.round(value * 1) / 1;
                            }
                        }
                        numbers.push(value);
                    }
                    // Manual Array.reduce for better performances
                    var stringsLength = strings.length;
                    if (!stringsLength)
                    {
                        progress = numbers[0];
                    }
                    else
                    {
                        progress = strings[0];
                        for (var s = 0; s < stringsLength; s++)
                        {
                            //var a = strings[s];
                            var b = strings[s + 1];
                            var l = numbers[s];
                            if (!isNaN(l))
                            {
                                if (!b)
                                {
                                    progress += l + ' ';
                                }
                                else
                                {
                                    progress += l + b;
                                }
                            }
                        }
                    }
                    if (!isNaN(progress) && isFinite(progress))
                    {
                        if (anim.property != "opacity")
                            progress = Math.round(progress);
                    }
                    setTweenProgress[anim.type](animatable.target, anim.property, progress, transforms, animatable.id);
                    anim.currentValue = progress;
                    i++;
                }
                var transformsLength = 0;

                if (Object.keys)
                {
                    transformsLength = Object.keys(transforms).length;
                }
                else
                {
                    for (var prop in transforms)
                    {
                        if (transforms.hasOwnProperty(prop))
                        {
                            transformsLength++;
                        }
                    }
                }

                if (transformsLength)
                {
                    for (var id = 0; id < transformsLength; id++)
                    {
                        if (!transformString)
                        {
                            var t = 'transform';
                            transformString = (getCSSValue(document.body, t) ? t : '-webkit-' + t);
                        }
                        instance.animatables[id].target.style[transformString] = transforms[id].join(' ');
                    }
                }
                instance.currentTime = insTime;
                instance.progress = (insTime / instance.duration) * 100;
            }

            function setCallback(cb)
            {
                if (instance[cb]) instance[cb](instance);
            }

            function countIteration()
            {
                if (instance.remaining && instance.remaining !== true)
                {
                    instance.remaining--;
                }
            }

            function setInstanceProgress(engineTime)
            {
                var insDuration = instance.duration;
                var insOffset = instance.offset;
                var insDelay = instance.delay;
                var insCurrentTime = instance.currentTime;
                var insReversed = instance.reversed;
                var insTime = minMaxValue(adjustTime(engineTime), 0, insDuration);
                if (instance.children) syncInstanceChildren(insTime);
                if (insReversed)
                {
                    if (insCurrentTime !== 0 || (insCurrentTime === 0 && engineTime == insCurrentTime))
                    {
                        if (insCurrentTime === 0)
                            countIteration();
                        setAnimationsProgress(insTime);
                        if (!instance.began && insTime >= insDelay)
                        {
                            instance.began = true;
                            setCallback('begin');
                        }
                        setCallback('run');
                    }
                    else
                    {
                        if (insCurrentTime === 0 && instance.remaining && instance._refobject._reverse)
                        {
                            setAnimationsProgress(insTime);
                            countIteration();
                        }

                        if (insTime <= insOffset && insCurrentTime !== 0)
                        {
                            setAnimationsProgress(0);
                            if (insReversed) countIteration();
                        }
                        if (insTime >= insDuration && insCurrentTime !== insDuration)
                        {
                            setAnimationsProgress(insDuration);
                            if (!insReversed) countIteration();
                        }
                    }
                }
                else
                {
                    if (insTime >= (insOffset + insDelay) && insTime < insDuration)
                    {
                        setAnimationsProgress(insTime);
                        if (!instance.began && insTime >= insDelay)
                        {
                            instance.began = true;
                            setCallback('begin');
                        }
                        setCallback('run');
                    }
                    else
                    {
                        if (insTime <= insOffset && insCurrentTime !== 0)
                        {
                            setAnimationsProgress(0);
                            if (insReversed) countIteration();
                        }
                        if (insTime >= insDuration && insCurrentTime !== insDuration)
                        {
                            setAnimationsProgress(insDuration);
                            if (!insReversed) countIteration();
                        }
                        if (insCurrentTime === insDuration)
                            countIteration();
                    }
                }

                if (engineTime >= insDuration)
                {
                    if (instance.remaining)
                    {
                        startTime = now;
                        if (instance.direction === 'alternate') toggleInstanceDirection();
                    }
                    else
                    {
                        instance.pause();

                        if (!instance.completed)
                        {
                            instance.completed = true;
                            setCallback('complete');
                        }
                    }
                    lastTime = 0;
                }
                setCallback('update');
            }

            instance._rafTarget = params._rafTarget;
            instance.equalInstance = function (instanceProp, params)
            {
                var temp_instance = createNewInstance(params);

                if (instanceProp == "tweens")
                {
                    for (var i = 0; i < this.animations.length; i++)
                    {
                        var org_animation = this.animations[i];
                        var temp_animation = temp_instance.animations[i];

                        var org_tweens = org_animation.tweens;
                        var temp_tweens = temp_animation.tweens;

                        if (org_tweens.length != temp_tweens.length)
                        {
                            return false;
                        }

                        for (var j = 0; j < org_tweens.length; j++)
                        {
                            var org_from = org_tweens[j].from.original;
                            var org_to = org_tweens[j].to.original;

                            var temp_from = temp_tweens[j].from.original;
                            var temp_to = temp_tweens[j].to.original;

                            if (org_from != temp_from) return false;
                            if (org_to != temp_to) return false;
                        }
                    }

                    return true;
                }
            };

            instance.tick = function (t)
            {
                now = t;
                if (!startTime) startTime = now;
                var engineTime = (lastTime + now - startTime) * anime.speed;
                setInstanceProgress(engineTime);
            };

            instance.seek = function (time)
            {
                setInstanceProgress(adjustTime(time));
            };

            instance.pause = function ()
            {
                var i = activeInstances.indexOf(instance);
                if (i > -1) activeInstances.splice(i, 1);
                instance.paused = true;
            };

            instance.play = function ()
            {
                if (!instance.paused) return;
                instance.paused = false;
                startTime = 0;
                lastTime = adjustTime(instance.currentTime);
                activeInstances.push(instance);
                if (!raf)
                {
                    raf = new nexacro.AnimationFrame(instance._rafTarget, step);
                    raf.start();
                }
            };

            instance.reverse = function ()
            {
                toggleInstanceDirection();
                startTime = 0;
                lastTime = adjustTime(instance.currentTime);
            };

            instance.restart = function ()
            {
                instance.pause();
                instance.reset();
                instance.play();
            };

            instance.destroy = function ()
            {
                if (raf)
                {
                    raf.stop();
                    raf.destroy();
                    raf = 0;
                }
            };

            instance.reset = function ()
            {
                var direction = instance.direction;
                var loops = instance.loop;

                instance.currentTime = 0;
                instance.progress = 0;
                instance.paused = true;
                instance.began = false;
                instance.completed = false;
                instance.reversed = direction === 'reverse';
                instance.remaining = direction === 'alternate' && loops === 1 ? 2 : loops;

                for (var i = arrayLength(instance.children); i--;)
                {
                    var child = instance.children[i];
                    child.seek(child.offset);
                    child.reset();
                }
            };
            instance.reset();

            if (instance.autoplay) instance.play();

            return instance;
        }

        // Remove targets from animation
        function removeTargets(targets)
        {
            var targetsArray = parseTargets(targets);
            for (var i = arrayLength(activeInstances); i--;)
            {
                var instance = activeInstances[i];
                var animations = instance.animations;
                for (var a = arrayLength(animations); a--;)
                {
                    if (arrayContains(targetsArray, animations[a].animatable.target))
                    {
                        animations.splice(a, 1);
                        if (!arrayLength(animations)) instance.pause();
                    }
                }
            }
        }

        // Timeline
        function timeline(params)
        {
            var tl = anime(params);
            tl.pause();
            tl.duration = 0;
            tl.add = function (instancesParams)
            {
                var i;
                for (i = 0; i < tl.children.length; i++)
                {
                    tl.children[i].began = true;
                    tl.children[i].completed = true;
                }
                var arrInstance = toArray(instancesParams);
                for (i = 0; i < arrInstance.length; i++)
                {
                    var tlDuration = tl.duration;
                    var insOffset = arrInstance[i].offset;
                    arrInstance[i].autoplay = false;
                    arrInstance[i].offset = is.und(insOffset) ? tlDuration : getRelativeValue(insOffset, tlDuration);
                    tl.seek(arrInstance[i].offset);
                    var ins = anime(arrInstance[i]);
                    if (ins.duration > tlDuration) tl.duration = ins.duration;
                    ins.began = true;
                    tl.children.push(ins);
                }
                tl.reset();
                tl.seek(0);
                if (tl.autoplay) tl.restart();
                return tl;
            };
            return tl;
        }

        anime.version = '2.0.2';
        anime.speed = 1;
        anime.running = activeInstances;
        anime.remove = removeTargets;
        anime.getValue = getOriginalTargetValue;
        anime.path = getPath;
        anime.setDashoffset = setDashoffset;
        anime.bezier = bezier;
        anime.easings = easings;
        anime.timeline = timeline;
        anime.random = function (min, max) { return Math.floor(nexacro._random() * (max - min + 1)) + min; };

        return anime;
    }));




    //==============================================================================
    // nexacro.AnimationItem
    //==============================================================================
    nexacro.AnimationItem = function (id, componentid, props)
    {
        nexacro.Object.call(this, id);
        this._p_componentid = componentid || "";
        this.props = props || "";
    };

    var _pAnimationItem = nexacro._createPrototype(nexacro.Object, nexacro.AnimationItem);
    nexacro.AnimationItem.prototype = _pAnimationItem;
    _pAnimationItem._type_name = "AnimationItem";

    _pAnimationItem._properties = [
        { name: "componentid" },
    ];

    //==============================================================================
    // nexacro.AnimationItem : Properties
    //==============================================================================
    _pAnimationItem.set_componentid = function (componentid)
    {
        if (this._p_componentid != componentid)
            this._p_componentid = componentid;
    };


    //==============================================================================
    // nexacro.AnimationEventInfo
    //==============================================================================
    nexacro.AnimationEventInfo = function (obj, id)
    {
        this.id = this.eventid = id;
        this.fromobject = this.fromreferenceobject = obj;

        this.direction = obj._anime.reversed ? "reverse" : "normal";
        if (obj.loop)
        {
            this.loopcount = obj.loopcount - obj._anime.remaining + 1;
        }
        else
        {
            this.loopcount = 1;
        }
        this.reversed = obj._anime.reversed;
        this.paused = obj._anime.paused;
        this.currenttime = obj._anime.currentTime;
    };
    var _pAnimationEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.AnimationEventInfo);
    nexacro.AnimationEventInfo.prototype = _pAnimationEventInfo;
    _pAnimationEventInfo._type_name = "AnimationEventInfo";

    //==============================================================================
    // nexacro.Animation
    //==============================================================================
    nexacro.Animation = function (id, parent)
    {
        nexacro._EventSinkObject.call(this, id, parent);

        this._p_items = new nexacro.Collection();

        this._anime_task = [];
    };

    var _pAnimation = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Animation);
    nexacro.Animation.prototype = _pAnimation;
    _pAnimation._type_name = "Animation";

    /* default properties */
    _pAnimation._p_beziercurve = "";
    _pAnimation._p_delay = 0;
    _pAnimation._p_direction = "normal";
    _pAnimation._reverse = false;
    _pAnimation._p_duration = 1000;
    _pAnimation._p_easing = "easeOutElastic";
    _pAnimation._p_elasticity = 0;
    _pAnimation._p_items = null;
    _pAnimation._p_loop = false;
    _pAnimation._p_loopcount = undefined;
    _pAnimation._p_enableevent = true;
    _pAnimation._p_offset = undefined;
    _pAnimation._p_round = undefined;
    _pAnimation._p_targets = undefined;

    /* internal variable */
    _pAnimation._anime = null;
    _pAnimation._is_alive = true;


    _pAnimation._properties = [
        { name: "beziercurve" },
        { name: "delay" },
        { name: "direction" },
        { name: "duration" },
        { name: "easing" },
        { name: "elasticity" },
        { name: "items", readonly: true },
        { name: "loop" },
        { name: "loopcount" },
        { name: "enableevent" },
        { name: "offset" },
        { name: "round" },
        { name: "targets" },
    ];

    /* event list */
    _pAnimation._event_list = { "onupdate": 1, "onrun": 1, "onbegin": 1, "oncomplete": 1 };

    //===============================================================
    // nexacro.Animation : Create & Destroy & Update
    //===============================================================
    _pAnimation.on_created = function ()
    {
        this._createAnimeJSObject();
    };

    _pAnimation.destroy = function ()
    {
        this._is_alive = false;

        if (this._p_parent && this._p_parent.removeChild)
        {
            this._p_parent.removeChild(this.id);
        }

        nexacro._EventSinkObject.prototype.destroy.call(this);

        if (this._anime)
        {
            this._anime.pause();
            this._anime.destroy();
            this._anime = null;
        }

        if (this._p_parent)
        {
            this._p_parent = null;
        }

        return true;
    };

    //===============================================================
    // nexacro.Animation : Override
    //===============================================================

    //===============================================================
    // nexacro.Animation : Properties
    //===============================================================
    _pAnimation.set_beziercurve = function (v)
    {
        var beziercurve = nexacro._toString(v);

        if (this._p_beziercurve != beziercurve) this._p_beziercurve = beziercurve;
    };

    _pAnimation.set_delay = function (v)
    {
        var delay = nexacro._toInt(v);

        if (this._p_delay != delay) this._p_delay = delay;
    };

    _pAnimation.set_direction = function (v)
    {
        var direction = nexacro._toString(v);

        if (this._p_direction != direction) this._p_direction = direction;

        this._reverse = direction == "reverse";
    };

    _pAnimation.set_duration = function (v)
    {
        var duration = nexacro._toInt(v);

        if (this._p_duration != duration) this._p_duration = duration;
    };

    _pAnimation.set_easing = function (v)
    {
        var easing = nexacro._toString(v);

        if (this._p_easing != easing) this._p_easing = easing;
    };

    _pAnimation.set_elasticity = function (v)
    {
        var elasticity = nexacro._toInt(v);

        if (this._p_elasticity != elasticity) this._p_elasticity = elasticity;
    };

    _pAnimation.set_loop = function (v)
    {
        var loop = nexacro._toBoolean(v) ? v : false;

        if (this._p_loop != loop) this._p_loop = loop;
    };

    _pAnimation.set_loopcount = function (v)
    {
        var loopcount = nexacro._isInt(v) ? (v > 0 ? v : undefined) : undefined;

        if (this._p_loopcount != loopcount) this._p_loopcount = loopcount;
    };

    _pAnimation.set_enableevent = function (v)
    {
        v = nexacro._toBoolean(v);

        if (this._p_enableevent != v) this._p_enableevent = v;
    };

    // not used
    _pAnimation.set_offset = function (v)
    {
        var offset = nexacro._toInt(v);

        if (this._p_offset != offset) this._p_offset = offset;
    };

    _pAnimation.set_round = function (v)
    {
        var round = nexacro._toInt(v);

        if (this._p_round != round) this._p_round = round;
    };

    _pAnimation.set_targets = function (v)
    {
        if (nexacro._isObject(v))
            this._p_targets = v;
        else
            this._p_targets = nexacro._toString(v);
    };

    // deprecated
    _pAnimation.set_targetprops = function (v) { };

    //===============================================================
    // nexacro.Animation : Methods
    //===============================================================
    _pAnimation.addTarget = function (id, compobj, props)
    {
        var ret = -1;
        var item = this._p_items[id];

        if (!item)
        {
            item = new nexacro.AnimationItem(id, compobj._unique_id, props);
            ret = this.addChild(compobj._unique_id, compobj);
            if (ret == 0)
                ret = this._p_items.add_item(id, item);

            if (this._anime)
            {
                if (this._anime_task.length == 0 && this._p_parent)
                {
                    nexacro._OnceCallbackTimer.callonce(this, this._runAnimeTask, 1);
                }
                this._setAnimeTask("changeAnimationItem");
            }
        }

        return ret;
    };

    _pAnimation.removeTarget = function (id)
    {
        var ret = null;
        var item = this._p_items[id];

        if (item)
        {
            ret = item;
            this.removeChild(item._p_componentid);
            this._p_items.remove_item(id);
            if (this._anime)
            {
                if (this._anime_task.length == 0 && this._p_parent)
                {
                    nexacro._OnceCallbackTimer.callonce(this, this._runAnimeTask, 1);
                }
                this._setAnimeTask("changeAnimationItem");
            }
        }

        return ret;
    };

    _pAnimation.pause = function ()
    {
        if (this._anime)
        {
            if (this._anime_task.length > 0)
            {
                this._setAnimeTask("pause");
            }
            else
            {
                this._anime.pause();
            }

            return true;
        }

        return false;
    };

    _pAnimation.play = function ()
    {
        if (this._anime)
        {
            if (this._anime_task.length > 0)
            {
                this._setAnimeTask("play");
            }
            else
            {
                var curTime = this.getCurrentTime();

                this._anime.loop = (this._p_loop === true && this._p_loopcount > 1) ? this._p_loopcount : this._p_loop;
                this._anime.reset();

                if (this.getCompletedStatus())
                {
                    if (this._reverse)
                    {
                        if (curTime <= 0)
                            this._anime.seek(this._anime.duration);
                        else
                            this._anime.seek(curTime);

                        if (!this.getReversedStatus())
                            this._anime.reverse();

                        this._anime.play();
                    }
                    else
                    {
                        this._anime.seek(0);

                        if (this.getReversedStatus())
                            this._anime.reverse();

                        this._anime.play();
                    }
                }
                else
                {
                    if (this.getPausedStatus())
                    {
                        // 애니메이션 멈춘상태
                        if (this._reverse)
                        {
                            if (curTime <= 0)
                                this._anime.seek(this._anime.duration);
                            else
                                this._anime.seek(curTime);

                            if (!this.getReversedStatus())
                                this._anime.reverse();

                            this._anime.play();
                        }
                        else
                        {
                            this._anime.seek(0);

                            if (this.getReversedStatus())
                                this._anime.reverse();

                            this._syncTweens();

                            this._anime.play();
                        }
                    }
                    else
                    {
                        // 애니메이션 동작중
                        this._anime.pause();
                        this._anime.seek(0);

                        this._createAnimeJSObject();

                        this._anime.play();
                    }
                }
            }
        }
        else
        {
            // 애니메이션객체가 없을때
            this._createAnimeJSObject();
            if (this._reverse)
            {
                this._anime.seek(this._anime.duration);
                if (!this.getReversedStatus())
                    this._anime.reverse();
            }

            this._anime.play();
        }

        return true;
    };

    _pAnimation.reverse = function ()
    {
        if (this._anime)
        {
            if (this._anime_task.length > 0)
            {
                this._setAnimeTask("reverse");
            }
            else
            {
                if (this.getBeginStatus())
                {
                    this._reverse = !this._reverse;
                    // 애니메이션동작이 한번이상 수행됐을때
                    if (this.getPausedStatus() || this.getCompletedStatus())
                    {
                        // 애니메이션이 멈춰있는 상태
                        this._anime.reverse();
                    }
                    else
                    {
                        // 애니메이션 동작중
                        this._anime.pause();
                        this._anime.reverse();
                        this._anime.play();
                    }

                    return true;
                }
            }
        }

        return false;
    };

    _pAnimation.seek = function (time)
    {
        if (this._anime)
        {
            if (this._anime_task.length > 0)
            {
                this._setAnimeTask("seek", [time]);
            }
            else
            {
                if (this.getBeginStatus())
                {
                    // 애니메이션동작이 한번이상 수행됐을때
                    if (this.getPausedStatus() || this.getCompletedStatus())
                    {
                        // 애니메이션이 멈춰있는 상태
                        this._anime.seek(time);
                    }
                    else 
                    {
                        // 애니메이션 동작중
                        this._anime.pause();
                        this._anime.seek(time);
                        this._anime.play();
                    }
                }
                else
                {
                    // 애니메이션 동작을 수행하지 않았을떄
                    this._anime.seek(time);
                }
            }
        }
        else
        {
            // 애니메이션객체가 없을때
            this._createAnimeJSObject();

            this._anime.seek(time);
        }

        return true;
    };

    _pAnimation.stop = function ()
    {
        if (this._anime)
        {
            if (this._anime_task.length > 0)
            {
                this._setAnimeTask("stop");
            }
            else
            {
                if (this.getBeginStatus() && !this.getCompletedStatus())
                {
                    this._anime.pause();
                    this._anime.seek(0);
                    this._anime.reset();

                    this._createAnimeJSObject();

                    return true;
                }
            }
        }

        return false;
    };

    // deprecated
    _pAnimation.reset = function () { };
    _pAnimation.restart = function () { };

    //===============================================================
    // nexacro.Animation : Event Handlers
    //===============================================================
    _pAnimation._on_begin = function ()
    {
        if (this._refobject && this._refobject._p_enableevent)
            this._refobject.on_fire_begin();
    };

    _pAnimation._on_complete = function ()
    {
        if (this._refobject && this._refobject._p_enableevent)
            this._refobject.on_fire_complete();
    };

    _pAnimation._on_run = function ()
    {
        if (this._refobject && this._refobject._p_enableevent)
            this._refobject.on_fire_run();
    };

    _pAnimation._on_update = function ()
    {
        if (this._refobject && this._refobject._p_enableevent)
            this._refobject.on_fire_update();
    };

    _pAnimation.on_fire_begin = function ()
    {
        if (this.onbegin && this.onbegin._has_handlers)
        {
            var evt = new nexacro.AnimationEventInfo(this, "onbegin");
            this.onbegin._fireEvent(this, evt);
        }
    };

    _pAnimation.on_fire_complete = function ()
    {
        if (this.oncomplete && this.oncomplete._has_handlers)
        {
            var evt = new nexacro.AnimationEventInfo(this, "oncomplete");
            this.oncomplete._fireEvent(this, evt);
        }
    };

    _pAnimation.on_fire_run = function ()
    {
        if (this.onrun && this.onrun._has_handlers)
        {
            var evt = new nexacro.AnimationEventInfo(this, "onrun");
            this.onrun._fireEvent(this, evt);
        }
    };

    _pAnimation.on_fire_update = function ()
    {
        if (this.onupdate && this.onupdate._has_handlers)
        {
            var evt = new nexacro.AnimationEventInfo(this, "onupdate");
            this.onupdate._fireEvent(this, evt);
        }
    };

    //===============================================================
    // nexacro.Animation : Logical Part
    //===============================================================
    _pAnimation.addChild = function (id, obj)
    {
        if (id && id.length <= 0)
        {
            return -1;
        }
        if (!obj)
        {
            throw nexacro.MakeReferenceError(this, "reference_not_define", id);
        }

        if (this[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        this[id] = obj;

        return 0;
    };

    _pAnimation.removeChild = function (id)
    {
        if (!id || id.length <= 0)
        {
            return null;
        }

        var obj = this[id];
        if (!obj)
        {
            return null;
        }

        delete this[id];
        return obj;
    };

    _pAnimation._makeParamsObject = function (isReset, offset)
    {
        var objParams = {};

        if (isReset)
        {
            this._anime = null;
        }

        objParams._rafTarget = this._p_parent;

        var items = this._p_items;

        var targets = [];
        var props = {};
        var prop_obj, prop_str;
        for (var i = 0, n = items.length; i < n; i++)
        {
            var item = items[i];
            if (item)
            {
                targets.push(this[item._p_componentid]);

                prop_str = item.props;
                prop_obj = new Function('return {' + prop_str + '}')();

                var compid = item._p_componentid;
                if (compid)
                {
                    compid = compid.substring(compid.lastIndexOf(".") + 1, compid.length);
                }

                props[compid] = prop_obj;
            }
        }
        objParams.targets = targets;
        objParams.props = props;
        objParams.loop = this._p_loop;

        if (this._p_loop === true && this._p_loopcount > 1)
            objParams.loop = this._p_loopcount;

        if (this._p_direction.length > 0)
            objParams.direction = this._p_direction;

        if (this.duration > 0)
            objParams.duration = this.duration;

        if (this._p_delay > 0)
            objParams.delay = this._p_delay;

        if (this._p_easing == "custom")
        {
            if (this._p_beziercurve)
                objParams.easing = this._p_beziercurve.split(",");
        }
        else if (this._p_easing)
        {
            objParams.easing = this._p_easing.toLowerCase();
        }

        if (this._p_elasticity >= 0)
            objParams.elasticity = this._p_elasticity;

        if (this._p_round > 0)
            objParams.round = this._p_round;

        if (!isNaN(offset))
        {
            if (offset > 0)
                objParams.offset = "+=" + offset;
        }

        return objParams;
    };

    _pAnimation._createAnimeJSObject = function ()
    {
        // Create animeJS Instance
        var _anime = anime(this._makeParamsObject(true));
        this._anime = _anime;
        _anime._refobject = this;

        // Set Callback Function
        _anime.update = this._on_update;
        _anime.begin = this._on_begin;
        _anime.run = this._on_run;
        _anime.complete = this._on_complete;
    };

    _pAnimation._setAnimeTask = function (task, params)
    {
        this._anime_task.push({ "action": task, "params": params });
    };

    _pAnimation._runAnimeTask = function (id)
    {
        var task = this._anime_task.splice(0);
        var curr_task, next_task;

        for (var i = 0; i < task.length; i++)
        {
            curr_task = task[i];
            next_task = task[i + 1];

            switch (task[i].action)
            {
                case "changeAnimationItem":
                    if (next_task && next_task.action == "changeAnimationItem")
                    {
                        continue;
                    }

                    this._createAnimeJSObject();
                    break;
                case "pause":
                    this.pause();
                    break;
                case "play":
                    this.play();
                    break;
                case "reverse":
                    this.reverse();
                    break;
                case "seek":
                    this.seek(curr_task.params[0]);
                    break;
                case "stop":
                    this.stop();
                    break;
            }
        }

        this._anime_task = [];
    };

    _pAnimation._syncTweens = function ()
    {
        // Animation.items의 정보와 실제 생성된 anime의 tweens 정보의 정합성 체크.
        if (!this._anime)
            return true;

        var isEqual = this._anime.equalInstance("tweens", this._makeParamsObject(false));
        if (!isEqual)
        {
            this._createAnimeJSObject();
        }
    };

    //===============================================================
    // nexacro.Animation : Util Function
    //===============================================================
    _pAnimation.getReversedStatus = function ()
    {
        if (this._anime)
            return this._anime.reversed;
        return false;
    };

    _pAnimation.getCurrentTime = function ()
    {
        if (this._anime)
            return this._anime.currentTime;
        return 0;
    };

    _pAnimation.getPausedStatus = function ()
    {
        if (this._anime)
            return this._anime.paused;
        return false;
    };

    _pAnimation.getBeginStatus = function ()
    {
        if (this._anime)
            return this._anime.began;
        return false;
    };

    _pAnimation.getCompletedStatus = function ()
    {
        if (this._anime)
            return this._anime.completed;
        return false;
    };

    _pAnimation._getReferenceContext = function ()
    {
        return this._p_parent;
    };

    //==============================================================================
    // nexacro.AnimationTimelineItem
    //==============================================================================
    nexacro.AnimationTimelineItem = function (id, animationid, offset)
    {
        nexacro.Object.call(this, id);
        this.animationid = animationid || "";
        this._p_offset = offset || 0;
    };
    var _pAnimationTimelineItem = nexacro._createPrototype(nexacro.Object, nexacro.AnimationTimelineItem);
    nexacro.AnimationTimelineItem.prototype = _pAnimationTimelineItem;
    _pAnimationTimelineItem._type_name = "AnimationTimelineItem";

    _pAnimationTimelineItem.animationid = "";
    _pAnimationTimelineItem._p_offset = 0;

    _pAnimationTimelineItem._properties = [
        { name: "offset" },
    ];

    _pAnimationTimelineItem.set_offset = function (v)
    {
        if (this._p_offset != v) this._p_offset = v;
    };

    //==============================================================================
    // nexacro.AnimationTimeline
    //==============================================================================
    nexacro.AnimationTimeline = function (id, parent)
    {
        nexacro.Animation.call(this, id, parent);
    };
    var _pAnimationTimeline = nexacro._createPrototype(nexacro.Animation, nexacro.AnimationTimeline);
    nexacro.AnimationTimeline.prototype = _pAnimationTimeline;
    _pAnimationTimeline._type_name = "AnimationTimeline";

    // Internal Method
    _pAnimationTimeline._makeParamsObject = function (isReset)
    {
        var objParams = {};

        if (isReset)
        {
            this._anime = null;
        }

        objParams._rafTarget = this._p_parent;

        if (this._p_loop > -1)
            objParams.loop = this._p_loop;

        if (this._p_direction.length > 0)
            objParams.direction = this._p_direction;

        if (this.duration > 0)
            objParams.duration = this.duration;

        if (this._p_delay > 0)
            objParams.delay = this._p_delay;

        if (this._p_easing)
            objParams.easing = this._p_easing;

        if (this._p_elasticity >= 0)
            objParams.elasticity = this._p_elasticity;

        if (this._p_round > 0)
            objParams.round = this._p_round;


        return objParams;
    };

    _pAnimationTimeline._createAnimeJSObject = function ()
    {
        // Create animeJS Timeline Instance
        this._anime = anime.timeline(this._makeParamsObject(true));
        this._anime._refobject = this;

        for (var i = 0, len = this._p_items.length; i < len; i++)
        {
            var item = this._p_items[i];
            this._anime.add(this[item.animationid]._makeParamsObject(true, item.offset));
        }
        // Set Callback Function
        this._anime.update = this._on_update;
        this._anime.begin = this._on_begin;
        this._anime.run = this._on_run;
        this._anime.complete = this._on_complete;
    };

    _pAnimationTimeline.addTarget = function (id, obj, offset)
    {
        var ret = -1;
        var item = this._p_items[id];

        if (!item)
        {
            item = new nexacro.AnimationTimelineItem(id, obj.id, offset);
            this.addChild(obj.id, obj);
            ret = this._p_items.add_item(id, item);
        }
        return ret;
    };

    _pAnimationTimeline.insertTarget = function (index, id, obj, offset)
    {
        var ret = -1;
        var item = this._p_items[id];

        if (!item)
        {
            item = new nexacro.AnimationTimelineItem(id, obj.id, offset);
        }
        else
        {
            this._p_items.removeTarget(id);
        }

        this.addChild(obj.id, obj);
        ret = this._p_items.insert_item(index, id, item);
        return ret;
    };

    nexacro._defineProperties(_pAnimationItem, _pAnimationItem._properties);
    nexacro._defineProperties(_pAnimation, _pAnimation._properties);
    nexacro._defineProperties(_pAnimationTimelineItem, _pAnimationTimelineItem._properties);
}

if (_process)
{
    //delete _process;
    _pAnimationItem = null;
    _pAnimationEventInfo = null;
    _pAnimation = null;
    _pAnimationTimelineItem = null;
    _pAnimationTimeline = null;
}