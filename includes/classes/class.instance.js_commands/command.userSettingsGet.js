	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		args.sql.query(
					"select `user_setting_sound_volume_voice`, `user_setting_sound_volume_music`, `user_setting_sound_volume_effects`, `user_setting_sound_volume_ambiental` " + 
							" from `users` " + 
							" where `user_id` = " + args.res.__userID,
					function( err, result )
					{
						if( err )
						{
							_c.sendToClient( JSON.stringify({
																c: args.res.c,
																r: 301
															}) );
							
							return;
						}
						
						result.fetchAll( function(err, rows)
						{
							if( err )
							{
								_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	r: 302
																}) );
								
								return;
							}
							
							// perform command
							_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	s: rows[ 0 ],
																	r: 200
																}) );
						});
					}
				);
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	