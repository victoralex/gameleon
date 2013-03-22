
	var log = require( "../class.log" ),
			realmConfig = require( "../../config.realm" ).config,
			chatChannel = require( "../class.chatChannel" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if( _c.availableAmountOfMessagesToSend <= 0 )
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		_c.availableAmountOfMessagesToSend--;
		
		// increase the number of messages that should be sent when the timeout comes
		setTimeout( function()
		{
			_c.availableAmountOfMessagesToSend++;
		}, realmConfig.chat.limitMessagesInterval );
		
		if( _c.currentChatChannel == null )
		{
			// no current chat channel
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 304
											}) );
			
			return;
		}
		
		//
		// Check the input vars
		//
		
		if(
			typeof args.res.message == "undefined"
			|| args.res.message.replace( / /g, '' ).length <= 0
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		var _channelType = _c.currentChatChannel.split( "." ).pop(); // last part of current chat channel may be "say" or "yell"
		
		if( _channelType == "say" || _channelType == "yell" )
		{
			if( _c.properties.character_is_alive == null )
			{
				// can't talk while dead
				
				_c.sendToClient( JSON.stringify({
													c: args.res.c,
													r: 303
												}) );
				
				return;
			}
			
			// all ok. perform action
			
			chatChannel.sendMessageSpecial({
										channelType: _channelType,
										message: args.res.message,
										characterObject: _c,
										instanceObject: args.instanceObject
									});
		
			return;
		}
		
		// standard message
		
		chatChannel.sendMessage({
									message: args.res.message,
									characterObject: _c,
									instanceObject: args.instanceObject
								});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	