
	spellEffects.pulse = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 3000;
		
		
		var self = this;
		
		var pulseImageObject = new Image();
		pulseImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/resurrect/ress5.png';
		
		var pulseSound = soundManager.createSound({
				id: 'pulse' + ( ++spellEffects.soundIncrementor ),
				url: 'sounds/bolt/darkBolt1.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( pulseSound ) - 1;
		/*
		soundManager.play( 'pulse' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		*/
		
		//draw the pulse effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							pulseImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
							args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the low health effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var opacityVariation = 0;
		
		var _animateFunction =  function()
												{
													self.alpha = Math.abs( Math.sin( opacityVariation ) );

													opacityVariation += Math.PI / 32;
													
													if (self.alpha < 0.5 )
													{
														self.alpha = 0.5;
													}
													
													_animateFunctionPointer = setTimeout( _animateFunction, 40 );
												}							
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 40 );		
		
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
																			
																		}, 200 );
								}, self.duration );
		
	} //end pulse health