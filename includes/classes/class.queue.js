
    "use strict"; // enable strict mode within this file
	
	var realmConfig = require('../config.realm').config,
				syncSQL = new (require('./class.syncSQL')).p,
				log = require("./class.log");
	
	var queue = function( args )
	{
		var self = this, autoInstanceStartTimeout = null;
		
		this.id = args.realm._queues.push( this ) - 1;
		this.zone_id = null;
		this.zp_id = args.surface.zp_id;
		this.teams = {};
		this.characters = {};
		this.teamMembersAmount = {};
		this.membersAmount = 0;
		this.instanceStartedState = 0;
		this.minimumIntervalPassed = false;
		
		var instanceProcessObject = null, readyCharacters = 0, totalCharacters = 0, autoCloseTimeout = null, _startInstanceFunction = function() { return false; };
		var afterFunctions = {};			// post instance start functions, per character
		
		//
		// instance manipulation
		//
		
		this.getInstanceProcessID = function()
		{
			return ( self.instanceStartedState == 2 ) ? instanceProcessObject.pid : null;
		}
		
		this.startInstance = function( afterStartInstanceFunction )
		{
			// entered the async phase of the queue
			self.instanceStartedState = 1;
			
			// _startInstanceFunction may be defined only when the instance has been called to be started
			_startInstanceFunction = function()
			{
				if( readyCharacters < totalCharacters )
				{
					return false;
				}
				
				// instance is ready to start
				afterStartInstanceFunction( instanceProcessObject );
			}
			
			// make sure we don't auto initialize later
			clearTimeout( autoInstanceStartTimeout );
			
			// the instance must be created here
			args.realm.addInstance({
							zonePoolID: args.surface.zp_id,
							onProcessStarted: function( iPO )
							{
								// set the global variable
								
								instanceProcessObject = iPO;
							},
							onSuccess: function( zoneID )
							{
								// attach this queue object to the instance
								instanceProcessObject.queueObject = self;
								
								self.zone_id = zoneID;
								
								// add each character in the teams to this zone
								for(var i in self.teams)
								{
									var _team = self.teams[ i ];
									
									for(var j in _team)
									{
										var _characterData = _team[ j ];
										
										totalCharacters++;
										
										if( args.surface.zp_faction_allowed_binary >= 3 )
										{
											// invite the characters to join if the number of factions allowed in this instance is bigger than 1
											
											readyCharacters++;
											
											self.inviteCharacterToJoin( _characterData );
										}
										else
										{
											// there is no need to invite them. just add automatically
											
											// run the custom functions per character
											afterFunctions[ _characterData.character_id ]({
																									instanceProcessObject: instanceProcessObject,
																									instanceObjectZoneID: self.zone_id
																								});
											
											readyCharacters++;
											
											//_startInstanceFunction();
										}
										
									}
								}
								
								// mark the associated instance as started. marking it before would lead to unpredictable initializations of dependent processes / functions
								self.instanceStartedState = 2;
								
								// will not start if the readyCharacters number is smaller than the total number. it will always be smaller for the number of allowed factions = 1
								_startInstanceFunction();
							}
						});
		}
		
		var _checkForStart = function()
		{
			this.minimumIntervalPassed = true;
			
			if( !self.reachedMinimumCharacters() )
			{
				return false;
			}
			
			self.startInstance( function() { } );
			
			return true;
		}
		
		//
		// queue manipulation
		//
		
		this.sendQueueUpdates = function( readyToStart )
		{
			// send updates to all players about the queue progress
			var _u = args.realm._users;
			
			for(var j in self.teams)
			{
				var _factionTeam = self.teams[ j ];
				
				for(var i in _factionTeam)
				{
					_u[ _factionTeam[ i ].character_id_user ].sendUTF( JSON.stringify({
																										c: "updateQueueMembers",
																										r: 200,
																										st: readyToStart,
																										zp: args.surface.zp_id,
																										ma: self.membersAmount,
																										mm: args.surface.zp_faction_max_players
																									 }) );
				}
			}
		}
		
		this.addCharacter = function( characterData, afterJoin, afterStart )
		{
			// add this character to the faction queue
			self.characters[ characterData.character_id ] = characterData;
			self.teams[ characterData.character_faction ][ characterData.character_id ] = characterData;
			
			// increase the overall members number
			self.teamMembersAmount[ characterData.character_faction ]++;
			self.membersAmount++;
			
			// make sure this character's new queue is noted
			args.realm._characterQueues[ characterData.character_id ][ args.surface.zp_id ] = self;
			
			// this character has joined the queue
			afterJoin();
			
			// check if the character maye be allocated right away
			
			if( self.instanceStartedState == 2 )
			{
				// the instance has already started. invite only this new character
				
				if( args.surface.zp_faction_allowed_binary >= 3 )
				{
					// this is an instance that requires more than one faction to join. no autojoin
					
					self.inviteCharacterToJoin( characterData );
				}
				
				// send update to this player
				args.realm._users[ characterData.character_id_user ].sendUTF( JSON.stringify({
																											c: "updateQueueMembers",
																											r: 200,
																											st: true,
																											zp: args.surface.zp_id,
																											ma: self.membersAmount,
																											mm: args.surface.zp_faction_max_players
																										 }) );
				
				// no need to store this function. just run it right away
				afterStart({
							instanceProcessObject: instanceProcessObject,
							instanceObjectZoneID: self.zone_id
						});
				
				return;
			}
			
			// this character is to be added to the long term queue
			
			// add the after function to the queue
			afterFunctions[ characterData.character_id ] = afterStart;
			
			if( self.instanceStartedState == 1 )
			{
				// instance process is starting
				
				log.addNotice( "Queue " + self.id + " faction " + i + " member " + characterData.character_id + " queued for immediate start" );
				
				return;
			}
			
			if( self.minimumIntervalPassed )
			{
				// the minimum interval has passed and the instance hasn't stated yet
				
				if( _checkForStart() )
				{
					// the instance is ready to start
					
					return;
				}
				
				// the instance is not ready to start
				
				self.sendQueueUpdates( false );
				
				return;
			}
			
			// the minimum interval hasn't passed yet
			
			if(
				(
					args.surface.zp_start_when_min_players_reached == null
					&& !self.reachedMaximumCharacters()
				)
				||
				(
					args.surface.zp_start_when_min_players_reached != null
					&& !self.reachedMinimumCharacters()
				)
			)
			{
				// the max number of characters hasn't been reached
				
				for(var i in self.teamMembersAmount)
				{
					// display per-faction updates
					
					log.addNotice( "Queue " + self.id + " faction " + i + " members " + self.teamMembersAmount[ i ] + " / " + args.surface.zp_faction_max_players );
				}
				
				self.sendQueueUpdates( false );
				
				return;
			}
			
			// we are ready to start. notify everybody
			self.sendQueueUpdates( true );
			
			// reached the max amount of characters and the instance hasn't started yet
			self.startInstance( function() { } );
		}
		
		this.removeFromQueueNoNotice = function( characterID )
		{
			var _cd = self.characters[ characterID ];
			
			// prevent any other auto action
			clearTimeout( inviteTimeout[ _cd.character_id ] );
			
			// remove this queue from the global list
			delete args.realm._characterQueues[ _cd.character_id ][ args.surface.zp_id ];
			
			// add this character to the faction queue
			delete self.characters[ _cd.character_id ];
			delete self.teams[ _cd.character_faction ][ _cd.character_id ];
			
			// remove the after function for the character
			delete afterFunctions[ _cd.character_id ];
			
			// decrease the overall members number
			self.teamMembersAmount[ _cd.character_faction ]--;
			self.membersAmount--;
		}
		
		this.removeFromQueue = function( characterID )
		{
			var _cd = self.characters[ characterID ];
			
			self.removeFromQueueNoNotice( characterID );
			
			// send the message to the user
			args.realm._users[ _cd.character_id_user ].sendUTF( JSON.stringify({
																												c: "queueInvitationDeny",
																												r: 200,
																												zp_id: args.surface.zp_id
																											 }) );
		}
		
		var inviteTimeout = {};
		this.inviteCharacterToJoin = function( characterData )
		{
			args.realm._users[ characterData.character_id_user ].sendUTF( JSON.stringify({
																											c: "inviteToInstance",
																											r: 200,
																											zp_id: args.surface.zp_id,
																											t: ( realmConfig.instanceQueueAutoRemoveCharacterTimeout / 1000 )
																										 }) );
			
			
			inviteTimeout[ characterData.character_id ] = setTimeout( function()
			{
				self.removeFromQueue( characterData.character_id );
			}, realmConfig.instanceQueueAutoRemoveCharacterTimeout );
		}
		
		this.invitationAcceptedByCharacter = function( characterID )
		{
			var _cd = self.characters[ characterID ], _ws = args.realm._users[ _cd.character_id_user ];
			
			// clear the timeout
			clearTimeout( inviteTimeout[ _cd.character_id ] );
			
			// send the instance parameters
			_ws.instanceObject.runCommand(
													{
														c: "characterLeaveInstance",
														cid: _cd.character_id,
														uid: _cd.character_id_user
													},
													function( response )
													{
														if( response.r != 200 )
														{
															log.addError( "Error leaving instance: " + response.m );
															
															return;
														}
														
														_ws.sessionData.characterID = characterID;				// this is a compensation for leaving the last instance. this will ensure the connection still knows which instance to join
														_ws.nextInstanceObject = instanceProcessObject;	// remember the next instance to be joined
														
														// send the message to the user
														_ws.sendUTF( JSON.stringify({
																							c: "queueInvitationAccept",
																							r: 200,
																							zp_id: args.surface.zp_id
																						 }) );
													}
												);
		}
		
		//
		// Queue checkers
		//
		
		// check if all the factions have reached the minimum required number of players
		this.reachedMaximumCharacters = function()
		{
			for(var i in self.teamMembersAmount)
			{
				if( self.teamMembersAmount[ i ] >= args.surface.zp_faction_max_players )
				{
					continue;
				}
				
				return false;
			}
			
			return true;
		}
		
		// check if all the factions have reached the maximum required number of players
		this.reachedMinimumCharacters = function()
		{
			for(var i in self.teamMembersAmount)
			{
				if( self.teamMembersAmount[ i ] >= args.surface.zp_faction_min_players )
				{
					continue;
				}
				
				return false;
			}
			
			return true;
		}
		
		// will check if a character object is compatible with this queue ( space in queue, faction accepted, zone pool ID is the same )
		this.isCompatibleWithZonePoolID = function( characterData, zone_pool_id )
		{
			return	args.surface.zp_id == zone_pool_id
						&& self.teamMembersAmount[ characterData.character_faction ] < args.surface.zp_faction_max_players
						&& characterData.character_faction_binary & args.surface.zp_faction_allowed_binary;
		}
		
		// will check if a character object is compatible with this queue ( space in queue, faction accepted ). this is for random queues
		this.isCompatible = function( characterData )
		{
			return	args.surface.zp_faction_allowed_binary >= 3	// at least 2 factions must be welcome
						&& self.teamMembersAmount[ characterData.character_faction ] < args.surface.zp_faction_max_players
						&& characterData.character_faction_binary & args.surface.zp_faction_allowed_binary;
		}
		
		this.isInQueue = function( characterID )
		{
			return self.characters[ characterID ];
		}
		
		//
		// Initialize queue
		//
		
		var queueFactions = args.surface.zp_faction_allowed.toString().split( "," );
		for(var i=0;i<queueFactions.length;i++)
		{
			var _factionName = queueFactions[ i ];
			
			this.teamMembersAmount[ _factionName ] = 0;
			this.teams[ _factionName ] = {};
		}
		
		// automatically start the instance after a certain interval if the minimum number of players has been achieved
		autoInstanceStartTimeout = setTimeout( _checkForStart, realmConfig.instanceQueueAutoStartTimeout );
		
		// notice the start of this queue
		log.add( "Queue " + this.id + " started for instance " + args.surface.zp_name + " ( " + args.surface.zp_id + " )" );
	}
	
	var _addToQueueWithoutCompatibilityCheck = function( args )
	{
		return false;
	}
	
	var _addToQueueWithCompatibilityCheck = function( args )
	{
		// check if there is a queue having the requested zone pool id
		for(var i in args.queues)
		{
			var queue = args.queues[ i ];
			
			if(
				args.zone_pool_id != null && !queue.isCompatibleWithZonePoolID( args.characterData, args.zone_pool_id )
			)
			{
				// specific instance requested
				
				//log.addWarning( JSON.stringify( args.characterData ) + " is not compatible with " + args.zone_pool_id );
				
				continue;
			}
			else if( args.zone_pool_id == null && !queue.isCompatible( args.characterData ) )
			{
				// random instance requested
				
				//log.addError( ( typeof args.zone_pool_id ) + " - " + JSON.stringify( args ) + " is not compatible with queue " + queue.id);
				
				continue;
			}
			
			if( args.queueCheckFunction( queue.zp_id ) )
			{
				//log.addWarning( JSON.stringify( args.characterData ) + " is already in a queue for this instance " + queue.id );
				
				continue;
			}
			
			//
			// this character is compatible with this queue
			//
			
			queue.addCharacter( args.characterData, args.afterJoin, args.afterStart );
			
			return true;
		}
		
		return false;
	}
	
	//
	// Queue join wrappers
	//
	
	var joinRandomQueue = function( args )
	{
		var _cq = args.realm._characterQueues[ args.characterData.character_id ];
		
		var _characterInQueueForInstance = function( iID )
		{
			return ( typeof _cq[ iID ] != "undefined" );
		}
		
		//
		// Attempt to fill an existing queue
		//
		
		if( args.queueCheckFunction({
									queues: args.realm._queues,
									characterData: args.characterData,
									queueCheckFunction: _characterInQueueForInstance,
									afterJoin: args.afterJoin,
									afterStart: args.afterStart
								}) == true )
		{
			// existing queue found. adding this character to it
			
			return false;
		}
		
		// random instance
		
		var _instances = [], _zd = args.realm._zoneData;
		
		for(var i in _zd)
		{
			if( _zd[ i ].zp_faction_allowed_binary < 3 )
			{
				// instance allows only one faction
				
				continue;
			}
			
			if( args.queueCheckFunction( _zd[ i ].zp_id ) )
			{
				continue;
			}
			
			_instances.push( i );
		}
		
		if( _instances.length == 0 )
		{
			// character has enrolled in all valid instances already
			
			return;
		}
		
		( new queue({
						surface: _zd[ _instances[ Math.floor( Math.random() * _instances.length ) ] ],
						realm: args.realm
					}) ).addCharacter( args.characterData, args.afterJoin, args.afterStart );
	}
	
	// character queue joiner / creator
	var joinSpecificQueue = function( args )
	{
		var _cq = args.realm._characterQueues[ args.characterData.character_id ];
		
		var _characterInQueueForInstance = function( iID )
		{
			//log.addNotice( "Character is already in a queue for instance ID " + iID );
			
			return ( typeof _cq[ iID ] != "undefined" );
		}
		
		if( _characterInQueueForInstance( args.zone_pool_id ) )
		{
			// specific instance requested, but the character is already in a queue for it
			
			return false;
		}
		
		//
		// Attempt to fill an existing queue
		//
		
		if( args.queueCheckFunction({
									queues: args.realm._queues,
									characterData: args.characterData,
									queueCheckFunction: _characterInQueueForInstance,
									zone_pool_id: args.zone_pool_id,
									afterJoin: args.afterJoin,
									afterStart: args.afterStart
								}) == true )
		{
			return false;
		}
		
		// create 
		
		( new queue({
						surface: args.realm._zoneData[ args.zone_pool_id ],
						realm: args.realm
					}) ).addCharacter( args.characterData, args.afterJoin, args.afterStart );
	}
	
	var _getCharacterDataForInstanceJoin = function( args, after )
	{
		// fetch the user's minimal profile required to join the queue
		args.realm.sql.query(
							"select `character_id`, `character_id_user`, `character_id_zone`, `character_id_hearthstone_zone`, `character_id_zone_pool`, `character_faction`, `character_faction` + 0 as character_faction_binary from `character_profile_full` where `character_id` = " + args.character_id + " limit 0,1",
							function( err, queryResult )
							{
								if( err )
								{
									log.addError( "queue character profile fetch error: " + err );
									
									return;
								}
								
								queryResult.fetchAll( function( err, rows )
								{
									if( err )
									{
										log.addError( "queue character result fetch error: " + err );
										
										return;
									}
									
									after( rows[ 0 ] );
								});
							}
						);
	}
	
	//
	// Exported functions
	//
	
	// function used to join the last instance the character was in
	exports.joinPreviousInstance = function( args )
	{
		_getCharacterDataForInstanceJoin( args, function( _cd )
		{
			joinSpecificQueue({
						queueCheckFunction: _addToQueueWithCompatibilityCheck,
						characterData: _cd,
						zone_pool_id: ( _cd.character_id_zone == null ) ? _cd.character_id_hearthstone_zone : _cd.character_id_zone_pool,
						realm: args.realm,
						afterJoin: function() {},
						afterStart: args.afterStart
					});
		});
	}
	
	// function used to join the last instance the character was in
	exports.joinHearthstoneInstance = function( args )
	{
		_getCharacterDataForInstanceJoin( args, function( _cd )
		{
			joinSpecificQueue({
						queueCheckFunction: _addToQueueWithCompatibilityCheck,
						characterData: _cd,
						zone_pool_id: _cd.character_id_hearthstone_zone,
						realm: args.realm,
						afterJoin: function() {},
						afterStart: args.afterStart
					});
		});
	}
	
	// function used to join a random instance
	exports.joinRandomInstance = function( args )
	{
		_getCharacterDataForInstanceJoin( args, function( _cd )
		{
			joinRandomQueue({
					queueCheckFunction: _addToQueueWithCompatibilityCheck,
					characterData: _cd,
					realm: args.realm,
					afterJoin: args.afterJoin,
					afterStart: args.afterStart
				});
		});
	}
	
	// function used to join a specific instance
	exports.joinSpecificInstance = function( args )
	{
		_getCharacterDataForInstanceJoin( args, function( _cd )
		{
			joinSpecificQueue({
					queueCheckFunction: _addToQueueWithCompatibilityCheck,
					characterData: _cd,
					zone_pool_id: args.zp_id,
					//zone_pool_id: 4,		// testing purposes only
					realm: args.realm,
					afterJoin: args.afterJoin,
					afterStart: args.afterStart
				});
		});
	}
	
	// function used to create an instance starting from an object pool id
	exports.createInstance = function( args )
	{
		_getCharacterDataForInstanceJoin( args, function( _cd )
		{
			joinSpecificQueue({
					queueCheckFunction: _addToQueueWithoutCompatibilityCheck,
					characterData: _cd,
					zone_pool_id: args.zp_id,
					realm: args.realm,
					afterJoin: args.afterJoin,
					afterStart: args.afterStart
				});
		});
	}
	
	// function used to create an instance starting from an object pool id
	exports.switchToSpecificInstance = function( args )
	{
		_getCharacterDataForInstanceJoin( args, function( _cd )
		{
			joinSpecificQueue({
					queueCheckFunction: _addToQueueWithoutCompatibilityCheck,
					characterData: _cd,
					zone_pool_id: args.zp_id,
					realm: args.realm,
					afterJoin: args.afterJoin,
					afterStart: args.afterStart
				});
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	