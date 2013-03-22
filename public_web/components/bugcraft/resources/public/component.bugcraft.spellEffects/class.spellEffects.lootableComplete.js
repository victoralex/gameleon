
	spellEffects.lootableComplete = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var effect0 = new spellEffects.lootableAura({ 			
													sourceCharacter: args.sourceCharacter,
													targetCharacter: args.targetCharacter,
												});
		
		
		var effect1 = new spellEffects.lootableTransition({
													sourceCharacter: args.sourceCharacter,
													targetCharacter: args.targetCharacter,
												});
			
		this.remove = function()
		{
			effect0.remove();
			
			effect1.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}