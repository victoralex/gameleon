
	npcScript[ 615 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.star1({
													targetCharacter: npcObject
												});
		});
	}