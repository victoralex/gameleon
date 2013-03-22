
	spellEffects.pincer94 = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var pincerImageObject = new Image();
		pincerImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/other/pincer/pincer' + args.component + '.png';
		
		//draw the the pincer
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							pincerImageObject,
							- self.offsetX,
							- self.offsetY
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the pincer
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
			
		switch( args.component )
		{
			case 0:			
				var pincerSound = soundManager.createSound({
						id: 'pincer' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/punch/punch' + Math.floor( Math.random() * 3 ) + '.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( pincerSound ) - 1;
			
				soundManager.play( 'pincer' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});

				var _animateFunction =	function()
																	{
																		if( self.rotation > Math.PI / 4 )
																		{
																			self.rotation = Math.PI / 4;
																			
																			self.remove();
																			return;
																		}
																		
																		self.rotation += Math.PI / 32;

																		_animateFunctionPointer = setTimeout( _animateFunction, 40 );
																	}						
			break;
			case 1:
				
				var _animateFunction =	function()
																	{
																		if( self.rotation < - Math.PI / 4 )
																		{
																			self.rotation = - Math.PI / 4;
																			
																			self.remove();
																			return;
																		}
																		
																		self.rotation -= Math.PI / 32;

																		_animateFunctionPointer = setTimeout( _animateFunction, 40 );
																	}	
													
			break;
		}
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
		
	} //end the pincer