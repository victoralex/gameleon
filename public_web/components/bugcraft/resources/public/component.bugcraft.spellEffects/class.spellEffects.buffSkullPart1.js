
	spellEffects.buffSkullPart1 = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		this.duration = 3500;
		this.offsetX = 30;
		this.offsetY = 60;
		this.rotation = 0;
		this.stepDistance = 2;
		this.maxiumDistance = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var buffSkullImageObject = new Image();
		buffSkullImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/buffs/skull/skullbuff1.png';
		
		var buffEnrageSound = soundManager.createSound({
				id: 'buffEnrage' + ( ++soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/enrage/enrage' + Math.floor( Math.random() * 2 ) + '.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		var yMovement = 0;
		
		//draw the the buffSkull
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.drawImage(
							buffSkullImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX,
							args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the buffSkull
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
		}
		
		var _animateFunction =	function()
											{
												
												yMovement += self.stepDistance;
												
												if( yMovement > 15 )
												{
													self.alpha -= 0.05;
												}
												
												if( self.alpha < 0 )
												{
													self.alpha = 0;
												
													self.remove();
													
													return;
												}
												
												_animateFunctionPointer = setTimeout( _animateFunction, 50 );
											}			
				
		var _animateFunctionPointer = setTimeout( _animateFunction, 50 );
		
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
																			
																			clearInterval( _timeout );
																			
																		}, 100 );
								}, self.duration );
		
	} //end the buffSkull