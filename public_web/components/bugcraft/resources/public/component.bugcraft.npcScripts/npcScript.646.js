
	npcScript[ 646 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.RiverLong({
													targetCharacter: npcObject
												});
		});
	}