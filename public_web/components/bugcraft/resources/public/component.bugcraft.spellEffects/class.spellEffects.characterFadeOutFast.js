
	spellEffects.characterFadeOutFast = function( args )
	{
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		var self = this;
	
		this.remove = function()
		{
		
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		
		}
		
		var _iSpellEffects = args.targetCharacter._internal.spellEffects;
		
		for( var i in _iSpellEffects )
		{
			var spellEffectObject = _iSpellEffects[i].constructor;
			
			if(
				spellEffectObject != spellEffects.characterFadeIn
				&& spellEffectObject != spellEffects.characterFadeInLong
				&& spellEffectObject != spellEffects.characterFadeOut
				&& spellEffectObject != spellEffects.characterInvisibility
			)
			{
				continue;
			}
			
			// effect needs to be removed
			
			_iSpellEffects[i].remove();
		}
		
		var _animateFunction =	function()
															{
																if( args.targetCharacter.characterData.characterImageAlpha < 0.1 )
																{
																	args.targetCharacter.characterData.characterImageAlpha = 0;
																	
																	self.remove();
																	
																	return;
																}
	
																args.targetCharacter.characterData.characterImageAlpha -= 0.1;
	
																_animateFunctionPointer = setTimeout( _animateFunction, 20 );
															}			
			
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
		
		
	} //end spinning aura