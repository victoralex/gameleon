	
	Component.bugcraft.skinsStructure.defs[ 'Curiosity' ] =
	{
		frames:
		{
			idle: 1,
			
			walk: 1,
			
			attackMelee: 1
		},
		events:
		{
			show: function( characterObject )
			{
				new spellEffects.Droid({
														targetCharacter: characterObject
													});
			},
			hide: function( characterObject )
			{
				characterObject.removeVisualEffect( spellEffects.Droid );
			}
		}
	}