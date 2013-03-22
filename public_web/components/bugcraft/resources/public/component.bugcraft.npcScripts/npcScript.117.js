	
	//
	// wave generator2 ( 117 )
	// Level 1
	// Faction null
	// Assigned to Shay's Playground ( 10 )
	//
	
	npcScript[ 117 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.waterWaves({
													targetCharacter: npcObject
												});
		});
	}
	