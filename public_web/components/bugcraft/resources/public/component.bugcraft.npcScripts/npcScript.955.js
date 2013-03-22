
		
		npcScript[ 955 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.RummageMetal(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	