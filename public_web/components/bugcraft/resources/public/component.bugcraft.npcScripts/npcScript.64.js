	
	//
	//  ( 64 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 64 ] = function( npcObject )
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
	