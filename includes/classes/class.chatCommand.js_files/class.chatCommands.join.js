	
	var log = require( "../class.log" ),
		chatChannel = require('../class.chatChannel'),
		realmConfig = require('../../config.realm').config;
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject, 
			_cn = args.res.parameters.channelName.toLowerCase();
		
		if( _cn == "say" || _cn == "yell" )
		{
			// cannot join say or yell. change current chat channel to the existing channel
			
			_c.currentChatChannel = chatChannel.makeChatChannelName({
																		characterObject: _c,
																		channelType: _cn
																	});
				
			_c.sendToClient( JSON.stringify({
												c: "joinChannel",			//to do
												channelName: _cn,
												r: 201
											}) );
										
			return;
		}
		
		// ready to join channel
		var _ct = args.res.parameters.channelType;
		
		var fullChannelName = chatChannel.makeChatChannelName({
																characterObject: _c,
																channelName: _cn,
																channelType: _ct
															});
		
		//check if character is already on a channel with that name
		if( _c.chatChannels[_ct].indexOf( fullChannelName ) >= 0 )
		{
			_c.currentChatChannel = fullChannelName;
			
			_c.sendToClient( JSON.stringify({
												c: "joinChannel",
												channelName: _cn,
												r: 201
											}) );
											
			return;
		}
		
		//join instance channel
		if( _ct == "instance" )
		{
			chatChannel.joinInstanceChannel({
												characterObject: _c,
												channelName: _cn
											});
											
			return;
		}
		
		//join global channel
		if( _ct == "global" )
		{
			chatChannel.joinGlobalChannel({
											characterObject: _c,
											channelName: _cn
										});
			
			return;
		}
		
		//channel type was bad
		_c.sendToClient( JSON.stringify({
											c: "joinChannel",
											channelName: _cn,
											r: 300
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	