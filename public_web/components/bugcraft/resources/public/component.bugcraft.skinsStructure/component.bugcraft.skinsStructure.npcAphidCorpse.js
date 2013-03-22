
		
		Component.bugcraft.skinsStructure.defs[ 'npcAphidCorpse' ] =
		{
			frames:
			{
				walk: 0,
		
	idle: 1,
		
	attackMelee: 0,
		
	
			},
			
			events:
			{
				show: function( characterObject )
			{
				
		
		new spellEffects.AphidDeath({
															targetCharacter: characterObject
														});
		
	
			},
			
		
					
					hide: function( characterObject )
					{
						
								characterObject.removeVisualEffect( spellEffects.AphidDeath );
							
					}
					
				
			}
		}
		
	