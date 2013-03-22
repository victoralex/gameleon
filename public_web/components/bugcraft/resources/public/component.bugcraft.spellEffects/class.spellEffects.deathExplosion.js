	
	spellEffects.deathExplosion = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 35;
		this.offsetY = 35;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 70;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var deathExplosionImageObject = new Image();
		deathExplosionImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/deathAnimation/death_explode0.png';
		
		var deathExplosionSound = soundManager.createSound({
				id: 'deathExplosion' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/slash/slash_splat.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( deathExplosionSound ) - 1;
		
		soundManager.play( 'deathExplosion' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the deathExplosion spatter
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							deathExplosionImageObject,
							args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
							args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;	
					
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the deathExplosion
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		setTimeout( function()
							{
								deathExplosionImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/deathAnimation/death_explode1.png';
								
								setTimeout( function()
													{
														deathExplosionImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/deathAnimation/death_explode2.png';
														
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
														
													}, 75 );
							}, 75 );
							
	} //end deathExplosion