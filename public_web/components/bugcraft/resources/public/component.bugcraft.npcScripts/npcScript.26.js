	
	//
	// Legionnaire Tyr ( 26 )
	// Level 30
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 26 ] = function( npcObject )
	{
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "trainer_hi" );
			
			Component.bugcraft.pageQuestGiver( npcObject, pageContext );
		});
	}
	