#!/usr/local/bin/node
	
	"use strict";
	
	var fs = require('fs'),
		log = require("../includes/classes/class.log"),
		realmConfig = require('../includes/config.realm').config,
		redis = require( realmConfig.libraries.redisPath );
	
	var achievements = {},
			self = this;
	
	var _loadAchievementServer = function()
	{
		var _loadAchievements = function()
		{
			log.addNotice( "Achievement server redis clients are ready" );
			
			fs.readdir(
						realmConfig.achievementServer.achievementScriptsPath,
						function( err, files )
						{
							
							for(var i = 0; i < files.length; i++)
							{
								var _tokens = files[ i ].split( "." );
								
								if( _tokens[ 0 ] != "achievementScript" )
								{
									continue;
								}
								
								achievements[ parseInt(_tokens[ 1 ], 10) ] = new require( realmConfig.achievementServer.achievementScriptsPath + _tokens[ 0 ] + '.' + _tokens[ 1 ] ).achievementObject( {achievementServer: self} );
								log.add( "Loaded achievement: " + _tokens[ 1 ] );
							}
							
							self.redisListener.on(
													"message",
													function( channel, message )
													{
														var jsonEl = JSON.parse( message );
														
														self.redisSpeaker.SISMEMBER(
																						"character." + jsonEl.characterId + ".achievementsFinalized",
																						jsonEl.achievementId,
																						function(  err, res )
																						{
																							if( err )
																							{
																								log.addError( "error checking if achievement is finalized: " + err );
																							}
																							
																							if( res )
																							{
																								//achievement was finalized by character
																								return;
																							}
																							
																							self.redisSpeaker.HINCRBY(
																														"achievement." + jsonEl.achievementId, 
																														jsonEl.characterId + "." + jsonEl.parameterName,
																														jsonEl.value,
																														function(err, newValue)
																														{
																															if( err )
																															{
																																log.addError( "Achievement condition update error: " + err);
																																
																																return;
																															}
																															
																															self.redisSpeaker.PUBLISH(
																																						"character_" + jsonEl.characterId,
																																						'{"type":"achievement", "action":"update", "achievementId":' + jsonEl.achievementId + ',"condition":"' + jsonEl.parameterName + '","value":' + newValue + '}'
																																					);
																																						
																															achievements[ jsonEl.achievementId ].checkConditions({
																																																	characterId: jsonEl.characterId,
																																																	parameterName: jsonEl.parameterName,
																																																	value: newValue
																																																});
																														}
																													);
																						}
																					);
													}
												);
							
							log.addNotice( "Achievement server is ready" );
						}
					);
		}
		
		//
		// Initialize
		//
		
		process.title = "Achievement Server Loaded";
		
		self.redisListener.removeListener( 
											"drain",
											_loadAchievementServer
										);
		
		self.redisListener.SUBSCRIBE(
										realmConfig.achievementServer.redisChannel,
										function( err, res )
										{
											if( err )
											{
												log.addError( "Achievement server - Error listening to quest channel: " + err );
												
												return;
											}
											
											_loadAchievements();
										}
									);
	}
	
	//
	// Start the listeners
	//
	
	var _savePID = function( after )
	{
		fs.writeFile(
				"daemon.achievementServer.pid",
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
															_loadAchievementServer
														);
									
									// redis may be lagging on the "connect" event. it is not invoked when the connection is ready again. "drain" is invoked
									self.redisListener.on(
															"drain",
															_loadAchievementServer
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
						
						
						
						
						
						
						
						
						
						
						
						
						
						