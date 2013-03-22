	
	//
	// Gatekeeper Togh ( 43 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 43 ] = function( npcObject )
	{
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "guard_hi" );
			
			Component.bugcraft.pageQuestGiver( npcObject, pageContext );
		});
	}
	