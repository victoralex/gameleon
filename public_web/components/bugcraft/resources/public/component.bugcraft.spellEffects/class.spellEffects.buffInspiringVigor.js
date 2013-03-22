
	spellEffects.buffInspiringVigor = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 2000;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.stepDistance = 2;
		this.maximumDistance = -40;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var yMovement = 0;
		
		var buffInspiringVigorImageObject = new Image();
		buffInspiringVigorImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/inspiringVigor/inspiring_vigor' + args.component + '.png';
		
		
		
		//draw the the buffInspiringVigor
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							buffInspiringVigorImageObject,
							- self.offsetX,
							- self.offsetY + yMovement
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffInspiringVigor
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
			
			clearTimeout( _animateFunctionPointer );
			clearTimeout( _opacityVariatorPointer );
		}
			
		switch( args.component )
		{
			case 0:
				var buffInspiringVigorSound = soundManager.createSound({
						id: 'buffInspiringVigor' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/buffs/orchestral-scary-impact+ting-sha-bell.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffInspiringVigorSound ) - 1;
			
				soundManager.play( 'buffInspiringVigor' + spellEffects.soundIncrementor, 
												{
													onfinish: function () 
													{
														delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
													}
												});

				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.2;
																		}
																		
																		self.rotation += Math.PI / 32;

																		_animateFunctionPointer = setTimeout( _animateFunction, 40 );
																	}	
				
				var _opacityVariatorPointer = setTimeout(  function()
													{
													
													}, 500 );
				
			break;
			case 1:
				
				var _animateFunction =	function()
														{
															
															yMovement -= self.stepDistance;
															
															if( yMovement < self.maximumDistance )
															{
																yMovement = self.maximumDistance;
																
																clearTimeout( _opacityVariatorPointer );
																
																self.alpha -= 0.1;
																
																if( self.alpha < 0 )
																{
																	self.alpha = 0;
																
																	clearTimeout( _animateFunctionPointer );
																}
																
															}
															
															_animateFunctionPointer = setTimeout( _animateFunction, 40 );
														}
													
				var opacityVariation = 0;
				
				var _opacityVariator = function()
													{
														self.alpha = Math.abs( Math.sin( opacityVariation ) );

														opacityVariation += Math.PI / 16;
														
														if (self.alpha < 0.5 )
														{
															self.alpha = 0.5;
														}
														
														_opacityVariatorPointer = setTimeout( _opacityVariator, 40 );
													}
													
				var _opacityVariatorPointer = setTimeout( _opacityVariator, 10 );
											
			break;
		}
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
		
		setTimeout( function() 
								{ 
									clearTimeout( _animateFunctionPointer );
									clearTimeout( _opacityVariatorPointer );
									
									var _timeout = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _timeout );
																			
																		}, 60 );
								}, self.duration );
		
	} //end the buffInspiringVigor