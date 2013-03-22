	
	npcScript[ 5 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.deathDecayComplete({
													sourceCharacter: npcObject,
													targetCharacter: npcObject
												});
			
			/*
			new spellEffects.lootableComplete({
													sourceCharacter: npcObject,
													targetCharacter: npcObject
												});
			*/
		});
		
		npcObject.events._add( "hide", function()
		{
			npcObject.removeVisualEffect( spellEffects.lootableComplete );
			npcObject.removeVisualEffect( spellEffects.deathDecayComplete );
		});
	}
	