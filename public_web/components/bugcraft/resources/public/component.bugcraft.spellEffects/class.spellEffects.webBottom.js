
	spellEffects.webBottom = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 40;
		this.offsetY = 40;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 80;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 10000 - Component.bugcraft.latency;
		
		var self = this;
		
		var webBottomImageObject = new Image();
		webBottomImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/debuffs/web/web_effectbkgrndVariant.png';
		
		var webBottomSound = soundManager.createSound({
				id: 'webBottom' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/aura/fortify.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( webBottomSound ) - 1;
		
		soundManager.play( 'webBottom' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});

		//draw the webBottom
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											webBottomImageObject,
											- self.offsetX,
											- self.offsetY
										);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
			
		}
		
		//remove the webBottom
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var _animateFunction =	function()
												{
													self.rotation -= Math.PI / 32;

													_animateFunctionPointer = setTimeout( _animateFunction, 40 );
												}
															
		var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
		
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
	} //end webBottom