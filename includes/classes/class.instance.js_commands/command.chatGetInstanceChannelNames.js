	
	var log = require( "../class.log" ),
		realmConfig = require('../../config.realm').config;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		_c.sendToClient( JSON.stringify({
											c: args.res.c,
											r: 200,
											chatChannelsInstanceNames: realmConfig.chat.instanceChannels
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	