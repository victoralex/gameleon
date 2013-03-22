	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		realmConfig = require('../../config.realm').config;
	
	// this command is requested by the browser upon refresh. sending UTF responses is pointless as the carrier would have gone away
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		_c.getInstance().getArgs().instanceProcess.messageToRealm(
																									{
																										cmd: "queueLeaveAllButCurrentInstance",
																										uid: args.res.__userID,
																										cid: args.res.__characterID
																									},
																									function( result )
																									{
																										_c.startDisconnectCountdown();
																										
																										_c.sendToClient( JSON.stringify({
																																					c: args.res.c,
																																					t: realmConfig.realmCharacterDisconnectTimeout,
																																					r: 200
																																				}) );
																										
																										// update stats here because the player is considered to be not available at this moment
																										stats.incrementNoCallback({
																																				characterObject: _c,
																																				name: "lifetime_seconds_played",
																																				value: Math.round( ( ( new Date() ).getTime() - _c.joinDate.getTime() ) / 1000 )
																																			});
																									}
																								);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	