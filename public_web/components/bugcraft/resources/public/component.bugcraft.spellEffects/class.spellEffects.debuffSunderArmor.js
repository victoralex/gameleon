
	spellEffects.debuffSunderArmor = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 1000 - Component.bugcraft.latency;
		
		var self = this;
		
		var debuffSunderArmorImageObject = new Image();
		debuffSunderArmorImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/debuffs/sunderArmor/sunder_armor0.png';
		
		var debuffSunderArmorSound = soundManager.createSound({
				id: 'debuffSunderArmor' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bolt/darkBolt1.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( debuffSunderArmorSound ) - 1;
		
		soundManager.play( 'debuffSunderArmor' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the debuffSunderArmor
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
				
			Map.ctx.drawImage(
											debuffSunderArmorImageObject,
											args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
											args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
										);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.globalAlpha = 1;
			
			
		}
		
		//remove the debuffSunderArmor
		
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var i = 0;

		var _animateFunction = function()
												{
													debuffSunderArmorImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/debuffs/sunderArmor/sunder_armor' + i++ + '.png';
													
													if( i < 5 )
													{
														_animateFunctionPointer = setTimeout( _animateFunction, 75 );
														return;
													}
													
													var _t = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																		}, 75 );
											
												}	
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
				
	} //end spinning aura