	
	var log = require( "../class.log" ),
		chatChannel = require('../class.chatChannel');
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject,
			_cn = args.res.parameters.channelName.toLowerCase(),
			message = "";
		
		if( "message" in args.res.parameters )
		{
			message = args.res.parameters.message;
		}
		
		if( ( _cn == "say" || _cn == "yell" ) && message.length > 0 )
		{
			var _oldChatChannel = _c.currentChatChannel;
			
			_c.currentChatChannel = chatChannel.makeChatChannelName({
																					characterObject: _c,
																					channelType: _cn
																				});
			
			// broadcast only if there is a message to send
			
			chatChannel.sendMessageSpecial({
											channelType: _cn,
											message: message,
											characterObject: _c,
											instanceProcess: args.instanceProcess,
											instanceObject: args.instanceObject
										});
			
			if( _cn == "yell" )
			{
				// can't stay on "yell" for more than one message at a time
				
				_c.currentChatChannel = _oldChatChannel;
			}
			
			return;
		}
		
		// ready to change channel
		
		var _ct = args.res.parameters.channelType;
		
		var fullChannelName = chatChannel.makeChatChannelName({
																characterObject: _c,
																channelName: _cn,
																channelType: _ct
															});
		
		//check if character is already registered to requested channel, and send message
		if( _c.chatChannels[ _ct ].indexOf( fullChannelName ) >= 0 )
		{
			_c.currentChatChannel = fullChannelName;
			
			if( message.length > 0 )
			{
				chatChannel.sendMessageSpecial({
											channelType: "say",
											message: message,
											characterObject: _c,
											instanceProcess: args.instanceProcess,
											instanceObject: args.instanceObject
										});
			}
			
			return;
		}
		
		//channel type was bad or character was not on channel
		_c.sendToClient( JSON.stringify({
											c: "changeChannel",
											channelName: _cn,
											r: 300
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	