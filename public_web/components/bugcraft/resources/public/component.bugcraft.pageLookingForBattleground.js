
	/*
		Market page
	*/
	
	Component.bugcraft.pageLookingForBattleground = function( args )
	{
		var lookingForBattlegroundPageObject = document.getElementById( args.id + '_lookingForBattlegroundPage' ),
			leaveBattlegroundPopup = Component.bugcraft.notificationPopup._popups.battlegroundLeave;
		
		if( typeof Component.bugcraft.initializedPages.lookingForBattleground != "undefined" )
		{
			Component.bugcraft.initializedPages.lookingForBattleground = !Component.bugcraft.initializedPages.lookingForBattleground;
			
			if( !Component.bugcraft.initializedPages.lookingForBattleground )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
			}
			
			if( Map.mapRules != "battleground" )
			{
				// inside a city probably. definitely not a battleground
				
				lookingForBattlegroundPageObject.className = Component.bugcraft.initializedPages.lookingForBattleground ? "lookingForBattleground" : "hidden";
			}
			else if( leaveBattlegroundPopup )
			{
				leaveBattlegroundPopup.isVisible ? leaveBattlegroundPopup.hide() : leaveBattlegroundPopup.show();
			}
			
			return;
		}
		
		Component.bugcraft.initializedPages.lookingForBattleground = true;
		
		//
		// Battleground listing
		//
		
		var battlegroundsList = {}, queuedBattlegroundsNumber = 0, _t = null, lO = Component.bugcraft._layoutObjects,
			battlegroundCloseButtonObject = document.getElementById( args.id + "_battlegroundsCloseButton" ),
			battlegroundListItemsObject = document.getElementById( args.id + "_battlegroundsListItems" ),
			battlegroundListItemsContainerObject = document.getElementById( args.id + "_battlegroundsListItemsContainer" ),
			battlegroundSpoilWinGloryObject = document.getElementById( args.id + "_battlegroundSpoilWinGlory" ),
			battlegroundSpoilWinPolenObject = document.getElementById( args.id + "_battlegroundSpoilWinPolen" ),
			battlegroundSpoilLossGloryObject = document.getElementById( args.id + "_battlegroundSpoilLossGlory" ),
			battlegroundSpoilLossPolenObject = document.getElementById( args.id + "_battlegroundSpoilLossPolen" ),
			battlegroundNameObject = document.getElementById( args.id + "_battlegroundName" ),
			battlegroundDescriptionObject = document.getElementById( args.id + "_battlegroundDescription" ),
			battlegroundListControlUpObject = document.getElementById( args.id + "_battlegroundsListControlUp" ),
			battlegroundListControlDownObject = document.getElementById( args.id + "_battlegroundsListControlDown" ),
			battlegroundEnqueueObject = document.getElementById( args.id + "_battlegroundEnqueue" );
		
		// "close" button event
		Application.event.add( battlegroundCloseButtonObject, "click",	function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.lookingForBattleground = !Component.bugcraft.initializedPages.lookingForBattleground;
			
			lookingForBattlegroundPageObject.className = 'hidden';
		});
		
		// mouse wheel scroll
		battlegroundListItemsContainerObject.onmousewheel = function( e )
		{
			var mouseDelta = e.wheelDelta / 10;
			
			if(
				( mouseDelta > 0 && battlegroundListItemsObject.offsetTop + mouseDelta <= 0 )
				|| ( mouseDelta < 0 && battlegroundListItemsObject.offsetTop + mouseDelta > -battlegroundListItemsObject.offsetHeight + battlegroundListItemsContainerObject.offsetHeight )
			)
			{
				battlegroundListItemsObject.style.top = ( battlegroundListItemsObject.offsetTop + mouseDelta ) + "px";
			}
			else
			{
				if( mouseDelta > 0 )
				{
					battlegroundListItemsObject.style.top = "0px";
				}
				else
				{
					battlegroundListItemsObject.style.top = ( -battlegroundListItemsObject.offsetHeight + battlegroundListItemsContainerObject.offsetHeight ) + "px";
				}
			}
			
			return false;
		}
		
		// "up" button event
		Application.event.add( battlegroundListControlUpObject, "mousedown", function()
		{
			var _scrollTimeout = null;
			
			var _scrollFunction = function()
			{
				if( battlegroundListItemsObject.offsetTop + 6 <= 0 )
				{
					battlegroundListItemsObject.style.top = ( battlegroundListItemsObject.offsetTop + 6 ) + "px";
				}
				else
				{
					battlegroundListItemsObject.style.top = "0px";
				}
				
				_scrollTimeout = setTimeout( _scrollFunction, 100 );
			}
			
			var _scrollRemove = function()
			{
				clearTimeout( _scrollTimeout );
				
				Application.event.remove( document.body, "mouseup", _scrollRemove );
			};
			
			_scrollFunction();
			
			Application.event.add( document.body, "mouseup", _scrollRemove );
		});
		
		// "down" button event
		Application.event.add( battlegroundListControlDownObject, "mousedown", function()
		{
			var _scrollTimeout = null;
			
			var _scrollFunction = function()
			{
				if( battlegroundListItemsObject.offsetTop - 6 > -battlegroundListItemsObject.offsetHeight + battlegroundListItemsContainerObject.offsetHeight )
				{
					battlegroundListItemsObject.style.top = ( battlegroundListItemsObject.offsetTop - 6 ) + "px";
				}
				else
				{
					battlegroundListItemsObject.style.top = ( -battlegroundListItemsObject.offsetHeight + battlegroundListItemsContainerObject.offsetHeight ) + "px";
				}
				
				_scrollTimeout = setTimeout( _scrollFunction, 100 );
			}
			
			var _scrollRemove = function()
			{
				clearTimeout( _scrollTimeout );
				
				Application.event.remove( document.body, "mouseup", _scrollRemove );
			};
			
			_scrollFunction();
			
			Application.event.add( document.body, "mouseup", _scrollRemove );
		});
		
		/*
		// leave battleground button
		Application.event.add( battlegroundLeaveObject, "click",	function()
		{
			
		});
		
		Application.event.add( battlegroundCloseButtonLeaveObject, "click",	function()
		{
			Component.bugcraft.initializedPages.lookingForBattleground = false;
			lookingForBattlegroundPageObject.className = 'hidden';
		});
		*/
		
		var _stopActionBarAnimation = function()
		{
			clearTimeout( _t );
			
			lO.bottomBarMenuItem7OverlayObject.className = "hidden";
		}
		
		var instancePopupObject = {};
		Application.websocket.handlers.inviteToInstance = function( jsonEl, ws )
		{
			Application.websocket.handlers.queueInvitationDeny = function( jsonEl, ws )
			{
				if( instancePopupObject[ jsonEl.zp_id ] )
				{
					instancePopupObject[ jsonEl.zp_id ].remove();
				}
				
				queuedBattlegroundsNumber--;
				
				if( queuedBattlegroundsNumber <= 0 )
				{
					_stopActionBarAnimation();
				}
			};
			
			// show the popup to the user
			instancePopupObject[ jsonEl.zp_id ] = new Component.bugcraft.notificationPopup.inviteToInstance({
																												id: args.id,
																												zoneData: battlegroundsList[ jsonEl.zp_id ],
																												t: jsonEl.t,
																												onAccept: function()
																												{
																													Application.websocket.socket.send( '{"c":"queueInvitationAccept","bid":' + jsonEl.zp_id + '}' );
																												},
																												onDeny: function()
																												{
																													Application.websocket.socket.send( '{"c":"queueInvitationDeny","bid":' + jsonEl.zp_id + '}' );
																												}
																											});
		}
		
		// battlegrounds list
		Application.websocket.handlers.queueBattlegroundsList = function( jsonEl, ws )
		{
			// create individual battleground items
			var _createBattlegroundItem = function( _b, isSelected )
			{
				battlegroundsList[ _b.zp_id ] = _b;
				
				var _showDetails = function()
				{
					for(var i=0;i<lines.length;i++)
					{
						if( lines[ i ] == battlegroundDivObject )
						{
							continue;
						}
						
						lines[ i ].className = "battlegroundListItem";
					}
					
					battlegroundDivObject.className = "battlegroundListItemSelected";
					
					battlegroundSpoilWinGloryObject.innerHTML = _b.zp_reward_win_xp;
					battlegroundSpoilWinPolenObject.innerHTML = _b.zp_reward_win_polen;
					battlegroundSpoilLossGloryObject.innerHTML = _b.zp_reward_loss_xp;
					battlegroundSpoilLossPolenObject.innerHTML = _b.zp_reward_loss_polen;
					battlegroundNameObject.innerHTML = _b.zp_name;
					battlegroundDescriptionObject.innerHTML = _b.zp_description;
					
					battlegroundEnqueueObject.onclick = function()
					{
						Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
						
						if( _b.zp_id == 0 )
						{
							Application.websocket.socket.send( '{"c":"queueJoinRandom"}' );
						}
						else
						{
							Application.websocket.socket.send( '{"c":"queueJoinSpecific", "bid":' + _b.zp_id + '}' );
						}
					}
				}
				
				var battlegroundDivObject = document.createElement("div");
				battlegroundDivObject.className = "battlegroundListItem";
				battlegroundDivObject.innerHTML = _b.zp_name;
				
				battlegroundListItemsObject.appendChild( battlegroundDivObject );
				
				Application.event.add( battlegroundDivObject, "click", _showDetails );
				
				if( isSelected )
				{
					_showDetails();
				}
				
				return battlegroundDivObject;
			}
			
			var lines = [];
			
			for(var i=0;i<jsonEl.b.length;i++)
			{
				lines.push( _createBattlegroundItem( jsonEl.b[ i ], i == 0 ) );
			}
		}
		
		var popupObject = new Component.bugcraft.notificationPopup.yesNoPopup({
																						id: args.id,
																						name: "battlegroundLeave",
																						questionText: "Do you want to leave the battleground?",
																						acceptText: "Leave now",
																						denyText: "Continue playing",
																						onAccept: function()
																						{
																							Application.websocket.socket.send( '{"c":"battlegroundLeave"}' );
																						},
																						onDeny: function()
																						{
																							popupObject.hide();
																						}
																					});
		
		if( Map.mapRules != "battleground" )
		{
			popupObject.hide();
			lookingForBattlegroundPageObject.className = "lookingForBattleground";
			
			Component.bugcraft.scaleWindow( lookingForBattlegroundPageObject );
			
			Application.websocket.socket.send( '{"c":"queueBattlegroundsList"}' );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	