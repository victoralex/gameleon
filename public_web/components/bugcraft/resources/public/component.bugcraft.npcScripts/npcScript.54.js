	
	//
	// Bailiff Fasun ( 54 )
	// Level 30
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 54 ] = function( npcObject )
	{
		npcObject.events._add( "use", function()
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "trainer_hi" );
		});
	}
	