
	spellEffects.hitSplash = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var hitSplashImageObject = new Image();
		hitSplashImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/hit_splash1.png';
		
		var hitSplashSound = soundManager.createSound({
				id: 'hitSplash' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/splash/mud_splat.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		/*
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( hitSplashSound ) - 1;
		
		soundManager.play( 'hitSplash' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		*/
		//draw the hitSplash
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							hitSplashImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the hitSplash
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		setTimeout( function()
							{
								hitSplashImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/hit_splash1.png';
								
								setTimeout( function()
													{
														hitSplashImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/hit_splash3.png';
														
														setTimeout( function()
																			{
																				hitSplashImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/hit_splash4.png';
																				
																				setTimeout( function()
																									{
																										hitSplashImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/hit_splash5.png';

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
																									}, 50 );
																			}, 50 );						
													}, 50 );
							}, 50 );
	} //end hitSplash