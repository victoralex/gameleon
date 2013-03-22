	
	Component.bugcraft.skinsStructure.defs[ 'CoccoonCorpse1' ] =
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
				new spellEffects.CorpseCocSound({
														targetCharacter: characterObject
													});
			},
			hide: function( characterObject )
			{
				characterObject.removeVisualEffect( spellEffects.CorpseCocSound );
			}
		}
	}