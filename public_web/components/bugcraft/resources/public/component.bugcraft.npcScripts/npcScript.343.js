
		
		npcScript[ 343 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "use", function()
			{
				
		
				new spellEffects.AmpTransmit2(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	