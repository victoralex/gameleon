
	spellEffects.webBottomV2 = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.alpha = 1;
		
		var webBottomV2ImageObject = new Image();
		webBottomV2ImageObject.src = 'images/debuff/web/web_effecttop.png';
		
		var webBottomV2Sound = soundManager.createSound({
				id: 'webBottomV2' + ( ++soundIncrementor ),
				url: 'sounds/aura/fortify.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		//webBottomV2Sound.play();

		//draw the webBottomV2
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate( args.x, args.y );
			
			spellEffects.ctx.rotate( args.rotation );
			
			spellEffects.ctx.drawImage(
											webBottomV2ImageObject,
											-40 ,
											-40
										);
										
			spellEffects.ctx.restore();
			
			spellEffects.ctx.globalAlpha = 1;
			
			
		}
		
		//remove the webBottomV2
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
		}

		var _animateFunction =	function()
															{
																args.rotation -= Math.PI / 64;

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
	} //end webBottomV2