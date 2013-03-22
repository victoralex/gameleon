
	spellEffects.auraStar9Complete = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var effect0 = new spellEffects.auraStar9({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 0
		});
		
		var effect1 = new spellEffects.auraStar9({ 																						
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter,
				component: 1
		});
		
		var effect2 = new spellEffects.auraStar9({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 2
		});
		
		this.remove = function()
		{
			effect0.remove();
			effect1.remove();
			effect2.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}