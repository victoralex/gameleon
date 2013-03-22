	
    "use strict"; // enable strict mode within this file
	
	/*
		----------------
		Instance Object
		----------------
	*/
	
	var realmConfig = require('../config.realm').config,
		log = require("./class.log"),
		fs = require( "fs" ),
		buffEffect = require( "./class.buffEffect" ),
		stats = require( "./class.stats" ),
		quadTree = require('./class.quadtree').QuadTree,
		quadTreeCircle = require('./class.quadtree').QuadCircleStructure,
		redis = require( realmConfig.libraries.redisPath ),
		syncSQL = new (require('./class.syncSQL')).p,
		npc = require( "./class.npc" ),
		aStarLibrary = require( "./class.aStar" );
	
	exports.instance = function( args ) 
	{
		var self = this,
				_periodicResurrectionIntervalPointer = null,
				factionPoints = { anterium: 0, hegemony: 0 },
				maxFactionPoints = 0,
				charactersEverJoinedMinimalData = {};
		
		this.startDate = new Date();
		this.charactersInInstance = 0;
		this.zone_id = args.zone_id;
		this.zone_id_zone_pool = args.zone_id_zone_pool;
		this.zoneData = args.zoneData;
		this.characters = [];		// players
		this.tic_interval = 50;		// used for calculations related to movement
		this.grid = [];
		this.lastResurrectionDate = null;
		this.objects = {};			// NPCs
		this.sql = args.instanceProcess.sql;
		this.objectPaths = [];			// global object paths
		
		this.timers = [];	// timer objects
		
		// redis connect
		this.redisClient = redis.createClient();
		
		//
		// Events
		//
		
		this.events = {
			
			afterInit: [],
			addCharacter: [],
			removeCharacter: [],
			reconnectCharacter: [],
			maxPointsReached: [],
			addObjects: [],
			
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
		
		this.getArgs = function()
		{
			return args;
		}
		
		//
		// Broadcasting messages
		//
		
		this.broadcastMessage = function( messageString )
		{
			for(var i in self.characters)
			{
				var _c = self.characters[ i ];
				
				if( _c.properties.character_type != 3 )
				{
					// not a player
					
					continue;
				}
				
				_c.sendToClient( messageString );
			}
		}
		
		//
		// Utility
		//
		
		this.isPlayer = function( args )
		{
			if( args.characterObject.properties.character_id_object_pool == null )
			{
				args.onSuccess();
			}
			else
			{
				args.onFailure();
			}
		}
		
		this.isNPC = function( args )
		{
			if( args.characterObject.properties.character_id_object_pool != null )
			{
				args.onSuccess();
			}
			else
			{
				args.onFailure();
			}
		}
		
		//
		// Surface manipulation
		//
		
		this.getSurface = function()
		{
			return args.zoneSurface;
		}
		
		this.getMinimalPath = function( startX, startY, endX, endY )
		{
			var _g = aStarObject.grid.nodes,
					_grid = args.zoneSurface.grid,
					_start = _g[ Math.ceil( Math.floor( startX ) / realmConfig.realmInstanceGridCellWidth ) ][ Math.ceil( Math.floor( startY ) / realmConfig.realmInstanceGridCellHeight ) ],
					_end = _g[ Math.ceil( Math.floor( endX ) / realmConfig.realmInstanceGridCellWidth ) ][ Math.ceil( Math.floor( endY ) / realmConfig.realmInstanceGridCellHeight ) ];
			
			var result = aStarObject.astar(
													_g,
													_start,
													_end,
													null
													/*
													function(Point,Goal)
													{
														// euclidean
														
														return Math.sqrt(Math.pow(Point.x-Goal.x,2)+Math.pow(Point.y-Goal.y,2));
													}
													*/
												);
			
			for(var i=0;i<result.length - 1;i++)
			{
				for(var j=result.length - 1;j>i;j--)
				{
					var collided = false;
					
					aStarLibrary.rayTrace(
								result[ i ].x,
								result[ i ].y,
								result[ j ].x,
								result[ j ].y,
								function( x, y )
								{
									if( _grid[ x ][ y ] == 0 )
									{
										return;
									}
									
									// collision
									
									collided = true;
									
									// finish the raytrace right away
									return true;
								}
							);
					
					if( collided == false )
					{
						// smooth path from point i to point j
						
						result.splice( i, j - i );
						
						break;
					}
				}
			}
			
			var _result = [];
			for(var i=0;i<result.length;i++)
			{
				_result.push( [ result[ i ].x * realmConfig.realmInstanceGridCellWidth, result[ i ].y * realmConfig.realmInstanceGridCellHeight ] );
			}
			
			return _result;
		}
		
		var _cutGrid = function( x1, y1, x2, y2 )
		{
			return self.getSurface().grid.filter( 	function()
																	{
																		return index >= x1 && index <= x2;
																	}).filter( function()
																	{
																		return index >= y1 && index <= y2;
																	});
		}
		
		var _gridInitializationPointer = null;
		var _initializeGrid = function()
		{
			aStarObject.grid = new aStarObject.Graph( self.getSurface().grid );
		}
		
		this.surfaceGenerateForCharacter = function( characterObject )
		{
			var _clonedGrid = JSON.parse( JSON.stringify( self.getSurface().grid ) );
			
			var _cp = characterObject.properties,
					_sx = Math.floor( ( _cp.character_zone_x - ( _cp.character_width / 2 ) ) / realmConfig.realmInstanceGridCellWidth ),
					_sy = Math.floor( ( _cp.character_zone_y - ( _cp.character_height / 2 ) ) / realmConfig.realmInstanceGridCellHeight );
			
			// set the grid surface as occupied
			for(var k=0;k<self.properties.character_cells_width;k++)
			{
				for(var j=0;j<_ccHeight;j++)
				{
					if( _clonedGrid[ _sx + k ][ _sy + j ] == 1 )
					{
						// wall
						
						continue;
					}
					
					_clonedGrid[ _sx + k ][ _sy + j ] = _cp.character_id;
				}
			}
			
			return _clonedGrid;
		}
		
		var _originalSurfaceContent = {};
		this.surfaceSetValueUsingPoly = function( _args )
		{
			var _polyPath = realmConfig.realmInstallPath + "/public_web/components/bugcraft/resources/private/maps_meta/" + self.zone_id_zone_pool + "_" + _args.polyName + ".js";
			
			fs.readFile(
						_polyPath,
						function( err, data )
						{
							if( err )
							{
								log.addError( "Polygon file " + _polyPath + " not found" );
								
								return;
							}
							
							var _fileContent = JSON.parse( data ),
									_modifiedSurfaceContent = [];
							
							_originalSurfaceContent[ _args.polyName ] = [];
							
							for(var i=0;i<_fileContent.map.length;i++)
							{
								var _mapX = _fileContent.map[ i ];
								
								_originalSurfaceContent[ _args.polyName ][ i ] = [];
								_modifiedSurfaceContent[ i ] = [];
								
								for(var j=0;j<_mapX.length;j++)
								{
									_originalSurfaceContent[ _args.polyName ][ i ][ j ] = args.zoneSurface.grid[ _fileContent.startX + i ][ _fileContent.startY + j ];
									
									if( _mapX[ j ] == 0 )
									{
										// area unaffected by the poly
										
										_modifiedSurfaceContent[ i ][ j ] = _originalSurfaceContent[ _args.polyName ][ i ][ j ];
										
										continue;
									}
									
									_modifiedSurfaceContent[ i ][ j ] = _args.cellValue;
									
									args.zoneSurface.grid[ _fileContent.startX + i ][ _fileContent.startY + j ] = _args.cellValue;
								}
							}
							
							// reInit the grid
							_initializeGrid();
							
							_args.after({
										startX: _fileContent.startX,
										startY: _fileContent.startY,
										content: _modifiedSurfaceContent
									});
						}
					);
		}
		
		this.surfaceSetWalkablePoly = function( polyName, after )
		{
			self.surfaceSetValueUsingPoly({
												polyName: polyName,
												cellValue: 0,
												after: function( modifiedSurfaceData )
												{
													after();
													
													self.broadcastMessage( JSON.stringify({
																									c: "mapUpdate",
																									sd: modifiedSurfaceData
																								}) );
												}
											});
			
		}
		
		this.surfaceSetObstaclePoly = function( polyName, after )
		{
			self.surfaceSetValueUsingPoly({
												polyName: polyName,
												cellValue: 1,
												after: function( modifiedSurfaceData )
												{
													after();
													
													self.broadcastMessage( JSON.stringify({
																									c: "mapUpdate",
																									sd: modifiedSurfaceData
																								}) );
												}
											});
			
		}
		
		//
		// Quests manipulation
		//
		
		this.getQuestInfo = function( questID )
		{
			return args.questsData[ questID ];
		}
		
		//
		// Achievements manipulation
		//
		
		this.getAchievementInfo = function( achievementID )
		{
			return args.achievementsData[ achievementID ];
		}
		
		this.getAchievementsData = function()
		{
			return args.achievementsData;
		}
		
		//
		// Chat channels
		//
		
		var redisClientChat = redis.createClient();
		redisClientChat.on(
							"message",
							function( channel, message )
							{
								//log.add( channel + " - " + message );
							}
						);
		
		this.listenToChatChannel = function( channel )
		{
			redisClientChat.subscribe(
										channel, 
										function( err, res )
										{
											if( err )
											{
												log.addError( "Error listening to chat channel: " + channel + " - " + err );
												return;
											}
											
											log.add( "Instance listening to chat channel: " + channel );
										}
									);
		}
		
		this.stopListeningToChatChannel = function( channel )
		{
			redisClientChat.unsubscribe(
												channel, 
												function( err, res )
												{
													if( err )
													{
														log.addError( "Error stop listening to chat channel: " + channel + " - " + err );
														return;
													}
													
													log.add( "Stopped listening to channel: " + channel );
												}
											);
		}
		
		//
		// Collision detection and manipulation
		//
		
		var _quadTree = new quadTree({
											x: 0,
											y: 0,
											width: args.zoneSurface.width,
											height: args.zoneSurface.height
										}, false, 7 );
		
		this._checkRadialCollisions = function( args )
		{
			var _chars = [], _quadCircle = [];
			
			_quadTree.clear();
			
			var _checkCollision = function( _param )
			{
				return ( (( _param.dx * _param.dx )  + ( _param.dy * _param.dy )) < (_param.radii * _param.radii) );
			}
			
			// add characters into the quadtree
			for(var i in self.characters)
			{
				var _c = self.characters[ i ];
				
				if( !args.addCondition( _c ) )
				{
					continue;
				}
				
				_chars.push( _c );
				_quadCircle.push( new quadTreeCircle( _c, args.getRadius( _c ) ) );
				
				_quadTree.insert(
								_quadCircle[ _quadCircle.length - 1 ]
							);
			}
			
			//_quadTree.print();
			
			// parse the result
			for(var i=0;i<_chars.length;i++)
			{
				var _c = _chars[ i ],
						_items = _quadTree.retrieve( _quadCircle[ i ] );	// get all the elements in this object's vecinity
				
				for(var j=0;j<_items.length;j++)
				{
					var _item = _items[ j ]._object;
					
					if( _c == _item )
					{
						continue;
					}
					
					// check aura collisions
					
					if( _checkCollision({
								dx: _c.properties.character_zone_x - _item.properties.character_zone_x,
								dy: _c.properties.character_zone_y - _item.properties.character_zone_y,
								radii: args.getCollisionRadius( _c, _item )
					})	)
					{
						// objects colliding
						
						args.onCollide( _c, _item );
						
						continue;
					}
					
					// objects not colliding
					
					args.onNotCollide( _c, _item );
				}
			}
		}
		
		this._checkRadialCollisionsNoQuad = function( args )
		{
			var _chars = [], _keys = Object.keys( self.characters );
			
			var _checkCollision = function( _param )
			{
				return ( (( _param.dx * _param.dx )  + ( _param.dy * _param.dy )) < (_param.radii * _param.radii) );
			}
			
			// add characters into the quadtree
			for(var i=0;i<_keys.length;i++)
			{
				var _c = self.characters[ _keys[ i ] ];
				
				if( !args.addCondition( _c ) )
				{
					continue;
				}
				
				for(var j=0;j<_keys.length;j++)
				{
					if( i == j )
					{
						// don't check collisions with self
						
						continue;
					}
					
					var _item = self.characters[ _keys[ j ] ];
					
					if( _checkCollision({
								dx: _c.properties.character_zone_x - _item.properties.character_zone_x,
								dy: _c.properties.character_zone_y - _item.properties.character_zone_y,
								radii: args.getCollisionRadius( _c, _item )
					})	)
					{
						// objects colliding
						
						args.onCollide( _c, _item );
						
						continue;
					}
					
					// objects not colliding
					
					args.onNotCollide( _c, _item );
				}
			}
		}
		
		this.characterCollisionsCheck = function()
		{
			// check for character aura radius
			
			self._checkRadialCollisionsNoQuad({
										getCollisionRadius: function( _c, _i )
										{
											return _c.properties.character_aura_radius;
										},
										addCondition: function()
										{
											// all characters must be considered
											
											return true;
										},
										onCollide: function( _c, _item )
										{
											if( _c.collidingWith.indexOf( _item ) > -1 )
											{
												// collided before
												
												return;
											}
											
											// never collided before
											
											_c.collidingWith.push( _item );
											_item.inAuraOf.push( _c );
											
											_c.events._run( "auraEnter", { withCharacterObject: _item } );
											//_item.events._run( "auraEnter", { withCharacterObject: _c } );
										},
										onNotCollide: function( _c, _item )
										{
											var _collidePosition = _c.collidingWith.indexOf( _item );
											
											if( _collidePosition == -1 )
											{
												// objects have not previously collided
												
												return;
											}
											
											// objects have previously collided
											
											_c.collidingWith.splice( _collidePosition, 1 );
											_item.inAuraOf.splice( _item.inAuraOf.indexOf( _c ), 1 );
											
											_c.events._run( "auraLeave", { fromCharacterObject: _item } );
											//_item.events._run( "auraLeave", { fromCharacterObject: _c } );
										}
									});
			
			/*
			// check for character movement collisions (aka one is walking over the other)
			
			self._checkRadialCollisions({
										getRadius: function( _c )
										{
											return _c.properties.character_width;
										},
										getCollisionRadius: function( _c, _i )
										{
											return Math.max( _c.properties.character_width, _i.properties.character_width );
										},
										addCondition: function()
										{
											// all characters must be considered
											
											return true;
										},
										onCollide: function( _c, _item )
										{
											// one object has entered the other's private space. recalculate path
											
											
										},
										onNotCollide: function( _c, _item )
										{
											// they're not intersecting. all good
											
											
										}
									});
			*/
			
			// check for out of combat radius
			
			self._checkRadialCollisionsNoQuad({
										getRadius: function()
										{
											return realmConfig.realmMaxCharacterDistance;
										},
										getCollisionRadius: function( _c, _i )
										{
											return realmConfig.realmMaxCharacterDistance;
										},
										addCondition: function( _c )
										{
											// character not in combat with anybody
											
											return _c.opponents.length;
										},
										onCollide: function( _c, _item )
										{
											// still in range
										},
										onNotCollide: function( _c, _item )
										{
											if( !_c.opponents[ _item.properties.character_id ] )
											{
												// they aren't opponents. this doesn't matter
												
												return;
											}
											
											// no longer in range. remove opponent
											
											_item.removeOpponent( _c, function()
											{
												// bijective
												_c.removeOpponent( _item, function()
												{
													
												});
											});
										}
									});
			
			// ensure the opperation is iterated again
			
			setTimeout(
					self.characterCollisionsCheck,
					realmConfig.instanceAuraChecksInterval
				);
		}
		
		//
		// Character manipulation
		//
		
		this.removeNPC = function( characterObject, after )
		{
			var _op = self.objects[ characterObject.properties.character_id_object_pool ];
			
			if( _op )
			{
				for( var i=0;i<_op.length;i++)
				{
					if( _op[ i ].properties.character_id != characterObject.properties.character_id )
					{
						continue;
					}
					
					_op.splice( i, 1 );
					
					break;
				}
				
				if( _op.length == 0 )
				{
					delete self.objects[ characterObject.properties.character_id_object_pool ];
				}
			}
			
			delete self.characters[ characterObject.properties.character_id ];
			
			self.charactersInInstance--;
			
			self.events._run( "removeCharacter", { characterObject: characterObject } );
			
			after();
		}
		
		this.removeCharacter = function( characterObject, after )
		{
			delete self.characters[ characterObject.properties.character_id ];
			
			self.charactersInInstance--;
			
			// make sure that the master doesn't associate this character's user with this instance
			args.instanceProcess.messageToRealm(
															{
																cmd: "disconnectCharacter",
																zpID: self.zone_id_zone_pool,
																cid: characterObject.properties.character_id,
																uid: characterObject.properties.character_id_user
															},
															function()
															{
																// run attached scripts
																self.events._run( "removeCharacter", { characterObject: characterObject } );
																
																if( self.charactersInInstance >= args.zoneData.zp_faction_min_players )
																{
																	self.stopAutoShutdown();
																}
																else
																{
																	//self.startAutoShutdown();
																}
																
																after();
															}
														);
		}
		
		this.addNPC = function( characterObject )
		{
			self.charactersInInstance++;
			
			// add new character to the instance
			self.characters[ characterObject.properties.character_id ] = characterObject;
			
			// run attached scripts
			self.events._run( "addCharacter", { characterObject: characterObject } );
			
			// log this event
			log.add( "Added NPC " + characterObject.properties.character_id + " to instance " + self.zone_id + ". Total " + self.charactersInInstance );
		}
		
		this.addCharacter = function( characterObject )
		{
			var _addNewCharacter = function()
			{
				self.charactersInInstance++;
				
				if( self.charactersInInstance >= args.zoneData.zp_faction_min_players )
				{
					self.stopAutoShutdown();
				}
				else
				{
					//self.startAutoShutdown();
				}
				
				// add new character to the instance
				self.characters[ characterObject.properties.character_id ] = characterObject;
				
				// save minimal information for history purposes
				charactersEverJoinedMinimalData[ characterObject.properties.character_id ] = {
																												name: characterObject.properties.character_name,
																												faction: characterObject.properties.character_faction,
																												class: characterObject.properties.character_class
																											};
				
				// run attached scripts
				self.events._run( "addCharacter", { characterObject: characterObject } );
				
				// log this event
				log.add( "Added character " + characterObject.properties.character_id + " to instance " + self.zone_id + ". Total " + self.charactersInInstance );
			}
			
			var character = self.characters[ characterObject.properties.character_id ];
			if( character )
			{
				// character already exists in this instance
				
				// disconnect it. force the closure of its socket
				character.command_disconnect_forced( _addNewCharacter );
				
				return;
			}
			
			_addNewCharacter();
			
			return true;
		}
		
		//
		// Special actions
		//
		
		// points
		this.sendFactionPointsUpdateToAllPlayers = function()
		{
			for(var i in self.characters)
			{
				var _c = self.characters[ i ];
				
				if( _c.properties.character_type != 3 )
				{
					// character is not a player
					
					continue;
				}
				
				self.sendFactionPointsUpdateToPlayer( _c );
			}
		}
		
		this.sendFactionPointsUpdateToPlayer = function( characterObject )
		{
			characterObject.sendToClient( JSON.stringify({
																	c: "updateFactionPoints",
																	f: factionPoints,
																	r: 200
																}) );
		}
		
		this.resetFactionsPoints = function( factionsArray )
		{
			for(var i=0;i<factionsArray;i++)
			{
				factionPoints[ factionsArray[ i ] ] = 0;
			}
			
			self.sendFactionPointsUpdateToAllPlayers();
		}
		
		this.addPointsToFaction = function( factionName, pointsAmount )
		{
			factionPoints[ factionName ] += pointsAmount;
			
			self.sendFactionPointsUpdateToAllPlayers();
			
			if( factionPoints[ factionName ] < maxFactionPoints )
			{
				return;
			}
			
			// run attached scripts
			self.events._run( "maxPointsReached", { byFactionName: factionName } );
		}
		
		this.setMaxFactionPoints = function( maxPoints )
		{
			maxFactionPoints = maxPoints;
		}
		
		// instance player stats
		this.sendBattlegroundStatisticsToAllPlayers = function()
		{
			self.redisClient.HGETALL(
										"stats.instance." + self.zone_id,
										function(err, res)
										{
											if( err )
											{
												log.addError( "Stats get for instance " + self.zone_id + ": " + err );
												
												return;
											}
											
											// create stats structure
											var _stats = JSON.parse( JSON.stringify( charactersEverJoinedMinimalData ) ); // clone the history
											for(var i in res)
											{
												var _split = i.split( "." );
												
												if( !_stats[ _split[ 1 ] ] )
												{
													log.addWarning( "stats for CID " + _split[ 1 ] + " not found " );
													
													// probably an NPC
													
													continue;
												}
												
												_stats[ _split[ 1 ] ][ i.replace( _split[ 0 ] + "." + _split[ 1 ] + ".", "" ) ] = res[ i ];
											}
											
											// send updates to all players in instance
											for(var i in self.characters)
											{
												var _c = self.characters[ i ];
												
												if( _c.properties.character_type != 3 )
												{
													// character is not a player
													
													continue;
												}
												
												_c.sendToClient( JSON.stringify({
																							c: "battlegroundStatistics",
																							s: _stats,
																							d: Math.round( ( ( new Date() ).getTime() - self.startDate.getTime() ) / 1000 ),
																							r: 200
																						}) );
											}
										}
									);
		}
		
		//
		// Objects pool manipulation
		//
		
		this.getObjectsByZonePoolID = function( objectPoolID )
		{
			return self.objects[ objectPoolID ];
		}
		
		this.getFirstObjectByZonePoolID = function( args )
		{
			var _object = self.getObjectsByZonePoolID( args.objectPoolID );
			
			if( _object )
			{
				args.onSuccess({ characterObject: _object[ 0 ] });
				
				return _object[ 0 ];
			}
			
			args.onFailure();
			
			return false;
		}
		
		// this is used mainly for corpses
		this.addSpecificObject = function( args, after )
		{
			syncSQL.q(
					"call npc_mark_active( " + args.character_id + ")",
					function( npcProfile )
					{
						self.sql.query(
								"select * from `character_spellbook_full` where `cs_id_character` = " + args.character_id,
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
										
										npc.createNPC(
														{
															properties: npcProfile,
															activeBuffs: [],
															spellBookBuffs: spellBookRows,
															createdByInstanceObject: self
														},
														function( npcObject )
														{
															var _ciop = npcProfile[0].character_id_object_pool;
															
															if( !self.objects[ _ciop ] )
															{
																self.objects[ _ciop ] = [];
															}
															
															// add this object to the list
															self.objects[ _ciop ].push( npcObject );
															
															npcObject.script.postInit();
															
															log.add( "Initialized object id " + args.character_id );
															
															// the NPC has been initialized
															after( npcObject );
														});
									});
								}
							);
					}
				);
		}
		
		// initialize one object
		this.addObject = function( args, after )
		{
			var _initCharacter = function( npc_id )
			{
				syncSQL.q(
						"call npc_mark_active( " + npc_id + ")",
						function( npcProfile )
						{
							self.sql.query(
									"select * from `character_spellbook_full` where `cs_id_character` = " + npc_id,
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
											
											npc.createNPC(
															{
																properties: npcProfile,
																activeBuffs: [],
																spellBookBuffs: spellBookRows,
																createdByInstanceObject: self
															},
															function( npcObject )
															{
																var _ciop = npcProfile[0].character_id_object_pool;
																
																if( !self.objects[ _ciop ] )
																{
																	self.objects[ _ciop ] = [];
																}
																
																// add this object to the list
																self.objects[ _ciop ].push( npcObject );
																
																npcObject.script.postInit();
																
																log.add( "Initialized object with id pool " + args.object_pool_id );
																
																// the NPC has been initialized
																
																after( npcObject );
															});
										});
									}
								);
						}
					);
			}
			
			syncSQL.q(
					"call zone_object_add( " + self.zone_id + ", " + args.object_pool_id + " )",
					function( result )
					{
						if( result.length == 0 )
						{
							log.add( "No object " + args.object_pool_id + " found for instance ID " + self.zone_id );
							
							after();
							
							return;
						}
						
						_initCharacter( result[ 0 ].character_id );
					}
				);
		}
		
		// initialize all objects assigned to instance
		this.addObjects = function( after )
		{
			var initializedCharacters = 0, maxInitializedCharacters = 0;
			
			var _initCharacter = function( npc_id )
			{
				syncSQL.q(
						"call npc_mark_active( " + npc_id + ")",
						function( npcProfile )
						{
							self.sql.query(
									"select * from `character_spellbook_full` where `cs_id_character` = " + npc_id,
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
											
											npc.createNPC(
															{
																properties: npcProfile,
																activeBuffs: [],
																spellBookBuffs: spellBookRows,
																createdByInstanceObject: self
															},
															function( npcObject )
															{
																var _ciop = npcProfile[0].character_id_object_pool;
																
																if( !self.objects[ _ciop ] )
																{
																	self.objects[ _ciop ] = [];
																}
																
																// add this object to the list
																self.objects[ _ciop ].push( npcObject );
																
																initializedCharacters++;
																
																if( initializedCharacters < maxInitializedCharacters )
																{
																	return;
																}
																
																// perform post init procedure
																for(var j in self.objects)
																{
																	var _objects = self.objects[ j ];
																	
																	// got all objects having this pool ID. enumerate them
																	for(var i=0;i<_objects.length;i++)
																	{
																		_objects[ i ].script.postInit();
																	}
																}
																
																// run attached scripts
																self.events._run( "addObjects", {} );
																
																log.add( "All objects initialized for instance ID " + args.zone_id );
																
																// all NPCs have been initialized
																after();
															});
										});
									}
								);
						}
					);
			}
			
			syncSQL.q(
					"call zone_objects_add( " + args.zone_id + " )",
					function( result )
					{
						maxInitializedCharacters = result.length;
						
						if( result.length == 0 )
						{
							log.add( "No objects found for instance ID " + args.zone_id );
							
							// run attached scripts
							self.events._run( "addObjects", {} );
							
							after();
							
							return;
						}
						
						for(var i=0;i<result.length;i++)
						{
							_initCharacter( result[ i ].character_id );
						}
					}
				);
		}
		
		this.deleteObjects = function( after )
		{
			syncSQL.q(
					"call zone_objects_delete( " + args.zone_id + " )",
					function( result )
					{
						after();
					}
				);
		}
		
		this.getCastSchemes = function()
		{
			return args.castSchemes;
		}
		
		//
		// Timers management
		//
		
		this.timersStopAll = function()
		{
			for(var i in self.timers)
			{
				self.timers[ i ].stop();
			}
		}
		
		//
		// Auto shutdown
		//
		
		var autoCloseTimeout = null;
		this.startAutoShutdown = function( msDelay )
		{
			msDelay = msDelay ? msDelay : realmConfig.instanceQueueAutoCloseTimeout;
			
			// prevent double shutdowns
			self.stopAutoShutdown();
			self.timersStopAll();
			
			// start the automatic close timeout
			autoCloseTimeout = setTimeout( function()
			{
				// automatically close an existing instance due to too few players
				
				log.addWarning( "Automatically shutdown instance ID " + args.zone_id + " ( " + args.zone_id_zone_pool + " )");
				
				syncSQL.q(
							"call zone_delete( " + args.zone_id + " )",
							function( res )
							{
								var remainingCharacters = 0;
								
								// send the message to all characters
								for(var i in self.characters )
								{
									var _c = self.characters[ i ];
									
									if( _c.properties.character_type != 3 )
									{
										// npc or item
										
										continue;
									}
									
									remainingCharacters++;
									
									_c.command_disconnect_for_hearthstone( function()
									{
										remainingCharacters--;
										
										if( remainingCharacters > 0 )
										{
											return;
										}
										
										// all characters have disconnected
										
										// stop this process
										process.exit( 0 );
									});
								}
								
								if( remainingCharacters == 0 )
								{
									// no characters in this instance
									
									process.exit( 0 );
								}
							}
						);
				
			}, msDelay );
		}
		
		this.stopAutoShutdown = function()
		{
			if( autoCloseTimeout == null )
			{
				// there is no auto shutdown in progress
				
				return false;
			}
			
			clearTimeout( autoCloseTimeout );
			
			autoCloseTimeout = null;
			
			return true;
		}
		
		//
		// Initialization cleanup
		//
		
		this.clearPreviousData = function( after )
		{
			stats.deleteInstanceData( self, after );
		}
		
		//
		// Scripted instance load
		//
		
		this.loadScript = function( after )
		{
			var _scriptPath = realmConfig.realmInstallPath + "/includes/classes/class.instance.js_files/instanceScript." + args.zone_id_zone_pool;
			
			fs.stat(
					 _scriptPath + ".js",
					function( err, stats )
					{
						if( err )
						{
							if( err.code == "ENOENT" )
							{
								// file not found. Create default structure
								
								self.script = new function()
								{
									log.addNotice( "Default script loaded for instance ID " + args.zone_id_zone_pool );
								};
								
								after();
								
								return;
							}
							
							log.addError( "Error loading Instance script: " + err );
							
							return;
						}
						
						// include the Instance script
						
						var _r = require( _scriptPath ).script;
						
						self.script = new _r( self );
						
						after();
					}
				);
		}
		
		//
		// Initialize
		//
		
		// Define the instance rules
		switch( self.zoneData.zp_type )
		{
			case "arena":
				
				this.charactersCompareRelationship = function( source, targetCharacterObject )
				{
					if( source.properties.character_id == targetCharacterObject.properties.character_id )
					{
						return 'self';
					}
					
					return 'foe';
				}
				
				// evaluate if the target may be targeted
				this.characterMayTargetCharacter = function( source, targetCharacterObject )
				{
					if(
						source.properties.character_is_alive != targetCharacterObject.properties.character_is_alive	// target is in a different state than i am
						|| !self.characters[ source.properties.character_id ]
						|| !self.characters[ targetCharacterObject.properties.character_id ]
						//|| targetCharacterObject.properties.character_hp_max == 0							// invulnerable
						||
						(
							targetCharacterObject.properties.character_is_stealth != null											// target is stealth
							&& self.charactersCompareFriendRelationship( source, targetCharacterObject ) == false			// target is an enemy
						)
					)
					{
						return false;
					}
					
					return true;
				}
				
				// evaluate relationship towards target (friend - true or foe - false)
				this.charactersCompareFriendRelationship = function( source, targetCharacterObject )
				{
					if( source.properties.character_id == targetCharacterObject.properties.character_id )
					{
						return true;
					}
					
					return false;
				}
				
				// evaluate relationship towards target (friend - true or foe - false)
				this.castCompareRelationshipToTarget = function( source, buffFull, targetCharacterObject, relationship )
				{
					// will not compare to self
					
					if( buffFull.buff_allow_target & 8 && targetCharacterObject.properties.character_id != source.properties.character_id && relationship == false )
					{
						return true;
					}
					
					return false;
				}
				
				this.castTreatment = function( source, buffFull, targetCharacterObject )
				{
					if( buffFull.buff_allow_target & 1 && targetCharacterObject.properties.character_id == source.properties.character_id )
					{
						// buff casted on self (source)
						
						return true;
						
						/*
						return new buffEffect.activeBuff({
														source: source,
														character: targetCharacterObject,
														buff: buffFull,
														sourceIsFriendly: true,
														buffsStructure: args.buffsStructure,
														buffsScripts: args.buffsScripts,
														schemes: args.castSchemes
													});
						*/
					}
					else if( buffFull.buff_allow_target & 8 && targetCharacterObject.properties.character_id != source.properties.character_id )
					{
						// buff casted on foe
						
						return false;
						
						/*
						return new buffEffect.activeBuff({
														source: source,
														character: targetCharacterObject,
														buff: buffFull,
														sourceIsFriendly: false,
														buffsStructure: args.buffsStructure,
														buffsScripts: args.buffsScripts,
														schemes: args.castSchemes
													});
						*/
					}
					
					log.addError( "Buff casting not treated. BuffFull: " + JSON.stringify( buffFull ) + ". Target: " + JSON.stringify( targetCharacterObject.properties ) + ". Source: " + JSON.stringify( source.properties ) );
				}
				
			break;
			case "afriendly":
			case "hfriendly":
			case "battleground":
				
				this.charactersCompareRelationship = function( source, targetCharacterObject )
				{
					if( source.properties.character_id == targetCharacterObject.properties.character_id )
					{
						return 'self';
					}
					else if( targetCharacterObject.properties.character_faction == source.properties.character_faction )
					{
						return 'friend';
					}
					
					return 'foe';
				}
				
				// evaluate if the target may be targeted
				this.characterMayTargetCharacter = function( source, targetCharacterObject )
				{
					if(
						source.properties.character_is_alive != targetCharacterObject.properties.character_is_alive	// target is in a different state than i am
						|| !self.characters[ source.properties.character_id ]										// source is no longer in this instance. must be disconnected
						|| !self.characters[ targetCharacterObject.properties.character_id ]					// target is no longer in this instance. must be disconnected
						//|| targetCharacterObject.properties.character_hp_max == 0							// invulnerable
						||
						(
							targetCharacterObject.properties.character_is_stealth != null										// target is stealth
							&& self.charactersCompareFriendRelationship( source, targetCharacterObject ) == false	// target is an enemy
						)
					)
					{
						return false;
					}
					
					return true;
				}
				
				// evaluate relationship towards target (friend - true or foe - false)
				this.charactersCompareFriendRelationship = function( source, targetCharacterObject )
				{
					if(
						source.properties.character_id == targetCharacterObject.properties.character_id
						|| targetCharacterObject.properties.character_faction == source.properties.character_faction
						|| targetCharacterObject.properties.character_faction == null
					)
					{
						return true;
					}
					
					return false;
				}
				
				this.castCompareRelationshipToTarget = function( source, buffFull, targetCharacterObject, relationship )
				{
					// will not compair to self
					
					if( buffFull.buff_allow_target & 2 && targetCharacterObject.properties.character_id != source.properties.character_id && targetCharacterObject.properties.character_faction == source.properties.character_faction && relationship == true )
					{
						return true;
					}
					else if( buffFull.buff_allow_target & 8 && targetCharacterObject.properties.character_faction != source.properties.character_faction && relationship == false )
					{
						return true;
					}
					
					return false;
				}
				
				this.castTreatment = function( source, buffFull, targetCharacterObject )
				{
					if( buffFull.buff_allow_target & 1 && targetCharacterObject.properties.character_id == source.properties.character_id )
					{
						// buff casted on self
						
						return true;
						/*
						return new buffEffect.activeBuff({
														source: source,
														character: targetCharacterObject,
														buff: buffFull,
														sourceIsFriendly: true,
														schemes: args.castSchemes,
														buffsStructure: args.buffsStructure,
														buffsScripts: args.buffsScripts
													});
						*/
					}
					else if( buffFull.buff_allow_target & 2 && targetCharacterObject.properties.character_id != source.properties.character_id  && targetCharacterObject.properties.character_faction == source.properties.character_faction )
					{
						// buff casted on friend
						
						return true;
						
						/*
						return new buffEffect.activeBuff({
														source: source,
														character: targetCharacterObject,
														buff: buffFull,
														sourceIsFriendly: true,
														schemes: args.castSchemes,
														buffsStructure: args.buffsStructure,
														buffsScripts: args.buffsScripts
													});
						*/
					}
					else if( buffFull.buff_allow_target & 4 )
					{
						// buff casted on party. for the moment party = faction. this has to change at some point
						
						/*
						for(var i in self.characters)
						{
							var _c = _i.characters[ i ];
							
							if( _c.properties.character_type != 3 || _c.properties.character_faction != source.properties.character_faction )
							{
								// character is not a player or is on another faction
								
								continue;
							}
							
							new buffEffect.activeBuff({
														source: source,
														character: _c,
														buff: buffFull,
														sourceIsFriendly: true,
														schemes: args.castSchemes,
														buffsStructure: args.buffsStructure,
														buffsScripts: args.buffsScripts
													});
						}
						*/
						
						return true;
					}
					else if( buffFull.buff_allow_target & 8 && targetCharacterObject.properties.character_faction != source.properties.character_faction )
					{
						// buff casted on foe
						
						return false;
						
						/*
						return new buffEffect.activeBuff({
														source: source,
														character: targetCharacterObject,
														buff: buffFull,
														sourceIsFriendly: false,
														schemes: args.castSchemes,
														buffsStructure: args.buffsStructure,
														buffsScripts: args.buffsScripts
													});
						*/
					}
					else if( buffFull.buff_allow_target & 16 )
					{
						// buff casted on foes
						
						return false;
					}
					
					log.addError( "Buff casting not treated. BuffFull: " + JSON.stringify( buffFull ) + ". Target: " + JSON.stringify( targetCharacterObject.properties ) + ". Source: " + JSON.stringify( source.properties ) );
				}
				
			break;
			default:
				
				log.add( "Instance type " + self.zoneData.zp_type + " not treated for buff casting" );
		}
		
		// initialize the grid
		
		var aStarObject = new aStarLibrary.aStar;
		_initializeGrid();
		
		self.clearPreviousData( function()
		{
			self.loadScript( function()
			{
				self.addObjects(function()
				{
					log.add( "Instance " + args.zone_id + " ( " + args.zone_id_zone_pool + " ) initialized with rules " + self.zoneData.zp_type );
					
					self.characterCollisionsCheck();
					
					//self.startAutoShutdown();
					
					// run attached scripts
					self.events._run( "afterInit", { instanceObject: self } );
					
					args.afterFunction( self );
				});
			});
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	