	
	"use strict";
	
	var log = require( "./class.log" ),
		realmConfig = require('../config.realm').config,
		redis = require( realmConfig.libraries.redisPath );

	//todo: parse names
		
	//assamble full name of chat channel
	var makeChatChannelName = function( args )
	{
		switch( args.channelType )
		{
			case "instance":
				
				return "chat.instance." + args.characterObject.properties.character_id_zone + "." + args.characterObject.properties.character_faction + "." + args.channelName;
				
			break;
			case "global":
				
				return "chat.global." + args.characterObject.properties.character_faction + "." + args.channelName;
				
			break;
			case "say":
				
				return "chat.instance." + args.characterObject.properties.character_id_zone + "." + args.characterObject.properties.character_faction + ".say";
				
			break;
			case "yell":
				
				return "chat.instance." + args.characterObject.properties.character_id_zone + "." + args.characterObject.properties.character_faction + ".yell";
				
			break;
			case "whisper":
				
				return "chat.whisper." + args.sourceCharacterName + "." + args.targetCharacterName;
				
			break;
		}
	}
	
	// used for "say" or "yell"
	exports.subscribeToSpecialChannel = function( args )
	{
		var _c = args.characterObject;
		
		var _fullChatChannelName = makeChatChannelName({
																	characterObject: _c,
																	channelType: args.channelType
																});
		
		_c.redisClient.SUBSCRIBE(
								_fullChatChannelName,
								function( err, res )
								{
									if( err )
									{
										log.addError( "Error joining instance channels: say " + err );
										
										return;
									}
									
									// use the instance connection due to its state (not in pub / sub)
									_c.getInstance().redisClient.SADD(
																	_fullChatChannelName,
																	_c.properties.character_name,
																	function( err, res )
																	{
																		if( err )
																		{
																			log.addError( "join chat list" + err );
																			return;
																		}
																		
																		_c.chatChannels[ args.channelType ].push( _fullChatChannelName );
																		
																		_c.currentChatChannel = _fullChatChannelName;
																		
																		_c.sendToClient( JSON.stringify({
																											c: "joinChannel",
																											r: 200,
																											channelName: args.channelType,
																											channelType: args.channelType
																										}) );
																		
																		args.after();
																	}
																);
								}
							);
	}
	
	exports.unSubscribeToChannel = function( args )
	{
		var _c = args.characterObject, redisClient = _c.getInstance().redisClient;
		
		var fullChannelName = makeChatChannelName({
												characterObject: _c,
												channelType: args.channelType,
												channelName: args.channelName
											});
		
		_c.redisClient.UNSUBSCRIBE(
										fullChannelName,
										function( err, res )
										{
											if( err )
											{
												log.addError( "Error leave instance channel: " + fullChannelName + " - " + err );
												
												return;
											}
											
											redisClient.SREM(
															fullChannelName, 
															_c.properties.character_name,
															function( err, res )
															{
																if( err )
																{
																	log.addError( "leave chat list error " + err );
																	
																	return;
																}
																
																// remove the channel from the active list
																
																_c.chatChannels[ args.channelType ].splice( _c.chatChannels[ args.channelType ].indexOf( fullChannelName ), 1 );
																
																if( _c.currentChatChannel == fullChannelName )
																{
																	// left the active chat channel
																	
																	_c.currentChatChannel = makeChatChannelName({
																																characterObject: _c,
																																channelType: "say"
																															});
																}
																
																_c.sendToClient( JSON.stringify({
																									c: "leaveChannel",
																									r: 200,
																									channelName: args.channelName
																								}) );
																
																args.after();
															});
										});
	}
	
	//send chat message to character's current chat channel
	var sendMessage = function( args )
	{
		args.instanceObject.redisClient.PUBLISH(
												args.characterObject.currentChatChannel,
												args.message,
												function( err, res )
												{
													if( err )
													{
														log.addError( err );
														
														return;
													}
													
													
												}
											);
		
		return;
	}
	
	var sendMessageSpecialAutoComplete = function( args )
	{
		var senderObject = args.characterObject, _tcOP = args.targetCharacterObject.properties;
		
		sendMessageSpecial({
							channelType: "say",
							message: "[player:" + senderObject.properties.character_id + ":" + senderObject.properties.character_name + "] says: " + args.message.toString().replace( "%targetName", _tcOP.character_name ).replace( "%targetRace", _tcOP.character_race ).replace( "%targetClass", _tcOP.character_class ),
							characterObject: senderObject,
							instanceObject: senderObject.getInstance()
						});
	}
	
	//send message on say / yell channels
	var sendMessageSpecial = function( args )
	{
		var faction = args.characterObject.properties.character_faction;
		
		if( faction == null )
		{
			return;
		}
		
		// send to friendly say / yell channel
		args.instanceObject.redisClient.PUBLISH(
														args.characterObject.currentChatChannel,
														args.message,
														function( err, res )
														{
															if( err )
															{
																log.addError( err )
															}
															
															
														});
		
		var message = args.message.toLowerCase(),
				messagePartToTranslate = message.split( "says: ", 2 )[1], //get everything after "says:" //message.match( /[a-zA-Z]+/g ),
				_h = realmConfig.chatTranslationsHash[ faction ],
				_hKeys = Object.keys( _h ),
				messageToSendToEnemy = "";
		
		//replace structures with only names
		var messageStructures = messagePartToTranslate.match( /\[[a-zA-Z]+\:[0-9]+\:[a-zA-Z0-9 \(\)\,\.]+\]/g );
		if( messageStructures != null )
		{
			for( var i = 0; i < messageStructures.length; i++ )
			{
				//console.log( messageStructures[i].split(":")[2] );
				messagePartToTranslate = messagePartToTranslate.replace( messageStructures[i], ' ' + messageStructures[i].split(":")[2].slice(0, -1) ); //replace structure with just the name; slice is for removing the ']'
			}
		}
		
		var messageWords = messagePartToTranslate.match( /[a-zA-Z]+/g );
		if( messageWords != null )
		{
			for( var i = 0; i < messageWords.length; i++ )
			{
				var messageLength = messageWords[ i ].length;
			
				if( !(messageLength in _hKeys ) )
				{
					// length not registered. either too small or too big
					
					messageLength = _hKeys[ _hKeys.length - 1 ];
				}
				
				if( messageWords[i] in realmConfig.chatTranslationsDictionary )
				{
					messagePartToTranslate = messagePartToTranslate.replace(
																			messageWords[i],
																			realmConfig.chatTranslationsDictionary[ messageWords[i] ][ faction ]
																		);
					
					continue;
				}
				
				messagePartToTranslate = messagePartToTranslate.replace(
																		messageWords[i], 
																		_h[messageLength][ Math.floor(
																										Math.random() * _h[ messageLength ].length
																									) ] 
																	);
			}
		}
		
		var _enemyChannelName = "chat.instance." + args.characterObject.properties.character_id_zone + "." + ( ( faction == "anterium" ) ? 'hegemony' : 'anterium' ) + "." + args.channelType;
		
		//console.log(message.split( "says: ", 2 )[0] + "says: " + messagePartToTranslate);
		
		//send to enemy say channel
		args.instanceObject.redisClient.PUBLISH(
												_enemyChannelName,
												message.split( "says: ", 2 )[0] + "says: " + messagePartToTranslate,
												function( err, res )
												{
													if( err )
													{
														log.addError( "Error sending message to " + _enemyChannelName + ": " + err );
														
														return;
													}
													
													// message sent
												}
											);				
		return;
	}
	
	//instance
	var createInstanceChannel = function( args )
	{
		var fullChannelName = makeChatChannelName({
																characterObject: args.characterObject,
																channelType: "instance",
																channelName: args.channelName
															});
		
		args.redisClient.SADD(
								fullChannelName,
								args.characterObject.properties.character_name,
								function( err, res )
								{
									if( err )
									{
										log.addError( "Error adding chatter (init) to channel: " + fullChannelName + " - " + err );
										return;
									}
									
									//join new channel
									args.after({
												characterObject: args.characterObject,
												channelName: args.channelName
											});
									
									return;
								}
						);
	}
	
	var joinInstanceChannel = function( args )
	{
		var characterObject = args.characterObject;
		var fullChannelName = makeChatChannelName({
																characterObject: args.characterObject,
																channelType: "instance",
																channelName: args.channelName
															});
		
		var redisClient = characterObject.getInstance().redisClient;
		
		redisClient.EXISTS( fullChannelName,
							function( err, res )
							{
								if( err )
								{
									log.addError( "Error checking channel: " + fullChannelName + " - " + err );
									return;
								}
								
								if( res == 1 )
								{
									//if channel exists add character to it
									
									redisClient.SADD(
														fullChannelName,
														characterObject.properties.character_name,
														function( err, res )
														{
															if( err )
															{
																log.addError( "join chat list" + err );
																return;
															}
															
															characterObject.redisClient.SUBSCRIBE(
																										fullChannelName,
																										function( err, res )
																										{
																											if( err )
																											{
																												log.addError( "Error joining instance channels: " + fullChannelName + "general" + " - " + err );
																												return;
																											}
																											
																											characterObject.chatChannels.instance.push( fullChannelName );
																											characterObject.currentChatChannel = fullChannelName;
																											
																											characterObject.sendToClient( JSON.stringify({
																																							c: "joinChannel",
																																							r: 200,
																																							channelName: args.channelName,
																																							channelType: "instance"
																																						}) );
																										}
																									);
														}
													);
									
									return;
								}
								
								//create new instance channel and add character to it
								createInstanceChannel({
															characterObject: characterObject,
															channelName: args.channelName,
															redisClient: redisClient,
															after: function( _args )
															{
																var fullChannelName = makeChatChannelName({
																														characterObject: _args.characterObject,
																														channelType: "instance",
																														channelName: _args.channelName
																													});
																
																_args.characterObject.getInstance().listenToChatChannel( fullChannelName );
																
																_args.characterObject.redisClient.SUBSCRIBE(
																												fullChannelName,
																												function( err, res )
																												{
																													if( err )
																													{
																														log.addError( "Error joining instance channels: " + fullChannelName + " - " + err );
																														return;
																													}
																													
																													_args.characterObject.chatChannels.instance.push( fullChannelName );
																													_args.characterObject.currentChatChannel = fullChannelName;
																													
																													_args.characterObject.sendToClient( JSON.stringify({
																																										c: "joinChannel",
																																										r: 200,
																																										channelName: _args.channelName,
																																										channelType: "instance"
																																									}) );
																												}
																											);
															}
													});
							}
						);
	}
	
	var leaveInstanceChannel = function( args )
	{
		var _c = args.characterObject;
		
		var fullChannelName = makeChatChannelName({
												characterObject: _c,
												channelType: "instance",
												channelName: args.channelName
											});
		
		var redisClient = _c.getInstance().redisClient;
		
		_c.redisClient.UNSUBSCRIBE(
										fullChannelName,
										function( err, res )
										{
											if( err )
											{
												log.addError( "Error leave instance channel: " + fullChannelName + " - " + err );
												return;
											}
											
											redisClient.SREM(
															fullChannelName, 
															_c.properties.character_name,
															function( err, res )
															{
																if( err )
																{
																	log.addError( "leave chat list" + err );
																	return;
																}
																
																// remove the channel from the active list
																_c.chatChannels.instance.splice( _c.chatChannels.instance.indexOf( fullChannelName ), 1 );
																
																if( _c.currentChatChannel != fullChannelName )
																{
																	// didn't leave the active chat channel
																	
																	return;
																}
																
																_c.currentChatChannel = makeChatChannelName({
																															characterObject: _c,
																															channelType: "say"
																														});
																
																_c.sendToClient( JSON.stringify({
																									c: "leaveChannel",
																									r: 200,
																									channelName: args.channelName
																								}) );
															}
														);
										});
	}
	
//global
	var createGlobalChannel = function( args )
							{
								var fullChannelName = makeChatChannelName({
																		characterObject: args.characterObject,
																		channelType: "global",
																		channelName: args.channelName
																	});
																	
								args.redisClient.SADD( fullChannelName, 
														args.characterObject.properties.character_name,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Error checking channel: " + fullChannelName + " - " + err );
																return;
															}
															
															//join new channel
															args.after({
																		characterObject: args.characterObject,
																		channelName: args.channelName
																	});
															
															return;
														}
													);
							}
	
	var joinGlobalChannel = function( args )
								{
									var characterObject = args.characterObject;
									var fullChannelName = makeChatChannelName({
																			characterObject: args.characterObject,
																			channelType: "global",
																			channelName: args.channelName
																		});
																	
									var redisClient = characterObject.getInstance().redisClient;
									
									redisClient.EXISTS( fullChannelName,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Error checking channel: " + fullChannelName + " - " + err );
																return;
															}
															
															//if channel exists add character to it
															if( res == 1 )
															{
																characterObject.redisClient.SUBSCRIBE( fullChannelName,
																											function( err, res )
																											{
																												if( err )
																												{
																													log.addError( "Error joining global channel: " + fullChannelName + " - " + err );
																													return;
																												}
																												
																												characterObject.chatChannels.global.push( fullChannelName );
																												characterObject.currentChatChannel = fullChannelName;
																												
																												characterObject.sendToClient( JSON.stringify({
																																								c: "joinChannel",
																																								r: 200,
																																								channelName: args.channelName,
																																								channelType: "global"
																																							})
																																			);
																											}
																										);
																return;
															}
															
															//create new global channel and add character to it
															createGlobalChannel({
																					characterObject: characterObject,
																					channelName: args.channelName,
																					redisClient: redisClient,
																					after: function( _args )
																							{
																								var fullChannelName = makeChatChannelName({
																																		characterObject: _args.characterObject,
																																		channelType: "global",
																																		channelName: _args.channelName
																																	});
																		
																								_args.characterObject.getInstance().listenToChatChannel( fullChannelName );
																								
																								_args.characterObject.redisClient.SUBSCRIBE( fullChannelName,
																																				function( err, res )
																																				{
																																					if( err )
																																					{
																																						log.addError( "Error joining global channel: " + _args.channelName + " - " + err );
																																						return;
																																					}
																																					
																																					_args.characterObject.chatChannels.global.push( fullChannelName );
																																					_args.characterObject.currentChatChannel = fullChannelName;
																																					
																																					_args.characterObject.sendToClient( JSON.stringify({
																																																		c: "joinChannel",
																																																		r: 200,
																																																		channelName: _args.channelName,
																																																		channelType: "global"
																																																	}) 
																																													);
																																				}
																																			);
																							}
																				});
																return;
														}
												);
								}
	
	var leaveGlobalChannel = function( args )
	{
		var characterObject = args.characterObject;
		var fullChannelName = makeChatChannelName({
													characterObject: args.characterObject,
													channelType: "global",
													channelName: args.channelName
												});
												
		var redisClient = characterObject.getInstance().redisClient;
		
		characterObject.redisClient.UNSUBSCRIBE( fullChannelName,
													function( err, res )
													{
														if( err )
														{
															log.addError( "Error leaving global channel: " + fullChannelName + " - " + err );
															return;
														}
														
														redisClient.SREM( fullChannelName,
																			characterObject.properties.character_name,
																			function( err, res)
																			{
																				if( err )
																				{
																					log.addError( "error leaving global channel : " +err );
																					return;
																				}
																				
																				characterObject.chatChannels.global.splice( characterObject.chatChannels.global.indexOf( fullChannelName ), 1 );
														
																				if( characterObject.currentChatChannel != fullChannelName )
																				{
																					return;
																				}
																				
																				characterObject.currentChatChannel = makeChatChannelName({
																																			characterObject: characterObject,
																																			channelType: "say"
																																		});
																				
																				characterObject.sendToClient( JSON.stringify({
																																	c: "leaveChannel",
																																	r: 200,
																																	channelName: args.channelName
																																}) );
																			}
																		);
													}
												);
	}
	
	/*
//party
	var createPartyChannel = function( args )
							{
								var channelName = "party." + args.characterObject.properties.character_id_party;
								
								args.redisClient.SADD( channelName, args.characterObject.properties.character_name,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Error checking channel: " + channelName + " - " + err );
																return;
															}
															
															args.after({
																		characterObject: args.characterObject,
																		channelName: args.channelName
																	});
															return;
														}
													);
							}
	
	var joinPartyChannel = function( args )
								{
									var characterObject = args.characterObject;
									var channelName = "party." + characterObject.properties.character_id_party;
									var redisClient = characterObject.getInstance().redisClient;
									
									redisClient.EXISTS( channelName,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Error checking channel: " + channelName + " - " + err );
																return;
															}
															
															if( res == 1 )
															{
																characterObject.redisClient.SUBSCRIBE( channelName,
																										function( err, res )
																										{
																											if( err )
																											{
																												log.addError( "Error joining party channel: " + channelName + " - " + err );
																												return;
																											}
																											
																											characterObject.chatChannels.party = characterObject.properties.character_id_party;
																										}
																									);
																return;
															}
															
															createPartyChannel({
																					characterObject: characterObject,
																					channelName: channelName,
																					redisClient: redisClient,
																					after: function( _args )
																							{
																								_args.characterObject.getInstance().listenToChatChannel( _args.channelName );
																								_args.characterObject.redisClient.SUBSCRIBE( _args.channelName,
																																				function( err, res )
																																				{
																																					if( err )
																																					{
																																						log.addError( "Error joining party channel: " + _args.channelName + " - " + err );
																																						return;
																																					}
																																					
																																					_args.characterObject.chatChannels.party = "";
																																				}
																																			);
																							}
																			});
														}
												);
								}
									
	
	var leavePartyChannel = function( args )
							{
								var characterObject = args.characterObject;
								var channelName = "party." + characterObject.properties.character_id_party;
								
								characterObject.redisClient.UNSUBSCRIBE( channelName,
																			function( err, res )
																			{
																				if( err )
																				{
																					log.addError( "Error leaving party channel: " + channelName + " - " + err );
																					return;
																				}
																				
																				delete characterObject.chatChannels.party;
																				
																				if( characterObject.currentChatChannel != channelName )
																				{
																					return;
																				}
																				
																				replaceDeletedCurrentChatChannel( characterObject );
																			}
																		);
							}
	*/
	
	// whisper channel create
	var createWhisperChannel = function( args )
	{
		var fullChannelName = makeChatChannelName({
													sourceCharacterName: args.sourceCharacter.properties.character_name.toLowerCase(),
													channelType: "whisper",
													targetCharacterName: args.targetCharacterName
												});
		
		var redisClient = args.sourceCharacter.getInstance().redisClient;
		
		//add source character to channel
		redisClient.SADD(
							fullChannelName,
							args.sourceCharacter.properties.character_name,
							function( err, res )
							{
								if( err )
								{
									log.addError( "Error checking channel: " + fullChannelName + " - " + err );
									return;
								}
								
								//add target character to channel
								redisClient.SADD(
													fullChannelName,
													args.targetCharacterName,
													function( err, res )
													{
														if( err )
														{
															log.addError( "Error checking channel: " + fullChannelName + " - " + err );
															return;
														}
														
														args.sourceCharacter.getInstance().listenToChatChannel( fullChannelName );
														
														//subscribe source character to channel
														args.sourceCharacter.redisClient.SUBSCRIBE(
																										fullChannelName,
																										function( err, res )
																										{
																											if( err )
																											{
																												log.addError( "Error joining party channel: " + fullChannelName + " - " + err );
																												return;
																											}
																											
																											args.sourceCharacter.chatChannels.whisper.push( fullChannelName );
																											args.sourceCharacter.currentChatChannel = fullChannelName;
																											
																											//subscribe target character to channel and send message
																											args.instanceProcess.messageToRealm(
																																							{
																																								cmd: "subscribeToChatChannel",
																																								uid: args.targetUserID,
																																								cid: args.targetCharacterID,
																																								channelName: fullChannelName,
																																								characterName: args.sourceCharacter.properties.character_name
																																							},
																																							function()
																																							{
																																								args.sourceCharacter.sendToClient( JSON.stringify({
																																																					c: "whisper",
																																																					r: 200,
																																																					characterName: args.targetCharacterName,
																																																					channelName: fullChannelName
																																																				}) );
																																								
																																								// redis channel
																																								redisClient.PUBLISH(
																																													fullChannelName,
																																													args.message,
																																													function( err, res )
																																													{
																																														if( err )
																																														{
																																															log.addError("error send msg after whisper channel create : " + err);
																																														}
																																														
																																														// channel created successfully
																																													}
																																												);
																																							}
																																						);
																										}
																									);
														return;
													}
												);
								return;
							}
						);
	}
	
	/*
	-- alpha quality
	var joinWhisperChannel = function( args )
	{
		var fullChannelName = makeChatChannelName({
												sourceCharacterName: args.sourceCharacter.properties.character_name.toLowerCase(),
												channelType: "whisper",
												targetCharacterName: args.targetCharacterName
											});
		
		var redisClient = characterObject.getInstance().redisClient;
		
		redisClient.SADD( fullChannelName, 
							args.characterObject.properties.character_name,
							function( err, res )
							{
								if( err )
								{
									log.addError( "Error checking channel: " + fullChannelName + " - " + err );
									return;
								}
								
								args.characterObject.redisClient.SUBSCRIBE( fullChannelName,
																				function( err, res )
																				{
																					if( err )
																					{
																						log.addError( "Error joining whisper channel: " + fullChannelName + " - " + err );
																						return;
																					}
																					
																					args.characterObject.chatChannels.whisper.push( fullChannelName );
																					
																					args.characterObject.sendToClient( JSON.stringify({
																																	c: "joinChannel",
																																	r: 200,
																																	channel: fullChannelName
																																})
																												);
																				}
																			);
																			
								return;
							}
						);
	}
	
	-- alpha quality
	var leaveWhisperChannel = function( args )
	{
		var fullChannelName = makeChatChannelName({
												sourceCharacterName: args.sourceCharacter.properties.character_name.toLowerCase(),
												channelType: "whisper",
												targetCharacterName: args.targetCharacterName
											});
		
		var redisClient = characterObject.getInstance().redisClient;
		
		redisClient.SREM( fullChannelName,
							args.characterObject.properties.character_name,
							function( err, res )
							{
								if( err )
								{
									log.addError( "Error checking channel: " + fullChannelName + " - " + err );
									return;
								}
								
								args.characterObject.redisClient.UNSUBSCRIBE(
																					fullChannelName,
																					function( err, res )
																					{
																						if( err )
																						{
																							log.addError( "Error leaving whisper channel: " + fullChannelName + " - " + err );
																							return;
																						}
																						
																						args.characterObject.chatChannels.whisper.splice( args.characterObject.chatChannels.whisper.indexOf( fullChannelName ), 1 );
																						
																						characterObject.sendToClient( JSON.stringify({
																																		c: "leaveChannel",
																																		r: 200,
																																		channelName: fullChannelName
																																	}) );
																					}
																				);
																			
								return;
							}
						);
	}
	*/
	
	//when disconected remove character from channel but don't send result
	var leaveChatChannelOnDisconnect = function( args )
	{
		//console.log( args.channelName + " " + args.characterName );
		args.redisClient.SREM( args.channelName, 
								args.characterName,
								function( err, res )
								{
									if( err )
									{
										log.addError( "error on disconect leave chat" + err );
									}
								}
							);
	}
	
	exports.makeChatChannelName = makeChatChannelName;
	
	exports.sendMessage = sendMessage;
	exports.sendMessageSpecial = sendMessageSpecial;
	exports.sendMessageSpecialAutoComplete = sendMessageSpecialAutoComplete;
	
	exports.joinInstanceChannel = joinInstanceChannel;
	exports.leaveInstanceChannel = leaveInstanceChannel;
	
	exports.joinGlobalChannel = joinGlobalChannel;
	exports.leaveGlobalChannel = leaveGlobalChannel;
	
	// exports.joinPartyChannel = joinPartyChannel;
	// exports.leavePartyChannel = leavePartyChannel;
	
	exports.createWhisperChannel = createWhisperChannel;
	//exports.joinWhisperChannel = joinWhisperChannel;
	//exports.leaveWhisperChannel = leaveWhisperChannel;
	
	exports.leaveChatChannelOnDisconnect = leaveChatChannelOnDisconnect;
	
	
	