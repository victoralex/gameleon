	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		realmConfig = require('../../config.realm').config;
	
	// this command is requested by the browser upon refresh. sending UTF responses is pointless as the carrier would have gone away
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		_c.joinDate = new Date();
		
		_c.stopDisconnectCountdown();
		
		_c.sendToClient( JSON.stringify({
													c: args.res.c,
													r: 200
												}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	