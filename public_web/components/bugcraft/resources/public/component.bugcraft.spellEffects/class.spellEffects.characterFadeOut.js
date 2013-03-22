
	spellEffects.characterFadeOut = function( args )
	{
		var self = this,
				_characterFadeOutFunctionPointer = null,
				_tc = args.targetCharacter,
				_tcd = _tc.characterData,
				_iSpellEffects = _tc._internal.spellEffects;
		
		this.characterSpellEffectID = _iSpellEffects.push( this ) - 1;
			
		this.remove = function()
		{
			clearTimeout( _characterFadeOutFunctionPointer );
			
			delete _iSpellEffects[ self.characterSpellEffectID ];
			
			args.after();
		}
		
		for( var i in _iSpellEffects )
		{
			var spellEffectObject = _iSpellEffects[i].constructor;
			
			if(
				spellEffectObject != spellEffects.characterFadeIn
				&& spellEffectObject != spellEffects.characterFadeInLong
				&& spellEffectObject != spellEffects.characterFadeOutFast
				&& spellEffectObject != spellEffects.characterInvisibility
			)
			{
				continue;
			}
			
			// effect needs to be removed
			
			_iSpellEffects[i].remove();
		}
		
		var _animateFunction = function()
		{
			if( _tcd.characterImageAlpha < 0.1 )
			{
				_tcd.characterImageAlpha = 0;
				
				self.remove();
				
				return;
			}
			
			_tcd.characterImageAlpha -= 0.1;

			_characterFadeOutFunctionPointer = setTimeout( _animateFunction, 100 );
		}
			
		_animateFunction();
	} //end spinning aura