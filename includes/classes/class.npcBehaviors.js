	
    "use strict"; // enable strict mode within this file
	
	var log = require( "./class.log" ),
			realmConfig = require( "../config.realm" ).config;
	
	//
	// Spirit Healer
	// Expected to resurrect periodically all NPCs on its radius
	//
	
	exports.spiritHealer = {
		
		enable: function( args )
		{
			//
			// Variables
			//
			
			var _lastResurrectionDate = new Date().getTime(), npcObject = args.npcObject;
			var _getResurrectionCooldown = function()
			{
				return ( _lastResurrectionDate + realmConfig.realmInstanceResurrectionInterval ) - ( new Date() ).getTime();
			}
			
			//
			// Events override
			//
			
			npcObject.events._add( "auraEnter", function( args )
			{
				var _c = args.withCharacterObject;
				
				if( _c.properties.character_is_alive != null )
				{
					// character is alive
					
					return;
				}
				
				_c.sendToClient( JSON.stringify({
													c: "instanceResurrectionCooldownTimer",
													cd: _getResurrectionCooldown(),
													r: 200
												}) );
			});
			
			npcObject.events._add( "auraLeave", function( args )
			{
				var _c = args.fromCharacterObject;
				
				if( _c.properties.character_is_alive != null )
				{
					// character is alive
					
					return;
				}
				
				_c.sendToClient( JSON.stringify({
													c: "instanceResurrectionCooldownStop",
													r: 200
												}) );
			});
			
			npcObject.events._add( "bindToInstance", function( args )
			{
				var _periodicResurrectionIntervalPointer = null;
				
				var _periodicResurrectionFunction = function()
				{
					_lastResurrectionDate = new Date().getTime();
					
					for(var i=0;i<npcObject.collidingWith.length;i++)
					{
						var _c = npcObject.collidingWith[ i ];
						
						if(
							_c.properties.character_is_alive != null
							|| _c.isResurrectable == false
							|| ( args.resurrectOnlySameFaction &&  _c.properties.character_faction != npcObject.properties.character_faction )
						)
						{
							// character is alive, not resurrectable, or, in special cases, not of the same faction
							
							continue;
						}
						
						log.addNotice( "Auto resurrecting " + _c.properties.character_id );
						
						_c.resurrect({
										resurrectCharacterObject: _c
									});
					}
					
					_periodicResurrectionIntervalPointer = setTimeout(
																				_periodicResurrectionFunction,
																				realmConfig.realmInstanceResurrectionInterval
																			);
				};
				
				// start right away
				_periodicResurrectionFunction();
			});
			
			//
			// Initialize
			//
			
			log.addNotice( "Enabling spirit healer behavior for " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " )" );
			
			npcObject.isResurrectable = false;
			npcObject.properties.character_is_alive = null;
			npcObject.addHistory = npcObject.addHistoryToTheDead;
			
			if( args.onComplete )
			{
				args.onComplete();
			}
		},
		
		disable: function()
		{
			
		}
		
	};
	
	//
	// Relative Path Calculator
	// will transform an absolute path into a relative one, considering an object's x and y coordinates
	//
	
	exports.relativePathTransformer = function( args )
	{
		var _co = args.characterObject,
				
				_x = _co.properties.character_zone_x,
				_y = _co.properties.character_zone_y,
				_path = args.absolutePath,
				_relativePath = [ ];
		
		for(var i=0;i<_path.length;i++)
		{
			_relativePath.push( [ _path[ i ][ 0 ] + _x, _path[ i ][ 1 ] + _y ] );
		}
		
		args.onSuccess( _relativePath );
	}
	
	//
	// Unique Path determiner
	// Will determine a unique, least used path
	//
	
	exports.uniquePathChooser = function( args )
	{
		var _op = args.instanceObject.objectPaths, _minUsedPathObject, _minUsedPathValue = 0;
		
		for(var i=0;i<args.paths.length;i++)
		{
			var _iP = _op[ args.paths[ i ] ];
			
			if( !_iP )
			{
				_op[ args.paths[ i ] ] = 0;
			}
			
			if( _minUsedPathValue >= _iP )
			{
				continue;
			}
			
			_minUsedPathValue = _iP;
			_minUsedPathObject = args.paths[ i ];
		}
		
		args.onSuccess( _minUsedPathObject );
	}
	
	//
	// Aggressive Patrol NPC
	// Expected to move on a path and attack all enemies. Upon the enemy dying or enemy leaving aura, it will search for another enemy. If no enemy is found, it will return on its path. Upon finishing its path it will disconnect
	//
	
	var _npcPatrolAggressive = {
		
		enable: function( args ) 
		{
			//
			// Variables
			//
			
			var npcObject = args.npcObject, _currentPathStepNumber = 0, _currentInstance = null, _currentTarget = null, _followTargetTimeoutObject = null;
			
			var _resumePath = function()
			{
				if( !npcObject.isAlive )
				{
					return;
				}
				
				if( _currentInstance == null )
				{
					// disconnected in the meantime
					
					npcObject.command_move_stop( function()
					{
						
					});
					
					return;
				}
				
				npcObject.command_move_path({
												path: args.movePath,
												delay: 10,
												startPoint: _currentPathStepNumber,
												iterate: function( stepNumber )
												{
													// memorize the current step number
													
													_currentPathStepNumber = stepNumber;
													
													if( _currentInstance == null )
													{
														// disconnected in the meantime
														
														npcObject.command_move_stop( function()
														{
															
														});
														
														return;
													}
													
												},
												after: function()
												{
													// upon reaching the target, this NPC will disconnect itself
													
													//log.addWarning( "character " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " ) has reached the target" );
													
													if( args.cyclePath )
													{
														_currentPathStepNumber = 0;
														
														_resumePath();
														
														return;
													}
													
													// no cycle
													
													_removeTarget(function()
													{
														/*
														npcObject.command_disconnect( function()
														{
															
														});*/
													});
												}
											});
			}
			
			var _followTarget = function( targetCharacterObject )
			{
				if( !npcObject.isAlive )
				{
					return;
				}
				
				if( _currentTarget == null )
				{
					_resumePath();
					
					return;
				}
				
				npcObject.command_move_path_stop( function()
				{
					npcObject.command_follow({
												characterObject: targetCharacterObject,
												range: targetCharacterObject.properties.character_width / 2,
												onFailure: function()
												{
													// target is no longer targetable
													
													//log.addWarning( "failure " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " ) has reached the target " + _currentTarget );
													_resumePath();
												},
												onReach: function()
												{
													//log.addWarning( "reached " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " ) has reached the target " + _currentTarget );
													if( _currentTarget == null )
													{
														// changed target in the meantime
														
														_resumePath();
														
														return;
													}
													
													if( npcObject.buffs[ 75 ].inCooldown )		// check if "strike" is available
													{
														//log.addWarning( "can't strike" );
														// can't cast buff yet
														
														_followTargetTimeoutObject = setTimeout( function()
														{
															// repeat
															_followTarget( targetCharacterObject );
														}, 2000 );
														
														return;
													}
													
													// buff may be casted and we're in range
													
													npcObject.command_cast(
																			npcObject.buffs[ 75 ],				// strike
																			targetCharacterObject,
																			function( result )
																			{
																				if( _currentInstance == null )
																				{
																					return;
																				}
																				
																				//log.addWarning( "strike on " + _currentTarget + " r: " + result.r );
																				if( _currentTarget == null )
																				{
																					_resumePath();
																					
																					return;
																				}
																				
																				if( result.r == 302 )
																				{
																					// buff in cooldown
																					
																					_followTargetTimeoutObject = setTimeout( function()
																					{
																						_followTarget( targetCharacterObject );
																					}, 100 );
																					
																					return;
																				}
																				
																				if( result.r != 200 )
																				{
																					log.addNotice( "Error autoattacking target " + result.r );
																					
																					return;
																				}
																				
																				// repeat
																				_followTarget( targetCharacterObject );
																			}
																		);
												}
											});
				});
			}
			
			var _findAnotherTarget = function()
			{
				if( !npcObject.isAlive )
				{
					return;
				}
				
				for(var i=0;i<npcObject.collidingWith.length;i++)
				{
					var _cO = npcObject.collidingWith[ i ];
					
					if(
						!_currentInstance.characterMayTargetCharacter( npcObject, _cO )								// unable to target
						|| _currentInstance.charactersCompareFriendRelationship( npcObject, _cO ) == true		// friends
						|| _cO.properties.character_hp_max == 0																// invulnerable
					)
					{
						// not a good target
						
						continue;
					}
					
					_currentTarget = _cO
					
					_followTarget( _cO );
					
					return _cO;
				}
				
				return false;
			}
			
			var _removeTarget = function( after )
			{
				clearTimeout( _followTargetTimeoutObject );
				
				_followTargetTimeoutObject = null;
				_currentTarget = null;
				
				npcObject.command_move_path_stop( function()
				{
					after();
				});
			}
			
			//
			// Events override
			//
			
			npcObject.events._add( "auraEnter", function( args )
			{
				if( _currentTarget != null )
				{
					// already have a target
					
					return;
				}
				
				var _c = args.withCharacterObject;
				
				if(
					!_currentInstance.characterMayTargetCharacter( npcObject, _c )							// unable to target
					|| _currentInstance.charactersCompareFriendRelationship( npcObject, _c ) == true	// friends
					|| _c.properties.character_hp_max == 0																// invulnerable
				)
				{
					return;
				}
				
				_currentTarget = _c;
				
				_followTarget( _c );
			});
			
			var _opponentTreatmentFunction = function( args )
			{
				if( !npcObject.isAlive )
				{
					return;
				}
				
				if(
					_currentTarget == null
					|| args.opponentObject.properties.character_id != _currentTarget.properties.character_id
				)
				{
					// 3rd party opponent killed. maybe AoE
					
					return;
				}
				
				// killed my current target
				
				_removeTarget(function()
				{
					// move on
					if( _findAnotherTarget() )
					{
						return;
					}
					
					_resumePath();
				});
			};
			
			npcObject.events._add( "killedOpponent", _opponentTreatmentFunction );
			npcObject.events._add( "removedOpponent", _opponentTreatmentFunction );
			npcObject.events._add( "auraLeave", function( args )
			{
				_opponentTreatmentFunction( { opponentObject: args.fromCharacterObject } );
			});
			
			npcObject.events._add( "die", function( args )
			{
				// upon death, this NPC will disconnect itself
				
				//_followTarget = function() { };
				//_resumePath = function() { };
				
				_removeTarget(function()
				{
					/*npcObject.command_disconnect( function()
					{
						
					});*/
				});
			});
			
			npcObject.events._add( "bindToInstance", function( args )
			{
				_currentInstance = args.instanceObject;
				
				_resumePath();
			});
			
			npcObject.events._add( "resurrect", function( args )
			{
				_currentInstance = args.instanceObject;
				
				_resumePath();
			});
			
			npcObject.events._add( "disconnect", function( args )
			{
				_currentInstance = null;
			});
			
			//
			// Initialize
			//
			
			log.addNotice( "Enabling aggressive NPC Patrol behavior for " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " )" );
		},
		
		disable: function()
		{
			
		}
		
	};
	
	exports.npcPatrolAggressive = _npcPatrolAggressive;
	
	//
	// Aggressive Patrol NPC, looped version
	// Expected to move on a path and attack all enemies. Upon the enemy dying or enemy leaving aura, it will search for another enemy. If no enemy is found, it will return on its path. Upon finishing its path it will move to the first point and cycle endlessly
	//
	
	exports.npcPatrolAggressiveLoop = {
		
		enable: function( args )
		{
			return new _npcPatrolAggressive.enable({
														npcObject: args.npcObject,
														movePath: args.movePath,
														cyclePath: true
													});
		},
		
		disable: function()
		{
			
		}
		
	}
	
	//
	// Aggressive NPC
	// Once an enemy enters its aura, it will attack. Upon the enemy dying or enemy leaving aura, it will search for another enemy. If no enemy is found, it will return to its initial position
	//
	
	exports.npcAggressive = {
		
		enable: function( args )
		{
			//
			// Variables
			//
			
			var npcObject = args.npcObject,
					_currentInstance = null,
					_currentTarget = null,
					_followTargetTimeoutObject = null,
					_initX = 0,
					_initY = 0;
			
			var _backToStart = function()
			{
				npcObject.command_move({
									x: _initX,
									y: _initY,
									r: Math.atan2( ( npcObject.properties.character_zone_y - _initY ), ( npcObject.properties.character_zone_x - _initX ) ) * 57.2957,
									range: 0,
									after: function()
									{
										
									}
								});
			}
			
			var _followTarget = function( targetCharacterObject )
			{
				if( _currentTarget == null )
				{
					_backToStart();
					
					return;
				}
				
				log.addNotice( npcObject.properties.character_id_object_pool + " following target " + targetCharacterObject.properties.character_id );
				
				npcObject.stopMovement( function()
				{
					npcObject.command_follow({
												characterObject: targetCharacterObject,
												range: targetCharacterObject.properties.character_width * 0.75,
												onFailure: function()
												{
													// target is no longer targetable
													
													_backToStart();
												},
												onReach: function( inRangeAlready )
												{
													var _performAttack = function()
													{
														if( npcObject.buffs[ 75 ].inCooldown )		// check if "strike" is available
														{
															// can't cast buff yet
															
															_followTargetTimeoutObject = setTimeout( function()
															{
																// repeat
																_followTarget( targetCharacterObject );
															}, 2000 );
															
															return;
														}
														
														// buff may be casted and we're in range
														
														npcObject.command_cast(
																				npcObject.buffs[ 75 ],				// strike
																				targetCharacterObject,
																				function( result )
																				{
																					log.addNotice( npcObject.properties.character_id_object_pool + " attack " + JSON.stringify( result ) );
																					
																					if( _currentInstance == null )
																					{
																						return;
																					}
																					
																					if( _currentTarget == null )
																					{
																						_backToStart();
																						
																						return;
																					}
																					
																					if( result.r == 302 )
																					{
																						// buff in cooldown
																						
																						_followTargetTimeoutObject = setTimeout( function()
																						{
																							_followTarget( targetCharacterObject );
																						}, 100 );
																						
																						return;
																					}
																					
																					if( result.r != 200 )
																					{
																						log.addNotice( "Error autoattacking target " + result.r );
																						
																						return;
																					}
																					
																					// repeat
																					_followTarget( targetCharacterObject );
																				}
																			);
													}
													
													log.addNotice( npcObject.properties.character_id_object_pool + " reached target " + targetCharacterObject.properties.character_id );
													
													if( _currentTarget == null )
													{
														// changed target in the meantime
														
														_backToStart();
														
														return;
													}
													
													if( inRangeAlready )
													{
														log.addNotice( "moving in range" );
														
														var _vx = npcObject.properties.character_zone_x - targetCharacterObject.properties.character_zone_x,
																_vy = npcObject.properties.character_zone_y - targetCharacterObject.properties.character_zone_y,
																_magV = Math.sqrt( _vx * _vx + _vy * _vy ),
																_tx = targetCharacterObject.properties.character_zone_x + _vx / _magV * ( targetCharacterObject.properties.character_width * 0.75 ),
																_ty = targetCharacterObject.properties.character_zone_y + _vy / _magV * ( targetCharacterObject.properties.character_height * 0.75 );
														
														npcObject.command_move({
																				x: _tx,
																				y: _ty,
																				r: npcObject.changeRotation( _tx, _ty ),
																				range: 0,
																				after: function( inRangeAlready )
																				{
																					log.addNotice( "reached range " + inRangeAlready );
																					
																					_performAttack();
																				}
																			});
														
														return;
													}
													
													_performAttack();
												}
											});
				});
			}
			
			var _findAnotherTarget = function()
			{
				for(var i=0;i<npcObject.collidingWith.length;i++)
				{
					var _cO = npcObject.collidingWith[ i ];
					
					if(
						!_currentInstance.characterMayTargetCharacter( npcObject, _cO )								// unable to target
						|| _currentInstance.charactersCompareFriendRelationship( npcObject, _cO ) == true		// friends
						|| _cO.properties.character_hp_max == 0																// invulnerable
					)
					{
						// not a good target
						
						continue;
					}
					
					_currentTarget = _cO;
					
					_followTarget( _cO );
					
					return _cO;
				}
				
				return false;
			}
			
			var _removeTarget = function( after )
			{
				clearTimeout( _followTargetTimeoutObject );
				
				_followTargetTimeoutObject = null;
				_currentTarget = null;
				
				npcObject.command_move_path_stop( function()
				{
					after();
				});
			}
			
			//
			// Events override
			//
			
			npcObject.events._add( "auraEnter", function( args )
			{
				if( _currentTarget != null )
				{
					// already have a target
					
					return;
				}
				
				var _c = args.withCharacterObject;
				
				if(
					!_currentInstance.characterMayTargetCharacter( npcObject, _c )							// unable to target
					|| _currentInstance.charactersCompareFriendRelationship( npcObject, _c ) == true	// friends
				)
				{
					return;
				}
				
				log.addNotice( npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " ) is starting follow on " + _c.properties.character_id );
				
				_currentTarget = _c;
				
				_followTarget( _c );
			});
			
			var _opponentTreatmentFunction = function( args )
			{
				if(
					_currentTarget == null
					|| args.opponentObject.properties.character_id != _currentTarget.properties.character_id
				)
				{
					// 3rd party opponent killed. maybe AoE
					
					return;
				}
				
				// killed my current target
				
				_removeTarget(function()
				{
					// move on
					if( _findAnotherTarget() )
					{
						return;
					}
					
					_backToStart();
				});
			};
			
			npcObject.events._add( "killedOpponent", _opponentTreatmentFunction );
			npcObject.events._add( "removedOpponent", _opponentTreatmentFunction );
			npcObject.events._add( "auraLeave", function( args )
			{
				_opponentTreatmentFunction( { opponentObject: args.fromCharacterObject } );
			});
			
			npcObject.events._add( "die", function( args )
			{
				// upon death, this NPC will disconnect itself
				
				//_followTarget = function() { };
				
				_removeTarget(function()
				{
					/*npcObject.command_disconnect( function()
					{
						
					});*/
				});
			});
			
			npcObject.events._add( "bindToInstance", function( args )
			{
				_currentInstance = args.instanceObject;
				
				// remember the spawning point
				
				_initX = npcObject.properties.character_zone_x;
				_initY = npcObject.properties.character_zone_y;
			});
			
			npcObject.events._add( "disconnect", function( args )
			{
				_currentInstance = null;
			});
			
			//
			// Initialize
			//
			
			log.addNotice( "Enabling aggressive NPC behavior for " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " )" );
		},
		
		disable: function()
		{
			
		}
		
	};
	
	//
	// Patrolling NPC
	// Expected to move on a path and interract with friendly characters
	//
	
	exports.npcPatrol = {
		
		enable: function( args )
		{
			//
			// Variables
			//
			
			
			
			//
			// Events override
			//
			
			
			
			//
			// Initialize
			//
			
			log.addNotice( "Enabling patrolling NPC behavior for " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " )" );
			
			
		},
		
		disable: function()
		{
			
		}
		
	};
	
	//
	// Dead man walking
	// Expected to move on a path and perform an action once it reaches the target. It does not react to any target
	//
	
	exports.deadManWalking = {
		
		enable: function( args )
		{
			//
			// Variables
			//
			
			var npcObject = args.npcObject;
			
			//
			// Events override
			//
			
			npcObject.events._add( "die", function()
			{
				// somehow, i died
				
				npcObject.command_move_path_stop( function()
				{
					
				});
			});
			
			npcObject.events._add( "bindToInstance", function()
			{
				npcObject.command_move_path({
												path: args.movePath,
												delay: 10,
												startPoint: 0,
												iterate: function( stepNumber )
												{
													// memorize the current step number
													
													
												},
												after: function()
												{
													// upon reaching the target, this NPC will die
													
													npcObject.die({
																killerCharacterObject: args.npcObject
															});
												}
											});
			});
			
			//
			// Initialize
			//
			
			log.addNotice( "Enabling dead man walking NPC behavior for " + npcObject.properties.character_id + " ( " + npcObject.properties.character_id_object_pool + " )" );
		},
		
		disable: function()
		{
			
		}
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	