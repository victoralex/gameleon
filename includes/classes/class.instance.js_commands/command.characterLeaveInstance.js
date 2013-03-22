	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		realmConfig = require('../../config.realm').config;
	
	// this command is requested by the browser upon refresh. sending UTF responses is pointless as the carrier would have gone away
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.cid ];
		
		_c.command_disconnect_silent(function()
		{
			process.send({
							cmd: args.res.cmd,
							id: args.id,
							data: {
								r: 200
							}
						});
			
			// update stats
			stats.incrementNoCallbackCustomRedisConnection({
																characterObject: _c,
																redisClient: args.instanceObject.redisClient,
																name: "lifetime_seconds_played",
																value: Math.round( ( ( new Date() ).getTime() - _c.joinDate.getTime() ) / 1000 )
															});
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	