
	spellEffects.buffShield31 = function( args )
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
		
		var self = this;
		
		var buffShieldImageObject = new Image();
		buffShieldImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffShield/buff_shield1.png';
		
		var buffShieldSound = soundManager.createSound({
				id: 'buffShield' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/punch/punch' + Math.floor( Math.random() * 3 ) + '.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffShieldSound ) - 1;
		
		soundManager.play( 'buffShield' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the buffShield
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							buffShieldImageObject,
							args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
							args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
						);
				
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
				
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffShield
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var i = 1;
		
		var _animateFunction =  function()
											{
												buffShieldImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/buffShield/buff_shield' + ( i++ % 6 ) + '.png';
												
												if( i < 5 )
												{
													_animateFunctionPointer = setTimeout( _animateFunction, 50 );
													
													return;
												}
												
												i = 5;
																					
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
		var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
																									
	} //end buffShield