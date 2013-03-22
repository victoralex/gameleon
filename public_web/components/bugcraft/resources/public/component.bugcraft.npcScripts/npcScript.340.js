
	npcScript[ 340 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.LongCreak({
													targetCharacter: npcObject
												});
		});
	}