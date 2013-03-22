
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
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
			typeof args.res.name == "undefined" ||
			/^[a-zA-Z]+$/.test( args.res.name ) == false
		)
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		if(
			typeof args.res.race == "undefined" ||
			/^ant|fireant|butterfly|ladybug|mantis|bee$/.test( args.res.race ) == false
		)
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		var raceClassAssociation = {
			ant: "scout",
			fireant: "soldier",
			butterfly: "noble",
			ladybug: "scout",
			mantis: "soldier",
			bee: "noble"
		}
		
		syncSQL.q(
					"call character_add(" + args.ws.sessionData.userID + ",'" + args.res.name.toLowerCase() + "','" + args.res.race + "','" + raceClassAssociation[ args.res.race ] + "')",
					function( res )
					{
						args.realm.redisClient.HSET(
															"stats.character." + res[0].character_id,
															"level_current",
															1,
															function( err, redisRes )
															{
																if( err )
																{
																	log.addError( "Character level stats set " + err );
																	
																	return;
																}
																
																args.ws.sendUTF( JSON.stringify({
																									c: args.res.c,
																									r: res[0].result
																								}) );
															}
														);
					}
				);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	