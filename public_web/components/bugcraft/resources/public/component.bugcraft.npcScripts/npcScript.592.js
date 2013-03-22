
	npcScript[ 592 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.wavesanimsound({
													targetCharacter: npcObject
												});
		});
	}