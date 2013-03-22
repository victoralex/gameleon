
	spellEffects.buffCleanse = function( args )
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
		this.duration = 5000 - Component.bugcraft.latency;
		
		var self = this;
		
		var buffCleanseImageObject = new Image();
		buffCleanseImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/cleanse/cleanse0.png';
		
		var buffCleanseSound = soundManager.createSound({
				id: 'buffCleanse' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/buffs/Science Fiction - Fiction Magical Swell Spell Digital Beeps 01.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffCleanseSound ) - 1;
		
		soundManager.play( 'buffCleanse' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the buffCleanse
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											buffCleanseImageObject,
											- self.offsetX,
											- self.offsetY
										);
	
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
	
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffCleanse
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var _animateFunction =	function()
															{
																if( self.alpha < 1 )
																{
																	self.alpha += 0.2;
																}
															
																self.rotation += Math.PI / 16;
																
																if ( self.rotation > ( Math.PI * 2 ) )
																{
																	clearTimeout( _animateFunctionPointer );
																		
																	self.rotation = 0;
																	
																	setTimeout( function()
																						{
																							buffCleanseImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/cleanse/cleanse1.png';
																							
																							setTimeout( function()
																												{
																													buffCleanseImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/cleanse/cleanse2.png';
																													
																													setTimeout( function()
																																		{
																																			buffCleanseImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/cleanse/cleanse3.png';

																																			var _t = setInterval( function()
																																								{
																																									self.alpha -= 0.1;
																																									
																																									if( self.alpha > 0 )
																																									{
																																										return;
																																									}
																																									
																																									self.remove();
																																									
																																									clearInterval( _t );
																																									
																																								}, 20 );
																																		}, 75 );
																												}, 75 );
																						}, 75 );
																}

																_animateFunctionPointer = setTimeout( _animateFunction, 30 );
															}	
															
		var _animateFunctionPointer = setTimeout( _animateFunction, 1 );
			
	} //end buffCleanse