
	spellEffects.webTop = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		
		var webTopImageObject = new Image();
		webTopImageObject.src = 'images/debuff/web/web_effecttopnew0.png';
		
		var webTopSound = soundManager.createSound({
				id: 'webTop' + ( ++soundIncrementor ),
				url: 'sounds/aura/fortify.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		//webTopSound.play();

		//draw the webTop
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate( args.x, args.y );
			
			spellEffects.ctx.rotate( args.rotation );
			
			spellEffects.ctx.drawImage(
											webTopImageObject,
											-35 ,
											-35
										);
										
			spellEffects.ctx.restore();
			
			spellEffects.ctx.globalAlpha = 1;
			
			
		}
		
		//remove the webTop
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
		}

		var _animateFunction =	function()
															{
																args.rotation += Math.PI / 32;

																setTimeout( _animateFunction, 30 );
															}			
		_animateFunction();
		
		setTimeout( function() 
								{ 
									var _t = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																		}, 200 );
								}, args.duration );
	} //end webTop