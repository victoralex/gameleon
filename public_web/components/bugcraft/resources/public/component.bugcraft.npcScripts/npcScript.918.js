
		
		npcScript[ 918 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.Flicker(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	