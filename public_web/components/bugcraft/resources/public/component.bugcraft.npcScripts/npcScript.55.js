	
	//
	// Jozsef, Savant ( 55 )
	// Level 15
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 55 ] = function( npcObject )
	{
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusiveOtherRace( npcObject, "mantis", "trainer_hi" );
		});
	}
	