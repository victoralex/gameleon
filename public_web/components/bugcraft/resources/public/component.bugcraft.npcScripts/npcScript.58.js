	
	//
	// Fort Saltre Guard ( 58 )
	// Level 35
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 58 ] = function( npcObject )
	{
		npcObject.events._add( "use", function()
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "guard_hi" );
		});
	}
	