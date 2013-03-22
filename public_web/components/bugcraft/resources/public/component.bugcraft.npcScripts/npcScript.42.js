	
	//
	// Challenger ( 32 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 42 ] = function( npcObject )
	{
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.pageQuestGiver( npcObject, pageContext );
		});
	}
	