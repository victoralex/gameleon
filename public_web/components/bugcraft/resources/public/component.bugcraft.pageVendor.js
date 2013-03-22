
	/*
		Vendor page
	*/
	
	var _autoVendorCloseDistanceCheckTimeout = null;
	
	Component.bugcraft.pageVendor = function( vendorObject, args )
	{
		var _buybackItems = [], _ccd = Component.bugcraft.currentCharacterObject.characterData,
			vendorPageObject = document.getElementById( args.id + '_vendorPage' ),
			vendorWindowTitleObject = document.getElementById( args.id + '_vendorWindowTitle' ),
			vendorLeftArrowObject = document.getElementById( args.id + '_vendorLeftArrow' ),
			vendorRightArrowObject = document.getElementById( args.id + '_vendorRightArrow' ),
			vendorItemsContainerObject = document.getElementById( args.id + '_vendorItemsContainer' ),
			vendorItemsSoldButtonObject = document.getElementById( args.id + '_vendorItemsSoldButton' ),
			vendorItemsBuybackButtonObject = document.getElementById( args.id + '_vendorItemsBuybackButton' ),
			vendorSlotsContainerObject = document.getElementById( args.id + '_vendorSoldSlotsContainer' ),
			vendorBuybackSlotsContainerObject = document.getElementById( args.id + '_vendorBuyBackSlotsContainer' ),
			vendorCloseButtonObject = document.getElementById( args.id + '_vendorCloseButton' );
		
		var _initWindow = function()
		{
			Component.bugcraft.scaleWindow( vendorPageObject );
			//Component.bugcraft.positionRelativeWindow( vendorPageObject );
			
			if( vendorObject )
			{
				Component.bugcraft.sound.characters.playCharacterVoiceExclusive( vendorObject, "vendor_hi" );
				_autoCloseDistanceCheck();
			}
			
			if( !args.isAmberStore )
			{
				// request vendor items listing
				Application.websocket.socket.send( '{"c":"vendorItemsList","vID":' + vendorObject.characterData.character_id + '}' );
				
				vendorWindowTitleObject.innerHTML = vendorObject.characterData.character_name;
			}
			else
			{
				// request amber store listing
				Application.websocket.socket.send( '{"c":"vendorAmberItemsList"}' );
				
				vendorWindowTitleObject.innerHTML = "Amber Store";
			}
		}
		
		var _hideWindow = function()
		{
			clearTimeout( _autoVendorCloseDistanceCheckTimeout );
			
			if( vendorObject )
			{
				vendorObject.startIdleMovementCountdown();
				Component.bugcraft.sound.characters.playCharacterVoiceExclusive( vendorObject, "vendor_bye" );
			}
			
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.vendor = !Component.bugcraft.initializedPages.vendor;
			
			vendorPageObject.className = "hidden";
			
			Component.bugcraft.pageBagsHide();
		}
		
		var _autoCloseDistanceCheck = function()
		{
			// ensure no overlaps occur
			clearTimeout( _autoVendorCloseDistanceCheckTimeout );
			
			if( _ccd.character_distance_to_target < 120 )
			{
				_autoVendorCloseDistanceCheckTimeout = setTimeout( _autoCloseDistanceCheck, 150 );
				
				return;
			}
			
			// moved too far away from the target
			
			_hideWindow();
		}
		
		//
		// Check if this has been populated before
		//
		
		if( Component.bugcraft.initializedPages.pageBags == true )
		{
			Component.bugcraft.pageBags( args );
		}
		
		if( typeof Component.bugcraft.initializedPages.vendor != "undefined" )
		{
			Component.bugcraft.initializedPages.vendor = !Component.bugcraft.initializedPages.vendor;
			vendorPageObject.className = Component.bugcraft.initializedPages.vendor ? "vendor" : "hidden";
			
			if( !Component.bugcraft.initializedPages.vendor )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
			}
			
			_initWindow();
			
			return;
		}
		
		//
		// Initialize
		//
		
		Component.bugcraft.initializedPages.vendor = true;
		vendorPageObject.className = "vendor";
		
		_initWindow();
		
		// will create the cost content for an item / player
		var _getCostContent = function( costData )
		{
			var costContent = '';
			
			if( costData.amber > 0 )
			{
				// regular polen
				
				costContent += '<span class="amber" title="Amber">' + costData.amber + '</span>';
			}
			
			if( costData.polen > 10000 )
			{
				// refined polen
				
				costContent += '<span class="polenRefined" title="Refined Polen">' + Math.floor( costData.polen / 10000 ) + '</span>';
				
				if( Math.floor( ( costData.polen % 10000 ) / 100 ) > 0 )
				{
					costContent += '<span class="polenRegular" title="Regular Polen">' + Math.floor( ( costData.polen % 10000 ) / 100 ) + '</span>';
					
					if( Math.floor( costData.polen % 100 ) > 0 )
					{
						costContent += '<span class="polenCrude" title="Crude Polen">' + Math.floor( costData.polen % 100 ) + '</span>';
					}
				}
			}
			else if( costData.polen > 100 )
			{
				// regular polen
				
				costContent += '<span class="polenRegular" title="Regular Polen">' + Math.floor( costData.polen / 100 ) + '</span>';
				
				if( Math.floor( costData.polen % 100 ) )
				{
					costContent += '<span class="polenCrude" title="Crude Polen">' + Math.floor( costData.polen % 100 ) + '</span>';
				}
			}
			else if( costData.polen > 0 )
			{
				// regular polen
				
				costContent += '<span class="polenCrude" title="Crude Polen">' + costData.polen + '</span>';
			}
			
			return costContent;
		}
		
		var _moveItemToBackpack = function( _itemData )
		{
			var itemContainer = document.createElement("div"), _currentBottom = 100, _currentOpacity = 1, _currentZoom = 1,
				_backPackObjectCoords = Application.util.style.getPos( Component.bugcraft._layoutObjects.bottomBarMenuItem8Object );
			
			itemContainer.className = "vendorItemFloatingToBackpack";
			itemContainer.style.backgroundImage = 'url("' + Application.configuration.cdn.location[ 0 ].url + "/item_skins/" + _itemData.loot_id + '/' + _itemData.loot_id + '_64x64.png")';
			
			document.body.appendChild( itemContainer );
			
			// animation function
			var _animation = function()
			{
				itemContainer.style.opacity = ( _currentOpacity -= 0.05 );
				
				_currentZoom -= 0.05;
				
				itemContainer.style.transform = 'scale(' + _currentZoom + ')';
				itemContainer.style.MozTransform = 'scale(' + _currentZoom + ')';
				itemContainer.style.WebkitTransform = 'scale(' + _currentZoom + ')';
				
				itemContainer.style.left = Math.round( _backPackObjectCoords.left - 85 + Math.cos( _currentZoom ) * 100 ) + "px";
				itemContainer.style.top = Math.round( _backPackObjectCoords.top - 55 + Math.sin( 1 - _currentZoom ) * 100  ) + "px";
				
				if( _currentZoom <= 0 )
				{
					Application.util.html.removeNode( itemContainer );
					
					return;
				}
				
				setTimeout( _animation, 50 );
			}
			
			// play the associated sound
			Component.bugcraft.sound.ui.playEvent( "actionBar", "backpack" + ( ( _itemData.loot_armor_type != null ) ? ( _itemData.loot_armor_type[ 0 ].toUpperCase() + _itemData.loot_armor_type.substring( 1 ) ) : "Misc" ) + "Pickup" );
			
			// animate
			_animation();
		}
		
		// close button
		vendorCloseButtonObject.onclick = _hideWindow;
		
		//
		// Show a specialization container
		//
		
		var _showSoldItems = function()
		{
			// show the arrows
			vendorLeftArrowObject.className = "leftArrow";
			vendorRightArrowObject.className = "rightArrow";
			
			// set the classes
			vendorItemsSoldButtonObject.className = "itemsSoldButtonSelected";
			vendorItemsBuybackButtonObject.className = "itemsBuybackButton";
			
			vendorSlotsContainerObject.className = "vendorSlotsContainer";
			vendorBuybackSlotsContainerObject.className = "hidden";
		}
		
		// sell items
		vendorItemsSoldButtonObject.onclick = function()
		{
			// play the associated event
			Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
			
			_showSoldItems();
		}
		
		// buyback
		vendorItemsBuybackButtonObject.onclick = function()
		{
			// play the associated event
			Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
			
			// hide the arrows
			vendorLeftArrowObject.className = "leftArrowInvisible";
			vendorRightArrowObject.className = "rightArrowInvisible";
			
			// set the classes
			vendorItemsSoldButtonObject.className = "itemsSoldButton";
			vendorItemsBuybackButtonObject.className = "itemsBuybackButtonSelected";
			
			vendorSlotsContainerObject.className = "hidden";
			vendorBuybackSlotsContainerObject.className = "vendorSlotsContainer";
		}
		
		//
		// Create the buyback tab
		//
		
		var _createBuyBackTab = function()
		{
			vendorBuybackSlotsContainerObject.innerHTML = "";
			
			var _createEmptyItem = function( container )
			{
				var slotContainer = document.createElement("div");
				slotContainer.className = "slotEmpty";
				slotContainer.innerHTML = '<div class="slotItemIcon"></div><div class="slotItemDescription"><div class="slotItemName"></div><div class="slotItemCost"></div></div>';
				
				container.appendChild( slotContainer );
			}
			
			var _createItem = function( container, itemOrder )
			{
				var _itemData = _buybackItems[ itemOrder ], slotContainer = document.createElement("div");
				
				slotContainer.innerHTML = ( '<div class="slotItemIcon" style="background-image:url(\'' + Application.configuration.cdn.location[ 0 ].url + "/item_skins/" + _itemData.loot.loot_id + '/' + _itemData.loot.loot_id + '_48x48.png\')">' +
														( ( _itemData.amount > 1 ) ? "<div class='slotItemAmount' title='" + _itemData.amount + " items'>" + _itemData.amount + "</div>" : "" ) +
														'</div><div class="slotItemDescription"><div class="slotItemName' + _itemData.loot.loot_rarity + '">' + _itemData.loot.loot_name + '</div><div class="slotItemCost">' + _getCostContent({ polen: _itemData.loot.loot_sell_price_polen, amber: _itemData.loot.loot_sell_price_amber }) + '</div></div>' );
				
				( new Component.bugcraft.tooltip.item( slotContainer, _itemData.loot ) ).enable();
				
				if(
					_itemData.loot.loot_level_required <= _ccd.character_level
					&& ( _itemData.loot.loot_armor_type == null || ( _itemData.loot.loot_armor_type != null && _ccd.character_armor_accepted.toString().split( "," ).indexOf( _itemData.loot.loot_armor_type ) > -1 ) )
				)
				{
					slotContainer.className = "slotFull";
				}
				else
				{
					slotContainer.className = "slotDisabled";
				}
				
				slotContainer.onclick = function( e )
				{
					if( e.shiftKey )
					{
						// link object in chat
						
						Component.bugcraft.pageChatInsertObjectInInput({
																						objectName: _itemData.loot.loot_name,
																						objectType: "item" + _itemData.loot.loot_rarity,
																						objectID: _itemData.loot.loot_id
																					});
						
						return false;
					}
					
					// buy back the item
					
					Application.websocket.handlers.characterInventoryItemBuyback = function( jsonEl, ws )
					{
						if( jsonEl.r == 301 )
						{
							Component.bugcraft.sound.characters.playMainVoice( "cannotAfford" );
							
							return;
						}
						
						if( jsonEl.r == 302 )
						{
							Component.bugcraft.sound.characters.playMainVoice( "fullBag" );
							
							return;
						}
						
						if( jsonEl.r != 200 )
						{
							Application.debug.addError( "Received error " + jsonEl.r + " while buying back item having order number " + jsonEl.order );
							
							return;
						}
						
						// update the inventory
						new _moveItemToBackpack( _itemData );
						
						// set the loot in the inventory
						for(var i=0;i<jsonEl.l.length;i++)
						{
							// update the inventory for each modified item
							Component.bugcraft.pageProfileSetLoot({
																				loot: jsonEl.l[ i ]
																			});
						}
						
						// update the buyback list
						_buybackItems.splice( jsonEl.order, 1 );
						
						_createBuyBackTab();
					}
					
					Application.websocket.socket.send( '{"c":"characterInventoryItemBuyback","itemOrder":' + itemOrder + ',"vendor_id":' + ( vendorObject ? vendorObject.characterData.character_id : null ) + '}' );
				}
				
				container.appendChild( slotContainer );
			}
			
			// enumerate items
			for(var i=0;i<_buybackItems.length;i++)
			{
				new _createItem( vendorBuybackSlotsContainerObject, i );
			}
			
			// enumerate items
			for(var i=_buybackItems.length;i<12;i++)
			{
				_createEmptyItem( vendorBuybackSlotsContainerObject );
			}
		}
		
		// overwriting the add buyback item function
		Component.bugcraft.pageVendorAddBuybackItem = function( itemData )
		{
			_buybackItems.push( itemData );
			
			if( _buybackItems.length > 12 )
			{
				_buybackItems.shift();
			}
			
			Component.bugcraft.sound.ui.playEvent( "vendor", "itemSell" );
			
			_createBuyBackTab();
		}
		
		//
		// Store items fetch
		//
		
		Application.websocket.handlers.vendorAmberItemsList = Application.websocket.handlers.vendorItemsList = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Error fetching loot (" + jsonEl.r + ")" );
				
				return;
			}
			
			var maxItemsPerPage = 12, item = {}, popupObject = null, itemsProcessed = 0, itemPages = [], currentItemPage = 0,
				vendorPlayerCurrencyObject = document.getElementById( args.id + '_vendorPlayerCurrency' );
			
			// store the buyback items. this list will later be altered
			_buybackItems = jsonEl.b;
			
			_showSoldItems();
			_createBuyBackTab();
			
			//
			// arrow events
			//
			
			vendorLeftArrowObject.onclick = function()
			{
				Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
				
				itemPages[ currentItemPage ].hide();
				
				if( --currentItemPage < 0 )
				{
					currentItemPage = itemPages.length - 1;
				}
				
				itemPages[ currentItemPage ].show();
			}
			
			vendorRightArrowObject.onclick = function()
			{
				Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
				
				itemPages[ currentItemPage ].hide();
				
				if( ++currentItemPage >= itemPages.length )
				{
					currentItemPage = 0;
				}
				
				itemPages[ currentItemPage ].show();
			}
			
			var _createItem = function( container, itemIndex )
			{
				var _itemData = jsonEl.l[ itemIndex ], slotContainer = document.createElement("div");
				
				slotContainer.innerHTML = ( '<div class="slotItemIcon" style="background-image:url(\'' + Application.configuration.cdn.location[ 0 ].url + "/item_skins/" + _itemData.loot_id + '/' + _itemData.loot_id + '_48x48.png\')">' +
														( ( _itemData.opi_loot_amount > 1 ) ? "<div class='slotItemAmount' title='" + _itemData.opi_loot_amount + " items'>" + _itemData.opi_loot_amount + "</div>" : "" ) +
														'</div><div class="slotItemDescription"><div class="slotItemName' + _itemData.loot_rarity + '">' + _itemData.loot_name + '</div><div class="slotItemCost">' + _getCostContent({ polen: _itemData.loot_buy_price_polen, amber: _itemData.loot_buy_price_amber }) + '</div></div>' );
				
				( new Component.bugcraft.tooltip.item( slotContainer, _itemData ) ).enable();
				
				if(
					_itemData.loot_level_required <= _ccd.character_level
					&& ( _itemData.loot_armor_type == null || ( _itemData.loot_armor_type != null && _ccd.character_armor_accepted.toString().split( "," ).indexOf( _itemData.loot_armor_type ) > -1 ) )
				)
				{
					slotContainer.className = "slotFull";
				}
				else
				{
					slotContainer.className = "slotDisabled";
				}
				
				slotContainer.onclick = function( e )
				{
					if( popupObject )
					{
						popupObject.remove();
						popupObject = null;
					}
					
					if( e.shiftKey )
					{
						// link object in chat
						
						Component.bugcraft.pageChatInsertObjectInInput({
																						objectName: _itemData.loot_name,
																						objectType: "item" + _itemData.loot_rarity,
																						objectID: _itemData.loot_id
																					});
						
						return false;
					}
					
					popupObject = new Component.bugcraft.notificationPopup.yesNoPopup({
																						id: args.id,
																						name: "vendorItemPurchaseConfirm",
																						questionText: 'You are about to purchase "' + _itemData.loot_name + '"',
																						acceptText: "Get looooot!",
																						denyText: "No, choose another",
																						onAccept: function()
																						{
																							//
																							// Vendor
																							//
																							
																							Application.websocket.handlers.vendorItemPurchase = function( jsonPurchaseEl, ws )
																							{
																								// item purchase action response
																								
																								if( jsonPurchaseEl.r == 301 )
																								{
																									Component.bugcraft.sound.characters.playMainVoice( "cannotAfford" );
																									
																									popupObject.hide();
																									
																									return;
																								}
																								
																								if( jsonPurchaseEl.r == 302 )
																								{
																									Component.bugcraft.sound.characters.playMainVoice( "fullBag" );
																									
																									popupObject.hide();
																									
																									return;
																								}
																								
																								if( jsonPurchaseEl.r != 200 )
																								{
																									Application.debug.addError( "Received error " + jsonPurchaseEl.r + " while purchasing item " + jsonPurchaseEl.item_id + ", quantity " + jsonPurchaseEl.quantity );
																									
																									return;
																								}
																								
																								new _moveItemToBackpack( _itemData );
																								
																								// set the loot in the inventory
																								for(var i=0;i<jsonPurchaseEl.l.length;i++)
																								{
																									// update the inventory for each modified item
																									Component.bugcraft.pageProfileSetLoot({
																																						loot: jsonPurchaseEl.l[ i ]
																																					});
																								}
																								
																								popupObject.hide();
																							}
																							
																							Application.websocket.socket.send( '{"c":"vendorItemPurchase","opi_id":' + _itemData.opi_id + ',"vendor_id":' + ( vendorObject ? vendorObject.characterData.character_id : null ) + '}' );
																						},
																						onDeny: function()
																						{
																							popupObject.hide();
																						}
																					});
				}
				
				container.appendChild( slotContainer );
			}
			
			var _createEmptyItem = function( container, itemIndex )
			{
				var slotContainer = document.createElement("div");
				slotContainer.className = "slotEmpty";
				slotContainer.innerHTML = '<div class="slotItemIcon"></div><div class="slotItemDescription"><div class="slotItemName"></div><div class="slotItemCost"></div></div>';
				
				container.appendChild( slotContainer );
			}
			
			var _createPage = function()
			{
				this.show = function()
				{
					this.pageContainer.className = "vendorItemPage";
				}
				
				this.hide = function()
				{
					this.pageContainer.className = "hidden";
				}
				
				this.pageContainer = document.createElement("div");
				this.hide();
				
				vendorSlotsContainerObject.appendChild( this.pageContainer );
			}
			
			//
			// Populate layout
			//
			
			// clear all previous content
			vendorSlotsContainerObject.innerHTML = "";
			
			// show items
			for(var i in jsonEl.l)
			{
				if( itemsProcessed % maxItemsPerPage == 0 )
				{
					// new page
					
					itemPages.push( new _createPage() );
				}
				
				item[ jsonEl.l[ i ].loot_id ] = new _createItem( itemPages[ itemPages.length - 1 ].pageContainer, i );
				
				itemsProcessed++;
			}
			
			// fill in the empty slots
			for(var i = Object.keys( item ).length % maxItemsPerPage; i<maxItemsPerPage; i++)
			{
				if( itemsProcessed % maxItemsPerPage == 0 )
				{
					// new page
					
					itemPages.push( new _createPage() );
				}
				
				_createEmptyItem( itemPages[ itemPages.length - 1 ].pageContainer, i );
				
				itemsProcessed++;
			}
			
			// show 1st page
			itemPages[ currentItemPage ].show();
			
			Component.bugcraft.pageVendorUpdatePlayerCurrency = function()
			{
				// player currency
				vendorPlayerCurrencyObject.innerHTML = _getCostContent({
																						polen: _ccd.character_polen,
																						amber: _ccd.character_amber
																					});
			}
			
			Component.bugcraft.pageVendorUpdatePlayerCurrency();
		}
	}
	
	Component.bugcraft.pageVendorUpdatePlayerCurrency = function()
	{
	
	}
	
	Component.bugcraft.pageVendorAddBuybackItem = function( itemData )
	{
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	