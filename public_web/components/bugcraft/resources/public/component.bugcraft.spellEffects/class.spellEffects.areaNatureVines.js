
	spellEffects.areaNatureVines = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 2500;
		this.offsetX = 125;
		this.offsetY = 125;
		this.rotation = 0;
		this.deleteRange = 250;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var areaNatureVinesImageObject = new Image();
		areaNatureVinesImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/other/aura_nature_vines_purple.png';
		
		//draw the the areaNatureVines
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.drawImage(
							areaNatureVinesImageObject,
							args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
							args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
						);
										
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the areaNatureVines
		this.remove = function()
		{
			clearTimeout( _fadeInOutFunctionPointer );
			
			var _timeout = setInterval( function()
												{
													self.alpha -= 0.1;
													
													if( self.alpha > 0 )
													{
														return;
													}
													
													spellEffects.layerCleaner.push( this );
													spellEffects.layer[0][ this.ID ] = null;
													delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
													
													clearInterval( _timeout );
													
												}, 100 );
		}

		//self.alpha = 0;	
		
		var opacityVariation = 0;
		
		var _fadeInOutFunction =  function()
												{
													self.alpha = Math.abs( Math.sin( opacityVariation ) );

													opacityVariation += Math.PI / 32;
													
													if (self.alpha < 0.6 )
													{
														self.alpha = 0.6;
													}
													
													_fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 30 );
												}	
												
		//var _fadeInOutFunctionPointer = setTimeout( _fadeInOutFunction, 1 );
		
	} //end the areaNatureVines