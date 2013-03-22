
		
		npcScript[ 678 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.AphidAngry(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	