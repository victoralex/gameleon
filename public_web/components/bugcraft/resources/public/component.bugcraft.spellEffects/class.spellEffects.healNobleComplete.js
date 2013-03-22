
	spellEffects.healNobleComplete = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var effect0 = new spellEffects.healNoble({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 0
		});
		var effect2 = new spellEffects.healNoble({ 																						
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter,
				component: 2
		});

		this.remove = function()
		{
			effect0.remove();
			effect2.remove();
		}
	}