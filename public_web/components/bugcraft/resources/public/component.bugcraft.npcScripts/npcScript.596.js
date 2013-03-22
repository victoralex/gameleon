
	npcScript[ 596 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.LongMellowWaves2min({
													targetCharacter: npcObject
												});
		});
	}