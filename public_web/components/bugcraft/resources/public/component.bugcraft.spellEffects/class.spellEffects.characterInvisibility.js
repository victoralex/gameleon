
	spellEffects.characterInvisibility = function( args )
	{
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		var invisibilitySoundObject = soundManager.createSound({
				id: 'auraElectric' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/invisibility/fadeOut.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( invisibilitySoundObject ) - 1;
		
		var self = this, _animateFunctionPointer = null;
	
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
				&& spellEffectObject != spellEffects.characterFadeOutFast
			)
			{
				continue;
			}
			
			// effect needs to be removed
			
			_iSpellEffects[i].remove();
		}
		
		args.targetCharacter.characterData.characterImageAlpha = 1;
		
		var _animateFunction = function()
		{
			if( args.targetCharacter.characterData.characterImageAlpha  < 0.5)
			{
				args.targetCharacter.characterData.characterImageAlpha = 0.5;
				
				self.remove();
				
				return;
			}

			args.targetCharacter.characterData.characterImageAlpha -= 0.1;

			_animateFunctionPointer = setTimeout( _animateFunction, 100 );
		}
		
		_animateFunction();
		
		
	} //end spinning aura