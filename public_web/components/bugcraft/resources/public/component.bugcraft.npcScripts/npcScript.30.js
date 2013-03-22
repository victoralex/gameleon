	
	//
	// Swarm Warlord Gengkis ( 30 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 30 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.ambientRadialSounds({
														targetCharacter: npcObject,
														streams:
														{
															20000: [ 'church1' ]
														}
													});
		});
		
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( npcObject, "trainer_hi" );
			
			Component.bugcraft.pageQuestGiver( npcObject, pageContext );
		});
	}
	