	
	//
	// Hegemony Fray Retainer ( 77 )
	// Level 40
	// Faction hegemony
	// Assigned to Alchemist's Fray ( 4 )
	//
	
	npcScript[ 77 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.auraRevive({
												targetCharacter: npcObject
											});
			
			new spellEffects.ambientRadialSounds({
														targetCharacter: npcObject,
														streams:
														{
															1000: [ 'deathWhispers1' ]
														}
													});
		});
		
		npcObject.events._add( "hide", function()
		{
			npcObject.removeVisualEffect( spellEffects.auraRevive );
		});
	}
	