
		
		npcScript[ 414 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.LargeWaveLoop(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	