	
	//
	// Souldd ( 33 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 33 ] = function( npcObject )
	{
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "vendor_hi" );
		});
		
		npcObject.events._add( "show", function( pageContext )
		{
			
		});
		
		npcObject.events._add( "hide", function( pageContext )
		{
			
		});
	}
	