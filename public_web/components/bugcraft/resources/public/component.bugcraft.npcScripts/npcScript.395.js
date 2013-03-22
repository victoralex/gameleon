
		
		npcScript[ 395 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.JungleAmbient1min(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	