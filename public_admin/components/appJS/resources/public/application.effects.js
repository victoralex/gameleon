	
	// Effects Library
	
	Application.effects = {
		
		init: function()
		{
			
		},
		
		drag:
		{
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
				
				var _moveFunction = function( e )
				{
					e = e ? e : window.event;
					
					var xPos = e.x ? e.x : e.clientX;
					var yPos = e.y ? e.y : e.clientY;
					
					var initX = xPos - args.targetObject.offsetLeft;
					var initY = yPos - args.targetObject.offsetTop;
					
					var _mouseMoveFunction = 	function( e )
															{
																e = e ? e : window.event;
																
																var xPos = e.x ? e.x : e.clientX;
																var yPos = e.y ? e.y : e.clientY;
																
																args.targetObject.style.left = ( xPos - initX ) + "px";
																args.targetObject.style.top = ( yPos - initY ) + "px";
																
																args.onmousemove( e );
															};
					
					var _mouseUpFunction = 	function( e )
														{
															if( args.saveName )
															{
																Application.util.storage.cookie.add({
																											name: args.saveName + "_position",
																											value: args.targetObject.offsetLeft + "_" + args.targetObject.offsetTop
																										});
															}
															
															args.onmouseup( e );
															
															Application.event.remove( document.body, "mouseup",  _mouseUpFunction );
															Application.event.remove( document.body, "mousemove",  _mouseMoveFunction );
														};
					
					Application.event.add( document.body, "mousemove", _mouseMoveFunction );
					Application.event.add( document.body, "mouseup",  _mouseUpFunction );
				}
				
				if( args.eventObject )
				{
					_moveFunction( args.eventObject );
				}
				else
				{
					// Set the events
					Application.event.add( args.object, "mousedown", 	function( e )
																						{
																							_moveFunction( e );
																						});
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
	