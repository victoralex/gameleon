
	spellEffects.lvlUpFirstPart = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 2000;
		this.offsetX = 60;
		this.offsetY = 60;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 120;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		
		var self = this;
		
		var lvlUpFirstPartImageObject = new Image();
		lvlUpFirstPartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/lvlUp/2/firstPartFade' + args.component + '.png';
		
		if( args.component == 0 )
		{
			var lvlUpFirstPartSound = soundManager.createSound({
					id: 'lvlUpFirstPart' + ( ++spellEffects.soundIncrementor ),
					url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/lvlUp/game_win_ident_1.mp3',
					volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
			});
			
			this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( lvlUpFirstPartSound ) - 1;
		
			soundManager.play( 'lvlUpFirstPart' + spellEffects.soundIncrementor, 
											{
												onfinish: function () 
												{
													delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
												}
											});
			
		}

		//draw the lvl up first part effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;

			Map.ctx.drawImage(
											lvlUpFirstPartImageObject,
											args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
											args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
										);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the lvlUpFirstPart
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		self.alpha = 0;

		var _animateFunction =	function()
															{
																if( self.alpha > 1 )
																{
																	return;
																}
																
																self.alpha += 0.2;
																
																setTimeout( _animateFunction, 50 );
															}			
				
		_animateFunction();
		
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
	} //end the lvl up first part effect