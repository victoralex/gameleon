	
	exports.performCommand = function( args )
	{
		args.ws.sendUTF( JSON.stringify({
											c: args.res.c,
											rt: args.res.t,
											st: ( new Date() ).getTime(),
											r: 200
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	