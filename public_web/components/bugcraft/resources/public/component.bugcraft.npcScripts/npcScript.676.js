
		
		npcScript[ 676 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.AphidLowZoneDrone(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	