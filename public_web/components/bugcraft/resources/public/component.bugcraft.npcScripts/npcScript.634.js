
	npcScript[ 634 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.LargeWaveLoop({
													targetCharacter: npcObject
												});
		});
	}