
		
		npcScript[ 787 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.WaterTrickle(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	