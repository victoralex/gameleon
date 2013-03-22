
	spellEffects.slashThunder = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.rotation = Math.random() * (Math.PI * 2);
		this.offsetX = 50;
		this.offsetY = 30;
		this.deleteRange = 100;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY - 20;
		
		var slashThunderImageObject = new Image();
		slashThunderImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/slash/thunder-slash1.png';
		
		var slashThunderSound = soundManager.createSound({
				id: 'slashThunder' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/electric/lightning strike.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( slashThunderSound ) - 1;
		
		soundManager.play( 'slashThunder' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the slashThunder effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											slashThunderImageObject,
											- self.offsetX,
											- self.offsetY
										);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY - 20;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the slashThunder effect
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		setTimeout( function()
							{
								slashThunderImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/slash/thunder-slash2.png';
								
								setTimeout( function()
													{
														slashThunderImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/slash/thunder-slash3.png';
														
														var _t = setInterval( function()
																			{
																				self.alpha -= 0.1;
																				
																				if( self.alpha > 0 )
																				{
																					return;
																				}
																				
																				self.remove();
																				
																				clearInterval( _t );
																				
																			}, 20 );
														
													}, 100 );
							}, 100 );
							
	} //end slashThunder effect