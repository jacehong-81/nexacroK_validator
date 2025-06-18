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

if (!nexacro.Sketch)
{
    // ==============================================================================
    // nexacro.SketchLoadEventInfo  
    // ==============================================================================
    nexacro.SketchLoadEventInfo = function (obj, id, url)
    {
        this.id = this.eventid = id || "onload";
        this.fromobject = this.fromreferenceobject = obj;
        this.url = url;
    };
    var _pSketchLoadEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.SketchLoadEventInfo);
    nexacro.SketchLoadEventInfo.prototype = _pSketchLoadEventInfo;
    _pSketchLoadEventInfo._type_name = "SketchLoadEventInfo";

    //delete _pSketchLoadEventInfo;
    _pSketchLoadEventInfo = null;

    // ==============================================================================
    // nexacro.SketchErrorEventInfo  
    // ==============================================================================
    nexacro.SketchErrorEventInfo = function (obj, id, fireerrorcode, errormsg, errortype, errstatus, imageurl, locationuri)
    {
        this.id = this.eventid = id || "onerror";
        this.errormsg = errormsg;
        this.errorobj = obj;
        this.errortype = errortype;
        this.locationuri = locationuri;
        this.requesturi = imageurl;
        this.statuscode = errstatus ? errstatus : 0;
    };
    var _pSketchErrorEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.SketchErrorEventInfo);
    nexacro.SketchErrorEventInfo.prototype = _pSketchErrorEventInfo;
    _pSketchErrorEventInfo._type_name = "SketchErrorEventInfo";

    //delete _pSketchErrorEventInfo;
    _pSketchErrorEventInfo = null;

    // ==============================================================================
    // nexacro.SketchEventInfo
    // ==============================================================================
    nexacro.SketchEventInfo = function (obj, id, handle)
    {
        this.id = this.eventid = id || "onsuccess";
        this.handle = handle;
        this.fromobject = this.fromreferenceobject = obj;
    };
    var _pSketchEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.SketchEventInfo);
    nexacro.SketchEventInfo.prototype = _pSketchEventInfo;
    _pSketchEventInfo._type_name = "SketchEventInfo";

    _pSketchEventInfo = null;
    // ==============================================================================
    // nexacro.Sketch 
    // ==============================================================================
    nexacro.Sketch = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._history = [];

        this._image_format = ["bmp", "gif", "jpeg", "jpg", "png", "tif", "tiff", "icon"];


        this._default_stroke_style = nexacro.ColorObject("black");
        this._currentPath = [];

        this._path_style = {};
        /*
            tool: this._const_stroke,	// "text", "image"
            globalCompositeOperation: this._const_composit_source_over,
            strokeColor: this._default_stroke_style,
            lineWidth: this._default_line_width,
            eraseWidth: this._default_line_width,
            lineCap: this._default_line_cap,
            lineJoin: this._default_line_join,
            font: this._font || ,
            fontColor: this._default_stroke_style,
            text: ""
        };
        */
    };

    // TODO expr, usedecorate

    var _pSketch = nexacro._createPrototype(nexacro.Component, nexacro.Sketch);
    nexacro.Sketch.prototype = _pSketch;

    _pSketch._type_name = "Sketch";

    //-----------------      property     ---------------------//
    _pSketch._p_undoable = false;
    _pSketch._p_redoable = false;
    _pSketch._p_editmode = "stroke";                  // "text", "erase", default "stroke"
    _pSketch._p_enableredraw = true;
    _pSketch.imemode = "none"; //?
    _pSketch._p_usecontextmenu = true;
    _pSketch._p_text = "";

    _pSketch._p_readonly = false;


    _pSketch._p_value = null;
    _pSketch.sketchtextarea = null;
    _pSketch._p_accessibilityrole = "image";

    //----------------- internal variable -----------------------//
    _pSketch._canvas_elem_bg = null;
    _pSketch._canvas_elem = null;
    _pSketch._canvas_elem_tmp = null;
    _pSketch._current_strokes = null;
    _pSketch._image = null;                        // save image object for loadSketch method 
    _pSketch._clr_history = true;                  // use clear history for loadsketch method
    _pSketch._current_state = -1;
    _pSketch._freeze_state = -1;
    _pSketch._drawpathcount = 0;
    _pSketch._const_stroke = "stroke";
    _pSketch._const_stroke_user = "strokeu";
    _pSketch._const_text = "text";
    _pSketch._const_erase = "erase";
    _pSketch._const_none = "none";
    _pSketch._const_erase_user = "eras_handleeu";
    _pSketch._const_image = "image";
    _pSketch._const_composit_source_over = "source-over";
    _pSketch._const_composit_destination_out = "destination-out";
    _pSketch._const_form = "this._p_parent";
    _pSketch._const_dot = ".";

    _pSketch._default_line_cap = "round";
    _pSketch._default_line_join = "round";
    _pSketch._default_line_width = 1;

    _pSketch._default_edit_gap = 0.5;
    _pSketch._default_edit_x = 0;
    _pSketch._default_edit_y = 0;
    _pSketch._default_edit_width = 100;
    _pSketch._default_edit_height = 50;
    _pSketch._startDrawStroke = true;
    _pSketch._startDrawErase = true;

    //삭제예정    
    _pSketch.texteditmode = "text"; //
    _pSketch.undocount = 5;
    _pSketch.undotype = "draw";
    //
    _pSketch._pre_draw_status = "";
    _pSketch._butt_count = 0;

    _pSketch._const_code_parameter = "0001";       //ObjectError Parameter Error  
    _pSketch._const_code_io = "1101";              //ObjectError I/O Error
    _pSketch._const_code_permission = "1102";      //ObjectError permission denied
    _pSketch._const_code_Irregular = "1103";       //ObjectError Irregular Expression error
    _pSketch._const_code_target = "1104";          //ObjectError Removed target 
    _pSketch._const_code_loadinvalidimage = "1105";//ObjectError Image Info [", "%0", "] is not found.
    _pSketch._const_code_incorrectfile = "1106";   //TypeError   The file is not correct.
    _pSketch._const_code_savefile = "1107";        //ObjectError Failed to save file.
    _pSketch._const_errortype_obj = "ObjectError";
    _pSketch._const_errortype_type = "TypeError";

    _pSketch._const_code_parameter_msg = "comp_fail_parameter";
    _pSketch._const_code_loadinvalidimage_msg = "comm_fail_loadinvalidimage";
    _pSketch._const_code_incorrectfile_msg = "comp_incorrect_file";
    _pSketch._const_code_savefile_msg = "comp_fail_save_file";

    _pSketch._is_undo = false;
    _pSketch._apply_client_padding = true;
    _pSketch._is_touch = false;
    _pSketch._img_type = "url";
    _pSketch._touch_status = 0;                      // 0:move 1:down 2:move 3:up
    _pSketch._font = null;
    _pSketch._imgurl = "";

    _pSketch._touch_count = 0;

    /* status */
    _pSketch._use_readonly_status = true;

    /* event list */
    _pSketch._event_list = {
        "oninit": 1, "onclick": 1, "ondblclick": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ontouch": 1, "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onmousemove": 1, "onload": 1, "onerror": 1, "onsuccess": 1,
        "onsize": 1, "onmove": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1,
        "onmouseup": 1, "onmouseenter": 1, "onmouseleave": 1, "onmousewheel": 1, "onkeydown": 1, "onkeyup": 1,
        "oninput": 1, "ondrag": 1, "ondrop": 1, "ondragenter": 1, "ondragleave": 1,
        "oncontextmenu": 1,
        "ondragmove": 1, "ondevicebuttonup": 1
    };

    // ==============================================================================
    // nexacro.Sketch : Create & Destroy & Update
    // ==============================================================================
    _pSketch.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var color = this._color || this._getCurrentStyleInheritValue("color");
            nexacro.addErrorMessage(nexacro._getLanguage(), this._const_code_parameter_msg, "Parameter Error.");
            nexacro.addErrorMessage(nexacro._getLanguage(), this._const_code_savefile_msg, "Failed to save file.");

            //this._canvas_elem_bg = new nexacro.CanvasElement(control_elem); //, "canvas_elem_bg");
            this._canvas_elem = new nexacro.CanvasElement(control_elem); //, "canvas_elem");
            this._canvas_elem_tmp = new nexacro.CanvasElement(control_elem); //, "canvas_elem_tmp");

            //this._canvas_elem_bg.setElementSize(this.width, this.height);
            //this._canvas_elem.setElementSize(this.width, this.height);
            //this._canvas_elem_tmp.setElementSize(this.width, this.height);


            var sketchtextarea = new nexacro.SketchEditControl("sketchtextarea", this._default_edit_x, this._default_edit_y,
                this._default_edit_width, this._default_edit_height,
                null, null, null, null, null, null, this);
            sketchtextarea._setControl("TextAreaControl");
            sketchtextarea.createComponent();
            sketchtextarea._setEventHandler("oninput", this.on_notify_oninput, this);
            sketchtextarea._setEventHandler("onkillfocus", this.on_notify_edit_onkillfocus, this);

            this.sketchtextarea = sketchtextarea;

            if (!this._font)
                this._font = this._getCurrentStyleInheritValue("font");

            if (this._p_text)
            {
                var text_elem = new nexacro.TextBoxElement(control_elem);
                //var textAlign = this.textAlign ? this.textAlign : "center";
                //var verticalAlign = this.verticalAlign? this.verticalAlign : "middle"; 

                text_elem.setElementSize(this._getClientWidth(), this._getClientHeight());

                //this.font = this.textedit.font;
                //this.color = this.textedit.color;                
                //  text_elem.setElementFont(this._font);
                //text_elem.setElementColor(this.color);
                //  text_elem.setElementTextAlign("center");
                //   text_elem.setElementVerticalAlign("middle");
                text_elem.setElementText(this._p_text);
                this._text_elem = text_elem;
            }
            this._path_style =
            {
                tool: color,	// "text", "image"
                globalCompositeOperation: this._const_composit_source_over,
                strokeColor: color,
                lineWidth: this._default_line_width,
                eraseWidth: this._default_line_width,
                lineCap: this._default_line_cap,
                lineJoin: this._default_line_join,
                font: this._font || sketchtextarea._getCurrentStyleInheritValue("font"),
                fontColor: color,
                text: ""
            };
        }
    };

    _pSketch.on_created_contents = function (_window)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var canvas_elem_bg = this._canvas_elem_bg;
            var canvas_elem = this._canvas_elem;
            var canvas_elem_tmp = this._canvas_elem_tmp;
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();
            var line_cap = this._default_line_cap;
            var line_join = this._default_line_join;

            if (canvas_elem_bg)
            {
                canvas_elem_bg.create(_window);
                canvas_elem_bg.setElementLineCap(line_cap);
                canvas_elem_bg.setElementLineJoin(line_join);
                canvas_elem_bg.setElementSize(client_width, client_height);
            }

            if (canvas_elem)
            {
                canvas_elem.create(_window);
                canvas_elem.setElementLineCap(line_cap);
                canvas_elem.setElementLineJoin(line_join);
                canvas_elem.setElementSize(client_width, client_height);
            }

            if (canvas_elem_tmp)
            {
                canvas_elem_tmp.create(_window);
                canvas_elem_tmp.setElementLineCap(line_cap);
                canvas_elem_tmp.setElementLineJoin(line_join);
                //canvas_elem_tmp.setElementSize(client_width, client_height);
            }

            //textbox 
            //this.on_apply_applystyletype();

            this.on_apply_text(this._p_text);
            var text_elem = this._text_elem;

            if (text_elem)
            {
                text_elem.create(this._getWindow());
                control_elem.bringToFrontElement(this._canvas_elem);
            }

            //textarea
            var sketchtextarea = this.sketchtextarea;
            sketchtextarea.on_created();
            sketchtextarea.set_width(this._default_edit_width);
            sketchtextarea.set_height(this._default_edit_height);
            sketchtextarea.set_imemode(this._p_imemode);
            sketchtextarea.set_usecontextmenu(this._p_usecontextmenu);
            sketchtextarea.set_readonly(this._p_readonly);
            sketchtextarea.set_visible(false);

            //canvas
            //this._canvas_elem.setElementTextBaseline("top");
            //this._canvas_elem_tmp.setElementTextBaseline("top");
            //this._canvas_elem_bg.setElementTextBaseline("top");
        }
        var canvas_elem_screenXY = this._canvas_elem._getElementScreenXY();
        if (canvas_elem_screenXY)
        {
            this._screenX = canvas_elem_screenXY.x;
            this._screenY = canvas_elem_screenXY.y;
        }
    };

    _pSketch.on_create_contents_command = function ()
    {
        return "";
    };

    _pSketch.on_attach_contents_handle = function (win)
    {
        var canvas_elem_bg = this._canvas_elem_bg;
        var canvas_elem = this._canvas_elem;
        var canvas_elem_tmp = this._canvas_elem_tmp;

        if (canvas_elem_bg)
        {
            canvas_elem_bg.create(win);
        }

        if (canvas_elem)
        {
            canvas_elem.create(win);
        }

        if (canvas_elem_tmp)
        {
            canvas_elem_tmp.create(win);
        }

        var control_elem = this.getElement();
        if (control_elem)
        {
            canvas_elem_bg = this._canvas_elem_bg;
            canvas_elem = this._canvas_elem;
            canvas_elem_tmp = this._canvas_elem_tmp;
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();
            var line_cap = this._default_line_cap;
            var line_join = this._default_line_join;
            //canvas
            //canvas_elem.setElementTextBaseline("top");
            //canvas_elem_tmp.setElementTextBaseline("top");
            //canvas_elem_bg.setElementTextBaseline("top");

            if (canvas_elem_bg)
            {
                //canvas_elem_bg.create(win);
                canvas_elem_bg.setElementLineCap(line_cap);
                canvas_elem_bg.setElementLineJoin(line_join);
                canvas_elem_bg.setElementSize(client_width, client_height);
            }

            if (canvas_elem)
            {
                //canvas_elem.create(win);
                canvas_elem.setElementLineCap(line_cap);
                canvas_elem.setElementLineJoin(line_join);
                canvas_elem.setElementSize(client_width, client_height);
            }

            if (canvas_elem_tmp)
            {
                //canvas_elem_tmp.create(win);
                canvas_elem_tmp.setElementLineCap(line_cap);
                canvas_elem_tmp.setElementLineJoin(line_join);
                //canvas_elem_tmp.setElementSize(client_width, client_height);
            }

            //textbox
            //this.on_apply_applystyletype();

            this.on_apply_text(this._p_text);
            var text_elem = this._text_elem;

            if (text_elem)
            {
                text_elem.create(this._getWindow());
                control_elem.bringToFrontElement(this._canvas_elem);
            }
            //textarea
            var sketchtextarea = this.sketchtextarea;
            sketchtextarea.on_created();
            sketchtextarea.set_width(this._default_edit_width);
            sketchtextarea.set_height(this._default_edit_height);
            sketchtextarea.set_imemode(this._p_imemode);
            sketchtextarea.set_usecontextmenu(this._p_usecontextmenu);
            sketchtextarea.set_readonly(this._p_readonly);
            sketchtextarea.set_visible(false);

        }

        var canvas_elem_screenXY = this._canvas_elem._getElementScreenXY();
        if (canvas_elem_screenXY)
        {
            this._screenX = canvas_elem_screenXY.x;
            this._screenY = canvas_elem_screenXY.y;
        }
    };


    _pSketch.on_destroy_contents = function ()
    {
        var canvas_elem_bg = this._canvas_elem_bg;
        var canvas_elem = this._canvas_elem;
        var canvas_elem_tmp = this._canvas_elem_tmp;

        if (canvas_elem_bg)
        {
            canvas_elem_bg.destroy();
        }

        if (canvas_elem)
        {
            canvas_elem.destroy();
        }

        if (canvas_elem_tmp)
        {
            canvas_elem_tmp.destroy();
        }
    };

    _pSketch.on_change_containerRect = function (width, height)
    {
        if (this._canvas_elem)
        {
            this._canvas_elem.setElementSize(width, height);
        }
        if (this._canvas_elem_bg)
            this._canvas_elem_bg.setElementSize(width, height);
        //if (this._canvas_elem_tmp)
        //    this._canvas_elem_tmp.setElementSize(width, height);
        var text_elem = this._text_elem;
        if (text_elem)
        {
            text_elem.setElementSize(width, height);
        }

        if (this._adjust_height > 0 && this._adjust_width > 0)
        {
            this._restoreSketch();
        }


    };
    _pSketch.on_change_containerPos = function (left, top)
    {
    };

    // ==============================================================================
    // nexacro.Sketch : Properties
    // ==============================================================================
    _pSketch.set_enableredraw = function (v)
    {
        this._p_enableredraw = nexacro._toBoolean(v);
        if (this._p_enableredraw)
        {
            this._redrawPath();
        }
        return v;
    };

    _pSketch.set_editmode = function (editmode)
    {
        var tmp = this._const_stroke;
        switch (editmode)
        {

            case this._const_text:
                this.set_cursor("text");
                tmp = editmode;
                break;
            case this._const_erase:
            case this._const_none:
                this.set_cursor("default");
                tmp = editmode;
                break;
            case this._const_stroke:
                this.set_cursor("default");
                break;
            default:
                break;
        }
        this._p_editmode = tmp;
    };

    _pSketch.set_imemode = function (v)
    {
        if (v != this._p_imemode)
        {
            this._p_imemode = nexacro._toString(v);
            this.on_apply_imemode();
        }
    };

    _pSketch.on_apply_imemode = function ()
    {
        this.sketchtextarea.set_imemode(this._p_imemode);
    };

    _pSketch.set_usecontextmenu = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_usecontextmenu)
        {
            this._p_usecontextmenu = v;
            this.on_apply_usecontextmenu();
        }
    };

    _pSketch.on_apply_usecontextmenu = function ()
    {
        this.sketchtextarea.set_usecontextmenu(this._p_usecontextmenu);
    };

    _pSketch.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pSketch.on_apply_readonly = function (v)
    {
        this._changeStatus("readonly", v);
        var sketchtextarea = this.sketchtextarea;
        if (sketchtextarea)
            sketchtextarea.set_readonly(this._p_readonly);
    };

    _pSketch.set_value = nexacro._emptyFn;// readonly

    _pSketch._set_value = function (v)
    {
        this._p_value = v;
    };

    _pSketch.on_apply_color = function (color)
    {
        nexacro.Component.prototype.on_apply_color.call(this, color);
        var sketchtextarea = this.sketchtextarea;
        if (sketchtextarea)
            sketchtextarea.set_color(color);
        this._path_style.fontColor = this._color;
    };

    _pSketch.on_apply_text = function (text)
    {
        if (this._current_state != -1)
            return;

        var control_elem = this._control_element;
        if (control_elem)
        {
            var text_elem = this._text_elem;
            if (!text_elem)
            {
                text_elem = new nexacro.TextBoxElement(control_elem);
                this._text_elem = text_elem;
                this.on_apply_wordWrap();

                text_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
                text_elem.setElementTextAlign("center");
                text_elem.setElementVerticalAlign("middle");
                if (this._is_created)
                {
                    text_elem.create(this._getRootWindow());
                    control_elem.sendToBackElement(text_elem);
                }
            }
            text_elem.setElementText(text);

        }
    };



    _pSketch.on_apply_wordWrap = function ()
    {
        if (this._text_elem)
        {
            this._text_elem.setElementWordWrap(this._p_wordWrap);
        }
    };

    _pSketch._properties = [{ name: "editmode" }, { name: "enableredraw" }, { name: "redoable", readonly: true },
    { name: "undoable", readonly: true }, { name: "usecontextmenu" }, { name: "readonly" }, { name: "value", readonly: true }
    ];
    nexacro._defineProperties(_pSketch, _pSketch._properties);

    //_pSketch.on_apply_expr = function ()
    //{
    //    if (this._currentPath.length > 0) return;
    //    this.on_apply_text();
    //};
    //========================================================================
    // style update
    //========================================================================
    /*
    _pSketch.set_cssclass = function (cssname)
    {
        cssname = cssname.split(",");

        for (var i = 0; i < cssname.length; i++)
        {
            if (cssname[i] != this.cssclass)
            {
                this.className = this.cssclass = cssname[i];

                if (this.parent)
                {
                    if (this._is_created)
                    {
                        this.on_apply_prop_class();
                    }
                }
                else
                {
                    this.new_class = true;
                }
            }
        }
        this.className = this.cssclass = cssname;
    };
    */

    // ==============================================================================
    // nexacro.Sketch : Methods
    // ============================================================================== 
    _pSketch.loadSketch = function (url)
    {
        if (this._p_readonly)
            return;

        this._imgurl = url;
        return this._loadSketch(url);
    };

    _pSketch.saveSketch = function (format, option)
    {
        //var canvas_elem = this._canvas_elem_tmp;
        var canvas_elem = this._canvas_elem;
        if (canvas_elem)
        {
            var args = nexacro._ImageType.getImageType("base64", format);


            var opt;

            opt = nexacro._ImageType.calcImageQuality(args.datatype, option);
            var img;

            img = canvas_elem.toDataURL(args.datatype, opt);
            if (img && img.src)
            {
                img.setBase64String(img.src);
                this._set_value(img);
                this.on_fire_onsuccess(img);
                return true;
            }
        }
        return false;
    };

    _pSketch._restoreSketch = function ()
    {
        var path = this._currentStrokes();
        var cnt = this._drawpathcount;
        this._drawpathcount = 0;

        var img_obj = this._imgurl;
        if (img_obj)
        {
            var url = "";
            var img_type = this._img_type;
            if (img_type == "url")
            {
                url = nexacro._getURIValue(img_obj);
                url = nexacro._getImageLocation(url, this._getRefFormBaseUrl());
            }
            else
            {
                if (img_obj._base64str)
                    url = img_obj._base64str;
            }
            if (!this._image)
                this._image = new nexacro.ImageSketchBackground(this);
            this._image.set_src(url);
        }
        for (var n = 0, length = path.length; n < length; n++)
        {
            this._regenStroke(path[n], this._canvas_elem);
            this._regenStroke(path[n], this._canvas_elem_tmp);
        }
        this._drawpathcount = cnt;
    };

    _pSketch.saveSketchToFile = function (fileName, fileType, option)
    {
        var errormsg = "";
        if (!fileName)
        {
            errormsg = nexacro._GetSystemErrorMsg(this, this._const_code_savefile_msg);
            this.on_fire_onerror(this, this._const_code_savefile, errormsg, this._const_errortype_obj, this._const_code_savefile, fileName, this._getRefFormBaseUrl());
            return false;
        }


        var args = nexacro._ImageType.getImageType("file", fileType);
        fileType = args.type;
        if (fileType == "JPG" && !option) option = 100;

        if (fileName.lastIndexOf(".") < 0)
        {
            var fileformattype = args.ext;
            fileName = fileName + this._const_dot + fileformattype;
        }


        var rtn = nexacro._saveToImageFile(this, fileName, fileType, option, false, true);   // file 저장 시 생성된 buffer를 인코딩 해야 한다.
        // var rtn = nexacro._saveCanvasToImageFile(this._canvas_elem, fileName, fileType, option, true);  
        // saveSketch 와같이 canvas element의 contents만 저장할 경우(기능 요청이 필요할 경우) 위 주석함수로 교체하고 test - red28540
        if (rtn !== undefined)
        {
            if (rtn)
            {
                if (typeof rtn != "string")
                {

                    // runtime에서 처리되지 못했을 경우
                    /*var canvas_elem = this._canvas_elem;
                    if (canvas_elem)
                    {
                        var img = canvas_elem.toDataURL();
                        if (img && img.src)
                        {
                            img.setBase64String(img.src);
                            this._set_value(img);
                            this.on_fire_onsuccess(img);
                            return true;
                        }
                    }*/
                    errormsg = nexacro._GetSystemErrorMsg(this, this._const_code_savefile_msg);
                    this.on_fire_onerror(this, this._const_code_savefile, errormsg, this._const_errortype_obj, this._const_code_savefile, fileName, this._getRefFormBaseUrl());
                    return false;
                }
                else
                {

                    var imgObj = new nexacro.Image();
                    imgObj.set_src(rtn);
                    imgObj.setBase64String(imgObj.src);
                    this._set_value(imgObj);
                    this.on_fire_onsuccess(imgObj);
                    return true;
                }
            }
            else
            {
                errormsg = nexacro._GetSystemErrorMsg(this, this._const_code_savefile_msg);
                this.on_fire_onerror(this, this._const_code_savefile, errormsg, this._const_errortype_obj, this._const_code_savefile, fileName, this._getRefFormBaseUrl());
                return false;
            }
        }
        return false;
    };
    _pSketch.undo = function ()
    {
        if (this._checkEditmode() == false || this._p_readonly)
            return;

        this._undo();
    };

    _pSketch.redo = function ()
    {
        if (this._checkEditmode() == false || this._p_readonly)
            return;

        this._redo();
    };

    _pSketch.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pSketch.updateToDataset = function ()
    {
        var ret = this.applyto_bindSource("value", this._p_value);
        return ret;
    };

    _pSketch.setBrushType = function (type)
    {
        if (this._checkEditmode() == false)
            return;

        switch (type)
        {
            case "square":
            case "butt":
                this._path_style.lineCap = type;
                break;
            default: //default : round
                this._path_style.lineCap = this._default_line_cap;
                break;
        }
    };

    _pSketch.setBrushSize = function (size)
    {
        if (this._checkEditmode() == false)
            return;

        if (size > 0)
            this._path_style.lineWidth = size;
        else
            this._path_style.lineWidth = this._default_line_width;
    };

    _pSketch.setBrushColor = function (val)
    {
        if (this._checkEditmode() == false)
            return;
        if (val)
        {
            if (this._color == null || this._color.value != val)
            {
                var color = nexacro.ColorObject(val);
                this._color = color;
                this.on_apply_color(color);
            }
        }
        else
        {
            if (this._color)
            {
                this._color = null;
                this.on_apply_color(null);
            }
        }
        //var sketchtextarea = this.sketchtextarea;
        //if (sketchtextarea)
        //{
        //    sketchtextarea.set_color(val);
        //}
        this._path_style.strokeStyle = this._color;
    };

    _pSketch.setTextFont = function (val)
    {
        if (this._checkEditmode() == false)
            return;
        this._p_font = val;
        if (val)
        {
            if (this._font == null || this._font.value != val)
            {
                var font = nexacro.FontObject(val);
                this._font = font;
                this._path_style.font = font;
            }
        }
        else
        {
            if (this._font)
            {
                this._font = null;
                this._path_style.font = this._getCurrentStyleInheritValue("font");
            }
        }
        var sketchtextarea = this.sketchtextarea;
        if (sketchtextarea)
        {
            sketchtextarea.set_font(val);
        }
    };
    /*
    _pSketch.setTextColor = function (strcolor)
    {
        if (this._checkEditmode() == false)
            return;
        //this.set_color(strcolor);

        if (this.textedit)
            this.textedit.set_color(strcolor);
        this._path_style.fontColor = nexacro.ColorObject(strcolor);
    };
    */

    _pSketch.setEraseSize = function (size)
    {
        if (this._checkEditmode() == false)
            return;

        size = +size;
        if (size != size || size < 0)
            size = this._default_line_width;
        this._path_style.eraseWidth = size;
    };

    _pSketch.drawText = function (x, y, text, multiline)
    {
        if (this._checkEditmode() == false)
            return;
        if (this.readonly)
            return;

        var canvas_elem = this._canvas_elem;
        if (canvas_elem)
        {
            this._initPath(this._path_style, this._const_text, x, y, true);

            var coords = this._currentPath[0];
            coords.text = text;
            coords.globalCompositeOperation = this._const_composit_source_over;
            this._drawText(coords, coords.x, coords.y, coords.text, multiline);
        }
    };

    _pSketch.drawStroke = function (x, y, start)
    {
        if (this._checkEditmode() == false || this._p_readonly)
            return;

        if (!x && x == undefined) return;
        if (!y && y == undefined) return;

        x = (x >= 0 || x < 0) ? x : this._default_edit_x;
        y = (y >= 0 || x < 0) ? y : this._default_edit_y;

        start = (!start && start == undefined) ? false : start;

        if (this._startDrawStroke)
        {
            start = true;
            this._startDrawStroke = false;
        }

        this._drawStroke(this._path_style, this._const_stroke, x, y, start);
    };

    _pSketch.drawErase = function (x, y, start)
    {
        if (this._checkEditmode() == false || this._p_readonly)
            return;

        if (!x && x == undefined) return;
        if (!y && y == undefined) return;

        x = (x >= 0 || x < 0) ? x : this._default_edit_x;
        y = (y >= 0 || x < 0) ? y : this._default_edit_y;

        start = (!start && start == undefined) ? false : start;

        if (this._startDrawErase)
        {
            start = true;
            this._startDrawErase = false;
        }
        this._drawStroke(this._path_style, this._const_erase, x, y, start);
    };

    _pSketch.drawStamp = function ()
    {
        //Todo..
    };

    _pSketch.drawTextBox = function ()
    {
        //Todo..
    };

    _pSketch.setStampImage = function ()
    {
        //Todo..
    };

    _pSketch.setTextBoxBkColor = function ()
    {
        //Todo..
    };

    _pSketch.moveTextEditor = function ()
    {
        //Todo..
    };

    _pSketch.resizeTextEditor = function ()
    {
        //Todo..
    };

    _pSketch.clear = function ()
    {
        if (this._checkEditmode() == false)
            return;

        this._clear(this._isEnableRedraw());

        if (this._current_state == -1)
            this.on_apply_text(this.getDisplayText());
    };

    _pSketch.showTextEditor = function (x, y, width, height, text)
    {
        if (!(arguments.length >= 4 && arguments.length < 6))
            return;
        var multiline = false;

        this._initPath(this._path_style, this._const_text, x, y, null, width, height, text);
        //this._drawPath(x, y);
        //this._endPath();

        if (text !== undefined && text != "") multiline = true;
        return this._showTextEditor(x, y, width, height, text, multiline);
    };

    _pSketch.hideTextEditor = function (clear)
    {
        clear = (clear == true || clear == false) ? clear : true;
        return this._hideTextEditor(clear);
    };

    _pSketch.redraw = function ()
    {
        var redraw = this._p_enableredraw;
        this._p_enableredraw = true;
        this._redrawPath();
        this._p_enableredraw = redraw;
    };

    // ==============================================================================
    // nexacro.Sketch : Event Handler
    // ==============================================================================
    _pSketch.on_notify_edit_onkillfocus = function (obj, e)
    {
        var text = obj.text;
        var status = (text.length > 0) ? true : false;
        var multiline = true;
        if (status)
        {
            var canvas_elem = this._canvas_elem;
            if (canvas_elem)
            {
                this._initPath(this._path_style, this._const_text, obj._left, obj._top, true);

                var coords = this._currentPath[0];
                coords.text = text;
                coords.globalCompositeOperation = this._const_composit_source_over;
                this._drawText(coords, coords.x, coords.y, coords.text, multiline);
            }
        }
        this._resetTextEdit(status);
    };

    _pSketch.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        this._touch_count = 0;

        if (this._use_pushed_status)
        {
            this._changeUserStatus("pushed", false);
        }
        return;

    };

    _pSketch._no_bubble_scroll = true;
    _pSketch.on_fire_sys_onfling = function (elem, touch_manager, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        var retn = nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, touch_manager, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);
        if (this._no_bubble_scroll)
            retn = true;

        return retn;
    }

    _pSketch.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp, scroll_start)
    {
        var retn = nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp, scroll_start);
        if (this._no_bubble_scroll)
            retn = true;

        return retn;
    };

    _pSketch.on_fire_ontouchmove = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        if (touchinfos.length == 0)
            return;

        var evt = touchinfos[0];
        this.on_fire_onmousemove("lbutton", null, null, null, evt.screenx, evt.screeny, evt.canvasx, evt.canvasy, evt._canvasx, evt._canvasy, from_comp, from_refer_comp);
    };

    _pSketch.on_fire_sys_ontouchmove = _pSketch.on_fire_ontouchmove;

    _pSketch.on_fire_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        //var ret = true;
        //if ("touch")
        //    var ret = false;

        var _window = this._getWindow();
        if (_window._cur_ldown_elem && _window._cur_ldown_elem.parent && _window._cur_ldown_elem.parent.linkedcontrol && _window._cur_ldown_elem.parent.linkedcontrol instanceof nexacro.Sketch)
        {
            nexacro._getElementPositionInFrame(this.getElement(), true);

            var x = clientX;
            var y = clientY;

            if (nexacro._isMobile && nexacro._isMobile() && nexacro._Browser != "Runtime")
            {
                x = clientX - this._getWindowHandle().scrollX;
                y = clientY - this._getWindowHandle().scrollY;
            }

            this._moveAction(button, x, y);
        }

        return false;
    };

    _pSketch.on_fire_sys_ondragmove = function (src_comp, src_refer_comp, dragdata, userdata,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var retn = nexacro.Component.prototype.on_fire_sys_ondragmove.call(this, src_comp, src_refer_comp, dragdata, userdata,
            button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

        var x = clientX;
        var y = clientY;

        if (nexacro._isMobile && nexacro._isMobile() && nexacro._Browser != "Runtime")
        {
            x = clientX - this._getWindowHandle().scrollX;
            y = clientY - this._getWindowHandle().scrollY;
        }

        this._moveAction(button, x, y);
        return retn;
    };

    _pSketch.on_fire_sys_onmousemove = _pSketch.on_fire_onmousemove;

    _pSketch._moveAction = function (button, clientX, clientY)
    {
        if (nexacro._isMobile && nexacro._isMobile())
        {
            if (this._touch_count < 2) return;
        }

        if (button == "lbutton" || button == "touch")
        {
            if (this._checkEditmode() == false || this._p_readonly)
                return;
            clientY -= nexacro._getCurrentBodyScrollTop();
            if (button == "touch")
            {
                if (this._touch_status == 3)
                {
                    this._touch_status = 0;
                }
                else if (this._touch_status == 1)
                {
                    this._touch_status = 2;
                }


                if (this._touch_status != 0)
                {
                    if (this._path_style.lineCap == "butt")
                    {
                        if (this._butt_count == 3)
                        {
                            this._drawPath(clientX, clientY);
                            this._butt_count = 0;
                        }
                        this._butt_count++;
                    }
                    else
                    {
                        this._drawPath(clientX, clientY);
                    }
                }
            }
            else
            {
                if (this._path_style.lineCap == "butt")
                {
                    if (this._butt_count == 3)
                    {
                        this._drawPath(clientX, clientY);
                        this._butt_count = 0;
                    }
                    this._butt_count++;
                }
                else
                {
                    this._drawPath(clientX, clientY);
                }
            }

        }
    };

    _pSketch.on_fire_ontouchstart = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        if (touchinfos.length == 0)
            return;

        var evt = touchinfos[0];
        this.on_fire_onlbuttondown("lbutton", null, null, null, evt.screenx, evt.screeny, evt.canvasx, evt.canvasy, evt._canvasx, evt._canvasy, from_comp, from_refer_comp);
    };

    // enabletouchevent=false 일 때 lbutton pseudo와 Track 처리를 위한 이벤트(focus 처리 없음, event fire 없음)
    _pSketch._on_touch_lbuttondown = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, meta_key)
    {
        nexacro._skipDragEventAfterMsgBox = false;
        var ret;
        var pThis = this._getFromComponent(this);
        if (!pThis.onlbuttondown || (pThis.onlbuttondown && !pThis.onlbuttondown.defaultprevented))
        {
            this._on_onlbuttondown(button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, canvasX, canvasY, fire_comp, refer_comp, false, meta_key);
            ret = this._on_bubble_touch_lbuttondown(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, false, meta_key); // system event bubble

        }
        return ret;
    };

    _pSketch._on_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._checkEditmode() == false)
            return;
        if (this._p_readonly)
        {
            if (this.sketchtextarea.visible)
                this.sketchtextarea.set_visible(false);
            return;
        }

        var x = clientX;
        var y = clientY;

        if (nexacro._isMobile && nexacro._isMobile() && nexacro._Browser != "Runtime")
        {
            x = clientX - this._getWindowHandle().scrollX;
            y = clientY - this._getWindowHandle().scrollY;
        }

        if (nexacro._isMobile && nexacro._isMobile())
        {
            if (this._getForm().getFocus() == this)
                this._touch_count += 2;
            else
            {
                this._on_focus(true, "lbuttondown");
                this._touch_count++;
            }
        }


        this._delete_text();
        if (button == "touch")
        {
            this._touch_status = 1;
            this._is_touch = true;
        }

        clientY -= nexacro._getCurrentBodyScrollTop();
        this.button = button;

        if (nexacro._isMobile && nexacro._isMobile())
        {
            if (this._getForm().getFocus() == this && this._touch_count > 1)
            {
                this._initPath(this._path_style, this._p_editmode, (x - this._default_edit_gap), y);
                this._drawPath(x, y);
            }
        }
        else
        {
            this._initPath(this._path_style, this._p_editmode, (x - this._default_edit_gap), y);
            this._drawPath(x, y);
        }
        //this._endPath();                
    };

    _pSketch.on_fire_sys_ontouchstart = _pSketch.on_fire_ontouchstart;

    _pSketch.on_fire_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (nexacro._isTouchInteraction && nexacro._SupportTouch && !(this._env._p_enabletouchevent))
        {
            // touchend에서 lbuttnodown 이 발생하는 케이스에서는 skip 하도록 처리.
            return;
        }

        return this._on_onlbuttondown(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pSketch.on_fire_sys_onlbuttondown = _pSketch.on_fire_onlbuttondown;

    _pSketch.on_fire_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        if (touchinfos.length == 0)
            return;
        var evt = touchinfos[0];
        this.on_fire_onlbuttonup("lbutton", null, null, null, evt.screenx, evt.screeny, evt.canvasx, evt.canvasy, evt.clientx - this._screenX, evt.clienty - this._screenY, from_comp, from_refer_comp);
    };

    _pSketch.on_fire_sys_ontouchend = _pSketch.on_fire_ontouchend;

    _pSketch.on_fire_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._checkEditmode() == false || this._p_readonly)
            return;

        if (button == "touch")
            this._touch_status = 3;
        if (nexacro._isMobile && nexacro._isMobile())
        {
            if (this._getForm().getFocus() == this && this._touch_count > 1)
            {
                this._endPath();
            }
        }
        else
        {
            this._endPath();
        }


        if (button == "touch")
        {
            this._delete_text();
            //this._displaytext = "";
        }
    };

    _pSketch.on_fire_sys_onlbuttonup = _pSketch.on_fire_onlbuttonup;


    // enabletouchevent=false 일 때 lbutton pseudo 처리를 위한 이벤트(focus 처리 없음, event fire 없음)
    /*
     _pSketch._on_touch_lbuttonup = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, from_elem)
     {
         var ret;
         var pThis = this._getFromComponent(this);
         if (pThis && (!pThis.onlbuttonup || (pThis.onlbuttonup && !pThis.onlbuttonup.defaultprevented)))
         {
             this.on_fire_onlbuttonup(button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, canvasX, canvasY, fire_comp, refer_comp);
 
             ret = this._on_bubble_touch_lbuttonup(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, from_elem, false); // system event bubble
         }
         return ret;
     };
    */
    _pSketch._endPath = function ()
    {
        var canvas_elem = this._canvas_elem;
        if (!canvas_elem || this._currentPath.length == 0)
            return;

        var currentpath = this._currentPath[0];
        var pathstyle = this._path_style;
        if (this._p_editmode == this._const_text && !this.sketchtextarea.visible && currentpath)
        {
            var font = pathstyle.font;
            var color = pathstyle.fontColor;
            if (font)
                currentpath.font = pathstyle.font;
            if (color && color.value)
                currentpath.fontColor = nexacro.ColorObject(color.value);
        }
        this._regenStroke(this._currentPath, canvas_elem);
        this._regenStroke(this._currentPath, this._canvas_elem_tmp);
    };

    _pSketch.on_fire_oninput = function ()
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            return this.oninput._fireEvent(this, evt);
        }
        return true;
    };

    _pSketch.on_notify_oninput = function ()
    {
        return this.on_fire_oninput();
    };

    _pSketch.on_fire_onload = function (obj, imageurl)
    {
        var event = this.onload;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.SketchLoadEventInfo(this, "onload", imageurl);
            event._fireEvent(this, evt);
        }
    };

    _pSketch.on_fire_onerror = function (obj, fireerrorcode, errormsg, returncode, errstatus, imageurl, locationuri)
    {
        var event = this.onerror;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.SketchErrorEventInfo(this, "onerror", fireerrorcode, errormsg, returncode, errstatus, imageurl, locationuri);
            event._fireEvent(this, evt);
        }
    };

    _pSketch.on_fire_onsuccess = function (handle)
    {
        var event = this.onsuccess;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.SketchEventInfo(this, "onsuccess", handle);
            return this.onsuccess._fireEvent(this, evt);
        }
    };

    // ==============================================================================
    // nexacro.Sketch : Logical Part
    // ==============================================================================
    _pSketch._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        return {
            want_tab: false,
            want_return: false,
            want_escape: false,
            want_chars: false,
            want_arrows: false,
            want_touchstart: true,
            want_touchmove: true // touchmove시 body스크롤 방지
        };
    };

    _pSketch._refresh_contents = function ()
    {
        /*
        this.on_update_style_align();
        this.on_update_style_background();
        this.on_update_style_border();
        this.on_update_style_bordertype();
        this.on_update_style_color();
        this.on_update_style_cursor();
        this.on_update_style_font();
        this.on_update_style_gradation();
        this.on_update_style_opacity();
        this.on_update_style_padding();
        this.on_update_style_shadow();
        if (this._env._p_enableaccessibility)
        {
            this.on_update_accessibility();
        }
        */
    };

    _pSketch._setImageValue = function (image)
    {
        if (image instanceof nexacro.ImageSketchBackground)
        {
            var base64 = image.getBase64String();
            if (!base64)
            {
                var _image = this._canvas_elem.toDataURL();
                if (_image && _image.src)
                {
                    _image.setBase64String(_image.src);
                    this._p_value = _image;
                }
            }
        }
    };

    _pSketch._setImageType = function (v)
    {
        if (v)
        {
            if (v instanceof nexacro.Image)
            {
                v = v._base64str;
                this._img_type = "base64";
            }
            else
            {
                v = v.toString();

                var format = nexacro._transImageBase64StringFormat(v);
                if (format)
                {
                    v = format.alldata;
                    this._img_type = "base64";
                }
                else
                {
                    this._img_type = "url";
                }

            }
        }
        else
        {
            v = "";
            this._img_type = "url";
        }
        return v;
    };

    _pSketch._loadSketch = function (url)
    {
        var errormsg = "";
        this._clearCanvas(this._isEnableRedraw());
        if (this._image)
        {
            //     this._image = null;
        }

        if (typeof (url) == "string")
            url = this._setImageType(url);
        else
            this._setImageType(url);

        var img_type = this._img_type;
        if (url)
        {
            if (img_type == "url")
            {
                url = nexacro._getURIValue(url);
                url = nexacro._getImageLocation(url, this._getRefFormBaseUrl());

                if (nexacro._OS == "iOS" && nexacro._isHybrid())
                {
                    var json = {
                        div: "sketch",
                        method: "toBase64String",
                        params: url
                    };
                    var jsonstr = JSON.stringify(json);
                    url = nexacro.Device.exec(jsonstr, true);
                    if (url == "")
                        url = undefined;
                    else
                        img_type = this._img_type = "base64";
                }
            }
            else
            {
                if (url._base64str)
                    url = url._base64str;
            }
        }

        if (url == undefined || arguments.length > 1)
        {
            errormsg = nexacro._GetSystemErrorMsg(this, this._const_code_parameter_msg);
            this.on_fire_onerror(this, this._const_code_parameter, errormsg, this._const_errortype_obj, this._const_code_parameter, url, this._getRefFormBaseUrl());
            return false;
        }
        if (img_type == "url" && url)
        {
            var imgformat = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
            if ((this._image_format).indexOf(imgformat) == -1)
            {
                errormsg = nexacro._GetSystemErrorMsg(this, this._const_code_incorrectfile_msg);
                this.on_fire_onerror(this, this._const_code_incorrectfile, errormsg, this._const_errortype_type, this._const_code_incorrectfile, url, this._getRefFormBaseUrl());
                return false;
            }
        }

        nexacro._getImageSize(url, this._imageload, this, this._p_parent._getRefFormBaseUrl());
        if (!this._image || !(this._image instanceof nexacro.ImageSketchBackground))
        {
            this._image = null;
            this._image = new nexacro.ImageSketchBackground(this);
        }
        var retn = this._image.set_src(url);
        if (retn)
        {
            if (this._apply_client_padding)
            {
                this._delete_text();
                //this._displaytext = "";
            }

            this._set_value(this._image);
            //this._setImageValue(this._image);
            if (this._clr_history)
            {
                this._initHistory();
                this._setRedoUndo();
            }
            return true;
        }
        return false;
    };

    _pSketch._imageload = function (url, imgsize, size, imgobj, status)
    {
        if (imgsize <= 0)
        {
            this._image = null;
            this._set_value(null);
            this._p_value = null;
            delete nexacro._ImgInfoCacheList[url];
            nexacro._ImgInfoCacheList[url] = null;
        }

    };

    _pSketch._drawText = function (_style, x, y, text, multiline)
    {
        if (this.readonly)
            return;
        if (!text || text.length == 0)
            return;

        var canvas_elem = this._canvas_elem;
        var canvas_elem_tmp = this._canvas_elem_tmp;
        if (canvas_elem)
        {
            if (this._apply_client_padding)
            {
                this._delete_text();
                //this._displaytext = "";
            }

            x = (x >= 0 || x < 0) ? +x : this._default_edit_x;
            y = (y >= 0 || x < 0) ? +y : this._default_edit_y;
            var font = this._font;
            if (font == null)
            {
                font = this.sketchtextarea._getCurrentStyleInheritValue("font");
            }
            canvas_elem.setElementFont(font);
            canvas_elem.setElementGlobalCompositeOperation(_style.globalCompositeOperation);

            canvas_elem_tmp.setElementFont(font);
            canvas_elem_tmp.setElementGlobalCompositeOperation(_style.globalCompositeOperation);

            var tcolor;
            if (_style.fontColor instanceof nexacro.ColorObject)
                tcolor = _style.fontColor;
            else
                tcolor = nexacro.ColorObject(_style.fontColor);

            canvas_elem.setElementFillStyle(tcolor);
            canvas_elem_tmp.setElementFillStyle(tcolor);
            var multiliney = Number(y);

            if (multiline)
            {
                //var v = nexacro._toString(text);
                if (text != "")
                {
                    text = text.replace(/&quot;/g, "\"");
                    if (text.indexOf("\r\n") != -1 || text.indexOf("\n\r") != -1)
                    {
                        text = text.replace(/\r\n/g, "\n").replace(/\n\r/g, "\n");
                    }
                    else
                    {
                        if (text.indexOf("\r") != -1) text = text.replace(/\r/g, "");
                    }

                    var multitext = (text.replace(/\\n/g, '\n')).split("\n");
                    var linespace = this._p_linspace ? this._p_linspace : 10;
                    var fontsize = "";
                    if (font)
                        fontsize = font._size;

                    for (var i = 0; i < multitext.length; i++)
                    {
                        if (this._isEnableRedraw())
                        {
                            canvas_elem.drawFillText(multitext[i], x, multiliney);
                            canvas_elem_tmp.drawFillText(multitext[i], x, multiliney);
                        }
                        multiliney += Number(linespace) + Number(fontsize);
                    }
                }
            }
            else
            {
                if (this._isEnableRedraw())
                {
                    canvas_elem.drawFillText(text, x, multiliney);
                    canvas_elem_tmp.drawFillText(text, x, multiliney);
                }
            }
        }
    };

    _pSketch._drawStroke = function (_style, mode, x, y, start)
    {
        if (this._checkEditmode() == false || this._p_readonly) return;

        if (this._apply_client_padding)
        {
            this._delete_text();
            //this._displaytext = "";
        }

        var clientX = Number(x);
        var clientY = Number(y);
        if (this._currentPath[0] && this._currentPath[0].tool != mode) start = true;

        if (start == true)
        {
            this._initPath(this._path_style, mode, clientX, clientY);
            this._drawPath(clientX, clientY);
        }
        else
        {
            this._drawPath(clientX, clientY);
            this._endPath();
        }
    };

    _pSketch._showTextEditor = function (x, y, width, height, text)
    {
        if (this._checkEditmode() == false)
            return;
        var caretpos = 0;
        var value = null;
        var sketchtextarea = this.sketchtextarea;
        var rettext = sketchtextarea.value;
        //var vscrollbarsize = sketchtextarea.vscrollbar.scrollbarsize;
        //var hscrollbarsize = sketchtextarea.hscrollbar.scrollbarsize;

        if (text)
        {
            value = text;
            caretpos = -1;
        }
        else
        {
            value = rettext;
        }
        if (x >= 0 || x < 0)
            sketchtextarea.set_left(x);
        else
            sketchtextarea.set_left(this._default_edit_x);

        if (y >= 0 || x < 0)
            sketchtextarea.set_top(y);
        else
            sketchtextarea.set_top(this._default_edit_y);

        if (width >= 0 || x < 0)
            sketchtextarea.set_width(Number(width));
        else
            sketchtextarea.set_width(Number(this._default_edit_width));

        if (height >= 0 || x < 0)
            sketchtextarea.set_height(Number(height));
        else
            sketchtextarea.set_height(Number(this._default_edit_height));

        sketchtextarea.set_value(value);
        if (this._isEnableRedraw())
        {
            sketchtextarea.set_visible(true);
            sketchtextarea.setFocus(true);
            sketchtextarea.setCaretPos(caretpos);

            if (text !== undefined && text != "")
            {
                if (text.length > 0) sketchtextarea.setSelect(0, text.length);
            }
        }
        return rettext;
    };

    _pSketch._hideTextEditor = function (clear)
    {
        if (this._checkEditmode() == false)
            return;

        var sketchtextarea = this.sketchtextarea;
        var rettext = sketchtextarea._p_value;

        if (clear)
            sketchtextarea.set_value(undefined);

        if (this._isEnableRedraw())
        {
            sketchtextarea.set_visible(false);
            //this.textedit.set_left(this._default_edit_x);
            //this.textedit.set_top(this._default_edit_y);
            // this._control_element.setElementFocus();
            var _window = this._getWindow();
            _window._removeFromCurrentFocusPath(sketchtextarea, true);
        }
        return rettext;
    };

    _pSketch._redrawPathData = function (path)
    {
        this._clearCanvas(this._isEnableRedraw());

        if (this._image)
        {
            this._loadSketch(this._image._p_src);
        }
        for (var n = 0, length = path.length; n < length; n++)
        {
            this._regenStroke(path[n], this._canvas_elem);
            this._regenStroke(path[n], this._canvas_elem_tmp);
            // this._regenStroke(path[n], this._canvas_elem_bg);
        }
    };

    _pSketch._undoPathData = function (path)
    {
        this._clearPathCanvas(this._isEnableRedraw());

        var _imgurl = this._imgurl;
        if (_imgurl)
        {
            this._loadSketch(_imgurl);
        }

        for (var n = 0, length = path.length; n < length; n++)
        {
            if (path[n][0].strokeStyle == undefined)
                path[n][0].strokeStyle = this._default_stroke_style;

            this._regenStroke(path[n], this._canvas_elem);
            this._regenStroke(path[n], this._canvas_elem_tmp);
            //this._regenStroke(path[n], this._canvas_elem_bg);
        }
    };

    _pSketch._redoPathData = function (path)
    {
        //this._clearCanvas(this._isEnableRedraw());
        /*
        var _imgurl = this._imgurl;
        if (_imgurl)
        {
            this._loadSketch(_imgurl);
        }
        */
        for (var n = this._current_state, length = path.length; n < length; n++)
        {
            this._regenStroke(path[n], this._canvas_elem);
            this._regenStroke(path[n], this._canvas_elem_tmp);
            //this._regenStroke(path[n], this._canvas_elem_bg);
        }
    };

    _pSketch._drawBcurve = function (path, canavs_elem)
    {
        /*
        var length = path.length - 1;
        if (length < 1) return;
        if (strokes)
            start = strokes.length - 1;
        else
            start = length - 1;
        //var start = length - 1;
        var end = length;
        var end_pos = path[length];
        this._setupCanvasElem(canavs_elem, path[0]);
        if (length > 2)
        {   
            var mid_pos = path[length -1];
            canavs_elem.moveTo(mid_pos.x, mid_pos.y);
            canavs_elem.lineTo(end_pos.x, end_pos.y);
        }
        else
            canavs_elem.lineTo(end_pos.x, end_pos.y);
        canavs_elem.stroke();
        */
        var length = path.length - 1;
        if (length < 1) return;

        if (this.button == "touch" || this.button == "lbutton")
        {
            for (var n = this._drawpathcount; n < length; n++)
            {
                var p1 = path[n];
                var p2 = path[n + 1];
                if (n == 0) this._setupCanvasElem(canavs_elem, p1);////, p1);
                else
                    canavs_elem.moveTo(p1.x, p1.y);
                canavs_elem.lineTo(p2.x, p2.y);
            }
        }
        else
        {
            for (var n = this._drawpathcount; n < length; n++)
            {
                var p1 = path[n];
                var p2 = path[n + 1];

                if (n == this._drawpathcount)
                {
                    var _path = this._clone(path[0]);
                    _path.x = p1.x;
                    _path.y = p1.y;

                    this._setupCanvasElem(canavs_elem, _path);////, p1);  // stroke 후에 다시 스타일을 설정해야됨 (for IOS)
                }
                else
                {
                    canavs_elem.moveTo(p1.x, p1.y);
                }
                canavs_elem.lineTo(p2.x, p2.y);
            }
        }

        canavs_elem.stroke();
    };

    _pSketch._drawUserStroke = function (path, canavs_elem)
    {
        var length = path.length - 1;
        if (length < 1) return;
        for (var n = 0; n < length; n++)
        {
            var p1 = path[n];
            var p2 = path[n + 1];
            if (n == 0)
            {
                this._setupCanvasElem(canavs_elem, p1);
                canavs_elem.lineTo(p2.x, p2.y);
                canavs_elem.lineTo(p1.x, p1.y);
            }
            else
            {
                canavs_elem.moveTo(p1.x, p1.y);
                canavs_elem.lineTo(p2.x, p2.y);
                canavs_elem.lineTo(p1.x, p1.y);
            }
            canavs_elem.lineTo(p2.x, p2.y);
        }
        canavs_elem.stroke();
    };

    _pSketch._setupCanvasElem = function (canavs_elem, p1)
    {
        canavs_elem.beginPath();
        canavs_elem.setElementLineCap(p1.lineCap);
        canavs_elem.setElementGlobalCompositeOperation(p1.globalCompositeOperation);
        canavs_elem.moveTo(p1.x, p1.y);
        switch (p1.tool)
        {
            case this._const_erase:
            case this._const_erase_user:
                canavs_elem.setElementStrokeStyle(this._default_stroke_style);
                canavs_elem.setElementLineWidth(p1.eraseWidth + 1.5);   // orginal + outside image (1.5) ouside 부분이 지워지지 않음.
                break;
            case this._const_stroke:
            case this._const_stroke_user:
            default:
                canavs_elem.setElementStrokeStyle(p1.strokeStyle);
                if (p1.lineWidth)
                    canavs_elem.setElementLineWidth(p1.lineWidth);
        }
    };

    _pSketch._regenStroke = function (path, canavs_elem)
    {
        if (this._isEnableRedraw())
        {
            var _path = this._clone(path);

            var tool = (this._is_undo && _path[0].tool != this._const_text) ? this._const_stroke_user : _path[0].tool;
            switch (tool)
            {
                case this._const_text:
                    {
                        var tmp = _path[0];
                        this._drawText(tmp, tmp.x, tmp.y, tmp.text, true);
                    }
                    break;
                case this._const_stroke:
                case this._const_erase:
                    {
                        this._drawBcurve(_path, canavs_elem);
                    }
                    break;
                case this._const_stroke_user:
                case this._const_erase_user:
                    {
                        this._drawUserStroke(_path, canavs_elem);
                    }
                    break;
            }
        }
    };

    _pSketch._clone = function (obj)
    {
        if (!obj || typeof (obj) !== 'object')
            return obj;
        var temp = new obj.constructor();
        for (var key in obj)
        {
            if (!obj[key] || typeof (obj[key]) !== 'object')
            {
                temp[key] = obj[key];
            }
            else
            {
                temp[key] = this._clone(obj[key]);
            }
        }
        return temp;
    };

    _pSketch._undo = function ()
    {
        if (this._undoable())
        {
            this._current_state--;
            this._current_strokes = null;
            this._is_undo = true;
            //this._drawpathcount = 0;
            var path = this._currentStrokes();
            this._clr_history = false;
            if (this._isEnableRedraw())
            {
                this._undoPathData(path);
                this._setRedoUndo();
                if (this._current_state == -1 && !this._image)
                {
                    this.on_apply_text(this.getDisplayText());
                    var control_elem = this.getElement();
                    if (control_elem)
                        control_elem.bringToFrontElement(this._canvas_elem);
                }
            }
            this._clr_history = true;
            this._is_undo = false;
        }
    };

    _pSketch._redo = function ()
    {
        if (this._redoable())
        {
            if (this._current_state == -1)
            {
                this._delete_text();
                //this._displaytext = "";
            }

            this._current_state++;
            this._current_strokes = null;
            this._drawpathcount = 0;
            this._clr_history = false;
            var path = this._currentStrokes();
            this._redoPathData(path);
            this._setRedoUndo();
            this._clr_history = true;
            if (this._current_state == -1 && !this._image)
                this.on_apply_text(this.getDisplayText());
        }
    };

    _pSketch._redrawPath = function ()
    {
        var path = this._currentStrokes();
        this._clr_history = false;
        this._drawpathcount = 0;
        this._redrawPathData(path);
        this._setRedoUndo();
        this._clr_history = true;
        if (this._current_state == -1 && !this._image)
            this.on_apply_text(this.getDisplayText());
        else
            this._delete_text();
    };

    _pSketch._checkEditmode = function ()
    {
        if (this._p_editmode == this._const_none)
            return false;
        return true;
    };

    _pSketch._clearCanvasElem = function (elem)
    {
        if (elem)
        {
            elem.clearRect(0, 0, this._adjust_width, this._adjust_height);
        }
    };

    _pSketch._clearCanvas = function (bEnableRedaw)
    {
        var canvas_elem = this._canvas_elem;
        //var canvas_elem_bg = this._canvas_elem_bg;
        var canvas_elem_tmp = this._canvas_elem_tmp;
        if (canvas_elem)
            this._clearCanvasElem(canvas_elem);
        //if (canvas_elem_bg)
        //    this._clearCanvasElem(canvas_elem_bg);
        if (canvas_elem_tmp)
            this._clearCanvasElem(canvas_elem_tmp);
    };

    _pSketch._clearPathCanvas = function (bEnableRedaw)
    {
        var canvas_elem = this._canvas_elem;
        var canvas_elem_tmp = this._canvas_elem_tmp;
        if (canvas_elem)
            this._clearCanvasElem(canvas_elem);
        if (canvas_elem_tmp)
            this._clearCanvasElem(canvas_elem_tmp);
    };


    _pSketch._clear = function (flag)
    {
        this._hideTextEditor(true);
        if (flag)
        {
            this._clearCanvas(flag);
        }
        this._image = null;
        this._imgurl = "";
        this._initHistory();
        this._setRedoUndo();
        this._startDrawStroke = true;
        this._set_value(null);
    };

    _pSketch._setRedoUndo = function ()
    {
        this._p_redoable = this._redoable();
        this._p_undoable = this._undoable();
    };

    _pSketch._drawPath = function (x, y)
    {
        var coords = {};
        coords.x = x;
        coords.y = y;

        var canvas_elem = this._canvas_elem;
        if (!canvas_elem || !this._currentPath[0])
        {
            return;
        }

        var dest = canvas_elem;
        var tool = this._currentPath[0].tool;

        if (tool != this._const_text && !this._is_touch)
        {
            this._delete_text();
            //this._displaytext = "";
        }

        switch (tool)
        {
            case this._const_text: return;
            case this._const_erase:
            case this._const_erase_user:
                {
                    //dest = canvas_elem;
                }
                break;
        }
        this._currentPath.push(coords);
        this._regenStroke(this._currentPath, dest);
        this._regenStroke(this._currentPath, this._canvas_elem_tmp);
        this._drawpathcount = this._currentPath.length - 1;
    };

    _pSketch._initPath = function (_style, _editmode, clientX, clientY, opt, clientwidth, clientheight, clienttext)
    {
        if ((this._currentPath[0] && this._currentPath[0].tool) == this._const_stroke_user)
        {
            this._endPath();
        }

        var style = this._clone(_style);
        var coords = {};
        coords.x = clientX;
        coords.y = clientY;

        coords.beginPath = true;
        style.tool = _editmode;
        this._drawpathcount = 0;
        var mode = this._const_composit_source_over;
        if (style.tool != this._const_text && this.sketchtextarea.visible)
        {
            this._resetTextEdit(true);
            return;
        }

        switch (style.tool)
        {
            case this._const_erase:
            case this._const_erase_user:
                mode = this._const_composit_destination_out;
                break;
            case this._const_text:
                {
                    if (opt == null)
                    {
                        if (this.sketchtextarea._p_visible)
                        {
                            this._resetTextEdit(true);
                            return;

                        }
                        else
                        {
                            this._showTextEditor(coords.x, coords.y, clientwidth, clientheight, clienttext);
                        }
                    }
                }
                break;
            case this._const_stroke:
            case this._const_stroke_user:
            default:
                break;
        }
        style.globalCompositeOperation = mode;

        for (var key in style)
        {
            coords[key] = style[key];
        }

        this._currentPath = this._add({
            type: _editmode,
            stroke: [coords]
        });

        this._setRedoUndo();

    };

    _pSketch._resetTextEdit = function (arg)
    {
        var sketchtextarea = this.sketchtextarea;
        if (sketchtextarea._p_visible == false) return;
        var editval = sketchtextarea._p_value;
        this._hideTextEditor(true);
        if (editval && arg)
        {
            this._currentPath[0]._p_text = editval;
        }
        else
        {
            this._undo();
            this._setRedoUndo();
        }

        sketchtextarea.set_left(this._default_edit_x);
        sketchtextarea.set_top(this._default_edit_y);
    };

    _pSketch._initHistory = function ()
    {
        this._history = [];
        this._current_state = -1;
        this._freeze_state = -1;
        this._current_strokes = null;
    };

    _pSketch._add = function (action)
    {
        if (this._current_state + 1 < this._history.length)
        {
            this._history.splice(this._current_state + 1, this._history.length - (this._current_state + 1));
        }

        this._history.push(action);
        this._current_state = this._history.length - 1;
        this._current_strokes = null;
        return action.stroke;
    };

    _pSketch._freeze = function (index)
    {
        if (index === undefined)
        {
            this._freeze_state = this._current_state;
        }
        else
        {
            this._freeze_state = index;
        }
    };

    _pSketch._undoable = function ()
    {
        return (this._current_state > -1 && this._current_state > this._freeze_state);
    };

    _pSketch._redoable = function ()
    {
        return this._current_state < this._history.length - 1;
    };

    _pSketch._currentStrokes = function ()
    {
        var cur_strokes = this._current_strokes;
        if (cur_strokes == null)
        {
            var strokes = [];
            for (var i = 0; i <= this._current_state; i++)
            {
                var action = this._history[i];
                switch (action.type)
                {
                    case "init":
                    case "json":
                    case "strokes":
                    case "batch":
                        //jQuery.merge(strokes, action.strokes);
                        break;

                    case "clear":
                        strokes = [];
                        break;
                    case this._const_stroke:
                    case this._const_stroke_user:
                    case this._const_image:
                    case this._const_erase:
                    case this._const_erase_user:
                    case this._const_text:
                    default:
                        strokes.push(action.stroke);
                        break;
                }
            }

            cur_strokes = strokes;
        }
        this._current_strokes = cur_strokes;
        return cur_strokes;
    };


    _pSketch._delete_text = function ()
    {
        if (!this._isEnableRedraw())
            return;
        this._apply_client_padding = false;

        if (this._text_elem)
        {
            const _win = this._getWindow();
            if (_win)
            {
                if (_win._cur_ldown_elem == this._text_elem)
                    _win._cur_ldown_elem = this._canvas_elem;
            }

            this._text_elem.destroy();
            this._text_elem = null;
        }
    };

    _pSketch._isParentdefaultprevented = function (comp, event_name)
    {
        return true;
    };

    _pSketch._getClientXY = function (canvasX, canvasY)
    {
        var border_left = 0, border_top = 0/*, padding_left = 0, padding_top = 0*/;
        var border = this._getCurrentStyleBorder();
        if (border)
        {
            border_top = border._getBorderTopWidth();
            border_left = border._getBorderLeftWidth();
        }

        var clientX = canvasX - border_left;
        var clientY = canvasY - border_top - nexacro._getCurrentBodyScrollTop();

        return [clientX, clientY];
    };

    //delete _pSketch;
    _pSketch = null;

    // ==============================================================================
    // nexacro.SketchEditControl
    // ==============================================================================
    nexacro.SketchEditControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.TextArea.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSketchEditControl = nexacro._createPrototype(nexacro.TextArea, nexacro.SketchEditControl);
    nexacro.SketchEditControl.prototype = _pSketchEditControl;
    _pSketchEditControl._type_name = "TextAreaControl";

    // ==============================================================================
    // nexacro.SketchEditControl : Event Handler
    // ==============================================================================
    _pSketchEditControl.on_fire_sys_onlbuttondown = function ()
    {
        nexacro.TextArea.prototype.on_fire_sys_onlbuttondown.call(this);
        return true;
    };

    _pSketchEditControl.on_fire_sys_ontouchstart = function ()
    {
        nexacro.TextArea.prototype.on_fire_sys_ontouchstart.call(this);
        return true;
    };

    _pSketchEditControl.on_fire_onclick = function ()
    {
        nexacro.TextArea.prototype.on_fire_onclick.call(this);
        return true;
    };

    _pSketchEditControl.on_fire_ontab = function ()
    {
        nexacro.TextArea.prototype.on_fire_ontab.call(this);
        return true;
    };

    //delete _pSketchEditControl;
    _pSketchEditControl = null;

    // ==============================================================================
    // nexacro.ImageSketchBackground
    // ==============================================================================
    nexacro.ImageSketchBackground = function (target)
    {
        nexacro.Image.call(target);
        this._p_parent = target;
    };

    var _pImageSketchBackground = nexacro._createPrototype(nexacro.Image, nexacro.ImageSketchBackground);
    nexacro.ImageSketchBackground.prototype = _pImageSketchBackground;

    // ==============================================================================
    // nexacro.ImageSketchBackground : Override
    // ==============================================================================
    _pImageSketchBackground.on_load = function (imageurl, width, height, handle, errstatus, temp, fireerrorcode, returncode, path, locationuri)
    {
        this._p_width = width;
        this._p_height = height;

        var sketch = this._p_parent;
        if (errstatus < 0)
        {
            var errormsg = "";
            if (fireerrorcode)
            {
                errormsg = nexacro._GetSystemErrorMsg(this, fireerrorcode);
            }
            else
            {
                errormsg = nexacro._GetSystemErrorMsg(this, sketch._const_code_loadinvalidimage_msg).replace("%0", sketch._const_code_loadinvalidimage);
            }

            if (!locationuri)
            {
                locationuri = sketch._getRefFormBaseUrl();
            }

            if (sketch._clr_history)
                sketch.on_fire_onerror(this, fireerrorcode, errormsg, sketch._const_errortype_obj, sketch._const_code_loadinvalidimage, imageurl, locationuri);
        }
        else
        {
            if (handle)
                this.handle = handle;

            var canvas_elem = sketch._canvas_elem;
            var sketch_image = sketch._image;
            if (canvas_elem && sketch_image)
            {
                if (sketch._isEnableRedraw())
                {
                    canvas_elem.drawImage(sketch_image, 0, 0, width, height);
                    if (sketch._canvas_elem_tmp)
                    {
                        sketch._canvas_elem_tmp.drawImage(sketch_image, 0, 0, width, height);
                    }
                    sketch._setImageValue(sketch_image);
                }
                if (sketch._clr_history)
                {
                    sketch.on_fire_onload(this, imageurl);
                }
            }
        }
    };

    _pImageSketchBackground.set_src = function (v)
    {
        if (this._p_src != v)
        {
            this._p_src = v;
            this.handle = nexacro._getImageObject(v, this.on_load, this, this._p_parent._getRefFormBaseUrl());
            if (this.handle)
            {
                return true;
            }
        }
        else
        {
            var width = this._p_width;
            var height = this._p_height;
            var sketch = this._p_parent;
            var canvas_elem = sketch._canvas_elem;
            var sketch_image = sketch._image;
            if (canvas_elem && sketch_image)
            {
                if (sketch._isEnableRedraw())
                {
                    canvas_elem.drawImage(sketch_image, 0, 0, width, height);
                    if (sketch._canvas_elem_tmp)
                    {
                        sketch._canvas_elem_tmp.drawImage(sketch_image, 0, 0, width, height);
                    }
                    return true;
                }
            }
        }
        return false;
    };


    _pImageSketchBackground._properties = [{ name: "src" }];
    nexacro._defineProperties(_pImageSketchBackground, _pImageSketchBackground._properties);

    //delete _pImageSketchBackground;
    _pImageSketchBackground = null;
}