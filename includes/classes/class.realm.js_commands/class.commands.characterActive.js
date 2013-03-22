	
	var log = require( "../class.log" ),
		queue = require( "../class.queue" );
	
	exports.performCommand = function( args )
	{
		var _sd = args.ws.sessionData;
		
		if(
			typeof _sd.userID == "undefined"
			|| typeof _sd.characterID == "undefined"
		)
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		var _nio = args.ws.nextInstanceObject;
		
		if( _nio )
		{
			// character has to be connected to another instance
			
			_nio.runCommand(
								{
									c: "addCharacter",
									user_id: _sd.userID,
									character_id: _sd.characterID
								},
								function( response )
								{
									args.ws.sessionData.characterName = response.cn;
									args.ws.instanceObject = _nio;
									
									delete args.ws.nextInstanceObject;
								}
							);
		}
		else
		{
			// create the queue list
			args.realm._characterQueues[ _sd.characterID ] = {};
			
			// go to the hearthstone or resume the activity in the current instance
			queue.joinPreviousInstance({
									character_id: _sd.characterID,
									realm: args.realm,
									afterStart: function( resultArray )
									{
										var _iO = resultArray.instanceProcessObject;
										
										// create and bind character
										_iO.runCommand(
															{
																c: "addCharacter",
																user_id: _sd.userID,
																character_id: _sd.characterID
															},
															function( response )
															{
																args.ws.sessionData.characterName = response.cn;
																args.ws.instanceObject = _iO;
															}
														);
									}
								});
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	