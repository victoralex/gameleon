	
	var log = require( "../class.log" ),
		chatChannel = require('../class.chatChannel'),
		realmConfig = require('../../config.realm').config;
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject, 
			_cn = args.res.parameters.channelName.toLowerCase();
		
		if( _cn == "say" || _cn == "yell" )
		{
			// cannot leave the "say" or "yell' channels
			
			_c.sendToClient( JSON.stringify({
												c: "leaveChannel",
												channelName: _cn,
												r: 201
											}) );
										
			return;
		}
		
		// ready to leave channel
		
		var _ct = args.res.parameters.channelType;
		
		var fullChannelName = chatChannel.makeChatChannelName({
																characterObject: _c,
																channelName: _cn,
																channelType: _ct
															});
		
		//character not on channel
		if( _c.chatChannels[_ct].indexOf( fullChannelName ) < 0 )
		{
			_c.sendToClient( JSON.stringify({
												c: "leaveChannel",
												channelName: _cn,
												r: 404
											}) );
											
			return;
		}
		
		//leave instance channel
		if( _ct == "instance" )
		{
			chatChannel.leaveInstanceChannel({
												characterObject: _c,
												channelName: _cn
											});
											
			return;
		}
		
		//leave global channel
		if( _ct == "global" )
		{
			chatChannel.leaveGlobalChannel({
											characterObject: _c,
											channelName: _cn
										});
			
			return;
		}
		
		//channel type was bad
		_c.sendToClient( JSON.stringify({
											c: "leaveChannel",
											channelName: _cn,
											r: 300
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	