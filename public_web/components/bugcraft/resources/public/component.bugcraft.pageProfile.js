	
	/*
		Profile page
	*/
	
	Component.bugcraft.pageProfile = function( args )
	{
		var profilePageObject = document.getElementById( args.id + '_profilePage' );
		
		// ensure this code is run only once
		if( typeof Component.bugcraft.initializedPages.pageProfile != "undefined" )
		{
			Component.bugcraft.initializedPages.pageProfile = !Component.bugcraft.initializedPages.pageProfile;
			profilePageObject.className = ( profilePageObject.className == "hidden" ) ? "pageProfile" : "hidden";
			
			if( !Component.bugcraft.initializedPages.pageProfile )
			{
				Component.bugcraft.scaleWindow( profilePageObject );
				Component.bugcraft.sound.ui.playEvent( "window", "characterProfile" );
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			Component.bugcraft.pageProfileSetAttributes();
			
			return;
		}
		
		if( !args.hidden )
		{
			profilePageObject.className = "pageProfile";
			Component.bugcraft.sound.ui.playEvent( "window", "characterProfile" );
		}
		
		Component.bugcraft.initializedPages.pageProfile = true;
		
		//
		// Define internal variables
		//
		
		var _ccd = Component.bugcraft.currentCharacterObject.characterData, _inventorySlots = [], _equipedItemsLevelSum = 0, _equipedItems = 0,
			profileCloseButtonObject = document.getElementById( args.id + '_profileCloseButton' ),
			profileAvatarObject = document.getElementById( args.id + '_profileAvatar' ),
			attributeHappinessObject = document.getElementById( args.id + '_profileAttribute_Happiness' ),
			attributeHitPointsObject = document.getElementById( args.id + '_profileAttribute_HitPoints' ),
			attributeStrengthObject = document.getElementById( args.id + '_profileAttribute_Strength' ),
			attributePotencyObject = document.getElementById( args.id + '_profileAttribute_Potency' ),
			attributeAverageItemLevelObject = document.getElementById( args.id + '_profileAttribute_AverageItemLevel' ),
			attributeAttackObject = document.getElementById( args.id + '_profileAttribute_Attack' ),
			attributeMainHandWeaponDamageContainerObject = document.getElementById( args.id + '_profileAttribute_OffHandWeaponDamageContainer' ),
			attributeMainHandWeaponDamageObject = document.getElementById( args.id + '_profileAttribute_MainHandWeaponDamage' ),
			attributeOffHandWeaponDamageObject = document.getElementById( args.id + '_profileAttribute_OffHandWeaponDamage' ),
			attributeHitChanceObject = document.getElementById( args.id + '_profileAttribute_HitChance' ),
			attributeCritChanceObject = document.getElementById( args.id + '_profileAttribute_CritChance' ),
			attributeArmorObject = document.getElementById( args.id + '_profileAttribute_Armor' ),
			attributeDefenseObject = document.getElementById( args.id + '_profileAttribute_Defense' ),
			attributeResistanceObject = document.getElementById( args.id + '_profileAttribute_Resistance' ),
			profileCharacterNameObject = document.getElementById( args.id + '_profileCharacterName' );
		
		// generic slot
		var slotObject = function( slotData )
		{
			var self = this, _tooltipObject = null;
			
			this.slotHTMLObject = document.getElementById( args.id + "_inventoryItem_" + slotData.ci_slot_bag + "_" + slotData.ci_slot_order );
			//this.position = Application.util.style.getPos( self.slotHTMLObject );
			this.bag_slot_number = slotData.ci_slot_bag;
			this.bag_slot_order = slotData.ci_slot_order;
			this.bag_slot_accept = slotData.ci_slot_accept_binary;
			this.attachedLootObject = null;
			this.lastAttachedLootObject = null;
			this.classSelected = self.slotHTMLObject.getAttribute("classSelected");
			this.classNotSelected = self.slotHTMLObject.getAttribute("classNotSelected");
			this.classDisabled = self.slotHTMLObject.getAttribute("classDisabled");
			this.slotType = self.slotHTMLObject.getAttribute("slotType");
			this.isEquipable = true;
			
			// Item drag definer
			var _dragFunction = function( e )
			{
				var e  = e ? e : window.event, objectImageClone = document.createElement("img");
				
				// create the object that will be seen as being dragged
				objectImageClone.src = self.slotHTMLObject.childNodes[0].src;
				objectImageClone.className = "inventoryDraggedItem";
				
				document.body.appendChild( objectImageClone );
				
				objectImageClone.style.left = ( ( e.pageX ? e.pageX : e.clientX ) + ( ( window.pageXOffset && Application.util.browserInformation.browser != "Firefox" ) ? window.pageXOffset : ( document.body.scrollLeft - document.body.clientLeft ) ) ) + "px";
				objectImageClone.style.top = ( ( e.pageY ? e.pageY : e.clientY ) + ( ( window.pageYOffset && Application.util.browserInformation.browser != "Firefox" ) ? window.pageYOffset : ( document.body.scrollTop - document.body.clientTop ) ) ) + "px";
				
				// recalculate the slots positions, in case the window has been dragged in the mean time
				for(var i=0;i<_inventorySlots.length;i++)
				{
					var _is = _inventorySlots[ i ];
					
					_is.position = Application.util.style.getPos( _is.slotHTMLObject );
				}
				
				// initial placement function
				var _positioningFunction = function()
				{
					if( objectImageClone.offsetWidth == 0 || objectImageClone.offsetHeight == 0 )
					{
						return false;
					}
					
					clearTimeout( _imageLoadPointer );
					
					// Image has been loaded
					
					objectImageClone.style.left = ( ( e.pageX ? e.pageX : e.clientX ) - ( objectImageClone.offsetWidth / 2 ) + ( ( window.pageXOffset && Application.util.browserInformation.browser != "Firefox" ) ? window.pageXOffset : ( document.body.scrollLeft - document.body.clientLeft ) ) ) + "px";
					objectImageClone.style.top = ( ( e.pageY ? e.pageY : e.clientY ) - ( objectImageClone.offsetHeight / 2 ) + ( ( window.pageYOffset && Application.util.browserInformation.browser != "Firefox" ) ? window.pageYOffset : ( document.body.scrollTop - document.body.clientTop ) ) ) + "px";
					
					self.slotHTMLObject.childNodes[ 0 ].className = "invisible";
					
					// Movement Functions
					var _moveX = 0, _moveY = 0, _lastMarkedSlot = null, _markedHoverFunctionTimeout = null;
					
					if( Application.util.browserInformation.browser == "Explorer" )
					{
						var _mouseMove =	function()
						{
							_moveX = window.event.x + document.body.scrollLeft - document.body.clientLeft;
							_moveY = window.event.y + document.body.scrollTop - document.body.clientTop;
						}
					}
					else
					{
						var _mouseMove =	function( e )
						{
							_moveX = e.clientX + window.pageXOffset;
							_moveY = e.clientY + window.pageYOffset;
						}
					}
					
					// Check periodically the moving item coordinates
					var _markedHoverFunction = function()
					{
						// function will check if the current item matches the slot i'm hovering
						
						for(var i=0;i<_inventorySlots.length;i++)
						{
							var _is = _inventorySlots[ i ];
							
							if(
								_moveX < _is.position.left
								|| _moveX > _is.position.left + objectImageClone.offsetWidth
								|| _moveY < _is.position.top
								|| _moveY > _is.position.top + objectImageClone.offsetHeight
							)
							{
								// i'm outside this slot
								
								continue;
							}
							
							// hovering over slot
							
							if( _lastMarkedSlot != null && _lastMarkedSlot.attachedLootObject == null )
							{
								// mark previous hovered slot as not selected if it does not hold an item
								
								_lastMarkedSlot.slotHTMLObject.className = _lastMarkedSlot.classNotSelected;
							}
							
							if(
								( self.attachedLootObject.loot_type_binary & _is.bag_slot_accept ) == 0
								||
								(
									_is.bag_slot_number == 1
									&& _is.bag_slot_order == 2																	// hovering over the mainhand slot
									&& self.attachedLootObject.loot_armor_type.toString().indexOf( "2h" ) > -1	// moving a 2 hander over it
									&& _inventorySlots[ 2 ].attachedLootObject != null									// offhand is equiped
								)
								||
								(
									_is.bag_slot_number == 1
									&& _is.bag_slot_order == 3																						// hovering over the offhand slot
									&& _inventorySlots[ 1 ].attachedLootObject != null														// mainhand is equiped
									&& _inventorySlots[ 1 ].attachedLootObject.loot_armor_type.toString().indexOf( "2h" ) > -1	// mainhand has a 2 hander
								)
							)
							{
								// not a compatible slot
								
								continue;
							}
							
							if( self.isEquipable == false && _is.bag_slot_number == 1 )
							{
								// cannot equip item
								
								continue;
							}
							
							// mark slot as a possible drop zone
							
							_lastMarkedSlot = _is;
							
							_is.slotHTMLObject.className = ( _is.isEquipable ? _is.classSelected : _is.classDisabled );
							
							break;
						}
						
						_markedHoverFunctionTimeout = setTimeout( _markedHoverFunction, 100 );
					}
					
					_markedHoverFunction();
					
					// Start the drag
					Application.effects.drag.attach({
															object: objectImageClone,
															eventObject: e,
															onmousemove: _mouseMove,
															onmouseup: function( e )
															{
																clearTimeout( _markedHoverFunctionTimeout );
																
																var draggedOverASlot = false,
																	x = ( e.x ? ( window.event.x + document.body.scrollLeft - document.body.clientLeft ) : ( e.clientX + window.pageXOffset ) ),
																	y = ( e.y ? ( window.event.y + document.body.scrollTop - document.body.clientTop ) : ( e.clientY + window.pageYOffset ) );
																
																// Inventory
																for(var i=0;i<_inventorySlots.length;i++)
																{
																	var _is = _inventorySlots[ i ];
																	
																	if(
																		_is.position.left > x
																		|| x > _is.position.left + objectImageClone.offsetWidth
																		|| _is.position.top > y
																		|| y > _is.position.top + objectImageClone.offsetHeight
																	)
																	{
																		
																		continue;
																	}
																	
																	// Released over an area
																	
																	if(
																		self.attachedLootObject != null
																		&& ( self.attachedLootObject.loot_type_binary & _is.bag_slot_accept ) == 0
																	)
																	{
																		// The target slot does not accept the item type
																		
																		Component.bugcraft.messages.addError( "That item type cannot be put there" );
																		
																		Component.bugcraft.sound.characters.playMainVoice( "wrongSlot" );
																		
																		break;
																	}
																	else if(
																		_is.attachedLootObject != null
																		&& ( _is.attachedLootObject.loot_type_binary & self.bag_slot_accept ) == 0
																	)
																	{
																		// Source slot does not accept target item type
																		
																		Component.bugcraft.messages.addError( "That item type cannot be put there" );
																		
																		Component.bugcraft.sound.characters.playMainVoice( "wrongSlot" );
																		
																		break;
																	}
																	
																	if( self.isEquipable == false && _is.bag_slot_number == 1 )
																	{
																		// cannot equip item
																		
																		Component.bugcraft.messages.addError( "Cannot equip that" );
																		
																		Component.bugcraft.sound.characters.playMainVoice( "cannotDoThat" );
																		
																		break;
																	}
																	
																	if(
																		(
																			_is.bag_slot_number == 1
																			&& _is.bag_slot_order == 2																	// placing over the mainhand slot
																			&& self.attachedLootObject.loot_armor_type.toString().indexOf( "2h" ) > -1	// moving a 2 hander over it
																			&& _inventorySlots[ 2 ].attachedLootObject != null									// offhand is equiped
																		)
																		||
																		(
																			_is.bag_slot_number == 1
																			&& _is.bag_slot_order == 3																						// placing over the offhand slot
																			&& _inventorySlots[ 1 ].attachedLootObject != null														// mainhand is equiped
																			&& _inventorySlots[ 1 ].attachedLootObject.loot_armor_type.toString().indexOf( "2h" ) > -1	// mainhand has a 2 hander
																		)
																	)
																	{
																		// prevent illegal placements
																		
																		Component.bugcraft.messages.addError( "Cannot equip that item in this slot" );
																		
																		Component.bugcraft.sound.characters.playMainVoice( "need2hands" );
																		
																		continue;
																	}
																	
																	if(
																		self.bag_slot_number == _is.bag_slot_number &&
																		self.bag_slot_order == _is.bag_slot_order
																	)
																	{
																		// The same object ID is already in that area
																		
																		break;
																	}
																	
																	draggedOverASlot = true;
																	
																	if(
																		_is.attachedLootObject != null 															// target contains an object
																		&& _is.attachedLootObject.loot_id == self.attachedLootObject.loot_id		// same object exists
																		&& _is.attachedLootObject.loot_max_per_slot > _is.attachedLootObject.ci_loot_amount	// target has less than max items of this type in the slot
																	)
																	{
																		// merge
																		
																		self.mergeItemWith( _is );
																	}
																	else
																	{
																		// swap
																		
																		self.swapItemWith( _is );
																	}
																	
																	break;
																}
																
																if( draggedOverASlot == false )
																{
																	// dragged outside any slot
																	
																	self.slotHTMLObject.childNodes[ 0 ].className = "visible";
																}
																
																// remove the temporary "dragable" item
																Application.util.html.removeNode( objectImageClone );
															}
													});
				}
				
				var _imageLoadPointer = setTimeout( _positioningFunction, 50 );
				_positioningFunction();
				
				return false;
			}
			
			// this function will merge the current slot's item with the target slot's item
			this.mergeItemWith = function( targetSlot )
			{
				Application.websocket.handlers.characterInventoryItemMerge = function( jsonEl, ws )
				{
					if( jsonEl.r != 200)
					{
						Application.debug.addError( "Merge item error: " + jsonEl.r );
						
						return;
					}
					
					// remove the loot from the targeted slots
					targetSlot.removeLoot();
					self.removeLoot();
					
					// set the loot
					var sourceLoot = jsonEl.l[ ( jsonEl.l[0].ci_slot_bag == self.bag_slot_number && jsonEl.l[0].ci_slot_order == self.bag_slot_order ) ? 0 : 1 ];
					
					// the source slot may be empty after the merger
					if( sourceLoot.loot_id != null )
					{
						Component.bugcraft.sound.ui.playEvent( "actionBar", "backpack" + ( ( sourceLoot.loot_armor_type != null ) ? ( sourceLoot.loot_armor_type[ 0 ].toUpperCase() + sourceLoot.loot_armor_type.substring( 1 ) ) : "Misc" ) + "Pickup" );
						
						self.setLoot({
									lootObject: sourceLoot
								});
					}
					
					var targetLoot = jsonEl.l[ ( sourceLoot == 0 ) ? 1 : 0 ];
					Component.bugcraft.sound.ui.playEvent( "actionBar", "backpack" + ( ( targetLoot.loot_armor_type != null ) ? ( targetLoot.loot_armor_type[ 0 ].toUpperCase() + targetLoot.loot_armor_type.substring( 1 ) ) : "Misc" ) + "Pickup" );
					
					targetSlot.setLoot({
										lootObject: targetLoot
									});
				}
				
				Application.websocket.socket.send( '{"c":"characterInventoryItemMerge","sourceBag":' + self.bag_slot_number + ',"sourceSlot":' + self.bag_slot_order + ',"targetBag":' + targetSlot.bag_slot_number + ',"targetSlot":' + targetSlot.bag_slot_order + '}' );
			}
			
			// this function will swap the current slot's item with the target slot's item
			this.swapItemWith = function( targetSlot )
			{
				Application.websocket.handlers.characterInventoryItemSwap = function( jsonEl, ws )
				{
					if( jsonEl.r != 200)
					{
						Application.debug.addError( "Swap item error: " + jsonEl.r );
						
						return;
					}
					
					// play the associated sounds
					if( self.attachedLootObject != null )
					{
						Component.bugcraft.sound.ui.playEvent( "actionBar", "backpack" + ( ( self.attachedLootObject.loot_armor_type != null ) ? ( self.attachedLootObject.loot_armor_type[ 0 ].toUpperCase() + self.attachedLootObject.loot_armor_type.substring( 1 ) ) : "Misc" ) + "Pickup" );
					}
					
					// play the associated sounds
					if( targetSlot.lastAttachedLootObject != null )
					{
						Component.bugcraft.sound.ui.playEvent( "actionBar", "backpack" + ( ( targetSlot.lastAttachedLootObject.loot_armor_type != null ) ? ( targetSlot.lastAttachedLootObject.loot_armor_type[ 0 ].toUpperCase() + targetSlot.lastAttachedLootObject.loot_armor_type.substring( 1 ) ) : "Misc" ) + "Pickup" );
					}
					
					targetSlot.setLoot({
										lootObject: self.attachedLootObject
									});
					
					self.setLoot({
								lootObject: targetSlot.lastAttachedLootObject
							});
				}
				
				Application.websocket.socket.send( '{"c":"characterInventoryItemSwap","sourceBag":' + self.bag_slot_number + ',"sourceSlot":' + self.bag_slot_order + ',"targetBag":' + targetSlot.bag_slot_number + ',"targetSlot":' + targetSlot.bag_slot_order + '}' );
			}
			
			// this function will remove the loot from the current slot
			this.removeLoot = function()
			{
				if( self.bag_slot_number == 1 )
				{
					// this is an equiped item
					
					_equipedItems--;
					_equipedItemsLevelSum -= self.attachedLootObject.loot_level;
					
					Component.bugcraft.pageProfileSetAttributes();
				}
				
				self.lastAttachedLootObject = self.attachedLootObject;
				self.attachedLootObject = null;
				
				// remove the node's children
				while( self.slotHTMLObject.childNodes.length )
				{
					Application.util.html.removeNode( self.slotHTMLObject.childNodes[ 0 ] );
				}
				
				_tooltipObject.remove();
				
				// change the design
				self.slotHTMLObject.className = self.classNotSelected;
			}
			
			// this function will set the loot for the current slot
			this.setLoot = function( lootArgs )
			{
				if( lootArgs.lootObject == null )
				{
					self.removeLoot();
					
					return false;
				}
				
				if( self.attachedLootObject != null )
				{
					self.removeLoot();
				}
				else
				{
					self.lastAttachedLootObject = null;
				}
				
				// set metadata
				
				self.attachedLootObject = lootArgs.lootObject;
				self.loot_type = lootArgs.lootObject.loot_type;
				
				if( self.bag_slot_number == 1 )
				{
					// this is an equiped item
					
					_equipedItems++;
					_equipedItemsLevelSum += self.attachedLootObject.loot_level;
					
					Component.bugcraft.pageProfileSetAttributes();
				}
				
				// perform design changes
				
				if(
					lootArgs.lootObject.loot_level_required <= _ccd.character_level
					&& lootArgs.lootObject.loot_happiness_required <= _ccd.character_happiness
					&& ( lootArgs.lootObject.loot_armor_type == null || ( lootArgs.lootObject.loot_armor_type != null && _ccd.character_armor_accepted.toString().split( "," ).indexOf( lootArgs.lootObject.loot_armor_type ) > -1 ) )
				)
				{
					self.isEquipable = true;
					self.slotHTMLObject.className = self.classSelected;
				}
				else
				{
					self.isEquipable = false;
					self.slotHTMLObject.className = self.classDisabled;	
				}
				
				var objectImage = document.createElement("img");
				objectImage.src = Application.configuration.cdn.location[ 0 ].url + "/item_skins/" + lootArgs.lootObject.loot_id + "/" + lootArgs.lootObject.loot_id + "_" + ( ( self.bag_slot_number == 1 ) ? '64x64' : '48x48' ) + ".png";
				self.slotHTMLObject.appendChild( objectImage );
				
				if( lootArgs.lootObject.ci_loot_amount > 1 )
				{
					var objectAmount = document.createElement("div");
					objectAmount.className = "slotItemAmount";
					objectAmount.innerHTML = lootArgs.lootObject.ci_loot_amount;
					
					self.slotHTMLObject.appendChild( objectAmount );
				}
				
				// set the tooltip
				( _tooltipObject = new Component.bugcraft.tooltip.item( self.slotHTMLObject, lootArgs.lootObject ) ).enable();
				
				// Movement events
				objectImage.onmousedown = function( e )
				{
					e.cancelBubble = true;
					
					if( e.button != 0 )
					{
						// pressed anything else but left button
						
						return false;
					}
					
					e.preventDefault();
					
					if( e.shiftKey )
					{
						// link object in chat
						
						Component.bugcraft.pageChatInsertObjectInInput({
																						objectName: lootArgs.lootObject.loot_name,
																						objectType: "item" + lootArgs.lootObject.loot_rarity,
																						objectID: lootArgs.lootObject.loot_id
																					});
						
						return false;
					}
					
					return _dragFunction( e );
				}
				
				// Right click - sell item
				objectImage.oncontextmenu = function( e )
				{
					e.cancelBubble = true;
					
					if( self.bag_slot_number == 1 )
					{
						// cannot sell directly from the "equipped" bag
						
						return false;
					}
					
					if( !Component.bugcraft.initializedPages.vendor )
					{
						return false;
					}
					
					// vendor available
					
					Application.websocket.handlers.characterInventoryItemSell = function( jsonEl, ws )
					{
						if( jsonEl.r != 200)
						{
							Application.debug.addError( "Sell item error: " + jsonEl.r );
							
							return;
						}
						
						self.removeLoot();
						
						Component.bugcraft.pageVendorAddBuybackItem( jsonEl.l );
					}
					
					Application.websocket.socket.send( '{"c":"characterInventoryItemSell","sourceBag":' + self.bag_slot_number + ',"sourceSlot":' + self.bag_slot_order + '}' );
					
					return false;
				}
				
				// iX devices
				Application.event.add( objectImage, "touchstart", 	function( e )
				{
					_dragFunction( e.touches[0] );
				});
				
				return true;
			}
		}
		
		// "close" button event
		Application.event.add( profileCloseButtonObject, "click", 	function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.pageProfile = !Component.bugcraft.initializedPages.pageProfile;
			
			profilePageObject.className = 'hidden';
		});
		
		// function invoked from the outside the profile, used to update the inventory. it is used primarely at vendor updates
		Component.bugcraft.pageProfileSetLoot = function( args )
		{
			var _l = args.loot;
			
			for(var i=0;i<_inventorySlots.length;i++)
			{
				if(
					_inventorySlots[ i ].bag_slot_number != _l.ci_slot_bag
					|| _inventorySlots[ i ].bag_slot_order != _l.ci_slot_order
					|| ( _inventorySlots[ i ].attachedLootObject != null && _inventorySlots[ i ].attachedLootObject.loot_id == _l.loot_id )
				)
				{
					continue;
				}
				
				_inventorySlots[ i ].setLoot({
												lootObject: _l
											});
				
				return true;
			}
			
			return false;
		}
		
		Component.bugcraft.pageProfileSetAttributes = function()
		{
			if( Component.bugcraft.initializedPages.pageProfile )
			{
				// no need to set the attributes if the page is not being displayed
				
				return;
			}
			
			attributeHitPointsObject.innerHTML = _ccd.character_hp_max;
			attributeHappinessObject.innerHTML = _ccd.character_happiness;
			attributeStrengthObject.innerHTML = _ccd.character_strength;
			attributePotencyObject.innerHTML = _ccd.character_potency;
			attributeAverageItemLevelObject.innerHTML = ( ( _equipedItems > 0 ) ? ( Math.floor( ( _equipedItemsLevelSum / _equipedItems ) * 100 ) / 100 ): 0 );
			attributeAttackObject.innerHTML = _ccd.character_attack;
			
			attributeMainHandWeaponDamageObject.innerHTML = ( _ccd.character_main_hand_damage_max > 0 ) ? ( _ccd.character_main_hand_damage_min + " - " + _ccd.character_main_hand_damage_max ) : "None";
			
			if( _ccd.character_off_hand_damage_max == 0 || _ccd.character_off_hand_damage_max == null )
			{
				// received an update which puts the value at zero
				attributeMainHandWeaponDamageContainerObject.className = "hidden";
			}
			else
			{
				attributeMainHandWeaponDamageContainerObject.className = "statGroupDetailContainer";
				attributeOffHandWeaponDamageObject.innerHTML = _ccd.character_off_hand_damage_min + " - " + _ccd.character_off_hand_damage_max;
			}
			
			attributeHitChanceObject.innerHTML = ( ( Math.round( 
																			( ( ( _ccd.character_main_hand_damage_max == null && _ccd.character_off_hand_damage_max != null ) || ( _ccd.character_main_hand_damage_max != null && _ccd.character_off_hand_damage_max == null ) ) ? 0.75 : 0.66 ) +
																			( 25 * ( _ccd.character_attack / ( _ccd.character_level * 4 ) ) ) * 100 ) / 100 ) + "%" );
			attributeCritChanceObject.innerHTML = ( ( Math.round( ( 25 * _ccd.character_attack / ( _ccd.character_level * 5 ) ) * 100 ) / 100 ) + "%" );
			attributeArmorObject.innerHTML = _ccd.character_armor;
			attributeDefenseObject.innerHTML = _ccd.character_defense;
			attributeResistanceObject.innerHTML = _ccd.character_resistance;
		}
		
		//
		// Initialize
		//
		
		// populate the inventory
		for(var i=0;i<args.lootData.length;i++)
		{
			var _ld = args.lootData[ i ];
			
			// create slot item
			_inventorySlots[ i ] = new slotObject( _ld );
			
			if( _ld.loot_id == null )
			{
				continue;
			}
			
			if( _ld.ci_slot_bag == 1 )
			{
				// equiped item
				
				_equipedItems++;
				_equipedItemsLevelSum += _ld.loot_level;
			}
			
			// set the loot only if the init param explicitly suggested it
			_inventorySlots[ i ].setLoot({
											lootObject: _ld
										});
		}
		
		Component.bugcraft.pageProfileSetAttributes();
		
		profileCharacterNameObject.innerHTML = _ccd.character_name;
		profileAvatarObject.style.backgroundImage = "url('/appSpecific/img/profile/character_" + _ccd.character_race + ".png')";
	}
	
	Component.bugcraft.pageProfileSetLoot = function( args )
	{
		
	}
	
	Component.bugcraft.pageProfileSetAttributes = function()
	{
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	