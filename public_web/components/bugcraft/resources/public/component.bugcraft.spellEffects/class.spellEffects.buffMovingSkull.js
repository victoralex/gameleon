
	spellEffects.buffMovingSkull = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 3500;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.stepDistance = 1;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var buffMovingSkullImageObject = new Image();
		buffMovingSkullImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/movingSkull/movingSkullpart' + args.component + '.png';
		
		var yMovement = 0;
		
		//draw the the buffMovingSkull
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.drawImage(
							buffMovingSkullImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX,
							args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffMovingSkull
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
				
				var buffMovingSkullSound = soundManager.createSound({
						id: 'buffMovingSkull' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/buffs/tavern door creaking.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffMovingSkullSound ) - 1;
				
				soundManager.play( 'buffMovingSkull' + spellEffects.soundIncrementor, 
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
															
															_fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 50 );
														}							

			break;
			case 1:
				self.alpha = 0;

				var opacityVariation = 0;
				
				var _fadeInOutFunction =  function()
														{
															self.alpha = Math.abs( Math.sin( opacityVariation ) );

															opacityVariation += Math.PI / 32;
															
															if (self.alpha < 0.5 )
															{
																self.alpha = 0.5;
															}
															
															_fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 50 );
														}							
				
				var movementVariation = 0
				
				var _animateFunction =	function()
													{
														yMovement = 3 * Math.abs( Math.sin( movementVariation ) );
														
														movementVariation += Math.PI /16;
														
														_animateFunctionPointer = setTimeout( _animateFunction, 50 );
													}			
						
				var _animateFunctionPointer = setTimeout( _animateFunction, 1 );		
				
			break;
		}
		
		var _fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 50 );
			
		var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
		
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
		
	} //end the buffMovingSkull