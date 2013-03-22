
		
		npcScript[ 679 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.AphidZonedroned(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	