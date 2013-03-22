
	spellEffects.trapAmber = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - 43;
		this.previousY = args.targetCharacter.characterData.character_zone_y - 43;
		this.rotation = Math.random() * (Math.PI * 2);
		this.duration = 5000 - Component.bugcraft.latency;
		
		var self = this;
		
		var trapAmberImageObject = new Image();
		trapAmberImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/trap/amber/amber_trap0.png';
		
		var trapAmberSound = soundManager.createSound({
				id: 'trapAmber' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/trap/amber/cracks2.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( trapAmberSound ) - 1;
		
		soundManager.play( 'trapAmber' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the trapAmber
		this.draw = function()
		{
			
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							trapAmberImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - 43;
			self.previousY = args.targetCharacter.characterData.character_zone_y - 43;
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}

		//remove the trapAmber
		
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		setTimeout( function()
							{
								trapAmberImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/trap/amber/amber_trap1.png';
								
								setTimeout( function()
													{
														trapAmberImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/trap/amber/amber_trap2.png';
														
														setTimeout( function()
																			{
																				trapAmberImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/trap/amber/amber_trap3.png';
																				
																				setTimeout( function()
																									{
																										trapAmberImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/trap/amber/amber_trap4.png';
																										
																										setTimeout( function()
																																{
																																	var _t = setInterval( function()
																																						{
																																							self.alpha -= 0.02;
																																							
																																							if( self.alpha > 0 )
																																							{
																																								return;
																																							}
																																							
																																							self.remove();
																																							
																																							clearInterval( _t );
																																							
																																						}, 50 );
																																						
																																}, self.duration );
																									}, 170);
																			}, 170);
													}, 170);
							}, 170);					
	
	} //end trapAmber