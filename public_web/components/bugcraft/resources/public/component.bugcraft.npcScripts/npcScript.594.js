
	npcScript[ 594 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.wave5secs({
													targetCharacter: npcObject
												});
		});
	}