
	spellEffects.shockwave = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var shockwaveImageObject = new Image();
		shockwaveImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shockwaves/shockwavesconc1.png';
		
		//draw the shockwave
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							shockwaveImageObject,
							args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
							args.targetCharacter.characterData.character_zone_y + self.offsetY + Map.viewPortY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
						
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the shockwaves
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
		}
		
		setTimeout( function()
							{
								shockwaveImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shockwaves/shockwavesconc2.png';
								
								setTimeout( function()
													{
														shockwaveImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shockwaves/shockwavesconc3.png';
														
														setTimeout( function()
																			{
																				shockwaveImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shockwaves/shockwavesconc4.png';
																				
																				setTimeout( function()
																									{
																										shockwaveImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/shockwaves/shockwavesconc5.png';
																										
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
																									}, 20 );
																			}, 20 );						
													}, 20 );
							}, 20 );
	} //end shockwave