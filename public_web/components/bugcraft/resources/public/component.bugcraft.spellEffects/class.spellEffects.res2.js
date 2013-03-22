
	spellEffects.res2 = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.alpha = 1;
		
		var res2ImageObject = new Image();
		res2ImageObject.src = 'images/resurrect/ress1.png';
		
		var res2Sound = soundManager.createSound({
				id: 'res2' + ( ++soundIncrementor ),
				url: 'sounds/res2.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		//res2Sound.play();

		//draw the res2
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate( args.x, args.y );
			
			spellEffects.ctx.rotate( args.rotation );
			
			spellEffects.ctx.drawImage(
											res2ImageObject,
											-30 ,
											-30
										);
	
			spellEffects.ctx.restore();
			
			spellEffects.ctx.globalAlpha = 1;
			
			
		}
		
		//remove the res2
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
		}

		setTimeout( function()
							{
								res2ImageObject.src = 'images/resurrect/ress2.png';
								
								setTimeout( function()
													{
														res2ImageObject.src = 'images/resurrect/ress3.png';
														
														setTimeout( function()
																			{
																				res2ImageObject.src = 'images/resurrect/ress4.png';
																				
																				setTimeout( function()
																									{
																										res2ImageObject.src = 'images/resurrect/ress5.png';
																										
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
																									}, 100 );
																			}, 100 );						
													}, 100 );
							}, 100 );
	} //end spinning aura