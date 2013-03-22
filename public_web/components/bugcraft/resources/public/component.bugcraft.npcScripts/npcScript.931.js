
		
		npcScript[ 931 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.ShipDroneScary(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	