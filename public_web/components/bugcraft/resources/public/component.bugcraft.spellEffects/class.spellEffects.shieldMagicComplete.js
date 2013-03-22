
	spellEffects.shieldMagicComplete = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var effect0 = new spellEffects.shieldMagic({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 0
		});
		
		var effect1 = new spellEffects.shieldMagic({ 																						
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter,
				component: 1
		});
		
		var effect3 = new spellEffects.shieldMagic({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 3
		});
		var effect4 = new spellEffects.shieldMagic({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 4
		});
		var effect5 = new spellEffects.shieldMagic({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 5
		});
		
		this.remove = function()
		{
			effect0.remove();
			effect1.remove();
			effect3.remove();
			effect4.remove();
			effect5.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}