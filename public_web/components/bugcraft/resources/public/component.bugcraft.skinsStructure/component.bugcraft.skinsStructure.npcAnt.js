	
	Component.bugcraft.skinsStructure.defs[ 'npcAnt' ] =
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
				new spellEffects.LongMellowWaves2min({
														targetCharacter: characterObject
													});
			},
			hide: function( characterObject )
			{
				characterObject.removeVisualEffect( spellEffects.LongMellowWaves2min );
			}
		}
	}