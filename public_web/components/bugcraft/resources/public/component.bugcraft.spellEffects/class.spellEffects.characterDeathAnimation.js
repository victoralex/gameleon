
	spellEffects.characterDeathAnimation = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var deathExplosion = new spellEffects.deathExplosion({ 																							
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter
		});
	
		var fade = new spellEffects.characterFadeOutFast({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter
		});
		
		setTimeout( function()
							{
								var death = new spellEffects.deathDecayComplete({ 			
										sourceCharacter: args.sourceCharacter,														
										targetCharacter: args.targetCharacter,
								});
							}, 100 );
		
		this.remove = function()
		{
			deathExplosion.remove();
			fade.remove();
			death.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}