	
	//
	// Caution
	//
	
	var log = require( "../class.log" );
	
	exports.script = function( buffObject )
	{
		this.specific = function()
		{
			buffObject.getSource().die({
											killerCharacterObject: buffObject.getSource(),
											killerBuffObject: buffObject
										});
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	