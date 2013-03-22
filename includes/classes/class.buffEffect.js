	
    "use strict"; // enable strict mode within this file
	
	var log = require( "./class.log" ),
		stats = require( "./class.stats" ),
		syncSQL = new (require('./class.syncSQL')).p;
	
	//
	// Active buff casting
	//
	
	var activeBuff = function( args )
	{
		var self = this, interval = null, dbIndex = null, endTime = null, requestedEnd = false, _buffDuration = args.buff.buff_mechanic_duration_seconds;
		
		this.tics = 0;
		this.appliedStats = {};
		this.sourceIsFriendly = args.sourceIsFriendly;
		this.appliedEffectEnded = false;
		this.removedCooldown = false;
		this.buff = args.buff;
		
		this.multiplier = 1;
		
		if(
			!args.sourceIsFriendly
		)
		{
			// character is being attacked
			
			args.character.addOpponent( args.source ) ? args.source.addOpponent( args.character ) : false;									// bijective
			args.character.addEnemy( args.source );
			args.source.addEnemy( args.character );
			
			args.character.setVisibleEnabled();		// always show the target
		}
		else
		{
			// a friendly source is giving me something
			
			args.source.addEnemiesToMyEnemies( args.character );	// the source will have as enemies all of my enemies
		}
		
		this.getRemainingEffectTime = function()
		{
			var _b = args.buff;
			
			if( endTime == null )
			{
				return false;
			}
			
			return Math.floor( ( endTime - ( new Date() ).getTime() ) / 1000 );
		}
		
		this.getSource = function()
		{
			return args.source;
		}
		
		this.getCharacter = function()
		{
			return args.character;
		}
		
		this.getBuff = function()
		{
			return args.buff;
		}
		
		//
		// Events
		//
		
		this.events = {
			
			appliedEffectEnd: [],
			
			_add: function( eventName, callBack )
			{
				return {
						index: self.events[ eventName ].push( callBack ) - 1,
						eventName: eventName
					}
			},
			
			_remove: function( eventObjectReturn )
			{
				delete self.events[ eventObjectReturn.eventName ][ eventObjectReturn.index ];
			},
			
			_run: function( eventName, eventParams )
			{
				var _e = self.events[ eventName ];
				
				for(var i in _e)
				{
					_e[ i ]( eventParams );
				}
			}
			
		};
		
		// 
		// Evaluate the prerequisites
		//
		
		this._checkHit = function()
		{
			if( self.sourceIsFriendly )
			{
				return true;
			}
			
			var personalRoll = ( ( ( args.source.properties.character_main_hand_damage_max == null && args.source.properties.character_off_hand_damage_max != null ) || ( args.source.properties.character_main_hand_damage_max != null && args.source.properties.character_off_hand_damage_max == null ) ) ?
											( ( 75 - ( args.character.properties.character_level - args.source.properties.character_level ) * 1.7 ) / 100 ) :			// single wield
											( ( 66 - ( args.character.properties.character_level - args.source.properties.character_level ) * 1.7 ) / 100 ) ) +		// dual wield
									( 25 * ( args.source.properties.character_attack / ( args.source.properties.character_level * 4 ) ) ) / 100;						// effective hit
			
			//log.add( "My Roll: " + personalRoll );
			
			// roll a percentile
			if( Math.random() <= personalRoll )
			{
				return true;
			}
			
			return false;
		}
		
		//
		// Check if the buff is active or not
		//
		
		this._checkType = function()
		{
			if( args.buff.buff_type & 1 )
			{
				// active buff
				
				return true;
			}
			
			// passive buff
			return false;
		}
		
		//
		// apply the buff effect
		//
		
		var _calculateEffect = function( after )
		{
			// Increment the number of effects applied by the buff on target
			args.character.appliedEffects[ args.buff.buff_effect - 1 ]++;
			
			switch( args.buff.buff_effect - 1 )
			{
				case 0:
					
					// cleanse
					
					var _candidateBuffs = [];
					
					for(var i in args.character.activeBuffs)
					{
						if(
							args.character.activeBuffs[ i ].sourceIsFriendly == args.sourceIsFriendly ||			// buff casted by friend / foe does not remove friendly / unfriendly effects
							args.character.activeBuffs[ i ].index == this.index 												// make sure the current buff is not considered when building the poll
						)
						{
							continue;
						}
						
						// add this buff to the cleanup poll
						
						_candidateBuffs.push( i );
					}
					
					if( _candidateBuffs.length > 0 )
					{
						// randomly delete a buff
						
						var _buffNo = Math.floor( Math.random() * _candidateBuffs.length );
						var _r = args.character.activeBuffs[ _buffNo ];
						
						log.add( "Will remove buff no " + _buffNo + " from the queue " + JSON.stringify( _r ) );
						
						_r._requestEnd(function() { });
						
						//delete _candidateBuffs;
					}
					
					after();
					
				break;
				case 1:
					
					// bleed
					
					after();
					
				break;
				case 2:
					
					// stun
					
					_buffDuration = args.buff.buff_mechanic_duration_seconds * Math.max( 0, 1 - ( args.character.effectsAppliedLately.stun * 0.25 ) );
					
					args.character.effectsAppliedLately.stun++;
					
					setTimeout( function()
					{
						args.character.effectsAppliedLately.stun--;
					}, 12000 );
					
					args.character.setStunEnabled();
					
					after();
					
				break;
				case 3:
					
					// heal
					
					after();
					
				break;
				case 4:
					
					// disarm
					
					args.character.setArmsDisabled();
					
					after();
					
				break;
				case 5:
					
					// modifier
					
					after();
					
				break;
				case 6:
					
					// stealth
					
					args.character.setVisibleDisabled();
					
					after();
					
				break;
				case 7:
					
					// charge
					
					var _cp = args.character.properties, _sp = args.source.properties,
						_s = _sp.character_speed, _ts = 50;
					
					// change the source's speed
					
					args.source.addHistory({
												c: "modify",
												bi: self.index,
												a: "speed",
												m: _ts - _s
											});
					
					_sp.character_speed = _ts;
					
					args.source.command_move({
													x: _cp.character_zone_x,
													y: _cp.character_zone_y,
													r: _cp.character_rotation,
													after: function()
													{
														// movement has ended. change the speed
														
														args.source.addHistory({
																					c: "modify",
																					bi: self.index,
																					a: "speed",
																					m: _s - _sp.character_speed
																				});
														
														_sp.character_speed = _s;
													}
												});
					
					after();
					
				break;
				default:
					
					log.addError( "Buff effect " + ( args.buff.buff_effect - 1 ) + " not implemented" );
			}
		}
		
		//
		// check the buff prerequisites
		//
		
		this._checkPrerequisiteEffect = function()
		{
			if( args.buff.buff_prerequisite_effect == null )
			{
				return true;
			}
			
			if( args.buff.buff_prerequisite_target & 1 )
			{
				// self
				
				if( args.character.properties.character_id != args.source.properties.character_id )
				{
					// target is not self
					
					return false;
				}
				
				if( args.character.appliedEffects[ args.buff.buff_prerequisite_effect ] == 0 )
				{
					// the required effect was not found on target
					
					return false;
				}
				
				return true;
			}
			
			if( args.buff.buff_prerequisite_target & 2 )
			{
				// target
				
				if( args.character.properties.character_id == args.source.properties.character_id )
				{
					// target is self
					
					return false;
				}
				
				if( args.character.appliedEffects[ args.buff.buff_prerequisite_effect ] == 0 )
				{
					// the required effect was not found on target
					
					return false;
				}
				
				return true;
			}
		}
		
		//
		// apply the buff considering its mechanic type
		//
		
		var _finalizeFunction = function() { };
		
		var _applyMechanic = function( after )
		{
			switch( args.buff.buff_mechanic_type )
			{
				case 1:
					
					// boomerang
					
					_calculateStats();
					
					_insertStatsToDB( function()
					{
						after();
						
						_applyStatsPositive();
						
						_finalizeFunction = function()
						{
							_applyStatsNegative();
						}
						
						if( requestedEnd == true )
						{
							// end asap handler
							
							self._appliedEffectEnd(function() { });
							
							return;
						}
						
						interval = setTimeout(
												function()
												{
													interval = null;
													
													_applyStatsNegative();
													
													self._appliedEffectEnd(function() { });
												},
												_buffDuration * 1000
											);
					});
					
				break;
				case 2:
					
					// tic
					
					_calculateStats();
					
					_insertStatsToDB( function()
					{
						after();
						
						_applyStatsPositive();
						
						self.tics++;
						
						if( requestedEnd == false && args.buff.buff_mechanic_tics > 1 )
						{
							// buff has effect over time
							
							interval = setInterval( function()
							{
								if( args.buff.buff_mechanic_tics < self.tics )
								{
									// make sure it will not execute any function periodically
									clearInterval( interval );
									
									interval = null;
									
									self._appliedEffectEnd(function() { });
									
									return;
								}
								
								_calculateStats();
								
								_updateStatsToDB(	function()
																{
																	_applyStatsPositive();
																	
																	self.tics++;
																});
							}, _buffDuration * 1000 );
							
							return;
						}
						
						self._appliedEffectEnd(function() { });
					});
					
				break;
				case 3:
					
					// persistent
					
					_calculateStats();
					
					_insertStatsToDB(function()
					{
						after();
						
						_applyStatsPositive();
					} );
					
				break;
				default:
					
					log.addError( "Buff mechanic not implemented: " + args.buff.buff_mechanic_type );
			}
		}
		
		//
		// calculate the new stats
		//
		
		// evaluate crit
		this._checkCrit = function( _s, _p )
		{
			var _c = ( ( 0.05 * ( _s.character_level - _p.character_level ) * 0.01 ) + ( 25 * _s.character_attack / ( _s.character_level * 5 ) ) ) / 100;
				
			if( Math.random() < _c )
			{
				// we have a crit
				
				self.multiplier = 2;
				
				return true;
			}
			
			self.multiplier = 1;
			
			return false;
		}
		
		var _calculateStats = function()
		{
			var _b = args.buff;
			var _p = args.character.properties;
			
			// set values while ensuring we don't go over the imposed, per character, caps
			
			// happiness
			if(
				_b.buff_gain_happiness_min
				|| _b.buff_gain_happiness_max
				|| _b.buff_gain_happiness_percent
			)
			{
				self.appliedStats.happiness = ( _b.buff_gain_happiness_min + ( Math.random() * ( _b.buff_gain_happiness_max - _b.buff_gain_happiness_min ) ) ) + _p.character_happiness * _b.buff_gain_happiness_percent;
			}
			
			// hp
			if(
				_b.buff_gain_hp_min
				|| _b.buff_gain_hp_max
				|| _b.buff_gain_hp_percent
				|| _b.buff_gain_base_hp_percent
			)
			{
				var _s = args.source.properties;
				
				// check if this is a critical hit
				self._checkCrit( _s, _p );
				
				// calculate considering the damage type
				if( _b.buff_damage_type & 1 )
				{
					// physical damage
					var _hpChange = Math.round( ( ( _b.buff_gain_hp_min + ( Math.random() * ( _b.buff_gain_hp_max - _b.buff_gain_hp_min ) ) ) * self.multiplier + ( _p.character_hp_current * _b.buff_gain_hp_percent + _p.character_hp_base * _b.buff_gain_base_hp_percent ) +
																					( ( _b.buff_effect & 4 ) ? ( _s.character_strength / 2 ) : ( - ( _s.character_strength / 2 ) ) )
																	) * ( 1 - ( ( _p.character_armor / ( _p.character_armor + 200 ) ) / 4 ) ) );
				}
				else
				{
					// chemical damage
					var _er = Math.max( _p.character_resistance + ( _p.character_level - _s.character_level ) * 5, 0 );
					var _hpChange = ( _b.buff_gain_hp_min + ( Math.random() * ( _b.buff_gain_hp_max - _b.buff_gain_hp_min ) ) ) * self.multiplier + ( _p.character_hp_current * _b.buff_gain_hp_percent + _p.character_hp_base * _b.buff_gain_base_hp_percent ) +
																			( ( _b.buff_effect & 4 ) ? ( _s.character_potency / 2 ) : ( - ( _s.character_potency / 2 ) ) ); // check for heal / non heal effect
					
					// apply resistance
					_hpChange = Math.round( _hpChange * ( !( _b.buff_effect & 4 ) ? ( 1 - ( _er / ( _er + 200 ) ) ) : 1 ) );
				}
				
				if( _p.character_hp_current + _hpChange <= _p.character_hp_max && _hpChange != 0 )
				{
					// a change in the hp has occured and this change is under the max allowed hp
					
					self.appliedStats.hp_current = _hpChange;
				}
				else if( _p.character_hp_current < _p.character_hp_max )
				{
					// a change in the hp has occured and 
					// 		this change is over the max allowed hp
					//		the current hp is less than the max hp
					
					self.appliedStats.hp_current = ( _p.character_hp_max - _p.character_hp_current );
				}
				
				// stats update
				if( self.appliedStats.hp_current > 0 )
				{
					// healing
					stats.incrementNoCallback({
															characterObject: args.source,
															name: "buff_healed_points",
															value: self.appliedStats.hp_current
														});
					
					stats.incrementInstanceNoCallback({
															characterObject: args.source,
															name: "buff_healed_points",
															value: self.appliedStats.hp_current
														});
				}
				else if( self.appliedStats.hp_current < 0 )
				{
					// damage
					
					stats.incrementNoCallback({
															characterObject: args.source,
															name: "buff_damaged_points",
															value: self.appliedStats.hp_current
														});
					
					stats.incrementInstanceNoCallback({
															characterObject: args.source,
															name: "buff_damaged_points",
															value: self.appliedStats.hp_current
														});
				}
			
			}
			
			// speed
			if(
				_b.buff_gain_speed
				|| _b.buff_gain_speed_percent
			)
			{
				self.appliedStats.speed = Math.round( ( _b.buff_gain_speed + ( _b.buff_gain_speed_percent * _p.character_speed ) ) * 100 ) / 100;
			}
			
			// attack
			if(
				_b.buff_gain_attack_min
				|| _b.buff_gain_attack_max
				|| _b.buff_gain_attack_percent
			)
			{
				self.appliedStats.attack = ( _b.buff_gain_attack_min + ( Math.random() * ( _b.buff_gain_attack_max - _b.buff_gain_attack_min ) ) ) + _p.character_attack * _b.buff_gain_attack_percent;
			}
			
			// defense
			if(
				_b.buff_gain_defense_min
				|| _b.buff_gain_defense_max
				|| _b.buff_gain_defense_percent
			)
			{
				self.appliedStats.defense = ( _b.buff_gain_defense_min + ( Math.random() * ( _b.buff_gain_defense_max - _b.buff_gain_defense_min ) ) ) + _p.character_defense * _b.buff_gain_defense_percent;
			}
			
			// armor
			if(
				_b.buff_gain_armor_min
				|| _b.buff_gain_armor_max
				|| _b.buff_gain_armor_percent
			)
			{
				self.appliedStats.armor = ( _b.buff_gain_armor_min + ( Math.random() * ( _b.buff_gain_armor_max - _b.buff_gain_armor_min ) ) ) + _p.character_armor * _b.buff_gain_armor_percent;
			}
			
			// resistance
			if(
				_b.buff_gain_resistance_min
				|| _b.buff_gain_resistance_max
				|| _b.buff_gain_resistance_percent
			)
			{
				self.appliedStats.resistance = ( _b.buff_gain_resistance_min + ( Math.random() * ( _b.buff_gain_resistance_max - _b.buff_gain_resistance_min ) ) ) + _p.character_resistance * _b.buff_gain_resistance_percent;
			}
			
			// potency
			if(
				_b.buff_gain_potency_min
				|| _b.buff_gain_potency_max
				|| _b.buff_gain_potency_percent
			)
			{
				var _p = args.character.properties;
				
				self.appliedStats.potency = ( _b.buff_gain_potency_min + ( Math.random() * ( _b.buff_gain_potency_max - _b.buff_gain_potency_min ) ) ) + _p.character_potency * _b.buff_gain_potency_percent;
			}
			
			// strength
			if(
				_b.buff_gain_strength_min
				|| _b.buff_gain_strength_max
				|| _b.buff_gain_strength_percent
			)
			{
				self.appliedStats.strength = ( _b.buff_gain_strength_min + ( Math.random() * ( _b.buff_gain_strength_max - _b.buff_gain_strength_min ) ) ) + _p.character_strength * _b.buff_gain_strength_percent;
			}
			
			/*
			self.appliedStats = {
					happiness: 0,
					hp_current: ,
					hp_max: 0,
					speed: 0,
					attack: ,
					defense: 0,
					armor: 0,
					resistance: 0,
					potency: 0,
					strength: 0,
					energy: 0
				}
			*/
		}
		
		var _insertStatsToDB = function( afterFunction )
		{
			var _b = args.buff;
			var _p = args.character.properties;
			
			syncSQL.q(
						"call character_buff_add( " + _p.character_id + ", " + args.source.properties.character_id + ", " + _b.buff_id + ", " + args.source.properties.character_level + ", " + ( _b.buff_mechanic_tics - 1 ) + ", '" + args.character.getInstance().charactersCompareRelationship( args.source, args.character ) + "', '" + ( ( _b.buff_mechanic_type == 3 ) ? 'permanent' : 'temporary' ) + "', " + ( self.appliedStats.happiness ? self.appliedStats.happiness : 0 ) + ", " + ( self.appliedStats.hp_current ? self.appliedStats.hp_current : 0 ) + ", " + ( self.appliedStats.speed ? self.appliedStats.speed : 0 ) + ", " + ( self.appliedStats.attack ? self.appliedStats.attack : 0 ) + ", " + ( self.appliedStats.defense ? self.appliedStats.defense : 0 ) + ", " + ( self.appliedStats.armor ? self.appliedStats.armor : 0 ) + ", " + ( self.appliedStats.resistance ? self.appliedStats.resistance : 0 ) + ", " + ( self.appliedStats.potency ? self.appliedStats.potency : 0 ) + ", now() + interval " + ( _b.buff_mechanic_duration_seconds * _b.buff_mechanic_tics ) + " second, now() + interval " + _b.buff_cooldown_seconds + " second, " + _b.buff_cooldown_seconds + " )",
						function( res )
						{
							dbIndex = res[0].character_buff_id;
							
							afterFunction();
						}
					);
			
			return true;
		}
		
		var _updateStatsToDB = function( afterFunction )
		{
			syncSQL.q(
						"update `character_buffs` set " +
							"`cb_remaining_tics` = `cb_remaining_tics` - 1, " +
							" `cb_applied_happiness` = " + ( self.appliedStats.happiness ? self.appliedStats.happiness : 0 ) + ", " +
							" `cb_applied_hp` = " + ( self.appliedStats.hp_current ? self.appliedStats.hp_current : 0 ) + ", " +
							" `cb_applied_speed` = " + ( self.appliedStats.speed ? self.appliedStats.speed : 0 ) + ", " +
							" `cb_applied_attack` = " + ( self.appliedStats.attack ? self.appliedStats.attack : 0 ) + ", " +
							" `cb_applied_defense` = " + ( self.appliedStats.defense ? self.appliedStats.defense : 0 ) + ", " +
							" `cb_applied_armor` = " + ( self.appliedStats.armor ? self.appliedStats.armor : 0 ) + ", " +
							" `cb_applied_resistance` = " + ( self.appliedStats.resistance ? self.appliedStats.resistance : 0 ) + ", " +
							" `cb_applied_potency` = " + ( self.appliedStats.potency ? self.appliedStats.potency : 0 ) +
							" where `cb_id` = " + dbIndex,
						function( res )
						{
							afterFunction();
						}
					);
		}
		
		// add the applied effect to the char stats
		var _applyStatsPositive = function()
		{
			// apply differences to stats
			
			for( var i in self.appliedStats )
			{
				if( args.character.properties.character_hp_max > 0 )
				{
					// character is not invulnerable
					
					//log.add( "Applying stat change to " + i + ": " + self.appliedStats[ i ] );
					
					args.character.properties[ "character_" + i ] += self.appliedStats[ i ];
				}
				
				args.character.addHistory({
											c: "modify",
											bi: self.index,
											cr: ( self.multiplier == 2 ) ? true : false,
											a: i,
											m: self.appliedStats[ i ],
											s: args.source.properties.character_id
										});
			}
			
			if(
				args.character.properties.character_hp_current < 0
				&& args.character.properties.character_hp_max > 0
			)
			{
				// character is dead
				args.character.die({
										killerCharacterObject: args.source,
										killerBuffObject: self
									});
			}
		}
		
		// substract the applied effect to the char stats
		var _applyStatsNegative = function()
		{
			// apply differences to stats
			
			for( var i in self.appliedStats )
			{
				if( args.character.properties.character_hp_max > 0 )
				{
					// character is not invulnerable
					
					args.character.properties[ "character_" + i ] -= self.appliedStats[ i ];
				}
				
				if( i == "hp_current" )
				{
					// target will be stopped from casting
					//args.character.castInterrupt();
					
					// summon the events
					args.source.events._run( "damageGive", { toCharacterObject: args.character, amount: self.appliedStats[ i ] } );
					args.character.events._run( "damageTake", { fromCharacterObject: args.source, amount: self.appliedStats[ i ] } );
				}
				
				args.character.addHistory({
											c: "modify",
											bi: self.index,
											cr: ( self.multiplier == 2 ) ? true : false,
											a: i,
											m: -self.appliedStats[ i ],
											s: args.source.properties.character_id
										});
			}
			
			if(
				args.character.properties.character_hp_current <= 0
				&& args.character.properties.character_hp_max > 0
			)
			{
				// character is dead and he is not invulnerable
				
				args.character.die({
										killerCharacterObject: args.source,
										killerBuffObject: self
									});
			}
		}
		
		this._requestEnd = function( after )
		{
			if( requestedEnd == true )
			{
				after();
				
				return false;
			}
			
			// make sure we mark this buff to end asap
			requestedEnd = true;
			
			if( interval != null )
			{
				// there is still an active timed effect in order. this must be a cleanse
				
				log.addWarning( "early effect end for " + args.buff.buff_id );
				
				// make sure any periodic effect function is stopped
				clearInterval( interval );
				
				// run the final function for the active effect. e.g. for boomerang perform the reverse
				_finalizeFunction();
				
				self._appliedEffectEnd( after );
			}
			else if( args.buff.buff_mechanic_type == 3 )
			{
				// end a passive buff
				
				_applyStatsNegative();
				
				self._appliedEffectEnd( after );
			}
			else
			{
				after();
			}
			
			return true;
		}
		
		this._cleanup = function()
		{
			//log.add( "cleaned up " + args.buff.buff_id );
			
			//delete self;
		}
		
		this._removeCooldown = function()
		{
			//log.add( "entering remove cooldown " + args.buff.buff_id );
			
			// remove cooldown only if the buff was not spawned
			
			syncSQL.q(
						"call character_buff_remove_cooldown( " + args.character.properties.character_id + ", " + args.buff.buff_id + " )",
						function( res )
						{
							args.source.sendToClient( JSON.stringify({
																			c: "removeCooldown",
																			r: 200,
																			b: args.buff.buff_id
																		}) );
							
							if( self.appliedEffectEnded )
							{
								self._cleanup();
							}
							
							//log.add( "finished remove cooldown " + args.buff.buff_id );
							self.removedCooldown = true;
						}
					);
		}
		
		// buff applied effect ended
		this._appliedEffectEnd = function( after )
		{
			//log.add( "entering applied effect end " + args.buff.buff_id );
			
			if( args.buff.buff_effect - 1 == 4 )
			{
				// this buff has disarmed the char. it is time to rearm
				
				args.character.setArmsEnabled();
			}
			
			if( args.buff.buff_effect - 1 == 6 )
			{
				// this buff has stealthed the character
				
				args.character.setVisibleEnabled();
			}
			
			if( args.buff.buff_effect - 1 == 7 )
			{
				// character was previously stunned
				
				args.character.setStunDisabled();
			}
			
			syncSQL.q(
						"call character_buff_active_delete( " + dbIndex + " )",
						function( res )
						{
							after();
							
							// instruct the client to remove the buff completely
							
							// remove the activeBuff from the target
							delete args.character.activeBuffs[ self.index ];
							
							// Decrement the number of effects applied by the buff on target
							args.character.appliedEffects[ args.buff.buff_effect - 1 ]--;
							
							// add the history to the character
							args.character.addHistory({
														c: "del_buff",
														bi: self.index,
														bid: args.buff.buff_id
													});
							
							if( self.removedCooldown )
							{
								self._cleanup();
							}
							
							//log.add( "finished applied effect end " + args.buff.buff_id );
							
							self.appliedEffectEnded = true;
							
							self.events._run( "appliedEffectEnd", {} );
						}
					);
		}
		
		// apply the cascading spawned buff on to the target
		var _applySpawn = function( sourceCharacter, targetCharacter )
		{
			if( args.buff.buff_spawn_id_buff == null )
			{
				return false;
			}
			
			var _bs = targetCharacter.getInstance().getArgs().buffsStructure, _sb = _bs[ args.buff.buff_spawn_id_buff ];
			
			log.add( "Spawning " + _sb.buff_name + " ( " + _sb.buff_id + " ) " );
			
			return new activeBuff({
										source: sourceCharacter,
										character: targetCharacter,
										buff: _sb,
										sourceIsFriendly: args.sourceIsFriendly,
										spawnedBuff: true
									});
		}
		
		// apply the cascading spawned buff on to the target
		var _applyReflect = function()
		{
			var _bs = args.source.getInstance().getArgs().buffsStructure, _sb = args.buff;
			
			log.add( "Reflecting " + _sb.buff_name + " ( " + _sb.buff_id + " ) " );
			
			return new activeBuff({
										source: args.source,
										character: args.source,
										buff: _sb,
										sourceIsFriendly: true,
										spawnedBuff: true
									});
		}
		
		// apply any cleave mechanic
		var _applyCleave = function()
		{
			if(
				args.buff.buff_area_type & 1
				|| args.cleavedBuff == true
			)
			{
				// point
				
				return false;
			}
			
			switch( args.buff.buff_area_type )
			{
				case 2:
					
					// circle
					
					var _affectedUnits = 0, _iO = args.source.getInstance();
					
					_iO._checkRadialCollisions({
												radius: args.buff.buff_area_radius,
												addCondition: function( _c )
												{
													return true;
												},
												onCollide: function( _c, _item )
												{
													// still in range
													
													if( _c.properties.character_id != args.source.properties.character_id || _affectedUnits > args.buff.buff_area_targets_number )
													{
														return;
													}
													
													if( !_iO.castCompareRelationshipToTarget( args.source, args.buff, _item, args.sourceIsFriendly ) )
													{
														// target is not in the same relationship with the source as the current target
														
														return;
													}
													
													// target is eligible for cleave
													
													log.add( "Casting buff cleaved on " + _item.properties.character_name );
													
													_affectedUnits++;
													
													new activeBuff({
																	source: args.source,
																	character: _item,
																	buff: args.buff,
																	sourceIsFriendly: args.sourceIsFriendly,
																	spawnedBuff: false,
																	cleavedBuff: true
																});
												},
												onNotCollide: function( _c, _item )
												{
													
												}
											});
					
					
					/*
					//log.addNotice( "Casted a circle cleave with radius of: " + args.buff.buff_area_radius + " on " + args.buff.buff_area_targets_number + " targets" );
					
					var centerCell = args.character.getCenterGridCell();
					
					var targetPoints = args.schemes.radial[ args.buff.buff_area_radius ].calculatedPoints;
					
					for(var i=0;i<targetPoints.length;i++)
					{
						var chars = centerCell.getRelativeCellCharacters( targetPoints[ i ].x, targetPoints[ i ].y );
						
						// got all the chars on the cell
						for(var j in chars)
						{
							//log.add( JSON.stringify( targetPoints[ i ] ) + ": " + chars[j].properties.character_id );
							
							if( !args.character.getInstance().castCompareRelationshipToTarget( args.source, args.buff, chars[ j ], args.sourceIsFriendly ) )
							{
								// target is not in the same relationship with the source as the current target
								
								//log.addNotice( "Target " + chars[j].properties.character_id + " does not match the target requirement" );
								
								continue;
							}
							
							log.add( "Casting buff cleaved" );
							
							new activeBuff({
											source: args.source,
											character: chars[ j ],
											buff: args.buff,
											sourceIsFriendly: args.sourceIsFriendly,
											schemes: args.schemes,
											spawnedBuff: false,
											cleavedBuff: true
										});
						}
					}
					*/
					
				break;
				case 3:
					
					// cone
					
				break;
			}
			
			return true;
		}
		
		var _checkStacks = function()
		{
			var _existingStacks = 0, _existingBuff = null;
			
			for(var i in args.character.activeBuffs)
			{
				var _ab = args.character.activeBuffs[ i ];
				
				if( _ab.buff.buff_id != args.buff.buff_id )
				{
					continue;
				}
				
				if( _existingBuff == null )
				{
					// this is to ensure that the variable will have the oldest value in the queue
					
					_existingBuff = _ab;
				}
				
				_existingStacks++;
			}
			
			if( args.buff.buff_max_stacks <= _existingStacks )
			{
				// reached the max stacks limit
				
				return _existingBuff;
			}
			
			return true;
		}
		
		var _scriptCode = new ( args.character.getInstance().getArgs().buffsScripts[ args.buff.buff_id ] )( self );
		
		// mark the buff as in cooldown
		
		if( args.buff.buff_cooldown_seconds && args.spawnedBuff != true )
		{
			args.source.buffs[ args.buff.buff_id ].inCooldown = true;
			
			setTimeout( function()
			{
				args.source.buffs[ args.buff.buff_id ].inCooldown = false;
			}, args.buff.buff_cooldown_seconds * 1000 );
		}
		
		// evaluate hit or miss
		
		if(
			args.spawnedBuff
			|| (
				this._checkType()
				&& this._checkPrerequisiteEffect()
				&& this._checkHit()
			)
		)
		{
			// hit
			
			if( args.character.spellReflectCheck() )
			{
				// spell must be reflected onto source
				
				_applyReflect();
				
				return;
			}
			
			// spell is not reflected, check if the max stacks for it have been reached
			
			var _eb = _checkStacks();
			
			if( _eb !== true )
			{
				// reached the max stacks for this buff. terminate the one returned by the stacks checker
				
				_eb._requestEnd(function() { });
			}
			
			// we can still add another stack of this buff
			
			//log.add( "Hit " + args.buff.buff_id );
			
			// add this buff to the active buffs list
			this.index = args.character.activeBuffs.push( this ) - 1;
			
			_calculateEffect(function()
			{
				// the buff duration is established for sure at this point
				
				args.character.addHistory({
										c: "add_buff",
										bid: args.buff.buff_id,
										bi: self.index,
										n: args.buff.buff_name,
										d: args.buff.buff_description,
										ty: args.buff.buff_type,
										t: args.buff.buff_mechanic_tics,
										s: _buffDuration,
										aers: _buffDuration * args.buff.buff_mechanic_tics,
										e: args.buff.buff_effect - 1,
										sid: args.source.properties.character_id,
										ra: args.buff.buff_target_range
									});
				
				endTime = ( new Date() ).getTime() + ( _buffDuration * args.buff.buff_mechanic_tics * 1000 );
				
				_applyMechanic(function()
				{
					_applyCleave();
					
					// run the associated script
					_scriptCode.specific();
					
					// run the cooldown end handler
					if( !args.spawnedBuff )
					{
						setTimeout( self._removeCooldown, args.buff.buff_cooldown_seconds * 1000 );
					}
					else
					{
						self.removedCooldown = true;
					}
					
					// request spawn
					_applySpawn( args.source, args.character );
				});
			});
			
			// update stats
			stats.incrementNoCallback({
											characterObject: args.source,
											name: "lifetime_buff_hits",
											value: 1
										});
		}
		else
		{
			// miss
			
			//log.add( "Miss " + args.buff.buff_id );
			
			// remove the activeBuff from the target
			delete args.character.activeBuffs[ self.index ];
			
			args.character.addHistory({
												c: "add_buff_miss",
												bid: args.buff.buff_id,
												n: args.buff.buff_name,
												ra: args.buff.buff_target_range,
												sid: args.source.properties.character_id
											});
			
			// run the cooldown end handler
			setTimeout( self._removeCooldown, args.buff.buff_cooldown_seconds * 1000 );
			
			// update stats
			stats.incrementNoCallback({
													characterObject: args.source,
													name: "lifetime_buff_miss",
													value: 1
												});
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//
	// Buff resuming
	//
	
	var resumeBuff = function( args )
	{
		var self = this, interval = null, dbIndex = null, endTime = null, requestedEnd = false, _buffDuration = args.buff.buff_mechanic_duration_seconds;
		
		this.index = args.character.activeBuffs.push( this ) - 1; // make sure it is a string
		this.tics = 0;
		this.appliedStats = {};
		this.sourceIsFriendly = true;
		this.buff = args.buff;
		
		this.multiplier = 1;
		
		this.getSource = function()
		{
			return args.character;
		}
		
		this.getCharacter = function()
		{
			return args.character;
		}
		
		this.getBuff = function()
		{
			return args.buff;
		}
		
		//
		// apply the buff considering its mechanic type
		//
		
		var _finalizeFunction = function() { };
		
		var _applyMechanic = function( after )
		{
			switch( args.buff.buff_mechanic_type )
			{
				case 1:
					
					// boomerang
					
					_finalizeFunction =	function()
					{
						_applyStatsNegative();
					}
					
					if( requestedEnd == true )
					{
						// end asap handler
						
						_applyStatsNegative();
						
						self._appliedEffectEnd( after );
						
						return;
					}
					
					interval = setTimeout(
											function()
											{
												interval = null;
												
												_applyStatsNegative();
												
												self._appliedEffectEnd( after );
											},
											args.buff.cb_applied_effect_remaining_seconds * 1000
										);
					
				break;
				case 2:
					
					// tic
					
					var effectFunction = function()
					{
						if( args.buff.cb_remaining_tics < self.tics )
						{
							// make sure it will not execute any function periodically
							clearInterval( interval );
							
							interval = null;
							
							self._appliedEffectEnd( after );
							
							return;
						}
						
						_calculateStats();
						
						_updateStatsToDB(	function()
														{
															_applyStatsPositive();
															
															self.tics++;
														});
					};
					
					if( requestedEnd == true )
					{
						self._appliedEffectEnd( after );
						
						return;
					}
					
					interval = setTimeout( function()
					{
						self.tics++;
						
						effectFunction();
						
						interval = setInterval(
												effectFunction,
												_buffDuration * 1000
											);
					}, ( args.buff.cb_applied_effect_remaining_seconds - ( _buffDuration * ( Math.max( args.buff.cb_remaining_tics - 1, 0 ) ) ) ) * 1000 );
					
				break;
				case 3:
					
					// persistent
					
					_calculateStats();
					
					_applyStatsPositive();
					
				break;
				default:
					
					log.addError( "Buff mechanic not implemented: " + args.buff.buff_mechanic_type );
			}
		}
		
		// evaluate crit
		this._checkCrit = function( _s, _p )
		{
			var _c = ( ( 0.05 * ( _s.character_level - _p.character_level ) * 0.01 ) + ( 25 * _s.character_attack / ( _s.character_level * 5 ) ) ) / 100;
			
			if( Math.random() < _c )
			{
				// we have a crit
				
				self.multiplier = 2;
				
				return true;
			}
			
			self.multiplier = 1;
			
			return false;
		}
		
		var _calculateStats = function()
		{
			var _b = args.buff;
			var _p = args.character.properties;
			
			// set values while ensuring we don't go over the imposed, per character, caps
			
			// happiness
			if(
				_b.buff_gain_happiness_min
				|| _b.buff_gain_happiness_max
				|| _b.buff_gain_happiness_percent
			)
			{
				self.appliedStats.happiness = ( _b.buff_gain_happiness_min + ( Math.random() * ( _b.buff_gain_happiness_max - _b.buff_gain_happiness_min ) ) ) + _p.character_happiness * _b.buff_gain_happiness_percent;
			}
			
			// hp
			if(
				_b.buff_gain_hp_min
				|| _b.buff_gain_hp_max
				|| _b.buff_gain_hp_percent
				|| _b.buff_gain_base_hp_percent
			)
			{
				var _s = args.character.properties;
				
				// check if this is a critical hit
				self._checkCrit( _s, _p );
				
				// calculate considering the damage type
				if( _b.buff_damage_type & 1 )
				{
					// physical damage
					var _hpChange = Math.round( ( ( _b.buff_gain_hp_min + ( Math.random() * ( _b.buff_gain_hp_max - _b.buff_gain_hp_min ) ) ) * self.multiplier + ( _p.character_hp_current * _b.buff_gain_hp_percent + _p.character_hp_base * _b.buff_gain_base_hp_percent ) +
																		( ( _b.buff_effect & 4 ) ? ( _s.character_strength / 2 ) : ( - ( _s.character_strength / 2 ) ) )
																	) * ( 1 - ( ( _p.character_armor / ( _p.character_armor + 200 ) ) / 4 ) ) );
				}
				else
				{
					// chemical damage
					var _er = _p.character_resistance + ( _p.character_level - _s.character_level ) * 5;
					var _hpChange = ( _b.buff_gain_hp_min + ( Math.random() * ( _b.buff_gain_hp_max - _b.buff_gain_hp_min ) ) ) * self.multiplier + ( _p.character_hp_current * _b.buff_gain_hp_percent + _p.character_hp_base * _b.buff_gain_base_hp_percent ) +
																			( ( _b.buff_effect & 4 ) ? ( _s.character_potency / 2 ) : ( - ( _s.character_potency / 2 ) ) ) // check for heal / non heal effect
					
					// apply resistance
					_hpChange = Math.round( _hpChange * ( !( _b.buff_effect & 4 ) ? ( _er / ( _er + 200 ) ) : 1 ) );
				}
				
				// this is the new hp on the target
				var _newHP = _p.character_hp_current + _hpChange;
				
				if( _newHP <= _p.character_hp_max )
				{
					// a change in the hp has occured and this change is under the max allowed hp
					
					self.appliedStats.hp_current = _hpChange;
				}
				else if( _p.character_hp_current < _p.character_hp_max )
				{
					// a change in the hp has occured and 
					// 		this change is over the max allowed hp
					//		the current hp is less than the max hp
					
					self.appliedStats.hp_current = ( _p.character_hp_max - _p.character_hp_current );
				}
			}
			
			// speed
			if(
				_b.buff_gain_speed
			)
			{
				self.appliedStats.speed = _b.buff_gain_speed;
			}
			
			// attack
			if(
				_b.buff_gain_attack_min
				|| _b.buff_gain_attack_max
				|| _b.buff_gain_attack_percent
			)
			{
				self.appliedStats.attack = ( _b.buff_gain_attack_min + ( Math.random() * ( _b.buff_gain_attack_max - _b.buff_gain_attack_min ) ) ) + _p.character_attack * _b.buff_gain_attack_percent;
			}
			
			// defense
			if(
				_b.buff_gain_defense_min
				|| _b.buff_gain_defense_max
				|| _b.buff_gain_defense_percent
			)
			{
				self.appliedStats.defense = ( _b.buff_gain_defense_min + ( Math.random() * ( _b.buff_gain_defense_max - _b.buff_gain_defense_min ) ) ) + _p.character_defense * _b.buff_gain_defense_percent;
			}
			
			// armor
			if(
				_b.buff_gain_armor_min
				|| _b.buff_gain_armor_max
				|| _b.buff_gain_armor_percent
			)
			{
				self.appliedStats.armor = ( _b.buff_gain_armor_min + ( Math.random() * ( _b.buff_gain_armor_max - _b.buff_gain_armor_min ) ) ) + _p.character_armor * _b.buff_gain_armor_percent;
			}
			
			// resistance
			if(
				_b.buff_gain_resistance_min
				|| _b.buff_gain_resistance_max
				|| _b.buff_gain_resistance_percent
			)
			{
				self.appliedStats.resistance = ( _b.buff_gain_resistance_min + ( Math.random() * ( _b.buff_gain_resistance_max - _b.buff_gain_resistance_min ) ) ) + _p.character_resistance * _b.buff_gain_resistance_percent;
			}
			
			// potency
			if(
				_b.buff_gain_potency_min
				|| _b.buff_gain_potency_max
				|| _b.buff_gain_potency_percent
			)
			{
				var _p = args.character.properties;
				
				self.appliedStats.potency = ( _b.buff_gain_potency_min + ( Math.random() * ( _b.buff_gain_potency_max - _b.buff_gain_potency_min ) ) ) + _p.character_potency * _b.buff_gain_potency_percent;
			}
			
			// strength
			if(
				_b.buff_gain_strength_min
				|| _b.buff_gain_strength_max
				|| _b.buff_gain_strength_percent
			)
			{
				self.appliedStats.strength = ( _b.buff_gain_strength_min + ( Math.random() * ( _b.buff_gain_strength_max - _b.buff_gain_strength_min ) ) ) + _p.character_strength * _b.buff_gain_strength_percent;
			}
			
			/*
			self.appliedStats = {
					happiness: 0,
					hp_current: ,
					hp_max: 0,
					speed: 0,
					attack: ,
					defense: 0,
					armor: 0,
					resistance: 0,
					potency: 0,
					strength: 0,
					energy: 0
				}
			*/
		}
		
		var _updateStatsToDB = function( afterFunction )
		{
			syncSQL.q(
						"update `character_buffs` set " +
							"`cb_remaining_tics` = `cb_remaining_tics` - 1, " +
							" `cb_applied_happiness` = " + ( self.appliedStats.happiness ? self.appliedStats.happiness : 0 ) + ", " +
							" `cb_applied_hp` = " + ( self.appliedStats.hp_current ? self.appliedStats.hp_current : 0 ) + ", " +
							" `cb_applied_speed` = " + ( self.appliedStats.speed ? self.appliedStats.speed : 0 ) + ", " +
							" `cb_applied_attack` = " + ( self.appliedStats.attack ? self.appliedStats.attack : 0 ) + ", " +
							" `cb_applied_defense` = " + ( self.appliedStats.defense ? self.appliedStats.defense : 0 ) + ", " +
							" `cb_applied_armor` = " + ( self.appliedStats.armor ? self.appliedStats.armor : 0 ) + ", " +
							" `cb_applied_resistance` = " + ( self.appliedStats.resistance ? self.appliedStats.resistance : 0 ) + ", " +
							" `cb_applied_potency` = " + ( self.appliedStats.potency ? self.appliedStats.potency : 0 ) +
							" where `cb_id` = " + args.buff.cb_id,
						function( res )
						{
							afterFunction();
						}
					);
		}
		
		// substract the applied effect to the char stats
		var _applyStatsNegative = function()
		{
			// apply differences to stats
			
			for( var i in self.appliedStats )
			{
				if( args.character.properties.character_hp_max > 0 )
				{
					// character is not invulnerable
					
					args.character.properties[ "character_" + i ] -= self.appliedStats[ i ];
				}
				
				args.character.addHistory({
											c: "modify",
											bi: self.index,
											cr: ( self.multiplier == 2 ) ? true : false,
											a: i,
											m: -self.appliedStats[ i ]
										});
			}
			
			if(
				args.character.properties.character_hp_current <= 0
				&& args.character.properties.character_hp_max > 0
			)
			{
				// character is dead
				
				args.character.die({
										killerCharacterObject: args.source,
										killerBuffObject: self
									});
			}
		}
		
		// add the applied effect to the char stats
		var _applyStatsPositive = function()
		{
			// apply differences to stats
			
			for( var i in self.appliedStats )
			{
				if( args.character.properties.character_hp_max > 0 )
				{
					// character is not invulnerable
					
					args.character.properties[ "character_" + i ] += self.appliedStats[ i ];
				}
				
				args.character.addHistory({
											c: "modify",
											bi: self.index,
											cr: ( self.multiplier == 2 ) ? true : false,
											a: i,
											m: self.appliedStats[ i ]
										});
			}
			
			if(
				args.character.properties.character_hp_current <= 0
				&& args.character.properties.character_hp_max > 0
			)
			{
				// character is dead
				
				args.character.die({
										killerCharacterObject: args.source,
										killerBuffObject: self
									});
			}
		}
		
		// buff applied effect ended
		this._appliedEffectEnd = function( after )
		{
			// remove the activeBuff from the target
			delete args.character.activeBuffs[ self.index ];
			
			if( args.buff.buff_effect - 1 == 4 )
			{
				// this buff has disarmed the char. it is time to rearm
				
				args.character.setArmsEnabled();
			}
			
			if( args.buff.buff_effect - 1 == 6 )
			{
				// this buff has stealthed the character
				
				args.character.setVisibleEnabled();
			}
			
			// Decrement the number of effects applied by the buff on target
			args.character.appliedEffects[ args.buff.buff_effect - 1 ]--;
			
			// add the history to the character
			args.character.addHistory({
										c: "del_buff",
										bi: self.index,
										bid: args.buff.buff_id
									});
									
			self._cleanup();
			
			after();
		}
		
		this._cleanup = function()
		{
			syncSQL.q(
						"call character_buff_active_delete( " + args.buff.cb_id + " )",
						function( res )
						{
							// instruct the client to remove the cooldown on the buff
							
							//delete self;
						}
					);
		}
		
		this.getRemainingEffectTime = function()
		{
			var _b = args.buff;
			
			if( endTime == null )
			{
				return false;
			}
			
			return Math.floor( ( endTime - ( new Date() ).getTime() ) / 1000 );
		}
		
		this._requestEnd = function( after )
		{
			if( requestedEnd == true )
			{
				after();
				
				return false;
			}
			
			// make sure we mark this buff to end asap
			requestedEnd = true;
			
			if( interval != null )
			{
				// there is still an active timed effect in order. this must be a cleanse
				
				log.addWarning( "early effect end for " + args.buff.buff_id );
				
				// make sure any periodic effect function is stopped
				clearInterval( interval );
				
				// run the final function for the active effect. e.g. for boomerang perform the reverse
				_finalizeFunction();
				
				self._appliedEffectEnd( after );
			}
			else if( args.buff.buff_mechanic_type == 3 )
			{
				// end a passive buff
				
				_applyStatsNegative();
				
				self._appliedEffectEnd( after );
			}
			else
			{
				after();
			}
			
			return true;
		}
		
		// resume buff
		
		log.add( "Resuming buff: " + args.buff.buff_id + " ( " + args.buff.cb_id + " ) " );
		
		if(
			args.buff.cb_applied_effect_remaining_seconds > 0
			|| ( args.buff.cb_source & 1 && args.buff.cb_lifetime & 1 )
		)
		{
			// self-applied passive or active buff still having effect time
			
			endTime = ( new Date() ).getTime() + ( args.buff.cb_applied_effect_remaining_seconds * 1000 );
			
			// Increment the number of effects applied by the buff on target
			args.character.appliedEffects[ args.buff.buff_effect - 1 ]++;
			
			// make sure we're on the right point on the progression
			
			self.appliedStats.happiness = args.buff.cb_applied_happiness;
			self.appliedStats.hp_current = args.buff.cb_applied_hp;
			self.appliedStats.speed = args.buff.cb_applied_speed;
			self.appliedStats.attack = args.buff.cb_applied_attack;
			self.appliedStats.defense = args.buff.cb_applied_defense;
			self.appliedStats.armor = args.buff.cb_applied_armor;
			self.appliedStats.resistance = args.buff.cb_applied_resistance;
			self.appliedStats.potency = args.buff.cb_applied_potency;
			
			self.tics = args.buff.buff_mechanic_tics - args.buff.cb_remaining_tics;
			
			// start the effect
			
			_applyMechanic(function()
			{
				// run the associated script
				args.character.getInstance().getArgs().buffsScripts[ args.buff.buff_id ]( self );
			});
			
		}
		else
		{
			// buff does not need to exist anymore
			
			// remove the activeBuff from the target
			delete args.character.activeBuffs[ self.index ];
			
			syncSQL.q(
						"call character_buff_active_delete( " + args.buff.cb_id + " )",
						function( res )
						{
							log.addNotice( "Removed expired buff " + args.buff.buff_id + " ( " + args.buff.cb_id + " ) " );
							
							//delete self;
						}
					);
		}
	}
	
	var removeBuff = function( args )
	{
		var _ab = args.character.activeBuffs, requestedBuffEnds = 0;
		for( var i in _ab )
		{
			if( _ab[ i ].buff.buff_id != args.buff.buff_id )
			{
				continue;
			}
			
			requestedBuffEnds++;
			
			_ab[ i ]._requestEnd(function()
			{
				requestedBuffEnds--;
				
				if( requestedBuffEnds <= 0 )
				{
					args.after();
				}
			});
			
			// refresh the search list
			_ab = args.character.activeBuffs
		}
		
		if( requestedBuffEnds <= 0 )
		{
			args.after();
		}
	}
	
	
	var applyCalculatedHP = function( args )
	{
		var _b = args.buffObject.getBuff();
		var _s = args.buffObject.getSource().properties;
		var _p = args.buffObject.getCharacter().properties;
		
		// check if this is a critical hit
		args.buffObject._checkCrit( _s, _p );
		
		// calculate considering the damage type
		if( _b.buff_damage_type & 1 )
		{
			// physical damage
			var _hpChange = Math.round( ( ( args.buff_gain_hp_min + ( Math.random() * ( args.buff_gain_hp_max - args.buff_gain_hp_min ) ) ) * args.buffObject.multiplier + ( _p.character_hp_current * args.buff_gain_hp_percent + _p.character_hp_base * args.buff_gain_base_hp_percent ) +
																( ( _b.buff_effect & 4 ) ? ( _s.character_strength / 2 ) : ( - ( _s.character_strength / 2 ) ) )
															) * ( 1 - ( ( _p.character_armor / ( _p.character_armor + 200 ) ) / 4 ) ) );
		}
		else
		{
			// chemical damage
			var _er = Math.max( _p.character_resistance + ( _p.character_level - _s.character_level ) * 5, 0 );
			var _hpChange = ( args.buff_gain_hp_min + ( Math.random() * ( args.buff_gain_hp_max - args.buff_gain_hp_min ) ) ) * args.buffObject.multiplier + ( _p.character_hp_current * args.buff_gain_hp_percent + _p.character_hp_base * args.buff_gain_base_hp_percent ) +
																	( ( _b.buff_effect & 4 ) ? ( _s.character_potency / 2 ) : ( - ( _s.character_potency / 2 ) ) ); // check for heal / non heal effect
			
			// apply resistance
			_hpChange = Math.round( _hpChange * ( !( _b.buff_effect & 4 ) ? ( 1 - ( _er / ( _er + 200 ) ) ) : 1 ) );
		}
		
		if( _p.character_hp_current + _hpChange <= _p.character_hp_max && _hpChange != 0 )
		{
			// a change in the hp has occured and this change is under the max allowed hp
			
			args.buffObject.appliedStats.hp_current = _hpChange;
		}
		else if( _p.character_hp_current < _p.character_hp_max )
		{
			// a change in the hp has occured and 
			// 		this change is over the max allowed hp
			//		the current hp is less than the max hp
			
			args.buffObject.appliedStats.hp_current = ( _p.character_hp_max - _p.character_hp_current );
		}
		
		// stats update
		if( args.buffObject.appliedStats.hp_current > 0 )
		{
			// healing
			stats.incrementNoCallback({
													characterObject: args.buffObject.getSource(),
													name: "buff_healed_points",
													value: args.buffObject.appliedStats.hp_current
												});
			
			stats.incrementInstanceNoCallback({
													characterObject: args.buffObject.getSource(),
													name: "buff_healed_points",
													value: args.buffObject.appliedStats.hp_current
												});
		}
		else if( args.buffObject.appliedStats.hp_current < 0 )
		{
			// damage
			
			stats.incrementNoCallback({
													characterObject: args.buffObject.getSource(),
													name: "buff_damaged_points",
													value: args.buffObject.appliedStats.hp_current
												});
			
			stats.incrementInstanceNoCallback({
													characterObject: args.buffObject.getSource(),
													name: "buff_damaged_points",
													value: args.buffObject.appliedStats.hp_current
												});
		}
	}
	
	//
	// class exports
	//
	
	exports.activeBuff = activeBuff;
	exports.resumeBuff = resumeBuff;
	exports.removeBuff = removeBuff;
	exports.applyCalculatedHP = applyCalculatedHP;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	