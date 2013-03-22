
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var characterObject = args.instanceObject.characters[ args.res.__characterID ];
		
		characterObject.sendToClient( JSON.stringify({
																c: args.res.c,
																r: 200,
																skin: ( ( args.instanceObject[ 'interface' ] ) ? args.instanceObject[ 'interface' ] : null )
															}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	