	
	//
	// Celh ( 36 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 36 ] = function( npcObject )
	{
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "vendor_hi" );
		});
	}
	