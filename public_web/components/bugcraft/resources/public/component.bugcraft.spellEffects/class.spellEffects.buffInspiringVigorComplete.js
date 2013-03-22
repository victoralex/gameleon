
	spellEffects.buffInspiringVigorComplete = function( args )
	{
		var _iSpellEffects = args.targetCharacter._internal.spellEffects;
			
		for( var i in _iSpellEffects )
		{
			var spellEffectObject = _iSpellEffects[i].constructor;
			
			if( spellEffectObject != spellEffects.buffInspiringVigorComplete )
			{
				continue;
			}
			
			// effect needs to be removed
			
			_iSpellEffects[i].remove();
		}
	
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var effect0 = new spellEffects.buffInspiringVigor({ 			
				sourceCharacter: args.sourceCharacter,														
				targetCharacter: args.targetCharacter,
				component: 0
		});
		
		var effect1 = new spellEffects.buffInspiringVigor({ 																						
				sourceCharacter: args.sourceCharacter,
				targetCharacter: args.targetCharacter,
				component: 1
		});
		
		this.remove = function()
		{
			effect0.remove();
			effect1.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}