
	npcScript[ 616 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.q3({
													targetCharacter: npcObject
												});
		});
	}