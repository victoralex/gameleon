	
	/*
		Profile page
	*/
	
	Component.bugcraft.pageLootChoose = function( args, transactionData )
	{
		Component.bugcraft.initializedPages.pageLootChoose = true;
		
		var _ccd = Component.bugcraft.currentCharacterObject.characterData,
			lootChoosePageObject = document.getElementById( args.id + '_lootChoosePage' ),
			lootChooseCloseButtonObject = document.getElementById( args.id + '_lootChooseCloseButton' ),
			lootChooseLootContainer = document.getElementById( args.id + '_lootChooseLootContainer' ),
			_autoCloseDistanceCheckTimeout = null;
		
		lootChoosePageObject.className = "lootChoose";
		lootChooseLootContainer.innerHTML = '';
		
		Component.bugcraft.sound.ui.playEvent( "window", "backPack" );
		
		// Distance check
		
		var _autoCloseDistanceCheck = function()
		{
			if( _ccd.character_distance_to_target < 120 )
			{
				_autoCloseDistanceCheckTimeout = setTimeout( _autoCloseDistanceCheck, 150 );
				
				return;
			}
			
			// moved too far away from the target
			
			_hideWindow();
		}
		
		//
		// Set the events
		//
		
		var _hideWindow = function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.pageLootChoose = !Component.bugcraft.initializedPages.pageLootChoose;
			
			lootChoosePageObject.className = 'hidden';
		}
		
		// "close" button event
		lootChooseCloseButtonObject.onclick = _hideWindow;
		
		// receive updates about a slot which has been emptied
		Application.websocket.handlers.lootGrabSlotEmpty = function( jsonEl, ws )
		{
			if( transactionData.cid != jsonEl.tid )
			{
				// received an update for another loot bag i'm eligible for
				
				return;
			}
			
			var _s = _slots[ jsonEl.p ];
			
			_s.isFull = false;
			_s.slotContainer.className = "slotEmpty";
			_s._toolTip.disable();
			
			for(var i in _slots )
			{
				if( typeof _slots[ i ] != "object" || _slots[ i ].isFull == false )
				{
					continue;
				}
				
				// slot is full
				return;
			}
			
			// all slots are empty
			Component.bugcraft._characterData[ transactionData.cid ].removeVisualEffect( spellEffects.lootableComplete );
		}
		
		
				
		//
		//	Create the items
		//
		
		var _createItem = function( container, _itemData, itemOrder )
		{
			this.slotContainer = document.createElement("div");
			
			if( _itemData == null )
			{
				// empty slot
				
				this.isFull = false;
				
				this.slotContainer.className = "slotEmpty";
				container.appendChild( this.slotContainer );
				
				return;
			}
			
			this.isFull = true;
			this.slotContainer.innerHTML = ( '<div class="slotItemIcon" style="background-image:url(\'' + Application.configuration.cdn.location[ 0 ].url + '/item_skins/' + _itemData.loot.loot_id + '/' + _itemData.loot.loot_id + '_48x48.png\')">' +
													( ( _itemData.amount > 1 ) ? "<div class='slotItemAmount' title='" + _itemData.amount + " items'>" + _itemData.amount + "</div>" : "" ) +
													'</div><div class="slotItemDescription"><div class="slotItemName' + _itemData.loot.loot_rarity + '">' + _itemData.loot.loot_name + '</div></div>' );
			
			// set the tooltip
			this._toolTip = new Component.bugcraft.tooltip.item( this.slotContainer, _itemData.loot );
			this._toolTip.enable();
			
			// decide on the layout for the slot
			if(
				_itemData.loot.loot_level_required <= _ccd.character_level
				&& ( _itemData.loot.loot_armor_type == null || ( _itemData.loot.loot_armor_type != null && _ccd.character_armor_accepted.toString().split( "," ).indexOf( _itemData.loot.loot_armor_type ) > -1 ) )
			)
			{
				this.slotContainer.className = "slotFull";
			}
			else
			{
				this.slotContainer.className = "slotDisabled";
			}
			
			this.slotContainer.onclick = function( e )
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
				
				Application.websocket.handlers.lootGrab = function( jsonEl, ws )
				{
					if( jsonEl.r == 303 )
					{
						Component.bugcraft.messages.addError( "The slot is empty" );
						
						return;
					}
					
					if( jsonEl.r == 304 )
					{
						Component.bugcraft.sound.characters.playMainVoice( "fullBag" );
						
						Component.bugcraft.messages.addError( "The bag is full" );
						
						return;
					}
					
					if( jsonEl.r != 200 )
					{
						Application.debug.addError( "Loot grab error: " + jsonEl.r );
						
						return;
					}
					
					// loot grabbed successfully
					
					
				}
				
				Application.websocket.socket.send( '{"c":"lootGrab","cid":' + transactionData.cid + ',"itemPosition":' + itemOrder + '}' );
			}
			
			container.appendChild( this.slotContainer );
		}
		
		
		if( transactionData.lootBagHide )
		{
			_hideWindow();
			return;
		}
		
		_autoCloseDistanceCheck();
		
		// enumerate items
		var _slots = [],
				_cid = Component.bugcraft.currentCharacterObject.characterData.character_id;
		
		for(var i in transactionData.bagData)
		{
			var _td = transactionData.bagData[ i ];
			
			if( typeof _td != "object" )
			{
				continue;
			}
			
			if(
				_td == null
				|| _td.lootableBy.indexOf( _cid ) == -1
			)
			{
				// not eligible for this loot
				
				continue;
			}
			
			_slots[ i ] = new _createItem( lootChooseLootContainer, _td, i );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	