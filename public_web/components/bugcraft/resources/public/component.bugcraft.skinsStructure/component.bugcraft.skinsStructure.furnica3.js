
		
		Component.bugcraft.skinsStructure.defs[ 'furnica3' ] =
		{
			frames:
			{
				walk: 0,
		
	idle: 1,
		
	attackMelee: 0,
		
	
			},
			
			events:
			{
				use: function( characterObject )
			{
				
		
		new spellEffects.RiverFlow({
															targetCharacter: characterObject
														});
		
	
			},
			
		show: function( characterObject )
			{
				
		
		new spellEffects.RiverWaves({
															targetCharacter: characterObject
														});
		
	
			},
			
		
					
					hide: function( characterObject )
					{
						
								characterObject.removeVisualEffect( spellEffects.RiverFlow );
							
								characterObject.removeVisualEffect( spellEffects.RiverWaves );
							
		
		new spellEffects.OceanWaves({
															targetCharacter: characterObject
														});
		
	
					}
					
				
			}
		}
		
	