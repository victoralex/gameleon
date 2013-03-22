	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.v == "undefined" ||
			typeof args.res.m == "undefined" ||
			typeof args.res.e == "undefined" ||
			typeof args.res.a == "undefined" ||
			/^[0-9]+$/.test( args.res.v ) == false ||
			/^[0-9]+$/.test( args.res.m ) == false ||
			/^[0-9]+$/.test( args.res.e ) == false ||
			/^[0-9]+$/.test( args.res.a ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		syncSQL.q(
				"call user_settings_set( " + args.res.__userID + ", " + args.res.v + ", " + args.res.m + ", " + args.res.e + ", " + args.res.a + " )",
				function( res )
				{
					_c.sendToClient( JSON.stringify({
														c: args.res.c,
														r: 200
													}) );
				}
			);
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	