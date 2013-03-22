spellEffects.resurrect = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var resurrectImageObject = new Image();
		resurrectImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/resurrect/resurrect0.png';
		
		var resurrectSound = soundManager.createSound({
				id: 'resurrect' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/resurrect/res_part2.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( resurrectSound ) - 1;
		
		soundManager.play( 'resurrect' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the resurrect spatter
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			Map.ctx.drawImage(
							resurrectImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
							args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
						);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;		
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the resurrect spatter
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		setTimeout( function()
							{
								resurrectImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/resurrect/resurrect1.png';
								
								setTimeout( function()
													{
														resurrectImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/resurrect/resurrect2.png';
														
														setTimeout( function()
																			{
																				resurrectImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/resurrect/resurrect3.png';
																				
																				setTimeout( function()
																									{
																										resurrectImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/resurrect/resurrect4.png';
																			
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
																										
																									}, 75 );
																			}, 75 );
													
													}, 75 );
							}, 75 );
							
	} //end resurrect spatter