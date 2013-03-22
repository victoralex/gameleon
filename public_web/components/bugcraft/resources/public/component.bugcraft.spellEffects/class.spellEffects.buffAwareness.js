
	spellEffects.buffAwareness = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 60;
		this.offsetY = 60;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 120;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 2500 - Component.bugcraft.latency;
		
		var self = this;
		
		var buffAwarenessImageObject = new Image();
		buffAwarenessImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/awareness/awareness' + args.component + '.png';
		
		//draw the buffAwareness
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											buffAwarenessImageObject,
											- self.offsetX,
											- self.offsetY
										);
	
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
	
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffAwareness
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
				
				var buffAwarenessSound = soundManager.createSound({
						id: 'buffAwareness' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/buffs/cloak of magic - spell craft.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( buffAwarenessSound ) - 1;
				
				soundManager.play( 'buffAwareness' + spellEffects.soundIncrementor, 
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
																	
																		self.rotation -= Math.PI / 32;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}			
			break;
			case 1:
				self.alpha = 0;
				
				self.offsetX = 50;
				self.offsetY = 50;
				
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.2;
																		}
																		
																		self.rotation += Math.PI / 24;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}						
			break;
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
	} //end spinning aura