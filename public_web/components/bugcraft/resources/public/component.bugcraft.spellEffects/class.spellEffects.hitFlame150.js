
	spellEffects.hitFlame150 = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.rotation = Math.random() * (Math.PI * 2);
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var flameHitImageObject = new Image();
		flameHitImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/blast/hit_flame0.png';
		
		var flameHitSound = soundManager.createSound({
				id: 'flameHit' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/magic/magic_impact.mp3', 
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( flameHitSound ) - 1;
		
		soundManager.play( 'flameHit' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the flameHit
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							flameHitImageObject,
							- self.offsetX,
							- self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the flameHit
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var i = 1; 
		var _animateFunction = function()
							{
								flameHitImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/blast/hit_flame' + i++ + '.png';
								
								if( i < 4 )
								{
									_animateFunctionPointer = setTimeout( _animateFunction, 90 );
									return;
								}
								
								i = 4
								
								var _t = setInterval( function()
													{
														self.alpha -= 0.075;
														
														if( self.alpha > 0 )
														{
															return;
														}
														
														self.remove();
														
														clearInterval( _t );
														
													}, 60 );
						
							}
		
	var _animateFunctionPointer = setTimeout( _animateFunction, 90 );		
	
	} //end flameHit