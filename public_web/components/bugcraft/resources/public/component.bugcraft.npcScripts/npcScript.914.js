
		
		npcScript[ 914 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.PowerStation(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	