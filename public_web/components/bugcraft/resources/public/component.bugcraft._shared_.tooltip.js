
	/*
		-----------------
		Item & Buff tooltip
		-----------------
	*/
	
	Component.bugcraft.tooltip = 
	{
		item: function( surfaceObject, itemProperties )
		{
			var _t = null;
			
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
			
			var _mouseOverFunction = function( e )
			{
				if( _t != null )
				{
					// tooltip still visible. no need to reinitialize
					
					return;
				}
				
				var itemTooltipObject = document.createElement("div"), _x = 0, _y = 0, _periodicCheckTimeout = 150, _ccd = Component.bugcraft.currentCharacterObject.characterData,
					_surfaceObjectPos = Application.util.style.getPos( surfaceObject ), _surfaceObjectX = _surfaceObjectPos.left, _surfaceObjectY = _surfaceObjectPos.top,
					_windowSize = Application.util.style.getWindowSize();
				
				var _setTooltipPosition = function()
				{
					itemTooltipObject.style.left = ( ( _x + itemTooltipObject.offsetWidth + 30 < _windowSize.width ) ? _x : ( _surfaceObjectX - itemTooltipObject.offsetWidth - 20 ) ) + "px";
					itemTooltipObject.style.top = ( ( _y + itemTooltipObject.offsetHeight < _windowSize.height ) ? _y : ( _surfaceObjectY - itemTooltipObject.offsetHeight ) ) + "px";
				}
				
				var _changePosFunction = function()
				{
					if( itemTooltipObject.offsetLeft == _x && itemTooltipObject.offsetTop == _y )
					{
						// no change in coordinates
					
						_t = setTimeout( _changePosFunction, _periodicCheckTimeout );
						
						return;
					}
					
					_setTooltipPosition();
					
					if(
						_x < _surfaceObjectX
						|| _y < _surfaceObjectY
						|| _x > _surfaceObjectX + surfaceObject.offsetWidth
						|| _y > _surfaceObjectY + surfaceObject.offsetHeight
					)
					{
						// out surfaceObject's boundaries
						
						clearTimeout( _t );
						
						Application.util.html.removeNode( itemTooltipObject );
						
						Application.event.remove( document.body, "mousemove", _moveFunction );
						
						_t = null;
						
						return;
					}
					
					_t = setTimeout( _changePosFunction, _periodicCheckTimeout );
				}
				
				var _moveFunction = function( e )
				{
					_x = e.x;
					_y = e.y;
				}
				
				itemTooltipObject.className = "itemTooltip";
				itemTooltipObject.innerHTML = ( "<div class='tooltipItemIcon' style='background-image:url(\"" + Application.configuration.cdn.location[ 0 ].url + "/item_skins/" + itemProperties.loot_id + "/" + itemProperties.loot_id + "_64x64.png\")'></div>" +
																		"<div class='tooltipTop'></div>" +
																		"<div class='tooltipTitle" + itemProperties.loot_rarity + "'>" + itemProperties.loot_name + "</div>" + 
																		"<div class='tooltipDetails'>" +
																			"<div class='toolTipSlotAndArmorContainer'><div class='tooltipSlot'>" + itemProperties.loot_type + "</div>" + 
																				( ( itemProperties.loot_armor_type != null ) ? ( "<div class='tooltipArmorType" + ( ( _ccd.character_armor_accepted.toString().split( "," ).indexOf( itemProperties.loot_armor_type ) == -1 ) ? "Restricted" : "" ) + "'>" + itemProperties.loot_armor_type + "</div>" ) : "" ) +
																			"</div>" +
																			( ( itemProperties.loot_bonus_damage_min != 0 && itemProperties.loot_bonus_damage_max != 0 ) ? "<div class='tooltipBonusDamage'>" + ( itemProperties.loot_bonus_damage_min + " - " + itemProperties.loot_bonus_damage_max ) + " damage</div>" : "" ) +
																			( ( itemProperties.loot_bonus_armor != 0 ) ? "<div class='tooltipBonusArmor'>" + ( itemProperties.loot_bonus_armor ) + " armor</div>" : "" ) +
																			( ( itemProperties.loot_bonus_attack != 0 ) ? "<div class='tooltipBonusAttack'>" + ( ( ( itemProperties.loot_bonus_attack > 0 ) ? "+" : "-" ) + itemProperties.loot_bonus_attack ) + " attack</div>" : "" ) +
																			( ( itemProperties.loot_bonus_defense != 0 ) ? "<div class='tooltipBonusDefense'>" + ( ( ( itemProperties.loot_bonus_defense > 0 ) ? "+" : "-" ) + itemProperties.loot_bonus_defense ) + " defense</div>" : "" ) +
																			( ( itemProperties.loot_bonus_resistance != 0 ) ? "<div class='tooltipBonusResistance'>" + ( ( ( itemProperties.loot_bonus_resistance > 0 ) ? "+" : "-" ) + itemProperties.loot_bonus_resistance ) + " resistance</div>" : "" ) +
																			( ( itemProperties.loot_bonus_potency != 0 ) ? "<div class='tooltipBonusPotency'>" + ( ( ( itemProperties.loot_bonus_potency > 0 ) ? "+" : "-" ) + itemProperties.loot_bonus_potency ) + " potency</div>" : "" ) +
																			( ( itemProperties.loot_bonus_strength != 0 ) ? "<div class='tooltipBonusStrength'>" + ( ( ( itemProperties.loot_bonus_strength > 0 ) ? "+" : "-" ) + itemProperties.loot_bonus_strength ) + " strength</div>" : "" ) +
																			( ( itemProperties.loot_bonus_hp != 0 ) ? "<div class='tooltipBonusHP'>" + ( ( ( itemProperties.loot_bonus_hp > 0 ) ? "+" : "-" ) + itemProperties.loot_bonus_hp ) + " hp</div>" : "" ) +
																			( ( itemProperties.buff_id != null ) ? "<div class='tooltipAssociatedBuff'>May cast " + ( ( itemProperties.loot_associated_buff_charges == null ) ? "infinite" : itemProperties.loot_associated_buff_charges ) + " charge" + ( ( itemProperties.loot_associated_buff_charges > 1 ) ? 's' : '' ) + " of " + itemProperties.buff_name + "</div>" : "" ) +
																			"<div class='tooltipItemLevelRequired" + ( ( itemProperties.loot_level_required > _ccd.character_level ) ? "Restricted" : "" ) + "'>Requires Level " + itemProperties.loot_level_required + "</div>" +
																			( ( itemProperties.loot_happiness_required != 0 ) ? "<div class='tooltipItemHappinessRequired" + ( ( itemProperties.loot_happiness_required > _ccd.character_happiness ) ? "Restricted" : "" ) + "'>Requires Happiness " + itemProperties.loot_happiness_required + "</div>" : "" ) +
																			"<div class='tooltipItemLevel'>Item Level " + itemProperties.loot_level + "</div>" +
																			( ( itemProperties.loot_description.length > 0 ) ? "<div class='tooltipItemDescription'>" + itemProperties.loot_description + "</div>" : "" ) +
																			
																			( ( Component.bugcraft.initializedPages.vendor ) ? "<div class='tooltipItemSellPrice'>" + _getCostContent({ polen: itemProperties.loot_sell_price_polen, amber: itemProperties.loot_sell_price_amber }) + "</div>" : "" ) +
																			
																		"</div>" +
																		"<div class='tooltipBottom'></div>" );
				
				document.body.appendChild( itemTooltipObject );
				
				_moveFunction( e );
				_setTooltipPosition();
				_changePosFunction();
				
				Application.event.add( document.body, "mousemove", _moveFunction );
			}
			
			// public methods
			
			this.show = function( e )
			{
				_mouseOverFunction( e );
			}
			
			this.enable = function()
			{
				Application.event.add( surfaceObject, "mouseover", _mouseOverFunction );
			}
			
			this.disable = this.remove = function()
			{
				Application.event.remove( surfaceObject, "mouseover", _mouseOverFunction );
			}
		},
		
		/*
			buffs tooltip
		*/
		
		buff: function( surfaceObject, buffProperties )
		{
			var _t = null, remainingTime = null, self = this,
				itemTooltipObject = document.createElement("div");
			
			var _mouseOverFunction = function( e )
			{
				if( _t != null )
				{
					// tooltip still visible. no need to reinitialize
					
					return;
				}
				
				var _x = 0, _y = 0, _periodicCheckTimeout = 150, _ccd = Component.bugcraft.currentCharacterObject.characterData,
					_surfaceObjectPos = Application.util.style.getPos( surfaceObject ), _surfaceObjectX = _surfaceObjectPos.left, _surfaceObjectY = _surfaceObjectPos.top,
					_windowSize = Application.util.style.getWindowSize();
				
				var _setTooltipPosition = function()
				{
					itemTooltipObject.style.left = ( ( _x + itemTooltipObject.offsetWidth + 30 < _windowSize.width ) ? _x : ( _surfaceObjectX - itemTooltipObject.offsetWidth - 20 ) ) + "px";
					itemTooltipObject.style.top = ( ( _y + itemTooltipObject.offsetHeight < _windowSize.height ) ? _y : ( _surfaceObjectY - itemTooltipObject.offsetHeight ) ) + "px";
				}
				
				var _changePosFunction = function()
				{
					if( itemTooltipObject.offsetLeft == _x && itemTooltipObject.offsetTop == _y )
					{
						// no change in coordinates
					
						_t = setTimeout( _changePosFunction, _periodicCheckTimeout );
						
						return;
					}
					
					_setTooltipPosition();
					
					if(
						_x < _surfaceObjectX
						|| _y < _surfaceObjectY
						|| _x > _surfaceObjectX + surfaceObject.offsetWidth
						|| _y > _surfaceObjectY + surfaceObject.offsetHeight
					)
					{
						// out surfaceObject's boundaries
						
						clearTimeout( _t );
						
						Application.util.html.removeNode( itemTooltipObject );
						
						Application.event.remove( document.body, "mousemove", _moveFunction );
						
						_t = null;
						
						return;
					}
					
					_t = setTimeout( _changePosFunction, _periodicCheckTimeout );
				}
				
				var _moveFunction = function( e )
				{
					_x = e.x;
					_y = e.y;
				}
				
				itemTooltipObject.className = "buffTooltip";
				
				self.updateToolTipText();
				
				document.body.appendChild( itemTooltipObject );
				
				_moveFunction( e );
				_setTooltipPosition();
				_changePosFunction();
				
				Application.event.add( document.body, "mousemove", _moveFunction );
			}
			
			// public methods
			
			this.show = function( e )
			{
				_mouseOverFunction( e );
			}
			
			this.updateToolTipText = function()
			{
				itemTooltipObject.innerHTML = ( "<div class='tooltipItemIcon' style='background-image:url(\"/components/bugcraft/resources/public/img/abilities_large/" + buffProperties.buff_id + ".png\")'></div>" +
																		"<div class='tooltipTop'></div>" +
																		"<div class='tooltipTitle'>" + buffProperties.buff_name + "</div>" + 
																		"<div class='tooltipDetails'>" +
																			( remainingTime ? ( "<div class='tooltipTalentPoints'>Remaining Time: " + remainingTime + "</div>" ) : "" ) +
																			( ( typeof buffProperties.buff_points != "undefined" ) ? ( "<div class='tooltipTalentPoints'>Talent points required: " + buffProperties.buff_points + "</div>" ) : "" ) +
																			"<div class='tooltipBuffDescription'>" + buffProperties.buff_description.replace( "%min", buffProperties.buff_gain_hp_min ).replace( "%max", buffProperties.buff_gain_hp_max ) + "</div>" +
																		"</div>" +
																		"<div class='tooltipBottom'></div>" );
			}
			
			this.updateRemainingTime = function( remainingTimeAmount )
			{
				remainingTime = remainingTimeAmount;
				
				self.updateToolTipText();
			}
			
			this.enableDisplayOnClick = function()
			{
				Application.event.add( surfaceObject, "click", _mouseOverFunction );
			}
			
			this.disableDisplayOnClick = function()
			{
				Application.event.remove( surfaceObject, "click", _mouseOverFunction );
			}
		}
	}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
