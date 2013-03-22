
	npcScript[ 407 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			new spellEffects.FlagFlap({
													targetCharacter: npcObject
												});
		});
	}