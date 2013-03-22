	
	//
	// Wave Generator ( 116 )
	// Level 1
	// Faction null
	// Assigned to Shay's Playground ( 10 )
	//
	
	npcScript[ 116 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.waterWaves2({
													targetCharacter: npcObject
												});
		});
	}
	