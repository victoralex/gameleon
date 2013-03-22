	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		_c.sendToClient( JSON.stringify({
											c: args.res.c,
											rt: args.res.t,
											st: ( new Date() ).getTime(),
											r: 200
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	