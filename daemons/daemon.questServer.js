	
	"use strict";
	
	var fs = require('fs'),
		log = require("../includes/classes/class.log"),
		realmConfig = require('../includes/config.realm').config,
		redis = require( realmConfig.libraries.redisPath );
	
	var quests = {},
			self = this;
	
	var _loadQuestServer = function()
	{
		var _loadQuests = function()
		{
			log.add("Quest server redis clients are ready");
			
			fs.readdir(
						realmConfig.questServer.questScriptsPath,
						function( err, files )
						{
							for(var i = 0; i < files.length; i++)
							{
								var _tokens = files[ i ].split( "." );
								
								if( _tokens[ 0 ] != "quest" )
								{
									continue;
								}
								
								quests[ parseInt(_tokens[ 1 ], 10) ] = new require( realmConfig.questServer.questScriptsPath + _tokens[ 0 ] + '.' + _tokens[ 1 ] ).questObject( {questServer: self} );
								
								log.add( "Loaded quest: " + _tokens[ 1 ] );
							}
							
							log.addNotice( "Quests Loaded" );
							
							self.redisListener.on(
													"message",
													function( channel, message )
													{
														try
														{
															var jsonEl = JSON.parse( message );
														}
														catch( e )
														{
															log.addError( "Error parsing quest server message: " + message );
															
															return;
														}
														
														log.add( "Quest server received: " + message );
														
														self.redisSpeaker.publish(
																					"character_" + jsonEl.characterId,
																					'{"type":"quest", "action":"update", "questId":' + jsonEl.questId + ',"condition":"' + jsonEl.parameterName + '","value":' + jsonEl.value + '}'
																				);
																			
														quests[ jsonEl.questId ].checkConditions({
																									characterId: jsonEl.characterId,
																									parameterName: jsonEl.parameterName,
																									value: jsonEl.value
																								});
													}
												);
							
							log.addNotice( "Quest server is ready" );
						}
					);
		}
		
		//
		// Initialize
		//
		
		process.title = "Quest Server Loaded";
		
		self.redisListener.removeListener(
											"drain",
											_loadQuestServer
										);
		
		self.redisListener.SUBSCRIBE(
										realmConfig.questServer.redisChannel,
										function( err, res )
										{
											if( err )
											{
												log.addError( "Quest server - Error listening to quest channel: " + err );
												return;
											}
											
											_loadQuests();
										}
									);
	}
	
	//
	// Start the listeners
	//
	
	var _savePID = function( after )
	{
		fs.writeFile(
				"daemon.questServer.pid",
				process.pid,
				function(err)
				{
					if( err )
					{
						log.addError( "Error saving process ID " + err );
						
						return;
					}
					
					after();
				}
			); 
	}
	
	_savePID( function()
	{
		self.redisSpeaker = redis.createClient();
		
		self.redisSpeaker.on(
								"connect",
								function()
								{
									self.redisListener = redis.createClient();
									
									self.redisListener.on(
															"connect",
															_loadQuestServer
														);
									
									// redis may be lagging on the "connect" event. it is not invoked when the connection is ready again. "drain" is invoked
									self.redisListener.on(
															"drain",
															_loadQuestServer
														);
									
									self.redisListener.on(
															"end",
															function()
															{
																log.addWarning( "Lost connection to Redis. Exiting" );
																
																process.exit();
															}
														);
									
								}
							);
		
		self.redisSpeaker.on(
								"end",
								function()
								{
									log.addWarning( "Lost connection to Redis. Exiting" );
									
									process.exit();
								}
							);
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	