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

if (!nexacro.Device || nexacro._OS == "Windows" || nexacro._OS == "iOS" || nexacro._OS == "OSX")
{
	// common interface, Platform 별 API 구현은 Device API(DeviceObjs_HTML5/DeviceObjs_Runtime) 파일에 있음.
	if (!nexacro._init_deviceobjs_api)
	{
		// Widget
		nexacro._setIconWidget = nexacro._emptyFn;
		nexacro._setTopmostWidget = nexacro._emptyFn;
	}
}

if (!nexacro.Device || nexacro._OS == "Android" || nexacro._OS == "iOS")
{
	//==============================================================================
	// nexacro.Application
	// For Widget
	//==============================================================================
	if (nexacro.Application) 
	{

		nexacro.Application.prototype.setIconWidget = function (strWidgetId, strWidgetIconPath) 
		{
			nexacro._setIconWidget(strWidgetId, strWidgetIconPath);
		};

		nexacro.Application.prototype.setTopmostWidget = function (strWidgetId, bWidgetTopmost) 
		{
			nexacro._setTopmostWidget(strWidgetId, bWidgetTopmost);
		};
	}
}
