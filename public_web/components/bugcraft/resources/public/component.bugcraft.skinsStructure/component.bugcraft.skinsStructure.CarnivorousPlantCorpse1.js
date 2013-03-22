	
	Component.bugcraft.skinsStructure.defs[ 'CarnivorousPlantCorpse1' ] =
	{
		frames:
		{
			idle: 1,
			
			walk: 0,
			
			attackMelee: 0
		},
		events:
		{
			show: function( characterObject )
			{
				new spellEffects.VEGEDEATH({
														targetCharacter: characterObject
													});
			},
			hide: function( characterObject )
			{
				characterObject.removeVisualEffect( spellEffects.VEGEDEATH );
			}
		}
	}