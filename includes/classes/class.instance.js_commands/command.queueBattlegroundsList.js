	
	var log = require( "../class.log" ),
			realmConfig = require( "../../config.realm" ).config;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		args.sql.query(
				"select `zp_id`, `zp_name`, `zp_description`, " + ( _c.getStandardGloryRewardAmount() * 3 ) + " as `zp_reward_win_xp`, " + _c.getStandardGloryRewardAmount() + " as `zp_reward_loss_xp`, " + ( _c.getStandardPolenRewardAmount() * 10 ) + " as `zp_reward_win_polen`, " + ( _c.getStandardPolenRewardAmount() * 3 ) + " as `zp_reward_loss_polen` from `zones_pool` " +
					" where ( `zp_type` + 0 ) = 4 and instr( `zp_faction_allowed`, '" + _c.properties.character_faction + "' ) != 0 and ( `zp_faction_allowed` + 0 ) >= 3 " +
					" order by `zp_name` asc",
				function( err, queryResult )
				{
					if( err )
					{
						log.addError( "zone pools query error: " + err );
						
						return;
					}
					
					queryResult.fetchAll( function( err, rows )
					{
						if( err )
						{
							log.addError( "zones pool fetch error: " + err );
							
							return;
						}
						
						rows.unshift({
										zp_id: 0,
										zp_name: realmConfig.realmInstanceEnqueueRandom.name,
										zp_description: realmConfig.realmInstanceEnqueueRandom.description,
										zp_reward_win_xp: _c.getStandardGloryRewardAmount() * 3,
										zp_reward_loss_xp: _c.getStandardGloryRewardAmount(),
										zp_reward_win_polen: _c.getStandardPolenRewardAmount() * 10,
										zp_reward_loss_polen: _c.getStandardPolenRewardAmount() * 3
									});
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															b: rows,
															r: 200
														}) );
					});
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	