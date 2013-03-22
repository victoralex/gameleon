	
	spellEffects.debrisMeat = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = Math.random() + 0.2;
		this.offsetX = 75;
		this.offsetY = 75;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 150;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 5000;
		
		var self = this;
		
		var debrisMeatImageObject = new Image();
		debrisMeatImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/debris/debris_meat.png';
		
		//draw the debrisMeat spatter
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( self.previousX + self.offsetX + Map.viewPortX, self.previousY + self.offsetY + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							debrisMeatImageObject,
							- self.offsetX,
							- self.offsetY
						);
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the debrisMeat
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
			
		}
		
		var _fadeOut =	function()
									{
										if( self.alpha < 0.1 )
										{
											self.alpha = 0;
											
											clearTimeout( _fadeOutPointer );
											
											self.remove();
											
											return;
										}
										
										self.alpha -= 0.05;

										_fadeOutPointer = setTimeout( _fadeOut, 220 );
									}	
		
		var _fadeOutPointer = setTimeout( _fadeOut, self.duration );
					
	} //end debrisMeat