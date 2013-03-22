
		
		npcScript[ 953 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "use", function()
			{
				
		
				new spellEffects.RummageMetal(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	