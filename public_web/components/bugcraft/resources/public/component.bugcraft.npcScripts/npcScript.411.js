
	npcScript[ 411 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.Rainforestoneminute({
													targetCharacter: npcObject
												});
		});
	}