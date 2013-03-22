
	spellEffects.auraElectric = function( args )
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
		this.duration = 5000 - Component.bugcraft.latency;
		
		var self = this;
		
		var auraElectricImageObject = new Image();
		auraElectricImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/aura/electric/electric_surge01.png';
		
		var auraElectricSound = soundManager.createSound({
				id: 'auraElectric' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/electric/electric_sparks_part' + Math.floor( Math.random() * 4	) + '.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( auraElectricSound ) - 1;
		
		soundManager.play( 'auraElectric' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//
		//draw the auraElectric effect
		//
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							auraElectricImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the auraElectric effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var frame = 0;
		
		var _t = setInterval( function()
												{
													self.rotation += Math.PI / ( Math.floor( Math.random() * 64 ) + 1 );
													
													auraElectricImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/aura/electric/electric_surge0' + Math.floor( Math.random() * 6) + '.png';
												}, 50 )									
		
		setTimeout( function() 
								{ 
								
									var _timeout = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																			clearInterval( _timeout );
																			
																		}, 100 );
								}, self.duration );
	} //end auraElectric shockwave