
	var log = require( "../class.log" ),
		achievementsLibrary = require( "../class.achievementsLibrary" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		achievementsLibrary.getAchievementsProgress(
													{
														characterObject: _c
													},
													function( achievementsProgress )
													{
														_c.sendToClient( JSON.stringify({
																							c: args.res.c,
																							ap: achievementsProgress
																						}) );
													}
												);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	