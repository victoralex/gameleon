
	spellEffects.cracksGroundFire = function( args )
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
		
		var self = this;
		
		var groundFireImageObject = new Image();
		groundFireImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/cracks/groundFire/ground_fire_grow0.png';
		
		var groundFireSound = soundManager.createSound({
				id: 'groundFire' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/cracks/groundFire1.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( groundFireSound ) - 1;
		
		soundManager.play( 'groundFire' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		fixedX = args.targetCharacter.characterData.character_zone_x;
		fixedY = args.targetCharacter.characterData.character_zone_y;
		
		//draw the groundFire
		this.draw = function()
		{
			
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save()
			
			Map.ctx.translate( fixedX + Map.viewPortX, fixedY + Map.viewPortY);
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							groundFireImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = fixedX - self.offsetX;
			self.previousY = fixedY - self.offsetY;
						
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;

		}
		
		//remove the groundFire
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var i = 0;
		
		var _animate =  function()
							{
								groundFireImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/cracks/groundFire/ground_fire_grow' + ( i++ % 7 ) + '.png';

								if( i < 6 )
								{
									setTimeout( _animate, 120 );
									
									return;
								}
								
								i = 6;
								
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
							}
							
		_animate();
							
							
	} //end groundFire