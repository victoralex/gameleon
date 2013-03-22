	
	//
	// Flag Capture Bonus AoE
	//
	
	var log = require( "../class.log" );
	
	exports.script = function( buffObject )
	{
		this.specific = function()
		{
			var _c = buffObject.getCharacter();
			
			_c.modGlory(
						_c.getStandardGloryRewardAmount() * 2,
						function()
						{
							
						}
					);
		}
	}