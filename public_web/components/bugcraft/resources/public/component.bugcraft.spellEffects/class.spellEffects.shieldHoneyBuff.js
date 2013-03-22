
	spellEffects.shieldHoneyBuff = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.roation = 0;
		this.duration = 60000 - Component.bugcraft.latency;
		
		var self = this;
		
		var shieldHoneyBuffImageObject = new Image();
		shieldHoneyBuffImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shield/honeyBuff/honey_buff0.png';
		
		var shieldHoneyBuffSound = soundManager.createSound({
				id: 'shieldHoneyBuff' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/magic/magic_impact.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( shieldHoneyBuffSound ) - 1;
		
		soundManager.play( 'shieldHoneyBuff' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the shieldHoneyBuff
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							shieldHoneyBuffImageObject,
							- self.offsetX,
							- self.offsetY
						);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY; 
						
			Map.ctx.restore();
						
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the shieldHoneyBuff
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
							
		var _animateFunction =  function()
											{
												//self.rotation += Math.PI / 16;
												
												shieldHoneyBuffImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shield/honeyBuff/honey_buff' + Math.floor( Math.random() * 4 ) + '.png';
												
												_animateFunctionPointer = setTimeout( _animateFunction, 60 );
											}
		var _animateFunctionPointer = setTimeout( _animateFunction, 60 );
		
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
																			
																		}, 100 );
								}, self.duration );
	} //end shieldHoneyBuff