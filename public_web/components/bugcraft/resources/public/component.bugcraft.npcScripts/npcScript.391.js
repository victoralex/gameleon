
	npcScript[ 391 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.Underwater({
													targetCharacter: npcObject
												});
		});
	}