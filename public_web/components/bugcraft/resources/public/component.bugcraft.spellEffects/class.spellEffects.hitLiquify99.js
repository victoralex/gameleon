
	spellEffects.hitLiquify99 = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 20;
		this.offsetY = 20;
		this.deleteRange = 40;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var hitLiquifyImageObject = new Image();
		hitLiquifyImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/liquify/liquify_hit0.png';
		
		var hitLiquifySound = soundManager.createSound({
				id: 'hitLiquify' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bolt/woosh.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( hitLiquifySound ) - 1;
		
		soundManager.play( 'hitLiquify' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the hitLiquify
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							hitLiquifyImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the hitLiquify
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		setTimeout( function()
							{
								hitLiquifyImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/liquify/liquify_hit1.png';
								
								setTimeout( function()
													{
														hitLiquifyImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/liquify/liquify_hit2.png';
														
														setTimeout( function()
																			{
																				hitLiquifyImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/liquify/liquify_hit3.png';
																	
																				var _t = setInterval( function()
																									{
																										self.alpha -= 0.1;
																										
																										if( self.alpha > 0 )
																										{
																											return;
																										}
																										
																										self.remove();
																										
																										clearInterval( _t );
																										
																									}, 40 );
																			}, 75 );						
													}, 75 );
							}, 75 );
	} //end hitLiquify