	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.lootID == "undefined" ||
			/^[0-9]+$/.test( args.res.lootID ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		// get inventory information
		args.sql.query(
						"select `loot`.* from `loot` where `loot_id` = " + args.res.lootID,
						function( err, result )
						{
							if( err )
							{
								_c.sendToClient( JSON.stringify({
																		c: args.res.c,
																		r: 301
																	}) );
								
								log.addError( "Error running loot information query " + err );
								
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
									
									log.addError( "Error getting loot rows: " + err );
									
									return;
								}
								
								if( rows.length != 1 )
								{
									// no returned result. maybe invalid buff_id.
									
									_c.sendToClient( JSON.stringify({
																			c: args.res.c,
																			r: 303
																		}) );
									
									log.addError( "Too many or no loot rows returned for buff_id " + args.res.lootID );
									
									return;
								}
								
								_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	d: rows[ 0 ],
																	r: 200
																}) );
								
								// update stats
								stats.incrementNoCallback({
																characterObject: _c,
																name: "lifetime_tooltips_loot_requested",
																value: 1
															});
							});
						}
					);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	