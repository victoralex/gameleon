	
	npcScript[ 90 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.bombardierBeetleDeath({
													sourceCharacter: npcObject,
													targetCharacter: npcObject,
													rotation: npcObject.characterData.character_rotation
												});
		});
		
		npcObject.events._add( "hide", function()
		{
			npcObject.removeVisualEffect( spellEffects.bombardierBeetleDeath );
		});
	}
	