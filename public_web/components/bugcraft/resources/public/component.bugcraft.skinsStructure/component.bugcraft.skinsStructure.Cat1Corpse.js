
		
		Component.bugcraft.skinsStructure.defs[ 'Cat1Corpse' ] =
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
				
		
		new spellEffects.RummageJunk({
															targetCharacter: characterObject
														});
		
	
			},
			
		
					
					hide: function( characterObject )
					{
						
								characterObject.removeVisualEffect( spellEffects.RummageJunk );
							
					}
					
				
			}
		}
		
	