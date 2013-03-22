
	spellEffects.hitStar31 = function( args )
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
		
		var hitStarImageObject = new Image();
		hitStarImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/hit_star1.png';
		
		var hitStarSound = soundManager.createSound({
				id: 'hitStar' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/debuffs/disappearing swoosh.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( hitStarSound ) - 1;
		
		soundManager.play( 'hitStar' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the hitStar
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							hitStarImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
							args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
		
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the hitStar
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		setTimeout( function()
							{
								hitStarImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/hit_star2.png';
								
								setTimeout( function()
													{
														hitStarImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/hit_star3.png';
														
														setTimeout( function()
																			{
																				hitStarImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/hit_star4.png';
																				
																				setTimeout( function()
																									{
																										hitStarImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/hit_star5.png';
																										
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
																									}, 70 );
																			}, 50 );						
													}, 50 );
							}, 50 );
	} //end hitStar