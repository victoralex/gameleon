
	spellEffects.healYellow = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 2000;
		this.offsetX = 60;
		this.offsetY = 60;
		this.rotation = 0;
		this.stepDistance = 2;
		this.maximumDistance = -40;
		this.deleteRange = 120;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var yMovement = 0;
		
		var healYellowImageObject = [];
		for ( var i = 0; i < 3; i++ )
		{
			healYellowImageObject[i] = new Image();
		}
		
		healYellowImageObject[0].src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/yellow/healYellow0.png';
		
		var healYellowSound = soundManager.createSound({
				id: 'healYellow' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/hit/metalClang.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( healYellowSound ) - 1;
		
		soundManager.play( 'healYellow' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the the healYellow
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											healYellowImageObject[0],
											- self.offsetX,
											- self.offsetY + yMovement
										);
			Map.ctx.drawImage(
											healYellowImageObject[1],
											- self.offsetX,
											- self.offsetY + yMovement
										);
			Map.ctx.drawImage(
											healYellowImageObject[2],
											- self.offsetX,
											- self.offsetY + yMovement
										);
	
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the healYellow
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
			
		setTimeout( function ()
							{
								healYellowImageObject[1].src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/yellow/healYellow1.png';
							}, 125 );
		
		setTimeout( function ()
							{
								healYellowImageObject[2].src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/yellow/healYellow2.png';
							}, 250 );
		
		var _animateFunction =	function()
												{
													
													yMovement -= self.stepDistance;
													
													if( yMovement < self.maximumDistance )
													{
														yMovement = self.maximumDistance;
														
														self.alpha -= 0.1;
														
														if( self.alpha < 0 )
														{
															self.alpha = 0;
														
															clearTimeout( _animateFunctionPointer );
														}
														
													}
													
													_animateFunctionPointer = setTimeout( _animateFunction, 40 );
												}
				
		var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
		
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
																			
																		}, 60 );
								}, self.duration );
		
	} //end the healYellow