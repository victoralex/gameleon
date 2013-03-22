	
	spellEffects.heal = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 40;
		this.deleteRange = 60;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var healImageObject = new Image();
		healImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/heal_effect1.png';
		
		
		var healSound = soundManager.createSound({
				id: 'heal' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/heal/chimes' + Math.floor( Math.random() * 2 ) + '.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( healSound ) - 1;
		
		soundManager.play( 'heal' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the heal effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							healImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
							args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
						);
						
			self.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
			self.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the heal effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		setTimeout( function()
							{
								healImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/heal_effect2.png';
								self.offsetX+=Math.floor( Math.random() * 10 ) - Math.floor( Math.random() * 10);
								self.offsetY-=Math.floor( Math.random() * 10 ) - Math.floor( Math.random() * 10);
								
								setTimeout( function()
													{
														healImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/heal/heal_effect3.png';
														self.offsetX-=Math.floor( Math.random() * 10 ) - Math.floor( Math.random() * 10);
														self.offsetY+=Math.floor( Math.random() * 10 ) - Math.floor( Math.random() * 10);
														
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
							
	} //end heal