
	npcScript[ 424 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.q4({
													targetCharacter: npcObject
												});
		});
	}