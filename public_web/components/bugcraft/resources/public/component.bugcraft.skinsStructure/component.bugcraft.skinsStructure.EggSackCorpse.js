
		
		Component.bugcraft.skinsStructure.defs[ 'EggSackCorpse' ] =
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
				
		
		new spellEffects.EggDie({
															targetCharacter: characterObject
														});
		
	
			},
			
		
					
					hide: function( characterObject )
					{
						
								characterObject.removeVisualEffect( spellEffects.EggDie );
							
					}
					
				
			}
		}
		
	