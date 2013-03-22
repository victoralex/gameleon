	
    "use strict"; // enable strict mode within this file
	
	var log = require( "./class.log" ),
		syncSQL = new ( require('../../includes/classes/class.syncSQL') ).p,
		realmConfig = require('../config.realm').config,
		buffEffect = require( "./class.buffEffect" ),
		npc = require( "./class.npc" ),
		quest = require( './class.quest' ),
		stats = require( "./class.stats" ),
		redis = require( realmConfig.libraries.redisPath ),
		transaction = require( "./class.transactions" ).transaction,
		chatChannel = require( "./class.chatChannel" );
	
	//
	// Character Object
	//
	
	exports.character = function( args, afterFunction )
	{
		var self = this,
				instanceObject = null,
				resumedAppliedActiveBuffs = false,
				resumedSpellbookCooldowns = false,
				resumedRacialPassiveBuffs = false,
				maxCharacterDistance = realmConfig.realmMaxCharacterDistance,
				_corpseCharacterObject = null,
				_ownerCharacterObject = null,
				_lastWeaponDamageStats = {},
				_opponentsNumber = 0,
				_movementUpdatePointer;
		
		// chat specific
		this.chatChannels = {
								instance: [],
								global: [],
								whisper: [],
								say: [],
								yell: []
							};
		this.currentChatChannel = "";
		this.availableAmountOfMessagesToSend = realmConfig.chat.limitMessagesAmount;
		
		this.redisClient = null;
		
		// location specific
		this.collidingWith = [];
		this.inAuraOf = [];
		
		// vendor specific
		this.soldItems = [];
		
		// quests specific
		this.activeQuests = [];
		this.activeQuestsDataToSend = {};
		this.associatedQuests = {};									// questGiver
		
		// buffs specific
		this.buffs = [];													// buffs this character is able to cast from the spellbook
		this.appliedEffects = [ 0, 0, 0, 0, 0, 0, 0, 0 ];			// cleanse, bleed, stun, heal, disarm, modifier, stealth, charge
		this.activeBuffs = [];											// buffs happening on this character
		this.effectsAppliedLately = { stun: 0 };
		
		// profile
		this.properties = {};											// properties from the character_profile_full table
		this.opponents = [];
		this.enemies = {};
		this.meleeEnemiesAmount = 0;
		this.inCombat = false;
		this.isResurrectable = true;
		this.isCasting = false;
		this.mayMove = true;
		this.mayBroadcast = true;
		this.isAlive = true;
		this.joinDate = new Date();
		this.currentPath = [];
		
		//
		// Events
		//
		
		this.events = {
			
			afterInit: [],
			
			use: [],
			disconnect: [],
			bindToInstance: [],
			
			die: [],
			beforeDie: [],
			resurrect: [],
			
			damageTake: [],
			damageGive: [],
			
			auraEnter: [],
			auraLeave: [],
			
			addedOpponent: [],
			removedOpponent: [],
			killedOpponent: [],
			
			combatEnter: [],
			combatLeave: [],
			
			lootGrab: [],
			lootGiven: [],
			
			vendorSoldItem: [],
			buyerBoughtItem: [],
			vendorBoughtItem: [],
			buyerSoldItem: [],
			
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
		// Getters
		//
		
		this.getArgs = function()
		{
			return args;
		}
		
		//
		// (Un)Usable
		//
		
		this.setUnUsable = function()
		{
			if( self.properties.character_is_usable == null )
			{
				// already unusable
				
				return false;
			}
			
			self.properties.character_is_usable = null;
			
			log.addWarning( "object " + self.properties.character_id_object_pool + " is now unusable" );
			
			self.addHistory({
							c: "command_set_unusable"
						});
		}
		
		this.setUsable = function()
		{
			if( self.properties.character_is_usable != null )
			{
				// already usable
				
				return false;
			}
			
			self.properties.character_is_usable = '';
			
			log.addWarning( "object " + self.properties.character_id_object_pool + " is now usable" );
			
			self.addHistory({
							c: "command_set_usable"
						});
		}
		
		//
		// Casting & Channelling 
		//
		
		var _castFunctionTimeout = null;
		this.castStart = function( args )
		{
			if( self.isCasting )
			{
				return false;
			}
			
			self.isCasting = true;
			
			self.addHistory({
							c: "command_cast_start",
							d: args.description,
							t: args.duration
						});
			
			// redefine the casting cancel handler
			self.castInterrupt = function()
			{
				self.isCasting = false;
				self.castInterrupt = self.castInterruptDefault;
				clearTimeout( _castFunctionTimeout );
				
				self.addHistory({
								c: "command_cast_interrupt"
							});
				
				args.onInterrupt();
				
				return true;
			}
			
			var _castFunctionTimeout = setTimeout( function()
			{
				self.isCasting = false;
				self.castInterrupt = self.castInterruptDefault;
				
				self.addHistory({
								c: "command_cast_complete"
							});
				
				args.onComplete();
			}, args.duration );
		}
		
		this.castInterruptDefault = function()
		{
			return false;
		}
		
		this.castInterrupt = this.castInterruptDefault;
		
		//
		// Buffs handling
		//
		
		this.spellReflectCheckDefault = function()
		{
			return false;
		}
		
		this.spellReflectCheckAltered = function()
		{
			return Math.random() < 0.5;
		}
		
		this.spellReflectCheck = function()
		{
			return false;
		}
		
		this.setSpellReflectEnabled = function()
		{
			self.spellReflectCheck = self.spellReflectCheckAltered;
		}
		
		this.setSpellReflectDisabled = function()
		{
			self.spellReflectCheck = self.spellReflectCheckDefault;
		}
		
		this.setSpellReflectDisabled();
		
		//
		// Strike calculations
		//
		
		this.getStrikeValue = function( targetCharacterObject, critMultiplier )
		{
			var _sp = self.properties, _cp = targetCharacterObject.properties;
			
			return Math.round(
									( ( _sp.character_main_hand_damage_min + ( Math.random() * ( _sp.character_main_hand_damage_max - _sp.character_main_hand_damage_min ) ) ) * critMultiplier + _sp.character_strength / 2 ) *
									( 100 - ( 25 * ( _cp.character_armor / ( _cp.character_armor + 200 ) ) ) ) * 0.01
								);
		}
		
		//
		// Hit Points Modifier
		// < @amount > integer									- the hit points the current stats are to be changed by
		// < @sourceCharacterObject > character object	- source of the modification
		// [ @sourceBuff ] buff object							- buff responsible for the modification
		//
		
		this.modHP = function( args )
		{
			self.properties.character_hp_current += args.amount;
			
			syncSQL.q(
						"call character_set_attribute_hp_current(" + self.properties.character_id + ",'" + self.properties.character_hp_current + "')",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																		c: "modify",
																		a: "hp_current",
																		r: 301
																	}) );
								
								return;
							}
							
							self.addHistory({
											c: "modify",
											a: "hp_current",
											sid: args.sourceCharacterObject.properties.character_id,
											m: args.amount
										});
							
							if( args.amount > 0 )
							{
								// heal
								
								stats.incrementNoCallback({
																characterObject: self,
																name: "lifetime_hp_earned",
																value: args.amount
															});
								
								stats.incrementInstanceNoCallback({
																		characterObject: self,
																		name: "hp_earned",
																		value: args.amount
																	});
							}
							else
							{
								// damage
								
								if( self.properties.character_hp_max != 0 && self.properties.character_hp_current < 0 )
								{
									// character is dead and not invulnerable
									
									self.die({
											killerCharacterObject: args.sourceCharacterObject,
											killerBuffObject: args.sourceBuff
										});
								}
								
								// target will be stopped from casting
								self.castInterrupt();
							}
							
							args.after();
						}
					);
		}
		
		//
		// Enemies handling
		//
		
		this.addEnemiesToMyEnemies = function( characterObject )
		{
			// add all the enemies to my list
			
			for(var i in characterObject.enemies)
			{
				var _enemy = characterObject.enemies[ i ];
				
				self.addEnemy( _enemy );
				_enemy.addEnemy( self );
			}
		}
		
		this.addEnemy = function( characterObject )
		{
			self.enemies[ characterObject.properties.character_id ] = characterObject;
		}
		
		this.removeEnemy = function( characterObject )
		{
			delete self.enemies[ characterObject.properties.character_id ];
			delete characterObject.enemies[ self.properties.character_id ];
		}
		
		this.removeAllMyEnemies = function()
		{
			for(var i in self.enemies)
			{
				self.removeEnemy( self.enemies[ i ] );
			}
		}
		
		//
		// Combat handling.
		//
		
		// this function is overwritten for NPCs and Items
		this.enterCombat = function( after )
		{
			self.inCombat = true;
			
			syncSQL.q(
						"call character_combat_enter(" + self.properties.character_id + ")",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																			c: "enterCombat",
																			r: 300
																		}) );
								
								return;
							}
							
							log.add( "Character " + self.properties.character_id + " entered combat" );
							
							self.events._run( "combatEnter", {} );
							
							self.stopAutoHPRegen();
							
							self.sendToClient( JSON.stringify({
																		c: "enterCombat",
																		r: 200
																	}) );
							
							after();
						}
					);
		}
		
		// this function is overwritten for NPCs and Items
		this.leaveCombat = function( after )
		{
			self.inCombat = false;
			
			syncSQL.q(
						"call character_combat_leave(" + self.properties.character_id + ")",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																			c: "leaveCombat",
																			r: 300
																		}) );
								
								return;
							}
							
							log.add( "Character " + self.properties.character_id + " left combat" );
							
							self.events._run( "combatLeave", {} );
							
							self.startAutoHPRegen();
							
							self.sendToClient( JSON.stringify({
																c: "leaveCombat",
																r: 200
															}) );
							
							after();
						}
					);
		}
		
		this.getOpponentsNumber = function()
		{
			return _opponentsNumber;
		}
		
		this.addOpponent = function( opponentObject )
		{
			if( self.opponents[ opponentObject.properties.character_id ] )
			{
				// we already have this opponent on the list
				return false;
			}
			
			self.events._run( "addedOpponent", { opponentObject: opponentObject } );
			
			if( _opponentsNumber == 0 )
			{
				// this character didn't have any opponents up to this point
				
				self.enterCombat(function() { });
			}
			
			self.opponents[ opponentObject.properties.character_id ] = opponentObject;
			
			_opponentsNumber++;
			
			return true;
		}
		
		this.removeAllOpponents = function( after )
		{
			if( _opponentsNumber <= 0 )
			{
				after();
				
				return false;
			}
			
			var remainingOpponents = _opponentsNumber;
			for(var i in self.opponents)
			{
				self.opponents[ i ].removeOpponent( self, function()
				{
					// make sure all our opponents have one opponent less
					
					remainingOpponents--;
					
					if( remainingOpponents > 0 )
					{
						return;
					}
					
					// reset opponents list
					_opponentsNumber = 0;
					self.opponents = [];
					self.leaveCombat( after );
				});
			}
		}
		
		this.removeOpponent = function( opponentObject, after )
		{
			delete self.opponents[ opponentObject.properties.character_id ];
			
			_opponentsNumber--;
			
			self.events._run( "removedOpponent", { opponentObject: opponentObject } );
			
			if( _opponentsNumber == 0 )
			{
				self.leaveCombat( after );
			}
			else
			{
				after();
			}
			
			return true;
		}
		
		//
		// Stun enable / disable
		//
		
		this.setStunEnabled = function()
		{
			self.mayMove = false;
		}
		
		this.setStunDisabled = function()
		{
			self.mayMove = true;
		}
		
		//
		// Skin Change
		//
		
		this.changeSkin = function( args )
		{
			
			self.sendToClient( JSON.stringify({
																c: "updateBattleField",
																r: 200,
																updates: [{
																		cid: self.properties.character_id,
																		c: "setSkin",
																		s: args.skinName
																	}]
															}) );
			self.properties.character_skin = args.skinName;
		}
		
		//
		// Arm / disarm character
		//
		
		this.setArmsDisabled = function()
		{
			// make sure the backups are ok
			_lastWeaponDamageStats =
			{
				mainHandMin: self.properties.character_main_hand_damage_min,
				mainHandMax: self.properties.character_main_hand_damage_max,
				offHandMin: self.properties.character_off_hand_damage_min,
				offHandMax: self.properties.character_off_hand_damage_max
			}
			
			self.properties.character_main_hand_damage_min = null;
			self.properties.character_main_hand_damage_max = null;
			self.properties.character_off_hand_damage_min = null;
			self.properties.character_off_hand_damage_max = null;
		}
		
		this.setArmsEnabled = function()
		{
			self.properties.character_main_hand_damage_min = _lastWeaponDamageStats.mainHandMin;
			self.properties.character_main_hand_damage_max = _lastWeaponDamageStats.mainHandMax;
			self.properties.character_off_hand_damage_min = _lastWeaponDamageStats.offHandMin;
			self.properties.character_off_hand_damage_max = _lastWeaponDamageStats.offHandMax;
		}
		
		//
		// Visible / invisible character
		//
		
		this.setVisibleDisabled = function()
		{
			if(
				self.properties.character_is_stealth != null
				|| self.getOpponentsNumber() > 0
			)
			{
				// already invisible or i have at least one opponent
				
				return false;
			}
			
			self.properties.character_is_stealth = '';
			
			self.addHistory({
								c: "command_stealth_enter"
							});
			
			// set the default history handler
			self.addHistory = self.addHistoryOnlyToFriendly;
			
			return true;
		}
		
		this.setVisibleEnabled = function()
		{
			if( self.properties.character_is_stealth == null )
			{
				// already visible
				
				return false;
			}
			
			self.properties.character_is_stealth = null;
			
			// set the default history handler
			self.addHistory = self.addHistoryGeneral;
			
			self.addHistory({
								c: "command_stealth_leave",
								p: self.getMinimalProfile()
							});
			
			return true;
		}
		
		//
		// Interact with another character
		//
		
		this.command_use = function( targetCharacter )
		{
			if( targetCharacter.properties.character_is_usable == null )
			{
				// can't be used by anyone
				
				return false;
			}
			
			targetCharacter.events._run( "use", { byCharacterObject: self } );
			
			return true;
		}
		
		//
		// Movement and grid positioning
		//
		
		this.changeRotation = function( targetX, targetY )
		{
			var _p = self.properties;
			
			return _p.character_rotation = Math.atan2( ( _p.character_zone_y - targetY ), ( _p.character_zone_x - targetX ) ) * 57.2957;
		}
		
		this.changeRotationToCharacterAndBroadcast = function( targetCharacterObject )
		{
			var _p = self.properties,
					_t = targetCharacterObject.properties,
					_newRotation = Math.atan2( ( _p.character_zone_y - _t.character_zone_y ), ( _p.character_zone_x - _t.character_zone_x ) ) * 57.2957;
			
			if( _p.character_rotation == _newRotation )
			{
				//return false;
			}
			
			_p.character_rotation = _newRotation;
			
			// general broadcast
			self.addHistory({
							c: "command_rotate",
							r: _p.character_rotation
						});
			
			return true;
		}
		
		this.changeRotationAndBroadcast = function( targetX, targetY )
		{
			var _p = self.properties;
			
			_p.character_rotation = Math.atan2( ( _p.character_zone_y - targetY ), ( _p.character_zone_x - targetX ) ) * 57.2957;
			
			// general broadcast
			self.addHistory({
							c: "command_rotate",
							r: _p.character_rotation
						});
		}
		
		var _followTimeoutPointer = null, _followPath = [];
		this.command_follow = function( args )
		{
			var _cO = args.characterObject, _cp = _cO.properties, _pathIndex = 0;
			
			var _periodicMovement = function()
			{
				if( !instanceObject.characterMayTargetCharacter( self, _cO ) )
				{
					// not targetable
					
					args.onFailure();
					
					return false;
				}
				
				_followPath = instanceObject.getMinimalPath(
											self.properties.character_zone_x,
											self.properties.character_zone_y,
											_cp.character_zone_x,
											_cp.character_zone_y
										);
				
				var _moveFunction = function()
				{
					self.command_move({
											x: _followPath[ _pathIndex ][ 0 ],
											y: _followPath[ _pathIndex ][ 1 ],
											r: self.changeRotation( _cp.character_zone_x, _cp.character_zone_y ),
											range: args.range,
											after: function( inRangeAlready )
											{
												_pathIndex++;
												
												if( _pathIndex >= _followPath.length )
												{
													clearTimeout( _followTimeoutPointer );
													
													args.onReach( inRangeAlready );
													
													return;
												}
												
												log.add( self.properties.character_id + " moved to " + _followPath[ _pathIndex - 1 ][ 0 ] + "x" + _followPath[ _pathIndex - 1 ][ 1 ] );
												
												_moveFunction();
											}
										});
				}
				
				if( _followPath.length == 0 )
				{
					clearTimeout( _followTimeoutPointer );
					
					args.onReach( false );
					
					return;
				}
				
				_pathIndex = 0;
				_moveFunction();
				
				// recalculate the path periodically
				//_followTimeoutPointer = setTimeout( _periodicMovement, 1500 );
			}
			
			clearTimeout( _followTimeoutPointer );
			_periodicMovement();
		}
		
		this.command_move_path = function( args )
		{
			var _currentPoint = args.startPoint - 1;
			
			self.currentPath = args.path;	// store the path for this character
			
			var _movementFunction = function()
			{
				_currentPoint++;
				var _point = args.path[ _currentPoint ];
				
				if( !_point )
				{
					args.after();
					
					return;
				}
				
				args.iterate( _currentPoint );
				
				self.command_move({
										x: _point.x,
										y: _point.y,
										r: Math.atan2( ( self.properties.character_zone_y - _point.y ), ( self.properties.character_zone_x - _point.x ) ) * 57.2957,
										after: function()
										{
											_followTimeoutPointer = setTimeout(
																					_movementFunction,
																					Math.round( Math.random() * args.delay )
																				);
										}
									});
			};
			
			self.command_move_path_stop = function( after )
			{
				// prevent any further path chosing
				clearTimeout( _followTimeoutPointer );
				
				// clear the path for this character
				self.currentPath = [];
				
				// stop movement
				self.stopMovementNPC( function()
				{
					after();
				});
			}
			
			_movementFunction();
		}
		
		this.command_move_path_stop = function( after )
		{
			after();
		}
		
		this.command_move = function( args )
		{
			//if( self.appliedEffects[2] > 0 )
			if( self.mayMove == false )
			{
				// character may not move
				
				return false;
			}
			
			// this is the one thing we trust the user with
			self.properties.character_rotation = args.r;
			
			// prevent any other movements
			clearTimeout( _followTimeoutPointer );
			clearInterval( _movementUpdatePointer );
			_movementUpdatePointer = null;
			
			// stop any casting while walking
			self.castInterrupt();
			
			// internal treatment
			var _w = args.x - self.properties.character_zone_x,
					_h = args.y - self.properties.character_zone_y,
					_phy = Math.atan2( _h, _w ),
					_vx = self.properties.character_speed * Math.cos( _phy ),
					_vy = self.properties.character_speed * Math.sin( _phy ),
					_distance = Math.sqrt( Math.pow( _w, 2) + Math.pow( _h, 2 ) ) - ( args.range ? args.range : 0 ),
					_movement = 0;
			
			if( _distance <= 0 )
			{
				args.after( true );
				
				// general broadcast
				self.addHistory({
								c: "command_move",
								r: args.r,
								x: self.properties.character_zone_x,
								y: self.properties.character_zone_y
							});
				
				return;
			}
			
			self.properties.character_zone_x_target = args.x;
			self.properties.character_zone_y_target = args.y;
			
			// update periodically the position
			_movementUpdatePointer = setInterval( function()
			{
				_movement += self.properties.character_speed;
				
				if( _movement < _distance )
				{
					self.properties.character_zone_x += _vx;
					self.properties.character_zone_y += _vy;
					
					return;
				}
				
				//
				// the target distance has been reached
				//
				
				// update stats
				stats.incrementNoCallback({
											characterObject: self,
											name: "lifetime_walked_meters",
											value: Math.floor( _distance )
										});
				
				if( typeof args.range == "undefined" )
				{
					// make sure we're spot on
					self.properties.character_zone_x = args.x;
					self.properties.character_zone_y = args.y;
				}
				
				// perform end command tasks
				self.stopMovement( function()
				{
					args.after( false );
				});
				
			}, instanceObject.tic_interval );
			
			// notify the owner
			self.sendToClient( JSON.stringify({
												c: "move",
												r: 200
											}) );
			
			// general broadcast
			self.addHistory({
							c: "command_move",
							r: args.r,
							x: args.x,
							y: args.y
						});
		}
		
		this.stopMovementPlayer = function( after )
		{
			if( _movementUpdatePointer == null )
			{
				after();
				
				return false;
			}
			
			// prevent any other automated movements
			clearTimeout( _followTimeoutPointer );
			clearInterval( _movementUpdatePointer );
			
			_movementUpdatePointer = null;
			
			after();
			
			return true;
		}
		
		this.stopMovementNPC = function( after )
		{
			self.stopMovementPlayer( function()
			{
				self.addHistory({
								c: "command_move_stop",
								x: self.properties.character_zone_x,
								y: self.properties.character_zone_y
							});
				
				after();
			});
		}
		
		// default handler. this is changed for NPCs and Items
		this.stopMovement = this.stopMovementPlayer;
		
		//
		// Attach the character to an instanceObject. it starts without one (aka limbo)
		//
		
		this.bindToLivingInstance = function( newInstanceObject )
		{
			newInstanceObject.addCharacter( self );
			
			// save this instance object as a global
			instanceObject = newInstanceObject; 
			
			// change the character's instance ID
			self.properties.character_id_zone = newInstanceObject.zone_id;
			
			var _profile = self.getMinimalProfile();
			_profile.c = "add_character";
			
			self.addHistoryToTheLiving( _profile );
			
			return newInstanceObject;
		}
		
		// this will not be performed by npcs
		this.bindToInstance = function( newInstanceObject, afterBindToInstanceFunction )
		{
			if( instanceObject == newInstanceObject )
			{
				return false;
			}
			
			syncSQL.q(
						"call character_zone_enroll( " + self.properties.character_id + ", " + newInstanceObject.zone_id + " )",
						function( res )
						{
							if( res[0].result != 200 )
							{
								log.addError( "Zone enroll failed with code " + JSON.stringify( res[0] ) );
								
								return;
							}
							
							//
							// character has been successfully added
							//
							
							// add this character in the instance roster
							newInstanceObject.addCharacter( self );
							
							// save this instance object as a global
							instanceObject = newInstanceObject; 
							
							// perform changes to the properties only if the zone has changed
							if( self.properties.character_id_zone != newInstanceObject.zone_id )
							{
								// update stats
								stats.incrementNoCallback({
																characterObject: self,
																name: "lifetime_instances_joined",
																value: 1
															});
								
								// change the character's instance ID
								self.properties.character_id_zone = newInstanceObject.zone_id;
								
								// update this user's coordinates considering this instance's settings
								self.properties.character_zone_x = res[ 0 ].character_zone_x;
								self.properties.character_zone_y = res[ 0 ].character_zone_y;
								self.properties.character_zone_x_target = res[ 0 ].character_zone_x;
								self.properties.character_zone_y_target = res[ 0 ].character_zone_y;
							}
							
							// make sure we occupy the space the current position, width and height require us to
							self.startAutoHPRegen();
							
							var _profile = self.getMinimalProfile();
							_profile.c = "add_character";
							
							self.addHistory( _profile );
							
							self.events._run( "bindToInstance", { instanceObject: newInstanceObject } );
							
							afterBindToInstanceFunction();
						}
					);
		}
		
		// directly set the instance object
		this.setInstance = function( _IO )
		{
			instanceObject = _IO;
		}
		
		this.getInstance = function()
		{
			return instanceObject;
		}
		
		//
		// handle polen & amber changes
		//
		
		this.getStandardPolenRewardAmount = function()
		{
			var _l = self.properties.character_level;
			
			return Math.floor( ( ( _l / 4 ) + 1 + ( _l * 3 ) ) / 2 );
		}
		
		this.modPolen = function( polenAmount, after )
		{
			self.properties.character_polen += polenAmount;
			
			syncSQL.q(
						"call character_set_attribute_polen(" + self.properties.character_id + ",'" + polenAmount + "')",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																		c: "modify",
																		a: "polen",
																		r: 301
																	}) );
								
								return;
							}
							
							self.sendToClient( JSON.stringify({
																	c: "updateBattleField",
																	r: 200,
																	updates: [{
																			cid: self.properties.character_id,
																			c: "modify",
																			a: "polen",
																			m: polenAmount
																		}]
																}) );
							
							if( polenAmount > 0 )
							{
								// earned polen
								
								stats.incrementNoCallback({
																		characterObject: self,
																		name: "currency_polen_earned",
																		value: polenAmount
																	});
								
								stats.incrementInstanceNoCallback({
																		characterObject: self,
																		name: "polen_earned",
																		value: polenAmount
																	});
							}
							
							after();
						}
					);
		}
		
		this.modAmber = function( amberAmount, after )
		{
			self.properties.character_amber += amberAmount;
			
			syncSQL.q(
						"call character_set_attribute_amber(" + self.properties.character_id + ",'" + amberAmount + "')",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																		c: "modify",
																		a: "amber",
																		r: 301
																	}) );
								
								return;
							}
							
							self.sendToClient( JSON.stringify({
																	c: "updateBattleField",
																	r: 200,
																	updates: [{
																			cid: self.properties.character_id,
																			c: "modify",
																			a: "amber",
																			m: amberAmount
																		}]
																}) );
							
							if( amberAmount > 0 )
							{
								// earned amber
								
								stats.incrementNoCallback({
																		characterObject: self,
																		name: "currency_amber_earned",
																		value: amberAmount
																	});
								
								stats.incrementInstanceNoCallback({
																		characterObject: self,
																		name: "amber_earned",
																		value: amberAmount
																	});
							}
							
							after();
						}
					);
		}
		
		//
		// handle glory changes
		//
		
		this.getStandardGloryRewardAmount = function()
		{
			return Math.floor( 5 + ( ( self.properties.character_level * 5 ) / 10 ) );
		}
		
		this.modGlory = function( gloryAmount, after )
		{
			self.properties.character_glory += gloryAmount;
			
			syncSQL.q(
						"call character_set_attribute_glory(" + self.properties.character_id + ",'" + self.properties.character_glory + "')",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																		c: "modify",
																		a: "glory",
																		r: 301
																	}) );
								
								return;
							}
							
							self.sendToClient( JSON.stringify({
																		c: "updateBattleField",
																		r: 200,
																		updates: [{
																				cid: self.properties.character_id,
																				c: "modify",
																				a: "glory",
																				m: gloryAmount
																			}]
																	}) );
							
							if( gloryAmount > 0 )
							{
								stats.incrementNoCallback({
																		characterObject: self,
																		name: "lifetime_glory_earned",
																		value: gloryAmount
																	});
								
								stats.incrementInstanceNoCallback({
																		characterObject: self,
																		name: "glory_earned",
																		value: gloryAmount
																	});
							}
							
							after();
						}
					);
		}
		
		//
		// handle xp changes and level up
		//
		
		this.modXP = function( xpAmount, after )
		{
			var _progression = args.characterProgression;
			
			if(
				self.properties.character_level >= realmConfig.realmLevelCap
				|| typeof _progression[ self.properties.character_level ] == "undefined"
			)
			{
				// no xp defined for the level. it should only happen on level cap
				
				after();
				
				return false;
			}
			
			// add the new gained xp
			self.properties.character_xp_current += xpAmount;
			
			log.addNotice( "changing xp to " + self.properties.character_id + " by " + xpAmount );
			
			syncSQL.q(
						"call character_set_attribute_xp(" + self.properties.character_id + ",'" + self.properties.character_xp_current + "')",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																		c: "modify",
																		a: "xp_current",
																		r: 301
																	}) );
								
								return;
							}
							
							self.sendToClient( JSON.stringify({
																c: "updateBattleField",
																r: 200,
																updates: [{
																		cid: self.properties.character_id,
																		c: "modify",
																		a: "xp_current",
																		m: xpAmount
																	}]
															}) );
							
							stats.incrementNoCallback({
															characterObject: self,
															name: "lifetime_xp_earned",
															value: xpAmount
														});
							
							if( _progression[ self.properties.character_level ].cdlp_end_xp > self.properties.character_xp_current )
							{
								// no level up
								
								after();
								
								return;
							}
							
							//
							// level up
							//
							
							for(var i in _progression)
							{
								if(
									_progression[ i ].cdlp_end_xp < self.properties.character_xp_current
								)
								{
									continue;
								}
								
								// found the closest level where the current xp would fit in
								self.properties.character_level = i;
								self.properties.character_xp_max = _progression[ i ].cdlp_end_xp;
								
								break;
							}
							
							_setLevel(
									self.properties.character_level,
									function()
									{
										// general update to all the players
										self.addHistory({
															c: "level_set",
															l: self.properties.character_level,
															hp_current: self.properties.character_hp_current,
															hp_max: self.properties.character_hp_max,
															x_b: _progression[ i ].cdlp_start_xp,
															x_m: _progression[ i ].cdlp_end_xp
														});
										
										// send full update to the character
										self.sendToClient( JSON.stringify({
																			c: "setCharacterData",
																			characterData: self.properties,
																			buffs: self.buffs,
																			r: 200
																		}) );							
										
										after();
									}
								);
						}
					);
			
			return true;
		}
		
		this.setLevel = function( args )
		{
			var _progressionRequested = self.getArgs().characterProgression[ args.levelNumber ];
			
			if( !_progressionRequested )
			{
				args.onFailure();
				
				return;
			}
			
			self.modXP(
					_progressionRequested.cdlp_start_xp - self.properties.character_xp_current + 1,
					function()
					{
						args.onSuccess();
					}
				);
		}
		
		var _setLevel = function( levelNumber, after )
		{
			syncSQL.q(
						"call character_set_attribute_level(" + self.properties.character_id + ",'" + levelNumber + "')",
						function( res )
						{
							if( res[0].result != 200 )
							{
								self.sendToClient( JSON.stringify({
																		c: "modify",
																		a: "level",
																		r: 301
																	}) );
								
								return;
							}
							
							self.getInstance().sql.query(
									"select * from `character_spellbook_full` where `cs_id_character` = " + self.properties.character_id,
									function( err, queryResult )
									{
										if( err )
										{
											log.addError( "character_spellbook_full fetch error: " + err );
											
											return;
										}
										
										queryResult.fetchAll( function( err, spellBookRows )
										{
											if( err )
											{
												log.addError( "SpellBook buffs fetch error: " + err );
												
												return;
											}
											
											args.spellBookBuffs = spellBookRows;
											
											// update redis
											instanceObject.redisClient.HSET(
																				"stats.character." + self.properties.character_id,
																				"level_current",
																				self.properties.character_level,
																				function( err, resStats )
																				{
																					if( err )
																					{
																						log.addError( "Character level stats set " + err );
																						
																						return;
																					}
																					
																					// save the in-memory modified variables
																					res[ 0 ].character_zone_x = self.properties.character_zone_x;
																					res[ 0 ].character_zone_y = self.properties.character_zone_y;
																					res[ 0 ].character_rotation = self.properties.character_rotation;
																					
																					// update
																					args.properties = res;
																					
																					// reset the properties
																					self.initialize();
																					
																					log.add( "Level up to " + self.properties.character_level + " new xp " + self.properties.character_xp_current );
																					
																					after();
																				}
																			);
										});
									}
								);
						}
					);
		}
		
		//
		// Auto healing
		//
		
		var _autoHPRegenTimeout = null;
		this.startAutoHPRegen = function()
		{
			// prevent overlaps
			clearTimeout( _autoHPRegenTimeout );
			
			var _regenFunction = function()
			{
				if( self.properties.character_hp_current >= self.properties.character_hp_max )
				{
					return;
				}
				
				var _newHP = ( self.properties.character_hp_current + realmConfig.characterAutoHPRegenIncrement > self.properties.character_hp_max ) ? ( self.properties.character_hp_max - self.properties.character_hp_current ) : realmConfig.characterAutoHPRegenIncrement;
				
				self.modHP({
							amount: _newHP,
							sourceCharacterObject: self,
							after: function()
							{
								_autoHPRegenTimeout = setTimeout(
										_regenFunction,
										realmConfig.characterAutoHPRegenIntervalPeriodic
									);
							}
						});
			};
			
			// ensure the heal is not applied from the start. this would ensure that frequest reconnects will not increase the hp artificially
			_autoHPRegenTimeout = setTimeout(
													_regenFunction,
													realmConfig.characterAutoHPRegenIntervalStart
												);
		}
				
		this.stopAutoHPRegen = function()
		{
			clearTimeout( _autoHPRegenTimeout );
		}
		
		//
		// Death and resurrection
		//

		this.resurrect = function( data )
		{
			if( self.properties.character_is_alive != null )
			{
				// can't be resurrected twice
				
				self.sendToClient( JSON.stringify({
													c: "resurrect",
													r: 300
												}) );
				
				return false;
			}
			
			self.isAlive = true;
			
			self.mayBroadcast = true;
			
			self.removeLootBag();
			
			self.hideCorpseCharacter(function()
			{
				
				syncSQL.q(
							"call character_mark_alive( " + self.properties.character_id + " )",
							function( res )
							{
								// send this message to the dead
								
								self.addHistory({
												c: "kill",
												s: data.resurrectCharacterObject.properties.character_id,
												bid: data.resurrectBuffObject ? data.resurrectBuffObject.getBuff().buff_id : null
											});
								
								// remove the death buff
								buffEffect.removeBuff({
														character: self,
														buff: instanceObject.getArgs().buffsStructure[ 178 ],
														after:	function()
																	{
																		var _afterPlayerSpecificChecks = function()
																		{
																			// character is ready to be revived
																			self.properties.character_is_alive = '';
																			
																			// if the life was below zero, the resurrection should give back 60% of the max life to the player
																			self.properties.character_hp_current = Math.round( self.properties.character_hp_max * 0.6 );
																			
																			// update stats
																			stats.incrementNoCallback({
																											characterObject: self,
																											name: "lifetime_was_resurrected",
																											value: 1
																										});
																			
																			stats.incrementNoCallback({
																											characterObject: data.resurrectCharacterObject,
																											name: "lifetime_has_resurrected",
																											value: 1
																										});
																			
																			// run attached scripts
																			self.events._run( "resurrect", { byCharacterObject: data.resurrectCharacterObject, instanceObject: instanceObject } );
																			
																			// send this message to the living
																			self.addHistory({
																							c: "resurrect",
																							s: data.resurrectCharacterObject.properties.character_id,
																							bid: data.resurrectBuffObject ? data.resurrectBuffObject.getBuff().buff_id : null,
																							p: self.getMinimalProfile()
																						});
																		}
																		
																		// start the auto healing process
																		self.startAutoHPRegen();
																		
																		if( self.properties.character_type == 3 )
																		{
																			// this is a player. subscribe to instance specific channels
																			chatChannel.subscribeToSpecialChannel({
																											characterObject: self,
																											channelType: "say",
																											after: function()
																											{
																												chatChannel.subscribeToSpecialChannel({
																																				characterObject: self,
																																				channelType: "yell",
																																				after: function()
																																				{
																																					_afterPlayerSpecificChecks();
																																				}
																																			});
																											}
																										});
																			
																			return;
																		}
																		
																		_afterPlayerSpecificChecks();
																	}
													});
								
							}
						);
			});
		}
		
		this.getOwnerCharacterObject = function()
		{
			return _ownerCharacterObject;
		}
		
		this.setOwnerCharacterObject = function( _o )
		{
			_ownerCharacterObject = _o;
		}
		
		this.showCorpseCharacter = function( afterShowCorpseFunction )
		{
			// corpse properties setter
			var _setCorpseProperties = function( afterSetCorpsePropertiesFunction )
			{
				// set the coordinates
				
				var _p = _corpseCharacterObject.properties, _sp = self.properties;
				
				_p.character_rotation = _sp.character_rotation;
				_p.character_zone_x = _sp.character_zone_x;
				_p.character_zone_x_target = _sp.character_zone_x;
				_p.character_zone_y = _sp.character_zone_y;
				_p.character_zone_y_target = _sp.character_zone_y;
				
				// the character reacts to the opposite faction
				_p.character_reacts_to = ( _sp.character_faction == "anterium" ) ? "hegemony" : "anterium";
				_p.character_reacts_to_binary = ( _sp.character_faction == "anterium" ) ? 2 : 1;

				// ensure it is usable (loot bag purposes)
				_p.character_is_usable = '';
				
				// bind the character to this instance
				_corpseCharacterObject.bindToInstance( instanceObject, function()
				{
					_corpseCharacterObject.setOwnerCharacterObject( self );
					
					// the corpse has parties interested in its loot
					_corpseCharacterObject.lootBagInterestedParties = self.lootBagInterestedParties;
									
					self.generateLootBag( function()
					{
						
						_corpseCharacterObject.lootBagAttached = self.lootBagAttached;
						_corpseCharacterObject.events.lootGiven = self.events.lootGiven;
						
						afterSetCorpsePropertiesFunction();
					});
				});
			}
			/*
			if( _corpseCharacterObject != null )
			{
				// corpse already exists
				_setCorpseProperties( afterShowCorpseFunction );
				
				return false;
			}
			*/
			/*
			// corpse doesn't exist
			syncSQL.q(
					"call npc_mark_active( " + self.properties.character_id_corpse_character + ")",
					function( npcProfile )
					{
						 npc.createNPC({
											properties: npcProfile,
											activeBuffs: []
										},
										function( npcObject )
										{
											_corpseCharacterObject = npcObject;
											
											_setCorpseProperties( afterShowCorpseFunction );
										});
					}
				);
			*/
			
			instanceObject.addSpecificObject(
											{
												character_id: self.properties.character_id_corpse_character
											},
											function( npcObject )
											{
												_corpseCharacterObject = npcObject;
												
												_setCorpseProperties( afterShowCorpseFunction );
											}
										);
			
			return true;
		}
		
		this.hideCorpseCharacter = function( after )
		{
			if( !_corpseCharacterObject )
			{
				after();
				
				return false;
			}
			
			for(var i=0;i<_corpseCharacterObject.lootBagInterestedParties.length;i++)
			{
				var _ip = _corpseCharacterObject.lootBagInterestedParties[ i ];
				
				_ip.sendToClient( JSON.stringify({
														c: "lootBagHide",
														r: 200,
														lootBagHide: true
														
													}) );
			}
			
			_corpseCharacterObject.lootBagInterestedParties = [];
			
			_corpseCharacterObject.command_disconnect( after );
			
			return true;
		}
		
		// handle the death situation
		var _deathTransactionPointer = new transaction();
		
		this.die = function( data )
		{
			if( self.properties.character_is_alive == null )
			{
				// can't die twice
				self.sendToClient( JSON.stringify({
														c: "kill",		
														r: 300
													}) );
				
				return false;
			}
			
			if( !_deathTransactionPointer.start() )
			{
				return;
			}
			
			// run attached scripts with the last breath
			self.events._run( "beforeDie", { byCharacterObject: data.killerCharacterObject } );
			
			self.isAlive = false;
			
			self.mayBroadcast = false;
			
			var _modAttributes = function( _e, _sLevel, _tLevel )
			{
				_e.modXP(
						Math.floor( ( ( 50 + _sLevel ) * ( _tLevel / _sLevel ) ) / ( 3 + ( _sLevel / 100 ) ) ),
						function()
						{
							_e.modGlory(
										Math.floor( ( ( ( 5 + ( _sLevel * 5 ) ) / 10 ) * ( _tLevel / _sLevel ) ) + 0	/* must add target rank */ ),
										function()
										{
											_e.modPolen(
															Math.round( ( _tLevel / 4 ) + Math.random() * ( ( 1 + _tLevel / 3 ) - ( _tLevel / 4 ) ) ),
															function()
															{
																//log.addNotice( "finished updating post death stats to " + _e.properties.character_id );
															}
														);
										}
									);
						}
					);
			}
			
			// give XP and loot to my enemies
			for(var i in self.enemies)
			{
				var _e = self.enemies[ i ];
				
				// this enemy is eligible for loot
				self.lootBagInterestedParties.push( _e );
				
				// get the levels
				var _sLevel = _e.properties.character_level;
				var _tLevel = self.properties.character_level;
				
				if( _sLevel - 5 >= _tLevel )
				{
					// no xp if target is under 5 levels
					
					continue;
				}
				
				// update stats
				stats.incrementNoCallback({
												characterObject: _e,
												name: "lifetime_kills_glory",
												value: 1
											});
				
				stats.incrementInstanceNoCallback({
														characterObject: _e,
														name: "kills_glory",
														value: 1
													});
				
				_modAttributes( _e, _sLevel, _tLevel );
			}
			
			// i no longer have any enemies
			self.removeAllMyEnemies();
			self.stopAutoHPRegen();
			
			var _deathActions = function()
			{
				syncSQL.q(
						"call character_mark_dead( " + self.properties.character_id + " )",
						function( res )
						{
							// send this message to the living
							
							self.addHistory({
											c: "kill",
											s: data.killerCharacterObject.properties.character_id,
											bid: data.killerBuffObject ? data.killerBuffObject.getBuff().buff_id : null
										});
							
							//log.addNotice( "marked character as dead" );
							
							self.removeAllOpponents(function()
							{
								// made sure we get out of combat
								
								//log.addNotice( "removed all opponents" );
								
								self.stopAllActiveBuffs(function()
								{
									// all active buffs have been stopped
									
									//log.addNotice( "stopped active buffs" );
									
									self.showCorpseCharacter( function()
									{
										// the corpse character has been sent
										self.properties.character_is_alive = null;

										
										// update stats
										stats.incrementNoCallback({
																				characterObject: self,
																				name: "lifetime_deaths",
																				value: 1
																			});
										
										stats.incrementInstanceNoCallback({
																				characterObject: self,
																				name: "deaths",
																				value: 1
																			});
										
										// healing
										stats.incrementNoCallback({
																				characterObject: data.killerCharacterObject,
																				name: "lifetime_kills_direct",
																				value: 1
																			});
										
										stats.incrementInstanceNoCallback({
																				characterObject: data.killerCharacterObject,
																				name: "kills_direct",
																				value: 1
																			});
										
										// send this message to the dead
										
										self.addHistory({
														c: "resurrect",
														s: data.killerCharacterObject.properties.character_id,
														bid: data.killerBuffObject ? data.killerBuffObject.getBuff().buff_id : null,
														p: self.getMinimalProfile()
													});
										
										// set my life to 1
										self.modHP({
													amount: 1 - self.properties.character_hp_current,
													sourceCharacterObject: self,
													sourceBuff: args.sourceBuff,
													after: function()
													{
														// cast the death buff
														new buffEffect.activeBuff({
																					source: self,
																					character: self,
																					buff: instanceObject.getArgs().buffsStructure[ 178 ],			// death hardcoded
																					sourceIsFriendly: true,													// make sure we don't start being counted as being in combat
																					spawnedBuff: true														// necessary to prevent cooldown timers
																				});
														
														// run attached scripts
														self.events._run( "die", { byCharacterObject: data.killerCharacterObject } );
														data.killerCharacterObject.events._run( "killedOpponent", { opponentObject: self } );
														
														// ensure this function may be called upon again
														_deathTransactionPointer.finish();
													}
												});
									});
								});
							});
						}
					);
			}
			
			if( self.properties.character_type == 3 )
			{
				chatChannel.unSubscribeToChannel({
															characterObject: self,
															channelName: "say",
															channelType: "say",
															after: function()
															{
																chatChannel.unSubscribeToChannel({
																											characterObject: self,
																											channelName: "yell",
																											channelType: "yell",
																											after: function()
																											{
																												_deathActions();
																											}
																										});
															}
														});
			}
			else
			{
				_deathActions();
				
			}
		}
		
		//
		// History, socket and minimal profile sending
		//
		
		this.sendToClient = function( message )
		{
			// send this message to the master process
			process.send({
							cmd: "sendSocketMessage",
							uid: self.properties.character_id_user,
							data: message
						});
		}
		
		this.addHistoryToTheLiving = function( data )
		{
			data.cid = self.properties.character_id;
			
			// broadcast message to other players
			for( var i in instanceObject.characters )
			{
				var _c = instanceObject.characters[ i ];
				
				if(
					_c.properties.character_type != 3									// NPC or Item
					|| _c.properties.character_is_alive == null						// state is dead
				)
				{
					continue;
				}
				
				_c.sendToClient( JSON.stringify({
															c: "updateBattleField",
															r: 200,
															updates: [ data ]
														}) );
			}
			
			return true;
		}
		
		this.addHistoryToTheDead = function( data )
		{
			data.cid = self.properties.character_id;
			
			// broadcast message to other players
			for( var i in instanceObject.characters )
			{
				var _c = instanceObject.characters[ i ];
				
				if(
					_c.properties.character_type != 3								// NPC or Item
					|| _c.properties.character_is_alive != null						// state is alive
				)
				{
					continue;
				}
				
				_c.sendToClient( JSON.stringify({
													c: "updateBattleField",
													r: 200,
													updates: [ data ]
												}) );
			}
			
			return true;
		}
		
		this.addHistoryOnlyToFriendly = function( data )
		{
			data.cid = self.properties.character_id;
			
			// broadcast message to other players
			for( var i in instanceObject.characters )
			{
				var _c = instanceObject.characters[ i ];
				
				if(
					_c.properties.character_type != 3																// NPC or Item
					|| _c.properties.character_is_alive != self.properties.character_is_alive				// different state than i am
					|| instanceObject.charactersCompareFriendRelationship( self, _c ) == false		// enemy
				)
				{
					continue;
				}
				
				_c.sendToClient( JSON.stringify({
													c: "updateBattleField",
													r: 200,
													updates: [ data ]
												}) );
			}
		}
		
		this.addHistoryGeneral = function( data )
		{
			// add this command to the instance history
			
			data.cid = self.properties.character_id;
			
			// broadcast message to other players
			for( var i in instanceObject.characters )
			{
				var _c = instanceObject.characters[ i ];
				
				if(
					_c.properties.character_type != 3														// NPC or Item
					|| _c.properties.character_is_alive != self.properties.character_is_alive		// different state than i am
				)
				{
					continue;
				}
				
				_c.sendToClient( JSON.stringify({
													c: "updateBattleField",
													r: 200,
													updates: [ data ]
												}) );
			}
			
			return true;
		}
		
		// set the default history handler
		this.addHistory = this.addHistoryGeneral;
		
		this.getMinimalProfile = function()
		{
			var _b = { };
			for( var i in self.activeBuffs )
			{
				if( self.activeBuffs[ i ] == null )
				{
					// skip nulls
					
					continue;
				}
				
				_b[ i ] = self.activeBuffs[ i ].buff;
				_b[ i ].cb_applied_effect_remaining_seconds = self.activeBuffs[ i ].getRemainingEffectTime();
			}
			
			var _pr = self.properties;
			
			return {
						b: _b,
						n: _pr.character_name,
						cg: _pr.character_guild_name,
						ow: _pr.character_id_owner_character,
						op: _pr.character_id_object_pool,
						co: _pr.character_id_corpse_character,
						l: _pr.character_level,
						w: _pr.character_width,
						h: _pr.character_height,
						ro: _pr.character_rotation,
						x: _pr.character_zone_x,
						xt: _pr.character_zone_x_target,
						y: _pr.character_zone_y,
						yt: _pr.character_zone_y_target,
						s: _pr.character_speed,
						h_c: _pr.character_hp_current,
						h_m: _pr.character_hp_max,
						d: _pr.character_is_alive,
						sk: _pr.character_skin,
						ty: _pr.character_type,
						r: _pr.character_race,
						cl: _pr.character_class,
						f: _pr.character_faction,
						fb: _pr.character_faction_binary,
						rtb: _pr.character_reacts_to_binary,
						st: _pr.character_is_stealth,
						iv: _pr.character_is_vendor,
						iq: _pr.character_is_questgiver,
						iu: _pr.character_is_usable,
						ta: _pr.character_is_targetable
					};
		}
		
		this.characterIsInAura = function( characterObject )
		{
			var _cid = characterObject.properties.character_id;
			
			for(var i=0;i<self.collidingWith.length;i++)
			{
				if( self.collidingWith[ i ].properties.character_id != _cid )
				{
					continue;
				}
				
				return true;
			}
			
			return false;
		},
		
		this.removeFromAllAuras = function()
		{
			for(var i=0;i<self.inAuraOf.length;i++)
			{
				var _c = self.inAuraOf[ i ];
				
				_c.collidingWith.splice( _c.collidingWith.indexOf( self ), 1 );
				
				_c.events._run( "auraLeave", { fromCharacterObject: self } );
			}
			
			for(var i=0;i<self.collidingWith.length;i++)
			{
				var _c = self.collidingWith[ i ];
				
				_c.inAuraOf.splice( _c.inAuraOf.indexOf( self ), 1 );
				
				self.events._run( "auraLeave", { fromCharacterObject:  _c } );
			}
		}
		
		//
		// Disconnection treatment
		//
		
		var _disconnectTransactionPointer = new transaction();
		
		// command used by the instance to remove the user forcibly
		this.command_disconnect_forced = function( after )
		{
			if( instanceObject == null )
			{
				// no instance to disconnect from
				
				after();
				
				return false;
			}
			
			if( !_disconnectTransactionPointer.start( after ) )
			{
				return;
			}
			
			self.redisClient.end();
			
			self.stopAutoHPRegen();
			self.castInterrupt();
			
			self.hideCorpseCharacter( function()
			{
				self.removeAllOpponents(function()
				{
					// made sure we get out of combat
					
					syncSQL.q(
								"call character_mark_inactive(" + self.properties.character_id + ")",
								function( res )
								{
									self.stopMovement(function()
									{
										self.events._run( "disconnect", { byCharacterObject: self } );
										
										instanceObject.removeCharacter( self, function()
										{
											self.removeFromAllAuras();
											
											self.addHistory({
																c: "command_disconnect_forced"
															});
											
											// make sure the client knows it has been disconnected
											self.sendToClient( JSON.stringify({
																					c: "disconnectCharacter"
																				}) );
											
											instanceObject.getArgs().instanceProcess.messageToRealm(
																													{
																														cmd: "characterDisconnectForced",
																														uid: self.properties.character_id_user,
																														cid: self.properties.character_id
																													},
																													function( result )
																													{
																														instanceObject = null;
																														
																														_disconnectTransactionPointer.finish();
																													}
																												);
										});
									});
								}
							);
				});
			});
			
			return true;
		}
		
		// this function is overwritten for NPCs and Items
		this.command_disconnect = function( after )
		{
			if( instanceObject == null )
			{
				// no instance to disconnect from
				
				after();
				
				return false;
			}
			
			if( !_disconnectTransactionPointer.start( after ) )
			{
				return;
			}
			
			self.redisClient.end();
			
			self.stopAutoHPRegen();
			self.castInterrupt();
			
			self.hideCorpseCharacter( function()
			{
				self.removeAllOpponents(function()
				{
					// made sure we get out of combat
					
					syncSQL.q(
								"call character_mark_inactive(" + self.properties.character_id + ")",
								function( res )
								{
									// make sure the client knows it has been disconnected
									self.sendToClient( JSON.stringify({
																			c: "disconnectCharacter"
																		}) );
									
									self.stopMovement(function()
									{
										self.events._run( "disconnect", { byCharacterObject: self } );
										
										instanceObject.removeCharacter( self, function()
										{
											self.removeFromAllAuras();
											
											self.addHistory({
															c: "command_disconnect"
														});
											
											instanceObject = null;
											
											_disconnectTransactionPointer.finish();
										});
									});
								}
							);
				});
			});
			
			return true;
		}
		
		// this function is overwritten for NPCs and Items
		this.command_disconnect_for_hearthstone = function( after )
		{
			if( instanceObject == null )
			{
				// no instance to disconnect from
				
				after();
				
				return false;
			}
			
			if( !_disconnectTransactionPointer.start( after ) )
			{
				return;
			}
			
			self.redisClient.end();
			
			self.stopAutoHPRegen();
			self.castInterrupt();
			
			self.hideCorpseCharacter( function()
			{
				syncSQL.q(
							"call character_zone_to_hearthstone(" + self.properties.character_id + ")",
							function( res )
							{
								self.stopMovement(function()
								{
									self.events._run( "disconnect", { byCharacterObject: self } );
									
									instanceObject.removeCharacter( self, function()
									{
										self.removeFromAllAuras();
										
										// make sure the client knows it has left the battleground
										self.sendToClient( JSON.stringify({
																				c: "battlegroundLeave"
																			}) );
										
										self.addHistory({
															c: "command_disconnect"
														});
										
										instanceObject = null;
										
										_disconnectTransactionPointer.finish();
									});
								});
							}
						);
			});
			
			return true;
		}
		
		// this function is overwritten for NPCs and Items
		this.command_disconnect_for_zone_pool_id = function( args, after )
		{
			if( instanceObject == null )
			{
				// no instance to disconnect from
				
				after();
				
				return false;
			}
			
			if( !_disconnectTransactionPointer.start( after ) )
			{
				return;
			}
			
			instanceObject.getArgs().instanceProcess.messageToRealm(
																						{
																							cmd: "queueJoinSpecific",
																							uid: self.properties.character_id_user,
																							cid: self.properties.character_id,
																							bid: args.zone_pool_id
																						},
																						function( result )
																						{
																							self.redisClient.end();
																							
																							self.stopAutoHPRegen();
																							self.castInterrupt();
																							
																							self.hideCorpseCharacter( function()
																							{
																								syncSQL.q(
																											"call character_zone_enroll(" + self.properties.character_id + ", " + result.iID + ")",
																											function( res )
																											{
																												self.stopMovement(function()
																												{
																													self.events._run( "disconnect", { byCharacterObject: self } );
																													
																													instanceObject.removeCharacter( self, function()
																													{
																														self.removeFromAllAuras();
																														
																														// make sure the client knows it has left the battleground
																														self.sendToClient( JSON.stringify({
																																								c: "battlegroundLeave"
																																							}) );
																														
																														self.addHistory({
																																			c: "command_disconnect"
																																		});
																														
																														instanceObject = null;
																														
																														_disconnectTransactionPointer.finish();
																													});
																												});
																											}
																										);
																							});
																						}
																					);
			
			return true;
		}
		
		// disconnect the character without notifying it explicitly
		this.command_disconnect_silent = function( after )
		{
			if( instanceObject == null )
			{
				// no instance to disconnect from
				
				after();
				
				return false;
			}
			
			if( !_disconnectTransactionPointer.start( after ) )
			{
				return;
			}
			
			self.redisClient.end();
			
			self.stopAutoHPRegen();
			self.castInterrupt();
			
			self.hideCorpseCharacter( function()
			{
				syncSQL.q(
							"call character_mark_inactive(" + self.properties.character_id + ")",
							function( res )
							{
								self.stopMovement(function()
								{
									self.events._run( "disconnect", { byCharacterObject: self } );
									
									instanceObject.removeCharacter( self, function()
									{
										self.removeFromAllAuras();
										
										self.addHistory({
															c: "command_disconnect"
														});
										
										instanceObject = null;
										
										_disconnectTransactionPointer.finish();
									});
								});
							}
						);
			});
			
			return true;
		}
		
		var _disconnectTimeout = null;
		this.startDisconnectCountdown = function()
		{
			clearTimeout( _disconnectTimeout );
			
			_disconnectTimeout = setTimeout( function()
			{
				self.command_disconnect(function()
				{
					
				});
			}, realmConfig.realmCharacterDisconnectTimeout );
		}
		
		this.stopDisconnectCountdown = function()
		{
			clearTimeout( _disconnectTimeout );
		}
		
		//
		// Buff Casting
		//
		
		this.stopAllActiveBuffs = function( after )
		{
			var _ab = self.activeBuffs, numberOfBuffsRunning = 0, buffsToEnd = false;
			
			for(var i in _ab)
			{
				if( _ab[ i ].buff.buff_mechanic_type == 3 )
				{
					// permanent buff
					
					continue;
				}
				
				buffsToEnd = true;
				numberOfBuffsRunning++;
				
				_ab[ i ]._requestEnd( function()
				{
					numberOfBuffsRunning--;
					
					if( numberOfBuffsRunning > 0 )
					{
						return;
					}
					
					after();
				} );
			}
			
			if( buffsToEnd == false )
			{
				after();
			}
		}
		
		this.command_cast = function( buffObject, targetCharacterObject, callBack )
		{
			if( self.buffs[ buffObject.buff_id ].inCooldown )
			{
				// buff is in cooldown
				
				return callBack({ r: 302 });
			}
			
			//var buffFull = instanceObject.getArgs().buffsStructure[ buffObject.buff_id ];
			var buffFull = self.buffs[ buffObject.buff_id ];
			
			//
			// Evaluate if the casting should be performed
			//
			
			if( targetCharacterObject.properties.character_id != self.properties.character_id )
			{
				// always be visible when casting onto others
				
				self.setVisibleEnabled();
			}
			
			var _performBuff = function()
			{
				if( !instanceObject.characterMayTargetCharacter( self, targetCharacterObject ) )
				{
					// target cannot be targeted
					
					return callBack({ r: 300 });
				}
				
				if( buffFull.buff_allow_target & 4 || buffFull.buff_allow_target & 16 )
				{
					// friends or foes - plural. multiple targets
					
					var _ct = instanceObject.castTreatment( self, buffFull, targetCharacterObject );
					
					for(var i in instanceObject.characters)
					{
						var _c = instanceObject.characters[ i ];
						
						if( _c.properties.character_type != 3 || !instanceObject.characterMayTargetCharacter( _c, self ) )
						{
							// character is not a player or i can't target it
							
							continue;
						}
						
						new buffEffect.activeBuff({
													source: self,
													character: _c,
													buff: buffFull,
													sourceIsFriendly: _ct,
													schemes: instanceObject.getArgs().castSchemes,
													buffsStructure: instanceObject.getArgs().buffsStructure,
													buffsScripts: instanceObject.getArgs().buffsScripts
												});
					}
				}
				else
				{
					// single target
					
					new buffEffect.activeBuff({
												source: self,
												character: targetCharacterObject,
												buff: buffFull,
												sourceIsFriendly: instanceObject.castTreatment( self, buffFull, targetCharacterObject ),	// resolve the relationship to the target given the buff requirements
												schemes: instanceObject.getArgs().castSchemes,
												buffsStructure: instanceObject.getArgs().buffsStructure,
												buffsScripts: instanceObject.getArgs().buffsScripts
											});
				}
				
				return callBack({ r: 200, buff: buffFull });
			}
			
			self.changeRotationAndBroadcast( targetCharacterObject.properties.character_zone_x, targetCharacterObject.properties.character_zone_y );
			
			if( !buffFull.buff_cast_seconds )
			{
				return _performBuff();
			}
			
			if( _movementUpdatePointer )
			{
				// character is moving
				
				return callBack({ r: 301 });
			}
			
			// begin casting
			self.castStart({
						description: buffFull.buff_name,
						duration: buffFull.buff_cast_seconds * 1000,
						onInterrupt: function()
						{
							
						},
						onComplete: _performBuff
					});
		}
		
		this.hasActiveBuff = function( buff_id )
		{
			for(var i in self.activeBuffs)
			{
				var _ab = self.activeBuffs[ i ];
				
				if( _ab.buff.buff_id != buff_id )
				{
					continue;
				}
				
				return _ab;
			}
			
			return false;
		}
		
		this.getActiveBuffAmount = function( buff_id )
		{
			var _amount = 0;
			
			for(var i in self.activeBuffs)
			{
				var _ab = self.activeBuffs[ i ];
				
				if( _ab.buff.buff_id != buff_id )
				{
					continue;
				}
				
				_amount++;
			}
			
			return _amount;
		}
		
		//
		// Initialization handlers ( buffs & attributes )
		//
		
		this.addBuffToSpellBook = function( buffID )
		{
			//self.buffs[ _propertyArray.buff_id ][ j ] = _propertyArray[j];
		}
		
		// init existing active buffs
		this.resumeAppliedActiveBuffs = function()
		{
			if( resumedAppliedActiveBuffs == true )
			{
				return false;
			}
			
			resumedAppliedActiveBuffs = true;
			
			for(var i in args.activeBuffs )
			{
				new buffEffect.resumeBuff({
										source: this,
										character: this,
										buff: args.activeBuffs[ i ]
									});
			}
			
			return true;
		}
		
		// resume the cooldowns for each spell book buff
		this.resumeSpellbookCooldowns = function()
		{
			if( resumedSpellbookCooldowns == true )
			{
				return false;
			}
			
			// make sure we don't run this twice. it could cause double cooldowns to run in the background
			resumedSpellbookCooldowns = true;
			
			var _resumeCooldown = function( buff )
			{
				setTimeout( function()
				{
					self.sendToClient( JSON.stringify({
																c: "removeCooldown",
																r: 200,
																b: buff.buff_id
															}) );
				}, buff.cs_cooldown_remaining_seconds * 1000 );
			}
			
			for(var i in self.buffs)
			{
				if(
					self.buffs[ i ].cs_cooldown_remaining_seconds < 0
					|| self.buffs[ i ].cs_cooldown_remaining_seconds == null
				)
				{
					// buff never casted or cooldown expired
					
					continue;
				}
				
				_resumeCooldown( self.buffs[ i ] );
			}
		}
		
		//
		// Loot
		//
		
		this.lootBagAttached = [];
		this.lootBagInterestedParties = [];
		
		this.removeLootBag = function()
		{
		
			self.lootBagAttached = [];
			self.lootBagInterestedParties = [];
			
		}
		
		this.removeLootItemByID = function( args )
		{
			syncSQL.q(
					"call character_inventory_item_remove_by_id( " + self.properties.character_id + ", " + args.loot_id + " )",
					function( res )
					{
						if( res[0].result == 300 )
						{
							// the item was not found in the inventory
							
							args.onSuccess();
							
							return;
						}
						
						if( res[0].result != 200 )
						{
							// no item found in the slot or misc error
							
							args.onFailure();
							
							return;
						}
						
						// fetch the new inventory
						instanceObject.getArgs().instanceProcess.sql.query(
										"select * from `character_inventory_full` " +
											" where `ci_id_character` = " + self.properties.character_id + " and `loot_id` is not null and `ci_slot_bag` != 1",
										function( err, result )
										{
											if( err )
											{
												_c.sendToClient( JSON.stringify({
																						c: "lootRemove",
																						r: 306
																					}) );
												
												log.addError( "Error getting updated inventory query result: " + err );
												
												args.onFailure();
												
												return;
											}
											
											result.fetchAll( function(err, rows)
											{
												log.add("y: " + JSON.stringify(rows));
												
												if( err )
												{
													_c.sendToClient( JSON.stringify({
																							c: "lootRemove",
																							r: 307
																						}) );
													
													log.addError( "Error getting updated inventory details rows: " + err );
													
													args.onFailure();
													
													return;
												}
												log.add( rows );
												// send details about the new bag configuration to the issuer
												self.sendToClient( JSON.stringify({
																					c: "lootRemove",
																					i: rows,
																					r: 200
																				}) );
												
												// update stats
												stats.incrementNoCallback({
																				characterObject: self,
																				name: "lifetime_inventory_items_removed",
																				value: 1
																			});
												
												args.onSuccess();
											});
										}
									);
					}
				);
		}
		
		this.addLootItemByID = function( args )
		{	
			syncSQL.q(
					"call character_inventory_item_add( " + self.properties.character_id + ", " + args.loot_id + ", " + args.amount + " )",
					function( res )
					{
						if( res[0].result == 300 )
						{
							// no space for the item
							
							_c.sendToClient( JSON.stringify({
																c: "lootReceive",
																r: 304
															}) );
							
							args.onFailure();
							
							return;
						}
						
						if( res[0].result != 200 )
						{
							// misc error
							
							_c.sendToClient( JSON.stringify({
																c: "lootReceive",
																r: 305
															}) );
							
							args.onFailure();
							
							return;
						}
						
						// fetch the new inventory
						instanceObject.getArgs().instanceProcess.sql.query(
										"select * from `character_inventory_full` " +
											" where `ci_id_character` = " + self.properties.character_id + " and `loot_id` is not null and `ci_slot_bag` != 1",
										function( err, result )
										{
											if( err )
											{
												_c.sendToClient( JSON.stringify({
																						c: "lootReceive",
																						r: 306
																					}) );
												
												log.addError( "Error getting updated inventory query result: " + err );
												
												args.onFailure();
												
												return;
											}
											
											result.fetchAll( function(err, rows)
											{
												if( err )
												{
													_c.sendToClient( JSON.stringify({
																							c: "lootReceive",
																							r: 307
																						}) );
													
													log.addError( "Error getting updated inventory details rows: " + err );
													
													args.onFailure();
													
													return;
												}
												
												// send details about the new bag configuration to the issuer
												self.sendToClient( JSON.stringify({
																					c: "lootReceive",
																					l: instanceObject.getArgs().lootData[ args.loot_id ],
																					i: rows,
																					r: 200
																				}) );
												
												// update stats
												stats.incrementNoCallback({
																				characterObject: self,
																				name: "lifetime_looted_items_amount",
																				value: 1
																			});
												
												args.onSuccess();
											});
										}
									);
					}
				);
		}
		
		this.generateAndSendLootBagData = function( args )
		{
			self.generateLootBag( function( bagData )
			{
				args.toCharacterObject.sendToClient( JSON.stringify({
																			c: "lootBag",
																			r: 200,
																			cid: self.properties.character_id,
																			bagData: bagData.lootObjects
																		}) );
				
				args.after();
			});
		}
		
		this.setLootbagItemVisibleToCharacter = function( args )
		{
			self.generateLootBag( function()
			{
				for(var i in self.lootBagAttached)
				{
					var _lbi = self.lootBagAttached[ i ];
					
					if( _lbi.loot.loot_id != args.loot_id )
					{
						continue;
					}
					
					if( _lbi.lootableBy.indexOf( args.characterObject.properties.character_id ) == -1 )
					{
						// this character is not yet eligible
						
						self.lootBagAttached[ i ].lootableBy.push( args.characterObject.properties.character_id );
					}
					
					args.onSuccess();
					
					return;
				}
				
				args.onFailure();
			});
		}
		
		this.addLootbagInterestedParty = function( args )
		{
			if( self.lootBagInterestedParties.indexOf( args.characterObject ) > -1 )
			{
				// character is already in the list
				
				return false;
			}
			
			self.lootBagInterestedParties.push( args.characterObject );
			
			var _cid = args.characterObject.properties.character_id;
			for(var i in self.lootBagAttached)
			{
				if( self.lootBagAttached[ i ].loot.loot_is_quest_item != null )
				{
					// by default, a character will not see quest items
					
					continue;
				}
				
				// this item was for this character. remove the association
				self.lootBagAttached[ i ].lootableBy.push( _cid );
			}
			
			return true;
		}
		
		this.removeLootbagInterestedParty = function( args )
		{
			var _index = self.lootBagInterestedParties.indexOf( args.characterObject );
			
			if( _index == -1 )
			{
				// character is not on the list
				
				return false;
			}
			
			self.lootBagInterestedParties.splice( _index, 1 );
			
			var _cid = args.characterObject.properties.character_id;
			for(var i in self.lootBagAttached)
			{
				var _index = self.lootBagAttached[ i ].lootableBy.indexOf( _cid );
				
				if( _index == -1 )
				{
					// item was not for this character
					
					continue;
				}
				
				// this item was for this character. remove the association
				self.lootBagAttached[ i ].lootableBy.splice( _index, 1 );
			}
			
			return true;
		}
		
		this.generateAndSendLootBagDataToAllInterestedParties = function( args )
		{
			self.generateLootBag( function( bagData )
			{
				for(var i=0;i<self.lootBagInterestedParties.length;i++)
				{
					var _ip = self.lootBagInterestedParties[ i ];
					
					_ip.sendToClient( JSON.stringify({
															c: "lootBag",
															r: 200,
															cid: self.properties.character_id,
															bagData: bagData.lootObjects
														}) );
				}
				
				args.after();
			});
		}
		
		this.generateLootBag = function( after )
		{
			if( self.properties.character_id_object_pool == null )
			{
				after( [] );
				
				return false;
			}
			
			if( self.lootBagAttached.length > 0 )
			{
				after({
						lootObjects: self.lootBagAttached
					});
				
				return false;
			}

			instanceObject.getArgs().instanceProcess.sql.query(
															"select `loot_table_loot`.`ltl_id_loot`, `loot_table_loot`.`ltl_amount` " +
																" from `loot_table_loot` " +
																" inner join `objects_pool` on `objects_pool`.`op_id_loot_table` = `loot_table_loot`.`ltl_id_loot_table_definition` " +
																" where `objects_pool`.`op_id` = " + self.properties.character_id_object_pool +
																" order by rand() * `loot_table_loot`.`ltl_drop_chance` desc " +
																" limit 0, 4 ",
															function( err, res )
															{
																if( err )
																{
																	log.addError( "Loot table query error: " + err );
																	
																	return;
																}
																
																res.fetchAll( function( err, rows )
																{
																	if( err )
																	{
																		log.addError( "Loot table rows fetch error: " + err );
																		
																		return;
																	}

																	var _loot = instanceObject.getArgs().lootData,
																		_maxItems = Math.min( Math.ceil( Math.random() * rows.length ), 4 );	// ensure a minimum of 1
																	
																	// order randomly
																	rows.sort( function()
																	{
																		return 0.5 - Math.random();
																	});
																	
																	//
																	// create loot structure
																	//
																	
																	self.lootBagAttached = [];
																	
																	var _lootableBy = [];
																	
																	for(var i=0;i<self.lootBagInterestedParties.length;i++)
																	{
																		_lootableBy.push( self.lootBagInterestedParties[ i ].properties.character_id );
																	}

																	for(var i=0;i<_maxItems;i++)
																	{
																		self.lootBagAttached.push({
																									amount: rows[ i ].ltl_amount,
																									loot: _loot[ rows[ i ].ltl_id_loot ],
																									lootableBy: ( _loot[ rows[ i ].ltl_id_loot ].loot_is_quest_item == null ) ? _lootableBy : []	// by default, quest items aren't lootable by anybody
																								});
																	}

																	after({
																		lootObjects: self.lootBagAttached
																	});
																});
															}
														);
		}
		
		//
		// Quests
		//
		
		this.getAutoRewardXP = function( characterLevel, questLevel )
		{
			return Math.floor( ( ( ( 50 + characterLevel ) * ( questLevel / characterLevel ) ) / ( 3 + ( characterLevel / 100 ) ) ) * 9 );
		}
		
		this.getAutoRewardGlory = function( characterLevel, questLevel )
		{
			return Math.floor( ( ( ( 5 + ( characterLevel * 5 ) ) / 10 ) * ( questLevel / characterLevel ) ) * 9 )
		}
		
		this.getAutoRewardPolen = function( characterLevel )
		{
			return Math.floor( ( ( characterLevel / 4 ) + ( 1 + ( characterLevel / 3 ) ) ) / 0.2 );
		}
		
		this.getAssociatedQuests = function( after )
		{
			if( self.properties.character_is_questgiver == null )
			{
				after();
				
				return false;
			}
			
			instanceObject.getArgs().instanceProcess.sql.query(
														"select `opq_id_quest`, `opq_is_giver`, `opq_is_finalizer` from `objects_pool_quests` where `opq_id_object_pool` = " + self.properties.character_id_object_pool,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Associated objects' quests query error: " + err );
																
																return;
															}
															
															res.fetchAll( function( err, rows )
															{
																if( err )
																{
																	log.addError( "Associated objects' quests fetch error: " + err );
																	
																	return;
																}
																
																for(var i=0;i<rows.length;i++)
																{
																	self.associatedQuests[ rows[ i ].opq_id_quest ] = JSON.parse( JSON.stringify( instanceObject.getArgs().questsData[ rows[ i ].opq_id_quest ] ) );
																	self.associatedQuests[ rows[ i ].opq_id_quest ].opq_is_giver = rows[ i ].opq_is_giver;
																	self.associatedQuests[ rows[ i ].opq_id_quest ].opq_is_finalizer = rows[ i ].opq_is_finalizer;
																}
																
																after();
															});
														}
													);
			
			return true;
		}
		
		this.getQuests = function( forCharacterObject, after )
		{
			var returnedQuests = {};
			
			// function will check the quest for validity against the character (forCharacterObject) and set the proper values for loot
			var _checkQuestIndex = function( qID, after )
			{
				var _aq = self.associatedQuests[ qID ], _questReturnedValues = [], _valuesCaught = 0;
				
				// all the prerequisite values have been caught, evaluate the results
				var _evaluateValues = function()
				{
					var _lc = _questReturnedValues[ "level_current" ];
					
					// set the level difference to emphasis the difficulty
					returnedQuests[ qID ].levelDifference = _lc.req - _lc.val;
					
					// check all the required values
					for(var i in _questReturnedValues)
					{
						if( _questReturnedValues[ i ].req <= _questReturnedValues[ i ].val )
						{
							continue;
						}
						
						// condition not met
						
						returnedQuests[ qID ].grabbable = false;
						
						break;
					}
					
					/*
					if(
						_lc.req > _lc.val + realmConfig.questThresholdHigh
					)
					{
						// too difficult to get
						
						returnedQuests[ qID ].grabbable = false;
					}
					else
					{
						// code below
					*/
					
					if( returnedQuests[ qID ].grabbable == true )
					{
						// quest may be grabbed; calculate the stats
						
						var _cl = forCharacterObject.properties.character_level;
						
						// set the XP reward
						returnedQuests[ qID ].quest_award_xp = ( returnedQuests[ qID ].quest_award_xp == null ) ? self.getAutoRewardXP( _cl, _lc.req ) : returnedQuests[ qID ].quest_award_xp;
						
						// set the Glory reward
						returnedQuests[ qID ].quest_award_glory = ( returnedQuests[ qID ].quest_award_glory == null ) ? self.getAutoRewardGlory( _cl, _lc.req ) : returnedQuests[ qID ].quest_award_glory;
						
						// set the polen reward
						returnedQuests[ qID ].quest_award_polen = ( returnedQuests[ qID ].quest_award_polen == null ) ? self.getAutoRewardPolen( _cl ) : returnedQuests[ qID ].quest_award_polen;
					}
					
					after();
				}
				
				// get the values for the requested character
				var _getCriteria = function( _cg )
				{
					var _pn = _cg.qcg_parameter_name.split( ":" );
					
					if( _cg.qcg_parameter_value_min != null )
					{
						// hash search
						
						// get the properties for the values for the character
						instanceObject.redisClient.HGET(
															_pn[ 0 ].replace( "[characterID]", forCharacterObject.properties.character_id ),
															_pn[ 1 ],
															function( err, res )
															{
																if( err )
																{
																	log.addError( "Quest hash get criteria get for qID " + i + ": " + err );
																	
																	return;
																}
																
																_questReturnedValues[ _pn[ 1 ] ] = {
																						req: _cg.qcg_parameter_value_min,
																						val: parseInt( res )
																					};
																
																_valuesCaught++;
																
																if( _valuesCaught < _aq.conditionsGet.length )
																{
																	return;
																}
																
																// all values caught. we can now evaluate them
																_evaluateValues();
															}
														);
					}
					else
					{
						// set search
						instanceObject.redisClient.SISMEMBER(
																_pn[ 0 ].replace( "[characterID]", forCharacterObject.properties.character_id ),
																_pn[ 1 ],
																function( err, res )
																{
																	if( err )
																	{
																		log.addError( "Quest set get criteria get for qID " + i + ": " + err );
																		
																		return;
																	}
																	
																	_questReturnedValues[ _cg.qcg_parameter_name ] = {
																							req: 1,
																							val: parseInt( res )
																						};
																	
																	_valuesCaught++;
																	
																	if( _valuesCaught < _aq.conditionsGet.length )
																	{
																		return;
																	}
																	
																	// all values caught. we can now evaluate them
																	_evaluateValues();
																}
															);
					}
				}
				
				quest.checkIfDelivered({
											characterObject: forCharacterObject,
											questId: qID
										},
										function( isDelivered )
										{
											if( isDelivered )
											{
												delete returnedQuests[ qID ];
												
												after();
												
												return;
											}
											
											quest.checkIfCompleted({
																		characterObject: forCharacterObject,
																		questId: qID
																	},
																	function( isFinalized )
																	{
																		if( isFinalized )
																		{
																			returnedQuests[ qID ].isFinalized = true;
																		}
																		
																		for(var j=0;j<_aq.conditionsGet.length;j++)
																		{
																			_getCriteria( _aq.conditionsGet[ j ] );
																		}
																	});
										});
			}
			
			var _evaluatedQuests = 0, _maxQuests = 0;
			for(var i in self.associatedQuests)
			{
				var _aq = self.associatedQuests[ i ], _inProgress = forCharacterObject.activeQuests.indexOf( parseInt( i ) ) >= 0;
				
				if( _aq.opq_is_giver == null && !_inProgress )
				{
					// quest is not grabbed yet and this character can't give it
					
					continue;
				}
				
				if( _aq.opq_is_finalizer == null && _inProgress )
				{
					// quest is grabbed and this character can't finalize it
					
					continue;
				}
				
				_maxQuests++;
				
				// create returned quests structure. this will be modified by the time this function returns
				returnedQuests[ i ] = {
										quest_name: _aq.quest_name,
										quest_description: _aq.quest_description,
										quest_objectives: _aq.quest_objectives,
										quest_award_glory: _aq.quest_award_glory,
										quest_award_xp: _aq.quest_award_xp,
										quest_award_polen: _aq.quest_award_polen,
										quest_award_amber: _aq.quest_award_amber,
										levelDifference: 0,
										grabbable: true,
										inProgress: _inProgress,
										isFinalized: false
									};
				
				_checkQuestIndex( i, function()
				{
					_evaluatedQuests++;
					
					if( _evaluatedQuests < _maxQuests )
					{
						return;
					}
					
					// all quests have been evaluated
					
					after( returnedQuests );
				});
			}
		}
		
		this.initializeQuestSystem = function( after )
		{
			// get active quests for character
			self.redisClient.SMEMBERS(
										"character." + self.properties.character_id + ".questsActive",
										function(err, redisCharacterActiveQuests)
										{
											if( err )
											{
												log.addError( "Active quests fetch error: " + err );
												
												return;
											}
											
											self.activeQuests = redisCharacterActiveQuests;
											
											for(var i = 0; i < redisCharacterActiveQuests.length; i++)
											{
												self.activeQuests[ i ] = parseInt( redisCharacterActiveQuests[ i ] );
											}
											
											after();
										}
									);
		}
		
		/*
		this.connectToRedis = function( after )
		{
			// chat specific
			self.redisClient = redis.createClient();
			self.initializeQuestSystem( function()
			{
				// subscribe to the redis channel used to receive messages about this character
				self.redisClient.subscribe( "character_" + self.properties.character_id );
				self.redisClient.on(
									"message",
									function (channel, message)
									{
										// received a message from the quests daemon
										var _channelData = channel.split( "." );
										switch( _channelData[0] )
										{
											case "chat":
												self.sendToClient( JSON.stringify({
																				c: "chatMessage",
																				r: 200,
																				channelName: _channelData[ _channelData.length - 1 ],
																				channelType: _channelData[ 4 ] ? _channelData[ 4 ] : _channelData[ 1 ],
																				message: message
																			}) );
											break;
											
											default:
												var jsonEl = JSON.parse( message );
												
												if( jsonEl.type != "quest" )
												{
													return;
												}
												
												if( jsonEl.action == "complete" )
												{
													// a quest has been completed
													
													// run script for this event
													instanceObject.getQuestInfo( jsonEl.questId ).script.questCompleted({
																															byCharacterObject: self
																														});
													
													self.sendToClient( JSON.stringify({
																							c: "questCompleted",
																							questId: jsonEl.questId
																						}) );
													
													quest.getZoneQuestgiversByQuestID({
																									instanceObject: instanceObject,
																									questId: jsonEl.questId
																								},
																								function( questGivers )
																								{
																									var _getQuests = function( _qg )
																									{
																										_qg.getQuests( self, function( quests )
																										{
																											self.sendToClient( JSON.stringify({
																																					c: "questGiverUpdate",
																																					cid: _qg.properties.character_id,
																																					q: quests,
																																					r: 200
																																				}) );
																										});
																									}
																									
																									for(var i=0;i<questGivers.length;i++)
																									{
																										var _qg = instanceObject.characters[ questGivers[ i ].character_id ];
																										
																										_getQuests( _qg );
																									}
																								});
													
													return;
												}
												
												// a quest condition has changed its value
												self.sendToClient( JSON.stringify({
																						c: "questConditionUpdate",
																						r: 200,
																						questId: jsonEl.questId,
																						condition: jsonEl.condition,
																						value: jsonEl.value
																					}) );
										}
									}
								);
				
				after();
			});			
		}
		*/
		
		this.connectToRedis = function( after )
		{
			// chat specific
			self.redisClient = redis.createClient();
			
			self.initializeQuestSystem( function()
			{
				//self.initializeAchievementSystem( function()
				//{
					// subscribe to the redis channel used to receive messages about this character
					self.redisClient.subscribe( "character_" + self.properties.character_id );
					self.redisClient.on(
										"message",
										function (channel, message)
										{
											// received a message from the quests daemon
											var _channelData = channel.split( "." );
											switch( _channelData[0] )
											{
												case "chat":
													self.sendToClient( JSON.stringify({
																					c: "chatMessage",
																					r: 200,
																					channelName: _channelData[ _channelData.length - 1 ],
																					channelType: _channelData[ 4 ] ? _channelData[ 4 ] : _channelData[ 1 ],
																					message: message
																				}) );
												break;
												
												default:
													var jsonEl = JSON.parse( message );
													
													//log.add(jsonEl); // DOES NOT SATISFY!
													
													//achievements_work
													switch( jsonEl.type )
													{
														case "quest":
															if( jsonEl.action == "complete" )
															{
																// a quest has been completed
																
																// run script for this event
																instanceObject.getQuestInfo( jsonEl.questId ).script.questCompleted({
																																		byCharacterObject: self
																																	});
																
																self.sendToClient( JSON.stringify({
																										c: "questCompleted",
																										questId: jsonEl.questId
																									}) );
																
																quest.getZoneQuestgiversByQuestID({
																												instanceObject: instanceObject,
																												questId: jsonEl.questId
																											},
																											function( questGivers )
																											{
																												var _getQuests = function( _qg )
																												{
																													_qg.getQuests( self, function( quests )
																													{
																														self.sendToClient( JSON.stringify({
																																								c: "questGiverUpdate",
																																								cid: _qg.properties.character_id,
																																								q: quests,
																																								r: 200
																																							}) );
																													});
																												}
																												
																												for(var i=0;i<questGivers.length;i++)
																												{
																													var _qg = instanceObject.characters[ questGivers[ i ].character_id ];
																													
																													_getQuests( _qg );
																												}
																											});
																
																return;
															}
															
															// a quest condition has changed its value
															self.sendToClient( JSON.stringify({
																								c: "questConditionUpdate",
																								r: 200,
																								questId: jsonEl.questId,
																								condition: jsonEl.condition,
																								value: jsonEl.value
																							}) );
														break;
														
														case "achievement":
															
															if( jsonEl.action == "finalized" )
															{
																// an achievement has been completed
																
																self.sendToClient( JSON.stringify({
																									c: "achievementFinalized",
																									r: 200,
																									achievementId: jsonEl.achievementId,
																									achievementName: self.getInstance().getAchievementInfo( jsonEl.achievementId ).achievement_name
																								}) );
																
																return;
															}
															
															// a quest condition has changed its value
															self.sendToClient( JSON.stringify({
																								c: "achievementConditionUpdate",
																								r: 200,
																								achievementId: jsonEl.achievementId,
																								condition: jsonEl.condition,
																								value: jsonEl.value
																							}) );
															
														break;
													}
											}
										}
									);
					
					after();
				//});
			});			
		}
		
		//
		// Initialize based on character creation arguments
		//
		
		this.initialize = function()
		{
			// character properties
			
			self.properties = {};
			
			for(var i in args.properties[0])
			{
				if( i.indexOf( "character_" ) == -1 )
				{
					continue;
				}
				
				self.properties[i] = args.properties[0][i];
			}
			
			//
			// Grid cells
			//
			
			self.properties.character_cells_width = Math.floor( self.properties.character_width / realmConfig.realmInstanceGridCellWidth ),
			self.properties.character_cells_height = Math.floor( self.properties.character_height / realmConfig.realmInstanceGridCellHeight );
			
			self.properties.character_zone_x_target = self.properties.character_zone_x;
			self.properties.character_zone_y_target = self.properties.character_zone_y;
			
			// make sure the backups are ok
			_lastWeaponDamageStats =
			{
				mainHandMin: self.properties.character_main_hand_damage_min,
				mainHandMax: self.properties.character_main_hand_damage_max,
				offHandMin: self.properties.character_off_hand_damage_min,
				offHandMax: self.properties.character_off_hand_damage_max
			}
			
			//
			// Castable buffs list
			//
			
			if( args.properties[0].buff_id == null )
			{
				// character holds no buffs
				
				return;
			}
			
			self.buffs = [];
			
			for(var i=0;i<args.spellBookBuffs.length;i++)
			{
				self.buffs[ args.spellBookBuffs[ i ].buff_id ] = args.spellBookBuffs[ i ];
			}
			
			/*
			for(var i=0;i<args.properties.length;i++)
			{
				var _propertyArray = args.properties[i];
				
				for(var j in _propertyArray)
				{
					if( j.indexOf( "buff_" ) == -1 && j.indexOf( "cs_" ) == -1 )
					{
						continue;
					}
					
					if( typeof self.buffs[ _propertyArray.buff_id ] == "undefined" )
					{
						self.buffs[ _propertyArray.buff_id ] = {};
					}
					
					self.buffs[ _propertyArray.buff_id ][ j ] = _propertyArray[j];
				}
			}
			*/
			
			return true;
		}
		
		this.initialize();
		
		afterFunction( this );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	