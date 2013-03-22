
	spellEffects.deathDecayComplete = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var animRotation = Math.random() * (Math.PI * 2);
	
		var effect4 = new spellEffects.deathDecay({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				rotation:animRotation,
				component: 4
		});
		var effect3 = new spellEffects.deathDecay({ 																							
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter,
				rotation:animRotation,
				component: 3
		});
		var effect2 = new spellEffects.deathDecay({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				rotation:animRotation,
				component: 2
		});
		var effect1 = new spellEffects.deathDecay({ 																							
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter,
				rotation:animRotation,
				component: 1
		});
		
		this.remove = function()
		{
			effect4.remove();
			effect3.remove();
			effect2.remove();
			effect1.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}