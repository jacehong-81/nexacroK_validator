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
// nexacro Platform Objects
//==============================================================================
if (nexacro._Browser != "Runtime" && !nexacro._init_platform_HTML5)
{
	"use strict";


	var _process = true;
	nexacro._init_platform_HTML5 = true;

	nexacro._isTouchInteraction = (nexacro._Browser == "MobileSafari" || nexacro._OS == "Android" || nexacro._OS == "iOS" || nexacro._OS == "Windows Phone" || nexacro._AndroidDesktopMode); //nexacro._OS == "wp7"
	nexacro._SupportOrientation = ((typeof window.orientation != 'undefined') && ('onorientationchange' in window));
	nexacro._SupportTouch = ("ontouchstart" in window || ((window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && (window.navigator.maxTouchPoints > 0) ? true : false));
	nexacro._SupportTouchEvent = (nexacro._SupportTouch || typeof TouchEvent !== 'undefined'); // for event test
	nexacro._SupportAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame) ? true : false;
	nexacro._resize_popup_inbound = true;
	nexacro._is_first_touch = true;
	nexacro._last_eventname = "";
	nexacro._calculateZoomLevel = nexacro._emptyFn;
	//==============================================================================


	//==============================================================================
	nexacro.HTMLSysEvent = function (container = undefined)
	{
		this.container = container;
		this._cur_over_elem = null;
		this._win = undefined;
		// (Higher-Order Function, HOF) 중복 코드 제거

		this._containerChanged = (win, evt) => 
		{

			if (win.handle)
			{
				let target = (win.handle == evt.target || win.handle.contains(evt.target));
				let related = target;
				if (evt.relatedTarget)
					related = (win.handle == evt.relatedTarget || win.handle.contains(evt.relatedTarget));
				else
				{
					// 내 컨테이너 내의 focus를 blur 처리 했다는 것(유지)
					if (win._doc.activeElement == win._doc.body)
						related = target;
					else
						related = !target;
				}

				if (target == true && target !== related)
				{
					return target;
				}
			}
			else
			{
				return win._is_active_window;
			}

			return false;


		}

		this._syshandler_onpopstate_forward = this.createSafeEventHandler((evt) => 
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onpopstate(this, evt, context);
		});

		this._syshandler_onmessage_forward = this.createSafeEventHandler((evt) => 
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onmessage(this, evt, context);
		});
		this._syshandler_onmousedown_forward = this.createSafeEventHandler((evt) => 
		{
			const { win, elem, context } = this.GetEventContext(evt);


			if (nexacro._isTouchInteraction)
			{
				// TODO Android에서 Input Caret이동을 원할 경우 mouse이벤트도
				// preventDefault 하지 않아야 한다. 아래 주석처리하고 return만 해야 함.
				// -> mousedown, mouseup, mousemove		



				const last_focused_elem = win._last_focused_elem;
				if (nexacro._OS == "Android")
				{
					// 대상이 Input이면 Caret 이동 등 처리를 위해 Pass.
					// 대상이 Input이 아니면 preventDefault (node가 포커스를 가져가선 안됨)
					if (elem)
					{
						if (elem.isInputElement() && elem.enable)
						{
							//
						}
						else
						{
							if (!last_focused_elem || !(last_focused_elem.isInputElement() && last_focused_elem.enable))
							{
								evt.preventDefault();
							}
						}
					}
					if (nexacro._Browser != "Chrome" || nexacro._BrowserVersion < 58 || nexacro._is_touch_flag)
					{
						nexacro._is_touch_flag = false;
						return false;
					}
				}
				else 
				{
					if (nexacro._SystemTypeEx == "ProforMouseEvent")
					{
						if (elem._is_accept_touch)
						{
							if (!elem._is_accept_touch(win))
							{
								nexacro._stopSysEvent(evt);
								return false;
							}
						}
						else if (elem.parent)
						{
							if (nexacro._ListViewCellControl && elem.parent instanceof nexacro._ListViewCellControl && elem.parent._subComp && elem.parent._subComp._isEditableComponent && elem.parent._subComp._isEditableComponent() && elem.parent._subComp._input_element && elem.parent._subComp._input_element._is_accept_touch)
							{
								if (!elem.parent._subComp._input_element._is_accept_touch(win))
								{
									nexacro._stopSysEvent(evt);
									return false;
								}
							}
							else if (elem.parent._isEditableComponent && elem.parent._isEditableComponent() && elem.parent._input_element && elem.parent._input_element._is_accept_touch)
							{
								if (!elem.parent._input_element._is_accept_touch(win))
								{
									nexacro._stopSysEvent(evt);
									return false;
								}
							}
						}
					}

					let prevent = true;
					if (nexacro._OS == "iOS" && nexacro._SystemType == "ipad" && nexacro._SystemTypeEx == "ProforMouseEvent")  // ipad os 13.4 부터 mouse event가 지원됨.
					{
						if (evt.buttons > 0)    // 손가락 터치시에도 mouseevent가 같이 들어와 onclick이 두번 타는 문제로 체크 필수
						{
							if (last_focused_elem && last_focused_elem.isInputElement() && last_focused_elem.isComposing())
								prevent = true;
							else
								prevent = false;
						}
					}

					if (prevent)
					{
						if (elem && !elem.isInputElement())
						{
							evt.stopPropagation();
							evt.preventDefault();
						}
						return false;
					}


				}
			}
			return nexacro._syshandler_onmousedown(this, evt, context);
		});

		this._syshandler_onmouseup_forward = this.createSafeEventHandler((evt) =>
		{

			const { win, elem, context } = this.GetEventContext(evt);

			if (nexacro._isTouchInteraction)
			{

				if (nexacro._OS != "Android")
				{
					if (nexacro._SystemTypeEx == "ProforMouseEvent")
					{

						if (elem._is_accept_touch)
						{
							if (!elem._is_accept_touch(win))
							{
								nexacro._stopSysEvent(evt);
								return false;
							}
						}
						else if (elem.parent)
						{
							if (nexacro._ListViewCellControl && elem.parent instanceof nexacro._ListViewCellControl && elem.parent._subComp && elem.parent._subComp._isEditableComponent && elem.parent._subComp._isEditableComponent() && elem.parent._subComp._input_element && elem.parent._subComp._input_element._is_accept_touch)
							{
								if (!elem.parent._subComp._input_element._is_accept_touch(win))
								{
									nexacro._stopSysEvent(evt);
									return false;
								}
							}
							else if (elem.parent._isEditableComponent && elem.parent._isEditableComponent() && elem.parent._input_element && elem.parent._input_element._is_accept_touch)
							{
								if (!elem.parent._input_element._is_accept_touch(win))
								{
									nexacro._stopSysEvent(evt);
									return false;
								}
							}
						}
					}

					evt.stopPropagation();
					evt.preventDefault();
				}

				return false;
			}

			return nexacro._syshandler_onmouseup(this, evt, context);
		});

		this._syshandler_lock_onmouseup_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);

			return nexacro._syshandler_lock_onmouseup(this, evt, context);
		}


		this._syshandler_onmousemove_forward = this.createSafeEventHandler((evt) =>
		{
			const { win, elem, context } = this.GetEventContext(evt);

			if (nexacro._isTouchInteraction)
			{
				if (nexacro._OS != "Android")
				{
					if (nexacro._SystemTypeEx == "ProforMouseEvent")
					{
						if (elem._is_accept_touch)
						{
							if (!elem._is_accept_touch(win))
							{
								nexacro._stopSysEvent(evt);
								return false;
							}
						}
						else if (elem.parent)
						{
							if (nexacro._ListViewCellControl && elem.parent instanceof nexacro._ListViewCellControl && elem.parent._subComp && elem.parent._subComp._isEditableComponent && elem.parent._subComp._isEditableComponent() && elem.parent._subComp._input_element && elem.parent._subComp._input_element._is_accept_touch)
							{
								if (!elem.parent._subComp._input_element._is_accept_touch(win))
								{
									nexacro._stopSysEvent(evt);
									return false;
								}
							}
							else if (elem.parent._isEditableComponent && elem.parent._isEditableComponent() && elem.parent._input_element && elem.parent._input_element._is_accept_touch)
							{
								if (!elem.parent._input_element._is_accept_touch(win))
								{
									nexacro._stopSysEvent(evt);
									return false;
								}
							}
						}
					}

					evt.stopPropagation();
					//  evt.preventDefault();
				}
				if (nexacro._OS == "iOS" && nexacro._SystemType == "ipad" && nexacro._SystemTypeEx == "ProforMouseEvent")  // ipad os 13.4 부터 mouse event가 지원됨.
					return nexacro._syshandler_onmousemove(this, evt, context);
				else
					return false;
			}
			return nexacro._syshandler_onmousemove(this, evt, context);

		});

		this._syshandler_lock_onmousemove_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);

			return nexacro._syshandler_lock_onmousemove(this, evt, context);
		};

		this._syshandler_ontouchstart_forward = (evt) =>
		{
			const { win, elem, context } = this.GetEventContext(evt);

			nexacro._is_touch_flag = true;
			if (elem._is_accept_touch)
			{
				if ((!(elem instanceof nexacro.TextBoxElement) || (elem instanceof nexacro.TextBoxElement && elem.parent.parent._isEditableComponent && elem.parent.parent._isEditableComponent())) && !elem._is_accept_touch(win))                        
				{
					const comp1 = win.findComponent(elem);
					const comp2 = win._last_focused_elem ? win.findComponent(win._last_focused_elem) : null;
					if (elem instanceof nexacro.TextBoxElement && comp1._getRootComponent(comp1) instanceof nexacro.Combo && comp2 && comp2._getRootComponent(comp2) instanceof nexacro.Combo)
					{

					}
					else
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
			}
			else if (elem.parent)                    
			{
				if (nexacro._ListViewCellControl && elem.parent instanceof nexacro._ListViewCellControl && elem.parent._subComp && elem.parent._subComp._isEditableComponent && elem.parent._subComp._isEditableComponent() && elem.parent._subComp._input_element && elem.parent._subComp._input_element._is_accept_touch)
				{
					if (!elem.parent._subComp._input_element._is_accept_touch(win))
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
				else if (elem.parent._isEditableComponent && elem.parent._isEditableComponent() && elem.parent._input_element && elem.parent._input_element._is_accept_touch)
				{
					if (!elem.parent._input_element._is_accept_touch(win))
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
			}

			if (elem.isInputElement() && elem.enable)
			{
				elem._is_input_touchstart = true;
				elem._on_sys_touchstart(evt);
			}

			return nexacro._syshandler_ontouchstart(this, evt, context);


		};

		this._syshandler_ontouchend_forward = (evt) =>
		{
			const { win, elem, context } = this.GetEventContext(evt);

			if (elem._is_accept_touch)
			{
				if ((!(elem instanceof nexacro.TextBoxElement) || (elem instanceof nexacro.TextBoxElement && elem.parent.parent._isEditableComponent && elem.parent.parent._isEditableComponent())) && !elem._is_accept_touch(win))                        
				{
					const comp1 = win.findComponent(elem);
					const comp2 = win._last_focused_elem ? win.findComponent(win._last_focused_elem) : null;

					if (elem instanceof nexacro.TextBoxElement && comp1._getRootComponent(comp1) instanceof nexacro.Combo && comp2 && comp2._getRootComponent(comp2) instanceof nexacro.Combo)
					{

					}
					else
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
			}
			else if (elem.parent)                    
			{
				if (nexacro._ListViewCellControl && elem.parent instanceof nexacro._ListViewCellControl && elem.parent._subComp && elem.parent._subComp._isEditableComponent && elem.parent._subComp._isEditableComponent() && elem.parent._subComp._input_element && elem.parent._subComp._input_element._is_accept_touch)
				{
					if (!elem.parent._subComp._input_element._is_accept_touch(win))
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
				else if (elem.parent._isEditableComponent && elem.parent._isEditableComponent() && elem.parent._input_element && elem.parent._input_element._is_accept_touch)
				{
					if (!elem.parent._input_element._is_accept_touch(win))
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
			}

			if (elem.isInputElement() && elem.enable)
			{
				elem._on_sys_touchend(evt);
			}
			return nexacro._syshandler_ontouchend(this, evt, context);

		};

		this._syshandler_ontouchmove_forward = (evt) =>
		{
			const { win, elem, context } = this.GetEventContext(evt);

			if (elem._is_accept_touch)
			{
				if ((!(elem instanceof nexacro.TextBoxElement) || (elem instanceof nexacro.TextBoxElement && elem.parent.parent._isEditableComponent && elem.parent.parent._isEditableComponent())) && !elem._is_accept_touch(win))                        
				{
					const comp1 = win.findComponent(elem);
					const comp2 = win._last_focused_elem ? win.findComponent(win._last_focused_elem) : null;

					if (elem instanceof nexacro.TextBoxElement && comp1._getRootComponent(comp1) instanceof nexacro.Combo && comp2 && comp2._getRootComponent(comp2) instanceof nexacro.Combo)
					{

					}
					else
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
			}
			else if (elem.parent)                    
			{
				if (nexacro._ListViewCellControl && elem.parent instanceof nexacro._ListViewCellControl && elem.parent._subComp && elem.parent._subComp._isEditableComponent && elem.parent._subComp._isEditableComponent() && elem.parent._subComp._input_element && elem.parent._subComp._input_element._is_accept_touch)
				{
					if (!elem.parent._subComp._input_element._is_accept_touch(win))
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
				else if (elem.parent._isEditableComponent && elem.parent._isEditableComponent() && elem.parent._input_element && elem.parent._input_element._is_accept_touch)
				{
					if (!elem.parent._input_element._is_accept_touch(win))
					{
						nexacro._stopSysEvent(evt);
						return false;
					}
				}
			}

			if (elem.isInputElement() && elem.enable)
			{
				elem._on_sys_touchmove(evt);
			}

			// disable pull-down to refresh for iOS Chrome
			if (nexacro._OS == "iOS" && nexacro._Browser == "Chrome")
				evt.preventDefault();

			if (elem instanceof nexacro.CanvasElement)
				evt.preventDefault();

			return nexacro._syshandler_ontouchmove(this, evt, context);

		};

		this._syshandler_ontouchcancel_forward = (evt) =>
		{
			const { elem, context } = this.GetEventContext(evt);
			if (elem.isInputElement() && elem.enable)
			{
				return;
				//nexacro._stopSysEvent(evt);
				//return;
			}
			return nexacro._syshandler_ontouchcancel(this, evt, context);

		};

		this._syshandler_ondblclick_forward = this.createSafeEventHandler((evt) =>
		{
			const { context } = this.GetEventContext(evt);
			if (nexacro._isTouchInteraction)
			{
				if (nexacro._OS != "Android")
				{
					evt.stopPropagation();
					evt.preventDefault();
				}
				return false;
			}
			return nexacro._syshandler_ondblclick(this, evt, context);

		});

		this._syshandler_onmouseover_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onmouseover(this, evt, context);
		};
		this._syshandler_onmouseout_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onmouseout(this, evt, context);
		};
		this._syshandler_onkeydown_forward = this.createSafeEventHandler((evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onkeydown(this, evt, context);
		});

		this._syshandler_onkeypress_forward = this.createSafeEventHandler((evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onkeypress(this, evt, context);
		});

		this._syshandler_onkeyup_forward = this.createSafeEventHandler((evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onkeyup(this, evt, context);
		});

		this._syshandler_onmousewheel_forward = this.createSafeEventHandler((evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onmousewheel(this, evt, context);
		});

		this._syshandler_oncontextmenu_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_oncontextmenu(this, evt, context);
		}

		this._syshandler_ondragstart_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);

			evt = window.event || evt;
			return nexacro._syshandler_ondragstart(this, evt, context);
		};

		this._syshandler_ondragenter_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			evt = window.event || evt;
			return nexacro._syshandler_ondragenter(this, evt, context);
		};

		this._syshandler_ondragover_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			evt = window.event || evt;
			return nexacro._syshandler_ondragover(this, evt, context);

		};

		this._syshandler_ondragleave_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			evt = window.event || evt;
			return nexacro._syshandler_ondragleave(this, evt, context);
		};

		this._syshandler_ondrop_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			evt = window.event || evt;
			return nexacro._syshandler_ondrop(this, evt, context);
		};

		this._syshandler_onselectstart_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onselectstart(this, evt, context);
		};

		this._syshandler_onfocusin_forward = (evt) =>
		{
			const { win, elem, release_elem } = this.GetEventContext(evt);
			const env = nexacro.getEnvironment();
			if (env && env._p_enableaccessibility && !nexacro._isTouchInteraction)
			{
				if (evt.sourceCapabilities) // Android talkback off
					return;

				if (win && win._is_fire_sys_keydown === false)
				{
					let refer_comp = null, related_comp = null;
					if (elem)
					{
						refer_comp = win.findComponent(elem);
						if (refer_comp)
						{
							let comp = refer_comp._getRootComponent(refer_comp);
							if (!comp || comp._is_window || comp._is_frame || !comp._is_component)
							{
								comp = win.findComponent(win._last_focused_elem);
							}
							if (comp)
							{
								let reset_scroll = true;
								if (release_elem)
								{
									related_comp = win.findComponent(release_elem);
									related_comp = comp._getRootComponent(related_comp);
								}

								if (related_comp == null || win._cur_ldown_elem)
								{
									reset_scroll = false;
								}

								comp._accessibility_focusin(refer_comp, related_comp, reset_scroll, win);
							}
						}
					}

					if (win._is_fire_sys_focusin === false
						&& (evt.relatedTarget !== null || evt.target === document.activeElement))
					{
						win._is_fire_sys_focusin = true;
					}

					evt.stopPropagation();
				}
			}
		};
		this._syshandler_onfocusout_forward = (evt) =>
		{
			const { win, elem, release_elem } = this.GetEventContext(evt);

			const env = nexacro.getEnvironment();
			if (env && env._p_enableaccessibility && !nexacro._isTouchInteraction)
			{
				if (evt.sourceCapabilities) // Android talkback off
					return;

				if (win && win._is_fire_sys_keydown === false)
				{
					let refer_comp = null, related_comp = null;
					if (elem)
					{
						refer_comp = win.findComponent(elem);
						if (refer_comp)
						{
							let comp = refer_comp._getRootComponent(refer_comp);
							if (comp && !comp._is_window && !comp._is_frame && comp._is_component)
							{
								if (release_elem)
								{
									related_comp = win.findComponent(release_elem);
									related_comp = comp._getRootComponent(related_comp);
								}

								comp._accessibility_focusout(refer_comp, related_comp);
							}
						}
					}
					evt.stopPropagation();
				}
			}
		};
		this._syshandler_onactivate_forward = (evt) =>
		{

			const { win, context } = this.GetEventContext(evt);
			if (nexacro.ismodule)
			{

				if (this._containerChanged(win, evt))
					return nexacro._syshandler_onactivate(this, evt, context);
			}
			else
				return nexacro._syshandler_onactivate(this, evt, context);
		};
		this._syshandler_ondeactivate_forward = (evt) =>
		{
			const { win, context } = this.GetEventContext(evt);
			if (nexacro.ismodule)
			{

				if (this._containerChanged(win, evt))
					nexacro._syshandler_ondeactivate(this, evt, context);

			}
			else
				return nexacro._syshandler_ondeactivate(this, evt, context);

		};
		this._syshandler_onbeforeclose_forward = (evt) =>
		{

			const isDownloadOpeningSymbol = Symbol.for('isDownloadOpening');


			if (
				isDownloadOpeningSymbol in window &&
				window[isDownloadOpeningSymbol] === true
			)
			{
				// export 동작이므로 동작을 건너뜁니다.
				return;
			}

			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onbeforeclose(this, evt, context);
		};
		this._syshandler_onclose_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onclose(this, evt, context);
		};
		this._syshandler_onresize_forward = (evt) =>
		{

			const { context } = this.GetEventContext(evt);

			return nexacro._syshandler_onresize(this, evt, context);
		};
		this._syshandler_onorientationchange_forward = (evt) =>
		{

			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onorientationchange(this, evt, context);
		};
		nexacro.HTMLSysEvent.observerevent.on("onorientationchange", this._syshandler_onorientationchange_forward);

		this._syshandler_onmove_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onmove(this, evt, context);
		};
		nexacro.HTMLSysEvent.observerevent.on("onmove", this._syshandler_onmove_forward);

		this._syshandler_onload_forward = (evt) =>
		{
			const { context } = this.GetEventContext(evt);
			return nexacro._syshandler_onload(this, evt, context);
		};
		this._syshandler_ongesturestart_forward = (evt) =>
		{

			if (!nexacro._allow_default_pinchzoom)
				evt.preventDefault();
		};

		/* proto type을 쓰게되면 classfield 참조가 불가능하므로, 항상 자신의 scope를 바인딩하도록  생성자 내에서 초기화 */
		/* 인스턴스별로 메서드가 생성되므로, 많은 인스턴스를 생성할 경우 메모리 사용량이 증가하지만, container, 즉 app 별로 만드는것이므로 상관없음*/
	};

	nexacro.HTMLSysEvent._getSysEvent = function (handle)
	{
		const evt = nexacro.__MFEAPI._getSysEvent(handle);

		return evt ? evt : nexacro.nexacro_HTMLSysEvent;
	}
	// static 
	nexacro.HTMLSysEvent.hasPositionChanged = function ()
	{
		return nexacro.HTMLSysEvent._old_screenx !== window.screenX || nexacro.HTMLSysEvent._old_screeny !== window.screenY;
	}

	nexacro.HTMLSysEvent.screenXYChange = function ()
	{
		Object.assign(nexacro.HTMLSysEvent, {
			_old_screenx: window.screenX ? window.screenX : window.screenLeft,
			_old_screeny: window.screenY ? window.screenY : window.screenTop
		});
	}
	nexacro.HTMLSysEvent.changePosition = function ()
	{
		if (nexacro.HTMLSysEvent.hasPositionChanged()) 
		{
			nexacro.HTMLSysEvent.screenXYChange();
			return true;
		}
		return false;
	};
	//nexacro.HTMLSysEvent._move_detect_timer = -1;
	nexacro.HTMLSysEvent.ObserverWithEvents = class
	{
		// 한번만 처리되어서, 각 sysevent에 분산되어야 하는 case 추가 "onorientationchange",
		// move와 resize 가 브라우저 윈도우 기준으로 움직이는 case
		constructor()
		{
			this.listeners = new Map();
			this._move_detect_timer = null;
			this._move_debounce = 500;
			this._swap_debounce = 100;

			// document 종료시에 clear
			//window.addEventListener("unload", this.clear, { once: true });
			if (nexacro._SupportOrientation)
				nexacro._observeSysEvent(window, "orientationchange", "onorientationchange", this._syshandler_onorientationchange_forward);

			this.start_move_timer(true);
		}
		on(event, listener)
		{
			if (!this.listeners.has(event))
				this.listeners.set(event, new Set());

			this.listeners.get(event).add(listener);
		}
		off(event, listener)
		{
			if (this.listeners.has(event)) 
			{
				this.listeners.get(event).delete(listener);

				if (this.listeners.get(event).size === 0)
					this.listeners.delete(event);
			}
		}
		emit(event, ...args)
		{
			if (this.listeners.has(event))
				this.listeners.get(event).forEach((listener) => listener(...args));
		}
		stop_move_timer()
		{
			if (this._move_detect_timer)
			{
				clearTimeout(this._move_detect_timer);
				this._move_detect_timer = null;
			}
		}
		start_move_timer(first = false)
		{
			if (first)
				nexacro.HTMLSysEvent.screenXYChange()
			this._move_detect_timer = setTimeout(this._syshandler_onmove_forward, this._move_debounce);
		}
		stop_screen_timer(_tester)
		{
			if (_tester.swap_screen_timer)
			{
				clearInterval(_tester.swap_screen_timer);
				_tester.swap_screen_timer = null;
			}
		}
		screen_task_retcallback(_tester)
		{
			const delayed_swap_screen = (_tester.delayed_swap_screen === undefined) ? nexacro._searchDeviceExceptionValue("delayed_swap_screen") : _tester.delayed_swap_screen;
			if (delayed_swap_screen === true || (nexacro._BrowserExtra == "SamsungBrowser" && nexacro._OSVersion > 9))
			{
				nexacro._is_reseting_viewport = true;
				return function ()
				{
					const p_w = _tester.portrait_screen_width;
					const l_w = _tester.landscape_screen_width;
					const s_w = nexacro._getScreenWidth();
					if (nexacro._isPortrait())
					{
						if ((l_w && l_w != s_w) || (p_w && p_w == s_w))
						{
							this.stop_screen_timer(_tester)
							nexacro.__setViewportScale();
							nexacro._is_reseting_viewport = false;
						}
					}
					else
					{
						if ((p_w && p_w != s_w) || (l_w && l_w == s_w))
						{
							this.stop_screen_timer(_tester)
							nexacro.__setViewportScale();
							nexacro._is_reseting_viewport = false;
						}
					}
				}.bind(this)
			}
			else
			{
				const reset_viewport_delay = nexacro._searchDeviceExceptionValue("reset_viewport_delay");
				if (reset_viewport_delay == 0)
					nexacro.__setViewportScale();
				else
					setTimeout(function () { nexacro.__setViewportScale(); }, reset_viewport_delay);

				if (_tester.swap_screen === false && _tester.delayed_swap_screen_checked === false)
				{
					_tester.delayed_swap_screen_check_cnt = 0;
					this.stop_screen_timer(_tester);

					return function ()
					{
						const p_w = _tester.portrait_screen_width;
						const l_w = _tester.landscape_screen_width;
						let is_changed = false;
						if (nexacro._isPortrait())
						{
							if ((l_w && l_w != nexacro._getScreenWidth()) || (p_w && p_w == nexacro._getScreenWidth()))
								is_changed = true;
						}
						else
						{
							if ((p_w && p_w != nexacro._getScreenWidth()) || (l_w && l_w == nexacro._getScreenWidth()))
								is_changed = true;
						}
						if (is_changed || _tester.delayed_swap_screen_check_cnt == 10)
						{
							this.stop_screen_timer(_tester);
							_tester.delayed_swap_screen = is_changed;
							_tester.delayed_swap_screen_checked = true;

							// screen 값이 늦게 swap되는 이상한 환경이다!
							if (is_changed)
								nexacro.__setViewportScale();
							return;
						}

						_tester.delayed_swap_screen_check_cnt++;

					}.bind(this)
				}
			}
			return undefined;

		}
		start_screen_timer(_tester)
		{
			const callback = this.screen_task_retcallback(_tester);
			if (callback)
				_tester.swap_screen_timer = setInterval(callback, this._swap_debounce);
		}
		_syshandler_onorientationchange_forward = (evt) =>
		{
			const reset_viewport = nexacro._searchDeviceExceptionValue("orientationchange_reset_viewport");
			if (reset_viewport)
			{
				const _tester = nexacro._device_exception_tester;
				if (_tester.screen_checked && _tester.screen_swap_checked === false)
				{
					if (_tester.is_init_screen_portrait != nexacro._isPortrait())
					{
						_tester.swap_screen = (_tester.init_screen_width == nexacro._getScreenWidth()) ? false : true;
						_tester.screen_swap_checked = true;
					}
				}
				this.start_screen_timer(_tester);
			}
			evt = window.event || evt;
			this.emit("onorientationchange", evt ? evt : {});
		}
		_syshandler_onmove_forward = (evt) =>
		{
			this.stop_move_timer();
			let result = undefined;
			try
			{
				if (nexacro.HTMLSysEvent.changePosition())
					this.emit("onmove", evt ? evt : {});
			}
			catch (e) { result = false; }
			finally
			{
				this.start_move_timer();
			}
			return result;

		}
		clear = () =>
		{
			this.stop_move_timer();
			this.stop_screen_timer(nexacro._device_exception_tester);
			this.listeners.clear()


			this._move_debounce = null;
			this._swap_debounce = null;
			this.listeners = null;
			if (nexacro._SupportOrientation)
				nexacro._stopSysObserving(window, "orientationchange", "onorientationchange", this._syshandler_onorientationchange_forward);
		}
	}

	nexacro.HTMLSysEvent.observerevent = new nexacro.HTMLSysEvent.ObserverWithEvents();

	const _pHTMLSysEvent = nexacro.HTMLSysEvent.prototype;

	_pHTMLSysEvent.KEY_BACKSPACE = 8;
	_pHTMLSysEvent.KEY_TAB = 9;
	_pHTMLSysEvent.KEY_RETURN = 13;
	_pHTMLSysEvent.KEY_ESC = 27;
	_pHTMLSysEvent.KEY_SPACE = 32;
	_pHTMLSysEvent.KEY_LEFT = 37;
	_pHTMLSysEvent.KEY_UP = 38;
	_pHTMLSysEvent.KEY_RIGHT = 39;
	_pHTMLSysEvent.KEY_DOWN = 40;
	_pHTMLSysEvent.KEY_DELETE = 46;
	_pHTMLSysEvent.KEY_HOME = 36;
	_pHTMLSysEvent.KEY_END = 35;
	_pHTMLSysEvent.KEY_PAGEUP = 33;
	_pHTMLSysEvent.KEY_PAGEDOWN = 34;
	_pHTMLSysEvent.KEY_INSERT = 45;
	_pHTMLSysEvent.MOUSE_LBUTTON = 0;
	_pHTMLSysEvent.MOUSE_MBUTTON = 1;
	_pHTMLSysEvent.MOUSE_RBUTTON = 2;

	_pHTMLSysEvent.createSafeEventHandler = function (handler)
	{
		return (evt) => 
		{
			if (!nexacro.__getWindowHandleEnable(this.container ? this.container : window)) 
			{
				nexacro._stopSysEvent(evt);
				return;
			}
			handler(evt);
		};
	};

	_pHTMLSysEvent.GetEventContext = function (evt)
	{
		const win = this._win ? this._win : nexacro._findWindow(this.container ? this.container : window);
		const elem = evt ? nexacro._getSysEventElement(evt) : undefined;
		const release_elem = evt ? nexacro._getSysReleaseEventElement(evt) : undefined;
		const lastfocus_elem = evt ? nexacro.__findParentElementForKeyEvent(evt.target, win) : undefined;
		const keycode = evt ? nexacro._getSysEventKeyCode(evt) : undefined;

		if (nexacro._Browser == "Gecko" && (evt instanceof DragEvent || evt instanceof MouseEvent))
			window.event = evt;


		if (win)
		{

			if (evt && evt.screenX)
			{
				win._event_positions.screenX = evt.screenX;
				win._event_positions.screenY = evt.screenY;
				win._event_positions.clientX = evt.clientX;
				win._event_positions.clientY = evt.clientY;
			}

		}
		const result = { win, elem, release_elem, lastfocus_elem, keycode };


		return {
			...result,
			context: result
		};
	};

	_pHTMLSysEvent._initDocEventHandler = function ()
	{
		const target = this.container ? this.container : document.body;
		const winbubbletarget = this.container ? this.container : window;
		// key event = 반드시 자신에서만 발생하고 상위로 버블되지 않음

		// 내부 messagequque 나, iframe 통신용 (대체기술 사용)
		nexacro._observeSysEvent(window, "popstate", "onpopstate", this._syshandler_onpopstate_forward);
		nexacro._observeSysEvent(window, "message", "onmessage", this._syshandler_onmessage_forward);
		nexacro._observeSysEvent(target, "mousedown", "onmousedown", this._syshandler_onmousedown_forward);
		nexacro._observeSysEvent(target, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
		nexacro._observeSysEvent(target, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
		nexacro._observeSysEvent(target, "mouseover", "onmouseover", this._syshandler_onmouseover_forward);
		nexacro._observeSysEvent(target, "mouseout", "onmouseout", this._syshandler_onmouseout_forward);
		nexacro._observeSysEvent(target, "mousewheel", "onmousewheel", this._syshandler_onmousewheel_forward);

		if (nexacro._SupportTouchEvent)
		{
			nexacro._observeSysEvent(target, "touchstart", "ontouchstart", this._syshandler_ontouchstart_forward);
			nexacro._observeSysEvent(target, "touchend", "ontouchend", this._syshandler_ontouchend_forward);
			nexacro._observeSysEvent(target, "touchmove", "ontouchmove", this._syshandler_ontouchmove_forward);
			nexacro._observeSysEvent(target, "touchcancel", "ontouchcancel", this._syshandler_ontouchcancel_forward);


			if (nexacro._Browser == "MobileSafari")
			{
				nexacro._observeSysEvent(target, "gesturestart", "ongesturestart", this._syshandler_ongesturestart_forward);
			}
		}
		nexacro._observeSysEvent(target, "dblclick", "ondblclick", this._syshandler_ondblclick_forward);
		nexacro._observeSysEvent(target, "keydown", "onkeydown", this._syshandler_onkeydown_forward);
		nexacro._observeSysEvent(target, "keypress", "onkeypress", this._syshandler_onkeypress_forward);
		nexacro._observeSysEvent(target, "keyup", "onkeyup", this._syshandler_onkeyup_forward);
		nexacro._observeSysEvent(target, "contextmenu", "oncontextmenu", this._syshandler_oncontextmenu_forward);
		nexacro._observeSysEvent(target, "select", "onselect", this._syshandler_onselectstart_forward);
		nexacro._observeSysEvent(target, "selectstart", "onselectstart", this._syshandler_onselectstart_forward);
		nexacro._observeSysEvent(target, "load", "onload", this._syshandler_onload_forward);
		nexacro._observeSysEvent(target, "dragstart", "ondragstart", this._syshandler_ondragstart_forward);
		nexacro._observeSysEvent(target, "dragenter", "ondragenter", this._syshandler_ondragenter_forward);
		nexacro._observeSysEvent(target, "dragover", "ondragover", this._syshandler_ondragover_forward);
		nexacro._observeSysEvent(target, "dragleave", "ondragleave", this._syshandler_ondragleave_forward);
		nexacro._observeSysEvent(target, "drop", "ondrop", this._syshandler_ondrop_forward);


		// 이건 또 왜 반대인가
		if (nexacro._Browser == "Gecko" && nexacro._BrowserVersion >= 57)
			nexacro._observeSysEvent(target, "DOMMouseScroll", "onDOMMouseScroll", this._syshandler_onmousewheel_forward);
		else
			nexacro._observeSysEvent(target, "wheel", "onwheel", this._syshandler_onmousewheel_forward);

		// 가상커서 동작지원			
		nexacro._observeSysEvent(winbubbletarget, "focusin", "onfocusin", this._syshandler_onfocusin_forward);
		nexacro._observeSysEvent(winbubbletarget, "focusout", "onfocusout", this._syshandler_onfocusout_forward);


		if (winbubbletarget !== window)
			nexacro._observeSysEvent(winbubbletarget, "focusin", "onfocusin", this._syshandler_onactivate_forward);
		else
			nexacro._observeSysEvent(winbubbletarget, "focus", "onfocus", this._syshandler_onactivate_forward);

		if (winbubbletarget !== window)
			nexacro._observeSysEvent(winbubbletarget, "focusout", "onfocusout", this._syshandler_ondeactivate_forward);
		else
			nexacro._observeSysEvent(winbubbletarget, "blur", "onblur", this._syshandler_ondeactivate_forward);

		nexacro._observeSysEvent(winbubbletarget, "resize", "onresize", this._syshandler_onresize_forward);
		nexacro._observeSysEvent(window, "unload", "onunload", this._syshandler_onclose_forward);
		nexacro._observeSysEvent(window, "beforeunload", "onbeforeunload", this._syshandler_onbeforeclose_forward);

	};
	_pHTMLSysEvent._stopDocEventHandler = function ()
	{
		const target = this.container ? this.container : document.body;
		const winbubbletarget = this.container ? this.container : window;

		nexacro._stopSysObserving(target, "mousedown", "onmousedown", this._syshandler_onmousedown_forward);
		nexacro._stopSysObserving(target, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
		nexacro._stopSysObserving(target, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
		nexacro._stopSysObserving(target, "mouseover", "onmouseover", this._syshandler_onmouseover_forward);
		nexacro._stopSysObserving(target, "mouseout", "onmouseout", this._syshandler_onmouseout_forward);
		nexacro._stopSysObserving(target, "mousewheel", "onmousewheel", this._syshandler_onmousewheel_forward);
		if (nexacro._SupportTouchEvent)
		{
			nexacro._stopSysObserving(target, "touchstart", "ontouchstart", this._syshandler_ontouchstart_forward);
			nexacro._stopSysObserving(target, "touchend", "ontouchend", this._syshandler_ontouchend_forward);
			nexacro._stopSysObserving(target, "touchmove", "ontouchmove", this._syshandler_ontouchmove_forward);
			nexacro._stopSysObserving(target, "touchcancel", "ontouchcancel", this._syshandler_ontouchcancel_forward);

			if (nexacro._Browser == "MobileSafari")
			{
				nexacro._stopSysObserving(target, "gesturestart", "ongesturestart", this._syshandler_ongesturestart_forward);
			}
		}
		nexacro._stopSysObserving(target, "dblclick", "ondblclick", this._syshandler_ondblclick_forward);
		nexacro._stopSysObserving(target, "keydown", "onkeydown", this._syshandler_onkeydown_forward);
		nexacro._stopSysObserving(target, "keypress", "onkeypress", this._syshandler_onkeypress_forward);
		nexacro._stopSysObserving(target, "keyup", "onkeyup", this._syshandler_onkeyup_forward);

		if (nexacro._Browser == "Gecko" && nexacro._BrowserVersion >= 57)
			nexacro._stopSysObserving(target, "DOMMouseScroll", "onDOMMouseScroll", this._syshandler_onmousewheel_forward);
		else
			nexacro._stopSysObserving(document.body, "wheel", "onwheel", this._syshandler_onmousewheel_forward);

		nexacro._stopSysObserving(target, "contextmenu", "oncontextmenu", this._syshandler_oncontextmenu_forward);
		nexacro._stopSysObserving(target, "dragstart", "ondragstart", this._syshandler_dragstart_forward);
		nexacro._stopSysObserving(target, "select", "onselect", this._syshandler_onselectstart_forward);
		nexacro._stopSysObserving(target, "selectstart", "onselectstart", this._syshandler_onselectstart_forward);

		nexacro._stopSysObserving(target, "dragstart", "ondragstart", this._syshandler_ondragstart_forward);
		nexacro._stopSysObserving(target, "dragenter", "ondragenter", this._syshandler_ondragenter_forward);
		nexacro._stopSysObserving(target, "dragover", "ondragover", this._syshandler_ondragover_forward);
		nexacro._stopSysObserving(target, "dragleave", "ondragleave", this._syshandler_ondragleave_forward);
		nexacro._stopSysObserving(target, "drop", "ondrop", this._syshandler_ondrop_forward);

		nexacro._stopSysObserving(winbubbletarget, "focusin", "onfocusin", this._syshandler_onfocusin_forward);
		nexacro._stopSysObserving(winbubbletarget, "focusout", "onfocusout", this._syshandler_onfocusout_forward);


		if (winbubbletarget !== window)
			nexacro._stopSysObserving(winbubbletarget, "focusin", "onfocusin", this._syshandler_onactivate_forward);
		else
			nexacro._stopSysObserving(winbubbletarget, "focus", "onfocus", this._syshandler_onactivate_forward);


		if (winbubbletarget !== window)
			nexacro._stopSysObserving(winbubbletarget, "focusout", "onfocusout", this._syshandler_ondeactivate_forward);
		else
			nexacro._stopSysObserving(window, "blur", "onblur", this._syshandler_ondeactivate_forward);

		nexacro._stopSysObserving(winbubbletarget, "resize", "onresize", this._syshandler_onresize_forward);


		nexacro._stopSysObserving(window, "load", "onload", this._syshandler_onload_forward);
		nexacro._stopSysObserving(window, "unload", "onunload", this._syshandler_onclose_forward);
		nexacro._stopSysObserving(window, "beforeunload", "onbeforeunload", this._syshandler_onbeforeclose_forward);
		nexacro._stopSysObserving(window, "message", "onmessage", this._syshandler_onmessage_forward);
		nexacro._stopSysObserving(window, "popstate", "onpopstate", this._syshandler_onpopstate_forward);

		nexacro.HTMLSysEvent.observerevent.off("onmove", this._syshandler_onmove_forward);
		nexacro.HTMLSysEvent.observerevent.off("onorientationchange", this._syshandler_onorientationchange_forward);




	};

	_pHTMLSysEvent.lockMouseMove = function (/*node*/)
	{
		const target = this.container ? this.container : document.body;

		nexacro._stopSysObserving(target, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
		nexacro._stopSysObserving(target, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
		nexacro._observeSysEvent(window, "mousemove", "onmousemove", this._syshandler_lock_onmousemove_forward, true);
		nexacro._observeSysEvent(window, "mouseup", "onmouseup", this._syshandler_lock_onmouseup_forward, true);
	};
	_pHTMLSysEvent.unlockMouseMove = function (/*node*/)
	{
		const target = this.container ? this.container : document.body;

		nexacro._stopSysObserving(window, "mousemove", "onmousemove", this._syshandler_lock_onmousemove_forward, true);
		nexacro._stopSysObserving(window, "mouseup", "onmouseup", this._syshandler_lock_onmouseup_forward, true);
		nexacro._observeSysEvent(target, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
		nexacro._observeSysEvent(target, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
	};



	_pHTMLSysEvent.clearAll = function (browserexit = false)
	{
		if (browserexit)
		{
			nexacro.HTMLSysEvent.observerevent.clear();
			nexacro.HTMLSysEvent.observerevent = null;
		}
		this.container = null
		this._cur_over_elem = null;

		this._syshandler_onpopstate_forward = null;
		this._syshandler_onmessage_forward = null;
		this._syshandler_onmousedown_forward = null;
		this._syshandler_onmouseup_forward = null;
		this._syshandler_lock_onmouseup_forward = null;
		this._syshandler_onmousemove_forward = null;
		this._syshandler_lock_onmousemove_forward = null;
		this._syshandler_ontouchstart_forward = null;
		this._syshandler_ontouchend_forward = null;
		this._syshandler_ontouchmove_forward = null;
		this._syshandler_ontouchcancel_forward = null;
		this._syshandler_ondblclick_forward = null;
		this._syshandler_onmouseover_forward = null;
		this._syshandler_onmouseout_forward = null;
		this._syshandler_onkeydown_forward = null;
		this._syshandler_onkeypress_forward = null;
		this._syshandler_onkeyup_forward = null;
		this._syshandler_onmousewheel_forward = null;
		this._syshandler_oncontextmenu_forward = null;
		this._syshandler_ondragstart_forward = null;
		this._syshandler_ondragenter_forward = null;
		this._syshandler_ondragover_forward = null;
		this._syshandler_ondragleave_forward = null;
		this._syshandler_ondrop_forward = null;
		this._syshandler_onselectstart_forward = null;
		this._syshandler_onactivate_forward = null;
		this._syshandler_ondeactivate_forward = null;
		this._syshandler_onbeforeclose_forward = null;
		this._syshandler_onclose_forward = null;
		this._syshandler_onresize_forward = null;
		this._syshandler_onorientationchange_forward = null;
		this._syshandler_onmove_forward = null;
		this._syshandler_onload_forward = null;
	};




	//==============================================================================
	nexacro.__getRealWindowHandle = function (_cur_win)
	{
		var _cur_nexacro = _cur_win.nexacro;
		var p = _cur_win;
		try
		{
			while (true)
			{
				// nexacro root으로 제한.
				if (p.parent && p != p.parent && p.parent.nexacro && p.parent.nexacro == _cur_nexacro)
					p = p.parent;
				else
					break;
			}
		}
		catch (e)
		{
			// nexacro on iframe - cross origin problem
			//return _cur_win;
			//if (e && e.message)
			//	trace(e.message);
			nexacro._settracemsg(e);
		}

		return p;
	};

	nexacro._initHTMLSysEvent = function (/*_cur_win, _cur_doc*/)
	{
		// root window 를 찾아나가는 구조 삭제 
		//var _win_win = nexacro.__getRealWindowHandle(_cur_win);
		//var _win_doc = _win_win ? _win_win.document : document;
		nexacro.__setDOMStyle_overscrollBehavior(nexacro._getWindowDestinationHandle(window).style);

		// init forward functions
		//nexacro._createSysEvent_ForwardFuncs(_cur_win);


		const _sysEvent = nexacro.nexacro_HTMLSysEvent = new nexacro.HTMLSysEvent(/*_win_win, _win_doc, _cur_win, _cur_doc*/window);
		// init handlers
		_sysEvent._initDocEventHandler();
	};

	/*nexacro._preparePopupFrame = function (_cur_win, _cur_doc, urlparams, fontface_info)
	{
		function onloadpopupframe()
		{
			nexacro._createPopupFrame(_cur_win, urlparams);
		}

		nexacro._initHTMLSysEvent(_cur_win, _cur_doc);

		// 제너레이션 작업 완료후 삭제
		if (urlparams)
			nexacro._prepareManagerFrame(onloadpopupframe, fontface_info);
		else
			nexacro._prepareManagerFrame();
	};
*/
	nexacro._preparePopupFrame = function (_cur_win, _cur_doc, urlparams, fontface_info)
	{
		var envpreload = false;
		if (arguments.length >= 4)
		{
			const arg1 = arguments[3];
			if (typeof arg1 == "boolean")
				envpreload = arg1;
			else if (typeof arg1 == "object")
				fontface_info = arg1;
		}

		function onloadpopupframe()
		{
			nexacro._createPopupFrame(_cur_win, urlparams, envpreload);
		}

		nexacro._initHTMLSysEvent(_cur_win, _cur_doc);

		// 제너레이션 작업 완료후 삭제
		if (urlparams)
		{
			const env = nexacro.getEnvironment();
			fontface_info = env && env.on_getUserFontInfo ? env.on_getUserFontInfo() : null;
			nexacro._prepareManagerFrame(onloadpopupframe, fontface_info);
		}
		else
			nexacro._prepareManagerFrame();
	};

	nexacro._createPopupFrame = function (_cur_win, urlparams, envpreloaded)
	{
		var name = urlparams.framename;
		nexacro._uniquestoragevalue = urlparams.loadtime; //nexacro.open 수행시 environment가 늦게 로딩되어 nexacro._uniquestoragevalue 값을 localstorage에서 얻어올수 없어 param으로 처리

		if (!envpreloaded)
			nexacro._initScreen();

		var parent_handle = _cur_win.opener || parent;
		var parent_win = nexacro._findWindow(_cur_win.opener || parent);
		var _win = new nexacro._Window(name, parent_win);
		_win.setLinkedWindow(_cur_win);

		var env = nexacro.getEnvironment();

		env.loadVariables = nexacro._emptyFn;
		//env.loadTypeDefinition = nexacro._emptyFn;

		if (!envpreloaded)
		{
			env._load();  // 이때 xadl 값은 설정되어 있어야 한다.

		}
		else
		{
			nexacro._screenInfoToInternal();
			nexacro._initializeGlobalObjects(_cur_win);
			nexacro._setRootNodeClassName();
			nexacro._registerClass(env._getRegisterClass(), _cur_win);
			nexacro._getExtUserCssScreenType = nexacro._getCurrentScreenType;
			env._loadExternals();

		}



		if (parent_win)
		{
			parent_win.addChild(_win);
		}

		let popupframeoption;
		if (parent_handle._nexacro_popupframeoption)
		{
			popupframeoption = parent_handle._nexacro_popupframeoption[name];
			if (popupframeoption)
			{
				parent_handle._nexacro_popupframeoption[name] = null;
				delete parent_handle._nexacro_popupframeoption[name];
			}
		}

		var childframe = new nexacro.ChildFrame(name);
		if (parent_handle.nexacro)
		{
			var pNexacro = parent_handle.nexacro;
			pNexacro._registerPopupFrame(name, childframe, parent_win);
		}
		childframe._popupframeoption = popupframeoption;
		childframe._showModeless(name, _win);
	};

	nexacro._getPopupFrames = function (winobj)
	{
		var context = window;

		if (winobj)
			context = winobj.handle;

		if (context._popupframes)
			return context._popupframes;
		else
			return context._popupframes = new nexacro.Collection();

	};

	nexacro._isPopupFrame = function (id, parentframe)
	{
		//if (nexacro._window._popupframes.get_item(id) != null)
		//    return true;
		//return false;	    
		let popupframes;
		if (!parentframe)
		{
			let _window = nexacro._getMainWindowHandle();
			popupframes = _window?._popupframes;
		}
		else
			popupframes = window._popupframes;

		if (popupframes && popupframes.get_item(id) != null)
			return true;
		return false;
	};

	nexacro._registerPopupFrame = function (id, frame, winobj)
	{
		var context = window;
		if (winobj)
			context = winobj.handle;

		if (!context._popupframes)
			context._popupframes = new nexacro.Collection();

		if (context._popupframes.get_item(id) != null)
			return -1;

		return context._popupframes.add_item(id, frame);

	};

	nexacro._unregisterPopupFrame = function (id, winobj, isparentnull)
	{
		var context;
		if (winobj && winobj.parent && isparentnull)
		{
			//popupframe의 parent 가 null 인 경우 처리 
			context = winobj.parent.handle;
			context.nexacro._unregisterPopupFrame(id);
		}
		else
		{
			context = window;
			if (winobj)
				context = winobj.handle;
			if (context._popupframes)
			{
				context._popupframes.delete_item(id);
				if (context._popupframes.length == 0)
					context._popupframes = null;
			}
		}

		// TODO check 필요한 코드인지?
		//this._activeform = null; 사용하는 곳이 없음
	};

	nexacro._cleanupPopupFrame = function (id, parentframe)
	{
		let target, win;
		var _type = 0;
		if (parentframe && parentframe[id])
		{
			target = parentframe[id];
			_type = 1;

		}
		else 
		{
			if (!parentframe)
			{
				win = nexacro._getMainWindowHandle();
				target = win?._popupframes?.get_item(id);
				if (target)
					_type = 2;
			}
			//var popupframes = window._popupframes;
			//target = popupframes?.get_item(id);
			//_type = 2;
		}
		if (target)
		{
			try
			{
				const wnd = target._getWindow();
				if (wnd)
				{
					var handle = wnd.handle;
					if (handle && handle.closed)
					{
						nexacro._unregisterPopupFrame(id);
						target._is_alive = true;
						wnd._is_alive = true;
						wnd.destroy();
					}
				}
			}
			catch (e)
			{
				switch (_type)
				{
					case 1:
						parentframe.removeChild(id);
						break;
					case 2:
						nexacro._unregisterPopupFrame(id);
						break;

				}
			}
		}
	};

	nexacro._setLastEventName = function (evtName)
	{
		nexacro._last_eventname = evtName;
	};
	nexacro._getLastEventName = function ()
	{
		return nexacro._last_eventname;
	};

	nexacro._compositionComplete = function (win, elem)
	{
		var last_focused = win._last_focused_elem;
		if (last_focused != elem)
		{
			if (nexacro._OS == "iOS" || nexacro._OS == "Mac OS")
			{
				if (elem.isInputElement())
				{
					var input_handle = last_focused.handle;
					input_handle.blur();
					return;
				}
			}
		}
	};


	nexacro._syshandler_onpopstate = function (_sysEvent, evt, context)
	{
		const { win } = context;
		win._on_sys_popstate(evt.state);
	};

	nexacro._syshandler_onmessage = function (_sysEvent, evt, context)
	{
		const { win } = context;
		win._on_sys_message(evt.data);
	};

	nexacro._syshandler_onmousedown = function (_sysEvent, evt, context)
	{
		let ret = false;

		const { win, elem } = context;
		if (!win || !elem)
			return ret;

		const last_focused_elem = win._last_focused_elem;
		const last_focused_elem_composing = (last_focused_elem && last_focused_elem.isInputElement() && last_focused_elem.isComposing()) ? true : false;


		win._on_sys_activate(_sysEvent, evt);


		if (evt.button == nexacro.HTMLSysEvent.prototype.MOUSE_LBUTTON)
		{
			/* mouse event check from virtual cursor in sensereader */
			win._is_fire_virtual_mousedown = false; //init
			if (nexacro._getAccessibilityVirtualCursorMouseEvent(evt))
			{
				win._is_fire_virtual_mousedown = true;
			}
			ret = win._on_sys_lbuttondown(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			_sysEvent.lockMouseMove(evt.target);

			if (!(elem.isInputElement() && elem.enable))
			{
				if (last_focused_elem_composing)
					last_focused_elem.on_complete_composition_value();


				// 브라우저에 의해 클릭된 Element가 Focus를 가져가기때문에 Default동작을 막아야 함.
				// TODO check 임시방편 현재 preventDefault 처리하면 Input만 문제가 됨
				// Google Chrome에서 Disable된 input클릭시 focus가 옮겨가는 문제 수정 2013.08.28 neoarc
				if (!(/*last_focused_elem instanceof nexacro._WebBrowserPluginElement*/nexacro._isWebTypeElement(last_focused_elem)))
					nexacro._stopSysEvent(evt);
			}

			if (ret === false)
				nexacro._stopSysEvent(evt);

			nexacro._compositionComplete(win, elem);
		}
		else if (evt.button == nexacro.HTMLSysEvent.prototype.MOUSE_RBUTTON)
		{
			ret = win._on_sys_rbuttondown(elem, "rbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);

			if (!(elem.isInputElement() && elem.enable))
			{
				if (last_focused_elem_composing)
					last_focused_elem.on_complete_composition_value();

				nexacro._stopSysEvent(evt);
			}

			if (ret === false)
				nexacro._stopSysEvent(evt);

			nexacro._compositionComplete(win, elem);
		}
		else
		{
			ret = win._on_sys_mousedown(elem, "mbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			if (!(elem.isInputElement() && elem.enable))
			{
				if (last_focused_elem_composing)
					last_focused_elem.on_complete_composition_value();

				nexacro._stopSysEvent(evt);
			}

			if (ret === false)
				nexacro._stopSysEvent(evt);


			nexacro._compositionComplete(win, elem);
		}

		return ret;
	};
	nexacro._syshandler_onmouseup = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;

		let ret = false;
		if (win && elem)
		{
			win._is_fire_sys_focusin = false; // focusin flag init

			// e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임				
			if (evt.button == nexacro.HTMLSysEvent.prototype.MOUSE_RBUTTON)
				ret = win._on_sys_rbuttonup(elem, "rbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			else
				ret = win._on_sys_mouseup(elem, "mbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);

			win._is_block_event_process = false; //init
			return ret;
		}
		return false;
	};

	nexacro._syshandler_lock_onmouseup = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;
		_sysEvent.unlockMouseMove(evt.target);
		let ret = false;

		if (win)
		{
			win._is_fire_sys_focusin = false; //init

			if (evt.button == nexacro.HTMLSysEvent.prototype.MOUSE_LBUTTON)
			{
				/* mouse event check from virtual cursor in sensereader */
				if (!nexacro._getAccessibilityVirtualCursorMouseEvent(evt))
				{
					win._is_fire_virtual_mousedown = false;
				}
				ret = win._on_sys_lbuttonup(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);

				win._is_fire_virtual_mousedown = false; //init
			}
		}
		return ret;
	};

	nexacro._syshandler_onmousemove = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;

		if (!win)
			return false;


		if (win._cur_screen_pos.x == evt.screenX && win._cur_screen_pos.y == evt.screenY)
			return false;

		else 
		{
			win._cur_screen_pos.x = evt.screenX;
			win._cur_screen_pos.y = evt.screenY;
		}
		const button = (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"));

		if (elem)
		{
			win._on_sys_mousemove(elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			return true;
		}
		return false;
	};
	nexacro._syshandler_lock_onmousemove = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;
		if (!win)
			return false;

		const dp = nexacro._getDevicePixelRatio();
		// TitleBar는 전체 browser 영역기준으로 x,y
		const w_x = nexacro._getWindowHandlePosX(win.handle);
		const w_y = nexacro._getWindowHandlePosY(win.handle);

		const w_width = nexacro._getWindowHandleClientWidth(win.handle) * dp;
		const w_height = nexacro._getWindowHandleClientHeight(win.handle) * dp;

		if (win._cur_screen_pos.x == evt.screenX && win._cur_screen_pos.y == evt.screenY)
			return false;

		else if (evt.screenX < w_x || evt.screenX > (w_x + w_width) || evt.screenY < w_y || evt.screenY > (w_y + w_height))
		{
			if (nexacro._cur_track_info && nexacro._cur_track_info.target instanceof nexacro.TitleBarControl)
			{
				// 타이틀바가 클라이언트영역을 벗어나면 트랙이 끊어지는 문제가 있어서 처리
				if (!nexacro._macOSWebView)
				{
					return false;
				}
			}
		}

		win._cur_screen_pos.x = evt.screenX;
		win._cur_screen_pos.y = evt.screenY;

		if (elem)
		{
			// e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
			win._on_sys_mousemove(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			return true;
		}
		else
		{
			win._on_sys_mousemove(null, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
		}
		return false;
	};
	nexacro._syshandler_onmousewheel = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;
		let ret;
		if (win && elem)
		{
			if (evt.ctrlKey)
				win._keydown_element = null;

			// e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
			ret = win._on_sys_mousewheel(elem, nexacro.__getWheelDeltaX(evt), nexacro.__getWheelDeltaY(evt), nexacro._getSysEventBtnString({ button: 1, which: 2 }), evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			if (ret === false)
			{
				nexacro._stopSysEvent(evt);
			}
			return;
		}
		return false;
	};

	nexacro._syshandler_ontouchstart = function (_sysEvent, evt, context)
	{
		let { win, elem } = context;
		let node = elem;
		if (evt.stopped === true)
			return;

		// init or orientationchange 시점에 이벤트 중지
		win._is_active_window = true;

		if (!win || win._isFrozen)
			return;


		let touch, touchid, screenX, screenY, curTime, i;
		if (elem)
		{
			const last_focused_elem = win._last_focused_elem;
			const _doc = elem._getRootWindowHandle();
			const active_dom = _doc.activeElement;

			if (nexacro._Browser == "MobileSafari")
			{
				if (nexacro._isHybrid && nexacro._isHybrid())
				{
					if (win._is_active_window === false)
						win._on_sys_activate();
				}

				if (last_focused_elem && last_focused_elem != elem)
				{
					if (!(elem.isInputElement() || elem instanceof nexacro.TextAreaElement) &&
						(active_dom && (active_dom.tagName == "INPUT" || active_dom.tagName == "TEXTAREA")))
					{
						if (!nexacro._isSameComponent(last_focused_elem, elem))
						{
							let start = 0, end = 0;
							if (last_focused_elem.isInputElement())
							{
								const pos = last_focused_elem.getElementCaretPos();
								if (pos !== -1)
								{
									start = pos.begin;
									end = pos.end;
								}
							}
							const input_handle = last_focused_elem.handle;
							nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, start, end);
							//input_handle.blur();
						}
					}
				}
			}

			curTime = (evt.timeStamp || (new Date()).getTime());

			const touches = evt.touches, changedTouches = evt.changedTouches;
			const touch_len = touches.length, change_len = changedTouches.length;
			const type = evt.type || "touchstart";
			//var is_first = (touch_len == change_len);

			let touch_node, touch_elem, touch_info, windowX, windowY, changed;
			let changed_ids = {}, touch_infos = [], changed_touch_infos = [];

			for (i = 0; i < change_len; i++)
			{
				touch = changedTouches[i];
				changed_ids[touch.identifier] = true;
			}

			for (i = 0; i < touch_len; i++)
			{
				touch = touches[i];
				touch_node = touch.target;
				if (touch_node && touch_node != node)
					touch_elem = nexacro.__findParentElement(touch_node);
				else
					touch_elem = elem;


				touchid = touch.identifier;
				changed = changed_ids[touchid];
				windowX = nexacro.__getWindowX(touch);
				windowY = nexacro.__getWindowY(touch);
				screenX = nexacro.__getScreenX(touch);
				screenY = nexacro.__getScreenY(touch);

				touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, changed, windowX, windowY, screenX, screenY);
				touch_infos.push(touch_info);
				if (changed)
					changed_touch_infos.push(touch_info);

			}

			win._on_gesture_sys_touchstart(elem, touch_infos, changed_touch_infos, curTime);
		}

		return false;
	};
	nexacro._syshandler_ontouchend = function (_sysEvent, evt, context)
	{
		let { win, elem } = context;
		// init or orientationchange 시점에 이벤트 중지
		if (this._is_first_touch)
			this._is_first_touch = false;

		if (!win || win._isFrozen)
			return;


		let ret = false;
		let touch, touchid, screenX, screenY, curTime, i;
		if (elem)
		{
			curTime = (evt.timeStamp || (new Date()).getTime());
			if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 9)
			{
				// prevent double tap zooming
				if (nexacro._last_touchend_time && (curTime - nexacro._last_touchend_time) < 400)
				{
					evt.preventDefault();
					if (evt.srcElement instanceof HTMLInputElement)
					{
						// preventDefault로 keypad 가 올라오지 않는 문제가 있어서 input에 포커스를 줌
						if (!evt.srcElement.readOnly)
							evt.srcElement.focus();
					}
				}

				nexacro._last_touchend_doc = document;
				nexacro._last_touchend_time = curTime;
			}
			const touches = evt.touches, changedTouches = evt.changedTouches;
			const touch_len = touches.length, change_len = changedTouches.length;

			let touch_elem, touch_info;
			let windowX, windowY;
			let type = evt.type || "touchend";

			const touch_infos = [], changed_touch_infos = [];

			for (i = 0; i < change_len; i++)
			{
				touch = changedTouches[i];

				touchid = touch.identifier;
				windowX = nexacro.__getWindowX(touch);
				windowY = nexacro.__getWindowY(touch);
				screenX = nexacro.__getScreenX(touch);
				screenY = nexacro.__getScreenY(touch);

				touch_elem = nexacro.__getElementFromPoint(win.handle, windowX, windowY);

				if (elem.windowed)
				{
					if (elem.linkedcontrol && nexacro._isWebTypeComponent(elem.linkedcontrol))
					{
						if (elem.linkedcontrol._ifrm_elem && elem.linkedcontrol._ifrm_elem._window)
							touch_elem = nexacro.__getElementFromPoint(elem.linkedcontrol._ifrm_elem._window, windowX, windowY);
					}
				}

				if (touch_elem)
					elem = touch_elem;

				touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, true, windowX, windowY, screenX, screenY);
				changed_touch_infos.push(touch_info);
			}

			for (i = 0; i < touch_len; i++)
			{
				touch = touches[i];

				touchid = touch.identifier;
				windowX = nexacro.__getWindowX(touch);
				windowY = nexacro.__getWindowY(touch);
				screenX = nexacro.__getScreenX(touch);
				screenY = nexacro.__getScreenY(touch);

				touch_elem = nexacro.__getElementFromPoint(win.handle, windowX, windowY);

				if (elem.windowed)
				{
					if (elem.linkedcontrol && nexacro._isWebTypeComponent(elem.linkedcontrol))
					{
						if (elem.linkedcontrol._ifrm_elem && elem.linkedcontrol._ifrm_elem._window)
							touch_elem = nexacro.__getElementFromPoint(elem.linkedcontrol._ifrm_elem._window, windowX, windowY);
					}
				}

				if (touch_elem)
					elem = touch_elem;

				touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, false, windowX, windowY, screenX, screenY);
				touch_infos.push(touch_info);
			}

			nexacro._setLastEventName("touchend");

			ret = win._on_gesture_sys_touchend(elem, touch_infos, changed_touch_infos, curTime);
			if (ret)
			{
				nexacro._stopSysEvent(evt);
				return true;
			}
			else
				return;
		}

		// 장비에따라 여러 손가락이 동시에 들어오는 경우도 있음. 
		const touchlen = evt.changedTouches ? evt.changedTouches.length : 1;
		for (i = 0; i < touchlen; i++)
		{
			touch = evt.changedTouches ? evt.changedTouches[i] : evt;

			const clientX = nexacro.__getWindowX(touch);
			const clientY = nexacro.__getWindowY(touch);
			screenX = nexacro.__getScreenX(touch);
			screenY = nexacro.__getScreenY(touch);
			curTime = (evt.timeStamp || new Date().getTime());
			const orgTime = (evt.originalTimeStamp) ? evt.originalTimeStamp : curTime;
			touchid = touch.identifier;
			//var pointX = clientX;
			//var pointY = clientY;
			elem = nexacro.__getElementFromPoint(win.handle, clientX, clientY);
			// Touch는 touchstart된 node에 touchmove, touchend를 fire하기때문에
			// 실제 손 밑에 있는 node는 HitTest를 통해 알아내야 한다.
			/*if (window.pageXOffset > 0)
			{
				pointX -= window.pageXOffset;
			}
			if (window.pageYOffset > 0)
			{
				pointY -= window.pageYOffset;
			}
	
			var hover_elem = nexacro.__getElementFromPoint(win.handle, pointX, pointY);
			if (hover_elem)
				elem = hover_elem;
	*/
			ret |= win._on_sys_touchend(elem, touchid, clientX, clientY, screenX, screenY, curTime, orgTime, (i == touchlen - 1));
		}

		if (ret)
		{
			nexacro._stopSysEvent(evt);
			return true;
		}

		// 터치를 preventDefault 할 경우 모바일 자체 Zoom이 되지 않는다고함. 참고
	};
	nexacro._syshandler_ontouchmove = function (_sysEvent, evt, context)
	{
		let { win, elem } = context;

		// init or orientationchange 시점에 이벤트 중지
		let ret = false;

		if (!win && win._isFrozen)
			return;

		let touch, touchid, screenX, screenY, curTime, i;
		if (elem)
		{
			curTime = (evt.timeStamp || Date.now());
			/*
			if (nexacro._Browser == "MobileSafari")
			{
				//iOS에서 키패드가 올라왔을 때 window사이즈가 줄어들지 않아 
				//resize가 발생하지 않고, 보여지는 화면이 밀리는 현상 발생
				var _doc = elem._getRootWindowHandle();
				var last_focused_elem = win._last_focused_elem;
				if (last_focused_elem)
				{
					var input_handle = last_focused_elem.handle;
					if (input_handle && input_handle.blur)
						input_handle.blur();
				}
			}
			*/

			// Touch는 touchstart된 node에 touchmove, touchend를 fire하기때문에
			// 실제 손 밑에 있는 node는 HitTest를 통해 알아내야 한다.
			//var pageXOffset = (window.pageXOffset > 0 ? window.pageXOffset : 0);
			// var pageYOffset = (window.pageYOffset > 0 ? window.pageYOffset : 0);

			const touches = evt.touches, changedTouches = evt.changedTouches;
			const touch_len = touches.length, change_len = changedTouches.length;

			let touch_elem, touch_info;
			let changed, windowX, windowY;
			let type = evt.type || "touchmove";

			let changed_ids = {}, touch_infos = [], changed_touch_infos = [];

			for (i = 0; i < change_len; i++)
			{
				touch = changedTouches[i];
				changed_ids[touch.identifier] = true;
			}

			for (i = 0; i < touch_len; i++)
			{
				touch = touches[i];
				/*
				touch_node = touch.target;
				if (touch_node && touch_node != node)
				{
					touch_elem = nexacro.__findParentElement(touch_node);
				}
				else
				{
					touch_elem = elem;
				}
				*/

				touchid = touch.identifier;
				changed = changed_ids[touchid];
				windowX = nexacro.__getWindowX(touch);
				windowY = nexacro.__getWindowY(touch);
				screenX = nexacro.__getScreenX(touch);
				screenY = nexacro.__getScreenY(touch);
				touch_elem = nexacro.__getElementFromPoint(win.handle, windowX, windowY);
				if (touch_elem)
					elem = touch_elem;

				touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, changed, windowX, windowY, screenX, screenY);
				touch_infos.push(touch_info);
				if (changed)
				{
					changed_touch_infos.push(touch_info);
				}
			}

			ret = win._on_gesture_sys_touchmove(elem, touch_infos, changed_touch_infos, curTime);
			//return;
		}


		if (ret)
		{
			nexacro._stopSysEvent(evt);
			return true;
		}
		return false;
	};
	nexacro._syshandler_ontouchcancel = function (_sysEvent, evt, context)
	{
		let { win, elem } = context;
		let node = elem;
		if (!win || win._isFrozen)
			return;


		let touch, touchid, screenX, screenY, curTime, i;
		if (elem)
		{
			evt.preventDefault();
			curTime = (evt.timeStamp || new Date().getTime());

			const touches = evt.touches, changedTouches = evt.changedTouches;
			const touch_len = touches.length, change_len = changedTouches.length;

			let touch_node, touch_elem, touch_info;
			let windowX, windowY;
			let type = evt.type || "touchcancel";
			let touch_infos = [], changed_touch_infos = [];

			for (i = 0; i < change_len; i++)
			{
				touch = changedTouches[i];
				touch_node = touch.target;
				if (touch_node && touch_node != node)
					touch_elem = nexacro.__findParentElement(touch_node);
				else
					touch_elem = elem;


				touchid = touch.identifier;
				windowX = nexacro.__getWindowX(touch);
				windowY = nexacro.__getWindowY(touch);
				screenX = nexacro.__getScreenX(touch);
				screenY = nexacro.__getScreenY(touch);

				touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, true, windowX, windowY, screenX, screenY);
				changed_touch_infos.push(touch_info);
			}

			for (i = 0; i < touch_len; i++)
			{
				touch = touches[i];
				touch_node = touch.target;
				if (touch_node && touch_node != node)
					touch_elem = nexacro.__findParentElement(touch_node);

				else
					touch_elem = elem;


				touchid = touch.identifier;
				windowX = nexacro.__getWindowX(touch);
				windowY = nexacro.__getWindowY(touch);
				screenX = nexacro.__getScreenX(touch);
				screenY = nexacro.__getScreenY(touch);

				touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, false, windowX, windowY, screenX, screenY);
				touch_infos.push(touch_info);
			}

			win._on_gesture_sys_touchcancel(elem, touch_infos, changed_touch_infos, curTime);
			return;
		}

		// 장비에따라 여러 손가락이 동시에 들어오는 경우도 있음. 
		const touchlen = evt.changedTouches ? evt.changedTouches.length : 1;
		let ret = false;
		for (i = 0; i < touchlen; i++)
		{
			touch = evt.changedTouches ? evt.changedTouches[i] : evt;
			let clientX = touch.pageX || touch.clientX;
			let clientY = touch.pageY || touch.clientY;
			screenX = nexacro.__getScreenX(touch);
			screenY = nexacro.__getScreenY(touch);
			curTime = (evt.timeStamp || new Date().getTime());
			let orgTime = (evt.originalTimeStamp) ? evt.originalTimeStamp : curTime;
			touchid = touch.identifier;
			let pointX = clientX;
			let pointY = clientY;

			// Touch는 touchstart된 node에 touchmove, touchend를 fire하기때문에
			// 실제 손 밑에 있는 node는 HitTest를 통해 알아내야 한다.
			if (window.pageXOffset > 0)
				pointX -= window.pageXOffset;

			if (window.pageYOffset > 0)
				pointY -= window.pageYOffset;


			let hover_elem = nexacro.__getElementFromPoint(win.handle, pointX, pointY);
			if (hover_elem)
				elem = hover_elem;

			ret |= win._on_sys_touchcancel(elem, touchid, clientX, clientY, screenX, screenY, curTime, orgTime, (i == touchlen - 1));
		}
	};


	nexacro._syshandler_ondblclick = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;
		if (win && elem)
			return win._on_sys_dblclick(elem, nexacro._getSysEventBtnString({ button: 1, which: 1 }), evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);

		return false;
	};

	nexacro._syshandler_onmouseover = function (_sysEvent, evt, context) //mouseenter
	{
		/*  if (!application)
		  return false;
		  */

		let { win, elem, release_elem } = context;
		const from_elem = release_elem;
		let end_elem;

		if (!from_elem)
		{
			const dragInfo = nexacro._cur_drag_info;
			if (dragInfo && !dragInfo.isDragover)
				nexacro._initDragInfo();

		}

		if (win && elem && elem != from_elem)
		{
			const button = (win._cur_ldown_elem ? "lbutton" : (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"))); //button info
			let ret;

			// check mouseenter
			if (from_elem)
				end_elem = win._findCommonParentElement(elem, from_elem);
			else
				end_elem = win._findRootElement();

			// check popup
			if (!end_elem)
				end_elem = win._findPopupElement(elem);
			if (!end_elem)
				end_elem = win._findRootElement();

			if (end_elem)
			{
				let fire_elem = [];

				// get mouseenter
				for (; elem && elem != end_elem; elem = elem.parent_elem)
				{
					if (elem.linkedcontrol)
						fire_elem.push(elem);
				}
				// fire mouseenter
				for (let i = fire_elem.length - 1; i >= 0; i--)
					ret = win._on_sys_mouseenter(fire_elem[i], from_elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);

			}
			return ret;
		}
		return false;
	};

	nexacro._syshandler_onmouseout = function (_sysEvent, evt, context) //mouseleave
	{
		let { win, elem, release_elem } = context;
		const to_elem = release_elem;
		let end_elem;

		if (win && elem && elem != to_elem)
		{
			const button = (win._cur_ldown_elem ? "lbutton" : (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"))); //button info
			let ret;

			// check mouseleave
			if (to_elem)
				end_elem = win._findCommonParentElement(elem, to_elem);
			else
				end_elem = win._findRootElement();

			// check popup
			if (!end_elem)
				end_elem = win._findPopupElement(elem);
			if (!end_elem)
				end_elem = win._findRootElement();

			// fire mouseleave

			if (end_elem) 
			{
				for (; elem && elem != end_elem; elem = elem.parent_elem)//when popup is closed
				{
					if (elem.linkedcontrol)
						ret = win._on_sys_mouseleave(elem, to_elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);

				}
			}
			return ret;
		}
		return false;
	};

	nexacro._syshandler_onkeydown = function (_sysEvent, evt, context)
	{
		const { win, lastfocus_elem, keycode } = context;
		const elem = lastfocus_elem
		if (win && elem)
		{
			nexacro._setKeydownInfo(evt);

			if (nexacro._OS == "Mac OS" && keycode == 229 && evt.key == "Enter")
				keycode = nexacro.Event.KEY_RETURN;


			win._on_sys_keydown(elem, keycode, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.metaKey);

			if (elem._event_stop)
			{
				// form에서 tab키가 처리되면 preventDefault
				nexacro._stopSysEvent(evt);
				elem._event_stop = false;
				return true;
			}

			return true; // keypress, input 이벤트 발생을 위해
		}
		return false;
	};

	nexacro._syshandler_onkeypress = function (_sysEvent, evt, context)
	{
		const { win, lastfocus_elem } = context;
		const elem = lastfocus_elem
		if (win && elem)
		{
			let ret = win._on_sys_keypress(elem, evt.keyCode, evt.charCode, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.metaKey);
			if (elem._event_stop)
			{
				// form에서 tab키가 처리되면 preventDefault
				nexacro._stopSysEvent(evt);
				elem._event_stop = false;
				return true;
			}
			return ret;
		}
		return false;
	};
	nexacro._syshandler_onkeyup = function (_sysEvent, evt, context)
	{
		const { win, elem, lastfocus_elem, keycode } = context;
		const up_elem = elem;
		let keyCode = keycode;

		if (win && lastfocus_elem)
		{
			const env = nexacro.getEnvironment();
			if (env && env._p_enableaccessibility && env._a11ytype === 2)
			{
				//trace(`keyup event / code : ${evt.code} / node : ${node} / keydown : ${win._is_fire_sys_keydown}`);

				const refer_comp = win.findComponent(up_elem);
				const up_comp = refer_comp._getRootComponent(refer_comp);

				if (up_comp._isMainFrameBody() && up_comp._is_top_frame)
				{
					// mainframe 초점이동된 키액션은 전부 예외처리
					win._is_fire_sys_focusin = true;
					win._is_fire_sys_keydown = false;

					// 문서 끝에서는 다시 활성
					if (keyCode == nexacro.Event.KEY_DOWN)
						nexacro._notifyAccessibilityInputElement("");

					return nexacro._stopSysEvent(evt);
				}
				else if (win._is_fire_sys_keydown === false)
				{
					win._keydown_element = null; // keydown 발생 안함

					if (up_comp._is_alive)
					{
						// 가상커서 상태 에서 keydown 없이 발생한 keyup event의 컴포넌트 별 keydown (탭, 상하 방향키 포함) 처리가 필요한 경우 사용
						const accesibility_keyaction = up_comp._isFireAccessibilityKeydown(keyCode, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.metaKey);
						if (accesibility_keyaction)
							up_comp._accessibility_keydown(up_elem, refer_comp, keyCode, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.metaKey);


						// 마지막 컴포넌트에 발생된 방향키 액션인지 확인하여 notify라벨 초점이동 방지
						if (keyCode == nexacro.Event.KEY_DOWN)
						{
							const _form = up_comp._getRootForm();
							if (_form && _form._getTabOrderLast(15) == up_comp)
								nexacro._notifyAccessibilityInputElement(null);
						}
					}
				}
			}

			if (keyCode === 0)// && evt.keyIdentifier == "Unidentified")
			{
				const keydown_info = nexacro._getKeydownInfo();
				if (keydown_info)
					keyCode = nexacro._getSysEventKeyCode(keydown_info);
			}
			return win._on_sys_keyup(lastfocus_elem, keyCode, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.metaKey);
		}
		return false;
	};

	//==============================================================================
	nexacro._syshandler_onactivate = function (_sysEvent, evt, context)
	{
		const { win } = context;
		if (win && win._on_sys_activate)
		{
			const ret = win._on_sys_activate(_sysEvent, evt);
			win._fire_activate = true;
			return ret;
		}
		return false;
	};

	nexacro._syshandler_ondeactivate = function (_sysEvent, evt, context)
	{
		const { win } = context;

		win._fire_activate = true;

		if (win && win._fire_activate)
		{
			win._fire_activate = false;
			const doc = win._dest_doc;
			if (doc)
			{
				const active_node = win._dest_doc.activeElement;

				if (active_node)
				{
					const active_elem = active_node._linked_element;
					if (active_elem && /*active_elem instanceof nexacro._WebBrowserPluginElement*/nexacro._isWebTypeElement(active_elem))
					{
						if (win._is_alive)
						{
							const comp = active_elem.component ? active_elem.component : active_elem.owner_elem ? active_elem.owner_elem.linkedcontrol : null;
							nexacro._checkClosePopupComponent(comp, true);
							nexacro.__setLastFocusedElement(active_elem);
						}
						return false;
					}
				}
			}

			if (win._on_sys_deactivate)
				return win._on_sys_deactivate();

		}
		return false;
	};


	nexacro.__isCustomEvent = function (evt)
	{
		if (evt && evt instanceof CustomEvent)
			return true;
		return false;
	};
	nexacro.__getCustomEventDetail = function (evt)
	{
		return evt.detail ? evt.detail : {}
	}

	nexacro._syshandler_onbeforeclose = function (_sysEvent, evt, context)
	{
		const { win } = context;
		let confirm_message;

		if (win && win._on_sys_beforeclose)
			confirm_message = win._on_sys_beforeclose();

		if (confirm_message !== undefined && confirm_message !== "" && confirm_message !== null)
		{
			if (evt)
				evt.preventDefault();
			return confirm_message;
		}
	};

	nexacro._syshandler_onclose = function (_sysEvent, evt, context)
	{
		const { win } = context;
		let ret = false;
		if (win)
		{
			_sysEvent._stopDocEventHandler();
			const isallclose = !nexacro.__isCustomEvent(evt)



			if (win._on_sys_close)
			{

				const app = win.getRootInstance();
				if (app && app._is_application)
					app.on_fire_onexit();
				else if (app && app instanceof nexacro.Form)
					app.on_fire_onclose();

				ret = win._on_sys_close(isallclose);
			}
			nexacro._finalizeGlobalObjects(window);
			_sysEvent.clearAll(isallclose);

			return ret;
		}

		return false;
	};


	nexacro._syshandler_onresize = function (_sysEvent, evt, context) //window resize
	{
		const { win } = context;
		let ret = false;
		let h, w;
		if (win)
		{
			if (this._is_reseting_viewport)
			{
				nexacro._is_reseting_viewport = false;
				return;
			}


			if (nexacro.__isCustomEvent(evt))
			{
				const { left, top, x, y, width, height, paddingLeft, paddingTop, contentsWidth, contentsHeight } = evt.detail.rect;
				w = contentsWidth;
				h = contentsHeight;
				// %%%
			}
			else
			{
				w = nexacro._getContainerHandleClientWidth(win.handle);
				h = nexacro._getContainerHandleClientHeight(win.handle);
			}

			if (w != win.clientWidth || h != win.clientHeight)
			{
				const layout_manger = nexacro._getLayoutManager();
				const last_focused_elem = win._last_focused_elem;

				const is_active = win._is_active_window;
				const is_web_elem = win._doc ? nexacro._isWebTypeElement(win._doc.activeElement._linked_element) : false;

				// onresize_before
				if (is_active || is_web_elem)
				{
					const addressbar_height = 100;	//Temporary
					const is_keypad_switch = false;		// keypad가 열릴상황판단
					const do_scrollintoview = true;	// 대상이 보이도록 스크롤할지 여부
					const is_input_focused = last_focused_elem && last_focused_elem.isInputElement() ? true : false;

					if (nexacro._OS == "Android" || nexacro._AndroidDesktopMode == true)
					{
						is_keypad_switch = (is_input_focused || is_web_elem) && (w == win.clientWidth && h < win.clientHeight - addressbar_height);
						layout_manger.setLayoutChangeFlag(is_keypad_switch ? true : undefined);

						if (is_keypad_switch)
						{
							if (nexacro._BrowserExtra == "SamsungBrowser")
							{
								if (win._previous_client_height && (win._previous_client_height <= h || win._previous_client_height - h < addressbar_height))
									do_scrollintoview = false;

							}
							if (last_focused_elem instanceof nexacro.TextAreaElement)
							{
								if (win.clientHeight < last_focused_elem.height)
									do_scrollintoview = false;
							}

							if (do_scrollintoview)
							{
								const handle = last_focused_elem.handle;
								if (handle)
									nexacro._requestAnimationFrame(win, function () { nexacro.__setDOMNode_ScrollintoView(handle, false); });

							}
						}

					}
					else if (nexacro._OS == "iOS")
					{
						if (nexacro._Browser == "MobileSafari")
						{
							if (nexacro._SystemType == "ipad" && (parseFloat(nexacro._OSVersion) >= 13) || nexacro._MobileDesktopMode)
							{
								const is_touchend_reason = nexacro._getLastEventName() == "touchend" ? true : false;
								if (is_input_focused || is_web_elem || is_touchend_reason)
								{
									nexacro._setLastEventName("");
									// 키패드 변경으로 발생한 resize인지를 판단
									if (w == win.clientWidth)
									{
										if (h < win.clientHeight)
											is_keypad_switch = true;

										else if (h != win.clientHeight && win._previous_client_height == win.clientHeight)
											is_keypad_switch = true;

									}
								}
							}
							else
								is_keypad_switch = (is_input_focused || is_web_elem) && (w == win.clientWidth && h < win.clientHeight - addressbar_height);

							layout_manger.setLayoutChangeFlag(is_keypad_switch ? true : undefined);
						}
					}
					if (is_keypad_switch)
					{
						win._previous_client_height = h;
						return false;
					}

				}

				ret = win._on_sys_resize(w, h);
				if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 8)
				{
					// iOS8 에서 화면 회전 직후 resize하면, body가 이상하게 스크롤되는 버그가 있음
					// 화면이 핀치줌으로 확대되지 않은 상태일 경우 보정처리
					if (window.innerWidth == nexacro._getContainerHandleClientWidth(win.handle) &&
						window.innerHeight == nexacro._getContainerHandleClientHeight(win.handle))
					{
						// 확대되지 않았다.
						document.body.scrollLeft = 0;
					}
				}


			}
			nexacro._checkInformation(nexacro._init_info);
			win._previous_client_height = h;

		}
		return ret;
	};

	nexacro._syshandler_onmove = function (_sysEvent, evt, context) //window move
	{
		const { win } = context;

		if (win)
		{
			const _win_handle = win.handle;
			const old_x = win.left, old_y = win.top;
			let x = nexacro._getContainerHandlePosX(_win_handle);
			let y = nexacro._getContainerHandlePosY(_win_handle);

			if (nexacro._Browser != "Gecko" && x == old_x && y == old_y)
			{
				// current window 좌표 반영
				const _win_left = _win_handle.screenX ? _win_handle.screenX : _win_handle.screenLeft;
				const _win_top = _win_handle.screenY ? _win_handle.screenY : _win_handle.screenTop;

				if (nexacro._isNull(x) || x != _win_left)
				{
					x = _win_left;
				}

				if (nexacro._isNull(y) || y != _win_top)
				{
					y = _win_top;
				}
			}

			if (x != old_x || y != old_y)
			{
				//nexacro._gap_client_width = x;
				//nexacro._gap_client_height = y;
				return win._on_sys_move(x, y);
			}
		}
		return false;
	};

	nexacro._syshandler_onload = function (_sysEvent, evt, context)
	{
		const { win } = context;
		if (win)
		{
			if (win._on_sys_load)
				return win._on_sys_load(_sysEvent.container ? _sysEvent.container : window);
		}
		return false;
	};

	nexacro._syshandler_oncontextmenu = function (_sysEvent, evt, context)     
	{
		let ret = true;
		const { win, elem } = context;
		if (win && elem)
		{
			ret = win._on_sys_contextmenu(elem, "contextmenu", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, evt.metaKey);
			if (!ret || (win.root._is_popup_frame && elem.tagName != "TEXTAREA" && elem.tagName != "INPUT" && elem.tagName != "IMG"))
				ret = nexacro._stopSysEvent(evt);
			else
				ret = true;
		}
		return ret;
	};

	nexacro._syshandler_ondragstart = function (_sysEvent, evt, context)
	{
		return nexacro._stopSysEvent(evt);
	};

	nexacro._syshandler_ondragenter = function (_sysEvent, evt, context)
	{
		let { win, elem, release_elem } = context;
		const from_elem = release_elem;

		let ret = true;
		if (win && elem)
		{
			let end_elem = from_elem ? win._findCommonParentElement(elem, from_elem) : win._findRootElement();
			if (!end_elem && !(end_elem = win._findPopupElement(elem)))
				end_elem = win._findRootElement();

			const fire_elem = [];

			while (elem && elem !== end_elem)
			{
				if (elem.linkedcontrol)
				{
					fire_elem.push(elem);
				}
				elem = elem.parent_elem; // 다음 부모로 이동
			}


			const filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			for (let i = fire_elem.length - 1; i >= 0; i--)
			{
				ret = win._on_sys_dragenter(fire_elem[i], from_elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist, evt.metaKey);
			}
		}
		return ret;
	};

	nexacro._syshandler_ondragleave = function (_sysEvent, evt, context)
	{
		let ret = true;
		let { win, elem, release_elem } = context;
		const to_elem = release_elem;

		if (win && elem)
		{
			let end_elem = to_elem ? win._findCommonParentElement(elem, to_elem) : win._findRootElement();
			if (!end_elem && !(end_elem = win._findPopupElement(elem)))
				end_elem = win._findRootElement();

			const filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			for (; elem && elem != end_elem; elem = elem.parent_elem)
			{
				if (elem.linkedcontrol)
					ret = win._on_sys_dragleave(elem, to_elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist, evt.metaKey);
			}
		}

		return ret;
	};

	nexacro._syshandler_ondragover = function (_sysEvent, evt, context)
	{
		evt.stopPropagation();
		evt.preventDefault();
		const { win, elem } = context;
		if (win && elem)
		{
			const filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			return win._on_sys_dragover(elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist, evt.metaKey);
		}
		return true;
	};

	nexacro._syshandler_ondrop = function (_sysEvent, evt, context)
	{
		evt.stopPropagation();
		evt.preventDefault();
		const { win, elem } = context;

		if (win && elem)
		{
			const filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			return win._on_sys_drop(elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist, evt.metaKey);
		}
		return true;
	};

	nexacro._syshandler_onorientationchange = function (_sysEvent, evt, context)
	{
		const { win } = context;
		if (win)
		{
			const mobileorientation = nexacro._getMobileOrientation();
			nexacro.System.mobileorientation = mobileorientation;
			win._on_sys_orientationchange(mobileorientation);
		}
	};

	nexacro._syshandler_onselectstart = function (_sysEvent, evt, context)
	{
		const { win, elem } = context;
		const node = elem;
		if (node &&
			((node.tagName == "INPUT" && (node.type == "text" || node.type == "password" || node.id.indexOf("simpleinput") >= 0)) ||
				node.tagName == "TEXTAREA")) 
		{
			return true;
		}
		return nexacro._stopSysEvent(evt);
	};

	//==============================================================================
	// Window Handle API's	
	if (nexacro._isTouchInteraction)
	{
		nexacro._doc_init_html = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
			+ "<head>\n"
			+ "<style>\n"
			+ "div {\n"
			+ "-moz-user-select:none;\n"
			+ "-webkit-user-select:none;\n"
			+ "-webkit-touch-callout:none;\n"
			+ "-webkit-appearance:none;\n"
			+ "-webkit-tap-highlight-color:rgba(0,0,0,0);\n"
			+ "outline: none;\n"
			+ "}\n"
			+ "</style>\n"
			+ "</head>\n"
			+ "<body style='margin:0;border:none;'>\n"
			+ "<script type='text/javascript'>\n"
			+ "nexacro = parent.nexacro;"
			+ "nexacro.nexacro_HTMLSysEvent={};\n"
			+ "nexacro._initHTMLSysEvent(window, document);"
			+ "</script>\n"
			+ "</body>\n"
			+ "</html>";
	}
	else
	{
		nexacro._doc_init_html = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
			+ "<head>\n"
			+ "<style>\n"
			+ "div {\n"
			+ "outline: none;\n"
			+ "}\n"
			+ "</style>\n"
			+ "</head>\n"
			+ "<body style='margin:0;border:none;'>\n"
			+ "<script type='text/javascript'>\n"
			+ "nexacro = parent.nexacro; if (!nexacro) nexacro = window.nexacro; if (!nexacro) nexacro = window.opener.nexacro;"
			+ "nexacro.nexacro_HTMLSysEvent={};\n"
			+ "nexacro._initHTMLSysEvent(window, document);"
			+ "nexacro._preparePopupManagerFrame(window);"
			+ "</script>\n"
			+ "</body>\n"
			+ "</html>";
	}

	nexacro._createWindowHandle = function (parent_win, target_win, name, left, top, width, height, resizable, layered, taskbar, is_main)
	{

		/*parent_win : nexacro._Window*/
		/**/
		const _rootwindow = nexacro._getMainWindowHandle(); /*browser window*/
		let _win_handle = null;

		if (is_main == true)
		{
			// container를 찾는 부분
			const _handle = nexacro._getAppContainerDivHandle(target_win);
			_win_handle = _handle ? _handle : _rootwindow;
		}
		else
		{
			var parent_handle = null;
			if (parent_win) parent_handle = parent_win.root._control_element.handle;
			_win_handle = nexacro.__createWindowHandle(parent_handle, target_win, name, left, top, width, height, resizable, layered, taskbar);

			// IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
			if (!_win_handle) return;
		}

		if (nexacro._allow_default_pinchzoom)
			nexacro._applyDesktopScreenWidth();
		else if (nexacro._Browser == "MobileSafari")
		{
			if (_win_handle == _rootwindow)
				nexacro.__setDOMStyle_Fixed(document.documentElement.style);
		}


		nexacro.__setViewportScale();
		nexacro.__insertInputtypeDateCSSStyle();

		nexacro._setLinkedWindow(_win_handle, target_win)
		target_win.attachHandle(_win_handle);
		if (!is_main)
		{
			_rootwindow.setTimeout(function () { nexacro.__fireHTMLEvent(_win_handle.document.body, 'load', 'onload'); }, 10);
		}
	};


	nexacro._clearLinkedWindow = function (handle)
	{
		if (nexacro._ishandleWindow(handle) && handle._linked_window)
		{
			delete handle._linked_window;
		}
	}
	nexacro._getLinkedWindow = function (handle)
	{
		let win = nexacro.__MFEAPI._getLinkedWindow(handle);
		return win ? win : handle._linked_window;
	}
	nexacro._setLinkedWindow = function (handle, target_win)
	{
		if (nexacro._ishandleWindow(handle))
			handle._linked_window = target_win;

	}

	nexacro._createOpenWindowHandle = function (parent_win, name, formurl, left, top, width, height, resizable, layered, taskbar, is_main, parentframe, frameopener, arr_arg, ext_openstyles, openstyles)
	{
		//var _win_handle = null;
		var parent_handle = null;
		if (parent_win) parent_handle = parent_win.root._control_element.handle;
		return nexacro.__createOpenWindowHandle(parent_handle, name, formurl, left, top, width, height, resizable, layered, taskbar, parent_win, parentframe, frameopener, arr_arg, ext_openstyles, openstyles);
	};

	nexacro.__createOpenWindowHandle = function (_handleParent, name, formurl, left, top, width, height, resizable, /*[nouse]*/layered, /*[nouse]*/taskbar, parentwin, parentframe, frameopener, arrarg, ext_openstyles, openstyles)
	{
		let popupframeoptions = {
			"_parentframe": parentframe,
			"_opener": frameopener,
			"_args": arrarg,
			"_openstyles": openstyles,
			"_formurl": formurl,
			"_left": left,
			"_top": top,
			"_width": width,
			"_height": height
		};

		if (left == null)
			left = Math.floor((screen.availWidth - width) / 2);

		if (top == null)
			top = Math.floor((screen.availHeight - height) / 2);

		const dochandle = _handleParent ? _handleParent.ownerDocument : null;
		let _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : null;
		let _window;
		if (!_parent_win)
		{
			//const handle = nexacro._getMainWindowHandle();
			//_parent_win = handle ? handle : window;
			_window = nexacro._findWindow(nexacro._getMainWindowHandle());
			_parent_win = _window ? _window.handle : window;
		}
		else
		{
			_window = nexacro._findWindow(_parent_win);
		}
		if (!_window && nexacro.ismodule)
		{
			_window = parentwin;
		}


		let _win_handle;
		let opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
			+ "directories=no,scrollbars=no,"
			+ "resizable=" + (resizable ? "yes" : "no");

		opt += "," + ext_openstyles;

		let popupurl = "./popup.html";
		let localCacheUrlCheck = false;   // hybrid이고 localcacheurl이 존재할 때만 true

		if ((nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView) && nexacro._hasLocalCacheUrl(popupurl))
			localCacheUrlCheck = true;

		if (globalThis.chrome && globalThis.chrome.webview)
		{
			//function (_handleParent, name, formurl, left, top, width, height, resizable, /*[nouse]*/layered, /*[nouse]*/taskbar, parentwin, parentframe, frameopener, arr_arg, ext_openstyles)
			var params = {
				type: "open",
				left: left, top: top, width: width, height: height,
				resizable: resizable, layered: layered, taskbar: taskbar, noactivate: false
			};

			var hybridHandle = nexacro._messageToNative(_parent_win._hybridHandle, "NexacroWindow", "_createWindow", params, true, true);
		}

		if (formurl)
		{
			popupurl += "?formname=" + encodeURIComponent(formurl);
			popupurl += "&framename=" + name;
			popupurl += "&loadtime=" + nexacro._uniquestoragevalue; // open 창에서도 localstorage uniquekey 유지하기 위해 
			if (globalThis.chrome && globalThis.chrome.webview || nexacro._macOSWebView)
			{
				popupurl += "&handle=" + hybridHandle; //
				popupurl += "&type=open"; //
			}
		}


		//popupframe info 
		if (!_parent_win._nexacro_popupframeoption)
			_parent_win._nexacro_popupframeoption = {};

		_parent_win._nexacro_popupframeoption[name] = popupframeoptions;

		let url;
		if (localCacheUrlCheck)
		{
			const env = nexacro.getEnvironment();
			url = nexacro._transfullurl(env._localcache_path, popupurl);
		}
		else
			url = nexacro._transfullurl(nexacro._project_absolutepath, popupurl);

		// 더이상 opener에 참조할 객체가 존재함을 보장하지 않음 for MFE
		//let app = parentframe._getApplication();

		//let app = parentframe ? parentframe._getApplication() : _window.getRootInstance();
		let app = _window.getRootInstance();
		_parent_win.__getopenerinstance = () =>
		{
			try
			{
				return {
					nexacro, system, "application": app ? app : undefined
				}
			}
			finally
			{
				// 호출과 즉시 delete 
				delete _parent_win.__getopenerinstance;
			}
		};
		// 같은 이름을 가질 확률이 존재하기 때문에 별도로 띄움
		let realname = name + nexacro.ismodule ? new Date().getTime().toString() : "";
		_win_handle = _parent_win.open(url, realname, opt);

		if (globalThis.chrome && globalThis.chrome.webview)
		{
			//smilekkr's wv;hybridHandle 이름 및 전체적인 구성은 js 머지 후 반드시 결정/변경 해야 함;
			_win_handle._hybridHandle = hybridHandle; //
		}

		if (!_win_handle)
			return null;

		nexacro.__createOpenWindowHandleAfter(_win_handle);

		return _win_handle;
	};


	if (nexacro._OS == "iOS")
	{
		nexacro.__createOpenWindowHandleAfter = function (_win)
		{
			if (!_win)
			{
				return;
			}

			const callback_load = function ()
			{
				const timeout = 5000;
				const open_doc = _win.document;
				const open_frame = nexacro._getLinkedWindow(_win);

				if (open_doc && open_frame && open_frame._is_active_window !== true)
				{
					const start_time = new Date().getTime();
					const start_node = open_doc.all.length;

					const timer_id = setInterval(function ()
					{
						const end_time = new Date().getTime();
						const end_node = open_doc.all.length;
						if (start_node != end_node)
						{
							clearInterval(timer_id);
							open_frame._on_sys_activate();
							open_frame.setFocus();
						}
						else
						{
							// Timeout
							if ((end_time - start_time) > timeout)
							{
								clearInterval(timer_id);
							}
						}
					}, 100);
				}
			}

			_win.addEventListener("load", callback_load);
		};
	}
	else
	{
		nexacro.__createOpenWindowHandleAfter = nexacro._emptyFn;
	}




	nexacro.__createWindowHandle = function (_handleParent, target_win, name, left, top, width, height, resizable, /*[nouse]*/layered, /*[nouse]*/taskbar)
	{
		if (left == null)
			left = Math.floor((screen.availWidth - width) / 2);

		if (top == null)
			top = Math.floor((screen.availHeight - height) / 2);

		const dochandle = _handleParent ? _handleParent.ownerDocument : null;
		const _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : window;
		let _win_handle, opt;
		/*if (false && _parent_win.showModelessDialog)
		{
			// TODO showModeless
			// window_handle에 접근하려하면 Access Denied가 발생함.
			// -> 동일 domain으로 오픈해야 한다.
			opt = "dialogHeight:" + height + "px" + "; dialogLeft:" + left + "px" + "; dialogTop:" + top + "px" + "; dialogWidth:" + width + "px"
					+ "; center:no" + (resizable ? "; resizable:yes" : "")
					+ "; status:no";
			_win_handle = _parent_win.showModelessDialog(document.URL + "empty.html", { nexacro: _parent_win.nexacro, parent: _parent_win }, opt);
		}
		else*/
		{
			opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
				+ "toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,"
				+ "resizable=" + (resizable ? "yes" : "no");
			_win_handle = _parent_win.open("", name, opt);
		}

		// IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
		if (!_win_handle)
			return null;

		// Initialized nexacro Object
		if (!_parent_win.nexacro && nexacro.ismodule)
		{
			_win_handle.nexacro = nexacro;
			_win_handle.system = system;
			_win_handle._application = nexacro.getApplication();
		}
		else
		{
			_win_handle.nexacro = _parent_win.nexacro;
			_win_handle.system = _parent_win.system;
			_win_handle._application = _parent_win.nexacro.getApplication();
		}


		nexacro._setLinkedWindow(_win_handle, target_win);
		// clear all document -- set as about:blank && remain domain as nexacro._open_window_url
		_win_handle.document.open();

		// _win_handle에 설정한 GlobalVariable(nexacro,system, ..)이 IE8에서는 제대로 설정되지 않음. 2013.05.31 neoarc
		// document같은 다른 곳에 담아 넘겨야 할 듯.

		_win_handle.document.write(nexacro._doc_init_html);
		_win_handle.document.close();

		return _win_handle;
	};

	nexacro._createModalWindowHandle = function (parent_win, name, formurl, left, top, width, height, resizable, layered, parentframe, frameopener, arrarg, ext_openstyles, openstyles)
	{
		let popupframeoptions = {
			"_parentframe": parentframe,
			"_opener": frameopener,
			"_args": arrarg,
			"_openstyles": openstyles,
			"_formurl": formurl,
			"_left": left,
			"_top": top,
			"_width": width,
			"_height": height
		};

		if (left == null)
			left = Math.floor((nexacro.System.availWidth - width) / 2);
		if (top == null)
			top = Math.floor((nexacro.System.availHeight - height) / 2);

		let dochandle = null;
		if (parent_win)
		{
			dochandle = parent_win.root._control_element.handle ? parent_win.root._control_element.handle.ownerDocument : null;
		}

		let _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : null;
		let _window;
		if (!_parent_win)
		{
			_window = nexacro._findWindow(nexacro._getMainWindowHandle());
			_parent_win = _window ? _window.handle : window;
		}
		else
		{
			_window = nexacro._findWindow(_parent_win);
		}

		let _win_handle;
		let opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
			+ "directories=no,scrollbars=no,"
			+ "resizable=" + (resizable ? "yes" : "no");

		opt += "," + ext_openstyles;

		let popupurl = "./popup.html";
		let localCacheUrlCheck = nexacro._hasLocalCacheUrl(popupurl);

		var params = {
			type: "modal",
			left: left, top: top, width: width, height: height,
			resizable: resizable, layered: layered, taskbar: false, noactivate: false
		};

		var hybridHandle = nexacro._messageToNative(dochandle ? _parent_win._hybridHandle : "", "NexacroWindow", "_createWindow", params, true, true);

		if (formurl)
		{
			popupurl += "?formname=" + encodeURIComponent(formurl);
			popupurl += "&framename=" + name;
			popupurl += "&loadtime=" + nexacro._uniquestoragevalue; // open 창에서도 localstorage uniquekey 유지하기 위해 
			popupurl += "&handle=" + hybridHandle; //
			popupurl += "&type=modal"; //
		}

		//popupframe info 
		if (!_parent_win._nexacro_popupframeoption)
			_parent_win._nexacro_popupframeoption = {};

		_parent_win._nexacro_popupframeoption[name] = popupframeoptions;

		let url;
		if (localCacheUrlCheck)
		{
			const env = nexacro.getEnvironment();
			url = nexacro._transfullurl(env._localcache_path, popupurl);
		}
		else
			url = nexacro._transfullurl(nexacro._project_absolutepath, popupurl);

		// 더이상 opener에 참조할 객체가 존재함을 보장하지 않음 for MFE
		//let app = parentframe._getApplication();

		//let app = parentframe ? parentframe._getApplication() : _window.getRootInstance();
		let app = _window.getRootInstance();
		_parent_win.__getopenerinstance = () =>
		{
			try
			{
				return {
					nexacro, system, "application": app ? app : undefined
				}
			}
			finally
			{
				// 호출과 즉시 delete 
				delete _parent_win.__getopenerinstance;
			}
		};

		let realname = name + nexacro.ismodule ? new Date().getTime().toString() : "";
		_win_handle = _parent_win.open(url, realname, opt);

		nexacro._messageToNative(hybridHandle, "NexacroWindow", "_modalWindow", params, true, true);

		/*  eslint-disable no-console */
		console.log("after modal\n");
		/*  eslint-enable no-console */
		//smilekkr's wv;hybridHandle 이름 및 전체적인 구성은 js 머지 후 반드시 결정/변경 해야 함;
		_win_handle._hybridHandle = hybridHandle; //

		if (!_win_handle)
			return null;

		return _win_handle.returnValue;
	};

	nexacro._createModalAsyncWindowHandle = function (parent_win, target_win, name, left, top, width, height, resizable, layered, lockmode)
	{
		const parent_handle = null;
		if (parent_win)
			parent_handle = parent_win.root._control_element.handle;
		const _win_handle = nexacro.__createModalAsyncWindowHandle(parent_handle, target_win, name, left, top, width, height, resizable, layered, lockmode);

		// IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
		if (!_win_handle) return;

		_win_handle.document.body.style.overflow = "visible";
		nexacro._setLinkedWindow(_win_handle, target_win);

		// [RP_33521] by ODH :  IE 8이하의 경우, main window에서 Open Window의 DOM을 create 하면 속도가 많이 느림.
		//                      때문에 Open Window의 Event를 fire하여 Open Window가 DOM Create 하도록 함.
		//  nexacro._window = target_win;

		target_win.attachHandle(_win_handle);
		setTimeout(function () { nexacro.__fireHTMLEvent(_win_handle.document.body, 'load', 'onload'); }, 10);
	};

	nexacro.__createModalAsyncWindowHandle = function (_handleParent, target_win, name, left, top, width, height, resizable, layered, lockmode)
	{
		if (left == null)
			left = Math.floor((screen.availWidth - width) / 2);
		if (top == null)
			top = Math.floor((screen.availHeight - height) / 2);

		const opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
			+ "toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,"
			+ "resizable=" + (resizable ? "yes" : "no");

		const dochandle = _handleParent ? _handleParent.ownerDocument : null;
		const _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : window;
		const _win_handle = _parent_win.open("", name, opt);

		// IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
		if (!_win_handle) return null;

		// Initialized nexacro Object

		if (_parent_win)
		{
			if (!_parent_win.nexacro && nexacro.ismodule)
			{
				_win_handle.nexacro = nexacro;
				_win_handle.system = system;
				_win_handle._application = nexacro.getApplication();
			}
			else
			{
				_win_handle.nexacro = _parent_win.nexacro;
				_win_handle.system = _parent_win.system;
				_win_handle._application = _parent_win.nexacro.getApplication();
			}
		}



		nexacro._setLinkedWindow(_win_handle, target_win);

		// clear all document -- set as about:blank && remain domain as nexacro._open_window_url
		_win_handle.document.open();
		_win_handle.document.write(nexacro._doc_init_html);
		_win_handle.document.close();

		return _win_handle;

	};



	nexacro._createModalAsyncCallbackHandler = function (_win_handle, frame)
	{
		if (frame._window_type != 3)
			return;

		// modal async window를 감시하고 완전히 닫힌 후에 callback을 실행한다.
		const main_handle = nexacro._getMainWindowHandle();

		// clearinterval 해줘야 하기때문에 frame object를 key로 사용
		const timer_handle = main_handle.setInterval(function ()
		{
			if (_win_handle && _win_handle.closed)
			{
				frame._runCallback();

				// Safari,Opera는 clearInterval시 수행중이던 함수도 중단되는것 같다.
				nexacro._removeModalAsyncCallbackHandler(frame);
			}
		}, 100);

		if (!nexacro._closedmodalasync_list)
			nexacro._closedmodalasync_list = [];

		nexacro._closedmodalasync_list.push([frame, timer_handle]);

	};

	nexacro._removeModalAsyncCallbackHandler = function (frame)
	{
		if (!nexacro._closedmodalasync_list)
			return;

		const list = nexacro._closedmodalasync_list;
		const list_length = list.length;
		for (let i = 0; i < list_length; i++)
		{
			const list_item = list[i];
			if (list_item[0] == frame)
			{
				const main_handle = nexacro._getMainWindowHandle();
				main_handle.clearInterval(list_item[1]);

				for (let j = i; j < list_length - 1; j++)
				{
					list[j] = list[j + 1];
				}
				list.pop();
				break;
			}
		}
	};


	nexacro._isWindowHandlePrepared = function (_win_handle)
	{
		const _win = nexacro._handletoWindow(_win_handle);
		return (_win.document.body !== null);
	};

	nexacro._closeWindowHandle = function (_win_handle)
	{
		if (_win_handle)
		{
			//nexacro._destroyManagerFrame() 이동 - popup과 따로 존재하므로 window별 매번 삭제
			if (nexacro._getMainWindowHandle() != _win_handle)
			{
				const _win = nexacro._handletoWindow(_win_handle);
				_win.open('', '_self');
				_win.close();
			}
		}
	};
	nexacro._refreshWindow = nexacro._emptyFn;

	//------------------------------------------------------------------------------
	// window handle api
	nexacro._getMainWindowHandle = function ()
	{
		let win = window;
		while (win._popup === true)
		{
			win = win.opener || win.parent;
		}

		return win;
	};



	nexacro._getAppContainerDivHandle = function (target)
	{
		const root = target instanceof nexacro._Window ? target.root : target;

		if (root.hasOwnProperty("__containerhandle"))
		{
			return root.__containerhandle ? root.__containerhandle : nexacro.__MFEAPI._getContainer(root);
		}

		return null;
	}
	nexacro._isPopupWindowApp = function ()
	{
		return (window.opener) ? true : false;
	};



	nexacro._isWindowObject = function (_win)
	{
		return (_win instanceof nexacro._Window)
	}

	nexacro._ishandleWindow = function (_handle)
	{
		if (_handle && typeof _handle.document === "object" && _handle.document.defaultView)
			return true;

		return false;
	}
	nexacro._handletoWindow = function (_win_handle)
	{
		if (nexacro._ishandleWindow(_win_handle))
			return _win_handle;
		else
			return _win_handle.ownerDocument.defaultView;


	};
	nexacro._getWindowHandle = function (_win_handle)
	{
		const link_window = nexacro._getLinkedWindow(_win_handle);
		if (link_window && link_window._is_main)
			return nexacro._handletoWindow(_win_handle);

		return window;
	};


	nexacro._getWindowDocumentHandle = function (_win_handle)
	{
		const win = nexacro._handletoWindow(_win_handle);
		return win.document;
	}
	nexacro._getWindowDestinationHandle = function (_win_handle)
	{
		if (nexacro._ishandleWindow(_win_handle))
			return _win_handle.document.body;
		else
			return _win_handle;
	}

	nexacro._getWindowHwndHandle = nexacro._emptyFn; //for nre only

	nexacro._getWindowHandlePosX = function (_win_handle)
	{
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;


		if (nexacro._Browser == "Gecko") 
		{
			return win.mozInnerScreenX;
		}
		else
		{
			const link_window = nexacro._getLinkedWindow(_win_handle);
			return link_window.getOffsetClientPos(_win_handle).x;
		}

	}




	nexacro._getWindowHandlePosY = function (_win_handle)
	{
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;
		if (nexacro._Browser == "Gecko")
		{
			return win.mozInnerScreenY;
		}
		else
		{
			const link_window = nexacro._getLinkedWindow(_win_handle);
			return link_window.getOffsetClientPos(_win_handle).y;

		}

	}

	nexacro._getContainerHandlePosX = function (_win_handle)
	{
		const container = nexacro._isWindowObject(_win_handle) ? _win_handle.handle : _win_handle;
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;
		const winx = nexacro._getWindowHandlePosX(container);
		if (nexacro._ishandleWindow(container))
			return winx;
		else
		{
			const rect = nexacro._getContentRect(container);//container.getBoundingClientRect(); // nexacro._Window에 cache 되었으면 대체
			return winx + rect.x;
		}

	}
	nexacro._getContainerHandlePosY = function (_win_handle)
	{
		const container = nexacro._isWindowObject(_win_handle) ? _win_handle.handle : _win_handle;
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;
		const winy = nexacro._getWindowHandlePosY(container);
		if (nexacro._ishandleWindow(container))
			return winy;
		else
		{
			const rect = nexacro._getContentRect(container);//container.getBoundingClientRect(); // nexacro._Window에 cache 되었으면 대체
			return winy + rect.y;
		}
	}



	nexacro._getWindowHandleOuterWidth = function (_win_handle)
	{
		const win = nexacro._handletoWindow(_win_handle);
		if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 8)
		{
			return win.document.documentElement.offsetWidth;
		}
		else if (nexacro._macOSWebView)
		{
			var json = {
				id: "0000",
				div: "NexacroWindow",
				method: "_getWindowWidth",
				params: {}
			};
			var jsonstr = JSON.stringify(json);
			var widthResult = nexacro.Device.exec(jsonstr, true);
			var width = parseInt(widthResult, 10);
			return width;
		}
		else
		{
			return win.outerWidth;
		}

	}
	nexacro._getWindowHandleOuterHeight = function (_win_handle)
	{
		const win = nexacro._handletoWindow(_win_handle);
		if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 8)
		{
			return win.document.documentElement.offsetHeight;
		}
		else if (nexacro._macOSWebView)
		{
			var json = {
				id: "0000",
				div: "NexacroWindow",
				method: "_getWindowHeight",
				params: {}
			};
			var jsonstr = JSON.stringify(json);
			var heightResult = nexacro.Device.exec(jsonstr, true);
			var height = parseInt(heightResult, 10);
			return height;
		}
		else
		{
			return win.outerHeight;
		}
	}

	nexacro._getContainerHandleOuterWidth = function (_win_handle)
	{
		if (nexacro._ishandleWindow(_win_handle))
			return nexacro._getWindowHandleOuterWidth(_win_handle)
		else
			return _win_handle.offsetWidth;

	}

	nexacro._getContainerHandleOuterHeight = function (_win_handle)
	{
		if (nexacro._ishandleWindow(_win_handle))
			return nexacro._getWindowHandleOuterHeight(_win_handle)
		else
			return _win_handle.offsetHeight;
	}


	nexacro.__windowClientDimension = function (_win_handle, dimension, isHeight)
	{
		const _tester = nexacro._device_exception_tester || nexacro._searchDeviceExceptionTable();
		const clientSize = _win_handle.document.documentElement[dimension];
		const innerSize = isHeight ? _win_handle.innerHeight : _win_handle.innerWidth;

		if (nexacro._OS === "iOS" && (nexacro._Browser === "MobileSafari" || nexacro._Browser === "Chrome")) 
		{
			if (nexacro._BrowserVersion > 11.2 || nexacro._MobileDesktopMode)
				return clientSize;

			else if (nexacro._SystemType === "ipad" && nexacro._isHybrid())
				return clientSize;

			else if (!nexacro._isHybrid() && (nexacro._allow_default_pinchzoom || (_tester && _tester.use_windowsize_as_bodysize)))
				return clientSize;

			else
				return innerSize;

		}
		else if (nexacro._BrowserExtra === "SamsungBrowser") 
		{
			if (nexacro._allow_default_pinchzoom)
				return _win_handle.document.body[dimension];

			else if (_tester && _tester.use_windowsize_as_bodysize)
				return _win_handle.document.body[dimension];

			else
				return innerSize;

		}
		else 
		{
			if (nexacro._allow_default_pinchzoom) 
			{
				const bodySize = _win_handle.document.body[dimension];
				return bodySize > innerSize ? bodySize : innerSize;
			}
			else if (_tester && _tester.use_windowsize_as_bodysize)
				return _win_handle.document.body[dimension];

			else
				return innerSize;

		}
	}
	nexacro._getWindowHandleClientWidth = function (_win_handle)
	{
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;
		return nexacro.__windowClientDimension(win, "clientWidth", false);
	}
	nexacro._getWindowHandleClientHeight = function (_win_handle)
	{
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;
		return nexacro.__windowClientDimension(win, "clientHeight", true);
	}
	nexacro._getWindowOverlayWidth = function (w)
	{
		const width_ = Math.max(
			document.body.scrollWidth,
			document.documentElement.scrollWidth
		);

		return Math.max(w, width_);
	}
	nexacro._getWindowOverlayHeight = function (h)
	{

		const height_ = Math.max(
			document.body.scrollHeight,
			document.documentElement.scrollHeight
		);


		return Math.max(h, height_);
	}


	nexacro._getContainerHandleClientWidth = function (_win_handle)
	{
		const container = nexacro._isWindowObject(_win_handle) ? _win_handle.handle : _win_handle;
		if (nexacro._ishandleWindow(container))
			return nexacro._getWindowHandleClientWidth(container);
		else
		{
			const rect = nexacro._getContentRect(container);//container.getBoundingClientRect(); // nexacro._Window에 cache 되었으면 대체
			return rect.contentsWidth;
		}
	}
	nexacro._getContainerHandleClientHeight = function (_win_handle)
	{
		const container = nexacro._isWindowObject(_win_handle) ? _win_handle.handle : _win_handle;
		if (nexacro._ishandleWindow(container))
			return nexacro._getWindowHandleClientHeight(container);
		else
		{
			const rect = nexacro._getContentRect(container);//container.getBoundingClientRect(); // nexacro._Window에 cache 되었으면 대체
			return rect.contentsHeight;
		}
	}


	nexacro._getWindowHandleText = function (_win_handle)
	{
		var doc = _win_handle.document;
		return doc ? doc.title : "";
	};

	nexacro._setWindowHandleArea = function (_win_handle, x, y, w, h)
	{
		_win_handle.moveTo(x, y);
		_win_handle.resizeTo(w, h);
	};
	nexacro._setWindowHandlePos = function (_win_handle, x, y)
	{
		_win_handle.moveTo(x, y);

		if (globalThis.chrome && globalThis.chrome.webview)
		{
			var params = { x: x, y: y };
			nexacro._messageToNative("0000", "NexacroWindow", "_setWindowHandlePos", params, true);
		}
		else if (nexacro._macOSWebView)
		{
			var params = {
				x: x,
				y: y
			};
			var json = {
				id: "0000",
				div: "NexacroWindow",
				method: "_setWindowHandlePos",
				params: params
			};
			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}
	};
	nexacro._setWindowHandleSize = function (_win_handle, w, h)
	{
		_win_handle.resizeTo(w, h);

		if (nexacro._macOSWebView)
		{
			var params = {
				width: w,
				height: h
			};
			var json = {
				id: "0000",
				div: "NexacroWindow",
				method: "_setWindowHandleSize",
				params: params
			};
			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}
	};

	nexacro._setWindowHandleZIndex = function (_win_handle, zindex)
	{
		if (_win_handle.style)
			_win_handle.style.zIndex = zindex;
	};

	nexacro._findWindow = function (_win_handle)
	{
		return nexacro._getLinkedWindow(_win_handle);
	};
	nexacro._findContainerWindow = function (node)
	{
		try
		{


			const linked_element = nexacro.__findParentElement(node);

			if (linked_element)
			{
				const control = nexacro._findParentComponent(linked_element);
				const root = control._getRootObject();
				const handle = nexacro.__MFEAPI._getContainer(root);
				return nexacro._getLinkedWindow(handle);
			}
		}
		catch (e)
		{
			return null;
		}
	}
	nexacro._findDocumentWindow = function (_doc, node)
	{
		var _win_handle = (_doc.defaultView || _doc.parentWindow);
		let _win = nexacro._getLinkedWindow(_win_handle);
		if (!_win && node)
		{
			_win = nexacro._findContainerWindow(node);
		}

		return _win;

	};

	nexacro._isEmbeddedWindow = function (win)
	{
		var _win_handle = win.handle;
		if (_win_handle)
		{
			var is_embedded = _win_handle.parent.document != _win_handle.document;
			if (is_embedded)
			{
				win._last_focused_elem = null;
				return true;
			}
		}
		return false;
	};

	nexacro._flashWindow = function (/*_win_handle, type, count, interval*/)
	{
	};

	nexacro._setMouseHovertime = function (/*mousehovertime*/)
	{
	};

	nexacro._setWindowHandleText = function (_win_handle, titletext)
	{
		var doc = _win_handle.document;

		if (doc)
		{
			return doc.title = titletext;
		}
	};

	nexacro._setWindowHandleStatusText = function (_win_handle, statustext)
	{
		if (window)
		{
			return window.status = statustext;
		}
	};

	//nexacro._setWindowHandleIcon =nexacro._emptyFn;
	nexacro._setWindowHandleIconObject = nexacro._emptyFn;



	nexacro._getMainWindowWidth = function (_win)
	{
		if (!nexacro._isTouchInteraction)
			return _win.clientWidth;
		else
		{
			const client_width = nexacro._getContainerHandleClientWidth(_win.handle);
			if (client_width !== 0)
				return client_width;

			const doc = _win._doc;
			if (nexacro._ishandleWindow(_win.handle) && doc)
			{
				const doc_elem = doc.documentElement;
				let width = 0;
				if (nexacro._OS == "iOS")
				{
					if (doc_elem.clientWidth)
						width = doc_elem.clientWidth;

					else if (_win.innerWidth)
						width = doc.body.clientWidth;

					else if (doc.body.clientWidth > 0)
						width = _win.innerWidth;
				}
				else
				{
					let w1 = _win.innerWidth ? _win.innerWidth : 0;
					let w2;
					let w3 = doc.body.clientWidth ? doc.body.clientWidth : 0;

					if (doc_elem && doc_elem.clientWidth)
						w2 = doc_elem.clientWidth ? doc_elem.clientWidth : 0;

					if (w1 < w2)
					{
						if (w2 < w3)
							width = doc.body.clientWidth;
						else
							width = doc_elem.clientWidth;
					}
					else
					{
						if (w1 < w3)
							width = doc.body.clientWidth;
						else
							width = _win.innerWidth;
					}
				}
				return width;
			}

			return _win.clientWidth;

		}
	}
	nexacro._getMainWindowHeight = function (_win)
	{
		if (!nexacro._isTouchInteraction)
			return _win.clientHeight;
		else
		{
			const client_height = nexacro._getContainerHandleClientHeight(_win.handle);
			if (client_height !== 0)
				return client_height;

			const doc = _win._doc;
			if (nexacro._ishandleWindow(_win.handle) && doc)
			{
				const doc_elem = doc.documentElement;
				let height = 0;
				if (nexacro._OS == "iOS")
				{
					if (doc_elem.clientHeight)
						height = doc_elem.clientHeight;

					else if (_win.innerHeight)
						height = doc.body.clientHeight;

					else if (doc.body.clientHeight > 0)
						height = _win.innerHeight;

				}
				else
				{
					let w1 = _win.innerWidth ? _win.innerWidth : 0;
					let w2;
					let w3 = doc.body.clientWidth ? doc.body.clientWidth : 0;

					if (doc_elem && doc_elem.clientWidth)
						w2 = doc_elem.clientWidth ? doc_elem.clientWidth : 0;

					if (w1 < w2)
					{
						if (w2 < w3)
							height = doc.body.clientHeight;
						else
							height = doc_elem.clientHeight;
					}
					else
					{
						if (w1 < w3)
							height = doc.body.clientHeight;
						else
							height = _win.innerHeight;
					}
				}
				return height;

			}

			return _win.clientHeight;

		}
	}


	nexacro._getLocalStorageKey = function (global)
	{
		// application을 기반으로 한 environment의 localstorage key값은 개별로 관리됨 , 여러개의 창이 뜰경우 개별로 관리됨
		// nexacro.getPrivateProfile을 통해서 호출된 값은 key + projectpath 가 같으면 공동 제어

		if (!nexacro._uniquestoragevalue)    
		{
			nexacro._uniquestoragevalue = new Date().getTime();
		}

		var localstoragekey = "";
		var projectpath = nexacro._project_absolutepath ? nexacro._project_absolutepath : nexacro._getProjectBaseURL();
		if (global)
		{
			localstoragekey = window.location.href + "user";
		}
		else
		{
			//application 으로 뜨는 경우 
			var env = nexacro.getEnvironment();
			localstoragekey = env._p_key + projectpath;
		}

		return localstoragekey;
	};

	nexacro._getLocalStorageObject = function ()
	{
		if (nexacro._isLocalStorageSupport())
			return window.localStorage;
		else
		{
			const env = nexacro.getEnvironment()
			if (env)
			{
				if (!env._userprivateprofile)
				{
					env._userprivateprofile = new nexacro.Collection();
					env._userprivateprofile.removeItem = function (key) { return this.remove_item(key); };
				}

				return env._userprivateprofile;
			}
		}
	};

	//type = 3: envvar 4: envcookie  5:envhttp 6: evnsecurecookie
	nexacro._getSharedVariable = function (name, type)
	{
		let env = nexacro.getEnvironment();
		if (env && env._engineshared && env._engineshared[type])
		{
			return env._engineshared[type][name]?.value;
		}
		return undefined;
	};

	nexacro._setSharedVariable = function (name, value, type)
	{
		let env = nexacro.getEnvironment();
		if (env)
		{
			if (!env._engineshared) env._engineshared = {};
			if (!env._engineshared[type]) env._engineshared[type] = {};

			let vartype = (typeof value);
			if (vartype == "object")
			{
				if (value instanceof nexacro.Date)
					vartype = "nexacrodate";
				else if (value instanceof Date)
					vartype = "date";
				else if (value instanceof nexacro.Decimal)
					vartype = "decimal";
			}

			env._engineshared[type][name] = { "type": vartype, "value": value };
		}
	};

	nexacro._removeSharedVariable = function (name, type)
	{
		let env = nexacro.getEnvironment();
		if (env && env._engineshared && env._engineshared[type])
		{
			env._engineshared[type][name] = null;
			delete env._engineshared[type][name];
		}
	};

	nexacro._getSharedVariableAll = function (type)
	{
		let env = nexacro.getEnvironment();
		if (env && env._engineshared && env._engineshared[type])
		{
			return env._engineshared[type];
		}
	};

	nexacro._hasSharedVariable = function (name, type)
	{
		let env = nexacro.getEnvironment();
		if (env && env._engineshared && env._engineshared[type])
		{
			const value = env._engineshared[type][name];
			if (value)
			{
				return value.type ? true : false;  //변수가 있고 type이 undefined 일 경우 type이 있다
			}
		}
		return false;
	};

	nexacro._clearLocalStorage = function ()
	{
		let env = nexacro.getEnvironment();
		if (env?._engineshared)
			env._engineshared = null;
	};

	// type 삭제 : privateprofile 만 localstorage 사용
	nexacro._removePrivateProfile = function (key, global)
	{
		var localstorage = nexacro._getLocalStorageObject();
		if (localstorage)
		{
			var localstoragekey = nexacro._getLocalStorageKey(global);

			if (localstoragekey)
			{
				var localstoragedata = localstorage.getItem(localstoragekey);

				var jsondata = {};
				if (localstoragedata)
				{
					jsondata = JSON.parse(localstoragedata);
				}

				var findkey = jsondata[key];
				if (findkey)
				{
					delete jsondata[key];
				}
				localstorage.setItem(localstoragekey, JSON.stringify(jsondata));
			}
		}
	};

	// type = 1: user, 2: engine, 3: envvar 4: envcookie 5: envhttp 6: evnsecurecookie
	// type 삭제 : privateprofile 만 localstorage 사용
	nexacro._setPrivateProfile = function (key, varValue, global)
	{
		let localstorage = nexacro._getLocalStorageObject();
		if (localstorage)
		{
			let localstoragekey = nexacro._getLocalStorageKey(global);
			if (localstoragekey)
			{
				var localstoragedata = localstorage.getItem(localstoragekey);
				var jsondata = {};
				if (localstoragedata)
				{
					jsondata = JSON.parse(localstoragedata);
				}

				var vartype, findkey = jsondata[key];
				if (findkey)
				{
					vartype = (typeof varValue);
					if (vartype == "object")
					{
						if (varValue instanceof nexacro.Date)
							vartype = "nexacrodate";
						else if (varValue instanceof Date)
							vartype = "date";
					}
					if (findkey.type == vartype && findkey.value == varValue)
						return true;

					findkey.type = vartype;
					findkey.value = varValue + "";
				}
				else
				{
					vartype = (typeof varValue);
					if (vartype == "object")
					{
						if (varValue instanceof nexacro.Date)
							vartype = "nexacrodate";
						else if (varValue instanceof Date)
							vartype = "date";
						else if (varValue instanceof nexacro.Decimal)
							vartype = "decimal";
					}

					jsondata[key] = { "type": vartype, "value": varValue + "" };
				}

				if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid())
				{
					nexacro._setPreferencesValue(localstoragekey, JSON.stringify(jsondata));
				}

				localstorage.setItem(localstoragekey, JSON.stringify(jsondata));

				return true;
			}
		}
	};



	// type = 1: user, 2: engine, 3: envvar 4: envcookie 5: envhttp
	// type 삭제 : privateprofile 만 localstorage 사용
	nexacro._getPrivateProfile = function (key, global)
	{
		let localstorage = nexacro._getLocalStorageObject();
		if (localstorage)
		{
			let localstoragekey = nexacro._getLocalStorageKey(global);
			var localstoragedata = localstorage.getItem(localstoragekey);
			var jsondata = {};
			if (localstoragedata)
			{
				if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid())
				{
					nexacro._setPreferencesValue(localstoragekey, localstoragedata);
				}
				jsondata = JSON.parse(localstoragedata);
			}
			var findkey = jsondata[key];
			if (findkey)
			{
				var vartype = findkey.type;
				var value = findkey.value;
				if (value && vartype)
				{
					if (vartype == "number")
					{
						return Number(value);
					}
					else if (vartype == "boolean")
					{
						return (value == "true") ? true : false;
					}
					else if (vartype == "nexacrodate")
					{
						var year = value.substring(0, 4);
						var month = value.substring(4, 6);
						var date = value.substring(6, 8);
						var hour = value.substring(8, 10);
						var minute = value.substring(10, 12);
						var second = value.substring(12, 14);
						var millisecond = value.substring(14, 16);
						return new nexacro.Date(year, month, date, hour, minute, second, millisecond);
					}
					else if (vartype == "date")
					{
						return new Date(value);
					}
					else if (vartype == "decimal")
					{
						return new nexacro.Decimal(value);
					}
					else if (vartype == "undefined")
					{
						return "undefined";
					}
					return value;
				}
			}
		}
	};



	if (!window.postMessage)
	{
		nexacro._postMessage = function (id, win, target_comp/*, targetorigin*/)
		{
			nexacro._OnceCallbackTimer.callonce(target_comp, function ()
			{
				win._on_sys_message(id);
			}, 10);
		};
	}
	else
	{
		nexacro._postMessage = function (id, win, target_comp, targetorigin)
		{
			if (win && win.postMessage)
			{
				win.postMessage(id, targetorigin);
			}
			else 
			{
				window.postMessage(id, targetorigin);
			}
		};
	}

	nexacro._getGlobalValueData = function (key, url)
	{
		if (nexacro._globalvalue)
		{
			return nexacro._globalvalue;
		}

		if (window.name && key && url)
		{
			var globalvars = "";
			var items = window.name.split(',');
			if (items.length)
			{
				var fields = items[0].split(':');
				if (fields[0] == key && unescape(fields[1]) == url)
				{
					globalvars = items.splice(1, items.length - 1).join(',');
				}
			}
			nexacro._globalvalue = globalvars;
			return globalvars;
		}
	};

	nexacro._getSystemFont = function ()
	{
		return new nexacro._FontObject("12pt Verdana");
	};

	//////////////////////////////////////////////////////////////////////////


	nexacro._blockScript = function ()
	{

	};

	nexacro._unblockScript = function ()
	{

	};

	if (globalThis.chrome && globalThis.chrome.webview)
	{
		nexacro._createVirtualWindowHandle = function (_handle)
		{
			var params = {};

			return nexacro._messageToNative(_handle, "NexacroWindow", "_createVirtualWindow", params, true, true);
		};

		nexacro._closeVirtualWindowHandle = function (_handle)
		{
			var params = { handle: _handle };

			return nexacro._messageToNative(_handle, "NexacroWindow", "_closeVirtualWindow", params, true);
		};

		nexacro._blockScript = function (handle, _virtual_handle)
		{
			var params = { handle: _virtual_handle };

			return nexacro._messageToNative(handle, "NexacroWindow", "_blockScript", params, true);
		};

		nexacro._unblockScript = function (handle, _virtual_handle)
		{
			var params = { handle: _virtual_handle };

			return nexacro._messageToNative(handle, "NexacroWindow", "_unblockScript", params, true);
		};
	}


	nexacro._setPopupWindowHandleVisible = function (handle, visible_flag)
	{
		if (handle)
		{
			var handle_style = handle.style;
			if (handle_style)
			{
				handle_style.visibility = (visible_flag === true) ? "" : "hidden";
			}
		}
	};

	nexacro._showQuickviewMenu = function (/*comp, sx, sy*/) { };
	nexacro._setSystemMenuResizable = function (/*handle, resizable*/) { };
	nexacro._procSysCommand = function (handle, command) 
	{
		if (nexacro._macOSWebView)
		{
			var params = {
				command: command
			};
			var json = {
				id: "0000",
				div: "NexacroWindow",
				method: "_procSysCommand",
				params: params
			};
			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}
		else
		{
			var params = { command: command };
			var method = "_procSysCommand";
			var div = "NexacroWindow";
			nexacro._messageToNative(handle ? handle._hybridHandle : "0000", div, method, params, false);
		}
	};

	nexacro._setWindowHandleLock = function (handle, is_lock, _except_handle, is_modal_async)
	{
		nexacro.__setWindowHandleLock(handle, is_lock, _except_handle, is_modal_async);
	};

	nexacro.__setWindowHandleLock = function (handle, is_lock, _except_handle/*, is_modal_async*/)
	{
		// HTML5는 ModalAsync로만 사용된다.
		var __handle = handle;
		if (__handle == null)
		{
			__handle = window; // TODO check
		}

		var _window = nexacro._getLinkedWindow(__handle);
		while (_window)
		{
			if (_window.parent)
				_window = _window.parent;
			else
				break;
		}

		if (_window == null)
		{
			// assert
			return;
		}

		var _except_window = _except_handle ? nexacro._getLinkedWindow(_except_handle) : null;
		nexacro.__setWindowHandleEnableByRef(_window, !is_lock, _except_window, true, true);
	};

	nexacro.__setWindowHandleEnableByRef = function (_window, is_enable, _except_window, is_recursive /*,is_modal_async*/)
	{
		// HTML5는 ModalAsync로만 사용된다.
		if (_window != _except_window)
		{
			if (is_enable)
			{
				_window._disable_ref--;
				if (_window._disable_ref === 0)
					_window._coverUnlock(_except_window);
			}
			else
			{
				if (_window._disable_ref === 0)
					_window._coverLock(_except_window);
				_window._disable_ref++;
			}
		}

		if (is_recursive)
		{
			for (var i = 0; i < _window._child_list.length; i++)
			{
				var child = _window._child_list[i];
				if (child.root)
					nexacro.__setWindowHandleEnableByRef(child, is_enable, _except_window, true, true);
			}
		}
	};

	nexacro._requestAnimationFrame = function (_window, callback)
	{
		if (!_window)
			return;
		var win_handle = _window.handle;
		if (!win_handle)
			return;

		win_handle = nexacro._handletoWindow(win_handle);
		var requestAnimationFrame = win_handle.requestAnimationFrame || win_handle.mozRequestAnimationFrame || win_handle.webkitRequestAnimationFrame || win_handle.msRequestAnimationFrame;
		if (!requestAnimationFrame)
			return;
		var requestid = requestAnimationFrame.call(win_handle, callback);
		return requestid;
	};

	nexacro._cancelAnimationFrame = function (_window, requestid)
	{
		if (!_window)
			return;
		var win_handle = _window.handle;
		if (!win_handle)
			return;

		win_handle = nexacro._handletoWindow(win_handle);
		var cancelAnimationFrame = win_handle.cancelAnimationFrame || win_handle.mozCancelAnimationFrame || win_handle.webkitCancelAnimationFrame;
		if (cancelAnimationFrame)
			cancelAnimationFrame.call(win_handle, requestid);
	};

	nexacro._checkExceptionDevice = function (_tester)
	{
		var orientation_str = nexacro._isPortrait() ? "portrait" : "landscape";
		_tester.init_screen_width = nexacro._getScreenWidth();
		_tester.is_init_screen_portrait = nexacro._isPortrait();
		_tester[orientation_str + "_screen_width"] = nexacro._getScreenWidth();
		_tester.screen_checked = true;
	};

	nexacro.__setViewportScale = function ()
	{
		//mfe 일 경우 body의 viewport 를 변경하지 않음
		if (nexacro.ismodule)
			return;

		// 지정된 값으로 설정하지 않고 nexacro proprerty를 기준으로 자동으로 설정하도록 새로 만듬
		// 모바일 환경 기기별 예외처리를 위해서 직접 테스트를 수행함
		// 1. 최초 viewport 설정시
		// 2. 최초 orientationchange 시
		var _tester = nexacro._device_exception_tester;
		if (_tester.screen_checked === false)
		{
			nexacro._checkExceptionDevice(_tester);
		}

		const env = nexacro.getEnvironment();
		var ratio = env._zoom_factor / 100;
		var scalable_val = "0";

		// desktop 환경은 autozoom, pinch zoom 지원하지 않음.
		if (!nexacro._isDesktop() || nexacro._AndroidDesktopMode)
		{
			if (nexacro._allow_default_pinchzoom)
			{
				scalable_val = "1";
			}
		}

		var elems = document.getElementsByName("viewport");
		var viewport = elems.length ? elems[0] : null;
		if (!viewport)
		{
			viewport = document.createElement("meta");
			viewport.name = "viewport";
			document.querySelector("head").appendChild(viewport);
		}

		var contents = viewport.content.split(",");

		function __set_attribute(attr_name, attr_value)
		{
			var content = attr_value ? attr_name + "=" + attr_value : null;
			var is_found = false;

			for (var i = 0; i < contents.length; i++)
			{
				var name = nexacro.trim(contents[i].split("=")[0]);
				if (name == attr_name)
				{
					is_found = true;
					if (content)
					{
						contents[i] = content;
					}
					else
					{
						contents.splice(i, 1);
					}
					break;
				}
			}

			if (!is_found && content)
			{
				contents.push(content);
			}
		}

		__set_attribute("user-scalable", scalable_val);
		__set_attribute("initial-scale", ratio);

		if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
		{
			__set_attribute("minimum-scale", ratio);
		}

		if (!nexacro._allow_default_pinchzoom && nexacro._getDeviceName() == "iPhone")
		{
			//화면이 작게 로딩되는 현상
			__set_attribute("minimum-scale", ratio);
			__set_attribute("maximum-scale", ratio);
		}

		if (nexacro._OS == "Android")
		{
			// 일부 안드로이드 기기에서 dpi값이 없을 경우 비정상적인 크기로 확대되는 문제가 발견됨
			__set_attribute("target-densitydpi", "device-dpi");
			if (nexacro._isWebView())
			{
				if (ratio > 1)
				{
					__set_attribute("initial-scale", 1);
					__set_attribute("minimum-scale", 1);
				}
			}
			else
			{
				__set_attribute("width", "");
			}
		}
		else
		{
			__set_attribute("width", "");
		}

		// 최초 Window생성과 동시에 Viewport를 세팅하는 경우에 해당함.
		var _win = nexacro._getLinkedWindow(window)
		if (nexacro._OS == "iOS")
		{
			if (!_win)
			{
				var deviceName = nexacro._getDeviceName();
				if ((deviceName == "iPhone" && nexacro._BrowserVersion >= 10 && nexacro._BrowserVersion != 12) ||
					(nexacro._Browser == "Chrome" && nexacro._BrowserVersion >= 73) ||
					(deviceName == "iPad" && nexacro._BrowserVersion < 11))//iPad Pro 확인
				{
					var win_handle = window;
					var win = nexacro._getLinkedWindow(win_handle)
					var old_window_width = nexacro._getContainerHandleClientWidth(win_handle);
					var delayTime = 5;
					var checkMaximumCnt = 200;
					if (deviceName == "iPad")
						checkMaximumCnt = 400;
					if (win_handle.innerWidth == win_handle.document.body.clientWidth)
					{
						var _timeout = 0;
						_tester._viewport_resize_observer = setInterval(function ()
						{
							var cur_window_width = nexacro._getContainerHandleClientWidth(win_handle);

							if (old_window_width != cur_window_width || _timeout > checkMaximumCnt)
							{
								if (!win)
									win = nexacro._getLinkedWindow(win_handle);
								if (win)
								{
									var width = nexacro._getContainerHandleClientWidth(win_handle);
									var height = nexacro._getContainerHandleClientHeight(win_handle);
									win.setSize(width, height);
									win.root._setSize(width, height, 0);
								}
								if (deviceName == "iPad")
								{
									if (parseInt(document.body.style.width) == cur_window_width || _timeout > checkMaximumCnt)
									{
										clearInterval(_tester._viewport_resize_observer);
										_tester._viewport_resize_observer = null;
									}
								}
								else
								{
									clearInterval(_tester._viewport_resize_observer);
									_tester._viewport_resize_observer = null;
								}

							}
							_timeout++;
						}, delayTime);
					}
				}
				var use_windowsize_as_bodysize = nexacro._searchDeviceExceptionValue("use_windowsize_as_bodysize");
				if (use_windowsize_as_bodysize)
					_tester.use_windowsize_as_bodysize = true;

			}
		}

		if (nexacro._BrowserExtra == "SamsungBrowser" || (nexacro._OS == "Android" && nexacro._Browser == "Chrome"))
		{
			var tbl = nexacro._searchDeviceExceptionTable();
			if (tbl && tbl.firsttouch_onlyonce_proc && !nexacro._is_first_touch)
			{
				document.addEventListener("touchstart", function (evt)
				{
					var curTime = (evt.timeStamp || new Date().getTime());

					if (!nexacro._last_doc_touchstart_time || (nexacro._last_doc_touchstart_time && (curTime - nexacro._last_doc_touchstart_time) < 400))
					{
						// prevent double tap zooming
						evt.preventDefault();
						if (evt.srcElement instanceof HTMLInputElement)
						{
							//evt.srcElement.focus();
							// preventDefault로 keypad 가 올라오지 않는 문제가 있어서 input에 포커스를 줌
							setTimeout((function (n) { return function () { n.focus(); }; })(evt.srcElement), 500);
						}
					}

					nexacro._last_doc_touchstart_time = curTime;
				});
				tbl.firsttouch_onlyonce_proc = false;
			}

			if (_win)
			{
				var adjust_screen_width = nexacro._getMainWindowWidth(_win);
				var adjust_screen_height = nexacro._getMainWindowHeight(_win);

				var orientation_info = screen.orientation;
				if (orientation_info && (orientation_info.type.indexOf("portrait") > -1))
				{
					adjust_screen_width = Math.round(screen.width / ratio);

					/* 브라우저 강제 확대축소 기능으로 orientation 전환시 document의 height도 잘못 들어오는 케이스 */
					var _doc_elem = _win._doc ? _win._doc.documentElement : null;
					if (_doc_elem && adjust_screen_height != _doc_elem.clientHeight)
					{
						adjust_screen_height = Math.round(_doc_elem.clientHeight);// / ratio);
					}
				}

				_win.root._setSize(adjust_screen_width, adjust_screen_height);
			}
		}
		else if (nexacro._BrowserExtra == "NaverBrowser" || nexacro._BrowserExtra == "MiuiBrowser")
		{
			// Naver inapp브라우저는(Whale 브라우저 아님) body의 width가 자동조정되려면 device-width를 줘야함.
			// 추후 업데이트로 인해서 설정 안해도 동작할수 있음.
			__set_attribute("width", "device-width");
		}
		else if (nexacro._isHybrid())
		{
			// iOS6 Safari 환경에서 초기에 있던 min,max의 값이 min,max attribute를 제거해도 영향을 주는 것 같다.
			// 따라서 initial-scale과 같은 값으로 설정함.
			if (!nexacro._allow_default_pinchzoom)
			{
				__set_attribute("minimum-scale", ratio);
				__set_attribute("maximum-scale", ratio);
			}
		}

		if (nexacro._OS == "iOS" && !nexacro._isHybrid() && nexacro._getDeviceName() != "iPhone")
		{
			setTimeout(function ()
			{
				viewport.setAttribute('content', contents.toString());

				var win = window;
				var _window = nexacro._getLinkedWindow(win);
				var _frame = _window ? _window.root : null;

				if (_frame)
				{
					var _w = nexacro._getContainerHandleClientWidth(win);
					var _h = nexacro._getContainerHandleClientHeight(win);
					_frame._setSize(_w, _h);
					_window.setSize(_w, _h);
				}
			});
		}
		else
		{
			viewport.setAttribute('content', contents.toString());
		}

		window.scrollTo(0, 0);

		/// [RP : 73026][iOS HTML5] 세로로보다가 가로모드로 돌리면 상하단 브라우저 영역에 의해 화면이 가려지는 증상	
		if (nexacro._OS == "iOS")
		{
			setTimeout(function ()
			{
				var win = window;
				var _window = nexacro._getLinkedWindow(win);

				var _frame = _window ? _window.root : null;

				if (_frame)
				{
					var _w = nexacro._getContainerHandleClientWidth(win);
					var _h = nexacro._getContainerHandleClientHeight(win);
					_frame._setSize(_w, _h);
					_window.setSize(_w, _h);
				}
			}, 500);
		}
	};


	// popup 시 정보 전달이 필요해 env._zoom_factor 설정 
	// nexacro._initScreen 내부에서 screen 정보값을 nexacro 변수로 
	nexacro._applyDesktopScreenWidth = function ()
	{
		const env = nexacro.getEnvironment();
		env._zoom_factor = (nexacro._getDeviceWidth() * 100) / Math.abs(parseInt(env._desktopscreenwidth));
	};

	nexacro._device_regular_expression =
		[[

			/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
		], ['model', 'vendor', ['type', 'tablet']], [

			/applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
		], ['model', ['vendor', 'Apple'], ['type', 'tablet']], [

			/(apple\s{0,1}tv)/i                                                 // Apple TV
		], [['model', 'Apple TV'], ['vendor', 'Apple']], [

			/(archos)\s(gamepad2?)/i,                                           // Archos
			/(hp).+(touchpad)/i,                                                // HP TouchPad
			/(kindle)\/([\w\.]+)/i,                                             // Kindle
			/\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
			/(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
		], ['vendor', 'model', ['type', 'tablet']], [

			/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
		], ['model', ['vendor', 'Amazon'], ['type', 'tablet']], [
			/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
		], [['model', "", { 'Fire Phone': ['SD', 'KF'] }], ['vendor', 'Amazon'], ['type', 'mobile']], [

			/\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
		], ['model', 'vendor', ['type', 'mobile']], [
			/\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
		], ['model', ['vendor', 'Apple'], ['type', 'mobile']], [

			/(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
			/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
			// BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
			/(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
			/(asus)-?(\w+)/i                                                    // Asus
		], ['vendor', 'model', ['type', 'mobile']], [
			/\(bb10;\s(\w+)/i                                                   // BlackBerry 10
		], ['model', ['vendor', 'BlackBerry'], ['type', 'mobile']], [
			// Asus 'tablet's
			/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i
		], ['model', ['vendor', 'Asus'], ['type', 'tablet']], [

			/(sony)\s('tablet'\s[ps])\sbuild\//i,                                  // Sony
			/(sony)?(?:sgp.+)\sbuild\//i
		], [['vendor', 'Sony'], ['model', 'Xperia tablet'], ['type', 'tablet']],
		[
			/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
		], [['vendor', 'Sony'], ['model', 'Xperia Phone'], ['type', 'mobile']], [

			/\s(ouya)\s/i,                                                      // Ouya
			/(nintendo)\s([wids3u]+)/i                                          // Nintendo
		], ['vendor', 'model', ['type', 'console']], [

			/android.+;\s(shield)\sbuild/i                                      // Nvidia
		], ['model', ['vendor', 'Nvidia'], ['type', 'console']], [

			/(playstation\s[34portablevi]+)/i                                   // Playstation
		], ['model', ['vendor', 'Sony'], ['type', 'console']], [

			/(sprint\s(\w+))/i                                                  // Sprint Phones
		], [['vendor', "", { 'HTC': 'APA', 'Sprint': 'Sprint' }], ['model', "", { 'Evo Shift 4G': '7373KT' }], ['type', 'mobile']], [

			/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo 'tablet's
		], ['vendor', 'model', ['type', 'tablet']], [

			/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
			/(zte)-(\w+)*/i,                                                    // ZTE
			/(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
			// Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
		], ['vendor', ['model', /_/g, ' '], ['type', 'mobile']], [

			/(nexus\s9)/i                                                       // HTC Nexus 9
		], ['model', ['vendor', 'HTC'], ['type', 'tablet']], [

			/[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
		], ['model', ['vendor', 'Microsoft'], ['type', 'console']], [
			/(kin\.[onetw]{3})/i                                                // Microsoft Kin
		], [['model', /\./g, ' '], ['vendor', 'Microsoft'], ['type', 'mobile']], [

			// Motorola
			/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
			/mot[\s-]?(\w+)*/i,
			/(XT\d{3,4}) build\//i,
			/(nexus\s[6])/i
		], ['model', ['vendor', 'Motorola'], ['type', 'mobile']], [
			/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
		], ['model', ['vendor', 'Motorola'], ['type', 'tablet']], [

			/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,
			/((SM-T\w+))/i
		], [['vendor', 'Samsung'], 'model', ['type', 'tablet']], [                  // Samsung
			/((s[cgp]h-\w+|SHW-\w+|SHV-\w+|gt-\w+|galaxy\snexus|sm-\w+))/i,
			/(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
			/sec-((sgh\w+))/i
		], [['vendor', 'Samsung'], 'model', ['type', 'mobile']], [
			/(samsung);'smarttv'/i
		], ['vendor', 'model', ['type', 'smarttv']], [

			/\(dtv[\);].+(aquos)/i                                              // Sharp
		], ['model', ['vendor', 'Sharp'], ['type', 'smarttv']], [
			/sie-(\w+)*/i                                                       // Siemens
		], ['model', ['vendor', 'Siemens'], ['type', 'mobile']], [

			/(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
			/(nokia)[\s_-]?([\w-]+)*/i
		], [['vendor', 'Nokia'], 'model', ['type', 'mobile']], [

			/android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
		], ['model', ['vendor', 'Acer'], ['type', 'tablet']], [

			/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG 'tablet'
		], [['vendor', 'LG'], 'model', ['type', 'tablet']], [
			/(lg) netcast\.tv/i                                                 // LG 'smarttv'
		], ['vendor', 'model', ['type', 'smarttv']], [
			/(nexus\s[45])/i,                                                   // LG
			/lg[e;\s\/-]+(\w+)*/i,
			/(IM-\w+)/i
		], ['model', ['vendor', 'LG'], ['type', 'mobile']], [

			/android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
		], ['model', ['vendor', 'Lenovo'], ['type', 'tablet']], [

			/linux;.+((jolla));/i                                               // Jolla
		], ['vendor', 'model', ['type', 'mobile']], [

			/((pebble))app\/[\d\.]+\s/i                                         // Pebble
		], ['vendor', 'model', ['type', 'wearable']], [

			/android.+;\s(glass)\s\d/i                                          // Google Glass
		], ['model', ['vendor', 'Google'], ['type', 'wearable']], [

			/android.+(\w+)\s+build\/hm\1/i,                                        // Xiaomi Hongmi 'numeric' 'model's
			/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,                   // Xiaomi Hongmi
			/android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
		], [['model', /_/g, ' '], ['vendor', 'Xiaomi'], ['type', 'mobile']], [

			/\s('tablet')[;\/]/i,                                                 // Unidentifiable 'tablet'
			/\s('mobile')[;\/]/i                                                  // Unidentifiable 'mobile'
		], [['type', ""], 'vendor', 'model']

			/*//////////////////////////
			// TODO: move to string map
			////////////////////////////
			/(C6603)/i                                                          // Sony Xperia Z C6603
			], [['model', 'Xperia Z C6603'], ['vendor', 'Sony'], ['type', 'mobile']], [
			/(C6903)/i                                                          // Sony Xperia Z 1
			], [['model', 'Xperia Z 1'], ['vendor', 'Sony'], ['type', 'mobile']], [
			/(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
			], [['model', 'Galaxy S5'], ['vendor', 'Samsung'], ['type', 'mobile']], [
			/(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
			], [['model', 'Galaxy Grand 2'], ['vendor', 'Samsung'], ['type', 'mobile']], [
			/(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
			], [['model', 'Galaxy Grand Prime'], ['vendor', 'Samsung'], ['type', 'mobile']], [
			/(SM-G313HZ)/i                                                      // Samsung Galaxy V
			], [['model', 'Galaxy V'], ['vendor', 'Samsung'], ['type', 'mobile']], [
			/(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
			], [['model', 'Galaxy Tab S 10.5'], ['vendor', 'Samsung'], ['type', 'tablet']], [
			/(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
			], [['model', 'Galaxy S5 Mini'], ['vendor', 'Samsung'], ['type', 'mobile']], [
			/(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
			], [['model', 'Galaxy Tab 3 8.0'], ['vendor', 'Samsung'], ['type', 'tablet']], [
			/(R1001)/i                                                          // Oppo R1001
			], ['model', ['vendor', 'OPPO'], ['type', 'mobile']], [
			/(X9006)/i                                                          // Oppo Find 7a
			], [['model', 'Find 7a'], ['vendor', 'Oppo'], ['type', 'mobile']], [
			/(R2001)/i                                                          // Oppo YOYO R2001
			], [['model', 'Yoyo R2001'], ['vendor', 'Oppo'], ['type', 'mobile']], [
			/(R815)/i                                                           // Oppo Clover R815
			], [['model', 'Clover R815'], ['vendor', 'Oppo'], ['type', 'mobile']], [
			 /(U707)/i                                                          // Oppo Find Way S
			], [['model', 'Find Way S'], ['vendor', 'Oppo'], ['type', 'mobile']], [
			/(T3C)/i                                                            // Advan Vandroid T3C
			], ['model', ['vendor', 'Advan'], ['type', 'tablet']], [
			/(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
			], [['model', 'Vandroid T1J+'], ['vendor', 'Advan'], ['type', 'tablet']], [
			/(ADVAN S4A)/i                                                      // Advan Vandroid S4A
			], [['model', 'Vandroid S4A'], ['vendor', 'Advan'], ['type', 'mobile']], [
			/(V972M)/i                                                          // ZTE V972M
			], ['model', ['vendor', 'ZTE'], ['type', 'mobile']], [
			/(i-'mobile')\s(IQ\s[\d\.]+)/i                                        // i-'mobile' IQ
			], ['vendor', 'model', ['type', 'mobile']], [
			/(IQ6.3)/i                                                          // i-'mobile' IQ IQ 6.3
			], [['model', 'IQ 6.3'], ['vendor', 'i-'mobile''], ['type', 'mobile']], [
			/(i-'mobile')\s(i-style\s[\d\.]+)/i                                   // i-'mobile' i-STYLE
			], ['vendor', 'model', ['type', 'mobile']], [
			/(i-STYLE2.1)/i                                                     // i-'mobile' i-STYLE 2.1
			], [['model', 'i-STYLE 2.1'], ['vendor', 'i-'mobile''], ['type', 'mobile']], [
			/(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
			], [['model', 'Touch LAI 512'], ['vendor', 'mobiistar'], ['type', 'mobile']], [
			/////////////
			// END TODO
			///////////*/

		];

	//////////////////////////////////////////////////////////////////////////
	// log
	nexacro._setLogLevel = nexacro._emptyFn;
	nexacro._setTraceMode = nexacro._emptyFn;
	nexacro._setTraceDuration = nexacro._emptyFn;
	nexacro._deleteTraceLogFile = nexacro._emptyFn;
	nexacro._getLogFilePath = nexacro._emptyFn;
	if (globalThis.chrome && globalThis.chrome.webview)
	{
		nexacro._setLogLevel = function (v)
		{
			var params = { method: "_setLogLevel", loglevel: v };
			nexacro._messageToNative("0000", "nexacroapi", "_setTraceLog", params, true);
		};

		nexacro._setTraceMode = function (v)
		{
			var params = { method: "_setTraceMode", tracemode: v };
			nexacro._messageToNative("0000", "nexacroapi", "_setTraceLog", params, true);
		};

		nexacro._setTraceDuration = function (v)
		{
			var params = { method: "_setTraceDuration", traceduration: v };
			nexacro._messageToNative("0000", "nexacroapi", "_setTraceLog", params, true);
		};

		nexacro._deleteTraceLogFile = function ()
		{
			var params = {};
			nexacro._messageToNative("0000", "nexacroapi", "_deleteTraceLogFile", params, true);
		};
		nexacro._getLogFilePath = function ()
		{
			var params = {};
			return nexacro._messageToNative("0000", "nexacroapi", "_getLogFilePath", params, true, true);
		};

	}

	nexacro._writeTraceLog = function (msglevel, message, bsystemlog, loglevel, traceduration, tracemode)
	{
		var data;
		data = (bsystemlog === true) ? "S" : "U";

		if (msglevel === 0)
			data += "F";
		else if (msglevel == 1)
			data += "E";
		else if (msglevel == 2)
			data += "W";
		else if (msglevel == 3)
			data += "I";
		else
			data += "D";

		var curdate = new nexacro.Date();
		var millisec = curdate.getMilliseconds();

		data = data + " " + curdate.getHours() + ":" + curdate.getMinutes() + ":" + curdate.getSeconds() + ":" + curdate.toZeroDigitString(millisec, 3) + " ";
		data += message;

		if (globalThis.chrome && globalThis.chrome.webview)
		{
			var traceduration = nexacro._traceduration || -1;
			var tracemode = nexacro._tracemode || "none";
			var tracelevel = loglevel || 4;

			//nexacro.__writeTraceLog(data, loglevel, tracemode, traceduration, msglevel);
			var params = { data: data, loglevel: tracelevel, tracemode: tracemode, traceduration: traceduration, msglevel: msglevel };
			nexacro._messageToNative("0000", "nexacroapi", "_writeTraceLog", params, true);

		}
		else if (nexacro._macOSWebView)
		{
			var params = {
				msglevel: msglevel,
				message: message,
				bsystemlog: bsystemlog,
				loglevel: loglevel || 4,
				traceduration: traceduration || -1,
				tracemode: tracemode || "none"
			};
			var json = {
				id: "0000",
				div: "NexacroLogger",
				method: "_writeTraceLog",
				params: params
			};
			var jsonStr = JSON.stringify(json);
			nexacro.Device.exec(jsonStr);
		}

		// IE8에서 console을 만나면 에러발생 (window.console = OK)
		if (window.console)
			window.console.log(data);
	};


	nexacro._applicationExit = function (is_close_window)
	{
		if (!nexacro.ismodule)
		{
			window.system = null;
			window._application = null;
		}

		nexacro._localecollator_list = null; // localecompare collator list
		nexacro._textDecoder = null; //

		if (is_close_window === true)
		{
			// 사용자가 exit 호출시 창을 닫음
			window.open('', '_self');
			window.close();
		}

		// Android, iOS, macOS를 위한 exit()
		if (nexacro.Device)
		{
			nexacro.Device.exit();
		}

		var params = {};
		var method = "_closeWindow";
		var div = "NexacroWindow";
		nexacro._messageToNative(window.handle ? window.handle._hybridHandle : "0000", div, method, params, false);
	};

	//////////////////////////////////////////////////////////////////////////
	// http
	nexacro._setUseHttpKeepAlive = nexacro._emptyFn;
	nexacro._setHttpTimeout = nexacro._emptyFn;
	nexacro._setHttpRetry = nexacro._emptyFn;


	// HTML5에만 필요해서 이쪽에만 만듬.
	nexacro.__getWindowHandleEnable = function (win_handle)
	{
		if (!win_handle)
			return false;

		var _window = nexacro._getLinkedWindow(win_handle);

		if (!_window)
			return false;

		if (_window._disable_ref > 0)
			return false;

		return true;
	};

	nexacro._setWindowHandleFocus = function (win_handle)
	{
		return;  //browser active 동작이 정상적으로 처리되지 않아 막음, runtime 고유 기능
		/*
		if (!win_handle)
			return;

		if (win_handle.setActive)
			win_handle.setActive();
		else if (win_handle.focus)
			win_handle.focus();
		*/
	};
	nexacro._setWindowHandleActivate = nexacro._emptyFn;
	nexacro._setWindowHandleForeground = nexacro._emptyFn;



	nexacro.__calcElementFromPoint = function (_win_handle, x, y) 
	{
		const doc = _win_handle.document;

		if (nexacro._BrowserExtra == "SamsungBrowser" && !nexacro._isDesktop() && nexacro._BrowserVersion < 43)
		{
			x -= _win_handle.scrollX;
			y -= _win_handle.scrollY;
		}
		else if (nexacro._BrowserExtra !== "SamsungBrowser" && !nexacro._isDesktop()) 
		{
			x -= _win_handle.scrollX;
			y -= _win_handle.scrollY;
		}

		const elem_handle = doc.elementFromPoint(x, y);
		return elem_handle ? nexacro.__findParentElement(elem_handle) : null;
	}

	nexacro.__getElementFromPoint = function (_win_handle, x, y)
	{
		const win = nexacro._isWindowObject(_win_handle) ? nexacro._handletoWindow(_win_handle.handle) : nexacro._handletoWindow(_win_handle) || window;
		return nexacro.__calcElementFromPoint(win, x, y);
	}

	nexacro._addExtensionModule = nexacro._emptyFn;
	nexacro._loadExtensionModules = nexacro._emptyFn;
	nexacro._deleteCacheDB = nexacro._emptyFn; //only runtime;
	//nexacro._getLogFilePath = nexacro._emptyFn;

	////////////////////////////////////////////////////////////////////////////////////////

	// 모바일 장비별 이상동작에 대한 예외 테이블

	// 기본값과 동일한 기기 리스트 (테이블에서 제외됨)
	// SHV-E250S / 갤럭시 노트2 / 4.1.2
	// SHV-E250S / 갤럭시 노트2 / 4.1.2 / Chrome
	// LG-F100S / 옵티머스 뷰 / 4.0.4
	// LG-F180S / 옵티머스 G / 4.1.2
	// LG-F320S / 옵티머스 G2 / 4.2.2 / Chrome
	// SHW-M440S / 갤럭시 S3 / 4.3 / Chrome
	// IM-A840S / 베가 S5 / 4.1.2
	// SonyEricssonLT15i / 아크 엑스페리아 / 4.0.4 / stock
	// Nexus 7 / 넥서스7 / 4.3 / Chrome

	nexacro._device_exception_tester = {
		init_screen_width: undefined,
		is_init_screen_portrait: undefined,
		// check flag
		screen_checked: false,
		screen_swap_checked: false,
		delayed_swap_screen_checked: false,
		// info
		swap_screen: undefined,
		delayed_swap_screen: undefined,
		swap_screen_timer: null,
		use_windowsize_as_bodysize: false
	};
	nexacro._device_exception_table = [
		{
			// 기본값
			orientationchange_reset_viewport: (nexacro._OS == "Android") ? true : false, // orientationchange시 viewport를 리셋하면 안되는 경우 false로 지정
			swap_screen: (nexacro._OS == "Android") ? true : false, // orientationchange시 screen.width,height값이 서로 swap되면 true로 지정
			delayed_reset_viewport: false,
			delayed_swap_screen: false, // <-발생 빈도가 제법 높다.
			is_portrait_device: // android phone이면 기본적으로 세로로 길쭉한 장비라고 가정함. 그외는 undefined
				(nexacro._OS == "Android") ?
					(((nexacro._Browser == "Runtime" && nexacro.__isPhone && nexacro.__isPhone()) || (nexacro._Browser != "Runtime" && nexacro._isMobile())) ?
						(true) : (undefined)
					)
					: (undefined),
			reset_viewport_delay: 0,
			use_windowsize_as_bodysize: false,
			force_swap: false // 강제로 swap하기 위함
		},
		{
			// Samsung Galaxy S7 Edge
			model: "SM-G935S",
			browser: "Chrome",
			use_windowsize_as_bodysize: true
		},
		{
			// 갤럭시탭S / 5.0.2
			model: "SM-T800",
			browser: "stock",
			is_portrait_device: true,
			force_swap: true
		},
		{
			// 갤럭시탭S / 5.0.2
			model: "SM-T800",
			browser: "Chrome",
			is_portrait_device: true,
			force_swap: true
		},
		{
			model: "SM-T820",
			browser: "samsungstock",
			is_portrait_device: true,
			use_windowsize_as_bodysize: false,
			force_swap: true
		},
		{
			// 삼성 기본브라우저 오리엔테이션 스케일 문제
			model: "ALL",
			browser: "samsungstock",
			os_version: "6.0.1",
			reset_viewport_delay: 300,
			check_overversion: true,
			is_portrait_device: true,
			use_windowsize_as_bodysize: false,
			firsttouch_onlyonce_proc: true
		},
		{
			// 갤럭시탭 10.1 / 4.0.4
			model: "SHW-M380S",
			browser: "stock",
			is_portrait_device: false
			//swap_orientation: true, // ?
		},
		{
			// 갤럭시탭 10.1 / 4.0.4
			model: "SHW-M380S",
			browser: "Chrome",
			is_portrait_device: false
			//swap_orientation: true,
		},
		{
			// LG 옵티머스 G2 기본브라우저
			model: "LG-F320S",
			browser: "stock",
			swap_screen: false
		},
		{
			// LG 옵티머스 G2 Chrome
			model: "LG-F320S",
			browser: "Chrome",
			delayed_swap_screen: true
		},
		{
			// LG 옵티머스 G2 (Uplus) 기본브라우저가 Chrome
			model: "LG-F320L",
			browser: "Chrome",
			delayed_swap_screen: true
		},
		{
			// LG 옵티머스 G2 (KT) 
			model: "LG-F320K",
			browser: "Chrome",
			delayed_swap_screen: true
		},
		{
			// 갤럭시 S3
			model: "SHW-M440S",
			browser: "stock",
			os_version: "4.3", // 4.1.2에서는 screen width/height가 swap됨
			swap_screen: false
		},
		{
			// 갤럭시 노트2
			model: "SHV-E250S",
			browser: "stock",
			os_version: "4.4.2",
			swap_screen: false,
			use_windowsize_as_bodysize: true
		},
		{
			// 갤럭시 노트2
			model: "SHV-E250K",
			browser: "stock",
			os_version: "4.4.2",
			swap_screen: false
		},
		{
			// 갤럭시 노트2
			model: "SHV-E250L",
			browser: "stock",
			os_version: "4.4.2",
			swap_screen: false
		},
		{
			// 갤럭시 노트3
			model: "SM-N900S",
			browser: "samsungstock",
			use_windowsize_as_bodysize: true,
			swap_screen: false
		},
		{
			// 옵티머스 G3
			model: "LG-F400K",
			browser: "Chrome", // 기본 브라우저도 Chrome으로 잡히고 있다.
			delayed_swap_screen: true
		},
		{
			// 갤럭시 S4 LTE 기본브라우저
			model: "SAMSUNG SHV-E300S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
			browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
			reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
		},
		{
			// 갤럭시 S4 LTE 기본브라우저
			model: "SAMSUNG SHV-E300K", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
			browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
			reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
		},
		{
			// 갤럭시 S4 LTE 기본브라우저
			model: "SAMSUNG SHV-E300L", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
			browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
			reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
		},
		{
			// 갤럭시 S4 LTE
			model: "SHV-E300S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
			browser: "Chrome",
			reset_viewport_delay: 300,
			is_portrait_device: true
		},
		{
			// 갤럭시 S4 LTE (KT)
			model: "SHV-E300K",
			browser: "Chrome",
			reset_viewport_delay: 300,
			is_portrait_device: true
		},
		{
			// 갤럭시 S4 LTE (LG)
			model: "SHV-E300L",
			browser: "Chrome",
			reset_viewport_delay: 300,
			is_portrait_device: true
		},
		{
			// 갤럭시 S4 LTE-A 기본브라우저
			model: "SAMSUNG SHV-E330S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
			browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
			reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
		},
		{
			// 갤럭시 S4 LTE-A
			model: "SHV-E330S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
			browser: "Chrome",
			reset_viewport_delay: 300,
			is_portrait_device: true
		},
		{
			// 옵티머스G pro
			model: "LG-F240L",
			browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
			delayed_swap_screen: true
		},
		{
			// LG 베가아이언2
			model: "IM-A910K",
			browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
			delayed_swap_screen: true
		},
		{}
	];

	nexacro._searchDeviceExceptionTable = function ()
	{
		// Android에만 해당
		// Chrome이 아닌경우 기본브라우저로 판단

		if (nexacro._OS != "Android")
			return null;

		var browser;
		if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
		{
			if (nexacro._BrowserExtra == "SamsungBrowser")
				browser = "samsungstock";
			else
				browser = nexacro._Browser;
		}
		else
		{
			browser = "stock";
		}

		var table = nexacro._device_exception_table;
		var len = table.length;
		for (var i = 0; i < len; i++)
		{
			if (table[i].model === undefined)
				continue;

			if (browser != table[i].browser)
				continue;

			if (table[i].os_version)
			{
				if (table[i].check_overversion)
				{
					if (table[i].os_version > nexacro._OSVersion)
						continue;
				}
				else
				{
					if (table[i].os_version != nexacro._OSVersion)
						continue;
				}
			}
			if (table[i].model == "ALL")
				return table[i];
			var userAgent = nexacro._getUserAgent();
			if (navigator.userAgentData)
			{
				if (nexacro._accurateModel && nexacro._accurateModel.indexOf(table[i].model) >= 0)
					return table[i];
			}
			else
			{
				if (userAgent.indexOf(table[i].model) >= 0)
					return table[i];
			}


		}

		return null;
	};

	nexacro._searchDeviceExceptionValue = function (exception_type)
	{
		var exception = nexacro._searchDeviceExceptionTable();
		if (exception && exception[exception_type] !== undefined)
		{
			return exception[exception_type];
		}

		// 모델명이 예외 테이블에 없거나, 모델은 있는데 해당 속성에 대한 정의가 없는 경우 기본값으로 리턴
		exception = nexacro._device_exception_table[0];
		return exception[exception_type];
	};

	////////////////////////////////////////////////////////////////////////////////////////

	// Runtime Tray 관련
	nexacro._createTrayHandle = nexacro._emptyFn;
	nexacro._removeTrayHandle = nexacro._emptyFn;
	nexacro._setTrayIconHandle = nexacro._emptyFn;
	nexacro._setTrayTooltipHandle = nexacro._emptyFn;
	nexacro._showTrayBalloonTipHandle = nexacro._emptyFn;
	nexacro._hideTrayBalloonTipHandle = nexacro._emptyFn;
	nexacro._createTrayPopupMenuHandle = nexacro._emptyFn;
	nexacro._destroyTrayPopupMenuHandle = nexacro._emptyFn;
	nexacro._setTrayPopupMenuItemHandle = nexacro._emptyFn;
	nexacro._displayTrayPopupMenuHandle = nexacro._emptyFn;
	nexacro._syshandler_ontray_forward = nexacro._emptyFn;
	if (globalThis.chrome && globalThis.chrome.webview)
	{
		nexacro._createTrayHandle = function (icon, tooltip)
		{
			var params = { icon: icon, tooltip: tooltip };
			var ret = nexacro._messageToNative("cy_tray", "tray", "_createTray", params, true, true);
			return ret ? nexacro._toInt(ret) : null;
		};

		nexacro._removeTrayHandle = function (tray_handle)
		{
			var params = { tray_handle: tray_handle };
			return nexacro._messageToNative("cy_tray", "tray", "_removeTray", params, true);
		};

		nexacro._setTrayIconHandle = function (tray_handle, icon)
		{
			var params = { tray_handle: tray_handle, icon: icon };
			return nexacro._messageToNative("cy_tray", "tray", "setTrayIcon", params, true);
		};

		nexacro._setTrayTooltipHandle = function (tray_handle, tooltip)
		{
			var params = { tray_handle: tray_handle, tooltip: tooltip };
			return nexacro._messageToNative("cy_tray", "tray", "_setTrayTooltip", params, true);
		};

		nexacro._showTrayBalloonTipHandle = function (tray_handle, titleicon, title, text, timeout, nosound)
		{
			var params = { tray_handle: tray_handle, titleicon: titleicon, title: title, text: text, timeout: timeout, nosound: nosound };
			return nexacro._messageToNative("cy_tray", "tray", "_showTrayBalloonTip", params, true);
		};

		nexacro._hideTrayBalloonTipHandle = function (tray_handle)
		{
			var params = { tray_handle: tray_handle };
			return nexacro._messageToNative("cy_tray", "tray", "_hideTrayBalloonTip", params, true);
		};

		nexacro._createTrayPopupMenuHandle = function (tray_handle)
		{
			var params = { tray_handle: tray_handle };
			var ret = nexacro._messageToNative("cy_tray", "tray", "_createTrayPopupMenu", params, true, true);
			return ret ? nexacro._toInt(ret) : null;
		};

		nexacro._destroyTrayPopupMenuHandle = function (tray_handle, menu_handle)
		{
			var params = { tray_handle: tray_handle, menu_handle: menu_handle };
			return nexacro._messageToNative("cy_tray", "tray", "_destroyTrayPopupMenu", params, true);
		};

		nexacro._setTrayPopupMenuItemHandle = function (tray_handle, menu_handle, flags, id, caption, icon)
		{
			var params = { tray_handle: tray_handle, menu_handle: menu_handle, flags: flags, id: id, caption: caption, icon: icon };
			return nexacro._messageToNative("cy_tray", "tray", "_setTrayPopupMenuItem", params, true);
		};

		nexacro._displayTrayPopupMenuHandle = function (tray_handle, menu_handle)
		{
			var params = { tray_handle: tray_handle, menu_handle: menu_handle };
			return nexacro._messageToNative("cy_tray", "tray", "_displayTrayPopupMenu", params, true);
		};

		nexacro._syshandler_ontray_forward = function (_window, type, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key, hidereason)
		{
			var is_runbase = nexacro._isRunBaseWindow(this);
			// ondblclick, onlbuttonup, onrbuttonup 
			var application, tray;
			if (type == "lbuttonup") 
			{
				application = nexacro.getApplication();
				if (application) 
				{
					tray = application._p_trays[id];
					if (tray) tray.on_fire_onlbuttonup(button, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key);
				}
			}
			else if (type == "rbuttonup") 
			{
				application = nexacro.getApplication();
				if (application) 
				{
					tray = application._p_trays[id];
					if (tray)
						tray.on_fire_onrbuttonup(button, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key);
				}
			}
			else if (type == "dblclick") 
			{
				application = nexacro.getApplication();
				if (application) 
				{
					tray = application._p_trays[id];
					if (tray)
						tray.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key);
				}
			}
			else if (type == "menuclick") 
			{
				if (nexacro._current_tray_popup) 
				{
					var traypopup = nexacro._current_tray_popup;
					if (traypopup)
						traypopup.on_fire_onmenuclick(id);
				}
			}
			else if (type == "balloontipshow") 
			{
				application = nexacro.getApplication();
				if (application) 
				{
					tray = application._p_trays[id];
					if (tray)
						tray.on_fire_onballoontipshow();
				}
			}
			else if (type == "balloontiphide") 
			{
				application = nexacro.getApplication();
				if (application) 
				{
					tray = application._p_trays[id];
					if (tray)
						tray.on_fire_onballoontiphide(hidereason);
				}
			}
			else if (type == "balloontipclick") 
			{
				application = nexacro.getApplication();
				if (application) 
				{
					tray = application._p_trays[id];
					if (tray)
						tray.on_fire_onballoontipclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key);
				}
			}

			if (is_runbase) nexacro._setRunBaseWindow(null);
		};
	}

	nexacro._getCSSFileName = function (cssfile)
	{
		//todo 
		//return cssfile + ".css";

		var ext_type = nexacro._getExtUserCssScreenType();
		if (nexacro._isUndefined(ext_type))
		{
			cssfile = cssfile + "_desktop";
		}
		else
		{
			if (ext_type && ext_type.length > 0)
			{
				cssfile = cssfile + "_" + ext_type;
			}
		}

		if (nexacro._Browser == "Gecko")
		{
			cssfile += "_firefox";
		}
		else if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
		{
			cssfile += "_chrome";
		}
		else
		{
			if (nexacro._BrowserType == "WebKit")
			{
				cssfile += "_safari";
			}
			else
			{
				cssfile += "_" + nexacro._Browser.toLowerCase();
			}
		}
		return cssfile + ".css";
	};

	nexacro._getSelectedScreen = function () { };
	nexacro._getWindowRectforOpenAlign = function (/*halign, valign, parentleft, parenttop, left, top, width, height*/)
	{
		return null;
	};

	nexacro._setApplicationIcon = function (v)
	{
		var favicon = nexacro.UrlObject(v);
		if (favicon)
		{
			var handle = document.createElement("link");
			handle.rel = "shortcut icon";
			handle.href = favicon._sysurl;
			var headnode = document.getElementsByTagName('head')[0];
			headnode.appendChild(handle);
		}
	};

	nexacro._preventBackNavigation = function ()
	{
		if (window.history)																		
		{
			// 백스페이스 및 툴바의 뒤로가기 방지																				
			window.history.pushState(null, null, location.href);
			window.onpopstate = function (event)
			{
				history.go(1);
			};
		}
	};

	nexacro._isPageReloadKey = function (ctrlKey, keycode)
	{
		return (ctrlKey == true && (keycode == 78 || keycode == 82)) || (keycode == 116)
	}

	// external api
	nexacro._loadExtCss = async function (item)
	{
		const promise = new Promise((resolve, reject) =>
		{
			try
			{
				const link = document.createElement('link');
				if (item.externalid !== "#dynamic")
					link.id = item.externalid;
				//link.as = "style";
				link.rel = "stylesheet";
				link.href = item.url;
				// explicit default behavior
				if (item.crossorigin && item.crossorigin !== "")
				{
					link.setAttribute("crossorigin", (item.crossorigin == "anonymous") ? "" : item.crossorigin);
				}

				if (item.integrity)
					link.integrity = item.integrity;

				link.onload = () =>
				{
					item.status = "success";
					return resolve();
				}
				link.onerror = (e) =>
				{
					item.status = "error";
					return reject({ err: new Error(`Failed to load stylesheet: ${item.url}`), node: link });
				}
				document.head.appendChild(link);

			}
			catch (e)
			{
				item.status = "error";
				return reject({ err: new Error(`Unexpected error while loading stylesheet: ${e.message}`), node: undefined });

			}


		}).catch(reject =>
		{
			if (reject && reject.node && reject.node.parentNode)
				reject.node.remove();

			return reject.err;
		});
		let ret = await promise;
		return ret;

	};

	nexacro._fetchExtResource = async function (item)
	{
		const promise = new Promise((resolve, reject) =>
		{
			const link = document.createElement('link');
			try
			{
				if (item.externalid !== "#dynamic")
					link.id = item.externalid;
				link.as = (item.type == "style") ? "style" : "script";
				link.href = item.url
				link.rel = "prefetch";
				// explicit default behavior
				if (item.crossorigin && item.crossorigin !== "")
				{
					link.setAttribute("crossorigin", (item.crossorigin == "anonymous") ? "" : item.crossorigin);
				}

				if (item.integrity)
					link.integrity = item.integrity;

				document.head.appendChild(link);
				item.status = "fetching";
				return resolve();
			}
			catch (e)
			{
				item.status = "error";
				return reject({ err: new Error(`Unexpected error while loading resource: ${e.message}`), node: link });
			}


		}).catch(reject =>
		{
			if (reject && reject.node && reject.node.parentNode)
				reject.node.remove();

			return reject.err;
		});

		let ret = await promise;
		return ret;
	};

	nexacro._loadExtJs = async function (item)
	{
		const isEmptyObject = function (obj) 
		{
			return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
		}
		const promise = new Promise((resolve, reject) =>
		{
			(async () => 
			{
				const script = document.createElement('script');
				try
				{
					if (item.externalid !== "#dynamic")
						script.id = item.externalid;
					script.async = true;
					script.src = item.url;

					// explicit default behavior

					if (item.crossorigin && item.crossorigin !== "")
					{
						script.setAttribute("crossorigin", (item.crossorigin == "anonymous") ? "" : item.crossorigin);
					}



					if (item.integrity)
						script.integrity = item.integrity;

					// 일반적으로 IIFE 방식이나 , UMD type일 경우 전역 네임스페이스로 저장하므로 비교해서 찾을 수 있다.

					const pre_snapshot = new Set(Object.keys(globalThis));
					script.onload = async () =>
					{
						const post_snapshot = new Set(Object.keys(globalThis));
						const moduleskey = [...post_snapshot].filter(key => !pre_snapshot.has(key));
						const loadmodules = {};

						moduleskey.forEach(key =>
						{

							loadmodules[key] = globalThis[key];
						});
						if (isEmptyObject(loadmodules))
						{
							item.status = "error";
							reject({ err: new Error(`Failed to inject js module: ${item.url} `), node: script });
						}
						else
						{
							item.value = loadmodules;
							item.status = "success";
							resolve(loadmodules);
						}
					};

					script.onerror = async (evt) =>
					{

						item.status = "error";
						reject({ err: new Error(`Failed to load script: ${item.url}`), node: script });
					};


					document.head.appendChild(script);
				}
				catch (e)
				{
					item.status = "error";
					reject({ err: new Error(`Unexpected error while loading module: ${e.message}`), node: script });
				}
			})();
		}).catch(reject =>
		{
			if (reject && reject.node && reject.node.parentNode)
				reject.node.remove();

			return reject.err;
		});

		let ret = await promise;
		return ret;
	};

	nexacro._loadExtModule = async function (item)
	{

		const promise = new Promise((resolve, reject) =>
		{
			(async () => 
			{
				const script = document.createElement('script');
				try
				{

					if (item.externalid !== "#dynamic")
						script.id = item.externalid;
					script.type = "module";
					script.src = item.url;

					// explicit default behavior
					if (item.crossorigin && item.crossorigin !== "")
					{
						script.setAttribute("crossorigin", (item.crossorigin == "anonymous") ? "" : item.crossorigin);
					}

					if (item.integrity)
						script.integrity = item.integrity;

					// module은 import를 사용한다.
					script.onload = () =>
					{
						import(item.url).then((module) =>
						{
							item.value = (module && module.default) ? module.default : module;;
							item.status = "success";
							return resolve(item.value);
						}).catch((e) =>
						{
							item.status = "error";
							return reject({ err: new Error(`Failed to import module: ${item.url} - ${e.message}`), node: script });
						})
					}

					script.onerror = (e) =>
					{
						item.status = "error";
						return reject({ err: new Error(`Failed to load script: ${item.url}`), node: script });
					}

					document.head.appendChild(script);
				}
				catch (e)
				{
					item.status = "error";
					return reject({ err: new Error(`Unexpected error while loading module: ${e.message}`), node: script });
				}
			})();
		}).catch(reject =>
		{
			if (reject && reject.node && reject.node.parentNode)
				reject.node.remove();

			return reject.err;
		});

		let ret = await promise;
		return ret;
	};



	nexacro._loadExtTemplate = async function (item)
	{
		const promise = new Promise((resolve, reject) =>
		{
			try
			{
				if (item.template_src && item.template_src.length > 0)
				{

					let template_dest = nexacro._sanitize(item.template_src)
					//item.value = template_dest;
					//item.status = "success";
					return resolve(template_dest);
				}
			}
			catch (e)
			{
				//item.status = "error";
				return reject({ err: new Error(`Unexpected error while loading templaet: ${e.message}`) });
			}

		}).catch(reject =>
		{
			return reject.err;
		});

		let ret = await promise;
		return ret;


	};

	nexacro.__checkNodeDuplication = function (type, url)
	{
		if (!type || !url) return false;

		let selector;

		if (type === "script")
		{
			selector = `script[src="${url}"]`;
		}
		else if (type === "stylesheet")
		{
			selector = `link[rel="stylesheet"][href="${url}"]`;
		}
		else if (type === "prefetch")
		{
			selector = `link[rel="prefetch"][href="${url}"]`;
		}
		else
		{
			return false;
		}

		return !!document.head.querySelector(selector);
	};

	nexacro.History = (function ()
	{
		const historymodule = {};
		historymodule._currentstate = undefined;
		historymodule.pushState = function (key, url, data)
		{
			if (window.history)
			{
				if (historymodule._currentstate != key)
					window.history.pushState(key, "", url);

				let statedata = { "data": data, "url": url };
				window.sessionStorage?.setItem(key, JSON.stringify(statedata));
			}

			historymodule._currentstate = window.history.state;
		};

		historymodule.replaceCurrentState = function (data, url)
		{
			const key = historymodule._currentstate;

			if (window.sessionStorage && key)
			{
				let statedata = window.sessionStorage.getItem(key);
				if (statedata)
				{
					let pushdata = JSON.parse(statedata);
					if (pushdata)
					{
						pushdata.data = data;
						pushdata.url = url;
						window.sessionStorage.setItem(key, JSON.stringify(pushdata));
					}
				}
			}

			if (window.history && key)
				window.history.replaceState(key, "", url);
		};

		historymodule.getCurrentState = function ()
		{
			//if (window.history)
			//    return historymodule._currentstate;

			let key = historymodule._currentstate;
			if (window.sessionStorage && key)
			{
				let statedata = window.sessionStorage.getItem(key);
				if (statedata)
				{
					return JSON.parse(statedata);
				}
			}
		};

		historymodule.setCurrentStateData = function (varid, varvalue)
		{
			let key = historymodule._currentstate;
			if (window.sessionStorage && key)
			{
				let statedata = window.sessionStorage.getItem(key);
				if (statedata)
				{
					let pushdata = JSON.parse(statedata);
					if (pushdata)
					{
						if (!pushdata.data)
							pushdata.data = {};
						pushdata.data[varid] = varvalue;
						window.sessionStorage.setItem(key, JSON.stringify(pushdata));
					}
				}
			}
		};

		historymodule.getCurrentStateData = function (varid)
		{
			let key = historymodule._currentstate;
			if (window.sessionStorage && key)
			{
				let statedata = window.sessionStorage.getItem(key);
				if (statedata)
				{
					let pushdata = JSON.parse(statedata);
					if (pushdata?.data)
						return pushdata.data[varid];
				}
			}
		};

		historymodule.back = function ()
		{
			if (window.history)
				return window.history.back();
		};

		historymodule.forward = function ()
		{
			if (window.history)
				return window.history.forward();
		};

		return historymodule;
	})();

	nexacro._isRunBaseWindow = nexacro._emptyFn;
	nexacro._setRunBaseWindow = nexacro._emptyFn;
	nexacro._on_apply_layered = nexacro._emptyFn;
	nexacro._flushCommand = nexacro._emptyFn;
	nexacro._updateWrapper = nexacro._emptyFn;
	nexacro._setWindowTopmost = nexacro._emptyFn;



} // end of (!nexacro._init_platform_HTML5)


if (_process)
{
	_process = null;

	//_pHTMLSysEvent = null;
}
