
		
		npcScript[ 947 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "use", function()
			{
				
		
				new spellEffects.chestOpennoLoopSoundL(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.BoxWavesRadiant(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	