	
	// Effects Library
	
	Application.effects = {
		
		init: function()
		{
			
		},
		
		scroll:
		{
			init: function()
			{
			
			},
			
			scroller: function(o, w, h)
			{
				var self = this;
				var list = o.getElementsByTagName("div");
				for (var i = 0; i < list.length; i++) {
					if (list[i].className.indexOf("Scroller-Container") > -1) {
						o = list[i];
					}
				}
				
				//Private methods
				this._setPos = function (x, y) {
					
					if (x < this.viewableWidth - this.totalWidth) 
						x = this.viewableWidth - this.totalWidth;
					if (x > 0) x = 0;
					if (y < this.viewableHeight - this.totalHeight) 
						y = this.viewableHeight - this.totalHeight;
					if (y > 0) y = 0;
					this._x = x;
					this._y = y;
					o.style.left = this._x +"px";
					o.style.top  = this._y +"px";
				};
				
				this.resetDimensions = function()
				{
					this.totalHeight = o.offsetHeight;
					this.totalWidth	 = o.offsetWidth;
				}
				
				//Public Methods
				this.reset = function () {
					this.content = o;
					this.totalHeight = o.offsetHeight;
					this.totalWidth	 = o.offsetWidth;
					this._x = 0;
					this._y = 0;
					o.style.left = "0px";
					o.style.top  = "0px";
				};
				this.scrollBy = function (x, y) {
					this._setPos(this._x + x, this._y + y);
				};
				this.scrollTo = function (x, y) {
					this._setPos(-x, -y);
				};
				this.stopScroll = function () {
					if (this.scrollTimer) window.clearInterval(this.scrollTimer);
				};
				this.startScroll = function (x, y) {
					this.stopScroll();
					this.scrollTimer = window.setInterval(
						function(){ self.scrollBy(x, y); }, 40
					);
				};
				this.swapContent = function (c, w, h) {
					o = c;
					var list = o.getElementsByTagName("div");
					for (var i = 0; i < list.length; i++) {
						if (list[i].className.indexOf("Scroller-Container") > -1) {
							o = list[i];
						}
					}
					if (w) this.viewableWidth  = w;
					if (h) this.viewableHeight = h;
					this.reset();
				};
				
				//variables
				this.content = o;
				this.viewableWidth  = w;
				this.viewableHeight = h;
				this.totalWidth	 = o.offsetWidth;
				this.totalHeight = o.offsetHeight;
				this.scrollTimer = null;
				this.reset();
			},
			
			scrollbar: function(o, s, a, ev)
			{
				var self = this;
				
				this.resetHeight = function()
				{
					this._src.resetDimensions();
					this._ratio = (this._src.totalHeight - this._src.viewableHeight)/(this._trackHeight - this._handleHeight);
				}
				
				this.reset = function () {
					//Arguments that were passed
					this._parent = o;
					this._src    = s;
					this.auto    = a ? a : false;
					this.eventHandler = ev ? ev : function () {};
					//Component Objects
					this._up   = this._findComponent("Scrollbar-Up", this._parent);
					this._down = this._findComponent("Scrollbar-Down", this._parent);
					this._yTrack  = this._findComponent("Scrollbar-Track", this._parent);
					this._yHandle = this._findComponent("Scrollbar-Handle", this._yTrack);
					//Height and position properties
					this._trackTop = findOffsetTop(this._yTrack);
					this._trackHeight  = this._yTrack.offsetHeight;
					this._handleHeight = this._yHandle.offsetHeight;
					this._x = 0;
					this._y = 0;
					//Misc. variables
					this._scrollDist  = 5;
					this._scrollTimer = null;
					this._selectFunc  = null;
					this._grabPoint   = null;
					this._tempTarget  = null;
					this._tempDistX   = 0;
					this._tempDistY   = 0;
					this._disabled    = false;
					this._ratio = (this._src.totalHeight - this._src.viewableHeight)/(this._trackHeight - this._handleHeight);
					
					this._yHandle.ondragstart  = function () {return false;};
					this._yHandle.onmousedown = function () {return false;};
					
					this._addEvent(this._src.content, "mousewheel", this._scrollbarWheel);
					this._removeEvent(this._parent, "mousedown", this._scrollbarClick);
					this._addEvent(this._parent, "mousedown", this._scrollbarClick);
					
					this._src.reset();
					this._yHandle.style.top  = "0px";
					this._yHandle.style.left = "0px";
					this._moveContent();
					
					if (this._src.totalHeight < this._src.viewableHeight) {
						this._disabled = true;
						this._yHandle.style.visibility = "hidden";
						if (this.auto) this._parent.style.visibility = "hidden";
					} else {
						this._disabled = false;
						this._yHandle.style.visibility = "visible";
						this._parent.style.visibility  = "visible";
					}
				};
				this._addEvent = function (o, t, f) {
					if (o.addEventListener) o.addEventListener(t, f, false);
					else if (o.attachEvent) o.attachEvent('on'+ t, f);
					else o['on'+ t] = f;
				};
				this._removeEvent = function (o, t, f) {
					if (o.removeEventListener) o.removeEventListener(t, f, false);
					else if (o.detachEvent) o.detachEvent('on'+ t, f);
					else o['on'+ t] = null;
				};
				this._findComponent = function (c, o) {
					var kids = o.childNodes;
					for (var i = 0; i < kids.length; i++) {
						if (kids[i].className && kids[i].className == c) {
							return kids[i];
						}
					}
				};
				//Thank you, Quirksmode
				function findOffsetTop (o) {
					var t = 0;
					if (o.offsetParent) {
						while (o.offsetParent) {
							t += o.offsetTop;
							o  = o.offsetParent;
						}
					}
					return t;
				};
				this._scrollbarClick = function (e) {
					if (self._disabled) return false;
					
					e = e ? e : event;
					if (!e.target) e.target = e.srcElement;
					
					if (e.target.className.indexOf("Scrollbar-Up") > -1) self._scrollUp(e);
					else if (e.target.className.indexOf("Scrollbar-Down") > -1) self._scrollDown(e);
					else if (e.target.className.indexOf("Scrollbar-Track") > -1) self._scrollTrack(e);
					else if (e.target.className.indexOf("Scrollbar-Handle") > -1) self._scrollHandle(e);
					
					self._tempTarget = e.target;
					self._selectFunc = document.onselectstart;
					document.onselectstart = function () {return false;};
					
					self.eventHandler(e.target, "mousedown");
					self._addEvent(document, "mouseup", self._stopScroll, false);
					
					return false;
				};
				this._scrollbarDrag = function (e) {
					e = e ? e : event;
					var t = parseInt(self._yHandle.style.top);
					var v = e.clientY + document.body.scrollTop - self._trackTop;
					
					if (v >= self._trackHeight - self._handleHeight + self._grabPoint)
						top = self._trackHeight - self._handleHeight +"px";
					else if (v <= self._grabPoint) self._yHandle.style.top = "0px";
					else self._yHandle.style.top = v - self._grabPoint +"px";
					self._y = parseInt(self._yHandle.style.top);
					
					self._moveContent();
				};
				this._scrollbarWheel = function (e) {
					e = e ? e : event;
					var dir = 0;
					if (e.wheelDelta >= 120) dir = -1;
					if (e.wheelDelta <= -120) dir = 1;
					
					self.scrollBy(0, dir * 20);
					e.returnValue = false;
				};
				this._startScroll = function (x, y) {
					this._tempDistX = x;
					this._tempDistY = y;
					this._scrollTimer = window.setInterval(function () {
						self.scrollBy(self._tempDistX, self._tempDistY); 
					}, 40);
				};
				this._stopScroll = function () {
					self._removeEvent(document, "mousemove", self._scrollbarDrag, false);
					self._removeEvent(document, "mouseup", self._stopScroll, false);
					
					if (self._selectFunc) document.onselectstart = self._selectFunc;
					else document.onselectstart = function () { return true; };
					
					if (self._scrollTimer) window.clearInterval(self._scrollTimer);
					self.eventHandler (self._tempTarget, "mouseup");
				};
				this._scrollUp = function (e) {this._startScroll(0, -this._scrollDist);};
				this._scrollDown = function (e) {this._startScroll(0, this._scrollDist);};
				this._scrollTrack = function (e) {
					var curY = e.clientY + document.body.scrollTop;
					this._scroll(0, curY - this._trackTop - this._handleHeight/2);
				};
				this._scrollHandle = function (e) {
					var curY = e.clientY + document.body.scrollTop;
					this._grabPoint = curY - findOffsetTop(this._yHandle);
					this._addEvent(document, "mousemove", this._scrollbarDrag, false);
				};
				this._scroll = function (x, y) {
					if (y > this._trackHeight - this._handleHeight) 
						y = this._trackHeight - this._handleHeight;
					if (y < 0) y = 0;
					
					this._yHandle.style.top = y +"px";
					this._y = y;
					
					this._moveContent();
				};
				this._moveContent = function () {
					this._src.scrollTo(0, Math.round(this._y * this._ratio));
				};
				
				this.scrollBy = function (x, y) {
					this._scroll(0, (-this._src._y + y)/this._ratio);
				};
				this.scrollTo = function (x, y) {
					this._scroll(0, y/this._ratio);
				};
				this.swapContent = function (o, w, h) {
					this._removeEvent(this._src.content, "mousewheel", this._scrollbarWheel, false);
					this._src.swapContent(o, w, h);
					this.reset();
				};
				
				this.reset();
			}
		},
		
		drag:
		{
			init: function()
			{
				
			},
			
			attach: function( args )
			{
				if( !args.object )
				{
					return false;
				}
				
				args.targetObject = ( typeof args.targetObject == "undefined" ) ? args.object : args.targetObject;
				args.onmousemove = ( typeof args.onmousemove == "undefined" ) ? function() {}: args.onmousemove;
				args.onmouseup = ( typeof args.onmouseup == "undefined" ) ? function() {}: args.onmouseup;
				
				// Restore the old position, should a cookie be available
				if( args.saveName )
				{
					var result = Application.util.storage.cookie.get({
																name: args.saveName + "_position"
															});
					
					if( result != false )
					{
						result = result.split("_");
						
						args.targetObject.style.left = result[0] + "px";
						args.targetObject.style.top = result[1] + "px";
					}
				}
				
				if( Application.util.browserInformation.browser == "Explorer" )
				{
					var _moveFunction = function( e )
					{
						e = e ? e : window.event;	// Preserving the event is important
						
						var initX = e.clientX - args.targetObject.offsetLeft + document.body.scrollLeft - document.body.clientLeft;
						var initY = e.clientY - args.targetObject.offsetTop + document.body.scrollTop  - document.body.clientTop;
						
						var _x = 0;
						var _y = 0;
						var _oldX = 1;
						var _oldY = 1;
						var _moveInterval = setInterval( 	function()
																				{
																					if( ( _x == 0 && _y == 0 ) || ( _x == _oldX && _y == _oldY ) )
																					{
																						return;
																					}
																					
																					args.targetObject.style.left = _x + "px";
																					args.targetObject.style.top = _y + "px";
																				}, 75);
						
						var _mouseMoveFunction = 	function()
																		{
																			_oldX = _x;
																			_oldY = _y;
																			
																			_x = window.event.clientX - initX + document.body.scrollLeft - document.body.clientLeft;
																			_y = window.event.clientY - initY + document.body.scrollTop  - document.body.clientTop;
																			
																			args.onmousemove( window.event );
																		};
						
						var _mouseUpFunction = 	function()
																	{
																		clearInterval( _moveInterval );
																		
																		if( args.saveName )
																		{
																			Application.util.storage.cookie.add({
																														name: args.saveName + "_position",
																														value: args.targetObject.offsetLeft + "_" + args.targetObject.offsetTop
																													});
																		}
																		
																		args.onmouseup( window.event );
																		
																		Application.event.remove( document.body, "mouseup",  _mouseUpFunction );
																		Application.event.remove( document.body, "mousemove",  _mouseMoveFunction );
																	};
						
						Application.event.add( document.body, "mousemove", _mouseMoveFunction );
						Application.event.add( document.body, "mouseup",  _mouseUpFunction );
					}
				}
				else
				{
					var _moveFunction = function( e )
					{
						if( e.touches )
						{
							// iPad code
							e = e.touches[0];
						}
						
						if( Application.util.browserInformation.browser == "Firefox" )
						{
							var initX = e.clientX - args.targetObject.offsetLeft - window.pageXOffset;
							var initY = e.clientY - args.targetObject.offsetTop - window.pageYOffset;
						}
						else
						{
							var initX = e.clientX - args.targetObject.offsetLeft;
							var initY = e.clientY - args.targetObject.offsetTop;
						}
						
						var _x = 0;
						var _y = 0;
						var _oldX = 1;
						var _oldY = 1;
						var _moveInterval = setInterval( 	function()
																				{
																					if( ( _x == 0 && _y == 0 ) || ( _x == _oldX && _y == _oldY ) )
																					{
																						return;
																					}
																					
																					args.targetObject.style.left = _x + "px";
																					args.targetObject.style.top = _y + "px";
																				}, 75);
						
						var _mouseMoveFunction = 	function( e )
																		{
																			_oldX = _x;
																			_oldY = _y;
																			
																			_x = e.clientX - initX - window.pageXOffset;
																			_y = e.clientY - initY - window.pageYOffset;
																			
																			args.onmousemove( e );
																		};
						
						var _mouseUpFunction = 	function( e )
																	{
																		clearInterval( _moveInterval );
																		
																		if( args.saveName )
																		{
																			Application.util.storage.cookie.add({
																														name: args.saveName + "_position",
																														value: args.targetObject.offsetLeft + "_" + args.targetObject.offsetTop
																													});
																		}
																		
																		args.onmouseup( e );
																		
																		/*
																		Application.event.remove( args.targetObject, "touchend",  _mouseUpFunction );
																		Application.event.remove( args.targetObject, "touchmove",  _mouseMoveFunction );
																		*/
																		Application.event.remove( document.body, "mousemove", _mouseMoveFunction );
																		Application.event.remove( document.body, "mouseup",  _mouseUpFunction );
																	};
						
						/*
						Application.event.add( args.targetObject, "touchmove", _mouseMoveFunction );
						Application.event.add( args.targetObject, "touchend",  _mouseUpFunction );
						*/
						Application.event.add( document.body, "mousemove", _mouseMoveFunction );
						Application.event.add( document.body, "mouseup",  _mouseUpFunction );
					}
				}
				
				if( args.eventObject )
				{
					_moveFunction( args.eventObject );
				}
				else
				{
					// Set the events
					
					Application.event.add( args.object, "touchstart", _moveFunction);
					Application.event.add( args.object, "mousedown", _moveFunction);
				}
			},
			
			load: function( args )
			{
				if( !args.targetObject || !args.saveName )
				{
					return false;
				}
				
				// Restore the old position, should a cookie be available
				
				var result = Application.util.storage.cookie.get({
															name: args.saveName + "_position"
														});
				
				if( result == false )
				{
					return false;
				}
				
				result = result.split("_");
				
				args.targetObject.style.left = result[0] + "px";
				args.targetObject.style.top = result[1] + "px";
				
				return true;
			}
		},
		
		slide:
		{
			amount: 20,
			delay: 10,
			
			absolute: function( args )
			{
				
			},
			
			fromRight: function( args )
			{
				
			},
			
			fromLeft: function( args )
			{
				if(!args.object)
				{
					return false;
				}
				
				var amount = ((typeof args.amount) != "undefined") ? args.amount : Application.effects.slide.amount;
				var delay = ((typeof args.delay) != "undefined") ? args.delay : Application.effects.slide.delay;
				
				var endClass = Application.util.style.getMatchingRules( '.' + args.object.className.toString().replace( / /g, '.' ) + " .endEffect" )[0];
				
				var startX = args.object.offsetLeft;
				var endX = parseFloat(endClass.style.left.replace( /px/, '' ));
				
				var intervalPointer = setInterval( 	function()
													{
														startX += amount;
														
														if( startX > endX )
														{
															startX = endX;
														}
														
														args.object.style.left = (startX) + "px";
														
														if( startX == endX)
														{
															clearInterval( intervalPointer );
															
															return;
														}
													}, 50);
			}
		},
		
		fade:
		{
			amount: 10,
			delay: 50,
			
			fadeIn: function( args )
			{
				if(!args.object)
				{
					return false;
				}
				
				var amount = ((typeof args.amount) != "undefined") ? args.amount : Application.effects.fade.amount;
				var delay = ((typeof args.delay) != "undefined") ? args.delay : Application.effects.fade.delay;
				var minOpacity = ((typeof args.minOpacity) != "undefined") ? args.minOpacity : 0;
				var maxOpacity = ((typeof args.maxOpacity) != "undefined") ? args.maxOpacity : 100;
				
				if(Application.util.style.getCurrent(args.object, "filter").length == 0)
				{
					args.object.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + minOpacity + ")";
				}
				
				var intervalPointer = setInterval( 	function()
													{
														minOpacity += amount;
														
														if(minOpacity > maxOpacity)
														{
															minOpacity = maxOpacity;
														}
														
														args.object.style.MozOpacity = minOpacity / 100;
														//ImageObj.style.filters.alpha.opacity=90
														args.object.style.filter = Application.util.style.getCurrent(args.object, "filter").replace( /opacity\=[0-9]+/, "opacity=" + minOpacity );
														args.object.style.opacity = minOpacity / 100;
														
														if( minOpacity == maxOpacity )
														{
															clearInterval( intervalPointer );
															
															if(args.onComplete)
															{
																args.onComplete();
															}
															
															return;
														}
													}, delay);
				
				return intervalPointer;
			},
			
			fadeOut: function ( args )
			{
				if(!args.object)
				{
					return false;
				}
				
				var amount = ((typeof args.amount) != "undefined") ? args.amount : Application.effects.fade.amount;
				var delay = ((typeof args.delay) != "undefined") ? args.delay : Application.effects.fade.delay;
				var minOpacity = ((typeof args.minOpacity) != "undefined") ? args.minOpacity : 100;
				var maxOpacity = ((typeof args.maxOpacity) != "undefined") ? args.maxOpacity : 0;
				
				var intervalPointer = setInterval( 	function()
													{
														minOpacity -= amount;
														
														if(minOpacity < maxOpacity)
														{
															minOpacity = maxOpacity;
														}
														
														args.object.style.MozOpacity = minOpacity / 100;
														//ImageObj.style.filters.alpha.opacity=90
														args.object.style.filter = Application.util.style.getCurrent(args.object, "filter").replace( /opacity\=[0-9]+/, "opacity=" + minOpacity );
														args.object.style.opacity = minOpacity / 100;
														
														if( minOpacity == maxOpacity )
														{
															clearInterval( intervalPointer );
															
															if(args.onComplete)
															{
																args.onComplete();
															}
															
															return;
														}
													}, delay);
				
				return intervalPointer;
			}
		}
		
	};
	