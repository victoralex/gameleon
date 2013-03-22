	
	//
	// Fort Saltre Patrol ( 61 )
	// Level 35
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 61 ] = function( npcObject )
	{
		npcObject.events._add( "use", function()
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "guard_hi" );
		});
	}
	