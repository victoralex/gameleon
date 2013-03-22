	
	//
	// Bloodlust
	//
	
	var log = require( "../class.log" ),
		quest = require( "../class.quest" ),
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
			var _c = buffObject.getSource().getInstance();
			
			_c.surfaceSetValueUsingPoly({
												polyName: "sp0",
												cellValue: 1,
												after: function( modifiedSurfaceData )
												{
													_c.broadcastMessage( JSON.stringify({
																							c: "mapUpdate",
																							sd: modifiedSurfaceData
																						}) );
												}
											});
			*/
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	