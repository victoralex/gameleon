
	spellEffects.shieldHoney = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 5000;
		
		var self = this;
		
		var shieldHoneyImageObject = new Image();
		shieldHoneyImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shield/honey_shield2.png';
		
		var shieldHoneySound = soundManager.createSound({
				id: 'shieldHoney' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/shield.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( shieldHoneySound ) - 1;
		
		soundManager.play( 'shieldHoney' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the shieldHoney
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											shieldHoneyImageObject,
											- self.offsetX,
											- self.offsetX
										);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX - 6;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY - 6;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
			
			
		}
		
		//remove the shieldHoney
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var opacityVariation = 3 * Math.PI / 2;
		
		var _animateFunction =  function()
												{

													self.alpha = Math.abs( Math.sin( opacityVariation ) );

													opacityVariation += Math.PI / 16;
													
													if (self.alpha < 0.5 )
													{
														self.alpha = 0.5;
													}
													
													_animateFunctionPointer = setTimeout( _animateFunction, 75 );
													
												}
						
		var _animateFunctionPointer = setTimeout( _animateFunction, 75 );				
		
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
	} //end shieldHoney