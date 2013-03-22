
	spellEffects.buffHealingOil = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 25;
		this.offsetY = 25;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 50;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var buffHealingOilImageObject = new Image();
		buffHealingOilImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/healingOil/healing oil0.png';
		
		var buffHealingOilSound = soundManager.createSound({
				id: 'buffHealingOil' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/water/waterDrop2.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffHealingOilSound ) - 1;
		
		soundManager.play( 'buffHealingOil' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the buffHealingOil
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.drawImage(
											buffHealingOilImageObject,
											args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
											args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
										);
										
			Map.ctx.shadowOffsetX = 5;
			Map.ctx.shadowOffsetY = 5;
			Map.ctx.shadowColor   = 'rgba(0, 0, 0, 0.75)';
		
			Map.ctx.restore();
		
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
		
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffHealingOil		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
			
		}
		
		var i = 0;
		
		var _animateFunction = function()
												{
													buffHealingOilImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/healingOil/healing oil' + i++ + '.png';
													
													if( i < 9 )
													{
														_animateFunctionPointer = setTimeout( _animateFunction, 50 );
														return;
													}
													
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
							
	} //end buffHealingOil