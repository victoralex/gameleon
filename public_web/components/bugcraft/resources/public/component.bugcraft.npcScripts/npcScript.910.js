
		
		npcScript[ 910 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.ShipDroneNormal(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	