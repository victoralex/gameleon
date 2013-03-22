
	spellEffects.hitVenomSting = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = Math.PI / 4;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var yMovement = 0;
		
		var hitVenomStingImageObject = new Image();
		hitVenomStingImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/hit/venom/venomsting.png';
		
		var hitVenomStingSound = soundManager.createSound({
				id: 'hitVenomSting' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/hit/vacuum_suction_whoosh.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( hitVenomStingSound ) - 1;
		
		soundManager.play( 'hitVenomSting' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the the hitVenomSting
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							hitVenomStingImageObject,
							- self.offsetX,
							- self.offsetY + yMovement
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the hitVenomSting
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			clearTimeout( _fadeInFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
			
		self.alpha = 0;
		var _fadeInFunction = function()
											{
												if( self.alpha < 1 )
												{
													self.alpha += 0.2;
													
													_fadeInFunctionPointer = setTimeout( _fadeInFunction, 30 );
													
													return;
												}
												
												var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
												
											}

		var _animateFunction =	function()
												{
													if( self.rotation < 0 )
													{
														self.rotation = 0;
														
														self.remove();
														return;
													}
													
													self.rotation -= Math.PI / 32;

													_animateFunctionPointer = setTimeout( _animateFunction, 30 );
												}						
		
		var _fadeInFunctionPointer = setTimeout( _fadeInFunction, 200 );
		
	} //end the hitVenomSting