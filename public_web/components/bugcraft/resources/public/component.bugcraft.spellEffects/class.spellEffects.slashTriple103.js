
	spellEffects.slashTriple103 = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.effectSounds = [];
		this.alpha = 1;
		this.rotation = Math.random() * (Math.PI * 2);
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var slashTripleImageObject = new Image();
		slashTripleImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/slash/triple/slash_triple_Red0.png';
		
		var slashTripleSound = soundManager.createSound({
				id: 'slashTriple' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/slash/swosh_0' + Math.floor( Math.random() * 9 ) + '.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( slashTripleSound ) - 1;
		
		soundManager.play( 'slashTriple' + spellEffects.soundIncrementor, 
										{	
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		var hitShineSound = soundManager.createSound({
				id: 'hitShine' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bolt/woosh.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( hitShineSound ) - 1;
		
		
		setTimeout( function() {
											soundManager.play( 'hitShine' + spellEffects.soundIncrementor, 
																			{
																				onfinish: function () 
																				{
																					delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
																				}
																			});
											}, 200);
				
		//draw the slashTriple effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							slashTripleImageObject,
							 - self.offsetX,
							 - self.offsetY
						);
			
			Map.ctx.restore();
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the slashTriple effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ self.characterSpellEffectID ];
		}

		setTimeout( function()
							{
								slashTripleImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/slash/triple/slash_triple_Red1.png';
								
								setTimeout( function()
													{
														slashTripleImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/slash/triple/slash_triple_Red2.png';
														
														var _t = setInterval( function()
																			{
																				self.alpha -= 0.1;
																				
																				if( self.alpha > 0 )
																				{
																					return;
																				}
																				
																				self.remove();
																				
																				clearInterval( _t );
																				
																			}, 30 );
														
													}, 50 );
							}, 50 );
							
	} //end slashTriple effect