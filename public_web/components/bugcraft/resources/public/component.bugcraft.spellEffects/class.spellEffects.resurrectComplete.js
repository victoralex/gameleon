
	spellEffects.resurrectComplete = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		this.draw = function()
		{
			
		}
		
		var fade = new spellEffects.characterFadeInLong({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
				
		});
	
		var pulse = new spellEffects.pulse({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
		});
		
		var preResurrectSound = soundManager.createSound({
			id: 'preResurrect' + ( ++spellEffects.soundIncrementor ),
			url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/resurrect/res_part1.mp3',
			volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( preResurrectSound ) - 1;
		
		soundManager.play( 'preResurrect' + spellEffects.soundIncrementor, 
			{
				onfinish: function () 
				{
					var resurrect = new spellEffects.resurrect({ 
						sourceCharacter: args.sourceCharacter,
						targetCharacter: args.targetCharacter,
							
					});
					
					delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];
					
				}
			});
		
		this.remove = function()
		{
			fade.remove();
			pulse.remove();
			
			spellEffects.layer[1][ self.ID ] = null;
				
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}
	}