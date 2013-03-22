	
	//
	// Dewde ( 62 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 62 ] = function( npcObject )
	{
		npcObject.events._add( "use", function()
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "funny" );
		});
	}
	