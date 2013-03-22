
	var log = require( "../class.log" ),
		quest = require( "../class.quest" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		_c.redisClientChat.SUBSCRIBE(
										args.res.channelName,
										function( err, res )
										{
											if( err )
											{
												log.addError( "Error joining party channel: " + args.res.channelName + " - " + err );
												return;
											}
											
											_c.chatChannels.whisper.push( args.res.channelName );
											
											_c.sendToClient( JSON.stringify({
																				c: "tell",
																				r: 200,
																				characterName: args.res.characterName,
																				channelName: args.res.channelName
																			}) );
											
											// send the message to the realm
											process.send({
															cmd: args.res.cmd,
															id: args.id,
															data: {
																r: 200
															}
														});
										}
									);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	