
	spellEffects.flagCapturedAnterium = function( args )
	{
		this.ID = spellEffects.layer[args.layer].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 60; //half the width of the image used to center the image on the position
		this.offsetY = 60; //half the height of the image
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 120; // greatest of the height or widht of the image
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX; // both previousX/Y used to erase the image form the canvas
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY; // substract more if you want to increase delete range on either x or y
		this.duration = 5000 - Component.bugcraft.latency;
		
		var self = this;
		
		var flagCapturedAnteriumImageObject = new Image();
		flagCapturedAnteriumImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/flagCapture/182_anteriumFlag' + args.component + '.png';
		
		//draw the flagCapturedAnterium
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											flagCapturedAnteriumImageObject,
											- self.offsetX,
											- self.offsetY
										);
	
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
	
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the flagCapturedAnterium
		this.remove = function()
		{
			clearTimeout( _animateFunctionPointer );
									
			var _t = setInterval( function()
												{
													self.alpha -= 0.1;
													
													if( self.alpha > 0 )
													{
														return;
													}
													
													spellEffects.layerCleaner.push( this );
													spellEffects.layer[args.layer][ this.ID ] = null;
													delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
													
													clearInterval( _t );
													
												}, 40 );
		}
		
		
		
		switch( args.component )
		{
			case 0:	
				//sound creation
				/*
				var flagCapturedAnteriumSound = soundManager.createSound({
						id: 'flagCapturedAnterium' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/aura/slowing time - magic.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( flagCapturedAnteriumSound ) - 1;
						
				//sound play				
				soundManager.play( 'flagCapturedAnterium' + spellEffects.soundIncrementor, 
												{
													onfinish: function () 
													{
														delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
													}
												});
				*/
				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.2;
																		}
																	
																		self.rotation -= Math.PI / 64;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}			
			break;
			case 1:
				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.2;
																		}
																		
																		self.rotation += Math.PI / 32;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}						
			break;
			case 2:
				var opacityVariation = 0;
		
				var _animateFunction =  function()
														{
															self.alpha = Math.abs( Math.sin( opacityVariation ) );

															opacityVariation += Math.PI / 32;
															
															if (self.alpha < 0.5 )
															{
																self.alpha = 0.5;
															}
															
															_animateFunctionPointer = setTimeout( _animateFunction, 50 );
														}					
			break;
		}
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
		
	} //end spinning aura