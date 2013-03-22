	
	/*
		bugcraft JS
		
		Th3 3p|( 54g4
	*/
	
	Component.bugcraft = {
		
		componentName: "bugcraft",
		
		currentCharacterBuffs: {},
		currentCharacterBuffObjects: {},
		currentCharacterBuffsHotkeys: [],
		currentCharacterObject: null,
		currentCharacterTarget: null,
		inventorySlots: [],
		
		_instance_tic_interval: null,
		
		initializedPages: {},
		
		npcScript: [],
		
		socketObject: null,
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.bugcraft.create( args[i] );	
			}
		},
		
		// Canvas mesh rendering
		_renderItem: function( args )
		{
			Application.connect.ajax({
										url: "/components/bugcraft/resources/public/items/" + args.itemID + ".json",
										resultType: Application.connect.RESULT_JSON,
										successFunction:	function( jsonEl, jsonText )
																{
																	var _model = new Application.canvas.modelGroup({
																													area: args.area,
																													data: jsonEl.data,
																													fitArea: true
																												});
																	_model.rotateY();
																}
									});
		},
		
		// Progress bar rendering
		_renderProgressBar: function( args )
		{
			if( args.base )
			{
				args.numbersObject.innerHTML = ( args.number - args.base ) + " / " + ( args.total - args.base );
				
				args.fillingObject.style.width = ( ( ( args.numbersObject.parentNode.offsetWidth - 2 * args.endingObject.offsetWidth ) / 100 ) * ( ( args.number - args.base ) / ( ( args.total - args.base ) / 100 ) ) + args.endingObject.offsetWidth ) + "px";
			}
			else
			{
				args.numbersObject.innerHTML = args.number + " / " + args.total;
				
				args.fillingObject.style.width = ( ( ( args.numbersObject.parentNode.offsetWidth - 2 * args.endingObject.offsetWidth ) / 100 ) * ( args.number / ( args.total / 100 ) ) + args.endingObject.offsetWidth ) + "px";
			}
		},
		
		// Progress bar rendering without text
		_renderProgressBarWithText: function( args )
		{
			args.numbersObject.innerHTML = args.text;
			
			args.fillingObject.style.width = ( ( ( args.numbersObject.parentNode.offsetWidth - 2 * args.endingObject.offsetWidth ) / 100 ) * ( args.number / ( args.total / 100 ) ) + args.endingObject.offsetWidth ) + "px";
		},
		
		// Progress bar rendering with text 
		_renderProgressBarStatic: function( args )
		{
			args.numbersObject.innerHTML = args.text;
			
			args.fillingObject.style.width = ( args.numbersObject.parentNode.offsetWidth - args.endingObject.offsetWidth ) + "px";
		},
		
		// position the window relative to the character and target
		positionRelativeWindow: function( windowContainerObject )
		{
			var _cx = Component.bugcraft.currentCharacterObject.characterData.character_zone_x,
				_tx = Component.bugcraft.currentCharacterTarget.characterData.character_zone_x,
				_windowWidth = Application.util.screen.getSize().width, _browserCenterX = _windowWidth / 2,
				_scaleSize = windowContainerObject._scaleSize ? ( Math.sqrt( windowContainerObject._scaleSize ) ) : 1;
			
			if( _cx - _tx > 0 )
			{
				// character is on the right-hand side of the target
				
				if(
					Math.abs( _browserCenterX - _cx ) < Math.abs( _browserCenterX - _tx )
				)
				{
					// character is closer to the center of the screen
					
					windowContainerObject.style.left = Math.max( ( Map.viewPortX + _cx ) * _scaleSize, 0 ) + "px";
				}
				else
				{
					// target is closer to the center of the screen
					
					windowContainerObject.style.left = Math.max( Math.min(
																			( Map.viewPortX + _tx - windowContainerObject.offsetWidth - 80 ) * _scaleSize,
																			( _windowWidth - windowContainerObject.offsetWidth - 80 ) * _scaleSize
																		), 0 ) + "px";
				}
				
				return;
			}
			
			// character is on the left-hand side of the target
			
			if(
				Math.abs( _browserCenterX - _cx ) < Math.abs( _browserCenterX - _tx )
			)
			{
				// character is closer to the center of the screen
				
				windowContainerObject.style.left = Math.min(
																			( Map.viewPortX + _cx - windowContainerObject.offsetWidth - 80 ) * _scaleSize,
																			( _windowWidth - windowContainerObject.offsetWidth - 80 ) * _scaleSize
																		) + "px";
			}
			else
			{
				// target is closer to the center of the screen
				
				windowContainerObject.style.left = Math.max( ( Map.viewPortX + _tx + 100 ) * _scaleSize, 0 ) + "px";
			}
		},
		
		// scale window
		scaleWindow: function( windowContainerObject )
		{
			var _windowHeight = parseInt( Application.util.style.getCurrent( windowContainerObject, "height" ).replace( /px/, "" ) ),
				_lo = Component.bugcraft._layoutObjects,
				_occupiedSpace = _lo.topAreaContainerObject.offsetHeight + _lo.bottomBarObject.offsetHeight - 50,	// the 50 is for the space the leaves are using and some of the top content. it is perceived free space compensation
				_browserWindowSize = Application.util.screen.getSize();
			
			if( _browserWindowSize.height >= _occupiedSpace + _windowHeight )
			{
				// no need to scale
				
				return;
			}
			
			// scale the window
			
			var _scaleSize = ( _browserWindowSize.height - _occupiedSpace ) / _windowHeight;
			
			//windowContainerObject.style.marginTop = _lo.topAreaContainerObject.offsetHeight + "px";
			windowContainerObject.style.transform = 'scale(' + _scaleSize + ')';
			windowContainerObject.style.MozTransform = 'scale(' + _scaleSize + ')';
			windowContainerObject.style.WebkitTransform = 'scale(' + _scaleSize + ')';
			windowContainerObject._scaleSize = _scaleSize;
		},
		
		/*
			Redirects
		*/
		
		redirectToRealmListPage: function()
		{
			// in future versions it should be replaced with a XSL transformation
			document.location.href = 'http://' + Application.configuration.loginURL + '/realmList#noAutoRealmAssign';
		},
		
		redirectToSelectCharacterPage: function()
		{
			// in future versions it should be replaced with a XSL transformation
			document.location.href = 'http://' + Application.configuration.siteURL + '/selectCharacter';
		},
		
		redirectToProfilePage: function()
		{
			// in future versions it should be replaced with a XSL transformation
			document.location.href = 'http://' + Application.configuration.siteURL + '/profile';
		},
		
		redirectToLoginPage: function()
		{
			// in future versions it should be replaced with a XSL transformation
			document.location.href = 'http://' + Application.configuration.loginURL + '/login';
		},
		
		redirectToMainPage: function()
		{
			// in future versions it should be replaced with a XSL transformation
			document.location.href = 'http://' + Application.configuration.siteURL + '/';
		},
		
		enterFullScreen: function( args )
		{
			document.getElementById( args.id + '_chatInput' ).webkitRequestFullScreen();
		},
		
		/*
			Environment initialize
		*/
		
		create: function( args )
		{
			// prevent selection
			document.onselectstart = function()
			{
				return false;
			};
			
			var _positiveAction = 	function()
											{
												// Default layout
												
												var switchCharacterPageObject = document.getElementById( args.id + '_switchCharacterPage' );
												var battlePageObject = document.getElementById( args.id + '_battlePage' );
												var vendorsPageObject = document.getElementById( args.id + '_vendorsPage' );
												var marketPageObject = document.getElementById( args.id + '_marketPage' );
												
												// Top of the page
												//Component.bugcraft.pageTopMenu( args );
												
												if( switchCharacterPageObject )
												{
													Component.bugcraft.pageSwitchCharacter( args );
													
													return;
												}
												
												// attempt to enter full screen mode
												//Component.bugcraft.enterFullScreen( args );
												
												// Show the battle page
												Component.bugcraft.pageBattle( args );
												Component.bugcraft.pageLoader.addPercentage( 10 );
												
												// Show the chat container
												Component.bugcraft.pageChat( args );
												Component.bugcraft.pageLoader.addPercentage( 10 );
												
												// Show the messages container
												Component.bugcraft.messages.init( args );
												Component.bugcraft.pageLoader.addPercentage( 10 );
												
												// Initialize the skins
												Component.bugcraft.skinsStructure.init( args );
												Component.bugcraft.pageLoader.addPercentage( 10 );
												
												// Listen to hotkeys to show various options
												
												var _requestMoveTimeout = null;
												var _handleMove = function( oX, oY )
												{
													if( _requestMoveTimeout )
													{
														return;
													}
													
													var _ccO = Component.bugcraft.currentCharacterObject;
													
													if( !_ccO )
													{
														return;
													}
													
													var _rm = function()
													{
														_ccO.requestMove(
																			_ccO.characterData.character_zone_x + oX,
																			_ccO.characterData.character_zone_y + oY,
																			0
																		);
														
														_requestMoveTimeout = setTimeout( _rm, 333 );
													};
													
													_rm();
												}
												
												Application.event.add( window, "keyup", function( e )
												{
													if( e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 )
													{
														return;
													}
													
													// a movement key is no longer being pressed
													clearTimeout( _requestMoveTimeout );
													_requestMoveTimeout = null;
												});
												
												Application.event.add( window, "keydown", function( e )
												{
													switch( e.keyCode )
													{
														case 38:
															
															// up arrow
															
															_handleMove( 0, -60 );
															
														break;
														case 40:
															
															// down arrow
															
															_handleMove( 0, 60 );
															
														break;
														case 37:
															
															// left arrow
															
															_handleMove( -60, 0 );
															
														break;
														case 39:
															
															// right arrow
															
															_handleMove( 60, 0 );
															
														break;
													}
												});
												
												Application.event.add( window, "keyup",	function( e )
												{
													// hotkeys binding
													
													switch( e.keyCode )
													{
														case 27:
															
															// escape
															
															Component.bugcraft.pageSettings( args );
															
														break;
														case 13:
															
															// enter
															
															Component.bugcraft.pageChatFocusOnTextfield();
															
														break;
														case 191:
															
															// /
															
															Component.bugcraft.pageChatFocusOnTextfield( "/" );
															
														break;
														case 67:
															
															// c
															
															Component.bugcraft.pageProfile( args );
															
														break;
														case 86:
															
															// v
															
															Component.bugcraft.pageVendor( null, { id: args.id, isAmberStore: true } ); 
															
														break;
														case 77:
															
															// m
															
															Component.bugcraft.pageMarket( args );
															
														break;
														case 81:
															
															// q
															
															Component.bugcraft.pageQuestLog( args );
															
														break;
														case 83:
															
															// s
															
															Component.bugcraft.pageSpellBook( args );
															
														break;
														case 84:
															
															// t
															
															Component.bugcraft.pageTalentTree( args );
															
														break;
														case 71:
															
															// g
															
															Component.bugcraft.pageLookingForBattleground( args );
															
														break;
														case 66:
															
															// b
															
															Component.bugcraft.pageBags( args );
															
														break;
														case 65:
															
															// a
															
															Component.bugcraft.pageAchievementLog( args );
															
														break;
														default:
															
													}
												});
											};
			
			var checkForMapLink = function()
			{
				var results =  ( new RegExp( "[\\?&]map=([^&#]*)" ).exec( window.location.href ) );

				if( results == null )
				{
					return false;
				}
				
				Application.websocket.socket.send( '{"c":"joinMapEditorMap", "bid": ' + results[ 1 ] + ' }' )
			}
			
			checkForMapLink();
			
			//
			// check if we have a valid user ID in the session
			//
			
			if( !Application.sessionData.userID )
			{
				// no currently logged in user
				
				Component.bugcraft.redirectToLoginPage();
				
				return;
			}
			
			//
			// check if we have a valid character ID in the session
			//
			
			if(
				!Application.sessionData.characterID ||
				Application.util.urlInformation.page == "selectCharacter"
			)
			{
				if( Application.util.urlInformation.page != "selectCharacter" )
				{
					Component.bugcraft.redirectToSelectCharacterPage();
				}
				else
				{
					Component.bugcraft.pageSelectCharacter( args );
				}
				
				return;
			}
			
			//
			// we have an authenticated user who wants to enter the game
			//
			
			/*
			Application.event.add( window, "unload", 	function()
																				{
																					Application.websocket.socket.send( '{"c":"characterInactive"}' );
																				});
			
			Application.websocket.handlers.characterActive = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					Application.debug.add( "character get error: " + jsonEl.r );
					
					return;
				}
				
				Component.bugcraft.currentCharacterData = jsonEl.characterData;
				
				_positiveAction();
			}
			
			Application.websocket.socket.send( '{"c":"characterActive"}' );
			*/
			
			Component.bugcraft.pageLoader.init( args );
			
			Application.websocket.handlers.updateQueueMembers = function( jsonEl, ws )
			{
				// dummy function until we're ready for processing
			}
			
			Application.websocket.handlers.updateBattleField = function( jsonEl, ws )
			{
				// dummy function until we're ready for processing
			}
			
			Application.websocket.handlers.disconnectCharacter = function( jsonEl, ws )
			{
				Component.bugcraft.redirectToSelectCharacterPage();
			}
			
			// delay the next action in order that it does not intervene with the UI refresh
			setTimeout( function()
			{
				_positiveAction();
			}, 10 );
		},
		
		/*
			Notification popup
		*/
		
		notificationPopup:
		{
			_popups: {},
			
			disconnectCountdown: function( args )
			{
				var popupNotificationAreaObject = document.getElementById( args.id + '_popupNotificationArea' ), _secTimeout = Math.floor( args.timeoutMiliseconds / 1000 ), _t = null, self = this;
				
				this.isVisible = true;
				
				this.show = function()
				{
					self.isVisible = true;
					
					notificationDivObject.className = "battlegroundNotificationArea";
				}
				
				this.hide = function()
				{
					self.isVisible = false;
					
					notificationDivObject.className = "hidden";
				}
				
				this.remove = function()
				{
					self.hide();
					
					clearTimeout( _t );
					
					Application.util.html.removeNode( notificationDivObject );
				}
				
				// container
				var notificationDivObject = document.createElement("div");
				notificationDivObject.className = "battlegroundNotificationArea";
				
				// text
				var notificationTextObject = document.createElement("span");
				notificationDivObject.appendChild( notificationTextObject );
				
				// accept button
				var cancelButton = document.createElement("div");
				cancelButton.className = "buttonDeny";
				cancelButton.innerHTML = args.cancelLogoutText;
				notificationDivObject.appendChild( cancelButton );
				
				popupNotificationAreaObject.appendChild( notificationDivObject );
				
				Application.event.add( cancelButton, "click", function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					args.onCancel();
				});
				
				var _textFunction = function()
				{
					notificationTextObject.innerHTML = "<div class='battlegroundNotificationText'>" + args.notificationText.replace( "[seconds]", _secTimeout-- ) + "</div>";
					
					_t = setTimeout( _textFunction, 1000 );
				};
				
				_textFunction();
			},
			
			yesNoPopup: function( args )
			{
				var popupNotificationAreaObject = document.getElementById( args.id + '_popupNotificationArea' ), self = this;
				
				Component.bugcraft.notificationPopup._popups[ args.name ] = self;
				
				this.isVisible = true;
				
				this.show = function()
				{
					self.isVisible = true;
					
					notificationDivObject.className = "battlegroundNotificationArea";
				}
				
				this.hide = function()
				{
					self.isVisible = false;
					
					notificationDivObject.className = "hidden";
				}
				
				this.remove = function()
				{
					self.hide();
					
					Application.util.html.removeNode( notificationDivObject );
				}
				
				// container
				var notificationDivObject = document.createElement("div");
				notificationDivObject.className = "battlegroundNotificationArea";
				notificationDivObject.innerHTML = "<div class='battlegroundNotificationText'>" + args.questionText + "</div>";
				
				// accept button
				var battlegroundAcceptButton = document.createElement("div");
				battlegroundAcceptButton.className = "buttonAccept";
				battlegroundAcceptButton.innerHTML = args.acceptText;
				notificationDivObject.appendChild( battlegroundAcceptButton );
				
				// deny button
				var battlegroundDenyButton = document.createElement("div");
				battlegroundDenyButton.className = "buttonDeny";
				battlegroundDenyButton.innerHTML = args.denyText;
				notificationDivObject.appendChild( battlegroundDenyButton );
				
				Application.event.add( battlegroundAcceptButton, "click", function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					args.onAccept();
				});
				
				Application.event.add( battlegroundDenyButton, "click", function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					args.onDeny();
				});
				
				popupNotificationAreaObject.appendChild( notificationDivObject );
			},
			
			inviteToInstance: function( args )
			{
				var popupNotificationAreaObject = document.getElementById( args.id + '_popupNotificationArea' ), _t = null, self = this;
				
				this.hide = function()
				{
					notificationDivObject.className = "hidden";
				}
				
				this.remove = function()
				{
					clearTimeout( _t );
					
					Application.util.html.removeNode( notificationDivObject );
				}
				
				// container
				var notificationDivObject = document.createElement("div");
				notificationDivObject.className = "battlegroundNotificationArea";
				notificationDivObject.innerHTML = "<div class='battlegroundNotificationText'>You are now ready to join " + args.zoneData.zp_name + "!</div>";
				
				// accept button
				var battlegroundAcceptButton = document.createElement("div");
				battlegroundAcceptButton.className = "buttonAccept";
				battlegroundAcceptButton.innerHTML = "Enter now";
				notificationDivObject.appendChild( battlegroundAcceptButton );
				
				// deny button
				var battlegroundDenyButton = document.createElement("div");
				battlegroundDenyButton.className = "buttonDeny";
				notificationDivObject.appendChild( battlegroundDenyButton );
				
				var _timeoutUpdate = function()
				{
					battlegroundDenyButton.innerHTML = "Leave Queue ( " + ( --args.t ) + " )";
					
					if( args.t <= 0 )
					{
						return;
					}
					
					_t = setTimeout( _timeoutUpdate, 1000 );
				}
				
				_timeoutUpdate();
				
				Application.event.add( battlegroundAcceptButton, "click", function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					args.onAccept();
				});
				
				Application.event.add( battlegroundDenyButton, "click", function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					args.onDeny();
				});
				
				popupNotificationAreaObject.appendChild( notificationDivObject );
			}
		},
		
		/*
			Top menu
		*/
		
		pageTopMenu: function( args )
		{
			var topMenuLinkObject = document.getElementById( args.id + '_topMenuLink' );
			var switchCharacterLinkObject = document.getElementById( args.id + '_switchCharacterLink' );
			var topMenuObject = document.getElementById( args.id + '_topMenu' );
			
			switchCharacterLinkObject.onclick = function()
			{
				var _dc = new Component.bugcraft.notificationPopup.disconnectCountdown({
																																	id: args.id
																																});
				
				Application.websocket.handlers.cancelDisconnect = function( jsonEl, ws )
				{
					_dc.hide();
				}
				
				Application.websocket.socket.send( '{"c":"characterDisconnect"}' );
			}
			
			topMenuLinkObject.onclick = 	function( e )
															{
																e = e ? e : window.event;
																
																topMenuObject.className = "menu";
																topMenuLinkObject.className = "menuLink hidden";
																
																e.cancelBubble = true;
																
																Application.event.add( document.body, "click", _click );
																Application.event.add( document.body, "contextmenu", _click );
															};
			
			var _click =	function()
								{
									topMenuObject.className = "menu hidden";
									topMenuLinkObject.className = "menuLink";
									
									Application.event.remove( document.body, "click", _click );
									Application.event.remove( document.body, "contextmenu", _click );
								};
		},
		
		/*
			Pages
		*/
		
		pageVendors: function( args )
		{
			
		},
		
		pageMarket: function( args )
		{
			
		},
		
		/*
			Battle
		*/
		pageBattle: function( args )
		{
			
		},
		
		pageJourney: function( args )
		{
			
		},
		
		pageLogin: function( args )
		{
			
		},
		
		populateInventory: function( args )
		{
			// Inventory slot methods definer
			var setSlotMethods = 	function( slotObject )
												{
													slotObject.attachedLootObject = null;
													slotObject.lastAttachedLootObject = null;
													slotObject.classSelected = slotObject.getAttribute("classSelected");
													slotObject.classNotSelected = slotObject.getAttribute("classNotSelected");
													slotObject.slotType = slotObject.getAttribute("slotType");
													
													slotObject.swapItemWith = function( targetSlot )
																								{
																									if( targetSlot.extraArea == false && slotObject.extraArea == false)
																									{
																										Application.connect.ajax({
																																		url: "component.php",
																																		vars:
																																		{
																																			component: "bugcraft",
																																			event: "itemSwap",
																																			sourceBag: slotObject.bag_slot_number,
																																			sourceSlot: slotObject.bag_slot_order,
																																			targetBag: targetSlot.bag_slot_number,
																																			targetSlot: targetSlot.bag_slot_order
																																		},
																																		successFunction: function( jsonEl )
																																		{
																																			var result = jsonEl.content["@attributes"].databaseResult;
																																			
																																			if( result != 200)
																																			{
																																				Application.debug.addError( "Database swap item error: " + result );
																																				
																																				return;
																																			}
																																			
																																			targetSlot.setLoot({
																																									lootObject: slotObject.attachedLootObject
																																								});
																																			
																																			slotObject.setLoot({
																																									lootObject: targetSlot.lastAttachedLootObject
																																								});
																																		}
																																	});
																									}
																									else
																									{
																										targetSlot.setLoot({
																																lootObject: slotObject.attachedLootObject
																															});
																																			
																										slotObject.setLoot({
																																lootObject: targetSlot.lastAttachedLootObject
																															});
																									}
																								}
													
													slotObject.removeLoot = 	function()
																								{
																									
																									slotObject.lastAttachedLootObject = slotObject.attachedLootObject;
																									slotObject.attachedLootObject = null;
																									
																									
																									// Remove this node
																									if( slotObject.removeNode )
																									{
																										slotObject.childNodes[0].removeNode( true );
																									}
																									else if( slotObject.childNodes.length == 1 )
																									{
																										slotObject.removeChild(
																																	slotObject.childNodes[0]
																																);
																									}
																									
																									slotObject.className = slotObject.classNotSelected;
																								}
													
													slotObject.setLoot = 	function( args )
																						{
																							if( args.lootObject == null )
																							{
																								slotObject.removeLoot();
																								
																								return false;
																							}
																							
																							if( slotObject.attachedLootObject != null )
																							{
																								slotObject.removeLoot();
																							}
																							else
																							{
																								slotObject.lastAttachedLootObject = null;
																							}
																							
																							slotObject.attachedLootObject = args.lootObject;
																							
																							slotObject.className = slotObject.classSelected;
																							slotObject.loot_type = args.lootObject.loot_type;
																							
																							var objectImage = document.createElement("img");
																							objectImage.src = "/components/bugcraft/resources/public/items/" + ( args.lootObject.loot_id ) + "_inventory_" + slotObject.slotType + ".png";
																							slotObject.appendChild( objectImage );
																							
																							// Movement events
																							objectImage.onmousedown = Component.bugcraft._dragFunction;
																							// iX devices
																							Application.event.add( objectImage, "touchstart", 	function( e )
																																											{
																																												_dragFunction( e.touches[0] );
																																											});
																							
																							return true;
																						}
												}
			
			Application.connect.ajax({
											url: args.path + Component.bugcraft.currentCharacterData.character_id,
											successFunction: function( jsonEl )
											{
												var items = jsonEl.content.item;
												
												for(var i=0;i<items.length;i++)
												{
													var item = items[i]["@attributes"];
													
													// Set Item properties
													item.loot_type = parseInt( item.loot_type );
													
													// Set slot properties
													var slotObject = document.getElementById( args.id + "_item_" + item.ci_slot_bag + "_" + item.ci_slot_order );
													slotObject.position = Application.util.style.getPos( slotObject );
													slotObject.bag_slot_number = item.ci_slot_bag;
													slotObject.bag_slot_order = item.ci_slot_order;
													slotObject.bag_slot_accept = parseInt( item.ci_slot_accept );
													slotObject.extraArea = false;
													
													Component.bugcraft.inventorySlots[ i ] = slotObject;
													
													setSlotMethods( slotObject );
													
													if( item.loot_id.length > 0 )
													{
														slotObject.setLoot({
																				lootObject: item,
																				updateDB: false
																			});
													}
													
													
													/*
													Component.bugcraft._renderItem({
																								area: canvasObject,
																								itemID: items[i]["@attributes"].loot_id
																							});
													*/
												}
												
												if( args.extraArea )
												{
													for( var i = 0; i < args.extraArea.length; i++ )
													{
														var slotObject = document.getElementById( args.id + "_" + args.extraArea[i] );
														slotObject.position = Application.util.style.getPos( slotObject );
														slotObject.bag_slot_number = 1;
														slotObject.bag_slot_order = i;
														slotObject.bag_slot_accept = 127;
														slotObject.extraArea = true;
														
														Component.bugcraft.inventorySlots[ Component.bugcraft.inventorySlots.length ] = slotObject;
														setSlotMethods( slotObject );
													}
													
												}
											}
										});
			
		},
		
		// General profile information
		populateProfileTab: function( args )
		{
			var avatarObject = document.getElementById( args.id + "_avatar" );
			
			var happiness = parseInt( Component.bugcraft.currentCharacterData.character_happiness );
			
			avatarObject.className = "avatar avatar_" + Component.bugcraft.currentCharacterData.character_race + "_" + ( ( happiness < 100 ) ? "sad" : ( ( happiness < 200 ) ? "neutral" : "happy" ) );
		}
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	