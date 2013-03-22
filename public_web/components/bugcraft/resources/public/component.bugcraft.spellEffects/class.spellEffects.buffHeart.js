
	spellEffects.buffHeart = function( args )
	{
		var _iSpellEffects = args.targetCharacter._internal.spellEffects;
			
		for( var i in _iSpellEffects )
		{
			var spellEffectObject = _iSpellEffects[i].constructor;
			
			if( spellEffectObject != spellEffects.buffHeart )
			{
				continue;
			}
			
			// effect needs to be removed
			
			_iSpellEffects[i].remove();
		}
	
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
		
		var buffHeartImageObject = new Image();
		buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff0.png';
		
		var buffHeartSound = soundManager.createSound({
				id: 'buffHeart' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/heartbeats/heartbeats.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffHeartSound ) - 1;
		
		soundManager.play( 'buffHeart' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the buffHeart
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
											buffHeartImageObject,
											args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
											args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
										);
		
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
		
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffHeart
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
			buffHeartSound.stop();
		}
		
		setTimeout( function()
							{
								buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff1.png';
								
								setTimeout( function()
													{
														buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff2.png';
														
														setTimeout( function()
																			{
																				buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff3.png';
																				
																				setTimeout( function()
																									{
																										buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff2.png';
																										
																										setTimeout( function()
																															{
																																buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff3.png';
																	
																																setTimeout( function()
																																					{
																																						buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff2.png';
																																						
																																						setTimeout( function()
																																											{
																																												buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff3.png';
																													
																																												setTimeout( function()
																																																	{
																																																		buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff2.png';
																																																		
																																																		setTimeout( function()
																																																							{
																																																								buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff3.png';
																																									
																																																								setTimeout( function()
																																																													{
																																																														buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff2.png';
																																																														
																																																														setTimeout( function()
																																																																			{
																																																																				buffHeartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffHeart/heart_buff3.png';
																																																					
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
																																																																			}, 100 );						
																																																													}, 850 );
																																																							}, 100 );						
																																																	}, 850 );
																																											}, 100 );						
																																					}, 850 );
																															}, 100 );						
																									}, 850 );
																			}, 75 );						
													}, 75 );
							}, 50 );
							
							
	} //end buffHeart