
		
		npcScript[ 383 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "use", function()
			{
				
		
				new spellEffects.RummageJunk(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	