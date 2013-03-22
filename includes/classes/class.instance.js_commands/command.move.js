	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var characterObject = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.x == "undefined" ||
			typeof args.res.y == "undefined" ||
			typeof args.res.r == "undefined" ||
			/^\-?[0-9]+$/.test( args.res.r ) == false ||
			/^[0-9]+$/.test( args.res.x ) == false ||
			/^[0-9]+$/.test( args.res.y ) == false
		)
		{
			characterObject.sendToClient( JSON.stringify({
																		c: args.res.c,
																		r: 301
																	}) );
			
			return;
		}
		
		// perform command
		characterObject.command_move({
												r: args.res.r,
												x: args.res.x,
												y: args.res.y,
												after: function()
												{
												
												}
											});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	