
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p,
		queue = require('../class.queue'),
		character = require('../class.character');
	
	exports.performCommand = function( args )
	{
		var _iPO = args.instanceProcess;
														
														_iPO.messageToRealm(
																				{
																					cmd: "queueCreateInstance",
																					bid: args.res.bid,
																					uid: args.res.__userID,
																					cid: args.res.__characterID
																				},
																				function( result )
																				{
																					_iPO.messageToRealm(
																											{
																												cmd: "queueAddForced",
																												zID: result.iID,
																												uid: args.res.__userID,
																												cid: args.res.__characterID
																											},
																											function( result )
																											{
																												log.add( "Teleport instance result: " + result.r );
																											}
																										);
																				});		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	