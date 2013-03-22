
	spellEffects.hitSpark = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 60;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var hitSparkImageObject = new Image();
		hitSparkImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/spark/hit_effect1.png';
		
		var hitSparkSound = soundManager.createSound({
				id: 'hitSpark' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/dirt2.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		/*
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( hitSparkSound ) - 1;
		
		soundManager.play( 'hitSpark' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		*/
		//draw the hitSpark
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							hitSparkImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the hitSpark
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		setTimeout( function()
							{
								hitSparkImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/spark/hit_effect2.png';
								
								setTimeout( function()
													{
														hitSparkImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/spark/hit_effect3.png';
																	
														var _t = setInterval( function()
																			{
																				self.alpha -= 0.1;
																				
																				if( self.alpha > 0 )
																				{
																					return;
																				}
																				
																				self.remove();
																				
																				clearInterval( _t );
																				
																			}, 60 );
													}, 90 );
							}, 90 );
	} //end hitSpark