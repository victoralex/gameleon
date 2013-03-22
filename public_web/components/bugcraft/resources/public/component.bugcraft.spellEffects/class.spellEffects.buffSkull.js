
	spellEffects.buffSkull = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 2500;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.stepDistance = 3;
		this.maxiumDistance = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var yMovement = 0;
		
		var buffSkullImageObject = new Image();
		buffSkullImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/skull/skullbuff' + args.component + '.png';
		
		//draw the the buffSkull
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.drawImage(
							buffSkullImageObject,
							args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
							args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY + yMovement
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffSkull
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
			
		switch( args.component )
		{
			case 0:		
				self.alpha = 0;	
				
				var buffSkullSound = soundManager.createSound({
						id: 'buffSkull' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/enrage/enrage1.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffSkullSound ) - 1;
				
				soundManager.play( 'buffSkull' + spellEffects.soundIncrementor, 
												{
													onfinish: function () 
													{
														delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
													}
												});

				var opacityVariation = 0;
				
				var _fadeInOutFunction =  function()
														{
															self.alpha = Math.abs( Math.sin( opacityVariation ) );

															opacityVariation += Math.PI / 32;
															
															if (self.alpha < 0.5 )
															{
																self.alpha = 0.5;
															}
															
															_fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 30 );
														}	
														
				var _fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 1 );
													
			break;
			case 1:
				
				self.offsetX = 25;
				self.offsetY = 85;
			
				var _animateFunction =	function()
													{
														
														yMovement += self.stepDistance;
														
														if( yMovement > 43 )
														{
															self.alpha -= 0.1;
															yMovement = 43;
														}
														
														if( self.alpha < 0 )
														{
															self.alpha = 0;
														
															return;
														}
														
														_animateFunctionPointer = setTimeout( _animateFunction, 40 );
													}
													
				var _animateFunctionPointer = setTimeout( _animateFunction, 1 );
				
			break;
		}
		
		setTimeout( function() 
								{ 
									
									clearTimeout( _fadeInOutFunctionPointer );
								
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
		
	} //end the buffSkull