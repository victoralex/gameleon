
		
		npcScript[ 675 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.AphidLowZoneDrone(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	