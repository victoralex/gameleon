
	var log = require( "../class.log" );
	
	
	exports.performCommand = function( args )
	{
		var _co = args.ws.characterObject;
		
		if( !_co )
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		var _modValue = function( param )
		{
			args.realm.redisClient.INCRBY(
											"character_" + _co.properties.character_id + "_" + param,
											args.res.value,
											function(err, res)
											{
												if( err )
												{
													log.addError(err);
													
													return;
												}
												
												args.realm.redisClient.publish( param, _co.properties.character_id + "_" + res);
											}
										);
		}
		
		for( var i = 0; i < args.res.params.length; i++ )
		{
			if( _co.activeQuests.indexOf( args.res.params[i].split('_', 2)[1] ) < 0 )
			{
				continue;
			}
			
			_modValue( args.res.params[i] );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	