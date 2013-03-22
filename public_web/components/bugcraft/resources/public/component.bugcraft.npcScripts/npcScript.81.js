	
	//
	// Anterium Retainer ( 81 )
	// Level 40
	// Faction anterium
	// Assigned to Fortress Assault ( 9 )
	//
	
	npcScript[ 81 ] = function( npcObject )
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
	