
		
		npcScript[ 709 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.EggPulse(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	