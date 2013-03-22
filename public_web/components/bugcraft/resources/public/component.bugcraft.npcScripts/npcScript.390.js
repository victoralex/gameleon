
	npcScript[ 390 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.RiverWaves({
													targetCharacter: npcObject
												});
		});
	}