
	npcScript[ 614 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.exclam1({
													targetCharacter: npcObject
												});
		});
	}