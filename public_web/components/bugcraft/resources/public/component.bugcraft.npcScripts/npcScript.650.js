
	npcScript[ 650 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.BlueWaveLoop({
													targetCharacter: npcObject
												});
		});
	}