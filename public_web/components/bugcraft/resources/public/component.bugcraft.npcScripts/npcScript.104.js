	
	//
	// Destroyed Tower ( 104 )
	// Level 1
	// Faction hegemony
	// Assigned to Jungle Camps ( 7 )
	//
	
	npcScript[ 104 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.towerExplosion({
													targetCharacter: npcObject
												});
		});
	}
	