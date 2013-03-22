
	npcScript[ 299 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.wavesanimsound({
													targetCharacter: npcObject
												});
		});
	}