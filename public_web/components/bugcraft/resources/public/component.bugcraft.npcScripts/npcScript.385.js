
	npcScript[ 385 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.watertrickle1({
													targetCharacter: npcObject
												});
		});
	}