	
	Component.bugcraft.skinsStructure.defs[ 'CoccoonCorpse' ] =
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
				new spellEffects.adiexplodecocoon({
														targetCharacter: characterObject
													});
			},
			hide: function( characterObject )
			{
				characterObject.removeVisualEffect( spellEffects.adiexplodecocoon );
			}
		}
	}