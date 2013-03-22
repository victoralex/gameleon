
	spellEffects.pulseGlow = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 60;
		this.offsetY = 60;
		this.deleteRange = 120;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 5000;
		
		var self = this;
		
		var pulseGlowImageObject = new Image();
		pulseGlowImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/pulse/shockwaves_gettinglarger0.png';
		
		var pulseGlowSound = soundManager.createSound({
				id: 'pulseGlow' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bolt/darkBolt1.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( pulseGlowSound ) - 1;
		
		soundManager.play( 'pulseGlow' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the pulseGlow
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.drawImage(
											pulseGlowImageObject,
											- self.offsetX ,
											- self.offsetY
										);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
			
		}
		
		//remove the pulseGlow
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		
		
		self.alpha = 0;
		var _fadeIn =	function()
											{
												if( self.alpha > 0.9 )
												{
	
													return;
												}
												
												self.alpha += 0.2;
													
												setTimeout( _fadeIn, 50 );
											}
		_fadeIn();													
					
		var nextFrame = 0;
		var i  = 0;
		var _animateFunction =	function()	
															{
																nextFrame = i++ % 3;
															
																pulseGlowImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/pulse/shockwaves_gettinglarger' + nextFrame + '.png';

																_animateFunctionPointer = setTimeout( _animateFunction, 300 );
															}			

		var _animateFunctionPointer = setTimeout( _animateFunction, 300 );
		
		setTimeout( function() 
								{ 
									var _t = setInterval( function()
																		{
																			self.alpha -= 0.2;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																		}, 40 );
								}, self.duration );
	} //end spinning aura