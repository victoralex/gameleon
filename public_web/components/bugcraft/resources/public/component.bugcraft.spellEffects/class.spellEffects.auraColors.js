
	spellEffects.auraColors = function( args )
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
		this.duration = 15000 - Component.bugcraft.latency;
		
		var self = this;
		
		var auraColorsImageObject = new Image();
		auraColorsImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/aura/colors/colors0.png';
		
		var auraColorsSound = soundManager.createSound({
				id: 'auraColors' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/sound.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		/*this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( auraColorsSound ) - 1;
		
		soundManager.play( 'auraColors' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		*/
		//draw the auraColors
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							auraColorsImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.restore();
						
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the auraColors
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			clearTimeout( _spinColorsAuraPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var i = 0;
		
		var _animateFunction =  function()
															{
																auraColorsImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/aura/colors/colors' + ( i++ % 12 ) + '.png';

																_animateFunctionPointer = setTimeout( _animateFunction, 60 );
															}	
							
		var _spinColorsAura =	function()
															{
																self.rotation -= Math.PI / 25;
															
																_spinColorsAuraPointer = setTimeout( _spinColorsAura, 20 );
															}	
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 60 );
		var _spinColorsAuraPointer = setTimeout( _spinColorsAura, 20 );
		
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
														
													}, 60 );
						
							}, self.duration );
							
	} //end auraColors