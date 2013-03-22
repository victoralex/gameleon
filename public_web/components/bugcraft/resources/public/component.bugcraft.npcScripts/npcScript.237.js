
	npcScript[ 237 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.junglecreatures({
													targetCharacter: npcObject
												});
		});
	}