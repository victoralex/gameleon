
	spellEffects.shieldArc = function( args )
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
		this.duration = 5000;
		
		var self = this;
		
		var shieldArcImageObject = new Image();
		shieldArcImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shield/shield.png';
		
		var shieldArcSound = soundManager.createSound({
				id: 'shieldArc' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/shield.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( shieldArcSound ) - 1;
		
		soundManager.play( 'shieldArc' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});

		//draw the shieldArc
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.shadowOffsetX = 6;
			Map.ctx.shadowOffsetY = 6;
			Map.ctx.shadowColor   = 'rgba(0, 0, 0, 1)';
			
			Map.ctx.drawImage(
							shieldArcImageObject,
							- self.offsetX,
							- self.offsetX
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX - 6;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY - 6;			
			
			Map.ctx.restore();
						
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the shieldArc
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _animateFunction = function()
												{
													self.rotation += Math.PI / 16;

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
	} //end arc shield