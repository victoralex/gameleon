
	spellEffects.buffPolishShell = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 25;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var buffPolishShellImageObject = new Image();
		buffPolishShellImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/polishShell/polished_shell0.png';
		
		var buffPolishShellSound = soundManager.createSound({
				id: 'buffPolishShell' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/buffs/woosh fast.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffPolishShellSound ) - 1;
		
		soundManager.play( 'buffPolishShell' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the buffPolishShell
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
											buffPolishShellImageObject,
											args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
											args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
										);
							
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
		
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffPolishShell
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
													buffPolishShellImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/polishShell/polished_shell' + i++ + '.png';
													
													if( i < 4 )
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
							
	} //end waxShell