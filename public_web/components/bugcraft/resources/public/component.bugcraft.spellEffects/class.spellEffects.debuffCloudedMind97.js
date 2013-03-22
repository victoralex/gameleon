
	spellEffects.debuffCloudedMind97 = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 4000;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var effectPositionOffset = 0;
		
		var debuffCloudedMindImageObject = new Image();
		debuffCloudedMindImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/debuffs/cloudedMind/cloudmind' + args.component + '.png';
		
		//draw the the debuffCloudedMind
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY + effectPositionOffset );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							debuffCloudedMindImageObject,
							- self.offsetX,
							- self.offsetY
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + effectPositionOffset;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the debuffCloudedMind
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
			
		switch( args.component )
		{
			case 0:
				effectPositionOffset = -50;
				
				var debuffCloudedMindSound = soundManager.createSound({
						id: 'debuffCloudedMind' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/elements/fire_swoosh.mp3', 
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( debuffCloudedMindSound ) - 1;
				
				soundManager.play( 'debuffCloudedMind' + spellEffects.soundIncrementor, 
												{
													onfinish: function () 
													{
														delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
													}
												});

				self.alpha = 0;
				
				var _animateFunction =	function()
																	{
																		if( self.alpha < 0.9 )
																		{
																			self.alpha += 0.1;
																		}
																		
																		self.rotation -= Math.PI / 16;

																		_animateFunctionPointer = setTimeout( _animateFunction, 30 );
																	}						
			break;
			case 1:
				effectPositionOffset = -20;
			
				self.alpha = 0;

				var opacityVariation = 0;
				
				var _animateFunction =  function()
														{
															self.alpha = Math.abs( Math.sin( opacityVariation ) );

															opacityVariation += Math.PI / 32;
															
															if (self.alpha < 0.5 )
															{
																self.alpha = 0.5;
															}
															
															_animateFunctionPointer = setTimeout( _animateFunction, 50 );
														}							

			break;
		}
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 1 );
		
		setTimeout( function() 
								{ 
									clearTimeout( _animateFunctionPointer );
									
									var _timeout = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _timeout );
																			
																		}, 100 );
								}, self.duration );
		
	} //end the debuffCloudedMind