
	spellEffects.shieldWater = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 67;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 20000 - Component.bugcraft.latency;
		
		var self = this;
		
		var shieldWaterImageObject = new Image();
		shieldWaterImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shield/water_shield.png';
		
		var shieldWaterSound = soundManager.createSound({
				id: 'shieldWater' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/waterShield.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( shieldWaterSound ) - 1;
		
		soundManager.play( 'shieldWater' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});

		//draw the shieldWater
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.shadowOffsetX = 6;
			Map.ctx.shadowOffsetY = 6;
			//Map.ctx.shadowBlur    = 4;
			Map.ctx.shadowColor   = 'rgba(0, 0, 0, 0.75)';
			
			Map.ctx.drawImage(
											shieldWaterImageObject,
											- self.offsetX,
											- self.offsetY
										);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
	
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the shieldWater
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var _animateFunction =	function()
															{
																self.rotation += Math.PI / 32;

																setTimeout( _animateFunction, 30 );
															}			
		_animateFunction();
		
		setTimeout( function() 
								{ 
									var _t = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																		}, 200 );
								}, self.duration );
	} //end water shield