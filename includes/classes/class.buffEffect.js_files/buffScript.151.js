	
	//
	// Precognition
	//
	
	var log = require( "../class.log" );
	
	exports.script = function( buffObject )
	{
		buffObject.events._add( "appliedEffectEnd", function()
		{
			buffObject.getSource().setSpellReflectDisabled();
		});
		
		this.specific = function()
		{
			buffObject.getSource().setSpellReflectEnabled();
		}
	}