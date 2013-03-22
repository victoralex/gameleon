
	var log = require( "../class.log" );
	
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
		
		// get the characters
		
		args.realm.sql.query(
				"select c.`character_id`, c.`character_name`, c.`character_race`, c.`character_class`, c.`character_faction`, c.`character_level`, c.`character_happiness`, c.`character_attack`, c.`character_defense`, c.`character_armor`, c.`character_resistance`, c.`character_potency`, c.`character_strength`, " +
							" if( c.`character_id_zone` is null, zp1.`zp_name`, zp2.`zp_name` ) as character_zone " +
						" from `characters` c " + 
							" inner join `zones_pool` zp1 on c.`character_id_hearthstone_zone` = zp1.`zp_id` " +
							" left join `zones` on c.`character_id_zone` = `zones`.`zone_id` " +
							" left join `zones_pool` zp2 on `zones`.`zone_id_zone_pool` = zp2.`zp_id` " +
						" where `character_id_user` = " + args.ws.sessionData.userID +
						" order by `character_date_create` desc",
				function( err, res )
				{
					if( err )
					{
						log.addError( "Characters query error: " + err );
						
						return;
					}
					
					res.fetchAll( function (err, rows)
					{
						if( err )
						{
							log.addError( "Characters fetch error: " + err );
							
							return;
						}
						
						args.ws.sendUTF( JSON.stringify({
															c: args.res.c,
															r: 200,
															characters: rows
														}) );
						
						res.freeSync();
					});
					
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	