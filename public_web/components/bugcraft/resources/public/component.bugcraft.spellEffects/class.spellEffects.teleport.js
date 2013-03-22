
	spellEffects.teleport = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 60;
		this.offsetY = 60;
		this.rotation = 0;
		this.deleteRange = 120;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 1500;
		
		var self = this;
		
		var teleportImageObject = new Image();
		teleportImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/teleport/teleport' + args.component + '.png';
		
		var teleportSound = soundManager.createSound({
				id: 'teleport' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/magic/MAGIC.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( teleportSound ) - 1;
		
		//draw the teleport
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											teleportImageObject,
											- self.offsetX,
											- self.offsetY
										);
	
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
	
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the teleport
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		
		
		switch( args.component )
		{
			case 0:	
				self.alpha = 0;
				
				soundManager.play( 'teleport' + spellEffects.soundIncrementor, 
												{
													onfinish: function () 
													{
														delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
													}
												});
				
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.2;
																		}
																		
																		self.rotation += Math.PI / 32;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}
				
				var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
		
				setTimeout( function() 
										{ 
											clearTimeout( _animateFunctionPointer );
											
											var _t = setInterval( function()
																				{
																					self.alpha -= 0.1;
																					
																					if( self.alpha > 0 )
																					{
																						return;
																					}
																					
																					self.remove();
																					
																					clearInterval( _t );
																					
																				}, 40 );
										}, self.duration );
										
			break;
			case 1:
				setTimeout( function()
							{
								teleportImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/teleport/teleport2.png';
								
								setTimeout( function()
													{
														teleportImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/teleport/teleport3.png';
														
														setTimeout( function()
																			{
																				teleportImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/teleport/teleport4.png';
																				
																				setTimeout( function()
																									{
																										teleportImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/teleport/teleport5.png';
														
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
																										
																									}, 100 );
																			}, 100 );	
													}, 100 );
							}, 100 );	
			break;
		}
		
		
	} //end spinning aura