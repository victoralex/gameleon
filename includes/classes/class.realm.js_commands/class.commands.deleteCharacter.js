
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p,
		character = require('../class.character');
	
	exports.performCommand = function( args )
	{
		if( 
			typeof args.ws.sessionData.userID == "undefined"
		)
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		if(
			typeof args.res.characterID == "undefined" ||
			/^[0-9]+$/.test( args.res.characterID ) == false
		)
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		syncSQL.q(
					"call character_delete(" + args.ws.sessionData.userID + "," + args.res.characterID + ")",
					function( res )
					{
						if( res[0].result != 200 )
						{
							args.ws.sendUTF( JSON.stringify({
																c: args.res.c,
																r: 302
															}) );
							
							return;
						}
						
						args.ws.sendUTF( JSON.stringify({
															c: args.res.c,
															cid: args.res.characterID,
															r: 200
														}) );
					}
				);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	