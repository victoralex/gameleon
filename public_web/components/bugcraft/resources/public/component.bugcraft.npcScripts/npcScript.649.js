
	npcScript[ 649 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.BlueWaveLoop({
													targetCharacter: npcObject
												});
		});
	}