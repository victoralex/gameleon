	
	//
	// wave generator3 ( 118 )
	// Level 1
	// Faction null
	// Assigned to Shay's Playground ( 10 )
	//
	
	npcScript[ 118 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.waterWaves({
													targetCharacter: npcObject
												});
		});
		
		npcObject.events._add( "use", function()
		{
			new spellEffects.waterWaves({
													targetCharacter: npcObject
												});
		});
	}
	