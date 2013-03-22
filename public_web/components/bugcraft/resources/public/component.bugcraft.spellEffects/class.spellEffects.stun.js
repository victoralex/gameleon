
	spellEffects.stun = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 68;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.rotation = Math.random() * (Math.PI * 2);
		this.duration = 5000;
		
		var self = this;
		
		var stunImageObject = new Image();
		stunImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/stun.png';
		
		var stunSound = soundManager.createSound({
				id: 'waterShield' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/stun/sorcery - quick zip.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( stunSound ) - 1;
		
		soundManager.play( 'waterShield' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		var timeElapsed = 0;
		
		//draw the stun effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.shadowOffsetX = 7;
			Map.ctx.shadowOffsetY = 7;
			Map.ctx.shadowColor = 'rgba(0, 0, 0, 1)';
			
			Map.ctx.drawImage(
							stunImageObject,
							- self.offsetX,
							- self.offsetY
						);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.restore();
						
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the stun effect
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _animateFunction = function()
												{
													self.rotation += Math.PI / 32;

													_animateFunctionPointer = setTimeout( _animateFunction, 30 );
												}			
												
		var _animateFunctionPointer = setTimeout( _animateFunction, 30 );
		
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
																			
																		}, 100 );
								}, self.duration );
	} //end stun effect