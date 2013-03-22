
		
		npcScript[ 928 ] = function( npcObject )
		{
			
		
			npcObject.events._add( "use", function()
			{
				
		
				new spellEffects.TeleportUsed(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		
			npcObject.events._add( "show", function()
			{
				
		
				new spellEffects.TeleportUsed(	{
									targetCharacter: npcObject
								});
		
	
			});
		
	
		}
		
	