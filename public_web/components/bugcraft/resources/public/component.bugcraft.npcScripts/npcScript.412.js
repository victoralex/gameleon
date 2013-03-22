
	npcScript[ 412 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.junglerainlong({
													targetCharacter: npcObject
												});
		});
	}