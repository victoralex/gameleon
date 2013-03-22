
	spellEffects.footsteps = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		
		var footstepsImageObject = new Image();
		footstepsImageObject.src ='images/_characters/character1.png';
		
		var footstepsSound = soundManager.createSound({
				id: 'footsteps' + ( ++soundIncrementor ),
				url: 'sounds/_footsteps/steps_on_grass' + Math.floor( Math.random() * 5 )  + '.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		//footstepsSound.load();

		footstepsSound.play();
		
		
		//
		//draw the bolt effect
		//
		this.draw = function()
		{
		
			spellEffects.ctx.globalAlpha = self.alpha;

			spellEffects.ctx.drawImage(
											footstepsImageObject,
											args.x,
											args.y
										)
			
			spellEffects.ctx.globalAlpha = 1;

		}
		
		//remove the dust effect
		var self = this;
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}

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
													

												
												

		
	} //end footsteps