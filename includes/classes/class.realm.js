	
    "use strict"; // enable strict mode within this file
	
	var fs = require('fs'),
		cluster = require('cluster'),
		http = require('http'),
		net = require("net"),
		realmConfig = require('../config.realm').config,
		WebSocketServer = require( realmConfig.libraries.webSocketPath ).server,
		WebSocketRequest = require( realmConfig.libraries.webSocketPath ).request,
		WebSocketClient = require( realmConfig.libraries.webSocketPath ).client,
		miksagoConnection = require( realmConfig.libraries.miksagoHixieWebSocketPath ),
		miksagoWS = require( realmConfig.libraries.miksagoHixieConnectionPath ),
		log = require("./class.log"),
		syncSQL = new (require('./class.syncSQL')).p,
		chatChannel = require('./class.chatChannel').chatChannel,
		redis = require( realmConfig.libraries.redisPath ),
		quest = require( './class.quest' ),
		queue = require( './class.queue' );
	
	//
	//	Game Server Specific
	//
	
	exports.gameRealm = function()
	{
		var self = this;
		
		this.userCount = 0;
		
		this.commandsDir = realmConfig.realmInstallPath + "/includes/classes/class.realm.js_commands/";
		this.translationsDir = realmConfig.realmInstallPath + "/public_web/components/bugcraft/translations/";
		this.mapsMetaDir = realmConfig.realmInstallPath + "/public_web/components/bugcraft/resources/private/maps_meta/";
		this.sql = null;
		this.config = realmConfig;
		
		this._questsData = {};
		this._achievementsData = {};
		this._buffs = {};
		this._loot = {};
		this._progression = {};
		this._instances = {};
		this._commands = {};
		this._translations = {};
		this._users = {};
		this._queues = [];					// global queues list
		this._characterQueues = {};	// queues associated with each character
		
		this._zoneSurface = {};
		this._zoneData = {};
		
		this.redisClient = redis.createClient();
		
		this.loginServerSocket = null;
		
		//
		// internal diagnostics
		//
		
		var _lastBenchMarkDate = new Date();
		var _performanceBenchmark = function()
		{
			var _c = new Date ();
			var _t = _c - _lastBenchMarkDate;
			
			if( _t > realmConfig.instanceLagChecksMaxDifference )
			{
				log.addWarning( "Realm is lagging by " + ( _t - realmConfig.instanceLagChecksInterval ) + " ms" );
			}
			
			_lastBenchMarkDate = _c;
			
			setTimeout( _performanceBenchmark,  realmConfig.instanceLagChecksInterval );
		};
		
		_performanceBenchmark();
		
		//
		// initialize
		//
		this.init = function()
		{
			this.sql = require( realmConfig.libraries.mysqlPath ).createConnectionSync();
			this.sql.connectSync( this.config.realmDatabaseHost, this.config.realmDatabaseUser, this.config.realmDatabasePass, this.config.realmDatabaseDB );
			
			if( !this.sql.connectedSync() )
			{
				log.addError( "Realm unable to connect to DB using " + this.config.realmDatabaseUser + ":" + this.config.realmDatabasePass + "@" + this.config.realmDatabaseHost + "/" + this.config.realmDatabaseDB );
			}
			
			log.add( "Grid cells are " + this.config.realmInstanceGridCellWidth + "x" + this.config.realmInstanceGridCellHeight + " pixels");
			
			self.savePID( function()
			{
				self.loadBuffs( function()
				{
					self.loadLoot( function()
					{
						self.loadQuests( function()
						{
							self.loadAchievements( function()
							{
								self.loadProgression( function()
								{
									self.loadCommands( function()
									{
										self.loadTranslations( function()
										{
											self.loadInstanceSurfaces( function()
											{
												//castAreaSchemes.init();
											
												self.startLoop();
											});
										});
									});
								});
							});
						});
					});
				});
			});
		};
		
		this.savePID = function( after )
		{
			fs.writeFile(
					"daemon.realm.pid",
					process.pid,
					function(err)
					{
						if( err )
						{
							log.addError( "Error saving process ID " + err );
						}
						
						after();
					}
				); 
		}
		
		this.addInstance = function( args )
		{
			syncSQL.q(
						"call zone_add( " + args.zonePoolID + " )",
						function( res )
						{
							if( res[0].result != 200 )
							{
								log.addError( "Zone creation failed with code " + JSON.stringify( res[0] ) );
								
								return;
							}
							
							// zone created successfully in the DB
							
							// spawn another process
							var _zoneID = res[ 0 ].zone_id, _i = self._instances[ _zoneID ] = cluster.fork(), _lastRequestID = 0, _callBacks = {};
							
							// run the process started event
							args.onProcessStarted( _i );
							
							// set the general functions
							_i.runCommand = function( parametersArray, callBack )
							{
								_lastRequestID++;
								
								_callBacks[ _lastRequestID ] = callBack;
								
								_i.send({
											cmd: parametersArray.c,
											p: parametersArray,
											id: _lastRequestID
										});
							};
							
							_i.messageToCharacter = function( sessionData, parametersArray )
							{
								parametersArray.__characterID = sessionData.characterID;
								parametersArray.__userID = sessionData.userID;
								
								_i.send({
										cmd: parametersArray.c,
										p: parametersArray
									});
							};
							
							//
							// Handle commands from the instance
							//
							
							var _instanceCommands = {
								
								online: function( message )
								{
									// the new process has initialized
									
									
								},
								
								ready: function( message )
								{
									// send the instance parameters
									
									_i.runCommand(
													{
														c: "addInstance",
														//castSchemes: castAreaSchemes.schemes,
														zone_id: _zoneID,
														zone_id_zone_pool: args.zonePoolID,
														zoneSurface: self._zoneSurface[ args.zonePoolID ],
														zoneData: self._zoneData[ args.zonePoolID ],
														lootData: self._loot,
														questsData: self._questsData,
														achievementsData: self._achievementsData,
														buffsStructure: self._buffs,
														characterProgression: self._progression
													},
													function( response )
													{
														if( response.r != 200 )
														{
															log.addError( "Error creating instance: " + message.m );
															
															return;
														}
														
														// the instance has been successfully added
														args.onSuccess( response.zoneID );
													}
												);
								},
								
								queueJoinRandom: function( message )
								{
									var _ws = self._users[ message.uid ];
									
									queue.joinRandomInstance({
																	character_id: message.cid,
																	realm: self,
																	afterJoin: function()
																	{
																		// character has joined the queue
																		
																		_ws.sendUTF( JSON.stringify({
																							c: message.cmd,
																							r: 200
																						}) );
																	},
																	afterStart: function()
																	{
																		// the instance has started
																	}
																});
								},
								
								queueJoinSpecific: function( message )
								{
									var _ws = self._users[ message.p.uid ];
									
									queue.joinSpecificInstance({
																character_id: message.p.cid,
																zp_id: message.p.bid,
																realm: self,
																afterJoin: function()
																{
																	// character has joined the queue
																	
																	_ws.sendUTF( JSON.stringify({
																								c: message.cmd,
																								r: 200
																							}) );
																},
																afterStart: function( resultArray )
																{
																	// the instance has started
																	
																	_i.send({
																			cmd: "_processMessageFromRealm",
																			id: message.id,
																			p:
																			{
																				r: 200,
																				iID: resultArray.instanceObjectZoneID
																			}
																		});
																}
															});
								},
								
								queueCreateInstance: function( message )
								{
									var _ws = self._users[ message.p.uid ];
									
									queue.createInstance({
															character_id: message.p.cid,
															zp_id: message.p.bid,
															realm: self,
															afterJoin: function()
															{
																// character has joined the queue
																
															},
															afterStart: function( resultArray )
															{
																// the instance has started
																
																_i.send({
																		cmd: "_processMessageFromRealm",
																		id: message.id,
																		p:
																		{
																			r: 200,
																			iID: resultArray.instanceObjectZoneID
																		}
																	});
															}
														});
								},
								
								queueInvitationAccept: function( message )
								{
									var _c = null;
									
									if(
										!( _c = self._characterQueues[ message.cid ] )
										|| !_c[ message.zID ]
									)
									{
										return false;
									}
									
									_c[ message.zID ].invitationAcceptedByCharacter( message.cid );
								},
								
								queueLeaveAllButCurrentInstance: function( message )
								{
									var _q = self._characterQueues[ message.p.cid ], currentInstanceZonePoolID = self._users[ message.p.uid ].instanceObject.queueObject.zp_id;
									
									for(var i in _q)
									{
										if( i == currentInstanceZonePoolID )
										{
											// this queue is for the current attached instance
											
											continue;
										}
										
										// remove this queue from the associated list
										_q[ i ].removeFromQueue( message.p.cid );
									}
									
									_i.send({
											cmd: "_processMessageFromRealm",
											id: message.id,
											p:
											{
												r: 200
											}
										});
								},
								
								queueAddForced: function( message )
								{
									if( !self._instances[ message.p.zID ] )
									{
										// instance does not exist
										
										_i.send({
												cmd: "_processMessageFromRealm",
												id: message.id,
												p:
												{
													r: 300
												}
											});
										
										return;
									}
									
									var _q = self._instances[ message.p.zID ].queueObject;
									
									if( _q.isInQueue( message.p.cid ) )
									{
										// character already in the queue for this specific instance
										
										_q.invitationAcceptedByCharacter( message.p.cid );
									}
									else
									{
										// character is not in the queue for this instance
										
										log.addNotice( "not in queue" );
									}
									
									_i.send({
											cmd: "_processMessageFromRealm",
											id: message.id,
											p:
											{
												r: 200
											}
										});
								},
								
								sendSocketMessage: function( message )
								{
									// send this message from the child process to the client via its associated socket
									self._users[ message.uid ].sendUTF( message.data );
								},
								
								disconnectCharacter: function( message )
								{
									log.addWarning("character " + self._users[ message.p.uid ].sessionData.characterID + " disconnected");
								
									delete self._users[ message.p.uid ].instanceObject;
									delete self._users[ message.p.uid ].sessionData.characterID;
									
									// remove this user from the associated queue
									self._characterQueues[ message.p.cid ][ message.p.zpID ].removeFromQueueNoNotice( message.p.cid );
									
									_i.send({
											cmd: "_processMessageFromRealm",
											id: message.id,
											p:
											{
												r: 200
											}
										});
								},
								
								characterDisconnectForced: function( message )
								{
									log.addWarning("character " + self._users[ message.p.uid ].sessionData.characterID + " disconnected forced");
									
									var _u = self._users[ message.p.uid ];
									
									// mark instance as null for this connection
									delete _u.instanceObject;
									
									_i.send({
											cmd: "_processMessageFromRealm",
											id: message.id,
											p:
											{
												cid: _u.sessionData.characterID,
												uid: _u.sessionData.userID,
												r: 200
											}
										});
								},
								
								subscribeToChatChannel: function( message )
								{
									self._users[ message.p.uid ].instanceObject.runCommand(
																											{
																												c: "subscribeToChatChannel",
																												__characterID: message.p.cid,
																												channelName: message.p.channelName,
																												characterName: message.p.characterName
																											},
																											function( response )
																											{
																												if( response.r != 200 )
																												{
																													log.addError( "Error joining channel : " + message.p.channelName );
																													
																													return;
																												}
																												
																												_i.send({
																														cmd: "_processMessageFromRealm",
																														id: message.id,
																														p:
																														{
																															r: 200
																														}
																													});
																											}
																										);
								},
								
								characterInRealm: function( message )
								{
									for(var i in self._users )
									{
										var _u = self._users[ i ];
										
										if( _u.sessionData.characterName != message.p.cn )
										{
											continue;
										}
										
										_i.send({
												cmd: "_processMessageFromRealm",
												id: message.id,
												p:
												{
													cid: _u.sessionData.characterID,
													uid: _u.sessionData.userID,
													r: 200
												}
											});
										
										return true;
									}
									
									_i.send({
											cmd: "_processMessageFromRealm",
											id: message.id,
											p: { r: 300 }
										});
									
									return false;
								}
								
							}
							
							// handle messages from the instance
							_i.on( "message", function( message )
							{
								if( _instanceCommands[ message.cmd ] )
								{
									_instanceCommands[ message.cmd ]( message );
								}
								else
								{
									// received a command from the instance. just run it as usual
									_callBacks[ message.id ]( message.data );
								}
							});
							
							_i.on( "exit", function( code )
							{
								// delete the associated queue
								delete self._queues[ _i.queueObject.id ];
								
								// process has ended
								if( code == 0 )
								{
									// normal end
									
									log.add( "Process " + _i.pid + " ended gracefully. Instance ID " + _i.queueObject.zone_id + " ( " + _i.queueObject.zp_id + " )" );
									
									return;
								}
								
								// abnormal end
								log.addWarning( "Process " + _i.pid + " crashed. Instance ID " + _i.queueObject.zone_id + " ( " + _i.queueObject.zp_id + " )" );
								
								for(var i in self._users)
								{
									var _u = self._users[ i ];
									
									if( !_u.instanceObject || _u.instanceObject.pid != _i.pid )
									{
										continue;
									}
									
									delete _u.instanceObject;
									
									// make sure the client is moved outside the instance
									_u.sendUTF( JSON.stringify({
																	c: "disconnectCharacter"
																}) );
								}
							});
						}
					);
		};
		
		/*
		// handle the "death" situation :D
		cluster.on( "death", function( instance )
		{
			//log.addWarning( "Instance " + instance.pid + " exited" );
		});
		*/
		
		this.getInstance = function( instanceID )
		{
			return self._instances[ instanceID ];
		};
		
		this.connectToLoginServer = function()
		{
			log.add( "Connecting to login server via ws://" + self.config.loginServerHost + ':' + self.config.loginServerPort );
			
			var loginServerSocket = new WebSocketClient();

			loginServerSocket.on('connectFailed', function(error) 
			{
				console.log( "Connect Error: " + error.toString() + ". Attempting automatic reconnect" );
				
				setTimeout( self.connectToLoginServer, 1000 );
			});
			
			var loginIntervalPointer = null;
			
			// incoming data treatment
			
			loginServerSocket.on('connect', function(connection)
			{
				log.add( "Login server connect event received" );
				
				// make sure this link is available server wide
				self.loginServerSocket = connection;
				
				connection.on(
								'message',
								function( data )
								{
									try
									{
										var parsedData = JSON.parse( data.utf8Data );
									}
									catch( err )
									{
										log.add( "Received bad input: " + data.type + ", " + data.utf8Data );
										
										return;
									}
									
									switch( parsedData.c )
									{
										case "_connect":
											
											switch( parsedData.r )
											{
												case 200:
													
													connection.sendUTF( JSON.stringify({
																							c: "realm_register",
																							name: self.config.realmServerName,
																							address: self.config.realmServerHost,
																							port: self.config.realmServerPort
																						}) );
													
												break;
												default:
													
													log.add( "Received an untreated response from the login server. Raw data: " + data );
													
											}
											
										break;
										case "realm_register":
											
											switch( parsedData.r )
											{
												case 200:
													
													// successfully registered this realm with the login server.
													
													log.add( "Realm registered with login server successfully (ID " + parsedData.realm_id + ")" );
													
													connection.sendUTF( JSON.stringify({
																							c: "realm_online",
																							realm_id: parsedData.realm_id,
																							userCount: self.userCount
																						}) );
													
												break;
												default:
													
													log.add( "Received an untreated response from the login server. Raw data: " + data );
													
											}
											
										break;
										case "session_set_hash":
											
											// the login server has reqested that a certain user be given a session hash. this is a result of a successful authentication and realm selection
											
											log.add( "Setting realm session hash " + parsedData.sh + " to user ID " + parsedData.uid );
											
											syncSQL.q(
														"call session_set_hash(" + parsedData.uid + ",'" + parsedData.sh + "')",
														function( res )
														{
															if( res[0].result != 200 )
															{
																connection.sendUTF( JSON.stringify({
																											c: parsedData.c,
																											r: 301
																										}) );
																
																return;
															}
															
															// hash has been successfully set. any other sessions having the same userID must be closed
															
															if( self._users[ parsedData.uid ] )
															{
																// the same user is already logged in. This value is initialized in the restoreSession command
																
																log.add( "Found the same user logged in twice. Removing previous entry" );
																
																self._users[ parsedData.uid ].emit("close");
															}
															
															log.add( "Send hash successfull result about user ID " + parsedData.uid );
															
															connection.sendUTF( JSON.stringify({
																										c: parsedData.c,
																										uid: parsedData.uid,
																										r: 200
																									}) );
														}
													);
											
										break;
										case "realm_online":
											
											switch( parsedData.r )
											{
												case 200:
													
													// successfully marked as online this server. starting keep-alive thread
													
													log.add( "Realm marked as online with login server successfully" );
													
													loginIntervalPointer = setInterval(	function()
													{
														try
														{
															connection.sendUTF(JSON.stringify({
																								c: "ka"
																							}) );
														}
														catch(e)
														{
															log.add( "Login server keep-alive connection failed. Reconnecting..." );
															
															clearInterval( loginIntervalPointer );
															
															self.connectToLoginServer();
														}
														
													}, self.config.loginServerKeepAliveInterval );
													
												break;
												default:
													
													log.add( "Received an untreated response from the login server. Raw data: " + data );
													
											}
											
										break;
										case "realm_user_count_update":
										
											switch( parsedData.r )
											{
												case 200:
													
													log.add( "User count updated successfully" );
													
												break;
												default:
													
													log.add( "User count updated problem. Raw data: " + data );
													
											}
										
										break;
									}
									
								}
							);
				
				connection.on('error',	function( err )
												{
													// an error has occured
													
													if( typeof err.code == 'undefined' || err.code == 'ECONNREFUSED' )
													{
														// pipe broken unexpectedly or server not open
														
														setTimeout( self.connectToLoginServer, 1000);
													}
												} );
				
				connection.on('close',	function( err )
												{
													// attempt automatic reconnect
													
													//setTimeout( self.connectToLoginServer, 1000);
												} );
			});
			
			loginServerSocket.connect( 'ws://' + self.config.loginServerHost + ':' + self.config.loginServerPort + '/' );
		};
		
		/*
		this.startLoop = function()
		{
			log.add( "Starting loop" );
			
			var server = http.createServer( function(request, response)
			{
				response.end();
			});
			
			server.listen( realmConfig.realmServerPort, function()
			{
				log.addNotice( "Realm is listening on " + realmConfig.realmServerPort );
			});
			
			var wsServer = new WebSocketServer(
			{
				httpServer: server,
				autoAcceptConnections: true
			});
			
			wsServer.on('connect', function( websocket )
			{
				// send a message confirming success
				
				websocket.sendUTF( JSON.stringify({
														c: "_connect",
														r: 200
													}) );
				
				websocket.on('message', function( message )
				{
					try
					{
						var _result = JSON.parse( message.utf8Data );
					}
					catch( e )
					{
						log.add( "Received bad input: " + message.type + ", " + message.utf8Data );
						
						return;
					}
					
					// there an instance associated with this socket. send the message to it
					if( websocket.instanceObject )
					{
						// the instance object is associated with the websocket only after the character associated with this websocket is active.
						
						websocket.instanceObject.messageToCharacter( websocket.sessionData, _result );
						
						return;
					}
					
					// this message is for the realm
					if( !_result.c || !self._commands[ _result.c ] )
					{
						// send error to client
						
						log.addWarning( "Realm command <" + _result.c + "> not found" );
						
						return;
					}
					
					// perform command
					self._commands[ _result.c ].performCommand({
																		ws: websocket,
																		res: _result,
																		sql: self.sql,
																		realm: self
																	});
				});
				
				websocket.on('error', function( socket )
				{
					if( websocket.nextInstanceObject )
					{
						return;
					}
					
					if( !websocket.instanceObject )
					{
						return;
					}
					
					websocket.instanceObject.messageToCharacter( websocket.sessionData, { c: "characterDisconnect" } );
				});
				
				websocket.on('close', function( socket )
				{
					if( websocket.nextInstanceObject )
					{
						return;
					}
					
					if( !websocket.instanceObject )
					{
						return;
					}
					
					websocket.instanceObject.messageToCharacter( websocket.sessionData, { c: "characterDisconnect" } );
				});
			});
			
			// the server has started successfully
			
			self.connectToLoginServer();
		};
		*/
		
		this.startLoop = function()
		{
			var server = http.createServer( function(request, response)
			{
				response.end();
			});
			
			server.listen( realmConfig.realmServerPort, function()
			{
				log.addNotice( "Realm is listening on " + realmConfig.realmServerPort );
			});
			
			// this is the hixie version
			var miksagoServer = miksagoWS.createServer();
			miksagoServer.server = server;
			
			miksagoServer.addListener('connection', function(connection)
			{
				// Add remoteAddress property
				connection.remoteAddress = connection._socket.remoteAddress;
				
				// We want to use "sendUTF" regardless of the server implementation
				connection.sendUTF = connection.send;
				handleWebSocketConnect(connection);
			});
			
			// this is the hybi version
			var serverConfig =  {
				// All options *except* 'httpServer' are required when bypassing
				// WebSocketServer.
				maxReceivedFrameSize: 0x10000,
				maxReceivedMessageSize: 0x100000,
				fragmentOutgoingMessages: true,
				fragmentationThreshold: 0x4000,
				keepalive: true,
				keepaliveInterval: 20000,
				assembleFragments: true,
				// autoAcceptConnections is not applicable when bypassing WebSocketServer
				// autoAcceptConnections: false,
				disableNagleAlgorithm: true,
				closeTimeout: 5000
			};
			
			// Handle the upgrade event ourselves instead of using WebSocketServer
			server.on('upgrade', function(req, socket, head)
			{
				var wsConnection;
				var wsRequest = new WebSocketRequest(socket, req, serverConfig);
				try
				{
					// WebSocket hybi-08/-09/-10 connection (WebSocket-Node)
					
					wsRequest.readHandshake();
					wsConnection = wsRequest.accept(wsRequest.requestedProtocols[0], wsRequest.origin);
					// wsConnection is now live and ready for use
				}
				catch(e)
				{
					//log.addWarning("WebSocket Request unsupported by WebSocket-Node: " + e.toString());
					
					// Attempt old websocket library connection here.
					// wsConnection = /* some fallback code here */
					
					// WebSocket hixie-75/-76/hybi-00 connection (node-websocket-server)
					if(
						req.method === 'GET' &&
						(req.headers.upgrade && req.headers.connection) &&
						req.headers.upgrade.toLowerCase() === 'websocket' &&
						req.headers.connection.toLowerCase() === 'upgrade'
					)
					{
						new miksagoConnection(miksagoServer.manager, miksagoServer.options, req, socket, head);
					}
					
					return;
				}
				
				handleWebSocketConnect(wsConnection);
			});

			function handleWebSocketConnect(websocket)
			{
				self.userCount++;
						
				self.loginServerSocket.sendUTF( JSON.stringify({
																c: "realm_user_count_update",
																userCount: self.userCount
															}) );
													
				websocket.sendUTF( JSON.stringify({
														c: "_connect",
														r: 200
													}) );
				
				websocket.on('message', function( message )
				{
					try
					{
						var _result = JSON.parse( message.utf8Data ? message.utf8Data : message );
					}
					catch( e )
					{
						log.add( "Received bad input: " + message.type + ", " + message.utf8Data );
						
						return;
					}
					
					// there an instance associated with this socket. send the message to it
					if( websocket.instanceObject )
					{
						// the instance object is associated with the websocket only after the character associated with this websocket is active.
						
						websocket.instanceObject.messageToCharacter( websocket.sessionData, _result );
						
						return;
					}
					
					// this message is for the realm
					if( !_result.c || !self._commands[ _result.c ] )
					{
						// send error to client
						
						log.addWarning( "Realm command <" + _result.c + "> not found" );
						
						return;
					}
					
					// perform command
					self._commands[ _result.c ].performCommand({
																		ws: websocket,
																		res: _result,
																		sql: self.sql,
																		realm: self
																	});
				});
				
				var _disconnectHandler = function( socket )
				{
					self.userCount--;
									
					self.loginServerSocket.sendUTF( JSON.stringify({
																c: "realm_user_count_update",
																userCount: self.userCount
															}) );
					
					websocket.removeListener( 'error', _disconnectHandler );
					websocket.removeListener( 'close', _disconnectHandler );
					
					if( websocket.nextInstanceObject )
					{
						return;
					}
					
					if( !websocket.instanceObject )
					{
						return;
					}
					
					websocket.instanceObject.messageToCharacter( websocket.sessionData, { c: "characterDisconnect" } );
				};
				
				websocket.on( 'error', _disconnectHandler );
				websocket.on( 'close', _disconnectHandler );
			}
			
			// the server has started successfully
			
			self.connectToLoginServer();
		}
		
		//
		// Loaders
		//
		
		this.loadCommands = function( after )
		{
			// load commands support
			
			fs.readdir( this.commandsDir, function( err, files )
			{
				for(var i=0;i<files.length;i++)
				{
					var _tokens = files[i].split( "." );
					
					self._commands[ _tokens[2] ] = require( self.commandsDir + _tokens[0] + "." + _tokens[1] + "." + _tokens[2] );
					
					log.add( "Loaded command: " + _tokens[2] );
				}
				
				after();
			});
		};
		
		this.loadTranslations = function( after )
		{
			// load commands support
			
			fs.readdir( this.translationsDir, function( err, files )
			{
				for(var i=0;i<files.length;i++)
				{
					var _tokens = files[i].split( "." );
					
					if( _tokens[1] != "js" )
					{
						continue;
					}
					
					self._translations[ _tokens[0] ] = require( self.translationsDir + _tokens[0] ).translation;
					
					log.add( "Loaded translation: " + _tokens[0] );
				}
				
				after();
			});
		};
		
		this.loadProgression = function( after )
		{
			// async load progression table
			
			self.sql.query(
					"SELECT `cdlp_level`, `cdlp_start_xp`, `cdlp_end_xp`, `cdlp_earned_xp`" +
						"FROM `character_default_level_progression`",
					function( err, res )
					{
						if( err )
						{
							log.addError( "Level progression query error: " + err );
							
							return;
						}
						
						res.fetchAll( function (err, rows)
						{
							if( err )
							{
								log.addError( "Buffs fetch error: " + err );
								
								return;
							}
							
							for(var i=0;i<rows.length;i++)
							{
								self._progression[ rows[i].cdlp_level ] = rows[i];
							}
							
							after();
						});
					}
				);
		};
		
		this.loadBuffs = function( after )
		{
			// async load buffs table
			
			var _query = "SELECT `buff_id`, `buff_tree`, `buff_tree` + 0 as `buff_tree_binary`, `buff_tree_parent_id_buff`, `buff_points`, `buff_allow_target` + 0 as buff_allow_target, `buff_target_range`, `buff_area_type` + 0 as buff_area_type, ceiling( ( `buff_area_radius` * 8 ) / " + self.config.realmInstanceGridCellWidth + " ) as buff_area_radius, `buff_area_targets_number`, `buff_type` + 0 as buff_type, `buff_level`, `buff_damage_type` + 0 as buff_damage_type, `buff_mechanic_type` + 0 as buff_mechanic_type, `buff_mechanic_duration_seconds`, `buff_mechanic_tics`, `buff_effect` + 0 as buff_effect, `buff_prerequisite_effect` + 0 as buff_prerequisite_effect, `buff_prerequisite_target` + 0 as buff_prerequisite_target, `buff_max_stacks`, `buff_spawn_id_buff`, `buff_name`, `buff_description`, `buff_cast_seconds`, `buff_cooldown_seconds`," +
						"`buff_gain_happiness_min`, `buff_gain_happiness_max`, `buff_gain_hp_min`, `buff_gain_hp_max`, `buff_gain_speed`, `buff_gain_attack_min`, `buff_gain_attack_max`, `buff_gain_defense_min`, `buff_gain_defense_max`, `buff_gain_armor_min`, `buff_gain_armor_max`, `buff_gain_potency_min`, `buff_gain_potency_max`, `buff_gain_strength_min`, `buff_gain_strength_max`, " +
						"`buff_gain_happiness_percent` * 0.01 as buff_gain_happiness_percent, `buff_gain_hp_percent` * 0.01 as buff_gain_hp_percent, `buff_gain_speed_percent` * 0.01 as buff_gain_speed_percent, `buff_gain_attack_percent` * 0.01 as buff_gain_attack_percent, `buff_gain_defense_percent` * 0.01 as buff_gain_defense_percent, `buff_gain_armor_percent` * 0.01 as buff_gain_armor_percent, `buff_gain_resistance_percent` * 0.01 as buff_gain_resistance_percent, `buff_gain_potency_percent` * 0.01 as buff_gain_potency_percent, `buff_gain_base_hp_percent` * 0.01 as buff_gain_base_hp_percent " +
						" FROM `buffs` ";
			
			self.sql.query(
					_query,
					function( err, res )
					{
						if( err )
						{
							log.addError( "Buffs query error: " + err );
							
							return;
						}
						
						res.fetchAll( function (err, rows)
						{
							if( err )
							{
								log.addError( "Buffs fetch error: " + err );
								
								return;
							}
							
							for(var i=0;i<rows.length;i++)
							{
								self._buffs[ rows[i].buff_id ] = rows[i];
							}
							
							res.freeSync();
							
							after();
						});
					}
				);
		};
		
		this.loadLoot = function( after )
		{
			// async load loot table
			
			var _query = "select * from `loot_full` ";
			
			self.sql.query(
					_query,
					function( err, res )
					{
						if( err )
						{
							log.addError( "Loot query error: " + err );
							
							return;
						}
						
						res.fetchAll( function (err, rows)
						{
							if( err )
							{
								log.addError( "Loot fetch error: " + err );
								
								return;
							}
							
							for(var i=0;i<rows.length;i++)
							{
								self._loot[ rows[i].loot_id ] = rows[i];
							}
							
							res.freeSync();
							
							after();
						});
					}
				);
		};
		
		this.loadQuests = function( after )
		{
			var getQuestConditions = function( _args )
			{
				// quest finalize parameters
				self.sql.query(
								"SELECT `qcf_parameter_name`, `qcf_name`, `qcf_parameter_value_max` from `quest_conditions_finalize` where `qcf_id_quest` = " + _args.questId,
								function( err, res )
								{
									if( err )
									{
										log.addError( "Quests query error: " + err );
										
										return;
									}
									
									res.fetchAll( function (err, rows)
									{
										if( err )
										{
											log.addError( "Quests query rows fetch error: " + err );
											
											return;
										}
										
										//modified
										for(var i = 0; i < rows.length; i++)
										{
											self._questsData[ _args.questId ].conditions[rows[i].qcf_parameter_name] = {
																															name: rows[i].qcf_name,
																															targetValue: rows[i].qcf_parameter_value_max
																														};
										}
										
										// quest get parameters
										self.sql.query(
														"SELECT `qcg_parameter_name`, `qcg_parameter_value_min` from `quest_conditions_get` where `qcg_id_quest` = " + _args.questId,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Quests query error: " + err );
																
																return;
															}
															
															res.fetchAll( function (err, rows)
															{
																if( err )
																{
																	log.addError( "Quests query rows fetch error: " + err );
																	
																	return;
																}
																
																for(var i = 0; i < rows.length; i++)
																{
																	self._questsData[ _args.questId ].conditionsGet.push( rows[ i ] );
																}
																
																_args.after();
															})
														}
													);
									});
								}
							);
			};
			
			self.sql.query(
							"SELECT `quest_id`, `quest_is_repeatable`, `quest_is_daily`, `quest_name`, `quest_description`, `quest_objectives`, `quest_award_amber`, `quest_award_polen`, `quest_award_glory`, `quest_award_xp` " +
								" from `quests` ",
							function( err, res )
							{
								if( err )
								{
									log.addError( "Quests query error: " + err );
									
									return;
								}
								
								res.fetchAll( function (err, rows)
								{
									if( err )
									{
										log.addError( "Quests query rows fetch error: " + err );
										
										return;
									}
									
									var questsDataRemaining = 0;
									for(var i = 0; i < rows.length; i++)
									{
										self._questsData[ rows[i].quest_id ] = {
																					quest_is_repeatable: rows[i].quest_is_repeatable,
																					quest_is_daily: rows[i].quest_is_daily,
																					quest_name: rows[i].quest_name,
																					quest_description: rows[i].quest_description,
																					quest_objectives: rows[i].quest_objectives,
																					quest_award_xp: rows[i].quest_award_xp,
																					quest_award_glory: rows[i].quest_award_glory,
																					quest_award_polen: rows[i].quest_award_polen,
																					quest_award_amber: rows[i].quest_award_amber,
																					conditions: {},
																					conditionsGet: []
																				};
										
										questsDataRemaining++;
										
										getQuestConditions({
																questId: rows[i].quest_id,
																maxCount: rows.length,
																after: function()
																{
																	questsDataRemaining--;
																	
																	if( questsDataRemaining > 0 )
																	{
																		return;
																	}
																	
																	after();
																}
															});
									}
									
									res.freeSync();
								});
							}
						);
		};
		
		//achievements_work
		this.loadAchievements = function( after )
		{
			var getAchievementConditions = function( _args )
			{
				// achievement finalize parameters
				self.sql.query(
								"SELECT `acf_parameter_name`, `acf_name`, `acf_parameter_value_max` from `achievement_conditions_finalize` where `acf_id_achievement` = " + _args.achievementId,
								function( err, res )
								{
									if( err )
									{
										log.addError( "Achievements query error: " + err );
										
										return;
									}
									
									res.fetchAll( function (err, rows)
									{
										if( err )
										{
											log.addError( "Achievements query rows fetch error: " + err );
											
											return;
										}
										
										//modified
										for(var i = 0; i < rows.length; i++)
										{
											self._achievementsData[ _args.achievementId ].conditions[rows[i].acf_parameter_name] = {
																																	name: rows[i].acf_name,
																																	targetValue: rows[i].acf_parameter_value_max
																																};
										}
										
										_args.after();
									});
								}
							);
			};
			
			self.sql.query(
							"SELECT `achievement_id`, `achievement_name`, `achievement_description`, `achievement_objectives` from `achievements` ",
							function( err, res )
							{
								if( err )
								{
									log.addError( "Achievements query error: " + err );
									
									return;
								}
								
								res.fetchAll( function (err, rows)
								{
									if( err )
									{
										log.addError( "Achievements query rows fetch error: " + err );
										
										return;
									}
									
									var achievementsDataRemaining = 0;
									for(var i = 0; i < rows.length; i++)
									{
										self._achievementsData[ rows[i].achievement_id ] = {
																							achievement_name: rows[i].achievement_name,
																							achievement_description: rows[i].achievement_description,
																							achievement_objectives: rows[i].achievement_objectives,
																							conditions: {}
																						};
										
										achievementsDataRemaining++;
										
										getAchievementConditions({
																achievementId: rows[i].achievement_id,
																maxCount: rows.length,
																after: function()
																{
																	achievementsDataRemaining--;
																	
																	if( achievementsDataRemaining > 0 )
																	{
																		return;
																	}
																	
																	after();
																}
															});
									}
									
									res.freeSync();
								});
							}
						);
		};
		
		this.loadInstanceSurfaces = function( after )
		{
			syncSQL.q(
					"call zones_delete()",
					function( res )
					{
						if( res[0].result != 200 )
						{
							log.addError( "Error deleting active zones " + err );
							
							return;
						}
						
						var _query = "SELECT `zp_id`, `zp_name`, `zp_type`, `zp_anterium_start_x`, `zp_anterium_start_y`, `zp_hegemony_start_x`, `zp_hegemony_start_y`, `zp_faction_min_players`, `zp_faction_max_players`, `zp_start_when_min_players_reached`, `zp_faction_allowed`, `zp_faction_allowed` + 0 as zp_faction_allowed_binary " +
										" from `zones_pool` ";
						
						self.sql.query(
								_query,
								function( err, res )
								{
									if( err )
									{
										log.addError( "Instance query error: " + err );
										
										return;
									}
									
									res.fetchAll( function (err, rows)
									{
										if( err )
										{
											log.addError( "Instance query rows fetch error: " + err );
											
											return;
										}
										
										for(var i=0;i<rows.length;i++)
										{
											try
											{
												var _data = require( self.mapsMetaDir + rows[i].zp_id ).zoneMeta;
											}
											catch( err )
											{
												log.addWarning( "Skipped defined map " + rows[i].zp_id + " due to missing map" );
												
												continue;
											}
											
											// init the map structure
											
											self._zoneSurface[ rows[ i ].zp_id ] = _data;
											self._zoneData[ rows[ i ].zp_id ] = rows[ i ];
											
											log.add( "Loaded map: " + rows[ i ].zp_name + " ( " + rows[ i ].zp_id + " ) " );
										}
										
										res.freeSync();
										
										after();
									});
								}
							);
						}
					);
		};
	};
	
	/*
	//
	// cast chemes used for buffs
	//
	
	var castAreaSchemes = {
		
		schemes:
		{
			radial: {
					
					1: {
						calculatedPoints: [],
						offsetX: -1,
						offsetY: -1,
						mask: [
							[ null,	1,		null ],
							[ 1,		1,		1	],
							[ null,	1,		null ],
						]
					},
					2: {
						calculatedPoints: [],
						offsetX: -2,
						offsetY: -2,
						mask: [
							[ null,	null,	1,		null,	null ],
							[ null,	1,		1,		1,		null ],
							[ 1,		1,		1,		1,		1 ],
							[ null,	1,		1,		1,		null ],
							[ null,	null,	1,		null,	null ]
						]
					},
					3: {
						calculatedPoints: [],
						offsetX: -3,
						offsetY: -3,
						mask: [
							[ null,	null,	null,	1,	null,	null,	null ],
							[ null,	null,	1,		1,	1,		null,	null ],
							[ null,	1,		1,		1,	1,		1,		null ],
							[ 1,		1,		1,		1,	1,		1,		1 ],
							[ null,	1,		1,		1,	1,		1,		null ],
							[ null,	null,	1,		1,	1,		null,	null ],
							[ null,	null,	null,	1,	null,	null,	null ],
						]
					},
					4: {
						calculatedPoints: [],
						offsetX: -4,
						offsetY: -4,
						mask: [
							[ null,	null,	null,	1,	null,	null,	null ],
							[ null,	null,	1,		1,	1,		null,	null ],
							[ null,	1,		1,		1,	1,		1,		null ],
							[ 1,		1,		1,		1,	1,		1,		1 ],
							[ null,	1,		1,		1,	1,		1,		null ],
							[ null,	null,	1,		1,	1,		null,	null ],
							[ null,	null,	null,	1,	null,	null,	null ],
						]
					},
					5: {
						calculatedPoints: [],
						offsetX: -5,
						offsetY: -5,
						mask: [
							[ null,	null,	null,	1,	null,	null,	null ],
							[ null,	null,	1,		1,	1,		null,	null ],
							[ null,	1,		1,		1,	1,		1,		null ],
							[ 1,		1,		1,		1,	1,		1,		1 ],
							[ null,	1,		1,		1,	1,		1,		null ],
							[ null,	null,	1,		1,	1,		null,	null ],
							[ null,	null,	null,	1,	null,	null,	null ],
						]
					}
				},
			
			cone: {
					2: {
						calculatedPoints: [],
						offsetX: 0,
						offsetY: -2,
						mask: [
							[ null,	null,	1 ],
							[ null,	1,		1 ],
							[ 1,		1,		1 ],
							[ null,	1,		1 ],
							[ null,	null,	1 ]
						]
					}
				}
		},
		
		init: function()
		{
			for(var i in this.schemes)
			{
				// radial, cone, etc.
				
				for(var j in this.schemes[ i ] )
				{
					// per distance
					
					for( var k=0;k<this.schemes[ i ][ j ].mask.length;k++ )
					{
						for( var h=0;h<this.schemes[ i ][ j ].mask[ k ].length;h++)
						{
							if( this.schemes[ i ][ j ].mask[ k ][ h ] == null )
							{
								continue;
							}
							
							this.schemes[ i ][ j ].calculatedPoints.push({
																						x: k + this.schemes[ i ][ j ].offsetX,
																						y: h + this.schemes[ i ][ j ].offsetY
																					});
						}
					}
				}
			}
			
			log.add( "Casting schemes initialized" );
		}
	};
	*/
	
	
	
	
	
	
	
	
	
	
	
	
	
	