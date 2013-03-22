	
	//
	// Rejuvenating oil
	//
	
	var log = require( "../class.log" ),
		achievementsLibrary = require( "../class.achievementsLibrary" );
	
	exports.script = function( buffObject )
	{
		this.specific = function()
		{
			var _s = buffObject.getSource();
			
			achievementsLibrary.achievementConditionUpdate({
													characterObject: _s,
													value: 1,
													achievementId: 1,
													parameterName: "a1barellRolls"
												});
			
			/*
			buffObject.getSource().die({
											killerCharacterObject: buffObject.getSource(),
											killerBuffObject: buffObject
										});
			*/
		}
	}