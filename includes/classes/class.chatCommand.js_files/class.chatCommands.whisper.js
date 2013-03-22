	
	var log = require( "../class.log" ),
		chatChannel= require('../class.chatChannel');
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject, 
			destCharacterName = args.res.parameters.destCharacterName.toLowerCase(),
			message = args.res.parameters.message;
		
		args.instanceProcess.messageToRealm(
											{
												cmd: "characterInRealm",
												cn: destCharacterName
											},
											function( response )
											{
												if( response.r != 200 )
												{
													_c.sendToClient( JSON.stringify({
																						c: "whisper",
																						characterName: destCharacterName,
																						r: 404
																					}) );
													
													return false;
												}
												
												var _iO = args.instanceObject;
												
												//
												// character is in the realm
												//
												
												var fullChannelName = chatChannel.makeChatChannelName({
																										sourceCharacterName: _c.properties.character_name.toLowerCase(),
																										channelType: "whisper",
																										targetCharacterName: destCharacterName
																									});
																									
												for(var i = 0; i < _c.chatChannels.whisper.length; i++)
												{
													if( _c.chatChannels.whisper[i] != fullChannelName )
													{
														continue;
													}
													
													//channel already already existed; make it current channel
													_c.currentChatChannel = fullChannelName;
													
													if( message.length == 0 )
													{
														return;
													}
													
													// send the message
													_iO.redisClient.PUBLISH(
																				_c.currentChatChannel,
																				message,
																				function( err, res )
																				{
																					if( err )
																					{
																						log.addError( "error whisper: " + err );
																						
																						return;
																					}
																					
																					
																				}
																			);
													return;
												}
												
												// channel didn't exist; create it and send message
												chatChannel.createWhisperChannel({
																					targetCharacterName: destCharacterName,
																					targetUserID: response.uid,
																					targetCharacterID: response.cid,
																					instanceProcess: args.instanceProcess,
																					sourceCharacter: _c,
																					message: message
																				});
											}
										);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	