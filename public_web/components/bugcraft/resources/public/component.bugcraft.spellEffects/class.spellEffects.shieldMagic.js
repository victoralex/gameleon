
	spellEffects.shieldMagic = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 40;
		this.offsetY = 40;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 80;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 12000 - Component.bugcraft.latency;
		
		var self = this;
		
		var shieldMagicImageObject = new Image();
		shieldMagicImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shield/magic/magic_shield' + args.component + '.png';
		
		//draw the shieldMagic
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( args.targetCharacter.characterData.character_zone_x + Map.viewPortX, args.targetCharacter.characterData.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
											shieldMagicImageObject,
											- self.offsetX,
											- self.offsetY
										);
	
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
	
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the shieldMagic
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		
		
		switch( args.component )
		{
			case 0:	
				self.alpha = 0;
				
				var shieldMagicSound = soundManager.createSound({
						id: 'shieldMagic' + ( ++spellEffects.soundIncrementor ),
						url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/heal/ELECTRONIC.mp3',
						volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
				});
				
				this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( shieldMagicSound ) - 1;
				
				soundManager.play( 'shieldMagic' + spellEffects.soundIncrementor, 
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
																			self.alpha += 0.1;
																		}
																		
																		self.rotation += Math.PI / 16;
			
																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}			
			break;
			case 1:
				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.1;
																		}
																		
																		self.rotation -= Math.PI / 16;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}						
			break;
			case 3:
				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.1;
																		}

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}						
			break;
			case 4:
				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.1;
																		}

																		self.rotation += Math.PI / 64;

																		_animateFunctionPointer = setTimeout( _animateFunction, 50 );
																	}						
			break;
			case 5:
				self.alpha = 0;
				var _animateFunction =	function()
																	{
																		if( self.alpha < 1 )
																		{
																			self.alpha += 0.1;
																		}

																		self.rotation -= Math.PI / 64;

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