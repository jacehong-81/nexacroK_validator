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
 
// ==============================================================================
// nexacro.GoogleMap 
// ==============================================================================
if (nexacro.Device && nexacro._OS == "Android") 
{ 
	if (!nexacro.GoogleMap) 
	{      	
		nexacro.GoogleMapEventInfo = function (obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses)
		{
		    this.id = this.eventid = id ;
		    this.fromobject = this.fromreferenceobject = obj; 
		    this.centerlocation = centerlocation;
		    this.coordinates = coordinates;
		    this.viewmode = viewmode;
		    this.zoomlevel = zoomlevel;
		    this.addresses = addresses;
		};
		    
		var _pGoogleMapEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapEventInfo);
		nexacro.GoogleMapEventInfo.prototype = _pGoogleMapEventInfo;		    
		_pGoogleMapEventInfo._type_name = "GoogleMapEventInfo";
		
		delete _pGoogleMapEventInfo;
		
		nexacro.GoogleMapErrorEventInfo = function (obj, id, errorcode, errormsg)
		{
		    this.id = this.eventid = id;
		    this.fromobject = this.fromreferenceobject = obj;
		    this.errortype = "ObjectError";
		    this.statuscode = errorcode;
		    this.errormsg = errormsg;
		};

		var _pGoogleMapErrorEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapErrorEventInfo);
		nexacro.GoogleMapErrorEventInfo.prototype = _pGoogleMapErrorEventInfo;
		_pGoogleMapErrorEventInfo._type_name = "GoogleMapErrorEventInfo";

		delete _pGoogleMapErrorEventInfo;

		nexacro.GoogleMapClickEventInfo = function (obj, id, location)
		{
		    this.id = this.eventid = id;
		    this.fromobject = this.fromreferenceobject = obj;
		    this.location = location;
		};

		var _pGoogleMapClickEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapClickEventInfo);
		nexacro.GoogleMapClickEventInfo.prototype = _pGoogleMapClickEventInfo;
		_pGoogleMapClickEventInfo._type_name = "GoogleMapClickEventInfo";

		delete _pGoogleMapClickEventInfo;

		nexacro.GoogleMapDragEventInfo = function (obj, id, location)
		{
		    this.id = this.eventid = id;
		    this.fromobject = this.fromreferenceobject = obj;
		    this.location = location;
		};

		var _pGoogleMapDragEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapDragEventInfo);
		nexacro.GoogleMapDragEventInfo.prototype = _pGoogleMapDragEventInfo;
		_pGoogleMapDragEventInfo._type_name = "GoogleMapDragEventInfo";

		delete _pGoogleMapDragEventInfo;

		nexacro.GoogleMap = function(id, left, top, width, height, right, bottom, parent) 
		{
			nexacro.Component.call(this, id, left, top, width, height, right, bottom, parent);
		
			this._ifrm_elem = null;
		   	this.window = null;
		    this.document = null;
		    this.centerlocation = {
					latitude : 0,
					longitude : 0				
				};
			this.location = {
					latitude : 0,
					longitude : 0				
				};
			this.showmode = 0;
		    this.zoomlevel = 15;
		    this.showzoom = false;
		    this.showmode = false;
		    this.shownavigator = false;
		    this.viewmode = 0;
		    
		    this.items = [];
			// 지도위에 표시할 아이템(GoogleMapMarker/GoogleMapPolyline/GoogleMapPolygon)
			this.itemsname = [];	
			this._itemsname = [];
			this._items = [];
			this._infowindowname = [];
			this._infowindow = [];
			this.bSensor = false;
			this.bLoaded = false;
						
		    this._event_list = {
		        "onclick":1,"ondblclick":1,"onkeypress":1,"onkeydown":1,"onkeyup":1,"onkillfocus":1,"onsetfocus":1,
			    "ondrag":1,"ondragenter":1,"ondragleave":1,"ondragmove":1,"ondrop":1,"onlbuttondown":1,"onlbuttonup":1,
			    "onmouseenter":1,"onmouseleave":1,"onmousemove":1,"onmove":1,"onsize":1,"onrbuttondown":1,"onrbuttonup":1,
			    //added event
			    "onload": 1, "onerror": 1, "onrecvsuccess": 1, "oncenterchanged": 1, "onmapdragstart": 1, "onmapdrag": 1, "onmapdragend": 1
		    };

		    this._location = {
		        latitude: 0,
		        longitude: 0
		    };
		    this._pixel = {
		        x: 0,
		        y: 0
		    };
		};
		
		// TODO expr, usedecorate
		
		var _pGoogleMap = nexacro._createPrototype(nexacro.Component, nexacro.GoogleMap);
		nexacro.GoogleMap.prototype = _pGoogleMap;
		
		_pGoogleMap._type = "GoogleMap";
		_pGoogleMap._type_name = "GoogleMap";
		
		_pGoogleMap.on_create_contents = function() 
		{
		    var control_elem = this.getElement();
			if (control_elem) 
			{
				this._ifrm_elem = new nexacro._GoogleMapPluginElement(control_elem);
				this._ifrm_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
		    }
		};
		
		_pGoogleMap.on_create_contents_command = function ()
		{
		    var control_elem = this.getElement();
		    if (control_elem)
		    {
		        this._ifrm_elem = new nexacro._GoogleMapPluginElement(control_elem);
		        this._ifrm_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
		        return this._ifrm_elem.createCommand();
		    }
		    return "";
		};

		_pGoogleMap.on_attach_contents_handle = function (win)
		{
		    if (this._ifrm_elem)
		        this._ifrm_elem.attachHandle(win);
		};

		_pGoogleMap.on_created_contents = function (win)
		{
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		        ifrm_elem.create(win);
		
		        ifrm_elem.initEvent(); 
		        this.document = ifrm_elem._document;
		        this.window = ifrm_elem._winodw;
		    }
		};
		
		_pGoogleMap.on_destroy_contents = function() 
		{
		    var ifrm_elem = this._ifrm_elem;
		
		    if (ifrm_elem) 
		    {
		        this.window = null;
		        this.document = null;
		        //nexacro._stopSysObserving(this._ifrm_elem, "load", this._loadfunc);
		        ifrm_elem.destroy();
		        this._ifrm_elem = null;
		    }

		    this.items = null;
		    this.itemsname = null;
		    this._itemsname = null;
		    this._items = null;
		    this._infowindowname = null;
		    this._infowindow = null;
		};
		
		// Component's position properties
		_pGoogleMap.on_update_position = function (resize_flag, move_flag, update)
		{
		    nexacro.Component.prototype.on_update_position.call(this, resize_flag, move_flag, update);
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		        ifrm_elem.on_update_position();
		    }
		}; 
		
		_pGoogleMap.on_change_containerRect = function(width, height) 
		{
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem) 
		    {
		        ifrm_elem.setElementSize(width, height);
		    }
		};
			
		_pGoogleMap.on_fire_onload = function (obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses)
		{ 
			if (this.onload && this.onload._has_handlers) 
			{
			    var evt = new nexacro.GoogleMapEventInfo(obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses);
				return this.onload._fireEvent(this, evt);
			}
			return true;
		};
			
		_pGoogleMap.on_fire_onerror = function (obj, id, errorcode, errormsg) 
		{
			if (this.onerror && this.onerror._has_handlers) 
		    {
				var evt = new nexacro.GoogleMapErrorEventInfo(obj, id, errorcode, errormsg);
				return this.onerror._fireEvent(this, evt);
			}
			return true;
		};
			
		_pGoogleMap.on_fire_onrecvsuccess = function (obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses)
		{
			if (this.onrecvsuccess && this.onrecvsuccess._has_handlers) 
			{
				var evt = new nexacro.GoogleMapEventInfo(obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses);
				return this.onrecvsuccess._fireEvent(this, evt);
			}
			return true;
		};
		  
		_pGoogleMap.on_fire_oncenterchanged = function (obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses)
		{
			this.centerlocation = centerlocation;
			this.zoomlevel = zoomlevel;

		 	if (this.oncenterchanged && this.oncenterchanged._has_handlers)
		 	{
		 	    var evt = new nexacro.GoogleMapEventInfo(obj, id, centerlocation, coordinates, viewmode, zoomlevel, addresses);
		 	    return this.oncenterchanged._fireEvent(this, evt);
		 	}
		 	return true;
		};
		
		_pGoogleMap.on_fire_onclick = function (obj, id, location)
		{
		 	if (this.onclick && this.onclick._has_handlers)
		 	{
		 	    var evt = new nexacro.GoogleMapClickEventInfo(obj, id, location);
		 	    return this.onclick._fireEvent(this, evt);
		 	}
		 	return true;
		};
		
		_pGoogleMap.on_fire_ondrag = function (obj, id, location)
		{
		 	if (this.ondrag && this.ondrag._has_handlers)
		 	{
		 	    var evt = new nexacro.GoogleMapDragEventInfo(obj, id, location);
		 	    return this.ondrag._fireEvent(this, evt);
		 	}
		 	return true;
		};

		_pGoogleMap.on_fire_onmapdragstart = function (obj, id, location)
		{
		 	if (this.onmapdragstart && this.onmapdragstart._has_handlers)
		 	{
		 	    var evt = new nexacro.GoogleMapDragEventInfo(obj, id, location);
		 	    return this.onmapdragstart._fireEvent(this, evt);
		 	}
		 	return true;
		};
		 	
		_pGoogleMap.on_fire_onmapdrag = function (obj, id, location)
		{
		 	if (this.onmapdrag && this.onmapdrag._has_handlers)
		 	{
		 	    var evt = new nexacro.GoogleMapDragEventInfo(obj, id, location);
		 	    return this.onmapdrag._fireEvent(this, evt);
		 	}
		 	return true;
		};

		_pGoogleMap.on_fire_onmapdragend = function (obj, id, location)
		{
		 	if (this.onmapdragend && this.onmapdragend._has_handlers)
		 	{
		 	    var evt = new nexacro.GoogleMapDragEventInfo(obj, id, location);
		 	    return this.onmapdragend._fireEvent(this, evt);
		 	}
		 	return true;
		};

		_pGoogleMap._apply_setfocus = function (/*evt_name*/)
		{
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		        ifrm_elem.setElementFocus(true);
		    }
		};
		
		// property
		_pGoogleMap.set_text = function(v) 
		{
			v = nexacro._toString(v);
			if (v && v != this.text) 
		    {
				this.text = v;
				this._displaytext = v.replace(/ /g, "\u00a0");
			}
		};
    
		_pGoogleMap.set_viewmode = function(v) 
		{
		  	if (v == null)
		        return false;
		
		  	if (v != null)
		  	{		  	   
				this.viewmode = v;

				var ifrm_elem = this._ifrm_elem;
		  	    if (ifrm_elem)
		        {
		            var params = '{"value":"' + this.viewmode + '"}';
		            ifrm_elem.setElementParam("viewmode", params);
		        } 		        
		    }  
		    else
		    {
				return false;
			} 
		};
		
		_pGoogleMap.set_zoomlevel = function () { };
		
		_pGoogleMap.set_showzoom = function(v) 
		{
		    if (v == null)
		        return false;
			        
		    if (v != null)
		    {
		        if (v == true || (typeof (v) == "string" && v == "true"))
		        {
		            this.showzoom = true;
		        }
		        else if (v == false || (typeof (v) == "string" && v == "false"))
		        {
		            this.showzoom = false;
		        }
		        else
		        {
		            return false;
		        }		           

			   	var ifrm_elem = this._ifrm_elem;
			   	if (ifrm_elem)
			    {
			        var params = '{"value":"' + this.showzoom + '"}';
			        ifrm_elem.setElementParam("showzoom", params);
			   	}

			    return true; 
			}	    
		};
			
		_pGoogleMap.set_shownavigator = function(v) 
		{
		    if (v == null)
			    return false;
		
			if (v != null)
			{
		        if (v == true || (typeof (v) == "string" && v == "true"))
		        {
					this.shownavigator = true;
		        }
		        else if (v == false || (typeof (v) == "string" && v == "false"))
		        {
					this.shownavigator = false;
		        }
		        else
		        {
					return false;
		        }
				            
				var ifrm_elem = this._ifrm_elem;
			    if (ifrm_elem)
			    {  
			        var params = '{"value":"' + this.shownavigator + '"}';
			        ifrm_elem.setElementParam("shownavigator", params);
			    }    		         
				return true;
			}    	
		};

		_pGoogleMap.set_showmapscale = function () { };
		_pGoogleMap.set_showmode  = function () { };

		_pGoogleMap.set_showcompass = function (v)
		{
		    if (v == null)
			    return false;
		
			if (v != null)
			{
		        if (v == true || (typeof (v) == "string" && v == "true"))
		        {
					this.showcompass = true;
		        }
		        else if (v == false || (typeof (v) == "string" && v == "false"))
		        {
					this.showcompass = false;
		        }
		        else
		        {
					return false;
		        }
		
		        if (this.bLoaded)
		        {
					var ifrm_elem = this._ifrm_elem;
			        if (ifrm_elem)
			        {
			            var params = '{"value":"' + this.showcompass + '"}';
		                ifrm_elem.setElementParam("showcompass", params);
			        }
		        }
				return true;
			}
		};

		_pGoogleMap.set_apikey = nexacro._emptyFn;
		
		_pGoogleMap.set_enable = function (v)
		{
		    v = nexacro._toBoolean(v);
		    if (this.enable != v)
		    {
		        //var control_elem = this._control_element;
		        this.enable = v;
		
		        if (this._is_created)
		        {
		            var enable_flag = (this.parent._real_enable && v);
		            if (this._ifrm_elem)
		            {
		                this._ifrm_elem.setElementEnable(enable_flag);
		            }
		        }
		    }
		};
		
		_pGoogleMap.set_visible = function (v)
		{
		    if (v === undefined || v === null) return;
		    v = nexacro._toBoolean(v);
		
		    nexacro.Component.prototype.set_visible.call(this, v);
		
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		        if (ifrm_elem.setElementVisible != null)
		            ifrm_elem.setElementVisible(v);
		    }
		};
			
		//method
		_pGoogleMap.load = function(bUseSensor, nLatitude, nLongitude, constViewMode, nZoomLevel) 
		{
			var strlength = 0;
		    if (nZoomLevel != null)
			{				
				try 
				{
					strlength = nZoomLevel.toString().split(" ").join("");
				}
		        catch (e)
		        {
					return false;
				}
			
				if (nZoomLevel.length == 0)
				{
					return false;
				}
			
				var nzoom = 0;
				try 
				{
				    nzoom = Number(nZoomLevel.toString());
				}
		        catch (e)
		        {
					return false;
				}
			
				if (nzoom >= 0) // && nzoom <20) {	// zoom max 제한 삭제.
				{
					this.zoomlevel = nzoom;
				}
				else
				{
					return false;
				}
			}
					
		    if ((nLatitude != null) && (nLongitude != null))
			{
				strlength = 0;
				try 
				{
					strlength = nLatitude.toString().split(" ").join("");
				}
		        catch (e)
		        {
					return false;
				}
			
				if (strlength.length == 0)
				{
					return false;
				}
			
				try 
				{
					strlength = nLongitude.toString().split(" ").join("");
				}
		        catch (e)
		        {
					return false;
				}
			
				if (strlength.length == 0)
				{
					return false;
				}
			
				var nlat = 0;
				var nlon = 0;
				try 
				{
					nlat = Number(nLatitude.toString());
				}
		        catch (e)
		        {
					return false;
				}
			           
				if ((+nlat) != (+nlat))
				{
					return false;
				}
				try 
				{
					nlon = Number(nLongitude.toString());
				}
		        catch (e)
		        {
					return false;
				}
			
				if ((+nlon) != (+nlon))
				{
					return false;
				}
				this.centerlocation.latitude = nlat;			
				this.centerlocation.longitude = nlon;
			
				_pGoogleMap.centerlocation = {
					latitude : nlat,
					longitude : nlon
				};
			}
					
			if (constViewMode != null)
			{
				// set constViewMode
				/* 설계 spec 
                    0:일반 google map
                    1:위성 이미지 표시
                    2:위성 이미지를 표시하고 주요 거리의 투명레이어도 함께 표시
                    3:지형 및 초목과 같은 물리적인 지형지물과 함계 주dy 거리 투명 레이어 표시

                    googleMap Library Constant Value
                    0:None
                    1:일반 google map
                    2:위성 이미지 표시
                    3:지형 및 초목과 같은 물리적인 지형지물과 함계 주dy 거리 투명 레이어 표시
                    4:위성 이미지를 표시하고 주요 거리의 투명레이어도 함께 표시

                */
		        if (constViewMode == 0 || (typeof (constViewMode) == "string" && constViewMode == "0"))
		        {
					this.viewmode = 0;
		        }
		        else if (constViewMode == 1 || (typeof (constViewMode) == "string" && constViewMode == "1"))
		        {
					this.viewmode = 1;
		        }
		        else if (constViewMode == 2 || (typeof (constViewMode) == "string" && constViewMode == "2"))
		        {
					this.viewmode = 2;
		        }
		        else if (constViewMode == 3 || (typeof (constViewMode) == "string" && constViewMode == "3"))
		        {
					this.viewmode = 3;
		        }
		        else
		        {
					return false;
				}
			}
			else
			{
				this.viewmode = 0;
			}
					
			if (bUseSensor != null)
			{
				// set bUseSensor
		        if (bUseSensor == true || (typeof (bUseSensor) == "string" && bUseSensor == "true"))
		        {
					this.bSensor = true;
		        }
		        else if (bUseSensor == false || (typeof (bUseSensor) == "string" && bUseSensor == "false"))
		        {
					this.bSensor = false;
		        }
		        else
		        {
					return false;
				}
			}
			else if (bUseSensor == null)
			{
				this.bSensor = false;
			}
						
		    var params = '{"bUseSensor":"' + this.bSensor
		                    + '","nLatitude":"' + this.centerlocation.latitude + '","nLongitude":"' + this.centerlocation.longitude
		                    + '","constViewMode":"' + this.viewmode + '","nZoomLevel":"' + this.zoomlevel + '"}';
		
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		    	ifrm_elem._setLoad(params);
		    }
		    this.bLoaded = true;
		    return true;
		};
			
		_pGoogleMap.setMarkerLoc = function(strItemID, lat, lng)
		{
			this.items[strItemID].location.latitude = lat;			
			this.items[strItemID].location.longitude = lng;
		};
				
		_pGoogleMap.getAddress = function (nLatitude, nLongitude, nMaxResultCount, enumLocale)
		{
		    if (nLatitude == undefined || nLatitude == null) 
		        return false;
		   	
		    if (nLongitude == undefined || nLongitude == null) 
		        return false;
		   	
		    if(nMaxResultCount < 0 )
		        return false;
		   	    
		    if(nMaxResultCount == undefined || nMaxResultCount == null)
		        nMaxResultCount = 1;
		   	    
		    var params = '{"nLatitude":"' + nLatitude
		            + '","nLongitude":"' + nLongitude + '","nMaxResultCount":"' + nMaxResultCount
		            + '","strLocale":"' + enumLocale + '"}';
		
		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		        ifrm_elem._getAddress(params);
		    }
		    return true;
		};
		    
		_pGoogleMap.getCoordinates = function (strAddress)
		{
		    if (strAddress == undefined || strAddress == null || strAddress == "")
		        return false;

		    var ifrm_elem = this._ifrm_elem;
		    if (ifrm_elem)
		    {
		        ifrm_elem._getCoordinates(strAddress);
		    }
		    return true;
		};

		var _itemsname = [];
		var _items = [];
		var _infowindowname = [];
		var _infowindow = [];
				
		_pGoogleMap.addItem = function(strItemID, objComponent)
		{
			//trace("addItem strItemID : " + strItemID + " this.items[strItemID]: " +this.items[strItemID] +" objComponent : " + objComponent );
			var ifrm_elem = this._ifrm_elem;
				
			if (strItemID == null || objComponent == null)
		    {
				return false;
			}
					
			if (strItemID == "" || typeof (strItemID) == "undefined" || objComponent == "" || objComponent == "undefined" || strItemID.trim() == "")
		    {
				return false;
			}
				
			if (typeof (this.items[strItemID]) != "undefined")
		    {
				this.on_fire_onerror(this, "onerror", "1501", "item is already exist."); 
				return false;
			}
				
			if (objComponent instanceof nexacro.GoogleMapMarker || objComponent instanceof nexacro.GoogleMapPolyline
                || objComponent instanceof nexacro.GoogleMapPolygon || objComponent instanceof nexacro.GoogleMapCircle)
		    {
				this.items[strItemID] = objComponent;
				this.items.push(strItemID);
					
				if (this.bLoaded)
				{
				    if (objComponent._type == 0 || objComponent._type == 1)
				    {
						_pGoogleMap.addMarker(ifrm_elem, strItemID, objComponent);
					}
					else if (objComponent._type == 2)
					{
						_pGoogleMap.addPolyline(ifrm_elem, strItemID, objComponent);
					}
					else if (objComponent._type == 3)
					{
						_pGoogleMap.addPolygon(ifrm_elem, strItemID, objComponent);
					}
					else if (objComponent._type == 4)
					{
					    _pGoogleMap.addCircle(ifrm_elem, strItemID, objComponent);
					}
				}
				return true;
			}
		    else
		    {
				return false;
			}
		};
			
		_pGoogleMap.addMarker = function(elem, markName , markObj)
		{	   
			if (markObj.imageurl.length > 0)
			{	
			    var _v = markObj.imageurl.toString().split(" ").join("");
				var img_path = "";
		
				if (_v.substring(0, 9).toLowerCase() == "%userapp%")
				{	
					img_path = "../" + _v.substring(9, _v.length);
					//trace("addMarker img_path : " + img_path);
				}
				else if (_v.substring(0, 9).toLowerCase() == "%sd_card%")
				{
					img_path = "file://mnt/sdcard/NEXACRO/" + _v.substring(9, _v.length);
				}
				else
				{
					var _filecache = nexacro._getFileCache(_v);
					if (null != _filecache)
					{
						img_path = "../" + _filecache;	
					}
					else
					{
						return false;
					}
				}
			}
				
			_itemsname.push(markName);
			_items[markName] = "marker";
			markObj._map = this;
			markObj._name = markName;
				
			var params = '{"itemName":"' + markName
		                    + '","nLatitude":"' + markObj.latitude + '","nLongitude":"' + markObj.longitude
		                    + '","text":"' + markObj.text + '","visible":"' + markObj.visible + '","imageurl":"' + markObj.imageurl
                            + '","draggable":"' + markObj.draggable
		                    + '"}';
		
			if (elem)
			{
				elem._setMarker(params);
			}
		};
			
		_pGoogleMap.addPolygon = function(elem, polygonName, polygonObj)
		{		
			var _lat_lng_arr, _lat, _lng, i;
			var arr_lat = [];
			var arr_lng = [];
						
			//"[37.5665350, 126.9779690][37.515798, 127.072796][37.508781, 127.063166]"
			_lat_lng_arr = polygonObj.locationdata.toString().split("]");
			for (i = 0; i < (_lat_lng_arr.length - 1) ; i++)
			{
				_lat = _lat_lng_arr[i].toString().split(",")[0].split(" ").join().substring(1);
				_lng = _lat_lng_arr[i].toString().split(",")[1].split(" ").join().substring(1);
						
				if (_lat.length > 0 && _lng.length > 0)
				{
					arr_lat.push(_lat);
					arr_lng.push(_lng);
				}				
			}
			
			var _color_stroke;
			if (typeof (nexacro._xreNamedColorList[polygonObj.linecolor]) != "undefined")
			{
			    _color_stroke = nexacro._xreNamedColorList[polygonObj.linecolor] + "FF";
			}
			else
			{
			    _color_stroke = polygonObj.linecolor;
			}
			
			var _color_fill;
			if (typeof (nexacro._xreNamedColorList[polygonObj.linecolor]) != "undefined")
			{
			    _color_fill = nexacro._xreNamedColorList[polygonObj.linecolor] + "FF";
			}
			else
			{
			    _color_fill = polygonObj.linecolor;
			}
			
			var _alpha_stroke_1;
			var _alpha_stroke = 1.0;
			if (_color_stroke.length > 7)
			{
				_alpha_stroke_1 = parseInt(_color_stroke.substring(7), 16);
				_alpha_stroke = _alpha_stroke_1 / 255.0;
			}
			var _alpha_fill_1;
			var _alpha_fill = 1.0;
			if (_color_fill.length > 7)
			{
				_alpha_fill_1 = parseInt(_color_fill.substring(7), 16);
				_alpha_fill = _alpha_fill_1 / 255.0;
			}
		
			_itemsname.push(polygonName);
			_items[polygonName] = "polygon";
		
			polygonObj._map = this;
			polygonObj._name = polygonName;
				
			//trace("addPolyline _color_stroke : " + _color_stroke + " _color_fill : " + _color_fill + " _alpha_stroke : " + _alpha_stroke + " _alpha_fill : " + _alpha_fill);
		
			var params = '{"itemName":"' + polygonName
		                    + '","nLatitude":' + JSON.stringify(arr_lat) + ',"nLongitude":' + JSON.stringify(arr_lng)
		                    + ',"visible":"' + polygonObj.visible + '","linecolor":"' + polygonObj.linecolor
		                    + '","linewidth":"' + polygonObj.linewidth + '","fillbrushcolor":"' + polygonObj.fillbrushcolor
		                    + '"}';
		
			if (elem)
			{
				elem._setPolygon(params);
			}
		};
			
		_pGoogleMap.addPolyline = function(elem, polylineName, polylineObj)
		{		
			var _lat_lng_arr, _lat, _lng, i;
			var arr_lat = [];
			var arr_lng = [];
						
			_lat_lng_arr = polylineObj.locationdata.toString().split("]");
			for (i = 0; i < (_lat_lng_arr.length - 1) ; i++)
			{
				_lat = _lat_lng_arr[i].toString().split(",")[0].split(" ").join().substring(1);
				_lng = _lat_lng_arr[i].toString().split(",")[1].split(" ").join().substring(1);
		
				if (_lat.length > 0 && _lng.length > 0)
				{
					arr_lat.push(_lat);
					arr_lng.push(_lng);
				}
			}	
		
			var _color;
			if (typeof (nexacro._xreNamedColorList[polylineObj.linecolor]) != "undefined")
			{
			    _color = nexacro._xreNamedColorList[polylineObj.linecolor] + "FF";
			}
			else
			{
			    _color = polylineObj.style.strokepen.linecolor;
			}
			
			var _alpha_1;
			//var _alpha = 1.0;
			if (_color.length > 7)
			{
				_alpha_1 = parseInt(_color.substring(7), 16);
				//var _alpha = _alpha_1 / 255.0;
			}
		
			_itemsname.push(polylineName);
			_items[polylineName] = "polyline";
		
			polylineObj._map = this;
			polylineObj._name = polylineName;
			
			var params = '{"itemName":"' + polylineName
		                    + '","nLatitude":' + JSON.stringify(arr_lat) + ',"nLongitude":' + JSON.stringify(arr_lng)
		                    + ',"visible":"' + polylineObj.visible + '","linecolor":"' + polylineObj.linecolor 
		                    + '","linewidth":"' + polylineObj.linewidth
		                    + '"}';
				
			if (elem)
			{
				elem._setPolyline(params);
			}
		};
			
		_pGoogleMap.addCircle = function (elem, circleName, circleObj)
		{		   
		    _itemsname.push(circleName);
		    _items[circleName] = "circle";

		    circleObj._map = this;
		    circleObj._name = circleName;

		    var params = '{"itemName":"' + circleName
		                    + '","nLatitude":' + circleObj.latitude + ',"nLongitude":' + circleObj.longitude
		                    + ',"radius":' + circleObj.radius + ',"visible":"' + circleObj.visible
		                    + '"}';

		    if (elem)
		    {
		        elem._setCircle(params);
		    }
		};

		_pGoogleMap.removeItem = function(strItemID)
		{
			//trace("removeItem strItemID : " + strItemID + " this.bLoaded : " + this.bLoaded);
			var ifrm_elem = this._ifrm_elem;
				
		    if (strItemID == null)		
		    {
		        return false;
		    }
		
		    if (strItemID == "" || typeof (strItemID) == "undefined")
		    {
				return false;
			}
				
		    if (typeof (this.items[strItemID]) == "undefined")
		    {
		        this.on_fire_onerror(this, "onerror", "1502", "item is not exist.");
		        return false;
			}
		    else
		    {
		        delete this.items[strItemID];

		        for (var i = 0; i < this.items.length; i++)
		        {
		            if (this.items[i] == strItemID)
		            {
		                var position = this.items.indexOf(this.items[i]);
		                this.items.splice(position, i + 1);
		            }
		        }

		        if (this.bLoaded)
		        {
		            _pGoogleMap._removeItem(ifrm_elem, strItemID);
		        }

		        return true;
		    }
		};
			
		_pGoogleMap._removeItem = function(elem, itemname)
		{			
			var params = '{"item":"' + _items[itemname]
		                    + '","itemname":"' + itemname 
		                    + '"}';
		
			if (elem)
			{
				elem._setRemove(params);
			}

			delete _items[itemname];		
			for (var i = 0; i < _itemsname.length; i++)
			{
			    if (_itemsname[i] == itemname)
			    {
					_itemsname.splice(i + 1, i + 1);
				}
			}
			return true;		
		};
			
		_pGoogleMap.on_load_handler = function (id, centerlocation, coordinates, viewmode, zoomlevel, addresses)
		{
			this.on_fire_onload(this, id, centerlocation, coordinates, viewmode, zoomlevel, addresses);
		};
			
		_pGoogleMap.on_error_handler = function(id, code, msg) 
		{
			this.on_fire_onerror(this, id, code, msg);        
		};
			
		_pGoogleMap.on_recvsuccess_handler = function (id, centerlocation, coordinates, viewmode, zoomlevel, addresses)
		{
			this.on_fire_onrecvsuccess(this, id, centerlocation, coordinates, viewmode, zoomlevel, addresses);
		};
			
		_pGoogleMap.on_centerchanged_handler = function (id, centerlocation, viewmode, zoomlevel, addresses)
		{
		   this.on_fire_oncenterchanged(this, id, centerlocation, viewmode, zoomlevel, addresses);
		};
		
		_pGoogleMap.on_click_handler = function (id, location)
		{
			this.on_fire_onclick(this, id, location);
		};
		
		_pGoogleMap.on_drag_handler = function (id, location)
		{
			this.on_fire_ondrag(this, id, location);
		};

		_pGoogleMap.on_mapdragstart_handler = function (id, location)
		{
			this.on_fire_onmapdragstart(this, id, location);
		};
			
		_pGoogleMap.on_mapdrag_handler = function (id, location)
		{
			this.on_fire_onmapdrag(this, id, location);
		};

		_pGoogleMap.on_mapdragend_handler = function (id, location)
		{
			this.on_fire_onmapdragend(this, id, location);
		};

		_pGoogleMap.callMethod = function (func)
		{   
		    if (this._ifrm_elem)
		    {
		        this._ifrm_elem.callScriptMethod(func);
		    }
		};
		
		delete _pGoogleMap;
	}
			
	if (!nexacro.GoogleMapMarker)
	{
		nexacro.GoogleMapMarker = function (name/*, obj*/)
		{
		    this._id = nexacro.Device.makeID();
		    nexacro.Device._userCreatedObj[this._id] = this;

		    this.name = name || "";
		    this._type = 0;
		    this.longitude = 0;
		    this.latitude = 0;
		    this.text = "";
		    this.imageurl = "";
		    this.visible = true;
		    this.draggable = false;

		    this.style = {
		        _GoogleMapMarkerID: 0,
		        set_parentID: function (_id)
		        {
		            this._GoogleMapMarkerID = _id;
		        },
		        // property
		        align: {
		            _GoogleMapMarkerID: 0,
		            set_parentID: function (_id)
		            {
		                this._GoogleMapMarkerID = _id;
		            },
		            halign: "center",
		            valign: "middle",
		            // set method
		            set_halign: function (v)
		            {
		                var _v = v.toString().split(" ").join("").toLowerCase();
		                if (_v == "left" || _v == "center" || _v == "right")
		                {
		                    this.halign = _v;

		                    return true;
		                }
		                else
		                {
		                    return false;
		                }
		            },
		            set_valign: function (v)
		            {
		                var _v = v.toString().split(" ").join("").toLowerCase();
		                if (_v == "top" || _v == "middle" || _v == "bottom")
		                {
		                    this.valign = _v;

		                    return true;
		                }
		                else
		                {
		                    return false;
		                }
		            },
		            $s: function (name, fnname, val)
		            {
		                this[name] = val;
		            }
		        },
		       
		        // set method
		        set_align: function (v)
		        {
		            var v_arr = v.split(" ");
		            var ret = true;
		            if (v_arr.length != 2)
		            {
		                return false;
		            }
		            ret = this.align.set_halign(v_arr[0]);
		            if (!ret)
		            {
		                return ret;
		            }
		            ret = this.align.set_valign(v_arr[1]);

		            return ret;
		        },		       
		        $s: function (name, fnname, val)
		        {
		            this[name] = val;
		        }
		    };

		    this._name = null;
		   // this.location.set_parentID(this._id);
		};
		  
		var _pGoogleMapMarker = nexacro.GoogleMapMarker.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapMarker);			
		_pGoogleMapMarker._type_name = "GoogleMapMarker";
			
		_pGoogleMapMarker.set_longitude = function (v)
		{
		    try
		    {
		        this.longitude = Number(v.toString());
		    }
		    catch (e)
		    {
		        return false;
		    }
		    return true;
		};

		_pGoogleMapMarker.set_latitude = function (v)
		{
		    try
		    {
		        this.latitude = Number(v.toString());
		    }
		    catch (e)
		    {
		        return false;
		    }
		    return true;
		};

		_pGoogleMapMarker.set_text = function(v)
		{
			this.text = v;	
			return true;
		};
			
		_pGoogleMapMarker.set_imageurl = function(v)
		{
		    this._type = 1;
		    this.imageurl = v;
		    return true;
		};

		_pGoogleMapMarker.set_draggable = function (v)
		{
			if (v == null)
			{
			    return false;
			}
			else if (v)
			{
			    if (v == true || (typeof (v) == "string" && v == "true"))
			    {
			        this.draggable = true;
			    }
			    else if (v == false || (typeof (v) == "string" && v == "false"))
			    {
			        this.draggable = false;
			    }
			}
			else
			{
			    return false;
			}
		};
			
		_pGoogleMapMarker.set_visible = function(v)
		{
		    if (v == true || (typeof (v) == "string" && v == "true"))
		    {
				this.visible = true;
			}
			else if (v == false || (typeof (v) == "string" && v == "false"))
			{
				this.visible = false;
			}
			else
			{
				return false;
			}
			return true;
		};
			
        /*
		_pGoogleMapMarker.set_style = function (v)
		{
			var v_arr = v.split(";");
			var i = 0;
			var _v_arr;
			var ret = true;
			for (i = 0; i < v_arr.length; i++)
			{
			    _v_arr = v_arr[i].split(":");
			    if (_v_arr.length != 2)
			    {
			        return false;
			    }
			    switch (_v_arr[0].split(" ").join("").toLowerCase())
			    {
			        case "align":
			            ret = this.style.set_align(_v_arr[1]);
			            break;
			        case "image":
			            ret = this.style.set_image(_v_arr[1]);
			            break;
			        default:
			            ret = false;
			            break;
			    }
			    if (!ret)
			    {
			        return ret;
			    }
			}
			return ret;
		};	
        */
		delete _pGoogleMapMarker;	
	}
		
	//==============================================================================
	// nexacro.GoogleMapPolyline
	//
	//==============================================================================
	if (!nexacro.GoogleMapPolyline)
	{
		nexacro.GoogleMapPolyline = function (name/*, obj*/)
		{
		    this._id = nexacro.Device.makeID();
		    nexacro.Device._userCreatedObj[this._id] = this;
		    this.name = name || "";

		    this._type = 2;
		    // 2:polyline
		    this.locationdata = "";
		    this.visible = true;
		    this.linewidth = "";
		    this.linecolor = "";
            
		    this._name = null;
		};
		
		var _pGoogleMapPolyline = nexacro.GoogleMapPolyline.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapPolyline);			
		_pGoogleMapPolyline._type_name = "GoogleMapPolyline";
			
		//Set Property
		_pGoogleMapPolyline.set_locationdata = function (v)
		{
			var _lat_lng_arr;

			_lat_lng_arr = v.toString().split("]");
			if (_lat_lng_arr.length < 2)
			{
			    return false;
			}

			this.locationdata = v;
			return true;
		};
			
		_pGoogleMapPolyline.set_linewidth = function (v)
		{
		    var nWidth = 0;
		    try {
		        nWidth = Number(v.toString());
		    }
		    catch (e) {
		        return false;
		    }

		    if ((+nWidth) != (+nWidth)) {
		        return false;
		    }
		    this.linewidth = nWidth;
		    return true;
		};

		_pGoogleMapPolyline.set_linecolor = function (v)
		{
		    this.linecolor = v;
            return true;
		};

		_pGoogleMapPolyline.set_visible = function (v)
		{
			if (v == true || (typeof (v) == "string" && v == "true"))
			{
			    this.visible = true;
			}
			else if (v == false || (typeof (v) == "string" && v == "false"))
			{
			    this.visible = false;
			}
			else
			{
			    return false;
			}

			return true;
		};
		
		delete _pGoogleMapPolyline;
	}
		
	//==============================================================================
	// nexacro.GoogleMapPolygon
	//
	//==============================================================================
	if (!nexacro.GoogleMapPolygon)
	{
		nexacro.GoogleMapPolygon = function (name/*, obj*/)
		{
		    this._id = nexacro.Device.makeID();
		    nexacro.Device._userCreatedObj[this._id] = this;
		    this.name = name || "";

		    this._type = 3;
		    // 3:polygon
		    this.locationdata = "";
		    this.visible = true;
		    this.linewidth = "";
		    this.linecolor = "";
		    this.fillbrushcolor = "";

		    this._name = null;
		};
		
		var _pGoogleMapPolygon = nexacro.GoogleMapPolygon.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapPolygon);			
		_pGoogleMapPolygon._type_name = "GoogleMapPolygon";
			
		//Set Property
		_pGoogleMapPolygon.set_locationdata = function (v)
		{
			var _lat_lng_arr;

			_lat_lng_arr = v.toString().split("]");
			if (_lat_lng_arr.length < 2)
			{
			    return false;
			}

			this.locationdata = v;
			return true;
		};
		
		_pGoogleMapPolygon.set_linewidth = function (v)
		{
		    var nWidth = 0;
		    try {
		        nWidth = Number(v.toString());
		    }
		    catch (e) {
		        return false;
		    }

		    if ((+nWidth) != (+nWidth)) {
		        return false;
		    }
		    this.linewidth = nWidth;
		    return true;
		};

		_pGoogleMapPolygon.set_linecolor = function (v)
		{
		    this.linecolor = v;
            return true;
		};

		_pGoogleMapPolygon.set_fillbrushcolor = function (v)
		{
		    this.fillbrushcolor = v;
            return true;
		};

		_pGoogleMapPolygon.set_visible = function (v)
		{
			if (v == true || (typeof (v) == "string" && v == "true"))
			{
			    this.visible = true;
			}
			else if (v == false || (typeof (v) == "string" && v == "false"))
			{
			    this.visible = false;
			}
			else
			{
			    return false;			 
			}
			return true;
		};
			
		delete _pGoogleMapPolygon;
	}

    //==============================================================================
    // nexacro.GoogleMapCircle
    //==============================================================================
	if (!nexacro.GoogleMapCircle)
	{
	    nexacro.GoogleMapCircle = function (name/*, obj*/)
	    {
	        this._id = nexacro.Device.makeID();
	        nexacro.Device._userCreatedObj[this._id] = this;
	        this.name = name || "";

	        this._type = 4;
	        // 4:circle
	        this.longitude = 0;
	        this.latitude = 0;

	        this.radius = 100;
	        this.visible = true;	       
	        this._name = null;            	       
	    };

	    var _pGoogleMapCircle = nexacro.GoogleMapCircle.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapCircle);
	    _pGoogleMapCircle._type_name = "GoogleMapCircle";

	    //Set Property
	    _pGoogleMapCircle.set_longitude = function (v)
	    {
	        try
	        {
	            this.longitude = Number(v.toString());
	        }
	        catch (e)
	        {
	            return false;
	        }

	        if ((+this.longitude) != (+this.longitude))
	        {
	            return false;
	        }
	        return true;
	    };

	    _pGoogleMapCircle.set_latitude = function (v)
	    {
	        try
	        {
	            this.latitude = Number(v.toString());
	        }
	        catch (e)
	        {
	            return false;
	        }

	        if ((+this.latitude) != (+this.latitude))
	        {
	            return false;
	        }

	        return true;
	    };

	    _pGoogleMapCircle.set_visible = function (v)
	    {
	        if (v == true || (typeof (v) == "string" && v == "true"))
	        {
	            this.visible = true;
	        }
	        else if (v == false || (typeof (v) == "string" && v == "false"))
	        {
	            this.visible = false;
	        }
	        else
	        {
	            return false;
	        }
	        return true;
	    };
        	    
	    _pGoogleMapCircle.set_radius = function (v)
	    {
	        if (v == null || typeof (v) == "undefined")
	        {
	            this.radius = 100;
	        }
	        else
	        {
	            this.radius = Number(v.toString());
	        }
	    };

	    delete _pGoogleMapCircle;
	}
}    
else if ((nexacro.Device && nexacro._OS != "Windows") || nexacro._Browser != "Runtime" && !(nexacro._Browser == "IE" && nexacro._BrowserVersion <= 8)) // iOS && HTML5
{
	if (!nexacro.GoogleMap)
	{	
		nexacro.GoogleMapEventInfo = function (obj, id, centerlocation, viewmode, zoomlevel, addresses, coordinates)
		{
		    this.id = this.eventid = id ;
		    this.fromobject = this.fromreferenceobject = obj; 
		    this.centerlocation = centerlocation;
		    this.viewmode = viewmode;
		    this.zoomlevel = zoomlevel;
		    this.addresses = addresses;
		    this.coordinates = coordinates;
		};
		    
		var _pGoogleMapEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapEventInfo);
		nexacro.GoogleMapEventInfo.prototype = _pGoogleMapEventInfo;		    
		_pGoogleMapEventInfo._type_name = "GoogleMapEventInfo";
		
		delete _pGoogleMapEventInfo;
		
		nexacro.GoogleMapErrorEventInfo = function (obj, id, errorcode, errormsg)
		{    	
		    this.id = this.eventid = id ;
		    this.fromobject = this.fromreferenceobject = obj; 
		    this.errortype = "ObjectError";
		    this.statuscode = errorcode;
		    this.errormsg = errormsg;
		};
		
		var _pGoogleMapErrorEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapErrorEventInfo);
		nexacro.GoogleMapErrorEventInfo.prototype = _pGoogleMapErrorEventInfo;		    
		_pGoogleMapErrorEventInfo._type_name = "GoogleMapErrorEventInfo";
		
		delete _pGoogleMapErrorEventInfo;
		    
		nexacro.GoogleMapClickEventInfo = function (obj, id, location) {
		    this.id = this.eventid = id;
		    this.fromobject = this.fromreferenceobject = obj;
		    this.location = location;
		};
			
		nexacro.GoogleMapDragEventInfo = function (obj, id, location)
		{
		    this.id = this.eventid = id ;
		    this.fromobject = this.fromreferenceobject = obj; 
			this.location = location;
		};
		    
		var _pGoogleMapDragEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GoogleMapDragEventInfo);
		nexacro.GoogleMapDragEventInfo.prototype = _pGoogleMapDragEventInfo;		    
		_pGoogleMapDragEventInfo._type_name = "GoogleMapDragEventInfo";
		
		delete _pGoogleMapDragEventInfo;

		// ==============================================================================
		// nexacro.Map_Style
		// ==============================================================================
		//nexacro.Map_Style = function(target, idx)
		//{
		//	nexacro.Style.call(this, target, idx);
		//	if (target)
		//	{
		//		this._target = target;
		//	}

		//	// this.modealign = null;
		//	// // this.zoomalign = null;
		//	// this.navigatoralign = null;
		//	// this.mapscalealign = null;
		//	this.zoomalign = {
		//		halign : "",
		//		valign : ""

		//	};
		//	// this.zoomlign = null;
		//	// this.modealign.halign = "right";
		//	// this.modealign.valign = "top";
		//	this.zoomalign.halign = "left";
		//	this.zoomalign.valign = "top";
		//	// this.navigatoralign.halign = "left";
		//	// this.navigatoralign.valign = "top";
		//	// this.mapscalealign.halign = "left";
		//	// this.mapscalealign.valign = "bottom";
		//	// this.enableevent = true;
		//};

		//var _pMapStyle = nexacro._createPrototype(nexacro.Style, nexacro.Map_Style);
		//nexacro.Map_Style.prototype = _pMapStyle;
		//_pMapStyle._type_name = "MapStyle";
			
		//// ==============================================================================

		//eval(nexacro._createAlignAttributeEvalStr("_pMapStyle", "modealign"));
		//eval(nexacro._createAlignAttributeEvalStr("_pMapStyle", "zoomalign"));
		//eval(nexacro._createAlignAttributeEvalStr("_pMapStyle", "navigatoralign"));
		//eval(nexacro._createAlignAttributeEvalStr("_pMapStyle", "mapscalealign"));

		//_pMapStyle.set_zoomalign.valign = function(v)
		//{
		//	_pGoogleMap.set_zoomalign("valign", v);
		//};

		//_pMapStyle.findCurrentZoomalign = function(pseudo)
		//{
		//};

		//_pMapStyle.__custom_emptyObject = function()
		//{
		//	this.modealign = null;
		//	// this.zoomalign = null;
		//	this.navigatoralign = null;
		//	this.mapscalealign = null;
		//};

		//_pMapStyle.__get_custom_style_value = function()
		//{
		//	var val = "";
		//	if (this.modealign._value.length)
		//	{
		//		val += "modealign:" + this.buttonalign._value + "; ";
		//	}
		//	if (this.zoomalign._value.length)
		//	{
		//		val += "zoomalign:" + this.buttonalign._value + "; ";
		//	}
		//	if (this.navigatoralign._value.length)
		//	{
		//		val += "navigatoralign:" + this.buttonalign._value + "; ";
		//	}
		//	if (this.mapscalealign._value.length)
		//	{
		//		val += "mapscalealign:" + this.buttonalign._value + "; ";
		//	}

		//	return val;
		//};

		//nexacro.Map_CurrentStyle = function()
		//{
		//	this.modealign = null;
		//	this.zoomalign = null;
		//	this.zoomalign = {
		//		align : "test1",
		//		valign : "to44p"
		//	};
		//	this.navigatoralign = null;
		//	this.mapscalealign = null;
		//};

		//var _pMapCurrentStyle = nexacro._createPrototype(nexacro.CurrentStyle, nexacro.Map_CurrentStyle);
		//nexacro.Map_CurrentStyle.prototype = _pMapCurrentStyle;

		//_pMapCurrentStyle.__custom_emptyObject = _pMapStyle.__custom_emptyObject;
		//_pMapCurrentStyle.__get_custom_style_value = _pMapStyle.__get_custom_style_value;

		//// end of Button Style
		//delete _pMapStyle;
		//delete _pMapCurrentStyle;

		// ==============================================================================
		// ==============================================================================
		// nexacro.GoogleMap
		// ==============================================================================

		nexacro.googlemaps_loaded = false;
		nexacro.googlemaps_callback = function() 
		{
			nexacro.googlemaps_loaded = true;
		};

		nexacro.load_googlemaps = function (googleapikey)
		{
			if (nexacro.googlemaps_loaded) return;

			var script = document.createElement("script");
			script.type = "text/javascript";
			if (googleapikey)
				script.src = "https://maps.googleapis.com/maps/api/js?key=" + googleapikey + "&callback=nexacro.googlemaps_callback";
			else
				script.src = "https://maps.googleapis.com/maps/api/js?callback=nexacro.googlemaps_callback";
			document.body.appendChild(script);
		};

		nexacro.GoogleMap = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
		{
		    nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
			this._id = nexacro.Device.makeID();
			nexacro.Device._userCreatedObj[this._id] = this;
			this.name = id || "";

			this.centerlocation = {
				latitude : 0,
				longitude : 0
			};

			this.location = {
				latitude : 0,
				longitude : 0
			};
				
			this.coordinates = {
				latitude : 0,
				longitude : 0
			};				
                
			this._map_elem = null;
			this._google_map = null;
			this.maptype = 0;
			this.viewmode = 0;
			// 지도 표시모드 [0],1,2,3
			this.zoomlevel = 15;
			// zoom level 0~19, [17]
			this.zoomalign_halign = "left";
			this.zoomalign_valign = "top";
			this.showmode = false;
			// 지도 표시모드 컨트롤 출력 여부
			this.showzoom = false;
			// 지도 줌 컨트롤 출력 여부
			this.shownavigator = false;
			// 지도 내비게이터 컨트롤 출력 여부
			this.showmapscale = false;
			// 지도 축척 컨트롤 출력 여부
			this.enableevent = true;

			// google api key
			this.apikey = null;

			this.items = [];
			// 지도위에 표시할 아이템(GoogleMapMarker/GoogleMapPolyline/GoogleMapPolygon)
			this.itemsname = [];

			this._itemsname = [];
			this._items = [];
			this._infowindowname = [];
			this._infowindow = [];

			this.bSensor = false;

			this.bLoaded = false;
			this.enable = true;
			//지도 Marker의 Drag&Drop 활성 여부
			this.draggable = false;
			this.googleloaded = null;

			this._event_list = {
				"onclick" : 1,
				"ondblclick" : 1,
				"onkeypress" : 1,
				"onkeydown" : 1,
				"onkeyup" : 1,
				"onkillfocus" : 1,
				"onsetfocus" : 1,
				"ondragstart" : 1,
				"ondrag" : 1,
				"ondragenter" : 1,
				"ondragleave" : 1,
				"ondragmove" : 1,
				"ondragend" : 1,
				"ondrop" : 1,
				"onlbuttondown" : 1,
				"onlbuttonup" : 1,
				"onmouseenter" : 1,
				"onmouseleave" : 1,
				"onmousemove" : 1,
				"onmove" : 1,
				"onsize" : 1,
				"onrbuttondown" : 1,
				"onrbuttonup" : 1,
				// added event
				"onload" : 1,
				"onrecvsuccess" : 1,
				"onoverlayclick" : 1,
				"oncenterchanged" : 1,
				"onviewmodechanged": 1,
				"onzoomchanged": 1,
				"onmapdragstart": 1,
				"onmapdrag": 1,
				"onmapdragend": 1,
				"onerror" : 1
			};
			//nexacro.load_googlemaps();
		};

		var _pGoogleMap = nexacro._createPrototype(nexacro.Component, nexacro.GoogleMap);
		nexacro.GoogleMap.prototype = _pGoogleMap;			
		_pGoogleMap._type_name = "GoogleMap";

		_pGoogleMap.centerlocation = {
			latitude : 0,
			longitude : 0
		};

		nexacro.GoogleMap._default_text_align = nexacro.Component._default_align;
		nexacro.GoogleMap._default_image_align = nexacro.Component._default_buttonimg_align;

		_pGoogleMap.set_draggable = function(v)
		{			
			if (v == null) 
			{
				return false;
			}
			else if (v)
			{
				if (v == true || (typeof (v) == "string" && v == "true"))
				{
					this.draggable = true;
				}
				else if (v == false || (typeof (v) == "string" && v == "false"))
				{
					this.draggable = false;
				}
			}
			else 
			{
				return false;
			}
		};
			
		_pGoogleMap.set_zoomalign = function(name, val)
		{
			if (name == "halign")
			{
				this.zoomalign_halign = val;
			}
			else if (name == "valign")
			{
				this.zoomalign_valign = val;
			}
			else
			{
				return false;
			}

			var __zoomalign = google.maps.ControlPosition.LEFT_TOP;
			__zoomalign = this._getalign(this.zoomalign_halign,
					this.zoomalign_valign);
			this.zoomalign = __zoomalign;

			this._google_map_option_test = {
				zoomControlOptions : {
					position : this.zoomalign,
					style : google.maps.ZoomControlStyle.DEFAULT
				}
			};

			return true;
		};

		_pGoogleMap._getalign = function(h, v)
		{
			if (h == "left")
			{
				if (v == "top")
				{
					return google.maps.ControlPosition.TOP_LEFT;
				}
				else if (v == "middle")
				{
					return google.maps.ControlPosition.LEFT;
				}
				else if (v == "bottom")
				{
					return google.maps.ControlPosition.LEFT_BOTTOM;
				}
			}
			else if (h == "center")
			{
				if (v == "top")
				{
					return google.maps.ControlPosition.TOP;
				}
				else if (v == "bottom")
				{
					return google.maps.ControlPosition.BOTTOM;
				}
			}
			else if (h == "right")
			{
				if (v == "top")
				{
					return google.maps.ControlPosition.TOP_LEFT;
				}
				else if (v == "middle")
				{
					return google.maps.ControlPosition.RIGHT;
				}
				else if (v == "bottom")
				{
					return google.maps.ControlPosition.RIGHT_BOTTOM;
				}
			}
		};

		var _itemsname = [];
		var _items = [];
		var _infowindowname = [];
		var _infowindow = [];

	    _pGoogleMap.set_enableevent = function (v)
	    {
	        this.enableevent = nexacro._toBoolean(v);
	        return v;
	    };
	    
		_pGoogleMap.set_viewmode = function(v)
		{
			if (v == null)
				return false;

			if (v != null)
			{
				this.viewmode = v;
				if (this.bLoaded)
				{
					this._google_map_option = {
						mapTypeId : this._getMapType(this.viewmode)
					};
					this._google_map
							.setOptions(this._google_map_option);
				}
				return true;
			}
			else
			{
				return false;
			}
		};

		_pGoogleMap.__map = function ()
		{
			var obj = document.getElementById(this._id);
			var objDoc = obj.contentWindow || obj.contentDocument;
			return objDoc;
		};

		_pGoogleMap.set_showmode = function(v)
		{
			if (v == null)
				return false;

			if (v != null)
			{
				if (v == true || (typeof (v) == "string" && v == "true"))
				{
					this.showmode = true;
				}
				else if (v == false
						|| (typeof (v) == "string" && v == "false"))
				{
					this.showmode = false;
				}
				else
				{
					return false;
				}

				if (this.bLoaded)
				{
					//var myLatlng = new google.maps.LatLng(37.5640, 126.9751);
					this._google_map_option_test = {
						mapTypeControl : this.showmode,
						mapTypeControlOptions : {
							style : google.maps.MapTypeControlStyle.DEFAULT,
							position : this.modealign
						}
					};

					this._google_map
							.setOptions(this._google_map_option_test);
				}
				return true;
			}
		};

		_pGoogleMap.set_showmapscale = function (v)
		{
			if (v == null)
			    return false;

			if (v != null)
			{
			    if (v == true || (typeof (v) == "string" && v == "true"))
			    {
			        this.showmapscale = true;
			    }
			    else if (v == false
						|| (typeof (v) == "string" && v == "false"))
			    {
			        this.showmapscale = false;
			    }
			    else
			    {
			        return false;
			    }

			    if (this.bLoaded)
			    {
			        this._google_map_option_test = {
			            mapTypeControl: this.showmapscale
			        };

			        this._google_map
							.setOptions(this._google_map_option_test);
			    }
			    return true;
			}
		};

		_pGoogleMap.set_showmapscale = function(v)
		{
			if (v == null)
				return false;

			if (v != null)
			{
				if (v == true || (typeof (v) == "string" && v == "true"))
				{
					this.showmapscale = true;
				}
				else if (v == false	|| (typeof (v) == "string" && v == "false"))
				{
					this.showmapscale = false;
				}
				else
				{
					return false;
				}

				if (this.bLoaded)
				{
					this._google_map_option_test = {
						scaleControl : this.showmapscale
					};
					this._google_map
							.setOptions(this._google_map_option_test);
				}
				return true;
			}
		};

		_pGoogleMap.set_shownavigator = function(v)
		{
			if (v == null)
				return false;

			if (v != null)
			{
				if (v == true || (typeof (v) == "string" && v == "true"))
				{
					this.shownavigator = true;
				}
				else if (v == false	|| (typeof (v) == "string" && v == "false"))
				{
					this.shownavigator = false;
				}
				else
				{
					return false;
				}

				if (this.bLoaded)
				{
					//var myLatlng = new google.maps.LatLng(37.5640, 126.9751);
					this._google_map_option_test = {
						panControl : this.shownavigator
					};
					this._google_map
							.setOptions(this._google_map_option_test);
				}
				return true;
			}
		};

		_pGoogleMap.set_apikey = function(v)
		{
			if (v == null)
				return false;

			this.apikey = v;
		}

		_pGoogleMap._set_option = function()
		{
			var _mapType = this._getMapType();

			// var modealign = _getModeAlign();
			// var zoomalign = _getZoomAlign();
			// var navigatoralign = _getNavigatorAlign();
			// var mapscalealign = _getMapscaleAlign();

			var myOptions = {
				center : new google.maps.LatLng(
						this.centerlocation.latitude,
						this.centerlocation.longitude),
				mapTypeId : _mapType,
				zoom : this.zoomlevel,
				disableDefaultUI : true,
				mapTypeControl : this.showmode,
				mapTypeControlOptions : {
					style : google.maps.MapTypeControlStyle.DEFAULT,
					position : this.modealign
				},
				scaleControl : this.showmapscale,
				scaleControlOptions : {
					position : this.mapscalealign
				},
				panControl : this.shownavigator,
				panControlOptions : {
					position : this.navigatoralign
				},
				zoomControl : this.showzoom,
				zoomControlOptions : {
					position : this.zoomalign,
					style : google.maps.ZoomControlStyle.SMALL
				}
			};
			// map.setOptions(myOptions);
			return myOptions;
		};

		_pGoogleMap._getMapType = function(v)
		{
			var __maptype = google.maps.MapTypeId.ROADMAP;
			switch (v)
			{
				default:
				case 0:
					__maptype = google.maps.MapTypeId.ROADMAP;
					break;
				case 1:
					__maptype = google.maps.MapTypeId.SATELLITE;
					break;
				case 2:
					__maptype = google.maps.MapTypeId.HYBRID;
					break;
				case 3:
					__maptype = google.maps.MapTypeId.TERRAIN;
					break;
			}
			return __maptype;
		};

		_pGoogleMap.map_starter = function (v)
		{
			//var map_type = this._getMapType();
			this._google_map.setOptions(this.setOptions());
		};

		_pGoogleMap.set_zoomlevel = function(v)
		{
			this.zoomlevel = Number(v.toString());
		};
			
		_pGoogleMap.set_enable = function(v)
		{
			if (v == null)
			{
			    return false;
			}
			else if (v)
			{
			    if (v == true || (typeof (v) == "string" && v == "true"))
			    {
			        this.enable = true;
			    }
			    else if (v == false || (typeof (v) == "string" && v == "false"))
			    {
			        this.enable = false;
			    }
				if (this.bLoaded)
				{
					this._google_map_option = {
						draggable : this.enable
					};
					this._google_map
							.setOptions(this._google_map_option);
				}
				return true;
			}
			else
			{
			    return false;
			}
		};

		_pGoogleMap.set_showzoom = function(v)
		{   
			if (v == null)
				return false;

			if (v)
			{
				if (v == true || (typeof (v) == "string" && v == "true"))
				{
					this.showzoom = true;
				}
				else if (v == false
						|| (typeof (v) == "string" && v == "false"))
				{
					this.showzoom = false;
				}
				else
				{
					return false;
				}

				if (this.bLoaded)
				{
					//var myLatlng = new google.maps.LatLng(37.5640, 126.9751);
				    this._google_map_option_test = {
						center : new google.maps.LatLng(
								this.centerlocation.latitude,
								this.centerlocation.longitude),
						zoomControl : this.showzoom
					};                    
					this._google_map
							.setOptions(this._google_map_option_test);
				}
				return true;
			}
		};

		// ---------------------------------------------------------------
		

		_pGoogleMap.on_apply_text = function()
		{
			var control_elem = this._control_element;
			if (this._control_element)
			{
				var text_elem = this._text_elem;
				if (!text_elem)
				{
					text_elem = new nexacro.TextBoxElement(control_elem);
					this._text_elem = text_elem;
					text_elem.setElementSize(this._getClientWidth(),
							this._getClientHeight());
					text_elem.setElementColor(this.currentstyle.color);
					text_elem.setElementFont(this.currentstyle.font);
					text_elem.setElementAlign(this.currentstyle.align);

					if (this._is_created)
					{
						text_elem.create();
					}
				}

				if (this.text != "")
				{
					text_elem.setElementText(this.text);
					this._text_width = -1;
					this._text_height = -1;
					if (this._img_elem)
					{
						this._updateElementPositions(this.currentstyle.align, this.currentstyle.imagealign);
					}
				}
				else
				{
					text_elem.setElementText("");
					this._text_width = 0;
					this._text_height = 0;
					if (this._img_elem)
					{
					    this._updateElementPositions(this.currentstyle.align, this.currentstyle.imagealign);
					}
				}
			}
		};

		_pGoogleMap.on_apply_expr = function()
		{
			var control = this.getElement();
			var expr = this.expr;

			if (control && expr.length > 0)
			{
				// 1. expr - Uppercase and lowercase lgnore
				// 2. Ignore blank
				// 3. work without "epxr:"

				// Separated by ":" -> expr string exists and other case are
				// separated
				expr = expr.trim().split(":");
				var len = expr.length;
				var parser = new nexacro.ExprParser();
				var conv_expr, exprfn;
				var str;

				if (len == 1)// When there is not "|"
				{
					str = expr[0];
				}
				else
				// When there is "|"
				{
					if (expr[0].trim().toUpperCase() != "EXPR")// expr
																// string
																// exists
																// this.expr
																// =
																// "param1?"true":"false";
					{
						str = expr.join(":");
					}
					else
					// expr string not exist --> first Array delete and add
					// up
					{
						str = expr.slice(1).join(":");
					}
				}

				conv_expr = parser.makeExpr(this, str);
				exprfn = nexacro._createInlineFunc(conv_expr, []);

				if (exprfn)
				{
					try
					{
						this.set_text(exprfn.call(this));
					}
					catch (e)
					{
						return;
					}
				}
			}
		};

		// override for tabIndex set to textElem
		_pGoogleMap.on_apply_prop_taborder = function()
		{
			var textElem = this._text_elem;
			if (textElem)
			{
				if (this.tabstop)
				{
					textElem.setElementTabIndex(this.taborder);
				}
				else
				{
					textElem.setElementTabIndex(-1);
				}
			}
		};
		// ===============================================================
		// nexacro.GoogleMap : Map's Create & Update
		// ---------------------------------------------------------------
		_pGoogleMap.on_create_contents = function()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{
				this._map_elem = new nexacro.Element(control_elem);
				this._map_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
			}
		};
			
		_pGoogleMap.on_create_contents_command = function ()
		{
			var control_elem = this.getElement();
			if (control_elem)
			{					
				this._map_elem = new nexacro.Element(control_elem);
				this._map_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
				this._map_elem.setElementTypeCSSSelector("nexamap");
							
				return this._map_elem.createCommand();
			}
			return "";
		};

		_pGoogleMap.on_attach_contents_handle = function (win)
		{
			if (this._map_elem)
				this._map_elem.attachHandle(win);
		};

		_pGoogleMap.on_created_contents = function (win)
		{
			var map_elem = this._map_elem;
			if (map_elem)
			{
				map_elem.setElementTypeCSSSelector("nexamap");
				map_elem.create(win);
			
				this.document = map_elem._document;
				this.window = map_elem._winodw;
			}
		};

		_pGoogleMap.on_destroy_contents = function()
		{
			var map_elem = this._map_elem;
			if (map_elem)
			{
				map_elem.destroy();
				this._map_elem = null;
			}
		};

		_pGoogleMap.__onTextchanged = function(/*obj, e*/)
		{
		};

		_pGoogleMap.load = function(bUseSensor, nLatitude, nLongitude, constViewMode, nZoomLevel, retry)
		{
			if (nexacro.googlemaps_loaded == false)
			{
				if (!retry)
					nexacro.load_googlemaps(this.apikey);

				var target = this;
				//setTimeout(function ()
				nexacro._OnceCallbackTimer.callonce(target, function ()
				{
					target.load(bUseSensor, nLatitude, nLongitude,constViewMode, nZoomLevel, true);
				}, 500);
				
				return;
			}
				
			this._id = nexacro.Device.makeID();
			var parentMap = nexacro.Device._userCreatedObj[this._id] = this;

			var strlength = 0;
			var myLatlng;

			if (nZoomLevel)
			{	
				try
				{
					strlength = nZoomLevel.toString().split(" ").join("");
				}
				catch (e)
				{
					return false;
				}

				if (nZoomLevel.length == 0)
				{
					return false;
				}

				var nzoom = 0;
				try
				{
					nzoom = Number(nZoomLevel.toString());
				}
				catch (e)
				{
					return false;
				}

				if (nzoom >= 0)
				{
					this.zoomlevel = nzoom;
				}
				else
				{
					return false;
				}
			}

			if (constViewMode)
			{
				if (constViewMode == 0
						|| (typeof (constViewMode) == "string" && constViewMode == "0"))
				{
					this.viewmode = 0;
				}
				else if (constViewMode == 1
						|| (typeof (constViewMode) == "string" && constViewMode == "1"))
				{
					this.viewmode = 1;
				}
				else if (constViewMode == 2
						|| (typeof (constViewMode) == "string" && constViewMode == "2"))
				{
					this.viewmode = 2;
				}
				else if (constViewMode == 3
						|| (typeof (constViewMode) == "string" && constViewMode == "3"))
				{
					this.viewmode = 3;
				}
				else
				{
					return false;
				}
			}
			else
			{
				this.viewmode = 0;
			}

			if (nLatitude && nLongitude)
			{

				strlength = 0;
				try
				{
					strlength = nLatitude.toString().split(" ").join("");
				}
				catch (e)
				{
					return false;
				}
				if (strlength.length == 0)
				{
					return false;
				}
				try
				{
					strlength = nLongitude.toString().split(" ").join("");
				}
				catch (e)
				{
					return false;
				}
				if (strlength.length == 0)
				{
					return false;
				}

				var nlat = 0;
				var nlon = 0;
				try
				{
					nlat = Number(nLatitude.toString());

				}
				catch (e)
				{
					return false;
				}

				if ((+nlat) != (+nlat))
				{
					return false;
				}
				try
				{
					nlon = Number(nLongitude.toString());
				}
				catch (e)
				{
					return false;
				}

				if ((+nlon) != (+nlon))
				{
					return false;
				}
				this.centerlocation.latitude = nlat;
				this.centerlocation.longitude = nlon;

				_pGoogleMap.centerlocation = {
					latitude : nlat,
					longitude : nlon
				};
			}

			if (bUseSensor)
			{
				// set bUseSensor
				if (bUseSensor == true
						|| (typeof (bUseSensor) == "string" && bUseSensor == "true"))
				{
					this.bSensor = true;
				}
				else
				{
					this.bSensor = false;
				}

				if (constViewMode == null)
				{
					this.viewmode = 0;
				}
			}
			else
			{
				this.bSensor = false;
			}

			var map_elem = this._map_elem;
			if (map_elem)
			{
				map_elem.create();
			}
				
			if (this.bSensor)
			{
				if (navigator.geolocation)
				{
					//browserSupportFlag = true;
					navigator.geolocation.getCurrentPosition(function(position)
					{
						var initialLocation = new google.maps.LatLng(position.coords.latitude,
								position.coords.longitude);
						google_map.setCenter(initialLocation);
				
					}, function()
					{
						parentMap._apply_onerror({errorcode:"1503", errormsg:"Device provider disable"});
					});
					// Try Google Gears Geolocation
				}
				else if (google.gears)
				{
					var geo = google.gears.factory.create('beta.geolocation');
					geo.getCurrentPosition(function(position)
					{
						var initialLocation = new google.maps.LatLng(position.latitude,
								position.longitude);
				
						var myLatlng = new google.maps.LatLng(position.latitude,
								position.longitude);
						google_map.setCenter(initialLocation);
				
					}, function()
					{
						parentMap._apply_onerror({errorcode:"1503", errormsg:"Device provider disable"});
					});
					// Browser doesn't support Geolocation
					return false;
				}
			}
			else
			{
				myLatlng = new google.maps.LatLng(this.centerlocation.latitude, this.centerlocation.longitude);
			}

			this._google_map_option = {
				center: myLatlng, //좌표
				panControl: this.shownavigator, //컨트롤 (위아래좌우 이동 표시기)
				zoomControl : this.showzoom,
				mapTypeControl : this.showmode,
				scaleControl : this.showmapscale,
				zoom : this.zoomlevel,
				disableDefaultUI : true,
				draggable : this.enable,
				mapTypeId : _pGoogleMap._getMapType(this.viewmode)
			};

			google_map = new google.maps.Map(map_elem.handle, this._google_map_option);				
			this._google_map = google_map;
			_pGoogleMap._google_map = this._google_map;

			for (var i = 0; i < this.itemsname.length; i++)
			{
				if (this.items[this.itemsname[i]]._type == 0
						|| this.items[this.itemsname[i]]._type == 1)
				{
					_pGoogleMap.addMarker(this.itemsname[i], this.items[this.itemsname[i]]);
				}
				else if (this.items[this.itemsname[i]]._type == 2)
				{
					_pGoogleMap.addPolyline(this.itemsname[i], this.items[this.itemsname[i]]);
				}
				else if (this.items[this.itemsname[i]]._type == 3)
				{
					_pGoogleMap.addPolygon(this.itemsname[i], this.items[this.itemsname[i]]);
				}
				else if (this.items[this.itemsname[i]]._type == 4)
				{
				    _pGoogleMap.addCircle(this.itemsname[i], this.items[this.itemsname[i]]);
				}
			}
				
			google.maps.event.addListener(google_map, 'click', function(e)
			{
			    if(parentMap.onclick && parentMap.onclick._has_handlers && parentMap.enableevent)
				{
				    parentMap.location.latitude = e.latLng.lat();
				    parentMap.location.longitude = e.latLng.lng();

				    var evt = new nexacro.GoogleMapClickEventInfo(parentMap, "onclick", parentMap.location);

				    parentMap.onclick._fireEvent(this, evt);
				}
				return true;
			});
					
			google.maps.event.addListener(google_map, 'dragstart', function(e)
			{				
			});
					
			google.maps.event.addListener(google_map, 'mouseout', function(e)
			{	
			});
					
			google.maps.event.addListener(google_map, 'dragenter', function(e)
			{
			});
					
			google.maps.event.addListener(google_map, 'drag', function(e)
			{
			});
				
			google.maps.event.addListener(google_map, 'dragend', function(e)
			{
			});

			google.maps.event.addListener(google_map, 'center_changed', function (e)
			{
			    if(parentMap.oncenterchanged && parentMap.oncenterchanged._has_handlers && parentMap.enableevent)
				{
				    parentMap.centerlocation.latitude = google_map.getCenter().lat();
				    parentMap.centerlocation.longitude = google_map.getCenter().lng();

				    var evt = new nexacro.GoogleMapEventInfo(parentMap, "oncenterchanged",
                            parentMap.centerlocation, parentMap.viewmode, parentMap.zoomlevel,
                            parentMap.addresses, parentMap.coordinates);

				    parentMap.oncenterchanged._fireEvent(this, evt);
				}
				return true;
			});

			google.maps.event.addListener(google_map, 'maptypeid_changed', function(e)
			{
			    if(parentMap.onviewmodechanged && parentMap.onviewmodechanged._has_handlers && parentMap.enableevent)
				{
					var evt = new nexacro.GoogleMapEventInfo(parentMap, "onviewmodechanged",
							parentMap.centerlocation, parentMap.viewmode, parentMap.zoomlevel,
							parentMap.addresses, parentMap.coordinates);

					parentMap.onviewmodechanged._fireEvent(this, evt);
				}
                return true;	
			});
					
			google.maps.event.addListener(google_map, 'zoom_changed', function (e)
			{
			    if(parentMap.onzoomchanged && parentMap.onzoomchanged._has_handlers && parentMap.enableevent)
				{
				    parentMap.zoomlevel = google_map.getZoom();

				    var evt = new nexacro.GoogleMapEventInfo(parentMap, "onzoomchanged",
                                parentMap.centerlocation, parentMap.viewmode, parentMap.zoomlevel,
                                parentMap.addresses, parentMap.coordinates);

				    parentMap.onzoomchanged._fireEvent(this, evt);
				}
				return true;
			});
            
			this.bLoaded = true;

			this._apply_onload();
			return true;
		};

		_pGoogleMap.setMarkerLoc = function(strItemID, lat, lng)
		{
			//console.log("MOVE:::id=>" + strItemID + " lat=>" + lat
			//		+ " lng=>" + lng);
			this.items[strItemID].location.latitude = lat;

			//console.log(this.items[strItemID].location.latitude);
			this.items[strItemID].location.longitude = lng;
		};
            			
		_pGoogleMap.getAddress = function (nLatitude, nLongitude, nMaxResultCount, strLocale)
		{
			if (nLatitude == undefined || nLatitude == null)
			    return false;

			if (nLongitude == undefined || nLongitude == null)
			    return false;

			if (nMaxResultCount < 0)
			    return false;

			if (nMaxResultCount == undefined || nMaxResultCount == null)
			    nMaxResultCount = 1;

			var params = '{"nLatitude":"' + nLatitude
                        + '","nLongitude":"' + nLongitude + '","nMaxResultCount":"' + nMaxResultCount
                        + '","strLocale":"' + strLocale + '"}';

			var jsonstr = '{"id":' + this._id + ', "div":"NexacroMap", "method":"getAddress", "params":' + params + '}';
			nexacro.Device.exec(jsonstr);

			return true;
		};
			
		_pGoogleMap.getCoordinates = function (strAddress)
        {
		    if (strAddress == undefined || strAddress == null || strAddress == "")
				return false;
	            
		    var params = '{"straddress":"' + strAddress + '"}';
            var jsonstr = '{"id":' + this._id + ', "div":"NexacroMap", "method":"getCoordinates", "params":' + params + '}';
                  
            nexacro.Device.exec(jsonstr);
 
            return true;
        };
		   
		_pGoogleMap.addItem = function (strItemID, objItem)
		{
			this._id = nexacro.Device.makeID();
			var parentMap = nexacro.Device._userCreatedObj[this._id] = this;
				
			if (strItemID == null || objItem == null)
			{
				return false;
			}

			if (strItemID == "" || typeof (strItemID) == "undefined"
					|| objItem == "" || objItem == "undefined"
					|| strItemID.trim() == "")
			{
				return false;
			}

			if (typeof (this.items[strItemID]) != "undefined")
			{
				this._apply_onerror({
					errorcode : "1501",
					errormsg : "item is already exist."
				});
				return false;
			}

			if (objItem instanceof nexacro.GoogleMapMarker
					|| objItem instanceof nexacro.GoogleMapPolyline
					|| objItem instanceof nexacro.GoogleMapPolygon
                    || objItem instanceof nexacro.GoogleMapCircle)
			{
			    this.items[strItemID] = objItem;
				this.items.push(strItemID);

				if (this.bLoaded)
				{
				    if (objItem._type == 0 || objItem._type == 1)
					{
				        _pGoogleMap.addMarker(strItemID, objItem, parentMap, this);
					}
				    else if (objItem._type == 2)
					{
				        _pGoogleMap.addPolyline(strItemID, objItem);
					}
				    else if (objItem._type == 3)
					{
				        _pGoogleMap.addPolygon(strItemID, objItem);
				    }
				    else if (objItem._type == 4)
				    {
				        _pGoogleMap.addCircle(strItemID, objItem);
				    }
				}
				return true;
			}
			else
			{
				return false;
			}
		};
			
		_pGoogleMap.setMarkerOptions = function (markName, markObj)
		{
			if (typeof (_infowindow[markName]) == "undefined")
			{
			    var temp_infowindow = new google.maps.InfoWindow({
			        content: ""
			    });
			    _infowindowname.push(markName);
			    _infowindow[markName] = temp_infowindow;
			}

			var markerOpt;
			if (markObj.imageurl.length > 0)
			{
			    var _v = markObj.imageurl.toString().split(" ").join("");
			    var img_path = "";

			    if (_v.substring(0, 9).toLowerCase() == "%userapp%")
			    {
			        img_path = "../" + _v.substring(9, _v.length);
			    }
			    else
			    {
			        img_path = _v;
			    }

			    markerOpt = {
			        position: new google.maps.LatLng(markObj._location.latitude, markObj._location.longitude),
			        title: markObj.text,
			        visible: markObj.visible,
			        icon: img_path,
			        draggable: markObj.draggable
			    };
			}
			else
			{
			    markerOpt = {
			        position: new google.maps.LatLng(markObj._location.latitude, markObj._location.longitude),
			        title: markObj.text,
			        visible: markObj.visible,
			        draggable: markObj.draggable
			    };
			}

			var contentString = "<div title=\"\" style='width:100%;height:100%;'><div title=\"\" style='vertical-align:" + markObj.style.align.valign + ";text-align:" + markObj.style.align.halign + ";'>" + markObj.text + "</div></div>";
			_infowindow[markName].setContent(contentString);

			google.maps.event.addListener(_items[markName], 'click', function (e)
			{
			    if (_items[markName].title.length > 0)
			    {
			        _infowindow[markName].open(_pGoogleMap._google_map, _items[markName]);
			    }
			});

			google.maps.event.addListener(_items[markName], 'drag', function (e)
			{

			});

			google.maps.event.addListener(_pGoogleMap._google_map, 'click', function (e)
			{
			    _infowindow[markName].close();
			});

			if (!markerOpt.visible && _infowindow[markName] != null)
			    _infowindow[markName].close();

			_items[markName].setOptions(markerOpt);
		};

		_pGoogleMap.addMarker = function(markName, markObj, parentMap, obj)
		{
			if (typeof (_infowindow[markName]) == "undefined")
			{
				var temp_infowindow = new google.maps.InfoWindow({
					content : ""
				});
				_infowindowname.push(markName);
				_infowindow[markName] = temp_infowindow;
			}

			var contentString = "<div title=\"\" style='width:100%;height:100%;'><div title=\"\" style='vertical-align:"
					+ markObj.style.align.valign
					+ ";text-align:"
					+ markObj.style.align.halign
					+ ";'>"
					+ markObj.text
					+ "</div></div>";
			_infowindow[markName].setContent(contentString);
				
			var marker;
			if (markObj.imageurl.length > 0)
			{
			    var _v = markObj.imageurl.toString().split(" ").join("");
				var img_path = "";

				if (_v.substring(0, 9).toLowerCase() == "%userapp%")
				{
					img_path = _v.substring(9, _v.length);
					if (img_path.charAt(0) != "/")
						img_path = "/" + img_path;
                    img_path = nexacro.System.userapppath + img_path;
				}
				else
				{
				    img_path = _v;
				}

				marker = new google.maps.Marker({
				    position: new google.maps.LatLng(
							markObj._location.latitude,
							markObj._location.longitude),
				    title: markObj.text,
				    visible: markObj.visible,
				    icon: img_path,
				    draggable: markObj.draggable
				});
			}
			else
			{
				marker = new google.maps.Marker({
					position : new google.maps.LatLng(
							markObj._location.latitude,
							markObj._location.longitude),
					title : markObj.text,
					visible : markObj.visible,
					draggable : markObj.draggable
				});
			}
				
	        google.maps.event.addListener(marker, 'dragstart', function(e)
	        {	     	    
	            if (parentMap.onmapdragstart && parentMap.onmapdragstart._has_handlers && parentMap.enableevent)
	            {
	                markObj._location.latitude = marker.getPosition().lat();
	                markObj._location.longitude = marker.getPosition().lng();
                 
	                var evt = new nexacro.GoogleMapDragEventInfo(parentMap, "onmapdragstart", markObj._location);
                    parentMap.onmapdragstart._fireEvent(obj, evt);
                }            
	        });
	        
	        google.maps.event.addListener(marker, 'drag', function(e)
	        {	       
	            if (parentMap.onmapdrag && parentMap.onmapdrag._has_handlers && parentMap.enableevent)
	            {
	                markObj._location.latitude = marker.getPosition().lat();
	                markObj._location.longitude = marker.getPosition().lng();
                 
	                var evt = new nexacro.GoogleMapDragEventInfo(parentMap, "onmapdrag", markObj._location);
                    parentMap.onmapdrag._fireEvent(obj, evt);
                }
	        });
	          
	        google.maps.event.addListener(marker, 'dragend', function(e)
	        {	     	  	  
	            if (parentMap.onmapdragend && parentMap.onmapdragend._has_handlers && parentMap.enableevent)
	            {
	                markObj._location.latitude = marker.getPosition().lat();
	                markObj._location.longitude = marker.getPosition().lng();
                 
	                var evt = new nexacro.GoogleMapDragEventInfo(parentMap, "onmapdragend", markObj._location);
                    parentMap.onmapdragend._fireEvent(obj, evt);
                }      
	        });
				
		    google.maps.event.addListener(marker, 'click', function(e)
		    {
				if (marker.title.length > 0)
				{
					_infowindow[markName].open(_pGoogleMap._google_map, marker);
				}
				// overlayclick call..
				_pGoogleMap.gmap_onoverlayclick(markObj/* marker */, e.latLng
						.lat(), e.latLng.lng(), e.pixel.x, e.pixel.y);
		    });

		    google.maps.event.addListener(marker, 'drag', function(e)
		    {
			    //console.log("marker drag!!! " + marker + ":" + markName);
 		    });

			marker.setMap(_pGoogleMap._google_map);
			_pGoogleMap._google_map.setCenter(marker.getPosition());
			_itemsname.push(markName);
			_items[markName] = marker;
			markObj._map = this;
			markObj._name = markName;
		};

		_pGoogleMap.setPolygonOptions = function (polygonName, polygonObj) {
		    var _path = [];
		    var _lat_lng_arr, _lat, _lng, i;

		    _lat_lng_arr = polygonObj.locationdata.toString().split("]");
		    for (i = 0; i < (_lat_lng_arr.length - 1) ; i++)
		    {
		        _lat = _lat_lng_arr[i].toString().split(",")[0].split(" ").join().substring(1);
		        _lng = _lat_lng_arr[i].toString().split(",")[1].split(" ").join().substring(1);
		        if (_lat.length > 0 && _lng.length > 0)
		        {
		            _path.push(new google.maps.LatLng(Number(_lat), Number(_lng)));
		        }
		    }
		    var _color_stroke;
		    if (typeof (this.parent.nexacro._xreNamedColorList[polygonObj.linecolor]) != "undefined") {
		        _color_stroke = this.parent.nexacro._xreNamedColorList[polygonObj.linecolor] + "FF";
		    }
		    else
		    {
		        _color_stroke = polygonObj.linecolor;
		    }

		    var _color_fill;
		    if (typeof (this.parent.nexacro._xreNamedColorList[polygonObj.fillbrushcolor]) != "undefined") {
		        _color_fill = this.parent.nexacro._xreNamedColorList[polygonObj.fillbrushcolor] + "FF";
		    }
		    else
		    {
		        _color_fill = polygonObj.fillbrushcolor;
		    }

		    var _alpha_stroke_1;
		    var _alpha_stroke = 1.0;
		    if (_color_stroke.length > 7)
		    {
		        _alpha_stroke_1 = parseInt(_color_stroke.substring(7), 16);
		        _alpha_stroke = _alpha_stroke_1 / 255.0;
		    }
		    var _alpha_fill_1;
		    var _alpha_fill = 1.0;
		    if (_color_fill.length > 7)
		    {
		        _alpha_fill_1 = parseInt(_color_fill.substring(7), 16);
		        _alpha_fill = _alpha_fill_1 / 255.0;
		    }

		    var polygonOpt = {
		        paths: _path,
		        strokeColor: _color_stroke.substring(0, 7),
		        strokeOpacity: _alpha_stroke,
		        strokeWeight: polygonObj.linewidth,
		        fillColor: _color_fill.substring(0, 7),
		        fillOpacity: _alpha_fill,
		        visible: polygonObj.visible
		    };

		    google.maps.event.addListener(_items[polygonName], 'click',
					function (e) {
					    __parent.gmap_onoverlayclick(_items[polygonName],
								e.latLng.lat(), e.latLng.lng(), 0, 0);
					});
		    _items[polygonName].setOptions(polygonOpt);
		};

		_pGoogleMap.addPolygon = function(polygonName, polygonObj)
		{
			var _path = [];
			var _lat_lng_arr, _lat, _lng;

			_lat_lng_arr = polygonObj.locationdata.toString().split("]");
			for (var i = 0; i < (_lat_lng_arr.length - 1); i++)
			{
				_lat = _lat_lng_arr[i].toString().split(",")[0].split(" ")
						.join().substring(1);
				_lng = _lat_lng_arr[i].toString().split(",")[1].split(" ")
						.join().substring(1);
				if (_lat.length > 0 && _lng.length > 0)
				{
					_path.push(new google.maps.LatLng(Number(_lat),
							Number(_lng)));
				}
			}

			var _color_stroke;
			if (typeof (nexacro._xreNamedColorList[polygonObj.linecolor]) != "undefined")
			{
			    _color_stroke = nexacro._xreNamedColorList[polygonObj.linecolor] + "FF";
			}
			else
			{
			    _color_stroke = polygonObj.linecolor;
			}

			var _color_fill;
			if (typeof (nexacro._xreNamedColorList[polygonObj.fillbrushcolor]) != "undefined")
			{
			    _color_fill = nexacro._xreNamedColorList[polygonObj.fillbrushcolor] + "FF";
			}
			else
			{
			    _color_fill = polygonObj.fillbrushcolor;
			}

			var _alpha_stroke_1;
			var _alpha_stroke = 1.0;
			if (_color_stroke.length > 7)
			{
				_alpha_stroke_1 = parseInt(_color_stroke.substring(7), 16);
				_alpha_stroke = _alpha_stroke_1 / 255.0;
			}
			var _alpha_fill_1;
			var _alpha_fill = 1.0;
			if (_color_fill.length > 7)
			{
				_alpha_fill_1 = parseInt(_color_fill.substring(7), 16);
				_alpha_fill = _alpha_fill_1 / 255.0;
			}

			var polygonPath = new google.maps.Polygon({
				paths : _path,
				strokeColor : _color_stroke.substring(0, 7),
				strokeOpacity : _alpha_stroke,
				strokeWeight: polygonObj.linewidth,
				fillColor : _color_fill.substring(0, 7),
				fillOpacity : _alpha_fill,
				visible : polygonObj.visible
			});

			polygonPath.setMap(_pGoogleMap._google_map);

			_itemsname.push(polygonName);
			_items[polygonName] = polygonPath;

			polygonObj._map = this;
			polygonObj._name = polygonName;

			google.maps.event.addListener(_items[polygonName], 'click',
					function(e)
					{
						_pGoogleMap.gmap_onoverlayclick(polygonObj/* _items[polygonName] */,
								e.latLng.lat(), e.latLng.lng(), 0, 0);
					});
		};

		_pGoogleMap.setPolylineOptions = function(polylineName, polylineObj)
		{
			var _path = [];
			var _lat_lng_arr, _lat, _lng;

			_lat_lng_arr = polylineObj.locationdata.toString().split("]");
			for (var i = 0; i < (_lat_lng_arr.length - 1); i++)
			{
				_lat = _lat_lng_arr[i].toString().split(",")[0].split(" ").join().substring(1);
				_lng = _lat_lng_arr[i].toString().split(",")[1].split(" ").join().substring(1);
				if (_lat.length > 0 && _lng.length > 0)
				{
					_path.push(new google.maps.LatLng(Number(_lat),	Number(_lng)));
				}
			}

			var _color;
			if (typeof (this.parent.nexacro._xreNamedColorList[polylineObj.linecolor]) != "undefined")
			{
			    _color = this.parent.nexacro._xreNamedColorList[polylineObj.linecolor] + "FF";
			}
			else
			{
			    _color = polylineObj.linecolor;
			}

			var _alpha_1;
			var _alpha = 1.0;
			if (_color.length > 7)
			{
				_alpha_1 = parseInt(_color.substring(7), 16);
				_alpha = _alpha_1 / 255.0;
			}
			var polyLineOpt = {
				path : _path,
				strokeColor : _color.substring(0, 7),
				strokeOpacity : _alpha,
				strokeWeight : polylineObj.linewidth,
				visible : polylineObj.visible
			};

			google.maps.event.addListener(_items[polylineName], 'click',
					function(e)
					{	
						__parent.gmap_onoverlayclick(_items[polylineName],
								e.latLng.lat(), e.latLng.lng(), 0, 0);
					});

			_items[polylineName].setOptions(polyLineOpt);
		};

		_pGoogleMap.addPolyline = function(polylineName, polylineObj)
		{
			var _path = [];
			var _lat_lng_arr, _lat, _lng;

			_lat_lng_arr = polylineObj.locationdata.toString().split("]");
			for (var i = 0; i < (_lat_lng_arr.length - 1); i++)
			{
				_lat = _lat_lng_arr[i].toString().split(",")[0].split(" ").join().substring(1);
				_lng = _lat_lng_arr[i].toString().split(",")[1].split(" ").join().substring(1);
				if (_lat.length > 0 && _lng.length > 0)
				{
					_path.push(new google.maps.LatLng(Number(_lat),	Number(_lng)));
				}
			}

			var _color;
			if (typeof (nexacro._xreNamedColorList[polylineObj.linecolor]) != "undefined")
			{
			    _color = nexacro._xreNamedColorList[polylineObj.linecolor] + "FF";
			}
			else
			{
			    _color = polylineObj.linecolor;
			}

			var _alpha_1;
			var _alpha = 1.0;
			if (_color.length > 7)
			{
				_alpha_1 = parseInt(_color.substring(7), 16);
				_alpha = _alpha_1 / 255.0;
			}
			var polyLinePath = new google.maps.Polyline({
				path : _path,
				strokeColor : _color.substring(0, 7),
				strokeOpacity : _alpha,
				strokeWeight: polylineObj.linewidth,
				visible : polylineObj.visible
			});

			polyLinePath.setMap(_pGoogleMap._google_map);

			_itemsname.push(polylineName);
			_items[polylineName] = polyLinePath;

			polylineObj._map = this;
			polylineObj._name = polylineName;

			google.maps.event.addListener(_items[polylineName], 'click',
					function(e)
					{
						_pGoogleMap.gmap_onoverlayclick(polylineObj/* _items[polylineName] */,
								e.latLng.lat(), e.latLng.lng(), 0, 0);
					});
		};

		_pGoogleMap.setCircleOptions = function (circleName, ciecleObj)
		{   
		    var circleOpt = {
		        fillOpacity: 0,
		        strokeWeight: 1.5,
		        center: new google.maps.LatLng(
							ciecleObj.latitude,
							ciecleObj.longitude),
		        radius: ciecleObj.radius,
		        visible: ciecleObj.visible
		    };

		    _items[circleName].setOptions(ciecleObj);
		};

		_pGoogleMap.addCircle = function (circleName, ciecleObj)
		{
		    var circle = new google.maps.Circle({		        
		        fillOpacity: 0,
		        strokeWeight: 1.5,
                center: new google.maps.LatLng(
							ciecleObj.latitude,
							ciecleObj.longitude),
                radius: ciecleObj.radius,
                visible: ciecleObj.visible
            });

            circle.setMap(_pGoogleMap._google_map);

            _itemsname.push(circleName);
            _items[circleName] = circle;

            ciecleObj._map = this;
            ciecleObj._name = circleName;
		};

		_pGoogleMap.removeItem = function (strItemID)
		{
			if (strItemID == null)
			{
			    return false;
			}
			if (strItemID == "" || typeof (strItemID) == "undefined")
			{
			    return false;
			}

			if (typeof (this.items[strItemID]) == "undefined")
			{
			    this._apply_onerror({
			        errorcode: "1502",
			        errormsg: "item is not exist."
			    });
			    return false;
			}
			else
			{
			    delete this.items[strItemID];

			    for (var i = 0; i < this.items.length; i++)
			    {
			        if (this.items[i] == strItemID)
			        {
			            var position = this.items.indexOf(this.items[i]);
			            this.items.splice(position, i + 1);
			        }
			    }

			    if (this.bLoaded)
			    {
			        _pGoogleMap._removeItem(strItemID);
			    }

			    return true;
			}
		};

		_pGoogleMap._removeItem = function(itemname)
		{
			_items[itemname].setMap(null);
            var i;
			if (typeof (_items[itemname].title) != "undefined")
			{
				// marker인경우 infowindow도 remove 한다.
				delete _infowindow[itemname];
				for (i = 0; i < _infowindow.length; i++)
				{
					if (_infowindowname[i] == itemname)
					{
						_infowindowname.splice(i + 1, i + 1);
					}
				}
			}
			delete _items[itemname];

			for (i = 0; i < _itemsname.length; i++)
			{
				if (_itemsname[i] == itemname)
				{
					_itemsname.splice(i + 1, i + 1);
				}
			}
			return true;
		};

		// Event
		_pGoogleMap.gmap_ondrag = function (lat, lng)
		{
			this.on_fire_ondragstart(this, new nexacro.GoogleMapDragEventInfo("ondrag"));
		};

		_pGoogleMap.gmap_ondragenter = function (objData)
		{
			this._fire_ondragenter(this, new nexacro.GoogleMapDragEventInfo("ondragenter"));
		};			

		_pGoogleMap.gmap_ondragmove = function (lat, lng)
		{
			this._location.latitude = lat;
			this._location.longitude = lng;

			// 사용자에게 위도/경도를 넘겨주고 이후에 객체의 위도/경도를 갱신한다.
			this.centerlocation.latitude = this._location.latitude;
			this.centerlocation.longitude = this._location.longitude;
		};

		_pGoogleMap.gmap_ondragleave = function (objData)
		{
			this._fire_ondragleave(this, new nexacro.GoogleMapDragEventInfo("ondragleave"));
		};

		_pGoogleMap.gmap_dragend = function (lat, lng)
		{
			this._location.latitude = lat;
			this._location.longitude = lng;
		};			
			
		_pGoogleMap.gmap_onclick = function (lat, lng, x, y)
		{
			this._location.latitude = lat;
			this._location.longitude = lng;
			this._pixel.x = x;
			this._pixel.y = y;
			this.kindClick = "normalclick";
		};

		_pGoogleMap.gmap_onoverlayclick = function (fromobj, lat, lng, x, y)
		{
			this._location.latitude = lat;
			this._location.longitude = lng;
			this._pixel.x = x;
			this._pixel.y = y;
			this.overlayfromobj = fromobj;
			this.kindClick = "overlayclick";
		};
		// override-----------------------------------
			
		_pGoogleMap._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY)
		{		
		};
	
		_pGoogleMap._on_sys_click = function(node, e, bubble)
		{
			var e = e.changedTouches ? e.changedTouches[0] : e;
			nexacro.ajaxlog("_on_sys_click" + e.screenx + "," + e.screeny
					+ ":" + node + ":" + e + ":" + bubble + "]");

			if (this.$IsReadyFireEvent() && this.$isEnable() && this.enableevent)
			{
				if (this.kindClick == "normalclick")
				{
					this._fire_onclick(node._comp, e);
				}
				else
				{
					if (this.kindClick == "overlayclick" && typeof (this.overlayfromobj) != "undefined")
					{
						this._fire_onoverlayclick(node._comp, e);
					}
				}
			}
			return true;
		};

		_pGoogleMap._fire_onclick = function(obj, e)
		{
			if (this.onclick._has_handlers && this.enableevent)
			{
				this.bClicked = false;
				var evt = new nexacro.GoogleMapClickEventInfo(this, obj, "onclick", e, this._location, this._pixel);
				return this.onclick._fireEvent(this, evt);
			}
			else
			{
				this.bClicked = true;
			}

			return false;
		};

		_pGoogleMap._fire_onoverlayclick = function (obj, e)
		{
			if (this.onoverlayclick && this.onoverlayclick._has_handlers && this.enableevent)
			{
			    var evt = new nexacro.GoogleMapClickEventInfo(this, this.overlayfromobj, "onoverlayclick", e,	this._location, this._pixel);
			    return this.onoverlayclick._fireEvent(this, evt);
			}
		};
		// custom
		// events---------------------------------------------------------------------------
		_pGoogleMap._apply_onload = function()
		{
			// load 이전에 enable 속성을 지정한 경우가 있을수 있으므로 enable을 로드 마지막에 체크한다.
			if (this.enable == false)
			{
				// 구글맵을 활성화 시키는 경우 : div element를 제거한다.
				//           this._google_map.showBlock();
			}
			else if (this.enable == true)
			{
				// 구글맵을 비활성화 시키는 경우 : div element로 구글맵을 덮는다.
				//          this.__map().hideBlock();
			}

			this.on_fire_onload(this);
		};

		_pGoogleMap.on_fire_onload = function(obj)
        {
			if (this.onload && this.onload._has_handlers && this.enableevent) 
			{
				var evt = new nexacro.GoogleMapEventInfo(obj, "onload",
						this.centerlocation, this.viewmode,
						this.zoomlevel, this.addresses, this.coordinates);
				return this.onload._fireEvent(this, evt);
			}
		};
			
		_pGoogleMap._onrecvsuccess = function (objData)
		{
			if (this.enableevent)
			{
				if (objData.latitude == undefined || objData.latitude == null || objData.latitude == ""
					|| objData.longitude == undefined || objData.longitude == null || objData.longitude == "")
	 			{
					this.on_fire_onrecvsuccess(this, objData.eventid, objData.addresses, this.coordinates);
				}
			    else 
			    {
				    this.coordinates.latitude = objData.latitude;
				    this.coordinates.longitude = objData.longitude;
				
				    this.on_fire_onrecvsuccess(this, objData.eventid, objData.addresses, this.coordinates);
			    }
			}
		};

		_pGoogleMap.on_fire_onrecvsuccess = function (obj, id, addresses, coordinates)
		{
			if (this.enableevent)
			{
				var evt = new nexacro.GoogleMapEventInfo(obj, id, this.centerlocation, this.viewmode, this.zoomlevel, addresses, this.coordinates);
				return this.onrecvsuccess._fireEvent(this, evt);
			}
		};

		_pGoogleMap._apply_onerror = function(objData)
		{
			if (this.enableevent)
			{
				var _objData = nexacro._executeGlobalEvalStr(objData);
				this.on_fire_onerror(this, _objData);
			}
		};

		_pGoogleMap.on_fire_onerror = function(obj, e)
		{
			if (this.enableevent) 
			{
				var evt = new nexacro.GoogleMapErrorEventInfo(this, "onerror",e.errorcode, e.errormsg);
				return this.onerror._fireEvent(this, evt);
			}

		};

		_pGoogleMap.on_change_containerRect = function(width, height)
		{
			var map_elem = this._map_elem;
			if (map_elem)
			{
				map_elem.setElementSize(width, height);
			}
		};

		_pGoogleMap.__onDragEnter = function(obj, e)
		{
			console.debug("__ondragEnter");
		};

		delete _pGoogleMap;
	}

	// ==============================================================================
	// nexacro.GoogleMapMarker
	// ==============================================================================
	if (!nexacro.GoogleMapMarker)
	{
		nexacro.GoogleMapMarker = function(name, obj)
		{
			this._id = nexacro.Device.makeID();
			nexacro.Device._userCreatedObj[this._id] = this;
			this.name = name || "";
			this._type = 0;
			// 0:marker 1:icon
			this.enableevent = true;
			this.longitude = 0;
			this.latitude = 0;

			this._location = {
			    latitude: 0,
			    longitude: 0
			};

			this.text = "";
			this.visible = true;
			this.draggable = false;
			this.imageurl = "";

			this.style = {
				_GoogleMapMarkerID : 0,
				set_parentID : function(_id)
				{
					this._GoogleMapMarkerID = _id;

				},
				// property
				align : {
					_GoogleMapMarkerID : 0,
					set_parentID : function(_id)
					{
						this._GoogleMapMarkerID = _id;
					},
					halign : "center",
					valign : "middle",
					// set method
					set_halign : function(v)
					{
						var _v = v.toString().split(" ").join("")
								.toLowerCase();
						if (_v == "left" || _v == "center" || _v == "right")
						{
							this.halign = _v;
							var __parent = nexacro.Device._userCreatedObj[this._GoogleMapMarkerID];

							if (__parent._map != null)
							{
								__parent._map.setMarkerOptions(__parent._name, __parent);
							}
							return true;
						}
						else
						{
							return false;
						}
					},
					set_valign : function(v)
					{
						var _v = v.toString().split(" ").join("")
								.toLowerCase();
						if (_v == "top" || _v == "middle" || _v == "bottom")
						{
							this.valign = _v;
							var __parent = nexacro.Device._userCreatedObj[this._GoogleMapMarkerID];
							if (__parent._map != null)
							{
								__parent._map.setMarkerOptions(__parent._name, __parent);
							}
							return true;
						}
						else
						{
							return false;
						}
					},
					$s : function(name, fnname, val)
					{
						var fn = this[fnname];
						if (fn)
							return fn.call(this, val);

						return (this[name] = val);
					}
				},
				image : "",

				// set method
				set_align : function(v)
				{
					var v_arr = v.split(" ");
					var ret = true;
					if (v_arr.length != 2)
					{
						return false;
					}
					ret = this.align.set_halign(v_arr[0]);
					if (!ret)
					{
						return ret;
					}
					ret = this.align.set_valign(v_arr[1]);
					var __parent = nexacro.Device._userCreatedObj[this._GoogleMapMarkerID];
					if (__parent._map != null)
					{
						__parent._map.setMarkerOptions(__parent._name, __parent);
					}
					return ret;
				},				
				$s : function(name, fnname, val)
				{
					var fn = this[fnname];
					if (fn)
						return fn.call(this, val);

					return (this[name] = val);
				}
			};

			this._map = null;
			this._name = null;

			this.style.set_parentID(this._id);
			this.style.align.set_parentID(this._id);
		};
		var _pGoogleMapMarker = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapMarker);			
		nexacro.GoogleMapMarker.prototype = _pGoogleMapMarker;
		_pGoogleMapMarker._type_name = "GoogleMapMarker";

		// Set Property		
		_pGoogleMapMarker.set_longitude = function (v)
		{
		    try
		    {
		        this.longitude = Number(v.toString());
		    }
		    catch (e)
		    {
		        return false;
		    }

		    if ((+this.longitude) != (+this.longitude))
		    {
		        return false;
		    }

		    this._location.longitude = this.longitude;

		    if (this._map != null)
		    {
		        this._map.setMarkerOptions(this._name, this);
		    }

		    return true;
		};

		_pGoogleMapMarker.set_latitude = function (v)
		{
		    try
		    {
		        this.latitude = Number(v.toString());
		    }
		    catch (e)
		    {
		        return false;
		    }

		    if ((+this.latitude) != (+this.latitude))
		    {
		        return false;
		    }
            
		    this._location.latitude = this.latitude;

		    if (this._map != null)
		    {
		        this._map.setMarkerOptions(this._name, this);
		    }

		    return true;
		};

		_pGoogleMapMarker.set_text = function(v)
		{
			this.text = v;
			if (this._map != null)
			{
				this._map.setMarkerOptions(this._name, this);
			}
			return true;
		};
			
		_pGoogleMapMarker.set_draggable = function (v)
		{
			if (v == null)
			{
			    return false;
			}
			else if (v)
			{
			    if (v == true || (typeof (v) == "string" && v == "true"))
			    {
			        this.draggable = true;
			    }
			    else if (v == false || (typeof (v) == "string" && v == "false"))
			    {
			        this.draggable = false;
			    }
			}
			else
			{
			    return false;
			}
		};

		_pGoogleMapMarker.set_visible = function(v)
		{
			if (v == true || (typeof (v) == "string" && v == "true"))
			{
				this.visible = true;
			}
			else if (v == false || (typeof (v) == "string" && v == "false"))
			{
				this.visible = false;
			}
			else
			{
				return false;				  
			}
			if (this._map != null)
			{
				this._map.setMarkerOptions(this._name, this);
			}
			return true;
		};

		_pGoogleMapMarker.set_imageurl = function (v)
		{
		    this._type = 1;
		    this.imageurl = v;

		    if (this._map != null)
		    {
		        this._map.setMarkerOptions(this._name, this);
		    }

		    return true;
		};

		_pGoogleMapMarker.set_style = function(v)
		{
			var v_arr = v.split(";");
			var i = 0;
			var _v_arr;
			var ret = true;
			for (i = 0; i < v_arr.length; i++)
			{
				_v_arr = v_arr[i].split(":");
				if (_v_arr.length != 2)
				{
					return false;
				}
				switch (_v_arr[0].split(" ").join("").toLowerCase())
				{
					case "align":
						ret = this.style.set_align(_v_arr[1]);
						break;					
					default:
						ret = false;
						break;
				}
				if (!ret)
				{
					return ret;
				}
			}
			if (this._map != null)
			{
				this._map.setMarkerOptions(this._name, this);
			}
			return ret;
		};

		delete _pGoogleMapMarker;

		nexacro._addRegisterClass("GoogleMapMarker", "nexacro.GoogleMapMarker");
	}

	// ==============================================================================
	// nexacro.GoogleMapPolyline

	// ==============================================================================
	if (!nexacro.GoogleMapPolyline)
	{
		nexacro.GoogleMapPolyline = function(name, obj)
		{
			this._id = nexacro.Device.makeID();
			nexacro.Device._userCreatedObj[this._id] = this;
			this.name = name || "";

			this._type = 2;
			// 2:polyline
			this.locationdata = "";
			this.visible = true;
			this.linewidth = "";
			this.linecolor = "";
			this.enableevent = true;
			
			this._map = null;
			this._name = null;			
		};

		var _pGoogleMapPolyline = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapPolyline);			
		nexacro.GoogleMapPolyline.prototype = _pGoogleMapPolyline;
		_pGoogleMapPolyline._type_name = "GoogleMapPolyline";

		_pGoogleMapPolyline.set_locationdata = function(v)
		{
			var _lat_lng_arr;

			_lat_lng_arr = v.toString().split("]");

			if (_lat_lng_arr.length < 2)
			{
				return false;
			}

			this.locationdata = v;

			if (this._map != null)
			{
				this._map.setPolylineOptions(this._name, this);
			}
			return true;
		};

		_pGoogleMapPolyline.set_visible = function (v)
		{
			if (v == true || (typeof (v) == "string" && v == "true"))
			{
			    this.visible = true;
			}
			else if (v == false || (typeof (v) == "string" && v == "false"))
			{
			    this.visible = false;
			}
			else
			{
			    return false;			    
			}

			if (this._map != null)
			{
			    this._map.setPolylineOptions(this._name, this);
			}
			return true;
		};

		_pGoogleMapPolyline.set_linewidth = function (v)
		{
		    var nWidth = 0;
		    try
		    {
		        nWidth = Number(v.toString());
		    }
		    catch (e)
		    {
		        return false;
		    }

		    if ((+nWidth) != (+nWidth))
		    {
		        return false;
		    }
		    this.linewidth = nWidth;

		    if (this._map != null)
		    {
		        this._map.setPolylineOptions(this._name, this);
		    }

		    return true;
		};

		_pGoogleMapPolyline.set_linecolor = function (v)
		{
		    this.linecolor = v;
		    return true;
		};

		delete _pGoogleMapPolyline;
	}

	//==============================================================================
	//nexacro.GoogleMapPolygon

	//==============================================================================
	if (!nexacro.GoogleMapPolygon)
	{
		nexacro.GoogleMapPolygon = function(name, obj)
		{
			this._id = nexacro.Device.makeID();
			nexacro.Device._userCreatedObj[this._id] = this;
			this.name = name || "";

			this._type = 3;
			// 3:polygon
			this.locationdata = "";
			this.visible = true;
			this.linewidth = "";
			this.linecolor = "";
			this.fillbrushcolor = "";
			this.enableevent = true;
            
			this._map = null;
			this._name = null;
		};

		var _pGoogleMapPolygon =  nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapPolygon);			
		nexacro.GoogleMapPolygon.prototype = _pGoogleMapPolygon;
		_pGoogleMapPolygon._type_name = "GoogleMapPolygon";

		_pGoogleMapPolygon.set_locationdata = function(v)
		{
			var _lat_lng_arr;

			_lat_lng_arr = v.toString().split("]");

			if (_lat_lng_arr.length < 2)
			{
				return false;
			}

			this.locationdata = v;
			if (this._map != null)
			{
				this._map.setPolygonOptions(this._name, this);
			}
			return true;
		};

		_pGoogleMapPolygon.set_visible = function(v)
		{
			if (v == true || (typeof (v) == "string" && v == "true"))
			{
				this.visible = true;
			}
			else if (v == false || (typeof (v) == "string" && v == "false"))
			{
				this.visible = false;
			}
			else
			{
				return false;
			}

			if (this._map != null)
			{
				this._map.setPolygonOptions(this._name, this);
			}
			return true;
		};

		_pGoogleMapPolygon.set_linewidth = function (v)
		{
		    var nWidth = 0;
		    try
		    {
		        nWidth = Number(v.toString());
		    }
		    catch (e)
		    {
		        return false;
		    }

		    if ((+nWidth) != (+nWidth))
		    {
		        return false;
		    }
		    this.linewidth = nWidth;

		    if (this._map != null)
		    {
		        this._map.setPolygonOptions(this._name, this);
		    }

		    return true;
		};

		_pGoogleMapPolygon.set_linecolor = function (v)
		{
		    this.linecolor = v;		   
		    return true;
		};

		_pGoogleMapPolygon.set_fillbrushcolor = function (v)
		{		    
		    this.fillbrushcolor = v;
		    return true;
		};
        	
		delete _pGoogleMapPolygon;
	}

    // ==============================================================================
    // nexacro.GoogleCircle
    // ==============================================================================
	if (!nexacro.GoogleMapCircle) {
	    nexacro.GoogleMapCircle = function (name, obj) {
	        this._id = nexacro.Device.makeID();
	        nexacro.Device._userCreatedObj[this._id] = this;
	        this.name = name || "";
	        this._type = 4;
	        this.longitude = 0;
	        this.latitude = 0;
	        this.enableevent = true;
	        this.visible = true;
	       
	        this._map = null;
	        this._name = null;
	        this.radius = 100;
	    };
	    var _pGoogleMapCircle = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapCircle);
	    nexacro.GoogleMapCircle.prototype = _pGoogleMapCircle;
	    _pGoogleMapCircle._type_name = "GoogleCircle";
        
	    //Set Property
	    _pGoogleMapCircle.set_longitude = function (v)
	    {
	        try
	        {
	            this.longitude = Number(v.toString());
	        }
	        catch (e)
	        {
	            return false;
	        }

	        if ((+this.longitude) != (+this.longitude))
	        {
	            return false;
	        }

	        if (this._map != null)
	        {
	            this._map.setCircleOptions(this._name, this);
	        }
	        return true;
	    };

	    _pGoogleMapCircle.set_latitude = function (v)
	    {
	        try
	        {
	            this.latitude = Number(v.toString());
	        }
	        catch (e)
	        {
	            return false;
	        }

	        if ((+this.latitude) != (+this.latitude))
	        {
	            return false;
	        }

	        if (this._map != null)
	        {
	            this._map.setCircleOptions(this._name, this);
	        }
	        return true;
	    };

	    _pGoogleMapCircle.set_visible = function (v)
	    {
	        if (v == true || (typeof (v) == "string" && v == "true"))
	        {
	            this.visible = true;
	        }
	        else if (v == false || (typeof (v) == "string" && v == "false"))
	        {
	            this.visible = false;
	        }
	        else
	        {
	            return false;
	        }

	        if (this._map != null)
	        {
	            this._map.setCircleOptions(this._name, this);
	        }
	        return true;
	    };

	    _pGoogleMapCircle.set_radius = function (v)
	    {
	        if (v == null || typeof (v) == "undefined")
	        {
	            this.radius = 100;
	        }
	        else
	        {
	            this.radius = Number(v.toString());
	        }
	    };

	    delete _pGoogleMapCircle;
	}
}
else 
{
	if (!nexacro.GoogleMap) 
	{      	
		nexacro.GoogleMap = function(id, left, top, width, height, right, bottom, parent) 
		{
		    nexacro.Component.call(this, id, left, top, width, height, right, bottom, parent);

		    this.on_fire_onclick = function () { };
		};
		var _pGoogleMap = nexacro._createPrototype(nexacro.Component, nexacro.GoogleMap);
		nexacro.GoogleMap.prototype = _pGoogleMap;
		
		_pGoogleMap._type = "GoogleMap";
		_pGoogleMap._type_name = "GoogleMap";
		
		// property
		_pGoogleMap.set_text = function(v) {};
		_pGoogleMap.set_viewmode = function(v) {};	
		_pGoogleMap.set_zoomlevel = function(v) {};
	    _pGoogleMap.set_showzoom = function(v) {};
		_pGoogleMap.set_shownavigator = function(v) {};
	    _pGoogleMap.set_showcompass = function(v) {};
		_pGoogleMap.set_enable = function (v) {};
	    _pGoogleMap.set_visible = function (v){};
		_pGoogleMap.set_showmapscale = function (v){};
		_pGoogleMap.set_centerlocation = function (v){};
		_pGoogleMap.set_showmode = function (v){};
		_pGoogleMap.set_zoomalign = function (v){};
        _pGoogleMap.set_navigatoralign = function (v){};
        _pGoogleMap.set_mapscalealign = function (v){};
        _pGoogleMap.set_draggable = function(v){};
      
		//method
	    _pGoogleMap.load = function(bUseSensor, nLatitude, nLongitude, constViewMode, nZoomLevel) {};
		_pGoogleMap.setMarkerLoc = function(strItemID, lat, lng) {};
	    _pGoogleMap.getAddress = function(nLatitude, nLongitude, nMaxResultCount, strLocale) {};
	    _pGoogleMap.getCoordinates  = function(straddress) {};
		_pGoogleMap.addItem = function(strItemID, objComponent) {};
		_pGoogleMap.setMarkerOptions = function(markName, markObj) {};
		_pGoogleMap.addMarker = function(elem, markName , markObj) {};
		_pGoogleMap.addPolyline = function (elem, polylineName, polylineObj) { };
		_pGoogleMap.removeItem = function(strItemID) {};
		_pGoogleMap._removeItem = function(elem, itemname) {};
				
		delete _pGoogleMap;
	}

	// ==============================================================================
	// nexacro.GoogleMapMarker
	// ==============================================================================

	if (!nexacro.GoogleMapMarker)
	{
		nexacro.GoogleMapMarker = function(name, obj) {};
		  
		var _pGoogleMapMarker = nexacro.GoogleMapMarker.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapMarker);			
		_pGoogleMapMarker._type_name = "GoogleMapMarker";
			
		_pGoogleMapMarker.set_latitude = function (v) {};
		_pGoogleMapMarker.set_longitude = function (v) {};
		_pGoogleMapMarker.set_text = function(v) {};
		_pGoogleMapMarker.set_draggable = function(v) {};
		_pGoogleMapMarker.set_visible = function(v) {};
		_pGoogleMapMarker.set_style = function (v) {};
		
		delete _pGoogleMapMarker;	
	}

	// ==============================================================================
	// nexacro.GoogleMapPolyline
	// ==============================================================================
		
	if (!nexacro.GoogleMapPolyline)
	{
	    nexacro.GoogleMapPolyline = function (name, obj) {};

	    var _pGoogleMapPolyline = nexacro.GoogleMapPolyline.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapPolyline);
	    _pGoogleMapPolyline._type_name = "GoogleMapPolyline";

	    _pGoogleMapPolyline.set_locationdata = function (v) {};
	    _pGoogleMapPolyline.set_linewidth = function (v) {};
	    _pGoogleMapPolyline.set_linecolor = function (v) {};
	    _pGoogleMapPolyline.set_visible = function (v) {};
	    
	    delete _pGoogleMapPolyline;
	}

    //==============================================================================
    // nexacro.GoogleMapPolygon
    //
    //==============================================================================
	if (!nexacro.GoogleMapPolygon)
	{
	    nexacro.GoogleMapPolygon = function (name, obj) {};

	    var _pGoogleMapPolygon = nexacro.GoogleMapPolygon.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapPolygon);
	    _pGoogleMapPolygon._type_name = "GoogleMapPolygon";

	    _pGoogleMapPolygon.set_locationdata = function (v) {};
	    _pGoogleMapPolygon.set_linewidth = function (v) {};
	    _pGoogleMapPolygon.set_linecolor = function (v) {};
	    _pGoogleMapPolygon.set_fillbrushcolor = function (v) {};
	    _pGoogleMapPolygon.set_visible = function (v) {};
	    
	    delete _pGoogleMapPolygon;
	}

    // ==============================================================================
    // nexacro.GoogleMapCircle
    // ==============================================================================

	if (!nexacro.GoogleMapCircle)
	{
	    nexacro.GoogleMapCircle = function (name, obj) {};

	    var _pGoogleMapCircle = nexacro.GoogleMapCircle.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.GoogleMapCircle);
	    _pGoogleMapCircle._type_name = "GoogleMapCircle";

	    _pGoogleMapCircle.set_latitude = function (v) {};
	    _pGoogleMapCircle.set_longitude = function (v) {};
	    _pGoogleMapCircle.set_radius = function (v) {};
	    _pGoogleMapCircle.set_visible = function (v) {};

	    delete _pGoogleMapCircle;
	}
}