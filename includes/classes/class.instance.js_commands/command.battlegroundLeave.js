	
	var log = require( "../class.log" ),
		realmConfig = require('../../config.realm').config;
	
	// this command is requested by the browser upon refresh. sending UTF responses is pointless as the carrier would have gone away
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		_c.command_disconnect_for_hearthstone(function()
		{
			
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	